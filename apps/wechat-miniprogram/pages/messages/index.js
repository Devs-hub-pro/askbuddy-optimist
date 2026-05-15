const { callRpc } = require('../../utils/request');

function formatTime(time) {
  if (!time) return '';
  return String(time).replace('T', ' ').slice(0, 16);
}

Page({
  data: {
    loading: true,
    list: [],
    unreadCount: 0,
    error: ''
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().finally(() => wx.stopPullDownRefresh());
  },

  onShareAppMessage() {
    return {
      title: 'AskBuddy 通知',
      path: '/pages/messages/index'
    };
  },

  async loadData() {
    this.setData({ loading: true, error: '' });
    try {
      const [list, unreadCount] = await Promise.all([
        callRpc('fetchNotificationList'),
        callRpc('fetchUnreadNotificationCount')
      ]);

      const normalized = (Array.isArray(list) ? list : []).map((item) => ({
        ...item,
        created_at_text: formatTime(item.created_at)
      }));

      this.setData({
        loading: false,
        list: normalized,
        unreadCount: Number(unreadCount || 0)
      });
    } catch (error) {
      this.setData({ loading: false, error: error.message || '加载失败' });
    }
  },


  goCallPage() {
    wx.navigateTo({ url: '/pages/call/index' });
  },

  openRelated(event) {
    const { relatedId, relatedType } = event.currentTarget.dataset;
    if (relatedType === 'question' && relatedId) {
      wx.navigateTo({ url: `/pages/question-detail/index?id=${relatedId}` });
    }
  }
});
