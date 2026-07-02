# 采购建议（通用能力优先）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在「采购建议」页面实现通用能力：必选筛选项、按供应商分组、加入计划按采购员拆分、忽略（本次/永久）与忽略管理、行内修改采购员。

**Architecture:** 保持现有本地 mock + localStorage 状态流；新增少量纯函数工具（过滤/汇总/分组）用于测试与复用；UI 继续复用现有 shadcn/ui 组件（Popover+Command+Dialog）。

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui + localStorage（现有 useLocalStorage hook）

---

## Spec

- 设计文档：`docs/superpowers/specs/2026-04-30-purchase-suggestions-unified-design.md`

## Files Overview

**Modify**
- `src/pages/PurchaseSuggestions/index.tsx`
- `src/pages/PurchaseSuggestions/components/SuggestionsFilter.tsx`
- `src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx`
- `src/pages/PurchasePlans/mockData.ts`
- `src/pages/PurchasePlans/components/PlansTable.tsx`

**Create**
- `src/pages/PurchaseSuggestions/types.ts`
- `src/pages/PurchaseSuggestions/utils.ts`
- `src/pages/PurchaseSuggestions/components/IgnoreChoiceDialog.tsx`
- `src/pages/PurchaseSuggestions/components/IgnoredManagerDrawer.tsx`
- `src/pages/PurchasePlans/types.ts`
- `src/pages/PurchasePlans/utils.ts`
- `src/pages/PurchaseSuggestions/__tests__/utils.test.ts`
- `src/pages/PurchasePlans/__tests__/utils.test.ts`
- `vitest.config.ts`
- `src/test/setup.ts`

---

### Task 1: 引入测试框架（Vitest）并确保基础脚本可跑

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: 安装依赖**

Run:
```bash
npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: 增加 package.json scripts**

Edit `package.json` scripts to include:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "check": "tsc -b --noEmit",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

- [ ] **Step 3: 新增 vitest 配置**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true
  }
});
```

- [ ] **Step 4: 新增测试初始化**

Create `src/test/setup.ts`:
```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 5: 验证测试命令可运行**

Run:
```bash
npm run test:run
```

Expected: `No test files found`（此时尚未添加测试文件，属于正常）

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts
git commit -m "test: add vitest baseline"
```

---

### Task 2: 抽象采购建议通用类型与纯函数（便于测试与复用）

**Files:**
- Create: `src/pages/PurchaseSuggestions/types.ts`
- Create: `src/pages/PurchaseSuggestions/utils.ts`
- Test: `src/pages/PurchaseSuggestions/__tests__/utils.test.ts`

- [ ] **Step 1: 新增 types**

Create `src/pages/PurchaseSuggestions/types.ts`:
```ts
export type ActiveTab = 'stock' | 'shortage';

export type SuggestionsFilters = {
  keyword: string;
  warehouses: string[];
  supplierName: string;
  buyer: string;
};

export type IgnoreType = 'once' | 'permanent';

export type IgnoredSuggestion = {
  id: string;
  sku: string;
  name: string;
  warehouse: string;
  supplierName: string;
  buyer: string;
  ignoreType: IgnoreType;
  ignoredAt: number;
};
```

- [ ] **Step 2: 新增纯函数工具**

