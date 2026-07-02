import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WarningType } from '../types';

function badge(t: WarningType) {
  if (t === '断货风险') return 'bg-red-100 text-red-600';
  if (t === '备货不足') return 'bg-amber-100 text-amber-700';
  if (t === '滞销风险') return 'bg-gray-100 text-gray-700';
  if (t === '库存积压') return 'bg-purple-100 text-purple-700';
  return 'bg-orange-100 text-orange-700';
}

function formatDate(ts: number) {
  if (!Number.isFinite(ts) || ts <= 0) return '--';
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function money(n: number) {
  if (!Number.isFinite(n)) return '--';
  return `¥${n.toFixed(2)}`;
}

export default function SkuDrawer(props: {
  open: boolean;
  onClose: () => void;
  data: {
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
  } | null;
}) {
  const { open, onClose, data } = props;

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-[680px] max-w-[92vw] bg-white shadow-xl border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[18px] font-semibold text-gray-900">{data.sku}</div>
            <div className="mt-1 text-[12px] text-gray-600 truncate">
              <span className="inline-flex items-center rounded px-2 py-0.5 bg-gray-100 text-gray-700 mr-2">{data.shop}</span>
              {data.name}
            </div>
          </div>
          <button type="button" className="text-gray-400 hover:text-gray-700" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar p-4 bg-[#F7F9FC]">
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center gap-2 text-[13px] font-medium text-gray-800">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center text-[11px]">i</span>
              当前诊断
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.warningTypes.length === 0 && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] bg-green-100 text-green-700">正常</span>
              )}
              {data.warningTypes.map((t) => (
                <span key={t} className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium', badge(t))}>
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-3 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-[13px] text-gray-700">
              {data.remark || '—'}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded p-4">
              <div className="text-[12px] text-gray-600">可用库存</div>
              <div className="mt-2 text-[20px] font-semibold text-gray-900">{data.availableStock}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded p-4">
              <div className="text-[12px] text-gray-600">在途量</div>
              <div className="mt-2 text-[20px] font-semibold text-orange-600">{data.transitQty}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded p-4">
              <div className="text-[12px] text-gray-600">可售天数</div>
              <div className="mt-2 text-[20px] font-semibold text-red-600">{Math.max(0, Math.floor(data.sellableDays))}</div>
            </div>
          </div>

          <div className="mt-4 bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-medium text-gray-800">近30天销量趋势</div>
              <div className="text-[12px] text-gray-600">预测日均：{data.forecastDailySales} 件/天</div>
            </div>
            <div className="mt-3 h-[220px] border border-gray-200 rounded bg-gradient-to-b from-white to-[#F6FAFF] flex items-center justify-center text-[12px] text-gray-500">
              折线图占位（第一版）
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded p-4">
              <div className="text-[13px] font-medium text-gray-800">时间节点</div>
              <div className="mt-3 grid grid-cols-[110px_1fr] gap-y-2 text-[12px]">
                <div className="text-gray-500">最新备货时间</div>
                <div className="text-gray-800">{formatDate(data.restockAt)}</div>
                <div className="text-gray-500">最近一次入库</div>
                <div className="text-gray-800">{formatDate(data.lastInboundAt)}</div>
                <div className="text-gray-500">最近一次出库</div>
                <div className="text-gray-800">{formatDate(data.lastOutboundAt)}</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded p-4">
              <div className="text-[13px] font-medium text-gray-800">财务相关</div>
              <div className="mt-3 grid grid-cols-[110px_1fr] gap-y-2 text-[12px]">
                <div className="text-gray-500">单位采购成本</div>
                <div className="text-gray-800">{money(data.costPrice)}</div>
                <div className="text-gray-500">在途货值</div>
                <div className="text-gray-800">{money(data.transitQty * data.costPrice)}</div>
                <div className="text-gray-500">总占用资金</div>
                <div className="text-blue-600 font-medium">{money((data.availableStock + data.transitQty) * data.costPrice)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
