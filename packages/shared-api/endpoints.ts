export const SEARCH_RPC = {
  contentV2: 'search_app_content_v2',
  suggestionsV2: 'get_search_suggestions_v2',
} as const;

export const CONTROLLED_RPC = {
  acceptAnswer: 'accept_answer_v2',
  createSystemNotification: 'create_system_notification_v2',
  transitionOrderStatus: 'transition_order_status_v2',
} as const;

export const FEED_RPC = {
  getChannelFeed: 'get_channel_feed',
  getChannelFeatured: 'get_channel_featured',
} as const;

export const MESSAGING_RPC = {
  getUserConversations: 'get_user_conversations',
  sendDirectMessage: 'send_direct_message',
  unreadMessagesCount: 'get_my_unread_message_count',
  unreadNotificationsCount: 'get_my_unread_notification_count',
  markNotificationsRead: 'mark_notifications_read',
} as const;

export const OPERATIONS_RPC = {
  upsertSearchHistory: 'upsert_search_history',
  submitContentReport: 'submit_content_report',
} as const;

// Freeze 阶段仍允许兜底，但新端实现禁止新增依赖。
export const DEPRECATED_RPC = {
  searchContentLegacy: 'search_app_content',
  acceptAnswerLegacy: 'accept_answer_and_transfer_points',
} as const;
