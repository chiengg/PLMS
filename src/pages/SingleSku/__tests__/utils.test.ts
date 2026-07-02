import { describe, expect, it } from 'vitest'
import { mockSingleSkus } from '../mockData'
import { applyStatusPatch, applyWarehouseLocationPatch, buildMonthlySalesTotals, buildSalesSeries, filterRows } from '../utils'

describe('filterRows', () => {
  it('filters by status', () => {
    const res = filterRows(mockSingleSkus, {
      patternCode: '',
      productName: '',
      sku: '',
      mainCategory: '全部',
      brand: '全部',
      productCategory: '全部',
      customCategory: '全部',
      purchaser: '全部',
      status: '正常销售',
      activity: '全部',
    })
    expect(res.every((r) => r.status === '正常销售')).toBe(true)
  })

  it('filters by activity', () => {
    const res = filterRows(mockSingleSkus, {
      patternCode: '',
      productName: '',
      sku: '',
      mainCategory: '全部',
      brand: '全部',
      productCategory: '全部',
      customCategory: '全部',
      purchaser: '全部',
      status: '全部',
      activity: '爆款',
    })
    expect(res.every((r) => r.activity === '爆款')).toBe(true)
  })

  it('filters by keyword in sku/name/patternCode', () => {
    const one = mockSingleSkus[0]
    const res = filterRows(mockSingleSkus, {
      patternCode: one.patternCode.slice(0, 4),
      productName: '',
      sku: '',
      mainCategory: '全部',
      brand: '全部',
      productCategory: '全部',
      customCategory: '全部',
      purchaser: '全部',
      status: '全部',
      activity: '全部',
    })
    expect(res.some((r) => r.id === one.id)).toBe(true)
  })

  it('filters by purchaser', () => {
    const res = filterRows(mockSingleSkus, {
      patternCode: '',
      productName: '',
      sku: '',
      mainCategory: '全部',
      brand: '全部',
      productCategory: '全部',
      customCategory: '全部',
      purchaser: '采购员A',
      status: '全部',
      activity: '全部',
    })
    expect(res.every((r) => r.purchaser === '采购员A')).toBe(true)
  })

  it('builds deterministic sales series by sku', () => {
    const a1 = buildSalesSeries({ sku: 'SKU-A', days: 30 })
    const a2 = buildSalesSeries({ sku: 'SKU-A', days: 30 })
    const b = buildSalesSeries({ sku: 'SKU-B', days: 30 })
    expect(a1.length).toBe(30)
    expect(a2.length).toBe(30)
    expect(b.length).toBe(30)
    expect(a1).toEqual(a2)
    expect(a1).not.toEqual(b)
  })

  it('applies status patch to selected rows', () => {
    const rows = [
      { id: 'a', status: '正常销售' } as any,
      { id: 'b', status: '商品清仓' } as any,
      { id: 'c', status: '正常销售' } as any,
    ]
    const next = applyStatusPatch(rows, ['a', 'c'], '停止销售')
    expect(next.find((r: any) => r.id === 'a').status).toBe('停止销售')
    expect(next.find((r: any) => r.id === 'b').status).toBe('商品清仓')
    expect(next.find((r: any) => r.id === 'c').status).toBe('停止销售')
  })

  it('applies warehouseLocation patch to selected rows', () => {
    const rows = [
      { id: 'a', warehouseLocation: '东莞厚街仓-A01' } as any,
      { id: 'b', warehouseLocation: '西安仓-B02' } as any,
      { id: 'c' } as any,
    ]
    const next = applyWarehouseLocationPatch(rows, ['b', 'c'], '义乌仓-C03')
    expect(next.find((r: any) => r.id === 'a').warehouseLocation).toBe('东莞厚街仓-A01')
    expect(next.find((r: any) => r.id === 'b').warehouseLocation).toBe('义乌仓-C03')
    expect(next.find((r: any) => r.id === 'c').warehouseLocation).toBe('义乌仓-C03')
  })

  it('builds monthly sales totals with cutoff', () => {
    const year = 2026
    const start = new Date(year, 0, 1)
    const cutoff = new Date(year, 2, 15)
    const totals = buildMonthlySalesTotals({
      skuSeed: 'SKU-X',
      year,
      baseline: 50,
      cutoffTs: cutoff.getTime(),
    })
    expect(totals.length).toBe(12)
    expect(totals[0]).toBeGreaterThan(0)
    expect(totals[1]).toBeGreaterThan(0)
    expect(totals[2]).toBeGreaterThan(0)
    for (let i = 3; i < 12; i++) expect(totals[i]).toBe(0)
    expect(start.getFullYear()).toBe(year)
  })
})
