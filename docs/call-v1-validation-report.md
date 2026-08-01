# Call v1 Staging Validation Report

验证日期：2026-08-02  
项目：`fslpvtlavhrnxsygkpvi`  
Migration：`20260802120000_call_v1_sessions_and_rpcs.sql`

## 1. 执行结果

- Supabase 项目从 `COMING_UP` 恢复为 `ACTIVE_HEALTHY` 后执行 migration。
- `npx supabase db push` 成功。
- 本地与远端 migration 版本 `20260802120000` 一致。
- `npm run test:contracts` 通过。
- `npm run test:smoke` 通过。
- `npm run test:call` 通过。
- 临时 caller、callee、outsider 及测试会话在验证结束后已清理。

## 2. RLS 与权限边界

已验证：

- 匿名用户不能调用 `create_call_session_v1`。
- caller 与 callee 均可读取自己参与的 `call_sessions`。
- 非参与者读取不到该会话。
- authenticated 客户端不能直接更新 `call_sessions.status`。
- 非 callee 不能调用 `accept_call_v1` / `reject_call_v1`。
- caller 或 callee 可以在接通后调用 `end_call_v1`。

## 3. 状态机与幂等

已验证：

- 创建会话后状态为 `ringing`。
- `ringing -> answered` 正常，并写入 `started_at`。
- 重复接听返回 `idempotent=true`。
- `answered -> ended` 正常，并写入 `ended_at`。
- 重复挂断返回 `idempotent=true`。
- callee 可执行 `ringing -> cancelled`；重复拒绝幂等。
- caller 可在响铃阶段取消会话。
- 自呼叫被 `CALL_INVALID_PARTICIPANT` 拒绝。

## 4. 副作用检查

本轮 RPC 没有写入：

- `notifications`
- `point_transactions`
- `earning_transactions`

符合 Call v1 最小后端边界。

## 5. 类型与构建

- 已从 staging 重新生成 `src/integrations/supabase/types.ts`。
- 生成类型包含 `call_sessions` 与 create/accept/reject/end 四个 RPC。
- Vite 生产构建通过。
- 全量 `tsc --noEmit` 暴露现有页面的历史类型债，包括旧字段兼容、adapter 输入模型及少量事件类型问题；这些不是 Call migration 引入的运行时回归，但应作为 P1 渐进清理。

## 6. 问题分级

### P0

- 无。

### P1

- B/C/D 尚未切换到真实 Call RPC 与 Realtime 订阅。
- 微信小程序当前本地 Call 状态命名仍有 `dialing/connected/rejected`，接入前必须映射到 A 契约的 `initiated/ringing/answered/cancelled`。
- 尚未实现 `heartbeat_call_v1` 与服务端超时回收，测试期间可能产生长期 `ringing` 会话。
- RTC 厂商 token/房间信令尚未实现，当前只完成通话业务状态层，不能传输真实音视频。

### P2

- 通话通知、订单/积分/收益联动、录制和通话质量观测继续延后。

## 7. 结论

Call v1 数据表、参与者 RLS 和最小状态 RPC 已可供 B/C/D 在 staging 联调。端侧接入前必须同步 A 最新契约，不得直接更新 `call_sessions.status`，也不得新增状态值。
