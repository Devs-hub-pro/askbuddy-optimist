# 多端统一状态机 v1（Freeze 基线）

日期：2026-04-22  
目标：三端统一同一套状态语义，避免端侧解释不一致。

## 1. Question 状态

- `open`：可回答
- `matched`：已匹配到候选回答/处理中
- `solved`：已采纳，问题完成
- `hidden`：隐藏（仅作者/管理员可见）
- `deleted`：删除态

最小流转：
- `open -> matched -> solved`
- `open -> solved`
- `* -> hidden`
- `* -> deleted`

## 2. Answer 状态

- `active`：可展示
- `accepted`：被采纳
- `hidden`：隐藏
- `deleted`：删除

最小流转：
- `active -> accepted`
- `active -> hidden|deleted`

## 3. SkillOffer 状态

- `draft`
- `pending_review`
- `published`
- `offline`

最小流转：
- `draft -> pending_review -> published`
- `published -> offline`

## 4. Order 状态

- `pending_payment`
- `paid`
- `in_service`
- `completed`
- `refunded`
- `closed`

白名单流转（已由 `transition_order_status_v2` 收口）：
- `pending_payment -> paid`
- `paid -> in_service`
- `in_service -> completed`
- `paid -> refunded`
- `pending_payment -> closed`

## 5. Payment 状态

- `pending`
- `paid`
- `failed`
- `refunded`

## 6. Post 可见性/状态

### visibility
- `public`
- `followers`
- `private`

### status
- `active`
- `hidden`
- `deleted`

可见性由 `can_read_post(...)` 控制，三端不得自行绕过。

## 7. Notification 状态

- `is_read = false|true`

通知创建走服务端主路径：
- `create_system_notification_v2`

## 8. 三端执行规则

1. 所有状态判断统一来自此文档。  
2. 端侧禁止“猜状态”或新增私有状态。  
3. 如需新增状态，先改后端+契约文档，再改三端。  
4. Freeze 阶段仅允许 bugfix，不扩状态机。
