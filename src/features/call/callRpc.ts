import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  RPC_WHITELIST,
  type AcceptCallV1Params,
  type AcceptCallV1Result,
  type CreateCallSessionV1Params,
  type CreateCallSessionV1Result,
  type EndCallV1Params,
  type EndCallV1Result,
  type RejectCallV1Params,
  type RejectCallV1Result,
} from "../../../packages/shared-api/src/rpc-whitelist";
import {
  CALL_ERROR_CODE,
  CALL_MODE,
  CALL_STATUS,
  CONTENT_TARGET_TYPE,
  type CallErrorCode,
  type CallSession,
  type CallStatus,
} from "../../../packages/shared-types/src/contracts";

type CallSessionRow = Database["public"]["Tables"]["call_sessions"]["Row"];
type CallActionResult = AcceptCallV1Result | RejectCallV1Result | EndCallV1Result;

const publicRpcName = <T extends string>(name: `public.${T}`): T =>
  name.slice("public.".length) as T;

const CALL_RPC = {
  create: publicRpcName(RPC_WHITELIST.create_call_session_v1),
  accept: publicRpcName(RPC_WHITELIST.accept_call_v1),
  reject: publicRpcName(RPC_WHITELIST.reject_call_v1),
  end: publicRpcName(RPC_WHITELIST.end_call_v1),
} as const;

const isCallStatus = (value: unknown): value is CallStatus =>
  typeof value === "string" && CALL_STATUS.includes(value as CallStatus);

const readErrorCode = (error: unknown): CallErrorCode | undefined => {
  const source = error as { code?: string; message?: string } | null;
  const raw = `${source?.code || ""} ${source?.message || String(error || "")}`;
  return CALL_ERROR_CODE.find((code) => raw.includes(code));
};

export class CallRpcError extends Error {
  readonly operation: string;
  readonly code?: CallErrorCode;

  constructor(operation: string, error: unknown) {
    const source = error as { message?: string } | null;
    super(source?.message || "CALL_INTERNAL_ERROR: 通话服务暂时不可用");
    this.name = "CallRpcError";
    this.operation = operation;
    this.code = readErrorCode(error);
  }
}

const throwCallError = (operation: string, error: unknown): never => {
  throw error instanceof CallRpcError ? error : new CallRpcError(operation, error);
};

export const parseCallSession = (row: CallSessionRow): CallSession => {
  if (!CALL_MODE.includes(row.mode as CallSession["mode"]) || !isCallStatus(row.status)) {
    throw new CallRpcError("read_call_session", new Error("CALL_INVALID_STATE"));
  }

  const targetType = row.target_type;
  if (targetType && !CONTENT_TARGET_TYPE.includes(targetType as CallSession["target_type"])) {
    throw new CallRpcError("read_call_session", new Error("CALL_INTERNAL_ERROR: unsupported target_type"));
  }

  const metadata = row.metadata && typeof row.metadata === "object" && !Array.isArray(row.metadata)
    ? row.metadata as Record<string, unknown>
    : null;

  return {
    ...row,
    mode: row.mode as CallSession["mode"],
    status: row.status,
    target_type: targetType as CallSession["target_type"],
    metadata,
  };
};

const parseCreateResult = (data: unknown): CreateCallSessionV1Result => {
  const result = data as Partial<CreateCallSessionV1Result> | null;
  if (!result?.call_session_id || (result.status !== "initiated" && result.status !== "ringing")) {
    throw new CallRpcError("create_call_session_v1", new Error("CALL_INTERNAL_ERROR"));
  }
  return result as CreateCallSessionV1Result;
};

const parseActionResult = (
  operation: string,
  data: unknown,
  allowedStatuses: readonly CallStatus[],
): CallActionResult => {
  const result = data as Partial<CallActionResult> | null;
  if (
    !result?.call_session_id
    || !isCallStatus(result.status)
    || !allowedStatuses.includes(result.status)
  ) {
    throw new CallRpcError(operation, new Error("CALL_INTERNAL_ERROR"));
  }
  return result as CallActionResult;
};

export const createCallSession = async (
  params: CreateCallSessionV1Params,
): Promise<CreateCallSessionV1Result> => {
  const { data, error } = await supabase.rpc(CALL_RPC.create, params);
  if (error) throwCallError(CALL_RPC.create, error);
  return parseCreateResult(data);
};

export const acceptCallSession = async (
  params: AcceptCallV1Params,
): Promise<AcceptCallV1Result> => {
  const { data, error } = await supabase.rpc(CALL_RPC.accept, params);
  if (error) throwCallError(CALL_RPC.accept, error);
  return parseActionResult(CALL_RPC.accept, data, ["answered"]) as AcceptCallV1Result;
};

export const rejectCallSession = async (
  params: RejectCallV1Params,
): Promise<RejectCallV1Result> => {
  const { data, error } = await supabase.rpc(CALL_RPC.reject, params);
  if (error) throwCallError(CALL_RPC.reject, error);
  return parseActionResult(CALL_RPC.reject, data, ["cancelled"]) as RejectCallV1Result;
};

export const endCallSession = async (
  params: EndCallV1Params,
): Promise<EndCallV1Result> => {
  const { data, error } = await supabase.rpc(CALL_RPC.end, params);
  if (error) throwCallError(CALL_RPC.end, error);
  return parseActionResult(CALL_RPC.end, data, ["ended", "cancelled"]) as EndCallV1Result;
};

export const getCallSession = async (callSessionId: string): Promise<CallSession> => {
  const { data, error } = await supabase
    .from("call_sessions")
    .select("*")
    .eq("id", callSessionId)
    .maybeSingle();

  if (error) throwCallError("read_call_session", error);
  if (!data) throw new CallRpcError("read_call_session", new Error("CALL_NOT_FOUND"));
  return parseCallSession(data);
};

export const getActiveCallSessionForOrder = async (orderId: string): Promise<CallSession | null> => {
  const { data, error } = await supabase
    .from("call_sessions")
    .select("*")
    .eq("order_id", orderId)
    .in("status", ["initiated", "ringing", "answered"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throwCallError("read_order_call_session", error);
  return data ? parseCallSession(data) : null;
};

export const subscribeToCallSession = (
  callSessionId: string,
  onChange: (session: CallSession) => void,
  onError?: (error: CallRpcError) => void,
): (() => void) => {
  let channel: RealtimeChannel | null = supabase
    .channel(`call-session-${callSessionId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "call_sessions",
        filter: `id=eq.${callSessionId}`,
      },
      (payload) => {
        try {
          onChange(parseCallSession(payload.new as CallSessionRow));
        } catch (error) {
          onError?.(error instanceof CallRpcError
            ? error
            : new CallRpcError("realtime_call_session", error));
        }
      },
    )
    .subscribe((status) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        onError?.(new CallRpcError("realtime_call_session", new Error(status)));
      }
    });

  return () => {
    if (!channel) return;
    void supabase.removeChannel(channel);
    channel = null;
  };
};
