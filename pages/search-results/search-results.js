
// search-results.js
Page({
  data: {
    searchQuery: '',
    popularTopics: ['考研', '留学申请', '高考志愿', '论文写作', '竞赛辅导', '考证', '英语学习', '数学提高'],
    recommendedAnswerers: [
      {
        id: '1',
        name: '张同学',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        title: '北大硕士',
        expertise: '专注留学申请文书指导，斯坦福offer获得者',
        tags: ['留学', '文书', '面试']
      },
      {
        id: '2',
        name: '刘导师',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        title: '清华博士',
        expertise: '5年考研辅导经验，擅长数学与专业课',
        tags: ['考研', '数学', '规划']
      },
      {
        id: '3',
        name: '王老师',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        title: '高考志愿规划师',
        expertise: '10年高考志愿填报指导经验，专精各省份政策',
        tags: ['高考', '志愿填报', '专业选择']
      },
      {
        id: '4',
        name: '李明',
        avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
        title: '清华研究生',
        expertise: '考研英语特长，英语六级高分，专注英语学习方法',
        tags: ['考研', '英语', '备考']
      }
    ],
    relatedQuestions: [
      {
        id: '1',
        title: '如何有效管理考研复习时间？',
        asker: {
          name: '小李',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
        },
        time: '2小时前',
        tags: ['考研', '时间管理']
      },
      {
        id: '2',
        title: '美国本科留学需要准备哪些标化考试？',
        asker: {
          name: '高中生',
          avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
        },
        time: '4小时前',
        tags: ['留学', '标化考试']
      },
      {
        id: '3',
        title: '高考志愿：985分数够不到怎么选择？',
        asker: {
          name: '高考生',
          avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
        },
        time: '1天前',
        tags: ['高考', '志愿填报']
      }
    ]
  },

  onLoad: function(options) {
    if (options.query) {
      this.setData({
        searchQuery: options.query
      });
      this.filterResults(options.query);
    }
  },

  onSearchInput: function(e) {
    const value = e.detail.value;
    this.setData({
      searchQuery: value
    });
    
    if (value) {
      this.filterResults(value);
    }
  },

  filterResults: function(query) {
    // In a real app, this would call an API to get search results
    // For this demo, we'll just filter the existing data
    const filteredAnswerers = this.data.recommendedAnswerers.filter(answerer => {
      return answerer.name.includes(query) || 
             answerer.title.includes(query) || 
             answerer.expertise.includes(query) ||
             answerer.tags.some(tag => tag.includes(query));
    });
    
    const filteredQuestions = this.data.relatedQuestions.filter(question => {
      return question.title.includes(query) || 
             question.tags.some(tag => tag.includes(query));
    });
    
    this.setData({
      recommendedAnswerers: filteredAnswerers,
      relatedQuestions: filteredQuestions
    });
  },

  onSelectTopic: function(e) {
    const topic = e.currentTarget.dataset.topic;
    this.setData({
      searchQuery: topic
    });
    this.filterResults(topic);
  },

  onSelectExpert: function(e) {
    const expertId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/expert-profile/expert-profile?id=${expertId}`
    });
  },

  onSelectQuestion: function(e) {
    const questionId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/question-detail/question-detail?id=${questionId}`
    });
  },

  handleBack: function() {
    wx.navigateBack();
  }
})
