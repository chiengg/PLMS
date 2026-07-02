export type SuggestionItem = {
  id: string;
  buyer: string;
  sku: string;
  name: string;
  status: string;
  statusType?: 'blue' | 'orange' | 'green';
  warehouse: string;
  brand: string;
  brandType?: 'orange' | 'pink' | 'purple' | 'blue';
  dailySales1: number;
  dailySales3: number;
  dailySales7: number;
  dailySales15: number;
  dailySales: number; // 仓库预测日销量
  sales7Days: number;
  sales28Days: number;
  sales42Days: number;
  stock: number; // 仓库库存量
  transit: number; // 采购在途量
  unshipped: number; // 仓库未发货
  availableStock: number; // 仓库可用库存量
  availableDays: number; // 可用库存量可售天数
  stockAndTransit: number; // 库存+在途
  transitAvailableDays: number; // 在途+可用库存可售天数
  deliveryDays: number; // 货期
  purchasePrice: number; // 采购单价
  suggestedQuantity: number; // 建议采购数
  totalPrice: number; // 采购总价
  notes: string; // 备注
};

export type SuggestionGroup = {
  supplierName: string;
  totalProducts: number;
  totalSuggestedQuantity: number;
  totalSuggestedPrice: number;
  items: SuggestionItem[];
};

// Helper to calculate formulas
function calculateItem(base: Partial<SuggestionItem> & { 
  dailySales1: number, 
  dailySales3: number, 
  dailySales7: number, 
  dailySales15: number,
  stock: number,
  transit: number,
  unshipped: number,
  deliveryDays: number,
  purchasePrice: number
}): SuggestionItem {
  const dailySales = base.dailySales1 * 0.3 + base.dailySales3 * 0.2 + base.dailySales7 * 0.25 + base.dailySales15 * 0.25;
  const availableStock = base.stock; // Simplify: usually stock - unshipped, but let's just use stock or what user specified. The requirement didn't specify formula for availableStock. We'll use stock - unshipped if possible, but let's assume availableStock is given or just stock. Let's use stock. Wait, requirement says "仓库可用库存量：SKU可用库存数". Let's do availableStock = stock - unshipped.
  const calcAvailableStock = base.stock - base.unshipped;
  const availableDays = dailySales > 0 ? calcAvailableStock / dailySales : 0;
  const stockAndTransit = calcAvailableStock + base.transit;
  const transitAvailableDays = dailySales > 0 ? stockAndTransit / dailySales : 0;
  const suggestedQuantity = Math.ceil(dailySales * base.deliveryDays - base.stock - base.transit + base.unshipped);
  const totalPrice = suggestedQuantity * base.purchasePrice;

  return {
    ...base,
    id: base.id || '',
    buyer: base.buyer || '',
    sku: base.sku || '',
    name: base.name || '',
    status: base.status || '正常销售',
    warehouse: base.warehouse || '',
    brand: base.brand || '',
    sales7Days: base.sales7Days || 0,
    sales28Days: base.sales28Days || 0,
    sales42Days: base.sales42Days || 0,
    dailySales,
    availableStock: calcAvailableStock,
    availableDays,
    stockAndTransit,
    transitAvailableDays,
    suggestedQuantity,
    totalPrice,
    notes: base.notes || '',
  } as SuggestionItem;
}

