import React, { useState } from 'react';
import { KpiList } from './components/KpiList';
import { KpiDetail } from './components/KpiDetail';

export default function SupplierKPI() {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const handleViewDetail = (supplier: any) => {
    setSelectedSupplier(supplier);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedSupplier(null);
    setCurrentView('list');
  };

  return (
    <div className="h-full flex flex-col bg-[#F1F4F9] overflow-hidden">
      {currentView === 'list' ? (
        <KpiList onViewDetail={handleViewDetail} />
      ) : (
        <KpiDetail supplier={selectedSupplier} onBack={handleBackToList} />
      )}
    </div>
  );
}