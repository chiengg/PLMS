# 采购建议（通用能力优先）功能设计

日期：2026-04-30

## 背景与目标

本设计面向跨境电商 ERP 采购子系统中的「采购建议」页面，优先抽象备货建议与缺货建议的通用能力，形成可复用的筛选模型、按供应商分组的高密度表格、批量动作（加入采购计划/忽略）、以及忽略治理能力。

目标：
- 支持备货/缺货两个 Tab 的统一交互骨架
- 列表默认按供应商分组展示，并展示组头关键汇总
- 批量“加入采购计划”按采购员自动拆分
- “忽略建议”支持本次忽略/永久忽略，并提供忽略管理表可恢复/清除
- SKU 行支持行内修改所属采购员，影响加入计划的拆分归属

## 范围

### In Scope
- 备货建议/缺货建议 Tab 统一页面框架
- 筛选区（第一版必选字段）：SKU/名称、仓库、供应商、采购员 + 搜索/重置
- 列表区：按供应商分组可展开表格（组头汇总 + SKU 行）
- 选中与批量操作：加入采购计划、忽略（本次/永久）
- 忽略管理：同页弹窗/抽屉展示忽略表，支持恢复与清除
- 行内可改“所属采购员”

### Out of Scope
- 实际后端接口对接（本项目可继续使用 mock 与本地状态）
- 复杂指标列的完备还原（销量预测、在途等可在后续迭代加列）
- 权限/账号体系与组织架构的真实联动（后续再补）

## 信息架构

页面从上到下：
1. 页面标题 + Tab（备货建议 / 缺货建议）
2. 筛选区：SKU/名称、仓库、供应商、采购员 + 搜索/重置
3. 列表区：按供应商分组可展开表格
4. 操作区：批量加入采购计划、批量忽略
5. 忽略管理：同页弹窗/抽屉入口（不新增路由）

## 列表分组与汇总

默认分组维度：按供应商分组。

供应商组头汇总字段（优先级与顺序）：
1. 组内 SKU 数量
2. 建议采购总数（合计）
3. 建议采购总金额（合计）

组头能力：
- 展开/折叠（默认策略：展开前 N 个供应商组，其余折叠，N 可配置）
- 组头全选框（支持半选）

## 核心流程

### 筛选与浏览
- 用户选择 Tab → 调整筛选条件 → 点击搜索 → 列表按供应商分组刷新
- “重置”清空筛选条件并刷新列表
- 筛选或 Tab 切换后默认清空勾选状态

### 加入采购计划（按采购员组织）
- 勾选 SKU（可跨供应商组）→ 点击“加入采购计划”
- 系统按 SKU 所属采购员自动拆分：每个采购员形成一个计划分组
- 成功后：这些 SKU 从当前列表移除，并清空勾选
- 成功提示：展示“已按 X 个采购员拆分加入计划”

### 忽略建议（本次 / 永久）
触发方式：行级忽略或批量忽略。

选择策略：
- 弹窗二选一：本次忽略 / 永久忽略

行为定义：
- 本次忽略
  - 当前列表移除
  - 后续仍可继续生成建议（下一次刷新/重新计算可再次出现）
- 永久忽略
  - 当前列表移除
  - SKU 不再生成采购建议数据（直到恢复）

忽略管理：
- 两类忽略记录都进入“忽略管理表”
- 支持操作：
  - 恢复：恢复可生成建议状态，并可回到列表（建议通过刷新/重新计算出现）
  - 清除：删除忽略记录，并同时删除该条采购建议数据，不会恢复到采购建议列表

## 状态模型（前端）

- `activeTab`: `'stock' | 'shortage'`
- `filters`：
  - `keyword`（SKU/名称）
  - `warehouseId`
  - `supplierId`
  - `buyerId`
- `groups`: `SupplierGroup[]`
  - `supplierId / supplierName`
  - `summary`: `{ skuCount, suggestedQtySum, suggestedAmountSum }`
  - `items`: `SuggestionRow[]`
- `selection`：
  - `selectedRowIds: Set<string>`
  - `selectedBySupplier: Map<supplierId, rowIds[]>`（派生）
- `ignored`：
  - `ignoredRows: IgnoredRow[]`
- `ui`：
  - `expandedSupplierIds: Set<string>`
  - `ignoreTypeChoiceModalOpen`
  - `ignoreManagerOpen`
  - `busy`：`addingToPlan | ignoring | loading`

## 数据字段（最小集）

`SuggestionRow`（最小集）：
- `id`
- `sku`
- `nameCn`
- `warehouseId` / `warehouseName`
- `supplierId` / `supplierName`
- `buyerId` / `buyerName`
- `purchasePrice`
- `suggestedQty`
- `suggestedAmount = purchasePrice * suggestedQty`

`IgnoredRow`（最小集）：
- `id`
- `sku`
- `nameCn`
- `warehouseName`
- `supplierName`
- `suggestedQty`
- `buyerName`
- `ignoreType`: `once | permanent`
- `ignoredAt`

## 关键交互细则

### 分组勾选
- 组头全选：选中/取消选中该供应商组下的所有 SKU 行
- 半选：组内部分行被选中时，组头为半选
- 跨组勾选：允许，批量动作对 `selectedRowIds` 生效

### 行内修改所属采购员
- SKU 行“采购员”列提供下拉单选（支持关键字过滤）
- 修改后即时生效：更新该行 `buyerId/buyerName`
- 若该行已选中：保持选中状态不变，仅归属变更

### 批量加入采购计划（按采购员拆分）
- 校验：未选中任何 SKU 时不可执行
- 生成 payload：按 `buyerId` 分组为 `{ buyerId, rowIds[] }[]`
- 成功后：从当前列表移除这些行，并清空勾选

### 忽略与忽略管理
- 忽略触发后必须选择忽略类型（本次/永久）
- 忽略成功后从列表移除，并写入 `ignoredRows`
- 忽略管理表：
  - 列：SKU、名称、仓库、供应商、建议采购数、采购员、忽略类型、忽略时间、操作（恢复/清除）
  - 恢复：从 `ignoredRows` 移除；后续可重新生成建议
  - 清除：从 `ignoredRows` 移除，并从建议数据源删除该 item（不恢复到列表）

## 验收标准

- Tab：支持备货建议/缺货建议切换，切换后列表可刷新
- 筛选区：包含 SKU/名称、仓库、供应商、采购员，提供搜索/重置
- 分组表格：
  - 默认按供应商分组
  - 组头展示：SKU 数量、建议采购总数、建议采购总金额
  - 支持组头全选/半选与展开折叠
- 行内采购员：可在列表行内修改采购员，下拉支持关键字过滤
- 加入采购计划：
  - 支持跨供应商组勾选后批量加入
  - 加入时按采购员拆分
  - 加入成功后 SKU 从当前列表移除并清空勾选
- 忽略：
  - 行级/批量忽略时弹出本次/永久选择
  - 忽略成功后 SKU 从当前列表移除
  - 忽略记录可在忽略管理表中查看，并支持恢复/清除

## 组件建议（贴合现有目录）

- `src/pages/PurchaseSuggestions/index.tsx`：Tab + 承载页面状态
- `src/pages/PurchaseSuggestions/components/SuggestionsFilter.tsx`：筛选区
- `src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx`：分组表格
- 建议新增：
  - `src/pages/PurchaseSuggestions/components/IgnoreChoiceDialog.tsx`
  - `src/pages/PurchaseSuggestions/components/IgnoredManagerDrawer.tsx`
