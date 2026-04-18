# Pack 08-A 验证报告：create_system_notification_v2

日期：2026-04-19（Asia/Shanghai）  
范围：仅 Pack 08-A 第 3 个文件（系统通知写入收口），不进入 08-B，不做订单状态流转。

## 1) 执行结果摘要

按要求顺序执行：

1. `npx supabase migration list` ✅  
   - 本地存在待执行 migration：`20260419013000_pack_08a_rpc_create_system_notification_v2.sql`
2. `npx supabase db push` ✅  
   - 远端已成功应用：`20260419013000_pack_08a_rpc_create_system_notification_v2.sql`
3. `npm run test:contracts` ✅  
4. `npm run test:smoke` ✅  
   - 在可访问远端网络环境下通过（`RPC smoke tests passed`）

结论：Pack 08-A（系统通知 RPC）migration 已成功应用到 dev/staging。

---

## 2) 系统通知写入链路联调结果

验证脚本：`scripts/pack08a_system_notification_validate.mjs`

验证点与结果：

1. 普通 authenticated 用户不能直接调用 `create_system_notification_v2`  
   - 结果：✅ 通过（被拒绝）

2. service role / server-side 路径可成功写入 `notifications`  
   - 结果：✅ 通过（成功返回 `notificationId`）

3. 写入主字段符合预期  
   - `user_id` ✅  
   - `type` ✅  
   - `title` ✅  
   - `body` ✅  
   - `target_type` ✅  
   - `target_id` ✅  
   - `is_read=false` ✅

4. legacy 兼容列同步写入  
   - `content` = `body` ✅  
   - `related_type` = `target_type` ✅  
   - `related_id` = `target_id` ✅

5. 本轮未引入模板/推送/编排副作用  
   - 结果：✅ 通过（函数仅执行单条通知写入，不涉及模板/推送/编排链路）

---

## 3) 权限边界检查结论

`create_system_notification_v2` 的边界符合预期：

- 仅 service role / server-side 可调用（函数内 guard + execute 权限收口）
- 普通 authenticated 用户无法伪造系统通知
- 仍兼容 Pack 05 现有 `notifications` 结构（新字段 + legacy 镜像字段）

---

## 4) P0 / P1 / P2 问题清单

### P0（阻塞）
- 无。

### P1（建议优化）
- 当前函数允许 `current_user IN ('service_role', 'postgres', 'supabase_admin')` 作为服务端路径兜底。  
  建议后续统一为“`service_role` JWT + 受控后端入口”单一路径，进一步收敛权限语义。

### P2（可后续处理）
- 可补一条轻量审计记录（例如 `audit_logs`）记录系统通知写入来源（调用链标识），便于运维追踪。

---

## 5) 是否建议进入 08-A 下一步（transition_order_status_v2）

建议：✅ 可以进入 08-A 下一步（`transition_order_status_v2`）。

前提：
1. 继续保持“最小可用、服务端收口”策略；  
2. 不与 08-B 混做；  
3. 先明确订单状态允许流转矩阵，再实现最小 RPC。

