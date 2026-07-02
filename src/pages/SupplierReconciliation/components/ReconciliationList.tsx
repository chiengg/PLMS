import React, { useMemo, useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, RefreshCw, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Cycle = 'daily' | 'monthly';
type StatementType = 'purchase' | 'sample';

type StatementRow = {
  id: string;
  period: string;
  supplier: string;
  platform: string;
  purchaser: string;
  account1688: string;
  billAmount: string;
  createdAt: string;
};

export default function ReconciliationList() {
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<Cycle>('daily');
  const [statementType, setStatementType] = useState<StatementType>('purchase');

  const [billStart, setBillStart] = useState('');
  const [billEnd, setBillEnd] = useState('');
  const [supplier, setSupplier] = useState('全部');
  const [platform, setPlatform] = useState('全部');
  const [purchaser, setPurchaser] = useState('全部');
  const [account1688, setAccount1688] = useState('全部');

  const rows = useMemo<StatementRow[]>(() => {
    if (cycle === 'daily') {
      if (statementType === 'purchase') {
        return [
          { id: 'd-p-all', period: '2026-04-24', supplier: '全部', platform: '全部', purchaser: '全部', account1688: '全部', billAmount: '¥ 128,000.00', createdAt: '2026-04-25 10:20:30' }
        ];
      }
      return [
        { id: 'd-s-all', period: '2026-04-24', supplier: '全部', platform: '全部', purchaser: '全部', account1688: '全部', billAmount: '¥ 32,560.00', createdAt: '2026-04-25 10:20:30' }
      ];
    }

    if (statementType === 'purchase') {
      return [
        { id: 'm-p-all', period: '2026-03', supplier: '全部', platform: '全部', purchaser: '全部', account1688: '全部', billAmount: '¥ 2,560,000.00', createdAt: '2026-04-01 09:10:05' }
      ];
    }

    return [
      { id: 'm-s-all', period: '2026-03', supplier: '全部', platform: '全部', purchaser: '全部', account1688: '全部', billAmount: '¥ 356,000.00', createdAt: '2026-04-01 09:10:05' }
    ];
  }, [cycle, statementType]);

  const handleReset = () => {
    setBillStart('');
    setBillEnd('');
    setSupplier('全部');
    setPlatform('全部');
    setPurchaser('全部');
    setAccount1688('全部');
  };

  const billInputType = cycle === 'daily' ? 'date' : 'month';

  return (
    <div className="flex flex-col h-full bg-white rounded shadow-sm border border-gray-200">
      <div className="flex bg-[#F8FAFC] px-4 pt-2 border-b border-gray-200">
        <button
          type="button"
          className={`px-8 py-2.5 text-[14px] cursor-pointer font-medium relative rounded-t ${cycle === 'daily' ? 'text-blue-600 bg-white border border-b-0 border-gray-200' : 'text-gray-600 hover:text-blue-500 border border-transparent'}`}
          onClick={() => setCycle('daily')}
        >
          日账单
          {cycle === 'daily' && <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-600 rounded-t"></div>}
          {cycle === 'daily' && <div className="absolute -bottom-[1px] left-0 w-full h-[1px] bg-white"></div>}
        </button>
        <button
          type="button"
          className={`px-8 py-2.5 text-[14px] cursor-pointer font-medium relative rounded-t ${cycle === 'monthly' ? 'text-blue-600 bg-white border border-b-0 border-gray-200' : 'text-gray-600 hover:text-blue-500 border border-transparent'}`}
          onClick={() => setCycle('monthly')}
        >
          月账单
          {cycle === 'monthly' && <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-600 rounded-t"></div>}
          {cycle === 'monthly' && <div className="absolute -bottom-[1px] left-0 w-full h-[1px] bg-white"></div>}
        </button>
      </div>

      <div className="pt-4 px-4 border-b border-gray-200 flex flex-col gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center">
            <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">账单时间:</span>
            <div className="flex items-center">
              <Input
                type={billInputType}
                value={billStart}
                onChange={(e) => setBillStart(e.target.value)}
                className="h-8 w-[150px] text-[13px] rounded-r-none border-gray-300 focus-visible:ring-0"
              />
              <span className="px-2 py-1.5 bg-gray-50 border-y border-gray-300 text-[13px] text-gray-500">至</span>
              <Input
                type={billInputType}
                value={billEnd}
                onChange={(e) => setBillEnd(e.target.value)}
                className="h-8 w-[150px] text-[13px] rounded-l-none border-gray-300 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">供应商:</span>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="h-8 w-[150px] px-3 border border-gray-300 rounded text-[13px] bg-white outline-none focus:border-blue-500"
            >
              <option value="全部">全部</option>
              <option value="义乌市佳奇服饰有限公司">义乌市佳奇服饰有限公司</option>
              <option value="广州市顺达皮革有限公司">广州市顺达皮革有限公司</option>
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">采购平台:</span>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="h-8 w-[120px] px-3 border border-gray-300 rounded text-[13px] bg-white outline-none focus:border-blue-500"
            >
              <option value="全部">全部</option>
              <option value="1688">1688</option>
              <option value="淘宝">淘宝</option>
              <option value="拼多多">拼多多</option>
              <option value="线下供应商">线下供应商</option>
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">采购员:</span>
            <select
              value={purchaser}
              onChange={(e) => setPurchaser(e.target.value)}
              className="h-8 w-[120px] px-3 border border-gray-300 rounded text-[13px] bg-white outline-none focus:border-blue-500"
            >
              <option value="全部">全部</option>
              <option value="张三">张三</option>
              <option value="李四">李四</option>
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-[13px] text-gray-600 mr-2 whitespace-nowrap">1688账号:</span>
            <select
              value={account1688}
              onChange={(e) => setAccount1688(e.target.value)}
              className="h-8 w-[140px] px-3 border border-gray-300 rounded text-[13px] bg-white outline-none focus:border-blue-500"
            >
              <option value="全部">全部</option>
              <option value="1688账号A">1688账号A</option>
              <option value="1688账号B">1688账号B</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
              <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal gap-1">
                <Search className="w-3.5 h-3.5" /> 搜索
              </Button>
            </FeatureMarker>
            <FeatureMarker title="重置" description="交互说明：点击执行重置操作。">
              <Button
                variant="outline"
                className="h-8 px-4 border-gray-300 text-gray-600 text-[13px] gap-1"
                onClick={handleReset}
              >
                <RefreshCw className="w-3.5 h-3.5" /> 重置
              </Button>
            </FeatureMarker>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`px-4 py-1.5 text-[13px] cursor-pointer font-medium rounded ${statementType === 'purchase' ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'text-gray-600 hover:text-blue-500 border border-transparent'}`}
            onClick={() => setStatementType('purchase')}
          >
            采购对账单
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 text-[13px] cursor-pointer font-medium rounded ${statementType === 'sample' ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'text-gray-600 hover:text-blue-500 border border-transparent'}`}
            onClick={() => setStatementType('sample')}
          >
            采样对账单
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-center text-[13px] border-collapse min-w-[1200px]">
          <thead className="bg-[#F8FAFC] text-gray-700 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-3 font-normal border-b border-r border-gray-200">账期</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">供应商</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">采购平台</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">采购员</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">1688账号</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">账单金额</th>
              <th className="p-3 font-normal border-b border-r border-gray-200">创建日期</th>
              <th className="p-3 font-normal border-b border-gray-200">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/30">
                <td className="p-3 border-r border-gray-100 text-gray-800">{row.period}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{row.supplier}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{row.platform}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{row.purchaser}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{row.account1688}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{row.billAmount}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{row.createdAt}</td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate(`/supplier-reconciliation/${cycle}/${statementType}/${row.id}`)}
                    >
                      详情
                    </button>
                    <button type="button" className="text-blue-600 cursor-pointer hover:underline flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> 下载
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-gray-200 flex items-center justify-between bg-white text-[13px] text-gray-600">
        <div>共 {rows.length} 条记录</div>
        <div className="flex items-center gap-2">
          <FeatureMarker title="上一页" description="交互说明：点击执行上一页操作。">
            <Button variant="outline" className="h-7 px-2 text-[13px]" disabled>
              上一页
            </Button>
          </FeatureMarker>
          <span className="px-2">1</span>
          <FeatureMarker title="下一页" description="交互说明：点击执行下一页操作。">
            <Button variant="outline" className="h-7 px-2 text-[13px]" disabled>
              下一页
            </Button>
          </FeatureMarker>
        </div>
      </div>
    </div>
  );
}
