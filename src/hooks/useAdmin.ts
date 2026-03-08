import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsAdmin } from '@/hooks/useHotTopics';

export interface AdminAuditEvent {
  id: string;
  event_type: string;
  entity_type: string | null;
  entity_id: string | null;
  severity: 'info' | 'warning' | 'error' | 'critical';
  payload: Record<string, unknown>;
  created_at: string;
}

export interface AdminReport {
  id: string;
  target_id: string;
  target_type: string;
  reason: string;
  details: string | null;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
  resolution_note: string | null;
  reporter_nickname: string | null;
  target_hidden: boolean | null;
}

export interface AdminConfigItem {
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  updated_at: string;
}

export interface AdminDashboardData {
  pending_recharge_orders: number;
  pending_reports: number;
  flagged_contents: number;
  today_orders: number;
  today_revenue: number;
  recent_audit_events: AdminAuditEvent[];
}

export interface PendingRechargeOrder {
  id: string;
  user_id: string;
  amount: number;
  cash_amount: number | null;
  status: string;
  payment_method: string | null;
  provider_order_id: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
  user_nickname: string | null;
}

export const useAdminDashboard = () => {
  const isAdmin = useIsAdmin();

  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async (): Promise<AdminDashboardData> => {
      const { data, error } = await (supabase as any).rpc('get_admin_dashboard');
      if (error) {
        throw error;
      }
      return data as AdminDashboardData;
    },
    enabled: isAdmin.data === true,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useContentReports = (status?: AdminReport['status']) => {
  const isAdmin = useIsAdmin();

  return useQuery({
    queryKey: ['admin-content-reports', status || 'all'],
    queryFn: async (): Promise<AdminReport[]> => {
      const { data, error } = await (supabase as any).rpc('list_content_reports', {
        p_status: status || null,
      });
      if (error) {
        throw error;
      }
      return (data || []) as AdminReport[];
    },
    enabled: isAdmin.data === true,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePendingRechargeOrders = () => {
  const isAdmin = useIsAdmin();

  return useQuery({
    queryKey: ['admin-pending-recharge-orders'],
    queryFn: async (): Promise<PendingRechargeOrder[]> => {
      const { data, error } = await (supabase as any).rpc('list_pending_recharge_orders');
      if (error) {
        throw error;
      }
      return (data || []) as PendingRechargeOrder[];
    },
    enabled: isAdmin.data === true,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAppConfigs = () => {
  const isAdmin = useIsAdmin();

  return useQuery({
    queryKey: ['admin-app-configs'],
    queryFn: async (): Promise<AdminConfigItem[]> => {
      const { data, error } = await (supabase as any).rpc('get_app_configs');
      if (error) {
        throw error;
      }
      return (data || []) as AdminConfigItem[];
    },
    enabled: isAdmin.data === true,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useReviewContentReport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      reportId: string;
      status: AdminReport['status'];
      resolutionNote?: string;
    }) => {
      const { data, error } = await (supabase as any).rpc('review_content_report', {
        p_report_id: params.reportId,
        p_status: params.status,
        p_resolution_note: params.resolutionNote || null,
      });
      if (error) {
        throw error;
      }
      return !!data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-content-reports'] });
      toast({ title: '处理完成', description: '举报状态已更新' });
    },
    onError: (error: Error) => {
      toast({
        title: '处理失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useApplyModerationAction = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      targetId: string;
      targetType: 'question' | 'answer' | 'discussion' | 'message';
      action: 'hide' | 'restore';
      reason?: string;
      reportId?: string;
    }) => {
      const { data, error } = await (supabase as any).rpc('apply_content_moderation_action', {
        p_target_id: params.targetId,
        p_target_type: params.targetType,
        p_action: params.action,
        p_reason: params.reason || null,
        p_report_id: params.reportId || null,
      });
      if (error) {
        throw error;
      }
      return !!data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-content-reports'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['topic'] });
      toast({ title: '审核动作已执行', description: '内容可见性已更新' });
    },
    onError: (error: Error) => {
      toast({
        title: '审核动作失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useAdminConfirmRechargeOrder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { orderId: string; providerTransactionId?: string }) => {
      const { data, error } = await (supabase as any).rpc('admin_confirm_recharge_order', {
        p_order_id: params.orderId,
        p_provider_transaction_id: params.providerTransactionId || null,
      });
      if (error) {
        throw error;
      }
      return !!data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-recharge-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      toast({ title: '补单完成', description: '充值订单已手动确认到账' });
    },
    onError: (error: Error) => {
      toast({
        title: '补单失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpsertAppConfig = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      key: string;
      value: Record<string, unknown>;
      description?: string;
    }) => {
      const { data, error } = await (supabase as any).rpc('upsert_app_config', {
        p_key: params.key,
        p_value: params.value,
        p_description: params.description || null,
      });
      if (error) {
        throw error;
      }
      return !!data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-app-configs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast({ title: '配置已保存', description: '运营配置更新成功' });
    },
    onError: (error: Error) => {
      toast({
        title: '配置保存失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
