import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Search, ChevronDown, Download, Upload, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function PaymentExecution() {
  const [searchType, setSearchType] = useState('关联单号');

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0 text-[13px] space-y-4">
        {/* Row 1 */}
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium w-16 text-right">搜索:</span>
          <div className="flex items-center gap-4">
            {['关联单号', '自定义单号', '付款单号', '创建人', '第三方单号'].map(opt => (
              <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="execSearchType" 
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" 
                  checked={searchType === opt}
                  onChange={() => setSearchType(opt)}
                />
                <span className="text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
          <Input className="w-64 h-8 text-[12px] ml-2" placeholder="双击可批量查询" />
          <div className="flex items-center ml-4 gap-2">
            <span className="text-gray-600">预计付款时间</span>
            <Input type="date" className="w-32 h-8 text-[12px]" />
            <span className="text-gray-400">至</span>
            <Input type="date" className="w-32 h-8 text-[12px]" />
          </div>
          <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 ml-2">
            <Search className="w-3.5 h-3.5 mr-1.5" /> 搜索
          </Button>
          </FeatureMarker>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex items-center">
            <span className="text-gray-700 font-medium w-16 text-right mr-4 flex-shrink-0">状态:</span>
            <div className="flex items-center gap-3">
              <span className="cursor-pointer px-2 py-1 rounded text-blue-600 border border-blue-600 bg-blue-50">待支付</span>
              <span className="text-gray-600 hover:text-blue-600 cursor-pointer">已支付</span>
              <span className="text-gray-600 hover:text-blue-600 cursor-pointer">支付失败</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 font-medium w-16 text-right mr-4 flex-shrink-0">类型:</span>
            <div className="flex items-center gap-3">
              <span className="cursor-pointer px-2 py-1 rounded text-blue-600 border border-blue-600 bg-blue-50">全部</span>
              <span className="text-gray-600 hover:text-blue-600 cursor-pointer">1688采购</span>
              <span className="text-gray-600 hover:text-blue-600 cursor-pointer">普通采购</span>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Operations */}
      <div className="p-3 border-b border-gray-200 bg-[#F8FAFC] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-[13px] text-white">
            批量处理功能 <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
          </FeatureMarker>
          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <Button className="h-8 bg-[#FF6B00] hover:bg-[#E66000] text-[13px] text-white border-0">
            批量支付 <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
          </FeatureMarker>
          <div className="flex items-center text-[12px]">
            <AlertTriangle className="w-4 h-4 text-orange-500 mr-1.5" />
            <span className="text-orange-500 font-medium">批量支付最多支持30条，不同1688帐号的请分开支付</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-700 ml-2">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            查看本人创建付款单
          </label>
        </div>
        <div className="flex gap-2">
          <FeatureMarker title="导入" description="交互说明：点击上传文件并批量导入数据。">
          <Button variant="outline" className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white border-0 text-[13px]">
            <Upload className="w-3.5 h-3.5 mr-1.5" /> 导入
          </Button>
          </FeatureMarker>
          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <Button variant="outline" className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white border-0 text-[13px]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> 导出 <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
          </FeatureMarker>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-[12px] text-left border-collapse">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200 shadow-sm">
            <tr className="text-gray-600">
              <th className="p-3 w-10 text-center font-normal border-r border-gray-200"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-32">付款单号</th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-40">
                关联单号<br/>自定义单号<br/>第三方单号<br/>平台状态
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-32">
                付款账号<br/>收款方式<br/>结款方式<br/>支付状态
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-32">
                应付金额<br/>采购单金额<br/>已付款<br/>未付款
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-40">
                供应商<br/>收款人<br/>账号名称<br/>收款账号
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-32">
                下单员<br/>下单时间<br/>支付方式<br/>交易方式
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-40">
                创建人/时间<br/>预计付款时间<br/>自定义分类<br/>类型
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-32">
                审核人<br/>审核时间<br/>类型
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-48">备注</th>
              <th className="p-3 font-normal text-center w-24">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {/* Mock Row 1 */}
            <tr className="hover:bg-blue-50/50 transition-colors">
              <td className="p-3 text-center border-r border-gray-200 align-middle"><input type="checkbox" className="rounded border-gray-300" /></td>
              <td className="p-3 border-r border-gray-200 align-middle text-center">
                <span className="text-blue-600 hover:underline cursor-pointer">FK2026030411495868</span>
              </td>
              <td className="p-3 border-r border-gray-200 align-middle text-center">
                <div className="text-blue-600 hover:underline cursor-pointer font-medium flex items-center justify-center">1570536110 <span className="bg-red-500 text-white text-[10px] px-1 rounded-sm ml-1">P</span></div>
                <div className="text-gray-500 mt-1">【暂无】</div>
                <div className="text-gray-400 mt-1">--</div>
                <div className="text-gray-400 mt-1">--</div>
              </td>
              <td className="p-3 border-r border-gray-200 align-middle text-center">
                <div className="text-gray-800">中国银行</div>
                <div className="text-gray-600 mt-1">现款</div>
                <div className="text-gray-400 mt-1">--</div>
                <div className="text-gray-800 mt-1">待支付</div>
                <div className="text-blue-600 cursor-pointer hover:underline mt-1 text-[11px]">审核详情</div>
              </td>
              <td className="p-3 border-r border-gray-200 align-middle text-center">
                <div className="text-gray-800">RMB 89</div>
                <div className="text-gray-600 mt-1">RMB 89</div>
                <div className="text-gray-600 mt-1">RMB 0</div>
                <div className="text-gray-800 mt-1">RMB 89</div>
              </td>
              <td className="p-3 border-r border-gray-200 align-middle text-center">
                <div className="text-gray-800">开发通用供应商</div>
                <div className="text-gray-400 mt-1">--</div>
                <div className="text-gray-400 mt-1">--</div>
                <div className="text-gray-400 mt-1">--</div>
              </td>
              <td className="p-3 border-r border-gray-200 align-middle text-center">
                <div className="text-gray-800">Duke</div>
                <div className="text-gray-600 mt-1">2026-03-02</div>
                <div className="text-gray-400 mt-1">--</div>
                <div className="text-gray-400 mt-1">--</div>
              </td>
              <td className="p-3 border-r border-gray-200 align-middle text-center">
                <div className="text-gray-800">王朋</div>
                <div className="text-gray-600 mt-1">2026-03-04</div>
                <div className="text-gray-600 mt-1">2026-03-04</div>
                <div className="text-gray-600 mt-1">采购</div>
              </td>
              <td className="p-3 border-r border-gray-200 align-middle text-center">
                <div className="text-gray-800">王朋</div>
                <div className="text-gray-600 mt-1">2026-03-04 11:49</div>
                <div className="text-gray-600 mt-1">采购</div>
              </td>
              <td className="p-3 border-r border-gray-200 align-middle">
                <textarea className="w-full h-16 border border-gray-300 rounded p-1 text-[12px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </td>
              <td className="p-3 align-middle text-center">
                <div className="text-blue-600 cursor-pointer hover:underline mb-1">详情</div>
                <div className="text-blue-600 cursor-pointer hover:underline">完成付款</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
