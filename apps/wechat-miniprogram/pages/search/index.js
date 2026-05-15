const { callRpc } = require('../../utils/request');

const SEARCH_TYPES = ['question', 'expert', 'skill', 'post'];

Page({
  data: {
    keyword: '',
    loading: false,
    activeType: 'question',
    resultBag: {
      question: [],
      expert: [],
      skill: [],
      post: []
    },
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

  switchType(event) {
    const { type } = event.currentTarget.dataset;
    if (!SEARCH_TYPES.includes(type)) return;
    this.setData({ activeType: type });
  },

  getActiveList(resultBag, activeType) {
    if (!resultBag || !activeType) return [];
    return Array.isArray(resultBag[activeType]) ? resultBag[activeType] : [];
  },

  async runSearch() {
    this.setData({ loading: true, error: '' });
    try {
      const resultBag = await callRpc('searchContent', { keyword: this.data.keyword.trim() });
      const normalized = {
        question: Array.isArray(resultBag.question) ? resultBag.question : [],
        expert: Array.isArray(resultBag.expert) ? resultBag.expert : [],
        skill: Array.isArray(resultBag.skill) ? resultBag.skill : [],
        post: Array.isArray(resultBag.post) ? resultBag.post : []
      };
      this.setData({
        resultBag: normalized,
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false, error: error.message || '搜索失败' });
    }
  },

  goQuestionDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/question-detail/index?id=${id}` });
  }
});
