# Call v1（iOS）会话状态层联调方案（B 主线）

## 1) iOS 通话入口页扫描与接入点清单

### 入口 A：订单页（服务中订单）
- 页面：`src/pages/profile/OrderList.tsx`
- 触发条件：`order.status === 'in_service'`
- 接入动作：按 `order_id` 读取参与者可见的活跃会话；无活跃会话时通过 `create_call_session_v1` 创建
- 说明：订单双方 ID 来自现有 `orders.buyer_id/seller_id`

### 入口 B：咨询页（专家详情）
- 页面：`src/pages/ExpertDetail.tsx`
- 触发条件：选择 `voice` 或 `video` 咨询方式
- 接入动作：携带 `callee_id` 与 `expert` target 参数进入 `/call/new`，由通话页创建真实会话
- 说明：演示专家不进入真实 RPC 主路径

### 入口 C：聊天页（会话详情）
- 页面：`src/pages/ChatDetail.tsx`
- 触发条件：顶部操作区点击电话按钮
- 接入动作：携带聊天对象 `user_id` 进入 `/call/new`，由通话页创建真实会话
- 说明：保留现有聊天主链路，不改变消息 schema

## 2) iOS 最小实现方案

### 通话页 UI（真实会话状态层）
- 页面：`src/pages/CallSession.tsx`
- 已支持：接听、拒绝、挂断、静音、切摄像头、通话时长
- 状态展示：`initiated / ringing / answered / ended / cancelled / timeout / failed`
- 状态来源：`call_sessions` 初始查询 + Supabase Realtime 单会话订阅
- 备注：本轮不接入真实 RTC 媒体传输

### 权限申请与兜底
- 权限 Hook：`src/hooks/useCallPermissions.ts`
- 会话公共层：`src/features/call/index.ts`
- 能力：
  - 语音：申请麦克风
  - 视频：申请麦克风 + 摄像头
- 失败兜底：
  - 展示明确失败原因
  - 提供“重新申请权限”入口
  - 设备不支持时标记 `unavailable`

### 与 A 主线 RPC/状态机对齐方案
- 只调用 `create_call_session_v1 / accept_call_v1 / reject_call_v1 / end_call_v1`。
- 不调用尚未实现的 heartbeat/timeout RPC。
- 不直接更新 `call_sessions.status`。
- 页面卸载或会话切换时通过 `removeChannel` 取消 Realtime 订阅。

## 3) 壳层联调代码范围

- 新增：
  - `src/hooks/useCallPermissions.ts`
  - `src/features/call/useCallSession.ts`（A 公共层，iOS 直接消费）
  - `src/pages/CallSession.tsx`
- 退役：
  - `src/hooks/useCallSession.ts`（重复网络/Realtime 实现）
- 修改：
  - `src/App.tsx`（新增 `/call/:sessionId` 路由）
  - `src/pages/ExpertDetail.tsx`（咨询入口接入）
  - `src/pages/ChatDetail.tsx`（聊天入口接入）
  - `src/pages/profile/OrderList.tsx`（订单入口接入）

## 4) 联调用例（最小）

1. 发起（caller）
- 从专家详情/聊天页进入通话
- 预期：权限通过后创建会话，获得 `call_session_id`，状态为 `ringing`

2. 接听（callee）
- 从订单服务中入口进入
- 预期：读取 `ringing` 会话，点击“接听”后通过 RPC 进入 `answered`

3. 拒绝
- `ringing` 状态点击“拒绝”
- 预期：状态变为 `cancelled`

4. Realtime
- 双方保持同一会话页面，一方执行状态动作
- 预期：另一方无需直接写表即可感知状态变化

5. 挂断
- `in_call` 点击“挂断”
- 预期：状态变为 `ended`，计时停止

6. 非参与者
- 使用非参与账号访问会话或调用动作 RPC
- 预期：无法读取会话，RPC 返回明确权限错误

## 5) 契约冲突提报给 A（模板）

### Blocker
- 无会话状态层契约冲突。
- 真实音视频供应商、token 与信令仍未实现，不属于本轮范围。

### Non-blocker
- `heartbeat_call_v1` 与 `mark_call_timeout_v1` 尚未实现，端侧不得提前调用。
