# 商品页“预测日销量”趋势弹框 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在商品列表“预测日销量”字段右侧 icon 增加点击弹框：支持 SKU 切换（输入+下拉）、日期区间/仓库/平台筛选，点击“查询”用前端 Mock 生成近 30 天日销量折线图（单折线），不引入第三方图表库。

**Architecture:** 以 Dialog 组件承载弹框；用独立的 `salesMock.ts` 生成可复现的时间序列；用独立 `SimpleLineChart.tsx` 渲染 SVG 折线图；弹框内筛选项均为受控 state，点击“查询”时更新 chart data。

**Tech Stack:** React + TypeScript + Tailwind + shadcn/ui（Dialog/Popover/Command/Input/Button）+ Vitest（已接入）

---

## Spec

- `docs/superpowers/specs/2026-05-06-products-sales-trend-dialog-design.md`

## Files Overview

**Modify**
- `src/pages/Products/components/ProductTable.tsx`

**Create**
- `src/pages/Products/components/SalesTrendDialog.tsx`
- `src/pages/Products/components/SimpleLineChart.tsx`
- `src/pages/Products/salesMock.ts`
- `src/pages/Products/__tests__/salesMock.test.ts`

---

### Task 1: 为 Mock 数据生成器编写单测（先失败后通过）

**Files:**
- Create: `src/pages/Products/salesMock.ts`
- Test: `src/pages/Products/__tests__/salesMock.test.ts`

- [ ] **Step 1: 新增测试文件（先写测试）**

Create `src/pages/Products/__tests__/salesMock.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildSalesSeries } from '../salesMock';

describe('salesMock', () => {
  it('is deterministic for same query', () => {
    const q = {
      sku: 'TEST-SKU-1',
      startDate: '2026-05-01',
      endDate: '2026-05-07',
      warehouse: '',
      platform: ''
    };
    const a = buildSalesSeries(q);
    const b = buildSalesSeries(q);
    expect(a.points).toEqual(b.points);
  });

  it('returns points for each date in range', () => {
    const q = {
      sku: 'TEST-SKU-2',
      startDate: '2026-05-01',
      endDate: '2026-05-07',
      warehouse: '',
      platform: ''
    };
    const res = buildSalesSeries(q);
    expect(res.points.length).toBe(7);
    expect(res.points[0].date).toBe('2026-05-01');
    expect(res.points[6].date).toBe('2026-05-07');
  });

  it('sales is non-negative integer', () => {
    const q = {
      sku: 'TEST-SKU-3',
      startDate: '2026-05-01',
      endDate: '2026-05-07',
      warehouse: 'FBA-US-东部',
      platform: 'Amazon'
    };
    const res = buildSalesSeries(q);
    expect(res.points.every(p => Number.isInteger(p.sales) && p.sales >= 0)).toBe(true);
  });
});
```

- [ ] **Step 2: 运行测试确保失败**

Run:
```bash
npm run test:run
```

Expected: FAIL（因为 `buildSalesSeries` 未实现）

- [ ] **Step 3: 实现 salesMock**

Create `src/pages/Products/salesMock.ts`:
```ts
export type SalesQuery = {
  sku: string;
  startDate: string;
  endDate: string;
  warehouse: string;
  platform: string;
};

export type SalesPoint = { date: string; sales: number };

export type SalesSeriesResponse = { sku: string; points: SalesPoint[] };

function toDate(v: string) {
  const [y, m, d] = v.split('-').map((x) => Number(x));
  return new Date(y, m - 1, d);
}

export function listDateRange(start: string, end: string) {
  const s = toDate(start);
  const e = toDate(end);
  const out: string[] = [];
  const cur = new Date(s);
  while (cur <= e) {
    const yyyy = cur.getFullYear();
    const mm = String(cur.getMonth() + 1).padStart(2, '0');
    const dd = String(cur.getDate()).padStart(2, '0');
    out.push(`${yyyy}-${mm}-${dd}`);
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function seededRandom(seedStr: string) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function next() {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildSalesSeries(query: SalesQuery): SalesSeriesResponse {
  const { sku, startDate, endDate, warehouse, platform } = query;
  const seed = `${sku}|${startDate}|${endDate}|${warehouse}|${platform}`;
  const rand = seededRandom(seed);
  const dates = listDateRange(startDate, endDate);

  const spikeCount = Math.max(2, Math.min(5, Math.floor(dates.length / 7)));
  const spikes = new Set<number>();
  while (spikes.size < spikeCount && dates.length > 0) {
    spikes.add(Math.floor(rand() * dates.length));
  }

  const points = dates.map((date, idx) => {
    const sales = spikes.has(idx) ? Math.max(1, Math.floor(rand() * 8) + 1) : 0;
    return { date, sales };
  });

  return { sku, points };
}
```

