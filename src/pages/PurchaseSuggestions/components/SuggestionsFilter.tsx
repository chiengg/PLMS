import { FeatureMarker } from '@/components/FeatureMarker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import type { SuggestionsFilters } from '../types';
import { useState } from 'react';

const warehouses = [
  { value: 'FBA-US-东部', label: 'FBA-US-东部' },
  { value: 'FBA-US-西部', label: 'FBA-US-西部' },
  { value: 'FBA-DE-法兰克福', label: 'FBA-DE-法兰克福' },
  { value: 'FBA-UK-伦敦', label: 'FBA-UK-伦敦' },
  { value: 'FBA-JP-东京仓', label: 'FBA-JP-东京仓' },
];

const buyers = ['张伟', '李娜', '王强', '刘美希', '陈刚'];

const defaultFilters: SuggestionsFilters = {
  keyword: '',
  warehouses: [],
  supplierName: '',
  buyer: '',
};

export default function SuggestionsFilter(props: {
  value: SuggestionsFilters;
  onChange: (next: SuggestionsFilters) => void;
}) {
  const { value, onChange } = props;

  const [openWarehouse, setOpenWarehouse] = useState(false);
  const [openBuyer, setOpenBuyer] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-3 rounded shadow-sm border border-gray-200">
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="库存SKU/商品名称/采购员" 
          className="pl-8 h-8 text-[13px] border-gray-300 focus-visible:ring-blue-500"
          value={value.keyword}
          onChange={(e) => onChange({ ...value, keyword: e.target.value })}
        />
      </div>

      {/* 模糊查询+下拉多选 仓库 */}
      <Popover open={openWarehouse} onOpenChange={setOpenWarehouse}>
        <PopoverTrigger className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-48 h-8 px-3 text-[13px] border-gray-300 justify-between">
          {value.warehouses.length > 0 ? `已选 ${value.warehouses.length} 个仓库` : '全部仓库'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0" align="start">
          <Command>
            <CommandInput placeholder="搜索仓库..." className="h-8 text-[13px]" />
            <CommandList>
              <CommandEmpty className="py-2 text-center text-[13px]">未找到仓库</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onChange({ ...value, warehouses: [] });
                  }}
                  className="text-[13px]"
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value.warehouses.length === 0 ? 'opacity-100' : 'opacity-0')}
                  />
                  全部
                </CommandItem>
                {warehouses.map((wh) => (
                  <CommandItem
                    key={wh.value}
                    value={wh.value}
                    onSelect={(currentValue) => {
                      void currentValue;
                      const next = value.warehouses.includes(wh.value)
                        ? value.warehouses.filter((v) => v !== wh.value)
                        : [...value.warehouses, wh.value];
                      onChange({ ...value, warehouses: next });
                    }}
                    className="text-[13px]"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.warehouses.includes(wh.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {wh.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* 模糊查询+下拉单选 采购员 */}
      <Popover open={openBuyer} onOpenChange={setOpenBuyer}>
        <PopoverTrigger className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-40 h-8 px-3 text-[13px] border-gray-300 justify-between">
          {value.buyer ? value.buyer : '全部采购员'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-40 p-0" align="start">
          <Command>
            <CommandInput placeholder="搜索采购员..." className="h-8 text-[13px]" />
            <CommandList>
              <CommandEmpty className="py-2 text-center text-[13px]">未找到采购员</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onChange({ ...value, buyer: '' });
                    setOpenBuyer(false);
                  }}
                  className="text-[13px]"
                >
                  <Check className={cn('mr-2 h-4 w-4', value.buyer === '' ? 'opacity-100' : 'opacity-0')} />
                  全部
                </CommandItem>
                {buyers.map((b) => (
                  <CommandItem
                    key={b}
                    value={b}
                    onSelect={(currentValue) => {
                      void currentValue;
                      onChange({ ...value, buyer: b });
                      setOpenBuyer(false);
                    }}
                    className="text-[13px]"
                  >
                    <Check className={cn('mr-2 h-4 w-4', value.buyer === b ? 'opacity-100' : 'opacity-0')} />
                    {b}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <FeatureMarker title="重置" description="交互说明：点击执行重置操作。">
        <Button
          variant="ghost"
          className="h-8 px-3 text-[13px] text-gray-500 hover:text-gray-700"
          onClick={() => onChange(defaultFilters)}
        >
          重置
        </Button>
      </FeatureMarker>
    </div>
  );
}
