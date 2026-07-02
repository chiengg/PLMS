import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import SupplierFilter from './SupplierFilter';
import SupplierTable from './SupplierTable';
import InventorySkuView from './InventorySkuView';
import type { SupplierView } from '../index';

interface SupplierListProps {
  onNavigate: (view: SupplierView, supplier: any) => void;
}

export default function SupplierList({ onNavigate }: SupplierListProps) {
  const [activeTab, setActiveTab] = useState('按供应商查看');
  const [filterValues, setFilterValues] = useState<any>({});

  return (
    <div className="flex flex-col h-full overflow-hidden px-4 pb-4">
      {/* Tabs */}
      <div className="flex bg-white rounded-t border-b border-gray-200">
        <div 
          className={`px-6 py-2 text-[13px] cursor-pointer rounded-tl-lg font-medium relative ${activeTab === '按供应商查看' ? 'text-blue-600 bg-[#EBF5FF]' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('按供应商查看')}
        >
          按供应商查看
          {activeTab === '按供应商查看' && <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 rounded-tl-lg"></div>}
        </div>
        <div 
          className={`px-6 py-2 text-[13px] cursor-pointer font-medium relative ${activeTab === '按库存SKU查看' ? 'text-blue-600 bg-[#EBF5FF]' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('按库存SKU查看')}
        >
          按库存SKU查看
          {activeTab === '按库存SKU查看' && <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500"></div>}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white border border-t-0 border-gray-200 rounded-b">
        {activeTab === '按供应商查看' && (
          <>
            <SupplierFilter onFilterChange={setFilterValues} />
            <SupplierTable filterValues={filterValues} onNavigate={onNavigate} />
          </>
        )}
        {activeTab === '按库存SKU查看' && (
          <InventorySkuView />
        )}
      </div>
    </div>
  );
}