- [ ] **Step 4: 运行测试确保通过**

Run:
```bash
npm run test:run
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Products/salesMock.ts src/pages/Products/__tests__/salesMock.test.ts
git commit -m "feat(products): add sales trend mock generator"
```

---

### Task 2: 实现轻量 SVG 折线图组件

**Files:**
- Create: `src/pages/Products/components/SimpleLineChart.tsx`

- [ ] **Step 1: 新增 SimpleLineChart**

Create `src/pages/Products/components/SimpleLineChart.tsx`:
```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

type Point = { date: string; value: number };

export default function SimpleLineChart(props: {
  points: Point[];
  height?: number;
  className?: string;
}) {
  const { points, height = 320, className } = props;
  const width = 900;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 28;

  if (!points || points.length === 0) {
    return (
      <div className={cn('h-[320px] flex items-center justify-center text-gray-500', className)}>
        暂无数据
      </div>
    );
  }

  const values = points.map((p) => p.value);
  const max = Math.max(1, ...values);
  const min = 0;
  const w = width - padL - padR;
  const h = height - padT - padB;

  const x = (i: number) => padL + (points.length === 1 ? 0 : (i / (points.length - 1)) * w);
  const y = (v: number) => padT + ((max - v) / (max - min)) * h;

  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(p.value).toFixed(2)}`)
    .join(' ');

  const yTicks = [max, Math.round(max / 2), 0];

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <svg width={width} height={height} className="block bg-white">
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={padL} y1={y(t)} x2={width - padR} y2={y(t)} stroke="#E5E7EB" />
            <text x={8} y={y(t) + 4} fontSize="12" fill="#6B7280">
              {t}
            </text>
          </g>
        ))}

        <path d={d} fill="none" stroke="#3B82F6" strokeWidth="2" />
        {points.map((p, i) => (
          <circle key={p.date} cx={x(i)} cy={y(p.value)} r="3" fill="#3B82F6" />
        ))}

        <text x={padL} y={height - 10} fontSize="12" fill="#6B7280">
          {points[0].date}
        </text>
        <text x={width - padR - 70} y={height - 10} fontSize="12" fill="#6B7280">
          {points[points.length - 1].date}
        </text>
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run:
```bash
npm run check
```

Expected: exit 0

- [ ] **Step 3: Commit**

```bash
git add src/pages/Products/components/SimpleLineChart.tsx
git commit -m "feat(products): add simple svg line chart"
```

---

### Task 3: 实现 SalesTrendDialog（筛选 + 查询/重置 + 图表渲染）

**Files:**
- Create: `src/pages/Products/components/SalesTrendDialog.tsx`

- [ ] **Step 1: 新增组件骨架**

