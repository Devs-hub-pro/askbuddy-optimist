# 后端一期设计文档（Schema Plan）

> 项目：找人问问 APP  
> 阶段：后端一期（设计稿）  
> 目标：可用、结构正确、可扩展，优先服务现有前端代码，不做过度设计。

---

## 1. 代码扫描结果

## 1.1 当前前端核心模块（按路由与页面）

基于 [App.tsx](/Users/shawnshi1997/askbuddy-optimist/src/App.tsx) 与页面目录，现有模块覆盖：

- 认证与用户：`/auth`、`/profile`、`/edit-profile`、设置子页
- 首页与频道：`/`、`/education`、`/career`、`/lifestyle`、`/hobbies`
- 搜索：`/search`、`/education/search`
- 提问问答：`/new`、`/question/:id`
- 专家技能：`/expert/:id`、`/expert-profile/:id`、`/skill-publish`
- 发现流：`/discover`、`/discover/interactions`、`/topic/:topicId`
- 消息通知：`/messages`、`/chat/:chatId`、`/notifications`
- 交易与收益：`/profile/orders`、`/profile/earnings`、`/profile/recharge`
- 草稿与内容管理：`/profile/drafts`、`/profile/answers`、`/profile/favorites`
- 管理后台：`/admin`

## 1.2 每个模块需要的后端数据支持（反推）

- 认证模块：`auth.users` + `profiles` + `user_settings`
- 首页/频道：`questions`、`experts`、`hot_topics`，并按 `channel/subcategory` 聚合
- 搜索：跨 `questions/hot_topics/profiles(experts)` 的统一检索
- 提问与详情：`questions`、`answers`、`answer_likes`、`favorites`、`drafts`
- 专家与技能：`experts`、`talent_certifications`、分类体系
- 发现流：`posts`、`post_likes`、`post_comments`、`user_followers`
- 消息：`messages` + 会话聚合 RPC + Realtime
- 通知：`notifications` + 已读更新 RPC
- 订单积分：`orders`、`points_transactions`、`payment_callbacks`
- 管理后台：`content_reports`、`content_moderation_logs`、`audit_events`、`app_config`

## 1.3 当前明显 demo/mock/fallback 点

- 搜索：`useSearch` 在 RPC 缺失时回退到多表 `ilike` + demo 合并（`demoQuestions/demoExperts`）
- 频道页：`useChannelFeed` 已接 RPC，但仍有 fallback demo 兜底
- 首页：`useQuestions/useExperts/useHotTopics` 与 demo 合并显示
- 支付：`wechat-prepay` 目前是 mock gateway 签名，不是直连微信官方下单
- 私信/通知/提问/回答：均有 RPC 缺失时的 table fallback

## 1.4 当前已明确的数据模型

从 [types.ts](/Users/shawnshi1997/askbuddy-optimist/src/integrations/supabase/types.ts) 与 migration 现状看，以下模型已较明确：

- 用户侧：`profiles`、`user_settings`、`user_roles`
- 内容侧：`questions`、`answers`、`favorites`、`answer_likes`、`drafts`
- 专家侧：`experts`、`talent_certifications`
- 发现侧：`posts`、`post_likes`、`post_comments`、`hot_topics`、`topic_discussions`、`topic_followers`
- 社交侧：`messages`、`notifications`、`user_followers`
- 交易侧：`orders`、`points_transactions`、`payment_callbacks`
- 风控运营：`content_reports`、`content_moderation_logs`、`audit_events`、`app_config`

---

## 2. 后端一期业务域建议

为贴合现有前端与 Supabase 能力，一期建议拆分为 9 域：

1. 用户与认证域  
2. 提问与回答域  
3. 专家与技能供给域  
4. 搜索与推荐域  
5. 发现流与互动域  
6. 消息与通知域  
7. 订单、积分、收益域  
8. 后台管理与审核域  
9. 基础设施域（上传、权限、风控、日志）

这样拆分的原因：

- 与现有页面和 hooks 一一对应，联调路径清晰
- 便于分批上线（先核心交易链路，再增强推荐和运营）
- 保持“单库单服务”结构，避免过早微服务化

---

## 3. 一期核心数据表清单（分级）