Create `src/pages/PurchaseSuggestions/utils.ts`:
```ts
import type { ActiveTab, IgnoredSuggestion, SuggestionsFilters } from './types';
import type { SuggestionGroup, SuggestionItem } from './mockData';

export function isShortageItem(item: SuggestionItem) {
  return item.stock <= 0 || (item.stock + item.transit < item.unshipped);
}

export function normalizeText(v: string) {
  return v.trim().toLowerCase();
}

export function matchesKeyword(item: SuggestionItem, keyword: string) {
  const k = normalizeText(keyword);
  if (!k) return true;
  return (
    normalizeText(item.sku).includes(k) ||
    normalizeText(item.name).includes(k) ||
    normalizeText(item.buyer).includes(k)
  );
}

export function buildIgnoreIndex(ignored: IgnoredSuggestion[]) {
  const byId = new Set<string>();
  const permanentSku = new Set<string>();
  ignored.forEach((r) => {
    byId.add(r.id);
    if (r.ignoreType === 'permanent') permanentSku.add(r.sku);
  });
  return { byId, permanentSku };
}

export function filterGroups(params: {
  groups: SuggestionGroup[];
  activeTab: ActiveTab;
  filters: SuggestionsFilters;
  ignored: IgnoredSuggestion[];
}) {
  const { groups, activeTab, filters, ignored } = params;
  const { byId, permanentSku } = buildIgnoreIndex(ignored);

  const next = groups
    .map((g) => {
      const items = g.items.filter((item) => {
        if (activeTab === 'shortage' && !isShortageItem(item)) return false;
        if (byId.has(item.id)) return false;
        if (permanentSku.has(item.sku)) return false;
        if (filters.supplierName && g.supplierName !== filters.supplierName) return false;
        if (filters.buyer && item.buyer !== filters.buyer) return false;
        if (filters.warehouses.length > 0 && !filters.warehouses.includes(item.warehouse)) return false;
        if (!matchesKeyword(item, filters.keyword)) return false;
        return true;
      });

      return {
        ...g,
        items,
        totalProducts: items.length,
        totalSuggestedQuantity: items.reduce((sum, i) => sum + i.suggestedQuantity, 0),
        totalSuggestedPrice: items.reduce((sum, i) => sum + i.totalPrice, 0)
      };
    })
    .filter((g) => g.items.length > 0);

  return next;
}

export function removeItemsFromGroups(groups: SuggestionGroup[], itemIds: string[]) {
  if (itemIds.length === 0) return groups;
  const idSet = new Set(itemIds);
  return groups
    .map((g) => {
      const items = g.items.filter((i) => !idSet.has(i.id));
      return {
        ...g,
        items,
        totalProducts: items.length,
        totalSuggestedQuantity: items.reduce((sum, i) => sum + i.suggestedQuantity, 0),
        totalSuggestedPrice: items.reduce((sum, i) => sum + i.totalPrice, 0)
      };
    })
    .filter((g) => g.items.length > 0);
}
```

- [ ] **Step 3: 添加单测（先写测试，再实现修正）**

Create `src/pages/PurchaseSuggestions/__tests__/utils.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { mockSuggestions } from '../mockData';
import { filterGroups } from '../utils';

describe('PurchaseSuggestions utils', () => {
  it('filters by tab shortage', () => {
    const res = filterGroups({
      groups: mockSuggestions,
      activeTab: 'shortage',
      filters: { keyword: '', warehouses: [], supplierName: '', buyer: '' },
      ignored: []
    });
    const all = res.flatMap((g) => g.items);
    expect(all.length).toBeGreaterThan(0);
    expect(all.every((i) => i.stock <= 0 || (i.stock + i.transit < i.unshipped))).toBe(true);
  });

  it('filters by buyer', () => {
    const res = filterGroups({
      groups: mockSuggestions,
      activeTab: 'stock',
      filters: { keyword: '', warehouses: [], supplierName: '', buyer: '张伟' },
      ignored: []
    });
    expect(res.flatMap((g) => g.items).every((i) => i.buyer === '张伟')).toBe(true);
  });

  it('filters by ignored once id', () => {
    const first = mockSuggestions[0].items[0];
    const res = filterGroups({
      groups: mockSuggestions,
      activeTab: 'stock',
      filters: { keyword: '', warehouses: [], supplierName: '', buyer: '' },
      ignored: [
        {
          id: first.id,
          sku: first.sku,
          name: first.name,
          warehouse: first.warehouse,
          supplierName: mockSuggestions[0].supplierName,
          buyer: first.buyer,
          ignoreType: 'once',
          ignoredAt: Date.now()
        }
      ]
    });
    expect(res.flatMap((g) => g.items).some((i) => i.id === first.id)).toBe(false);
  });
});
```

- [ ] **Step 4: 运行单测**

Run:
```bash
npm run test:run
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/PurchaseSuggestions/types.ts src/pages/PurchaseSuggestions/utils.ts src/pages/PurchaseSuggestions/__tests__/utils.test.ts
git commit -m "feat(purchase-suggestions): add unified types and filter utilities"
```

---

### Task 3: 采购建议筛选区改造为“必选四项”并向上抬升状态

