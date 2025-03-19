
// Expert Profile Page
Page({
  data: {
    isLoading: true,
    expert: null,
    activeTab: 'resume', // 'resume', 'answers', 'questions', 'reviews'
    isDescriptionExpanded: false,
    showMessageDialog: false,
    showBookingDialog: false,
    messageText: '',
    selectedTime: '',
    selectedConsultType: 'text', // 'text', 'voice', 'video'
    availableTimes: [
      { id: 'today1', label: '今天 15:00' },
      { id: 'today2', label: '今天 18:00' },
      { id: 'today3', label: '今天 20:00' },
      { id: 'tomorrow1', label: '明天 10:00' },
      { id: 'tomorrow2', label: '明天 14:00' },
      { id: 'tomorrow3', label: '明天 16:00' }
    ],
    reviews: [],
    isFollowing: false
  },

  onLoad: function(options) {
    // Get expert ID from options
    const expertId = options.id;
    const expertName = options.name || '专家用户';
    const expertAvatar = decodeURIComponent(options.avatar) || '/assets/icons/user-avatar.png';
    
    // In a real app, you would fetch expert data from server
    // For demo purposes, use mockup data
    this.setData({
      expert: this.getMockExpertData(expertId, expertName, expertAvatar)
    });

    // Simulate loading state
    setTimeout(() => {
      this.setData({
        isLoading: false,
        reviews: this.getMockReviews()
      });
    }, 1000);
  },

  getMockExpertData: function(id, name, avatar) {
    // Expert data examples based on ID
    const experts = {
      'expert1': {
        id: 'expert1',
        name: '张老师',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        title: '北大硕士 | 教育规划专家',
        description: '5年高考志愿规划经验，帮助500+学生进入理想大学。专注高考志愿填报和留学规划，擅长帮助学生选择最适合自己的专业和院校。我相信每个学生都有自己的闪光点，只要找到合适的方向，就能充分发挥自己的潜力。希望通过我的专业知识和经验，帮助每位学生找到最适合自己的发展路径。',
        topics: ['高考志愿填报', '留学申请规划', '考研择校', '专业选择指导', '自主招生备考'],
        location: '北京',
        responseRate: '98%',
        orderCount: '126单',
        rating: 4.9,
        verified: true,
        education: ['北京大学 | 教育学硕士', '清华大学 | 英语文学学士'],
        experience: ['某知名教育机构 | 高级顾问', '北京大学 | 招生办公室顾问'],
        tags: ['高考规划', '志愿填报', '留学申请']
      },
      'expert2': {
        id: 'expert2',
        name: '王教授',
        avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
        title: '清华博士 | 计算机科学教授',
        description: '10年教学经验，专注算法与人工智能方向。长期研究深度学习和计算机视觉领域，发表论文30+篇，承担多项国家级科研项目。对计算机专业的学科建设和人才培养有深入研究，能够为学生提供专业的学术指导和职业规划建议。',
        topics: ['算法与数据结构', '人工智能入门', '研究生申请指导', '论文写作技巧', '编程语言学习'],
        location: '北京',
        responseRate: '95%',
        orderCount: '210单',
        rating: 4.8,
        verified: true,
        education: ['清华大学 | 计算机科学博士', '浙江大学 | 计算机科学硕士'],
        experience: ['清华大学 | 副教授', '某知名互联网公司 | 技术顾问'],
        tags: ['计算机科学', '算法', 'AI']
      },
      'expert3': {
        id: 'expert3',
        name: '李职业顾问',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        title: '资深职业规划师 | 互联网HR',
        description: '帮助200+求职者进入知名企业，简历优化专家。有多年大型互联网公司HR经验，熟悉各大公司的招聘流程和标准。擅长职业规划、简历优化和面试辅导，对求职者的常见问题和困惑有深入了解，能够提供针对性的解决方案。',
        topics: ['简历优化技巧', '面试常见问题', '职业转型指南', '互联网求职攻略', '薪资谈判策略'],
        location: '深圳',
        responseRate: '90%',
        orderCount: '185单',
        rating: 4.7,
        verified: true,
        education: ['北京大学 | 人力资源管理硕士', '中国人民大学 | 工商管理学士'],
        experience: ['某知名互联网公司 | 高级HR', '猎头公司 | 资深顾问'],
        tags: ['职业规划', '简历优化', '面试技巧']
      },
      'user1': {
        id: 'user1',
        name: '李明',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        title: '应届生 | 考研党',
        description: '正在备战考研，希望能与更多同学交流经验。本科就读于211大学，主修计算机专业，对考研相关话题特别感兴趣。希望通过平台能结识更多志同道合的朋友，一起进步。',
        topics: ['考研经验分享', '计算机专业学习', '大学生活规划'],
        location: '上海',
        responseRate: '85%',
        orderCount: '32单',
        rating: 4.6,
        verified: false,
        education: ['上海某211大学 | 计算机科学学士'],
        experience: ['某科技公司 | 实习生'],
        tags: ['考研', '计算机', '大学生活']
      },
      'user2': {
        id: 'user2',
        name: '王芳',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        title: '留学生 | 海归',
        description: '美国Top30名校硕士毕业，想分享留学申请和海外生活经验。在美国生活学习5年，了解美国文化和教育体系，可以为有留学意向的学生提供建议和指导。',
        topics: ['留学申请材料准备', '海外生活适应', '英语学习方法'],
        location: '广州',
        responseRate: '92%',
        orderCount: '48单',
        rating: 4.8,
        verified: true,
        education: ['美国某Top30大学 | 金融学硕士', '中国某985大学 | 经济学学士'],
        experience: ['某跨国公司 | 分析师'],
        tags: ['留学', '海归', '英语学习']
      },
      'user3': {
        id: 'user3',
        name: '张伟',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
        title: '职场人 | 国企员工',
        description: '国企工作3年，想分享职业发展和规划经验。从应届生到中层管理，积累了一定的职场经验，希望能帮助刚毕业或即将毕业的学生更好地规划自己的职业道路。',
        topics: ['国企vs私企选择', '职业发展规划', '工作与生活平衡'],
        location: '北京',
        responseRate: '88%',
        orderCount: '56单',
        rating: 4.5,
        verified: false,
        education: ['北京某985大学 | 工商管理学士'],
        experience: ['某国企 | 中层管理'],
        tags: ['职业发展', '国企', '职场规划']
      }
    };
    
    // Default to custom data if ID not found
    return experts[id] || {
      id: id || 'custom',
      name: name || '专家用户',
      avatar: avatar || '/assets/icons/user-avatar.png',
      title: '资深用户',
      description: '这位用户很神秘，还没有填写个人介绍。',
      topics: ['话题1', '话题2', '话题3'],
      location: '未知',
      responseRate: '80%',
      orderCount: '10单',
      rating: 4.0,
      verified: false,
      education: ['未填写'],
      experience: ['未填写'],
      tags: ['未知']
    };
  },

  getMockReviews: function() {
    return [
      {
        id: 'review1',
        author: {
          name: '小李',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
        },
        content: '非常专业的解答，对我的问题给予了详细的分析和建议，很有帮助！',
        rating: 5,
        time: '2天前'
      },
      {
        id: 'review2',
        author: {
          name: '小张',
          avatar: 'https://randomuser.me/api/portraits/women/26.jpg'
        },
        content: '回答很及时，内容也很有针对性，解决了我的困惑。',
        rating: 4,
        time: '1周前'
      },
      {
        id: 'review3',
        author: {
          name: '小王',
          avatar: 'https://randomuser.me/api/portraits/men/29.jpg'
        },
        content: '专业知识丰富，解答详细，是个很好的咨询对象。',
        rating: 5,
        time: '2周前'
      }
    ];
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  toggleDescription: function() {
    this.setData({
      isDescriptionExpanded: !this.data.isDescriptionExpanded
    });
  },

  toggleFollow: function() {
    this.setData({
      isFollowing: !this.data.isFollowing
    });
    wx.showToast({
      title: this.data.isFollowing ? '已关注' : '已取消关注',
      icon: 'success'
    });
  },

  showMessageDialog: function() {
    this.setData({
      showMessageDialog: true
    });
  },

  hideMessageDialog: function() {
    this.setData({
      showMessageDialog: false,
      messageText: ''
    });
  },

  showBookingDialog: function() {
    this.setData({
      showBookingDialog: true
    });
  },

  hideBookingDialog: function() {
    this.setData({
      showBookingDialog: false,
      selectedTime: '',
      selectedConsultType: 'text'
    });
  },

  handleMessageInput: function(e) {
    this.setData({
      messageText: e.detail.value
    });
  },

  selectTime: function(e) {
    const timeId = e.currentTarget.dataset.id;
    this.setData({
      selectedTime: timeId
    });
  },

  selectConsultType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedConsultType: type
    });
  },

  sendMessage: function() {
    const message = this.data.messageText.trim();
    if (!message) {
      wx.showToast({
        title: '请输入留言内容',
        icon: 'none'
      });
      return;
    }
    
    // In real app, send message to server
    wx.showToast({
      title: '留言已发送',
      icon: 'success'
    });
    
    this.hideMessageDialog();
  },

  confirmBooking: function() {
    if (!this.data.selectedTime) {
      wx.showToast({
        title: '请选择时间',
        icon: 'none'
      });
      return;
    }
    
    // In real app, send booking to server
    wx.showToast({
      title: '预约成功',
      icon: 'success'
    });
    
    this.hideBookingDialog();
  },

  onShareAppMessage: function() {
    return {
      title: `推荐专家：${this.data.expert.name}`,
      path: `/pages/expert/profile?id=${this.data.expert.id}`
    };
  }
})
