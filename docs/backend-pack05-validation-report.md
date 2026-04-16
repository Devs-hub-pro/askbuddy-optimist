# backend-pack05-validation-report

## 执行结果摘要

按要求顺序执行了以下命令（项目根目录 `/Users/shawnshi1997/askbuddy-optimist`）：

1. `npx supabase migration list`  
   - 首次尝试：连接成功并识别到待执行 Pack05（`20260417020000`、`20260417023000`）。  
   - 后续尝试：失败，报错  
     - `FATAL: Circuit breaker open: Too many authentication errors`  
     - 提示需要 `SUPABASE_DB_PASSWORD`。

2. `npx supabase db push`  
   - 首次失败：Pack05 主迁移中使用 `min(uuid)`（Postgres 不支持）。  
   - 已做最小修复：将 `created_by` 回填逻辑改为 `LEAST(sender_id, receiver_id)`。  
   - 后续重试失败：同样遇到数据库认证断路器（circuit breaker open）。

3. `npm run test:contracts`  
   - 成功：`Schema contract check passed.`

4. `npm run test:smoke`  
   - 原始命令失败：缺少 `SUPABASE_URL`/`SUPABASE_ANON_KEY`（脚本读取的是非 VITE 变量）。  
   - 使用 `.env` 映射后补跑成功：`RPC smoke tests passed.`

当前阶段结论：
- Pack05 迁移 SQL 已完成并通过静态检查；  
- 但受远端数据库认证断路器影响，**尚未完成“Pack05 在远端成功应用”的最终确认**。

---

## 哪些 migration 成功 / 失败

### 已成功（历史）
- Pack01~Pack04（含 patch）此前已在远端应用成功。
- Pack01 backfill 已转为 migration（此前已执行）。

### 本轮 Pack05 状态
- `20260417020000_pack_05_messages_and_notifications.sql`：  
  - 逻辑已修复（去除 `min(uuid)` 问题），但本轮未完成远端应用确认（连接阻塞）。
- `20260417023000_pack_05_patch_access_and_uniqueness.sql`：  
  - 已创建，未完成远端应用确认（同上）。

---

## 会话/消息/通知/未读数联调结果（最小联调）

> 本节区分两类结论：  
> 1) **前端代码路径验证**（已完成）  
> 2) **远端 DB runtime 验证**（受连接阻塞，未完成）

### 1) 会话列表（Messages）

已验证（代码路径）：
- 前端优先走 RPC `get_user_conversations`，不存在则 fallback 到 `messages` 表聚合。  
- 可显示最近会话、未读数、搜索过滤。  

风险：
- 若 Pack05 未应用，fallback 仍依赖旧字段模型（`sender_id/receiver_id/read_at/is_hidden`），与新会话模型并行期需要兼容窗口。

### 2) ChatDetail

已验证（代码路径）：
- 读取线程消息使用双方用户条件查询；发送消息优先 RPC `send_direct_message`，fallback 直接插入 `messages`。  
- `markMessagesAsRead` 仍使用 `read_at` 机制。

风险：
- Pack05 引入 `conversation_members.last_read_at` 作为新未读基线，但前端当前仍读写 `read_at`。  
- 一期可并行（最小可用），后续需统一到会话级已读模型。

### 3) 通知列表（Notifications）

已验证（代码路径）：
- 前端从 `notifications` 拉取 `user_id` 自有通知并支持标记已读。  
- 未读数来自 `is_read=false` 计数。

风险：
- Pack05 patch 收口后，普通用户 insert 通知将被禁止；前端必须依赖 server-side/service role 产生日志通知（符合一期策略）。

### 4) 未读数

已验证（代码路径）：
- 前端消息未读数仍按 `messages.receiver_id + read_at is null + is_hidden=false` 计算。  
- 通知未读按 `notifications.is_read=false`。

风险：
- Pack05 新增 `get_my_unread_message_count` 是“最小可用会话级”方案，前端尚未接入（不阻塞本轮迁移）。

---

## RLS 边界是否符合预期

基于 Pack05 + patch 设计（SQL 层）：

1. direct 会话唯一性  
- 规则：direct 会话统一为 `participant_a < participant_b`，并对 `(type, participant_a, participant_b)` 建唯一约束。  
- 结果：避免 `(A,B)` 与 `(B,A)` 重复会话。

2. messages 权限边界  
- 非会话成员不可读；  
- 插入必须 `auth.uid() = sender_id`；  
- 指定 `conversation_id` 时，必须属于该会话；  
- direct 会话下 sender/receiver 与会话参与者必须匹配。

3. notifications 权限边界  
- 用户只能读/改/删自己的通知；  
- 普通用户不再允许 insert 通知；  
- 系统/业务通知写入走 service role / server-side。

4. unread 函数职责  
- `get_my_unread_message_count`：仅基于 `last_read_at + active` 统计；  
- `get_my_unread_notification_count`：仅基于 `is_read=false`；  
- 无复杂回执、撤回、送达系统。

---

## P0 / P1 / P2 问题清单

### P0（阻塞 Pack05 最终联调通过）
1. 远端数据库连接被断路器拦截（`FATAL: Circuit breaker open`），导致无法完成 Pack05 `db push` 最终执行确认。
2. 当前环境缺少 `SUPABASE_DB_PASSWORD`（CLI 明确提示），无法稳定恢复 remote 管理命令。

### P1（建议先修）
1. 前端消息未读逻辑仍偏旧模型（`read_at`），后续建议平滑迁移到 `conversation_members.last_read_at`。
2. `test:smoke` 依赖非 VITE 变量，建议补统一环境变量桥接脚本。

### P2（可后续修）
1. 增补一份 Pack05 兼容说明文档（旧字段与新会话模型的并行期边界）。

---

## 是否建议进入 Pack06

**当前不建议进入 Pack06。**

原因：
- Pack05 还未完成远端成功应用确认（P0 连接阻塞）。  

进入 Pack06 前最小前提：
1. 恢复 `npx supabase migration list` 与 `npx supabase db push` 的稳定连接（补 `SUPABASE_DB_PASSWORD` 并待断路器恢复）。  
2. 完成 Pack05 主迁移 + patch 的远端应用。  
3. 复跑 `test:contracts` / `test:smoke` 并记录通过结果。  

