
Component({
  data: {
    isFocused: false
  },
  methods: {
    onSearchInput(e) {
      this.triggerEvent('search', { value: e.detail.value });
    },
    onFocus() {
      this.setData({
        isFocused: true
      });
      this.triggerEvent('focus');
    },
    onBlur() {
      this.setData({
        isFocused: false
      });
      this.triggerEvent('blur');
    }
  }
})
