import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { ContractTable } from './components/ContractTable';

export default function ContractManagement() {
  const [searchType, setSearchType] = useState('模板名称');
  const [keyword, setKeyword] = useState('');

  return (
    <div className="flex flex-col h-full bg-[#F1F4F9]">
      <div className="bg-white p-4 pb-4 border-b border-gray-200 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-bold text-gray-700">搜索内容:</span>
          <label className="flex items-center gap-1.5 text-[13px] text-gray-600 cursor-pointer">
            <input 
              type="radio" 
              name="searchType" 
              className="text-blue-600 focus:ring-blue-500"
              checked={searchType === '模板名称'} 
              onChange={() => setSearchType('模板名称')} 
            /> 
            模板名称
          </label>
          <label className="flex items-center gap-1.5 text-[13px] text-gray-600 cursor-pointer">
            <input 
              type="radio" 
              name="searchType" 
              className="text-blue-600 focus:ring-blue-500"
              checked={searchType === '供应商'} 
              onChange={() => setSearchType('供应商')} 
            /> 
            供应商
          </label>
        </div>
        <div className="flex flex-1 max-w-[300px]">
          <Input 
            className="h-8 text-[13px] flex-1 rounded-r-none bg-white border-gray-300 focus-visible:ring-0" 
            placeholder="请输入搜索内容" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button 
            className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-5 text-[13px] font-normal rounded-l-none border border-l-0 border-[#6B8EBE] gap-1"
          >
            <Search className="w-3.5 h-3.5" /> 搜索
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="bg-white flex-1 flex flex-col rounded shadow-sm border border-gray-200 overflow-hidden">
          <ContractTable />
        </div>
      </div>
    </div>
  );
}