**Files:**
- Modify: `src/pages/PurchaseSuggestions/index.tsx`
- Modify: `src/pages/PurchaseSuggestions/components/SuggestionsFilter.tsx`
- Modify: `src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx`

- [ ] **Step 1: 在页面容器维护 filters 状态**

Edit `src/pages/PurchaseSuggestions/index.tsx` to:
```tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';
import SuggestionsFilter from './components/SuggestionsFilter';
import SuggestionsTable from './components/SuggestionsTable';
import type { SuggestionsFilters } from './types';

export default function PurchaseSuggestions() {
  const [activeTab, setActiveTab] = useState<'stock' | 'shortage'>('stock');
  const [filters, setFilters] = useState<SuggestionsFilters>({
    keyword: '',
    warehouses: [],
    supplierName: '',
    buyer: ''
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-6 mb-4 px-2">
        <h1 className="text-[18px] font-medium text-gray-800">采购建议</h1>
        <div className="flex items-center gap-6 text-[14px]">
          <div
            className={cn(
              'cursor-pointer pb-1 transition-colors',
              activeTab === 'stock'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-800 border-b-2 border-transparent'
            )}
            onClick={() => setActiveTab('stock')}
          >
            备货建议
          </div>
          <div
            className={cn(
              'cursor-pointer pb-1 transition-colors',
              activeTab === 'shortage'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-800 border-b-2 border-transparent'
            )}
            onClick={() => setActiveTab('shortage')}
          >
            缺货建议
          </div>
        </div>
      </div>

      <SuggestionsFilter value={filters} onChange={setFilters} />
      <SuggestionsTable activeTab={activeTab} filters={filters} />
    </div>
  );
}
```

- [ ] **Step 2: 调整筛选组件为受控组件并补齐“采购员”下拉**

