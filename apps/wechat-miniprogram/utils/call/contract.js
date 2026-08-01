const BACKEND_STATUSES = [
  'initiated',
  'ringing',
  'answered',
  'ended',
  'cancelled',
  'timeout',
  'failed'
];

const RPC = {
  initiate: 'create_call_session_v1',
  accept: 'accept_call_v1',
  reject: 'reject_call_v1',
  hangup: 'end_call_v1'
};

const LEGACY_STATUS_MAP = {
  dialing: 'initiated',
  connected: 'answered',
  rejected: 'cancelled'
};

function normalizeStatus(status) {
  if (status === 'idle') return 'idle';
  const normalized = LEGACY_STATUS_MAP[status] || status;
  if (!BACKEND_STATUSES.includes(normalized)) {
    const error = new Error(`CALL_INVALID_STATE: ${status || 'empty'}`);
    error.code = 'CALL_INVALID_STATE';
    throw error;
  }
  return normalized;
}

function getRpcName(action) {
  const rpcName = RPC[action];
  if (!rpcName) {
    const error = new Error(`A_CONTRACT_GAP: missing rpc mapping for ${action}`);
    error.code = 'A_CONTRACT_GAP';
    throw error;
  }
  return rpcName;
}

module.exports = {
  backendStatuses: BACKEND_STATUSES,
  uiStatuses: ['idle', ...BACKEND_STATUSES],
  rpc: RPC,
  getRpcName,
  normalizeStatus
};
