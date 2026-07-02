export type SingleSkuStatus = '自动创建' | '等待开发' | '正常销售' | '商品清仓' | '停止销售'

export type SingleSkuActivity = '爆款' | '旺款' | '平款' | '滞销款'

export type WarehouseSupply = {
  cost?: number
  alertStock?: number
  alertDays?: number
  safetyStockDays?: number
  purchaseUpperLimit?: number
}

export type SingleSkuRow = {
  id: string
  patternCode: string
  imageUrl: string
  productName: string
  sku: string
  status: SingleSkuStatus
  activity: SingleSkuActivity
  inventoryTotal: number
  inventoryAvailable: number
  forecastDailySales: number
  sales72842: string
  purchaseInTransitQty: number
  warehouseUnshippedQty: number
  stockInTransitQty: number
  dropShipBasePrice: number
  mainCategory: string
  productCategory: string
  customCategory: string
  declareEnName: string
  declareCnName: string
  brand: string
  selector: string
  developer: string
  createdBy: string
  updatedAt: number
  createdAt: number
  updatedBy: string
  remark: string
  alertStock?: number
  alertDays?: number
  safetyStockDays?: number
  purchaseUpperLimit?: number
  purchaser?: string
  warehouseLocation?: string
  warehouseSupply?: {
    dongguan?: WarehouseSupply
    xian?: WarehouseSupply
  }
}

export type SingleSkuFilters = {
  patternCode: string
  productName: string
  sku: string
  mainCategory: string
  brand: string
  productCategory: string
  customCategory: string
  purchaser: string
  status: '全部' | SingleSkuStatus
  activity: '全部' | SingleSkuActivity
}