Update `src/pages/PurchaseSuggestions/components/SuggestionsFilter.tsx` signature and internal handlers:
```tsx
import { FeatureMarker } from '@/components/FeatureMarker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import type { SuggestionsFilters } from '../types';
import { useState } from 'react';

const warehouses = [
  { value: 'FBA-US-东部', label: 'FBA-US-东部' },
  { value: 'FBA-US-西部', label: 'FBA-US-西部' },
  { value: 'FBA-DE-法兰克福', label: 'FBA-DE-法兰克福' },
  { value: 'FBA-UK-伦敦', label: 'FBA-UK-伦敦' },
  { value: 'FBA-JP-东京仓', label: 'FBA-JP-东京仓' }
];

const suppliers = [
  { value: '深圳优声电子有限公司', label: '深圳优声电子有限公司' },
  { value: '广州能量科技有限公司', label: '广州能量科技有限公司' },
  { value: '东莞线材工厂', label: '东莞线材工厂' },
  { value: '惠州硅胶制品有限公司', label: '惠州硅胶制品有限公司' }
];

const buyers = ['张伟', '李娜', '王强', '刘美希', '陈刚'];

export default function SuggestionsFilter(props: {
  value: SuggestionsFilters;
  onChange: (next: SuggestionsFilters) => void;
}) {
  const { value, onChange } = props;
  const [openSupplier, setOpenSupplier] = useState(false);
  const [openWarehouse, setOpenWarehouse] = useState(false);
  const [openBuyer, setOpenBuyer] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-3 rounded shadow-sm border border-gray-200">
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="库存SKU/商品名称"
          value={value.keyword}
          onChange={(e) => onChange({ ...value, keyword: e.target.value })}
          className="pl-8 h-8 text-[13px] border-gray-300 focus-visible:ring-blue-500"
        />
      </div>

      <Popover open={openWarehouse} onOpenChange={setOpenWarehouse}>
        <PopoverTrigger className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-48 h-8 px-3 text-[13px] border-gray-300 justify-between">
          {value.warehouses.length > 0 ? `已选 ${value.warehouses.length} 个仓库` : '选择仓库...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0" align="start">
          <Command>
            <CommandInput placeholder="搜索仓库..." className="h-8 text-[13px]" />
            <CommandList>
              <CommandEmpty className="py-2 text-center text-[13px]">未找到仓库</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={() => onChange({ ...value, warehouses: [] })} className="text-[13px]">
                  <Check className={cn('mr-2 h-4 w-4', value.warehouses.length === 0 ? 'opacity-100' : 'opacity-0')} />
                  全部
                </CommandItem>
                {warehouses.map((wh) => (
                  <CommandItem
                    key={wh.value}
                    value={wh.value}
                    onSelect={() => {
                      const next = value.warehouses.includes(wh.value)
                        ? value.warehouses.filter((v) => v !== wh.value)
                        : [...value.warehouses, wh.value];
                      onChange({ ...value, warehouses: next });
                    }}
                    className="text-[13px]"
                  >
                    <Check className={cn('mr-2 h-4 w-4', value.warehouses.includes(wh.value) ? 'opacity-100' : 'opacity-0')} />
                    {wh.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
        <PopoverTrigger className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-48 h-8 px-3 text-[13px] border-gray-300 justify-between">
          {value.supplierName ? value.supplierName : '选择供应商...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0" align="start">
          <Command>
            <CommandInput placeholder="搜索供应商..." className="h-8 text-[13px]" />
            <CommandList>
              <CommandEmpty className="py-2 text-center text-[13px]">未找到供应商</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onChange({ ...value, supplierName: '' });
                    setOpenSupplier(false);
                  }}
                  className="text-[13px]"
                >
                  <Check className={cn('mr-2 h-4 w-4', value.supplierName === '' ? 'opacity-100' : 'opacity-0')} />
                  全部
                </CommandItem>
                {suppliers.map((s) => (
                  <CommandItem
                    key={s.value}
                    value={s.value}
                    onSelect={() => {
                      onChange({ ...value, supplierName: s.value });
                      setOpenSupplier(false);
                    }}
                    className="text-[13px]"
                  >
                    <Check className={cn('mr-2 h-4 w-4', value.supplierName === s.value ? 'opacity-100' : 'opacity-0')} />
                    {s.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openBuyer} onOpenChange={setOpenBuyer}>
        <PopoverTrigger className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-40 h-8 px-3 text-[13px] border-gray-300 justify-between">
          {value.buyer ? value.buyer : '选择采购员...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-40 p-0" align="start">
          <Command>
            <CommandInput placeholder="搜索采购员..." className="h-8 text-[13px]" />
            <CommandList>
              <CommandEmpty className="py-2 text-center text-[13px]">未找到采购员</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onChange({ ...value, buyer: '' });
                    setOpenBuyer(false);
                  }}
                  className="text-[13px]"
                >
                  <Check className={cn('mr-2 h-4 w-4', value.buyer === '' ? 'opacity-100' : 'opacity-0')} />
                  全部
                </CommandItem>
                {buyers.map((b) => (
                  <CommandItem
                    key={b}
                    value={b}
                    onSelect={() => {
                      onChange({ ...value, buyer: b });
                      setOpenBuyer(false);
                    }}
                    className="text-[13px]"
                  >
                    <Check className={cn('mr-2 h-4 w-4', value.buyer === b ? 'opacity-100' : 'opacity-0')} />
                    {b}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <FeatureMarker title="重置" description="交互说明：点击执行重置操作。">
        <Button
          variant="ghost"
          className="h-8 px-3 text-[13px] text-gray-500 hover:text-gray-700"
          onClick={() => onChange({ keyword: '', warehouses: [], supplierName: '', buyer: '' })}
        >
          重置
        </Button>
      </FeatureMarker>
    </div>
  );
}
```

- [ ] **Step 3: SuggestionsTable 接收 filters 并应用 filterGroups**

Update `src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx` props and replace `filteredSuggestions` computation with:
```tsx
import type { SuggestionsFilters } from '../types';
import { filterGroups } from '../utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { IgnoredSuggestion } from '../types';

export default function SuggestionsTable({
  activeTab = 'stock',
  filters
}: {
  activeTab?: 'stock' | 'shortage';
  filters: SuggestionsFilters;
}) {
  const [suggestions, setSuggestions] = useLocalStorage<SuggestionGroup[]>(
    'purchase_suggestions_data_v2',
    initialMockSuggestions
  );
  const [ignored, setIgnored] = useLocalStorage<IgnoredSuggestion[]>(
    'purchase_suggestions_ignored_v1',
    []
  );

  const filteredSuggestions = filterGroups({
    groups: suggestions,
    activeTab,
    filters,
    ignored
  });
```

