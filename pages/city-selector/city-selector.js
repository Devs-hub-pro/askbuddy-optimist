
Page({
  data: {
    allCities: {
      'A': ['安徽', '澳门', '阿坝藏族羌族自治州', '阿克苏地区', '阿拉尔', '阿拉善盟', '阿勒泰地区', '阿里地区', '安康'],
      'B': ['北京', '保定', '包头', '宝鸡', '巴彦淖尔', '巴音郭楞', '百色', '白城', '白山', '白银'],
      'C': ['重庆', '成都', '长沙', '长春', '常州', '沧州', '长治', '常德', '昌吉', '昌都'],
      'D': ['大连', '东莞', '大庆', '大同', '丹东', '德阳', '德州', '东营', '定西', '迪庆'],
      'F': ['佛山', '福州', '抚顺', '阜阳', '抚州', '防城港', '阜新'],
      'G': ['广州', '贵阳', '桂林', '赣州', '甘南', '广安', '广元', '贵港', '果洛'],
      'H': ['杭州', '合肥', '哈尔滨', '海口', '邯郸', '呼和浩特', '淮安', '黄冈', '黄山', '衡阳'],
      'J': ['济南', '吉林', '江门', '嘉兴', '金华', '锦州', '焦作', '晋中', '晋城', '荆州'],
      'K': ['昆明', '开封', '喀什', '克拉玛依', '克孜勒苏'],
      'L': ['兰州', '廊坊', '临沂', '柳州', '洛阳', '连云港', '丽水', '丽江', '六安', '龙岩'],
      'M': ['绵阳', '梅州', '茂名', '眉山', '牡丹江'],
      'N': ['南京', '宁波', '南昌', '南宁', '南通', '南阳', '南充', '内江', '宁德', '怒江'],
      'Q': ['青岛', '泉州', '秦皇岛', '清远', '七台河', '齐齐哈尔', '钦州', '曲靖', '衢州'],
      'S': ['上海', '深圳', '苏州', '沈阳', '石家庄', '绍兴', '汕头', '三亚', '商丘', '宿迁'],
      'T': ['天津', '太原', '唐山', '泰州', '泰安', '铜仁', '台州', '铁岭', '通辽', '铜川'],
      'W': ['武汉', '无锡', '温州', '乌鲁木齐', '潍坊', '威海', '芜湖', '梧州', '乌兰察布', '乌海'],
      'X': ['西安', '厦门', '徐州', '西宁', '襄阳', '湘潭', '咸阳', '孝感', '邢台', '新乡'],
      'Y': ['烟台', '银川', '岳阳', '宜昌', '扬州', '盐城', '阳江', '延安', '榆林', '玉林'],
      'Z': ['郑州', '珠海', '中山', '遵义', '淄博', '张家口', '株洲', '漳州', '湛江', '肇庆']
    },
    alphabet: ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'Q', 'S', 'T', 'W', 'X', 'Y', 'Z'],
    hotCities: ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '南京', '武汉', '宁波', '天津', '重庆'],
    scrollIntoView: '',
    currentCity: '',
    recentCities: [],
    searchKeyword: '',
    filteredCities: []
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
  },
  
  onSearchInput: function(e) {
    const keyword = e.detail.value.trim();
    
    this.setData({
      searchKeyword: keyword
    });
    
    if (keyword) {
      this.searchCities(keyword);
    } else {
      this.setData({
        filteredCities: []
      });
    }
  },
  
  searchCities: function(keyword) {
    // 汇总所有城市
    let allCityList = [];
    Object.values(this.data.allCities).forEach(cities => {
      allCityList = allCityList.concat(cities);
    });
    
    // 搜索匹配的城市
    const filtered = allCityList.filter(city => city.includes(keyword));
    
    this.setData({
      filteredCities: filtered
    });
  },
  
  clearSearch: function() {
    this.setData({
      searchKeyword: '',
      filteredCities: []
    });
  }
})
