import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { ChevronDown, Settings } from 'lucide-react'
import BatchEditDrawer from './BatchEditDrawer'
import type { ActivitySettings } from './SettingsDialog'
import SettingsDialog from './SettingsDialog'
import SalesTrendDialog from './SalesTrendDialog'
import StatusEditDialog from './StatusEditDialog'
import {
  activityOptions,
  brandOptions,
  customCategoryOptions,
  mainCategoryOptions,
  mockSingleSkus,
  productCategoryOptions,
  SINGLE_SKU_KEY,
  statusOptions,
} from './mockData'
import type { SingleSkuFilters, SingleSkuRow } from './types'
import { applyStatusPatch, filterRows, formatDateTime } from './utils'

const defaultFilters: SingleSkuFilters = {
  patternCode: '',
  productName: '',
  sku: '',
  mainCategory: '全部',
  brand: '全部',
  productCategory: '全部',
  customCategory: '全部',
  purchaser: '全部',
  status: '全部',
  activity: '全部',
}

const LOCKED_COLUMNS = [
  { key: 'checkbox', label: '勾选' },
  { key: 'patternCode', label: '版型编码' },
  { key: 'imageUrl', label: '产品图片' },
  { key: 'productName', label: '产品名称' },
  { key: 'sku', label: '库存SKU编码' },
  { key: 'action', label: '操作' },
]

const OPTIONAL_COLUMNS = [
  { key: 'status', label: '状态', defaultWidth: 100 },
  { key: 'inventoryTotal', label: '库存总数', defaultWidth: 110 },
  { key: 'inventoryAvailable', label: '可用库存数', defaultWidth: 110 },
  { key: 'forecastDailySales', label: '预测日销量', defaultWidth: 140 },
  { key: 'sales72842', label: '7/28/42销量', defaultWidth: 140 },
  { key: 'purchaseInTransitQty', label: '采购在途量', defaultWidth: 110 },
  { key: 'warehouseUnshippedQty', label: '未发货量', defaultWidth: 120 },
  { key: 'dropShipBasePrice', label: '代发基价', defaultWidth: 110 },
  { key: 'mainCategory', label: '主分类', defaultWidth: 110 },
  { key: 'productCategory', label: '商品类目', defaultWidth: 140 },
  { key: 'customCategory', label: '自定义分类', defaultWidth: 140 },
  { key: 'declareEnName', label: '申报英文名称', defaultWidth: 160 },
  { key: 'declareCnName', label: '申报中文名称', defaultWidth: 160 },
  { key: 'brand', label: '品牌', defaultWidth: 120 },
  { key: 'selector', label: '选品员', defaultWidth: 120 },
  { key: 'developer', label: '开发员', defaultWidth: 120 },
  { key: 'purchaser', label: '采购员', defaultWidth: 120 },
  { key: 'createdBy', label: '创建人', defaultWidth: 90 },
  { key: 'updatedAt', label: '最后更新时间', defaultWidth: 160 },
  { key: 'createdAt', label: '创建时间', defaultWidth: 160 },
  { key: 'updatedBy', label: '最后更新人', defaultWidth: 90 },
  { key: 'remark', label: '备注', defaultWidth: 220 },
] as const

type ColumnConfig = {
  order: string[]
  visibility: Record<string, boolean>
  widths: Record<string, number>
}

const DEFAULT_COLUMN_CONFIG: ColumnConfig = {
  order: OPTIONAL_COLUMNS.map((c) => c.key),
  visibility: OPTIONAL_COLUMNS.reduce((acc, c) => {
    acc[c.key] = true
    return acc
  }, {} as Record<string, boolean>),
  widths: OPTIONAL_COLUMNS.reduce((acc, c) => {
    acc[c.key] = c.defaultWidth
    return acc
  }, {} as Record<string, number>),
}

