import { afterEach, describe, expect, it, vi } from 'vitest'
import type { PlanGroup } from '../types'
import { mergeIntoBuyerGroups, updatePlanItemSupplier } from '../utils'

describe('PurchasePlans utils', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('merges incoming items into buyer groups and recalculates totals', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-08T01:02:03Z'))
    vi.spyOn(Math, 'random').mockReturnValue(0.123)

    const prev: PlanGroup[] = [
      {
        planNumber: 'JH20260408000101000',
        buyerName: '张伟',
        totalProducts: 1,
        totalQuantity: 2,
        totalPrice: 20,
        items: [
          {
            id: 'plan-old-1',
            buyer: '张伟',
            supplierName: '供应商A',
            sku: 'SKU-1',
            name: '商品1',
            warehouse: 'WH',
            quantity: 2,
            purchasePrice: 10,
            inbound: '--',
            loss: 0,
            notes: '--',
            logistics: '--',
            status: '未采购',
            source: '备货建议',
            creator: '系统',
            createTime: '2026/4/8 09:23:04',
          },
        ],
      },
    ]

    const incoming = [
      {
        id: 's-1',
        buyer: '李娜',
        supplierName: '供应商B',
        sku: 'SKU-2',
        name: '商品2',
        warehouse: 'WH2',
        suggestedQuantity: 3,
        purchasePrice: 5,
        notes: 'note',
        source: '备货建议',
      },
      {
        id: 's-2',
        buyer: '张伟',
        supplierName: '供应商C',
        sku: 'SKU-3',
        name: '商品3',
        warehouse: 'WH3',
        quantity: 1,
        purchasePrice: 7,
      },
    ]

    const next = mergeIntoBuyerGroups({ prev, incoming })

    expect(next.map((g) => g.buyerName)).toEqual(['李娜', '张伟'])

    const zhang = next.find((g) => g.buyerName === '张伟')!
    expect(zhang.items.length).toBe(2)
    expect(zhang.totalProducts).toBe(2)
    expect(zhang.totalQuantity).toBe(3)
    expect(zhang.totalPrice).toBe(27)
    expect(zhang.items.some((i) => i.supplierName === '供应商C')).toBe(true)

    const li = next.find((g) => g.buyerName === '李娜')!
    expect(li.items.length).toBe(1)
    expect(li.totalQuantity).toBe(3)
    expect(li.totalPrice).toBe(15)
    expect(li.items[0].id).toBe('plan-s-1')
    expect(li.items[0].supplierName).toBe('供应商B')
  })

  it('does not insert duplicates when same incoming id repeats', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-08T01:02:03Z'))
    vi.spyOn(Math, 'random').mockReturnValue(0.123)

    const prev: PlanGroup[] = []
    const incoming = [
      {
        id: 's-1',
        buyer: '张伟',
        supplierName: '供应商A',
        sku: 'SKU-1',
        name: '商品1',
        warehouse: 'WH',
        quantity: 1,
        purchasePrice: 10,
      },
    ]

    const first = mergeIntoBuyerGroups({ prev, incoming })
    const second = mergeIntoBuyerGroups({ prev: first, incoming })

    expect(second.length).toBe(1)
    expect(second[0].items.length).toBe(1)
    expect(second[0].items[0].id).toBe('plan-s-1')
  })

  it('normalizes legacy supplier groups into buyer groups with distinct plan numbers', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-08T01:02:03Z'))
    vi.spyOn(Math, 'random').mockReturnValue(0.123)

    const prev: any = [
      {
        planNumber: 'JH20260408000101000',
        supplierName: '供应商A',
        items: [
          {
            id: 'plan-legacy-1',
            buyer: '张伟',
            sku: 'SKU-1',
            name: '商品1',
            warehouse: 'WH',
            quantity: 1,
            purchasePrice: 10,
          },
          {
            id: 'plan-legacy-2',
            buyer: '李娜',
            sku: 'SKU-2',
            name: '商品2',
            warehouse: 'WH',
            quantity: 2,
            purchasePrice: 5,
          },
        ],
      },
    ]

    const next = mergeIntoBuyerGroups({ prev, incoming: [] as any })

    expect(next.map((g) => g.buyerName)).toEqual(['李娜', '张伟'])
    expect(next[0].planNumber).toBeTruthy()
    expect(next[1].planNumber).toBeTruthy()
    expect(next[0].planNumber).not.toBe(next[1].planNumber)
  })

  it('updates supplierName for the target plan item', () => {
    const plans: PlanGroup[] = [
      {
        planNumber: 'JH1',
        buyerName: '张伟',
        totalProducts: 1,
        totalQuantity: 1,
        totalPrice: 10,
        items: [
          {
            id: 'plan-1',
            buyer: '张伟',
            supplierName: '供应商A',
            sku: 'SKU-1',
            name: '商品1',
            warehouse: 'WH',
            quantity: 1,
            purchasePrice: 10,
            inbound: '--',
            loss: 0,
            notes: '--',
            logistics: '--',
            status: '未采购',
            source: '备货建议',
            creator: '系统',
            createTime: '2026/4/8 09:23:04',
          },
        ],
      },
      {
        planNumber: 'JH2',
        buyerName: '李娜',
        totalProducts: 1,
        totalQuantity: 2,
        totalPrice: 10,
        items: [
          {
            id: 'plan-2',
            buyer: '李娜',
            supplierName: '供应商B',
            sku: 'SKU-2',
            name: '商品2',
            warehouse: 'WH',
            quantity: 2,
            purchasePrice: 5,
            inbound: '--',
            loss: 0,
            notes: '--',
            logistics: '--',
            status: '未采购',
            source: '备货建议',
            creator: '系统',
            createTime: '2026/4/8 09:23:04',
          },
        ],
      },
    ]

    const next = updatePlanItemSupplier({
      plans,
      itemId: 'plan-1',
      supplierName: '新供应商',
    })

    expect(next[0].items[0].supplierName).toBe('新供应商')
    expect(next[1].items[0].supplierName).toBe('供应商B')
  })
})
