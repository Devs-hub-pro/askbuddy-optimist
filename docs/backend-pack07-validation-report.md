# Pack 07 验证报告（dev/staging 最小联调）

日期：2026-04-18  
范围：Pack 07（审核 / 举报 / 运营配置 / 推荐位）  
约束：不进入 Pack 08

---

## 1. 执行结果摘要

按要求执行：

1. `npx supabase migration list`  
- 结果：✅ 成功  
- 关键结论：远端已包含
  - `20260418011000_pack_07_moderation_reports_ops_config.sql`
  - `20260418014000_pack_07_patch_preflight_safety.sql`

2. `npx supabase db push`  
- 结果：✅ 成功  
- 关键结论：Pack 07 主 migration 与 patch 均已应用。

3. `npm run test:contracts`  
- 结果：✅ 通过（`Schema contract check passed.`）

4. `npm run test:smoke`  
- 结果：✅ 通过（`RPC smoke tests passed.`）

---

## 2. Pack 07 migration 与 patch 应用状态

已确认远端 migration 历史包含：
- `20260418011000`（Pack 07 主 migration）
- `20260418014000`（Pack 07 执行前 patch）

结论：**Pack 07 数据库结构已成功落地 dev/staging。**

---

## 3. 举报 / 审核 / 配置 / 推荐位联调结果

## A. `content_reports`

验证点：
- 匿名读取 `content_reports`：返回 0 行（未泄露）
- 匿名插入 `content_reports`：被 RLS 拒绝（`new row violates row-level security policy`）
- policy 规则检查：普通用户仅允许 `reporter_id = auth.uid()` 的 INSERT/SELECT；UPDATE 仅 `service_role`

结论：✅ 满足“普通用户只能提交并读取自己的举报记录（在登录态下）”的边界设计。  
说明：本轮未获取有效普通登录测试账号（匿名登录禁用），因此“登录用户读取自己记录”的动态验证以 policy + 匿名探针为主。

## B. `moderation_queue`

验证点：
- 匿名读取 `moderation_queue`：返回 0 行
- policy 规则检查：仅 `service_role` 可 SELECT / ALL

结论：✅ 普通用户不会看到审核队列。

## C. `audit_logs`

验证点：
- 匿名读取 `audit_logs`：返回 0 行
- policy 规则检查：仅 `service_role` 可 SELECT/INSERT

结论：✅ 普通用户不会看到审计日志。

## D. `system_configs`

验证点：
- 匿名读取 `system_configs` 返回键：`search.public_defaults`
- 返回结果中 `has_non_public=false`
- policy 规则检查：`is_public=true OR is_service_role()`

结论：✅ 仅公开配置可被前台读取；普通用户无写权限。

## E. `recommendation_slots`

验证点：
- 匿名读取基础字段：当前返回 0 行（未配置公开位）
- policy 规则检查：只允许 `is_active=true` 且时间窗口有效
- patch 已执行列级收口：`notes/created_by/updated_by` 对 `anon/authenticated` 撤销 SELECT

结论：✅ 公开边界符合预期（active + 时间窗口），且后台字段已收口。  
备注：当前无公开推荐位样本数据，无法做“有数据时前台字段是否自动脱敏”的动态展示验证，结构与权限规则已就位。

## F. 命名一致性（target/item）

验证点：
- `content_reports.target_type` 与 `moderation_queue.item_type` 约束均已统一支持：
  - `question`
  - `answer`
  - `post`
  - `skill_offer`
  - `expert`
  - `message`
  - `user_verifications`

结论：✅ 与前面 Packs 的命名语义保持一致，且可扩展。

---

## 4. RLS 与公开边界结论

总体结论：**Pack 07 的公开/私有边界符合当前预期。**

通过项：
- 举报：普通用户提交/读取本人；审核更新走 service role。
- 审核队列：普通用户不可见。
- 审计日志：普通用户不可见。
- 系统配置：仅 `is_public=true` 可读。
- 推荐位：仅 active + 有效期可读，后台字段已列级收口。

---

## 5. P0 / P1 / P2 问题清单

## P0（阻塞 Pack 08）
- 无。

## P1（建议优化，但不阻塞）
- 需要补一组“登录普通用户”的动态用例（当前匿名登录禁用，未覆盖 `content_reports` 的登录态读写完整路径）。
- 建议新增一个轻量 SQL/脚本化联调夹具，插入一条有效期内推荐位，用于前台字段暴露回归测试。

## P2（后续可做）
- 后续可补更细的 service-role 运营函数（例如 recommendation_slots 的 upsert RPC），但当前不阻塞。

---

## 6. 是否建议进入 Pack 08

结论：**可以进入 Pack 08（从 Pack 07 稳定性角度看无 P0 阻塞）**。  
但按你当前指令，本轮不进入 Pack 08。

