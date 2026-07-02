# 备货跟踪（/restock-tracking）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在采购流程下新增「备货跟踪」页面，支持复合筛选、复杂表头分组列表、基于可配置阈值的预警规则计算（localStorage 落库）与批量/单行通知弹框预览。

**Architecture:** 新增 RestockTracking 页面（筛选区 + 操作区 + 复杂表头列表 + 通知弹框/规则配置弹框）。使用 `useLocalStorage` 维护 `restock_tracking_data_v1` 与 `restock_tracking_rules_v1`。预警计算封装为纯函数（可单测），页面根据规则与数据实时派生预警状态/类型与衍生指标。

**Tech Stack:** React + TypeScript + Tailwind + shadcn/ui（Dialog/Input/Button/Checkbox）+ Vitest

---

## Spec
- `docs/superpowers/specs/2026-05-09-restock-tracking-design.md`

## Files Overview

**Modify**
- `src/components/layout/Sidebar.tsx`
- `src/App.tsx`
- `src/components/layout/Layout.tsx`
- `src/components/layout/Header.tsx`

**Create**
- `src/pages/RestockTracking/index.tsx`
- `src/pages/RestockTracking/index.ts`
- `src/pages/RestockTracking/types.ts`
- `src/pages/RestockTracking/mockData.ts`
- `src/pages/RestockTracking/rules.ts`
- `src/pages/RestockTracking/components/FilterBar.tsx`
- `src/pages/RestockTracking/components/RulesDialog.tsx`
- `src/pages/RestockTracking/components/NotifyDialog.tsx`
- `src/pages/RestockTracking/components/TrackingTable.tsx`
- `src/pages/RestockTracking/__tests__/rules.test.ts`

---

### Task 1: 预警规则计算（TDD）

**Files:**
- Create: `src/pages/RestockTracking/types.ts`
- Create: `src/pages/RestockTracking/rules.ts`
- Test: `src/pages/RestockTracking/__tests__/rules.test.ts`

- [ ] **Step 1: 写规则计算的失败单测**

Create `src/pages/RestockTracking/__tests__/rules.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { computeDerived, computeWarnings, defaultRules } from '../rules'
import type { RestockRow } from '../types'

const baseRow: RestockRow = {
  id: 'r1',
  shop: '亚马逊-US-01',
  sku: 'SKU001',
  name: '测试商品',
  designCode: 'D-100',
  remark: '',
  binStock: 120,
  allocatedUnshipped: 70,
  transitQty: 300,
  unshippedQty: 70,
  transferUnshippedQty: 0,
  forecastDailySales: 60,
  leadTimeDays: 15,
  restockAt: Date.now() - 20 * 86400000,
  costPrice: 45,
  lastInboundAt: Date.now() - 40 * 86400000,
  lastOutboundAt: Date.now() - 3 * 86400000,
}

describe('RestockTracking rules', () => {
  it('computes derived values', () => {
    const d = computeDerived(baseRow)
    expect(d.availableStock).toBe(50)
    expect(d.sellableDays).toBeCloseTo(50 / 60, 5)
    expect(d.inTransitValue).toBe(300 * 45)
    expect(d.totalValue).toBe((120 + 300) * 45)
  })

  it('detects out of stock risk', () => {
    const row = { ...baseRow, allocatedUnshipped: 119 }
    const warnings = computeWarnings({ row, rules: defaultRules, now: Date.now() })
    expect(warnings.types.includes('断货风险')).toBe(true)
    expect(warnings.status).toBe('触发预警')
  })

  it('detects understock risk', () => {
    const row = { ...baseRow, forecastDailySales: 10, leadTimeDays: 15, allocatedUnshipped: 0, binStock: 100 }
    const warnings = computeWarnings({ row, rules: defaultRules, now: Date.now() })
    expect(warnings.types.includes('备货不足')).toBe(true)
  })

  it('detects slow sales risk', () => {
    const row = { ...baseRow, forecastDailySales: 0.5 }
    const warnings = computeWarnings({ row, rules: defaultRules, now: Date.now() })
    expect(warnings.types.includes('滞销风险')).toBe(true)
  })

  it('detects overstock risk', () => {
    const row = { ...baseRow, forecastDailySales: 1, binStock: 300, allocatedUnshipped: 0 }
    const warnings = computeWarnings({ row, rules: defaultRules, now: Date.now() })
    expect(warnings.types.includes('库存积压')).toBe(true)
  })

  it('detects arrival delay risk', () => {
    const row = { ...baseRow, restockAt: Date.now() - 20 * 86400000, leadTimeDays: 10, transitQty: 1 }
    const warnings = computeWarnings({ row, rules: defaultRules, now: Date.now() })
    expect(warnings.types.includes('到货延迟')).toBe(true)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm run test:run
```

Expected: FAIL（rules/types 未实现）

- [ ] **Step 3: 实现 types 与 rules（最小可用）**

