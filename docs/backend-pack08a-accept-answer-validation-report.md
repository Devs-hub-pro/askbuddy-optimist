# Pack 08-A 验证报告：accept_answer_v2

日期：2026-04-19（Asia/Shanghai）  
范围：仅 Pack 08-A 第 2 个文件 `accept_answer_v2`，不进入 08-B，不做通知写入/订单流转。

## 1) 执行结果摘要

已执行命令（按要求顺序）：

1. `npx supabase migration list` ✅  
2. `npx supabase db push` ✅  
   - 应用 migration：`20260419001000_pack_08a_rpc_accept_answer_v2.sql`
3. `npm run test:contracts` ✅  
4. `npm run test:smoke` ✅  
   - 说明：在远端网络可达环境下通过（`RPC smoke tests passed`）。

结论：Pack 08-A（accept_answer_v2）migration 已成功应用到 dev/staging（远端）。

---

## 2) 采纳链路最小联调结果

验证脚本：`scripts/pack08a_accept_answer_validate.mjs`  
验证方式：创建临时测试用户与数据，调用 RPC 并断言结果。

### 2.1 权限与归属校验

- 非问题作者调用采纳：✅ 被拒绝  
  - 错误信息：`only question author can accept an answer`
- 回答不属于该问题：✅ 被拒绝  
  - 错误信息：`answer does not belong to question`

### 2.2 幂等与替换策略

- 首次采纳同一问题下合法回答：✅ 成功  
  - 返回：`ok=true, idempotent=false`
- 再次采纳同一回答：✅ 幂等返回  
  - 返回：`ok=true, idempotent=true`
- 该问题已采纳其他回答后尝试替换：✅ 被拒绝  
  - 错误信息：`question already has a different accepted answer`

### 2.3 状态与字段更新

采纳后状态检查：

- `questions.accepted_answer_id`：✅ 已写入目标回答 ID  
- `answers.is_accepted`：✅ `true`  
- `answers.status`：✅ `accepted`  
- `questions.status`：✅ 在 `open/matched` 下推进为 `solved`

---

## 3) Guard 与受控 bypass 验证

- 作者直接更新 `questions.accepted_answer_id`：✅ 被拦截  
- 回答作者直接更新 `answers.is_accepted`：✅ 被拦截  
- 通过 `accept_answer_v2` 内部更新系统字段：✅ 成功

结论：guard bypass 仅在 RPC 事务内受控生效；前端直写系统字段主路径仍被阻断。

---

## 4) 副作用检查（本轮不引入通知/账务）

以 RPC 调用前后窗口（`beforeRpc -> afterRpc`）比对：

- `point_transactions` 增量：✅ 无  
- `earning_transactions` 增量：✅ 无  
- `notifications` 增量：✅ 无（RPC 窗口内无变化）

说明：脚本后续为“替换采纳拒绝”场景新增了另一条回答，会触发现有历史“新回答通知”逻辑；该增量发生在 RPC 窗口之后，不属于 `accept_answer_v2` 副作用。

---

## 5) P0 / P1 / P2 问题清单

### P0（阻塞）

- 无。

### P1（建议后续收口）

- 历史兼容结构仍要求 `questions.user_id` / `answers.user_id` 非空（联调脚本插入时需同时填 `author_id` 与 `user_id`）。  
  - 不影响本轮目标，但建议在后续 cleanup 中统一收口到 `author_id` 主路径。

### P2（可后续优化）

- 将该联调脚本纳入 CI 的可选回归步骤（需受控测试用户方案），避免依赖临时人工跑测。

---

## 6) 是否建议进入 08-A 下一步

建议：✅ 可以进入 08-A 下一步。  
优先级建议：先做“系统通知写入收口（最小 RPC）”，再评估“订单状态流转收口”。

理由：

1. `accept_answer_v2` 主路径已稳定、幂等、权限边界清楚。  
2. 当前未引入账务/通知副作用，便于后续分步骤扩展。  
3. 先收口通知写入，能更快减少前端直写与历史触发器混用风险。

