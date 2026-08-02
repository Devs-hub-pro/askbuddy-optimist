const { callRpc } = require('../../utils/request');
const { getNavigationLayout } = require('../../utils/navigation');

function formatTime(time) {
  if (!time) return '';
  return String(time).replace('T', ' ').slice(0, 16);
}

Page({
  data: {
    navLayout: getNavigationLayout(),
    loading: true,
    list: [],
    filteredList: [],
    unreadCount: 0,
    error: '',
    activeSegment: 'notice',
    searchOpen: false,
    searchKeyword: '',
    conversations: [
      {
        partnerId: 'demo-user-expert-1',
        expertId: 'demo-expert-1',
        name: '留学顾问 Luna',
        initial: 'L',
        message: '可以先按申请轮次倒推，我帮你梳理基础时间线。',
        time: '18 分钟前',
        unread: 2
      },
      {
        partnerId: 'demo-user-expert-2',
        expertId: 'demo-expert-2',
        name: '求职教练 Shawn',
        initial: 'S',
        message: '我看了你的简历，项目描述还可以再量化一点。',
        time: '3 小时前',
        unread: 0
      }
    ],
    filteredConversations: []
  },

  onLoad() {
    this.setData({ filteredConversations: this.data.conversations });
  },

  onShow() {
    const preferred = wx.getStorageSync('messagesPreferredSegment');
    if (preferred === 'private' || preferred === 'notice') {
      this.setData({ activeSegment: preferred });
      wx.removeStorageSync('messagesPreferredSegment');
    }
    const tabBar = typeof this.getTabBar === 'function' ? this.getTabBar() : null;
    if (tabBar) tabBar.setData({ selected: 3 });
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
        created_at_text: formatTime(item.created_at),
        type_label: this.getNotificationLabel(item.type),
        icon_text: this.getNotificationIcon(item.type)
      }));

      this.setData({
        loading: false,
        list: normalized,
        filteredList: normalized,
        unreadCount: Number(unreadCount || 0)
      });
      const tabBar = typeof this.getTabBar === 'function' ? this.getTabBar() : null;
      if (tabBar) tabBar.setData({ unreadCount: Number(unreadCount || 0) });
    } catch (error) {
      this.setData({ loading: false, error: error.message || '加载失败' });
    }
  },

  getNotificationLabel(type) {
    const labels = {
      answer: '回答通知',
      system: '系统通知',
      like: '互动提醒',
      follow: '关注提醒'
    };
    return labels[type] || '消息通知';
  },

  getNotificationIcon(type) {
    const icons = {
      answer: '答',
      system: '系',
      like: '赞',
      follow: '关'
    };
    return icons[type] || '讯';
  },

  switchSegment(event) {
    const { segment } = event.currentTarget.dataset;
    if (segment !== 'private' && segment !== 'notice') return;
    this.setData({ activeSegment: segment });
  },

  goCallPage(event) {
    const calleeId = event.currentTarget.dataset.calleeId || '';
    const calleeName = event.currentTarget.dataset.calleeName || '';
    const query = calleeId
      ? `?calleeId=${encodeURIComponent(calleeId)}&calleeName=${encodeURIComponent(calleeName)}&mode=voice`
      : '';
    wx.navigateTo({ url: `/pages/call/index${query}` });
  },

  showSearch() {
    const searchOpen = !this.data.searchOpen;
    this.setData({ searchOpen, searchKeyword: searchOpen ? this.data.searchKeyword : '' }, () => this.applySearch());
  },

  onSearchInput(event) {
    this.setData({ searchKeyword: event.detail.value }, () => this.applySearch());
  },

  applySearch() {
    const keyword = this.data.searchKeyword.trim().toLowerCase();
    const matches = (value) => !keyword || String(value || '').toLowerCase().includes(keyword);
    this.setData({
      filteredList: this.data.list.filter((item) => matches(`${item.title || ''} ${item.content || ''}`)),
      filteredConversations: this.data.conversations.filter((item) => matches(`${item.name} ${item.message}`))
    });
  },

  openChat(event) {
    const { partnerId, expertId } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/chat-detail/index?partnerId=${partnerId}&expertId=${expertId}` });
  },

  openRelated(event) {
    const { relatedId, relatedType } = event.currentTarget.dataset;
    if (relatedType === 'question' && relatedId) {
      wx.navigateTo({ url: `/pages/question-detail/index?id=${relatedId}` });
      return;
    }
    wx.showToast({ title: '该通知暂无可打开的详情', icon: 'none' });
  }
});
