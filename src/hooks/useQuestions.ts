import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Question {
  id: string;
  title: string;
  content: string | null;
  category: string | null;
  tags: string[] | null;
  bounty_points: number;
  status: string;
  view_count: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profile_nickname?: string | null;
  profile_avatar?: string | null;
  answers_count?: number;
}

export interface Answer {
  id: string;
  content: string;
  question_id: string;
  user_id: string;
  is_accepted: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  profile_nickname?: string | null;
  profile_avatar?: string | null;
}

// Fetch all questions
export const useQuestions = (category?: string) => {
  return useQuery({
    queryKey: ['questions', category],
    queryFn: async () => {
      let query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data: questions, error } = await query;

      if (error) throw error;

      // Get profiles and answers count for each question
      const questionsWithData = await Promise.all(
        (questions || []).map(async (question) => {
          // Get profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('nickname, avatar_url')
            .eq('user_id', question.user_id)
            .maybeSingle();
          
          // Get answers count
          const { count } = await supabase
            .from('answers')
            .select('*', { count: 'exact', head: true })
            .eq('question_id', question.id);
          
          return {
            ...question,
            profile_nickname: profile?.nickname || '匿名用户',
            profile_avatar: profile?.avatar_url,
            answers_count: count || 0
          } as Question;
        })
      );

      return questionsWithData;
    }
  });
};

// Fetch single question with answers
export const useQuestionDetail = (questionId: string) => {
  return useQuery({
    queryKey: ['question', questionId],
    queryFn: async () => {
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .maybeSingle();

      if (questionError) throw questionError;
      if (!question) throw new Error('问题不存在');

      // Get question author profile
      const { data: questionProfile } = await supabase
        .from('profiles')
        .select('nickname, avatar_url')
        .eq('user_id', question.user_id)
        .maybeSingle();

      // Increment view count
      await supabase
        .from('questions')
        .update({ view_count: (question.view_count || 0) + 1 })
        .eq('id', questionId);

      const { data: answers, error: answersError } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', questionId)
        .order('is_accepted', { ascending: false })
        .order('likes_count', { ascending: false })
        .order('created_at', { ascending: true });

      if (answersError) throw answersError;

      // Get profiles for all answers
      const answersWithProfiles = await Promise.all(
        (answers || []).map(async (answer) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('nickname, avatar_url')
            .eq('user_id', answer.user_id)
            .maybeSingle();
          
          return {
            ...answer,
            profile_nickname: profile?.nickname || '匿名用户',
            profile_avatar: profile?.avatar_url
          } as Answer;
        })
      );

      return {
        question: {
          ...question,
          profile_nickname: questionProfile?.nickname || '匿名用户',
          profile_avatar: questionProfile?.avatar_url,
          answers_count: answersWithProfiles.length
        } as Question,
        answers: answersWithProfiles
      };
    },
    enabled: !!questionId
  });
};

// Create a new question
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      content?: string;
      category?: string;
      tags?: string[];
      bounty_points?: number;
    }) => {
      if (!user) throw new Error('请先登录');

      const { data: question, error } = await supabase
        .from('questions')
        .insert({
          title: data.title,
          content: data.content || null,
          category: data.category || null,
          tags: data.tags || null,
          bounty_points: data.bounty_points || 0,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: '发布成功', description: '您的问题已发布，等待回答' });
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

// Create a new answer
export const useCreateAnswer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      question_id: string;
      content: string;
    }) => {
      if (!user) throw new Error('请先登录');

      const { data: answer, error } = await supabase
        .from('answers')
        .insert({
          question_id: data.question_id,
          content: data.content,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return answer;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['question', variables.question_id] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: '回答成功', description: '感谢您的回答！' });
    },
    onError: (error: Error) => {
      toast({ 
        title: '回答失败', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Toggle favorite
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (questionId: string) => {
      if (!user) throw new Error('请先登录');

      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('question_id', questionId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add favorite
        const { error } = await supabase
          .from('favorites')
          .insert({ question_id: questionId, user_id: user.id });
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({ 
        title: result.action === 'added' ? '已收藏' : '已取消收藏' 
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
