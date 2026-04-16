# 后端一期字段字典 v1（可转 Migration 任务）

> 依据文档：`backend-phase1-schema-plan.md`  
> 目标：把一期核心表定版到可直接进入 Supabase migration 设计。  
> 约束：不做过度设计，优先服务现有前端页面与 hooks。

---

## 1. 一期核心表最终清单

## P0（必须立即建/立即稳定）

- `auth.users`（Supabase 内置，作为账号主身份）
- `profiles`
- `user_settings`
- `questions`
- `question_drafts`（映射现有 `drafts`，建议迁移命名）
- `answers`
- `experts`
- `messages`
- `notifications`
- `orders`
- `point_transactions`（映射现有 `points_transactions`）
- `hot_topics`
- `topic_discussions`
- `follows`（映射现有 `user_followers`）

## P1（建议一期建）

- `answer_likes`
- `favorites`
- `posts`
- `post_likes`
- `post_comments`
- `topic_followers`
- `talent_certifications`（建议作为 `user_verifications` 一期替代）
- `content_reports`
- `content_moderation_logs`
- `audit_events`
- `app_config`
- `payment_callbacks`

## P2（可延后）

- `skill_categories`
- `skill_offers`（若把 experts 与商品化技能拆表）
- `search_history`
- `hot_keywords`
- `conversations`（当前可继续由 `messages` 聚合）
- `question_tags`（当前先用 `questions.tags[]`）

---

## 2. 字段字典 v1（P0 / P1）

> 字段属性约定：  
> `必填`=是否业务必填；`可空`=DB nullable；`一期`=MVP 必须 / 后补。  
> 类型默认 PostgreSQL。

## 2.1 账号与用户域

## 表：`auth.users`（内置）
- 说明：Supabase 认证主表，不在 `public` 自建重复 `users`。
- 主键：`id uuid`
- 一期使用字段：`id`, `email`, `created_at`, `last_sign_in_at`, `raw_user_meta_data`
- 一期策略：只读映射，不直接业务写。

## 表：`profiles`
- 业务说明：用户公开资料与账户扩展。
- 主键：`id uuid pk default gen_random_uuid()`
- 外键：`user_id uuid unique not null -> auth.users(id) on delete cascade`

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 内部主键 | 必须 |
| user_id | uuid | 是 | - | 是 | 否 | unique idx | auth.users.id | 账号关联键 | 必须 |
| nickname | text | 否 | '新用户' | 否 | 是 | 否 | - | 昵称 | 必须 |
| avatar_url | text | 否 | null | 否 | 是 | 否 | - | 头像 URL | 必须 |
| cover_url | text | 否 | null | 否 | 是 | 否 | - | 个人封面 | 后补 |
| bio | text | 否 | null | 否 | 是 | 否 | - | 个人简介 | 必须 |
| phone | text | 否 | null | 否 | 是 | 否 | - | 手机号展示 | 后补 |
| city | text | 否 | null | 否 | 是 | idx(city) | - | 城市/同城 | 必须 |
| latitude | double precision | 否 | null | 否 | 是 | idx(lat,lng) | - | 定位纬度 | 必须 |
| longitude | double precision | 否 | null | 否 | 是 | idx(lat,lng) | - | 定位经度 | 必须 |
| points_balance | integer | 是 | 0 | 否 | 否 | 否 | - | 当前积分余额 | 必须 |
| status | text | 否 | 'active' | 否 | 否 | idx(status) | - | active/limited/banned | 后补 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at) | - | 创建时间 | 必须 |
| updated_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 更新时间 | 必须 |

## 表：`user_settings`
- 业务说明：用户设置（通知/隐私/偏好）。
- 主键：`id uuid`
- 外键：`user_id unique -> auth.users(id)`

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | 必须 |
| user_id | uuid | 是 | - | 是 | 否 | unique idx | auth.users.id | 用户 | 必须 |
| notification_settings | jsonb | 是 | '{}'::jsonb | 否 | 否 | 否 | - | 通知偏好 | 必须 |
| privacy_settings | jsonb | 是 | '{}'::jsonb | 否 | 否 | 否 | - | 隐私配置 | 必须 |
| content_preferences | jsonb | 是 | '{}'::jsonb | 否 | 否 | 否 | - | 内容偏好 | 必须 |
| created_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 创建时间 | 必须 |
| updated_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 更新时间 | 必须 |

