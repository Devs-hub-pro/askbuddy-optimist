import { useCallback, useEffect, useRef, useState } from "react";
import type { CallSession } from "../../../packages/shared-types/src/contracts";
import type { CreateCallSessionV1Params } from "../../../packages/shared-api/src/rpc-whitelist";
import {
  acceptCallSession,
  CallRpcError,
  createCallSession,
  endCallSession,
  getActiveCallSessionForOrder,
  getCallSession,
  rejectCallSession,
  subscribeToCallSession,
} from "./callRpc";

export type CallSessionAction = "create" | "accept" | "reject" | "end";

interface UseCallSessionOptions {
  sessionId?: string | null;
  orderId?: string | null;
}

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "CALL_INTERNAL_ERROR: 通话服务暂时不可用";

export const useCallSession = ({ sessionId, orderId }: UseCallSessionOptions) => {
  const [session, setSession] = useState<CallSession | null>(null);
  const [resolvedSessionId, setResolvedSessionId] = useState<string | null>(sessionId || null);
  const [isLoading, setIsLoading] = useState(Boolean(sessionId || orderId));
  const [activeAction, setActiveAction] = useState<CallSessionAction | null>(null);
  const [error, setError] = useState<CallRpcError | Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const applySession = useCallback((nextSession: CallSession | null) => {
    if (!mountedRef.current) return;
    setSession(nextSession);
    setResolvedSessionId(nextSession?.id || null);
    setError(null);
  }, []);

  const load = useCallback(async () => {
    if (!sessionId && !orderId) {
      applySession(null);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const nextSession = sessionId
        ? await getCallSession(sessionId)
        : await getActiveCallSessionForOrder(orderId as string);
      applySession(nextSession);
      return nextSession;
    } catch (nextError) {
      if (mountedRef.current) setError(nextError as Error);
      return null;
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [applySession, orderId, sessionId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!resolvedSessionId) return;
    return subscribeToCallSession(
      resolvedSessionId,
      applySession,
      (nextError) => {
        if (mountedRef.current) setError(nextError);
      },
    );
  }, [applySession, resolvedSessionId]);

  const runAction = useCallback(async <T,>(
    action: CallSessionAction,
    task: () => Promise<T>,
  ): Promise<T | null> => {
    setActiveAction(action);
    setError(null);
    try {
      return await task();
    } catch (nextError) {
      if (mountedRef.current) setError(nextError as Error);
      return null;
    } finally {
      if (mountedRef.current) setActiveAction(null);
    }
  }, []);

  const create = useCallback((params: CreateCallSessionV1Params) =>
    runAction("create", async () => {
      const result = await createCallSession(params);
      applySession(await getCallSession(result.call_session_id));
      return result;
    }), [applySession, runAction]);

  const accept = useCallback(() => {
    if (!resolvedSessionId) return Promise.resolve(null);
    return runAction("accept", async () => {
      const result = await acceptCallSession({ p_call_session_id: resolvedSessionId });
      applySession(await getCallSession(resolvedSessionId));
      return result;
    });
  }, [applySession, resolvedSessionId, runAction]);

  const reject = useCallback((reason = "rejected_by_callee") => {
    if (!resolvedSessionId) return Promise.resolve(null);
    return runAction("reject", async () => {
      const result = await rejectCallSession({
        p_call_session_id: resolvedSessionId,
        p_reason: reason,
      });
      applySession(await getCallSession(resolvedSessionId));
      return result;
    });
  }, [applySession, resolvedSessionId, runAction]);

  const end = useCallback((reason = "ended_by_participant") => {
    if (!resolvedSessionId) return Promise.resolve(null);
    return runAction("end", async () => {
      const result = await endCallSession({
        p_call_session_id: resolvedSessionId,
        p_reason: reason,
      });
      applySession(await getCallSession(resolvedSessionId));
      return result;
    });
  }, [applySession, resolvedSessionId, runAction]);

  return {
    session,
    resolvedSessionId,
    isLoading,
    activeAction,
    error,
    errorMessage: error ? errorMessage(error) : null,
    clearError: () => setError(null),
    refresh: load,
    create,
    accept,
    reject,
    end,
  };
};

