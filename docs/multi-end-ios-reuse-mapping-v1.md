# C/D 端复用映射（基于 B-iOS 基线）

日期：2026-04-22  
版本：v1

## 1. 页面复用映射（核心）

| 页面 | 复用组件/壳层 | 关键状态组件 | 关键数据 Hook/RPC | A 主线约束 |
|---|---|---|---|---|
| 首页 `/` | `AppScreen` `BottomNav` `SearchBar` | `PageStateCard` | `useQuestions` `useHotTopics` `useExperts` | 不改 tab 信息架构；字段与排序口径按 A |
| 搜索 `/search` | `AppScreen` `SearchBar` | `PageStateCard` | `useSearch` + `search_app_content_v2`/`get_search_suggestions_v2` | 优先 v2 RPC，legacy 仅兜底 |
| 提问 `/new` | `AppScreen` `SubPageHeader` | `AlertDialog` | `useCreateQuestion` + `create_question_secure` | 仅沿用既有发布字段，不新增后端能力 |
| 发现 `/discover` | `AppScreen` `BottomNav` `DiscoverFeed` | `PageStateCard` | `usePosts` `useFollowingPosts` `useLocalPosts` | 推荐/关注/同城三 tab 结构保持 |
| 消息 `/messages` | `AppScreen` `BottomNav` | `PageStateCard` | `useConversations` `useNotifications` + `get_user_conversations` | 会话/通知权限边界与 A 一致 |
| 我的 `/profile` | `AppScreen` `BottomNav` `SettingsMenu` | `PageStateCard` | `useProfileStats` `usePointAccountBalance` | profile 子路由结构不改 |
| 问题详情 `/question/:id` | `AppScreen` `SectionCard` `Header` `BottomBar` | `PageStateCard` | `useQuestionDetail` `useCreateAnswer` | 回答/收藏/举报口径按 A |
| 专家详情 `/expert/:id` | `AppScreen` `SubPageHeader` | `PageStateCard` | `useExpertDetail` `useCreateConsultationOrder` | 咨询方式与下单入口保持 |
| 技能发布 `/skill-publish` | `AppScreen` `SubPageHeader` `Form` | `PageStateCard` `AlertDialog` | `useSaveExpertProfile` | 仅编辑专家资料，不新增 pack |

## 2. 共享 token/组件映射

| 资产 | B 实现 | C/D 复刻要求 |
|---|---|---|
| 页面壳层 | `src/components/layout/AppScreen.tsx` | 统一根容器能力：最小高度、底部导航留白、安全区兼容 |
| 卡片壳层 | `src/components/common/SectionCard.tsx` | 统一主卡片语义，避免页面各自定义边框/圆角 |
| 频道主题 token | `src/design/channelThemePresets.ts` | 保持教育/职业/生活/兴趣四频道主题映射，不重命名语义 |
| 页面状态组件 | `src/components/common/PageStateCard.tsx` | 统一 loading/empty/error，不自造状态样式体系 |
| 回退导航策略 | `src/utils/navigation.ts` | 保持 route fallback 规则一致 |

## 3. 字段 / 状态 / RPC 对齐（A 主线）

- 字段来源：以 `docs/multi-end-client-consumption-matrix-v1.md` 为准。
- RPC 常量：以 `packages/shared-api/endpoints.ts` 为准。
- 状态类型：以 `packages/shared-types/index.ts` 为准。
- 禁止项：
  - C/D 新增同义 RPC 名称。
  - C/D 定义与 A 冲突的状态枚举。
  - C/D 自行扩展核心流程字段后反向要求后端兼容。

## 4. 复刻顺序建议（C/D）

1. 先接 `AppScreen` + `PageStateCard` + 导航回退规则。  
2. 再复刻 9 个核心页面主流程。  
3. 最后做频道主题与高复用卡片视觉对齐。  

