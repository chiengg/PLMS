# 添加商品（/products/add）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现「添加商品」完整表单（基础信息/扩展属性/仓库信息），支持目录&品牌管理弹框、本地校验与联动计算，并在保存后写入 localStorage 返回商品列表可见。

**Architecture:** 以 `useLocalStorage` 作为本地持久化统一数据源；Products 列表与 Add 页面共享同一数据结构与 key；目录/品牌采用独立 key 并提供弹框内 CRUD；联动计算用纯函数工具实现并在 UI 层提供“手动覆盖/恢复默认”机制。

**Tech Stack:** React + TypeScript + Tailwind + shadcn/ui（Dialog/Select/Input/Button/Popover/Command）+ Vitest（已接入）

---

## Spec

- `docs/superpowers/specs/2026-05-06-add-product-design.md`

## Files Overview

**Modify**
- `src/pages/Products/components/ProductTable.tsx`
- `src/pages/Products/Add.tsx`

**Create**
- `src/pages/Products/data.ts`
- `src/pages/Products/types.ts`
- `src/pages/Products/addProduct/validators.ts`
- `src/pages/Products/addProduct/calculations.ts`
- `src/pages/Products/addProduct/CategoryManagerDialog.tsx`
- `src/pages/Products/addProduct/BrandManagerDialog.tsx`
- `src/pages/Products/addProduct/AddProductForm.tsx`
- `src/pages/Products/__tests__/validators.test.ts`
- `src/pages/Products/__tests__/calculations.test.ts`

---

### Task 1: 抽象 Products 数据结构 + 初始化 localStorage 数据源

**Files:**
- Create: `src/pages/Products/types.ts`
- Create: `src/pages/Products/data.ts`
- Modify: `src/pages/Products/components/ProductTable.tsx`

- [ ] **Step 1: 新增 types.ts（Product/Category/Brand）**

Create `src/pages/Products/types.ts`:
```ts
export type ProductStatus =
  | '自动创建'
  | '等待开发'
  | '正常销售'
  | '商品清仓'
  | '停止销售';

export type ProductShape = '实物商品' | '虚拟商品';

export type ProductWarehouseInfo = {
  warehouse: string;
  inventoryQty: number;
  inventoryCheckCycleDays: number;
  inventoryChecker: string;
  purchaseDays: number;
  stockAlertDays: number;
  forecastDailySales: number;
  stockAlertQty: number;
  minPurchaseQty: number;
  purchaseUpperLimit: number;
  manualOverrides: {
    stockAlertQty: boolean;
    minPurchaseQty: boolean;
  };
};

export type Product = {
  id: string;
  sku: string;
  mainSku: string;
  cnName: string;
  enName: string;
  status: ProductStatus;
  factorySku: string;
  shape: ProductShape;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  unit: string;
  salesLink: string;
  developer: string;
  inventoryImageUrl: string;
  virtualSku: string;
  productNote: string;
  salesNote: string;
  purchaseNote: string;
  extraAttrs: Record<string, string>;
  warehouseInfo: ProductWarehouseInfo;
  createdAt: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  hsCode: string;
  multiAttr: boolean;
  parentId: string;
};

export type Brand = {
  id: string;
  name: string;
};
```

- [ ] **Step 2: 新增 data.ts（localStorage key + 默认枚举）**

Create `src/pages/Products/data.ts`:
```ts
import type { Brand, Category, Product, ProductStatus } from './types';

export const PRODUCTS_KEY = 'products_data_v1';
export const CATEGORIES_KEY = 'product_categories_v1';
export const BRANDS_KEY = 'product_brands_v1';

export const statusOptions: ProductStatus[] = ['自动创建', '等待开发', '正常销售', '商品清仓', '停止销售'];
export const shapeOptions = ['实物商品', '虚拟商品'] as const;

export const unitOptions = ['个', '支', '套', '箱', '件'];
export const userOptions = ['张伟', '李娜', '王强', '刘美希', '陈刚'];

export const warehouseOptions = ['东莞周转仓', '义乌周转仓', '深圳周转仓'];

export const defaultCategories: Category[] = [
  { id: 'c1', name: 'ERP主分类A', description: '', hsCode: '', multiAttr: false, parentId: '' },
  { id: 'c2', name: '商品类目A-1', description: '', hsCode: '', multiAttr: false, parentId: 'c1' },
];

export const defaultBrands: Brand[] = [
  { id: 'b1', name: '默认品牌' },
];

export function defaultProductsFromLegacyMock(): Product[] {
  return [
    {
      id: 'p1',
      sku: '10006231-0-A0-TSG',
      mainSku: '',
      cnName: 'TSG生产耗材烫钻-D款_银色',
      enName: '',
      status: '正常销售',
      factorySku: '',
      shape: '实物商品',
      categoryId: '',
      categoryName: '',
      brandId: '',
      brandName: '',
      unit: '个',
      salesLink: '',
      developer: '',
      inventoryImageUrl: '',
      virtualSku: '',
      productNote: '',
      salesNote: '',
      purchaseNote: '',
      extraAttrs: {},
      warehouseInfo: {
        warehouse: '东莞周转仓',
        inventoryQty: 0,
        inventoryCheckCycleDays: 0,
        inventoryChecker: '',
        purchaseDays: 0,
        stockAlertDays: 0,
        forecastDailySales: 0,
        stockAlertQty: 0,
        minPurchaseQty: 0,
        purchaseUpperLimit: 0,
        manualOverrides: { stockAlertQty: false, minPurchaseQty: false },
      },
      createdAt: Date.now(),
    },
  ];
}
```

