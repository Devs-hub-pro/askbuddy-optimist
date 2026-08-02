const { callRpc } = require('../../utils/request');
const { getChannel, getExpertsByCategory } = require('../../utils/ui-catalog');
const { getNavigationLayout } = require('../../utils/navigation');

function formatTime(time) {
  if (!time) return '刚刚';
  const timestamp = new Date(time).getTime();
  if (!Number.isFinite(timestamp)) return '刚刚';
  const diff = Math.max(0, Date.now() - timestamp);
  if (diff < 60 * 60 * 1000) return `${Math.max(1, Math.floor(diff / 60000))} 分钟前`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} 小时前`;
  return `${Math.floor(diff / 86400000)} 天前`;
}

function includesKeyword(item, keywords) {
  if (!keywords || !keywords.length) return true;
  const text = `${item.title || ''} ${item.content || ''} ${item.category || ''}`.toLowerCase();
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function normalizeQuestion(item, channel) {
  return {
    ...item,
    asker_name: item.profile_nickname || '新用户',
    asker_initial: (item.profile_nickname || '新').slice(0, 1),
    created_at_text: formatTime(item.created_at),
    view_count_text: String(item.view_count || 0),
    reward_points_text: String(item.reward_points || 0),
    category_label: channel.name
  };
}

Page({
  data: {
    navLayout: getNavigationLayout(),
    loading: true,
    error: '',
    showingExamples: false,
    channel: getChannel('education'),
    activeCategory: 'all',
    activeFeed: 'questions',
    allQuestions: [],
    questions: [],
    experts: []
  },

  onLoad(options) {
    const channel = getChannel(options.id || 'education');
    this.setData({ channel, experts: getExpertsByCategory(channel.id) });
    wx.setNavigationBarTitle({ title: channel.name });
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().finally(() => wx.stopPullDownRefresh());
  },

  onShareAppMessage() {
    return {
      title: `${this.data.channel.name} - 问问`,
      path: `/pages/channel/index?id=${this.data.channel.id}`
    };
  },

  async loadData() {
    this.setData({ loading: true, error: '' });
    try {
      const list = await callRpc('fetchHomeFeed');
      const channel = this.data.channel;
      const remote = (Array.isArray(list) ? list : []).filter((item) => {
        const category = String(item.category || '');
        return channel.categoryAliases.includes(category) || includesKeyword(item, channel.keywords);
      });
      const merged = remote.slice();
      channel.fallbackQuestions.forEach((item) => {
        if (!merged.some((question) => question.id === item.id)) merged.push(item);
      });
      const allQuestions = merged.map((item) => normalizeQuestion(item, channel));
      this.setData({ allQuestions, loading: false, showingExamples: false });
      this.applyFilter();
    } catch (error) {
      const allQuestions = this.data.channel.fallbackQuestions.map((item) => normalizeQuestion(item, this.data.channel));
      this.setData({ allQuestions, loading: false, error: error.message || '加载失败', showingExamples: true });
      this.applyFilter();
    }
  },

  applyFilter() {
    const active = this.data.channel.subcategories.find((item) => item.id === this.data.activeCategory);
    const questions = !active || active.id === 'all'
      ? this.data.allQuestions
      : this.data.allQuestions.filter((item) => includesKeyword(item, active.keywords));
    this.setData({ questions });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) return wx.navigateBack();
    wx.switchTab({ url: '/pages/home/index' });
  },

  goSearch() {
    wx.navigateTo({
      url: `/pages/search/index?channel=${this.data.channel.id}&keyword=${encodeURIComponent(this.data.channel.name)}`
    });
  },

  goNotifications() {
    wx.setStorageSync('messagesPreferredSegment', 'notice');
    wx.switchTab({ url: '/pages/messages/index' });
  },

  openFeatured() {
    wx.navigateTo({ url: `/pages/topic-detail/index?id=${this.data.channel.featured.topicId}` });
  },

  selectCategory(event) {
    this.setData({ activeCategory: event.currentTarget.dataset.id }, () => this.applyFilter());
  },

  switchFeed(event) {
    this.setData({ activeFeed: event.currentTarget.dataset.feed });
  },

  openQuestion(event) {
    const suffix = this.data.showingExamples ? '&source=preview' : '';
    wx.navigateTo({ url: `/pages/question-detail/index?id=${event.currentTarget.dataset.id}${suffix}` });
  },

  openExpert(event) {
    wx.navigateTo({ url: `/pages/expert-detail/index?id=${event.currentTarget.dataset.id}` });
  },

  goAsk() {
    wx.navigateTo({ url: `/pages/ask/index?category=${this.data.channel.id}` });
  }
});
