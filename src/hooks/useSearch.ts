import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

      const searchTerm = `%${query.trim()}%`;

      // Run all three searches in parallel
      const [questionsResult, topicsResult, usersResult] = await Promise.all([
        // Search questions by title, content, tags
        supabase
          .from('questions')
          .select('*')
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
          .order('created_at', { ascending: false })
          .limit(20),

        // Search hot topics by title, description
        supabase
          .from('hot_topics')
          .select('*')
          .eq('is_active', true)
          .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
          .order('discussions_count', { ascending: false })
          .limit(10),

        // Search users/profiles by nickname, bio
        supabase
          .from('profiles')
          .select('id, user_id, nickname, avatar_url, bio')
          .or(`nickname.ilike.${searchTerm},bio.ilike.${searchTerm}`)
          .limit(10),
      ]);

      if (questionsResult.error) throw questionsResult.error;
      if (topicsResult.error) throw topicsResult.error;
      if (usersResult.error) throw usersResult.error;

      // Enrich questions with profiles and answer counts
      const questions: SearchQuestion[] = await Promise.all(
        (questionsResult.data || []).map(async (q) => {
          const [profileRes, countRes] = await Promise.all([
            supabase
              .from('profiles')
              .select('nickname, avatar_url')
              .eq('user_id', q.user_id)
              .maybeSingle(),
            supabase
              .from('answers')
              .select('*', { count: 'exact', head: true })
              .eq('question_id', q.id),
          ]);

          return {
            ...q,
            profile_nickname: profileRes.data?.nickname || '匿名用户',
            profile_avatar: profileRes.data?.avatar_url,
            answers_count: countRes.count || 0,
          };
        })
      );

      // Also search questions by tag match (client-side filter for array contains)
      const tagQuestions = questionsResult.data?.filter(
        (q) =>
          q.tags?.some((tag: string) =>
            tag.toLowerCase().includes(query.trim().toLowerCase())
          ) && !questions.find((existing) => existing.id === q.id)
      );

      if (tagQuestions && tagQuestions.length > 0) {
        const extraQuestions = await Promise.all(
          tagQuestions.map(async (q) => {
            const [profileRes, countRes] = await Promise.all([
              supabase
                .from('profiles')
                .select('nickname, avatar_url')
                .eq('user_id', q.user_id)
                .maybeSingle(),
              supabase
                .from('answers')
                .select('*', { count: 'exact', head: true })
                .eq('question_id', q.id),
            ]);
            return {
              ...q,
              profile_nickname: profileRes.data?.nickname || '匿名用户',
              profile_avatar: profileRes.data?.avatar_url,
              answers_count: countRes.count || 0,
            };
          })
        );
        questions.push(...extraQuestions);
      }

      return {
        questions,
        topics: (topicsResult.data || []) as SearchTopic[],
        users: (usersResult.data || []) as SearchUser[],
      };
    },
    enabled: !!query.trim(),
  });
};

// Popular search terms (static for now)
export const popularSearchTerms = [
  '考研', '留学', '求职', '简历', '面试',
  '论文', '英语', '健身',
];
