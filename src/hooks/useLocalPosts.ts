import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { PostWithProfile } from './usePosts';
import { isAndroidMockMode } from '@/config/runtimeMode';

export const useLocalPosts = (cityOverride?: string) => {
  const { user, profile } = useAuth();
  const effectiveCity = cityOverride || profile?.city || '';

  return useQuery({
    queryKey: ['local-posts', user?.id, effectiveCity],
    enabled: !!effectiveCity || isAndroidMockMode(),
    queryFn: async (): Promise<PostWithProfile[]> => {
      if (isAndroidMockMode()) {
        return [
          {
            id: 'android-mock-local-post-1',
            user_id: 'android-mock-local-user',
            content: `同城流演示：${effectiveCity || '本地'}求职互助群今晚 8 点分享（Mock）。`,
            images: [],
            video: null,
            topics: ['同城', '活动'],
            likes_count: 4,
            comments_count: 2,
            shares_count: 0,
            created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
            profile_nickname: '同城用户_演示',
            profile_avatar: 'https://randomuser.me/api/portraits/lego/6.jpg',
            liked_by_me: false,
          },
        ];
      }

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
