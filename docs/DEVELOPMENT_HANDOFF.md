# 复合肥配方推荐工具：开发交接说明

更新时间：2026-08-20

## 1. 仓库现状

- 项目目录：`C:\Users\Administrator\Documents\peifang`
- 当前分支：`main`
- 当前 HEAD：`9a9d677 优化算法`
- 远程仓库：`https://github.com/qinwuji95-prog/fenmite_peifang.git`
- 当前仓库无未提交业务代码变更。
- 项目没有构建工具或 `package.json`，是可直接运行的静态页面。

## 2. 文件职责

- `index.html`：页面结构、选项卡、目标参数、必选原料、推荐结果容器、原料维护弹窗、loading 和 toast。
- `styles.css`：桌面端和移动端布局、卡片、折叠区域、弹窗、loading 遮罩。
- `app.js`：初始原料数据、状态管理、localStorage、页面渲染、原料维护、推荐算法和事件绑定。
- `README.md`：旧版数据结构和算法说明，部分规则已经落后于最新产品需求。
- `docs/PRODUCT_REQUIREMENTS.md`：产品需求基线，以此文档和用户最新要求为准。

## 3. 当前运行方式

可以直接打开 `index.html`，也可以在项目目录运行静态服务器：

```powershell
python -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/`。项目当前没有自动化测试，验证主要依赖浏览器操作和 Node 运行算法函数的临时脚本。

## 4. 当前状态管理

当前数据仍保存在浏览器本地：

```text
compound-fertilizer-tool-v2
```

`buildInitialState()` 根据两套工艺的内置种子数据创建初始状态；`loadState()` 从 localStorage 读取；`saveState()` 写回浏览器。

这意味着：

- 同一浏览器可以保留用户修改。
- 不同浏览器、不同设备之间不共享数据。
- 清理站点数据会丢失本地修改。
- 当前数据没有用户身份、权限或审计记录。

## 5. 当前算法入口与关键函数

推荐入口是 `generateRecommendations(process, settings)`，主要流程如下：

1. 解析 N-P-K 配合式。
2. 读取原料数量上限、必选原料、目标养分和更多指标。
3. 根据目标养分构造允许区间。
4. 枚举原料组合和目标网格；1-3 种原料使用 1% 粒度整数配比搜索，4-6 种原料调用带预算的线性约束求解函数。
5. 将求解结果按整数配比重新计算实际指标。
6. 依次执行养分、更多指标、氯离子和水溶磷校验。
7. 候选池按实际成本排序，最终取 3 个结果。

相关函数：

- `generateRecommendations`
- `solveForMaterials`
- `solveForMaterialsWithWaterTarget`
- `calculateFormula`
- `targetsMatch`
- `passesConstraints`
- `passesStandardSettings`
- `passesWaterSolubleTarget`
- `compareCandidates`
- `addCandidateToPool`

## 6. 已实现但需要保持的交互

- 工艺下拉框仅改变待计算参数，不触发计算、不清空目标、不替换推荐结果。
- 只有点击“生成推荐”才调用算法。
- 计算期间有 `loadingOverlay` 遮罩。
- 必选原料超过上限时使用固定 toast 文案并提前返回。
- 推荐结果卡片支持展开明细，原料支持点击查看和编辑。
- 原料维护按类别选项卡展示，必填项和高级指标折叠已经加入。

## 7. 当前已知缺口

### 7.1 氯离子范围尚未更新

当前 `CHLORIDE_GRADES` 仍是旧规则：

- 硫基小于 3%。
- 低氯不高于 15%。
- 中氯不高于 30%。
- 高氯大于 30%。

下一步必须改为：低氯 `13%-14.5%`，中氯 `27%-29%`，并把页面下拉选项文本同步修改。建议使用 `minInclusive` / `maxInclusive` 或等价字段，避免沿用当前 `min` 的开区间判断造成边界错误。

### 7.2 搜索不是全局最优保证

当前为了避免页面卡死，优先下调养分时对目标网格和搜索次数设置了上限，并将低价原料组合提前搜索。这能改善速度和结果质量，但不能证明覆盖了全部组合。