Create `src/pages/RestockTracking/types.ts`:
```ts
export type WarningStatus = '正常' | '触发预警'

export type WarningType = '断货风险' | '备货不足' | '滞销风险' | '库存积压' | '到货延迟'

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

export type Derived = {
  availableStock: number
  sellableDays: number
  inTransitValue: number
  totalValue: number
}

export type RulesConfig = {
  outOfStockDaysThreshold: number
  slowSalesDailyThreshold: number
  overstockDaysThreshold: number
}

export type Warnings = {
  status: WarningStatus
  types: WarningType[]
}
```

Create `src/pages/RestockTracking/rules.ts`:
```ts
import type { Derived, RestockRow, RulesConfig, WarningType, Warnings } from './types'

export const defaultRules: RulesConfig = {
  outOfStockDaysThreshold: 1,
  slowSalesDailyThreshold: 1,
  overstockDaysThreshold: 90,
}

export function computeDerived(row: RestockRow): Derived {
  const availableStock = (Number(row.binStock) || 0) - (Number(row.allocatedUnshipped) || 0)
  const forecast = Number(row.forecastDailySales) || 0
  const sellableDays = forecast > 0 ? availableStock / forecast : Number.POSITIVE_INFINITY
  const cost = Number(row.costPrice) || 0
  const transit = Number(row.transitQty) || 0
  const bin = Number(row.binStock) || 0
  return {
    availableStock,
    sellableDays,
    inTransitValue: transit * cost,
    totalValue: (bin + transit) * cost,
  }
}

export function computeWarnings(params: { row: RestockRow; rules: RulesConfig; now: number }): Warnings {
  const { row, rules, now } = params
  const d = computeDerived(row)
  const types: WarningType[] = []

  if (d.availableStock < (Number(row.forecastDailySales) || 0) * rules.outOfStockDaysThreshold) {
    types.push('断货风险')
  }

  if (Number.isFinite(d.sellableDays) && d.sellableDays < (Number(row.leadTimeDays) || 0)) {
    types.push('备货不足')
  }

  if ((Number(row.forecastDailySales) || 0) < rules.slowSalesDailyThreshold) {
    types.push('滞销风险')
  }

  if (Number.isFinite(d.sellableDays) && d.sellableDays > rules.overstockDaysThreshold) {
    types.push('库存积压')
  }

  const restockDays = (now - (Number(row.restockAt) || 0)) / 86400000
  if (restockDays > (Number(row.leadTimeDays) || 0) && (Number(row.transitQty) || 0) > 0) {
    types.push('到货延迟')
  }

  return { status: types.length > 0 ? '触发预警' : '正常', types }
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
git add src/pages/RestockTracking
git commit -m "feat(restock-tracking): add warning rules engine"
```

---

### Task 2: 示例数据与规则配置 localStorage 初始化

**Files:**
- Create: `src/pages/RestockTracking/mockData.ts`

- [ ] **Step 1: 生成覆盖多风险的示例数据**

Create `src/pages/RestockTracking/mockData.ts`:
```ts
import type { RestockRow } from './types'
import { defaultRules } from './rules'

export const RESTOCK_DATA_KEY = 'restock_tracking_data_v1'
export const RESTOCK_RULES_KEY = 'restock_tracking_rules_v1'

export const defaultShops = ['亚马逊-US-01', '亚马逊-UK-02', '独立站-01', '亚马逊-JP-01']

const baseTs = 1767225600000

export const mockRestockRows: RestockRow[] = [
  {
    id: 'rt-1',
    shop: '亚马逊-US-01',
    sku: 'SKU00123',
    name: '蓝牙耳机-黑色（Pro Max）',
    designCode: 'D-10006',
    remark: '热销款，需重点关注',
    binStock: 120,
    allocatedUnshipped: 70,
    transitQty: 300,
    unshippedQty: 70,
    transferUnshippedQty: 0,
    forecastDailySales: 60,
    leadTimeDays: 15,
    restockAt: baseTs - 20 * 86400000,
    costPrice: 45,
    lastInboundAt: baseTs - 35 * 86400000,
    lastOutboundAt: baseTs - 3 * 86400000,
  },
  {
    id: 'rt-2',
    shop: '亚马逊-UK-02',
    sku: 'SKU00998',
    name: '便携式投影仪-白色',
    designCode: 'D-10012',
    remark: '新款测试',
    binStock: 800,
    allocatedUnshipped: 50,
    transitQty: 0,
    unshippedQty: 50,
    transferUnshippedQty: 0,
    forecastDailySales: 5,
    leadTimeDays: 30,
    restockAt: baseTs - 10 * 86400000,
    costPrice: 120,
    lastInboundAt: baseTs - 60 * 86400000,
    lastOutboundAt: baseTs - 20 * 86400000,
  },
  {
    id: 'rt-3',
    shop: '独立站-01',
    sku: 'SKU00456',
    name: '机械键盘-青轴',
    designCode: 'D-10025',
    remark: '清库存中',
    binStock: 400,
    allocatedUnshipped: 20,
    transitQty: 0,
    unshippedQty: 20,
    transferUnshippedQty: 0,
    forecastDailySales: 0.5,
    leadTimeDays: 20,
    restockAt: baseTs - 5 * 86400000,
    costPrice: 80,
    lastInboundAt: baseTs - 100 * 86400000,
    lastOutboundAt: baseTs - 90 * 86400000,
  },
  {
    id: 'rt-4',
    shop: '亚马逊-US-01',
    sku: 'SKU00222',
    name: '无线鼠标-静音版',
    designCode: 'D-10018',
    remark: '物流异常跟进中',
    binStock: 50,
    allocatedUnshipped: 30,
    transitQty: 500,
    unshippedQty: 30,
    transferUnshippedQty: 0,
    forecastDailySales: 10,
    leadTimeDays: 25,
    restockAt: baseTs - 40 * 86400000,
    costPrice: 20,
    lastInboundAt: baseTs - 80 * 86400000,
    lastOutboundAt: baseTs - 2 * 86400000,
  },
]

export const mockRules = defaultRules
```

