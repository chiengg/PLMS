export type MonthStr = `${number}-${string}`;

export type PurchaseRecord = {
  id: string;
  month: MonthStr;
  purchaser: string;
  supplier: string;
  sku: string;
  productName: string;
  thumbnailUrl: string;
  qty: number;
  unitPrice: number;
};

export const purchaserOptions = ['全部', '张三', '李四', '王五', '赵六'];

export const supplierOptions = [
  '全部',
  '广州市贝智皮具有限公司',
  '东莞市柏易服饰有限公司',
  '深圳优声电子有限公司'
];

export const purchaseRecords: PurchaseRecord[] = [
  {
    id: 'r1',
    month: '2026-03',
    purchaser: '李四',
    supplier: '东莞市柏易服饰有限公司',
    sku: 'CN-BT-003',
    productName: '蓝牙音箱',
    thumbnailUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bluetooth%20speaker%20product%20photo%2C%20studio%20lighting%2C%20white%20background&image_size=square',
    qty: 1000,
    unitPrice: 8.2
  },
  {
    id: 'r2',
    month: '2026-03',
    purchaser: '李四',
    supplier: '东莞市柏易服饰有限公司',
    sku: 'CN-BT-003',
    productName: '蓝牙音箱',
    thumbnailUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bluetooth%20speaker%20product%20photo%2C%20studio%20lighting%2C%20white%20background&image_size=square',
    qty: 500,
    unitPrice: 8.0
  },
  {
    id: 'r3',
    month: '2026-04',
    purchaser: '李四',
    supplier: '东莞市柏易服饰有限公司',
    sku: 'CN-BT-003',
    productName: '蓝牙音箱',
    thumbnailUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bluetooth%20speaker%20product%20photo%2C%20studio%20lighting%2C%20white%20background&image_size=square',
    qty: 1200,
    unitPrice: 7.6
  },
  {
    id: 'r4',
    month: '2026-04',
    purchaser: '李四',
    supplier: '东莞市柏易服饰有限公司',
    sku: 'CN-BT-003',
    productName: '蓝牙音箱',
    thumbnailUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bluetooth%20speaker%20product%20photo%2C%20studio%20lighting%2C%20white%20background&image_size=square',
    qty: 800,
    unitPrice: 7.4
  },
  {
    id: 'r5',
    month: '2026-03',
    purchaser: '张三',
    supplier: '广州市贝智皮具有限公司',
    sku: 'GZ-BG-001',
    productName: '真皮手提包',
    thumbnailUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=handbag%20product%20photo%2C%20studio%20lighting%2C%20white%20background&image_size=square',
    qty: 200,
    unitPrice: 90
  },
  {
    id: 'r6',
    month: '2026-04',
    purchaser: '张三',
    supplier: '广州市贝智皮具有限公司',
    sku: 'GZ-BG-001',
    productName: '真皮手提包',
    thumbnailUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=handbag%20product%20photo%2C%20studio%20lighting%2C%20white%20background&image_size=square',
    qty: 200,
    unitPrice: 92
  },
  {
    id: 'r7',
    month: '2026-05',
    purchaser: '李四',
    supplier: '东莞市柏易服饰有限公司',
    sku: 'CN-BT-003',
    productName: '蓝牙音箱',
    thumbnailUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bluetooth%20speaker%20product%20photo%2C%20studio%20lighting%2C%20white%20background&image_size=square',
    qty: 1500,
    unitPrice: 7.2
  },
  {
    id: 'r8',
    month: '2026-05',
    purchaser: '李四',
    supplier: '东莞市柏易服饰有限公司',
    sku: 'CN-BT-003',
    productName: '蓝牙音箱',
    thumbnailUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bluetooth%20speaker%20product%20photo%2C%20studio%20lighting%2C%20white%20background&image_size=square',
    qty: 600,
    unitPrice: 7.1
  },
  {
    id: 'r9',
    month: '2026-05',
    purchaser: '张三',
    supplier: '广州市贝智皮具有限公司',
    sku: 'GZ-BG-001',
    productName: '真皮手提包',
    thumbnailUrl:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=handbag%20product%20photo%2C%20studio%20lighting%2C%20white%20background&image_size=square',
    qty: 260,
    unitPrice: 88
  }
];
