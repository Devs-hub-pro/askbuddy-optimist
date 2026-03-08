import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { demoExperts, demoQuestions } from '@/lib/demoData';
import {
  mapDemoQuestionsForSearch,
  mapDemoUsersForSearch,
  mergeUniqueById,
} from '@/lib/adapters/contentAdapters';

const isMissingRpcError = (error: unknown, functionName: string) => {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes(`public.${functionName}`) || message.includes('schema cache');
};

export interface SearchQuestion {
  id: string;
  title: string;
  content: string | null;
  category: string | null;
  tags: string[] | null;
  bounty_points: number;
  view_count: number;
  created_at: string;
  profile_nickname?: string | null;
  profile_avatar?: string | null;
  answers_count?: number;
}

export interface SearchTopic {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  category: string | null;
  discussions_count: number;
  participants_count: number;
}

export interface SearchUser {
  id: string;
  user_id: string;
  nickname: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export interface SearchResults {
  questions: SearchQuestion[];
  topics: SearchTopic[];
  users: SearchUser[];
}

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async (): Promise<SearchResults> => {
      if (!query.trim()) {
        return { questions: [], topics: [], users: [] };
      }

      const rpcResult = await (supabase as any).rpc('search_app_content', {
        p_query: query.trim(),
        p_limit: 10,
      });

      if (!rpcResult.error) {
        const payload = (rpcResult.data || {}) as Partial<SearchResults>;

        return {
          questions: (payload.questions || []) as SearchQuestion[],
          topics: (payload.topics || []) as SearchTopic[],
          users: (payload.users || []) as SearchUser[],
        };
      }

      if (!isMissingRpcError(rpcResult.error, 'search_app_content')) {
        throw rpcResult.error;
      }

      const trimmedQuery = query.trim();
      const normalizedQuery = trimmedQuery.toLowerCase();
      const searchTerm = `%${trimmedQuery}%`;

      const [questionsResult, topicsResult, usersResult] = await Promise.all([
        supabase
          .from('questions')
          .select('*')
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},tags::text.ilike.${searchTerm}`)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('hot_topics')
          .select('*')
          .eq('is_active', true)
          .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
          .order('discussions_count', { ascending: false })
          .limit(10),
        supabase
          .from('profiles')
          .select('id, user_id, nickname, avatar_url, bio')
          .or(`nickname.ilike.${searchTerm},bio.ilike.${searchTerm}`)
          .limit(10),
      ]);

      if (questionsResult.error) throw questionsResult.error;
      if (topicsResult.error) throw topicsResult.error;
      if (usersResult.error) throw usersResult.error;

      const questionsData = questionsResult.data || [];
      const topics = (topicsResult.data || []) as SearchTopic[];
      const users = (usersResult.data || []) as SearchUser[];

      if (questionsData.length === 0) {
        const demoMatchedQuestions = mapDemoQuestionsForSearch(demoQuestions, normalizedQuery) as SearchQuestion[];
        const demoMatchedUsers = mapDemoUsersForSearch(demoExperts, normalizedQuery) as SearchUser[];

        return {
          questions: demoMatchedQuestions,
          topics,
          users: users.length > 0 ? users : demoMatchedUsers,
        };
      }

      const userIds = Array.from(new Set(questionsData.map((item) => item.user_id)));
      const questionIds = questionsData.map((item) => item.id);

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

      const questions = questionsData.map((item) => ({
        ...item,
        profile_nickname: profileMap.get(item.user_id)?.nickname || '匿名用户',
        profile_avatar: profileMap.get(item.user_id)?.avatar_url,
        answers_count: answerCountMap.get(item.id) || 0,
      })) as SearchQuestion[];

      const demoMatchedQuestions = mapDemoQuestionsForSearch(demoQuestions, normalizedQuery) as SearchQuestion[];
      const mergedQuestions = mergeUniqueById(questions, demoMatchedQuestions);

      return {
        questions: mergedQuestions,
        topics,
        users,
      };
    },
    enabled: !!query.trim(),
    staleTime: 30_000,
  });
};

export const popularSearchTerms = [
  '考研', '留学', '求职', '简历', '面试',
  '论文', '英语', '健身',
];
