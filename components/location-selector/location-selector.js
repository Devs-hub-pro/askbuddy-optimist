
Component({
  properties: {
    location: {
      type: String,
      value: '深圳'
    },
    cities: {
      type: Array,
      value: ['北京', '上海', '广州', '深圳', '杭州']
    },
    locationMenuOpen: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    toggleLocationMenu() {
      this.triggerEvent('toggle');
    },
    selectLocation(e) {
      const city = e.currentTarget.dataset.city;
      this.triggerEvent('select', { city });
    }
  }
})
