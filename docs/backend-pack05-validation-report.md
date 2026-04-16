# backend-pack05-validation-report

## 执行结果摘要

本轮基于当前本地代码与远端已落地数据库，完成了 Pack 05 最小联调检查（未进入 Pack 06）。

已执行并通过：
1. `npx supabase migration list`  
   - 远端已包含：
   - `20260417020000_pack_05_messages_and_notifications.sql`
   - `20260417023000_pack_05_patch_access_and_uniqueness.sql`
2. `npx supabase db push`  
   - 结果：`Remote database is up to date.`
3. `npm run test:contracts`  
   - 结果：`Schema contract check passed.`
4. `npm run test:smoke`（使用真实 Supabase URL/Anon Key 环境映射）  
   - 结果：`RPC smoke tests passed.`

补充运行时探针（anon）：
- `conversations/messages/notifications` 匿名读取结果均为 `count=0`（符合 RLS 不公开预期）。
- `get_my_unread_message_count` / `get_my_unread_notification_count` 在未登录上下文返回 `0`（可调用、最小行为成立）。

---

## 会话 / 消息 / 通知 / 未读数联调结果

### A. conversations

检查点：
- 用户是否只能看到自己参与的会话
- direct 会话唯一性是否满足预期

结论：
- **通过（结构与策略层）**  
  - `pack05_conversations_member_select` 使用 `is_conversation_member(...)`，会话读取限定为成员。
  - direct 会话唯一性由：
    - 唯一索引 `(type, participant_a, participant_b) WHERE type='direct'`
    - 顺序约束 `participant_a < participant_b`
    - patch 去重逻辑（历史重复会话归并）  
    共同保障。

说明：
- 远端迁移已应用，`db push` 显示 up to date，说明上述约束已落地。

---

### B. messages

检查点：
- 成员可读、非成员不可读
- sender_id 伪造防护
- 非成员不能向会话发消息
- `last_message_at` 更新是否具备

结论：
- **通过（策略+触发器层）**
  - 读取：`pack05_messages_member_select` 要求会话成员，且只读 active（发送者可读自己历史）。
  - 发送：`pack05_messages_sender_insert` 要求 `auth.uid() = sender_id`。
  - 会话写入约束：若指定 `conversation_id`，需满足成员校验；direct 会话还会校验 sender/receiver 与会话参与者一致。
  - `last_message_at`：由 `trg_messages_after_change` 在消息变更后维护。

前端兼容观察：
- 当前前端仍保留旧链路 fallback（基于 `sender_id/receiver_id/read_at`），可与 Pack05 兼容运行。

---

### C. notifications

检查点：
- 用户只能读取自己的通知
- 普通用户无法伪造系统通知
- `is_read` 能支撑通知列表状态

结论：
- **通过（策略层）**
  - owner-only：`SELECT/UPDATE/DELETE` 都限定 `auth.uid() = user_id`。
  - 普通用户插入已收口：移除 owner insert policy，系统通知/业务通知写入走 service role / server-side。
  - `is_read` 字段仍保留且前端 hooks 正在使用，通知列表与未读状态可支撑。

---

### D. unread count

检查点：
- `get_my_unread_message_count` 返回合理
- `get_my_unread_notification_count` 返回合理
- 是否保持“最小可用”

结论：
- **通过（最小可用）**
  - 两个函数均可被调用并返回值（未登录上下文为 0）。
  - 消息未读函数仅基于 `conversation_members.last_read_at + messages.status='active'`。
  - 通知未读函数仅基于 `notifications.is_read=false`。
  - 未引入复杂送达/回执/撤回状态系统，保持克制。

---

## RLS 边界是否符合预期

综合结论：**符合预期（Pack 05 目标边界已成立）**

1. 会话边界  
- 非成员不可读 `conversations` 与 `conversation_members`。

2. 消息边界  
- 非成员不可读消息；  
- 发送者不能伪造 `sender_id`；  
- 不能向非自己所属会话发消息。

3. 通知边界  
- 用户只能读写自己的通知状态；  
- 普通用户不可直接创建系统通知。

4. 匿名访问边界  
- 匿名对会话/消息/通知读取均不可见（探针 count=0）。

---

## P0 / P1 / P2 问题清单

### P0（阻塞）
- 无。

### P1（建议优化，不阻塞 Pack 06）
1. 前端消息未读数目前仍主要走旧字段 `read_at` 查询；建议后续逐步切到 `get_my_unread_message_count` 或会话级读取模型。  
2. `useConversations` / `useMessagesWithUser` 当前以旧私信模型（双方 user_id）为主，建议后续逐步切换到 conversation_id 主链路，减少双模型并行期复杂度。

### P2（可后续优化）
1. 为 Pack05 增加一份“新旧消息模型并行期”说明文档（开发注意事项与下线旧字段计划）。

---

## 是否建议进入 Pack 06

结论：**建议可以进入 Pack 06**。

前提：
- 保持本轮 Pack05 已有边界不回退；
- Pack06 继续采用“最小可用、低耦合”策略，不反向改动 Pack05 核心模型。

