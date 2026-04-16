# 执行结果摘要

> 时间：2026-04-17  
> 范围：Pack 01 ~ Pack 04（含 patch + Pack01 backfill）  
> 目标：在进入 Pack 05 前完成 dev/staging 执行与最小联调验证

## 1) migration 执行状态

本次在当前自动化执行环境中尝试直接执行 Supabase 迁移时，遇到 CLI 运行阻塞：
- `npx supabase db push --dry-run` -> `sh: supabase: command not found`
- `npx supabase migration list` -> 同类错误
- 本地 `supabase` 二进制尝试执行出现异常退出（无法稳定用于迁移执行）

结论：**本次无法在当前执行沙箱里实际完成远端 dev/staging 的迁移执行**，但已完成完整预检与联调静态验证。

## 2) 已确认可执行的迁移清单（顺序正确）

已在仓库中确认存在并按顺序排列：
1. `20260416143000_pack_01_user_and_accounts.sql`
2. `20260416152000_pack_01_patch_clarifications.sql`
3. `supabase/sql/backfill_pack01_user_accounts.sql`
4. `20260416170000_pack_02_questions_and_answers.sql`
5. `20260416173000_pack_02_patch_visibility_and_guards.sql`
6. `20260416201000_pack_03_experts_and_skill_offers.sql`
7. `20260416204000_pack_03_patch_category_write_path.sql`
8. `20260416223000_pack_04_search_and_discover_base.sql`
9. `20260416230000_pack_04_patch_visibility_rules.sql`

## 3) 本次是否新增修正 migration

本轮未新增 Pack 01~04 之外的新修正 migration；使用现有已提交的 patch 作为执行基础。

## 4) 当前是否达到“可进入 Pack 05”状态

**暂不建议直接进入 Pack 05**。  
原因：Pack 01~04 尚未在目标 dev/staging 上完成真实执行与运行时验证（当前只完成静态/脚本级验证）。

---

# 联调检查结果

> 说明：以下“通过/未通过”区分为  
> - **静态通过**：基于 migration、前端 hooks、契约脚本可确认  
> - **运行时待验证**：必须在实际 dev/staging 执行后确认

## A. 用户与资料

### 已验证通过（静态）
- Pack01 中存在 `handle_new_user_pack01`：注册后自动建档 `profiles/user_settings/point_accounts`
- Pack01 backfill 脚本存在且幂等：`supabase/sql/backfill_pack01_user_accounts.sql`
- `profiles` 公开读策略、`user_settings` owner-only、`point_accounts` owner-only 读策略已定义

### 未通过（运行时待验证）
- 注册/登录后触发器是否在目标环境成功触发
- 回填脚本在目标环境是否无冲突执行
- 设置页对 `user_settings` 的读写是否全链路通过
- 认证提交流程对 `user_verifications` 的写入是否符合预期

### 风险点
- 旧对象依赖可能导致 `profiles` 历史字段删除被跳过（设计上允许，需后续清理）

### 是否阻塞 Pack05
- **阻塞**（需先完成目标环境实际执行验证）

## B. 提问与回答

### 已验证通过（静态）
- Pack02 表结构齐备：`questions/question_drafts/answers/question_tags`
- Pack02 patch 已收敛可见性与系统字段保护
- `answer_count` 统计口径已修正为 `active + accepted`

### 未通过（运行时待验证）
- 发问题、草稿保存恢复、提交回答、我的回答查询的实际读写链路
- 触发器在真实环境下的计数更新行为

### 风险点
- 旧字段兼容路径（如 `user_id/content`）与新字段双轨需在目标环境验证无歧义

### 是否阻塞 Pack05
- **阻塞**

## C. 专家与技能

### 已验证通过（静态）
- Pack03 表结构齐备：`experts/skill_categories/skill_offers/expert_followers`
- 一人一档约束已明确：`experts.user_id` 唯一
- `skill_offers` 公开仅 `published`，本人可读写全部状态
- `skill_categories` 写权限已收口为 service role/migration/seed

