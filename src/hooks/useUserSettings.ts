import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface NotificationPrefs {
  push?: boolean;
  email?: boolean;
  newMessages?: boolean;
  likes?: boolean;
  follows?: boolean;
  comments?: boolean;
  mentions?: boolean;
  achievements?: boolean;
  updates?: boolean;
  recommendations?: boolean;
  marketing?: boolean;
  activitySummary?: boolean;
}

export interface PrivacyPrefs {
  showEducation?: boolean;
  showWorkHistory?: boolean;
  showTopics?: boolean;
  allowFollowers?: boolean;
  allowMessages?: boolean;
  publicProfile?: boolean;
  hideActivity?: boolean;
  hideOnline?: boolean;
  hideReadReceipts?: boolean;
  showRecommendations?: boolean;
}

const defaultNotification: NotificationPrefs = {
  push: true, email: true, newMessages: true, likes: true, follows: true,
  comments: true, mentions: true, achievements: true, updates: true,
  recommendations: true, marketing: false, activitySummary: true,
};

const defaultPrivacy: PrivacyPrefs = {
  showEducation: true, showWorkHistory: true, showTopics: true,
  allowFollowers: true, allowMessages: true, publicProfile: true,
  hideActivity: false, hideOnline: false, hideReadReceipts: false,
  showRecommendations: true,
};

export const useUserSettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-settings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      return {
        notification_settings: { ...defaultNotification, ...(data?.notification_settings as NotificationPrefs || {}) },
        privacy_settings: { ...defaultPrivacy, ...(data?.privacy_settings as PrivacyPrefs || {}) },
        exists: !!data,
      };
    },
    enabled: !!user,
  });
};

export const useSaveNotificationSettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: NotificationPrefs) => {
      if (!user) throw new Error('请先登录');

      const { data: existing } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_settings')
          .update({ notification_settings: settings as any })
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_settings')
          .insert({ user_id: user.id, notification_settings: settings as any });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast({ title: '通知设置已保存' });
    },
  });
};

export const useSavePrivacySettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: PrivacyPrefs) => {
      if (!user) throw new Error('请先登录');

      const { data: existing } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_settings')
          .update({ privacy_settings: settings as any })
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_settings')
          .insert({ user_id: user.id, privacy_settings: settings as any });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast({ title: '隐私设置已保存' });
    },
  });
};
