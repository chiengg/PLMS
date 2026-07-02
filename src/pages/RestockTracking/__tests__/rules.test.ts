import { describe, expect, it } from 'vitest';
import { computeDerived, computeWarnings, defaultRules } from '../rules';
import type { RestockRow } from '../types';

const baseRow: RestockRow = {
  id: 'r1',
  shop: '亚马逊-US-01',
  sku: 'SKU001',
  name: '测试商品',
  designCode: 'D-100',
  remark: '',
  binStock: 120,
  allocatedUnshipped: 70,
  transitQty: 300,
  unshippedQty: 70,
  transferUnshippedQty: 0,
  forecastDailySales: 60,
  leadTimeDays: 15,
  restockAt: Date.now() - 20 * 86400000,
  costPrice: 45,
  lastInboundAt: Date.now() - 40 * 86400000,
  lastOutboundAt: Date.now() - 3 * 86400000,
};

describe('RestockTracking rules', () => {
  it('computes derived values', () => {
    const d = computeDerived(baseRow);
    expect(d.availableStock).toBe(50);
    expect(d.sellableDays).toBeCloseTo(50 / 60, 5);
    expect(d.inTransitValue).toBe(300 * 45);
    expect(d.totalValue).toBe((120 + 300) * 45);
  });

  it('detects out of stock risk', () => {
    const row = { ...baseRow, allocatedUnshipped: 119 };
    const warnings = computeWarnings({ row, rules: defaultRules, now: Date.now() });
    expect(warnings.types.includes('断货风险')).toBe(true);
    expect(warnings.status).toBe('触发预警');
  });

  it('detects understock risk', () => {
    const row = { ...baseRow, forecastDailySales: 10, leadTimeDays: 15, allocatedUnshipped: 0, binStock: 100 };
    const warnings = computeWarnings({ row, rules: defaultRules, now: Date.now() });
    expect(warnings.types.includes('备货不足')).toBe(true);
  });

  it('detects slow sales risk', () => {
    const row = { ...baseRow, forecastDailySales: 0.5 };
    const warnings = computeWarnings({ row, rules: defaultRules, now: Date.now() });
    expect(warnings.types.includes('滞销风险')).toBe(true);
  });

  it('detects overstock risk', () => {
    const row = { ...baseRow, forecastDailySales: 1, binStock: 300, allocatedUnshipped: 0 };
    const warnings = computeWarnings({ row, rules: defaultRules, now: Date.now() });
    expect(warnings.types.includes('库存积压')).toBe(true);
  });

  it('detects arrival delay risk', () => {
    const row = { ...baseRow, restockAt: Date.now() - 20 * 86400000, leadTimeDays: 10, transitQty: 1 };
    const warnings = computeWarnings({ row, rules: defaultRules, now: Date.now() });
    expect(warnings.types.includes('到货延迟')).toBe(true);
  });
});

