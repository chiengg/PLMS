import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, ChevronLeft, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function KpiDetail({ supplier, onBack }: { supplier: any, onBack: () => void }) {
  const [startDate, setStartDate] = useState('2026-01-24');
  const [endDate, setEndDate] = useState('2026-04-24');
  const [activeTab, setActiveTab] = useState('product');

  return (
    <div className="flex flex-col h-full bg-[#F1F4F9]">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-gray-200 flex items-center bg-white flex-shrink-0 gap-4">
        <FeatureMarker title="返回" description="交互说明：点击执行返回操作。">
        <Button variant="outline" className="h-8 px-3 border-gray-300 text-gray-600 gap-1 text-[13px]" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" /> 返回
        </Button>
        </FeatureMarker>
        <div className="flex items-center">
          <span className="text-[13px] text-gray-700 mr-2 font-medium">搜索条件:</span>
          <div className="flex items-center">
            <Input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="h-8 w-32 text-[13px] rounded-r-none border-gray-300 focus-visible:ring-0" 
            />
            <span className="px-3 py-1.5 bg-gray-50 border-t border-b border-gray-300 text-[13px] text-gray-600">至</span>
            <Input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="h-8 w-32 text-[13px] rounded-none border-gray-300 focus-visible:ring-0" 
            />
            <FeatureMarker title="刷新" description="交互说明：点击执行刷新操作。">
            <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal rounded-l-none border border-l-0 border-[#6B8EBE] gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> 刷新
            </Button>
            </FeatureMarker>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-4 flex flex-col gap-4">
        
        {/* Statistics Section */}
        <div className="bg-white rounded shadow-sm border border-gray-200 p-5 flex flex-col gap-6">
          
          {/* Chart Area */}
          <TooltipProvider>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center border border-blue-200 bg-blue-50 rounded px-6 py-4">
                <div className="flex-1 text-center">
                  <div className="text-[13px] text-blue-600 font-medium mb-1 flex items-center justify-center gap-1">
                    交付准时率
                    <Tooltip>
                      <TooltipTrigger><HelpCircle className="w-3.5 h-3.5" /></TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white text-[12px] border-none">
                        <p>交付准时率 = (总数量 - 延迟数量) / 总数量</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-[24px] font-bold text-blue-900">98.5%</div>
                </div>
              </div>
              <div className="flex items-center border border-orange-200 bg-orange-50 rounded px-6 py-4">
                <div className="flex-1 text-center">
                  <div className="text-[13px] text-orange-600 font-medium mb-1 flex items-center justify-center gap-1">
                    到货不符次数
                    <Tooltip>
                      <TooltipTrigger><HelpCircle className="w-3.5 h-3.5" /></TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white text-[12px] border-none">
                        <p>到货不符次数，即有收货异常</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-[24px] font-bold text-orange-900">2</div>
                </div>
              </div>
              <div className="flex items-center border border-green-200 bg-green-50 rounded px-6 py-4">
                <div className="flex-1 text-center">
                  <div className="text-[13px] text-green-600 font-medium mb-1 flex items-center justify-center gap-1">
                    一次合格率
                    <Tooltip>
                      <TooltipTrigger><HelpCircle className="w-3.5 h-3.5" /></TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white text-[12px] border-none">
                        <p>一次合格率 = (采购单总数量 - 到货不符次数) / 采购单总数量</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-[24px] font-bold text-green-900">99.1%</div>
                </div>
              </div>
              <div className="flex items-center border border-red-200 bg-red-50 rounded px-6 py-4">
                <div className="flex-1 text-center">
                  <div className="text-[13px] text-red-600 font-medium mb-1 flex items-center justify-center gap-1">
                    退货率
                    <Tooltip>
                      <TooltipTrigger><HelpCircle className="w-3.5 h-3.5" /></TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white text-[12px] border-none">
                        <p>退货率 = 退货数量 / 总收货数量</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-[24px] font-bold text-red-900">1.2%</div>
                </div>
              </div>
            </div>
          </TooltipProvider>

          {/* Info Area (Inline) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center text-[13px] bg-[#F8FAFC] px-4 py-3 rounded border border-gray-100 overflow-x-auto whitespace-nowrap">
              <div className="font-bold text-gray-800 mr-8 flex-shrink-0">供应商信息</div>
              <div className="flex items-center gap-8 text-gray-600">
                <span>供应商名称：<span className="text-gray-900 font-medium">{supplier?.name || '平潭综合实验区盈创贸易有限公司'}</span></span>
                <span>采购员：<span className="text-gray-900">--</span></span>
                <span>临时采购员：<span className="text-gray-900">--</span></span>
                <span>收款方式：<span className="text-gray-900">--</span></span>
                <span>付款方式：<span className="text-gray-900">--</span></span>
              </div>
            </div>

            <div className="flex items-center text-[13px] bg-[#F8FAFC] px-4 py-3 rounded border border-gray-100 overflow-x-auto whitespace-nowrap">
              <div className="font-bold text-gray-800 mr-8 flex-shrink-0">采购统计信息</div>
              <div className="flex items-center gap-8 text-gray-600">
                <span>采购总金额：<span className="text-blue-600 font-medium">94.6800</span></span>
                <span>已付总金额：<span className="text-green-600 font-medium">94.6800</span></span>
                <span>未付金额：<span className="text-red-500 font-medium">0.0000</span></span>
                <span>采购次数：<span className="text-gray-900">1</span></span>
                <span>不良品数(按单)：<span className="text-gray-900">0</span></span>
                <span>来少次数(按单)：<span className="text-gray-900">0</span></span>
                <span>最近一次采购时间：<span className="text-gray-900 font-medium">2026-04-23 16:24:03</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Tabs Area */}
        <div className="bg-white rounded shadow-sm border border-gray-200 flex-1 flex flex-col min-h-[400px]">
          {/* Tabs */}
          <div className="flex bg-[#F8FAFC] border-b border-gray-200 px-4 pt-2">
            <div 
              className={`px-8 py-2.5 text-[14px] cursor-pointer font-medium relative rounded-t ${activeTab === 'product' ? 'text-blue-600 bg-white border border-b-0 border-gray-200' : 'text-gray-600 hover:text-blue-500 border border-transparent'}`}
              onClick={() => setActiveTab('product')}
            >
              产品
              {activeTab === 'product' && <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-600 rounded-t"></div>}
              {activeTab === 'product' && <div className="absolute -bottom-[1px] left-0 w-full h-[1px] bg-white"></div>}
            </div>
            <div 
              className={`px-8 py-2.5 text-[14px] cursor-pointer font-medium relative rounded-t ${activeTab === 'order' ? 'text-blue-600 bg-white border border-b-0 border-gray-200' : 'text-gray-600 hover:text-blue-500 border border-transparent'}`}
              onClick={() => setActiveTab('order')}
            >
              采购单
              {activeTab === 'order' && <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-600 rounded-t"></div>}
              {activeTab === 'order' && <div className="absolute -bottom-[1px] left-0 w-full h-[1px] bg-white"></div>}
            </div>
          </div>
            
          <div className="flex-1 flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
                {activeTab === 'product' ? (
                  <div className="flex w-[300px]">
                    <Input className="h-8 text-[13px] flex-1 rounded-r-none border-gray-300 focus-visible:ring-0" placeholder="请输入您的SKU编码" />
                    <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
                    <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-5 text-[13px] font-normal rounded-l-none border border-l-0 border-[#6B8EBE] gap-1">
                      <Search className="w-3.5 h-3.5" /> 搜索
                    </Button>
                    </FeatureMarker>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 text-[13px] text-gray-600 rounded">创建时间</span>
                    <div className="flex items-center">
                      <Input type="date" className="h-8 w-32 text-[13px] rounded-r-none border-gray-300 focus-visible:ring-0" />
                      <span className="px-3 py-1.5 bg-gray-50 border-t border-b border-gray-300 text-[13px] text-gray-600">至</span>
                      <Input type="date" className="h-8 w-32 text-[13px] rounded-none border-gray-300 focus-visible:ring-0" />
                      <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
                      <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal rounded-l-none border border-l-0 border-[#6B8EBE] gap-1">
                        <Search className="w-3.5 h-3.5" /> 搜索
                      </Button>
                      </FeatureMarker>
                    </div>
                    <div className="flex items-center ml-2">
                      <select className="h-8 px-3 py-1 border border-gray-300 rounded-l text-[13px] bg-white outline-none border-r-0">
                        <option>采购单号</option>
                        <option>库存SKU</option>
                        <option>自定义单号</option>
                      </select>
                      <Input className="h-8 w-40 text-[13px] rounded-none border-gray-300 focus-visible:ring-0" placeholder="请输入搜索内容" />
                      <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
                      <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal rounded-l-none border border-l-0 border-[#6B8EBE] gap-1">
                        <Search className="w-3.5 h-3.5" /> 搜索
                      </Button>
                      </FeatureMarker>
                    </div>
                  </div>
                )}
                
                <FeatureMarker title="导出" description="交互说明：点击将当前列表数据导出为Excel文件。">
                <Button className="h-8 bg-[#8CB5E2] hover:bg-[#7AA4D1] text-white px-5 text-[13px] font-normal">
                  导出
                </Button>
                </FeatureMarker>
              </div>

              {activeTab === 'product' ? (
                <div className="flex-1 overflow-auto custom-scrollbar border border-gray-200 rounded">
                  <table className="w-full text-center text-[13px] border-collapse bg-white">
                    <thead className="bg-[#F8FAFC] text-gray-700 sticky top-0 z-10 border-b border-gray-200">
                      <tr>
                        <th className="p-3 font-normal w-12 border-r border-gray-200"><input type="checkbox" className="rounded border-gray-300" /></th>
                        <th className="p-3 font-normal border-r border-gray-200 text-left">库存SKU</th>
                        <th className="p-3 font-normal border-r border-gray-200 text-left">产品名称</th>
                        <th className="p-3 font-normal border-r border-gray-200">单价</th>
                        <th className="p-3 font-normal border-r border-gray-200">近五次采购均价</th>
                        <th className="p-3 font-normal border-r border-gray-200">来少次数(按SKU)</th>
                        <th className="p-3 font-normal border-r border-gray-200">不良品数(按SKU)</th>
                        <th className="p-3 font-normal">最后一次采购时间<br/>最后一次入库时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[1, 2].map((i) => (
                        <tr key={i} className="hover:bg-blue-50/30">
                          <td className="p-3 border-r border-gray-100"><input type="checkbox" className="rounded border-gray-300" /></td>
                          <td className="p-3 border-r border-gray-100 text-left text-blue-600 underline cursor-pointer">10006102-0-A0-AMHyper</td>
                          <td className="p-3 border-r border-gray-100 text-left text-gray-800">AMHyper世界杯大白鹅摆件服饰</td>
                          <td className="p-3 border-r border-gray-100 text-gray-800">13.7800</td>
                          <td className="p-3 border-r border-gray-100 text-gray-800">--</td>
                          <td className="p-3 border-r border-gray-100 text-gray-800">0</td>
                          <td className="p-3 border-r border-gray-100 text-gray-800">0</td>
                          <td className="p-3 text-gray-600">2026-04-23 16:24:03<br/>--</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex-1 overflow-auto custom-scrollbar border border-gray-200 rounded">
                  <table className="w-full text-center text-[13px] border-collapse bg-white">
                    <thead className="bg-[#F8FAFC] text-gray-700 sticky top-0 z-10 border-b border-gray-200">
                      <tr>
                        <th className="p-3 font-normal w-12 border-r border-gray-200"><input type="checkbox" className="rounded border-gray-300" /></th>
                        <th className="p-3 font-normal border-r border-gray-200 text-left">采购单号</th>
                        <th className="p-3 font-normal border-r border-gray-200">自定义单号</th>
                        <th className="p-3 font-normal border-r border-gray-200">采购员</th>
                        <th className="p-3 font-normal border-r border-gray-200">时间</th>
                        <th className="p-3 font-normal border-r border-gray-200">采购数(个)</th>
                        <th className="p-3 font-normal border-r border-gray-200">不良品数(个)</th>
                        <th className="p-3 font-normal border-r border-gray-200">入库数(个)</th>
                        <th className="p-3 font-normal">应付总金额</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { id: '1570553976', time: '2026-04-24 14:20:25', count: 5, amount: '84.8800' },
                        { id: '1570553434', time: '2026-04-23 16:24:03', count: 6, amount: '94.6600' }
                      ].map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/30">
                          <td className="p-3 border-r border-gray-100"><input type="checkbox" className="rounded border-gray-300" /></td>
                          <td className="p-3 border-r border-gray-100 text-left text-blue-600 underline cursor-pointer">{item.id}</td>
                          <td className="p-3 border-r border-gray-100 text-gray-800"></td>
                          <td className="p-3 border-r border-gray-100 text-gray-800">--</td>
                          <td className="p-3 border-r border-gray-100 text-gray-600">{item.time}</td>
                          <td className="p-3 border-r border-gray-100 text-gray-800">{item.count}</td>
                          <td className="p-3 border-r border-gray-100 text-gray-800">0</td>
                          <td className="p-3 border-r border-gray-100 text-gray-800">0</td>
                          <td className="p-3 text-gray-800">{item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}