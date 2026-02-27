import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useIsFollowingTopic = (topicId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['topic-following', topicId, user?.id],
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from('topic_followers')
        .select('id')
        .eq('topic_id', topicId)
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!topicId,
  });
};

export const useToggleTopicFollow = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (topicId: string) => {
      if (!user) throw new Error('Not authenticated');

      // Check if already following
      const { data: existing } = await supabase
        .from('topic_followers')
        .select('id')
        .eq('topic_id', topicId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('topic_followers')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return false; // unfollowed
      } else {
        const { error } = await supabase
          .from('topic_followers')
          .insert({ topic_id: topicId, user_id: user.id });
        if (error) throw error;
        return true; // followed
      }
    },
    onSuccess: (_, topicId) => {
      queryClient.invalidateQueries({ queryKey: ['topic-following', topicId] });
      queryClient.invalidateQueries({ queryKey: ['topic-detail', topicId] });
      queryClient.invalidateQueries({ queryKey: ['hotTopics'] });
    },
  });
};