## 表：`user_verifications`（建议映射 `talent_certifications`）
- 业务说明：认证申请与审核状态。
- 一期策略：直接复用/重命名 `talent_certifications`，避免重复建模。

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | P1 |
| user_id | uuid | 是 | - | 否 | 否 | idx(user_id,status) | auth.users.id | 申请人 | P1 |
| cert_type | text | 是 | - | 否 | 否 | idx(cert_type) | - | education/profession/skill | P1 |
| details | jsonb | 否 | '{}'::jsonb | 否 | 是 | 否 | - | 认证详情与材料 | P1 |
| status | text | 是 | 'pending' | 否 | 否 | idx(status) | - | pending/approved/rejected | P1 |
| reviewed_by | uuid | 否 | null | 否 | 是 | idx(reviewed_by) | auth.users.id | 审核人 | 后补 |
| reviewed_at | timestamptz | 否 | null | 否 | 是 | 否 | - | 审核时间 | P1 |
| created_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 创建时间 | P1 |
| updated_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 更新时间 | P1 |

---

## 2.2 提问与回答域

## 表：`questions`
- 业务说明：提问主表，首页/频道/搜索/详情核心来源。
- 主键：`id uuid`
- 外键：`user_id -> auth.users(id)`

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | 必须 |
| user_id | uuid | 是 | - | 否 | 否 | idx(user_id,created_at desc) | auth.users.id | 提问人 | 必须 |
| title | text | 是 | - | 否 | 否 | idx trigram/fts | - | 问题标题 | 必须 |
| content | text | 否 | null | 否 | 是 | idx trigram/fts | - | 问题正文 | 必须 |
| channel | text | 否 | null | 否 | 是 | idx(channel,subcategory,created_at desc) | - | 频道枚举 | 必须 |
| subcategory | text | 否 | null | 否 | 是 | idx(channel,subcategory,created_at desc) | - | 子类枚举 | 必须 |
| category | text | 否 | null | 否 | 是 | idx(category) | - | 历史兼容字段 | 兼容 |
| tags | text[] | 否 | '{}' | 否 | 是 | gin(tags) | - | 标签数组 | 必须 |
| bounty_points | integer | 是 | 0 | 否 | 否 | idx(bounty_points) | - | 悬赏积分 | 必须 |
| status | text | 是 | 'open' | 否 | 否 | idx(status,created_at desc) | - | 问题状态 | 必须 |
| is_hidden | boolean | 是 | false | 否 | 否 | idx(is_hidden,created_at desc) | - | 审核隐藏标记 | 必须 |
| view_count | integer | 是 | 0 | 否 | 否 | idx(view_count desc) | - | 浏览数 | 必须 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at desc) | - | 创建时间 | 必须 |
| updated_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 更新时间 | 必须 |

## 表：`question_drafts`（建议映射现有 `drafts`）

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | 必须 |
| user_id | uuid | 是 | - | 否 | 否 | idx(user_id,updated_at desc) | auth.users.id | 草稿所属用户 | 必须 |
| title | text | 否 | '' | 否 | 否 | 否 | - | 草稿标题 | 必须 |
| content | text | 否 | null | 否 | 是 | 否 | - | 草稿正文 | 必须 |
| channel | text | 否 | null | 否 | 是 | idx(user_id,channel) | - | 频道 | 必须 |
| subcategory | text | 否 | null | 否 | 是 | 否 | - | 子类 | 必须 |
| tags | text[] | 否 | '{}' | 否 | 是 | 否 | - | 标签 | 必须 |
| bounty_points | integer | 否 | 0 | 否 | 是 | 否 | - | 悬赏 | 必须 |
| created_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 创建时间 | 必须 |
| updated_at | timestamptz | 是 | now() | 否 | 否 | idx(updated_at desc) | - | 更新时间 | 必须 |