## 3.1 P0（一期必须先建/先稳定）

- `auth.users`（Supabase内置）
- `profiles`
- `user_settings`
- `questions`
- `drafts`（对应 question_drafts）
- `answers`
- `experts`
- `messages`
- `notifications`
- `orders`
- `points_transactions`
- `hot_topics`
- `topic_discussions`
- `user_followers`（对应 follows）

## 3.2 P1（一期最好建）

- `answer_likes`
- `favorites`
- `posts`
- `post_likes`
- `post_comments`
- `topic_followers`
- `talent_certifications`（可先最小流程）
- `content_reports`
- `content_moderation_logs`
- `audit_events`
- `app_config`
- `payment_callbacks`

## 3.3 P2（后续可补）

- `skill_categories`（目前可先枚举配置）
- `skill_offers`（若要把“专家资料”和“技能商品”拆开）
- `search_history`
- `hot_keywords`
- `conversations`（可继续由 RPC 聚合 `messages`，后续再物化）
- `user_verifications`（如单独证照材料体系）
- `question_tags`（当前 `questions.tags[]` 可满足一期）

> 说明：用户要求中的 `users` 建议映射为 `auth.users + profiles` 双层模型，不额外重复建 `public.users`。

---

## 4. 每张核心表关键字段建议（P0/P1）

## 4.1 P0

### `profiles`
- 用途：用户展示资料与账户扩展字段
- 主键：`id`（uuid）
- 关键字段：`user_id(unique)`、`nickname`、`avatar_url`、`bio`、`city`、`points_balance`、`latitude`、`longitude`
- 外键：`user_id -> auth.users.id`
- 状态字段：无（可后续加 `status`）
- 时间字段：`created_at`、`updated_at`

### `user_settings`
- 用途：通知/隐私/内容偏好
- 主键：`id`
- 关键字段：`user_id(unique)`、`notification_settings(jsonb)`、`privacy_settings(jsonb)`、`content_preferences(jsonb)`
- 外键：`user_id -> auth.users.id`
- 时间字段：`created_at`、`updated_at`

### `questions`
- 用途：提问主表
- 主键：`id`
- 关键字段：`user_id`、`title`、`content`、`channel`、`subcategory`、`category(兼容)`、`tags[]`、`bounty_points`、`view_count`、`is_hidden`
- 外键：`user_id -> auth.users.id`
- 状态字段：`status`（建议：`open/pending_payment/paid/solved/closed`）
- 时间字段：`created_at`、`updated_at`

### `drafts`（question_drafts）
- 用途：提问草稿持久化
- 主键：`id`
- 关键字段：`user_id`、`title`、`content`、`category/channel`、`tags[]`、`bounty_points`
- 外键：`user_id -> auth.users.id`
- 状态字段：可无
- 时间字段：`created_at`、`updated_at`

### `answers`
- 用途：问题回答
- 主键：`id`
- 关键字段：`question_id`、`user_id`、`content`、`is_accepted`、`likes_count`、`is_hidden`
- 外键：`question_id -> questions.id`，`user_id -> auth.users.id`
- 状态字段：`is_accepted` + `is_hidden`
- 时间字段：`created_at`、`updated_at`

### `experts`
- 用途：专家/技能供给主档案（一期可与 skill_offers 合并）
- 主键：`id`
- 关键字段：`user_id`、`title`、`bio`、`channel`、`subcategory`、`category`、`tags[]`、`consultation_price`、`response_time`、`experience_level`、`is_verified`、`is_active`
- 外键：`user_id -> auth.users.id`
- 状态字段：`is_active`、`is_verified`
- 时间字段：`created_at`、`updated_at`

### `messages`
- 用途：私信消息
- 主键：`id`
- 关键字段：`sender_id`、`receiver_id`、`content`、`message_type`、`read_at`、`is_hidden`
- 外键：`sender_id/receiver_id -> auth.users.id`
- 状态字段：`read_at`、`is_hidden`
- 时间字段：`created_at`

### `notifications`
- 用途：系统与互动通知
- 主键：`id`
- 关键字段：`user_id`、`type`、`title`、`content`、`related_id`、`related_type`、`sender_id`、`is_read`
- 外键：`user_id/sender_id -> auth.users.id`
- 状态字段：`is_read`
- 时间字段：`created_at`

