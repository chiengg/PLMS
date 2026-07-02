import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ReviewFilter from './components/ReviewFilter';
import ManagementTable from '../PurchaseManagement/components/ManagementTable';

export default function PurchaseReview() {
  const [filterValues, setFilterValues] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'待审核' | '我已审核'>('待审核');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center text-gray-500 text-[13px] mb-4 flex-shrink-0">
        <span>首页</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span>采购流程</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span className="text-gray-800 font-medium">采购审核</span>
      </div>

      {/* Content Area with Vertical Scroll */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pr-1 pb-2">
        <ReviewFilter onFilterChange={setFilterValues} />
        
        {/* Table Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-4 px-2 flex-shrink-0">
          {['待审核', '我已审核'].map((tab) => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab as '待审核' | '我已审核')}
              className={`pb-3 text-[14px] cursor-pointer relative ${activeTab === tab ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600"></div>}
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col min-h-[500px]">
          <ManagementTable activeTab={activeTab} filterValues={filterValues} />
        </div>
      </div>
    </div>
  );
}
