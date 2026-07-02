import { describe, expect, it } from 'vitest'
import { buildSalesSeries } from '../salesMock'

describe('salesMock', () => {
  it('is deterministic for same query', () => {
    const q = {
      sku: 'TEST-SKU-1',
      startDate: '2026-05-01',
      endDate: '2026-05-07',
      warehouse: '',
      platform: '',
    }
    const a = buildSalesSeries(q)
    const b = buildSalesSeries(q)
    expect(a.points).toEqual(b.points)
  })

  it('returns points for each date in range', () => {
    const q = {
      sku: 'TEST-SKU-2',
      startDate: '2026-05-01',
      endDate: '2026-05-07',
      warehouse: '',
      platform: '',
    }
    const res = buildSalesSeries(q)
    expect(res.points.length).toBe(7)
    expect(res.points[0].date).toBe('2026-05-01')
    expect(res.points[6].date).toBe('2026-05-07')
  })

  it('sales is non-negative integer', () => {
    const q = {
      sku: 'TEST-SKU-3',
      startDate: '2026-05-01',
      endDate: '2026-05-07',
      warehouse: 'FBA-US-东部',
      platform: 'Amazon',
    }
    const res = buildSalesSeries(q)
    expect(res.points.every((p) => Number.isInteger(p.sales) && p.sales >= 0)).toBe(true)
  })
})
