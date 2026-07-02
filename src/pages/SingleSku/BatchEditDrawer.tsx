import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ClipboardCheck, Package, Warehouse } from 'lucide-react'
import type { SingleSkuRow, WarehouseSupply } from './types'

type Patch = {
  purchaser?: string
  warehouseLocation?: string
  warehouseSupply?: {
    dongguan?: WarehouseSupply
    xian?: WarehouseSupply
  }
}

function toNumberOrNull(v: string) {
  const t = v.trim()
  if (!t) return null
  const n = Number(t)
  if (!Number.isFinite(n)) return null
  return n
}

export default function BatchEditDrawer(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedRows: SingleSkuRow[]
  onSave: (patch: Patch) => void
}) {
  const { open, onOpenChange, selectedRows, onSave } = props

  const [tab, setTab] = React.useState<'quality' | 'packaging' | 'warehouse'>('warehouse')

  const [purchaser, setPurchaser] = React.useState('')
  const [warehouse, setWarehouse] = React.useState('')
  const [warehouseBin, setWarehouseBin] = React.useState('')
  const [supplier, setSupplier] = React.useState('')
  const [preferredSupplier, setPreferredSupplier] = React.useState('')
  const [dgCost, setDgCost] = React.useState('')
  const [dgAlertStock, setDgAlertStock] = React.useState('')
  const [dgAlertDays, setDgAlertDays] = React.useState('')
  const [dgSafetyDays, setDgSafetyDays] = React.useState('')
  const [dgUpper, setDgUpper] = React.useState('')

  const [xaCost, setXaCost] = React.useState('')
  const [xaAlertStock, setXaAlertStock] = React.useState('')
  const [xaAlertDays, setXaAlertDays] = React.useState('')
  const [xaSafetyDays, setXaSafetyDays] = React.useState('')
  const [xaUpper, setXaUpper] = React.useState('')

  React.useEffect(() => {
    if (!open) return
    setTab('warehouse')
    setPurchaser('')
    setWarehouse('')
    setWarehouseBin('')
    setSupplier('')
    setPreferredSupplier('')
    setDgCost('')
    setDgAlertStock('')
    setDgAlertDays('')
    setDgSafetyDays('')
    setDgUpper('')

    setXaCost('')
    setXaAlertStock('')
    setXaAlertDays('')
    setXaSafetyDays('')
    setXaUpper('')
  }, [open])

  const buildWarehousePatch = (p: {
    cost: string
    alertStock: string
    alertDays: string
    safetyStockDays: string
    purchaseUpperLimit: string
  }) => {
    const cost = toNumberOrNull(p.cost)
    const alertStock = toNumberOrNull(p.alertStock)
    const alertDays = toNumberOrNull(p.alertDays)
    const safetyStockDays = toNumberOrNull(p.safetyStockDays)
    const purchaseUpperLimit = toNumberOrNull(p.purchaseUpperLimit)

    const out: WarehouseSupply = {}
    if (cost !== null) out.cost = cost
    if (alertStock !== null) out.alertStock = alertStock
    if (alertDays !== null) out.alertDays = alertDays
    if (safetyStockDays !== null) out.safetyStockDays = safetyStockDays
    if (purchaseUpperLimit !== null) out.purchaseUpperLimit = purchaseUpperLimit
    return Object.keys(out).length > 0 ? out : null
  }

  const dongguanPatch = buildWarehousePatch({
    cost: dgCost,
    alertStock: dgAlertStock,
    alertDays: dgAlertDays,
    safetyStockDays: dgSafetyDays,
    purchaseUpperLimit: dgUpper,
  })

  const xianPatch = buildWarehousePatch({
    cost: xaCost,
    alertStock: xaAlertStock,
    alertDays: xaAlertDays,
    safetyStockDays: xaSafetyDays,
    purchaseUpperLimit: xaUpper,
  })

  const patch: Patch = {
    purchaser: purchaser ? purchaser : undefined,
    warehouseLocation: warehouse && warehouseBin ? `${warehouse}-${warehouseBin}` : warehouse ? warehouse : undefined,
    warehouseSupply:
      dongguanPatch || xianPatch
        ? {
            dongguan: dongguanPatch ?? undefined,
            xian: xianPatch ?? undefined,
          }
        : undefined,
  }

  const hasAnyPatch = !!patch.warehouseSupply || !!patch.purchaser || !!patch.warehouseLocation
  const purchaserOptions = React.useMemo(() => {
    const set = new Set<string>()
    selectedRows.forEach((r) => {
      if (r.purchaser) set.add(r.purchaser)
    })
    return ['采购员A', '采购员B', '采购员C', ...Array.from(set)]
  }, [selectedRows])

  const warehouseOptions = React.useMemo(() => ['东莞厚街仓', '西安仓', '义乌仓'], [])
  const warehouseBinMap = React.useMemo(
    () => ({
      东莞厚街仓: ['A01', 'A02', 'A03'],
      西安仓: ['B01', 'B02', 'B03'],
      义乌仓: ['C01', 'C02', 'C03'],
    }),
    []
  )
  const binOptions = React.useMemo(() => {
    if (!warehouse) return []
    return (warehouseBinMap as any)[warehouse] || []
  }, [warehouse, warehouseBinMap])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-0 right-0 left-auto h-screen w-[860px] max-w-[96vw] -translate-x-0 -translate-y-0 rounded-none p-0 gap-0"
        showCloseButton
      >
        <div className="h-full flex">
          <div className="w-[260px] border-r border-gray-200 bg-white flex flex-col">
            <div className="p-3 border-b border-gray-200 text-[13px] font-medium text-gray-800">批量修改</div>
            <div className="p-3">
              <Input className="h-8 text-[13px]" placeholder="请输入SKU，多个SKU用逗号..." />
            </div>
            <div className="px-3 pb-3 text-[12px] text-gray-500">已选 {selectedRows.length} 条</div>
            <div className="flex-1 overflow-auto custom-scrollbar px-2 pb-3">
              {selectedRows.map((r) => (
                <div key={r.id} className="px-2 py-2 rounded border border-gray-200 bg-white mb-2">
                  <div className="text-[13px] text-blue-600 font-medium">{r.sku}</div>
                  <div className="text-[12px] text-gray-600 truncate">{r.productName}</div>
                </div>
              ))}
              {selectedRows.length === 0 && (
                <div className="px-2 py-6 text-center text-gray-500 text-[13px]">未选择SKU</div>
              )}
            </div>
          </div>

          <div className="flex-1 bg-white flex flex-col">
            <DialogHeader className="p-4 border-b border-gray-200">
              <DialogTitle className="text-[14px] font-medium">批量修改</DialogTitle>
            </DialogHeader>

            <div className="px-4 pt-2 bg-white border-b border-gray-200">
              <div className="flex items-center gap-2 text-[13px]">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 ${tab === 'quality' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-600'}`}
                  onClick={() => setTab('quality')}
                >
                  <ClipboardCheck className="w-4 h-4" /> 产品与质检
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 ${tab === 'packaging' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-600'}`}
                  onClick={() => setTab('packaging')}
                >
                  <Package className="w-4 h-4" /> 物流与包装
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 ${tab === 'warehouse' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-600'}`}
                  onClick={() => setTab('warehouse')}
                >
                  <Warehouse className="w-4 h-4" /> 仓库与供应
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto custom-scrollbar p-4">
              {tab !== 'warehouse' && <div className="text-gray-500 text-[13px]">暂未实现</div>}

              {tab === 'warehouse' && (
                <>
                  <div className="rounded border border-gray-200 overflow-hidden">
                    <div className="bg-blue-600 text-white px-4 py-2 text-[13px] font-medium">供应商信息</div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                          <div className="text-[12px] text-gray-600">供应商</div>
                          <select
                            className={`h-8 rounded-md border border-gray-300 bg-white px-2 ${supplier ? 'text-[13px] text-gray-700' : 'text-[12px] text-gray-400'}`}
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                          >
                            <option value="">请选择供应商</option>
                            <option value="供应商A">供应商A</option>
                            <option value="供应商B">供应商B</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-[12px] text-gray-600">供应商货号</div>
                          <Input className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="供应商货号" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-[12px] text-gray-600">采购链接</div>
                          <Input className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="采购链接" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-[12px] text-gray-600">供应商备货期</div>
                          <div className="flex items-center gap-2">
                            <Input className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="供应商备货期" />
                            <span className="text-gray-500 text-[12px]">天</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-[12px] text-gray-600">采购参考价</div>
                          <div className="flex items-center gap-2">
                            <Input className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="采购参考价" />
                            <span className="text-gray-500 text-[12px]">元</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-[12px] text-gray-600">最小起订量</div>
                          <div className="flex items-center gap-2">
                            <Input className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="最小起订量" />
                            <span className="text-gray-500 text-[12px]">件</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-[12px] text-gray-600">是否首选供应商</div>
                          <select
                            className={`h-8 rounded-md border border-gray-300 bg-white px-2 ${preferredSupplier ? 'text-[13px] text-gray-700' : 'text-[12px] text-gray-400'}`}
                            value={preferredSupplier}
                            onChange={(e) => setPreferredSupplier(e.target.value)}
                          >
                            <option value="">请选择是否首选供应商</option>
                            <option value="是">是</option>
                            <option value="否">否</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-center mt-4">
                        <Button className="h-8 bg-blue-600 hover:bg-blue-700 text-white px-4">＋ 新增</Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded border border-gray-200 overflow-hidden mt-4">
                    <div className="bg-blue-600 text-white px-4 py-2 text-[13px] font-medium">采购与备货</div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div className="flex flex-col gap-1">
                          <div className="text-[13px] text-gray-700">采购员</div>
                          <select
                            className={`h-8 rounded-md border border-gray-300 bg-white px-2 ${purchaser ? 'text-[13px] text-gray-700' : 'text-[12px] text-gray-400'}`}
                            value={purchaser}
                            onChange={(e) => setPurchaser(e.target.value)}
                          >
                            <option value="">请选择采购员</option>
                            {purchaserOptions.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-[13px] text-gray-700">仓库/仓位</div>
                          <div className="flex items-center gap-2">
                            <select
                              className={`h-8 w-[150px] rounded-md border border-gray-300 bg-white px-2 ${warehouse ? 'text-[13px] text-gray-700' : 'text-[12px] text-gray-400'}`}
                              value={warehouse}
                              onChange={(e) => {
                                setWarehouse(e.target.value)
                                setWarehouseBin('')
                              }}
                            >
                              <option value="">请选择仓库</option>
                              {warehouseOptions.map((o) => (
                                <option key={o} value={o}>
                                  {o}
                                </option>
                              ))}
                            </select>
                            <select
                              className={`h-8 w-[110px] rounded-md border border-gray-300 bg-white px-2 ${warehouseBin ? 'text-[13px] text-gray-700' : 'text-[12px] text-gray-400'} ${warehouse ? '' : 'opacity-50'}`}
                              value={warehouseBin}
                              onChange={(e) => setWarehouseBin(e.target.value)}
                              disabled={!warehouse}
                            >
                              <option value="">请选择仓位</option>
                              {binOptions.map((o: string) => (
                                <option key={o} value={o}>
                                  {o}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="text-[13px] text-gray-700 mb-3">仓库成本：</div>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <div className="text-[13px] text-gray-700 mb-2">东莞厚街仓</div>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-2">
                              <Input type="number" className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="请输入成本" value={dgCost} onChange={(e) => setDgCost(e.target.value)} />
                              <span className="text-gray-500 text-[12px]">元</span>
                            </div>
                            <Input type="number" className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="警戒库存" value={dgAlertStock} onChange={(e) => setDgAlertStock(e.target.value)} />
                            <Input type="number" className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="警戒天数" value={dgAlertDays} onChange={(e) => setDgAlertDays(e.target.value)} />
                            <Input type="number" className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="安全库存天数" value={dgSafetyDays} onChange={(e) => setDgSafetyDays(e.target.value)} />
                            <Input type="number" className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="采购上限" value={dgUpper} onChange={(e) => setDgUpper(e.target.value)} />
                          </div>
                        </div>
                        <div>
                          <div className="text-[13px] text-gray-700 mb-2">西安仓</div>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-2">
                              <Input type="number" className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="请输入成本" value={xaCost} onChange={(e) => setXaCost(e.target.value)} />
                              <span className="text-gray-500 text-[12px]">元</span>
                            </div>
                            <Input type="number" className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="警戒库存" value={xaAlertStock} onChange={(e) => setXaAlertStock(e.target.value)} />
                            <Input type="number" className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="警戒天数" value={xaAlertDays} onChange={(e) => setXaAlertDays(e.target.value)} />
                            <Input type="number" className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="安全库存天数" value={xaSafetyDays} onChange={(e) => setXaSafetyDays(e.target.value)} />
                            <Input type="number" className="h-8 text-[13px] placeholder:text-[12px] placeholder:text-gray-400" placeholder="采购上限" value={xaUpper} onChange={(e) => setXaUpper(e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="p-4 border-t bg-white -mx-0 -mb-0 rounded-none">
              <Button variant="outline" className="h-8" onClick={() => onOpenChange(false)}>取消</Button>
              <Button className="h-8 bg-blue-600 hover:bg-blue-700" disabled={!hasAnyPatch || selectedRows.length === 0} onClick={() => { onSave(patch); onOpenChange(false) }}>
                保存
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