- [ ] **Step 3: 修改 ProductTable 使用 useLocalStorage 读取 products_data_v1**

Update `src/pages/Products/components/ProductTable.tsx`:
1) 将内部 `mockData` 替换为 `useLocalStorage<Product[]>(PRODUCTS_KEY, defaultProductsFromLegacyMock())`
2) 保留原表格展示字段映射（sku/cnName/status/…），暂时不补齐所有列

示例片段：
```tsx
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PRODUCTS_KEY, defaultProductsFromLegacyMock } from '../data';
import type { Product } from '../types';
```

```tsx
const [products, setProducts] = useLocalStorage<Product[]>(PRODUCTS_KEY, defaultProductsFromLegacyMock());
const skuOptions = products.map(p => p.sku);
```

并将原 `mockData.map` 替换为 `products.map`。

- [ ] **Step 4: 验证 typescript**

Run:
```bash
npm run check
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/Products/types.ts src/pages/Products/data.ts src/pages/Products/components/ProductTable.tsx
git commit -m "feat(products): persist products list to localStorage"
```

---

### Task 2: 实现 SKU 校验与联动计算纯函数（可测）

**Files:**
- Create: `src/pages/Products/addProduct/validators.ts`
- Create: `src/pages/Products/addProduct/calculations.ts`
- Test: `src/pages/Products/__tests__/validators.test.ts`
- Test: `src/pages/Products/__tests__/calculations.test.ts`

- [ ] **Step 1: validators.test.ts（先写失败测试）**

Create `src/pages/Products/__tests__/validators.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { validateSku } from '../addProduct/validators';

describe('validateSku', () => {
  it('rejects empty sku', () => {
    expect(validateSku({ sku: '   ', existingSkus: [] }).ok).toBe(false);
  });

  it('rejects blacklist chars', () => {
    const res = validateSku({ sku: 'ABC_123', existingSkus: [] });
    expect(res.ok).toBe(false);
  });

  it('rejects duplicates', () => {
    const res = validateSku({ sku: 'A1', existingSkus: ['A1'] });
    expect(res.ok).toBe(false);
  });

  it('accepts normal sku', () => {
    expect(validateSku({ sku: 'A1-BC', existingSkus: ['X'] }).ok).toBe(true);
  });
});
```

- [ ] **Step 2: calculations.test.ts（先写失败测试）**

Create `src/pages/Products/__tests__/calculations.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { calcMinPurchaseQty, calcStockAlertQty } from '../addProduct/calculations';

describe('calculations', () => {
  it('calcStockAlertQty', () => {
    expect(calcStockAlertQty({ stockAlertDays: 5, forecastDailySales: 2 })).toBe(10);
  });

  it('calcMinPurchaseQty uses max(candidate, moq)', () => {
    expect(calcMinPurchaseQty({ purchaseDays: 10, forecastDailySales: 2, moq: 30 })).toBe(30);
    expect(calcMinPurchaseQty({ purchaseDays: 10, forecastDailySales: 2, moq: 0 })).toBe(20);
  });
});
```

- [ ] **Step 3: 实现 validators.ts**

Create `src/pages/Products/addProduct/validators.ts`:
```ts
const blacklist = ["’", "、", "“", "!", "$", "?", "_", "{", "}"] as const;

export function validateSku(params: { sku: string; existingSkus: string[] }) {
  const sku = params.sku.trim();
  if (!sku) return { ok: false as const, message: '库存SKU不能为空' };
  if (blacklist.some((c) => sku.includes(c))) {
    return { ok: false as const, message: '库存SKU不支持特殊字符：’、“、!、$、?、_、{、}' };
  }
  if (params.existingSkus.includes(sku)) return { ok: false as const, message: '库存SKU已存在，请更换' };
  return { ok: true as const, value: sku };
}

export function validateUpperLimit(v: number) {
  if (Number.isNaN(v)) return { ok: false as const, message: '采购上限必须为数字' };
  if (v < 0 || v > 100000) return { ok: false as const, message: '采购上限范围为 0~100000' };
  return { ok: true as const };
}
```

- [ ] **Step 4: 实现 calculations.ts**

