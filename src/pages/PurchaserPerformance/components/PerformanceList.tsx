import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, Download } from 'lucide-react';

export default function PerformanceList() {
  const [dateType, setDateType] = useState<'day' | 'month'>('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  
  const [purchaser, setPurchaser] = useState('');
  const [showPurchaserOptions, setShowPurchaserOptions] = useState(false);

  const mockPurchasers = ['全部', '张三', '李四', '王五', '赵六'];
  const filteredPurchasers = mockPurchasers.filter(p => p.includes(purchaser));

  const mockData = [
    {
      id: '1',
      date: '2026-04-25',
      purchaser: '张三',
      orderCount: 45,
      totalAmount: '125,000.00',
      totalQty: 5000,
      skuTypes: 120,
      returnOrderCount: 2,
      returnQty: 50,
      arrivedOrderCount: 40,
      delayedArrivedOrderCount: 4,
      deliveryOnTimeRate: '90.00%',
      auditRejectedCount: 1,
      outOfStockOrderCount: 3,
      outOfStockItemCount: 15
    },
    {
      id: '2',
      date: '2026-04-25',
      purchaser: '李四',
      orderCount: 32,
      totalAmount: '88,500.00',
      totalQty: 3200,
      skuTypes: 85,
      returnOrderCount: 0,
      returnQty: 0,
      arrivedOrderCount: 30,
      delayedArrivedOrderCount: 1,
      deliveryOnTimeRate: '96.67%',
      auditRejectedCount: 0,
      outOfStockOrderCount: 1,
      outOfStockItemCount: 5
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded shadow-sm border border-gray-200">
      {/* Filter Section */}
      <div className="p-4 border-b border-gray-200 flex flex-col gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          
          <div className="flex items-center">
            <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">时间区间:</span>
            <div className="flex items-center">
              <select 
                value={dateType}
                onChange={(e) => setDateType(e.target.value as 'day' | 'month')}
                className="h-8 px-2 border-y border-l border-gray-300 rounded-l text-[13px] bg-gray-50 outline-none focus:border-blue-500"
              >
                <option value="day">按天</option>
                <option value="month">按月</option>
              </select>
              
              {dateType === 'day' ? (
                <div className="flex items-center">
                  <Input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-8 w-[130px] text-[13px] rounded-none border-gray-300 focus-visible:ring-0" 
                  />
                  <span className="px-2 py-1.5 bg-gray-50 border-y border-gray-300 text-[13px] text-gray-500">至</span>
                  <Input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-8 w-[130px] text-[13px] rounded-l-none border-gray-300 focus-visible:ring-0" 
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <Input 
                    type="month" 
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    className="h-8 w-[130px] text-[13px] rounded-none border-gray-300 focus-visible:ring-0" 
                  />
                  <span className="px-2 py-1.5 bg-gray-50 border-y border-gray-300 text-[13px] text-gray-500">至</span>
                  <Input 
                    type="month" 
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                    className="h-8 w-[130px] text-[13px] rounded-l-none border-gray-300 focus-visible:ring-0" 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">采购员:</span>
            <div className="relative w-[160px]">
              <Input 
                type="text" 
                placeholder="全部"
                value={purchaser}
                onChange={(e) => setPurchaser(e.target.value)}
                onFocus={() => setShowPurchaserOptions(true)}
                onBlur={() => setTimeout(() => setShowPurchaserOptions(false), 200)}
                className="h-8 w-full text-[13px] border-gray-300 focus-visible:ring-0 pr-8" 
              />
              <div className="absolute right-2 top-1.5 pointer-events-none">
                <span className="text-[10px] text-gray-400">▼</span>
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

          <div className="flex items-center gap-2 ml-auto">
            <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
            <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal gap-1">
              <Search className="w-3.5 h-3.5" /> 搜索
            </Button>
            </FeatureMarker>
            <FeatureMarker title="重置" description="交互说明：点击执行重置操作。">
            <Button variant="outline" className="h-8 px-4 border-gray-300 text-gray-600 text-[13px] gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> 重置
            </Button>
            </FeatureMarker>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 flex items-center justify-start gap-2 bg-white border-b border-gray-200">
        <FeatureMarker title="导出" description="交互说明：点击将当前列表数据导出为Excel文件。">
        <Button 
          className="h-8 bg-[#8CB5E2] hover:bg-[#7AA4D1] text-white px-4 text-[13px] font-normal gap-1"
        >
          <Download className="w-3.5 h-3.5" /> 导出
        </Button>
        </FeatureMarker>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-center text-[13px] border-collapse min-w-[1600px]">
          <thead className="bg-[#F8FAFC] text-gray-700 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-3 font-normal border-b border-r border-gray-200">日期</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">采购员</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">采购订单数</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">采购总金额</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">采购总数量</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">采购商品种类</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">采购退货单数</th>
              <th className="p-3 font-normal border-b border-r border-gray-200 text-red-500">采购退货数</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">当日入库单数</th>
              <th className="p-3 font-normal border-b border-r border-gray-200 text-orange-500">当日延迟入库单数</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">交付准时率</th>
              <th className="p-3 font-normal border-b border-r border-gray-200 text-red-500">采购审核被打回数</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">缺货关联订单数量</th>
              <th className="p-3 font-normal border-b border-gray-200">缺货关联商品数量</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockData.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30">
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.date}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.purchaser}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.orderCount}</td>
                <td className="p-3 border-r border-gray-100 text-blue-600">{item.totalAmount}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.totalQty}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.skuTypes}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.returnOrderCount}</td>
                <td className="p-3 border-r border-gray-100 text-red-500">{item.returnQty}</td>
                <td className="p-3 border-r border-gray-100 text-green-600">{item.arrivedOrderCount}</td>
                <td className="p-3 border-r border-gray-100 text-orange-500">{item.delayedArrivedOrderCount}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800 font-medium">{item.deliveryOnTimeRate}</td>
                <td className="p-3 border-r border-gray-100 text-red-500">{item.auditRejectedCount}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.outOfStockOrderCount}</td>
                <td className="p-3 text-gray-800">{item.outOfStockItemCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-gray-200 flex items-center justify-between bg-white text-[13px] text-gray-600">
        <div>共 {mockData.length} 条记录</div>
        <div className="flex items-center gap-2">
          <FeatureMarker title="上一页" description="交互说明：点击执行上一页操作。">
<Button variant="outline" className="h-7 px-2 text-[13px]" disabled>上一页</Button>
</FeatureMarker>
          <span className="px-2">1</span>
          <FeatureMarker title="下一页" description="交互说明：点击执行下一页操作。">
<Button variant="outline" className="h-7 px-2 text-[13px]" disabled>下一页</Button>
</FeatureMarker>
        </div>
      </div>
    </div>
  );
}