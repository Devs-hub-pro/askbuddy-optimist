import { supabase } from '@/integrations/supabase/client';
import { RPC_WHITELIST } from '../../../packages/shared-api/src/rpc-whitelist';
import type {
  CreateCallSessionV1Params,
  CreateCallSessionV1Result,
  EndCallV1Params,
  HeartbeatCallV1Params,
} from '../../../packages/shared-api/src/rpc-whitelist';

export type CreateCallSessionResponse = {
  callSessionId: string;
  status: 'initiated' | 'ringing';
  mock: boolean;
};

const isRpcMissingError = (error: unknown) => {
  if (!error || typeof error !== 'object') return false;
  const message = String((error as { message?: string }).message || '');
  return (
    message.includes('function') &&
    message.includes('does not exist') &&
    message.includes('create_call_session_v1')
  );
};

export const createCallSession = async (
  params: CreateCallSessionV1Params
): Promise<CreateCallSessionResponse> => {
  const { data, error } = await supabase.rpc(RPC_WHITELIST.create_call_session_v1, params);
  if (error) {
    if (isRpcMissingError(error)) {
      return {
        callSessionId: `mock-${Date.now()}`,
        status: 'initiated',
        mock: true,
      };
    }
    throw error;
  }

  const result = (data || {}) as CreateCallSessionV1Result;
  return {
    callSessionId: result.call_session_id,
    status: result.status,
    mock: false,
  };
};

export const endCallSession = async (params: EndCallV1Params): Promise<void> => {
  const { error } = await supabase.rpc(RPC_WHITELIST.end_call_v1, params);
  if (error) {
    throw error;
  }
};

export const heartbeatCallSession = async (params: HeartbeatCallV1Params): Promise<void> => {
  const { error } = await supabase.rpc(RPC_WHITELIST.heartbeat_call_v1, params);
  if (error) {
    const message = String(error.message || '');
    if (message.includes('heartbeat_call_v1')) {
      return;
    }
    throw error;
  }
};