- [ ] **Step 4: Typecheck & lint**

Run:
```bash
npm run check
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/PurchaseSuggestions/index.tsx src/pages/PurchaseSuggestions/components/SuggestionsFilter.tsx src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx
git commit -m "feat(purchase-suggestions): wire required filters and apply filtering"
```

---

### Task 4: 忽略（本次/永久）与忽略管理（同页抽屉/弹窗）

**Files:**
- Create: `src/pages/PurchaseSuggestions/components/IgnoreChoiceDialog.tsx`
- Create: `src/pages/PurchaseSuggestions/components/IgnoredManagerDrawer.tsx`
- Modify: `src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx`

- [ ] **Step 1: IgnoreChoiceDialog**

Create `src/pages/PurchaseSuggestions/components/IgnoreChoiceDialog.tsx`:
```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { IgnoreType } from '../types';

export default function IgnoreChoiceDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (type: IgnoreType) => void;
}) {
  const { open, onOpenChange, onConfirm } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>忽略建议</DialogTitle>
          <DialogDescription className="py-2 text-[13px] text-gray-600">
            请选择忽略类型：本次忽略仅隐藏本次建议；永久忽略将不再生成该SKU的采购建议（直到恢复）。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="outline" onClick={() => onConfirm('once')}>
            本次忽略
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onConfirm('permanent')}>
            永久忽略
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: IgnoredManagerDrawer**

Create `src/pages/PurchaseSuggestions/components/IgnoredManagerDrawer.tsx`:
```tsx
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { IgnoredSuggestion } from '../types';

export default function IgnoredManagerDrawer(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rows: IgnoredSuggestion[];
  onRestore: (id: string) => void;
  onClear: (id: string) => void;
}) {
  const { open, onOpenChange, rows, onRestore, onClear } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[980px]">
        <DialogHeader>
          <DialogTitle>忽略管理</DialogTitle>
        </DialogHeader>

        <div className="border border-gray-200 rounded overflow-hidden max-h-[520px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead className="bg-[#F5F6F8] sticky top-0 z-10">
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="p-2 min-w-[120px]">库存SKU</th>
                <th className="p-2 min-w-[200px]">中文名称</th>
                <th className="p-2 min-w-[120px]">仓库</th>
                <th className="p-2 min-w-[160px]">供应商</th>
                <th className="p-2 min-w-[100px]">采购员</th>
                <th className="p-2 min-w-[100px]">忽略类型</th>
                <th className="p-2 min-w-[140px]">忽略时间</th>
                <th className="p-2 w-[140px] text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-2 text-blue-600">{r.sku}</td>
                  <td className="p-2 text-gray-700">{r.name}</td>
                  <td className="p-2 text-gray-600">{r.warehouse}</td>
                  <td className="p-2 text-gray-600">{r.supplierName}</td>
                  <td className="p-2 text-gray-600">{r.buyer}</td>
                  <td className="p-2 text-gray-600">{r.ignoreType === 'permanent' ? '永久忽略' : '本次忽略'}</td>
                  <td className="p-2 text-gray-500">{new Date(r.ignoredAt).toLocaleString()}</td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-2 text-[12px]">
                      <button className="text-blue-600 hover:underline" onClick={() => onRestore(r.id)}>
                        恢复
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-gray-500 hover:text-gray-700" onClick={() => onClear(r.id)}>
                        清除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="p-8 text-center text-gray-500" colSpan={8}>
                    暂无忽略记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: 在 SuggestionsTable 串联忽略流程**

In `src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx`:
1) 新增 state：
```tsx
const [ignoreChoiceOpen, setIgnoreChoiceOpen] = useState(false);
const [ignoreManagerOpen, setIgnoreManagerOpen] = useState(false);
```

2) `handleBatchIgnore` 替换为打开选择弹窗：
```ts
const handleBatchIgnore = () => {
  if (selectedItems.length === 0) {
    setAlertMessage('请先勾选数据');
    setAlertOpen(true);
    return;
  }
  setTargetItemIds(selectedItems);
  setIgnoreChoiceOpen(true);
};
```

