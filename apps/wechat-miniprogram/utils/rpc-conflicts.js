const A_FIELD_MAP = {
  questionId: 'id',
  questionTitle: 'title',
  questionContent: 'content',
  questionStatus: 'status',
  updatedAt: 'updated_at'
};

const A_STATUS_MAP = {
  open: 'open',
  pending_payment: 'pending_payment',
  paid: 'paid',
  solved: 'solved',
  closed: 'closed'
};

module.exports = {
  A_FIELD_MAP,
  A_STATUS_MAP,
  getConflictPolicy() {
    const app = getApp();
    return app.globalData.conflictPolicy || 'A';
  }
};