Create `src/pages/Products/addProduct/calculations.ts`:
```ts
export function safeNumber(v: unknown) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function calcStockAlertQty(params: { stockAlertDays: number; forecastDailySales: number }) {
  const days = safeNumber(params.stockAlertDays);
  const sales = safeNumber(params.forecastDailySales);
  return Math.max(0, Math.floor(days * sales));
}

export function calcMinPurchaseQty(params: { purchaseDays: number; forecastDailySales: number; moq: number }) {
  const days = safeNumber(params.purchaseDays);
  const sales = safeNumber(params.forecastDailySales);
  const moq = safeNumber(params.moq);
  const candidate = Math.max(0, Math.floor(days * sales));
  return Math.max(candidate, Math.floor(moq));
}
```

- [ ] **Step 5: 运行测试与类型检查**

```bash
npm run test:run
npm run check
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/Products/addProduct/validators.ts src/pages/Products/addProduct/calculations.ts src/pages/Products/__tests__/validators.test.ts src/pages/Products/__tests__/calculations.test.ts
git commit -m "feat(add-product): add validators and warehouse calculations"
```

---

### Task 3: 目录管理/品牌管理弹框（CRUD + 引用保护）

**Files:**
- Create: `src/pages/Products/addProduct/CategoryManagerDialog.tsx`
- Create: `src/pages/Products/addProduct/BrandManagerDialog.tsx`
- Modify: `src/pages/Products/Add.tsx`

- [ ] **Step 1: CategoryManagerDialog 实现（useLocalStorage + CRUD）**

要求：
- 使用 `useLocalStorage<Category[]>(CATEGORIES_KEY, defaultCategories)`
- 列表：名称/描述/报关编码/多属性/父级
- 新增/编辑使用 Dialog 内表单（可复用同一个编辑区）
- 删除前校验 products_data_v1 是否引用该 categoryId

- [ ] **Step 2: BrandManagerDialog 实现（useLocalStorage + CRUD）**

要求：
- 使用 `useLocalStorage<Brand[]>(BRANDS_KEY, defaultBrands)`
- 删除前校验 products_data_v1 是否引用该 brandId

- [ ] **Step 3: 在 Add.tsx 先挂载两个管理弹框（占位按钮可点击打开）**

- [ ] **Step 4: check/test**

```bash
npm run check
npm run test:run
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/Products/addProduct/CategoryManagerDialog.tsx src/pages/Products/addProduct/BrandManagerDialog.tsx src/pages/Products/Add.tsx
git commit -m "feat(add-product): add category and brand manager dialogs"
```

---

### Task 4: AddProductForm（字段分区、校验、联动计算、保存并返回）

**Files:**
- Create: `src/pages/Products/addProduct/AddProductForm.tsx`
- Modify: `src/pages/Products/Add.tsx`

- [ ] **Step 1: 实现 AddProductForm 受控表单 state**

要求：
- 按 spec 三分区渲染：基本信息 / 扩展属性 / 仓库信息
- 必填字段：sku/cnName/status/shape/warehouse
- SKU：onBlur 或保存时校验（黑名单+唯一性）
- 错误展示：字段下方红字；保存失败滚动到第一处错误（可用 `ref.scrollIntoView()`）

- [ ] **Step 2: 联动计算（实时 + 可覆盖）**

要求：
- 输入 `forecastDailySales` / `purchaseDays` / `stockAlertDays` 时：
  - 若未手动覆盖：自动回填 `stockAlertQty` 与 `minPurchaseQty`
  - 起订量 moq：第一版从供应商关联取不到则按 0
- 字段被用户编辑后，设置 `manualOverrides.stockAlertQty/minPurchaseQty = true`
- 提供“恢复默认计算值”按钮：清除覆盖并立刻回填默认值

- [ ] **Step 3: 保存并返回**

要求：
- 校验通过后，构造 `Product`，插入到 `products_data_v1` 数组头部
- `navigate('/products')`

- [ ] **Step 4: Add.tsx 替换占位为 AddProductForm**

- [ ] **Step 5: check/test**

```bash
npm run check
npm run test:run
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/Products/addProduct/AddProductForm.tsx src/pages/Products/Add.tsx
git commit -m "feat(add-product): implement add product page with validation and calculations"
```

---

### Task 5: 手动验收 + 构建

- [ ] **Step 1: 启动 dev 并走查**

```bash
npm run dev
```

验收：
- /products/add 输入必填缺失 → 保存提示错误并定位
- SKU 输入包含 `_` 或 `{` → 报错
- 保存成功返回 /products 且新 SKU 在列表顶部
- 目录/品牌管理弹框新增一个选项 → 回到添加页下拉可选
- 仓库联动：输入预测日销量/采购天数/警戒天数 → 默认计算；手动改后不再被覆盖；点“恢复默认”恢复

- [ ] **Step 2: 构建校验**

```bash
npm run build
```

