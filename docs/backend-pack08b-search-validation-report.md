# Pack 08-B 第 2 步联调报告（搜索增强与命名统一）

日期：2026-04-22  
范围：仅验证 Pack 08-B 第 2 步（不进入第 3 步）

## 1. 执行结果摘要

已按顺序执行：

1. `npx supabase migration list`  
2. `npx supabase db push`  
3. `npm run test:contracts`  
4. `npm run test:smoke`

执行结果：

- `migration list`：成功，显示待应用 `20260422100000_pack_08b_search_v2_unify.sql`
- `db push`：成功，已应用 `20260422100000_pack_08b_search_v2_unify.sql`
  - 提示 `pg_trgm` 已存在（正常）
  - 提示 `idx_posts_content_trgm` 已存在（正常，说明索引兜底语句幂等）
- `test:contracts`：通过
- `test:smoke`：
  - 首次失败：缺少 `SUPABASE_URL` / `SUPABASE_ANON_KEY`
  - 使用 `.env` 注入后重跑：通过

结论：本次 migration 已成功应用，契约与冒烟测试通过。

## 2. 搜索结果 / 搜索建议 / 搜索历史 / 热门词联调结果

### 2.1 `search_app_content_v2` 应用状态

- 已在远端成功应用（由 `db push` 确认）
- 前端 `useSearch` 已优先调用 `search_app_content_v2`
- 若 v2 不可用，仍保留回退链路（legacy RPC + 直接查询）

结果：通过。

### 2.2 `get_search_suggestions_v2` 应用状态

- 已在远端成功应用（由 `db push` 确认）
- 前端新增 `useHotKeywords`，默认态优先读 v2 的 `hot_keywords`
- 若 v2 不可用，再回退直接读取 `hot_keywords` 表；仍失败时回退本地常量

结果：通过。

### 2.3 `posts.content` trigram 索引

- migration 含 `CREATE INDEX IF NOT EXISTS idx_posts_content_trgm ...`
- 执行时收到 `relation already exists`，说明索引已存在且语句幂等

结果：通过。

### 2.4 搜索历史写入（登录态）

- `SearchResults` 提交搜索（`commitSearch`）时，登录用户会调用 `upsert_search_history`
- 调用失败时静默回退，不阻塞搜索主流程

结果：通过（逻辑层验证通过，且不影响现有链路稳定性）。

### 2.5 默认态热门词读取策略

- 优先：`hot_keywords`（经 `get_search_suggestions_v2`）
- 回退：直接表查询
- 最终回退：本地常量

结果：通过。

## 3. 命名统一验证

SearchResults 已统一为：

- 全部
- 问题
- 专家
- 技能
- 动态

并且查询层输出结构已对齐：

- `questions`
- `experts`
- `skills`
- `posts`

结果：通过。

## 4. legacy fallback 可用性

`useSearch` 保留了完整 fallback：

1. 首选 `search_app_content_v2`
2. v2 缺失时降级 `search_app_content`（legacy）
3. legacy 缺失时再降级为前端直查（questions/experts/skill_offers/posts）+ demo 合并

结果：通过。远端未应用 v2 的情况下不会“完全失效”。

## 5. RLS/边界影响评估（本轮相关）

本轮未扩大权限边界，仅新增搜索函数与前端读取逻辑；未新增对审核、消息、订单等域的写入路径。  
`upsert_search_history` 仍沿用 owner 语义。

结果：无新增边界风险。

## 6. 问题清单（P0 / P1 / P2）

### P0（阻塞项）

- 无。

### P1（建议修复）

- `test:smoke` 依赖环境变量，裸跑会失败；建议在脚本内统一读取 `.env`，减少执行歧义。

### P2（可后续优化）

- 搜索结果卡片类型（问题/专家/技能/动态）的视觉差异仍有优化空间，但不阻塞后端联调。
- `types.ts` 当前仅补了本轮相关 RPC，仍有历史 `any` 残留，可在后续专门 cleanup 处理。

## 7. 是否建议进入 08-B 第 3 步

建议：**可以进入 08-B 第 3 步**。  
前提：保持“最小改动”策略，不与 follows/legacy posts 大清理绑定推进。

