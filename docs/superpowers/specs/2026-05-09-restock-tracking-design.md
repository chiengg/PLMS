# 备货跟踪（/restock-tracking）页面设计

日期：2026-05-09

## 背景与目标

在「采购流程」下新增「备货跟踪」页面，通过预警规则引擎分析库存、销量、采购周期数据，直观展示断货风险、备货不足、滞销、积压、到货延迟等风险，并提供协同通知入口，提升备货计划准确性与异常处理效率。

## 范围

### In Scope（第一版）
- 左侧导航：采购 > 采购流程 下新增二级菜单「备货跟踪」，位置在「采购跟单」下方
- 新增路由：`/restock-tracking`
- 页面模块：
  - 搜索筛选区：店铺、SKU/名称、备货时间区间、预警状态、预警类型（多选）
  - 操作区：数据导出、批量发送预警通知、预警规则配置
  - 数据列表区：复杂表头分组 + 预警彩色标签高亮
  - 预警规则配置：统一阈值（5条规则阈值可编辑）+ 保存 localStorage + 列表实时重算

### Out of Scope（第一版不做）
- 自动跑批定时任务（仅预留描述与UI）
- 实际站内信/钉钉通知下发（仅做UI与示例消息预览）
- 多店铺/多仓差异化规则配置、规则启用/禁用
- SKU详情折线图真实数据（可用占位图或简单 mock 折线）

## 导航与路由

### 左侧导航
位置：`src/components/layout/Sidebar.tsx`

在「采购流程」children 中插入：
- `采购跟单`（保持）
- `备货跟踪`（新增，位于采购跟单下方）

### 路由
位置：`src/App.tsx`

新增 route：
- `restock-tracking` → `RestockTracking`

同时补齐页面标题映射：
- `src/components/layout/Layout.tsx`
- `src/components/layout/Header.tsx`

## 数据源（示例数据）

### localStorage Keys
- 列表数据：`restock_tracking_data_v1`
- 规则配置：`restock_tracking_rules_v1`

### 初始化策略
- 页面加载优先读 localStorage
- 若不存在则写入示例数据与默认规则（确保能触发多种预警）

### 数据结构（建议）

```ts
export type WarningStatus = '正常' | '触发预警'

export type WarningType =
  | '断货风险'
  | '备货不足'
  | '滞销风险'
  | '库存积压'
  | '到货延迟'

export type RestockRow = {
  id: string
  shop: string
  sku: string
  name: string
  designCode: string
  remark: string

  binStock: number
  allocatedUnshipped: number
  transitQty: number
  unshippedQty: number
  transferUnshippedQty: number

  forecastDailySales: number
  leadTimeDays: number
  restockAt: number

  costPrice: number
  lastInboundAt: number
  lastOutboundAt: number
}
```

衍生字段（由规则引擎计算，不落库或可缓存）：
- 可用库存量 = 仓位库存 - 已分配未发货量
- 当前库存可售天数 = 可用库存量 ÷ 预测日销量
- 在途货值 = 在途量 × 成本价
- 总价值 = (仓位库存 + 在途量) × 成本价
- 预警状态：正常 / 触发预警
- 预警类型：可能为多个（标签列表）

## 查询筛选模块

- 店铺：下拉单选（支持搜索）；必选；默认全选（实现上用“全部”代表）
- 商品信息：输入框，模糊匹配 sku 或 name（不区分大小写）
- 备货时间：开始日期 ~ 结束日期（按 `restockAt` 过滤）
- 预警状态：全部 / 正常 / 触发预警
- 预警类型：多选（断货风险 / 备货不足 / 滞销风险 / 库存积压 / 到货延迟）

## 预警规则引擎（统一阈值，可配置）

### 默认阈值（可在弹框编辑）
- 断货极高风险：`availableStock < forecastDailySales * outOfStockDaysThreshold`（默认 outOfStockDaysThreshold=1）
- 备货不足风险：`sellableDays < leadTimeDays`
- 滞销/死库风险：`forecastDailySales < slowSalesDailyThreshold`（默认 1）
- 库存积压风险：`sellableDays > overstockDaysThreshold`（默认 90）
- 到货延迟风险：`(now - restockAt) / 86400000 > leadTimeDays && transitQty > 0`

> 注：以上规则的阈值参数需可编辑并存储 localStorage（统一全局阈值）。

### 规则配置弹框（统一阈值）
- 每条规则展示：名称、说明、阈值输入（数字）
- 保存：写入 `restock_tracking_rules_v1`
- 取消：不保存
- 保存后立即触发表格重算并更新标签

## 数据列表与表头分组

### 表头分组（两层表头）
- 基础信息：店铺 / 库存SKU / 中文名称 / 设计编码 / 商品备注
- 库存状态：仓位库存 / 可用库存量 / 在途量 / 未发货量 / 分仓调拨未发货量
- 销售与周转：预测日销量 / 当前库存可售天数 / 采购天数（Lead Time）
- 财务数据：成本价 / 在途货值 / 总价值
- 时间节点：最后入库时间 / 最后出库时间
- 预警状态：当前预警类型（标签列表）
- 操作：发送通知

### 风险标签颜色（建议）
- 断货风险：红
- 备货不足：黄
- 滞销风险：灰
- 库存积压：紫
- 到货延迟：橙

### 行高亮
- 触发预警的行：在 SKU/预警列使用更高对比度（如粗体/强调色），保持整体表格简洁

## 消息下发与协同通知

第一版：
- 列表每行提供「发送通知」入口（弹框预览消息模板 + 选择对象占位 + 确认/取消）
- 顶部提供「批量发送预警通知」入口（要求勾选；弹框仅预览与确认）

消息模板文本：
```
【ERP系统预警】备货商品异常通知
店铺：{shop}
商品：{sku} ({name})
预警类型：{warningTypes}
当前状态：可用库存 {availableStock}，在途 {transitQty}，日均销量 {forecastDailySales}
建议操作：{suggestion}
```

## 验收标准

- 左侧导航出现「备货跟踪」，点击进入页面
- 筛选项可用：店铺必选（默认全选）、SKU/名称模糊、备货时间区间、预警状态、预警类型多选
- 预警规则配置可编辑阈值并保存到 localStorage，保存后列表标签实时更新
- 列表按分组表头展示字段，行可通过彩色标签直观识别风险
- 批量发送与单行发送入口可打开弹框（第一版不接真实消息渠道）

