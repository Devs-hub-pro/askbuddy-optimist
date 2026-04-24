# 多端目录层级定版执行清单（先整理结构，再恢复开发）

日期：2026-04-24  
状态：执行前方案（暂停 Android / 小程序功能开发）

## 1. 本次目标

在不新增功能、不改后端契约的前提下，完成目录层级统一，避免 iOS / Android / 小程序后续协作混乱。

本次只做：
- 路径定版
- 目录迁移计划
- 执行顺序与回滚点
- 恢复开发门槛

本次不做：
- 新功能开发
- 新后端 Pack
- 大规模前端重构

---

## 2. 目标结构（定版）

```text
askbuddy-optimist/
  apps/
    ios/                # iOS 前端主路径（承接当前 src）
    android/            # Android 前端/工程主路径（承接当前 android）
    miniapp-wechat/     # 小程序主路径（保留）
  packages/
    shared-types/
    shared-api/
  supabase/
  docs/
```

说明：
- 最终三端同层级，降低认知成本。
- `packages/shared-*` 与 `supabase/` 保持不变。

---

## 3. 当前基线（执行前事实）

- iOS 当前可运行主线：`src + ios`
- Android 当前可运行主线：`android`
- 小程序当前主线：`apps/miniapp-wechat`
- 占位目录：`apps/ios-app`、`apps/android-app`

风险：
- iOS/Android 存在“双路径感知”，新人容易改错目录。

---

## 4. 迁移策略（两阶段，低风险）

## 阶段 A：冻结与标注（今天可做）
目标：先停止混乱，不立即搬运大目录。

操作：
1. 冻结 B/C/D 功能开发（只允许结构 PR）。
2. 文档声明“唯一主路径”（当前阶段）：
   - iOS：`src + ios`
   - Android：`android`
   - Miniapp：`apps/miniapp-wechat`
3. 占位目录明确标注：
   - `apps/ios-app`：占位，禁止开发
   - `apps/android-app`：占位，禁止开发

通过标准：
- 团队对当前“暂行主路径”无歧义。

回滚：
- 无需回滚（仅文档层变更）。

---

## 阶段 B：一次性目录归一（建议单独窗口执行）
目标：把三端统一到 `apps/*` 下。

建议顺序：
1. Android 先归一（风险最低）  
   - `android` -> `apps/android`
2. iOS 前端后归一（中风险）  
   - `src` 迁移方案先定（可先映射，不必一步搬完）
3. iOS 原生工程路径再评估  
   - `ios` 是否迁到 `apps/ios-native`（可延后）

关键原则：
- 一次只迁一个端。
- 每步都要“可构建 + 可运行 + 可回滚”。

---

## 5. 执行前检查清单（必须全绿）

1. 当前分支干净或已提交 checkpoint。  
2. 已创建迁移专用分支（建议：`chore/normalize-multi-end-layout`）。  
3. iOS/Android 当前构建命令可通过。  
4. CI/本地冒烟命令可通过。  
5. 已约定冻结窗口，不并行开发功能分支。

---

## 6. 每步执行模板（建议）

每个迁移动作都按以下模板记录：

```md
### Step X: <动作名>
- 变更范围：
- 变更命令：
- 受影响文件：
- 验证命令：
- 结果：
- 回滚命令：
```

---

## 7. 验证命令建议

```bash
# 前端基础
npm run build
npm run test:contracts
npm run test:smoke

# iOS（按现有工程）
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -sdk iphonesimulator build

# Android（按现有工程）
cd android && ./gradlew assembleDebug
```

> 注：目录归一后命令中的路径要同步调整。

---

## 8. 回滚策略

1. 每完成一个端的迁移就单独 commit。  
2. 不跨端混在同一个 commit。  
3. 若构建失败，优先 `git revert <commit>` 回滚该端迁移。  
4. 严禁在失败状态下继续叠加下一端迁移。

---

## 9. 恢复开发门槛（何时解冻 B/C/D）

满足以下条件再恢复多端功能开发：

1. 目录结构定版 PR 已合并。  
2. iOS/Android/小程序“唯一主路径”文档已更新。  
3. 至少完成一轮主链路冒烟：登录、首页、搜索、提问、消息、我的。  
4. A 主线确认 shared-types/shared-api 引用路径无断裂。

---

## 10. 责任划分建议

- A（后端与共享契约）：裁决路径、更新规则文档、合并结构 PR。  
- B（iOS）：验证 iOS 构建与路径迁移影响。  
- C（Android）：验证 Android 构建与路径迁移影响。  
- D（小程序）：验证小程序路由与资源路径无破坏。  

---

## 11. 本轮建议结论

先执行“阶段 A（冻结与标注）”，再安排“阶段 B（一次性目录归一）”。  
不要边开发功能边搬目录，这是最容易引发混乱的做法。
