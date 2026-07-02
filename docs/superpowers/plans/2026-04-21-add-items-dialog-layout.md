# Add Items Dialog Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 调整“追加商品”页面的“添加商品/批量添加商品”弹框尺寸与布局，保证桌面端无横向滚动，且搜索类型使用单选组件并保持标签式选中效果。

**Architecture:** 仅修改 [AddItemsPage.tsx](file:///workspace/src/pages/PurchaseManagement/components/AddItemsPage.tsx) 的 DialogContent 尺寸与内部 flex 分区；引入并使用 [radio-group.tsx](file:///workspace/src/components/ui/radio-group.tsx) 完成搜索类型单选，label 层实现标签式 UI。

**Tech Stack:** React + TypeScript + Tailwind + shadcn/base-ui 组件（Dialog, Checkbox, RadioGroup）。

---

## File Structure

- Modify: [AddItemsPage.tsx](file:///workspace/src/pages/PurchaseManagement/components/AddItemsPage.tsx)
- Reference: [radio-group.tsx](file:///workspace/src/components/ui/radio-group.tsx)

---

### Task 1: 调整“添加商品”弹框尺寸与滚动分区

**Files:**
- Modify: [AddItemsPage.tsx](file:///workspace/src/pages/PurchaseManagement/components/AddItemsPage.tsx)

- [ ] **Step 1: 更新 DialogContent 尺寸与容器 overflow**

将“添加商品”弹框的 `DialogContent` className 从：

```tsx
<DialogContent className="max-w-5xl flex flex-col p-0 gap-0 h-[80vh]">
```

修改为（固定大宽度 + 禁止横向滚动）：

```tsx
<DialogContent className="w-[1400px] max-w-[calc(100vw-2rem)] h-[80vh] flex flex-col p-0 gap-0 overflow-x-hidden">
```

- [ ] **Step 2: 将表格结果区改为仅该区域滚动**

把结果区容器从：

```tsx
<div className="flex-1 overflow-y-auto custom-scrollbar p-4">
```

修改为（关键是 `min-h-0`，确保滚动区域正确生效）：

```tsx
<div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4">
```

- [ ] **Step 3: 表格改为 table-fixed 防止横向滚动**

把表格节点从：

```tsx
<table className="w-full text-center text-[12px] border border-gray-200">
```

修改为：

```tsx
<table className="w-full table-fixed text-center text-[12px] border border-gray-200">
```

并为列补齐宽度（只调整 className，不新增逻辑）：

```tsx
<th className="p-3 font-normal border-b border-r border-gray-200 w-10">...</th>
<th className="p-3 font-normal border-b border-r border-gray-200 w-20">缩略图</th>
<th className="p-3 font-normal border-b border-r border-gray-200 w-[360px]">商品信息</th>
<th className="p-3 font-normal border-b border-r border-gray-200 w-[160px]">仓库</th>
<th className="p-3 font-normal border-b border-r border-gray-200 w-[140px]">库存/在途量</th>
<th className="p-3 font-normal border-b border-r border-gray-200 w-[120px]">未发货量</th>
<th className="p-3 font-normal border-b border-gray-200 w-[160px]">7/28/42天销量</th>
```

同时把商品信息单元格的 SKU 行加 `truncate`，避免长 SKU 撑破布局：

```tsx
<div className="text-blue-600 truncate">{m.sku}</div>
```

- [ ] **Step 4: 本地校验**

Run:

```bash
npm run check
```

Expected: exit code 0.

---

### Task 2: “搜索类型”改为 RadioGroup 单选（标签式 UI）

**Files:**
- Modify: [AddItemsPage.tsx](file:///workspace/src/pages/PurchaseManagement/components/AddItemsPage.tsx)

- [ ] **Step 1: 引入 RadioGroup**

在 import 区新增：

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
```

- [ ] **Step 2: 用 RadioGroup 替换现有可点击 div 列表**

把：

```tsx
<div className="flex items-center">
  {['库存SKU', ...].map(t => (
    <div ... onClick={() => setAddSearchType(t)}>{t}</div>
  ))}
</div>
```

替换为（RadioGroup 负责单选状态，label 负责“标签式”视觉）：

```tsx
<RadioGroup
  value={addSearchType}
  onValueChange={setAddSearchType}
  className="flex items-center gap-0 w-auto"
>
  {['库存SKU', '库存SKU名称', '库存SKU英文名称', '原厂SKU', '主SKU'].map((t) => (
    <label
      key={t}
      className={cn(
        "px-4 py-1.5 cursor-pointer border select-none",
        addSearchType === t ? "text-[#E6A23C] border-[#E6A23C]" : "text-gray-600 hover:text-gray-800 border-transparent"
      )}
    >
      <RadioGroupItem value={t} className="hidden" />
      {t}
    </label>
  ))}
</RadioGroup>
```

- [ ] **Step 3: 本地校验**

Run:

```bash
npm run check
```

Expected: exit code 0.

---

### Task 3: 调整“批量添加商品”弹框尺寸与文案不换行

**Files:**
- Modify: [AddItemsPage.tsx](file:///workspace/src/pages/PurchaseManagement/components/AddItemsPage.tsx)

- [ ] **Step 1: 调整 DialogContent 宽度并禁用横向滚动**

将：

```tsx
<DialogContent className="max-w-3xl flex flex-col p-0 gap-0">
```

改为：

```tsx
<DialogContent className="w-[980px] max-w-[calc(100vw-2rem)] flex flex-col p-0 gap-0 overflow-x-hidden">
```

- [ ] **Step 2: 提示行强制不换行**

将提示行容器改为：

```tsx
<div className="text-[13px] text-gray-600 whitespace-nowrap">
  每行一个 <span className="text-[#E6A23C] font-medium">库存SKU,数量,单价</span> (最多500个种类)
</div>
```

- [ ] **Step 3: 本地校验**

Run:

```bash
npm run check
```

Expected: exit code 0.

---

## Self-Review Checklist

- [ ] 覆盖 spec：添加商品弹框大宽度 + 仅表格区滚动 + 无横向滚动
- [ ] 覆盖 spec：搜索类型用 RadioGroup 单选，且视觉为标签式橙色选中态
- [ ] 覆盖 spec：批量添加弹框宽度与提示行不换行
- [ ] 无 “TODO/TBD” 占位内容

