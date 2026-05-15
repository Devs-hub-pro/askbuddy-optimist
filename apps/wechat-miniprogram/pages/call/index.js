const callService = require('../../utils/call/service');

function parseError(error) {
  if (!error) return '未知错误';
  if (error.code === 'PERMISSION_DENIED') return error.message;
  if (error.code === 'A_CONTRACT_GAP') return error.message;
  return error.message || '操作失败';
}

Page({
  data: {
    mode: 'voice',
    peerId: '',
    sessionId: '',
    status: 'idle',
    source: '',
    loadingAction: '',
    contractGap: ''
  },

  onShareAppMessage() {
    return {
      title: 'Call v1 联调页',
      path: '/pages/call/index'
    };
  },

  setVoice() {
    this.setData({ mode: 'voice' });
  },

  setVideo() {
    this.setData({ mode: 'video' });
  },

  onPeerInput(event) {
    this.setData({ peerId: event.detail.value });
  },

  async runAction(action, fn) {
    this.setData({ loadingAction: action });
    try {
      const result = await fn();
      this.setData({
        sessionId: result.sessionId || this.data.sessionId,
        status: result.status || this.data.status,
        source: result.source || this.data.source,
        contractGap: ''
      });
    } catch (error) {
      const message = parseError(error);
      this.setData({
        status: 'failed',
        contractGap: error && error.code === 'A_CONTRACT_GAP' ? message : this.data.contractGap
      });
      wx.showToast({ title: message, icon: 'none' });
    } finally {
      this.setData({ loadingAction: '' });
    }
  },

  onInitiate() {
    this.runAction('initiate', () => callService.initiate({ mode: this.data.mode, peerId: this.data.peerId }));
  },

  onAccept() {
    this.runAction('accept', () => callService.accept({ sessionId: this.data.sessionId }));
  },

  onReject() {
    this.runAction('reject', () => callService.reject({ sessionId: this.data.sessionId }));
  },

  onHangup() {
    this.runAction('hangup', () => callService.hangup({ sessionId: this.data.sessionId }));
  }
});