- [ ] **Step 2: 类型检查**

```bash
npm run check
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/RestockTracking/mockData.ts
git commit -m "feat(restock-tracking): add mock data and storage keys"
```

---

### Task 3: 页面 UI（筛选区/操作区/复杂表头列表）

**Files:**
- Create: `src/pages/RestockTracking/components/FilterBar.tsx`
- Create: `src/pages/RestockTracking/components/TrackingTable.tsx`
- Create: `src/pages/RestockTracking/components/RulesDialog.tsx`
- Create: `src/pages/RestockTracking/components/NotifyDialog.tsx`
- Create: `src/pages/RestockTracking/index.tsx`
- Create: `src/pages/RestockTracking/index.ts`

- [ ] **Step 1: FilterBar（店铺必选默认全选 + SKU/名称 + 日期区间 + 状态 + 类型多选）**

实现为受控组件：
- props: `value`, `onChange`, `onSearch`, `onReset`
- 店铺默认 `全部`（代表全选）
- 日期输入用原生 `<input type="date">`（避免引入新依赖）

- [ ] **Step 2: RulesDialog（统一阈值可编辑 + localStorage 保存）**

字段：
- outOfStockDaysThreshold
- slowSalesDailyThreshold
- overstockDaysThreshold

按钮：
- 取消
- 保存（写入 `RESTOCK_RULES_KEY`）

- [ ] **Step 3: TrackingTable（复杂表头分组 + 风险标签）**

实现：
- 两行表头（colSpan/rowSpan）
- 计算派生字段：可用库存、可售天数、在途货值、总价值
- 计算预警：调用 `computeWarnings`
- 预警标签颜色按 spec
- 勾选：支持全选/行选（用于批量发送通知）
- 操作列：发送通知（打开 NotifyDialog）

- [ ] **Step 4: NotifyDialog（预览模板 + 确认/取消占位）**

内容：
- 预览消息文本（插值 shop/sku/name/types/available/transit/dailySales）
- 第一版确认仅提示“已发送（示例）”

- [ ] **Step 5: RestockTracking 组装页面**

在 `index.tsx`：
- `useLocalStorage` 读写 rows/rules
- 初始化：若 localStorage 为空则使用 mockRows/mockRules
- 筛选：在内存中对 rows 过滤（按 shop/keyword/date/status/type）
- 操作栏：
  - 导出：弹出 alert（占位）
  - 批量发送：要求勾选，打开 NotifyDialog（批量模式）
  - 规则配置：打开 RulesDialog

- [ ] **Step 6: check/test**

```bash
npm run check
npm run test:run
```

- [ ] **Step 7: Commit**

```bash
git add src/pages/RestockTracking
git commit -m "feat(restock-tracking): add page layout and dialogs"
```

---

### Task 4: 接入导航、路由与标题映射

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/layout/Layout.tsx`
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Sidebar 新增菜单**

在「采购流程」children 中，将 `备货跟踪` 插入在 `采购跟单` 下方：
- `{ label: '备货跟踪', path: '/restock-tracking' }`

- [ ] **Step 2: App.tsx 新增 route**

新增 import `RestockTracking` 并加入：
- `<Route path="restock-tracking" element={<RestockTracking />} />`

- [ ] **Step 3: Layout/Header 标题映射**

补齐：
- `'/restock-tracking': '备货跟踪'`

- [ ] **Step 4: check/test**

```bash
npm run check
npm run test:run
```

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Sidebar.tsx src/App.tsx src/components/layout/Layout.tsx src/components/layout/Header.tsx
git commit -m "feat(restock-tracking): add nav and route"
```

---

### Task 5: 手动验收

- [ ] **Step 1: 启动 dev**

```bash
npm run dev -- --host 0.0.0.0
```

- [ ] **Step 2: 验收点**

- 进入 `/restock-tracking`
- 筛选项可用，店铺默认全选（以“全部”呈现）
- 规则配置可修改阈值并保存，保存后列表预警标签实时变化
- 预警类型多标签展示，颜色符合 spec
- 批量发送/单行发送弹框可打开并预览消息

