import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AccountTable } from './components/AccountTable';

export default function AccountAuthorization() {
  const [activeTab, setActiveTab] = useState('1688');

  return (
    <div className="flex flex-col h-full bg-[#F1F4F9]">
      <div className="bg-white p-4 pb-0 border-b border-gray-200">
        <div className="flex items-center w-full">
          {['1688', '淘供销', '拼多多', '京东'].map(tab => (
            <div 
              key={tab}
              className={`px-6 py-2.5 text-[14px] font-medium cursor-pointer border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="bg-white flex-1 flex flex-col rounded shadow-sm border border-gray-200 overflow-hidden">
          {/* Action Bar */}
          <div className="p-3 border-b border-gray-200 flex justify-start bg-white">
            <Button 
              className="h-8 bg-[#8CC63F] hover:bg-[#7AB62F] text-white px-4 text-[13px] font-normal gap-1"
              onClick={() => {
                window.open('https://login.1688.com', '_blank');
              }}
            >
              <Plus className="w-3.5 h-3.5" /> 添加授权
            </Button>
          </div>
          
          {/* Table Area */}
          <div className="flex-1 overflow-hidden">
            <AccountTable platform={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}
