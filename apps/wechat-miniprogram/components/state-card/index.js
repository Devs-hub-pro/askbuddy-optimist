Component({
  properties: {
    type: {
      type: String,
      value: 'empty'
    },
    title: {
      type: String,
      value: ''
    },
    desc: {
      type: String,
      value: ''
    },
    actionText: {
      type: String,
      value: ''
    }
  },
  methods: {
    onTapAction() {
      this.triggerEvent('action');
    }
  }
});
