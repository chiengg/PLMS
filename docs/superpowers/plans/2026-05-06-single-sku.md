# 单品SKU（/products/single-sku）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在「商品」模块下新增二级菜单「单品SKU」，实现 `/products/single-sku` 页面：基于示例数据（localStorage）展示单品SKU列表，补齐“状态/活跃度”等查询条件，并支持前端真实过滤与横向滚动表格。

**Architecture:** 新增 SingleSku 页面（筛选区 + 表格）；用 `useLocalStorage` 读写 `single_sku_data_v1`，首次进入自动初始化示例数据；过滤逻辑以纯函数 `filterRows` 实现并可单测；表格采用与现有商品列表一致的视觉风格，左侧固定关键列，右侧横向滚动。

**Tech Stack:** React + TypeScript + Tailwind + shadcn/ui（Input/Select/Checkbox/Button）+ Vitest

---

## Spec

- `docs/superpowers/specs/2026-05-06-single-sku-design.md`

## Files Overview

**Modify**
- `src/components/layout/Sidebar.tsx`
- `src/App.tsx`

**Create**
- `src/pages/SingleSku/index.tsx`
- `src/pages/SingleSku/types.ts`
- `src/pages/SingleSku/mockData.ts`
- `src/pages/SingleSku/utils.ts`
- `src/pages/SingleSku/__tests__/utils.test.ts`

---

### Task 1: 新增 SingleSku 数据结构、示例数据与过滤函数（TDD）

**Files:**
- Create: `src/pages/SingleSku/types.ts`
- Create: `src/pages/SingleSku/mockData.ts`
- Create: `src/pages/SingleSku/utils.ts`
- Test: `src/pages/SingleSku/__tests__/utils.test.ts`

- [ ] **Step 1: 写过滤函数单测（先失败）**

Create `src/pages/SingleSku/__tests__/utils.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { filterRows } from '../utils';
import { mockSingleSkus } from '../mockData';

describe('filterRows', () => {
  it('filters by status', () => {
    const res = filterRows(mockSingleSkus, { status: '正常销售', activity: '全部', keyword: '' });
    expect(res.every(r => r.status === '正常销售')).toBe(true);
  });

  it('filters by activity', () => {
    const res = filterRows(mockSingleSkus, { status: '全部', activity: '爆款', keyword: '' });
    expect(res.every(r => r.activity === '爆款')).toBe(true);
  });

  it('filters by keyword in sku/name/patternCode', () => {
    const one = mockSingleSkus[0];
    const res = filterRows(mockSingleSkus, { status: '全部', activity: '全部', keyword: one.sku.slice(0, 4) });
    expect(res.some(r => r.id === one.id)).toBe(true);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm run test:run
```

Expected: FAIL（缺少 mockData/utils 实现）

- [ ] **Step 3: 实现 types/mockData/utils**

Create `src/pages/SingleSku/types.ts`:
```ts
export type SingleSkuStatus =
  | '自动创建'
  | '等待开发'
  | '正常销售'
  | '商品清仓'
  | '停止销售';

export type SingleSkuActivity = '爆款' | '旺款' | '平款' | '滞销款';

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

export type SingleSkuFilters = {
  keyword: string;
  status: '全部' | SingleSkuStatus;
  activity: '全部' | SingleSkuActivity;
  mainCategory: string;
  brand: string;
  productCategory: string;
  customCategory: string;
};
```

