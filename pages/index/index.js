
// index.js
Page({
  data: {
    isLoading: true,
    location: "深圳",
    locationMenuOpen: false,
    cities: ['北京', '上海', '广州', '深圳', '杭州'],
    recentCities: [],
    categories: [
      {
        id: 'education',
        name: '教育学习',
        icon: '/assets/icons/graduation-cap.png',
        color: 'bg-app-blue'
      },
      {
        id: 'career',
        name: '职业发展',
        icon: '/assets/icons/briefcase.png',
        color: 'bg-app-green'
      },
      {
        id: 'lifestyle',
        name: '生活服务',
        icon: '/assets/icons/home.png',
        color: 'bg-app-orange'
      },
      {
        id: 'hobbies',
        name: '兴趣技能',
        icon: '/assets/icons/camera.png',
        color: 'bg-app-red'
      }
    ],
    activities: [
      {
        id: '1',
        title: '大学生灵活就业圈',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80'
      },
      {
        id: '2',
        title: '留学申请季交流空间',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80'
      }
    ],
    questions: [
      {
        id: '1',
        title: '高考填报志愿热门问题',
        description: '面对众多院校和专业选择，如何根据自己的分数、兴趣做出最优选择？分享经验...',
        icon: '/assets/icons/graduation-cap.png',
        iconBg: 'bg-blue-100',
        viewCount: '2.5k',
        asker: {
          id: 'user1',
          name: '李明',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        time: '2小时前',
        tags: ['高考', '志愿填报'],
        points: 50,
        answerName: '张老师',
        answerAvatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      {
        id: '2',
        title: '留学申请的必备条件',
        description: '想申请美国Top30名校研究生，除了GPA和语言成绩，还需要准备哪些材料？',
        icon: '/assets/icons/globe.png',
        iconBg: 'bg-green-100',
        viewCount: '1.8k',
        asker: {
          id: 'user2',
          name: '王芳',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        time: '5小时前',
        tags: ['留学', '申请'],
        points: 30,
        answerStatus: 'waiting'
      },
      {
        id: '3',
        title: '如何选择最佳职业路径',
        description: '毕业后是进国企还是私企？如何根据自身情况做出规划？',
        icon: '/assets/icons/briefcase.png',
        iconBg: 'bg-orange-100',
        viewCount: '3.5k',
        asker: {
          id: 'user3',
          name: '张伟',
          avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
        },
        time: '1天前',
        tags: ['职业发展', '路径选择'],
        points: 40
      }
    ],
    activeTab: 'topics',  // 'topics' or 'experts'
    experts: [
      {
        id: 'expert1',
        name: '张老师',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        title: '北大硕士 | 教育规划专家',
        description: '5年高考志愿规划经验，帮助500+学生进入理想大学',
        responseRate: '98%',
        rating: 4.9,
        tags: ['高考规划', '志愿填报', '留学申请']
      },
      {
        id: 'expert2',
        name: '王教授',
        avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
        title: '清华博士 | 计算机科学教授',
        description: '10年教学经验，专注算法与人工智能方向',
        responseRate: '95%',
        rating: 4.8,
        tags: ['计算机科学', '算法', 'AI']
      },
      {
        id: 'expert3',
        name: '李职业顾问',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        title: '资深职业规划师 | 互联网HR',
        description: '帮助200+求职者进入知名企业，简历优化专家',
        responseRate: '90%',
        rating: 4.7,
        tags: ['职业规划', '简历优化', '面试技巧']
      }
    ],
    searchQuery: '',
    searchFocused: false
  },

  onLoad: function() {
    // 从本地存储获取当前城市和最近访问的城市
    const currentCity = wx.getStorageSync('currentCity') || '深圳';
    const recentCities = wx.getStorageSync('recentCities') || [];
    
    this.setData({
      location: currentCity,
      recentCities: recentCities
    });
    
    // 模拟加载
    setTimeout(() => {
      this.setData({
        isLoading: false
      });
    }, 1000);
  },

  toggleLocationMenu: function() {
    this.setData({
      locationMenuOpen: !this.data.locationMenuOpen
    });
  },

  selectLocation: function(e) {
    const city = e.detail.city;
    
    // 更新最近访问的城市列表
    let recentCities = wx.getStorageSync('recentCities') || [];
    // 如果已经存在则移除
    recentCities = recentCities.filter(item => item !== city);
    // 添加到最前面
    recentCities.unshift(city);
    // 最多保留5个
    recentCities = recentCities.slice(0, 5);
    wx.setStorageSync('recentCities', recentCities);
    wx.setStorageSync('currentCity', city);
    
    this.setData({
      location: city,
      locationMenuOpen: false,
      recentCities: recentCities
    });
  },
  
  showCitySelector: function() {
    this.setData({
      locationMenuOpen: false
    });
    wx.navigateTo({
      url: '/pages/city-selector/city-selector'
    });
  },
  
  switchTab: function(e) {
    const tab = e.detail.tab;
    this.setData({
      activeTab: tab
    });
  },

  handleAnswer: function(e) {
    const questionId = e.detail.id;
    wx.showToast({
      title: '即将跳转到回答页面',
      icon: 'none'
    });
    // Navigate to answer page
    wx.navigateTo({
      url: `/pages/question/detail?id=${questionId}`
    });
  },

  handleQuestionClick: function(e) {
    const questionId = e.detail.id;
    // Navigate to question detail page
    wx.navigateTo({
      url: `/pages/question/detail?id=${questionId}`
    });
  },

  handleExpertClick: function(e) {
    const { expertId, expertName, expertAvatar } = e.detail;
    // Navigate to expert profile page
    wx.navigateTo({
      url: `/pages/expert/profile?id=${expertId}&name=${expertName}&avatar=${encodeURIComponent(expertAvatar)}`
    });
  },

  onSearch: function(e) {
    const value = e.detail.value;
    this.setData({
      searchQuery: value
    });
    console.log('Search query:', value);
    
    if (value.trim() !== '') {
      wx.navigateTo({
        url: `/pages/search/results?q=${encodeURIComponent(value)}`
      });
    }
  },

  onSearchFocus: function() {
    this.setData({
      searchFocused: true
    });
  },

  onSearchBlur: function() {
    this.setData({
      searchFocused: false
    });
  },

  onCategorySelect: function(e) {
    const category = e.detail.category;
    console.log('Selected category:', category);
    // Navigate to category page
    wx.navigateTo({
      url: `/pages/category/detail?id=${category.id}`
    });
  },

  onActivitySelect: function(e) {
    const activity = e.detail.activity;
    console.log('Selected activity:', activity);
    // Navigate to activity page
    wx.navigateTo({
      url: `/pages/activity/detail?id=${activity.id}`
    });
  }
})
