# 后端一期字段字典 v1.1（文档一致性修正版）

> 修订基线：  
> - `docs/backend-phase1-field-dictionary-v1.md`  
> - `docs/backend-phase1-migration-plan.md`  
> 目的：在进入第四步 migration SQL 前，消除 v1 与 migration plan 的关键冲突。

---

## 1. 修订摘要

本次仅修正“v1 与第三步迁移计划不一致”的部分，不新增业务域、不扩散设计范围。

### 1.1 本次关键修订
1. `profiles.points_balance` 从核心模型中移除，改为 `point_accounts + point_transactions` 双层账务。  
2. `profiles` 位置字段从经纬度降级到城市级（`city`, `city_code`）。  
3. `orders` 从单 `user_id` 改为双边交易模型（`buyer_id`, `seller_id`）。  
4. `skill_offers` 从 P2 提升为 P1，给出最小占位版字段字典。  
5. 对齐优先级分层（特别是 `notifications`、`hot_topics`、`topic_discussions`、`search_history`）。  

### 1.2 为什么必须先修
- 若继续使用旧版 v1 直接写 SQL，会把过期设计（如 `profiles.points_balance`、`orders.user_id`）写入数据库，后续返工成本高。  
- 第四步 migration 需要稳定输入文档，本修订确保字段字典与 migration pack 逻辑一致。  

### 1.3 一致性结论
- v1.1 已与 `backend-phase1-migration-plan.md` 对齐。  
- 可作为第四步 Supabase migration SQL 的直接输入文档。  

---

## 2. 修正版核心表优先级清单

> 以第三步 migration pack 优先级为准。

## P0（必须先建）
- `auth.users`（内置）
- `profiles`
- `user_settings`
- `point_accounts`
- `questions`
- `question_drafts`
- `answers`
- `orders`
- `point_transactions`

## P1（建议一期建）
- `user_verifications`（可复用/映射 `talent_certifications`）
- `experts`
- `skill_offers`
- `posts`
- `post_likes`
- `post_comments`
- `follows`
- `hot_topics`
- `topic_discussions`
- `topic_followers`
- `conversations`
- `conversation_members`
- `messages`
- `notifications`
- `payment_callbacks`
- `content_reports`
- `content_moderation_logs`
- `audit_events`
- `app_config`

## P2（可延后）
- `skill_categories`（可枚举先行）
- `search_history`
- `hot_keywords`
- `question_tags`
- `recommendation_slots`

---

## 3. 修正版字段字典（仅列发生变化的表）

## 3.1 `profiles`（修订）

### 修订点（相对 v1）
- 删除一期必须字段：`points_balance`  
- 删除一期必须字段：`latitude`, `longitude`  
- 新增/保留城市级字段：`city`, `city_code`  

### 字段建议（v1.1）
| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | PK | 主键 | 必须 |
| user_id | uuid | 是 | - | 是 | 否 | unique idx | 对应 auth 用户 | 必须 |
| nickname | text | 否 | '新用户' | 否 | 是 | 否 | 昵称 | 必须 |
| avatar_url | text | 否 | null | 否 | 是 | 否 | 头像 | 必须 |
| bio | text | 否 | null | 否 | 是 | 否 | 简介 | 必须 |
| city | text | 否 | null | 否 | 是 | idx(city) | 城市名 | 必须 |
| city_code | text | 否 | null | 否 | 是 | idx(city_code) | 城市编码 | 必须 |
| status | text | 否 | 'active' | 否 | 否 | idx(status) | 用户状态 | P1 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at) | 创建时间 | 必须 |
| updated_at | timestamptz | 是 | now() | 否 | 否 | 否 | 更新时间 | 必须 |

修订原因：  
- 余额应在资金域管理，资料表不承载账务一致性。  
- 一期“同城”不需要精确经纬度，城市级足够且隐私风险更低。  

---

## 3.2 `point_accounts`（新增为 P0）