## 表：`question_tags`（P2，可延后）
- 一期不拆，先使用 `questions.tags[]` + GIN。
- 二期若要治理标签质量再拆：`(question_id, tag, source, normalized_tag)`.

## 表：`answers`

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | 必须 |
| question_id | uuid | 是 | - | 否 | 否 | idx(question_id,created_at) | questions.id | 问题 | 必须 |
| user_id | uuid | 是 | - | 否 | 否 | idx(user_id,created_at desc) | auth.users.id | 回答人 | 必须 |
| content | text | 是 | - | 否 | 否 | 否 | - | 回答内容 | 必须 |
| is_accepted | boolean | 是 | false | 否 | 否 | idx(question_id,is_accepted) | - | 是否采纳 | 必须 |
| is_hidden | boolean | 是 | false | 否 | 否 | idx(is_hidden) | - | 审核隐藏 | 必须 |
| likes_count | integer | 是 | 0 | 否 | 否 | idx(likes_count desc) | - | 点赞计数 | 必须 |
| status | text | 否 | 'active' | 否 | 否 | idx(status) | - | active/hidden/deleted | 后补 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at) | - | 创建时间 | 必须 |
| updated_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 更新时间 | 必须 |

## 表：`answer_likes`（P1）

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | P1 |
| answer_id | uuid | 是 | - | 否 | 否 | idx(answer_id) | answers.id | 回答 | P1 |
| user_id | uuid | 是 | - | 否 | 否 | idx(user_id) | auth.users.id | 点赞用户 | P1 |
| created_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 时间 | P1 |

约束建议：`unique(answer_id, user_id)`

---

## 2.3 专家与技能供给域

## 表：`experts`

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | 必须 |
| user_id | uuid | 是 | - | 否 | 否 | idx(user_id) | auth.users.id | 专家所属用户 | 必须 |
| display_name | text | 否 | null | 否 | 是 | 否 | - | 展示名 | 必须 |
| avatar_url | text | 否 | null | 否 | 是 | 否 | - | 展示头像 | 必须 |
| title | text | 是 | - | 否 | 否 | idx(title) | - | 专家标题 | 必须 |
| bio | text | 否 | null | 否 | 是 | fts/trgm | - | 介绍 | 必须 |
| channel | text | 否 | null | 否 | 是 | idx(channel,subcategory,is_active) | - | 频道 | 必须 |
| subcategory | text | 否 | null | 否 | 是 | idx(channel,subcategory,is_active) | - | 子类 | 必须 |
| category | text | 否 | null | 否 | 是 | idx(category) | - | 历史兼容 | 兼容 |
| tags | text[] | 否 | '{}' | 否 | 是 | gin(tags) | - | 标签 | 必须 |
| keywords | text[] | 否 | '{}' | 否 | 是 | gin(keywords) | - | 关键词 | 必须 |
| consultation_price | integer | 否 | 0 | 否 | 是 | idx(consultation_price) | - | 咨询价（积分） | 必须 |
| response_time | text | 否 | null | 否 | 是 | 否 | - | 响应时效 | 必须 |
| experience_level | text | 否 | null | 否 | 是 | 否 | - | 经验等级 | 必须 |
| location | text | 否 | null | 否 | 是 | idx(location) | - | 地理位置 | 必须 |
| rating | numeric(3,2) | 是 | 0 | 否 | 否 | idx(rating desc) | - | 评分 | 必须 |
| response_rate | numeric(5,2) | 是 | 0 | 否 | 否 | idx(response_rate desc) | - | 响应率 | 必须 |
| order_count | integer | 是 | 0 | 否 | 否 | idx(order_count desc) | - | 订单数 | 必须 |
| is_verified | boolean | 是 | false | 否 | 否 | idx(is_verified) | - | 是否认证 | 必须 |
| is_active | boolean | 是 | true | 否 | 否 | idx(is_active,updated_at desc) | - | 是否上架 | 必须 |
| cover_image | text | 否 | null | 否 | 是 | 否 | - | 封面图 | 必须 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at desc) | - | 创建时间 | 必须 |
| updated_at | timestamptz | 是 | now() | 否 | 否 | idx(updated_at desc) | - | 更新时间 | 必须 |

