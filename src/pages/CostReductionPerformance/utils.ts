import type { MonthStr, PurchaseRecord } from './mockData';

export type CostReductionRow = {
  key: string;
  purchaser: string;
  supplier: string;
  sku: string;
  productName: string;
  thumbnailUrl: string;
  qtyCur: number;
  priceCur: number | null;
  qtyPrev: number;
  pricePrev: number | null;
  saveUnit: number | null;
  saveRate: number | null;
  saveAmt: number | null;
};

export function prevMonth(month: MonthStr): MonthStr {
  const [yStr, mStr] = month.split('-');
  const y = Number(yStr);
  const m = Number(mStr);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return month;
  if (m === 1) return `${y - 1}-12` as MonthStr;
  return `${y}-${String(m - 1).padStart(2, '0')}` as MonthStr;
}

function weightedAvg(totalAmt: number, totalQty: number): number | null {
  if (!totalQty) return null;
  return totalAmt / totalQty;
}

export type AggregateFilters = {
  month: MonthStr;
  purchaser?: string;
  supplier?: string;
  keyword?: string;
};

export function buildCostReductionRows(records: PurchaseRecord[], filters: AggregateFilters): CostReductionRow[] {
  const monthCur = filters.month;
  const monthPrev = prevMonth(monthCur);

  const keyword = (filters.keyword || '').trim();
  const keywordLower = keyword.toLowerCase();

  const matchKeyword = (r: PurchaseRecord) => {
    if (!keyword) return true;
    return r.sku.toLowerCase().includes(keywordLower) || r.productName.toLowerCase().includes(keywordLower);
  };

  const base = records.filter(r => {
    if (filters.purchaser && filters.purchaser !== '全部' && r.purchaser !== filters.purchaser) return false;
    if (filters.supplier && filters.supplier !== '全部' && r.supplier !== filters.supplier) return false;
    if (!matchKeyword(r)) return false;
    return r.month === monthCur || r.month === monthPrev;
  });

  type Agg = {
    purchaser: string;
    supplier: string;
    sku: string;
    productName: string;
    thumbnailUrl: string;
    qtyCur: number;
    amtCur: number;
    qtyPrev: number;
    amtPrev: number;
  };

  const map = new Map<string, Agg>();
  for (const r of base) {
    const key = `${r.purchaser}|${r.supplier}|${r.sku}`;
    const existed = map.get(key);
    const agg: Agg = existed || {
      purchaser: r.purchaser,
      supplier: r.supplier,
      sku: r.sku,
      productName: r.productName,
      thumbnailUrl: r.thumbnailUrl,
      qtyCur: 0,
      amtCur: 0,
      qtyPrev: 0,
      amtPrev: 0
    };

    if (r.month === monthCur) {
      agg.qtyCur += r.qty;
      agg.amtCur += r.qty * r.unitPrice;
    } else if (r.month === monthPrev) {
      agg.qtyPrev += r.qty;
      agg.amtPrev += r.qty * r.unitPrice;
    }

    map.set(key, agg);
  }

  const rows: CostReductionRow[] = [];
  for (const [key, a] of map.entries()) {
    const priceCur = weightedAvg(a.amtCur, a.qtyCur);
    const pricePrev = weightedAvg(a.amtPrev, a.qtyPrev);
    if (priceCur == null || pricePrev == null) continue;
    if (!(priceCur < pricePrev)) continue;

    const saveUnit = pricePrev - priceCur;
    const saveRate = pricePrev === 0 ? null : saveUnit / pricePrev;
    const saveAmt = Math.max(0, saveUnit) * a.qtyCur;

    rows.push({
      key,
      purchaser: a.purchaser,
      supplier: a.supplier,
      sku: a.sku,
      productName: a.productName,
      thumbnailUrl: a.thumbnailUrl,
      qtyCur: a.qtyCur,
      priceCur,
      qtyPrev: a.qtyPrev,
      pricePrev,
      saveUnit,
      saveRate,
      saveAmt
    });
  }

  rows.sort((x, y) => (y.saveAmt || 0) - (x.saveAmt || 0) || (y.saveUnit || 0) - (x.saveUnit || 0));
  return rows;
}

export function toPercent(rate: number | null) {
  if (rate == null) return '--';
  return `${(rate * 100).toFixed(2)}%`;
}

export function exportRowsToCsv(rows: CostReductionRow[], month: string): { filename: string; csv: string } {
  const header = [
    '采购员',
    '供应商',
    'SKU',
    '名称',
    '本次采购单价(加权均价)',
    '上次采购单价(加权均价)',
    '降本单价',
    '降本比例',
    '本次采购数量',
    '降本金额'
  ];

  const lines = [header.join(',')];
  for (const r of rows) {
    const line = [
      r.purchaser,
      r.supplier,
      r.sku,
      r.productName,
      r.priceCur == null ? '' : r.priceCur.toFixed(4),
      r.pricePrev == null ? '' : r.pricePrev.toFixed(4),
      r.saveUnit == null ? '' : r.saveUnit.toFixed(4),
      r.saveRate == null ? '' : `${(r.saveRate * 100).toFixed(2)}%`,
      String(r.qtyCur),
      r.saveAmt == null ? '' : r.saveAmt.toFixed(2)
    ].map(v => `"${String(v).replace(/"/g, '""')}"`);

    lines.push(line.join(','));
  }

  return {
    filename: `降本绩效管理_${month}.csv`,
    csv: `\uFEFF${lines.join('\n')}`
  };
}