const DEFAULT_ACTIVITY_SETTINGS: ActivitySettings = {
  enabled: true,
  rules: [
    { type: '爆款', timeValue: 3, timeUnit: '天', salesMin: 10, salesMax: 500, syncAlertDays: false },
    { type: '旺款', timeValue: 3, timeUnit: '天', salesMin: 1, salesMax: 10, syncAlertDays: false },
    { type: '平款', timeValue: 1, timeUnit: '周', salesMin: 10, salesMax: 50, syncAlertDays: false },
    { type: '滞销款', timeValue: 1, timeUnit: '周', salesMin: 0, salesMax: 5, monthStockMin: 10, monthStockMax: 200, syncAlertDays: false },
    { type: '新款', createdDaysMin: 1, createdDaysMax: 10, syncAlertDays: false },
  ],
}

export default function SingleSku() {
  const [rows, setRows] = useLocalStorage<SingleSkuRow[]>(SINGLE_SKU_KEY, mockSingleSkus)
  const safeRows = Array.isArray(rows) ? rows : []
  const columnKey = 'single_sku_columns_v1'
  const [rawColumnConfig, setRawColumnConfig] = useLocalStorage<any>(columnKey, DEFAULT_COLUMN_CONFIG)
  const [activitySettings, setActivitySettings] = useLocalStorage<ActivitySettings>('single_sku_activity_settings_v1', DEFAULT_ACTIVITY_SETTINGS)

  const [draft, setDraft] = useState<SingleSkuFilters>(defaultFilters)
  const [applied, setApplied] = useState<SingleSkuFilters>(defaultFilters)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [batchEditOpen, setBatchEditOpen] = useState(false)
  const [salesDialogOpen, setSalesDialogOpen] = useState(false)
  const [salesDialogSku, setSalesDialogSku] = useState('')
  const [salesDialogSkuName, setSalesDialogSkuName] = useState('')
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  const columnConfig: ColumnConfig = useMemo(() => {
    const v = rawColumnConfig as any
    if (v && Array.isArray(v.order) && v.visibility && v.widths) return v as ColumnConfig
    const vis: Record<string, boolean> = v && typeof v === 'object' ? v : {}
    return {
      order: DEFAULT_COLUMN_CONFIG.order,
      visibility: { ...DEFAULT_COLUMN_CONFIG.visibility, ...vis },
      widths: { ...DEFAULT_COLUMN_CONFIG.widths },
    }
  }, [rawColumnConfig])

  const clearColumnConfig = () => {
    window.localStorage.removeItem(columnKey)
    window.dispatchEvent(new CustomEvent(`local-storage-${columnKey}`, { detail: DEFAULT_COLUMN_CONFIG }))
  }

  const filteredRows = useMemo(() => filterRows(safeRows, applied), [applied, safeRows])
  const selectedRows = useMemo(() => safeRows.filter((r) => selectedIds.includes(r.id)), [safeRows, selectedIds])

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(filteredRows.map((r) => r.id))
    else setSelectedIds([])
  }

  const colLeft = {
    checkbox: 44,
    pattern: 120,
    image: 70,
    name: 220,
    sku: 180,
  }
  const leftOffsets = {
    checkbox: 0,
    pattern: colLeft.checkbox,
    image: colLeft.checkbox + colLeft.pattern,
    name: colLeft.checkbox + colLeft.pattern + colLeft.image,
    sku: colLeft.checkbox + colLeft.pattern + colLeft.image + colLeft.name,
  }
  const actionColWidth = 84

  const optionalColumnDefs = useMemo(() => {
    return {
      status: { key: 'status', label: '状态', cell: (r: SingleSkuRow) => r.status },
      inventoryTotal: { key: 'inventoryTotal', label: '库存总数', cell: (r: SingleSkuRow) => r.inventoryTotal },
      inventoryAvailable: { key: 'inventoryAvailable', label: '可用库存数', cell: (r: SingleSkuRow) => r.inventoryAvailable },
      forecastDailySales: { key: 'forecastDailySales', label: '预测日销量', cell: (r: SingleSkuRow) => r.forecastDailySales.toFixed(3) },
      sales72842: {
        key: 'sales72842',
        label: '7/28/42销量',
        cell: (r: SingleSkuRow) => (
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => {
              setSalesDialogSku(r.sku)
              setSalesDialogSkuName(r.productName)
              setSalesDialogOpen(true)
            }}
          >
            {r.sales72842}
          </button>
        ),
      },
      purchaseInTransitQty: { key: 'purchaseInTransitQty', label: '采购在途量', cell: (r: SingleSkuRow) => r.purchaseInTransitQty },
      warehouseUnshippedQty: { key: 'warehouseUnshippedQty', label: '未发货量', cell: (r: SingleSkuRow) => r.warehouseUnshippedQty },
      dropShipBasePrice: { key: 'dropShipBasePrice', label: '代发基价', cell: (r: SingleSkuRow) => `￥${r.dropShipBasePrice.toFixed(2)}` },
      mainCategory: { key: 'mainCategory', label: '主分类', cell: (r: SingleSkuRow) => r.mainCategory },
      productCategory: { key: 'productCategory', label: '商品类目', cell: (r: SingleSkuRow) => r.productCategory },
      customCategory: { key: 'customCategory', label: '自定义分类', cell: (r: SingleSkuRow) => r.customCategory },
      declareEnName: { key: 'declareEnName', label: '申报英文名称', cell: (r: SingleSkuRow) => r.declareEnName || '--' },
      declareCnName: { key: 'declareCnName', label: '申报中文名称', cell: (r: SingleSkuRow) => r.declareCnName || '--' },
      brand: { key: 'brand', label: '品牌', cell: (r: SingleSkuRow) => r.brand },
      selector: { key: 'selector', label: '选品员', cell: (r: SingleSkuRow) => r.selector },
      developer: { key: 'developer', label: '开发员', cell: (r: SingleSkuRow) => r.developer },
      purchaser: { key: 'purchaser', label: '采购员', cell: (r: SingleSkuRow) => r.purchaser || '--' },
      createdBy: { key: 'createdBy', label: '创建人', cell: (r: SingleSkuRow) => r.createdBy },
      updatedAt: { key: 'updatedAt', label: '最后更新时间', cell: (r: SingleSkuRow) => formatDateTime(r.updatedAt) },
      createdAt: { key: 'createdAt', label: '创建时间', cell: (r: SingleSkuRow) => formatDateTime(r.createdAt) },
      updatedBy: { key: 'updatedBy', label: '最后更新人', cell: (r: SingleSkuRow) => r.updatedBy },
      remark: { key: 'remark', label: '备注', cellClassName: 'text-left', cell: (r: SingleSkuRow) => <div className="truncate">{r.remark || '--'}</div> },
    } as const
  }, [])

  const visibleOptionalColumns = useMemo(() => {
    const keyToLabel = OPTIONAL_COLUMNS.reduce((acc, c) => {
      acc[c.key] = c.label
      return acc
    }, {} as Record<string, string>)
    const keyToDefaultWidth = OPTIONAL_COLUMNS.reduce((acc, c) => {
      acc[c.key] = c.defaultWidth
      return acc
    }, {} as Record<string, number>)
    const order = Array.isArray(columnConfig.order) ? columnConfig.order : DEFAULT_COLUMN_CONFIG.order
    const unique: string[] = []
    order.forEach((k) => {
      if (keyToLabel[k] && !unique.includes(k)) unique.push(k)
    })
    Object.keys(keyToLabel).forEach((k) => {
      if (!unique.includes(k)) unique.push(k)
    })
    return unique
      .filter((k) => columnConfig.visibility[k] !== false)
      .map((k) => ({
        key: k,
        label: (optionalColumnDefs as any)[k]?.label || keyToLabel[k],
        width: columnConfig.widths[k] ?? keyToDefaultWidth[k] ?? 120,
        cellClassName: (optionalColumnDefs as any)[k]?.cellClassName,
        cell: (optionalColumnDefs as any)[k]?.cell,
      }))
      .filter((c) => typeof c.cell === 'function')
  }, [columnConfig.order, columnConfig.visibility, columnConfig.widths, optionalColumnDefs])

  const tableMinWidth = useMemo(() => {
    const base = colLeft.checkbox + colLeft.pattern + colLeft.image + colLeft.name + colLeft.sku + actionColWidth
    const optional = visibleOptionalColumns.reduce((sum: number, c: any) => sum + (Number(c.width) || 0), 0)
    return base + optional
  }, [actionColWidth, colLeft.checkbox, colLeft.image, colLeft.name, colLeft.pattern, colLeft.sku, visibleOptionalColumns])

  const emptyColSpan = 6 + visibleOptionalColumns.length

  const activityBadge = (activity: string) => {
    const base = 'inline-flex items-center rounded px-2 py-0.5 text-[11px] leading-none ml-2'
    if (activity === '爆款') return <span className={`${base} bg-red-100 text-red-600`}>爆款</span>
    if (activity === '旺款') return <span className={`${base} bg-orange-100 text-orange-600`}>旺款</span>
    if (activity === '平款') return <span className={`${base} bg-blue-100 text-blue-600`}>平款</span>
    if (activity === '滞销款') return <span className={`${base} bg-gray-100 text-gray-600`}>滞销</span>
    return null
  }

  const purchaserOptions = useMemo(() => {
    const set = new Set<string>()
    safeRows.forEach((r) => {
      if (r.purchaser) set.add(r.purchaser)
    })
    return ['全部', ...Array.from(set)]
  }, [safeRows])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-[12px] text-gray-600">版型编码</div>
            <Input className="h-8 w-[130px]" value={draft.patternCode} onChange={(e) => setDraft((p) => ({ ...p, patternCode: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[12px] text-gray-600">产品名称</div>
            <Input className="h-8 w-[160px]" value={draft.productName} onChange={(e) => setDraft((p) => ({ ...p, productName: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[12px] text-gray-600">库存SKU编码</div>
            <Input className="h-8 w-[190px]" placeholder="支持模糊搜索SKU编码" value={draft.sku} onChange={(e) => setDraft((p) => ({ ...p, sku: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[12px] text-gray-600">主分类</div>
            <select className="h-8 w-[140px] rounded-md border border-gray-300 bg-white px-2 text-[13px]" value={draft.mainCategory} onChange={(e) => setDraft((p) => ({ ...p, mainCategory: e.target.value }))}>
              {mainCategoryOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[12px] text-gray-600">品牌</div>
            <select className="h-8 w-[120px] rounded-md border border-gray-300 bg-white px-2 text-[13px]" value={draft.brand} onChange={(e) => setDraft((p) => ({ ...p, brand: e.target.value }))}>
              {brandOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[12px] text-gray-600">产品类目</div>
            <select className="h-8 w-[160px] rounded-md border border-gray-300 bg-white px-2 text-[13px]" value={draft.productCategory} onChange={(e) => setDraft((p) => ({ ...p, productCategory: e.target.value }))}>
              {productCategoryOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[12px] text-gray-600">自定义分类</div>
            <select className="h-8 w-[160px] rounded-md border border-gray-300 bg-white px-2 text-[13px]" value={draft.customCategory} onChange={(e) => setDraft((p) => ({ ...p, customCategory: e.target.value }))}>
              {customCategoryOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[12px] text-gray-600">状态</div>
            <select className="h-8 w-[170px] rounded-md border border-gray-300 bg-white px-2 text-[13px]" value={draft.status} onChange={(e) => setDraft((p) => ({ ...p, status: e.target.value as any }))}>
              {statusOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[12px] text-gray-600">活跃度</div>
            <select className="h-8 w-[140px] rounded-md border border-gray-300 bg-white px-2 text-[13px]" value={draft.activity} onChange={(e) => setDraft((p) => ({ ...p, activity: e.target.value as any }))}>
              {activityOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[12px] text-gray-600">采购员</div>
            <select className="h-8 w-[140px] rounded-md border border-gray-300 bg-white px-2 text-[13px]" value={draft.purchaser} onChange={(e) => setDraft((p) => ({ ...p, purchaser: e.target.value }))}>
              {purchaserOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => { setApplied(draft); setSelectedIds([]) }}>搜索</Button>
            <Button variant="outline" className="h-8" onClick={() => { setDraft(defaultFilters); setApplied(defaultFilters); setSelectedIds([]) }}>重置</Button>
          </div>
        </div>
      </div>

      <div className="p-2 bg-white border-b border-gray-200 flex flex-wrap items-center gap-2 shrink-0 text-[13px]">
        <Button variant="outline" className="h-7 px-3 text-[13px] border-gray-300 text-gray-700">
          批量更新代发基价 <ChevronDown className="w-3.5 h-3.5 ml-1" />
        </Button>
        <Button className="h-7 bg-blue-600 hover:bg-blue-700 text-white px-3 text-[13px]">
          导入申报信息
        </Button>
        <Button
          variant="outline"
          className="h-7 px-3 text-[13px] border-gray-300 text-gray-700"
          disabled={selectedIds.length === 0}
          onClick={() => setBatchEditOpen(true)}
        >
          批量编辑
        </Button>
        <Button variant="outline" className="h-7 px-3 text-[13px] border-gray-300 text-gray-700">
          移动分类
        </Button>
        <Button variant="outline" className="h-7 px-3 text-[13px] border-gray-300 text-gray-700">
          批量备注
        </Button>
        <Button
          variant="outline"
          className="h-7 px-3 text-[13px] border-gray-300 text-gray-700"
          disabled={selectedIds.length === 0}
          onClick={() => setStatusDialogOpen(true)}
        >
          修改状态
        </Button>
        <div className="ml-auto flex items-center gap-2 text-[13px] text-gray-600">
          <Button variant="outline" className="h-7 px-3 text-[13px] border-gray-300 text-gray-700">
            更新库存销量
          </Button>
          <span className="bg-blue-600 text-white rounded px-2 py-1">已选行数：{selectedIds.length}</span>
          <span className="bg-blue-600 text-white rounded px-2 py-1">商品数：{filteredRows.length}</span>
          <button
            type="button"
            className="h-7 w-7 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => setSettingsDialogOpen(true)}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-white">
        <table className="w-full text-center text-[12px] border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
          <thead className="bg-[#F8FAFC] text-gray-600 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-2 font-normal border-b border-r border-gray-200 w-[44px] sticky left-0 bg-[#F8FAFC] z-30 shadow-[1px_0_0_rgba(229,231,235,1)]">
                <Checkbox checked={selectedIds.length === filteredRows.length && filteredRows.length > 0} onCheckedChange={toggleSelectAll} />
              </th>
              <th className="p-2 font-normal border-b border-r border-gray-200 sticky bg-[#F8FAFC] z-30 shadow-[1px_0_0_rgba(229,231,235,1)]" style={{ left: leftOffsets.pattern, width: colLeft.pattern }}>
                版型编码
              </th>
              <th className="p-2 font-normal border-b border-r border-gray-200 sticky bg-[#F8FAFC] z-30 shadow-[1px_0_0_rgba(229,231,235,1)]" style={{ left: leftOffsets.image, width: colLeft.image }}>
                产品图片
              </th>
              <th className="p-2 font-normal border-b border-r border-gray-200 sticky bg-[#F8FAFC] z-30 shadow-[1px_0_0_rgba(229,231,235,1)] text-left" style={{ left: leftOffsets.name, width: colLeft.name }}>
                产品名称
              </th>
              <th className="p-2 font-normal border-b border-r border-gray-200 sticky bg-[#F8FAFC] z-30 shadow-[1px_0_0_rgba(229,231,235,1)]" style={{ left: leftOffsets.sku, width: colLeft.sku }}>
                库存SKU编码
              </th>
              {visibleOptionalColumns.map((c: any) => (
                <th
                  key={c.key}
                  className="p-2 font-normal border-b border-r border-gray-200"
                  style={{ width: c.width }}
                >
                  {c.label}
                </th>
              ))}
              <th className="p-2 font-normal border-b border-gray-200 w-[84px] sticky right-0 bg-[#F8FAFC] z-30 shadow-[-1px_0_0_rgba(229,231,235,1)]">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRows.map((r) => (
              <tr key={r.id} className="hover:bg-blue-50/30">
                <td className="p-2 border-r border-gray-100 sticky left-0 bg-white z-20 shadow-[1px_0_0_rgba(229,231,235,1)]">
                  <Checkbox checked={selectedIds.includes(r.id)} onCheckedChange={(c) => setSelectedIds((prev) => (c ? [...prev, r.id] : prev.filter((x) => x !== r.id)))} />
                </td>
                <td className="p-2 border-r border-gray-100 sticky bg-white z-20 shadow-[1px_0_0_rgba(229,231,235,1)]" style={{ left: leftOffsets.pattern, width: colLeft.pattern }}>
                  {r.patternCode}
                </td>
                <td className="p-2 border-r border-gray-100 sticky bg-white z-20 shadow-[1px_0_0_rgba(229,231,235,1)]" style={{ left: leftOffsets.image, width: colLeft.image }}>
                  <img src={r.imageUrl} alt="img" className="w-10 h-10 border border-gray-200 rounded object-cover inline-block" />
                </td>
                <td className="p-2 border-r border-gray-100 sticky bg-white z-20 shadow-[1px_0_0_rgba(229,231,235,1)] text-left" style={{ left: leftOffsets.name, width: colLeft.name }}>
                  <div className="flex items-center">
                    <div className="truncate">{r.productName}</div>
                    {activityBadge(r.activity)}
                  </div>
                </td>
                <td className="p-2 border-r border-gray-100 sticky bg-white z-20 shadow-[1px_0_0_rgba(229,231,235,1)]" style={{ left: leftOffsets.sku, width: colLeft.sku }}>
                  {r.sku}
                </td>

                {visibleOptionalColumns.map((c: any) => (
                  <td
                    key={c.key}
                    className={`p-2 border-r border-gray-100 ${c.cellClassName || ''}`}
                    style={{ width: c.width }}
                  >
                    {c.cell(r)}
                  </td>
                ))}
                <td className="p-2 sticky right-0 bg-white z-20 shadow-[-1px_0_0_rgba(229,231,235,1)]">
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <button type="button" className="hover:underline">详情</button>
                    <button type="button" className="hover:underline">日志</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={emptyColSpan} className="p-10 text-center text-gray-500">暂无数据</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BatchEditDrawer
        open={batchEditOpen}
        onOpenChange={setBatchEditOpen}
        selectedRows={selectedRows}
        onSave={(patch) => {
          if (!patch || selectedIds.length === 0) return
          const hasWarehouse = !!patch.warehouseSupply
          const hasPurchaser = !!patch.purchaser
          const hasWarehouseLocation = !!patch.warehouseLocation
          if (!hasWarehouse && !hasPurchaser && !hasWarehouseLocation) return
          setRows((prev) =>
            (Array.isArray(prev) ? prev : []).map((r) => {
              if (!selectedIds.includes(r.id)) return r
              const next = { ...r } as any
              if (patch.purchaser) {
                next.purchaser = patch.purchaser
              }
              if (patch.warehouseLocation) {
                next.warehouseLocation = patch.warehouseLocation
              }
              if (patch.warehouseSupply) {
                const cur = (r as any).warehouseSupply || {}
                const ws: any = { ...cur }
                if (patch.warehouseSupply.dongguan) ws.dongguan = { ...(ws.dongguan || {}), ...patch.warehouseSupply.dongguan }
                if (patch.warehouseSupply.xian) ws.xian = { ...(ws.xian || {}), ...patch.warehouseSupply.xian }
                next.warehouseSupply = ws
              }
              return next as SingleSkuRow
            })
          )
          setSelectedIds([])
        }}
      />

      <SalesTrendDialog
        open={salesDialogOpen}
        onOpenChange={setSalesDialogOpen}
        sku={salesDialogSku}
        skuName={salesDialogSkuName}
      />

      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        lockedColumns={LOCKED_COLUMNS}
        columns={OPTIONAL_COLUMNS}
        columnConfig={columnConfig}
        defaultColumnConfig={DEFAULT_COLUMN_CONFIG}
        onClearColumns={clearColumnConfig}
        activityValue={activitySettings}
        defaultActivityValue={DEFAULT_ACTIVITY_SETTINGS}
        onConfirm={({ columns: nextColumns, activity: nextActivity }) => {
          setRawColumnConfig(nextColumns)
          setActivitySettings(nextActivity)
        }}
      />

      <StatusEditDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        options={statusOptions.slice(1) as any}
        onConfirm={(status) => {
          setRows((prev) => applyStatusPatch(Array.isArray(prev) ? prev : [], selectedIds, status))
          setSelectedIds([])
        }}
      />
    </div>
  )
}
