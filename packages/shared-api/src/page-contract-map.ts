/**
 * B / C / D 可直接消费的页面接口清单（v1）
 * 注意：这是“接口与字段白名单”，不是 UI 实现规范。
 */
export interface PageContract {
  page: string;
  tables: string[];
  rpcs: string[];
  keyFields: string[];
}

export const PAGE_CONTRACT_MAP: PageContract[] = [
  {
    page: "首页",
    tables: ["questions", "profiles", "experts", "skill_offers", "recommendation_slots", "notifications"],
    rpcs: ["search_app_content_v2", "get_my_unread_notification_count"],
    keyFields: [
      "questions.id/title/status/reward_points/answer_count/view_count",
      "profiles.user_id/nickname/avatar_url/city",
      "experts.user_id/headline/verification_status/service_count",
      "skill_offers.id/expert_id/title/status/price_amount",
    ],
  },
  {
    page: "搜索",
    tables: ["search_history", "hot_keywords", "questions", "experts", "skill_offers", "posts"],
    rpcs: ["search_app_content_v2", "get_search_suggestions_v2", "upsert_search_history"],
    keyFields: [
      "search_history.user_id/query_text/query_type/last_used_at",
      "hot_keywords.keyword/keyword_type/score/is_active",
      "posts.id/content/status/visibility",
    ],
  },
  {
    page: "详情（问题/专家/技能）",
    tables: ["questions", "answers", "profiles", "experts", "skill_offers"],
    rpcs: ["accept_answer_v2"],
    keyFields: [
      "questions.accepted_answer_id/status",
      "answers.question_id/content/is_accepted/status",
      "experts.user_id/intro/expertise_summary",
      "skill_offers.expert_id/status/delivery_mode",
    ],
  },
  {
    page: "发布（提问/技能）",
    tables: ["question_drafts", "questions", "skill_offers", "skill_categories"],
    rpcs: [],
    keyFields: [
      "question_drafts.author_id/draft_payload/updated_at",
      "questions.author_id/title/description/reward_points/status",
      "skill_offers.expert_id/category_id/pricing_mode/status",
    ],
  },
  {
    page: "消息",
    tables: ["conversations", "conversation_members", "messages", "notifications"],
    rpcs: ["get_my_unread_message_count", "get_my_unread_notification_count"],
    keyFields: [
      "conversations.id/type/last_message_at",
      "messages.conversation_id/sender_id/content/status/created_at",
      "notifications.user_id/type/title/body/is_read",
    ],
  },
  {
    page: "我的（订单/积分/收益/资料）",
    tables: [
      "profiles",
      "user_settings",
      "orders",
      "payments",
      "point_accounts",
      "point_transactions",
      "earning_transactions",
      "user_verifications",
    ],
    rpcs: ["transition_order_status_v2", "create_system_notification_v2"],
    keyFields: [
      "orders.buyer_id/seller_id/order_type/status/amount/point_amount",
      "point_accounts.user_id/available_balance/frozen_balance",
      "point_transactions.user_id/direction/amount/biz_type/status",
      "earning_transactions.user_id/direction/amount/status/settled_at",
    ],
  },
];

