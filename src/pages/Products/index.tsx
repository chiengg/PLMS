import React, { useState } from 'react';
import ProductFilter from './components/ProductFilter';
import ProductTable from './components/ProductTable';

export default function Products() {
  const [filterValues, setFilterValues] = useState<any>({});

  return (
    <div className="flex flex-col h-full bg-[#F1F4F9] overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0">
        <ProductFilter onFilterChange={setFilterValues} />
        <div className="flex-1 flex flex-col min-h-0 mt-3 bg-white mx-3 mb-3 border border-gray-200 shadow-sm rounded-sm">
          <ProductTable filterValues={filterValues} />
        </div>
      </div>
    </div>
  );
}