### `orders`
- 用途：订单主表（充值/提问支付/咨询）
- 主键：`id`
- 关键字段：`user_id`、`order_type`、`related_id`、`amount(points)`、`cash_amount`、`payment_method`、`provider_order_id`、`provider_transaction_id`、`metadata(jsonb)`
- 外键：`user_id -> auth.users.id`
- 状态字段：`status`（`pending/paid/cancelled/refunded`）
- 时间字段：`created_at`、`paid_at`

### `points_transactions`
- 用途：积分流水账本
- 主键：`id`
- 关键字段：`user_id`、`type`、`amount`、`balance_after`、`related_id`、`description`、`status`
- 外键：`user_id -> auth.users.id`
- 状态字段：`status`（`pending/completed/failed`）
- 时间字段：`created_at`

### `hot_topics`
- 用途：热榜专题/话题
- 主键：`id`
- 关键字段：`title`、`description`、`cover_image`、`channel`、`subcategory`、`featured_priority`、`participants_count`、`discussions_count`、`is_active`
- 外键：`created_by -> auth.users.id`（建议）
- 状态字段：`is_active`
- 时间字段：`created_at`、`updated_at`

### `topic_discussions`
- 用途：专题内讨论
- 主键：`id`
- 关键字段：`topic_id`、`user_id`、`content`、`likes_count`、`is_hidden`
- 外键：`topic_id -> hot_topics.id`，`user_id -> auth.users.id`
- 状态字段：`is_hidden`
- 时间字段：`created_at`、`updated_at`

### `user_followers`（follows）
- 用途：关注关系（用户->用户）
- 主键：`id`
- 关键字段：`follower_id`、`following_id`
- 外键：两者均 -> `auth.users.id`
- 状态字段：可无
- 时间字段：`created_at`

## 4.2 P1（关键字段摘要）

- `favorites(user_id, question_id, created_at)`  
- `answer_likes(user_id, answer_id, created_at)`  
- `posts(user_id, content, images[], video, topics[], likes_count, comments_count, shares_count, created_at)`  
- `post_comments(post_id, user_id, content, likes_count, created_at)`  
- `post_likes(post_id, user_id, created_at)`  
- `talent_certifications(user_id, cert_type, details(jsonb), status, reviewed_at)`  
- `content_reports(reporter_id, target_type, target_id, reason, details, status, reviewed_by, reviewed_at)`  
- `content_moderation_logs(target_type, target_id, action, reason, actor_id, metadata, created_at)`  
- `audit_events(actor_id, event_type, entity_type, entity_id, severity, payload, created_at)`  
- `app_config(key, value jsonb, description, updated_by, updated_at)`  
- `payment_callbacks(order_id, provider, provider_transaction_id, payload, processed_at)`

---

## 5. 关键状态机（一期必须明确）

## 5.1 用户状态
- `active`（默认）
- `limited`（被限流或部分功能受限）
- `banned`（严重违规）

> 一期可先不建独立字段；可由 `user_roles + moderation` 组合实现，后续再显式化。

## 5.2 问题状态（`questions.status`）
- `open`：可被回答  
- `pending_payment`：需要支付后发布/生效  
- `paid`：支付成功，已上架  
- `solved`：已采纳  
- `closed`：关闭（超时/人工）

## 5.3 回答状态
- 可见状态：`is_hidden=false`
- 隐藏状态：`is_hidden=true`
- 采纳状态：`is_accepted=true/false`

## 5.4 技能发布状态（一期建议映射）
- `draft`（前端草稿本地+可后补服务端）
- `active`（`experts.is_active=true`）
- `inactive`（下架）
- `rejected`（认证/审核拒绝，P1）

## 5.5 订单状态（`orders.status`）
- `pending` -> `paid` ->（可选）`refunded`  
- 分支：`pending -> cancelled`

## 5.6 通知状态
- `unread`（`is_read=false`）
- `read`（`is_read=true`）

## 5.7 举报状态（P1）
- `pending` -> `reviewing` -> `resolved | rejected`

---

## 6. 表关系与依赖顺序

## 6.1 关系类型

