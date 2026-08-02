import {
  CALL_ERROR_CODE,
  CALL_MODE,
  CALL_STATUS,
  CONTENT_TARGET_TYPE,
  type CallErrorCode,
  type CallMode,
  type CallStatus,
  type ContentTargetType,
} from "../../packages/shared-types/src/contracts";

export { CALL_MODE, CALL_STATUS, CONTENT_TARGET_TYPE };
export type { CallMode, CallStatus, ContentTargetType };

export const CALL_STATUS_LABEL: Record<CallStatus, string> = {
  initiated: "发起中",
  ringing: "等待接听",
  answered: "通话中",
  ended: "通话已结束",
  cancelled: "通话已取消",
  timeout: "通话已超时",
  failed: "通话异常中断",
};

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
  const rawMessage = error instanceof Error ? error.message : String(error || "");
  const code = CALL_ERROR_CODE.find((item) => rawMessage.includes(item));
  return code ? CALL_ERROR_MESSAGE[code] : rawMessage || CALL_ERROR_MESSAGE.CALL_INTERNAL_ERROR;
};
