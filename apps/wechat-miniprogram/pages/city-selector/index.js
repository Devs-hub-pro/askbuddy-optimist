const { getNavigationLayout } = require('../../utils/navigation');

Page({
  data: {
    navLayout: getNavigationLayout(),
    currentCity: '深圳',
    activeRegion: 'mainland',
    keyword: '',
    mainland: ['深圳', '北京', '上海', '广州', '杭州', '成都', '南京', '武汉'],
    overseas: ['伦敦', '纽约', '新加坡', '东京', '悉尼', '多伦多'],
    filteredMainland: [],
    filteredOverseas: []
  },

  onLoad() {
    this.setData({
      currentCity: wx.getStorageSync('currentCity') || '深圳',
      filteredMainland: this.data.mainland,
      filteredOverseas: this.data.overseas
    });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) return wx.navigateBack();
    wx.switchTab({ url: '/pages/home/index' });
  },

  switchRegion(event) {
    this.setData({ activeRegion: event.currentTarget.dataset.region });
  },

  onSearchInput(event) {
    const keyword = event.detail.value.trim();
    const filter = (items) => items.filter((city) => !keyword || city.includes(keyword));
    this.setData({
      keyword,
      filteredMainland: filter(this.data.mainland),
      filteredOverseas: filter(this.data.overseas)
    });
  },

  chooseCity(event) {
    const currentCity = event.currentTarget.dataset.city;
    wx.setStorageSync('currentCity', currentCity);
    this.setData({ currentCity });
    wx.showToast({ title: `已切换到${currentCity}`, icon: 'none' });
    setTimeout(() => wx.navigateBack(), 300);
  }
});
