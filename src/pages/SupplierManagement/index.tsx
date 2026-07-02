import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import SupplierList from './components/SupplierList';
import EditSupplier from './components/EditSupplier';
import LinkProducts from './components/LinkProducts';
import PurchaseLinked from './components/PurchaseLinked';

export type SupplierView = 'list' | 'edit' | 'link' | 'purchase';

export default function SupplierManagement() {
  const [currentView, setCurrentView] = useState<SupplierView>('list');
  const [activeSupplier, setActiveSupplier] = useState<any>(null);

  const navigateTo = (view: SupplierView, supplier?: any) => {
    if (supplier) setActiveSupplier(supplier);
    setCurrentView(view);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F5F7FA]">
      {/* Breadcrumb */}
      <div className="flex items-center text-gray-500 text-[13px] flex-shrink-0 px-4 pt-4 mb-4">
        <span className="cursor-pointer hover:text-blue-600">首页</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span className="cursor-pointer hover:text-blue-600">供应商管理</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span className={currentView === 'list' ? 'text-gray-800 font-medium' : 'cursor-pointer hover:text-blue-600'} onClick={() => setCurrentView('list')}>
          供应商管理
        </span>
        {currentView === 'edit' && (
          <>
            <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
            <span className="text-gray-800 font-medium">编辑供应商</span>
          </>
        )}
        {currentView === 'link' && (
          <>
            <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
            <span className="text-gray-800 font-medium">供应商关联商品</span>
          </>
        )}
        {currentView === 'purchase' && (
          <>
            <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
            <span className="text-gray-800 font-medium">关联商品采购</span>
          </>
        )}
      </div>

      <div className="flex-1 overflow-hidden h-full flex flex-col">
        {currentView === 'list' && <SupplierList onNavigate={navigateTo} />}
        {currentView === 'edit' && <EditSupplier supplier={activeSupplier} onBack={() => setCurrentView('list')} />}
        {currentView === 'link' && <LinkProducts supplier={activeSupplier} onBack={() => setCurrentView('list')} />}
        {currentView === 'purchase' && <PurchaseLinked supplier={activeSupplier} onBack={() => setCurrentView('list')} />}
      </div>
    </div>
  );
}
