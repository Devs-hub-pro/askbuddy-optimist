const STORAGE_TOKEN_KEY = 'ab_auth_token';

App({
  globalData: {
    designTokens: {
      colorBg: '#F7FAF8',
      colorCard: '#FFFFFF',
      colorPrimary: '#18A058',
      colorText: '#1F2937',
      colorTextMuted: '#6B7280',
      colorBorder: '#E5E7EB'
    },
    authToken: '',
    currentUser: null,
    safeAreaBottom: 0,
    useMock: true,
    conflictPolicy: 'A'
  },

  onLaunch() {
    this.initSafeArea();
    this.restoreToken();
  },

  initSafeArea() {
    const systemInfo = wx.getSystemInfoSync();
    const safeArea = systemInfo.safeArea || null;
    const safeAreaBottom = safeArea ? Math.max(0, systemInfo.screenHeight - safeArea.bottom) : 0;
    this.globalData.safeAreaBottom = safeAreaBottom;
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
