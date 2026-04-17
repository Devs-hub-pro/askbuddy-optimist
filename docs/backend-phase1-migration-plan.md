# 后端一期迁移计划（Step 3）

> 依赖文档：  
> - `docs/backend-phase1-schema-plan.md`  
> - `docs/backend-phase1-field-dictionary-v1.1.md`  
> 目标：定版状态机与表关系，拆分可执行 migration 包（不在本阶段输出全量 SQL）。

---

## 1. 第三步修正确认（4 个问题）

## 1.1 `orders` 建模修正（结论：改为双边交易）

### 最终建议
- `orders` 从单 `user_id` 改为：
  - `buyer_id`（下单/支付方）
  - `seller_id`（履约/服务方，可为空：充值场景）
  - `order_type`（`recharge | question_bounty | consultation | skill_service`）
  - `biz_ref_type` + `biz_ref_id`（关联问题、回答、技能等）

### 为什么
- 当前产品天然是双边关系（提问方/回答方、需求方/技能方）。
- 单 `user_id` 模型会导致收益归属、对账、退款、仲裁后续返工。

### 一期粒度
- 一期先支持 `recharge`、`question_bounty`、`consultation` 三类订单。
- `seller_id` 在 `recharge` 可为空；在咨询/技能/问答打赏类必须有值。
- 暂不做复杂履约子单，先保持单表 + 状态字段可扩展。

---

## 1.2 `points_balance` 建模修正（结论：账户表 + 流水表双层）

### 最终建议
- 从 `profiles.points_balance` 迁移到：
  - `point_accounts`（每用户一行，存当前余额、冻结余额、版本号）
  - `point_transactions`（不可变流水）

### 为什么不建议仅放在 `profiles`
- `profiles` 是展示资料，不是资金账户域，写入链路复杂后会出现并发覆盖。
- 积分扣减/退款/补单需要事务一致性与幂等，资料表难承载。

### 一期粒度
- 一期即建 `point_accounts` + `point_transactions`。
- `profiles` 不再保存余额；前端通过视图/RPC 取账户余额。
- 余额更新统一经事务函数（后续 Pack 中补 Edge Function / RPC）。

---

## 1.3 位置字段修正（结论：一期降级到城市级）

### 最终建议
- `profiles` 一期仅保留：
  - `city`
  - `city_code`（可空）
- `latitude/longitude` 延后到二期。

### 为什么
- 当前“同城”能力仅需城市筛选，不需要精准距离排序。
- 经纬度涉及隐私、授权、更新频率与 RLS 限制，复杂度高。

### 一期收益
- 降低隐私与合规风险。
- 降低前端定位与后端查询耦合，联调更快。

---

## 1.4 `skill_offers` 优先级修正（结论：提升到 P1，先最小占位）

### 最终建议
- `skill_offers` 从 P2 提升到 P1。
- 一期先建“最小可用版本”：
  - `id, user_id, title, description, channel, subcategory, price_points, delivery_mode, status, is_active, created_at, updated_at`

### 为什么
- 前端已有 SkillPublish / 专家详情 / 发布入口。
- 若无供给侧独立表，后续技能交易会被 `experts` 过载。

### 一期粒度
- 不做库存、复杂套餐、履约里程碑。
- 先保证：可发布、可展示、可下单关联。

---

## 2. 状态机定版（一期可用版）

> 原则：状态少而清晰，先保证主链路可用。

## 2.1 用户状态（`profiles.status`，P1 启用）
- 枚举：`active | limited | banned`
- 流转：
  - `active -> limited -> active`
  - `active -> banned`（仅管理员）
- 一期启用：`active/banned`；`limited` 先预留。

## 2.2 认证状态（`user_verifications.status`）
- 枚举：`pending | approved | rejected`
- 流转：
  - `pending -> approved`
  - `pending -> rejected`
  - `rejected -> pending`（重新提交）

## 2.3 问题状态（`questions.status`）
- 枚举：`draft | open | matched | solved | closed | hidden`
- 流转（一期）：
  - `draft -> open`
  - `open -> solved | closed`
  - `open -> hidden`（审核）
  - `solved -> closed`
- 预留：`matched`（后续推荐/派单）。

## 2.4 回答状态（`answers.status`）
- 枚举：`active | accepted | hidden | rejected`
- 流转（一期）：
  - `active -> accepted`
  - `active -> hidden`
  - `hidden -> active`（申诉通过）
- `rejected` 先预留给审核拒绝。

