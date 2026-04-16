# backend-dev-staging-validation-report-runtime

## 执行结果摘要

按既定顺序在 `/Users/shawnshi1997/askbuddy-optimist` 实际执行：

1. `npx supabase migration list`  
   - 结果：成功  
   - 结论：Pack01~Pack04（主迁移+patch）在本地存在，远端最初未应用。

2. `npx supabase db push`  
   - 结果：首次失败，随后成功  
   - 首次失败原因：Pack01 中历史回填分支引用了 `talent_certifications.reviewed_by`，在当前远端历史结构中该列不存在。  
   - 最小修复：仅修正 `20260416143000_pack_01_user_and_accounts.sql` 的历史回填 DO 块，改为列存在检测后动态 SQL（兼容 `reviewed_by` / `reviewer_id` / 无该列），不改业务模型。  
   - 重跑结论：Pack01~Pack04 全部成功应用。

3. `npx supabase db execute --file supabase/sql/backfill_pack01_user_accounts.sql`  
   - 结果：失败  
   - 报错：`unknown flag: --file`  
   - 说明：当前 CLI 版本已无 `db execute` 子命令，改为 `db query --file` 语法。

4. `npx supabase db query --linked -f supabase/sql/backfill_pack01_user_accounts.sql`（等价替代尝试）  
   - 结果：失败  
   - 报错：`Access token not provided. Supply an access token by running supabase login or setting the SUPABASE_ACCESS_TOKEN environment variable.`  
   - 说明：`db push` 可通过链接库直连执行迁移；`db query --linked` 需要 Access Token。

5. `npm run test:contracts`  
   - 结果：成功（`Schema contract check passed.`）

6. `npm run test:smoke`（使用 `.env` 中 `VITE_` 变量映射到 `SUPABASE_URL/SUPABASE_ANON_KEY`）  
   - 结果：成功（`RPC smoke tests passed.`）

---

## 迁移状态结论

### 已成功应用到远端（migration list 二次确认）
- `20260416143000_pack_01_user_and_accounts.sql`
- `20260416152000_pack_01_patch_clarifications.sql`
- `20260416170000_pack_02_questions_and_answers.sql`
- `20260416173000_pack_02_patch_visibility_and_guards.sql`
- `20260416201000_pack_03_experts_and_skill_offers.sql`
- `20260416204000_pack_03_patch_category_write_path.sql`
- `20260416223000_pack_04_search_and_discover_base.sql`
- `20260416230000_pack_04_patch_visibility_rules.sql`

### 未完成项
- `supabase/sql/backfill_pack01_user_accounts.sql` 未在远端执行成功（CLI 命令变更 + 缺失 Access Token）。

### 依赖/兼容问题
- 已发现并修复 1 个 P0 兼容问题：Pack01 对旧表 `talent_certifications` 的列名假设过窄。  
- 修复后迁移可连续执行完 Pack01~Pack04。

---

## 模块验证结果

> 说明：本轮以“真实迁移执行结果 + 当前脚本冒烟结果 + SQL 策略核验”为主。  
> 未引入 Pack05，也未做前端大改。

### A. 用户与资料

已通过：
- Pack01 表结构已落地：`profiles / user_settings / user_verifications / point_accounts`。
- 新用户自动建档触发器已随迁移应用。
- RLS owner/public 边界已应用（profiles 公开读边界有注释收口）。

未通过：
- 历史用户 backfill 脚本未成功执行（`db execute` 语法失效，`db query --linked` 缺 token）。

风险点：
- 若远端已有历史 auth 用户，可能存在少量未补齐账户资料。

是否阻塞进入 Pack05：**阻塞（P0）**

---

### B. 提问与回答

已通过：
- Pack02 主链路表已落地：`questions / question_drafts / answers / question_tags`。
- 可见性补丁已落地（公开状态收口）。
- 系统字段保护触发器已落地（防止普通用户改系统维护字段）。
- `answer_count` 统计口径已收口（`active + accepted`）。

