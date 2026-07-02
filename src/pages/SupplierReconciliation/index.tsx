import React from 'react';
import ReconciliationList from './components/ReconciliationList';

export default function SupplierReconciliation() {
  return (
    <div className="flex flex-col h-full bg-[#F1F4F9]">
      <div className="flex-1 overflow-hidden p-4">
        <ReconciliationList />
      </div>
    </div>
  );
}