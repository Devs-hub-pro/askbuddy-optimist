export const SEARCH_RPC = {
  contentV2: 'search_app_content_v2',
  suggestionsV2: 'get_search_suggestions_v2',
} as const;

export const CONTROLLED_RPC = {
  acceptAnswer: 'accept_answer_v2',
  createSystemNotification: 'create_system_notification_v2',
  transitionOrderStatus: 'transition_order_status_v2',
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
} as const;
