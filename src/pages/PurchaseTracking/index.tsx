import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrackingFilter from './components/TrackingFilter';
import TrackingTable from './components/TrackingTable';

export default function PurchaseTracking() {
  const [filterValues, setFilterValues] = useState<any>({});
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F5F7FA]">
      <div className="flex items-center text-gray-500 text-[13px] mb-4 flex-shrink-0 px-4 pt-4">
        <span>首页</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span>采购流程</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span className="text-gray-800 font-medium">采购跟单</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col px-4 pb-4">
        <TrackingFilter onFilterChange={setFilterValues} />
        
        <div className="mt-4 flex items-center justify-between">
          <div className="bg-[#EBF5FF] text-blue-600 text-[12px] px-4 py-2 rounded flex items-center gap-2 border border-blue-200">
            <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">i</div>
            提示：当前SKU库存量无法满足订单未发货量并且已经下达采购单有采购在途时，将展示采购跟单数据（订单未发货量-库存&gt;0并且在途&gt;0）
            <span className="text-blue-500 cursor-pointer hover:underline ml-2">点此 查看帮助文档</span>
          </div>
          
          <div className="flex items-center relative" ref={exportRef}>
            <Button 
              className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white text-[13px] px-4 rounded flex items-center gap-1"
              onClick={() => setExportOpen(!exportOpen)}
            >
              导出 <ChevronRight className={`w-3 h-3 transition-transform ${exportOpen ? '-rotate-90' : 'rotate-90'}`} />
            </Button>
            
            {exportOpen && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded shadow-lg z-50 text-[13px] text-gray-700 py-1">
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => { alert('导出当前页面数据'); setExportOpen(false); }}
                >
                  导出当前页面数据
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => { alert('导出勾选数据'); setExportOpen(false); }}
                >
                  导出勾选数据
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 mt-4 bg-white border border-gray-200 rounded flex flex-col overflow-hidden">
          <TrackingTable filterValues={filterValues} />
        </div>
      </div>
    </div>
  );
}
