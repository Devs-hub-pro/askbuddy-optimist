# 当前仓库结构说明（A 主线）

日期：2026-04-24  
状态：Phase 1 Freeze，暂停多端功能扩展，先做层级收口

## 当前可运行主路径
- iOS：`src + ios`
- Android：`android`
- 微信小程序：`apps/wechat-miniprogram`
- 后端：`supabase`
- 共享层：`packages/shared-types`、`packages/shared-api`

## 当前风险点
- 三端目录未同层级，存在认知成本：
  - iOS/Android 在根目录
  - 小程序在 `apps/` 下

## 当前执行策略（不打断可运行链路）
1. 先不搬迁 `ios`、`android` 可运行工程。
2. 先通过文档和占位目录统一“未来目标结构”。
3. 再在单独迁移窗口逐端迁移，且每步可回滚。

## 目标结构（下一阶段）
```text
apps/
  ios/
  android/
  miniapp-wechat/
packages/
  shared-types/
  shared-api/
supabase/
```

> 说明：当前只做“路径规范与占位”，不做大规模目录搬迁。
