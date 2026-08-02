const { callRpc } = require('../../utils/request');
const { getNavigationLayout } = require('../../utils/navigation');

function formatTime(time) {
  if (!time) return '刚刚';
  const timestamp = new Date(time).getTime();
  if (!Number.isFinite(timestamp)) return '刚刚';
  const diff = Math.max(0, Date.now() - timestamp);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
  const date = new Date(timestamp);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

function formatViewCount(value) {
  const count = Number(value || 0);
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

const CATEGORY_NAMES = {
  education: '教育学习',
  career: '职业发展',
  lifestyle: '生活服务',
  hobbies: '兴趣技能'
};

Page({
  data: {
    navLayout: getNavigationLayout(),
    loading: true,
    list: [],
    error: '',
    currentCity: '深圳',
    activeFeed: 'questions',
    categories: [
      { id: 'education', name: '教育学习', short: '学', tone: 'blue' },
      { id: 'career', name: '职业发展', short: '职', tone: 'green' },
      { id: 'lifestyle', name: '生活服务', short: '生', tone: 'orange' },
      { id: 'hobbies', name: '兴趣技能', short: '技', tone: 'pink' }
    ],
    hotTopics: [
      {
        id: 'demo-topic-1',
        eyebrow: '热榜专题',
        short: 'UK',
        title: '留学申请季交流空间',
        desc: '把申请时间线、文书经验和 offer 节奏整理成一份更容易执行的参考专题。',
        watching: 128,
        comments: 3,
        tone: 'indigo'
      },
      {
        id: 'demo-topic-2',
        eyebrow: '热榜专题',
        short: 'JOB',
        title: '大学生灵活就业圈',
        desc: '聚焦副业、灵活就业和校内外项目实践，快速了解真实经验。',
        watching: 96,
        comments: 2,
        tone: 'teal'
      }
    ],
    experts: [
      { id: 'demo-expert-1', name: '留学顾问 Luna', initial: 'L', role: '英国硕士申请与文书规划', tags: ['留学申请', '文书'], response: '98%' },
      { id: 'demo-expert-2', name: '求职教练 Shawn', initial: 'S', role: '简历优化与模拟面试', tags: ['求职', '面试'], response: '96%' }
    ]
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    const tabBar = typeof this.getTabBar === 'function' ? this.getTabBar() : null;
    if (tabBar) tabBar.setData({ selected: 0 });
    this.setData({ currentCity: wx.getStorageSync('currentCity') || '深圳' });
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
        created_at_text: formatTime(item.created_at),
        asker_name: item.profile_nickname || '新用户',
        asker_initial: (item.profile_nickname || '新').slice(0, 1),
        category_label: CATEGORY_NAMES[item.category] || item.category || '经验求助',
        view_count_text: formatViewCount(item.view_count),
        reward_points_text: String(item.reward_points || 0)
      }));
      this.setData({ list: normalized, loading: false });
    } catch (error) {
      this.setData({ loading: false, error: error.message || '加载失败' });
    }
  },

  goDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/question-detail/index?id=${id}` });
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/index' });
  },

  switchFeed(event) {
    const { feed } = event.currentTarget.dataset;
    if (feed !== 'questions' && feed !== 'experts') return;
    this.setData({ activeFeed: feed });
  },

  openCategory(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/channel/index?id=${id}` });
  },

  openTopic(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` });
  },

  openFirstTopic() {
    const first = this.data.hotTopics[0];
    if (first) wx.navigateTo({ url: `/pages/topic-detail/index?id=${first.id}` });
  },

  openExpert(event) {
    wx.navigateTo({ url: `/pages/expert-detail/index?id=${event.currentTarget.dataset.id}` });
  },

  goAsk(event) {
    const expertName = event && event.currentTarget
      ? event.currentTarget.dataset.expertName
      : '';
    const suffix = expertName ? `?expertName=${encodeURIComponent(expertName)}` : '';
    wx.navigateTo({ url: `/pages/ask/index${suffix}` });
  },

  goNotifications() {
    wx.setStorageSync('messagesPreferredSegment', 'notice');
    wx.switchTab({ url: '/pages/messages/index' });
  },

  goCitySelector() {
    wx.navigateTo({ url: '/pages/city-selector/index' });
  }
});
