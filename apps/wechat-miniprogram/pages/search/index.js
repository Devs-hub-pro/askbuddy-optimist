const { callRpc } = require('../../utils/request');
const { getNavigationLayout } = require('../../utils/navigation');

const SEARCH_TYPES = ['all', 'question', 'expert', 'skill', 'post'];

Page({
  data: {
    navLayout: getNavigationLayout(),
    keyword: '',
    loading: false,
    activeType: 'all',
    hasSearched: false,
    hotKeywords: ['考研', '留学', '求职', '简历', '面试', '论文', '英语', '健身'],
    resultBag: {
      question: [],
      expert: [],
      skill: [],
      post: []
    },
    error: ''
  },

  onLoad(options = {}) {
    const keyword = options.keyword ? decodeURIComponent(options.keyword) : '';
    if (!keyword) return;
    this.setData({ keyword, hasSearched: true });
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
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      this.setData({ hasSearched: false, error: '' });
      return;
    }
    this.setData({ hasSearched: true });
    this.runSearch();
  },

  chooseHotKeyword(event) {
    const { keyword } = event.currentTarget.dataset;
    this.setData({ keyword, hasSearched: true });
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
        question: (Array.isArray(resultBag.question) ? resultBag.question : []).map((item) => ({
          ...item,
          content: item.content || item.description || '',
          category_label: item.category || item.category_slug || '经验求助',
          view_count_text: String(item.view_count || 0)
        })),
        expert: (Array.isArray(resultBag.expert) ? resultBag.expert : []).map((item, index) => ({
          ...item,
          result_key: String(item.id || item.user_id || `expert-${index}`),
          initial: (item.nickname || item.title || '达').slice(0, 1),
          verified: item.is_verified === true || ['verified', 'approved'].includes(item.verification_status)
        })),
        skill: (Array.isArray(resultBag.skill) ? resultBag.skill : []).map((item, index) => ({
          ...item,
          result_key: String(item.id || item.expert_id || `skill-${index}`)
        })),
        post: (Array.isArray(resultBag.post) ? resultBag.post : []).map((item, index) => ({
          ...item,
          result_key: String(item.id || `post-${index}`)
        }))
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
  },

  goExpertDetail(event) {
    const { id, type } = event.currentTarget.dataset;
    const source = (this.data.resultBag[type] || []).find((item) => item.result_key === id);
    if (source) wx.setStorageSync('searchSelectedProfile', { type, data: source });
    wx.navigateTo({ url: `/pages/expert-detail/index?id=${encodeURIComponent(id)}&source=search&type=${type}` });
  },

  goPost(event) {
    const id = event.currentTarget.dataset.id;
    const source = this.data.resultBag.post.find((item) => item.result_key === id);
    if (source) wx.setStorageSync('discoverSelectedPost', source);
    wx.switchTab({ url: '/pages/discover/index' });
  },

  showResultGroup(event) {
    const type = event.currentTarget.dataset.type;
    if (!SEARCH_TYPES.includes(type) || type === 'all') return;
    this.setData({ activeType: type });
  },

  goNotifications() {
    wx.setStorageSync('messagesPreferredSegment', 'notice');
    wx.switchTab({ url: '/pages/messages/index' });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
      return;
    }
    wx.switchTab({ url: '/pages/home/index' });
  }
});
