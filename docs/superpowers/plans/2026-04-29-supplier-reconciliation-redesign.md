# 供应商对账页面改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按需求改造“供应商对账”页面：一级 Tabs 上移、筛选区新增 1688账号、移除生成按钮、增加二级 Tabs（采购/采样），并实现详情二级路由页展示字段。

**Architecture:** 复用现有 `SupplierReconciliation` 页面结构，在 `ReconciliationList` 内拆分状态并替换列表渲染；新增详情页路由组件基于 `useParams()` 按 `type` 渲染不同字段集合。

**Tech Stack:** React + TypeScript + react-router-dom + shadcn/ui + Tailwind + lucide-react

---

## File Map（改动范围）

**Modify**
- `/workspace/src/pages/SupplierReconciliation/components/ReconciliationList.tsx`
- `/workspace/src/App.tsx`（新增详情路由）

**Create**
- `/workspace/src/pages/SupplierReconciliation/Detail.tsx`（二级路由页：采购/采样详情）

---

### Task 1: 重构一级页布局与状态

**Files:**
- Modify: `/workspace/src/pages/SupplierReconciliation/components/ReconciliationList.tsx`

- [ ] **Step 1: 调整状态模型**

在 `ReconciliationList` 内新增状态：
- `cycle`：`daily | monthly`（替换当前 `activeTab` 或保持但语义化）
- `statementType`：`purchase | sample`
- `account1688`：`string`（下拉单选）
- `billStart/billEnd`：字符串（配合 input type=date / month）

- [ ] **Step 2: 调整布局顺序**

把一级 Tabs（“日账单/ 月账单”）从筛选区下方移到筛选区上方，结构变为：
1) 一级 Tabs
2) 筛选区（含 账单时间 / 供应商 / 平台 / 采购员 / 1688账号 / 搜索重置）
3) 二级 Tabs（采购对账单/采样对账单）
4) 列表

- [ ] **Step 3: 筛选区时间控件按日/月切换**

筛选项名称统一为“账单时间”：
- cycle=daily：使用 `<Input type="date" />` 两个输入框形成区间
- cycle=monthly：使用 `<Input type="month" />` 两个输入框形成区间

- [ ] **Step 4: 新增筛选项“1688账号（下拉单选）”**

新增 `<select>`，选项先用 mock（例如：全部、1688账号A、1688账号B）。

- [ ] **Step 5: 移除“生成账单/生成对账单”按钮与弹框**

删除：
- `GenerateStatementModal` 引用与 `showGenerateModal` 状态
- `generatedData` 及相关生成逻辑（若仅用于旧表格）
- 过滤区下方的 action button 区块

- [ ] **Step 6: 新增二级 Tabs（采购对账单/采样对账单）**

位于筛选区下方，默认选中采购对账单：
- `statementType === 'purchase'` 显示采购对账单汇总列表
- `statementType === 'sample'` 显示采样对账单汇总列表（字段同汇总）

- [ ] **Step 7: 列表字段替换为汇总字段**

列表字段固定为：
`账期 / 供应商 / 采购平台 / 采购员 / 1688账号 / 创建日期 / 操作（详情、下载）`

账期显示格式：
- cycle=daily：`YYYY-MM-DD`
- cycle=monthly：`YYYY-MM`

---

### Task 2: 二级详情页（路由页面）

**Files:**
- Create: `/workspace/src/pages/SupplierReconciliation/Detail.tsx`

- [ ] **Step 1: 新增详情页路由组件**

实现：
- 使用 `useParams()` 读取 `cycle/type/id`
- 顶部提供“返回”按钮（`useNavigate(-1)`）
- 根据 `type` 渲染不同字段集合（purchase vs sample）
- 内容以“表单详情”风格展示（两列 label/value 的 grid）

- [ ] **Step 2: purchase 详情字段**

字段列表（按 spec）：
付款单号、关联单号、1688账号、1688单号、付款账号、账号名称、收款人、收款账号、采购单金额、应付金额、实付金额、未付金额、状态、预计付款时间、下单员、下单时间、创建人、创建时间、付款人、付款完成时间、备注

- [ ] **Step 3: sample 详情字段**

字段列表（按 spec）：
采购订单号、总金额、下单时间、1688账号、1688单号、库存SKU、采购数量、采购单价、备注、总运费、采购仓库、采购单状态、sku中文名、已付金额、未付金额、已入库量、供应商、已退款金、1688退款时间、下单员、1688付款时间、付款时间

---

### Task 3: 路由与跳转联调

**Files:**
- Modify: `/workspace/src/App.tsx`
- Modify: `/workspace/src/pages/SupplierReconciliation/components/ReconciliationList.tsx`

- [ ] **Step 1: 新增详情路由**

在 `App.tsx` 中追加：
`/supplier-reconciliation/:cycle/:type/:id` → `SupplierReconciliationDetail`

- [ ] **Step 2: 列表“详情”点击跳转**

在汇总列表操作列：
- 点击“详情”跳转：`/supplier-reconciliation/${cycle}/${statementType}/${row.id}`
- 点击“下载”先保留 UI 行为（例如 toast/alert 或无动作占位）

---

### Task 4: 手工验收（无测试框架时）

- [ ] **Step 1: 启动开发服务器**

Run: `./node_modules/.bin/vite --host 0.0.0.0 --port 5173`
Expected: 显示 `Local: http://localhost:5173/`

- [ ] **Step 2: 验证一级页**

访问：`http://localhost:5173/supplier-reconciliation`
检查：
- 一级 Tabs 在筛选区上方，默认日账单
- 筛选区新增 1688账号下拉
- 不存在生成账单按钮
- 二级 Tabs 正常切换
- 日/月切换时“账单时间”控件类型随之变化（date vs month）
- 列表字段为汇总字段，账期格式随日/月变化

- [ ] **Step 3: 验证详情页跳转**

点击列表“详情”进入二级路由页，检查字段集与返回功能正常。

