import React, { useState } from 'react';
import ScanReceive from './components/ScanReceive';
import ListReceive from './components/ListReceive';

export default function Receiving() {
  const [activeTab, setActiveTab] = useState('扫描签收');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header Tabs */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex px-4 pt-3 gap-6">
          <div 
            className={`pb-3 text-[14px] cursor-pointer relative ${activeTab === '扫描签收' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('扫描签收')}
          >
            扫描签收
            {activeTab === '扫描签收' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-sm" />
            )}
          </div>
          <div 
            className={`pb-3 text-[14px] cursor-pointer relative ${activeTab === '列表签收' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('列表签收')}
          >
            列表签收
            {activeTab === '列表签收' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-sm" />
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === '扫描签收' && <ScanReceive />}
        {activeTab === '列表签收' && <ListReceive />}
      </div>
    </div>
  );
}