- 一对一：
  - `auth.users` -> `profiles`
  - `auth.users` -> `user_settings`（逻辑一对一）
- 一对多：
  - `profiles(user)` -> `questions`
  - `questions` -> `answers`
  - `profiles(user)` -> `orders` / `points_transactions` / `messages(sent|received)` / `notifications`
  - `hot_topics` -> `topic_discussions`
- 多对多（中间表）：
  - 用户 <-> 问题（`favorites`）
  - 用户 <-> 回答（`answer_likes`）
  - 用户 <-> 用户（`user_followers`）
  - 用户 <-> 帖子（`post_likes`）
  - 用户 <-> 话题（`topic_followers`）

## 6.2 建表依赖顺序（建议）

1. `profiles`, `user_settings`, `user_roles`  
2. `questions`, `answers`, `favorites`, `answer_likes`, `drafts`  
3. `experts`, `talent_certifications`  
4. `messages`, `notifications`  
5. `orders`, `points_transactions`, `payment_callbacks`  
6. `hot_topics`, `topic_discussions`, `discussion_likes`, `topic_followers`  
7. `posts`, `post_comments`, `post_likes`  
8. `content_reports`, `content_moderation_logs`, `audit_events`, `app_config`

## 6.3 RLS优先级

强烈建议开启并重点保证：

- 强RLS（仅本人可见/可改）：`profiles(update)`、`user_settings`、`drafts`、`orders`、`points_transactions`、`messages`、`notifications`
- 公共读 + 本人写：`questions`、`answers`、`posts`、`topic_discussions`、`experts(active)`
- 管理员读写：`content_reports`、`moderation_logs`、`audit_events`、`app_config`、`payment_callbacks`

---

## 7. Supabase 落地建议

## 7.1 Auth
- 直接使用 `supabase.auth`（邮箱密码已接入）
- 用户扩展信息全部挂 `profiles`
- 登录后回跳路径继续沿用前端 `from state` 策略

## 7.2 Postgres
- 业务主数据全部进 Postgres（现阶段已基本成立）
- 关键跨表聚合优先 RPC：如 `get_channel_feed`、`search_app_content`、`get_user_conversations`

## 7.3 Storage
- `avatars`：头像/专家封面（现有）
- `post-media`：发现页媒体（现有）
- 后续可加 `certification-materials`（P2）

## 7.4 Realtime
- `messages`、`notifications` 两张表最关键（现有前端订阅）
- 一期不要扩大到所有表，避免客户端复杂度上升

## 7.5 Edge Functions
- 支付：`wechat-prepay`、`payment-webhook`（已存在）
- 适合继续放 Edge 的逻辑：
  - 第三方支付验签与回调入账
  - 高风险管理员动作审计写入
  - 未来外部审核服务桥接

## 7.6 后续可能独立服务（一期不做）
- 高级检索/召回（ES/向量检索）
- 推荐策略服务
- 风控模型服务
- 对账清结算服务

---

## 8. 一期实现建议顺序

1. **收敛数据契约**：统一 `channel/subcategory`，更新前端 `types.ts`
2. **稳核心链路**：提问->回答->采纳->积分流水
3. **稳交易链路**：充值下单->回调确认->到账->订单可追踪
4. **稳消息通知**：会话聚合、已读、未读计数
5. **稳发现与搜索**：先确保“可用+一致”，再做排序优化
6. **后台最小闭环**：举报处理、内容隐藏/恢复、补单确认、配置项

---

## 9. 风险点

1. `category` 与 `channel/subcategory` 双轨并存，若不收敛会导致筛选错乱。  
2. 前端 fallback 较多，容易掩盖后端真实问题。  
3. 支付当前仍含 mock 部分，生产化需补真实网关下单/验签。  
4. 类型定义可能落后于迁移（需固定“迁移后自动生成 types”流程）。  
5. RLS 若未覆盖完整，会出现越权读写风险。

---

## 10. 下一步最适合执行的任务

进入第二阶段：**一期核心数据表清单定版（P0/P1/P2）+ 字段字典 v1**，并输出：

- 最终保留表（与现有表映射）
- 新增/废弃候选表
- 每表必填字段与索引清单
- 供后续 migration 编写使用的“实现清单”

