import type { SingleSkuActivity, SingleSkuRow, SingleSkuStatus } from './types'

export const SINGLE_SKU_KEY = 'single_sku_data_v1'

export const statusOptions: Array<'全部' | SingleSkuStatus> = [
  '全部',
  '自动创建',
  '等待开发',
  '正常销售',
  '商品清仓',
  '停止销售',
]

export const activityOptions: Array<'全部' | SingleSkuActivity> = ['全部', '爆款', '旺款', '平款', '滞销款']

export const mainCategoryOptions = ['全部', '非服装类', '服装类']
export const productCategoryOptions = ['全部', '家居与园艺', '珠宝与手表', '厨房用品']
export const customCategoryOptions = ['全部', 'Cookie', 'Earrings', 'Necklace']
export const brandOptions = ['全部', '默认品牌', '示例品牌A', '示例品牌B']

export const mockSingleSkus: SingleSkuRow[] = Array.from({ length: 30 }).map((_, i) => {
  const statuses: SingleSkuStatus[] = ['自动创建', '等待开发', '正常销售', '商品清仓', '停止销售']
  const activities: SingleSkuActivity[] = ['爆款', '旺款', '平款', '滞销款']
  const status = statuses[i % statuses.length]
  const activity = activities[i % activities.length]
  const now = 1767225600000
  const skuBase = `1000${(6000 + i).toString()}`
  return {
    id: `ssku_${i + 1}`,
    patternCode: skuBase,
    imageUrl: 'https://via.placeholder.com/40',
    productName: `示例产品-${i + 1}`,
    sku: `${skuBase}-0-${String.fromCharCode(65 + (i % 4))}0-NS`,
    status,
    activity,
    inventoryTotal: 100 + i,
    inventoryAvailable: 80 + i,
    forecastDailySales: Number(((i % 17) / 1000).toFixed(3)),
    sales72842: `${i % 8}/${i % 28}/${i % 42}`,
    purchaseInTransitQty: i % 7,
    warehouseUnshippedQty: i % 5,
    stockInTransitQty: i % 11,
    dropShipBasePrice: 10 + (i % 6),
    mainCategory: ['非服装类', '服装类'][i % 2],
    productCategory: ['家居与园艺', '珠宝与手表', '厨房用品'][i % 3],
    customCategory: ['Cookie', 'Earrings', 'Necklace'][i % 3],
    declareEnName: '--',
    declareCnName: '--',
    brand: ['默认品牌', '示例品牌A', '示例品牌B'][i % 3],
    selector: ['选品员A', '选品员B'][i % 2],
    developer: ['开发员A', '开发员B'][i % 2],
    createdBy: '系统',
    updatedAt: now - i * 3600_000,
    createdAt: now - i * 3600_000 * 24,
    updatedBy: '系统',
    remark: '',
    alertStock: 0,
    alertDays: 0,
    safetyStockDays: 0,
    purchaseUpperLimit: 100000,
    purchaser: ['采购员A', '采购员B', '采购员C'][i % 3],
    warehouseSupply: {
      dongguan: { cost: 0, alertStock: 0, alertDays: 0, safetyStockDays: 0, purchaseUpperLimit: 100000 },
      xian: { cost: 0, alertStock: 0, alertDays: 0, safetyStockDays: 0, purchaseUpperLimit: 100000 },
    },
  }
})
