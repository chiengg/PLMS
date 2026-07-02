import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { RulesConfig } from '../types';

function parseNumber(v: string) {
  const t = v.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

function pill(label: string, cls: string) {
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium', cls)}>
      <span className={cn('w-2 h-2 rounded-full', cls.includes('red') ? 'bg-red-500' : cls.includes('amber') ? 'bg-amber-500' : cls.includes('gray') ? 'bg-gray-400' : cls.includes('purple') ? 'bg-purple-500' : 'bg-orange-500')} />
      {label}
    </span>
  );
}

export default function RulesDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: RulesConfig;
  onSave: (next: RulesConfig) => void;
}) {
  const { open, onOpenChange, value, onSave } = props;
  const [draft, setDraft] = React.useState<RulesConfig>(value);

  React.useEffect(() => {
    if (!open) return;
    setDraft(value);
  }, [open, value]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>预警规则配置</DialogTitle>
        </DialogHeader>

        <div className="py-2 text-[13px]">
          <div className="text-gray-600">
            自定义各项风险指标的触发阈值，修改后将在下次系统跑批时生效。
          </div>

          <div className="mt-4 space-y-4">
            <div className="pb-4 border-b border-gray-100">
              {pill('断货极高风险', 'bg-red-50 text-red-600')}
              <div className="mt-3 flex items-center gap-2 text-gray-700">
                <span>可用库存量</span>
                <span className="text-gray-400">&lt;</span>
                <span>预测日销量</span>
                <span className="text-gray-400">×</span>
                <Input
                  type="number"
                  className="h-8 w-[86px] text-center"
                  value={String(draft.outOfStockDaysThreshold)}
                  onChange={(e) => {
                    const n = parseNumber(e.target.value);
                    setDraft((p) => ({ ...p, outOfStockDaysThreshold: n ?? p.outOfStockDaysThreshold }));
                  }}
                />
                <span>天</span>
              </div>
            </div>

            <div className="pb-4 border-b border-gray-100">
              {pill('备货不足风险', 'bg-amber-50 text-amber-700')}
              <div className="mt-3 flex items-center gap-2 text-gray-700">
                <span>当前库存可售天数</span>
                <span className="text-gray-400">&lt;</span>
                <span>采购天数</span>
                <span className="text-gray-400">+</span>
                <Input
                  type="number"
                  className="h-8 w-[86px] text-center"
                  value={String(draft.understockSafetyDays)}
                  onChange={(e) => {
                    const n = parseNumber(e.target.value);
                    setDraft((p) => ({ ...p, understockSafetyDays: n ?? p.understockSafetyDays }));
                  }}
                />
                <span>天安全库存</span>
              </div>
            </div>

            <div className="pb-4 border-b border-gray-100">
              {pill('滞销/死库风险', 'bg-gray-50 text-gray-700')}
              <div className="mt-3 flex items-center gap-2 text-gray-700">
                <span>预测日销量</span>
                <span className="text-gray-400">&lt;</span>
                <Input
                  type="number"
                  className="h-8 w-[86px] text-center"
                  value={String(draft.slowSalesDailyThreshold)}
                  onChange={(e) => {
                    const n = parseNumber(e.target.value);
                    setDraft((p) => ({ ...p, slowSalesDailyThreshold: n ?? p.slowSalesDailyThreshold }));
                  }}
                />
                <span>件</span>
              </div>
            </div>

            <div className="pb-4 border-b border-gray-100">
              {pill('库存积压风险', 'bg-purple-50 text-purple-700')}
              <div className="mt-3 flex items-center gap-2 text-gray-700">
                <span>当前库存可售天数</span>
                <span className="text-gray-400">&gt;</span>
                <Input
                  type="number"
                  className="h-8 w-[86px] text-center"
                  value={String(draft.overstockDaysThreshold)}
                  onChange={(e) => {
                    const n = parseNumber(e.target.value);
                    setDraft((p) => ({ ...p, overstockDaysThreshold: n ?? p.overstockDaysThreshold }));
                  }}
                />
                <span>天</span>
              </div>
            </div>

            <div>
              {pill('到货延迟风险', 'bg-orange-50 text-orange-700')}
              <div className="mt-3 flex items-center gap-2 text-gray-700">
                <span>备货超时</span>
                <span className="text-gray-400">&gt;</span>
                <span>采购天数</span>
                <span className="text-gray-400">+</span>
                <Input
                  type="number"
                  className="h-8 w-[86px] text-center"
                  value={String(draft.arrivalDelayGraceDays)}
                  onChange={(e) => {
                    const n = parseNumber(e.target.value);
                    setDraft((p) => ({ ...p, arrivalDelayGraceDays: n ?? p.arrivalDelayGraceDays }));
                  }}
                />
                <span>天宽限期，且在途量 &gt; 0</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              onSave(draft);
              onOpenChange(false);
            }}
          >
            保存配置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
