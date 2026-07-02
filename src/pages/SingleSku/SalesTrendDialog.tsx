import { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import * as XLSX from 'xlsx'
import { buildMonthlySalesTotals, buildSalesSeries } from './utils'

function formatDate(ts: number) {
  const d = new Date(ts)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${m}-${day}`
}

function startOfDay(ts: number) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function addDays(ts: number, days: number) {
  return ts + days * 86400000
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function sanitizeFilePart(v: string) {
  return v.replace(/[\\/:*?"<>|]+/g, '_').trim()
}

function toInputDate(ts: number) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fromInputDate(v: string) {
  if (!v) return null
  const d = new Date(`${v}T00:00:00`)
  const ts = d.getTime()
  return Number.isFinite(ts) ? ts : null
}

export default function SalesTrendDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  sku: string
  skuName?: string
}) {
  const { open, onOpenChange, sku, skuName } = props
  const now = Date.now()
  const defaultEnd = startOfDay(now)
  const defaultStart = addDays(defaultEnd, -30)
  const [startDate, setStartDate] = useState(toInputDate(defaultStart))
  const [endDate, setEndDate] = useState(toInputDate(defaultEnd))
  const [showDailySales, setShowDailySales] = useState(true)
  const [showStock, setShowStock] = useState(true)
  const [showYoyDailySales, setShowYoyDailySales] = useState(true)
  const [warehouse, setWarehouse] = useState('全部')
  const [platform, setPlatform] = useState('全部')
  const [datePanelOpen, setDatePanelOpen] = useState(false)
  const datePanelRef = useRef<HTMLDivElement | null>(null)

  const applyPreset = (days: 7 | 28 | 42) => {
    const end = startOfDay(Date.now())
    const start = addDays(end, -(days - 1))
    setEndDate(toInputDate(end))
    setStartDate(toInputDate(start))
    setDatePanelOpen(false)
  }

  const ensureRangeLimit = (nextStart: string, nextEnd: string) => {
    const s = fromInputDate(nextStart)
    const e = fromInputDate(nextEnd)
    if (s == null || e == null) return { start: nextStart, end: nextEnd }
    if (s > e) return { start: nextEnd, end: nextStart }
    const diffDays = Math.floor((e - s) / 86400000) + 1
    if (diffDays <= 42) return { start: nextStart, end: nextEnd }
    alert('自定义日期范围不能超过42天')
    const clampedStart = addDays(e, -(42 - 1))
    return { start: toInputDate(clampedStart), end: nextEnd }
  }

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!datePanelOpen) return
      const t = e.target as Node
      if (datePanelRef.current && !datePanelRef.current.contains(t)) setDatePanelOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [datePanelOpen, open])

  const range = useMemo(() => {
    const s = fromInputDate(startDate) ?? defaultStart
    const e = fromInputDate(endDate) ?? defaultEnd
    const days = Math.max(2, Math.min(42, Math.floor((e - s) / 86400000) + 1))
    return { s, e, days }
  }, [defaultEnd, defaultStart, endDate, startDate])

  const seriesDaily = useMemo(() => {
    const seedSku = `${sku}|${warehouse}|${platform}|daily`
    return buildSalesSeries({ sku: seedSku, days: range.days, baseline: 50 })
  }, [platform, range.days, sku, warehouse])

  const seriesStock = useMemo(() => {
    const seedSku = `${sku}|${warehouse}|${platform}|stock`
    return buildSalesSeries({ sku: seedSku, days: range.days, baseline: 80 })
  }, [platform, range.days, sku, warehouse])

  const seriesYoyDaily = useMemo(() => {
    const seedSku = `${sku}|${warehouse}|${platform}|daily_yoy`
    return buildSalesSeries({ sku: seedSku, days: range.days, baseline: 45 })
  }, [platform, range.days, sku, warehouse])

  const chart = useMemo(() => {
    const width = 1040
    const height = 360
    const padding = { left: 48, right: 16, top: 22, bottom: 42 }
    const w = width - padding.left - padding.right
    const h = height - padding.top - padding.bottom

    const values: number[] = []
    if (showDailySales) values.push(...seriesDaily)
    if (showStock) values.push(...seriesStock)
    if (showYoyDailySales) values.push(...seriesYoyDaily)
    if (values.length === 0) values.push(...seriesDaily)

    const max = Math.max(1, ...values)
    const min = 0

    const toPoints = (vals: number[]) =>
      vals.map((v, idx) => {
        const x = padding.left + (idx / (vals.length - 1)) * w
        const y = padding.top + (1 - (v - min) / (max - min)) * h
        return { x, y }
      })
    const toLine = (pts: Array<{ x: number; y: number }>) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

    const dailyPoints = toPoints(seriesDaily)
    const stockPoints = toPoints(seriesStock)
    const yoyPoints = toPoints(seriesYoyDaily)
    const dailyLineD = toLine(dailyPoints)
    const stockLineD = toLine(stockPoints)
    const yoyLineD = toLine(yoyPoints)

    const ticks = 6
    const yTicks = Array.from({ length: ticks + 1 }).map((_, i) => {
      const t = i / ticks
      const y = padding.top + t * h
      const v = (max - (max - min) * t).toFixed(0)
      return { y, v }
    })

    const xEvery = Math.max(1, Math.floor(range.days / 10))
    const xTicks = Array.from({ length: range.days })
      .map((_, i) => i)
      .filter((i) => i % xEvery === 0 || i === range.days - 1)
      .map((i) => {
        const x = padding.left + (i / (range.days - 1)) * w
        const label = formatDate(addDays(range.s, i))
        return { x, label }
      })

    return { width, height, dailyLineD, dailyPoints, stockLineD, stockPoints, yoyLineD, yoyPoints, yTicks, xTicks, padding }
  }, [range.days, range.s, seriesDaily, seriesStock, seriesYoyDaily, showDailySales, showStock, showYoyDailySales])

  const onExport = () => {
    const now = new Date()
    const thisYear = now.getFullYear()
    const lastYear = thisYear - 1
    const monthIdx = now.getMonth()
    const cutoff = startOfDay(Date.now())

    const lastYearTotals = buildMonthlySalesTotals({
      skuSeed: `${sku}|${warehouse}|${platform}|daily_${lastYear}`,
      year: lastYear,
      baseline: 50,
    })
    const thisYearTotals = buildMonthlySalesTotals({
      skuSeed: `${sku}|${warehouse}|${platform}|daily_${thisYear}`,
      year: thisYear,
      baseline: 50,
      cutoffTs: cutoff,
    })

    const rows = Array.from({ length: 12 }).map((_, i) => {
      const m = String(i + 1).padStart(2, '0')
      return {
        库存SKU: sku,
        库存SKU名称: skuName || '',
        月份: `${m}月`,
        去年销量: lastYearTotals[i] ?? '',
        今年销量: i <= monthIdx ? (thisYearTotals[i] ?? '') : '',
      }
    })

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '销量')

    const array = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
    const blob = new Blob([array], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const namePart = skuName ? `_${sanitizeFilePart(skuName)}` : ''
    downloadBlob(blob, `${sanitizeFilePart(sku)}${namePart}_销量对比_${lastYear}_vs_${thisYear}.xlsx`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] w-[1200px] p-0 gap-0" showCloseButton>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="text-[18px] text-gray-900 font-medium truncate">
            日销量/剩余库存趋势 ---【{sku}】
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-3 flex-wrap text-[13px] text-gray-700">
            <div className="relative" ref={datePanelRef}>
              <div className="flex items-center border border-gray-200 rounded bg-white px-3 py-2 gap-2">
                <span className="text-gray-500">日期</span>
                <Input
                  type="date"
                  className="h-8 w-[160px] text-[13px]"
                  value={startDate}
                  onFocus={() => setDatePanelOpen(true)}
                  onChange={(e) => {
                    const next = ensureRangeLimit(e.target.value, endDate)
                    setStartDate(next.start)
                    setEndDate(next.end)
                  }}
                />
                <span className="text-gray-400">至</span>
                <Input
                  type="date"
                  className="h-8 w-[160px] text-[13px]"
                  value={endDate}
                  onFocus={() => setDatePanelOpen(true)}
                  onChange={(e) => {
                    const next = ensureRangeLimit(startDate, e.target.value)
                    setStartDate(next.start)
                    setEndDate(next.end)
                  }}
                />
              </div>

              {datePanelOpen && (
                <div className="absolute left-0 top-[52px] z-20 bg-white border border-gray-200 rounded shadow-lg overflow-hidden">
                  <div className="flex">
                    <div className="w-[130px] border-r border-gray-200 bg-[#F8FAFC] py-2">
                      <button type="button" className="w-full px-3 py-1.5 text-left hover:text-blue-600" onClick={() => applyPreset(7)}>
                        最近7天
                      </button>
                      <button type="button" className="w-full px-3 py-1.5 text-left hover:text-blue-600" onClick={() => applyPreset(28)}>
                        最近28天
                      </button>
                      <button type="button" className="w-full px-3 py-1.5 text-left hover:text-blue-600" onClick={() => applyPreset(42)}>
                        最近42天
                      </button>
                    </div>
                    <div className="w-[720px] h-[260px] flex items-center justify-center text-[12px] text-gray-500">
                      日历面板占位（第一版）
                    </div>
                  </div>
                </div>
              )}
            </div>

            <select
              className="h-8 w-[220px] rounded border border-gray-200 bg-white px-3 text-[13px] text-gray-700"
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
            >
              <option value="全部">按仓库查看</option>
              <option value="东莞厚街仓">东莞厚街仓</option>
              <option value="西安仓">西安仓</option>
              <option value="义乌仓">义乌仓</option>
            </select>

            <select
              className="h-8 w-[220px] rounded border border-gray-200 bg-white px-3 text-[13px] text-gray-700"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="全部">按平台查看</option>
              <option value="亚马逊">亚马逊</option>
              <option value="独立站">独立站</option>
              <option value="沃尔玛">沃尔玛</option>
            </select>

            <button
              type="button"
              className="h-8 px-3 rounded border border-gray-200 bg-white text-[13px] text-gray-700 hover:bg-gray-50"
              onClick={onExport}
            >
              导出
            </button>

            <div className="ml-auto flex items-center gap-3">
              <div className="inline-flex items-center gap-2 text-[13px] text-gray-600">
                <button
                  type="button"
                  className={cn('inline-flex items-center gap-2', showDailySales ? 'text-blue-600' : 'text-gray-400')}
                  onClick={() => {
                    if (showDailySales && !showStock && !showYoyDailySales) return
                    setShowDailySales((p) => !p)
                  }}
                >
                  <span className={cn('w-3 h-3 rounded-full border-2', showDailySales ? 'border-blue-600 bg-white' : 'border-gray-300 bg-white')} />
                  日销量
                </button>
                <button
                  type="button"
                  className={cn('inline-flex items-center gap-2', showStock ? 'text-[#FB7185]' : 'text-gray-400')}
                  onClick={() => {
                    if (showStock && !showDailySales && !showYoyDailySales) return
                    setShowStock((p) => !p)
                  }}
                >
                  <span className={cn('w-3 h-3 rounded-full border-2', showStock ? 'border-[#FB7185] bg-white' : 'border-gray-300 bg-white')} />
                  剩余库存
                </button>
                <button
                  type="button"
                  className={cn('inline-flex items-center gap-2', showYoyDailySales ? 'text-[#22C55E]' : 'text-gray-400')}
                  onClick={() => {
                    if (showYoyDailySales && !showDailySales && !showStock) return
                    setShowYoyDailySales((p) => !p)
                  }}
                >
                  <span className={cn('w-3 h-3 rounded-full border-2', showYoyDailySales ? 'border-[#22C55E] bg-white' : 'border-gray-300 bg-white')} />
                  去年同期销量
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="border border-gray-200 rounded bg-white overflow-hidden">
            <svg width="100%" viewBox={`0 0 ${chart.width} ${chart.height}`} className="block">
              {chart.yTicks.map((t, idx) => (
                <g key={idx}>
                  <line x1={chart.padding.left} x2={chart.width - chart.padding.right} y1={t.y} y2={t.y} stroke="#E5E7EB" strokeWidth="1" />
                  <text x={chart.padding.left - 10} y={t.y + 4} textAnchor="end" fontSize="12" fill="#6B7280">
                    {t.v}
                  </text>
                </g>
              ))}

              {chart.xTicks.map((t, idx) => (
                <text key={idx} x={t.x} y={chart.height - 16} textAnchor="middle" fontSize="12" fill="#6B7280">
                  {t.label}
                </text>
              ))}

              {showDailySales && (
                <>
                  <path d={chart.dailyLineD} fill="none" stroke="#2563EB" strokeWidth="2" />
                  {chart.dailyPoints.map((p, idx) => (
                    <circle key={`d-${idx}`} cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                  ))}
                </>
              )}
              {showStock && (
                <>
                  <path d={chart.stockLineD} fill="none" stroke="#FB7185" strokeWidth="2" />
                  {chart.stockPoints.map((p, idx) => (
                    <circle key={`s-${idx}`} cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#FB7185" strokeWidth="2" />
                  ))}
                </>
              )}
              {showYoyDailySales && (
                <>
                  <path d={chart.yoyLineD} fill="none" stroke="#22C55E" strokeWidth="2" />
                  {chart.yoyPoints.map((p, idx) => (
                    <circle key={`y-${idx}`} cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#22C55E" strokeWidth="2" />
                  ))}
                </>
              )}
            </svg>
          </div>

          <div className="mt-3 bg-orange-50 border border-orange-100 rounded px-4 py-3 text-[12px] text-orange-700">
            点击图例可以切换趋势图展示。销量趋势图为示例数据（第一版），用于还原交互与样式。
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