## 2.5 技能发布状态（`skill_offers.status`）
- 枚举：`draft | published | paused | closed | rejected`
- 流转（一期）：
  - `draft -> published`
  - `published -> paused -> published`
  - `published -> closed`
  - `draft/published -> rejected`（审核）

## 2.6 帖子状态（`posts.status`）
- 枚举：`active | hidden | deleted`
- 流转（一期）：
  - `active -> hidden`
  - `active -> deleted`（作者或管理员）

## 2.7 订单状态（`orders.order_status`）
- 枚举：`created | pending_payment | paid | cancelled | refunded | failed`
- 流转（一期）：
  - `created -> pending_payment -> paid`
  - `pending_payment -> cancelled | failed`
  - `paid -> refunded`（人工/风控）

## 2.8 支付状态（`orders.payment_status`）
- 枚举：`unpaid | paying | paid | refunding | refunded | payment_failed`
- 流转：与 `order_status` 同步推进；支付通道回调优先驱动 `payment_status`。

## 2.9 通知状态（`notifications.status`）
- 枚举：`unread | read | archived`
- 流转：
  - `unread -> read`
  - `read -> archived`

---

## 3. 表关系定版（P0/P1）

## 3.1 用户域
- `auth.users (1) -> (1) profiles`
- `auth.users (1) -> (1) user_settings`
- `auth.users (1) -> (N) user_verifications`
- `auth.users (1) -> (1) point_accounts`

## 3.2 问答域
- `auth.users (1) -> (N) questions`
- `questions (1) -> (N) answers`
- `auth.users (1) -> (N) answers`
- `auth.users (1) -> (N) question_drafts`
- `questions (N) <-> (N) tags`：一期先 `questions.tags[]` 简化，不建 `question_tags`。

## 3.3 专家与技能域
- `auth.users (1) -> (N) experts`（一期可限制唯一活跃档案）
- `auth.users (1) -> (N) skill_offers`
- `skill_categories (1) -> (N) skill_offers`（一期可选，分类可先枚举）

## 3.4 发现与互动域
- `auth.users (1) -> (N) posts`
- `posts (1) -> (N) post_comments`
- `posts (1) -> (N) post_likes`
- `auth.users (N) <-> (N) auth.users` 通过 `follows`

## 3.5 消息与通知域
- `conversations (1) -> (N) conversation_members`
- `conversations (1) -> (N) messages`
- `auth.users (1) -> (N) messages(sender)`
- `auth.users (1) -> (N) notifications`

## 3.6 交易与积分域
- `orders` 关联：
  - `buyer_id -> auth.users.id`
  - `seller_id -> auth.users.id`（可空）
- `orders (1) -> (N) point_transactions`（按 `biz_ref_type/order_id`）
- `point_accounts (1) -> (N) point_transactions`
- `orders` 与 `payment_callbacks` 一对多（同一单可能多次回调）。

---

## 4. Migration Pack 拆分清单

## Pack 01：身份与账户基础层（P0）
- 表：`profiles`, `user_settings`, `point_accounts`, `user_roles(可选)`, `user_verifications`
- 动作：基础约束、触发器（更新时间）、基础索引、RLS 骨架

## Pack 02：提问与回答主链路（P0）
- 表：`questions`, `question_drafts`, `answers`, `answer_likes`, `favorites(可选P1并入)`
- 动作：状态约束、列表/详情索引、RLS 骨架

## Pack 03：专家与技能供给层（P1）
- 表：`experts`, `skill_offers`, `skill_categories(可选)`
- 动作：频道与分类索引、可见性字段约束、RLS 骨架

## Pack 04：发现与社交关系层（P1）
- 表：`posts`, `post_likes`, `post_comments`, `follows`, `hot_topics`, `topic_discussions`, `topic_followers`
- 动作：时间线索引、互动去重约束、RLS 骨架

## Pack 05：消息与通知层（P1）
- 表：`conversations`, `conversation_members`, `messages`, `notifications`
- 动作：会话唯一键、未读索引、Realtime 订阅字段

## Pack 06：订单与积分账务层（P0）
- 表：`orders`, `point_transactions`, `payment_callbacks`
- 动作：双边订单约束、账务幂等键、状态索引、RLS 边界

## Pack 07：后台审核与运营层（P1/P2）
- 表：`content_reports`, `content_moderation_logs`, `audit_events`, `app_config`, `recommendation_slots(可选)`
- 动作：管理员权限、审计索引、配置唯一键

