# 当前仓库结构说明（A 主线）

日期：2026-04-24  
状态：Phase 1 Freeze，目录层级已完成同层级收口

## 当前可运行主路径
- iOS：`src + apps/ios`
- Android：`apps/android`
- 微信小程序：`apps/wechat-miniprogram`
- 后端：`supabase`
- 共享层：`packages/shared-types`、`packages/shared-api`

## 当前目录结构
- 三端已同层级放置在 `apps/` 下：
- iOS：`apps/ios`
- Android：`apps/android`
- 微信小程序：`apps/wechat-miniprogram`

## 当前执行策略
1. 多端开发统一在 `apps/*` 目录下进行。
2. 后端与跨端契约冲突以 A 主线为准。
3. Freeze 阶段仅接受 bugfix / 小 patch / cleanup。

## 目标结构（下一阶段）
```text
apps/
  ios/
  android/
  wechat-miniprogram/
packages/
  shared-types/
  shared-api/
supabase/
```
