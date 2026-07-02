import React from 'react';
import PerformanceList from './components/PerformanceList';

export default function PurchaserPerformance() {
  return (
    <div className="flex flex-col h-full bg-[#F1F4F9]">
      <div className="flex-1 overflow-hidden p-4">
        <PerformanceList />
      </div>
    </div>
  );
}