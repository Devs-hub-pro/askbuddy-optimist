import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import {
  CALL_MODE,
  CALL_STATUS,
  CALL_V1_RPC,
  getCallErrorMessage,
  type CallActionV1Result,
  type CallMode,
  type CallSession,
  type CallStatus,
  type CreateCallSessionV1Params,
  type CreateCallSessionV1Result,
} from '@/contracts/callV1';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type CallSessionRow = Database['public']['Tables']['call_sessions']['Row'];
type CallAction = 'create' | 'accept' | 'reject' | 'end';

interface UseCallSessionOptions {
  sessionId?: string;
  orderId?: string | null;
}

const isCallMode = (value: string): value is CallMode =>
  CALL_MODE.includes(value as CallMode);

const isCallStatus = (value: string): value is CallStatus =>
  CALL_STATUS.includes(value as CallStatus);

const toCallSession = (row: CallSessionRow): CallSession => {
  if (!isCallMode(row.mode) || !isCallStatus(row.status)) {
    throw new Error('服务端返回了不受支持的通话模式或状态。');
  }

  return {
    ...row,
    mode: row.mode,
    status: row.status,
    target_type: row.target_type as CallSession['target_type'],
    metadata: row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
      ? row.metadata as Record<string, unknown>
      : null,
  };
};

export function useCallSession({ sessionId, orderId }: UseCallSessionOptions) {
  const [session, setSession] = useState<CallSession | null>(null);
  const [resolvedSessionId, setResolvedSessionId] = useState<string | null>(
    sessionId && sessionId !== 'new' && sessionId !== 'order' ? sessionId : null,
  );
  const [isLoading, setIsLoading] = useState(Boolean(resolvedSessionId || orderId));
  const [activeAction, setActiveAction] = useState<CallAction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadSessionById = useCallback(async (id: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from('call_sessions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!mountedRef.current) return null;
    if (error) {
      setErrorMessage(getCallErrorMessage(error));
      setIsLoading(false);
      return null;
    }
    if (!data) {
      setErrorMessage('找不到该通话，或你不是会话参与者。');
      setIsLoading(false);
      return null;
    }

    try {
      const nextSession = toCallSession(data);
      setSession(nextSession);
      setResolvedSessionId(nextSession.id);
      setIsLoading(false);
      return nextSession;
    } catch (error) {
      setErrorMessage(getCallErrorMessage(error));
      setIsLoading(false);
      return null;
    }
  }, []);

  const loadSessionByOrder = useCallback(async (targetOrderId: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from('call_sessions')
      .select('*')
      .eq('order_id', targetOrderId)
      .in('status', ['ringing', 'answered'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!mountedRef.current) return null;
    if (error) {
      setErrorMessage(getCallErrorMessage(error));
      setIsLoading(false);
      return null;
    }
    if (!data) {
      setErrorMessage('该订单当前没有可进入的通话会话。');
      setIsLoading(false);
      return null;
    }

    try {
      const nextSession = toCallSession(data);
      setSession(nextSession);
      setResolvedSessionId(nextSession.id);
      setIsLoading(false);
      return nextSession;
    } catch (error) {
      setErrorMessage(getCallErrorMessage(error));
      setIsLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (sessionId && sessionId !== 'new' && sessionId !== 'order') {
      setResolvedSessionId(sessionId);
      void loadSessionById(sessionId);
      return;
    }

    if (sessionId === 'order' && orderId) {
      void loadSessionByOrder(orderId);
      return;
    }

    setSession(null);
    setResolvedSessionId(null);
    setIsLoading(false);
  }, [loadSessionById, loadSessionByOrder, orderId, sessionId]);

  useEffect(() => {
    if (!resolvedSessionId) return;

    let channel: RealtimeChannel | null = supabase
      .channel(`call-session-${resolvedSessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'call_sessions',
          filter: `id=eq.${resolvedSessionId}`,
        },
        (payload) => {
          try {
            setSession(toCallSession(payload.new as CallSessionRow));
            setErrorMessage(null);
          } catch (error) {
            setErrorMessage(getCallErrorMessage(error));
          }
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setErrorMessage('通话状态实时连接失败，请检查网络后重试。');
        }
      });

    return () => {
      if (channel) {
        void supabase.removeChannel(channel);
        channel = null;
      }
    };
  }, [resolvedSessionId]);

  const runAction = useCallback(async <T,>(action: CallAction, task: () => Promise<T>) => {
    setActiveAction(action);
    setErrorMessage(null);
    try {
      return await task();
    } catch (error) {
      setErrorMessage(getCallErrorMessage(error));
      return null;
    } finally {
      if (mountedRef.current) setActiveAction(null);
    }
  }, []);

  const createSession = useCallback(async (params: CreateCallSessionV1Params) =>
    runAction<CreateCallSessionV1Result>('create', async () => {
      const { data, error } = await supabase.rpc(CALL_V1_RPC.create, params);
      if (error) throw error;
      const result = data as unknown as CreateCallSessionV1Result;
      if (!result?.call_session_id || result.status !== 'ringing') {
        throw new Error('创建通话成功，但服务端返回结果不完整。');
      }

      setResolvedSessionId(result.call_session_id);
      await loadSessionById(result.call_session_id);
      return result;
    }), [loadSessionById, runAction]);

  const acceptSession = useCallback(async () => {
    if (!resolvedSessionId) {
      setErrorMessage('缺少通话会话 ID，无法接听。');
      return null;
    }
    return runAction<CallActionV1Result>('accept', async () => {
      const { data, error } = await supabase.rpc(CALL_V1_RPC.accept, {
        p_call_session_id: resolvedSessionId,
      });
      if (error) throw error;
      await loadSessionById(resolvedSessionId);
      return data as unknown as CallActionV1Result;
    });
  }, [loadSessionById, resolvedSessionId, runAction]);

  const rejectSession = useCallback(async (reason = 'rejected_by_callee') => {
    if (!resolvedSessionId) {
      setErrorMessage('缺少通话会话 ID，无法拒绝。');
      return null;
    }
    return runAction<CallActionV1Result>('reject', async () => {
      const { data, error } = await supabase.rpc(CALL_V1_RPC.reject, {
        p_call_session_id: resolvedSessionId,
        p_reason: reason,
      });
      if (error) throw error;
      await loadSessionById(resolvedSessionId);
      return data as unknown as CallActionV1Result;
    });
  }, [loadSessionById, resolvedSessionId, runAction]);

  const endSession = useCallback(async (reason = 'ended_by_participant') => {
    if (!resolvedSessionId) {
      setErrorMessage('缺少通话会话 ID，无法结束。');
      return null;
    }
    return runAction<CallActionV1Result>('end', async () => {
      const { data, error } = await supabase.rpc(CALL_V1_RPC.end, {
        p_call_session_id: resolvedSessionId,
        p_reason: reason,
      });
      if (error) throw error;
      await loadSessionById(resolvedSessionId);
      return data as unknown as CallActionV1Result;
    });
  }, [loadSessionById, resolvedSessionId, runAction]);

  const isParticipant = useMemo(() => Boolean(session), [session]);

  return {
    session,
    resolvedSessionId,
    isParticipant,
    isLoading,
    activeAction,
    errorMessage,
    clearError: () => setErrorMessage(null),
    createSession,
    acceptSession,
    rejectSession,
    endSession,
    refresh: () => resolvedSessionId
      ? loadSessionById(resolvedSessionId)
      : orderId
        ? loadSessionByOrder(orderId)
        : Promise.resolve(null),
  };
}