## 表：`skill_offers`（P2）
- 说明：若后续要一人多技能商品、独立定价库存，再从 `experts` 拆出。

## 表：`skill_categories`（P2）
- 说明：一期先用枚举与配置，不强制落表；二期做后台可配置分类树时再建。

---

## 2.4 搜索与推荐域

## 表：`search_history`（P2）
- 说明：前端已有最近搜索，现主要在本地；二期再上云端跨设备同步。

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | P2 |
| user_id | uuid | 否 | null | 否 | 是 | idx(user_id,created_at desc) | auth.users.id | 登录用户可写 | P2 |
| keyword | text | 是 | - | 否 | 否 | idx(keyword) | - | 搜索词 | P2 |
| channel | text | 否 | null | 否 | 是 | idx(channel) | - | 搜索上下文 | P2 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at desc) | - | 时间 | P2 |

## 表：`hot_keywords`（P2）
- 说明：一期可由 `app_config` 固定，二期再做实时热词统计。

---

## 2.5 发现流与互动域

## 表：`posts`（P1）

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | P1 |
| user_id | uuid | 是 | - | 否 | 否 | idx(user_id,created_at desc) | auth.users.id | 发布者 | P1 |
| content | text | 是 | - | 否 | 否 | fts/trgm | - | 内容文本 | P1 |
| images | text[] | 否 | '{}' | 否 | 是 | 否 | - | 图片URL数组 | P1 |
| video | text | 否 | null | 否 | 是 | 否 | - | 视频URL | 后补 |
| topics | text[] | 否 | '{}' | 否 | 是 | gin(topics) | - | 话题标签 | P1 |
| likes_count | integer | 是 | 0 | 否 | 否 | idx(likes_count desc) | - | 点赞数 | P1 |
| comments_count | integer | 是 | 0 | 否 | 否 | idx(comments_count desc) | - | 评论数 | P1 |
| shares_count | integer | 是 | 0 | 否 | 否 | idx(shares_count desc) | - | 分享数 | P1 |
| status | text | 否 | 'active' | 否 | 否 | idx(status,created_at desc) | - | active/hidden/deleted | 后补 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at desc) | - | 时间 | P1 |
| updated_at | timestamptz | 是 | now() | 否 | 否 | 否 | - | 时间 | P1 |

## 表：`post_likes`（P1）
- 约束：`unique(post_id, user_id)`

## 表：`post_comments`（P1）
- 关键：`post_id`, `user_id`, `content`, `likes_count`, `created_at`, `updated_at`

## 表：`follows`（映射 `user_followers`，P0）

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | 必须 |
| follower_id | uuid | 是 | - | 否 | 否 | idx(follower_id) | auth.users.id | 关注者 | 必须 |
| following_id | uuid | 是 | - | 否 | 否 | idx(following_id) | auth.users.id | 被关注者 | 必须 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at desc) | - | 时间 | 必须 |

约束建议：`unique(follower_id, following_id)` + `check(follower_id <> following_id)`

---

## 2.6 会话消息与通知域

## 表：`conversations`（P2，物化会话）
- 一期不强制建，继续用 `messages` + RPC(`get_user_conversations`) 聚合。

