import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type {
  AcceptCallV1Params,
  AcceptCallV1Result,
  CreateCallSessionV1Params,
  CreateCallSessionV1Result,
  EndCallV1Params,
  EndCallV1Result,
  RejectCallV1Params,
  RejectCallV1Result,
} from '../../../packages/shared-api/src/rpc-whitelist';
import { CALL_STATUS } from '../../../packages/shared-types/src/contracts';
import type { CallSession, CallStatus } from '../../../packages/shared-types/src/contracts';

type CallActionResult = AcceptCallV1Result | RejectCallV1Result | EndCallV1Result;

export type CreateCallSessionResponse = {
  callSessionId: string;
  status: 'initiated' | 'ringing';
};

export class CallRpcError extends Error {
  readonly operation: string;
  readonly code?: string;

  constructor(operation: string, error: unknown) {
    const source = error as { message?: string; code?: string } | null;
    super(source?.message || '通话服务暂时不可用');
    this.name = 'CallRpcError';
    this.operation = operation;
    this.code = source?.code;
  }
}

const throwCallError = (operation: string, error: unknown): never => {
  throw new CallRpcError(operation, error);
};

const isCallStatus = (value: unknown): value is CallStatus =>
  typeof value === 'string' && (CALL_STATUS as readonly string[]).includes(value);

const parseCallSession = (value: Record<string, unknown>): CallSession => {
  if (!isCallStatus(value.status)) {
    throw new CallRpcError('read_call_session', new Error('CALL_INVALID_STATE'));
  }
  if (value.mode !== 'voice' && value.mode !== 'video') {
    throw new CallRpcError('read_call_session', new Error('CALL_INVALID_MODE'));
  }

  return value as unknown as CallSession;
};

const parseCallActionResult = (
  operation: 'accept_call_v1' | 'reject_call_v1' | 'end_call_v1',
  data: unknown
): CallActionResult => {
  const result = data as Partial<CallActionResult> | null;
  if (!result?.call_session_id || !isCallStatus(result.status)) {
    throw new CallRpcError(operation, new Error('CALL_INTERNAL_ERROR'));
  }
  return result as CallActionResult;
};

export const createCallSession = async (
  params: CreateCallSessionV1Params
): Promise<CreateCallSessionResponse> => {
  const { data, error } = await supabase.rpc('create_call_session_v1', params);
  if (error) throwCallError('create_call_session_v1', error);

  const result = data as unknown as CreateCallSessionV1Result;
  if (!result?.call_session_id || !isCallStatus(result.status)) {
    throw new CallRpcError('create_call_session_v1', new Error('CALL_INTERNAL_ERROR'));
  }

  return {
    callSessionId: result.call_session_id,
    status: result.status,
  };
};

export const acceptCallSession = async (params: AcceptCallV1Params): Promise<AcceptCallV1Result> => {
  const { data, error } = await supabase.rpc('accept_call_v1', params);
  if (error) throwCallError('accept_call_v1', error);
  return parseCallActionResult('accept_call_v1', data) as AcceptCallV1Result;
};

export const rejectCallSession = async (params: RejectCallV1Params): Promise<RejectCallV1Result> => {
  const { data, error } = await supabase.rpc('reject_call_v1', params);
  if (error) throwCallError('reject_call_v1', error);
  return parseCallActionResult('reject_call_v1', data) as RejectCallV1Result;
};

export const endCallSession = async (params: EndCallV1Params): Promise<EndCallV1Result> => {
  const { data, error } = await supabase.rpc('end_call_v1', params);
  if (error) throwCallError('end_call_v1', error);
  return parseCallActionResult('end_call_v1', data) as EndCallV1Result;
};

export const getCallSession = async (callSessionId: string): Promise<CallSession> => {
  const { data, error } = await supabase
    .from('call_sessions')
    .select('*')
    .eq('id', callSessionId)
    .maybeSingle();

  if (error) throwCallError('read_call_session', error);
  if (!data) throw new CallRpcError('read_call_session', new Error('CALL_NOT_FOUND'));
  return parseCallSession(data as unknown as Record<string, unknown>);
};

export const subscribeToCallSession = (
  callSessionId: string,
  onChange: (session: CallSession) => void,
  onError: (error: CallRpcError) => void
): (() => void) => {
  let channel: RealtimeChannel | null = supabase
    .channel(`call-session-${callSessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'call_sessions',
        filter: `id=eq.${callSessionId}`,
      },
      (payload) => {
        try {
          onChange(parseCallSession(payload.new as Record<string, unknown>));
        } catch (error) {
          onError(error instanceof CallRpcError ? error : new CallRpcError('realtime_call_session', error));
        }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        onError(new CallRpcError('realtime_call_session', new Error(status)));
      }
    });

  return () => {
    if (!channel) return;
    void supabase.removeChannel(channel);
    channel = null;
  };
};
