# Phase 1 Pilot Day 1 执行清单

日期：____-__-__  
执行人：____  
环境：`staging`

## 1. 先跑固定命令

```bash
cd /Users/shawnshi1997/askbuddy-optimist
npx supabase migration list
npx supabase db push
npm run test:contracts
npm run test:smoke
```

记录：
- migration list：✅ / ❌
- db push：✅ / ❌
- test:contracts：✅ / ❌
- test:smoke：✅ / ❌

---

## 2. Day 1 主链路全量抽检（建议全跑）

- [ ] 用户与资料
- [ ] 提问 / 回答 / 采纳
- [ ] 专家 / 技能
- [ ] 搜索 / 发现 / 关注
- [ ] 消息 / 通知
- [ ] 订单 / 积分 / 收益
- [ ] 举报 / 审核 / 推荐位

每项至少记录：
- 是否通过
- 是否出现权限异常
- 是否出现数据口径不一致

---

## 3. 关键 RPC 边界抽检

- [ ] `accept_answer_v2`
- [ ] `create_system_notification_v2`
- [ ] `transition_order_status_v2`

重点记录：
- 普通用户是否被正确拦截
- service-side 是否可正常执行
- 是否有意外副作用（通知/账务/状态异常）

---

## 4. 兼容层观察（不删除，只观察）

- [ ] follows 主路径是否稳定
- [ ] legacy `user_followers` 是否仅兼容层命中
- [ ] posts/comments 旧字段 fallback 是否异常增多
- [ ] `can_read_post` 可见性是否稳定

---

## 5. 问题分流（只两类）

## Blocker
- 必须当天修复或给出最小 patch 计划

## Non-blocker
- 进入 `Phase 1.1 cleanup`，不阻塞试运行

---

## 6. Day 1 收口结论

- Freeze 是否继续维持：是 / 否
- 是否可以进入 Day 2：是 / 否
- 是否需紧急变更窗口：是 / 否
- 明日重点风险点：