### 业务说明
- 用户积分账户（余额快照），与流水表配合实现可审计账务。

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | PK | - | 主键 | 必须 |
| user_id | uuid | 是 | - | 是 | 否 | unique idx | auth.users.id | 账户归属用户 | 必须 |
| available_balance | integer | 是 | 0 | 否 | 否 | 否 | - | 可用积分 | 必须 |
| frozen_balance | integer | 是 | 0 | 否 | 否 | 否 | - | 冻结积分 | 必须 |
| version | bigint | 是 | 0 | 否 | 否 | 否 | - | 乐观锁版本 | 必须 |
| updated_at | timestamptz | 是 | now() | 否 | 否 | idx(updated_at) | - | 更新时间 | 必须 |
| created_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 创建时间 | 必须 |

---

## 3.3 `point_transactions`（修订）

### 修订点（相对 v1）
- 强化与 `point_accounts`、`orders` 的关联，不再以 `profiles.points_balance` 作为余额来源。  
- `balance_after` 可保留（审计快照），但账户真值以 `point_accounts` 为准。  

| 字段 | 类型 | 必填 | 默认值 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | PK | - | 主键 | 必须 |
| account_id | uuid | 是 | - | idx(account_id,created_at desc) | point_accounts.id | 积分账户 | 必须 |
| user_id | uuid | 是 | - | idx(user_id,created_at desc) | auth.users.id | 用户冗余键（便查） | 必须 |
| order_id | uuid | 否 | null | idx(order_id) | orders.id | 关联订单 | P1 |
| txn_type | text | 是 | - | idx(txn_type) | - | recharge/debit/refund/reward 等 | 必须 |
| direction | text | 是 | - | 否 | - | in/out | 必须 |
| amount | integer | 是 | - | 否 | - | 变动值（正数） | 必须 |
| balance_after | integer | 是 | - | 否 | - | 交易后账户余额快照 | 必须 |
| biz_ref_type | text | 否 | null | idx(biz_ref_type,biz_ref_id) | - | 业务来源类型 | 必须 |
| biz_ref_id | uuid | 否 | null | idx(biz_ref_type,biz_ref_id) | - | 业务来源ID | 必须 |
| idempotency_key | text | 否 | null | unique idx(partial) | - | 幂等控制键 | P1 |
| status | text | 是 | 'completed' | idx(status) | - | pending/completed/failed | 必须 |
| created_at | timestamptz | 是 | now() | idx(created_at desc) | - | 创建时间 | 必须 |

---

## 3.4 `orders`（修订）

### 修订点（相对 v1）
- 由单 `user_id` 改为双边关系：`buyer_id` + `seller_id`。  
- 状态拆分为 `order_status` 与 `payment_status`（与 migration plan 对齐）。  

| 字段 | 类型 | 必填 | 默认值 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | PK | - | 主键 | 必须 |
| buyer_id | uuid | 是 | - | idx(buyer_id,created_at desc) | auth.users.id | 支付方 | 必须 |
| seller_id | uuid | 否 | null | idx(seller_id,created_at desc) | auth.users.id | 履约方（充值可空） | 必须 |
| order_type | text | 是 | - | idx(order_type,created_at desc) | - | recharge/question_bounty/consultation/skill_service | 必须 |
| biz_ref_type | text | 否 | null | idx(biz_ref_type,biz_ref_id) | - | 业务对象类型 | 必须 |
| biz_ref_id | uuid | 否 | null | idx(biz_ref_type,biz_ref_id) | - | 业务对象ID | 必须 |
| points_amount | integer | 否 | 0 | 否 | - | 积分金额 | 必须 |
| cash_amount | numeric(12,2) | 否 | 0 | 否 | - | 现金金额 | 必须 |
| payment_method | text | 否 | null | idx(payment_method) | - | wechat/alipay/internal | 必须 |
| provider_order_id | text | 否 | null | unique idx(partial) | - | 三方单号 | P1 |
| provider_transaction_id | text | 否 | null | unique idx(partial) | - | 三方交易号 | P1 |
| order_status | text | 是 | 'created' | idx(order_status,created_at desc) | - | 订单状态机字段 | 必须 |
| payment_status | text | 是 | 'unpaid' | idx(payment_status,created_at desc) | - | 支付状态机字段 | 必须 |
| metadata | jsonb | 否 | '{}'::jsonb | 否 | - | 扩展信息 | 必须 |
| created_at | timestamptz | 是 | now() | idx(created_at desc) | - | 创建时间 | 必须 |
| paid_at | timestamptz | 否 | null | idx(paid_at) | - | 支付完成时间 | P1 |
| updated_at | timestamptz | 是 | now() | 否 | - | 更新时间 | 必须 |

