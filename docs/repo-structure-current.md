# 当前仓库结构说明（低风险整理版）

日期：2026-04-22  
状态：Phase 1 Freeze 后，多端并行开发准备

## 1. 结论（先看这个）

当前仓库里 **iOS 存在“可运行主路径”与“占位目录”并存** 的情况。为避免混淆，统一规则如下：

- iOS 当前可运行主路径：`/src + /ios`
- Android 开发路径：`/apps/android-app`
- 微信小程序开发路径：`/apps/miniapp-wechat`
- `apps/ios-app` 当前仅作为目录占位，**不作为当前开发入口**

## 2. 当前目录职责

- `src/`：当前 Web 前端主源码（也是 Capacitor iOS 的前端来源）
- `ios/`：当前可运行的 iOS 原生工程（Xcode 工程）
- `apps/android-app/`：Android 端代码目录（多端并行主路径）
- `apps/miniapp-wechat/`：微信小程序端代码目录（多端并行主路径）
- `apps/ios-app/`：iOS 目录占位（后续若做 monorepo 迁移再启用）
- `packages/shared-types/`：跨端共享类型
- `packages/shared-api/`：跨端共享 API / RPC 常量
- `supabase/`：后端 schema / migration / functions

## 3. 团队执行规则（防混淆）

1. 当前 iOS 不在 `apps/ios-app` 开发，仍以 `src + ios` 为准。  
2. Android / 小程序只在各自 `apps/*` 目录开发。  
3. 字段、状态机、RPC 命名冲突，一律回 A 主线仲裁。  
4. Freeze 阶段不做目录大迁移，只允许 bugfix / 小 patch / cleanup。  

## 4. 后续建议（非当前动作）

后续可在单独里程碑执行结构统一（例如迁移到 `apps/web` + `apps/ios-native`），但这属于大改，不在当前阶段执行。
