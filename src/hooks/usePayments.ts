import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type RechargeProvider = 'wechat' | 'alipay' | 'stripe';

export interface RechargePaymentIntent {
  order_id: string;
  provider_order_id: string;
  provider: RechargeProvider;
  points: number;
  cash_amount: number;
  status: 'pending' | 'completed';
  legacy_mode?: boolean;
  payment_payload: {
    provider?: RechargeProvider;
    provider_order_id?: string;
    cash_amount?: number;
    currency?: 'CNY';
    appid?: string;
    partnerid?: string;
    prepayid?: string;
    package?: string;
    noncestr?: string;
    timestamp?: string;
    sign?: string;
    signType?: string;
    notify_url?: string;
    sign_mode?: string;
    merchant_order_id?: string;
    amount_fen?: number;
    is_mock_gateway?: boolean;
  };
}

const isMissingRpcError = (error: unknown, functionName: string) => {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes(`public.${functionName}`) || message.includes('schema cache');
};

const isMissingFunctionError = (error: unknown, functionName: string) => {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes(functionName) || message.includes('FunctionsHttpError') || message.includes('404');
};

export const useCreateRechargePayment = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: { points: number; provider: RechargeProvider }) => {
      if (!user) {
        throw new Error('请先登录');
      }

      if (params.provider === 'wechat') {
        const invokeResult = await supabase.functions.invoke('wechat-prepay', {
          body: { points: params.points },
        });

        if (!invokeResult.error) {
          return invokeResult.data as RechargePaymentIntent;
        }

        if (!isMissingFunctionError(invokeResult.error, 'wechat-prepay')) {
          throw invokeResult.error;
        }
      }

      const rpcResult = await (supabase as any).rpc('create_recharge_payment_order', {
        p_points: params.points,
        p_payment_method: params.provider,
      });

      if (!rpcResult.error) {
        return rpcResult.data as RechargePaymentIntent;
      }

      if (!isMissingRpcError(rpcResult.error, 'create_recharge_payment_order')) {
        throw rpcResult.error;
      }

      const { error } = await supabase.rpc('recharge_points', {
        p_amount: params.points,
        p_payment_method: `${params.provider}-legacy-direct`,
      });

      if (error) {
        throw error;
      }

      return {
        order_id: `legacy-${Date.now()}`,
        provider_order_id: `legacy-${Date.now()}`,
        provider: params.provider,
        points: params.points,
        cash_amount: Number((params.points * 0.1).toFixed(2)),
<<<<<<< HEAD
        status: 'completed' as const,
=======
        status: 'completed',
>>>>>>> a04765d (Update from local working directory)
        legacy_mode: true,
        payment_payload: {
          provider: params.provider,
          cash_amount: Number((params.points * 0.1).toFixed(2)),
<<<<<<< HEAD
          currency: 'CNY' as const,
=======
          currency: 'CNY',
>>>>>>> a04765d (Update from local working directory)
        },
      };
    },
    onError: (error: Error) => {
      toast({
        title: '创建支付单失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useSimulateRechargeCallback = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      orderId: string;
      providerTransactionId: string;
      paidCash: number;
    }) => {
      const { data, error } = await (supabase as any).rpc('confirm_recharge_payment', {
        p_order_id: params.orderId,
        p_provider_transaction_id: params.providerTransactionId,
        p_paid_cash: params.paidCash,
        p_callback_payload: {
          source: 'development_manual_confirm',
        },
      });

      if (error) {
        throw error;
      }

      return !!data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['my-earnings'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      toast({
        title: '开发态回调已确认',
        description: '第三方支付回调模拟成功，积分已到账',
      });
    },
    onError: (error: Error) => {
      toast({
        title: '确认回调失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
