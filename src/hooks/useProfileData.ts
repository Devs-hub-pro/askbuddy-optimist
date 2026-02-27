import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Profile stats aggregation
export const useProfileStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile-stats', user?.id],
    queryFn: async () => {
      if (!user) return { orders: 0, answers: 0, favorites: 0, following: 0 };

      const [ordersRes, answersRes, favoritesRes, followingRes] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('answers').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('user_followers').select('*', { count: 'exact', head: true }).eq('follower_id', user.id),
      ]);

      return {
        orders: ordersRes.count || 0,
        answers: answersRes.count || 0,
        favorites: favoritesRes.count || 0,
        following: followingRes.count || 0,
      };
    },
    enabled: !!user,
  });
};

// My favorites with question data
export const useMyFavorites = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('*, questions(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return favorites || [];
    },
    enabled: !!user,
  });
};

// My answers with question data
export const useMyAnswers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-answers', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: answers, error } = await supabase
        .from('answers')
        .select('*, questions(id, title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return answers || [];
    },
    enabled: !!user,
  });
};

// My orders
export const useMyOrders = (statusFilter?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-orders', user?.id, statusFilter],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

// My following with profile data
export const useMyFollowing = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-following', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: following, error } = await supabase
        .from('user_followers')
        .select('*')
        .eq('follower_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get profiles for followed users
      const followingWithProfiles = await Promise.all(
        (following || []).map(async (f) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('nickname, avatar_url, bio')
            .eq('user_id', f.following_id)
            .maybeSingle();
          return { ...f, profile };
        })
      );

      return followingWithProfiles;
    },
    enabled: !!user,
  });
};

// My earnings (points transactions)
export const useMyEarnings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-earnings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

// Unfollow user
export const useUnfollow = () => {
  const { user } = useAuth();

  return async (followingId: string) => {
    if (!user) throw new Error('请先登录');
    const { error } = await supabase
      .from('user_followers')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', followingId);
    if (error) throw error;
  };
};
