const STORAGE_TOKEN_KEY = 'ab_auth_token';

App({
  globalData: {
    designTokens: {
      colorBg: '#F8FDFB',
      colorCard: '#FFFFFF',
      colorPrimary: '#79D5C7',
      colorPrimaryStrong: '#49AA9B',
      colorPrimarySoft: '#ECFBF7',
      colorText: '#1E293B',
      colorTextMuted: '#64748B',
      colorBorder: '#CDEFE7'
    },
    authToken: '',
    currentUser: null,
    safeAreaBottom: 0,
    statusBarHeight: 0,
    platform: '',
    // Mock 只能显式开启，staging 请求失败时不伪装为真实数据。
    useMock: false,
    conflictPolicy: 'A'
  },

  onLaunch() {
    this.initSafeArea();
    this.restoreToken();
  },

  initSafeArea() {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : {};
    const deviceInfo = wx.getDeviceInfo ? wx.getDeviceInfo() : {};
    const safeArea = windowInfo.safeArea || null;
    const screenHeight = windowInfo.screenHeight || windowInfo.windowHeight || 0;
    const safeAreaBottom = safeArea ? Math.max(0, screenHeight - safeArea.bottom) : 0;
    this.globalData.safeAreaBottom = safeAreaBottom;
    this.globalData.statusBarHeight = windowInfo.statusBarHeight || 0;
    this.globalData.platform = deviceInfo.platform || '';
  },

  restoreToken() {
    const token = wx.getStorageSync(STORAGE_TOKEN_KEY);
    if (token) {
      this.globalData.authToken = token;
    }
  },

  setAuthToken(token) {
    this.globalData.authToken = token;
    wx.setStorageSync(STORAGE_TOKEN_KEY, token);
  },

  clearAuthToken() {
    this.globalData.authToken = '';
    this.globalData.currentUser = null;
    wx.removeStorageSync(STORAGE_TOKEN_KEY);
  },

  setCurrentUser(user) {
    this.globalData.currentUser = user;
  }
});
