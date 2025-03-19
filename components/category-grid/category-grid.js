
Component({
  properties: {
    categories: {
      type: Array,
      value: []
    }
  },
  methods: {
    onCategoryTap(e) {
      const index = e.currentTarget.dataset.index;
      const category = this.data.categories[index];
      this.triggerEvent('select', { category });
    }
  }
})
