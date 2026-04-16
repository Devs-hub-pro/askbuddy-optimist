# Pack 04 兼容收口说明（Follow-up Notes）

> 对应迁移：  
> - `supabase/migrations/20260416223000_pack_04_search_and_discover_base.sql`  
> - `supabase/migrations/20260416230000_pack_04_patch_visibility_rules.sql`

## 1. 旧字段当前仍保留（兼容阶段）

为避免破坏现有前端与历史 SQL，本阶段保留了以下旧字段：

### posts
- 旧字段：`user_id`, `likes_count`, `comments_count`（兼容保留）
- 新标准字段：`author_id`, `like_count`, `favorite_count`, `comment_count`, `visibility`, `status`, `city`, `city_code`

### post_comments
- 旧字段：`user_id`（兼容保留）
- 新标准字段：`author_id`, `status`

### post_likes
- 当前字段已基本可用（`post_id`, `user_id`），无需大改，仅保持最小兼容。

### user_followers
- 旧关注表：`user_followers`（历史）
- 新标准表：`follows`（Pack04 新增）

## 2. 当前兼容触发器/函数承担的作用

### 字段同步兼容
- `trg_posts_sync_author_user`：保持 `posts.author_id` 与旧 `posts.user_id` 同步
- `trg_post_comments_sync_author_user`：保持 `post_comments.author_id` 与旧 `post_comments.user_id` 同步

### 计数兼容
- `refresh_post_engagement_counts` 同时维护：
  - 新字段：`like_count`, `comment_count`, `favorite_count`
  - 旧字段：`likes_count`, `comments_count`

### 可见性兼容
- `can_read_post(...)` 优先使用新 `follows`
- 并兼容读取旧 `user_followers`（若存在）

## 3. 最终可见性规则（当前生效）

`can_read_post(author_id, visibility, status)` 规则：
- 作者本人：无条件可读（包括 `private/hidden/deleted`）
- 非作者：
  - `status in ('hidden','deleted')`：不可读
  - `status <> 'active'`：不可读
  - `active + public`：可读
  - `active + followers`：仅关注者可读（`follows` 或 legacy `user_followers`）
  - `active + private`：不可读

## 4. 后续清理建议（何时统一去旧）

建议在 Pack04 联调稳定后，单独出一份 **Pack04-cleanup patch**（不等到 Pack05）完成：
1. 前端/SQL 全量切换到 `author_id/like_count/comment_count`；
2. 移除 `posts.user_id/likes_count/comments_count` 与 `post_comments.user_id`；
3. 停止依赖 `user_followers`，保留 `follows` 为唯一关注关系；
4. 删除仅为兼容存在的同步触发器与双写逻辑。

## 5. 当前状态结论

- Pack 04 目前可进入 dev/staging。  
- 可见性规则已明确并收口。  
- 兼容边界已文档化，后续不会遗漏清债动作。

