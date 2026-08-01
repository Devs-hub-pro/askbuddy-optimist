const callService = require('../../utils/call/service');

const POLL_INTERVAL_MS = 2500;
const TERMINAL_STATUSES = new Set(['ended', 'cancelled', 'timeout', 'failed']);

const STATUS_LABELS = {
  idle: '待发起',
  initiated: '正在发起',
  ringing: '等待接听',
  answered: '已接听',
  ended: '已结束',
  cancelled: '已取消',
  timeout: '无人接听',
  failed: '通话失败'
};

const ERROR_LABELS = {
  CALL_UNAUTHORIZED: '请先登录后再发起通话',
  CALL_FORBIDDEN: '当前账号无权执行此操作',
  CALL_NOT_FOUND: '通话会话不存在',
  CALL_INVALID_STATE: '当前通话状态不允许此操作',
  CALL_INVALID_PARTICIPANT: '被叫用户无效',
  CALL_ALREADY_ENDED: '通话已经结束',
  CALL_TIMEOUT: '通话已超时',
  CALL_INTERNAL_ERROR: '通话服务暂时不可用'
};

function parseError(error) {
  if (!error) return '未知错误';
  if (error.code === 'PERMISSION_DENIED') return error.message;
  if (error.code && ERROR_LABELS[error.code]) return ERROR_LABELS[error.code];

  const message = error.message || String(error);
  const matchedCode = message.match(/CALL_[A-Z_]+/);
  if (matchedCode && ERROR_LABELS[matchedCode[0]]) return ERROR_LABELS[matchedCode[0]];
  return message || '操作失败';
}

Page({
  data: {
    mode: 'voice',
    calleeId: '',
    targetType: '',
    targetId: '',
    orderId: '',
    callSessionId: '',
    status: 'idle',
    statusLabel: STATUS_LABELS.idle,
    loadingAction: '',
    errorMessage: '',
    pollMessage: '',
    canInitiate: true,
    canAccept: false,
    canReject: false,
    canHangup: false
  },

  onLoad(options = {}) {
    this._visible = true;
    this._unloaded = false;
    this.setData({
      mode: options.mode === 'video' ? 'video' : 'voice',
      calleeId: options.calleeId || '',
      targetType: options.targetType || '',
      targetId: options.targetId || '',
      orderId: options.orderId || '',
      callSessionId: options.callSessionId || options.id || ''
    });

    if (this.data.callSessionId) {
      this.refreshSession();
    }
  },

  onShow() {
    this._visible = true;
    if (this.data.callSessionId && !TERMINAL_STATUSES.has(this.data.status)) {
      this.startPolling();
    }
  },

  onHide() {
    this._visible = false;
    this.stopPolling();
  },

  onUnload() {
    this._visible = false;
    this._unloaded = true;
    this.stopPolling();
  },

  onShareAppMessage() {
    return {
      title: 'Call v1 会话',
      path: this.data.callSessionId
        ? `/pages/call/index?callSessionId=${this.data.callSessionId}`
        : '/pages/call/index'
    };
  },

  setVoice() {
    this.setData({ mode: 'voice' });
  },

  setVideo() {
    this.setData({ mode: 'video' });
  },

  onCalleeInput(event) {
    this.setData({ calleeId: event.detail.value.trim() });
  },

  updateSessionState(callSessionId, status) {
    const isRinging = status === 'ringing';
    const isAnswered = status === 'answered';
    const isTerminal = TERMINAL_STATUSES.has(status);

    this.setData({
      callSessionId: callSessionId || this.data.callSessionId,
      status,
      statusLabel: STATUS_LABELS[status] || status,
      canInitiate: status === 'idle' || isTerminal,
      canAccept: Boolean(callSessionId) && isRinging,
      canReject: Boolean(callSessionId) && isRinging,
      canHangup: Boolean(callSessionId) && (isRinging || isAnswered)
    });

    if (isTerminal) this.stopPolling();
  },

  async runAction(action, fn) {
    if (this.data.loadingAction) return;
    this.setData({ loadingAction: action, errorMessage: '', pollMessage: '' });

    try {
      const result = await fn();
      if (this._unloaded) return;
      this.updateSessionState(result.callSessionId, result.status);
      if (!TERMINAL_STATUSES.has(result.status)) this.startPolling();
    } catch (error) {
      if (this._unloaded) return;
      const message = parseError(error);
      this.setData({ errorMessage: message });
      wx.showToast({ title: message, icon: 'none' });
    } finally {
      if (!this._unloaded) this.setData({ loadingAction: '' });
    }
  },

  onInitiate() {
    this.runAction('initiate', () => callService.initiate({
      mode: this.data.mode,
      calleeId: this.data.calleeId,
      targetType: this.data.targetType || null,
      targetId: this.data.targetId || null,
      orderId: this.data.orderId || null
    }));
  },

  onAccept() {
    this.runAction('accept', () => callService.accept({
      callSessionId: this.data.callSessionId
    }));
  },

  onReject() {
    this.runAction('reject', () => callService.reject({
      callSessionId: this.data.callSessionId,
      reason: 'rejected_by_callee'
    }));
  },

  onHangup() {
    this.runAction('hangup', () => callService.hangup({
      callSessionId: this.data.callSessionId,
      reason: 'ended_by_participant'
    }));
  },

  async refreshSession() {
    if (!this.data.callSessionId || this._polling || this._unloaded) return;
    this._polling = true;

    try {
      const session = await callService.fetchSession(this.data.callSessionId);
      if (this._unloaded || !this._visible) return;
      if (!session) {
        this.setData({ pollMessage: '未找到当前通话会话' });
        return;
      }
      this.setData({ pollMessage: '' });
      this.updateSessionState(session.id, session.status);
    } catch (error) {
      if (!this._unloaded && this._visible) {
        this.setData({ pollMessage: parseError(error) });
      }
    } finally {
      this._polling = false;
    }
  },

  startPolling() {
    if (!this._visible || this._unloaded || !this.data.callSessionId || this._pollTimer) return;
    this.refreshSession();
    this._pollTimer = setInterval(() => this.refreshSession(), POLL_INTERVAL_MS);
  },

  stopPolling() {
    if (!this._pollTimer) return;
    clearInterval(this._pollTimer);
    this._pollTimer = null;
  }
});
