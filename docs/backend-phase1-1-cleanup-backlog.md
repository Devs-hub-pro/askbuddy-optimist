# 后端一期（1.1）小收尾 Backlog

> 范围约束：仅小步 cleanup，不开新 Pack，不做大规模重构，不阻塞上线。

## 1. types / `as any` 渐进清理

### 建议做（优先）
- [ ] 重新生成并收口 Supabase types（先覆盖高频模块：Profile/MyEarnings/Discover/Search）。
- [ ] 将账务主路径相关查询去 `as any`（orders/point_accounts/point_transactions/earning_transactions）。
- [ ] 将 follows 主路径相关查询去 `as any`（follows/feed/profile stats）。

### 延后做（次优先）
- [ ] 全站 `as any` 清理（仅在上线后稳定窗口逐页推进）。

## 2. legacy fallback 退役观察项

### 先观察再动
- [ ] 观察 `user_followers` 实际命中（确认主路径已稳定在 `follows`）。
- [ ] 观察 posts/comments 旧字段 fallback 命中。
- [ ] 观察 `can_read_post` legacy follows fallback 命中。

### 满足条件后再退役
- [ ] 命中持续低且无回归后，分批移除 legacy fallback 分支。
- [ ] 最后阶段再评估是否下线 `user_followers` 兼容路径。

## 3. 低频旧 trigger / policy / 命名统一

### 可做的小任务
- [ ] 给 legacy 字段/表补充统一 `deprecated` 注释（便于维护与审计）。
- [ ] 清理已失效或重复的低频 policy 名称（不改变权限语义）。
- [ ] 统一 `target_type/item_type`、`biz_ref_type` 的文档字典和常量映射。

### 暂不建议现在做
- [ ] 直接删除历史兼容 trigger/policy（风险偏高，需观察窗口后执行）。

## 4. 不阻塞上线的小优化

- [ ] `test:smoke` 统一环境变量读取方式（减少人工注入步骤）。
- [ ] 增加 2~3 个轻量回归脚本（采纳、通知写入、订单状态流转）。
- [ ] 补一份“生产故障最小处置手册”（RLS误配、迁移失败、RPC权限失败）。

## 5. 任务执行建议

1. 先做 types/查询层高频收口（低风险、高收益）。  
2. 再做 legacy 命中观察与注释化治理。  
3. 最后做低频命名统一与脚本增强。  

完成标准：
- 不影响当前一期主链路；
- 每个任务均可独立回滚；
- 不引入新的业务模型变化。
