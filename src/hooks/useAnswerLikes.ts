import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Check if user has liked an answer
export const useHasLikedAnswer = (answerId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['answer-like', answerId, user?.id],
    queryFn: async () => {
      if (!user || !answerId) return false;

      const { data, error } = await supabase
        .from('answer_likes')
        .select('id')
        .eq('answer_id', answerId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!answerId
  });
};

// Get all liked answer IDs for current user (for a list of answers)
export const useUserLikedAnswers = (answerIds: string[]) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-liked-answers', user?.id, answerIds],
    queryFn: async () => {
      if (!user || answerIds.length === 0) return new Set<string>();

      const { data, error } = await supabase
        .from('answer_likes')
        .select('answer_id')
        .eq('user_id', user.id)
        .in('answer_id', answerIds);

      if (error) throw error;
      return new Set((data || []).map(item => item.answer_id));
    },
    enabled: !!user && answerIds.length > 0
  });
};

// Toggle like on an answer
export const useToggleAnswerLike = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ answerId, questionId }: { answerId: string; questionId: string }) => {
      if (!user) throw new Error('请先登录');

      // Check if already liked
      const { data: existing } = await supabase
        .from('answer_likes')
        .select('id')
        .eq('answer_id', answerId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Unlike
        const { error } = await supabase
          .from('answer_likes')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'unliked' as const };
      } else {
        // Like
        const { error } = await supabase
          .from('answer_likes')
          .insert({ answer_id: answerId, user_id: user.id });
        if (error) throw error;
        return { action: 'liked' as const };
      }
    },
    onSuccess: (result, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['answer-like', variables.answerId] });
      queryClient.invalidateQueries({ queryKey: ['user-liked-answers'] });
      queryClient.invalidateQueries({ queryKey: ['question', variables.questionId] });
      
      toast({
        title: result.action === 'liked' ? '已点赞' : '已取消点赞'
      });
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

// Get like count for an answer (real-time)
export const useAnswerLikeCount = (answerId: string) => {
  return useQuery({
    queryKey: ['answer-like-count', answerId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('answer_likes')
        .select('*', { count: 'exact', head: true })
        .eq('answer_id', answerId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!answerId
  });
};
