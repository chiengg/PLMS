# 降本绩效管理 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增“数据报表 → 降本绩效管理”页面，按月对比本月与上月加权均价，按“采购员+供应商+SKU”维度输出降本记录并支持导出。

**Architecture:** 前端本地 mock 原始采购记录 → 计算聚合行（本月/上月）→ 仅保留降本（本月均价 < 上月均价）→ 结合筛选条件渲染表格；导出为 CSV（客户端生成并下载）。

**Tech Stack:** React + TypeScript + React Router DOM + Tailwind + shadcn/ui（Input/Button/Select/Command 等）

---

## File Structure

**Create**
- `src/pages/CostReductionPerformance/index.tsx`（容器页：筛选状态、聚合计算、导出触发）
- `src/pages/CostReductionPerformance/components/CostReductionFilter.tsx`（筛选区：采购员/供应商/sku关键词/月）
- `src/pages/CostReductionPerformance/components/CostReductionTable.tsx`（表格：列渲染、双行降本数据展示）
- `src/pages/CostReductionPerformance/mockData.ts`（原始采购记录 mock + 采购员/供应商选项）
- `src/pages/CostReductionPerformance/utils.ts`（纯函数：聚合/计算/过滤/导出 CSV）
- `src/pages/CostReductionPerformance/utils.test.ts`（vitest 单测；若项目无 vitest，则跳过并改为 node 脚本校验）

**Modify**
- `src/App.tsx`（新增路由）
- `src/components/layout/Sidebar.tsx`（把“降本绩效管理”从 `/#` 指到新路由）
- `src/components/layout/Header.tsx`（title 映射补齐；若存在该映射）
- `src/components/layout/Layout.tsx`（document.title 映射补齐；若存在该映射）

---

## Task 1: 建立页面路由与导航入口

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Optional Modify: `src/components/layout/Header.tsx`
- Optional Modify: `src/components/layout/Layout.tsx`
- Create: `src/pages/CostReductionPerformance/index.tsx`

- [ ] **Step 1: 新建页面占位组件**

```tsx
export default function CostReductionPerformance() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-gray-800 text-[14px] font-medium mb-4">降本绩效管理</div>
      <div className="flex-1 bg-white border border-gray-200 rounded p-4 text-[13px] text-gray-600">
        页面初始化中…
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 注册路由**

在 `src/App.tsx` 中新增：

```tsx
import CostReductionPerformance from './pages/CostReductionPerformance';
```

并在 `<Routes>` 内增加：

```tsx
<Route path="cost-reduction-performance" element={<CostReductionPerformance />} />
```

- [ ] **Step 3: 侧边栏菜单改为真实路由**

在 `src/components/layout/Sidebar.tsx` 的 “数据报表” children 中，将：

```ts
{ label: '降本绩效管理', path: '/#' }
```

改为：

```ts
{ label: '降本绩效管理', path: '/cost-reduction-performance' }
```

- [ ] **Step 4: 补齐 Header / document.title 映射（如项目使用）**

若 `src/components/layout/Header.tsx` / `src/components/layout/Layout.tsx` 维护了路由标题映射，则追加：
- `/cost-reduction-performance` → `降本绩效管理`

- [ ] **Step 5: 手工验证路由可访问**

运行（若 dev server 已在跑则跳过）：

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

打开：
- `http://localhost:5173/cost-reduction-performance`

期望：页面显示“降本绩效管理 / 页面初始化中…”，左侧菜单可进入该页。

---

## Task 2: 定义原始采购记录 mock 与聚合计算工具函数

**Files:**
- Create: `src/pages/CostReductionPerformance/mockData.ts`
- Create: `src/pages/CostReductionPerformance/utils.ts`

- [ ] **Step 1: 创建原始采购记录类型与 mock 数据**

`mockData.ts` 写入：

