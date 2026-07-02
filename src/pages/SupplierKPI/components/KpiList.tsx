import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, HelpCircle, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const mockData = [
  { id: 1, name: '平潭综合实验区盈创贸易有限公司', count: 1, totalAmount: '94.6800', purchaseCount: 6, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 2, name: '东莞市艾尼莎五金有限公司', count: 1, totalAmount: '12.3000', purchaseCount: 3, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 3, name: '广州花森服饰有限公司', count: 1, totalAmount: '326.6000', purchaseCount: 12, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 4, name: '义乌市纳云箱包有限公司', count: 1, totalAmount: '57.5000', purchaseCount: 3, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 5, name: '深圳市利雅优品科技有限公司', count: 1, totalAmount: '38.0000', purchaseCount: 5, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 6, name: '深圳市卓呈有品科技有限公司', count: 1, totalAmount: '18.0500', purchaseCount: 5, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 7, name: '义乌市波赫工艺品有限公司', count: 1, totalAmount: '123.0000', purchaseCount: 9, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 8, name: '义乌市冬盛饰品有限公司', count: 1, totalAmount: '17.9000', purchaseCount: 5, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 9, name: '九江义乌商贸有限公司', count: 1, totalAmount: '12.2200', purchaseCount: 4, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 10, name: '深圳市卡隆迪科技有限公司', count: 1, totalAmount: '50.0000', purchaseCount: 10, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 11, name: '东莞市厚街华吴服装经营部', count: 0, totalAmount: '0.0000', purchaseCount: 0, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '0.00%', avgCycle: '0.0000' },
  { id: 12, name: '中山市美尚智能科技有限公司', count: 1, totalAmount: '63.0000', purchaseCount: 3, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 13, name: '平阳县利派文具有限公司', count: 1, totalAmount: '27.2100', purchaseCount: 5, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 14, name: '义乌市莱源家居用品有限公司', count: 1, totalAmount: '295.0000', purchaseCount: 10, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
  { id: 15, name: '嘉兴市经开长水蓁柯电子商务经营部', count: 1, totalAmount: '16.5500', purchaseCount: 3, stockCount: 0, defectCount: '0.0000', returnCount: 0, deliveryRate: '100.00%', avgCycle: '0.0000' },
];

export function KpiList({ onViewDetail }: { onViewDetail: (supplier: any) => void }) {
  const [startDate, setStartDate] = useState('2026-01-24');
  const [endDate, setEndDate] = useState('2026-04-24');
  const [supplierName, setSupplierName] = useState('');
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-[13px] text-gray-700 mr-2 font-medium">时间维度:</span>
            <div className="flex items-center">
              <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 text-[13px] text-gray-600 rounded-l">日期</span>
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="h-8 w-32 text-[13px] rounded-none border-gray-300 focus-visible:ring-0" 
              />
              <span className="px-3 py-1.5 bg-gray-50 border-t border-b border-gray-300 text-[13px] text-gray-600">至</span>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="h-8 w-32 text-[13px] rounded-none border-gray-300 focus-visible:ring-0" 
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 text-[13px] text-gray-600 rounded-l">供应商名称</span>
            <Input 
              placeholder="双击可批量查询" 
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="h-8 w-48 text-[13px] rounded-none border-gray-300 focus-visible:ring-0" 
            />
            <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
            <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal rounded-l-none border border-l-0 border-[#6B8EBE] gap-1">
              <Search className="w-3.5 h-3.5" /> 搜索
            </Button>
            </FeatureMarker>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <FeatureMarker title="📥" description="交互说明：点击执行📥操作。">
              <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal gap-1">
                <span className="text-white">📥</span> 导出相关 <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </Button>
              </FeatureMarker>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-white">
              <DropdownMenuItem className="text-[13px] cursor-pointer">导出勾选数据</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] cursor-pointer">导出全部数据</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-center text-[13px] border-collapse bg-white">
          <thead className="bg-[#F8FAFC] text-gray-700 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-3 font-normal w-12 border-b border-r border-gray-200" rowSpan={2}>
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="p-3 font-normal border-b border-r border-gray-200" rowSpan={2}>供应商</th>
              <th className="p-3 font-normal border-b border-r border-gray-200" rowSpan={2}>
                采购次数 <span className="text-gray-400 text-[10px]">▼</span>
              </th>
              <th className="p-3 font-normal border-b border-r border-gray-200" rowSpan={2}>
                采购总金额 <span className="text-gray-400 text-[10px]">▼</span>
              </th>
              <th className="p-2 font-normal border-b border-r border-gray-200 bg-[#F1F5F9]" colSpan={4}>数量</th>
              <th className="p-3 font-normal border-b border-r border-gray-200" rowSpan={2}>交付准时率</th>
              <th className="p-3 font-normal border-b border-r border-gray-200" rowSpan={2}>
                <div className="flex items-center justify-center gap-1">
                  平均采购周期(小时) <span title="近90天该供应商平均采购周期"><HelpCircle className="w-3.5 h-3.5 text-blue-600" /></span>
                </div>
              </th>
              <th className="p-3 font-normal border-b border-gray-200 w-24" rowSpan={2}>操作</th>
            </tr>
            <tr>
              <th className="p-2 font-normal border-b border-r border-gray-200 bg-[#F8FAFC]">
                采购总数 <span className="text-gray-400 text-[10px]">▼</span>
              </th>
              <th className="p-2 font-normal border-b border-r border-gray-200 bg-[#F8FAFC]">
                入库总数 <span className="text-gray-400 text-[10px]">▼</span>
              </th>
              <th className="p-2 font-normal border-b border-r border-gray-200 bg-[#F8FAFC]">
                不良品数 <span className="text-gray-400 text-[10px]">▼</span>
              </th>
              <th className="p-2 font-normal border-b border-r border-gray-200 bg-[#F8FAFC]">
                退货数 <span className="text-gray-400 text-[10px]">▼</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockData.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30">
                <td className="p-3 border-r border-gray-100">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="p-3 border-r border-gray-100 text-gray-800 text-left">{item.name}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.count}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.totalAmount}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.purchaseCount}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.stockCount}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.defectCount}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.returnCount}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.deliveryRate}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.avgCycle}</td>
                <td className="p-3">
                  <FeatureMarker title="查看详情" description="交互说明：点击执行查看详情操作。">
                  <span className="text-blue-600 cursor-pointer hover:underline text-[13px]" onClick={() => onViewDetail(item)}>
                    查看详情
                  </span>
                  </FeatureMarker>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center p-3 border-t border-gray-200 text-[12px] text-gray-600 bg-[#F8FAFC] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded bg-white cursor-pointer">每页 50 条 <span className="text-[10px]">▲</span></span>
          <span className="ml-2">共1820条 当前显示第1-50条 1/37页</span>
          <div className="flex items-center gap-1 ml-4">
            <FeatureMarker title="&lt;&lt;" description="交互说明：点击执行&lt;&lt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-gray-50 text-gray-400">&lt;&lt;</button>
</FeatureMarker>
            <FeatureMarker title="&lt;" description="交互说明：点击执行&lt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-gray-50 text-gray-400">&lt;</button>
</FeatureMarker>
            <FeatureMarker title="1" description="交互说明：点击执行1操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent text-red-500 font-medium">1</button>
</FeatureMarker>
            <FeatureMarker title="2" description="交互说明：点击执行2操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-100 rounded text-gray-600">2</button>
</FeatureMarker>
            <FeatureMarker title="3" description="交互说明：点击执行3操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-100 rounded text-gray-600">3</button>
</FeatureMarker>
            <FeatureMarker title="4" description="交互说明：点击执行4操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-100 rounded text-gray-600">4</button>
</FeatureMarker>
            <FeatureMarker title="5" description="交互说明：点击执行5操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-100 rounded text-gray-600">5</button>
</FeatureMarker>
            <FeatureMarker title="&gt;" description="交互说明：点击执行&gt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-600">&gt;</button>
</FeatureMarker>
            <FeatureMarker title="&gt;&gt;" description="交互说明：点击执行&gt;&gt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-600">&gt;&gt;</button>
</FeatureMarker>
            <Input className="w-12 h-6 text-center text-[12px] px-1 mx-2" placeholder="页码" />
            <FeatureMarker title="跳转" description="交互说明：点击执行跳转操作。">
<Button variant="outline" className="h-6 text-[12px] px-3 bg-gray-50 border-gray-300">跳转</Button>
</FeatureMarker>
          </div>
        </div>
      </div>
    </div>
  );
}
