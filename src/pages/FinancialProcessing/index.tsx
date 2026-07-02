import React, { useState } from 'react';
import PaymentApply from './components/PaymentApply';
import PaymentApproval from './components/PaymentApproval';
import PaymentExecution from './components/PaymentExecution';

export default function FinancialProcessing() {
  const [activeTab, setActiveTab] = useState<'申请付款' | '财务审批' | '财务付款'>('申请付款');

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Tabs */}
      <div className="flex border-b border-blue-600 bg-gray-50 flex-shrink-0">
        {(['申请付款', '财务审批', '财务付款'] as const).map(tab => (
          <div
            key={tab}
            className={`px-8 py-2.5 text-[14px] cursor-pointer relative transition-colors ${
              activeTab === tab 
                ? 'text-white bg-[#6B8EBE] font-medium' 
                : 'text-gray-600 hover:text-[#6B8EBE] bg-[#E8EDF4]'
            }`}
            style={{
              clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)',
              marginRight: '-20px',
              zIndex: activeTab === tab ? 10 : 1,
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 relative z-0">
        {activeTab === '申请付款' && <PaymentApply />}
        {activeTab === '财务审批' && <PaymentApproval />}
        {activeTab === '财务付款' && <PaymentExecution />}
      </div>
    </div>
  );
}
