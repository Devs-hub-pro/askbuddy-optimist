
// expert-profile.js
Page({
  data: {
    expert: null,
    showFullDescription: false,
    consultTypes: [
      { id: 'text', name: '文本咨询' },
      { id: 'voice', name: '语音咨询' },
      { id: 'video', name: '视频咨询' }
    ],
    selectedConsultType: 'text',
    showMessageDialog: false,
    showBookingDialog: false,
    messageText: '',
    selectedTopics: [],
    selectedSlot: null,
    availableSlots: [
      { id: 1, date: '今天', time: '19:00 - 20:00' },
      { id: 2, date: '明天', time: '10:00 - 11:00' },
      { id: 3, date: '明天', time: '15:00 - 16:00' },
      { id: 4, date: '后天', time: '14:00 - 15:00' }
    ]
  },

  // Mock experts data - this would come from an API in a real app
  expertsData: [
    {
      id: '1',
      name: '张同学',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      backgroundImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      title: '北大硕士 | 出国党',
      description: '专注留学申请文书指导，斯坦福offer获得者。我有多年的申请文书辅导经验，曾帮助数十名学生成功申请到包括斯坦福、哈佛、麻省理工等名校的录取通知书。我秉持着因材施教的原则，针对每个学生的背景和特点，量身定制申请文书。欢迎有意出国留学的同学咨询，我会竭诚为你提供专业的建议和指导。',
      tags: ['留学', '文书', '面试', '申请规划', '国际生活'],
      category: 'study-abroad',
      rating: 4.9,
      responseRate: '98%',
      orderCount: '126单',
      location: '北京',
      education: ['北京大学 | 英语专业硕士', '中国人民大学 | 英语文学学士'],
      experience: ['某知名教育机构 | 留学顾问 3年', '自由职业文书顾问 | 2年']
    },
    {
      id: '2',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      backgroundImage: 'https://images.unsplash.com/photo-1501290301209-7a0323622985?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      title: '清华博士 | 考研规划',
      description: '5年考研辅导经验，擅长数学与专业课。我曾帮助上百名考生成功上岸，针对考研数学和计算机专业课有独到的教学和复习方法。我深知考研的艰辛，会尽力为每一位考生提供个性化的学习计划和复习方案。如果你在考研路上遇到困难，欢迎随时向我咨询。',
      tags: ['考研', '数学', '规划', '计算机', '专业课'],
      category: 'kaoyan',
      rating: 4.8,
      responseRate: '95%',
      orderCount: '210单',
      location: '北京',
      education: ['清华大学 | 计算机科学博士', '清华大学 | 计算机科学硕士', '北京邮电大学 | 计算机科学学士'],
      experience: ['某培训机构 | 考研数学老师 5年', '某高校 | 助教 2年']
    },
    {
      id: '3',
      name: '王老师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      backgroundImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      title: '高考志愿规划师',
      description: '10年高考志愿填报指导经验，专精各省份政策。我深入研究过全国各省份的高考政策和各大高校的招生情况，能够根据考生的分数、兴趣特长和家庭意愿，制定最优的志愿填报方案，提高理想院校的录取概率。如果你对填报志愿有困惑，欢迎随时咨询我。',
      tags: ['高考', '志愿填报', '专业选择', '院校推荐', '政策解读'],
      category: 'gaokao',
      rating: 4.7,
      responseRate: '92%',
      orderCount: '185单',
      location: '上海',
      education: ['复旦大学 | 教育学硕士', '华东师范大学 | 教育学学士'],
      experience: ['某教育局 | 教研员 5年', '某高考志愿填报平台 | 高级顾问 7年']
    },
    {
      id: '4',
      name: '李明',
      avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
      backgroundImage: 'https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1137&q=80',
      title: '清华研究生 | 英语达人',
      description: '考研英语特长，英语六级高分，专注英语学习方法。我曾获得全国大学生英语竞赛特等奖，考研英语89分的好成绩。我总结出一套适合中国学生的英语学习方法，特别是针对考试的技巧和策略。如果你在英语学习上遇到困难，我很乐意分享我的经验和方法。',
      tags: ['英语', '考研', '四六级', '学习方法', '口语提升'],
      category: 'language',
      rating: 4.6,
      responseRate: '90%',
      orderCount: '98单',
      location: '北京',
      education: ['清华大学 | 英语语言文学硕士', '南京大学 | 英语专业学士'],
      experience: ['某英语培训机构 | 高级讲师 3年', '某在线教育平台 | 内容创作者 2年']
    }
  ],

  onLoad: function(options) {
    const id = options.id;
    // Find the expert by ID from our mock data
    const expert = this.expertsData.find(e => e.id === id);
    
    if (expert) {
      this.setData({
        expert: expert
      });
    } else {
      // If expert not found, use the first one as fallback
      this.setData({
        expert: this.expertsData[0]
      });
      
      wx.showToast({
        title: '专家信息不存在',
        icon: 'none'
      });
    }
  },
  
  toggleDescription: function() {
    this.setData({
      showFullDescription: !this.data.showFullDescription
    });
  },
  
  selectConsultType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedConsultType: type
    });
  },
  
  handleBack: function() {
    wx.navigateBack();
  },
  
  handleMessage: function() {
    this.setData({
      showMessageDialog: true
    });
  },
  
  closeMessageDialog: function() {
    this.setData({
      showMessageDialog: false,
      messageText: ''
    });
  },
  
  onMessageInput: function(e) {
    this.setData({
      messageText: e.detail.value
    });
  },
  
  sendMessage: function() {
    if (!this.data.messageText.trim()) {
      wx.showToast({
        title: '请输入留言内容',
        icon: 'none'
      });
      return;
    }
    
    // In a real app, this would send the message to the server
    wx.showToast({
      title: '留言已发送',
      icon: 'success'
    });
    
    setTimeout(() => {
      this.closeMessageDialog();
    }, 1500);
  },
  
  handleBooking: function() {
    this.setData({
      showBookingDialog: true,
      selectedTopics: [],
      selectedSlot: null
    });
  },
  
  closeBookingDialog: function() {
    this.setData({
      showBookingDialog: false
    });
  },
  
  toggleTopic: function(e) {
    const topic = e.currentTarget.dataset.topic;
    const selectedTopics = [...this.data.selectedTopics];
    
    const index = selectedTopics.indexOf(topic);
    if (index > -1) {
      selectedTopics.splice(index, 1);
    } else {
      selectedTopics.push(topic);
    }
    
    this.setData({
      selectedTopics: selectedTopics
    });
  },
  
  selectTimeSlot: function(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      selectedSlot: id
    });
  },
  
  confirmBooking: function() {
    if (this.data.selectedTopics.length === 0) {
      wx.showToast({
        title: '请选择至少一个话题',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.selectedSlot === null) {
      wx.showToast({
        title: '请选择时间段',
        icon: 'none'
      });
      return;
    }
    
    // In a real app, this would send the booking to the server
    wx.showToast({
      title: '预约成功',
      icon: 'success'
    });
    
    setTimeout(() => {
      this.closeBookingDialog();
    }, 1500);
  }
})
