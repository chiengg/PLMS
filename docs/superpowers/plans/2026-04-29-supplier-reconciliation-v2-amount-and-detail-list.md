# 供应商对账 V2（账单金额 + 全供应商明细列表）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在供应商对账的汇总列表新增“账单金额”列，并将详情页改为“多供应商明细列表”（日：当日所有供应商；月：当月每日×所有供应商）。

**Architecture:** 继续使用本地 mock 数据：一级列表用“全部供应商”的汇总行；详情页根据路由 `cycle/type/id` 选择 mock 明细数组并用表格渲染，月账单明细增加“账单日期”列。

**Tech Stack:** React + TypeScript + react-router-dom + shadcn/ui + Tailwind

---

## File Map（改动范围）

**Modify**
- `/workspace/src/pages/SupplierReconciliation/components/ReconciliationList.tsx`
- `/workspace/src/pages/SupplierReconciliation/Detail.tsx`

---

### Task 1: 汇总列表新增“账单金额”列（含示例数据）

**Files:**
- Modify: `/workspace/src/pages/SupplierReconciliation/components/ReconciliationList.tsx`

- [ ] **Step 1: 扩展列表行类型**

将 `StatementRow` 扩展增加 `billAmount`：

```ts
type StatementRow = {
  id: string;
  period: string;
  supplier: string;
  platform: string;
  purchaser: string;
  account1688: string;
  billAmount: string;
  createdAt: string;
};
```

- [ ] **Step 2: 调整 mock rows 为“全部供应商”的汇总行**

日账单（purchase/sample）与月账单（purchase/sample）都返回“供应商=全部”的汇总行，并给出账单金额示例：

```ts
{ id: 'd-p-all', period: '2026-04-24', supplier: '全部', platform: '全部', purchaser: '全部', account1688: '全部', billAmount: '¥ 128,000.00', createdAt: '2026-04-25 10:20:30' }
```

金额口径：
- purchase：billAmount 视为“应付金额合计”
- sample：billAmount 视为“总金额合计”

- [ ] **Step 3: 表头/表体插入“账单金额”列**

表头顺序要求：
`... 1688账号 | 账单金额 | 创建日期 ...`

```tsx
<th>1688账号</th>
<th>账单金额</th>
<th>创建日期</th>
```

表体同样插入：

```tsx
<td>{row.account1688}</td>
<td>{row.billAmount}</td>
<td>{row.createdAt}</td>
```

---

### Task 2: 详情页改造为“多供应商明细列表表格”

**Files:**
- Modify: `/workspace/src/pages/SupplierReconciliation/Detail.tsx`

- [ ] **Step 1: 将现有二维网格字段展示替换为表格**

从：
- `fields: [label,value][]` 的 grid

改为：
- `columns: string[]`
- `rows: Record<string,string>[]`
- `<table>` 渲染

- [ ] **Step 2: 日账单详情（cycle=daily）**

purchase/sample 都展示“当日所有供应商”的多行数据，表格增加“供应商”列（第一列）。

示例 columns（purchase）：

```ts
['供应商', '付款单号', '关联单号', '1688账号', '1688单号', '付款账号', '账号名称', '收款人', '收款账号', '采购单金额', '应付金额', '实付金额', '未付金额', '状态', '预计付款时间', '下单员', '下单时间', '创建人', '创建时间', '付款人', '付款完成时间', '备注']
```

- [ ] **Step 3: 月账单详情（cycle=monthly）**

purchase/sample 都展示“当月每日 × 所有供应商”的多行数据，表格增加：
- `账单日期`（第一列或第二列）
- `供应商`

示例 columns（sample）：

```ts
['账单日期', '供应商', '采购订单号', '总金额', '下单时间', '1688账号', '1688单号', '库存SKU', '采购数量', '采购单价', '备注', '总运费', '采购仓库', '采购单状态', 'sku中文名', '已付金额', '未付金额', '已入库量', '已退款金', '1688退款时间', '下单员', '1688付款时间', '付款时间']
```

- [ ] **Step 4: 保持“返回”按钮与标题不变**

继续使用：
- 返回：`navigate(-1)`
- 标题：`日账单详情 - 采购对账单` / `月账单详情 - 采样对账单`

---

### Task 3: 验收

- [ ] **Step 1: TypeScript 检查**

Run: `npm run check`
Expected: exit code 0

- [ ] **Step 2: 页面验收**

访问：`http://localhost:5173/supplier-reconciliation`
检查：
- 列表新增“账单金额”列，位于 1688账号 右侧
- 日/月 + 采购/采样 切换时，列表行供应商均显示“全部”

点击详情：
- 日账单详情：表格多行，展示“所有供应商”
- 月账单详情：表格多行，展示“当月每日 × 所有供应商”

