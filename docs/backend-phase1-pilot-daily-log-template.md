# Phase 1 Pilot 每日执行记录模板

> 适用阶段：Phase 1 Freeze 后的小范围试运行  
> 原则：不新增功能、不新开 Pack，仅验证稳定性与收敛风险

---

## 基础信息

- 日期：
- 环境：`staging` / `pilot-prod`
- 执行人：
- 版本基线（commit/tag）：
- 今日目标（1~3 条）：

---

## A. 必跑命令结果

1. `npx supabase migration list`
- 结果：✅ / ❌
- 摘要：

2. `npx supabase db push`
- 结果：✅ / ❌
- 摘要：

3. `npm run test:contracts`
- 结果：✅ / ❌
- 摘要：

4. `npm run test:smoke`
- 结果：✅ / ❌
- 摘要：

---

## B. 主链路抽检（建议每日全量或轮转）

### 1) 用户与资料
- 结果：✅ / ⚠️ / ❌
- 备注：

### 2) 提问 / 回答 / 采纳
- 结果：✅ / ⚠️ / ❌
- 备注：

### 3) 专家 / 技能
- 结果：✅ / ⚠️ / ❌
- 备注：

### 4) 搜索 / 发现 / 关注
- 结果：✅ / ⚠️ / ❌
- 备注：

### 5) 消息 / 通知
- 结果：✅ / ⚠️ / ❌
- 备注：

### 6) 订单 / 积分 / 收益
- 结果：✅ / ⚠️ / ❌
- 备注：

### 7) 举报 / 审核 / 推荐位
- 结果：✅ / ⚠️ / ❌
- 备注：

---

## C. service-role / 关键 RPC 抽检

- `accept_answer_v2`：✅ / ❌（权限、幂等、不可替换）
- `create_system_notification_v2`：✅ / ❌（仅 service-side）
- `transition_order_status_v2`：✅ / ❌（白名单流转、幂等）

补充说明：

---

## D. legacy fallback 观察

- `user_followers` 兼容层命中：高 / 中 / 低 / 未观测
- posts/comments 旧字段 fallback 命中：高 / 中 / 低 / 未观测
- `can_read_post` legacy fallback 异常：有 / 无
- 结论：稳定 / 需观察 / 建议回滚评估

---

## E. 问题记录（仅两类）

## Blocker（阻塞）
- [ ] 无
- [ ] 有（请列出）

Blocker 列表：
1. 描述：
   - 模块：
   - 复现：
   - 影响：
   - 处理建议（仅最小 bugfix/patch）：

## Non-blocker（进入 Phase 1.1 cleanup）
- [ ] 无
- [ ] 有（请列出）

Non-blocker 列表：
1. 描述：
   - 模块：
   - 影响：
   - 是否纳入 Phase 1.1：是 / 否

---

## F. 当日结论

- 是否维持 Freeze：是 / 否
- 是否可继续试运行：是 / 否
- 是否需紧急 patch：是 / 否
- 明日优先事项（最多 3 条）：

