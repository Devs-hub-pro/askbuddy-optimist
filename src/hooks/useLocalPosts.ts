import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { PostWithProfile } from './usePosts';

export const useLocalPosts = (cityOverride?: string) => {
  const { user, profile } = useAuth();
  const effectiveCity = cityOverride || profile?.city || '';

  return useQuery({
    queryKey: ['local-posts', user?.id, effectiveCity],
    enabled: !!effectiveCity,
    queryFn: async (): Promise<PostWithProfile[]> => {
      if (!effectiveCity) return [];

      // Get users in the same city
      const { data: localProfiles, error: pErr } = await supabase
        .from('profiles')
        .select('user_id, nickname, avatar_url')
        .eq('city', effectiveCity);

      if (pErr) throw pErr;
      if (!localProfiles || localProfiles.length === 0) return [];

      const localUserIds = localProfiles.map(p => p.user_id);
      const profileMap = new Map(localProfiles.map(p => [p.user_id, p]));

      // Fetch posts from same-city users
      const { data: posts, error } = await (supabase as any)
        .from('posts')
        .select('*')
        .in('author_id', localUserIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!posts || posts.length === 0) return [];

      // Fetch likes
      let likedIds = new Set<string>();
      if (user) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);
        likedIds = new Set((likes || []).map(l => l.post_id));
      }

      return posts.map((post: any) => {
        const authorId = post.author_id ?? post.user_id;
        const p = profileMap.get(authorId);
        return {
          ...post,
          user_id: authorId,
          images: post.images || [],
          topics: post.topics || [],
          profile_nickname: p?.nickname || '匿名用户',
          profile_avatar: p?.avatar_url || null,
          liked_by_me: likedIds.has(post.id),
        };
      });
    },
  });
};
