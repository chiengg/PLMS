export type ProductStatus =
  | '自动创建'
  | '等待开发'
  | '正常销售'
  | '商品清仓'
  | '停止销售'

export type ProductShape = '实物商品' | '虚拟商品'

export type ProductWarehouseInfo = {
  warehouse: string
  inventoryQty: number
  inventoryCheckCycleDays: number
  inventoryChecker: string
  purchaseDays: number
  stockAlertDays: number
  forecastDailySales: number
  stockAlertQty: number
  minPurchaseQty: number
  purchaseUpperLimit: number
  manualOverrides: {
    stockAlertQty: boolean
    minPurchaseQty: boolean
  }
}

export type Product = {
  id: string
  sku: string
  mainSku: string
  cnName: string
  enName: string
  status: ProductStatus
  factorySku: string
  shape: ProductShape
  categoryId: string
  categoryName: string
  brandId: string
  brandName: string
  unit: string
  salesLink: string
  developer: string
  inventoryImageUrl: string
  virtualSku: string
  productNote: string
  salesNote: string
  purchaseNote: string
  extraAttrs: Record<string, string>
  warehouseInfo: ProductWarehouseInfo
  createdAt: number
}

export type Category = {
  id: string
  name: string
  description: string
  hsCode: string
  multiAttr: boolean
  parentId: string
}

export type Brand = {
  id: string
  name: string
}
