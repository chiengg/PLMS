import { useMemo, useState } from 'react';
import CostReductionFilter, { type CostReductionFilterValues } from './components/CostReductionFilter';
import CostReductionTable from './components/CostReductionTable';
import { purchaseRecords, purchaserOptions, supplierOptions, type MonthStr } from './mockData';
import { buildCostReductionRows, exportRowsToCsv } from './utils';

function getDefaultMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CostReductionPerformance() {
  const defaultMonth = getDefaultMonth();
  const [draft, setDraft] = useState<CostReductionFilterValues>({
    month: defaultMonth,
    purchaser: '',
    supplier: '',
    keyword: ''
  });
  const [applied, setApplied] = useState<CostReductionFilterValues>(draft);

  const rows = useMemo(() => {
    if (!applied.month) return [];
    return buildCostReductionRows(purchaseRecords, {
      month: applied.month as MonthStr,
      purchaser: applied.purchaser,
      supplier: applied.supplier,
      keyword: applied.keyword
    });
  }, [applied.keyword, applied.month, applied.purchaser, applied.supplier]);

  return (
    <div className="flex flex-col h-full">
      <div className="text-gray-800 text-[14px] font-medium mb-4">降本绩效管理</div>
      <div className="flex flex-col flex-1 min-h-0 gap-3">
        <CostReductionFilter
          values={draft}
          onChange={setDraft}
          onSearch={() => setApplied(draft)}
          onReset={() => {
            const next: CostReductionFilterValues = {
              month: defaultMonth,
              purchaser: '',
              supplier: '',
              keyword: ''
            };
            setDraft(next);
            setApplied(next);
          }}
          onExport={() => {
            const { filename, csv } = exportRowsToCsv(rows, applied.month);
            downloadCsv(filename, csv);
          }}
          purchaserOptions={purchaserOptions}
          supplierOptions={supplierOptions}
        />

        <CostReductionTable rows={rows} />

        <div className="text-[13px] text-gray-600 flex items-center justify-between">
          <div>共 {rows.length} 条降本记录</div>
        </div>
      </div>
    </div>
  );
}
