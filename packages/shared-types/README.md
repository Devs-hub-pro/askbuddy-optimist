# shared-types

多端共享类型层（iOS/Android/微信小程序/Web 共用）。

## 当前范围（Freeze 基线）

- 搜索对象类型：`question|expert|skill|post`
- 通用分页响应
- 核心状态机枚举（Question/Answer/SkillOffer/Order/Post）
- 支付状态与通知读取状态最小类型

## 规则

1. 先改 `docs/multi-end-api-contract-v1.md` 与 `docs/multi-end-state-machine-v1.md`，再改类型。
2. Freeze 阶段不新增业务域类型。
