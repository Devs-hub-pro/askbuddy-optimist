# Call v1 Migration Plan（先计划，不直接执行）

更新时间：2026-05-15  
范围：Call v1 后端最小闭环（A 主线）

---

## 1. 目标

在不引入复杂 RTC 编排/计费系统的前提下，提供三端可联调的通话主链路：

1. 创建通话会话
2. 接听/拒绝/挂断
3. 会话状态受控流转
4. 仅参与方可读会话

---

## 2. 计划新增对象

## 2.1 表

- `public.call_sessions`

最小字段：

- `id`
- `order_id`
- `target_type`
- `target_id`
- `caller_id`
- `callee_id`
- `mode`
- `status`
- `started_at`
- `ended_at`
- `end_reason`
- `rtc_channel`
- `metadata`
- `created_at`
- `updated_at`

## 2.2 索引（克制版）

1. `(caller_id, created_at desc)`
2. `(callee_id, created_at desc)`
3. `(status, created_at desc)`
4. `(target_type, target_id)`
5. `(order_id)`（可选）

## 2.3 RLS

1. `SELECT`：仅 caller/callee 可读
2. `INSERT`：仅 caller 本人可创建（`auth.uid() = caller_id`）
3. `UPDATE`：默认不开放端侧直接 update；由 RPC 执行
4. `DELETE`：不开放普通用户

---

## 3. 计划新增 RPC（最小）

1. `create_call_session_v1`
2. `accept_call_v1`
3. `reject_call_v1`
4. `end_call_v1`
5. `heartbeat_call_v1`（可选）
6. `mark_call_timeout_v1`（服务端/定时路径）

说明：

- 所有状态流转都走 RPC 白名单，不允许端侧直接 update 状态字段作为主路径。
- 非法状态流转必须拒绝。
- 幂等路径（同状态重复操作）应返回 idempotent=true。

---

## 4. 状态流转约束（数据库侧）

固定状态：

- `initiated`
- `ringing`
- `answered`
- `ended`
- `cancelled`
- `timeout`
- `failed`

白名单流转：

1. `initiated -> ringing`
2. `ringing -> answered`
3. `ringing -> cancelled`
4. `ringing -> timeout`
5. `ringing -> failed`
6. `answered -> ended`
7. `answered -> failed`

---

## 5. 明确不做项（本轮禁止）

1. 复杂计费 / 分账 / 通话时长计费
2. 录制/回放
3. 推送编排
4. 群组通话
5. 跨端 RTC SDK 细节封装（由 B/C/D 端各自实现）

---

## 6. 与既有 Pack 的衔接

1. 可与 `orders` 轻量关联（`order_id` 可空）
2. `target_type/target_id` 使用 A 白名单（含 `call_session` 新值）
3. 后续若要加通知联动，走 `create_system_notification_v2`，不在本计划内自动触发

---

## 7. 实施顺序建议

1. migration：建表 + 约束 + 索引 + RLS
2. migration：RPC（create/accept/reject/end）
3. staging 联调（B/C/D）
4. 观测后再决定是否加 `heartbeat_call_v1` / `mark_call_timeout_v1`