## 表：`messages`（P0）

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | 必须 |
| sender_id | uuid | 是 | - | 否 | 否 | idx(sender_id,created_at desc) | auth.users.id | 发送者 | 必须 |
| receiver_id | uuid | 是 | - | 否 | 否 | idx(receiver_id,created_at desc) | auth.users.id | 接收者 | 必须 |
| content | text | 是 | - | 否 | 否 | 否 | - | 消息体 | 必须 |
| message_type | text | 是 | 'text' | 否 | 否 | idx(message_type) | - | text/image/system | 必须 |
| read_at | timestamptz | 否 | null | 否 | 是 | idx(receiver_id,read_at) | - | 已读时间 | 必须 |
| is_hidden | boolean | 是 | false | 否 | 否 | idx(is_hidden) | - | 审核隐藏 | 必须 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at desc) | - | 发送时间 | 必须 |

## 表：`notifications`（P0）

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | 必须 |
| user_id | uuid | 是 | - | 否 | 否 | idx(user_id,is_read,created_at desc) | auth.users.id | 通知接收者 | 必须 |
| type | text | 是 | - | 否 | 否 | idx(type) | - | new_answer/new_follower/system... | 必须 |
| title | text | 是 | - | 否 | 否 | 否 | - | 标题 | 必须 |
| content | text | 否 | null | 否 | 是 | 否 | - | 文案 | 必须 |
| related_id | uuid | 否 | null | 否 | 是 | idx(related_type,related_id) | - | 关联对象ID | 必须 |
| related_type | text | 否 | null | 否 | 是 | idx(related_type,related_id) | - | question/answer/topic/user/order | 必须 |
| sender_id | uuid | 否 | null | 否 | 是 | idx(sender_id) | auth.users.id | 触发方 | 必须 |
| is_read | boolean | 是 | false | 否 | 否 | idx(user_id,is_read) | - | 已读状态 | 必须 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at desc) | - | 时间 | 必须 |

---

## 2.7 订单、积分、收益域

## 表：`orders`（P0）

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | 必须 |
| user_id | uuid | 是 | - | 否 | 否 | idx(user_id,created_at desc) | auth.users.id | 下单用户 | 必须 |
| order_type | text | 是 | - | 否 | 否 | idx(order_type,status) | - | recharge/question/consultation/withdraw | 必须 |
| related_id | uuid | 否 | null | 否 | 是 | idx(related_id) | - | 关联对象ID | 必须 |
| amount | integer | 是 | - | 否 | 否 | 否 | - | 积分数量 | 必须 |
| cash_amount | numeric(10,2) | 否 | null | 否 | 是 | idx(cash_amount) | - | 现金金额 | 必须 |
| status | text | 是 | 'pending' | 否 | 否 | idx(status,created_at desc) | - | pending/paid/cancelled/refunded/failed | 必须 |
| payment_method | text | 否 | null | 否 | 是 | idx(payment_method) | - | wechat/alipay/stripe | 必须 |
| provider_order_id | text | 否 | null | 是(部分唯一) | 是 | unique where not null | - | 三方订单号 | 必须 |
| provider_transaction_id | text | 否 | null | 是(部分唯一) | 是 | unique where not null | - | 三方流水号 | 必须 |
| metadata | jsonb | 是 | '{}'::jsonb | 否 | 否 | gin(metadata)可后补 | - | 扩展信息 | 必须 |
| paid_at | timestamptz | 否 | null | 否 | 是 | idx(paid_at desc) | - | 支付时间 | 必须 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at desc) | - | 创建时间 | 必须 |

## 表：`point_transactions`

| 字段 | 类型 | 必填 | 默认值 | 唯一 | 可空 | 索引 | 外键 | 说明 | 一期 |
|---|---|---|---|---|---|---|---|---|---|
| id | uuid | 是 | gen_random_uuid() | 否 | 否 | 主键 | - | 主键 | 必须 |
| user_id | uuid | 是 | - | 否 | 否 | idx(user_id,created_at desc) | auth.users.id | 用户 | 必须 |
| type | text | 是 | - | 否 | 否 | idx(type,created_at desc) | - | recharge/reward/bounty_payment/... | 必须 |
| amount | integer | 是 | - | 否 | 否 | 否 | - | 正负积分变动 | 必须 |
| balance_after | integer | 是 | 0 | 否 | 否 | 否 | - | 变更后余额 | 必须 |
| related_id | uuid | 否 | null | 否 | 是 | idx(related_id) | - | 关联单据/内容 | 必须 |
| description | text | 否 | null | 否 | 是 | 否 | - | 描述 | 必须 |
| status | text | 是 | 'completed' | 否 | 否 | idx(status) | - | pending/completed/failed/reversed | 必须 |
| created_at | timestamptz | 是 | now() | 否 | 否 | idx(created_at desc) | - | 时间 | 必须 |