export const mockSuggestions: SuggestionGroup[] = [
  {
    supplierName: '深圳优声电子有限公司',
    totalProducts: 4,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: '1-1',
        buyer: '张伟',
        sku: 'CN-BT-001',
        name: '无线蓝牙耳机 Pro Max',
        status: '正常销售',
        warehouse: 'FBA-US-东部',
        brand: '男装',
        dailySales1: 10,
        dailySales3: 8,
        dailySales7: 7,
        dailySales15: 6,
        sales7Days: 47,
        sales28Days: 189,
        sales42Days: 284,
        stock: 120,
        transit: 50,
        unshipped: 12,
        deliveryDays: 14,
        purchasePrice: 100.00,
        notes: '',
      }),
      calculateItem({
        id: '1-2',
        buyer: '张伟',
        sku: 'CN-SP-009',
        name: '蓝牙音箱 防水款',
        status: '自动创建',
        statusType: 'blue',
        warehouse: 'FBA-US-西部',
        brand: '原品牌站商品',
        brandType: 'orange',
        dailySales1: 5,
        dailySales3: 4,
        dailySales7: 4,
        dailySales15: 3,
        sales7Days: 27,
        sales28Days: 109,
        sales42Days: 164,
        stock: 45,
        transit: 0,
        unshipped: 6,
        deliveryDays: 12,
        purchasePrice: 100.00,
        notes: '',
      }),
      calculateItem({
        id: '1-3',
        buyer: '张伟',
        sku: 'CN-BT-003',
        name: '降噪无线耳机',
        status: '新品',
        warehouse: 'FBA-UK-伦敦',
        brand: '数码',
        dailySales1: 20,
        dailySales3: 22,
        dailySales7: 25,
        dailySales15: 24,
        sales7Days: 150,
        sales28Days: 600,
        sales42Days: 900,
        stock: 300,
        transit: 100,
        unshipped: 50,
        deliveryDays: 10,
        purchasePrice: 120.00
      }),
      calculateItem({
        id: '1-4',
        buyer: '张伟',
        sku: 'CN-SP-011',
        name: '便携小音箱',
        status: '清仓',
        warehouse: '国内-深圳仓',
        brand: '配件',
        dailySales1: 2,
        dailySales3: 3,
        dailySales7: 2,
        dailySales15: 2,
        sales7Days: 15,
        sales28Days: 60,
        sales42Days: 90,
        stock: 20,
        transit: 0,
        unshipped: 5,
        deliveryDays: 7,
        purchasePrice: 45.00
      })
    ]
  },
  {
    supplierName: '广州能量科技有限公司',
    totalProducts: 3,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: '2-1',
        buyer: '王芳',
        sku: 'CN-PB-002',
        name: '便携式充电宝 20000mAh',
        status: '正常销售',
        warehouse: 'FBA-DE-法兰克福',
        brand: '女装',
        brandType: 'pink',
        dailySales1: 6,
        dailySales3: 5,
        dailySales7: 5,
        dailySales15: 5,
        sales7Days: 35,
        sales28Days: 142,
        sales42Days: 214,
        stock: 35,
        transit: 0,
        unshipped: 8,
        deliveryDays: 10,
        purchasePrice: 100.00,
        notes: '加急补货',
      }),
      calculateItem({
        id: '2-2',
        buyer: '王芳',
        sku: 'CN-PW-050',
        name: '轻薄磁吸充电宝 10000mAh',
        status: '正常销售',
        warehouse: 'FBA-EU-德国',
        brand: '数码',
        dailySales1: 25,
        dailySales3: 28,
        dailySales7: 26,
        dailySales15: 25,
        sales7Days: 180,
        sales28Days: 720,
        sales42Days: 1080,
        stock: 200,
        transit: 150,
        unshipped: 40,
        deliveryDays: 18,
        purchasePrice: 85.00
      }),
      calculateItem({
        id: '2-3',
        buyer: '王芳',
        sku: 'CN-PW-010',
        name: '迷你口红充电宝 5000mAh',
        status: '新品',
        warehouse: 'FBA-JP-东京',
        brand: '配件',
        dailySales1: 8,
        dailySales3: 9,
        dailySales7: 8,
        dailySales15: 10,
        sales7Days: 60,
        sales28Days: 240,
        sales42Days: 360,
        stock: 80,
        transit: 20,
        unshipped: 10,
        deliveryDays: 15,
        purchasePrice: 35.00
      })
    ]
  },
  {
    supplierName: '东莞线材工厂',
    totalProducts: 2,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: '3-1',
        buyer: '王磊',
        sku: 'CN-CBL-C2C',
        name: 'Type-C to Type-C 快充线 2M',
        status: '正常销售',
        warehouse: '国内-东莞仓',
        brand: '配件',
        dailySales1: 50,
        dailySales3: 52,
        dailySales7: 55,
        dailySales15: 50,
        sales7Days: 360,
        sales28Days: 1440,
        sales42Days: 2160,
        stock: 1000,
        transit: 500,
        unshipped: 100,
        deliveryDays: 5,
        purchasePrice: 5.50
      }),
      calculateItem({
        id: '3-2',
        buyer: '王磊',
        sku: 'CN-CBL-A2C',
        name: 'USB-A to Type-C 充电线 1M',
        status: '清仓',
        warehouse: '国内-东莞仓',
        brand: '配件',
        dailySales1: 15,
        dailySales3: 14,
        dailySales7: 15,
        dailySales15: 16,
        sales7Days: 105,
        sales28Days: 420,
        sales42Days: 630,
        stock: 500,
        transit: 0,
        unshipped: 50,
        deliveryDays: 5,
        purchasePrice: 3.20
      })
    ]
  },
  {
    supplierName: '广州市贝衣情纺织品有限公司',
    totalProducts: 2,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: '4-1',
        buyer: '陈芳',
        sku: 'CN-CL-TS01',
        name: '纯棉透气短袖T恤 黑色 L',
        status: '正常销售',
        warehouse: 'FBA-US-西部',
        brand: '男装',
        dailySales1: 30,
        dailySales3: 28,
        dailySales7: 32,
        dailySales15: 30,
        sales7Days: 210,
        sales28Days: 840,
        sales42Days: 1260,
        stock: 400,
        transit: 200,
        unshipped: 50,
        deliveryDays: 25,
        purchasePrice: 22.00
      }),
      calculateItem({
        id: '4-2',
        buyer: '陈芳',
        sku: 'CN-CL-PT05',
        name: '休闲运动长裤 灰色 XL',
        status: '正常销售',
        warehouse: 'FBA-US-西部',
        brand: '男装',
        dailySales1: 18,
        dailySales3: 20,
        dailySales7: 19,
        dailySales15: 18,
        sales7Days: 130,
        sales28Days: 520,
        sales42Days: 780,
        stock: 250,
        transit: 100,
        unshipped: 30,
        deliveryDays: 25,
        purchasePrice: 38.00
      })
    ]
  },
  {
    supplierName: '佛山宏达五金厂',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: '5-1',
        buyer: '刘强',
        sku: 'CN-HW-M01',
        name: '多功能便携折叠刀',
        status: '正常销售',
        warehouse: 'FBA-EU-英国',
        brand: '户外',
        dailySales1: 12,
        dailySales3: 15,
        dailySales7: 14,
        dailySales15: 13,
        sales7Days: 100,
        sales28Days: 400,
        sales42Days: 600,
        stock: 120,
        transit: 80,
        unshipped: 20,
        deliveryDays: 30,
        purchasePrice: 18.50
      })
    ]
  },
  {
    supplierName: '深圳海翼电子科技有限公司',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: 'S-1',
        buyer: '张伟',
        sku: 'CN-SH-001',
        name: '缺货-无线鼠标 2.4G',
        status: '缺货预警',
        warehouse: 'FBA-US-东部',
        brand: '数码',
        dailySales1: 20,
        dailySales3: 18,
        dailySales7: 16,
        dailySales15: 15,
        sales7Days: 120,
        sales28Days: 480,
        sales42Days: 720,
        stock: 0,
        transit: 0,
        unshipped: 30,
        deliveryDays: 12,
        purchasePrice: 12.00,
        notes: '紧急补货'
      })
    ]
  },
  {
    supplierName: '广州迅达数码配件厂',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: 'S-2',
        buyer: '王芳',
        sku: 'CN-GZ-002',
        name: '缺货-快充头 20W',
        status: '缺货预警',
        warehouse: 'FBA-EU-德国',
        brand: '配件',
        dailySales1: 35,
        dailySales3: 32,
        dailySales7: 30,
        dailySales15: 28,
        sales7Days: 210,
        sales28Days: 840,
        sales42Days: 1260,
        stock: 5,
        transit: 0,
        unshipped: 40,
        deliveryDays: 10,
        purchasePrice: 6.50,
        notes: '紧急补货'
      })
    ]
  },
  {
    supplierName: '义乌小商品批发中心',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: 'S-3',
        buyer: '李娜',
        sku: 'CN-YW-003',
        name: '缺货-收纳盒 3件套',
        status: '缺货预警',
        warehouse: '国内-义乌仓',
        brand: '家居',
        dailySales1: 12,
        dailySales3: 11,
        dailySales7: 10,
        dailySales15: 9,
        sales7Days: 70,
        sales28Days: 280,
        sales42Days: 420,
        stock: 0,
        transit: 10,
        unshipped: 25,
        deliveryDays: 7,
        purchasePrice: 8.80,
        notes: '紧急补货'
      })
    ]
  },
  {
    supplierName: '东莞铭锐塑胶制品厂',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: 'S-4',
        buyer: '王磊',
        sku: 'CN-DG-004',
        name: '缺货-手机壳 透明款',
        status: '缺货预警',
        warehouse: 'FBA-UK-伦敦',
        brand: '配件',
        dailySales1: 60,
        dailySales3: 55,
        dailySales7: 50,
        dailySales15: 45,
        sales7Days: 350,
        sales28Days: 1400,
        sales42Days: 2100,
        stock: 0,
        transit: 0,
        unshipped: 120,
        deliveryDays: 9,
        purchasePrice: 2.30,
        notes: '紧急补货'
      })
    ]
  },
  {
    supplierName: '杭州轻工用品有限公司',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: 'S-5',
        buyer: '陈芳',
        sku: 'CN-HZ-005',
        name: '缺货-旅行收纳袋',
        status: '缺货预警',
        warehouse: 'FBA-US-西部',
        brand: '家居',
        dailySales1: 18,
        dailySales3: 16,
        dailySales7: 15,
        dailySales15: 14,
        sales7Days: 95,
        sales28Days: 380,
        sales42Days: 570,
        stock: 2,
        transit: 0,
        unshipped: 18,
        deliveryDays: 15,
        purchasePrice: 5.20,
        notes: '紧急补货'
      })
    ]
  },
  {
    supplierName: '宁波兴达纺织有限公司',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: 'S-6',
        buyer: '刘强',
        sku: 'CN-NB-006',
        name: '缺货-浴巾 70*140cm',
        status: '缺货预警',
        warehouse: 'FBA-DE-法兰克福',
        brand: '家居',
        dailySales1: 22,
        dailySales3: 21,
        dailySales7: 20,
        dailySales15: 19,
        sales7Days: 140,
        sales28Days: 560,
        sales42Days: 840,
        stock: 0,
        transit: 0,
        unshipped: 35,
        deliveryDays: 20,
        purchasePrice: 9.90,
        notes: '紧急补货'
      })
    ]
  },
  {
    supplierName: '泉州晟达鞋业',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: 'S-7',
        buyer: '张伟',
        sku: 'CN-QZ-007',
        name: '缺货-运动鞋 男款 42',
        status: '缺货预警',
        warehouse: 'FBA-US-东部',
        brand: '男装',
        dailySales1: 9,
        dailySales3: 10,
        dailySales7: 11,
        dailySales15: 10,
        sales7Days: 60,
        sales28Days: 240,
        sales42Days: 360,
        stock: 0,
        transit: 5,
        unshipped: 18,
        deliveryDays: 25,
        purchasePrice: 35.00,
        notes: '紧急补货'
      })
    ]
  },
  {
    supplierName: '苏州智造家居用品厂',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: 'S-8',
        buyer: '李娜',
        sku: 'CN-SZ-008',
        name: '缺货-厨房置物架',
        status: '缺货预警',
        warehouse: 'FBA-JP-东京',
        brand: '家居',
        dailySales1: 14,
        dailySales3: 13,
        dailySales7: 12,
        dailySales15: 12,
        sales7Days: 80,
        sales28Days: 320,
        sales42Days: 480,
        stock: 1,
        transit: 0,
        unshipped: 20,
        deliveryDays: 18,
        purchasePrice: 11.50,
        notes: '紧急补货'
      })
    ]
  },
  {
    supplierName: '厦门蓝海户外用品有限公司',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: 'S-9',
        buyer: '王磊',
        sku: 'CN-XM-009',
        name: '缺货-露营灯 充电款',
        status: '缺货预警',
        warehouse: 'FBA-UK-伦敦',
        brand: '户外',
        dailySales1: 26,
        dailySales3: 24,
        dailySales7: 22,
        dailySales15: 20,
        sales7Days: 150,
        sales28Days: 600,
        sales42Days: 900,
        stock: 0,
        transit: 0,
        unshipped: 45,
        deliveryDays: 16,
        purchasePrice: 18.00,
        notes: '紧急补货'
      })
    ]
  },
  {
    supplierName: '成都安行车品工厂',
    totalProducts: 1,
    totalSuggestedQuantity: 0,
    totalSuggestedPrice: 0,
    items: [
      calculateItem({
        id: 'S-10',
        buyer: '陈芳',
        sku: 'CN-CD-010',
        name: '缺货-车载手机支架',
        status: '缺货预警',
        warehouse: '国内-成都仓',
        brand: '配件',
        dailySales1: 40,
        dailySales3: 38,
        dailySales7: 35,
        dailySales15: 33,
        sales7Days: 240,
        sales28Days: 960,
        sales42Days: 1440,
        stock: 0,
        transit: 20,
        unshipped: 70,
        deliveryDays: 8,
        purchasePrice: 4.80,
        notes: '紧急补货'
      })
    ]
  }
];

// Calculate totals for groups
mockSuggestions.forEach(group => {
  group.totalSuggestedQuantity = group.items.reduce((sum, item) => sum + item.suggestedQuantity, 0);
  group.totalSuggestedPrice = group.items.reduce((sum, item) => sum + item.totalPrice, 0);
});
