const { callRpc } = require('../request');
const contract = require('./contract');

function authorize(scope) {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope,
      success: () => resolve(true),
      fail: reject
    });
  });
}

async function ensurePermissions(mode) {
  const scopes = mode === 'video' ? ['scope.record', 'scope.camera'] : ['scope.record'];

  for (const scope of scopes) {
    try {
      await authorize(scope);
    } catch (cause) {
      const label = scope === 'scope.record' ? '麦克风' : '摄像头';
      const error = new Error(`${label}权限未开启，请到小程序设置中允许后重试`);
      error.code = 'PERMISSION_DENIED';
      error.cause = cause;
      throw error;
    }
  }
}

function invoke(action, payload) {
  return callRpc('callV1Invoke', {
    rpcName: contract.getRpcName(action),
    payload
  });
}

function normalizeActionResult(result) {
  if (!result || !result.call_session_id) {
    const error = new Error('CALL_INTERNAL_ERROR: missing call_session_id');
    error.code = 'CALL_INTERNAL_ERROR';
    throw error;
  }

  return {
    callSessionId: result.call_session_id,
    status: contract.normalizeStatus(result.status),
    idempotent: Boolean(result.idempotent)
  };
}

async function initiate({
  mode = 'voice',
  calleeId,
  targetType = null,
  targetId = null,
  orderId = null
}) {
  if (!calleeId) {
    const error = new Error('请输入联系人标识');
    error.code = 'CALL_INVALID_PARTICIPANT';
    throw error;
  }

  await ensurePermissions(mode);
  const result = await invoke('initiate', {
    p_callee_id: calleeId,
    p_mode: mode,
    p_target_type: targetType || null,
    p_target_id: targetId || null,
    p_order_id: orderId || null
  });

  return normalizeActionResult(result);
}

async function accept({ callSessionId }) {
  return normalizeActionResult(await invoke('accept', {
    p_call_session_id: callSessionId
  }));
}

async function reject({ callSessionId, reason = null }) {
  return normalizeActionResult(await invoke('reject', {
    p_call_session_id: callSessionId,
    p_reason: reason || null
  }));
}

async function hangup({ callSessionId, reason = null }) {
  return normalizeActionResult(await invoke('hangup', {
    p_call_session_id: callSessionId,
    p_reason: reason || null
  }));
}

async function fetchSession(callSessionId) {
  if (!callSessionId) return null;
  const session = await callRpc('fetchCallSession', { callSessionId });
  if (!session) return null;

  return {
    ...session,
    status: contract.normalizeStatus(session.status)
  };
}

module.exports = {
  ensurePermissions,
  initiate,
  accept,
  reject,
  hangup,
  fetchSession
};
