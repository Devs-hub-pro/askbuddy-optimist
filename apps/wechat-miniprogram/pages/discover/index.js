const { callRpc } = require('../../utils/request');
const { getNavigationLayout } = require('../../utils/navigation');

Page({
  data: {
    navLayout: getNavigationLayout(),
    loading: true,
    list: [],
    displayList: [],
    error: '',
    previewMode: true,
    activeChannel: 'recommended',
    activeSort: 'latest',
    selectedPost: null,
    postDetailVisible: false,
    topicTags: ['留学申请', '简历优化', '租房避坑']
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    const tabBar = typeof this.getTabBar === 'function' ? this.getTabBar() : null;
    if (tabBar) tabBar.setData({ selected: 1, hidden: false });
    const selectedPost = wx.getStorageSync('discoverSelectedPost');
    if (selectedPost) {
      wx.removeStorageSync('discoverSelectedPost');
      if (tabBar) tabBar.setData({ hidden: true });
      this.setData({ selectedPost, postDetailVisible: true });
    }
  },

  onHide() {
    const tabBar = typeof this.getTabBar === 'function' ? this.getTabBar() : null;
    if (tabBar) tabBar.setData({ hidden: false });
  },

  onUnload() {
    const tabBar = typeof this.getTabBar === 'function' ? this.getTabBar() : null;
    if (tabBar) tabBar.setData({ hidden: false });
  },

  onPullDownRefresh() {
    this.loadData().finally(() => wx.stopPullDownRefresh());
  },

  onShareAppMessage() {
    const selected = wx.getStorageSync('discoverSharePost');
    if (selected) wx.removeStorageSync('discoverSharePost');
    return {
      title: selected && selected.content ? selected.content.slice(0, 28) : 'AskBuddy 发现',
      path: '/pages/discover/index'
    };
  },

  async loadData() {
    this.setData({ loading: true, error: '' });
    try {
      const list = await callRpc('fetchDiscoverFeed');
      this.setData({ list: Array.isArray(list) ? list : [], loading: false, previewMode: true }, () => this.applyView());
    } catch (error) {
      this.setData({ loading: false, error: error.message || '加载失败' });
    }
  },

  switchChannel(event) {
    const { channel } = event.currentTarget.dataset;
    if (!['following', 'recommended', 'nearby'].includes(channel)) return;
    this.setData({ activeChannel: channel }, () => this.applyView());
  },

  switchSort(event) {
    const { sort } = event.currentTarget.dataset;
    if (sort !== 'latest' && sort !== 'popular') return;
    this.setData({ activeSort: sort }, () => this.applyView());
  },

  applyView() {
    const currentCity = wx.getStorageSync('currentCity') || '深圳';
    let displayList = this.data.list.slice();
    if (this.data.activeChannel === 'following') displayList = [];
    if (this.data.activeChannel === 'nearby') {
      displayList = displayList.filter((item) => item.city === currentCity || item.city === '同城');
    }
    if (this.data.activeSort === 'popular') {
      displayList.sort((a, b) => {
        const score = (item) => Number(item.likes_count || 0)
          + Number(item.comments_count || 0) * 2
          + Number(item.shares_count || 0) * 2
          + (item.hot ? 100 : 0);
        return score(b) - score(a);
      });
    }
    this.setData({ displayList });
  },

  goAsk() {
    wx.navigateTo({ url: '/pages/post-editor/index' });
  },

  goInteractions() {
    wx.navigateTo({ url: '/pages/discover-interactions/index' });
  },

  prepareShare(event) {
    const selected = this.data.displayList.find((item) => item.id === event.currentTarget.dataset.id);
    if (selected) wx.setStorageSync('discoverSharePost', selected);
  },

  openPost(event) {
    const selectedPost = this.data.displayList.find((item) => String(item.id) === String(event.currentTarget.dataset.id));
    if (selectedPost) {
      const tabBar = typeof this.getTabBar === 'function' ? this.getTabBar() : null;
      if (tabBar) tabBar.setData({ hidden: true });
      this.setData({ selectedPost, postDetailVisible: true });
    }
  },

  closePostDetail() {
    const tabBar = typeof this.getTabBar === 'function' ? this.getTabBar() : null;
    if (tabBar) tabBar.setData({ hidden: false });
    this.setData({ postDetailVisible: false });
  },

  keepPostDetail() {},

  showComposerAction(event) {
    const action = event.currentTarget.dataset.action;
    wx.showToast({ title: `${action}功能正在准备中`, icon: 'none' });
  },

  interact(event) {
    const action = event.currentTarget.dataset.action;
    wx.showToast({ title: `${action}功能暂不可用`, icon: 'none' });
  }
});
