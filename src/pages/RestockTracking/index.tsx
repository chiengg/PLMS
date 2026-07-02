import React, { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import FilterBar, { type FilterValue } from './components/FilterBar';
import TrackingTable from './components/TrackingTable';
import RulesDialog from './components/RulesDialog';
import NotifyDialog from './components/NotifyDialog';
import SkuDrawer from './components/SkuDrawer';
import { computeDerived, computeWarnings } from './rules';
import { defaultShops, mockRestockRows, mockRules, RESTOCK_DATA_KEY, RESTOCK_RULES_KEY } from './mockData';
import type { RestockRow, RulesConfig, WarningType } from './types';

const defaultFilter: FilterValue = {
  shop: '全部',
  keyword: '',
  startDate: '',
  endDate: '',
  warningStatus: '全部',
  warningTypes: [],
};

function parseDateStart(v: string) {
  if (!v) return null;
  const d = new Date(`${v}T00:00:00`);
  const ts = d.getTime();
  return Number.isFinite(ts) ? ts : null;
}

function parseDateEnd(v: string) {
  if (!v) return null;
  const d = new Date(`${v}T23:59:59`);
  const ts = d.getTime();
  return Number.isFinite(ts) ? ts : null;
}

export default function RestockTracking() {
  const [rows] = useLocalStorage<RestockRow[]>(RESTOCK_DATA_KEY, mockRestockRows);
  const [rules, setRules] = useLocalStorage<RulesConfig>(RESTOCK_RULES_KEY, mockRules);

  const safeRows = Array.isArray(rows) ? rows : [];
  const safeRules = { ...mockRules, ...(rules && typeof rules === 'object' ? rules : {}) } as RulesConfig;

  const [draft, setDraft] = useState<FilterValue>(defaultFilter);
  const [applied, setApplied] = useState<FilterValue>(defaultFilter);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyMode, setNotifyMode] = useState<'single' | 'batch'>('single');
  const [skuOpen, setSkuOpen] = useState(false);
  const [skuData, setSkuData] = useState<{
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
  } | null>(null);
  const [notifyPayload, setNotifyPayload] = useState<
    Array<{
      shop: string;
      sku: string;
      name: string;
      warningTypes: WarningType[];
      availableStock: number;
      transitQty: number;
      forecastDailySales: number;
    }>
  >([]);

  const computed = useMemo(() => {
    const now = Date.now();
    return safeRows.map((r) => {
      const derived = computeDerived(r);
      const warnings = computeWarnings({ row: r, rules: safeRules, now });
      return { row: r, derived, warnings };
    });
  }, [safeRows, safeRules]);

  const filteredRows = useMemo(() => {
    const kw = applied.keyword.trim().toLowerCase();
    const start = parseDateStart(applied.startDate);
    const end = parseDateEnd(applied.endDate);

    return computed
      .filter(({ row, warnings }) => {
        if (applied.shop !== '全部' && row.shop !== applied.shop) return false;
        if (kw) {
          const inSku = row.sku.toLowerCase().includes(kw);
          const inName = row.name.toLowerCase().includes(kw);
          if (!inSku && !inName) return false;
        }

        if (start !== null && row.restockAt < start) return false;
        if (end !== null && row.restockAt > end) return false;

        if (applied.warningStatus !== '全部' && warnings.status !== applied.warningStatus) return false;

        if (applied.warningTypes.length > 0) {
          const set = new Set(warnings.types);
          const any = applied.warningTypes.some((t) => set.has(t as any));
          if (!any) return false;
        }

        return true;
      })
      .map((x) => x.row);
  }, [applied, computed]);

  const payloadById = useMemo(() => {
    const map = new Map<string, (typeof notifyPayload)[number]>();
    computed.forEach(({ row, derived, warnings }) => {
      map.set(row.id, {
        shop: row.shop,
        sku: row.sku,
        name: row.name,
        warningTypes: warnings.types,
        availableStock: derived.availableStock,
        transitQty: row.transitQty,
        forecastDailySales: row.forecastDailySales,
      });
    });
    return map;
  }, [computed]);

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA]">
      <div className="flex items-center text-gray-500 text-[13px] mb-4 flex-shrink-0 px-4 pt-4">
        <span>首页</span>
        <span className="mx-2">
          <ChevronRight className="w-3 h-3" />
        </span>
        <span>采购流程</span>
        <span className="mx-2">
          <ChevronRight className="w-3 h-3" />
        </span>
        <span className="text-gray-800 font-medium">备货跟踪</span>
      </div>

      <div className="flex-1 flex flex-col px-4 pb-4 gap-4">
        <FilterBar
          shops={defaultShops}
          value={draft}
          onChange={setDraft}
          onReset={() => {
            setDraft(defaultFilter);
            setApplied(defaultFilter);
            setSelectedIds([]);
          }}
          onSearch={() => {
            setApplied(draft);
            setSelectedIds([]);
          }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-[13px]"
              onClick={() => {
                if (selectedIds.length === 0) {
                  alert('请先勾选数据');
                  return;
                }
                const payload = selectedIds.map((id) => payloadById.get(id)).filter(Boolean) as any;
                setNotifyMode('batch');
                setNotifyPayload(payload);
                setNotifyOpen(true);
              }}
            >
              批量发送预警通知
            </Button>
            <Button
              variant="outline"
              className="h-8 text-[13px]"
              onClick={() => {
                alert('数据导出（示例）');
              }}
            >
              数据导出
            </Button>
          </div>

          <Button variant="outline" className="h-8 text-[13px]" onClick={() => setRulesOpen(true)}>
            预警规则配置
          </Button>
        </div>

        <div className="bg-white border border-gray-200 rounded flex flex-col">
          <TrackingTable
            rows={filteredRows}
            rules={safeRules}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            onOpenSku={(p) => {
              setSkuData(p);
              setSkuOpen(true);
            }}
            onSendSingle={(p) => {
              setNotifyMode('single');
              setNotifyPayload([p]);
              setNotifyOpen(true);
            }}
          />
        </div>
      </div>

      <RulesDialog
        open={rulesOpen}
        onOpenChange={setRulesOpen}
        value={safeRules}
        onSave={(next) => setRules(next)}
      />

      <NotifyDialog open={notifyOpen} onOpenChange={setNotifyOpen} mode={notifyMode} payload={notifyPayload} />

      <SkuDrawer
        open={skuOpen}
        onClose={() => setSkuOpen(false)}
        data={skuData}
      />
    </div>
  );
}
