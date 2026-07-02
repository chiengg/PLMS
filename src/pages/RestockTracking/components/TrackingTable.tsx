import React, { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { computeDerived, computeWarnings } from '../rules';
import type { RestockRow, RulesConfig, WarningType } from '../types';

function warningBadge(t: WarningType) {
  if (t === '断货风险') return 'bg-red-100 text-red-600';
  if (t === '备货不足') return 'bg-amber-100 text-amber-700';
  if (t === '滞销风险') return 'bg-gray-100 text-gray-700';
  if (t === '库存积压') return 'bg-purple-100 text-purple-700';
  return 'bg-orange-100 text-orange-700';
}

export default function TrackingTable(props: {
  rows: RestockRow[];
  rules: RulesConfig;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  onOpenSku: (payload: {
    shop: string;
    sku: string;
    name: string;
    remark: string;
    warningTypes: WarningType[];
    availableStock: number;
    transitQty: number;
    sellableDays: number;
    forecastDailySales: number;
    restockAt: number;
    lastInboundAt: number;
    lastOutboundAt: number;
    costPrice: number;
  }) => void;
  onSendSingle: (payload: {
    shop: string;
    sku: string;
    name: string;
    warningTypes: WarningType[];
    availableStock: number;
    transitQty: number;
    forecastDailySales: number;
  }) => void;
}) {
  const { rows, rules, selectedIds, onSelectedIdsChange, onOpenSku, onSendSingle } = props;

  const computed = useMemo(() => {
    const now = Date.now();
    return rows.map((r) => {
      const d = computeDerived(r);
      const w = computeWarnings({ row: r, rules, now });
      return { row: r, derived: d, warnings: w };
    });
  }, [rows, rules]);

  const allIds = computed.map((x) => x.row.id);
  const allChecked = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  return (
    <div className="flex-1 relative">
      <table className="w-full table-fixed text-left text-[12px] border-collapse bg-white">
        <thead className="sticky top-0 z-30">
          <tr className="bg-[#F5F6F8] text-gray-600 border-b border-gray-200">
            <th className="p-2 w-10 min-w-[40px] text-center" rowSpan={2}>
              <Checkbox
                checked={allChecked}
                onCheckedChange={(checked) => {
                  onSelectedIdsChange(checked ? allIds : []);
                }}
              />
            </th>
            <th className="p-2 text-center" colSpan={5}>
              基础信息
            </th>
            <th className="p-2 text-center" colSpan={5}>
              库存状态
            </th>
            <th className="p-2 text-center" colSpan={3}>
              销售与周转
            </th>
            <th className="p-2 text-center" colSpan={1}>
              预警状态
            </th>
            <th className="p-2 text-center min-w-[90px]" rowSpan={2}>
              操作
            </th>
          </tr>
          <tr className="bg-[#F5F6F8] text-gray-600 border-b border-gray-200">
            <th className="p-2 w-[140px]">店铺</th>
            <th className="p-2 w-[110px]">库存SKU</th>
            <th className="p-2 w-[220px]">中文名称</th>
            <th className="p-2 w-[110px]">设计编码</th>
            <th className="p-2 w-[200px]">商品备注</th>

            <th className="p-2 w-[90px] text-right">仓位库存</th>
            <th className="p-2 w-[100px] text-right">可用库存量</th>
            <th className="p-2 w-[80px] text-right">在途量</th>
            <th className="p-2 w-[80px] text-right">未发货量</th>
            <th className="p-2 w-[110px] text-right">调拨未发货</th>

            <th className="p-2 w-[90px] text-right">预测日销量</th>
            <th className="p-2 w-[90px] text-right">可售天数</th>
            <th className="p-2 w-[80px] text-right">采购天数</th>

            <th className="p-2 w-[240px]">当前预警类型</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {computed.map(({ row, derived, warnings }) => {
            const checked = selectedIds.includes(row.id);
            const isRisk = warnings.status === '触发预警';
            return (
              <tr key={row.id} className={cn('hover:bg-gray-50', isRisk && 'bg-orange-50/30')}>
                <td className="p-2 text-center">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(c) => {
                      onSelectedIdsChange(c ? [...selectedIds, row.id] : selectedIds.filter((x) => x !== row.id));
                    }}
                  />
                </td>
                <td className="p-2 text-gray-700 truncate">{row.shop}</td>
                <td className="p-2">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() =>
                      onOpenSku({
                        shop: row.shop,
                        sku: row.sku,
                        name: row.name,
                        remark: row.remark,
                        warningTypes: warnings.types,
                        availableStock: derived.availableStock,
                        transitQty: row.transitQty,
                        sellableDays: derived.sellableDays,
                        forecastDailySales: row.forecastDailySales,
                        restockAt: row.restockAt,
                        lastInboundAt: row.lastInboundAt,
                        lastOutboundAt: row.lastOutboundAt,
                        costPrice: row.costPrice,
                      })
                    }
                  >
                    {row.sku}
                  </button>
                </td>
                <td className="p-2 text-gray-700 truncate">{row.name}</td>
                <td className="p-2 text-gray-700 truncate">{row.designCode}</td>
                <td className="p-2 text-gray-600 truncate">{row.remark || '--'}</td>

                <td className="p-2 text-right text-gray-700">{row.binStock}</td>
                <td className={cn('p-2 text-right font-medium', isRisk ? 'text-gray-900' : 'text-gray-700')}>
                  {derived.availableStock}
                </td>
                <td className={cn('p-2 text-right', row.transitQty > 0 ? 'text-orange-600' : 'text-gray-700')}>
                  {row.transitQty}
                </td>
                <td className="p-2 text-right text-gray-700">{row.unshippedQty}</td>
                <td className="p-2 text-right text-gray-700">{row.transferUnshippedQty}</td>

                <td className="p-2 text-right text-gray-700">{row.forecastDailySales}</td>
                <td className={cn('p-2 text-right font-bold', derived.sellableDays < 1 ? 'text-red-600' : 'text-gray-800')}>
                  {Number.isFinite(derived.sellableDays) ? `${Math.max(0, Math.floor(derived.sellableDays))} 天` : '--'}
                </td>
                <td className="p-2 text-right text-gray-700">{row.leadTimeDays} 天</td>

                <td className="p-2">
                  {warnings.types.length === 0 && (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] bg-green-100 text-green-700">
                      正常
                    </span>
                  )}
                  {warnings.types.map((t) => (
                    <span
                      key={t}
                      className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium mr-1 mb-1', warningBadge(t))}
                    >
                      {t}
                    </span>
                  ))}
                </td>

                <td className="p-2 text-center">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() =>
                      onSendSingle({
                        shop: row.shop,
                        sku: row.sku,
                        name: row.name,
                        warningTypes: warnings.types,
                        availableStock: derived.availableStock,
                        transitQty: row.transitQty,
                        forecastDailySales: row.forecastDailySales,
                      })
                    }
                  >
                    发送通知
                  </button>
                </td>
              </tr>
            );
          })}
          {computed.length === 0 && (
            <tr>
              <td colSpan={15} className="p-10 text-center text-gray-500">
                暂无数据
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
