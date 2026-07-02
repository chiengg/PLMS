export type ActiveTab = 'stock' | 'shortage'

export type SuggestionsFilters = {
  keyword: string
  warehouses: string[]
  supplierName: string
  buyer: string
}

export type IgnoreType = 'once' | 'permanent'

export type IgnoredSuggestion = {
  id: string
  sku: string
  name: string
  warehouse: string
  supplierName: string
  suggestedQuantity?: number
  buyer: string
  ignoreType: IgnoreType
  ignoredAt: number
}
