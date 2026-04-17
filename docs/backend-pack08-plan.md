# Pack 08 实现计划（搜索增强 / cleanup / 服务端动作收口）

日期：2026-04-18  
范围：Pack 08（收口与增强，不新增大业务域）  
前提：Pack 01 ~ Pack 07 已落地并完成当前阶段联调

---

## 1. Pack 08 实现计划摘要

Pack 08 目标不是“再开一个新业务域”，而是把一期后端的主路径做稳：

1. 搜索能力做轻量增强（不引入 ES / 向量 / 个性化引擎）
2. 对前几包遗留的兼容逻辑做有节奏清债
3. 把少量高风险“前端直改动作”收口到服务端函数/RPC

本轮将输出并建议执行：
- 1 个主 migration（搜索增强 + 基础清债）
- 2~3 个小 patch migration（按风险拆开，可单独回滚）
- 2~4 个最小 RPC/function（只收口关键动作，不做复杂流程引擎）

---

## 2. 当前技术债盘点（Pack 01~07）

## 2.1 P0（影响一致性/安全性/后续联调）

1. 余额/账务旧逻辑仍存在于历史函数  
- 典型：旧函数仍依赖 `profiles.points_balance`、`points_transactions`。  
- 风险：与 Pack 06 的 `point_accounts + point_transactions + earning_transactions` 双层账务不一致。

2. 订单/账务受控字段仍有“旧直接写路径”残留  
- 历史 RPC 里有直接更新订单状态与余额字段的实现。  
- 风险：绕过 Pack 06 受控流转，后续对账困难。

3. 采纳回答结算仍有旧模型实现  
- 历史函数 `accept_answer_and_transfer_points` 使用旧余额/旧流水。  
- 风险：采纳链路继续沿用旧模型会破坏账务一致性。

## 2.2 P1（建议本轮解决）

1. 搜索层对象命名与来源不完全统一  
- `search_history/hot_keywords/search_app_content` 可继续统一 type 命名（question/expert/skill/post/all）。

2. 旧关注表兼容路径未最终收口  
- `follows` 已是新主表，但 `user_followers` 兼容仍被部分逻辑引用。

3. 旧配置表 `app_config` 与新表 `system_configs` 并存  
- 当前两套入口并存，易造成配置来源混乱。

## 2.3 P2（可延后）

1. 全库 `supabase types` 全量再生成与前端全面去 `as any`  
2. 历史低频脚本/旧 trigger 的完全退役（需观测一版）  
3. 搜索结果排序策略进一步参数化（运营策略层）

---

## 3. 本次 Pack 08 产出范围

本次建议包含：

1. migration SQL  
- 是（主 migration + 小 patch）

2. cleanup SQL  
- 是（仅清理“确认不会破坏联调”的项）

3. RPC / database functions  
- 是（2~4 个高价值动作收口）

4. 前端最小对齐建议  
- 是（建议，不做大规模前端重构）

---

## 4. A. 搜索增强建议（最小但有价值）

## 4.1 本轮建议通过 migration/index 完成

1. `search_history` 轻量增强  
- 现状已有 upsert 去重与 `(user_id, query_type, query_text_norm)` 唯一约束。  
- 建议补：`last_used_at` 读取索引确认、TTL清理字段（可选 `expired_at` 延后）。

2. `hot_keywords` 运营读取稳定化  
- 保持“运营配置表”定位。  
- 建议补：`is_active + score desc` 索引巡检（已有则不重复）。

3. 搜索对象基础索引补齐（克制）  
- `questions(status, created_at)` 已有，确认 title/description 检索走轻量 ILIKE 时的前缀索引（可选 trigram，非必须）。  
- `experts(headline/intro)`、`skill_offers(title/description,status)`、`posts(content,status,created_at)` 仅补当前明显缺失的低成本索引。

> 不接入 ES/OpenSearch，不做向量检索，不做复杂召回融合。

## 4.2 本轮建议通过 view/function 完成

1. 新增统一搜索建议函数（最小）  
- `public.get_search_suggestions(p_query text, p_limit int default 10)`  
- 聚合来源：`hot_keywords + search_history(当前用户)`  
- 返回统一字段：`suggestion`, `source`, `score`, `query_type`

2. search 内容统一函数小升级（若沿用 `search_app_content`）  
- 增加规范化 `target_type` 输出（question/expert/skill/post），避免前端再做映射补丁。

## 4.3 仅留给前端查询层处理

1. 输入联想节流/去抖策略  
2. UI 分组展示（热词/历史/建议）  
3. 客户端排序微调（同分时序）

---

## 5. B. 清债清单

## 5.1 可本轮直接清理（低风险）

1. 历史函数中的旧余额注释与入口标记为 deprecated  
- 不立即删函数体，但统一加 COMMENT 标记“已废弃，不再主路径调用”。

2. `app_config -> system_configs` 读路径收口  
- 新增只读兼容视图（可选）：`public.v_public_app_config` 映射 `system_configs.is_public=true`。  
- 旧读函数 `get_app_configs` 改为内部读 `system_configs`（兼容旧调用方）。

