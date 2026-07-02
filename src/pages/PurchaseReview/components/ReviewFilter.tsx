import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { ChevronDown, ChevronUp, Search, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FilterField = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex items-center">
    <span className="text-gray-600 w-24 flex-shrink-0 text-right pr-2">{label}：</span>
    <div className="flex-1">{children}</div>
  </div>
);

const SelectFilter = ({ defaultValue = "全部", options, onChange }: { defaultValue?: string, options: { value: string, label: string }[], onChange?: (v: string) => void }) => (
  <Select defaultValue={defaultValue} onValueChange={onChange}>
    <SelectTrigger className="w-full h-8 text-[12px] bg-white">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
    </SelectContent>
  </Select>
);

export default function ReviewFilter({ onFilterChange }: { onFilterChange?: (filters: any) => void }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState<any>({
    searchType: '采购单号/自定义单号',
    searchKeyword: '',
    supplier: '',
    startDate: '',
    endDate: '',
    warehouse: '全部',
    orderType: '全部',
    hasRemark: '全部'
  });
  
  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleSearch = () => {
    if (onFilterChange) {
      onFilterChange(localFilters);
    }
  };

  const handleReset = () => {
    const resetValues = {
      searchType: '采购单号/自定义单号',
      searchKeyword: '',
      supplier: '',
      startDate: '',
      endDate: '',
      warehouse: '全部',
      orderType: '全部',
      hasRemark: '全部'
    };
    setLocalFilters(resetValues);
    if (onFilterChange) {
      onFilterChange(resetValues);
    }
  };

  return (
    <div className="bg-[#F8FAFC] border border-gray-200 rounded p-4 mb-4 text-[13px] flex-shrink-0 transition-all duration-300">
      <div className="flex flex-wrap items-center gap-4">
        {/* Row 1 */}
        <div className="flex items-center w-[360px] flex-shrink-0">
          <Select value={localFilters.searchType} onValueChange={v => updateFilter('searchType', v)}>
            <SelectTrigger className="w-36 h-8 text-[12px] rounded-r-none border-r-0 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="采购单号/自定义单号">采购单号/自定义单号</SelectItem>
              <SelectItem value="库存SKU">库存SKU</SelectItem>
              <SelectItem value="商品名称">商品名称</SelectItem>
              <SelectItem value="采购员">采购员</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            className="flex-1 h-8 rounded-l-none text-[12px] border-l-0 focus-visible:ring-0 focus-visible:border-blue-400 bg-white" 
            placeholder="多关键字支持换行或空格分隔"
            value={localFilters.searchKeyword}
            onChange={(e) => updateFilter('searchKeyword', e.target.value)}
          />
        </div>

        <div className="flex items-center w-[240px] flex-shrink-0">
          <span className="text-gray-600 w-16 flex-shrink-0 text-right pr-2">供应商：</span>
          <Input 
            className="flex-1 h-8 text-[12px] bg-white" 
            placeholder="输入关键字模糊匹配"
            value={localFilters.supplier}
            onChange={(e) => updateFilter('supplier', e.target.value)}
          />
        </div>

        <div className="flex items-center w-[300px] flex-shrink-0">
          <span className="text-gray-600 w-20 flex-shrink-0 text-right pr-2">下单时间：</span>
          <div className="flex items-center gap-2 flex-1">
            <Input 
              type="date"
              className="h-8 w-full text-[12px] bg-white px-2" 
              value={localFilters.startDate}
              onChange={(e) => updateFilter('startDate', e.target.value)}
            />
            <span className="text-gray-400">-</span>
            <Input 
              type="date"
              className="h-8 w-full text-[12px] bg-white px-2" 
              value={localFilters.endDate}
              onChange={(e) => updateFilter('endDate', e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons on the same line */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
          <Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-4 text-[13px] font-normal" onClick={handleSearch}>
            <Search className="w-3.5 h-3.5 mr-1.5" /> 搜索
          </Button>
          </FeatureMarker>
          <FeatureMarker title="}" description="交互说明：点击执行}操作。">
          <Button variant="outline" className="h-8 px-4 text-[13px] font-normal bg-white text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? '收起筛选' : '更多筛选'}
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </Button>
          </FeatureMarker>
          <FeatureMarker title="重置" description="交互说明：点击执行重置操作。">
          <Button variant="outline" className="h-8 px-4 text-[13px] font-normal bg-white" onClick={handleReset}>
            重置
          </Button>
          </FeatureMarker>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-4 gap-y-4 gap-x-8 mt-4 pt-4 border-t border-gray-100">
          <FilterField label="仓库">
            <SelectFilter 
              defaultValue="全部" 
              options={[
                {value: '全部', label: '全部'},
                {value: '东莞厚街仓', label: '东莞厚街仓'},
                {value: '广州白云仓', label: '广州白云仓'}
              ]}
              onChange={v => updateFilter('warehouse', v)}
            />
          </FilterField>

          <FilterField label="采购单类型">
            <SelectFilter 
              defaultValue="全部" 
              options={[
                {value: '全部', label: '全部'},
                {value: '备货采购', label: '备货采购'},
                {value: '缺货采购', label: '缺货采购'},
                {value: '样品采购', label: '样品采购'}
              ]}
              onChange={v => updateFilter('orderType', v)}
            />
          </FilterField>

          <FilterField label="是否有备注">
            <SelectFilter 
              defaultValue="全部" 
              options={[
                {value: '全部', label: '全部'},
                {value: '有备注', label: '有备注'},
                {value: '无备注', label: '无备注'}
              ]}
              onChange={v => updateFilter('hasRemark', v)}
            />
          </FilterField>
        </div>
      )}
    </div>
  );
}