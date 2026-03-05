import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { demoExperts, demoQuestions, demoTopics } from '@/lib/demoData';

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

      const keyword = query.trim().toLowerCase();
      const matches = (...values: Array<string | null | undefined>) =>
        values.some((value) => value?.toLowerCase().includes(keyword));

      const demoFallback = (): SearchResults => ({
        questions: demoQuestions
          .filter((item) => matches(item.title, item.content, ...(item.tags || [])))
          .map((item) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            category: null,
            tags: item.tags,
            bounty_points: item.bounty_points,
            view_count: item.view_count,
            created_at: item.created_at,
            profile_nickname: item.profile_nickname,
            profile_avatar: item.profile_avatar,
            answers_count: item.answers_count,
          })),
        topics: demoTopics
          .filter((item) => matches(item.title, item.description, item.category))
          .map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            cover_image: item.cover_image,
            category: item.category,
            discussions_count: item.discussions_count,
            participants_count: item.participants_count,
          })),
        users: demoExperts
          .filter((item) => matches(item.nickname, item.title, item.bio, ...(item.tags || []), ...(item.keywords || [])))
          .map((item) => ({
            id: item.id,
            user_id: item.user_id,
            nickname: item.nickname || '测试达人',
            avatar_url: item.avatar_url,
            bio: item.bio,
          })),
      });

      const mergeResults = (
        primary: SearchResults,
        fallback: SearchResults
      ): SearchResults => {
        const mergeById = <T extends { id: string }>(first: T[], second: T[]) => {
          const seen = new Set<string>();
          const merged: T[] = [];

          [...first, ...second].forEach((item) => {
            if (seen.has(item.id)) return;
            seen.add(item.id);
            merged.push(item);
          });

          return merged;
        };

        return {
          questions: mergeById(primary.questions, fallback.questions),
          topics: mergeById(primary.topics, fallback.topics),
          users: mergeById(primary.users, fallback.users),
        };
      };

      const fallback = demoFallback();

      const rpcResult = await (supabase as any).rpc('search_app_content', {
        p_query: query.trim(),
        p_limit: 10,
      });

      if (!rpcResult.error) {
        const payload = (rpcResult.data || {}) as Partial<SearchResults>;
        const primary = {
          questions: (payload.questions || []) as SearchQuestion[],
          topics: (payload.topics || []) as SearchTopic[],
          users: (payload.users || []) as SearchUser[],
        };

        return mergeResults(primary, fallback);
      }

      if (!isMissingRpcError(rpcResult.error, 'search_app_content')) {
        return fallback;
      }

      const searchTerm = `%${query.trim()}%`;

      const [questionsResult, topicsResult, usersResult] = await Promise.all([
        supabase
          .from('questions')
          .select('*')
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
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

      if (questionsResult.error || topicsResult.error || usersResult.error) {
        return fallback;
      }

      const questionsData = questionsResult.data || [];
      if (questionsData.length === 0) {
        const primary = {
          questions: [],
          topics: (topicsResult.data || []) as SearchTopic[],
          users: (usersResult.data || []) as SearchUser[],
        };

        return mergeResults(primary, fallback);
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

      if (profilesResult.error || answersResult.error) {
        return fallback;
      }

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

      const primary = {
        questions,
        topics: (topicsResult.data || []) as SearchTopic[],
        users: (usersResult.data || []) as SearchUser[],
      };

      return mergeResults(primary, fallback);
    },
    enabled: !!query.trim(),
    staleTime: 30_000,
  });
};

export const popularSearchTerms = [
  '考研', '留学', '求职', '简历', '面试',
  '论文', '英语', '健身',
];
