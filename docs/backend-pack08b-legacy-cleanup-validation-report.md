# Pack 08-B 第 3 步验证报告（低频 legacy cleanup）

## 1. 执行结果摘要

- `npx supabase migration list`：成功（本地与远端迁移版本一致，已包含 `20260422100000_pack_08b_search_v2_unify.sql`）。
- `npx supabase db push`：成功（`Remote database is up to date.`）。
- `npm run test:contracts`：成功（`Schema contract check passed.`）。
- `npm run test:smoke`：成功（`RPC smoke tests passed.`）。

说明：
- 本轮（08-B 第3步）是**前端/查询层最小 cleanup**，未新增数据库 migration。
- 因此“migration/cleanup 成功应用”对应结果为：远端 schema 无待推送变更，cleanup 改动已在前端代码层生效并通过最小测试。

## 2. follows / legacy user_followers 验证

### 2.1 前端主路径是否已切到 follows
- 已切换完成，核心关注路径改为 `follows`：
  - `src/hooks/useFollowingPosts.ts`
  - `src/hooks/useProfileData.ts`
- 关注关系字段使用 `follower_id / followee_id`，不再走 `user_followers` 主查询。

### 2.2 legacy user_followers 是否只剩兼容层职责
- 代码扫描结果：业务代码中已无 `.from('user_followers')` 查询，`src` 内仅 `types.ts` 仍有旧表类型定义残留。
- 结论：`user_followers` 目前已降级为兼容历史层（DB 侧保留，主路径不再依赖）。

### 2.3 关注流/个人页统计/关注可见内容是否正常
- 关注流与个人页关注统计在查询层已切换至 `follows`。
- 可见性规则仍由 `can_read_post(...)`（含 legacy fallback）兜底，未在本轮破坏。
- 合同/冒烟测试均通过，未出现关注链路回归报错。

## 3. posts / post_likes / post_comments 兼容层验证

### 3.1 Discover / Following 流
- 查询主路径改为新字段优先：
  - 作者：`author_id` 优先，回退 `user_id`
  - 计数：`like_count/comment_count` 优先，回退 `likes_count/comments_count`
- 相关文件：
  - `src/hooks/usePosts.ts`
  - `src/hooks/useFollowingPosts.ts`
  - `src/hooks/useLocalPosts.ts`

### 3.2 旧字段 fallback
- 仍保留 fallback（防止远端历史数据/兼容表结构导致空值）。
- 本轮未删除 legacy 字段、trigger、policy，避免破坏已通过主链路。

### 3.3 兼容 trigger / policy 是否破坏主链路
- 本轮未改 DB trigger/policy，仅做前端查询层收口。
- 远端迁移状态与 smoke/contracts 均正常，未发现兼容层破坏主链路迹象。

## 4. 少量旧 policy / trigger / 命名 cleanup 安全性

- 本轮未执行破坏性 cleanup（未删表、未删旧列、未删兼容 trigger）。
- 策略为“先切主路径、再观察、后移除”，与 Pack 04 follow-up notes 一致。
- 结论：本轮 cleanup 安全。

## 5. 问题清单（P0 / P1 / P2）

### P0（阻塞）
- 无。

### P1（建议后续处理）
- `src/integrations/supabase/types.ts` 仍保留 `user_followers`、旧 posts/comment 计数字段定义；建议在单独的 types 收口轮次更新生成。
- Discover 组件层仍主要消费 `likes_count/comments_count` 命名（当前由 hooks 映射兼容）；建议后续逐步统一展示层命名。

### P2（可观察）
- DB 侧 legacy fallback（如 `can_read_post` 对 `user_followers` 兜底）可在稳定观察后再移除。

## 6. 结论

- 08-B 第3步目标已完成，且无 P0。
- 建议进入“一期总验证”阶段（Pack 01 ~ 08-B 全链路验收）。