未通过：
- 未做端到端业务写入回归（仅完成 schema + policy + smoke）。

风险点：
- 需在下一轮联调中补“真实用户发问/回答/草稿恢复”的行为回归。

是否阻塞进入 Pack05：**不阻塞（P1）**

---

### C. 专家与技能

已通过：
- Pack03 表结构已落地：`experts / skill_categories / skill_offers / expert_followers`。
- 一人一档语义已通过唯一索引约束（`experts.user_id` unique）。
- `skill_categories` 写权限已收口到 service role/migration/seed 路径。
- `skill_offers` 的公开/私有状态边界已通过 RLS 收口。

未通过：
- 未做前端端到端发布技能回归（仅完成 DB 层校验）。

风险点：
- 若历史环境存在脏数据，需关注唯一约束冲突（本次执行未报冲突）。

是否阻塞进入 Pack05：**不阻塞（P1）**

---

### D. 搜索与发现

已通过：
- Pack04 基础层已落地：`search_history / hot_keywords / posts / post_media / follows`。
- 互动占位表已落地：`post_likes / post_favorites / post_comments`。
- `can_read_post(...)` 最终可见性补丁已应用（public/followers/private/hidden/deleted 口径明确）。

未通过：
- 未做多用户可见性端到端回归（当前为策略落地核验）。

风险点：
- 旧表兼容触发器需要后续用真实样本数据观察性能与一致性。

是否阻塞进入 Pack05：**不阻塞（P1）**

---

## 数据权限与可见性检查

已确认（迁移+patch 已应用）：
- 草稿问题不会被公开读取（Pack02 RLS）。
- `hidden/deleted` 帖子不会被非作者公开读取（Pack04 patch）。
- 非 `published` 的 `skill_offers` 不对普通用户公开（Pack03 RLS）。
- 普通用户不能直接篡改问答系统字段（Pack02 guard triggers）。
- owner-only 表（settings/point_accounts/drafts 等）具备 owner 约束策略。

待补实测：
- 需补一轮双账号（作者/非作者）查询验证，做最终“策略命中”证据留档。

---

## P0 / P1 / P2 问题清单

### P0（阻塞进入 Pack05）
1. **Pack01 backfill 未执行**  
   - 原命令 `db execute --file` 在当前 CLI 不可用；  
   - 替代命令 `db query --linked -f ...` 受 `SUPABASE_ACCESS_TOKEN` 缺失阻塞。

### P1（建议先修）
1. 增加一个“带 token 的 backfill 执行步骤”文档化命令（避免不同 CLI 版本行为差异）。  
2. 增加最小多账号 RLS 回归脚本（作者/非作者/follower 口径）。

### P2（后续可修）
1. 将 `test:smoke` 默认兼容 `VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY`，减少本地手工映射。

---

## 修复建议（最小修复）

本轮已实施最小修复：
- 修复文件：`supabase/migrations/20260416143000_pack_01_user_and_accounts.sql`  
- 修复内容：历史 `talent_certifications` 回填逻辑改为“列存在检测 + 动态 SQL”兼容分支。  
- 影响范围：仅 Pack01 历史数据兼容插入分支；不改变目标表字段/RLS/主流程。

本轮未新增 patch migration；无需重写任何 Pack。

---

## 最终结论

**当前不建议进入 Pack05。**

原因：
- Pack01~Pack04 主迁移与 patch 已成功进入远端，核心结构可用；  
- 但 Pack01 历史用户 backfill 尚未完成，存在历史用户资料缺口风险（P0）。

进入 Pack05 前的最小前提：
1. 在当前环境完成一次可认证的 backfill 执行（`db query --linked -f ...` 或等价可审计方式）；  
2. 记录 backfill 成功结果（受影响行数/执行时间）；  
3. 再开始消息与通知域（Pack05）。