```ts
export type MonthStr = `${number}-${string}`;

export type PurchaseRecord = {
  id: string;
  month: MonthStr; // YYYY-MM
  purchaser: string;
  supplier: string;
  sku: string;
  productName: string;
  thumbnailUrl: string;
  qty: number;
  unitPrice: number;
};

export const purchaserOptions = ['全部', '张三', '李四', '王五', '赵六'];
export const supplierOptions = ['全部', '广州市贝智皮具有限公司', '东莞市柏易服饰有限公司', '深圳优声电子有限公司'];

export const purchaseRecords: PurchaseRecord[] = [
  // 上月（2026-03）
  { id: 'r1', month: '2026-03', purchaser: '李四', supplier: '东莞市柏易服饰有限公司', sku: 'CN-BT-003', productName: '蓝牙音箱', thumbnailUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bluetooth%20speaker%20product%20photo&image_size=square', qty: 1000, unitPrice: 8.2 },
  { id: 'r2', month: '2026-03', purchaser: '李四', supplier: '东莞市柏易服饰有限公司', sku: 'CN-BT-003', productName: '蓝牙音箱', thumbnailUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bluetooth%20speaker%20product%20photo&image_size=square', qty: 500, unitPrice: 8.0 },
  // 本月（2026-04）降本：均价低于上月
  { id: 'r3', month: '2026-04', purchaser: '李四', supplier: '东莞市柏易服饰有限公司', sku: 'CN-BT-003', productName: '蓝牙音箱', thumbnailUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bluetooth%20speaker%20product%20photo&image_size=square', qty: 1200, unitPrice: 7.6 },
  { id: 'r4', month: '2026-04', purchaser: '李四', supplier: '东莞市柏易服饰有限公司', sku: 'CN-BT-003', productName: '蓝牙音箱', thumbnailUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bluetooth%20speaker%20product%20photo&image_size=square', qty: 800, unitPrice: 7.4 },

  // 其他 SKU：不降本（用于过滤验证）
  { id: 'r5', month: '2026-03', purchaser: '张三', supplier: '广州市贝智皮具有限公司', sku: 'GZ-BG-001', productName: '真皮手提包', thumbnailUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=handbag%20product%20photo&image_size=square', qty: 200, unitPrice: 90 },
  { id: 'r6', month: '2026-04', purchaser: '张三', supplier: '广州市贝智皮具有限公司', sku: 'GZ-BG-001', productName: '真皮手提包', thumbnailUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=handbag%20product%20photo&image_size=square', qty: 200, unitPrice: 92 },
];
```

- [ ] **Step 2: 实现聚合与计算工具函数（纯函数）**

`utils.ts` 写入：

