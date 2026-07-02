export type PlanItem = {
  id: string
  buyer: string
  supplierName: string
  sku: string
  name: string
  warehouse: string
  quantity: number
  purchasePrice: number
  inbound: string
  loss: number
  notes: string
  logistics: string
  status: string
  source: string
  creator: string
  createTime: string
}

export type PlanGroup = {
  planNumber: string
  buyerName: string
  totalProducts: number
  totalQuantity: number
  totalPrice: number
  items: PlanItem[]
}

