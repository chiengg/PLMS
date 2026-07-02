import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, Download } from 'lucide-react';
import { FeatureMarker } from '@/components/FeatureMarker';

export type CostReductionFilterValues = {
  month: string;
  purchaser: string;
  supplier: string;
  keyword: string;
};

export default function CostReductionFilter(props: {
  values: CostReductionFilterValues;
  onChange: (next: CostReductionFilterValues) => void;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
  purchaserOptions: string[];
  supplierOptions: string[];
}) {
  const { values, onChange, onSearch, onReset, onExport, purchaserOptions, supplierOptions } = props;
  const [showPurchaserOptions, setShowPurchaserOptions] = useState(false);
  const [showSupplierOptions, setShowSupplierOptions] = useState(false);

  const filteredPurchasers = useMemo(() => {
    const q = (values.purchaser || '').trim();
    if (!q) return purchaserOptions;
    return purchaserOptions.filter(p => p.includes(q));
  }, [purchaserOptions, values.purchaser]);

  const filteredSuppliers = useMemo(() => {
    const q = (values.supplier || '').trim();
    if (!q) return supplierOptions;
    return supplierOptions.filter(s => s.includes(q));
  }, [supplierOptions, values.supplier]);

  return (
    <div className="p-4 border-b border-gray-200 flex flex-col gap-4 bg-white">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center">
          <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">月份:</span>
          <Input
            type="month"
            value={values.month}
            onChange={(e) => onChange({ ...values, month: e.target.value })}
            className="h-8 w-[160px] text-[13px] border-gray-300 focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center">
          <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">采购员:</span>
          <div className="relative w-[180px]">
            <Input
              type="text"
              placeholder="全部"
              value={values.purchaser}
              onChange={(e) => onChange({ ...values, purchaser: e.target.value })}
              onFocus={() => setShowPurchaserOptions(true)}
              onBlur={() => setTimeout(() => setShowPurchaserOptions(false), 200)}
              className="h-8 w-full text-[13px] border-gray-300 focus-visible:ring-0 pr-8"
            />
            <div className="absolute right-2 top-1.5 pointer-events-none">
              <span className="text-[10px] text-gray-400">▼</span>
            </div>
            {showPurchaserOptions && filteredPurchasers.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-md z-50 max-h-48 overflow-y-auto custom-scrollbar">
                {filteredPurchasers.map((opt, idx) => (
                  <div
                    key={`${opt}-${idx}`}
                    className="px-3 py-1.5 text-[13px] text-gray-700 hover:bg-blue-50 cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange({ ...values, purchaser: opt === '全部' ? '' : opt });
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

        <div className="flex items-center">
          <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">供应商:</span>
          <div className="relative w-[240px]">
            <Input
              type="text"
              placeholder="全部"
              value={values.supplier}
              onChange={(e) => onChange({ ...values, supplier: e.target.value })}
              onFocus={() => setShowSupplierOptions(true)}
              onBlur={() => setTimeout(() => setShowSupplierOptions(false), 200)}
              className="h-8 w-full text-[13px] border-gray-300 focus-visible:ring-0 pr-8"
            />
            <div className="absolute right-2 top-1.5 pointer-events-none">
              <span className="text-[10px] text-gray-400">▼</span>
            </div>
            {showSupplierOptions && filteredSuppliers.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-md z-50 max-h-48 overflow-y-auto custom-scrollbar">
                {filteredSuppliers.map((opt, idx) => (
                  <div
                    key={`${opt}-${idx}`}
                    className="px-3 py-1.5 text-[13px] text-gray-700 hover:bg-blue-50 cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange({ ...values, supplier: opt === '全部' ? '' : opt });
                      setShowSupplierOptions(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">SKU/名称:</span>
          <Input
            placeholder="输入关键字"
            value={values.keyword}
            onChange={(e) => onChange({ ...values, keyword: e.target.value })}
            className="h-8 w-[220px] text-[13px] border-gray-300 focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <FeatureMarker title="搜索" description="交互说明：根据筛选条件执行查询。">
            <Button
              className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal gap-1"
              onClick={onSearch}
            >
              <Search className="w-3.5 h-3.5" /> 搜索
            </Button>
          </FeatureMarker>
          <FeatureMarker title="重置" description="交互说明：重置筛选条件。">
            <Button
              variant="outline"
              className="h-8 px-4 border-gray-300 text-gray-600 text-[13px] gap-1"
              onClick={onReset}
            >
              <RefreshCw className="w-3.5 h-3.5" /> 重置
            </Button>
          </FeatureMarker>
          <FeatureMarker title="导出" description="交互说明：导出当前月份与筛选条件下的降本记录。">
            <Button
              className="h-8 bg-[#8CB5E2] hover:bg-[#7AA4D1] text-white px-4 text-[13px] font-normal gap-1"
              onClick={onExport}
            >
              <Download className="w-3.5 h-3.5" /> 导出
            </Button>
          </FeatureMarker>
        </div>
      </div>
    </div>
  );
}