```ts
import type { MonthStr, PurchaseRecord } from './mockData';

export type CostReductionRow = {
  key: string; // purchaser|supplier|sku
  purchaser: string;
  supplier: string;
  sku: string;
  productName: string;
  thumbnailUrl: string;

  qtyCur: number;
  priceCur: number | null;
  qtyPrev: number;
  pricePrev: number | null;

  saveUnit: number | null; // pricePrev - priceCur
  saveRate: number | null; // (pricePrev-priceCur)/pricePrev
  saveAmt: number | null;  // max(0, pricePrev-priceCur) * qtyCur
};

export function prevMonth(month: MonthStr): MonthStr {
  const [yStr, mStr] = month.split('-');
  const y = Number(yStr);
  const m = Number(mStr);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return month;
  if (m === 1) return `${y - 1}-12` as MonthStr;
  return `${y}-${String(m - 1).padStart(2, '0')}` as MonthStr;
}

function weightedAvg(totalAmt: number, totalQty: number): number | null {
  if (!totalQty) return null;
  return totalAmt / totalQty;
}

export type AggregateFilters = {
  month: MonthStr;
  purchaser?: string; // '' or undefined means all
  supplier?: string;
  keyword?: string; // sku or name
};

export function buildCostReductionRows(records: PurchaseRecord[], filters: AggregateFilters): CostReductionRow[] {
  const monthCur = filters.month;
  const monthPrev = prevMonth(monthCur);

  const keyword = (filters.keyword || '').trim();
  const keywordLower = keyword.toLowerCase();

  const matchKeyword = (r: PurchaseRecord) => {
    if (!keyword) return true;
    return r.sku.toLowerCase().includes(keywordLower) || r.productName.toLowerCase().includes(keywordLower);
  };

  const base = records.filter(r => {
    if (filters.purchaser && filters.purchaser !== '全部' && r.purchaser !== filters.purchaser) return false;
    if (filters.supplier && filters.supplier !== '全部' && r.supplier !== filters.supplier) return false;
    if (!matchKeyword(r)) return false;
    return r.month === monthCur || r.month === monthPrev;
  });

  type Agg = {
    purchaser: string;
    supplier: string;
    sku: string;
    productName: string;
    thumbnailUrl: string;
    qtyCur: number;
    amtCur: number;
    qtyPrev: number;
    amtPrev: number;
  };

  const map = new Map<string, Agg>();
  for (const r of base) {
    const key = `${r.purchaser}|${r.supplier}|${r.sku}`;
    const existed = map.get(key);
    const agg: Agg = existed || {
      purchaser: r.purchaser,
      supplier: r.supplier,
      sku: r.sku,
      productName: r.productName,
      thumbnailUrl: r.thumbnailUrl,
      qtyCur: 0,
      amtCur: 0,
      qtyPrev: 0,
      amtPrev: 0
    };

    if (r.month === monthCur) {
      agg.qtyCur += r.qty;
      agg.amtCur += r.qty * r.unitPrice;
    } else if (r.month === monthPrev) {
      agg.qtyPrev += r.qty;
      agg.amtPrev += r.qty * r.unitPrice;
    }

    map.set(key, agg);
  }

  const rows: CostReductionRow[] = [];
  for (const [key, a] of map.entries()) {
    const priceCur = weightedAvg(a.amtCur, a.qtyCur);
    const pricePrev = weightedAvg(a.amtPrev, a.qtyPrev);
    if (priceCur == null || pricePrev == null) continue;
    if (!(priceCur < pricePrev)) continue;

    const saveUnit = pricePrev - priceCur;
    const saveRate = pricePrev === 0 ? null : saveUnit / pricePrev;
    const saveAmt = Math.max(0, saveUnit) * a.qtyCur;

    rows.push({
      key,
      purchaser: a.purchaser,
      supplier: a.supplier,
      sku: a.sku,
      productName: a.productName,
      thumbnailUrl: a.thumbnailUrl,
      qtyCur: a.qtyCur,
      priceCur,
      qtyPrev: a.qtyPrev,
      pricePrev,
      saveUnit,
      saveRate,
      saveAmt
    });
  }

  rows.sort((x, y) => (y.saveAmt || 0) - (x.saveAmt || 0) || (y.saveUnit || 0) - (x.saveUnit || 0));
  return rows;
}

export function formatNumber(n: number, digits: number) {
  return n.toFixed(digits);
}

export function toPercent(rate: number | null) {
  if (rate == null) return '--';
  return `${(rate * 100).toFixed(2)}%`;
}

export function exportRowsToCsv(rows: CostReductionRow[], month: string): { filename: string; csv: string } {
  const header = [
    '采购员',
    '供应商',
    'SKU',
    '名称',
    '本次采购单价(加权均价)',
    '上次采购单价(加权均价)',
    '降本单价',
    '降本比例',
    '本次采购数量',
    '降本金额'
  ];

  const lines = [header.join(',')];
  for (const r of rows) {
    const line = [
      r.purchaser,
      r.supplier,
      r.sku,
      r.productName,
      r.priceCur == null ? '' : r.priceCur.toFixed(4),
      r.pricePrev == null ? '' : r.pricePrev.toFixed(4),
      r.saveUnit == null ? '' : r.saveUnit.toFixed(4),
      r.saveRate == null ? '' : (r.saveRate * 100).toFixed(2) + '%',
      String(r.qtyCur),
      r.saveAmt == null ? '' : r.saveAmt.toFixed(2)
    ].map(v => `\"${String(v).replaceAll('\"', '\"\"')}\"`);
    lines.push(line.join(','));
  }

  return {
    filename: `降本绩效管理_${month}.csv`,
    csv: `\uFEFF${lines.join('\\n')}`
  };
}
```

- [ ] **Step 3:（可选）加入单测验证核心口径**

若项目已具备 vitest，则创建 `utils.test.ts`；否则可用 `node` 运行一个断言脚本（同文件末尾）做校验。

---

## Task 3: 实现筛选组件（采购员/供应商模糊下拉 + SKU/名称关键字 + 月份）

**Files:**
- Create: `src/pages/CostReductionPerformance/components/CostReductionFilter.tsx`
- Modify: `src/pages/CostReductionPerformance/index.tsx`

- [ ] **Step 1: 复用现有“输入 + 下拉选项”写法**

参考 `src/pages/PurchaserPerformance/components/PerformanceList.tsx` 的采购员下拉逻辑（Input focus 展示、blur 延迟关闭、options filter）。

- [ ] **Step 2: 筛选字段 props 设计**

```ts
export type CostReductionFilterValues = {
  month: string; // YYYY-MM
  purchaser: string; // '' means all
  supplier: string;  // '' means all
  keyword: string;
};
```

```tsx
export default function CostReductionFilter(props: {
  values: CostReductionFilterValues;
  onChange: (next: CostReductionFilterValues) => void;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
  purchaserOptions: string[];
  supplierOptions: string[];
})
```

- [ ] **Step 3: 月份控件**

使用 `Input type="month"` 单选月份；默认值为当前月：

```ts
const now = new Date();
const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}`;
```

