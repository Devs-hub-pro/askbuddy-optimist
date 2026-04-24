const mock = require('./mock');

async function callRpc(name, payload = {}) {
  const app = getApp();

  if (app.globalData.useMock) {
    if (typeof mock[name] === 'function') {
      return mock[name](payload.keyword || payload.questionId ? payload.keyword || payload.questionId : payload);
    }
    throw new Error(`mock rpc not found: ${name}`);
  }

  // 真实接口切换点：仅替换此处，不改页面层。
  // 当前阶段保持 mock，不新增后端能力。
  throw new Error('Real RPC not enabled yet.');
}

module.exports = {
  callRpc
};