## Pack 08：搜索增强与分析层（P2）
- 表：`search_history`, `hot_keywords`, `question_tags(可选)`
- 动作：搜索热词索引、清理策略字段、轻量 RLS

---

## 5. 每个 Pack 的交付定义

## Pack 01 交付定义
- 依赖：无（起始包）
- 完成后支撑：登录后个人资料、设置、积分余额展示
- RLS：`owner can read/write self`; 管理员可读全部
- seed：默认 `user_settings` 模板

## Pack 02 交付定义
- 依赖：Pack 01（用户键）
- 完成后支撑：首页问题流、频道流、提问、草稿、回答
- RLS：问题公开可读；作者可改；回答作者可改自己
- seed：频道枚举可写入 `app_config`

## Pack 03 交付定义
- 依赖：Pack 01
- 完成后支撑：专家卡、技能发布、技能详情基础数据
- RLS：公开读 `published`; 作者可改自己的 offer/expert
- seed：`skill_categories`（若落表）

## Pack 04 交付定义
- 依赖：Pack 01
- 完成后支撑：发现页、互动、热榜讨论与关注关系
- RLS：帖子公开读，作者写；点赞评论登录可写
- seed：`hot_topics` 初始专题

## Pack 05 交付定义
- 依赖：Pack 01
- 完成后支撑：私信列表、聊天详情、通知中心
- RLS：仅会话成员可读消息；通知仅本人可读写
- realtime：`messages`, `notifications` 打开实时订阅

## Pack 06 交付定义
- 依赖：Pack 01 + Pack 02/03（业务引用）
- 完成后支撑：充值、悬赏扣点、咨询下单、收益流水
- RLS：买家/卖家可读自身订单；账务写入主要由 service role
- seed：无

## Pack 07 交付定义
- 依赖：Pack 02/04/06（被审核对象）
- 完成后支撑：举报审核、后台配置、操作审计
- RLS：管理员写，普通用户仅提交举报
- seed：`app_config` 默认键值

## Pack 08 交付定义
- 依赖：Pack 02/03/04
- 完成后支撑：搜索历史同步、热词运营
- RLS：`search_history` owner-only
- seed：`hot_keywords` 初始词

---

## 6. Supabase 落地建议（本阶段）

## 6.1 纯 SQL migration 可完成
- Pack 01 ~ 08 的建表、索引、外键、检查约束、基础 RLS policy 框架。

## 6.2 需要 Edge Functions 配合
- 订单创建与支付回调验签（`orders`, `payment_callbacks`）。
- 积分扣减/入账（保证 `point_accounts` + `point_transactions` 事务一致性）。
- 管理员审核动作（写 `content_moderation_logs` + 通知）。

## 6.3 需要 Storage bucket
- 认证材料：`verification-docs`
- 问题/帖子图片：`question-media`, `post-media`
- 专家/技能封面：`expert-media`

## 6.4 需要 Realtime
- `messages`（聊天）
- `notifications`（提醒）
- 其余列表先不强制实时，降低复杂度。

## 6.5 需要 Auth hook / server-side 逻辑
- 新用户注册后初始化 `profiles`, `user_settings`, `point_accounts`（trigger/edge 二选一）。
- 管理员角色校验（`user_roles` + service role）。

## 6.6 一期暂不做
- 独立搜索引擎集群
- 复杂推荐流水线
- 复杂结算中心/分账引擎

---

## 7. 风险点与待确认项

1. `orders` 的 `biz_ref_type` 枚举需与你确认是否仅含：`question|consultation|skill|recharge`。  
2. 是否一期就引入 `conversation_members`（建议引入，避免后续群聊返工）。  
3. `experts` 是否限制“一人仅一个 active 档案”。  
4. `skill_categories` 一期是否落表（建议落轻量表，便于后台运营）。  
5. 支付通道优先级（微信/支付宝）决定 `payment_callbacks` 字段细节。  
6. 审核域是否一期启用“自动机审结果字段”（建议先预留，不启用）。

---

## 8. 下一步最适合执行的任务

> 第四步：按 Pack 顺序生成 Supabase migration（先 P0 后 P1）。

建议立即执行：
1. 先生成 Pack 01、Pack 02、Pack 06 的 migration（身份/问答/账务主链路）。  
2. 同步输出对应 RLS policy 草案（owner policy + admin policy）。  
3. 再生成 Pack 03、Pack 05（技能供给 + 消息通知），进入前端联调。  
4. 最后补 Pack 04、07、08（发现/审核/搜索增强）。