Create `src/pages/SingleSku/mockData.ts`:
```ts
import type { SingleSkuRow } from './types';

export const SINGLE_SKU_KEY = 'single_sku_data_v1';

export const mockSingleSkus: SingleSkuRow[] = Array.from({ length: 30 }).map((_, i) => {
  const statuses = ['自动创建', '等待开发', '正常销售', '商品清仓', '停止销售'] as const;
  const activities = ['爆款', '旺款', '平款', '滞销款'] as const;
  const status = statuses[i % statuses.length];
  const activity = activities[i % activities.length];
  const now = Date.now();
  return {
    id: `ssku_${i + 1}`,
    patternCode: `1000${(6000 + i).toString()}`,
    imageUrl: 'https://via.placeholder.com/40',
    productName: `示例产品-${i + 1}`,
    sku: `1000${(6000 + i).toString()}-0-${String.fromCharCode(65 + (i % 4))}0-NS`,
    status,
    activity,
    inventoryTotal: 100 + i,
    inventoryAvailable: 80 + i,
    forecastDailySales: Number((Math.random() * 2).toFixed(3)),
    sales72842: `${i % 3}/${i % 9}/${i % 21}`,
    purchaseInTransitQty: i % 7,
    warehouseUnshippedQty: i % 5,
    stockInTransitQty: i % 11,
    dropShipBasePrice: 10 + (i % 6),
    mainCategory: ['非服装类', '服装类'][i % 2],
    productCategory: ['家居与园艺', '珠宝与手表'][i % 2],
    customCategory: ['Cookie', 'Earrings', 'Necklace'][i % 3],
    declareEnName: '--',
    declareCnName: '--',
    brand: ['默认品牌', '示例品牌A', '示例品牌B'][i % 3],
    selector: ['选品员A', '选品员B'][i % 2],
    developer: ['开发员A', '开发员B'][i % 2],
    createdBy: '系统',
    updatedAt: now - i * 3600_000,
    createdAt: now - i * 3600_000 * 24,
    updatedBy: '系统',
    remark: '',
  };
});
```

Create `src/pages/SingleSku/utils.ts`:
```ts
import type { SingleSkuFilters, SingleSkuRow } from './types';

export function filterRows(rows: SingleSkuRow[], filters: Pick<SingleSkuFilters, 'keyword' | 'status' | 'activity'>) {
  const kw = filters.keyword.trim().toLowerCase();
  return rows.filter((r) => {
    if (filters.status !== '全部' && r.status !== filters.status) return false;
    if (filters.activity !== '全部' && r.activity !== filters.activity) return false;
    if (!kw) return true;
    return (
      r.sku.toLowerCase().includes(kw) ||
      r.productName.toLowerCase().includes(kw) ||
      r.patternCode.toLowerCase().includes(kw)
    );
  });
}
```

- [ ] **Step 4: 运行测试确保通过**

```bash
npm run test:run
```

Expected: PASS

- [ ] **Step 5: 类型检查**

```bash
npm run check
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/SingleSku
git commit -m "feat(single-sku): add types, mock data, and filters"
```

---

### Task 2: 新增单品SKU页面（筛选区 + 表格）

**Files:**
- Create: `src/pages/SingleSku/index.tsx`

- [ ] **Step 1: 页面初始化读取/写入 localStorage**

在页面中使用 `useLocalStorage<SingleSkuRow[]>(SINGLE_SKU_KEY, mockSingleSkus)`，并基于 filters + `filterRows` 得到 filteredRows。

- [ ] **Step 2: 筛选区 UI**

实现输入/下拉：
- 版型编码（keyword 复用即可）
- 产品名称（keyword 复用即可）
- 库存SKU编码（keyword 复用即可）
- 状态/活跃度下拉（必做）
- 搜索/重置按钮：按钮点击才更新“应用态”filters（与现有商品列表一致体验）

- [ ] **Step 3: 表格 UI（复刻现有风格）**

要求：
- 左侧固定：勾选框 + 版型编码 + 产品图片 + 产品名称 + 库存SKU编码
- 右侧横向滚动：按 spec 的字段清单完整渲染列（缺失值显示 `--`）
- 右上角保留统计：已选行数 / 商品数（可选）

- [ ] **Step 4: check/test**

```bash
npm run check
npm run test:run
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/SingleSku/index.tsx
git commit -m "feat(single-sku): add single sku page"
```

---

### Task 3: 接入导航与路由

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Sidebar 增加二级菜单**

在「商品」children 中插入：
- `{ label: '单品SKU', path: '/products/single-sku' }`

- [ ] **Step 2: App.tsx 增加 route**

新增 import `SingleSku` 并加入：
- `<Route path="products/single-sku" element={<SingleSku />} />`

- [ ] **Step 3: check/test**

```bash
npm run check
npm run test:run
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Sidebar.tsx src/App.tsx
git commit -m "feat(single-sku): add nav and route"
```

---

### Task 4: 手动验收与构建

- [ ] **Step 1: 启动 dev**

```bash
npm run dev -- --host 0.0.0.0
```

- [ ] **Step 2: 验收**

- 导航点击「商品 > 单品SKU」进入页面
- 选择“状态/活跃度”并点搜索，列表真实过滤
- 重置恢复全量
- 表格横向滚动，左侧关键列保持可见

- [ ] **Step 3: build**

```bash
npm run build
```

