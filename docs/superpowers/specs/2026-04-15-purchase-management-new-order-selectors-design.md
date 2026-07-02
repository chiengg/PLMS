## 背景
采购管理模块「新订单」页面需要对齐采购建议页筛选的交互：在弹框中使用支持关键字模糊匹配的下拉单选组件，并调整“修改物流信息”弹框宽度以适配内容。

## 范围
1. 更换供应商弹框：将现有纯输入框替换为“下拉单选 + 关键字模糊匹配”组件。
2. 更换仓库弹框：同上。
3. 修改物流信息弹框：调整弹框宽度策略，确保兼容表格与控件，不挤压、不溢出视口。

## 交互与行为
### 更换供应商 / 更换仓库（对齐采购建议页筛选）
- 触发：点击字段右侧 icon 打开弹框。
- 弹框内展示：
  - 必填字段 label（供应商/仓库）。
  - 下拉单选：PopoverTrigger 外观与输入框一致；PopoverContent 内部使用 CommandInput（输入即过滤）+ 候选项列表。
- 选择：
  - 点击候选项：更新弹框内的“当前选择”并收起下拉。
  - 点击“确定”：将选择写入订单数据（supplierName/warehouse），关闭弹框。
  - 点击“取消”或关闭：不写入，关闭弹框。

### 修改物流信息弹框宽度
- 目标：弹框宽度适配表格列、输入框与按钮，避免内容挤压；在小屏上不超出视口。
- 策略：DialogContent 使用固定宽度基准 + 视口最大宽度兜底。

## 技术方案
### 复用组件
- 复用已有 UI 组件（与采购建议页一致）：
  - Popover: `src/components/ui/popover.tsx`
  - Command: `src/components/ui/command.tsx`（基于 cmdk）
- 数据源：先使用本地 mock 列表（与当前页面其它 mock 逻辑一致），后续可替换为接口数据。

### 代码改动点
- `src/pages/PurchaseManagement/components/NewOrderTable.tsx`
  - 新增供应商/仓库下拉单选的 open 状态与选中值状态。
  - Supplier Dialog / Warehouse Dialog 中替换 Input 为 Popover+Command 的单选模式。
  - Logistics Dialog 的 DialogContent className 调整为更适配内容的宽度策略。

## 验收标准
- 更换供应商弹框：
  - 点击 icon 打开弹框；下拉可展开；
  - 输入关键字能实时过滤候选项；
  - 点击候选项可选中并收起下拉；
  - 点击确定后表格供应商字段更新。
- 更换仓库弹框：同上。
- 修改物流信息弹框：
  - 弹框宽度能完整容纳表格与输入控件；
  - 小屏下不会超出视口（仍可完整操作）。

