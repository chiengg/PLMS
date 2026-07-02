import { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function PlansFilter() {
  const [searchType, setSearchType] = useState('sku');

  return (
    <div className="bg-white p-4 rounded shadow-sm border border-gray-200 mb-4 space-y-4">
      <div className="flex items-center flex-wrap gap-4">
        <div className="flex items-center text-[13px]">
          <span className="font-medium mr-4">搜索:</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center space-x-1.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="searchType" 
                  value="sku" 
                  checked={searchType === 'sku'} 
                  onChange={() => setSearchType('sku')} 
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-input peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                  {searchType === 'sku' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <span className="text-[13px] font-normal group-hover:text-gray-900">库存SKU</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="searchType" 
                  value="name" 
                  checked={searchType === 'name'} 
                  onChange={() => setSearchType('name')} 
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-input peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                  {searchType === 'name' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <span className="text-[13px] font-normal group-hover:text-gray-900">商品名称</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="searchType" 
                  value="plan" 
                  checked={searchType === 'plan'} 
                  onChange={() => setSearchType('plan')} 
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-input peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                  {searchType === 'plan' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <span className="text-[13px] font-normal group-hover:text-gray-900">采购计划号</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="searchType" 
                  value="note" 
                  checked={searchType === 'note'} 
                  onChange={() => setSearchType('note')} 
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-input peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                  {searchType === 'note' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <span className="text-[13px] font-normal group-hover:text-gray-900">备注</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="searchType" 
                  value="applicant" 
                  checked={searchType === 'applicant'} 
                  onChange={() => setSearchType('applicant')} 
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-input peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                  {searchType === 'applicant' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <span className="text-[13px] font-normal group-hover:text-gray-900">申请人</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="searchType" 
                  value="buyer" 
                  checked={searchType === 'buyer'} 
                  onChange={() => setSearchType('buyer')} 
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-full border border-input peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                  {searchType === 'buyer' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <span className="text-[13px] font-normal group-hover:text-gray-900">采购员</span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center">
          <Input 
            placeholder="双击可批量查询" 
            className="w-64 h-8 text-[13px] border-gray-300 rounded-r-none focus-visible:ring-0"
          />
          <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
          <Button className="h-8 px-4 bg-blue-600 hover:bg-blue-700 rounded-l-none text-[13px]">
            <Search className="w-4 h-4 mr-1" />
            搜索
          </Button>
          </FeatureMarker>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[13px]">
        <div className="flex items-center gap-2">
          <span>仓库:</span>
          <Select defaultValue="dongguan">
            <SelectTrigger className="w-32 h-8 text-[13px] border-gray-300">
              <SelectValue placeholder="东莞厚街仓" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dongguan">东莞厚街仓</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span>计划来源:</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-32 h-8 text-[13px] border-gray-300">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="suggest">采购建议</SelectItem>
              <SelectItem value="manual">手动创建</SelectItem>
              <SelectItem value="import">批量导入</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span>采购状态:</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-32 h-8 text-[13px] border-gray-300">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="unpurchased">未采购</SelectItem>
              <SelectItem value="purchased">已采购</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span>删除原因:</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-32 h-8 text-[13px] border-gray-300">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="yes">有</SelectItem>
              <SelectItem value="no">无</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-blue-600 cursor-pointer ml-2 hover:underline">
          更多 {'>'}
        </div>
      </div>
    </div>
  );
}
