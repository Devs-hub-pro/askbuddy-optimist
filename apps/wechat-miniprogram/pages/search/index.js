const { callRpc } = require('../../utils/request');

Page({
  data: {
    keyword: '',
    loading: false,
    list: [],
    error: ''
  },

  onLoad() {
    this.runSearch();
  },

  onPullDownRefresh() {
    this.runSearch().finally(() => wx.stopPullDownRefresh());
  },

  onShareAppMessage() {
    return {
      title: 'AskBuddy 搜索',
      path: '/pages/search/index'
    };
  },

  onKeywordInput(event) {
    this.setData({ keyword: event.detail.value });
  },

  onConfirmSearch() {
    this.runSearch();
  },

  async runSearch() {
    this.setData({ loading: true, error: '' });
    try {
      const list = await callRpc('fetchSearchResult', { keyword: this.data.keyword.trim() });
      this.setData({ list, loading: false });
    } catch (error) {
      this.setData({ loading: false, error: error.message || '搜索失败' });
    }
  },

  goDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/question-detail/index?id=${id}` });
  }
});
