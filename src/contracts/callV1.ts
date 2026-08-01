import {
  CALL_ERROR_CODE,
  CALL_MODE,
  CALL_STATUS,
  CONTENT_TARGET_TYPE,
} from "../../packages/shared-types/src/contracts";
import type {
  CallErrorCode,
  CallSession,
  ContentTargetType,
} from "../../packages/shared-types/src/contracts";
import { RPC_WHITELIST } from "../../packages/shared-api/src/rpc-whitelist";
import type {
  AcceptCallV1Params,
  AcceptCallV1Result,
  CallActionV1Result,
  CreateCallSessionV1Params,
  CreateCallSessionV1Result,
  EndCallV1Params,
  EndCallV1Result,
  RejectCallV1Params,
  RejectCallV1Result,
} from "../../packages/shared-api/src/rpc-whitelist";

export { CALL_ERROR_CODE, CALL_MODE, CALL_STATUS, CONTENT_TARGET_TYPE };

export type CallMode = (typeof CALL_MODE)[number];
export type CallStatus = (typeof CALL_STATUS)[number];
export type {
  AcceptCallV1Params,
  AcceptCallV1Result,
  CallActionV1Result,
  CallErrorCode,
  CallSession,
  ContentTargetType,
  CreateCallSessionV1Params,
  CreateCallSessionV1Result,
  EndCallV1Params,
  EndCallV1Result,
  RejectCallV1Params,
  RejectCallV1Result,
};

const publicRpcName = <T extends string>(name: `public.${T}`): T =>
  name.slice("public.".length) as T;

export const CALL_V1_RPC = {
  create: publicRpcName(RPC_WHITELIST.create_call_session_v1),
  accept: publicRpcName(RPC_WHITELIST.accept_call_v1),
  reject: publicRpcName(RPC_WHITELIST.reject_call_v1),
  end: publicRpcName(RPC_WHITELIST.end_call_v1),
} as const;

const CALL_ERROR_MESSAGE: Record<CallErrorCode, string> = {
  CALL_UNAUTHORIZED: "登录状态已失效，请重新登录后重试。",
  CALL_FORBIDDEN: "你不是该通话的可操作参与者。",
  CALL_NOT_FOUND: "通话会话不存在或已不可访问。",
  CALL_INVALID_STATE: "当前通话状态不允许执行该操作。",
  CALL_INVALID_PARTICIPANT: "通话双方信息无效，不能向自己发起通话。",
  CALL_ALREADY_ENDED: "该通话已经结束。",
  CALL_TIMEOUT: "该通话已经超时。",
  CALL_INTERNAL_ERROR: "通话服务暂时不可用，请稍后重试。",
};

export const getCallErrorMessage = (error: unknown): string => {
  const rawMessage = error instanceof Error
    ? error.message
    : typeof error === "object" && error && "message" in error
      ? String(error.message)
      : String(error || "");
  const code = CALL_ERROR_CODE.find((item) => rawMessage.includes(item));

  return code ? CALL_ERROR_MESSAGE[code] : rawMessage || CALL_ERROR_MESSAGE.CALL_INTERNAL_ERROR;
};
