export function safeNumber(v: unknown) {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

export function calcStockAlertQty(params: { stockAlertDays: number; forecastDailySales: number }) {
  const days = safeNumber(params.stockAlertDays)
  const sales = safeNumber(params.forecastDailySales)
  return Math.max(0, Math.floor(days * sales))
}

export function calcMinPurchaseQty(params: { purchaseDays: number; forecastDailySales: number; moq: number }) {
  const days = safeNumber(params.purchaseDays)
  const sales = safeNumber(params.forecastDailySales)
  const moq = safeNumber(params.moq)
  const candidate = Math.max(0, Math.floor(days * sales))
  return Math.max(candidate, Math.floor(moq))
}