3. target/type 命名字典统一  
- 把搜索/审核/推荐里散落的 `discussion/profile/user_verification` 统一到  
  `post/expert/user_verifications`（保留兼容映射，不强删历史数据）。

## 5.2 需要先观察一个版本再清理

1. `user_followers` 最终退役  
- Pack 04 仍有兼容读取，不建议本轮直接 drop。

2. 旧 `points_transactions` 表最终退役  
- 现有少量历史函数仍可能引用；建议先把主写路径完全迁移后再删。

3. 旧 `orders.user_id` 兼容字段清理  
- 前端/历史 RPC 仍可能有读取，建议观测后再 drop。

## 5.3 不建议本轮清理

1. 大规模删除历史 migration 中所有兼容函数  
- 风险高，回滚复杂，且可能影响未知调用方。  

2. 全量重命名旧表/旧字段  
- 会导致联调面积扩张，不符合 Pack 08“收口而非重构”目标。

---

## 6. C. 建议本轮优先收口的服务端动作（2~4 个）

## 6.1 建议实现

1. 采纳回答（收口动作 1）  
- 新函数：`public.accept_answer_v2(p_question_id uuid, p_answer_id uuid)`  
- 约束：
  - 仅提问者可调用
  - 校验 answer 属于 question
  - 更新 question/answer 状态
  - 账务写入走 `point_transactions + earning_transactions`（最小闭环）
  - 使用 `idempotency_key` 防重

2. 系统通知写入（收口动作 2）  
- 新函数：`public.create_system_notification_v2(...)`
- 仅 `service_role` 可执行（SECURITY DEFINER + is_service_role guard）
- 替代前端直接 insert notifications。

3. 订单状态受控流转（收口动作 3）  
- 新函数：`public.transition_order_status_v2(p_order_id uuid, p_to_status text, p_reason text default null)`  
- 仅 service-side 可调用  
- 严格白名单流转，阻止前端直接改 `paid/completed/refunded`。

4. 推荐位安全写入（收口动作 4）  
- 新函数：`public.upsert_recommendation_slot(...)`  
- 仅 service role，校验时间窗口与 target_type。

## 6.2 建议继续保持现状（本轮不做）

1. 提现打款自动流程  
2. 复杂支付回调编排  
3. 全量风控与审计聚合

---

## 7. 建议本轮 migration / patch / function 文件拆分

建议拆分如下：

1. `supabase/migrations/20260418xxxx_pack_08_search_cleanup_base.sql`  
- 搜索增强最小索引/视图/函数  
- app_config/system_configs 读路径兼容收口  
- 轻量命名规范化映射

2. `supabase/migrations/20260418xxxx_pack_08_cleanup_patch_legacy_paths.sql`  
- 旧函数标记 deprecated  
- 旧 policy/trigger 中明确废弃但可安全替换的项

3. `supabase/migrations/20260418xxxx_pack_08_rpc_accept_answer_v2.sql`  
- 采纳回答与最小账务入账闭环

4. `supabase/migrations/20260418xxxx_pack_08_rpc_ops_actions.sql`  
- `create_system_notification_v2`
- `transition_order_status_v2`
- `upsert_recommendation_slot`

---

## 8. 风险点与回滚考虑

1. 风险：旧函数仍被前端或脚本调用  
- 处理：先“标记 deprecated + 新函数并行”，不立即删除旧函数。  
- 回滚：可快速切回旧 RPC 名称调用。

2. 风险：搜索索引过多导致写放大  
- 处理：只补当前缺失且有实际查询路径的索引。  
- 回滚：独立 patch 中可按索引级撤销。

3. 风险：order/status 收口过猛影响现有流程  
- 处理：采用“新增受控函数 + 保留读路径兼容”，先不硬删旧字段。  
- 回滚：回退函数即可，不影响基础表结构。

---

## 9. 本轮建议执行顺序

1. 先执行 `pack_08_search_cleanup_base.sql`  
2. 再执行 `pack_08_cleanup_patch_legacy_paths.sql`  
3. 再执行 `pack_08_rpc_accept_answer_v2.sql`  
4. 最后执行 `pack_08_rpc_ops_actions.sql`  
5. 跑 `migration list / db push / contracts / smoke`  
6. 产出 Pack 08 验证报告

---

## 10. 明确留到后续

1. 复杂推荐排序与画像策略  
2. 大规模历史表字段 drop（如彻底删 `user_followers`、`points_transactions`）  
3. 完整支付回调验签编排与分账体系  
4. 全站 Supabase types 全量重生成+全面去 any（可作为单独工程任务）

---

## 11. 结论

Pack 08 建议作为“一期收口包”推进，聚焦：
- 搜索稳定性增强
- 兼容技术债可控清理
- 关键高风险动作服务端收口

这能在不扩大系统复杂度的前提下，显著降低后续上线与联调风险。