3) 行级忽略同样打开选择弹窗（替换原 confirmIgnoreOpen 逻辑）：
```tsx
onClick={() => {
  setTargetItemIds([item.id]);
  setIgnoreChoiceOpen(true);
}}
```

4) 实现 `confirmIgnore(type)` 写入 ignored：
```ts
const confirmIgnore = (type: 'once' | 'permanent') => {
  const items = suggestions.flatMap((g) =>
    g.items
      .filter((i) => targetItemIds.includes(i.id))
      .map((i) => ({ item: i, supplierName: g.supplierName }))
  );

  const now = Date.now();
  const nextRows = items.map(({ item, supplierName }) => ({
    id: item.id,
    sku: item.sku,
    name: item.name,
    warehouse: item.warehouse,
    supplierName,
    buyer: item.buyer,
    ignoreType: type,
    ignoredAt: now
  }));

  setIgnored((prev) => {
    const exists = new Set(prev.map((r) => r.id));
    return [...prev, ...nextRows.filter((r) => !exists.has(r.id))];
  });

  setSelectedItems((prev) => prev.filter((id) => !targetItemIds.includes(id)));
  setTargetItemIds([]);
  setIgnoreChoiceOpen(false);
};
```

5) 添加忽略管理入口（建议放在“批量操作”下拉里新增一项）：
```tsx
<DropdownMenuItem onClick={() => setIgnoreManagerOpen(true)}>忽略管理</DropdownMenuItem>
```

6) 渲染组件：
```tsx
<IgnoreChoiceDialog
  open={ignoreChoiceOpen}
  onOpenChange={setIgnoreChoiceOpen}
  onConfirm={confirmIgnore}
/>
<IgnoredManagerDrawer
  open={ignoreManagerOpen}
  onOpenChange={setIgnoreManagerOpen}
  rows={ignored}
  onRestore={(id) => setIgnored((prev) => prev.filter((r) => r.id !== id))}
  onClear={(id) => setIgnored((prev) => prev.filter((r) => r.id !== id))}
/>
```

- [ ] **Step 4: 移除旧的 confirmIgnoreOpen Dialog（避免重复 UI）**

Delete the old confirmIgnoreOpen state and its `<Dialog open={confirmIgnoreOpen} ...>` block.

- [ ] **Step 5: 运行 check/lint/test**

```bash
npm run check
npm run lint
npm run test:run
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/PurchaseSuggestions/components/IgnoreChoiceDialog.tsx src/pages/PurchaseSuggestions/components/IgnoredManagerDrawer.tsx src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx
git commit -m "feat(purchase-suggestions): add ignore type and ignore manager"
```

---

### Task 5: 加入采购计划按采购员拆分（同步改造采购计划页以按采购员分组展示）

**Files:**
- Create: `src/pages/PurchasePlans/types.ts`
- Create: `src/pages/PurchasePlans/utils.ts`
- Modify: `src/pages/PurchasePlans/mockData.ts`
- Modify: `src/pages/PurchasePlans/components/PlansTable.tsx`
- Modify: `src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx`
- Test: `src/pages/PurchasePlans/__tests__/utils.test.ts`

- [ ] **Step 1: 新增 PurchasePlans types**

Create `src/pages/PurchasePlans/types.ts`:
```ts
export type PlanItem = {
  id: string;
  buyer: string;
  supplierName: string;
  sku: string;
  name: string;
  warehouse: string;
  quantity: number;
  purchasePrice: number;
  inbound: string;
  loss: number;
  notes: string;
  logistics: string;
  status: string;
  source: string;
  creator: string;
  createTime: string;
};

export type PlanGroup = {
  planNumber: string;
  buyerName: string;
  totalProducts: number;
  totalQuantity: number;
  totalPrice: number;
  items: PlanItem[];
};
```

- [ ] **Step 2: 新增按采购员分组的纯函数**

