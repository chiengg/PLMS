# 单品SKU「日销量/剩余库存趋势」弹框 - 去年销量同比折线图 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在单品SKU「日销量/剩余库存趋势」弹框中新增“去年同期日销量”折线与图例，并支持图例点击控制显示/隐藏（默认显示三条线）。

**Architecture:** 继续沿用现有 SVG 折线图实现与稳定示例数据生成（buildSalesSeries）。新增第三条序列及其显示开关，并在图表缩放（Y 轴 max）计算中纳入可见序列。

**Tech Stack:** React + TypeScript + TailwindCSS（现有 Dialog/Input 组件）

---

## Files

- Modify: /Users/admin/Downloads/project-src/src/pages/SingleSku/SalesTrendDialog.tsx
- (Optional) Modify: /Users/admin/Downloads/project-src/src/pages/SingleSku/__tests__/utils.test.ts（如新增纯函数测试，否则不改）

### Task 1: Add “YoY Daily Sales” state + series

**Files:**
- Modify: /Users/admin/Downloads/project-src/src/pages/SingleSku/SalesTrendDialog.tsx

- [ ] **Step 1: Add new visibility state**

Add state:

```ts
const [showYoyDailySales, setShowYoyDailySales] = useState(true)
```

- [ ] **Step 2: Build yoy series**

Add memo:

```ts
const seriesYoyDaily = useMemo(() => {
  const seedSku = `${sku}|${warehouse}|${platform}|daily_yoy`
  return buildSalesSeries({ sku: seedSku, days: range.days, baseline: 45 })
}, [platform, range.days, sku, warehouse])
```

- [ ] **Step 3: Update chart scaling**

Ensure `max` uses visible series values:

```ts
const values: number[] = []
if (showDailySales) values.push(...seriesDaily)
if (showStock) values.push(...seriesStock)
if (showYoyDailySales) values.push(...seriesYoyDaily)
if (values.length === 0) values.push(...seriesDaily)
const max = Math.max(1, ...values)
```

- [ ] **Step 4: Draw yoy polyline + points**

Add yoy line drawing with green color (example `#22C55E`), guarded by `showYoyDailySales`.

### Task 2: Add legend item and toggle logic (keep at least one visible)

**Files:**
- Modify: /Users/admin/Downloads/project-src/src/pages/SingleSku/SalesTrendDialog.tsx

- [ ] **Step 1: Add “总和-去年同期日销量” legend item**

Add a third legend button.

- [ ] **Step 2: Enforce “at least one visible”**

When clicking a legend that would hide the last visible line, ignore the click.

### Task 3: Verification

- [ ] **Step 1: Typecheck**

Run:

```bash
npm run check --silent
```

Expected: exit 0

- [ ] **Step 2: Run tests**

Run:

```bash
npm run test:run --silent
```

Expected: all tests pass

- [ ] **Step 3: Manual preview**

Open:

`/products/single-sku` → click `7/28/42销量` → verify default shows three lines and legend toggles work.

