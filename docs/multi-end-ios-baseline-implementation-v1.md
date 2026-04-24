# B-iOS 前端主线：基线收口与可复用化执行记录（v1）

日期：2026-04-22  
负责人：B-iOS 前端主线

## Step 1 计划 + 涉及文件
### 计划
- 扫描 iOS 端实际承载页面（Capacitor + Web 前端）与主流程页面。
- 盘点可复用资产：页面骨架、导航、安全区处理、状态组件、业务卡片、数据 Hook/RPC。
- 输出可直接给 Android/小程序复刻的资产清单。

### 涉及文件
- 路由与壳层：`src/App.tsx`、`src/index.css`、`src/App.css`、`src/components/SwipeBackWrapper.tsx`、`src/hooks/useSwipeBack.tsx`
- 导航/骨架组件：`src/components/BottomNav.tsx`、`src/components/layout/SubPageHeader.tsx`、`src/components/channel/ChannelPageScaffold.tsx`
- 状态/卡片组件：`src/components/common/PageStateCard.tsx`、`src/components/QuestionCard.tsx`、`src/components/channel/ChannelExpertCard.tsx`
- 核心页面：`src/pages/Index.tsx`、`src/pages/SearchResults.tsx`、`src/pages/NewQuestion.tsx`、`src/pages/Discover.tsx`、`src/pages/Messages.tsx`、`src/pages/Profile.tsx`、`src/pages/QuestionDetail.tsx`、`src/pages/ExpertDetail.tsx`、`src/pages/SkillPublish.tsx`
- 数据层：`src/hooks/useQuestions.ts`、`src/hooks/useSearch.ts`、`src/hooks/useMessages.ts`、`src/hooks/useExperts.ts`

### 可复用资产清单（输出）
- 页面壳层：`app-container`、`SwipeBackWrapper`、`SubPageHeader`、`BottomNav`。
- 安全区能力：`env(safe-area-inset-top/bottom/left/right)` 与 `native app` 模式宽度策略。
- 状态组件：`PageStateCard`（`loading/empty/error` 统一态）。
- 频道页骨架：`ChannelPageScaffold` + `ChannelQuestionSkeleton` + `ChannelExpertSkeleton`。
- 业务高复用卡片：`QuestionCard`、`ChannelExpertCard`、`DiscoverFeed`。
- 表单基建：`Input/Textarea/Select/Form/AlertDialog/Drawer`（shadcn ui 层）。
- 回退导航规范：`buildFromState`、`navigateBackOr`、`getFallbackPathForRoute`。
- 数据访问规范：React Query + Supabase；RPC 优先、表查询兜底（兼容 A 主线冻结期）。

### 状态
- 已完成：资产扫描与可复用清单。
- 未完成：无。
- 下一步：进入 Step 2，固化 iOS 基线规范。

---

## Step 2 计划 + 涉及文件
### 计划
- 固化“导航 / 安全区 / 卡片 / 表单 / 状态组件”五类基线。
- 明确不可改边界：信息架构稳定、主流程稳定、仅收口不改版。
- 给 C/D 端提供可执行规范（不是视觉稿）。

### 涉及文件
- 样式与 token：`src/index.css`、`tailwind.config.ts`
- 导航：`src/components/BottomNav.tsx`、`src/components/layout/SubPageHeader.tsx`、`src/utils/navigation.ts`
- 状态与表单：`src/components/common/PageStateCard.tsx`、`src/components/ui/*`

### iOS 前端基线规范（输出）
- 导航基线：
  - 一级入口固定 5 tab（首页/发现/发布/消息/我的），路径集合保持不变。
  - 二级页统一 `SubPageHeader`，回退必须走 `navigateBackOr`。
- 安全区基线：
  - 顶部固定栏必须包含 `safe-area-inset-top`。
  - 底部导航和底部操作条必须包含 `safe-area-inset-bottom`。
  - 根容器保留左右安全区 inset 处理。
- 卡片基线：
  - 主卡统一 `surface-card + rounded-3xl`。
  - 内容区与状态区分离，状态文案统一走 `PageStateCard`。
- 表单基线：
  - 输入组件统一 16px 字号，避免 iOS 缩放。
  - 主要提交按钮采用统一圆角胶囊风格，保留主次按钮对位。
- 状态组件基线：
  - 统一 `loading/empty/error` 三态。
  - 错误态必须可重试（如可恢复场景）。

### 状态
- 已完成：iOS 前端基线规范收口。
- 未完成：无。
- 下一步：进入 Step 3，抽离最小共享 token 与高复用组件。

---

## Step 3 计划 + 涉及文件
### 计划
- 新增最小共享层，不改流程：页面壳、卡片壳、频道主题 token。
- 优先抽离重复度最高且跨页面稳定的部分。

### 涉及文件
- 新增：`src/components/layout/AppScreen.tsx`
- 新增：`src/components/common/SectionCard.tsx`
- 新增：`src/design/channelThemePresets.ts`
- 改造：`src/pages/EducationLearning.tsx`、`src/pages/CareerDevelopment.tsx`、`src/pages/LifestyleServices.tsx`、`src/pages/HobbiesSkills.tsx`

### 抽离结果（输出）
- `AppScreen`：统一核心页根容器（`app-container` + `min-h-[100dvh]` + 可选底部导航留白）。
- `SectionCard`：统一高复用内容卡片壳（`surface-card` + `rounded-3xl` + 紧凑/常规内边距）。
- `CHANNEL_THEME_PRESETS`：频道页视觉 token 集中化，避免四个频道页重复散落配置。

### 状态
- 已完成：最小共享 token 与高复用组件抽离。
- 未完成：无。
- 下一步：进入 Step 4，核心页面统一基线接入。

---

## Step 4 计划 + 涉及文件
### 计划
- 对齐核心页面（首页、搜索、提问、发现、消息、我的、问题详情、专家详情、技能发布）。
- 仅做基线接入，不改信息架构与主流程。

### 涉及文件
- `src/pages/Index.tsx`
- `src/pages/SearchResults.tsx`
- `src/pages/NewQuestion.tsx`
- `src/pages/Discover.tsx`
- `src/pages/Messages.tsx`
- `src/pages/Profile.tsx`
- `src/pages/QuestionDetail.tsx`
- `src/pages/ExpertDetail.tsx`
- `src/pages/SkillPublish.tsx`

### 对齐动作（输出）
- 以上 9 个核心页面统一接入 `AppScreen` 作为顶层容器。
- `QuestionDetail` 接入 `SectionCard`，将正文与回答模块卡片统一到共享壳层。
- 保持路由、流程、字段交互与原行为不变（无新后端能力、无新 Pack）。

### 状态
- 已完成：核心页面容器基线对齐。
- 未完成：无。
- 下一步：进入 Step 5，输出 C/D 复用映射文档。

---

## Step 5 计划 + 涉及文件
### 计划
- 形成给 C（Android）/D（小程序）的复用映射表：页面 -> 组件 -> token -> 状态 -> RPC/字段来源。
- 强制标注 A 主线约束（字段/状态/RPC）。

### 涉及文件
- 复用映射：`docs/multi-end-ios-reuse-mapping-v1.md`
- A 主线参考：`docs/multi-end-client-consumption-matrix-v1.md`、`packages/shared-api/endpoints.ts`、`packages/shared-types/index.ts`

### 状态
- 已完成：映射文档已产出。
- 未完成：无。
- 下一步：C/D 按映射进入端侧复刻，B 仅做偏差审阅与回归清单维护。
