import type { ActiveTab, IgnoredSuggestion, SuggestionsFilters } from './types'
import type { SuggestionGroup, SuggestionItem } from './mockData'

export type FlatSuggestionRow = {
  supplierName: string
  item: SuggestionItem
}

export function isShortageItem(item: SuggestionItem) {
  return item.stock <= 0 || item.stock + item.transit < item.unshipped
}

export function normalizeText(v: string) {
  return v.trim().toLowerCase()
}

export function matchesKeyword(item: SuggestionItem, keyword: string) {
  const k = normalizeText(keyword)
  if (!k) return true
  return (
    normalizeText(item.sku).includes(k) ||
    normalizeText(item.name).includes(k) ||
    normalizeText(item.buyer).includes(k)
  )
}

export function buildIgnoreIndex(ignored: IgnoredSuggestion[]) {
  const byId = new Set<string>()
  const permanentSku = new Set<string>()
  ignored.forEach((r) => {
    byId.add(r.id)
    if (r.ignoreType === 'permanent') permanentSku.add(r.sku)
  })
  return { byId, permanentSku }
}

export function filterGroups(params: {
  groups: SuggestionGroup[]
  activeTab: ActiveTab
  filters: SuggestionsFilters
  ignored: IgnoredSuggestion[]
}) {
  const { groups, activeTab, filters, ignored } = params
  const { byId, permanentSku } = buildIgnoreIndex(ignored)

  const next = groups
    .map((g) => {
      const items = g.items.filter((item) => {
        if (activeTab === 'shortage' && !isShortageItem(item)) return false
        if (byId.has(item.id)) return false
        if (permanentSku.has(item.sku)) return false
        if (filters.supplierName && g.supplierName !== filters.supplierName) return false
        if (filters.buyer && item.buyer !== filters.buyer) return false
        if (filters.warehouses.length > 0 && !filters.warehouses.includes(item.warehouse)) return false
        if (!matchesKeyword(item, filters.keyword)) return false
        return true
      })

      return {
        ...g,
        items,
        totalProducts: items.length,
        totalSuggestedQuantity: items.reduce((sum, i) => sum + i.suggestedQuantity, 0),
        totalSuggestedPrice: items.reduce((sum, i) => sum + i.totalPrice, 0),
      }
    })
    .filter((g) => g.items.length > 0)

  return next
}

export function flattenSuggestionRows(groups: SuggestionGroup[]): FlatSuggestionRow[] {
  return groups.flatMap((g) => g.items.map((item) => ({ supplierName: g.supplierName, item })))
}

export function removeItemsFromGroups(groups: SuggestionGroup[], itemIds: string[]) {
  if (itemIds.length === 0) return groups
  const idSet = new Set(itemIds)
  return groups
    .map((g) => {
      const items = g.items.filter((i) => !idSet.has(i.id))
      return {
        ...g,
        items,
        totalProducts: items.length,
        totalSuggestedQuantity: items.reduce((sum, i) => sum + i.suggestedQuantity, 0),
        totalSuggestedPrice: items.reduce((sum, i) => sum + i.totalPrice, 0),
      }
    })
    .filter((g) => g.items.length > 0)
}

export function hydrateIgnoredSuggestions(params: { ignored: IgnoredSuggestion[]; groups: SuggestionGroup[] }) {
  const { ignored, groups } = params
  if (ignored.length === 0) return ignored

  const byId = new Map<string, SuggestionItem>()
  const bySku = new Map<string, SuggestionItem>()
  groups.forEach((g) => {
    g.items.forEach((i) => {
      byId.set(i.id, i)
      if (!bySku.has(i.sku)) bySku.set(i.sku, i)
    })
  })

  return ignored.map((r) => {
    if (typeof r.suggestedQuantity === 'number') return r
    const item = byId.get(r.id) ?? bySku.get(r.sku)
    if (!item) return r
    return { ...r, suggestedQuantity: item.suggestedQuantity }
  })
}
