import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Expert {
  id: string;
  user_id: string;
  title: string;
  bio: string | null;
  category: string | null;
  subcategory: string | null;
  consultation_price: number | null;
  response_time: string | null;
  experience_level: string | null;
  cover_image: string | null;
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
  nickname?: string | null;
  avatar_url?: string | null;
}

interface UseExpertsOptions {
  enabled?: boolean;
}

interface SaveExpertProfileInput {
  title: string;
  bio: string;
  category: string;
  subcategory: string;
  consultation_price: number;
  experience_level: string;
  response_time: string;
  tags: string[];
  cover_image?: string | null;
}

const normalizeExpert = (expert: any, profile?: { nickname?: string | null; avatar_url?: string | null } | null): Expert => ({
  ...expert,
  subcategory: expert.subcategory || null,
  consultation_price: expert.consultation_price ?? 0,
  response_time: expert.response_time || null,
  experience_level: expert.experience_level || null,
  cover_image: expert.cover_image || null,
  tags: expert.tags || [],
  keywords: expert.keywords || [],
  education: expert.education || [],
  experience: expert.experience || [],
  available_time_slots: expert.available_time_slots || [],
  nickname: expert.display_name || profile?.nickname || '专家',
  avatar_url: expert.avatar_url || profile?.avatar_url,
}) as Expert;

export const uploadExpertCoverImage = async (userId: string, file: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('请上传 JPG、PNG、GIF 或 WebP 格式的图片');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('封面图大小不能超过 5MB');
  }

  const extension = file.name.split('.').pop() || 'jpg';
  const filePath = `${userId}/expert_cover_${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  return publicUrl;
};

export const useExperts = (category?: string, options?: UseExpertsOptions) => {
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

      const userIds = Array.from(new Set((data || []).map((expert: any) => expert.user_id))) as string[];
      const { data: profiles, error: profileError } = userIds.length > 0
        ? await supabase
            .from('profiles')
            .select('user_id, nickname, avatar_url')
            .in('user_id', userIds)
        : { data: [], error: null };

      if (profileError) throw profileError;

      const profileMap = new Map((profiles || []).map((profile) => [profile.user_id, profile]));

      return (data || []).map((expert: any) => normalizeExpert(expert, profileMap.get(expert.user_id)));
    },
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
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

      return normalizeExpert(data, profile);
    },
    enabled: !!expertId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
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
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('nickname, avatar_url')
        .eq('user_id', userId)
        .maybeSingle();

      return normalizeExpert(data, profile);
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useSaveExpertProfile = () => {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: SaveExpertProfileInput) => {
      if (!user) throw new Error('请先登录');

      const { data: existing, error: existingError } = await supabase
        .from('experts')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingError) throw existingError;

      const payload = {
        title: input.title,
        bio: input.bio,
        category: input.category,
        subcategory: input.subcategory,
        consultation_price: input.consultation_price,
        experience_level: input.experience_level,
        response_time: input.response_time,
        tags: input.tags,
        keywords: input.tags,
        cover_image: input.cover_image || null,
        display_name: profile?.nickname || '专家',
        avatar_url: profile?.avatar_url || null,
        location: profile?.city || null,
        is_active: true,
      };

      if (existing) {
        const { data, error } = await supabase
          .from('experts')
          .update(payload)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from('experts')
        .insert({
          user_id: user.id,
          ...payload,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experts'] });
      queryClient.invalidateQueries({ queryKey: ['expert-by-user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['profile-stats'] });
      toast({
        title: '技能信息已保存',
        description: `您的${variables.title}已发布，可在首页和达人列表中展示`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: '保存失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