Create `src/pages/Products/components/SalesTrendDialog.tsx`:
```tsx
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDownIcon, SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import SimpleLineChart from './SimpleLineChart';
import { buildSalesSeries, type SalesQuery } from '../salesMock';

const platforms = ['', 'Amazon', 'eBay', 'Shopee', 'Temu'];
const warehouses = ['', 'FBA-US-东部', 'FBA-US-西部', 'FBA-DE-法兰克福', 'FBA-UK-伦敦', 'FBA-JP-东京仓'];

function formatRangeEnd(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function defaultRange() {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - 29);
  return { startDate: formatRangeEnd(start), endDate: formatRangeEnd(end) };
}

export default function SalesTrendDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSku: string;
  skuOptions: string[];
}) {
  const { open, onOpenChange, initialSku, skuOptions } = props;
  const range = React.useMemo(() => defaultRange(), []);

  const [skuText, setSkuText] = React.useState(initialSku);
  const [sku, setSku] = React.useState(initialSku);
  const [warehouse, setWarehouse] = React.useState('');
  const [platform, setPlatform] = React.useState('');
  const [startDate, setStartDate] = React.useState(range.startDate);
  const [endDate, setEndDate] = React.useState(range.endDate);
  const [openSkuPicker, setOpenSkuPicker] = React.useState(false);
  const [data, setData] = React.useState(() =>
    buildSalesSeries({ sku: initialSku, startDate: range.startDate, endDate: range.endDate, warehouse: '', platform: '' })
  );

  React.useEffect(() => {
    if (!open) return;
    setSkuText(initialSku);
    setSku(initialSku);
    setWarehouse('');
    setPlatform('');
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    setData(buildSalesSeries({ sku: initialSku, startDate: range.startDate, endDate: range.endDate, warehouse: '', platform: '' }));
  }, [open, initialSku, range.endDate, range.startDate]);

  const query: SalesQuery = { sku, startDate, endDate, warehouse, platform };

  const runQuery = () => {
    setData(buildSalesSeries(query));
  };

  const reset = () => {
    setSkuText(initialSku);
    setSku(initialSku);
    setWarehouse('');
    setPlatform('');
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  };

  const applySkuText = () => {
    const v = skuText.trim();
    if (!v) return;
    const found = skuOptions.find((s) => s.toLowerCase() === v.toLowerCase()) ?? skuOptions.find((s) => s.toLowerCase().includes(v.toLowerCase()));
    setSku(found ?? v);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[980px]">
        <DialogHeader>
          <DialogTitle>日销量趋势 —— {sku}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative w-[220px]">
              <SearchIcon className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <Input
                value={skuText}
                onChange={(e) => setSkuText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applySkuText();
                }}
                className="h-8 pl-8 text-[13px]"
                placeholder="输入SKU回车"
              />
            </div>

            <Popover open={openSkuPicker} onOpenChange={setOpenSkuPicker}>
              <PopoverTrigger className="inline-flex h-8 w-[160px] items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-[13px]">
                {sku || '选择SKU...'}
                <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-[260px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="搜索SKU..." />
                  <CommandList>
                    <CommandEmpty>未找到SKU</CommandEmpty>
                    <CommandGroup>
                      {skuOptions.map((s) => (
                        <CommandItem
                          key={s}
                          value={s}
                          onSelect={() => {
                            setSku(s);
                            setSkuText(s);
                            setOpenSkuPicker(false);
                          }}
                        >
                          <span className="truncate">{s}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-8 w-[150px] text-[13px]" />
            <span className="text-[13px] text-gray-500">至</span>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-8 w-[150px] text-[13px]" />
          </div>

          <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="h-8 w-[160px] rounded-md border border-gray-300 bg-white px-2 text-[13px]">
            {warehouses.map((w) => (
              <option key={w || 'all'} value={w}>
                {w || '全部仓库'}
              </option>
            ))}
          </select>

          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="h-8 w-[160px] rounded-md border border-gray-300 bg-white px-2 text-[13px]">
            {platforms.map((p) => (
              <option key={p || 'all'} value={p}>
                {p || '全部平台'}
              </option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-2">
            <Button className="h-8 bg-blue-600 px-3 text-[13px] hover:bg-blue-700" onClick={runQuery}>
              查询
            </Button>
            <Button variant="outline" className="h-8 px-3 text-[13px]" onClick={reset}>
              重置
            </Button>
          </div>
        </div>

        <div className={cn('mt-3 rounded border border-gray-200 bg-white p-2')}>
          <SimpleLineChart points={data.points.map((p) => ({ date: p.date, value: p.sales }))} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Typecheck**

Run:
```bash
npm run check
```

Expected: exit 0

- [ ] **Step 3: Commit**

```bash
git add src/pages/Products/components/SalesTrendDialog.tsx
git commit -m "feat(products): add sales trend dialog"
```

---

### Task 4: 在 ProductTable 绑定 icon 点击打开弹框

**Files:**
- Modify: `src/pages/Products/components/ProductTable.tsx`

- [ ] **Step 1: 增加弹框 open state 与 skuOptions**

在 `ProductTable.tsx` 顶层组件增加：
```tsx
const [trendOpen, setTrendOpen] = React.useState(false);
const [trendSku, setTrendSku] = React.useState('');
const skuOptions = products.map(p => p.sku);
```

- [ ] **Step 2: 渲染 SalesTrendDialog**

在表格组件 return 末尾新增：
```tsx
<SalesTrendDialog
  open={trendOpen}
  onOpenChange={setTrendOpen}
  initialSku={trendSku}
  skuOptions={skuOptions}
/>
```

- [ ] **Step 3: 给“预测日销量”右侧 icon 绑定 onClick**

在对应单元格 icon：
```tsx
<button
  type="button"
  className="inline-flex h-5 w-5 items-center justify-center rounded border border-blue-400 text-blue-500 hover:bg-blue-50"
  onClick={() => {
    setTrendSku(product.sku);
    setTrendOpen(true);
  }}
>
  📈
</button>
```

- [ ] **Step 4: 运行 check/test**

```bash
npm run check
npm run test:run
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/Products/components/ProductTable.tsx
git commit -m "feat(products): open sales trend dialog from daily sales icon"
```

---

### Task 5: 手动验收与构建

- [ ] **Step 1: 启动开发环境**

```bash
npm run dev
```

- [ ] **Step 2: 手动验收**

验收点：
- 进入「商品」页，点击任一行“预测日销量”右侧 icon，会打开弹框
- 弹框标题展示当前 SKU
- SKU 切换（输入回车/下拉选择）可改变标题 SKU
- 修改日期/仓库/平台后不自动刷新；点击“查询”刷新折线图
- 点击“重置”恢复默认筛选（不自动查询）

- [ ] **Step 3: 构建校验**

```bash
npm run build
```

Expected: exit 0

