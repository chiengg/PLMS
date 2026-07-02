import { describe, expect, it } from 'vitest'
import { mockSuggestions } from '../mockData'
import { filterGroups, flattenSuggestionRows, hydrateIgnoredSuggestions, removeItemsFromGroups } from '../utils'

describe('PurchaseSuggestions utils', () => {
  it('filters by tab shortage', () => {
    const res = filterGroups({
      groups: mockSuggestions,
      activeTab: 'shortage',
      filters: { keyword: '', warehouses: [], supplierName: '', buyer: '' },
      ignored: [],
    })
    const all = res.flatMap((g) => g.items)
    expect(all.length).toBeGreaterThan(0)
    expect(all.every((i) => i.stock <= 0 || i.stock + i.transit < i.unshipped)).toBe(true)
  })

  it('filters by buyer', () => {
    const res = filterGroups({
      groups: mockSuggestions,
      activeTab: 'stock',
      filters: { keyword: '', warehouses: [], supplierName: '', buyer: '张伟' },
      ignored: [],
    })
    expect(res.flatMap((g) => g.items).every((i) => i.buyer === '张伟')).toBe(true)
  })

  it('filters by ignored once id', () => {
    const first = mockSuggestions[0].items[0]
    const res = filterGroups({
      groups: mockSuggestions,
      activeTab: 'stock',
      filters: { keyword: '', warehouses: [], supplierName: '', buyer: '' },
      ignored: [
        {
          id: first.id,
          sku: first.sku,
          name: first.name,
          warehouse: first.warehouse,
          supplierName: mockSuggestions[0].supplierName,
          buyer: first.buyer,
          ignoreType: 'once',
          ignoredAt: Date.now(),
        },
      ],
    })
    expect(res.flatMap((g) => g.items).some((i) => i.id === first.id)).toBe(false)
  })

  it('filters by ignored permanent sku', () => {
    const first = mockSuggestions[0].items[0]
    const res = filterGroups({
      groups: mockSuggestions,
      activeTab: 'stock',
      filters: { keyword: '', warehouses: [], supplierName: '', buyer: '' },
      ignored: [
        {
          id: 'ignored-record',
          sku: first.sku,
          name: first.name,
          warehouse: first.warehouse,
          supplierName: mockSuggestions[0].supplierName,
          buyer: first.buyer,
          ignoreType: 'permanent',
          ignoredAt: Date.now(),
        },
      ],
    })
    expect(res.flatMap((g) => g.items).some((i) => i.sku === first.sku)).toBe(false)
  })

  it('removes items and recalculates group totals', () => {
    const group = mockSuggestions[0]
    const removedId = group.items[0].id
    const next = removeItemsFromGroups([group], [removedId])
    expect(next.length).toBe(1)
    const nextGroup = next[0]
    expect(nextGroup.items.some((i) => i.id === removedId)).toBe(false)
    expect(nextGroup.totalProducts).toBe(nextGroup.items.length)
    expect(nextGroup.totalSuggestedQuantity).toBe(
      nextGroup.items.reduce((sum, i) => sum + i.suggestedQuantity, 0)
    )
    expect(nextGroup.totalSuggestedPrice).toBe(nextGroup.items.reduce((sum, i) => sum + i.totalPrice, 0))
  })

  it('hydrates ignored suggestedQuantity from source groups', () => {
    const first = mockSuggestions[0].items[0]
    const ignored = [
      {
        id: first.id,
        sku: first.sku,
        name: first.name,
        warehouse: first.warehouse,
        supplierName: mockSuggestions[0].supplierName,
        buyer: first.buyer,
        ignoreType: 'once' as const,
        ignoredAt: Date.now(),
      },
    ]

    const next = hydrateIgnoredSuggestions({ ignored, groups: mockSuggestions })
    expect(next[0].suggestedQuantity).toBe(first.suggestedQuantity)
  })

  it('flattens groups into rows with supplierName', () => {
    const groups = mockSuggestions.slice(0, 2)
    const total = groups.reduce((sum, g) => sum + g.items.length, 0)
    const flat = flattenSuggestionRows(groups)
    expect(flat.length).toBe(total)
    expect(flat[0].supplierName).toBe(groups[0].supplierName)
    expect(flat.some((r) => r.item.id === groups[1].items[0].id && r.supplierName === groups[1].supplierName)).toBe(true)
  })
})
