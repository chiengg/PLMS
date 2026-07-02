export type WarningStatus = '正常' | '触发预警'

export type WarningType = '断货风险' | '备货不足' | '滞销风险' | '库存积压' | '到货延迟'

export type RestockRow = {
  id: string
  shop: string
  sku: string
  name: string
  designCode: string
  remark: string

  binStock: number
  allocatedUnshipped: number
  transitQty: number
  unshippedQty: number
  transferUnshippedQty: number

  forecastDailySales: number
  leadTimeDays: number
  restockAt: number

  costPrice: number
  lastInboundAt: number
  lastOutboundAt: number
}

export type Derived = {
  availableStock: number
  sellableDays: number
  inTransitValue: number
  totalValue: number
}

export type RulesConfig = {
  outOfStockDaysThreshold: number
  understockSafetyDays: number
  slowSalesDailyThreshold: number
  overstockDaysThreshold: number
  arrivalDelayGraceDays: number
}

export type Warnings = {
  status: WarningStatus
  types: WarningType[]
}
