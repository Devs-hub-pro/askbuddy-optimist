# 多端冲突处理流程（A 主线仲裁）

日期：2026-04-22  
适用：B(iOS) / C(Android) / D(微信小程序)

## 1. 适用冲突类型
- 字段命名冲突（同义不同名）
- 状态机冲突（端侧自定义状态）
- RPC 命名冲突（同动作不同函数名）
- 可见性规则冲突（RLS 口径理解不一致）

## 2. 处理原则
1. A 主线为唯一仲裁方。  
2. 冲突未仲裁前，B/C/D 不得各自“先改先用”。  
3. 仲裁后必须同步：
   - `docs/multi-end-contract-snapshot-v1.md`
   - `packages/shared-types`
   - `packages/shared-api`

## 3. 冲突提报模板（给 A）
```md
【冲突提报】
- 来源端：B / C / D
- 页面/链路：
- 冲突类型：字段 / 状态 / RPC / 可见性
- 当前实现：
- 期望实现：
- 影响范围：
- 是否阻塞当前开发：是/否
- 建议优先级：P0/P1/P2
```

## 4. A 主线仲裁输出模板
```md
【A 主线仲裁结论】
- 决策：
- 标准命名/状态/RPC：
- 兼容策略（如需）：
- 生效时间：
- 需要更新文件：
  - docs/...
  - packages/shared-types/...
  - packages/shared-api/...
- B/C/D 落地动作：
  - B:
  - C:
  - D:
```

## 5. 变更控制
- Freeze 阶段只允许：
  - bugfix
  - 小 patch
  - cleanup
- 非必要不变更状态机与核心 RPC 名称。
