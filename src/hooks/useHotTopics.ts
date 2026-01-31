import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface HotTopic {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  category: string | null;
  created_by: string;
  is_active: boolean;
  participants_count: number;
  discussions_count: number;
  created_at: string;
  updated_at: string;
}

export interface TopicDiscussion {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  profile_nickname?: string | null;
  profile_avatar?: string | null;
  is_liked?: boolean;
}

// Check if user is admin
export const useIsAdmin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) return false;
      return !!data;
    },
    enabled: !!user
  });
};

// Fetch all active hot topics
export const useHotTopics = () => {
  return useQuery({
    queryKey: ['hot-topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hot_topics')
        .select('*')
        .eq('is_active', true)
        .order('discussions_count', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HotTopic[];
    }
  });
};

// Fetch single topic with discussions
export const useTopicDetail = (topicId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['topic', topicId, user?.id],
    queryFn: async () => {
      // Get topic
      const { data: topic, error: topicError } = await supabase
        .from('hot_topics')
        .select('*')
        .eq('id', topicId)
        .maybeSingle();

      if (topicError) throw topicError;
      if (!topic) throw new Error('话题不存在');

      // Get discussions
      const { data: discussions, error: discussionsError } = await supabase
        .from('topic_discussions')
        .select('*')
        .eq('topic_id', topicId)
        .order('likes_count', { ascending: false })
        .order('created_at', { ascending: false });

      if (discussionsError) throw discussionsError;

      // Get profiles for discussions
      const userIds = [...new Set((discussions || []).map(d => d.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, nickname, avatar_url')
        .in('user_id', userIds);

      const profilesMap = new Map(
        (profiles || []).map(p => [p.user_id, p])
      );

      // Get user's likes
      let userLikes = new Set<string>();
      if (user) {
        const discussionIds = (discussions || []).map(d => d.id);
        if (discussionIds.length > 0) {
          const { data: likes } = await supabase
            .from('discussion_likes')
            .select('discussion_id')
            .eq('user_id', user.id)
            .in('discussion_id', discussionIds);
          userLikes = new Set((likes || []).map(l => l.discussion_id));
        }
      }

      const discussionsWithProfiles: TopicDiscussion[] = (discussions || []).map(d => ({
        ...d,
        profile_nickname: profilesMap.get(d.user_id)?.nickname || '匿名用户',
        profile_avatar: profilesMap.get(d.user_id)?.avatar_url,
        is_liked: userLikes.has(d.id)
      }));

      return {
        topic: topic as HotTopic,
        discussions: discussionsWithProfiles
      };
    },
    enabled: !!topicId
  });
};

// Create a discussion
export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { topic_id: string; content: string }) => {
      if (!user) throw new Error('请先登录');

      const { data: discussion, error } = await supabase
        .from('topic_discussions')
        .insert({
          topic_id: data.topic_id,
          user_id: user.id,
          content: data.content
        })
        .select()
        .single();

      if (error) throw error;
      return discussion;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['topic', variables.topic_id] });
      queryClient.invalidateQueries({ queryKey: ['hot-topics'] });
      toast({ title: '发布成功', description: '您的讨论已发布' });
    },
    onError: (error: Error) => {
      toast({
        title: '发布失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Toggle like on a discussion
export const useToggleDiscussionLike = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ discussionId, topicId }: { discussionId: string; topicId: string }) => {
      if (!user) throw new Error('请先登录');

      // Check if already liked
      const { data: existing } = await supabase
        .from('discussion_likes')
        .select('id')
        .eq('discussion_id', discussionId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Unlike
        const { error } = await supabase
          .from('discussion_likes')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'unliked' as const };
      } else {
        // Like
        const { error } = await supabase
          .from('discussion_likes')
          .insert({ discussion_id: discussionId, user_id: user.id });
        if (error) throw error;
        return { action: 'liked' as const };
      }
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['topic', variables.topicId] });
    },
    onError: (error: Error) => {
      toast({
        title: '操作失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Delete a discussion
export const useDeleteDiscussion = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ discussionId, topicId }: { discussionId: string; topicId: string }) => {
      if (!user) throw new Error('请先登录');

      const { error } = await supabase
        .from('topic_discussions')
        .delete()
        .eq('id', discussionId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['topic', variables.topicId] });
      queryClient.invalidateQueries({ queryKey: ['hot-topics'] });
      toast({ title: '已删除' });
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

// Admin: Create a hot topic
export const useCreateHotTopic = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      cover_image?: string;
      category?: string;
    }) => {
      if (!user) throw new Error('请先登录');

      const { data: topic, error } = await supabase
        .from('hot_topics')
        .insert({
          title: data.title,
          description: data.description || null,
          cover_image: data.cover_image || null,
          category: data.category || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return topic;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hot-topics'] });
      toast({ title: '话题创建成功' });
    },
    onError: (error: Error) => {
      toast({
        title: '创建失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};
