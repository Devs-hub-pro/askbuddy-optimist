
Component({
  properties: {
    activeTab: {
      type: String,
      value: 'topics'
    },
    isLoading: {
      type: Boolean,
      value: true
    },
    questions: {
      type: Array,
      value: []
    },
    experts: {
      type: Array,
      value: []
    }
  },
  methods: {
    switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.triggerEvent('tabchange', { tab });
    },
    handleAnswer(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('answer', { id });
    },
    viewQuestionDetail(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/question-detail/question-detail?id=${id}`
      });
    },
    viewExpertProfile(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/expert-profile/expert-profile?id=${id}`
      });
    }
  }
})
