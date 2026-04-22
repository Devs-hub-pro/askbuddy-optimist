# 一期总验证清单（Pack 01 ~ Pack 08-B）

> 目标：确认当前版本是否接近“一期收官”。

## A. 用户与资料（Pack 01）
- [ ] 新注册用户自动建档：`profiles / user_settings / point_accounts`。
- [ ] 历史用户 backfill 后，三表无缺口。
- [ ] `profiles` 公开信息可读，私有设置仅 owner 可读写。
- [ ] `user_verifications`：用户可提交/读本人，审核写入仅 service/server-side。

## B. 提问 / 回答 / 采纳（Pack 02 + 08-A）
- [ ] 发问写入 `questions` 成功，草稿写入 `question_drafts` 成功。
- [ ] 回答写入 `answers` 成功，问题详情可读问题+回答。
- [ ] 公开口径正确：草稿/隐藏/拒绝不被普通读路径返回。
- [ ] `accept_answer_v2`：
  - [ ] 仅问题作者可调用；
  - [ ] 回答必须属于该问题；
  - [ ] 幂等返回；
  - [ ] 不允许替换已采纳其他回答；
  - [ ] 前端直写系统字段仍被 guard 拦截。

## C. 专家 / 技能（Pack 03）
- [ ] `experts` 一人一档约束生效。
- [ ] 专家详情可 join `profiles + experts`。
- [ ] `skill_offers`：本人可读写全状态，非本人仅见 `published`。
- [ ] `skill_categories`：前台可读，写入仅 service/admin 路径。

## D. 搜索 / 发现 / 关注（Pack 04 + 08-B）
- [ ] 搜索对象命名统一：`question / expert / skill / post`。
- [ ] `search_app_content_v2` / `get_search_suggestions_v2` 可用。
- [ ] 登录用户搜索提交可 upsert 到 `search_history`。
- [ ] 热门词默认优先 `hot_keywords`，失败再前端 fallback。
- [ ] 关注主路径已切到 `follows`（不再依赖 `user_followers` 作为主路径）。
- [ ] Discover/Following 正常；posts 字段读取新字段优先、旧字段 fallback 仍可用。
- [ ] `can_read_post` 可见性口径正确（public/followers/private/hidden/deleted）。

## E. 消息 / 通知（Pack 05 + 08-A）
- [ ] direct 会话唯一性成立（无 A/B 与 B/A 双会话）。
- [ ] 会话成员才能读写消息，非成员不可访问。
- [ ] `create_system_notification_v2` 仅 service role 可调用。
- [ ] 通知 owner-only 读取与已读更新正常。
- [ ] 未读数函数为“最小可用”，未引入复杂回执系统。

## F. 订单 / 积分 / 收益（Pack 06 + 08-A）
- [ ] `orders` 双边模型（buyer/seller）读边界正确。
- [ ] `transition_order_status_v2`：
  - [ ] 仅 service role；
  - [ ] 白名单流转；
  - [ ] 非法流转拒绝；
  - [ ] 同状态幂等。
- [ ] 账务主路径已收口：
  - [ ] `point_accounts`
  - [ ] `point_transactions`
  - [ ] `earning_transactions`
- [ ] `profiles.points_balance` 已明确 deprecated 且非真值主路径。

## G. 举报 / 审核 / 推荐位（Pack 07）
- [ ] `content_reports`：普通用户仅可提交并读取本人记录。
- [ ] `moderation_queue` / `audit_logs` 不向普通用户公开。
- [ ] `system_configs` 仅 `is_public=true` 可前台读取。
- [ ] `recommendation_slots` 仅 active 且时间窗口有效记录可前台读取。
- [ ] `target_type / item_type` 命名与前 Packs 一致。

## H. 收官判定
- [ ] 无 P0（安全/权限/主链路阻塞）。
- [ ] P1 均有明确修复计划和优先级。
- [ ] smoke/contracts 通过。
- [ ] 可进入一期收官冻结（仅 bugfix / 文档 / 运维脚本）。
