import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const isMissingRpcError = (error: unknown, functionName: string) => {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes(`public.${functionName}`) || message.includes('schema cache');
};

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string | null;
  related_id: string | null;
  related_type: string | null;
  sender_id: string | null;
  is_read: boolean;
  created_at: string;
  sender_nickname?: string | null;
  sender_avatar?: string | null;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      if (!data || data.length === 0) return [];

      const senderIds = Array.from(
        new Set(
          data
            .map((item) => item.sender_id)
            .filter((senderId): senderId is string => Boolean(senderId))
        )
      );

      const profiles = senderIds.length > 0
        ? await supabase
            .from('profiles')
            .select('user_id, nickname, avatar_url')
            .in('user_id', senderIds)
        : { data: [], error: null };

      if (profiles.error) throw profiles.error;

      const profileMap = new Map(
        (profiles.data || []).map((profile) => [profile.user_id, profile])
      );

      return data.map((notification) => ({
        ...notification,
        sender_nickname: notification.sender_id ? profileMap.get(notification.sender_id)?.nickname || null : null,
        sender_avatar: notification.sender_id ? profileMap.get(notification.sender_id)?.avatar_url || null : null,
      }));
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
          queryClient.invalidateQueries({ queryKey: ['notifications-unread-count', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user]);

  return query;
};

export const useUnreadCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications-unread-count', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const rpcResult = await supabase.rpc('mark_notifications_read', {
        p_notification_ids: [notificationId],
      });

      if (!rpcResult.error) return rpcResult.data;

      if (!isMissingRpcError(rpcResult.error, 'mark_notifications_read')) {
        throw rpcResult.error;
      }

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id || '');

      if (error) throw error;
      return 1;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count', user?.id] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const rpcResult = await supabase.rpc('mark_notifications_read', {
        p_notification_ids: null,
      });

      if (!rpcResult.error) return rpcResult.data;

      if (!isMissingRpcError(rpcResult.error, 'mark_notifications_read')) {
        throw rpcResult.error;
      }

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id || '')
        .eq('is_read', false);

      if (error) throw error;
      return 1;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count', user?.id] });
    },
  });
};
