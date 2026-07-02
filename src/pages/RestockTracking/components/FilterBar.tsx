import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export type FilterValue = {
  shop: string;
  keyword: string;
  startDate: string;
  endDate: string;
  warningStatus: '全部' | '正常' | '触发预警';
  warningTypes: string[];
};

const warningTypes = ['断货风险', '备货不足', '滞销风险', '库存积压', '到货延迟'];

export default function FilterBar(props: {
  shops: string[];
  value: FilterValue;
  onChange: (next: FilterValue) => void;
  onSearch: () => void;
  onReset: () => void;
}) {
  const { shops, value, onChange, onSearch, onReset } = props;

  return (
    <div className="bg-white p-4 border border-gray-200 rounded text-[13px] flex flex-col gap-4 flex-shrink-0">
      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">店铺</span>
          <select
            className="h-8 border border-gray-300 rounded px-2 outline-none w-[200px] text-gray-700 bg-white"
            value={value.shop}
            onChange={(e) => onChange({ ...value, shop: e.target.value })}
          >
            <option value="全部">全选</option>
            {shops.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">商品信息（SKU/名称）</span>
          <Input
            className="h-8 w-[260px] text-[13px]"
            placeholder="搜索 SKU 或名称..."
            value={value.keyword}
            onChange={(e) => onChange({ ...value, keyword: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">备货时间</span>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              className="h-8 w-[150px] text-[13px]"
              value={value.startDate}
              onChange={(e) => onChange({ ...value, startDate: e.target.value })}
            />
            <span className="text-gray-400">~</span>
            <Input
              type="date"
              className="h-8 w-[150px] text-[13px]"
              value={value.endDate}
              onChange={(e) => onChange({ ...value, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">预警状态</span>
          <select
            className="h-8 border border-gray-300 rounded px-2 outline-none w-[160px] text-gray-700 bg-white"
            value={value.warningStatus}
            onChange={(e) => onChange({ ...value, warningStatus: e.target.value as any })}
          >
            <option value="全部">全部</option>
            <option value="正常">正常</option>
            <option value="触发预警">触发预警</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[360px]">
          <span className="text-gray-700 font-medium">预警类型</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border border-gray-300 rounded px-3 py-2 bg-white">
            {warningTypes.map((t) => (
              <label key={t} className="flex items-center gap-2 text-gray-700 cursor-pointer select-none">
                <Checkbox
                  checked={value.warningTypes.includes(t)}
                  onCheckedChange={(checked) => {
                    const next = checked
                      ? [...value.warningTypes, t]
                      : value.warningTypes.filter((x) => x !== t);
                    onChange({ ...value, warningTypes: next });
                  }}
                />
                <span className="text-[12px]">{t}</span>
              </label>
            ))}
            <button
              type="button"
              className={cn('ml-auto text-[12px] text-blue-600 hover:underline', value.warningTypes.length === 0 && 'opacity-40')}
              onClick={() => onChange({ ...value, warningTypes: [] })}
              disabled={value.warningTypes.length === 0}
            >
              清空
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="h-8" onClick={onReset}>
            重置
          </Button>
          <Button className="h-8 bg-blue-600 hover:bg-blue-700" onClick={onSearch}>
            查询
          </Button>
        </div>
      </div>
    </div>
  );
}

