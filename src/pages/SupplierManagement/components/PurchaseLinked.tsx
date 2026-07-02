import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';

interface PurchaseLinkedProps {
  supplier: any;
  onBack: () => void;
}

export default function PurchaseLinked({ supplier, onBack }: PurchaseLinkedProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [linkedProducts] = useState<any[]>([]); // Using empty array to show the empty state in screenshot

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] relative overflow-hidden">
      <div className="flex-1 overflow-auto custom-scrollbar p-4 flex flex-col gap-4">
        
        {/* 基本信息 */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="bg-[#F8FAFC] border-b border-gray-200 p-3 text-[13px] text-gray-800 font-medium">
            基本信息
          </div>
          <div className="p-4 grid grid-cols-2 gap-x-12 gap-y-4 text-[13px] text-gray-600">
            <div className="flex items-center">
              <span className="w-24 text-right mr-4">供应商：</span>
              <span className="text-gray-800 font-medium">{supplier?.name}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-right mr-4">供应商链接：</span>
              <span className="text-blue-500 cursor-pointer hover:underline">{supplier?.link1688 || '--'}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-right mr-4">联系人：</span>
              <span>{supplier?.contactName || '--'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-right mr-4">联系电话：</span>
              <span>{supplier?.contactPhone || '--'}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-right mr-4">QQ：</span>
              <span>{supplier?.qq || '--'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-right mr-4">旺旺：</span>
              <span>{supplier?.wangwang || '--'}</span>
            </div>
          </div>
        </div>

        {/* 采购列表区 */}
        <div className="bg-white border border-gray-200 rounded flex-1 flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 border-b border-gray-200 flex flex-wrap items-center gap-3 text-[13px]">
            <span className="text-gray-700 font-medium">搜索内容：</span>
            <div className="flex items-center gap-4 text-gray-600 mr-2">
              {['商品SKU', '商品中文名', '商品英文名', '仓库'].map(t => (
                <label key={t} className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                  <input type="radio" name="kwType" defaultChecked={t === '商品SKU'} />
                  {t}
                </label>
              ))}
            </div>
            
            <div className="flex items-center">
              <Input className="h-8 w-48 border-gray-300 focus-visible:ring-0 text-[12px] rounded-r-none" placeholder="双击可批量查询" />
              <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
              <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 rounded-l-none font-normal gap-1">
                <Search className="w-3.5 h-3.5" /> 搜索
              </Button>
              </FeatureMarker>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <FeatureMarker title="批量修改采购量" description="交互说明：点击打开编辑弹窗，修改当前项信息。">
<Button variant="outline" className="h-8 text-[12px] font-normal border-gray-300">批量修改采购量</Button>
</FeatureMarker>
              <Input className="h-8 w-32 border-gray-300 focus-visible:ring-0 text-[12px]" placeholder="请输入采购量" />
              <FeatureMarker title="修改" description="交互说明：点击打开编辑弹窗，修改当前项信息。">
<Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 font-normal">修改</Button>
</FeatureMarker>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-[12px] text-center border-collapse min-w-[1000px]">
              <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
                <tr className="text-gray-600">
                  <th className="p-3 w-10 font-normal border-r border-gray-100">
                    <Checkbox />
                  </th>
                  <th className="p-3 font-normal min-w-[200px] border-r border-gray-100 text-left">商品信息</th>
                  <th className="p-3 font-normal w-32 border-r border-gray-100">仓库<br/>已发货(7/28/42)</th>
                  <th className="p-3 font-normal w-32 border-r border-gray-100">库存量<br/><span className="text-red-500">采购中/申请</span></th>
                  <th className="p-3 font-normal w-32 border-r border-gray-100">警戒量<br/>待发货量</th>
                  <th className="p-3 font-normal w-32 border-r border-gray-100">日销量<br/>采购天数</th>
                  <th className="p-3 font-normal w-24 border-r border-gray-100">采购量</th>
                  <th className="p-3 font-normal w-32 border-r border-gray-100">最低采购价<br/>上次采购价<br/>最新采购价</th>
                  <th className="p-3 font-normal w-24">采购单价<br/>采购总价</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {linkedProducts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-16">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="text-4xl mb-2">☹</div>
                        <div className="text-[14px] font-medium text-gray-600">暂无内容！</div>
                        <div className="text-[12px]">没有找到相关记录。</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-3 border-t border-gray-200 text-[12px] text-gray-600 bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span>每页</span>
              <select className="border border-gray-300 rounded outline-none h-6 px-1">
                <option>50 条</option>
              </select>
              <span>共 0 条 当前显示第 0-0 条 0 页</span>
              <div className="flex items-center gap-1 ml-2">
                <FeatureMarker title="&lt;&lt;" description="交互说明：点击执行&lt;&lt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-400">&lt;&lt;</button>
</FeatureMarker>
                <FeatureMarker title="&lt;" description="交互说明：点击执行&lt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-400">&lt;</button>
</FeatureMarker>
                <FeatureMarker title="&gt;" description="交互说明：点击执行&gt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-400">&gt;</button>
</FeatureMarker>
                <FeatureMarker title="&gt;&gt;" description="交互说明：点击执行&gt;&gt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-400">&gt;&gt;</button>
</FeatureMarker>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-3 border-t border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
        <FeatureMarker title="返回" description="交互说明：点击执行返回操作。">
<Button variant="outline" className="h-8 px-6 font-normal bg-gray-50" onClick={onBack}>返回</Button>
</FeatureMarker>
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-gray-600">共选择了 0 个商品种类</span>
          <FeatureMarker title="+ 生成采购单" description="交互说明：点击执行+ 生成采购单操作。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 font-normal" disabled>
            + 生成采购单
          </Button>
          </FeatureMarker>
        </div>
      </div>
    </div>
  );
}
