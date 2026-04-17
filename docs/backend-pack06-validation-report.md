# Pack 06 联调验证报告（最小联调）

日期：2026-04-17  
范围：Pack 06（`orders / payments / point_transactions / earning_transactions`）  
约束：不进入 Pack 07

---

## 1. 执行结果摘要

已执行命令：

1. `npm run test:contracts`  
- 结果：✅ 通过（`Schema contract check passed.`）

2. `npm run test:smoke`  
- 首次结果：❌ 失败（会话未注入 `SUPABASE_URL/SUPABASE_ANON_KEY`）  
- 注入真实环境变量后重试：✅ 通过（`RPC smoke tests passed.`）

3. `npx supabase migration list`（远端核验）  
- 结果：✅ `20260417033000_pack_06_orders_points_earnings` 已在 remote 存在并对齐 local。

结论：Pack 06 migration 已成功应用到远端，基础契约与 RPC 冒烟通过。

---

## 2. Pack 06 migration 应用状态

检查结果：
- `20260417033000_pack_06_orders_points_earnings`：Local/Remote 同步存在。
- 未发现 Pack 06 迁移缺失或版本漂移。

---

## 3. 模块联调结果

## A. MyOrders

现状：
- 前端 `useMyOrders` 仍按 `orders.user_id` 查询（`src/hooks/useProfileData.ts`）。
- Pack 06 新模型以 `buyer_id/seller_id` 为主读写语义。

结论：
- ⚠️ 旧链路可读（依赖历史 `user_id`）但与 Pack 06 主语义不完全对齐。  
- ⚠️ 对“新写入的双边订单”存在漏读风险（若 `user_id` 不再维护）。

## B. MyEarnings

现状：
- 前端 `useMyEarnings` 读的是旧表 `points_transactions`（`src/hooks/useProfileData.ts`）。
- Pack 06 新增并主推 `point_transactions` 与 `earning_transactions`。

结论：
- ⚠️ 页面能跑但尚未切到 Pack 06 标准账务表；MyEarnings 与新收益流水未完全联通。

## C. PointsRecharge

现状：
- 页面通过 RPC / Edge Function 路径创建支付单，代码存在旧链路 fallback（`usePayments.ts`）。
- Pack 06 提供了 `orders/payments/point_transactions` 的最小结构承接。

结论：
- ✅ 结构层可承接。  
- ⚠️ 仍依赖既有 RPC 逻辑，未完全切换到 Pack 06 表直连模式（这是当前阶段可接受状态）。

## D. orders / payments / point_transactions / earning_transactions 可读性与权限边界

基于 migration 与 RLS 规则检查：
- `orders`：buyer/seller 可读，buyer 可创建。  
- `payments`：仅参与方可读。  
- `point_transactions`：owner-only read。  
- `earning_transactions`：owner-only read。  
- 普通用户无直接插入/修改系统账务流水的 policy。

结论：
- ✅ 权限边界设计符合“最小可用 + 系统写入保留 service role”预期。

## E. buyer/seller 订单可见性

状态：
- 已通过 RLS 规则静态核对（buyer/seller 参与者可读策略存在）。
- 尝试用临时新账号做真实写读探针时遇到 Supabase Auth `email rate limit exceeded`，未完成该项动态验证。

结论：
- ⚠️ 规则层通过；动态探针待补一次（需可用测试账号/放开注册频率）。

## F. point_accounts 与 point_transactions 关联

检查结果：
- ✅ 已按 Pack01 真实结构衔接：`point_transactions.point_account_id -> point_accounts(user_id)`。
- ✅ 已有触发器校验 `point_transactions.user_id` 与 `point_accounts.user_id` 一致性。

## G. 普通用户不能伪造系统账务流水

检查结果：
- ✅ `point_transactions` 与 `earning_transactions` 未给 authenticated 用户 insert/update policy。  
- ✅ 仅 owner read，系统写入应走 service role / server-side。

---

## 4. RLS 边界结论

整体结论：**符合预期（最小账务闭环）**。

已满足：
- 用户只能读自己账务流水；
- 买卖双方可读订单；
- 普通用户不能直接写系统账务流水；
- `point_accounts` 与流水关系已按真实主键方案对齐。

待补强（动态层）：
- buyer/seller 真实跨账号读写探针（受注册频率限制未完成）。

---

## 5. P0 / P1 / P2 问题清单

## P0（阻塞）
- 无。

## P1（建议尽快修）
- 前端 `MyOrders` 仍使用 `orders.user_id` 查询，未对齐双边模型 `buyer_id/seller_id`。  
  影响：新订单可能在“我的订单”中漏显示。
- 前端 `MyEarnings` 仍读取旧 `points_transactions`，未切到 `point_transactions + earning_transactions`。  
  影响：Pack 06 新账务链路可见性不完整。
- 动态 RLS 探针未跑全（Auth 注册限流导致双用户验证中断）。

## P2（可后续优化）
- 增加稳定测试账号与脚本化联调用例（避免受注册频率限制）。
- 为 MyOrders/MyEarnings 增加兼容查询层（adapter/RPC），逐步去除旧字段依赖。

---

## 6. 是否建议进入 Pack 07

结论：**可进入 Pack 07（有前提）**。

前提建议：
1. 先补一轮前端数据读取对齐（`orders` 双边查询、收益页切换到新流水表）。  
2. 用固定测试账号补完 buyer/seller 动态探针（避免临时注册限流干扰）。

说明：
- 当前无 P0 阻塞 Pack 06 继续联调。  
- Pack 06 的数据库结构与 RLS 边界已经达到“可用、可扩展”的最低标准。

