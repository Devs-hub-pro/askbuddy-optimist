const { callRpc } = require('../../utils/request');

function formatTime(time) {
  if (!time) return '';
  return String(time).replace('T', ' ').slice(0, 16);
}

Page({
  data: {
    loading: true,
    list: [],
    error: ''
  },

  onLoad() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().finally(() => wx.stopPullDownRefresh());
  },

  onShareAppMessage() {
    return {
      title: 'AskBuddy 首页',
      path: '/pages/home/index'
    };
  },

  async loadData() {
    this.setData({ loading: true, error: '' });
    try {
      const list = await callRpc('fetchHomeFeed');
      const normalized = (Array.isArray(list) ? list : []).map((item) => ({
        ...item,
        created_at_text: formatTime(item.created_at)
      }));
      this.setData({ list: normalized, loading: false });
    } catch (error) {
      this.setData({ loading: false, error: error.message || '加载失败' });
    }
  },

  goDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/question-detail/index?id=${id}` });
  }
});
