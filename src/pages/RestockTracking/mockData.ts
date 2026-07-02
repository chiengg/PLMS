import type { RestockRow } from './types'
import { defaultRules } from './rules'

export const RESTOCK_DATA_KEY = 'restock_tracking_data_v1'
export const RESTOCK_RULES_KEY = 'restock_tracking_rules_v1'

export const defaultShops = ['亚马逊-US-01', '亚马逊-UK-02', '独立站-01', '亚马逊-JP-01']

const baseTs = 1767225600000

export const mockRestockRows: RestockRow[] = [
  {
    id: 'rt-1',
    shop: '亚马逊-US-01',
    sku: 'SKU00123',
    name: '蓝牙耳机-黑色（Pro Max）',
    designCode: 'D-10006',
    remark: '热销款，需重点关注',
    binStock: 120,
    allocatedUnshipped: 70,
    transitQty: 300,
    unshippedQty: 70,
    transferUnshippedQty: 0,
    forecastDailySales: 60,
    leadTimeDays: 15,
    restockAt: baseTs - 20 * 86400000,
    costPrice: 45,
    lastInboundAt: baseTs - 35 * 86400000,
    lastOutboundAt: baseTs - 3 * 86400000,
  },
  {
    id: 'rt-2',
    shop: '亚马逊-UK-02',
    sku: 'SKU00998',
    name: '便携式投影仪-白色',
    designCode: 'D-10012',
    remark: '新款测试',
    binStock: 800,
    allocatedUnshipped: 50,
    transitQty: 0,
    unshippedQty: 50,
    transferUnshippedQty: 0,
    forecastDailySales: 5,
    leadTimeDays: 30,
    restockAt: baseTs - 10 * 86400000,
    costPrice: 120,
    lastInboundAt: baseTs - 60 * 86400000,
    lastOutboundAt: baseTs - 20 * 86400000,
  },
  {
    id: 'rt-3',
    shop: '独立站-01',
    sku: 'SKU00456',
    name: '机械键盘-青轴',
    designCode: 'D-10025',
    remark: '清库存中',
    binStock: 400,
    allocatedUnshipped: 20,
    transitQty: 0,
    unshippedQty: 20,
    transferUnshippedQty: 0,
    forecastDailySales: 0.5,
    leadTimeDays: 20,
    restockAt: baseTs - 5 * 86400000,
    costPrice: 80,
    lastInboundAt: baseTs - 100 * 86400000,
    lastOutboundAt: baseTs - 90 * 86400000,
  },
  {
    id: 'rt-4',
    shop: '亚马逊-US-01',
    sku: 'SKU00222',
    name: '无线鼠标-静音版',
    designCode: 'D-10018',
    remark: '物流异常跟进中',
    binStock: 50,
    allocatedUnshipped: 30,
    transitQty: 500,
    unshippedQty: 30,
    transferUnshippedQty: 0,
    forecastDailySales: 10,
    leadTimeDays: 25,
    restockAt: baseTs - 40 * 86400000,
    costPrice: 20,
    lastInboundAt: baseTs - 80 * 86400000,
    lastOutboundAt: baseTs - 2 * 86400000,
  },
]

export const mockRules = defaultRules

