
// Question Detail Page
Page({
  data: {
    isLoading: true,
    question: null,
    answers: [],
    isDescriptionExpanded: false,
    showAnswerDialog: false,
    showShareDialog: false,
    answerText: '',
    selectedTime: '',
    selectedConsultType: 'text',
    availableTimes: [
      { id: 'today1', label: '今天 15:00' },
      { id: 'today2', label: '今天 18:00' },
      { id: 'today3', label: '今天 20:00' },
      { id: 'tomorrow1', label: '明天 10:00' },
      { id: 'tomorrow2', label: '明天 14:00' },
      { id: 'tomorrow3', label: '明天 16:00' }
    ]
  },

  onLoad: function(options) {
    // Get question ID from options
    const questionId = options.id;
    
    // In a real app, you would fetch question data from server
    // For demo purposes, use mockup data
    setTimeout(() => {
      this.setData({
        isLoading: false,
        question: this.getMockQuestionData(questionId),
        answers: this.getMockAnswersData()
      });
    }, 1000);
  },

  getMockQuestionData: function(id) {
    // Question data examples based on ID
    const questions = {
      '1': {
        id: '1',
        title: '高考填报志愿热门问题',
        description: '面对众多院校和专业选择，如何根据自己的分数、兴趣做出最优选择？\n\n我的分数在一本线上20分，想读计算机相关专业，但不知道应该如何选择适合自己的大学。是选择一个排名靠前但竞争激烈的大学，还是选择一个稍微靠后但更容易被录取的大学？\n\n另外，专业选择上，计算机科学、软件工程、人工智能这些专业有什么区别和发展前景？对未来就业有何影响？\n\n希望有过来人能给一些建议。',
        viewCount: '2.5k',
        asker: {
          id: 'user1',
          name: '李明',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        time: '2小时前',
        tags: ['高考', '志愿填报'],
        points: 50,
        category: 'education'
      },
      '2': {
        id: '2',
        title: '留学申请的必备条件',
        description: '想申请美国Top30名校研究生，除了GPA和语言成绩，还需要准备哪些材料？\n\n我目前是国内某985大学大三学生，GPA 3.6，托福100分，想申请美国计算机专业的硕士。听说除了基础的成绩证明外，还需要准备推荐信、个人陈述、简历等材料。\n\n1. 推荐信应该找什么样的教授写？内容应该包括哪些方面？\n2. 个人陈述怎么写才能脱颖而出？有什么技巧或注意事项？\n3. 简历应该突出哪些经历和能力？\n4. 还有其他需要准备的材料吗？\n\n希望有留学经验的朋友能分享一下经验。感谢！',
        viewCount: '1.8k',
        asker: {
          id: 'user2',
          name: '王芳',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        time: '5小时前',
        tags: ['留学', '申请'],
        points: 30,
        category: 'education'
      },
      '3': {
        id: '3',
        title: '如何选择最佳职业路径',
        description: '毕业后是进国企还是私企？如何根据自身情况做出规划？\n\n我是即将毕业的大学生，面临工作选择的困惑。目前手上有两份offer，一份是国企，工作稳定但起薪较低，晋升可能较慢；另一份是私企（互联网公司），薪资高但工作压力大，加班多。\n\n考虑到长期发展，不知道应该如何选择。国企的稳定性和私企的发展空间，哪个对职业生涯更有利？\n\n另外，如果现在选择了一条路，以后还能转换吗？有什么好的建议？',
        viewCount: '3.5k',
        asker: {
          id: 'user3',
          name: '张伟',
          avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
        },
        time: '1天前',
        tags: ['职业发展', '路径选择'],
        points: 40,
        category: 'career'
      }
    };
    
    // Default question if ID not found
    return questions[id] || {
      id: id || '0',
      title: '未找到问题',
      description: '该问题不存在或已被删除。',
      viewCount: '0',
      asker: {
        id: 'unknown',
        name: '未知用户',
        avatar: '/assets/icons/user-avatar.png'
      },
      time: '未知',
      tags: [],
      points: 0,
      category: 'unknown'
    };
  },

  getMockAnswersData: function() {
    return [
      {
        id: 'answer1',
        author: {
          id: 'expert1',
          name: '张老师',
          avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
          title: '教育咨询师'
        },
        content: '志愿填报是一个系统工程，需要综合考虑多方面因素：\n\n1. 先做整体规划，根据自己的分数、兴趣和未来职业规划选择合适的院校和专业\n2. 充分了解目标院校的招生政策、往年分数线和专业设置\n3. 合理分配冲、稳、保的院校比例\n4. 关注专业就业前景和发展方向\n5. 考虑地域因素和学费问题\n\n建议使用"1-2-1"策略：一所有挑战的学校，两所比较有把握的学校，一所保底学校。这样既有进取心又有安全保障。',
        time: '1小时前',
        isBest: true,
        viewCount: 356
      },
      {
        id: 'answer2',
        author: {
          id: 'expert2',
          name: '王教授',
          avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
          title: '大学教师'
        },
        content: '根据我多年的教学经验，建议你参考以下几点：\n1. 分析自己的优势科目和兴趣爱好\n2. 查询目标院校往年录取分数和专业设置\n3. 了解各专业就业前景和发展方向\n4. 合理填报志愿梯队\n\n高考志愿填报是人生中的重要抉择，建议多咨询专业老师和学长学姐的意见。',
        time: '2小时前',
        isBest: false,
        viewCount: 245
      },
      {
        id: 'answer3',
        author: {
          id: 'user4',
          name: '学长',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          title: '往届考生'
        },
        content: '作为过来人，我建议你除了关注分数线，还要考虑学校的地理位置、校园环境、师资力量等因素。选择一个适合自己的学习环境很重要。不要盲目追求名校，找到最适合自己的才是最好的。',
        time: '3小时前',
        isBest: false,
        viewCount: 198
      }
    ];
  },

  toggleDescription: function() {
    this.setData({
      isDescriptionExpanded: !this.data.isDescriptionExpanded
    });
  },

  navigateBack: function() {
    wx.navigateBack();
  },

  handleAnswerDialog: function() {
    this.setData({
      showAnswerDialog: true
    });
  },

  handleShareDialog: function() {
    this.setData({
      showShareDialog: true
    });
  },

  hideAnswerDialog: function() {
    this.setData({
      showAnswerDialog: false,
      answerText: '',
      selectedTime: '',
      selectedConsultType: 'text'
    });
  },

  hideShareDialog: function() {
    this.setData({
      showShareDialog: false
    });
  },

  preventBubble: function(e) {
    // Prevent event bubbling
  },

  handleAnswerInput: function(e) {
    this.setData({
      answerText: e.detail.value
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

  submitAnswer: function() {
    if (!this.data.selectedTime) {
      wx.showToast({
        title: '请选择时间',
        icon: 'none'
      });
      return;
    }
    
    wx.showToast({
      title: '回答已提交',
      icon: 'success'
    });
    
    this.hideAnswerDialog();
  },

  shareToFriend: function() {
    wx.showToast({
      title: '邀请已发送',
      icon: 'success'
    });
    this.hideShareDialog();
  },

  shareToWechat: function() {
    wx.showToast({
      title: '已复制链接，请前往微信分享',
      icon: 'none'
    });
    this.hideShareDialog();
  },

  shareToQQ: function() {
    wx.showToast({
      title: '已复制链接，请前往QQ分享',
      icon: 'none'
    });
    this.hideShareDialog();
  },

  shareToTiktok: function() {
    wx.showToast({
      title: '已复制链接，请前往抖音分享',
      icon: 'none'
    });
    this.hideShareDialog();
  },

  saveBookmark: function() {
    wx.showToast({
      title: '已收藏',
      icon: 'success'
    });
  },

  viewExpertProfile: function(e) {
    const { expertId, expertName, expertAvatar } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/expert/profile?id=${expertId}&name=${expertName}&avatar=${encodeURIComponent(expertAvatar)}`
    });
  },

  onShareAppMessage: function() {
    return {
      title: this.data.question.title,
      path: `/pages/question/detail?id=${this.data.question.id}`
    };
  }
})
