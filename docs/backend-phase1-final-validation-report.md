# 一期最终验证报告（Pack 01 ~ Pack 08-B）

日期：2026-04-22  
范围：阶段性收官判定（不新增 Pack，不扩展新功能）

基线依据：
- `docs/backend-phase1-final-validation-checklist.md`
- `docs/backend-pack08b-legacy-cleanup-validation-report.md`
- 各 Pack 历史验证报告（Pack05/06/07/08A/08B）
- 本轮执行结果：`migration list`、`db push`、`test:contracts`、`test:smoke`

---

## 1. 执行结果摘要

本轮命令执行结果：
- `npx supabase migration list`：✅ 成功（本地/远端迁移版本一致，已到 `20260422100000_pack_08b_search_v2_unify.sql`）
- `npx supabase db push`：✅ 成功（`Remote database is up to date.`）
- `npm run test:contracts`：✅ 通过
- `npm run test:smoke`：✅ 通过（使用 `.env` 注入 `SUPABASE_URL/SUPABASE_ANON_KEY`）

结论：当前 schema 与代码状态一致，具备一期收官判定基础。

---

## 2. 模块逐项验证结论

## 2.1 用户与资料
结论：**通过（有小尾巴）**

通过点：
- Pack01 用户建档链路（`profiles/user_settings/point_accounts`）已落地并长期稳定。
- backfill 迁移已执行成功，历史用户补档路径已具备。
- `profiles`、`user_settings`、`user_verifications` 的权限边界已按一期目标收口。

小尾巴：
- `src/integrations/supabase/types.ts` 仍有部分历史字段定义残留（不阻塞）。

## 2.2 提问 / 回答 / 采纳
结论：**通过**

通过点：
- Pack02 主链路（`questions/question_drafts/answers`）可用。
- Pack02 补丁后公开读口径与系统字段保护已生效。
- `accept_answer_v2` 已上线并完成联调：
  - 仅问题作者可采纳
  - 回答归属校验
  - 幂等
  - 已采纳他答不可替换
  - 前端直写系统字段仍被 guard 拦截

## 2.3 专家 / 技能
结论：**通过（有小尾巴）**

通过点：
- Pack03 `experts/skill_categories/skill_offers` 模型稳定。
- 一人一档约束成立。
- `published` 与非公开状态可见性边界正确。

小尾巴：
- 专家/技能展示层仍有少量历史 fallback 分支，建议后续渐进清理。

## 2.4 搜索 / 发现 / 关注
结论：**通过（有条件）**

通过点：
- 08-B 第2步：搜索命名统一（问题/专家/技能/动态），`search_app_content_v2` 与 `get_search_suggestions_v2` 已可用。
- 热门词优先 `hot_keywords`，失败回退本地常量。
- 登录态搜索提交可 upsert `search_history`。
- 08-B 第3步：关注主路径切到 `follows`，`user_followers` 降级为兼容层；Discover/Following 新字段优先、旧字段 fallback 可用。

条件说明：
- DB 侧 legacy fallback（如 `can_read_post` 对 legacy follows 兜底）仍保留观察期，当前策略正确但未完全退役。

## 2.5 消息 / 通知
结论：**通过**

通过点：
- Pack05 会话/成员/消息/通知模型与 RLS 边界稳定。
- direct 会话唯一性已收口。
- 会话成员边界、消息发送者约束、通知 owner-only 边界均通过。
- `create_system_notification_v2` 已收口到 service/server-side 路径，普通用户不可伪造系统通知。

## 2.6 订单 / 积分 / 收益
结论：**通过（有条件）**

通过点：
- Pack06 双边订单模型与最小账务模型已落地：`orders/payments/point_transactions/earning_transactions`。
- 08-A `transition_order_status_v2` 已服务端收口（白名单流转 + 幂等 + 权限边界）。
- 账务主路径已明确：`point_accounts + point_transactions + earning_transactions`。
- `profiles.points_balance` 已 deprecated（非真值）。

条件说明：
- 仍建议继续观察一个版本，确认无页面误用旧余额/旧流水读取。

## 2.7 举报 / 审核 / 推荐位
结论：**通过**

通过点：
- Pack07 审核/举报/运营配置基础层已落地。
- `content_reports`、`moderation_queue`、`audit_logs`、`system_configs`、`recommendation_slots` 权限边界符合预期。
- 推荐位公开读取边界（active + 时间窗口）与后台字段收口已完成。

---

## 3. 当前剩余问题分级

## P0（阻塞阶段性收官）
- **无**

## P1（建议收官前或收官后首批修复）
1. `src/integrations/supabase/types.ts` 仍有历史表/字段残留（例如 `user_followers`、旧 posts/comment 字段），建议单独做一次“小范围 types 再生成与替换”。  
2. Discover UI 层仍主要展示 legacy 命名（`likes_count/comments_count`），当前由 hooks 映射兼容，建议后续逐步统一为新命名。
3. `test:smoke` 对环境变量注入有依赖，建议统一脚本读 `.env`，降低执行歧义。

## P2（后续优化项）
1. 在稳定观察期后，逐步移除 `can_read_post` 对 legacy follows 的 fallback。
2. 逐步退役 posts/comments 历史兼容触发器与旧字段（需分批、可回滚）。
3. 做一次小型“前端查询层命名收口”，减少 adapter 映射成本。

---

## 4. 是否阻塞“一期收官”

结论：**当前无阻塞收官的 P0 项**。  
从架构完整性、权限边界、主链路可用性、迁移一致性看，已达到“阶段性收官”标准。

---

## 5. 收官建议

建议：**进入“阶段性收官（Phase-1 Freeze）”**，策略如下：

1. 功能冻结：不再开新 Pack，不新增业务域。  
2. 仅接收：
   - P1/P2 小型 cleanup
   - bugfix
   - 文档与运维脚本完善
3. 进入“收官后稳定观察窗口”（建议 1~2 周）：
   - 重点观察搜索/发现与账务链路
   - 观察 legacy fallback 是否仍被命中

---

## 6. 收官后建议单独开的小任务（非阻塞）

建议独立开 3 个 cleanup 小任务，不并行大改：

1. `cleanup-types-minor`  
- 更新 Supabase types 到当前 schema，清掉本轮确认的高频残留。

2. `cleanup-discover-naming`  
- 把 Discover 展示层从 legacy 计数字段命名逐步统一到新命名。

3. `cleanup-legacy-fallback-observe`  
- 先加观察指标/日志，再分批移除 `user_followers` 与 posts/comments legacy fallback。

---

## 7. 最终判定

**一期状态：接近并达到“阶段性完成”标准。**  
**建议：可以按“阶段性收官”推进。**