用户已经反馈过页面卡死，因此不能简单把浏览器穷举范围无限放大。若需要更强的全局最优能力，应将计算迁移到后端 worker，并让前端异步等待任务结果。

### 7.3 水溶磷仍需专项验证

当前转鼓和挤压工艺都读取水溶磷目标。水溶磷应作为配方求解约束参与计算，而不是生成后对有限结果做简单筛选。挤压默认原料的水溶磷基础数据需要按实际检测值维护，不能用 0 代替未知值。

必须回归验证：水溶磷目标 30、55、60、80、90，以及 20-8-10 + 必选氯化铵的场景。

## 8. 后端化建议

建议采用以下边界：

```text
微信内置浏览器 / 普通浏览器
        |
        v
静态前端（Netlify）
        |
        v
HTTPS API（阿里云）
        |
        +--> MySQL/PostgreSQL
        |
        +--> 配方计算 worker
```

数据库不能直接暴露给前端。API 负责身份认证、权限校验、参数校验和数据读写；worker 负责耗时的配方搜索。

### 8.1 推荐的最小数据表

```text
users
  id, wechat_openid, unionid, created_at, updated_at

materials
  id, user_id, process, name, category, price, enabled, max_kg,
  loss_factor, properties_json, created_at, updated_at

user_settings
  id, user_id, process, formula_n, formula_p, formula_k,
  max_material_count, chloride_grade, water_soluble_p_min,
  nutrient_priority_json, constraints_json, updated_at

recommendation_jobs
  id, user_id, process, input_snapshot_json, status,
  error_message, created_at, started_at, finished_at

recommendation_results
  id, job_id, rank, actual_cost, formula_json, metrics_json,
  created_at
```

`recommendation_jobs.input_snapshot_json` 用于保存计算时的完整输入快照，避免原料后来被修改后无法复核历史结果。

### 8.2 推荐 API

```text
GET  /api/session
GET  /api/materials?process=...
PUT  /api/materials/:id
POST /api/materials
GET  /api/settings?process=...
PUT  /api/settings
POST /api/recommendation-jobs
GET  /api/recommendation-jobs/:id
```

`POST /api/recommendation-jobs` 建议立即返回 job id；前端轮询或使用 SSE 获取状态，避免请求超时。所有接口从服务端会话中取得用户身份，不能信任前端提交的用户 ID。

### 8.3 微信身份

微信网页授权完成后，后端保存当前应用范围内的 `openid`，并建立自己的 `users.id`。业务表只关联内部 `users.id`，不要把微信字段散落到每张业务表。

### 8.4 初始部署规模

低并发初期可以使用 Linux、2 vCPU、4GB 内存的云主机运行 API 和计算 worker；数据库优先选择托管 MySQL。先用真实任务压测，再决定是否拆分 worker 或扩容，不需要一开始购买高配置服务器。

## 9. 推荐迁移顺序

1. 固化当前产品规则和数据库字段，不先大改算法。
2. 建立后端项目、健康检查、数据库迁移和用户表。
3. 接入微信网页授权，验证 `openid` 登录闭环。
4. 实现原料 API，将前端 localStorage 读写替换为 API。
5. 实现设置保存和按用户隔离。
6. 将 `generateRecommendations` 及其依赖迁移为后端可测试模块。
7. 增加异步推荐任务和结果持久化。
8. 前端改为提交 job、显示 loading、读取结果。
9. 再实现低氯/中氯新范围、全局搜索优化和历史结果复核。

## 10. 新会话启动提示

新会话开始时先读取：

1. `docs/PRODUCT_REQUIREMENTS.md`
2. `docs/DEVELOPMENT_HANDOFF.md`
3. `app.js` 中的 `generateRecommendations` 及相关函数

然后先回答当前工作属于哪一阶段：数据库/API 设计、身份认证、前端数据迁移、算法后端化，还是氯离子算法修复。不要默认继续使用 localStorage，也不要在没有验证成本和约束结果的情况下扩大浏览器端穷举范围。
