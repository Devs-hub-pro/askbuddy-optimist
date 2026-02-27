import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { PostWithProfile } from './usePosts';

export const useFollowingPosts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['following-posts', user?.id],
    enabled: !!user,
    queryFn: async (): Promise<PostWithProfile[]> => {
      if (!user) return [];

      // Get following user IDs
      const { data: followings, error: fErr } = await supabase
        .from('user_followers')
        .select('following_id')
        .eq('follower_id', user.id);

      if (fErr) throw fErr;
      if (!followings || followings.length === 0) return [];

      const followingIds = followings.map(f => f.following_id);

      // Fetch posts from followed users
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .in('user_id', followingIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!posts || posts.length === 0) return [];

      // Fetch profiles
      const userIds = [...new Set(posts.map(p => p.user_id))];
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

      return posts.map(post => {
        const profile = profileMap.get(post.user_id);
        return {
          ...post,
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
