import type { Brand, Category, Product, ProductStatus } from './types'

export const PRODUCTS_KEY = 'products_data_v1'
export const CATEGORIES_KEY = 'product_categories_v1'
export const BRANDS_KEY = 'product_brands_v1'

export const statusOptions: ProductStatus[] = ['自动创建', '等待开发', '正常销售', '商品清仓', '停止销售']
export const shapeOptions = ['实物商品', '虚拟商品'] as const

export const unitOptions = ['个', '支', '套', '箱', '件']
export const userOptions = ['张伟', '李娜', '王强', '刘美希', '陈刚']

export const warehouseOptions = ['东莞周转仓', '义乌周转仓', '深圳周转仓']

export const defaultCategories: Category[] = [
  { id: 'c1', name: 'ERP主分类A', description: '', hsCode: '', multiAttr: false, parentId: '' },
  { id: 'c2', name: '商品类目A-1', description: '', hsCode: '', multiAttr: false, parentId: 'c1' },
]

export const defaultBrands: Brand[] = [{ id: 'b1', name: '默认品牌' }]

const defaultThumb = 'https://via.placeholder.com/40'

export function defaultProductsFromLegacyMock(): Product[] {
  const now = Date.now()
  return [
    {
      id: 'p1',
      sku: '10006231-0-A0-TSG',
      mainSku: '',
      cnName: 'TSG生产耗材烫钻-D款_银色',
      enName: '',
      status: '正常销售',
      factorySku: '',
      shape: '实物商品',
      categoryId: '',
      categoryName: '',
      brandId: '',
      brandName: '',
      unit: '个',
      salesLink: '',
      developer: '',
      inventoryImageUrl: defaultThumb,
      virtualSku: '',
      productNote: '',
      salesNote: '',
      purchaseNote: '',
      extraAttrs: {},
      warehouseInfo: {
        warehouse: '东莞周转仓',
        inventoryQty: 0,
        inventoryCheckCycleDays: 0,
        inventoryChecker: '',
        purchaseDays: 0,
        stockAlertDays: 0,
        forecastDailySales: 0,
        stockAlertQty: 0,
        minPurchaseQty: 0,
        purchaseUpperLimit: 0,
        manualOverrides: { stockAlertQty: false, minPurchaseQty: false },
      },
      createdAt: now,
    },
    {
      id: 'p2',
      sku: '10006230-G0-A0-GC',
      mainSku: '',
      cnName: '单件定制-XHP钛钢浮雕耳钉_金色_EDTGGC-3',
      enName: '',
      status: '正常销售',
      factorySku: '',
      shape: '实物商品',
      categoryId: '',
      categoryName: '',
      brandId: '',
      brandName: '',
      unit: '个',
      salesLink: '',
      developer: '',
      inventoryImageUrl: defaultThumb,
      virtualSku: '',
      productNote: '',
      salesNote: '',
      purchaseNote: '',
      extraAttrs: {},
      warehouseInfo: {
        warehouse: '东莞周转仓',
        inventoryQty: 0,
        inventoryCheckCycleDays: 0,
        inventoryChecker: '',
        purchaseDays: 0,
        stockAlertDays: 0,
        forecastDailySales: 0,
        stockAlertQty: 0,
        minPurchaseQty: 0,
        purchaseUpperLimit: 0,
        manualOverrides: { stockAlertQty: false, minPurchaseQty: false },
      },
      createdAt: now,
    },
    {
      id: 'p3',
      sku: '10005605-GG-B0-ET-PJ',
      mainSku: '',
      cnName: 'ET_PJ撞色手提枕头化妆包_绿白小号',
      enName: '',
      status: '正常销售',
      factorySku: '',
      shape: '实物商品',
      categoryId: '',
      categoryName: '',
      brandId: '',
      brandName: '',
      unit: '个',
      salesLink: '',
      developer: '',
      inventoryImageUrl: defaultThumb,
      virtualSku: '',
      productNote: '',
      salesNote: '',
      purchaseNote: '',
      extraAttrs: {},
      warehouseInfo: {
        warehouse: '东莞周转仓',
        inventoryQty: 0,
        inventoryCheckCycleDays: 0,
        inventoryChecker: '',
        purchaseDays: 0,
        stockAlertDays: 0,
        forecastDailySales: 0,
        stockAlertQty: 0,
        minPurchaseQty: 0,
        purchaseUpperLimit: 0,
        manualOverrides: { stockAlertQty: false, minPurchaseQty: false },
      },
      createdAt: now,
    },
  ]
}
