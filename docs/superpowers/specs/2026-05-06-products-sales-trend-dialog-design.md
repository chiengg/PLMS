# 商品页“预测日销量”趋势弹框设计

日期：2026-05-06

## 背景与目标

在商品列表中，“预测日销量”字段右侧 icon 增加可点击能力，点击后打开趋势弹框，展示当前 SKU 的近一个月日销量折线图，并支持按日期区间、仓库、平台查询。第一版采用前端 Mock 数据，不引入第三方图表库（自研轻量 SVG 折线图）。

## 范围

### In Scope
- 商品列表“预测日销量”右侧 icon 点击打开弹框
- 弹框展示：库存 SKU + 近一月日销量折线图（单折线）
- 弹框筛选：SKU（输入框 + 下拉搜索选择）、日期区间、仓库、平台
- 刷新策略：筛选变更后手动点击“查询”刷新；提供“重置”
- 数据源：前端 Mock（可复现的 seeded 生成规则）

### Out of Scope
- 对接后端真实销量接口
- 多序列图（库存线/双轴/缩放等）
- 高级交互（拖拽缩放、点选对比、导出等）

## 交互与信息架构

### 入口
- 位置：商品列表「预测日销量(个)」右侧 icon（现有 📈 位置）
- 行为：点击打开弹框

### 弹框结构
- 标题：`日销量趋势 —— {sku}`
- 筛选区：
  - SKU 切换：输入框（模糊） + 下拉搜索选择（Popover + Command）
  - 日期区间：开始日期、结束日期（默认近 30 天）
  - 仓库：下拉单选（默认全部）
  - 平台：下拉单选（默认全部，枚举 Amazon/eBay/Shopee/Temu 等）
  - 按钮：查询 / 重置
- 图表区：
  - 单折线：日销量（按天）
  - 空态：无数据时展示“暂无数据”
- 说明区（可选）：提示“筛选变更后需点击查询刷新”

### 刷新规则
- 任意筛选项变更均不自动刷新
- 点击“查询”时刷新图表
- 点击“重置”恢复默认筛选（SKU=打开弹框时的行 SKU、近30天、仓库/平台=全部）

## 数据模型（前端）

### SalesQuery
- `sku: string`
- `startDate: string`（YYYY-MM-DD）
- `endDate: string`（YYYY-MM-DD）
- `warehouse: string`（空字符串表示全部）
- `platform: string`（空字符串表示全部）

### SalesPoint
- `date: string`（YYYY-MM-DD）
- `sales: number`

### SalesSeriesResponse
- `sku: string`
- `points: SalesPoint[]`

## Mock 数据规则

- 默认日期：近 30 天（建议包含昨天，避免当天未完结误导）
- 稳定性：同一组查询条件（sku/日期/仓库/平台）应得到稳定可复现的结果
- 生成方式：
  - 使用 `sku + warehouse + platform + startDate + endDate` 作为随机种子
  - `points` 按日期区间逐日补齐
  - 趋势形态：大量 0 + 少量峰值点（稀疏峰值），贴近业务波动表现

## 组件拆分建议

### 修改
- `src/pages/Products/components/ProductTable.tsx`
  - 在预测日销量 icon 增加点击，打开弹框并传入当前行 `sku`

### 新增
- `src/pages/Products/components/SalesTrendDialog.tsx`
  - 弹框容器（Dialog）
  - 维护查询条件 state
  - SKU 切换控件（输入 + 下拉）
  - 查询/重置逻辑
  - 渲染折线图组件
- `src/pages/Products/components/SimpleLineChart.tsx`
  - 轻量 SVG 折线图
  - 入参：`points: Array<{ date: string; value: number }>`
- `src/pages/Products/salesMock.ts`
  - `buildSalesSeries(query): SalesSeriesResponse`
  - `listDateRange(start,end): string[]`
  - `seededRandom(seedStr): () => number`

## 验收标准

- 点击商品列表“预测日销量”icon 打开弹框
- 弹框标题展示 SKU，筛选区包含 SKU/日期/仓库/平台 + 查询/重置
- SKU 支持输入与下拉切换
- 修改筛选不自动刷新；点击“查询”刷新折线图
- 默认展示近 30 天日销量单折线；无数据有空态