---

## 2.8 后台管理与审核域（P1）

## 表：`content_reports`
- 关键字段：`reporter_id`, `target_type`, `target_id`, `reason`, `details`, `status`, `reviewed_by`, `reviewed_at`, `resolution_note`, `created_at`
- 索引：`idx(status, created_at desc)`, `idx(target_type,target_id)`

## 表：`content_moderation_logs`
- 关键字段：`target_type`, `target_id`, `action`, `actor_id`, `reason`, `risk_score`, `metadata`, `created_at`
- 索引：`idx(target_type,target_id,created_at desc)`

## 表：`audit_events`
- 关键字段：`actor_id`, `event_type`, `entity_type`, `entity_id`, `severity`, `payload`, `created_at`
- 索引：`idx(event_type,created_at desc)`, `idx(created_at desc)`

## 表：`app_config`
- 关键字段：`key(pk)`, `value(jsonb)`, `description`, `updated_by`, `updated_at`

## 表：`payment_callbacks`
- 关键字段：`order_id`, `provider`, `provider_transaction_id`, `payload`, `processed_at`
- 约束：`unique(provider, provider_transaction_id)`

---

## 3. 枚举与状态字段设计（字段层）

## 3.1 推荐字段与枚举值

- 用户状态：`profiles.status`
  - `active`, `limited`, `banned`
  - 原因：一期先支持风控与封禁；后续可扩展 `deleted`, `frozen`.

- 问题状态：`questions.status`
  - `open`, `pending_payment`, `paid`, `solved`, `closed`
  - 原因：覆盖发布->支付->解决闭环。

- 回答状态：`answers.status`（可后补） + `is_accepted` + `is_hidden`
  - 建议 `status`: `active`, `hidden`, `deleted`
  - 原因：避免只靠布尔位表达复杂审核态。

- 技能发布状态：`experts.status`（可后补）或先用 `is_active`
  - 建议 `draft`, `active`, `inactive`, `rejected`
  - 原因：与上架/审核语义对齐。

- 订单状态：`orders.status`
  - `pending`, `paid`, `cancelled`, `refunded`, `failed`
  - 原因：支付回调与异常补偿需要 `failed`.

- 通知状态：`notifications.is_read`
  - `false/true`
  - 原因：够用且与前端一致；后续可加 `archived_at`.

## 3.2 是否用数据库 ENUM

- 一期建议：优先 `text + check constraint`，减少迁移维护成本。
- 二期稳定后再考虑改为 `enum type`（特别是 `orders.status` / `questions.status`）。

---

## 4. 主键、外键、唯一约束、索引建议

## 4.1 主键方案

- 全部业务表统一 `uuid` 主键（Supabase 默认友好）
- `app_config` 用 `key text` 作为主键即可

## 4.2 唯一约束（核心）

- `profiles.user_id` 唯一
- `user_settings.user_id` 唯一
- `follows(follower_id, following_id)` 唯一
- `favorites(user_id, question_id)` 唯一
- `answer_likes(user_id, answer_id)` 唯一
- `post_likes(user_id, post_id)` 唯一
- `topic_followers(user_id, topic_id)` 唯一
- `orders.provider_order_id` 部分唯一（not null）
- `orders.provider_transaction_id` 部分唯一（not null）
- `payment_callbacks(provider, provider_transaction_id)` 唯一

## 4.3 关键查询索引（按页面场景）

