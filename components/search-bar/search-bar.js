
Component({
  methods: {
    onSearchInput(e) {
      this.triggerEvent('search', { value: e.detail.value });
    },
    
    onTapSearch() {
      // Navigate to comprehensive search page instead of education-specific search
      wx.navigateTo({
        url: '/pages/search-results/search-results'
      });
    }
  }
})
