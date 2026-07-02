import { describe, expect, it } from 'vitest'
import { calcMinPurchaseQty, calcStockAlertQty } from '../addProduct/calculations'

describe('calculations', () => {
  it('calcStockAlertQty', () => {
    expect(calcStockAlertQty({ stockAlertDays: 5, forecastDailySales: 2 })).toBe(10)
  })

  it('calcMinPurchaseQty uses max(candidate, moq)', () => {
    expect(calcMinPurchaseQty({ purchaseDays: 10, forecastDailySales: 2, moq: 30 })).toBe(30)
    expect(calcMinPurchaseQty({ purchaseDays: 10, forecastDailySales: 2, moq: 0 })).toBe(20)
  })
})
