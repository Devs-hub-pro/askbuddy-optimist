import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { PostWithProfile } from './usePosts';
import { isAndroidMockMode } from '@/config/runtimeMode';

export const useFollowingPosts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['following-posts', user?.id],
    enabled: !!user || isAndroidMockMode(),
    queryFn: async (): Promise<PostWithProfile[]> => {
      if (isAndroidMockMode()) {
        return [
          {
            id: 'android-mock-following-post-1',
            user_id: 'android-mock-following-user',
            content: '关注流演示：这是你关注对象的最新动态（Mock）。',
            images: [],
            video: null,
            topics: ['关注广场'],
            likes_count: 6,
            comments_count: 1,
            shares_count: 0,
            created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
            profile_nickname: '关注用户_演示',
            profile_avatar: 'https://randomuser.me/api/portraits/lego/5.jpg',
            liked_by_me: false,
          },
        ];
      }

      if (!user) return [];

      // Get following user IDs
      const { data: followings, error: fErr } = await (supabase as any)
        .from('follows')
        .select('followee_id')
        .eq('follower_id', user.id);

      if (fErr) throw fErr;
      if (!followings || followings.length === 0) return [];

      const followingIds = followings.map((f: { followee_id: string }) => f.followee_id);

      // Fetch posts from followed users
      const { data: posts, error } = await (supabase as any)
        .from('posts')
        .select('*')
        .in('author_id', followingIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!posts || posts.length === 0) return [];

      // Fetch profiles
      const userIds = [...new Set(posts.map((p: any) => p.author_id ?? p.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, nickname, avatar_url')
        .in('user_id', userIds);

      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

      // Fetch likes
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);
      const likedIds = new Set((likes || []).map(l => l.post_id));

      return posts.map((post: any) => {
        const authorId = post.author_id ?? post.user_id;
        const profile = profileMap.get(authorId);
        return {
          ...post,
          user_id: authorId,
          images: post.images || [],
          topics: post.topics || [],
          profile_nickname: profile?.nickname || '匿名用户',
          profile_avatar: profile?.avatar_url || null,
          liked_by_me: likedIds.has(post.id),
        };
      });
    },
  });
};
