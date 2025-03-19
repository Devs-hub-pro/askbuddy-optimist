
Page({
  data: {
    allCities: {
      'A': ['安徽', '澳门'],
      'B': ['北京', '保定', '包头'],
      'C': ['重庆', '成都', '长沙', '长春'],
      'D': ['大连', '东莞', '大庆'],
      'F': ['佛山', '福州', '抚顺'],
      'G': ['广州', '贵阳', '桂林'],
      'H': ['杭州', '合肥', '哈尔滨', '海口'],
      'J': ['济南', '吉林', '江门'],
      'K': ['昆明', '开封'],
      'L': ['兰州', '廊坊', '临沂'],
      'M': ['绵阳', '梅州'],
      'N': ['南京', '宁波', '南昌', '南宁'],
      'Q': ['青岛', '泉州', '秦皇岛'],
      'S': ['上海', '深圳', '苏州', '沈阳', '石家庄'],
      'T': ['天津', '太原', '唐山'],
      'W': ['武汉', '无锡', '温州', '乌鲁木齐'],
      'X': ['西安', '厦门', '徐州', '西宁'],
      'Y': ['烟台', '银川', '岳阳'],
      'Z': ['郑州', '珠海', '中山', '遵义']
    },
    alphabet: ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'Q', 'S', 'T', 'W', 'X', 'Y', 'Z'],
    hotCities: ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都', '重庆', '西安'],
    scrollIntoView: '',
    currentCity: '',
    recentCities: []
  },

  onLoad: function(options) {
    // 从缓存获取当前城市和最近访问的城市
    const currentCity = wx.getStorageSync('currentCity') || '深圳';
    const recentCities = wx.getStorageSync('recentCities') || [];
    
    this.setData({
      currentCity,
      recentCities
    });
  },

  scrollToSection: function(e) {
    const alphabet = e.currentTarget.dataset.alphabet;
    this.setData({
      scrollIntoView: `section-${alphabet}`
    });
  },

  selectCity: function(e) {
    const city = e.currentTarget.dataset.city;
    
    // 保存当前选择的城市
    wx.setStorageSync('currentCity', city);
    
    // 更新最近访问的城市列表
    let recentCities = wx.getStorageSync('recentCities') || [];
    // 如果已经存在则移除
    recentCities = recentCities.filter(item => item !== city);
    // 添加到最前面
    recentCities.unshift(city);
    // 最多保留5个
    recentCities = recentCities.slice(0, 5);
    wx.setStorageSync('recentCities', recentCities);
    
    // 返回上一页并传递选择的城市
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    // 调用上一个页面的方法
    prevPage.setData({
      location: city,
      locationMenuOpen: false,
      recentCities: recentCities
    });
    
    wx.navigateBack();
  },

  useCurrentLocation: function() {
    // 实际应用中这里应该调用微信的地理位置API
    wx.showLoading({
      title: '定位中...',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '定位成功',
        icon: 'success'
      });
      this.selectCity({
        currentTarget: {
          dataset: {
            city: '深圳'
          }
        }
      });
    }, 1000);
  }
})
