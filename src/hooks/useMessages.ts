import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string;
  read_at: string | null;
  created_at: string;
  // Joined data
  sender_nickname?: string | null;
  sender_avatar?: string | null;
  receiver_nickname?: string | null;
  receiver_avatar?: string | null;
}

export interface Conversation {
  partner_id: string;
  partner_nickname: string | null;
  partner_avatar: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_online?: boolean;
}

// Fetch all conversations for current user
export const useConversations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all messages where user is sender or receiver
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!messages || messages.length === 0) return [];

      // Group messages by conversation partner
      const conversationsMap = new Map<string, {
        messages: typeof messages;
        partner_id: string;
      }>();

      messages.forEach((msg) => {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        
        if (!conversationsMap.has(partnerId)) {
          conversationsMap.set(partnerId, {
            messages: [],
            partner_id: partnerId
          });
        }
        conversationsMap.get(partnerId)!.messages.push(msg);
      });

      // Fetch profiles for all partners
      const partnerIds = Array.from(conversationsMap.keys());
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, nickname, avatar_url')
        .in('user_id', partnerIds);

      const profilesMap = new Map(
        (profiles || []).map(p => [p.user_id, p])
      );

      // Build conversation list
      const conversations: Conversation[] = Array.from(conversationsMap.values()).map(conv => {
        const profile = profilesMap.get(conv.partner_id);
        const lastMessage = conv.messages[0]; // Already sorted by created_at desc
        const unreadCount = conv.messages.filter(
          m => m.receiver_id === user.id && !m.read_at
        ).length;

        return {
          partner_id: conv.partner_id,
          partner_nickname: profile?.nickname || '用户',
          partner_avatar: profile?.avatar_url || null,
          last_message: lastMessage.content,
          last_message_time: lastMessage.created_at,
          unread_count: unreadCount
        };
      });

      // Sort by last message time
      conversations.sort((a, b) => 
        new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
      );

      return conversations;
    },
    enabled: !!user
  });
};

// Fetch messages with a specific user
export const useMessagesWithUser = (partnerId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', user?.id, partnerId],
    queryFn: async () => {
      if (!user || !partnerId) return [];

      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, nickname, avatar_url')
        .in('user_id', [user.id, partnerId]);

      const profilesMap = new Map(
        (profiles || []).map(p => [p.user_id, p])
      );

      return (messages || []).map(msg => ({
        ...msg,
        sender_nickname: profilesMap.get(msg.sender_id)?.nickname || '用户',
        sender_avatar: profilesMap.get(msg.sender_id)?.avatar_url,
        receiver_nickname: profilesMap.get(msg.receiver_id)?.nickname || '用户',
        receiver_avatar: profilesMap.get(msg.receiver_id)?.avatar_url
      })) as Message[];
    },
    enabled: !!user && !!partnerId
  });

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user || !partnerId) return;

    const channel = supabase
      .channel(`messages-${user.id}-${partnerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id=eq.${user.id},receiver_id=eq.${partnerId}),and(sender_id=eq.${partnerId},receiver_id=eq.${user.id}))`
        },
        (payload) => {
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['messages', user.id, partnerId] });
          queryClient.invalidateQueries({ queryKey: ['conversations', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, partnerId, queryClient]);

  return query;
};

// Send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      receiver_id: string;
      content: string;
      message_type?: string;
    }) => {
      if (!user) throw new Error('请先登录');

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: data.receiver_id,
          content: data.content,
          message_type: data.message_type || 'text'
        })
        .select()
        .single();

      if (error) throw error;
      return message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id, variables.receiver_id] });
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: '发送失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Mark messages as read
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (senderId: string) => {
      if (!user) throw new Error('请先登录');

      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id)
        .is('read_at', null);

      if (error) throw error;
    },
    onSuccess: (_, senderId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id, senderId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-count', user?.id] });
    }
  });
};

// Delete a message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (messageId: string) => {
      if (!user) throw new Error('请先登录');

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
      toast({ title: '消息已删除' });
    },
    onError: (error: Error) => {
      toast({
        title: '删除失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Get unread message count
export const useUnreadMessageCount = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [count, setCount] = useState(0);

  const query = useQuery({
    queryKey: ['unread-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .is('read_at', null);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user
  });

  // Subscribe to realtime updates for unread count
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`unread-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['unread-count', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  useEffect(() => {
    if (query.data !== undefined) {
      setCount(query.data);
    }
  }, [query.data]);

  return { count, isLoading: query.isLoading };
};