修订原因：  
- “找人问问”是双边交易场景，单边 `user_id` 不足以支持收益与对账。  

---

## 3.5 `skill_offers`（优先级与字段修订）

### 修订点（相对 v1）
- 从 P2 提升到 P1。  
- 明确最小占位字段，支撑前端 SkillPublish / 发布入口 / 专家页联调。  

| 字段 | 类型 | 必填 | 默认值 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | PK | - | 主键 | P1 |
| user_id | uuid | 是 | - | idx(user_id,updated_at desc) | auth.users.id | 发布人 | P1 |
| expert_id | uuid | 否 | null | idx(expert_id) | experts.id | 可选关联专家档案 | P1 |
| title | text | 是 | - | idx(title) | - | 技能标题 | P1 |
| description | text | 否 | null | 否 | - | 技能描述 | P1 |
| channel | text | 否 | null | idx(channel,subcategory,status) | - | 频道 | P1 |
| subcategory | text | 否 | null | idx(channel,subcategory,status) | - | 子类 | P1 |
| price_points | integer | 是 | 0 | idx(price_points) | - | 积分价格 | P1 |
| delivery_mode | text | 否 | 'online' | idx(delivery_mode) | - | online/offline/hybrid | P1 |
| status | text | 是 | 'draft' | idx(status,updated_at desc) | - | 技能状态机字段 | P1 |
| is_active | boolean | 是 | true | idx(is_active,updated_at desc) | - | 是否展示 | P1 |
| created_at | timestamptz | 是 | now() | idx(created_at desc) | - | 创建时间 | P1 |
| updated_at | timestamptz | 是 | now() | idx(updated_at desc) | - | 更新时间 | P1 |

---

## 3.6 其他优先级变化表（只列修订结论）

- `notifications`：由 v1 的 P0 调整为 P1（与 Pack 05 一致）。  
- `hot_topics` / `topic_discussions`：由 v1 的 P0 调整为 P1（与 Pack 04 一致）。  
- `search_history`：保持 P2（与 Pack 08 一致）。  
- `posts`：保持 P1（与 Pack 04 一致）。  

---

## 4. 与 migration 计划的一致性说明

本修正版已与 `docs/backend-phase1-migration-plan.md` 对齐，核心一致性如下：

1. 账务模型一致：`point_accounts + point_transactions`（不再依赖 `profiles.points_balance`）。  
2. 订单模型一致：`buyer_id/seller_id + order_type + biz_ref`。  
3. 位置模型一致：一期城市级（`city/city_code`），经纬度延后。  
4. `skill_offers` 优先级一致：提升为 P1，且给出最小可用字段。  
5. 表优先级一致：按 Pack 分层（P0/P1/P2）统一。  

当前未发现阻塞第四步的结构冲突。

---

## 5. 下一步建议

### 5.1 是否可以进入第四步
- 可以，建议立即进入第四步 Supabase migration SQL 生成。  

### 5.2 第四步建议起始顺序
1. 先写 `Pack 01`（身份与账户基础：`profiles/user_settings/point_accounts`）。  
2. 再写 `Pack 02`（提问回答主链路）。  
3. 再写 `Pack 06`（订单与积分账务）。  

### 5.3 先实现先审查的包
- 第一批审查：Pack 01 + Pack 02（前端主路径联调价值最高）。  
- 第二批审查：Pack 06（账务正确性风险最高，需重点审）。  
- 第三批补齐：Pack 03 + Pack 05（技能供给、消息通知）。  