Create `src/pages/PurchasePlans/utils.ts`:
```ts
import type { PlanGroup, PlanItem } from './types';

export function mergeIntoBuyerGroups(params: {
  prev: PlanGroup[];
  incoming: Array<{
    id: string;
    buyer: string;
    supplierName: string;
    sku: string;
    name: string;
    warehouse: string;
    suggestedQuantity?: number;
    quantity?: number;
    purchasePrice?: number;
    notes?: string;
    source?: string;
  }>;
}) {
  const { prev, incoming } = params;
  const next: PlanGroup[] = prev.map((g) => ({ ...g, items: [...g.items] }));

  const nowStr = new Date().toLocaleString();

  incoming.forEach((item) => {
    const buyerName = item.buyer || '未分配';
    let group = next.find((g) => g.buyerName === buyerName);
    if (!group) {
      group = {
        planNumber: 'JH' + new Date().toISOString().replace(/\\D/g, '').slice(0, 14) + Math.floor(Math.random() * 1000),
        buyerName,
        totalProducts: 0,
        totalQuantity: 0,
        totalPrice: 0,
        items: []
      };
      next.push(group);
    }

    const newItemId = `plan-${item.id}`;
    if (group.items.some((i) => i.id === newItemId)) return;

    const quantity = item.suggestedQuantity ?? item.quantity ?? 0;
    const purchasePrice = item.purchasePrice ?? 0;
    const planItem: PlanItem = {
      id: newItemId,
      buyer: buyerName,
      supplierName: item.supplierName || '未知供应商',
      sku: item.sku,
      name: item.name,
      warehouse: item.warehouse || '默认仓库',
      quantity,
      purchasePrice,
      inbound: '--',
      loss: 0,
      notes: item.notes || '--',
      logistics: '--',
      status: '未采购',
      source: item.source || '采购建议',
      creator: '当前用户',
      createTime: nowStr
    };

    group.items.push(planItem);
  });

  return next
    .map((g) => {
      const totalQuantity = g.items.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = g.items.reduce((sum, i) => sum + i.quantity * i.purchasePrice, 0);
      return {
        ...g,
        totalProducts: g.items.length,
        totalQuantity,
        totalPrice
      };
    })
    .sort((a, b) => a.buyerName.localeCompare(b.buyerName, 'zh'));
}
```

- [ ] **Step 3: 为 mergeIntoBuyerGroups 添加单测**

Create `src/pages/PurchasePlans/__tests__/utils.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { mergeIntoBuyerGroups } from '../utils';

describe('PurchasePlans utils', () => {
  it('groups incoming items by buyer', () => {
    const next = mergeIntoBuyerGroups({
      prev: [],
      incoming: [
        { id: '1', buyer: '张伟', supplierName: 'A', sku: 'S1', name: 'N1', warehouse: 'W', suggestedQuantity: 2, purchasePrice: 10 },
        { id: '2', buyer: '王芳', supplierName: 'B', sku: 'S2', name: 'N2', warehouse: 'W', suggestedQuantity: 3, purchasePrice: 5 }
      ]
    });
    expect(next.length).toBe(2);
    expect(next.find((g) => g.buyerName === '张伟')?.totalQuantity).toBe(2);
  });
});
```

- [ ] **Step 4: 改造 PurchasePlans mockData 与 PlansTable 使用新类型**

Update `src/pages/PurchasePlans/mockData.ts` to export `mockPlans: PlanGroup[]` and remove old `supplierName` group key.

Example minimal mock:
```ts
import type { PlanGroup } from './types';

export const mockPlans: PlanGroup[] = [
  {
    planNumber: 'JH20260408092304000',
    buyerName: '张伟',
    totalProducts: 1,
    totalQuantity: 10,
    totalPrice: 1000,
    items: [
      {
        id: 'plan-p1',
        buyer: '张伟',
        supplierName: '深圳优声电子有限公司',
        sku: 'CN-BT-001',
        name: '无线蓝牙耳机 Pro Max',
        warehouse: 'FBA-US-东部',
        quantity: 10,
        purchasePrice: 100,
        inbound: '--',
        loss: 0,
        notes: '--',
        logistics: '--',
        status: '未采购',
        source: '备货建议',
        creator: '系统',
        createTime: '2026/4/8 09:23:04'
      }
    ]
  }
];
```

