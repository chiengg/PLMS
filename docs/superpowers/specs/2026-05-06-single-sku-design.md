# 单品SKU（/products/single-sku）页面设计

日期：2026-05-06

## 背景与目标

采购模块部分数据依赖商品模块。现需要在商品模块下新增「单品SKU」页面，用于承载库存 SKU 维度的查询与列表展示，第一版基于示例数据可用，支持前端筛选。

## 范围

### In Scope
- 左侧导航：一级菜单「商品」下新增二级菜单「单品SKU」
- 新增路由：`/products/single-sku`
- 单品SKU页面：
  - 查询条件区补齐：状态、活跃度
  - 列表字段按需求清单展示（支持横向滚动、左侧固定关键列）
  - 数据源：独立 localStorage 示例数据
  - 查询：前端真实过滤

### Out of Scope
- 与现有 `products_data_v1` 的同步/联动
- 接入“商品开发计划模块”真实数据接口（后续替换数据层）
- 复杂批量操作（导入/导出/批编辑等仅保留UI占位或后续迭代）

## 导航与路由

### 左侧导航
位置：`src/components/layout/Sidebar.tsx`

「商品」子菜单调整为：
- 商品（`/products`）
- 单品SKU（`/products/single-sku`）
- 添加商品（`/products/add`）

### 路由
位置：`src/App.tsx`

新增 route：
- `products/single-sku` → `SingleSku` 页面组件

## 数据源与示例数据

### localStorage Key
- `single_sku_data_v1`

### 初始化策略
- 进入页面时读取 `single_sku_data_v1`
- 若不存在/为空：
  - 写入一份示例数据（建议 20~50 条）
  - 覆盖不同状态/活跃度/分类/品牌以便演示筛选

### 数据结构（建议）

```ts
export type SingleSkuStatus =
  | '自动创建'
  | '等待开发'
  | '正常销售'
  | '商品清仓'
  | '停止销售';

export type SingleSkuActivity =
  | '爆款'
  | '旺款'
  | '平款'
  | '滞销款';

export type SingleSkuRow = {
  id: string;
  patternCode: string;
  imageUrl: string;
  productName: string;
  sku: string;
  status: SingleSkuStatus;
  activity: SingleSkuActivity;
  inventoryTotal: number;
  inventoryAvailable: number;
  forecastDailySales: number;
  sales72842: string;
  purchaseInTransitQty: number;
  warehouseUnshippedQty: number;
  stockInTransitQty: number;
  dropShipBasePrice: number;
  mainCategory: string;
  productCategory: string;
  customCategory: string;
  declareEnName: string;
  declareCnName: string;
  brand: string;
  selector: string;
  developer: string;
  createdBy: string;
  updatedAt: number;
  createdAt: number;
  updatedBy: string;
  remark: string;
};
```

字段缺省策略：
- 示例数据缺失或后续真实数据未接入时，列表展示 `--`（字符串）或 `0`（数值）均可，保持字段存在。

## 查询区设计

### 条件项
- 版型编码（输入）
- 产品名称（输入）
- 库存SKU编码（输入，支持模糊）
- 主分类（下拉单选）
- 品牌（下拉单选）
- 产品类目（下拉单选）
- 自定义分类（下拉单选）
- 状态（下拉单选）：全部/自动创建/等待开发/正常销售/商品清仓/停止销售
- 活跃度（下拉单选）：全部/爆款/旺款/平款/滞销款

### 操作
- 搜索：基于当前条件前端过滤并刷新列表
- 重置：恢复默认（全部/空），展示全量

## 列表字段与布局

### 固定左侧列（建议固定）
- 勾选
- 版型编码
- 产品图片
- 产品名称
- 库存SKU编码

### 横向滚动列
- 状态
- 库存总数
- 可用库存数
- 仓库预测日销量
- 仓库 7/28/42 销量
- 采购在途量
- 仓库未发货量
- 库存在途数
- 代发基价
- 主分类
- 商品类目
- 自定义分类
- 申报英文名称
- 申报中文名称
- 品牌
- 选品员
- 开发员
- 创建人
- 最后更新时间
- 创建时间
- 最后更新人
- 备注

### 分页
第一版可复用当前商品列表的分页UI；若后续要求真实分页，可在示例数据上做前端分页。

## 前端过滤规则

- 文本条件：包含匹配（忽略大小写）
  - 版型编码 / 产品名称 / 库存SKU编码
- 下拉条件：精确匹配；“全部”不参与过滤
  - 主分类 / 品牌 / 产品类目 / 自定义分类 / 状态 / 活跃度

## 验收标准

- 左侧导航出现「商品 > 单品SKU」，点击进入 `/products/single-sku`
- 查询条件新增「状态」「活跃度」下拉，选择后点击搜索可生效过滤
- 表格按字段清单展示，支持横向滚动；左侧关键列固定
- 示例数据可用且覆盖多种状态/活跃度，能验证筛选效果

