import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TrackingFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function TrackingFilter({ onFilterChange }: TrackingFilterProps) {
  const [daysMode, setDaysMode] = useState('不限');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  
  const [warehouse, setWarehouse] = useState('');
  const [qcStatus, setQcStatus] = useState('全部');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchType, setSearchType] = useState('库存SKU');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [supplier, setSupplier] = useState('');
  const [orderType, setOrderType] = useState('全部');

  const handleSearch = () => {
    onFilterChange({
      daysMode, customStart, customEnd,
      warehouse, qcStatus, startDate, endDate,
      searchType, searchKeyword, supplier, orderType
    });
  };

  const handleReset = () => {
    setDaysMode('不限');
    setCustomStart('');
    setCustomEnd('');
    setWarehouse('');
    setQcStatus('全部');
    setStartDate('');
    setEndDate('');
    setSearchType('库存SKU');
    setSearchKeyword('');
    setSupplier('');
    setOrderType('全部');
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 border border-gray-200 rounded text-[13px] flex flex-col gap-4 flex-shrink-0">
      {/* Row 1 */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-gray-700 w-20 text-right font-medium">已下单天数：</span>
        <div className="flex items-center gap-4">
          {['不限', '3天', '5天', '7天'].map(m => (
            <FeatureMarker title="{m}" description="交互说明：点击执行{m}操作。">
            <span 
              key={m}
              className={`cursor-pointer hover:text-blue-600 px-3 py-1 border rounded ${daysMode === m ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600'}`}
              onClick={() => setDaysMode(m)}
            >
              {m}
            </span>
            </FeatureMarker>
          ))}
          <div className="flex items-center gap-2 border border-gray-300 rounded overflow-hidden">
            <FeatureMarker title="自定义天数" description="交互说明：点击执行自定义天数操作。">
            <span 
              className={`px-3 py-1 cursor-pointer ${daysMode === '自定义天数' ? 'text-blue-600 bg-blue-50' : 'bg-gray-50 text-gray-600'}`}
              onClick={() => setDaysMode('自定义天数')}
            >
              自定义天数
            </span>
            </FeatureMarker>
            <Input 
              className="h-8 w-20 border-0 rounded-none focus-visible:ring-0 text-[12px] text-center" 
              placeholder="起始天数" 
              value={customStart}
              onChange={e => {setCustomStart(e.target.value); setDaysMode('自定义天数');}}
            />
            <span className="text-gray-400">至</span>
            <Input 
              className="h-8 w-20 border-0 rounded-none focus-visible:ring-0 text-[12px] text-center" 
              placeholder="截至天数" 
              value={customEnd}
              onChange={e => {setCustomEnd(e.target.value); setDaysMode('自定义天数');}}
            />
          </div>
        </div>

        <span className="text-gray-700 w-20 text-right font-medium ml-4">发货状态：</span>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-blue-600"><input type="radio" name="shippingStatus" defaultChecked /> 已发货</label>
          <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-blue-600"><input type="radio" name="shippingStatus" /> 未发货</label>
          <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-blue-600"><input type="radio" name="shippingStatus" /> 虚拟发货</label>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-gray-700 w-20 text-right font-medium">搜索内容：</span>
        
        <select 
          className="h-8 border border-gray-300 rounded px-2 outline-none w-36 text-gray-600"
          value={warehouse}
          onChange={e => setWarehouse(e.target.value)}
        >
          <option value="">选择仓库</option>
          <option value="东莞厚街仓">东莞厚街仓</option>
          <option value="义乌仓">义乌仓</option>
        </select>

        <select 
          className="h-8 border border-gray-300 rounded px-2 outline-none w-32 text-gray-600"
          value={qcStatus}
          onChange={e => setQcStatus(e.target.value)}
        >
          <option value="全部">质检状态</option>
          <option value="待质检">待质检</option>
          <option value="部分质检">部分质检</option>
          <option value="质检完成">质检完成</option>
        </select>

        <div className="flex items-center border border-gray-300 rounded">
          <span className="px-3 text-gray-500 bg-gray-50 border-r border-gray-300 h-8 flex items-center">创建时间</span>
          <Input type="date" className="h-8 w-32 border-0 rounded-none focus-visible:ring-0 text-[12px]" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <span className="px-2 text-gray-400">至</span>
          <Input type="date" className="h-8 w-32 border-0 rounded-none focus-visible:ring-0 text-[12px]" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>

        <div className="flex items-center border border-gray-300 rounded w-[400px]">
          <select 
            className="h-8 border-0 border-r border-gray-300 bg-gray-50 px-2 outline-none w-28 text-gray-600 focus:ring-0"
            value={searchType}
            onChange={e => setSearchType(e.target.value)}
          >
            <option value="库存SKU">库存SKU</option>
            <option value="中文名称">中文名称</option>
            <option value="下单员">下单员</option>
            <option value="采购单号">采购单号</option>
          </select>
          <Input 
            className="h-8 flex-1 border-0 focus-visible:ring-0 text-[12px]" 
            placeholder="点击右侧按钮可批量查询" 
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <Search className="w-4 h-4 text-gray-400 mr-2 cursor-pointer hover:text-blue-500" onClick={handleSearch} />
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-gray-700 w-20 text-right font-medium">订单类型：</span>
        <select 
          className="h-8 border border-gray-300 rounded px-2 outline-none w-32 text-gray-600"
          value={orderType}
          onChange={e => setOrderType(e.target.value)}
        >
          <option value="全部">全部</option>
          <option value="线上订单">线上订单</option>
          <option value="线下订单">线下订单</option>
        </select>

        <span className="text-gray-700 w-20 text-right font-medium ml-4">供应商：</span>
        <select 
          className="h-8 border border-gray-300 rounded px-2 outline-none w-56 text-gray-600"
          value={supplier}
          onChange={e => setSupplier(e.target.value)}
        >
          <option value="">选择供应商</option>
          <option value="曹县委要王工艺有限公司">曹县委要王工艺有限公司</option>
          <option value="平潭综合实验区柔集供应链有限公司">平潭综合实验区柔集供应链有限公司</option>
        </select>
        
        <div className="flex items-center gap-2 ml-auto">
          <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 font-normal" onClick={handleSearch}>
            搜索
          </Button>
          </FeatureMarker>
          <FeatureMarker title="重置" description="交互说明：点击执行重置操作。">
          <Button variant="outline" className="h-8 px-6 font-normal bg-white" onClick={handleReset}>
            重置
          </Button>
          </FeatureMarker>
        </div>
      </div>
    </div>
  );
}
