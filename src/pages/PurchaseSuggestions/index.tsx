import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FeatureMarker } from '@/components/FeatureMarker';
import SuggestionsFilter from './components/SuggestionsFilter';
import SuggestionsTable from './components/SuggestionsTable';
import type { SuggestionsFilters } from './types';

export default function PurchaseSuggestions() {
  const [activeTab, setActiveTab] = useState<'stock' | 'shortage'>('stock');
  const [filters, setFilters] = useState<SuggestionsFilters>({
    keyword: '',
    warehouses: [],
    supplierName: '',
    buyer: '',
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-6 mb-4 px-2">
        <h1 className="text-[18px] font-medium text-gray-800">采购建议</h1>
        <FeatureMarker 
          requirementNumber={1}
          title="备货建议/缺货建议切换" 
          description={`**功能描述：** 支持备货建议与缺货建议两种模式的切换，满足不同采购场景需求。

**业务定义：**
- **备货建议**：基于销量预测和库存数据，系统自动计算建议采购数量，帮助采购员提前备货
- **缺货建议**：展示已缺货或即将缺货的SKU，优先级高于备货建议

**交互说明：**
- 点击「备货建议」切换到备货建议视图，展示需要备货的SKU数据
- 点击「缺货建议」切换到缺货建议视图，展示已缺货或即将缺货的SKU数据
- 当前激活状态以下划线和蓝色高亮显示

**业务规则：**
- 默认显示备货建议视图
- 两种视图共享筛选条件和选中状态
- 缺货建议优先级高于备货建议，缺货SKU应优先处理

**显示样式：**
- 下划线激活样式，简洁明了
- 未激活状态显示灰色，悬停时变深`}
        >
          <div className="flex items-center gap-6 text-[14px]">
            <div 
              className={cn(
                "cursor-pointer pb-1 transition-colors",
                activeTab === 'stock' ? "text-blue-600 border-b-2 border-blue-600 font-medium" : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent"
              )}
              onClick={() => setActiveTab('stock')}
            >
              备货建议
            </div>
            <div 
              className={cn(
                "cursor-pointer pb-1 transition-colors",
                activeTab === 'shortage' ? "text-blue-600 border-b-2 border-blue-600 font-medium" : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent"
              )}
              onClick={() => setActiveTab('shortage')}
            >
              缺货建议
            </div>
          </div>
        </FeatureMarker>
      </div>
      
      <FeatureMarker 
        requirementNumber={2}
        title="筛选区" 
        description={`**功能描述：** 支持多条件组合筛选采购建议数据，帮助采购员快速定位目标SKU。

**筛选条件：**
- **关键词搜索**：支持按SKU/中文名称/采购员进行模糊搜索，输入即搜
- **仓库筛选**：支持多选，下拉弹窗形式选择，支持搜索仓库名称
- **采购员筛选**：支持单选，下拉弹窗形式选择，支持搜索采购员姓名
- **重置按钮**：一键清空所有筛选条件，恢复默认状态

**交互说明：**
- 输入关键词后实时过滤数据，无需点击搜索按钮
- 仓库多选时显示"已选N个仓库"，全选时显示"全部仓库"
- 采购员单选时显示选中的采购员名称，未选择时显示"全部采购员"
- 重置按钮点击后清空所有筛选条件并刷新列表

**显示样式：**
- 紧凑型输入框与下拉选择框组合
- 带边框，浅灰色背景
- 搜索图标位于输入框内部左侧

**业务规则：**
- 筛选条件之间为AND关系，需同时满足
- 支持按商品活跃度筛选（预留扩展）
- 支持按品牌筛选（预留扩展）`}
      >
        <SuggestionsFilter value={filters} onChange={setFilters} />
      </FeatureMarker>
      
      <FeatureMarker 
        requirementNumber={3}
        title="列表区" 
        description={`**功能描述：** 展示各SKU的采购建议数据，支持按供应商分组展示，提供完整的采购决策信息。

**数据字段：**
- **基础信息**：采购员、库存SKU/中文名称、状态、仓库名称、一级品牌
- **销量数据**：预测日销量、7天销量、28天销量、42天销量
- **库存数据**：库存总数、采购在途量、仓库未发货、可用库存量
- **计算指标**：可用库存量可售天数、库存+在途、可销售天数
- **采购信息**：货期、建议采购单价、建议采购数、采购总价、备注

**交互特性：**
- 支持展开/折叠供应商分组（树形表格）
- 支持批量勾选SKU进行批量操作
- 支持编辑建议采购单价（实时计算采购总价）
- 支持编辑建议采购数量（实时计算采购总价）
- 支持添加/编辑备注信息

**状态标签：**
- 🟢 **绿色**：正常销售状态
- 🟠 **橙色**：警告/缺货状态（库存不足）
- 🔵 **蓝色**：自动创建等特殊状态

**业务规则：**
- 采购总价 = 建议采购单价 × 建议采购数量
- 建议采购数由系统根据销量预测和库存自动计算
- 可售天数 = 可用库存量 / 预测日销量
- 供应商分组显示，便于批量操作

**显示样式：**
- 复杂的树形表格（Tree Table）
- 固定表头和固定列（左侧采购员、SKU等）
- 横向及纵向滚动条
- 状态标签使用不同颜色区分`}
      >
        <SuggestionsTable activeTab={activeTab} filters={filters} layout="flat" />
      </FeatureMarker>
    </div>
  );
}