- [ ] **Step 4: 验证筛选交互**

确认：
- 输入“李”可过滤采购员选项
- 输入供应商关键字可过滤供应商选项
- 输入 SKU/名称关键字会更新 keyword
- 搜索/重置按钮可触发回调

---

## Task 4: 实现表格组件（双行展示与数值格式）

**Files:**
- Create: `src/pages/CostReductionPerformance/components/CostReductionTable.tsx`

- [ ] **Step 1: 表格列实现（符合设计文档）**

表格最小列宽建议 `min-w-[1400px]`，并支持横向滚动。

降本数据列用双行：
- 第 1 行：`saveUnit`（4 位小数）
- 第 2 行：`saveRate`（百分比；null 显示 `--`）

商品列也用双行：
- 第 1 行：SKU（蓝色，可复制可后续扩展）
- 第 2 行：名称（灰色）

缩略图列用 `img`（已按本仓库规则用文本生成图片 URL）。

- [ ] **Step 2: 空态**

当 rows.length === 0 显示：
- “暂无降本记录”
- 提示检查月份/筛选条件

---

## Task 5: 容器页联动（计算 rows + 默认只展示降本 + 导出 CSV）

**Files:**
- Modify: `src/pages/CostReductionPerformance/index.tsx`

- [ ] **Step 1: 组合 Filter + Table**

`index.tsx` 中：
- 维护 `filterValues` state
- 用 `useMemo` 调用 `buildCostReductionRows(purchaseRecords, filters)` 得到 rows

- [ ] **Step 2: 导出实现（前端下载）**

实现 `downloadCsv(filename, csv)`：

```ts
function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

导出按钮回调：
- `const { filename, csv } = exportRowsToCsv(rows, filterValues.month);`
- `downloadCsv(filename, csv);`

- [ ] **Step 3: 小结信息**

表格下方显示：
- “共 N 条降本记录”

---

## Task 6: 端到端手工验收（对齐 AC）

**Files:**
- No code (manual)

- [ ] **Step 1: 访问页面**

打开：
- `http://localhost:5173/cost-reduction-performance`

- [ ] **Step 2: 验证默认只展示降本**

选择 2026-04：
- 应出现 `CN-BT-003` 的降本记录（mock 中上月均价 > 本月均价）
- `GZ-BG-001` 不应出现（本月涨价）

- [ ] **Step 3: 验证“取消上月数据则不展示”**

选择一个没有上月数据的月份，列表为空。

- [ ] **Step 4: 验证导出**

点击导出：
- 下载文件名 `降本绩效管理_YYYY-MM.csv`
- 内容首行表头正确、行数与列表一致

---

## Spec Coverage Self-Review

覆盖点映射：
- 维度与口径（加权均价、双行降本数据、降本金额口径、仅降本过滤）：Task 2 + Task 4 + Task 5
- 筛选（采购员/供应商模糊、SKU/名称关键字、按月）：Task 3
- 导出（按月 + 当前筛选条件 + 仅降本范围）：Task 5
- 路由与导航接入（侧边栏占位改为真实页）：Task 1

占位/歧义扫描：
- 未引入后端 API（按需求可先用 mock），后续可替换为接口；本计划不做无关扩展。

