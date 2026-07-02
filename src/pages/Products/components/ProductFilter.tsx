import React, { useState } from 'react';
import { Search, ChevronDown, Camera, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [searchType, setSearchType] = useState('库存SKU');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('正常销售');
  const [isGift, setIsGift] = useState('全部');
  const [isProcessed, setIsProcessed] = useState('全部');
  const [activityLevel, setActivityLevel] = useState('全部');
  const [productType, setProductType] = useState('全部');
  const [isNew, setIsNew] = useState('全部');
  
  const [expandMore, setExpandMore] = useState(false);
  const [brand, setBrand] = useState('全部');
  const [purchaser, setPurchaser] = useState('');

  const [showPurchaserOptions, setShowPurchaserOptions] = useState(false);
  const mockPurchasers = ['全部', '何江涛', '张三', '李四'];
  const filteredPurchasers = mockPurchasers.filter(p => p.includes(purchaser));

  const handleSearch = () => {
    onFilterChange({
      searchType, keyword, status, isGift, isProcessed, activityLevel, productType, isNew, brand, purchaser
    });
  };

  const handleReset = () => {
    setSearchType('库存SKU');
    setKeyword('');
    setStatus('正常销售');
    setIsGift('全部');
    setIsProcessed('全部');
    setActivityLevel('全部');
    setProductType('全部');
    setIsNew('全部');
    setBrand('全部');
    setPurchaser('');
    onFilterChange({});
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm mx-3 mt-3 flex flex-col text-[13px] relative pb-6">
      {/* Row 1: Search */}
      <div className="p-3 border-b border-gray-100 flex items-center flex-wrap gap-3">
        <span className="text-gray-700 font-medium w-16 text-right">搜索内容：</span>
        <div className="flex items-center gap-3">
          {['库存SKU', '虚拟SKU', '中文名称', '英文名称', '原厂SKU', '原材料SKU', '默认供应商', '主SKU', 'NCM'].map(t => (
            <label key={t} className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" 
                name="searchType" 
                checked={searchType === t} 
                onChange={() => setSearchType(t)}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-600">{t}</span>
            </label>
          ))}
        </div>
        
        <div className="flex items-center ml-2">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden h-8">
            <div className="px-3 bg-gray-50 border-r border-gray-300 text-gray-600 flex items-center gap-1 cursor-pointer">
              开头是 <ChevronDown className="w-3.5 h-3.5" />
            </div>
            <div className="relative flex items-center">
              <Input 
                placeholder="双击可批量查询" 
                className="h-full border-0 focus-visible:ring-0 rounded-none w-48 text-[13px] pr-8"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
              <Camera className="w-4 h-4 text-gray-400 absolute right-2 cursor-pointer hover:text-blue-500" />
            </div>
          </div>
          <Button className="h-8 rounded-l-none bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 flex items-center gap-1 border-y border-r border-[#6B8EBE]">
            <Search className="w-3.5 h-3.5" /> 搜索
          </Button>
          <Button variant="outline" className="h-8 ml-2 text-[13px] border-gray-300 text-gray-600 flex items-center gap-1">
            高级搜索
          </Button>
        </div>

        <div className="ml-auto text-blue-600 flex items-center gap-1 cursor-pointer hover:underline font-medium">
          <Settings className="w-3.5 h-3.5" /> 商品设置
        </div>
      </div>

      {/* Row 2: Status & IsGift & IsProcessed */}
      <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-x-12 gap-y-2 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium w-16 text-right">sku状态：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '自动创建', '等待开发', '正常销售', '商品清仓', '停止销售'].map(s => (
              <span 
                key={s} 
                className={`cursor-pointer px-2 py-0.5 rounded ${status === s ? 'text-blue-600 border border-blue-300' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setStatus(s)}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">是否赠品：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '是(1)', '否'].map(v => (
              <span 
                key={v} 
                className={`cursor-pointer px-2 py-0.5 rounded ${isGift === v ? 'text-blue-600 border border-blue-300' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setIsGift(v)}
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">是否加工：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '是(0)', '否'].map(v => (
              <span 
                key={v} 
                className={`cursor-pointer px-2 py-0.5 rounded ${isProcessed === v ? 'text-blue-600 border border-blue-300' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setIsProcessed(v)}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Activity & Type & IsNew */}
      <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-x-12 gap-y-2 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium w-16 text-right">活跃度：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '爆款(596)', '旺款(4307)', '平款(15)', '滞销款(10808)'].map(v => {
              let colorClass = 'text-gray-600 hover:text-blue-600 border-transparent';
              if (activityLevel === v) colorClass = 'text-blue-600 border-blue-300';
              
              let prefix = '';
              if (v.includes('爆')) prefix = '<span class="bg-red-500 text-white text-[10px] px-1 rounded mr-1">爆</span>';
              if (v.includes('旺')) prefix = '<span class="bg-orange-500 text-white text-[10px] px-1 rounded mr-1">旺</span>';
              if (v.includes('平')) prefix = '<span class="bg-blue-400 text-white text-[10px] px-1 rounded mr-1">平</span>';
              if (v.includes('滞')) prefix = '<span class="bg-gray-400 text-white text-[10px] px-1 rounded mr-1">滞</span>';

              return (
                <span 
                  key={v} 
                  className={`cursor-pointer px-2 py-0.5 rounded border flex items-center ${colorClass}`}
                  onClick={() => setActivityLevel(v)}
                  dangerouslySetInnerHTML={{ __html: prefix + v }}
                />
              )
            })}
            <span className="text-gray-500 cursor-pointer flex items-center hover:text-blue-500 ml-2 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              <Settings className="w-3 h-3 mr-1" />定义活跃度
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">商品形态：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '实物', '虚拟'].map(v => (
              <span 
                key={v} 
                className={`cursor-pointer px-2 py-0.5 rounded ${productType === v ? 'text-blue-600 border border-blue-300' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setProductType(v)}
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">是否新款：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '是(1405)', '否'].map(v => (
              <span 
                key={v} 
                className={`cursor-pointer px-2 py-0.5 rounded ${isNew === v ? 'text-blue-600 border border-blue-300' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setIsNew(v)}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expand More Toggle */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
        <div 
          className="bg-white border border-gray-200 rounded px-3 py-0.5 text-[12px] text-gray-500 cursor-pointer flex items-center gap-1 hover:text-blue-600 shadow-sm"
          onClick={() => setExpandMore(!expandMore)}
        >
          更多条件 <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandMore ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded Fields */}
      {expandMore && (
        <div className="px-3 py-3 border-b border-gray-100 flex items-center gap-x-12 gap-y-4 flex-wrap bg-gray-50/50">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium w-16 text-right">品牌：</span>
            <div className="flex items-center gap-3 text-gray-600">
              <span 
                className={`cursor-pointer px-2 py-0.5 rounded ${brand === '全部' ? 'text-blue-600 border border-blue-300' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setBrand('全部')}
              >
                全部
              </span>
              <Input 
                placeholder="品牌名称" 
                className="h-7 w-32 text-[13px] focus-visible:ring-0"
                value={brand !== '全部' ? brand : ''}
                onChange={e => setBrand(e.target.value || '全部')}
              />
              <span className="text-blue-500 cursor-pointer hover:underline">品牌管理</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">采购员：</span>
            <div className="relative w-48">
              <Input 
                type="text" 
                placeholder="请选择"
                value={purchaser}
                onChange={(e) => setPurchaser(e.target.value)}
                onFocus={() => setShowPurchaserOptions(true)}
                onBlur={() => setTimeout(() => setShowPurchaserOptions(false), 200)}
                className="h-7 w-full text-[13px] border-gray-300 focus-visible:ring-0 pr-8" 
              />
              <div className="absolute right-2 top-1.5 pointer-events-none">
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
              {showPurchaserOptions && filteredPurchasers.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-md z-50 max-h-40 overflow-y-auto custom-scrollbar">
                  {filteredPurchasers.map((opt, idx) => (
                    <div 
                      key={idx} 
                      className="px-3 py-1.5 text-[13px] text-gray-700 hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        setPurchaser(opt === '全部' ? '' : opt);
                        setShowPurchaserOptions(false);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}