import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const isMissingRpcError = (error: unknown, functionName: string) => {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes(`public.${functionName}`) || message.includes('schema cache');
};

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
  profile_nickname?: string | null;
  profile_avatar?: string | null;
}

export const useQuestions = (category?: string) => {
  return useQuery({
    queryKey: ['questions', category],
    queryFn: async () => {
      let query = (supabase as any)
        .from('questions')
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data: questions, error } = await query as any;
      if (error) throw error;
      if (!questions || questions.length === 0) return [];

      const userIds = Array.from(new Set((questions as any[]).map((question: any) => question.user_id))) as string[];
      const questionIds = (questions as any[]).map((question: any) => question.id) as string[];

      const [profilesResult, answersResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('user_id, nickname, avatar_url')
          .in('user_id', userIds),
        supabase
          .from('answers')
          .select('question_id')
          .in('question_id', questionIds),
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (answersResult.error) throw answersResult.error;

      const profileMap = new Map(
        (profilesResult.data || []).map((profile) => [profile.user_id, profile])
      );
      const answerCountMap = new Map<string, number>();

      (answersResult.data || []).forEach((answer) => {
        answerCountMap.set(answer.question_id, (answerCountMap.get(answer.question_id) || 0) + 1);
      });

      return questions.map((question) => {
        const profile = profileMap.get(question.user_id);
        return {
          ...question,
          profile_nickname: profile?.nickname || '匿名用户',
          profile_avatar: profile?.avatar_url,
          answers_count: answerCountMap.get(question.id) || 0,
        } as Question;
      });
    },
  });
};

export const useQuestionDetail = (questionId: string) => {
  return useQuery({
    queryKey: ['question', questionId],
    queryFn: async () => {
      const { data: question, error: questionError } = await (supabase as any)
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .eq('is_hidden', false)
        .maybeSingle();

      if (questionError) throw questionError;
      if (!question) throw new Error('问题不存在');

      await supabase
        .from('questions')
        .update({ view_count: (question.view_count || 0) + 1 })
        .eq('id', questionId);

      const { data: answers, error: answersError } = await (supabase as any)
        .from('answers')
        .select('*')
        .eq('question_id', questionId)
        .eq('is_hidden', false)
        .order('is_accepted', { ascending: false })
        .order('likes_count', { ascending: false })
        .order('created_at', { ascending: true });

      if (answersError) throw answersError;

      const allUserIds = Array.from(
        new Set([question.user_id, ...(answers || []).map((answer) => answer.user_id)])
      );

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, nickname, avatar_url')
        .in('user_id', allUserIds);

      if (profilesError) throw profilesError;

      const profileMap = new Map(
        (profiles || []).map((profile) => [profile.user_id, profile])
      );

      const answersWithProfiles = (answers || []).map((answer) => ({
        ...answer,
        profile_nickname: profileMap.get(answer.user_id)?.nickname || '匿名用户',
        profile_avatar: profileMap.get(answer.user_id)?.avatar_url,
      })) as Answer[];

      return {
        question: {
          ...question,
          profile_nickname: profileMap.get(question.user_id)?.nickname || '匿名用户',
          profile_avatar: profileMap.get(question.user_id)?.avatar_url,
          answers_count: answersWithProfiles.length,
          view_count: (question.view_count || 0) + 1,
        } as Question,
        answers: answersWithProfiles,
      };
    },
    enabled: !!questionId,
  });
};

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

      const rpcResult = await (supabase as any).rpc('create_question_secure', {
        p_title: data.title,
        p_content: data.content || null,
        p_category: data.category || null,
        p_tags: data.tags || null,
        p_bounty_points: data.bounty_points || 0,
      });

      if (!rpcResult.error) {
        return rpcResult.data as string;
      }

      if (!isMissingRpcError(rpcResult.error, 'create_question_secure')) {
        throw rpcResult.error;
      }

      const { data: question, error } = await supabase
        .from('questions')
        .insert({
          title: data.title,
          content: data.content || null,
          category: data.category || null,
          tags: data.tags || null,
          bounty_points: data.bounty_points || 0,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return question.id as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: '发布成功', description: '您的问题已发布，等待回答' });
    },
    onError: (error: Error) => {
      toast({
        title: '发布失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

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

      const rpcResult = await (supabase as any).rpc('create_answer_secure', {
        p_question_id: data.question_id,
        p_content: data.content,
      });

      if (!rpcResult.error) {
        return rpcResult.data as string;
      }

      if (!isMissingRpcError(rpcResult.error, 'create_answer_secure')) {
        throw rpcResult.error;
      }

      const { data: answer, error } = await supabase
        .from('answers')
        .insert({
          question_id: data.question_id,
          content: data.content,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return answer.id as string;
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
        variant: 'destructive',
      });
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (questionId: string) => {
      if (!user) throw new Error('请先登录');

      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('question_id', questionId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'removed' as const };
      }

      const { error } = await supabase
        .from('favorites')
        .insert({ question_id: questionId, user_id: user.id });
      if (error) throw error;
      return { action: 'added' as const };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: result.action === 'added' ? '已收藏' : '已取消收藏',
      });
    },
    onError: (error: Error) => {
      toast({
        title: '操作失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