In `src/pages/PurchasePlans/components/PlansTable.tsx`:
- 把 `useLocalStorage('purchase_plans_data_v2', mockPlans)` 的类型改为 `useLocalStorage<PlanGroup[]>`
- 把 group header 展示从 “供应商” 改为 “采购员”
- 新增一列 “供应商” 在表格列头中，并在行内展示 `item.supplierName`
- `handleGenerateOrder` 和行级 “生成采购单” 组装 `selectedItems` 时，supplierName 取 `item.supplierName`
- 用 `mergeIntoBuyerGroups` 合并 `location.state.newPlans`

合并 state 的 effect 最终形态示例（替换原逻辑）：
```ts
import { mergeIntoBuyerGroups } from '../utils';

React.useEffect(() => {
  if (location.state?.newPlans && location.state.newPlans.length > 0) {
    if (processedStateRef.current === location.state.newPlans) return;
    processedStateRef.current = location.state.newPlans;

    setPlans((prev) => mergeIntoBuyerGroups({ prev: Array.isArray(prev) ? prev : [], incoming: location.state.newPlans }));
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location.state, navigate, location.pathname, setPlans]);
```

- [ ] **Step 5: 采购建议页“确认加入计划”按采购员拆分写入计划**

In `src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx` confirm-plan onClick:
- 构造 `itemsToPlan` 时保留 supplierName
- 直接 `localStorage` 写入改为：读取 `purchase_plans_data_v2` → 使用 `mergeIntoBuyerGroups` 合并 → 写回
- 然后从 suggestions 中移除 targetItemIds（调用 `removeItemsFromGroups`）

关键片段（替换原“按供应商分组写入 plans”逻辑）：
```ts
import { mergeIntoBuyerGroups } from '@/pages/PurchasePlans/utils';
import type { PlanGroup } from '@/pages/PurchasePlans/types';
import { removeItemsFromGroups } from '../utils';

const itemsToPlan = suggestions.flatMap((g) =>
  g.items
    .filter((i) => targetItemIds.includes(i.id))
    .map((i) => ({ ...i, supplierName: g.supplierName }))
);

const existingPlansStr = localStorage.getItem('purchase_plans_data_v2');
const parsed = existingPlansStr ? JSON.parse(existingPlansStr) : [];
const prevPlans: PlanGroup[] = Array.isArray(parsed) ? parsed : [];
const nextPlans = mergeIntoBuyerGroups({ prev: prevPlans, incoming: itemsToPlan });
localStorage.setItem('purchase_plans_data_v2', JSON.stringify(nextPlans));

setSuggestions((prev) => removeItemsFromGroups(prev, targetItemIds));
```

- [ ] **Step 6: 运行 check/lint/test**

```bash
npm run check
npm run lint
npm run test:run
```

- [ ] **Step 7: Commit**

```bash
git add src/pages/PurchasePlans/types.ts src/pages/PurchasePlans/utils.ts src/pages/PurchasePlans/__tests__/utils.test.ts src/pages/PurchasePlans/mockData.ts src/pages/PurchasePlans/components/PlansTable.tsx src/pages/PurchaseSuggestions/components/SuggestionsTable.tsx
git commit -m "feat: add purchase plans grouped by buyer and wire add-to-plan"
```

---

### Task 6: 最终验收（手动走查 + 构建校验）

**Files:**
- N/A

- [ ] **Step 1: 本地启动并走查关键路径**

Run:
```bash
npm ci
npm run dev
```

手动验收点：
- 采购建议：筛选区包含 SKU/名称、仓库、供应商、采购员；重置可清空
- 列表按供应商分组；组头汇总 SKU数/建议数/金额
- 勾选多条 → 批量操作：加入采购计划、忽略建议、忽略管理可打开
- 忽略建议：弹出本次/永久选择；确认后列表不再展示；忽略管理可恢复/清除
- 行内修改采购员（在“修改采购员”弹窗中）后，再“加入采购计划”会按采购员分组
- 加入采购计划：成功后 SKU 从建议列表移除；采购计划页按采购员分组出现新数据

- [ ] **Step 2: 构建校验**

Run:
```bash
npm run check
npm run build
```

Expected: exit code 0

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-30-purchase-suggestions-unified.md`. Two execution options:

1. Subagent-Driven (recommended) — I dispatch a fresh subagent per task, review between tasks
2. Inline Execution — Execute tasks in this session using executing-plans with checkpoints

Which approach?

