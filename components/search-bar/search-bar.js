
Component({
  methods: {
    onSearchInput(e) {
      this.triggerEvent('search', { value: e.detail.value });
    }
  }
})
