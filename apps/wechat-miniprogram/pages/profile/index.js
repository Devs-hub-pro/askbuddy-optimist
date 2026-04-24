Page({
  data: {
    user: null,
    authToken: ''
  },

  onLoad() {
    this.syncUser();
  },

  onShow() {
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

      const profileRes = await wx.getUserProfile({ desc: '用于完善用户资料' });
      const app = getApp();
      app.setAuthToken(`mock_token_${Date.now()}`);
      app.setCurrentUser({
        nickName: profileRes.userInfo.nickName,
        avatarUrl: profileRes.userInfo.avatarUrl
      });
      this.syncUser();
      wx.showToast({ title: '登录成功', icon: 'success' });
    } catch (error) {
      wx.showToast({ title: error.message || '登录失败', icon: 'none' });
    }
  },

  logout() {
    const app = getApp();
    app.clearAuthToken();
    this.syncUser();
    wx.showToast({ title: '已退出登录', icon: 'none' });
  }
});
