# A 主线跨端契约快照 v1（Freeze）

日期：2026-04-22  
范围：Phase 1 Freeze 后 iOS / Android / 微信小程序统一基线  
权威来源：A 主线（后端契约与共享层）

## 1. 数据对象命名白名单
- `question`
- `expert`
- `skill`
- `post`

禁止新增同义命名（例如 `topic/posts_v2/expert_user`）作为主路径对象名。

## 2. 状态机白名单

### Question
- `open | matched | solved | hidden | deleted`

### Answer
- `active | accepted | hidden | deleted`

### SkillOffer
- `draft | pending_review | published | offline`

### Order
- `pending_payment | paid | in_service | completed | refunded | closed`

### Post
- `visibility`: `public | followers | private`
- `status`: `active | hidden | deleted`

### Notification
- `is_read`: `false | true`

## 3. RPC 白名单（主路径）

### 搜索
- `search_app_content_v2`
- `get_search_suggestions_v2`

### 受控动作（服务端收口）
- `accept_answer_v2`（authenticated，可调用但仅问题作者可成功）
- `create_system_notification_v2`（service role / server-side only）
- `transition_order_status_v2`（service role / server-side only）

### 消息通知
- `get_user_conversations`
- `send_direct_message`
- `get_my_unread_message_count`
- `get_my_unread_notification_count`
- `mark_notifications_read`

### 发现与搜索辅助
- `get_channel_feed`
- `get_channel_featured`
- `upsert_search_history`
- `submit_content_report`

## 4. Deprecated（仅兼容，不得新增依赖）
- `search_app_content`
- `accept_answer_and_transfer_points`
- `profiles.points_balance`（余额真值已迁移到 `point_accounts.available_balance`）

## 5. 账务主路径白名单
- `point_accounts`
- `point_transactions`
- `earning_transactions`

说明：旧余额/旧流水仅作兼容层，不再作为真值来源。

## 6. 多端执行规则
1. B/C/D 新增代码必须优先消费 `packages/shared-types` 与 `packages/shared-api`。
2. 状态机和 RPC 名称冲突一律回 A 主线仲裁。
3. Freeze 阶段不扩业务域；只允许 bugfix / 小 patch / cleanup。