### 未通过（运行时待验证）
- SkillPublish 写入与 ExpertProfile 展示链路
- 非本人不可见 draft/pending/offline 的实际查询结果

### 风险点
- 历史专家数据若不满足唯一约束，需要先清洗

### 是否阻塞 Pack05
- **阻塞**

## D. 搜索与发现

### 已验证通过（静态）
- Pack04 基础层齐备：`search_history/hot_keywords/posts/post_media/follows`  
- 互动最小占位：`post_likes/post_favorites/post_comments`
- `can_read_post(...)` 规则已由 patch 明确（public/followers/private/hidden/deleted）
- 兼容边界文档已补：`docs/backend-pack04-followup-notes.md`

### 未通过（运行时待验证）
- 搜索历史 upsert、热词读取、Discover feed 可见性在真实用户会话下验证
- followers 可见帖子在关注/未关注两侧用户下的真实行为

### 风险点
- 旧表兼容（`user_followers`, `posts.user_id`, `post_comments.user_id`）需后续 cleanup

### 是否阻塞 Pack05
- **阻塞**

---

# 数据权限与可见性检查

## 1) 草稿问题不会公开
- 设计层面：`question_drafts` owner-only RLS  
- 状态：**静态通过，运行时待验证**

## 2) hidden / deleted 帖子不会公开
- 设计层面：`can_read_post` 已明确拒绝非作者读取 `hidden/deleted`  
- 状态：**静态通过，运行时待验证**

## 3) 非 published skill_offers 不会公开
- 设计层面：`pack03_skill_offers_public_read` 仅 `status='published'`  
- 状态：**静态通过，运行时待验证**

## 4) 普通用户不能篡改系统维护字段
- 设计层面：Pack02/03 均有 guard trigger  
- 状态：**静态通过，运行时待验证**

## 5) owner-only 表是否真的仅 owner 可见
- 设计层面：`user_settings/point_accounts/question_drafts/search_history` owner-only  
- 状态：**静态通过，运行时待验证**

---

# 待修复问题清单

## P0（阻塞进入 Pack05）
1. 在目标 dev/staging 真正执行 Pack01~04（含 patch/backfill）并记录成功日志。  
2. 完成最小运行时联调用例（双用户可见性 + owner-only + 计数字段）。  

## P1（建议先修）
1. 完成 Pack04 cleanup 计划（逐步移除旧兼容字段与 legacy 关注表依赖）。  
2. 针对 Pack02/03/04 增加最小 SQL 回归脚本（RLS 可见性断言）。  

## P2（可后续修）
1. 搜索建议词质量与热门词运营策略完善。  
2. 发现流的轻量排序策略优化（仍不引入重推荐系统）。

---

# 进入 Pack 05 的结论

**当前不建议进入 Pack 05。**

前提条件（满足后再进入）：
1. Pack01~04 在目标 dev/staging 实际执行成功；
2. 核心联调点（A/B/C/D）运行时验证通过；
3. 权限边界无可见性泄漏（尤其 followers/private/hidden、draft、非published）。

若你在本机已具备可用 Supabase CLI，建议按以下顺序执行并回传结果：

```bash
cd /Users/shawnshi1997/askbuddy-optimist

# 1) 查看远端迁移状态
npx supabase migration list

# 2) 执行 migration（按时间顺序自动应用）
npx supabase db push

# 3) 执行 Pack01 历史用户回填
npx supabase db execute --file supabase/sql/backfill_pack01_user_accounts.sql

# 4) 运行契约/冒烟脚本（需 SUPABASE_URL / SUPABASE_ANON_KEY）
npm run test:contracts
npm run test:smoke
```

完成以上后可在本报告补充运行时结果；届时若无 P0，可进入：
**“建议进入 Pack 05：消息与通知域”**。

