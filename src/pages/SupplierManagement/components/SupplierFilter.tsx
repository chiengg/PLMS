import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Search, ChevronDown, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SupplierFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function SupplierFilter({ onFilterChange }: SupplierFilterProps) {
  const [keywordType, setKeywordType] = useState('供应商名称');
  const [keywordCondition, setKeywordCondition] = useState('包含');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('全部');
  const [type, setType] = useState('全部');
  const [paymentMethod, setPaymentMethod] = useState('全部');
  const [createStart, setCreateStart] = useState('');
  const [createEnd, setCreateEnd] = useState('');
  const [customCategory, setCustomCategory] = useState('全部');
  const [isFactory, setIsFactory] = useState('全部');

  const handleSearch = () => {
    onFilterChange({
      keywordType, keywordCondition, keyword,
      status, type, paymentMethod,
      createStart, createEnd, customCategory, isFactory
    });
  };

  const handleReset = () => {
    setKeywordType('供应商名称');
    setKeywordCondition('包含');
    setKeyword('');
    setStatus('全部');
    setType('全部');
    setPaymentMethod('全部');
    setCreateStart('');
    setCreateEnd('');
    setCustomCategory('全部');
    setIsFactory('全部');
    onFilterChange({});
  };

  return (
    <div className="p-4 border-b border-gray-200 text-[13px] flex flex-col gap-4 flex-shrink-0 bg-white">
      {/* Row 1: Keyword */}
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium w-16 text-right">搜索内容：</span>
        <div className="flex items-center gap-4 text-gray-600 mr-4">
          {['供应商名称', '供应商链接', '采购员', '联系人', '联系电话', '联系地址', '旺旺', '备注', '创建人'].map(t => (
            <label key={t} className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
              <input type="radio" name="kwType" checked={keywordType === t} onChange={() => setKeywordType(t)} />
              {t}
            </label>
          ))}
        </div>
        
        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
          <select 
            className="h-8 px-2 border-0 border-r border-gray-300 bg-gray-50 outline-none text-gray-600"
            value={keywordCondition}
            onChange={e => setKeywordCondition(e.target.value)}
          >
            <option value="包含">包含</option>
            <option value="为空">为空</option>
            <option value="不为空">不为空</option>
          </select>
          <Input 
            className="h-8 w-48 border-0 focus-visible:ring-0 text-[12px] rounded-none"
            placeholder="双击可批量查询"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            disabled={keywordCondition === '为空' || keywordCondition === '不为空'}
          />
        </div>
        <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
        <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 ml-2 gap-1 font-normal" onClick={handleSearch}>
          <Search className="w-3.5 h-3.5" /> 搜索
        </Button>
        </FeatureMarker>
      </div>

      {/* Row 2: Filters */}
      <div className="flex flex-wrap items-center gap-y-3 gap-x-8">
        {/* Status */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium w-16 text-right">状态：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '启用', '停用'].map(s => (
              <FeatureMarker title="{s}" description="交互说明：点击执行{s}操作。">
              <span 
                key={s} 
                className={`cursor-pointer px-2 py-0.5 rounded ${status === s ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setStatus(s)}
              >
                {s}
              </span>
              </FeatureMarker>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium w-24 text-right">供应商类型：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '1688', '淘供销', '普通', '淘宝', '拼多多', '淘供销(淘宝天猫)'].map(t => (
              <FeatureMarker title="{t}" description="交互说明：点击执行{t}操作。">
              <span 
                key={t} 
                className={`cursor-pointer px-2 py-0.5 rounded ${type === t ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setType(t)}
              >
                {t}
              </span>
              </FeatureMarker>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex flex-wrap items-center gap-y-3 gap-x-8">
        {/* Payment */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium w-16 text-right">付款方式：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '到付', '分期付款', '现付', '周结', '月结'].map(p => (
              <FeatureMarker title="{p}" description="交互说明：点击执行{p}操作。">
              <span 
                key={p} 
                className={`cursor-pointer px-2 py-0.5 rounded ${paymentMethod === p ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setPaymentMethod(p)}
              >
                {p}
              </span>
              </FeatureMarker>
            ))}
            <span className="text-blue-500 cursor-pointer flex items-center">更多 <ChevronDown className="w-3 h-3 ml-0.5" /></span>
            <span className="text-gray-400 cursor-pointer flex items-center hover:text-blue-500 ml-2"><Settings className="w-3.5 h-3.5 mr-1" />设置付款方式</span>
          </div>
        </div>

        {/* Create Time */}
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium w-24 text-right">创建时间：</span>
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <Input type="date" className="h-8 w-32 border-0 rounded-none focus-visible:ring-0 text-[12px]" value={createStart} onChange={e => setCreateStart(e.target.value)} />
            <span className="px-2 text-gray-400 bg-gray-50 h-8 flex items-center">至</span>
            <Input type="date" className="h-8 w-32 border-0 rounded-none focus-visible:ring-0 text-[12px]" value={createEnd} onChange={e => setCreateEnd(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Row 4 */}
      <div className="flex flex-wrap items-center gap-y-3 gap-x-8">
        {/* Custom Category */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium w-16 text-right">自定义分类：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '<未分类>', '零散供应商'].map(c => (
              <FeatureMarker title="{c}" description="交互说明：点击执行{c}操作。">
              <span 
                key={c} 
                className={`cursor-pointer px-2 py-0.5 rounded ${customCategory === c ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setCustomCategory(c)}
              >
                {c}
              </span>
              </FeatureMarker>
            ))}
            <span className="text-gray-400 cursor-pointer flex items-center hover:text-blue-500 ml-2"><Settings className="w-3.5 h-3.5 mr-1" />设置分类</span>
          </div>
        </div>

        {/* Is Factory */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium w-24 text-right">是否加工厂商：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '是', '否'].map(f => (
              <FeatureMarker title="{f}" description="交互说明：点击执行{f}操作。">
              <span 
                key={f} 
                className={`cursor-pointer px-2 py-0.5 rounded ${isFactory === f ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setIsFactory(f)}
              >
                {f}
              </span>
              </FeatureMarker>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
