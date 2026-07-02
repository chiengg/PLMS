import React, { useState } from 'react';
import { ChevronRight, Settings } from 'lucide-react';
import ManagementFilter from './components/ManagementFilter';
import ManagementTable from './components/ManagementTable';
import PurchaseSettingsModal from './components/PurchaseSettingsModal';
import { FeatureMarker } from '@/components/FeatureMarker';

export default function PurchaseManagement() {
  const [activeTab, setActiveTab] = useState('新订单');
  const [filterValues, setFilterValues] = useState<any>({});
  const tabs = ['全部', '新订单', '待合并', '采购中', '已完成', '已作废', '异常', '1688对账'];

  const [hideFilter, setHideFilter] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center text-gray-500 text-[13px] mb-4 flex-shrink-0">
        <span>首页</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span>采购流程</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span className="text-gray-800 font-medium">采购管理</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 mb-4 px-2 flex-shrink-0">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <div 
              key={tab} 
              onClick={() => {
                setActiveTab(tab);
                setFilterValues({}); // Reset filters on tab change
                setHideFilter(false); // Reset hide filter on tab change
              }}
              className={`pb-3 text-[14px] cursor-pointer relative ${activeTab === tab ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600"></div>}
            </div>
          ))}
        </div>

        <FeatureMarker
          title="采购设置"
          description="交互说明：点击打开采购设置大弹窗，包含基础、第三方、审批、合同等设置。第四个选项卡点击后会跳转至合同管理页面。\n数据逻辑：提供所有采购业务场景下所需的全局变量与规则配置。"
        >
          <div 
            className="flex items-center gap-1.5 text-[13px] text-gray-600 hover:text-blue-600 cursor-pointer pb-3"
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings className="w-4 h-4" /> 采购设置
          </div>
        </FeatureMarker>
      </div>

      {/* Content Area with Vertical Scroll */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pr-1 pb-2">
        {!hideFilter && <ManagementFilter activeTab={activeTab} onFilterChange={setFilterValues} />}
        
        {/* Table Container ensuring min-height so it doesn't get squashed */}
        <div className="flex-1 flex flex-col min-h-[500px]">
          <ManagementTable activeTab={activeTab} filterValues={filterValues} setHideFilter={setHideFilter} />
        </div>
      </div>

      {showSettingsModal && <PurchaseSettingsModal onClose={() => setShowSettingsModal(false)} />}
    </div>
  );
}