const { callRpc } = require('../request');
const contract = require('./contract');

const LOCAL_SESSIONS = {};

function genId() {
  return `call_${Date.now()}`;
}

function authorize(scope) {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope,
      success: () => resolve(true),
      fail: (error) => reject(error)
    });
  });
}

async function ensurePermissions(mode) {
  const needScopes = mode === 'video' ? ['scope.record', 'scope.camera'] : ['scope.record'];

  for (const scope of needScopes) {
    try {
      await authorize(scope);
    } catch (error) {
      const label = scope === 'scope.record' ? '麦克风' : '摄像头';
      const err = new Error(`${label}权限未开启`);
      err.code = 'PERMISSION_DENIED';
      throw err;
    }
  }
}

async function invokeA(action, payload) {
  const rpcName = contract.ensureReady(action);
  return callRpc('callV1Invoke', { rpcName, payload });
}

function saveLocalSession(session) {
  LOCAL_SESSIONS[session.sessionId] = session;
  return session;
}

function getLocalSession(sessionId) {
  return LOCAL_SESSIONS[sessionId] || null;
}

async function initiate({ mode = 'voice', peerId = '' }) {
  await ensurePermissions(mode);

  try {
    const remote = await invokeA('initiate', { mode, peerId });
    return {
      sessionId: remote.session_id,
      mode,
      peerId,
      status: remote.status || 'dialing',
      source: 'remote'
    };
  } catch (error) {
    if (error && error.code !== 'A_CONTRACT_GAP') throw error;

    const local = saveLocalSession({
      sessionId: genId(),
      mode,
      peerId,
      status: 'dialing',
      source: 'local-mock'
    });
    return local;
  }
}

async function accept({ sessionId }) {
  const local = getLocalSession(sessionId);

  try {
    const remote = await invokeA('accept', { sessionId });
    return {
      sessionId,
      status: remote.status || 'connected',
      source: 'remote'
    };
  } catch (error) {
    if (error && error.code !== 'A_CONTRACT_GAP') throw error;
    if (!local) throw new Error('会话不存在');
    local.status = 'connected';
    return local;
  }
}

async function reject({ sessionId }) {
  const local = getLocalSession(sessionId);

  try {
    const remote = await invokeA('reject', { sessionId });
    return {
      sessionId,
      status: remote.status || 'rejected',
      source: 'remote'
    };
  } catch (error) {
    if (error && error.code !== 'A_CONTRACT_GAP') throw error;
    if (!local) throw new Error('会话不存在');
    local.status = 'rejected';
    return local;
  }
}

async function hangup({ sessionId }) {
  const local = getLocalSession(sessionId);

  try {
    const remote = await invokeA('hangup', { sessionId });
    return {
      sessionId,
      status: remote.status || 'ended',
      source: 'remote'
    };
  } catch (error) {
    if (error && error.code !== 'A_CONTRACT_GAP') throw error;
    if (!local) throw new Error('会话不存在');
    local.status = 'ended';
    return local;
  }
}

module.exports = {
  ensurePermissions,
  initiate,
  accept,
  reject,
  hangup
};
