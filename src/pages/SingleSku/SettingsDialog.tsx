import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GripVertical } from 'lucide-react'

export type ColumnItem = { key: string; label: string; defaultWidth?: number; locked?: boolean }

export type ColumnConfig = {
  order: string[]
  visibility: Record<string, boolean>
  widths: Record<string, number>
}

export type ActivityUnit = '天' | '周' | '月'

export type ActivityRule =
  | {
      type: '爆款' | '旺款' | '平款'
      timeValue: number
      timeUnit: ActivityUnit
      salesMin: number
      salesMax: number
      syncAlertDays: boolean
    }
  | {
      type: '滞销款'
      timeValue: number
      timeUnit: ActivityUnit
      salesMin: number
      salesMax: number
      monthStockMin: number
      monthStockMax: number
      syncAlertDays: boolean
    }
  | {
      type: '新款'
      createdDaysMin: number
      createdDaysMax: number
      syncAlertDays: boolean
    }

export type ActivitySettings = {
  enabled: boolean
  rules: ActivityRule[]
}

function clampNumber(v: string, fallback: number) {
  const n = Number(v)
  if (!Number.isFinite(n)) return fallback
  return n
}

function Toggle(props: { value: boolean; onChange: (v: boolean) => void }) {
  const { value, onChange } = props
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
      onClick={() => onChange(!value)}
      aria-pressed={value}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </button>
  )
}

function SwitchSmall(props: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  const { value, onChange, disabled } = props
  return (
    <button
      type="button"
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => {
        if (disabled) return
        onChange(!value)
      }}
      aria-pressed={value}
      disabled={disabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-4' : 'translate-x-1'}`}
      />
    </button>
  )
}

function WidthSlider(props: { value: number; onChange: (v: number) => void; disabled?: boolean }) {
  const { value, onChange, disabled } = props
  return (
    <input
      type="range"
      min={80}
      max={320}
      step={10}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(clampNumber(e.target.value, 120))}
      className={`w-full h-2 accent-blue-600 ${disabled ? 'opacity-40' : ''}`}
    />
  )
}

