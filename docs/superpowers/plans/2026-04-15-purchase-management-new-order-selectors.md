# 采购管理-新订单：供应商/仓库下拉单选与物流弹框宽度 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在采购管理「新订单」页中，将更换供应商/更换仓库弹框改为“下拉单选 + 关键字模糊匹配”（对齐采购建议页筛选），并调整“修改物流信息”弹框宽度以适配内容。

**Architecture:** 在 `NewOrderTable.tsx` 内复用现有 `Popover` + `Command(cmdk)` 组件实现下拉选择，使用本地 mock 选项列表；物流弹框通过覆盖 `DialogContent` 的宽度/最大宽度类名实现响应式适配。

**Tech Stack:** React + TypeScript + Tailwind CSS + @base-ui/react (Popover/Dialog) + cmdk (Command) + lucide-react

---

## File Map

- Modify: `src/pages/PurchaseManagement/components/NewOrderTable.tsx`
- Read (reference): `src/pages/PurchaseSuggestions/components/SuggestionsFilter.tsx`
- Read (UI primitives): `src/components/ui/popover.tsx`, `src/components/ui/command.tsx`, `src/components/ui/dialog.tsx`

---

### Task 1: 更换供应商弹框改为“下拉单选 + 模糊匹配”

**Files:**
- Modify: `src/pages/PurchaseManagement/components/NewOrderTable.tsx`

- [ ] **Step 1: 增加所需 import（Popover/Command/cn/图标）**

将这些 import 加到 `NewOrderTable.tsx`（按现有 import 风格追加即可）：

```ts
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
```

并在 lucide import 中补充：

```ts
import { Check, ChevronsUpDown } from 'lucide-react';
```

- [ ] **Step 2: 新增供应商下拉状态与 mock 数据**

在组件 state 区新增：

```ts
const [openSupplierSelect, setOpenSupplierSelect] = useState(false);
const [supplierSelected, setSupplierSelected] = useState('');

const supplierOptions = [
  { value: '深圳优声电子有限公司', label: '深圳优声电子有限公司' },
  { value: '广州能量科技有限公司', label: '广州能量科技有限公司' },
  { value: '东莞线材工厂', label: '东莞线材工厂' },
  { value: '惠州硅胶制品有限公司', label: '惠州硅胶制品有限公司' },
  { value: '曹县委要王工艺有限公司', label: '曹县委要王工艺有限公司' },
];
```

- [ ] **Step 3: 打开弹框时初始化选中值**

在点击供应商编辑 icon 的 onClick 内，把原来的 `setSupplierSearch(...)` 改为：

```ts
setSupplierSelected(order.supplierName || '');
setChangeSupplierId(order.id);
```

- [ ] **Step 4: 替换 Supplier Dialog 内的 Input 为 Popover + Command 单选**

将 Supplier Dialog 的输入区域替换为（关键结构）：

```tsx
<div className="flex items-center gap-4">
  <span className="text-red-500">*</span> 供应商

  <Popover open={openSupplierSelect} onOpenChange={setOpenSupplierSelect}>
    <PopoverTrigger className="inline-flex h-8 flex-1 items-center justify-between whitespace-nowrap rounded-lg border border-input bg-transparent px-2.5 py-1 text-[13px] transition-colors outline-none hover:bg-muted">
      {supplierSelected
        ? supplierOptions.find((s) => s.value === supplierSelected)?.label
        : "选择供应商..."}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </PopoverTrigger>

    <PopoverContent className="w-[340px] p-0" align="start">
      <Command>
        <CommandInput placeholder="搜索供应商..." className="h-8 text-[13px]" />
        <CommandList>
          <CommandEmpty className="py-2 text-center text-[13px]">未找到供应商</CommandEmpty>
          <CommandGroup>
            {supplierOptions.map((s) => (
              <CommandItem
                key={s.value}
                value={s.value}
                onSelect={() => {
                  setSupplierSelected(s.value);
                  setOpenSupplierSelect(false);
                }}
                className="text-[13px]"
                data-checked={supplierSelected === s.value}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    supplierSelected === s.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {s.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</div>
```

- [ ] **Step 5: 确定按钮写回 supplierName**

将 “确定” 的写回逻辑从 `supplierSearch` 改为 `supplierSelected`：

```ts
setOrders((prev: any[]) =>
  prev.map((o) => (o.id === changeSupplierId ? { ...o, supplierName: supplierSelected } : o))
);
```

- [ ] **Step 6: 运行类型检查**

Run:

```bash
npm run check
```

Expected: exit code 0

---

### Task 2: 更换仓库弹框改为“下拉单选 + 模糊匹配”

**Files:**
- Modify: `src/pages/PurchaseManagement/components/NewOrderTable.tsx`

- [ ] **Step 1: 新增仓库下拉状态与 mock 数据**

```ts
const [openWarehouseSelect, setOpenWarehouseSelect] = useState(false);
const [warehouseSelected, setWarehouseSelected] = useState('');

const warehouseOptions = [
  { value: '东莞厚街仓', label: '东莞厚街仓' },
  { value: '深圳坂田仓', label: '深圳坂田仓' },
  { value: '广州白云仓', label: '广州白云仓' },
  { value: '义乌北苑仓', label: '义乌北苑仓' },
];
```

- [ ] **Step 2: 打开弹框时初始化选中值**

在仓库编辑 icon 的 onClick 内，把原来的 `setWarehouseSearch(...)` 改为：

```ts
setWarehouseSelected(order.warehouse || '');
setChangeWarehouseId(order.id);
```

- [ ] **Step 3: 替换 Warehouse Dialog 内的 Input 为 Popover + Command 单选**

（结构与供应商一致，只是文案/数据源不同）

- [ ] **Step 4: 确定按钮写回 warehouse**

将 “确定” 的写回逻辑从 `warehouseSearch` 改为 `warehouseSelected`：

```ts
setOrders((prev: any[]) =>
  prev.map((o) => (o.id === changeWarehouseId ? { ...o, warehouse: warehouseSelected } : o))
);
```

- [ ] **Step 5: 运行构建**

Run:

```bash
npm run build
```

Expected: build success

---

### Task 3: 修改物流信息弹框宽度适配内容

**Files:**
- Modify: `src/pages/PurchaseManagement/components/NewOrderTable.tsx`

- [ ] **Step 1: 调整 Logistics Dialog 的 DialogContent className**

将：

```tsx
<DialogContent className="max-w-3xl">
```

替换为：

```tsx
<DialogContent className="w-[980px] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)]">
```

目的：在桌面端更宽，且在小屏上不超过视口。

- [ ] **Step 2: 手动预览验证（本地）**

Run:

```bash
npm run dev
```

打开：`/purchase-management` → 新订单 → 点击“添加物流单号”右侧 icon  
Expected: 弹框宽度足够，表格/输入/按钮不挤压且不溢出屏幕。

