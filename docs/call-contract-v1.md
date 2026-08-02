# Call Contract v1（A 主线定版）

更新时间：2026-05-15  
适用端：iOS / Android / 微信小程序  
原则：仅做“交易沟通通话最小闭环”，不做复杂 RTC 编排与计费系统。

---

## 1. 目标与范围

本契约仅覆盖：

1. 通话会话创建与状态流转
2. 呼叫双方权限校验
3. 最小 RPC 主路径收口
4. 与订单/咨询对象的轻量关联（target/item）

本版本不覆盖：

- 录制、转码、回放
- 推送系统（APNs/FCM/订阅消息）
- 复杂计费与分账
- 多人群组通话
- 完整 WebRTC 信令服务实现细节

---

## 2. 数据模型（最小字段）

建议新表：`public.call_sessions`

| 字段 | 类型 | 说明 |
|---|---|---|
| id | uuid pk | 通话会话 ID |
| order_id | uuid null | 可选，关联 `orders.id` |
| target_type | text | 业务对象类型（白名单） |
| target_id | uuid null | 业务对象 ID |
| caller_id | uuid not null | 发起人 |
| callee_id | uuid not null | 被叫人 |
| mode | text not null | `voice` / `video` |
| status | text not null | 见状态机 |
| started_at | timestamptz null | 接通时间 |
| ended_at | timestamptz null | 结束时间 |
| end_reason | text null | 结束原因 |
| rtc_channel | text null | RTC 房间号/频道号（可选） |
| metadata | jsonb default '{}' | 轻量扩展 |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

约束建议：

- `caller_id <> callee_id`
- `mode in ('voice','video')`
- `status in ('initiated','ringing','answered','ended','cancelled','timeout','failed')`

---

## 3. 状态机（定版）

固定白名单：

- `initiated`
- `ringing`
- `answered`
- `ended`
- `cancelled`
- `timeout`
- `failed`

最小合法流转：

1. `initiated -> ringing`
2. `ringing -> answered`
3. `ringing -> cancelled`
4. `ringing -> timeout`
5. `ringing -> failed`
6. `answered -> ended`
7. `answered -> failed`

说明：

- `cancelled`：一般由 caller 在接通前取消
- `timeout`：无人接听超时
- `failed`：网络/信令失败等异常终态

---

## 4. 角色与权限（caller/callee）

基础角色：

- `caller`：发起方
- `callee`：被叫方

权限边界（最小）：

1. 会话创建：仅登录用户，可发起自己为 caller 的会话
2. 接听/拒绝：仅 `callee` 可执行
3. 结束通话：`caller` 或 `callee` 任一方可执行
4. 会话读取：仅会话参与双方可读
5. 非参与方不可读、不可改状态

---

## 5. target_type / item_type 扩展结论

为了通话会话与通知、审核、运营位语义统一，最小新增：

- `call_session`

扩展后统一白名单（增量）：

- `question`
- `answer`
- `post`
- `skill_offer`
- `expert`
- `message`
- `order`
- `user_verification`
- `manual`
- `call_session`  ← 新增

---

## 6. RPC 白名单命名（Call v1）

当前已部署并通过 staging 验证的端侧可调用 RPC：

1. `create_call_session_v1`
2. `accept_call_v1`
3. `reject_call_v1`
4. `end_call_v1`

保留名称但尚未实现，端侧不得调用：

1. `heartbeat_call_v1`
2. `mark_call_timeout_v1`

建议参数（最小）：

- `create_call_session_v1(p_callee_id, p_mode, p_target_type, p_target_id, p_order_id?)`
- `accept_call_v1(p_call_session_id)`
- `reject_call_v1(p_call_session_id, p_reason?)`
- `end_call_v1(p_call_session_id, p_reason?)`

---

## 7. 错误码最小集合

建议统一错误码（RPC 返回或异常消息标准化）：

- `CALL_UNAUTHORIZED`
- `CALL_FORBIDDEN`
- `CALL_NOT_FOUND`
- `CALL_INVALID_STATE`
- `CALL_INVALID_PARTICIPANT`
- `CALL_ALREADY_ENDED`
- `CALL_TIMEOUT`
- `CALL_INTERNAL_ERROR`

---

## 8. Migration 落地状态

Call v1 最小 migration 已在 staging 应用并验证：

1. 新增表：`call_sessions`
2. 索引：
   - `(caller_id, created_at desc)`
   - `(callee_id, created_at desc)`
   - `(status, created_at desc)`
   - `(target_type, target_id)`
3. RLS：
   - 参与者可读
   - 仅 caller 可创建
   - 状态变更通过 RPC（受控）
4. 最小 RPC：
   - create / accept / reject / end

`heartbeat_call_v1` 与 `mark_call_timeout_v1` 继续作为后续候选能力，不属于当前端侧契约。

不做项（明确）：

- 复杂计费联动
- 录制与回放
- 推送编排
- 全量信令平台

---

## 9. 给 B/C/D 的消费约束（A 唯一事实来源）

1. B/C/D 不得新增状态值与错误码值
2. B/C/D 不得私改 RPC 入参/出参语义
3. 如端侧发现契约不足，必须提报 A 仲裁后再变更
4. 多端联调统一接 staging，禁止依赖个人 local 后端语义
