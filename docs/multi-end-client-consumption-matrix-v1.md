# B/C/D 可消费接口与类型清单（按页面分组）

日期：2026-04-22  
版本：v1（Freeze）  
来源：A 主线统一输出

## 1. 首页 / 频道页（Index / Education / Career / Lifestyle / Hobbies）

### 建议优先
- RPC：`get_channel_feed`
- RPC：`get_channel_featured`
- 类型：`SearchObjectType`（用于统一频道内跳转对象类型）

### 兼容读取
- questions 列表：`questions` + `profiles` + `answers` 计数聚合
- experts 列表：`experts` + `profiles`

## 2. 搜索页（SearchResults）

### 主路径
- RPC：`search_app_content_v2`
- RPC：`get_search_suggestions_v2`
- RPC：`upsert_search_history`（登录后写）
- 表：`hot_keywords`（热门词读取）

### tab 统一文案
- 全部 / 问题 / 专家 / 技能 / 动态

### 兼容兜底（仅过渡）
- RPC：`search_app_content`（deprecated）

## 3. 问题与回答（QuestionDetail / NewQuestion / MyAnswers）

### 主路径
- 表：`questions`
- 表：`question_drafts`
- 表：`answers`
- RPC（受控）：`accept_answer_v2`

### 过渡路径
- RPC：`create_question_secure`（已有端可继续用）
- RPC：`create_answer_secure`（已有端可继续用）

### 禁止新增依赖
- `accept_answer_and_transfer_points`（deprecated）

## 4. 专家与技能（ExpertDetail / ExpertProfile / SkillPublish）

### 主路径
- 表：`experts`
- 表：`skill_offers`
- 表：`skill_categories`
- 表：`expert_followers`

### 可见性规则
- 非本人仅看 `skill_offers.status = published`
- 本人可看 draft/pending/published/offline

## 5. 消息与通知（Messages / ChatDetail / Notifications）

### 主路径
- RPC：`get_user_conversations`
- RPC：`send_direct_message`
- RPC：`get_my_unread_message_count`
- RPC：`get_my_unread_notification_count`
- RPC：`mark_notifications_read`
- 表：`conversations`, `conversation_members`, `messages`, `notifications`

### 权限边界
- 仅会话成员可读写该会话消息
- 通知 owner-only

## 6. 订单/积分/收益（MyOrders / MyEarnings / PointsRecharge）

### 主路径
- 表：`orders`（双边模型：buyer_id + seller_id）
- 表：`payments`
- 表：`point_accounts`（余额真值）
- 表：`point_transactions`
- 表：`earning_transactions`
- RPC（受控）：`transition_order_status_v2`

### 页面侧关键读取
- MyOrders：`buyer_id = me OR seller_id = me`
- MyEarnings：分开展示 `earning_transactions` 与 `point_transactions`
- PointsRecharge 余额：`point_accounts.available_balance`

## 7. 举报与运营位（Discover / Admin）

### 主路径
- RPC：`submit_content_report`
- 表：`content_reports`
- 表：`system_configs`（只公开 `is_public = true`）
- 表：`recommendation_slots`（只公开 active + 时间窗口有效）

## 8. shared 包消费要求
- 类型：`packages/shared-types/index.ts`
- RPC 常量：`packages/shared-api/endpoints.ts`
- 禁止在 B/C/D 再发明同义常量名。
