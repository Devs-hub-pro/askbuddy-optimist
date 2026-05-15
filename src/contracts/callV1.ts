import { CALL_MODE, CALL_STATUS } from "../../../packages/shared-types/src/contracts";
import { RPC_WHITELIST } from "../../../packages/shared-api/src/rpc-whitelist";

export { CALL_MODE, CALL_STATUS };

export type CallMode = (typeof CALL_MODE)[number];
export type CallStatus = (typeof CALL_STATUS)[number];

export const CALL_V1_RPC = {
  create: RPC_WHITELIST.create_call_session_v1,
  accept: RPC_WHITELIST.accept_call_v1,
  reject: RPC_WHITELIST.reject_call_v1,
  end: RPC_WHITELIST.end_call_v1,
  heartbeat: RPC_WHITELIST.heartbeat_call_v1,
  timeout: RPC_WHITELIST.mark_call_timeout_v1,
} as const;
