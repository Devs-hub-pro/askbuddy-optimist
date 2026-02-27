import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Expert {
  id: string;
  user_id: string;
  title: string;
  bio: string | null;
  category: string | null;
  tags: string[];
  keywords: string[];
  location: string | null;
  rating: number;
  response_rate: number;
  order_count: number;
  consultation_count: number;
  followers_count: number;
  is_verified: boolean;
  education: any[];
  experience: any[];
  available_time_slots: any[];
  created_at: string;
  // Joined from profiles
  nickname?: string | null;
  avatar_url?: string | null;
}

export const useExperts = (category?: string) => {
  return useQuery({
    queryKey: ['experts', category],
    queryFn: async (): Promise<Expert[]> => {
      let query = supabase
        .from('experts')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;

      // Enrich with profile data
      const experts = await Promise.all(
        (data || []).map(async (expert: any) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('nickname, avatar_url')
            .eq('user_id', expert.user_id)
            .maybeSingle();

          return {
            ...expert,
            tags: expert.tags || [],
            keywords: expert.keywords || [],
            education: expert.education || [],
            experience: expert.experience || [],
            available_time_slots: expert.available_time_slots || [],
            nickname: profile?.nickname || '专家',
            avatar_url: profile?.avatar_url,
          } as Expert;
        })
      );

      return experts;
    },
  });
};

export const useExpertDetail = (expertId: string) => {
  return useQuery({
    queryKey: ['expert', expertId],
    queryFn: async (): Promise<Expert | null> => {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('id', expertId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('nickname, avatar_url')
        .eq('user_id', (data as any).user_id)
        .maybeSingle();

      return {
        ...(data as any),
        tags: (data as any).tags || [],
        keywords: (data as any).keywords || [],
        education: (data as any).education || [],
        experience: (data as any).experience || [],
        available_time_slots: (data as any).available_time_slots || [],
        nickname: profile?.nickname || '专家',
        avatar_url: profile?.avatar_url,
      } as Expert;
    },
    enabled: !!expertId,
  });
};

export const useExpertByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['expert-by-user', userId],
    queryFn: async (): Promise<Expert | null> => {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('nickname, avatar_url')
        .eq('user_id', userId)
        .maybeSingle();

      return {
        ...(data as any),
        tags: (data as any).tags || [],
        keywords: (data as any).keywords || [],
        education: (data as any).education || [],
        experience: (data as any).experience || [],
        available_time_slots: (data as any).available_time_slots || [],
        nickname: profile?.nickname || '专家',
        avatar_url: profile?.avatar_url,
      } as Expert;
    },
    enabled: !!userId,
  });
};
