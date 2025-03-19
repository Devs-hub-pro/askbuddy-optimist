
Component({
  properties: {
    activities: {
      type: Array,
      value: []
    }
  },
  methods: {
    onActivityTap(e) {
      const index = e.currentTarget.dataset.index;
      const activity = this.data.activities[index];
      this.triggerEvent('select', { activity });
    }
  }
})
