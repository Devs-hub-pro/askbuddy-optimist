
// index.js
Page({
  data: {
    isLoading: true,
    location: "深圳",
    locationMenuOpen: false,
    cities: ['北京', '上海', '广州', '深圳', '杭州'],
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
          name: '王芳',
          avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
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
          name: '张伟',
          avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
        },
        time: '1天前',
        tags: ['职业发展', '路径选择'],
        points: 40
      }
    ],
    activeTab: 'topics'  // 'topics' or 'experts'
  },

  onLoad: function() {
    // Simulate loading
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
    this.setData({
      location: city,
      locationMenuOpen: false
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
    // Implementation for answering would go here
  },

  onSearch: function(e) {
    const value = e.detail.value;
    console.log('Search query:', value);
    // Implementation for search would go here
  },

  onCategorySelect: function(e) {
    const category = e.detail.category;
    console.log('Selected category:', category);
    // Implementation for category selection would go here
  },

  onActivitySelect: function(e) {
    const activity = e.detail.activity;
    console.log('Selected activity:', activity);
    // Implementation for activity selection would go here
  }
})
