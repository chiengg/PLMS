import * as React from 'react'
import { ChevronsUpDown, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { buildSalesSeries, type SalesQuery } from '../salesMock'
import SimpleLineChart from './SimpleLineChart'

type Option = { value: string; label: string }

const platformOptions: Option[] = [
  { value: '', label: '全部平台' },
  { value: 'Amazon', label: 'Amazon' },
  { value: 'eBay', label: 'eBay' },
  { value: 'Shopee', label: 'Shopee' },
  { value: 'Temu', label: 'Temu' },
]

const warehouseOptions: Option[] = [
  { value: '', label: '全部仓库' },
  { value: 'FBA-US-东部', label: 'FBA-US-东部' },
  { value: 'FBA-US-西部', label: 'FBA-US-西部' },
  { value: 'FBA-DE-法兰克福', label: 'FBA-DE-法兰克福' },
  { value: 'FBA-UK-伦敦', label: 'FBA-UK-伦敦' },
  { value: 'FBA-JP-东京仓', label: 'FBA-JP-东京仓' },
]

function formatDateUTC(d: Date) {
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function defaultRange() {
  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 1)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 29)
  return { startDate: formatDateUTC(start), endDate: formatDateUTC(end) }
}

function ComboBox(props: {
  value: string
  onValueChange: (value: string) => void
  options: Option[]
  placeholder: string
  triggerClassName?: string
  inputPlaceholder?: string
}) {
  const { value, onValueChange, options, placeholder, triggerClassName, inputPlaceholder } = props
  const [open, setOpen] = React.useState(false)

  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          'inline-flex h-8 items-center justify-between whitespace-nowrap rounded border border-input bg-white px-2.5 py-1 text-[13px] outline-none hover:bg-muted',
          triggerClassName
        )}
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0" align="start">
        <Command>
          <CommandInput placeholder={inputPlaceholder ?? '搜索...'} className="h-8 text-[13px]" />
          <CommandList>
            <CommandEmpty className="py-2 text-center text-[13px]">未找到选项</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value || '__all__'}
                  value={o.label}
                  onSelect={() => {
                    onValueChange(o.value)
                    setOpen(false)
                  }}
                  className="text-[13px]"
                >
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function SalesTrendDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialSku: string
  skuOptions: string[]
}) {
  const { open, onOpenChange, initialSku, skuOptions } = props
  const range = React.useMemo(() => defaultRange(), [])

  const [skuText, setSkuText] = React.useState(initialSku)
  const [sku, setSku] = React.useState(initialSku)
  const [warehouse, setWarehouse] = React.useState('')
  const [platform, setPlatform] = React.useState('')
  const [startDate, setStartDate] = React.useState(range.startDate)
  const [endDate, setEndDate] = React.useState(range.endDate)

  const [openSkuPicker, setOpenSkuPicker] = React.useState(false)

  const [data, setData] = React.useState(() =>
    buildSalesSeries({
      sku: initialSku,
      startDate: range.startDate,
      endDate: range.endDate,
      warehouse: '',
      platform: '',
    })
  )

  React.useEffect(() => {
    if (!open) return

    const nextSku = initialSku || skuOptions[0] || ''
    setSkuText(nextSku)
    setSku(nextSku)
    setWarehouse('')
    setPlatform('')
    setStartDate(range.startDate)
    setEndDate(range.endDate)
    setOpenSkuPicker(false)

    setData(
      buildSalesSeries({
        sku: nextSku,
        startDate: range.startDate,
        endDate: range.endDate,
        warehouse: '',
        platform: '',
      })
    )
  }, [initialSku, open, range.endDate, range.startDate, skuOptions])

  const query: SalesQuery = { sku, startDate, endDate, warehouse, platform }

  const runQuery = () => {
    if (!query.sku) return
    setData(buildSalesSeries(query))
  }

  const reset = () => {
    const nextSku = initialSku || skuOptions[0] || ''
    setSkuText(nextSku)
    setSku(nextSku)
    setWarehouse('')
    setPlatform('')
    setStartDate(range.startDate)
    setEndDate(range.endDate)
    setOpenSkuPicker(false)
  }

  const applySkuText = () => {
    const v = skuText.trim()
    if (!v) return

    const norm = v.toLowerCase()
    const found =
      skuOptions.find((s) => s.toLowerCase() === norm) ??
      skuOptions.find((s) => s.toLowerCase().includes(norm))

    const nextSku = found ?? v
    setSku(nextSku)
    setSkuText(nextSku)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[980px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-normal">日销量趋势 —— {sku || '未选择SKU'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative w-[220px]">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <Input
                value={skuText}
                onChange={(e) => setSkuText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applySkuText()
                }}
                className="h-8 pl-8 text-[13px]"
                placeholder="输入SKU回车"
              />
            </div>

            <Popover open={openSkuPicker} onOpenChange={setOpenSkuPicker}>
              <PopoverTrigger className="inline-flex h-8 w-[180px] items-center justify-between whitespace-nowrap rounded border border-input bg-white px-2.5 py-1 text-[13px] outline-none hover:bg-muted">
                <span className="truncate">{sku || '选择SKU...'}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-[360px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="搜索SKU..." className="h-8 text-[13px]" />
                  <CommandList>
                    <CommandEmpty className="py-2 text-center text-[13px]">未找到SKU</CommandEmpty>
                    <CommandGroup>
                      {skuOptions.map((s) => (
                        <CommandItem
                          key={s}
                          value={s}
                          onSelect={() => {
                            setSku(s)
                            setSkuText(s)
                            setOpenSkuPicker(false)
                          }}
                          className="text-[13px]"
                        >
                          <span className="truncate">{s}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 w-[150px] text-[13px]"
            />
            <span className="text-[13px] text-gray-500">至</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 w-[150px] text-[13px]"
            />
          </div>

          <ComboBox
            value={warehouse}
            onValueChange={setWarehouse}
            options={warehouseOptions}
            placeholder="选择仓库..."
            triggerClassName="w-[160px]"
            inputPlaceholder="搜索仓库..."
          />
          <ComboBox
            value={platform}
            onValueChange={setPlatform}
            options={platformOptions}
            placeholder="选择平台..."
            triggerClassName="w-[160px]"
            inputPlaceholder="搜索平台..."
          />

          <div className="ml-auto flex items-center gap-2">
            <Button className="h-8 bg-blue-600 px-3 text-[13px] hover:bg-blue-700" onClick={runQuery} disabled={!sku}>
              查询
            </Button>
            <Button variant="outline" className="h-8 px-3 text-[13px]" onClick={reset}>
              重置
            </Button>
          </div>
        </div>

        <div className={cn('mt-3 rounded border border-gray-200 bg-white p-2')}>
          <SimpleLineChart points={data.points.map((p) => ({ date: p.date, value: p.sales }))} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

