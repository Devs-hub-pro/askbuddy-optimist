import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type ConsultationType = 'text' | 'voice' | 'video';

export const getConsultationAmount = (basePrice: number | null | undefined, type: ConsultationType) => {
  const safeBasePrice = Math.max(Number(basePrice || 50), 1);
  const multiplier = type === 'voice' ? 2 : type === 'video' ? 4 : 1;
  return safeBasePrice * multiplier;
};

export const useCreateConsultationOrder = () => {
  const queryClient = useQueryClient();
  const { refreshProfile } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ expertId, consultType }: { expertId: string; consultType: ConsultationType }) => {
      const { data, error } = await (supabase as any).rpc('create_consultation_order', {
        p_expert_id: expertId,
        p_consult_type: consultType,
      });

      if (error) throw error;
      return data as unknown as string;
    },
    onSuccess: async () => {
      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['profile-stats'] });
      queryClient.invalidateQueries({ queryKey: ['experts'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      toast({
        title: '预约成功',
        description: '咨询订单已支付并创建，请前往订单页查看',
      });
    },
    onError: (error: Error) => {
      toast({
        title: '预约失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
