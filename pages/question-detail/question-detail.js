
// question-detail.js
Page({
  data: {
    question: null,
    answers: [],
    sortBy: 'newest',
    showAnswerDialog: false,
    showInviteDialog: false,
    answerText: '',
    consultTypes: [
      { id: 'text', name: '文本回答' },
      { id: 'voice', name: '语音回答' },
      { id: 'video', name: '视频回答' }
    ],
    selectedConsultType: 'text',
    selectedSlot: null,
    availableSlots: [
      { id: 1, date: '今天', time: '19:00 - 20:00' },
      { id: 2, date: '明天', time: '10:00 - 11:00' },
      { id: 3, date: '明天', time: '15:00 - 16:00' },
      { id: 4, date: '后天', time: '14:00 - 15:00' }
    ],
    shareOptions: [
      { id: 'wechat', name: '微信', icon: '/assets/icons/wechat.png', bgColor: 'bg-green-100' },
      { id: 'qq', name: 'QQ', icon: '/assets/icons/qq.png', bgColor: 'bg-blue-100' },
      { id: 'weibo', name: '微博', icon: '/assets/icons/weibo.png', bgColor: 'bg-red-100' },
      { id: 'douyin', name: '抖音', icon: '/assets/icons/douyin.png', bgColor: 'bg-black' },
      { id: 'internal', name: '站内分享', icon: '/assets/icons/users.png', bgColor: 'bg-purple-100' },
      { id: 'copy', name: '复制链接', icon: '/assets/icons/copy.png', bgColor: 'bg-gray-100' },
      { id: 'poster', name: '生成海报', icon: '/assets/icons/image.png', bgColor: 'bg-yellow-100' },
      { id: 'more', name: '更多', icon: '/assets/icons/more.png', bgColor: 'bg-gray-100' }
    ]
  },

  // Mock questions data - this would come from an API in a real app
  questionsData: [
    {
      id: '1',
      title: '如何有效管理考研复习时间？',
      description: '我是23届考研生，感觉每天都很忙但效率不高，有没有好的时间管理方法？或者可以分享一下具体的作息安排、学习计划之类的。想知道大家都是怎么安排复习时间的，特别是数学和专业课要怎么平衡。',
      asker: {
        id: 'user1',
        name: '小李',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      time: '2小时前',
      tags: ['考研', '时间管理'],
      answers: 12,
      viewCount: '3.8k',
      points: 30,
      category: 'kaoyan'
    },
    {
      id: '2',
      title: '美国本科留学需要准备哪些标化考试？',
      description: '高二学生，计划申请美国本科，不知道需要准备什么考试，什么时候开始准备比较好？需要考TOEFL和SAT吗？现在很多美国大学好像都不需要SAT成绩了，我是否还需要考？此外，如果想申请名校，还需要准备哪些其他考试或者活动经历？',
      asker: {
        id: 'user2',
        name: '高中生',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
      },
      time: '4小时前',
      tags: ['留学', '标化考试'],
      answers: 8,
      viewCount: '2.1k',
      points: 25,
      category: 'study-abroad'
    },
    {
      id: '3',
      title: '高考志愿：985分数够不到怎么选择？',
      description: '今年高考估分630，想上计算机但分数线可能差一点，是冲一冲还是选二本保底呢？我在河南，今年考得还可以，但是不知道今年的分数线会是多少。特别想学计算机专业，但是好的大学分数线都挺高的，有没有什么推荐的院校或者选择策略？',
      asker: {
        id: 'user3',
        name: '高考生',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
      },
      time: '1天前',
      tags: ['高考', '志愿填报'],
      answers: 15,
      viewCount: '5.2k',
      points: 40,
      category: 'gaokao'
    }
  ],

  // Mock answers data
  answersData: {
    '1': [
      {
        id: 'a1',
        answerer: {
          id: 'expert2',
          name: '刘导师',
          avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
          title: '清华博士 | 考研规划'
        },
        content: '考研时间管理非常关键。建议按照4+2+1模式：4小时专业课，2小时英语，1小时政治。合理安排休息，保证每天7小时睡眠。每周做一次模拟题检验效果。',
        time: '1小时前',
        likes: 34,
        dislikes: 2,
        comments: 5,
        isLiked: false,
        isDisliked: false
      },
      {
        id: 'a2',
        answerer: {
          id: 'expert4',
          name: '李明',
          avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
          title: '清华研究生 | 英语达人'
        },
        content: '作为考研过来人，我认为建立自己的知识体系很重要。不要盲目刷题，而是要理解知识点之间的联系。英语建议每天固定时间背单词，坚持阅读。',
        time: '3小时前',
        likes: 28,
        dislikes: 0,
        comments: 3,
        isLiked: false,
        isDisliked: false
      }
    ],
    '2': [
      {
        id: 'a3',
        answerer: {
          id: 'expert1',
          name: '张同学',
          avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
          title: '北大硕士 | 出国党'
        },
        content: '美国本科申请通常需要准备TOEFL/IELTS和SAT/ACT。虽然现在很多学校采取test-optional政策，但有好成绩还是加分项。此外，AP课程和相关竞赛也很有帮助。',
        time: '2小时前',
        likes: 19,
        dislikes: 1,
        comments: 4,
        isLiked: false,
        isDisliked: false
      }
    ],
    '3': [
      {
        id: 'a4',
        answerer: {
          id: 'expert3',
          name: '王老师',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          title: '高考志愿规划师'
        },
        content: '630分在河南属于不错的分数。建议冲一冲985，同时保底211的计算机专业。可以考虑中山大学、华南理工、西安电子科技大学等学校，或者北航、北理工、华科的非热门专业。',
        time: '10小时前',
        likes: 45,
        dislikes: 0,
        comments: 7,
        isLiked: false,
        isDisliked: false
      }
    ]
  },

  onLoad: function(options) {
    const id = options.id;
    // Find the question by ID from our mock data
    const question = this.questionsData.find(q => q.id === id);
    
    if (question) {
      this.setData({
        question: question,
        answers: this.answersData[id] || []
      });
    } else {
      // If question not found, use the first one as fallback
      this.setData({
        question: this.questionsData[0],
        answers: this.answersData['1'] || []
      });
      
      wx.showToast({
        title: '问题信息不存在',
        icon: 'none'
      });
    }
  },
  
  handleBack: function() {
    wx.navigateBack();
  },
  
  setSortBy: function(e) {
    const sort = e.currentTarget.dataset.sort;
    this.setData({
      sortBy: sort
    });
    
    // In a real app, this would re-sort the answers
    if (sort === 'helpful') {
      this.setData({
        answers: [...this.data.answers].sort((a, b) => b.likes - a.likes)
      });
    } else {
      // Sort by newest
      this.setData({
        answers: [...this.data.answers].sort((a, b) => {
          return new Date(b.time) - new Date(a.time);
        })
      });
    }
  },
  
  toggleLike: function(e) {
    const id = e.currentTarget.dataset.id;
    const answers = [...this.data.answers];
    const answerIndex = answers.findIndex(a => a.id === id);
    
    if (answerIndex > -1) {
      const answer = answers[answerIndex];
      if (answer.isLiked) {
        // Unlike
        answer.likes--;
        answer.isLiked = false;
      } else {
        // Like
        answer.likes++;
        answer.isLiked = true;
        // If disliked, remove dislike
        if (answer.isDisliked) {
          answer.dislikes--;
          answer.isDisliked = false;
        }
      }
      
      this.setData({
        answers: answers
      });
    }
  },
  
  toggleDislike: function(e) {
    const id = e.currentTarget.dataset.id;
    const answers = [...this.data.answers];
    const answerIndex = answers.findIndex(a => a.id === id);
    
    if (answerIndex > -1) {
      const answer = answers[answerIndex];
      if (answer.isDisliked) {
        // Remove dislike
        answer.dislikes--;
        answer.isDisliked = false;
      } else {
        // Dislike
        answer.dislikes++;
        answer.isDisliked = true;
        // If liked, remove like
        if (answer.isLiked) {
          answer.likes--;
          answer.isLiked = false;
        }
      }
      
      this.setData({
        answers: answers
      });
    }
  },
  
  handleComment: function(e) {
    const id = e.currentTarget.dataset.id;
    // In a real app, this would navigate to a comment page or open a comment dialog
    wx.showToast({
      title: '评论功能开发中',
      icon: 'none'
    });
  },
  
  viewAskerProfile: function(e) {
    const id = e.currentTarget.dataset.id;
    console.log('View asker profile:', id);
    // In a real app, this would navigate to the user's profile
  },
  
  viewAnswererProfile: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/expert-profile/expert-profile?id=${id}`
    });
  },
  
  handleAnswer: function() {
    this.setData({
      showAnswerDialog: true,
      selectedConsultType: 'text',
      selectedSlot: null,
      answerText: ''
    });
  },
  
  closeAnswerDialog: function() {
    this.setData({
      showAnswerDialog: false
    });
  },
  
  selectConsultType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedConsultType: type
    });
  },
  
  selectTimeSlot: function(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      selectedSlot: id
    });
  },
  
  onAnswerInput: function(e) {
    this.setData({
      answerText: e.detail.value
    });
  },
  
  submitAnswer: function() {
    if (this.data.selectedSlot === null) {
      wx.showToast({
        title: '请选择时间段',
        icon: 'none'
      });
      return;
    }
    
    // In a real app, this would send the answer to the server
    wx.showToast({
      title: '回答已提交',
      icon: 'success'
    });
    
    setTimeout(() => {
      this.closeAnswerDialog();
    }, 1500);
  },
  
  handleInvite: function() {
    this.setData({
      showInviteDialog: true
    });
  },
  
  closeInviteDialog: function() {
    this.setData({
      showInviteDialog: false
    });
  },
  
  shareQuestion: function(e) {
    const type = e.currentTarget.dataset.type;
    console.log('Share via:', type);
    
    if (type === 'copy') {
      // In a real app, this would copy a link to the clipboard
      wx.showToast({
        title: '链接已复制',
        icon: 'success'
      });
    } else if (type === 'internal') {
      // In a real app, this would open an internal sharing dialog
      wx.showToast({
        title: '站内分享功能开发中',
        icon: 'none'
      });
    } else {
      // For other sharing options
      wx.showToast({
        title: `分享到${type}功能开发中`,
        icon: 'none'
      });
    }
    
    setTimeout(() => {
      this.closeInviteDialog();
    }, 1500);
  }
})
