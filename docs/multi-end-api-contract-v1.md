# 多端统一 API 契约 v1（iOS / Android / 微信小程序）

日期：2026-04-22  
适用阶段：Phase 1 Freeze 后多端并行（不扩业务域）

## 1. 目标

统一三端的数据对象、枚举、分页和错误语义，避免出现：
- iOS 一套字段
- Android 一套字段
- 小程序再一套字段

本契约仅做 **现有后端能力** 的跨端统一，不新增新业务。

## 2. 全局命名约定

- 对象类型统一：`question` / `expert` / `skill` / `post`
- 用户主键统一：`user_id`
- 业务对象主键统一：`id`
- 时间统一：ISO8601 字符串（UTC）

## 3. 分页约定

统一采用 cursor 分页：

```json
{
  "items": [],
  "next_cursor": "xxx-or-null"
}
```

说明：
- 首次请求不传 `cursor`
- `next_cursor = null` 代表无下一页

## 4. 核心对象（最小字段）

## 4.1 Question
```json
{
  "id": "uuid",
  "author_id": "uuid",
  "title": "string",
  "description": "string",
  "status": "open|matched|solved|hidden|deleted",
  "city_code": "string|null",
  "reward_points": 0,
  "answer_count": 0,
  "created_at": "iso",
  "updated_at": "iso"
}
```

## 4.2 Expert
```json
{
  "user_id": "uuid",
  "headline": "string|null",
  "intro": "string|null",
  "verification_status": "unverified|pending|verified|rejected",
  "answer_count": 0,
  "follower_count": 0,
  "service_count": 0,
  "created_at": "iso",
  "updated_at": "iso"
}
```

## 4.3 SkillOffer
```json
{
  "id": "uuid",
  "expert_id": "uuid",
  "category_id": "uuid",
  "title": "string",
  "description": "string",
  "pricing_mode": "per_question|per_session|per_hour|negotiable",
  "price_amount": 0,
  "status": "draft|pending_review|published|offline",
  "city_code": "string|null",
  "created_at": "iso",
  "updated_at": "iso"
}
```

## 4.4 Post
```json
{
  "id": "uuid",
  "author_id": "uuid",
  "content": "string",
  "visibility": "public|followers|private",
  "status": "active|hidden|deleted",
  "like_count": 0,
  "comment_count": 0,
  "created_at": "iso",
  "updated_at": "iso"
}
```

## 5. 搜索统一输出（v2）

`search_app_content_v2(...)` 输出结构统一：

```json
{
  "questions": [],
  "experts": [],
  "skills": [],
  "posts": [],
  "meta": {
    "query": "string",
    "cursor": "string|null"
  }
}
```

前端 tab 文案统一映射：
- `全部` -> all
- `问题` -> question
- `专家` -> expert
- `技能` -> skill
- `动态` -> post

## 6. 错误语义（统一）

RPC/API 失败统一透出：

```json
{
  "code": "forbidden|not_found|invalid_state|validation_failed|internal_error",
  "message": "human readable message"
}
```

说明：
- 三端统一按 `code` 分支处理
- `message` 仅用于展示/日志

## 7. 三端接入原则

1. 三端优先消费 `packages/shared-types` 与 `packages/shared-api`。
2. 禁止在端侧硬编码状态机枚举。
3. 任何字段新增先改本契约，再改端侧。
4. Freeze 阶段不改业务模型，仅做对齐。