export default function SettingsDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lockedColumns: ReadonlyArray<ColumnItem>
  columns: ReadonlyArray<ColumnItem>
  columnConfig: ColumnConfig
  defaultColumnConfig: ColumnConfig
  onClearColumns: () => void
  activityValue: ActivitySettings
  defaultActivityValue: ActivitySettings
  onConfirm: (next: { columns: ColumnConfig; activity: ActivitySettings }) => void
}) {
  const {
    open,
    onOpenChange,
    lockedColumns,
    columns,
    columnConfig,
    defaultColumnConfig,
    onClearColumns,
    activityValue,
    defaultActivityValue,
    onConfirm,
  } = props

  const [tab, setTab] = React.useState<'columns' | 'activity'>('columns')
  const [columnsDraft, setColumnsDraft] = React.useState<ColumnConfig>(columnConfig)
  const [activityDraft, setActivityDraft] = React.useState<ActivitySettings>(activityValue)
  const [dragKey, setDragKey] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    setTab('columns')
    setColumnsDraft(columnConfig)
    setActivityDraft(activityValue)
    setDragKey(null)
  }, [activityValue, columnConfig, open])

  const allKeys = React.useMemo(() => columns.map((c) => c.key), [columns])

  const orderedKeys = React.useMemo(() => {
    const base = Array.isArray(columnsDraft.order) ? columnsDraft.order : []
    const unique: string[] = []
    base.forEach((k) => {
      if (allKeys.includes(k) && !unique.includes(k)) unique.push(k)
    })
    allKeys.forEach((k) => {
      if (!unique.includes(k)) unique.push(k)
    })
    return unique
  }, [allKeys, columnsDraft.order])

  const onDragStart = (key: string) => setDragKey(key)
  const onDropTo = (targetKey: string) => {
    if (!dragKey || dragKey === targetKey) return
    setColumnsDraft((p) => {
      const next = orderedKeys.filter((k) => k !== dragKey)
      const idx = next.indexOf(targetKey)
      next.splice(Math.max(0, idx), 0, dragKey)
      return { ...p, order: next }
    })
    setDragKey(null)
  }

  const updateRule = (idx: number, next: ActivityRule) => {
    setActivityDraft((p) => ({ ...p, rules: p.rules.map((r, i) => (i === idx ? next : r)) }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[980px] w-[980px] p-0 gap-0" showCloseButton>
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle>设置</DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-4">
          <Tabs className="flex flex-col gap-0" value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="w-fit justify-start bg-gray-100 [&_[data-slot=tabs-trigger][data-active]]:text-blue-600">
              <TabsTrigger value="columns" className="px-3">
                列设置
              </TabsTrigger>
              <TabsTrigger value="activity" className="px-3">
                活跃度设置
              </TabsTrigger>
            </TabsList>

            <TabsContent value="columns" className="pt-4">
              <div className="flex items-center justify-between pb-3">
                <div className="text-[14px] font-medium text-gray-800">表格设置</div>
                <Button
                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    onClearColumns()
                    setColumnsDraft(defaultColumnConfig)
                  }}
                >
                  清除设置
                </Button>
              </div>

              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="grid grid-cols-[60px_1fr_90px_220px] items-center bg-[#F8FAFC] text-[13px] text-gray-600 border-b border-gray-200">
                  <div className="px-4 py-2">拖拽</div>
                  <div className="px-4 py-2">列名</div>
                  <div className="px-4 py-2 text-center">显示</div>
                  <div className="px-4 py-2">列宽度</div>
                </div>

                <div className="max-h-[460px] overflow-auto">
                  {lockedColumns.map((c) => (
                    <div key={c.key} className="grid grid-cols-[60px_1fr_90px_220px] items-center border-b border-gray-200 last:border-b-0">
                      <div className="px-4 py-2 flex items-center justify-center text-gray-300">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="px-4 py-2 text-[13px] text-gray-500">{c.label}</div>
                      <div className="px-4 py-2 flex items-center justify-center">
                        <SwitchSmall value onChange={() => {}} disabled />
                      </div>
                      <div className="px-4 py-2">
                        <WidthSlider value={120} onChange={() => {}} disabled />
                      </div>
                    </div>
                  ))}

                  {orderedKeys.map((key) => {
                    const col = columns.find((c) => c.key === key)
                    if (!col) return null
                    const visible = columnsDraft.visibility[key] !== false
                    const width = columnsDraft.widths[key] ?? col.defaultWidth ?? 120
                    return (
                      <div
                        key={key}
                        className="grid grid-cols-[60px_1fr_90px_220px] items-center border-b border-gray-200 last:border-b-0 bg-white"
                        draggable
                        onDragStart={() => onDragStart(key)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDropTo(key)}
                      >
                        <div className="px-4 py-2 flex items-center justify-center text-gray-500 cursor-move">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="px-4 py-2 text-[13px] text-gray-800">{col.label}</div>
                        <div className="px-4 py-2 flex items-center justify-center">
                          <SwitchSmall
                            value={visible}
                            onChange={(v) => setColumnsDraft((p) => ({ ...p, visibility: { ...p.visibility, [key]: v } }))}
                          />
                        </div>
                        <div className="px-4 py-2">
                          <WidthSlider
                            value={width}
                            onChange={(v) => setColumnsDraft((p) => ({ ...p, widths: { ...p.widths, [key]: v } }))}
                            disabled={!visible}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="pt-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-[13px] text-gray-700">开启计算活跃度</div>
                <Toggle value={activityDraft.enabled} onChange={(v) => setActivityDraft((p) => ({ ...p, enabled: v }))} />
                <Button variant="outline" className="h-8 px-3 text-[13px]" onClick={() => setActivityDraft(defaultActivityValue)}>
                  恢复默认
                </Button>
                <div className="text-[12px] text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded">
                  增加定义后，请在第二天查看修改的库存sku活跃度
                </div>
              </div>

              <div className="mt-3 border border-gray-200 rounded overflow-hidden">
                <div className="grid grid-cols-[110px_1fr] items-center bg-[#F8FAFC] text-[13px] text-gray-600 border-b border-gray-200">
                  <div className="px-4 py-2">活跃度</div>
                  <div className="px-4 py-2">规则</div>
                </div>

                {activityDraft.rules.map((rule, idx) => {
                  const baseRow = 'grid grid-cols-[110px_1fr] items-start border-b border-gray-200 last:border-b-0 text-[13px]'
                  const leftCell = 'px-4 py-2 text-gray-700'
                  const midCell = 'px-4 py-2'

                  if (rule.type === '新款') {
                    return (
                      <div key={idx} className={baseRow}>
                        <div className={leftCell}>{rule.type}</div>
                        <div className={midCell}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-gray-500">库存SKU创建时间区间从</span>
                            <InputNumber
                              value={rule.createdDaysMin}
                              onChange={(v) => updateRule(idx, { ...rule, createdDaysMin: v })}
                            />
                            <span className="text-gray-500">天到</span>
                            <InputNumber
                              value={rule.createdDaysMax}
                              onChange={(v) => updateRule(idx, { ...rule, createdDaysMax: v })}
                            />
                            <span className="text-gray-500">天定义为</span>
                            <span className="text-blue-600">{rule.type}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  if (rule.type === '滞销款') {
                    return (
                      <div key={idx} className={baseRow}>
                        <div className={leftCell}>{rule.type}</div>
                        <div className={midCell}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-gray-500">最近</span>
                            <InputNumber value={rule.timeValue} onChange={(v) => updateRule(idx, { ...rule, timeValue: v })} />
                            <UnitSelect value={rule.timeUnit} onChange={(u) => updateRule(idx, { ...rule, timeUnit: u })} />
                            <span className="text-gray-500">销量区间从</span>
                            <InputNumber value={rule.salesMin} onChange={(v) => updateRule(idx, { ...rule, salesMin: v })} />
                            <span className="text-gray-500">个到</span>
                            <InputNumber value={rule.salesMax} onChange={(v) => updateRule(idx, { ...rule, salesMax: v })} />
                            <span className="text-gray-500">个</span>

                            <span className="text-gray-500 ml-2">个月库存数量在</span>
                            <InputNumber value={rule.monthStockMin} onChange={(v) => updateRule(idx, { ...rule, monthStockMin: v })} />
                            <span className="text-gray-500">个到</span>
                            <InputNumber value={rule.monthStockMax} onChange={(v) => updateRule(idx, { ...rule, monthStockMax: v })} />
                            <span className="text-gray-500">个定义为</span>
                            <span className="text-blue-600">{rule.type}</span>
                          </div>
                          <div className="mt-1 text-[12px] text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded inline-block">
                            SKU活跃度由【爆/旺/平款】变为滞销款的SKU警戒天数才会触发更新
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={idx} className={baseRow}>
                      <div className={leftCell}>{rule.type}</div>
                      <div className={midCell}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-gray-500">最近</span>
                          <InputNumber value={rule.timeValue} onChange={(v) => updateRule(idx, { ...rule, timeValue: v })} />
                          <UnitSelect value={rule.timeUnit} onChange={(u) => updateRule(idx, { ...rule, timeUnit: u })} />
                          <span className="text-gray-500">销量区间从</span>
                          <InputNumber value={rule.salesMin} onChange={(v) => updateRule(idx, { ...rule, salesMin: v })} />
                          <span className="text-gray-500">个到</span>
                          <InputNumber value={rule.salesMax} onChange={(v) => updateRule(idx, { ...rule, salesMax: v })} />
                          <span className="text-gray-500">个定义为</span>
                          <span className="text-blue-600">{rule.type}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-200 mt-4">
          <Button variant="outline" className="h-8" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="h-8 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              onConfirm({ columns: columnsDraft, activity: activityDraft })
              onOpenChange(false)
            }}
          >
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InputNumber(props: { value: number; onChange: (v: number) => void }) {
  const { value, onChange } = props
  return (
    <input
      type="number"
      className="h-8 w-[70px] rounded border border-gray-200 bg-white px-2 text-[13px] text-gray-700"
      value={String(value)}
      onChange={(e) => onChange(clampNumber(e.target.value, 0))}
    />
  )
}

function UnitSelect(props: { value: ActivityUnit; onChange: (v: ActivityUnit) => void }) {
  const { value, onChange } = props
  return (
    <select
      className="h-8 w-[76px] rounded border border-gray-200 bg-white px-2 text-[13px] text-gray-700"
      value={value}
      onChange={(e) => onChange(e.target.value as ActivityUnit)}
    >
      <option value="天">天</option>
      <option value="周">周</option>
      <option value="月">月</option>
    </select>
  )
}
