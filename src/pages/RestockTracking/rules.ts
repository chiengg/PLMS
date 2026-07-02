import type { Derived, RestockRow, RulesConfig, WarningType, Warnings } from './types'

export const defaultRules: RulesConfig = {
  outOfStockDaysThreshold: 1,
  understockSafetyDays: 15,
  slowSalesDailyThreshold: 1,
  overstockDaysThreshold: 90,
  arrivalDelayGraceDays: 0,
}

export function computeDerived(row: RestockRow): Derived {
  const binStock = Number(row.binStock) || 0
  const allocatedUnshipped = Number(row.allocatedUnshipped) || 0
  const transitQty = Number(row.transitQty) || 0
  const costPrice = Number(row.costPrice) || 0
  const forecastDailySales = Number(row.forecastDailySales) || 0

  const availableStock = binStock - allocatedUnshipped
  const sellableDays = forecastDailySales > 0 ? availableStock / forecastDailySales : Number.POSITIVE_INFINITY

  return {
    availableStock,
    sellableDays,
    inTransitValue: transitQty * costPrice,
    totalValue: (binStock + transitQty) * costPrice,
  }
}

export function computeWarnings(params: { row: RestockRow; rules: RulesConfig; now: number }): Warnings {
  const { row, rules, now } = params
  const d = computeDerived(row)

  const types: WarningType[] = []

  if (d.availableStock < (Number(row.forecastDailySales) || 0) * (Number(rules.outOfStockDaysThreshold) || 0)) {
    types.push('断货风险')
  }

  if (
    Number.isFinite(d.sellableDays) &&
    d.sellableDays < (Number(row.leadTimeDays) || 0) + (Number(rules.understockSafetyDays) || 0)
  ) {
    types.push('备货不足')
  }

  if ((Number(row.forecastDailySales) || 0) < (Number(rules.slowSalesDailyThreshold) || 0)) {
    types.push('滞销风险')
  }

  if (Number.isFinite(d.sellableDays) && d.sellableDays > (Number(rules.overstockDaysThreshold) || 0)) {
    types.push('库存积压')
  }

  const restockAt = Number(row.restockAt) || 0
  const restockDays = (now - restockAt) / 86400000
  if (
    restockDays >
      (Number(row.leadTimeDays) || 0) +
        (Number(rules.arrivalDelayGraceDays) || 0) &&
    (Number(row.transitQty) || 0) > 0
  ) {
    types.push('到货延迟')
  }

  return { status: types.length > 0 ? '触发预警' : '正常', types }
}
