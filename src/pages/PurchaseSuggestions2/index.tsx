import { useState } from 'react'
import { cn } from '@/lib/utils'
import SuggestionsFilter from '@/pages/PurchaseSuggestions/components/SuggestionsFilter'
import SuggestionsTable from '@/pages/PurchaseSuggestions/components/SuggestionsTable'
import type { SuggestionsFilters } from '@/pages/PurchaseSuggestions/types'

export default function PurchaseSuggestions2() {
  const [activeTab, setActiveTab] = useState<'stock' | 'shortage'>('stock')
  const [filters, setFilters] = useState<SuggestionsFilters>({
    keyword: '',
    warehouses: [],
    supplierName: '',
    buyer: '',
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-6 mb-4 px-2">
        <h1 className="text-[18px] font-medium text-gray-800">采购建议2</h1>
        <div className="flex items-center gap-6 text-[14px]">
          <div
            className={cn(
              'cursor-pointer pb-1 transition-colors',
              activeTab === 'stock'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-800 border-b-2 border-transparent'
            )}
            onClick={() => setActiveTab('stock')}
          >
            备货建议
          </div>
          <div
            className={cn(
              'cursor-pointer pb-1 transition-colors',
              activeTab === 'shortage'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-800 border-b-2 border-transparent'
            )}
            onClick={() => setActiveTab('shortage')}
          >
            缺货建议
          </div>
        </div>
      </div>

      <SuggestionsFilter value={filters} onChange={setFilters} />
      <SuggestionsTable activeTab={activeTab} filters={filters} layout="flat" />
    </div>
  )
}

