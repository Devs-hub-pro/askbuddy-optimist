# Pack 01 后续清理说明（Follow-up Notes）

> 对应迁移：  
> - `supabase/migrations/20260416143000_pack_01_user_and_accounts.sql`  
> - `supabase/migrations/20260416152000_pack_01_patch_clarifications.sql`

## 1. 可能未彻底清理的旧字段

Pack 01 已尝试移除以下旧字段，但采用了“有依赖则跳过并打印 NOTICE”的安全策略：
- `profiles.points_balance`
- `profiles.latitude`
- `profiles.longitude`

这意味着在某些环境中，如果存在依赖对象（函数、视图、触发器）引用上述字段，迁移会保守跳过删除，避免一次迁移中断。

## 2. 可能仍依赖旧字段的对象类型

已知高风险残留对象类型：
- 旧 RPC / SQL 函数（尤其是积分扣增、下单相关函数）
- 旧视图或物化视图
- 旧触发器函数
- 个别历史前端逻辑（若仍读取旧字段）

## 3. 为什么不在 Pack 01 强删

- Pack 01 目标是稳定打底（用户+账户建模），不是一次性重构全部业务 SQL。  
- 强删会导致 dev/staging 环境出现迁移中断，影响联调节奏。  
- 一期策略是先并行兼容，再在后续 pack 统一切换并清债。

## 4. 后续统一清理建议（建议在 Pack 06 一并处理）

建议在“订单与积分账务域（Pack 06）”执行统一清理：
1. 把所有积分逻辑从 `profiles.points_balance` 切换到 `point_accounts + point_transactions`。  
2. 替换旧 RPC / 函数中的 `points_balance` 读写。  
3. 验证无引用后，再执行强删旧字段。  
4. 若未来确有地理排序需求，再新增位置域而不是恢复 `profiles.latitude/longitude`。  

## 5. 当前状态结论

- Pack 01 已可进入 dev/staging 执行。  
- 旧字段残留风险已记录，不会被遗忘。  
- 后续按 Pack 06 统一完成账务切换和强清理即可。

