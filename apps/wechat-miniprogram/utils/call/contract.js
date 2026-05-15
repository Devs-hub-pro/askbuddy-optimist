// Call v1 契约映射：仅接受 A 主线提供的 RPC 名称。
// 未配置即视为契约缺口，端侧不猜测。
module.exports = {
  statusEnum: ['idle', 'dialing', 'ringing', 'connected', 'rejected', 'ended', 'failed'],
  rpc: {
    initiate: '',
    accept: '',
    reject: '',
    hangup: ''
  },
  ensureReady(action) {
    const rpcName = this.rpc[action];
    if (!rpcName) {
      const err = new Error(`A_CONTRACT_GAP: missing rpc mapping for ${action}`);
      err.code = 'A_CONTRACT_GAP';
      throw err;
    }
    return rpcName;
  }
};
