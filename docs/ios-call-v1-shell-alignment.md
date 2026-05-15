# Call v1 (iOS) 壳层联调方案（B 主线）

## 1) iOS 通话入口页扫描与接入点清单

### 入口 A：订单页（服务中订单）
- 页面：`src/pages/profile/OrderList.tsx`
- 触发条件：`order.status === 'in_service'`
- 接入动作：新增“进入通话”按钮，跳转 `/call/:sessionId?mode=voice&role=callee`
- 说明：仅前端壳层，`sessionId` 暂用 `order.id`

### 入口 B：咨询页（专家详情）
- 页面：`src/pages/ExpertDetail.tsx`
- 触发条件：选择 `voice` 或 `video` 咨询方式
- 接入动作：新增“发起语音/发起视频”按钮，跳转 `/call/mock-xxx?mode=voice|video&role=caller`
- 说明：不新增任何后端字段，先用于联调与 UI 验证

### 入口 C：聊天页（会话详情）
- 页面：`src/pages/ChatDetail.tsx`
- 触发条件：顶部操作区点击电话按钮
- 接入动作：跳转 `/call/mock-xxx?mode=voice&role=caller`
- 说明：保留现有聊天主链路，不改变消息 schema

## 2) iOS 最小实现方案

### 通话页 UI（壳层）
- 页面：`src/pages/CallSession.tsx`
- 已支持：接听、拒绝、挂断、静音、切摄像头、通话时长
- 状态展示：`ringing / connecting / in_call / ended / rejected / timeout / failed`
- 备注：当前 RTC 引擎为 mock，不引入平台私有协议

### 权限申请与兜底
- Hook：`src/hooks/useCallPermissions.ts`
- 能力：
  - 语音：申请麦克风
  - 视频：申请麦克风 + 摄像头
- 失败兜底：
  - 展示明确失败原因
  - 提供“重新申请权限”入口
  - 设备不支持时标记 `unavailable`

### 与 A 主线 RPC/状态机对齐方案
- 本轮不新增后端调用，不扩展字段语义。
- 仅落前端状态壳层，最终以 A 主线契约替换 mock 触发。
- 预留对齐点：
  - `session_id`：沿用 A 会话主键
  - `call_status`：前端展示状态映射 A 状态机
  - `accept/reject/hangup/timeout`：仅消费 A RPC，不直写系统字段

## 3) 壳层联调代码范围

- 新增：
  - `src/hooks/useCallPermissions.ts`
  - `src/hooks/useMockCallSession.ts`
  - `src/pages/CallSession.tsx`
- 修改：
  - `src/App.tsx`（新增 `/call/:sessionId` 路由）
  - `src/pages/ExpertDetail.tsx`（咨询入口接入）
  - `src/pages/ChatDetail.tsx`（聊天入口接入）
  - `src/pages/profile/OrderList.tsx`（订单入口接入）

## 4) 联调用例（最小）

1. 发起（caller）
- 从专家详情/聊天页进入通话
- 预期：进入 `connecting`，权限通过后进入 `in_call`

2. 接听（callee）
- 从订单服务中入口进入
- 预期：初始 `ringing`，点击“接听”后进入 `connecting -> in_call`

3. 拒绝
- `ringing` 状态点击“拒绝”
- 预期：状态变为 `rejected`

4. 超时
- 触发“模拟超时”
- 预期：状态变为 `timeout`

5. 挂断
- `in_call` 点击“挂断”
- 预期：状态变为 `ended`，计时停止

6. 异常中断
- 触发“模拟异常中断”
- 预期：状态变为 `failed`

## 5) 契约冲突提报给 A（模板）

### Blocker
- 标题：Call v1 共享契约缺失（B 无法严格消费）
- 现状：`packages/shared-api` / `packages/shared-types` 仅 README，缺少 Call v1 类型与 API 常量导出
- 影响：B 只能用本地 mock 状态机，无法接入“严格消费 A 契约”模式
- 期望：A 提供 `call session` 相关
  - 类型：session/status/action payload
  - RPC：initiate/accept/reject/hangup/timeout/query（最终命名以 A 为准）
  - 状态机：合法迁移表
- B 临时措施：仅壳层联调，不扩展后端语义

### Non-blocker
- 标题：Call 入口来源参数规范待统一
- 现状：订单/咨询/聊天来源参数字段未统一命名
- 建议：A 给出统一来源参数（如 `source_page`, `biz_order_id`, `peer_user_id`）