- 首页列表：`questions (is_hidden,status,created_at desc)`，`experts (is_active,rating desc)`
- 频道页：`questions(channel,subcategory,created_at desc)`，`experts(channel,subcategory,is_active)`
- 搜索：`questions.title/content` trigram/fts，`hot_topics.title/description` trigram/fts，`experts.tags gin`
- 问题详情：`answers(question_id, is_hidden, created_at asc)`
- 专家详情：`experts(id)` 主键 + `experts(user_id,created_at desc)`
- 会话查询：`messages(sender_id,receiver_id,created_at)` 与 `messages(receiver_id,read_at)`
- 通知列表：`notifications(user_id,is_read,created_at desc)`
- 订单列表：`orders(user_id,created_at desc)` + `orders(status,created_at desc)`

## 4.4 不建议过早加的索引

- `jsonb` 全字段 GIN（除非确认高频筛选）
- 低选择性布尔字段单列索引（如仅 `is_active`）
- 很少筛选的说明文字字段索引

---

## 5. Supabase / Auth / RLS 前置说明

## 5.1 直接关联 Auth user_id 的表

- `profiles`, `user_settings`, `questions`, `question_drafts`, `answers`, `experts`
- `messages`, `notifications`, `orders`, `point_transactions`
- `posts`, `post_comments`, `follows`, `favorites`, `answer_likes`, `topic_followers`

## 5.2 RLS 归类

- Owner-based（仅本人）
  - `question_drafts`, `user_settings`, `orders`, `point_transactions`
- 本人可写 + 公共可读
  - `questions`, `answers`, `experts(is_active=true)`, `posts`, `topic_discussions`
- 双方可读
  - `messages`（sender/receiver）
- 本人可读写
  - `notifications`
- 管理员/审核员
  - `content_reports`, `content_moderation_logs`, `audit_events`, `app_config`, `payment_callbacks`
- service_role 写入
  - `payment_callbacks`, 支付确认相关状态变更、系统通知批量写入

## 5.3 公开读写边界

- 公开读：问题列表、回答列表、专家列表、发现流、话题
- 登录后写：提问、回答、评论、点赞、关注、私信、举报
- 管理写：审核、隐藏内容、补单、配置项

---

## 6. 一期实现顺序建议

1. `profiles` + `user_settings`（认证落地基础）
2. `questions` + `question_drafts` + `answers`（核心内容闭环）
3. `experts`（技能供给）
4. `messages` + `notifications`（留存关键路径）
5. `orders` + `point_transactions` + `payment_callbacks`（交易闭环）
6. `hot_topics` + `topic_discussions` + `follows`（首页/发现关键流）
7. P1 补齐：`posts` 系列、`favorites`、`answer_likes`、审核后台表

排序原因：先打通“登录-提问-回答-消息-支付”最短商业闭环，再补增长与运营能力。

---

## 7. 风险点与待确认项

## 7.1 需要产品/业务确认

- `questions.status` 是否保留 `paid`（是否存在“问题需付费后可见”）
- `experts` 是否一期就拆 `skill_offers`
- 认证模型命名：继续 `talent_certifications` 还是统一 `user_verifications`
- 发现流是否必须纳入一期上线（若压缩范围可降到 P2）

## 7.2 易过度设计点

- 会话表 `conversations` 过早物化
- 标签系统过早拆成 `question_tags`
- 搜索热词系统过早做实时统计
- 用户状态和风控规则一次做太全

## 7.3 现在先做简版更合理的表

- `question_tags`：先不拆
- `skill_categories`：先枚举 + `app_config`
- `search_history`：先本地，后端二期再同步
- `hot_keywords`：先静态配置

---

## 8. 下一步（可直接进入 Migration 任务）

建议进入第三步：**状态机与关系定版 -> 迁移清单拆分**，输出：

- `migration-01-core-auth-profile.sql`（profiles/settings）
- `migration-02-qna-core.sql`
- `migration-03-expert-core.sql`
- `migration-04-message-notification.sql`
- `migration-05-orders-points.sql`
- `migration-06-feed-social.sql`
- `migration-07-admin-moderation.sql`

> 每条迁移只做一个域，便于回滚与联调。

