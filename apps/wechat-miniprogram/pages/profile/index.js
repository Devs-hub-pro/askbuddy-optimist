const { getNavigationLayout } = require('../../utils/navigation');

Page({
  data: {
    navLayout: getNavigationLayout(),
    user: null,
    authToken: '',
    stats: [
      { key: 'orders', label: '订单', value: 0 },
      { key: 'answers', label: '回答', value: 0 },
      { key: 'favorites', label: '收藏', value: 0 },
      { key: 'following', label: '关注', value: 0 }
    ],
    commonActions: [
      { key: 'earnings', label: '我的收益', short: '益', tone: 'gold' },
      { key: 'community', label: '我的社群', short: '群', tone: 'blue' },
      { key: 'drafts', label: '草稿箱', short: '稿', tone: 'mint' },
      { key: 'verify', label: '达人认证', short: '认', tone: 'orange' }
    ],
    helpItems: [
      { key: 'help', title: '帮助中心', desc: '常见问题和使用说明', short: '?' },
      { key: 'rules', title: '问问规范', desc: '查看发帖和互动规则', short: '规' },
      { key: 'feedback', title: '产品反馈', desc: '告诉我们你的建议', short: '信' },
      { key: 'about', title: '关于问问', desc: '版本信息与服务说明', short: '问' }
    ]
  },

  onLoad() {
    this.syncUser();
  },

  onShow() {
    const tabBar = typeof this.getTabBar === 'function' ? this.getTabBar() : null;
    if (tabBar) tabBar.setData({ selected: 4 });
    this.syncUser();
  },

  onPullDownRefresh() {
    this.syncUser();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return {
      title: 'AskBuddy 我的',
      path: '/pages/profile/index'
    };
  },

  syncUser() {
    const app = getApp();
    this.setData({
      user: app.globalData.currentUser,
      authToken: app.globalData.authToken
    });
  },

  async login() {
    try {
      const loginRes = await wx.login();
      if (!loginRes.code) {
        throw new Error('获取登录凭证失败');
      }

      wx.showModal({
        title: '登录服务接入中',
        content: '已取得微信授权凭证，但账号服务尚未完成接入。本次不会创建或保存模拟登录状态。',
        showCancel: false
      });
    } catch (error) {
      wx.showToast({ title: error.message || '登录失败', icon: 'none' });
    }
  },

  logout() {
    const app = getApp();
    app.clearAuthToken();
    this.syncUser();
    wx.showToast({ title: '已退出登录', icon: 'none' });
  },

  openSettings() {
    wx.navigateTo({ url: '/pages/profile-section/index?key=settings&title=设置' });
  },

  openMenu(event) {
    const { key, label } = event.currentTarget.dataset;
    const publicKeys = ['drafts', 'help', 'rules', 'feedback', 'about', 'settings'];
    if (!this.data.authToken && !publicKeys.includes(key)) {
      this.login();
      return;
    }
    wx.navigateTo({ url: `/pages/profile-section/index?key=${key}&title=${encodeURIComponent(label)}` });
  },

  openEdit() {
    wx.navigateTo({ url: '/pages/profile-section/index?key=edit&title=编辑资料' });
  }
});
