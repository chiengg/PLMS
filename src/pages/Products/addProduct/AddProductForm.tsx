import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { BRANDS_KEY, CATEGORIES_KEY, PRODUCTS_KEY, defaultBrands, defaultCategories, defaultProductsFromLegacyMock, shapeOptions, statusOptions, unitOptions, userOptions, warehouseOptions } from '../data'
import type { Brand, Category, Product, ProductShape, ProductStatus, ProductWarehouseInfo } from '../types'
import { calcMinPurchaseQty, calcStockAlertQty } from './calculations'
import { validateSku, validateUpperLimit } from './validators'

type ExtraAttrKey =
  | '品牌类型'
  | '材质'
  | '是否背心'
  | '类别'
  | '成分含量'
  | '是否有领'
  | '是否有扣'
  | '是否有拉链'

const extraAttrKeys: ExtraAttrKey[] = ['品牌类型', '材质', '是否背心', '类别', '成分含量', '是否有领', '是否有扣', '是否有拉链']

type FieldKey =
  | 'sku'
  | 'cnName'
  | 'status'
  | 'shape'
  | 'warehouse'
  | 'purchaseUpperLimit'

function toNumber(v: string) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export default function AddProductForm({
  onOpenCategoryManager,
  onOpenBrandManager,
}: {
  onOpenCategoryManager: () => void
  onOpenBrandManager: () => void
}) {
  const navigate = useNavigate()

  const [products, setProducts] = useLocalStorage<Product[]>(PRODUCTS_KEY, defaultProductsFromLegacyMock())
  const [categories] = useLocalStorage<Category[]>(CATEGORIES_KEY, defaultCategories)
  const [brands] = useLocalStorage<Brand[]>(BRANDS_KEY, defaultBrands)

  const safeProducts = Array.isArray(products) ? products : []
  const safeCategories = Array.isArray(categories) ? categories : []
  const safeBrands = Array.isArray(brands) ? brands : []

  const existingSkus = useMemo(() => safeProducts.map((p) => p.sku).filter(Boolean), [safeProducts])

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})

  const [sku, setSku] = useState('')
  const [mainSku, setMainSku] = useState('')
  const [cnName, setCnName] = useState('')
  const [enName, setEnName] = useState('')
  const [status, setStatus] = useState<ProductStatus | ''>('')
  const [factorySku, setFactorySku] = useState('')
  const [shape, setShape] = useState<ProductShape | ''>('')
  const [categoryId, setCategoryId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [brandId, setBrandId] = useState('')
  const [brandName, setBrandName] = useState('')
  const [unit, setUnit] = useState(unitOptions[0] || '')
  const [salesLink, setSalesLink] = useState('')
  const [developer, setDeveloper] = useState('')
  const [inventoryImageUrl, setInventoryImageUrl] = useState('')
  const [virtualSku, setVirtualSku] = useState('')
  const [productNote, setProductNote] = useState('')
  const [salesNote, setSalesNote] = useState('')
  const [purchaseNote, setPurchaseNote] = useState('')

  const [extraAttrs, setExtraAttrs] = useState<Record<string, string>>(() =>
    extraAttrKeys.reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  )

  const [warehouseInfo, setWarehouseInfo] = useState<ProductWarehouseInfo>(() => ({
    warehouse: '',
    inventoryQty: 0,
    inventoryCheckCycleDays: 0,
    inventoryChecker: '',
    purchaseDays: 0,
    stockAlertDays: 0,
    forecastDailySales: 0,
    stockAlertQty: 0,
    minPurchaseQty: 0,
    purchaseUpperLimit: 0,
    manualOverrides: { stockAlertQty: false, minPurchaseQty: false },
  }))

  const skuRowRef = useRef<HTMLDivElement>(null)
  const cnNameRowRef = useRef<HTMLDivElement>(null)
  const statusRowRef = useRef<HTMLDivElement>(null)
  const shapeRowRef = useRef<HTMLDivElement>(null)
  const warehouseRowRef = useRef<HTMLDivElement>(null)
  const purchaseUpperLimitRowRef = useRef<HTMLDivElement>(null)

  const fieldRefMap: Record<FieldKey, RefObject<HTMLDivElement>> = {
    sku: skuRowRef,
    cnName: cnNameRowRef,
    status: statusRowRef,
    shape: shapeRowRef,
    warehouse: warehouseRowRef,
    purchaseUpperLimit: purchaseUpperLimitRowRef,
  }

  const scrollToFirstError = (nextErrors: Partial<Record<FieldKey, string>>) => {
    const order: FieldKey[] = ['sku', 'cnName', 'status', 'shape', 'warehouse', 'purchaseUpperLimit']
    const first = order.find((k) => nextErrors[k])
    if (!first) return
    fieldRefMap[first].current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 2000)
  }

  const onSkuBlur = () => {
    const res = validateSku({ sku, existingSkus })
    if (!res.ok) {
      setErrors((prev) => ({ ...prev, sku: res.message }))
      return
    }
    setSku(res.value)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.sku
      return next
    })
  }

  const { stockAlertDays, purchaseDays, forecastDailySales } = warehouseInfo
  useEffect(() => {
    setWarehouseInfo((prev) => {
      const computedStockAlertQty = calcStockAlertQty({
        stockAlertDays: prev.stockAlertDays,
        forecastDailySales: prev.forecastDailySales,
      })
      const computedMinPurchaseQty = calcMinPurchaseQty({
        purchaseDays: prev.purchaseDays,
        forecastDailySales: prev.forecastDailySales,
        moq: 0,
      })

      let next = prev
      if (!prev.manualOverrides.stockAlertQty && prev.stockAlertQty !== computedStockAlertQty) {
        next = { ...next, stockAlertQty: computedStockAlertQty }
      }
      if (!prev.manualOverrides.minPurchaseQty && prev.minPurchaseQty !== computedMinPurchaseQty) {
        next = { ...next, minPurchaseQty: computedMinPurchaseQty }
      }
      return next
    })
  }, [stockAlertDays, purchaseDays, forecastDailySales])

  const restoreStockAlertQty = () => {
    const computed = calcStockAlertQty({
      stockAlertDays: warehouseInfo.stockAlertDays,
      forecastDailySales: warehouseInfo.forecastDailySales,
    })
    setWarehouseInfo((prev) => ({
      ...prev,
      stockAlertQty: computed,
      manualOverrides: { ...prev.manualOverrides, stockAlertQty: false },
    }))
  }

  const restoreMinPurchaseQty = () => {
    const computed = calcMinPurchaseQty({
      purchaseDays: warehouseInfo.purchaseDays,
      forecastDailySales: warehouseInfo.forecastDailySales,
      moq: 0,
    })
    setWarehouseInfo((prev) => ({
      ...prev,
      minPurchaseQty: computed,
      manualOverrides: { ...prev.manualOverrides, minPurchaseQty: false },
    }))
  }

  const validateAll = () => {
    const nextErrors: Partial<Record<FieldKey, string>> = {}

    const skuRes = validateSku({ sku, existingSkus })
    if (!skuRes.ok) nextErrors.sku = skuRes.message

    if (!cnName.trim()) nextErrors.cnName = '中文名称不能为空'
    if (!status) nextErrors.status = '请选择状态'
    if (!shape) nextErrors.shape = '请选择商品形态'
    if (!warehouseInfo.warehouse) nextErrors.warehouse = '请选择仓库'

    const upper = validateUpperLimit(warehouseInfo.purchaseUpperLimit)
    if (!upper.ok) nextErrors.purchaseUpperLimit = upper.message

    return { ok: Object.keys(nextErrors).length === 0, errors: nextErrors, skuRes }
  }

  const handleSave = () => {
    setFormError(null)
    const res = validateAll()
    if (!res.ok) {
      setErrors(res.errors)
      setFormError(`请修正 ${Object.keys(res.errors).length} 处错误`)
      scrollToFirstError(res.errors)
      return
    }

    const now = Date.now()
    const next: Product = {
      id: `p_${now}`,
      sku: res.skuRes.ok ? res.skuRes.value : sku.trim(),
      mainSku: mainSku.trim(),
      cnName: cnName.trim(),
      enName: enName.trim(),
      status: status as ProductStatus,
      factorySku: factorySku.trim(),
      shape: shape as ProductShape,
      categoryId,
      categoryName,
      brandId,
      brandName,
      unit,
      salesLink: salesLink.trim(),
      developer,
      inventoryImageUrl: inventoryImageUrl.trim(),
      virtualSku: virtualSku.trim(),
      productNote: productNote.trim(),
      salesNote: salesNote.trim(),
      purchaseNote: purchaseNote.trim(),
      extraAttrs,
      warehouseInfo,
      createdAt: now,
    }

    setProducts((prev) => {
      const arr = Array.isArray(prev) ? prev : []
      return [next, ...arr]
    })

    showToast('保存成功')
    window.setTimeout(() => navigate('/products'), 150)
  }

  const handleCancel = () => navigate('/products')

  const handlePickCategory = (nextId: string) => {
    const picked = safeCategories.find((c) => c.id === nextId)
    setCategoryId(nextId)
    setCategoryName(picked?.name || '')
  }

  const handlePickBrand = (nextId: string) => {
    const picked = safeBrands.find((b) => b.id === nextId)
    setBrandId(nextId)
    setBrandName(picked?.name || '')
  }

  return (
    <div className="flex flex-col h-full">
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 text-[13px]">
          {toastMessage}
        </div>
      )}

      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="text-gray-800 text-[14px] font-medium">添加商品</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 px-4 text-[13px]" onClick={handleCancel}>
            取消
          </Button>
          <Button className="h-8 px-4 text-[13px]" onClick={handleSave}>
            保存并返回
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-4 flex flex-col gap-4">
          {formError && (
            <div className="border border-red-200 bg-red-50 text-red-600 px-3 py-2 rounded text-[13px]">
              {formError}
            </div>
          )}

          <div className="border border-gray-200 rounded">
            <div className="px-4 py-3 border-b border-gray-200 bg-[#F8FAFC] text-[13px] text-gray-700 font-medium">
              基本信息
            </div>
            <div className="p-4 grid grid-cols-3 gap-4 text-[13px]">
              <div ref={skuRowRef} className="flex flex-col gap-1">
                <div className="text-gray-600">
                  <span className="text-red-500">*</span> 库存SKU
                </div>
                <Input
                  value={sku}
                  onChange={(e) => {
                    setSku(e.target.value)
                    setErrors((prev) => ({ ...prev, sku: undefined }))
                  }}
                  onBlur={onSkuBlur}
                  className="h-8 text-[13px]"
                  placeholder="请输入库存SKU"
                />
                {errors.sku && <div className="text-red-500 text-[12px]">{errors.sku}</div>}
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">主SKU</div>
                <Input value={mainSku} onChange={(e) => setMainSku(e.target.value)} className="h-8 text-[13px]" />
              </div>

              <div ref={cnNameRowRef} className="flex flex-col gap-1">
                <div className="text-gray-600">
                  <span className="text-red-500">*</span> 中文名称
                </div>
                <Input
                  value={cnName}
                  onChange={(e) => {
                    setCnName(e.target.value)
                    setErrors((prev) => ({ ...prev, cnName: undefined }))
                  }}
                  className="h-8 text-[13px]"
                  placeholder="请输入中文名称"
                />
                {errors.cnName && <div className="text-red-500 text-[12px]">{errors.cnName}</div>}
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">英文名称</div>
                <Input value={enName} onChange={(e) => setEnName(e.target.value)} className="h-8 text-[13px]" />
              </div>

              <div ref={statusRowRef} className="flex flex-col gap-1">
                <div className="text-gray-600">
                  <span className="text-red-500">*</span> 状态
                </div>
                <Select
                  value={status || ''}
                  onValueChange={(v) => {
                    setStatus(v as ProductStatus)
                    setErrors((prev) => ({ ...prev, status: undefined }))
                  }}
                >
                  <SelectTrigger className="w-full h-8 text-[13px] bg-white">
                    <SelectValue placeholder="请选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && <div className="text-red-500 text-[12px]">{errors.status}</div>}
              </div>

              <div ref={shapeRowRef} className="flex flex-col gap-1">
                <div className="text-gray-600">
                  <span className="text-red-500">*</span> 商品形态
                </div>
                <Select
                  value={shape || ''}
                  onValueChange={(v) => {
                    setShape(v as ProductShape)
                    setErrors((prev) => ({ ...prev, shape: undefined }))
                  }}
                >
                  <SelectTrigger className="w-full h-8 text-[13px] bg-white">
                    <SelectValue placeholder="请选择形态" />
                  </SelectTrigger>
                  <SelectContent>
                    {shapeOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.shape && <div className="text-red-500 text-[12px]">{errors.shape}</div>}
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">原厂SKU</div>
                <Input value={factorySku} onChange={(e) => setFactorySku(e.target.value)} className="h-8 text-[13px]" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">商品目录</div>
                <div className="flex gap-2">
                  <Select value={categoryId || ''} onValueChange={handlePickCategory}>
                    <SelectTrigger className="w-full h-8 text-[13px] bg-white">
                      <SelectValue placeholder="请选择目录" />
                    </SelectTrigger>
                    <SelectContent>
                      {safeCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name || c.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="h-8 px-3 text-[13px]" onClick={onOpenCategoryManager}>
                    目录管理
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">品牌</div>
                <div className="flex gap-2">
                  <Select value={brandId || ''} onValueChange={handlePickBrand}>
                    <SelectTrigger className="w-full h-8 text-[13px] bg-white">
                      <SelectValue placeholder="请选择品牌" />
                    </SelectTrigger>
                    <SelectContent>
                      {safeBrands.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name || b.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="h-8 px-3 text-[13px]" onClick={onOpenBrandManager}>
                    品牌管理
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">单位</div>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-full h-8 text-[13px] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">产品销售链接</div>
                <Input value={salesLink} onChange={(e) => setSalesLink(e.target.value)} className="h-8 text-[13px]" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">开发员</div>
                <Select value={developer || ''} onValueChange={setDeveloper}>
                  <SelectTrigger className="w-full h-8 text-[13px] bg-white">
                    <SelectValue placeholder="请选择开发员" />
                  </SelectTrigger>
                  <SelectContent>
                    {userOptions.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">库存图片URL</div>
                <Input
                  value={inventoryImageUrl}
                  onChange={(e) => setInventoryImageUrl(e.target.value)}
                  className="h-8 text-[13px]"
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">虚拟SKU</div>
                <Input value={virtualSku} onChange={(e) => setVirtualSku(e.target.value)} className="h-8 text-[13px]" />
              </div>

              <div className="flex flex-col gap-1 col-span-3">
                <div className="text-gray-600">商品备注</div>
                <Input value={productNote} onChange={(e) => setProductNote(e.target.value)} className="h-8 text-[13px]" />
              </div>
              <div className="flex flex-col gap-1 col-span-3">
                <div className="text-gray-600">销售备注</div>
                <Input value={salesNote} onChange={(e) => setSalesNote(e.target.value)} className="h-8 text-[13px]" />
              </div>
              <div className="flex flex-col gap-1 col-span-3">
                <div className="text-gray-600">采购备注</div>
                <Input value={purchaseNote} onChange={(e) => setPurchaseNote(e.target.value)} className="h-8 text-[13px]" />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded">
            <div className="px-4 py-3 border-b border-gray-200 bg-[#F8FAFC] text-[13px] text-gray-700 font-medium">
              扩展属性
            </div>
            <div className="p-4 grid grid-cols-4 gap-4 text-[13px]">
              {extraAttrKeys.map((k) => (
                <div key={k} className="flex flex-col gap-1">
                  <div className="text-gray-600">{k}</div>
                  <Input
                    value={extraAttrs[k] || ''}
                    onChange={(e) => setExtraAttrs((prev) => ({ ...prev, [k]: e.target.value }))}
                    className="h-8 text-[13px]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded">
            <div className="px-4 py-3 border-b border-gray-200 bg-[#F8FAFC] text-[13px] text-gray-700 font-medium">
              仓库信息
            </div>
            <div className="p-4 grid grid-cols-3 gap-4 text-[13px]">
              <div ref={warehouseRowRef} className="flex flex-col gap-1">
                <div className="text-gray-600">
                  <span className="text-red-500">*</span> 仓库
                </div>
                <Select
                  value={warehouseInfo.warehouse || ''}
                  onValueChange={(v) => {
                    setWarehouseInfo((prev) => ({ ...prev, warehouse: v }))
                    setErrors((prev) => ({ ...prev, warehouse: undefined }))
                  }}
                >
                  <SelectTrigger className="w-full h-8 text-[13px] bg-white">
                    <SelectValue placeholder="请选择仓库" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseOptions.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.warehouse && <div className="text-red-500 text-[12px]">{errors.warehouse}</div>}
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">库存数量</div>
                <Input
                  type="number"
                  value={warehouseInfo.inventoryQty}
                  onChange={(e) => setWarehouseInfo((prev) => ({ ...prev, inventoryQty: toNumber(e.target.value) }))}
                  className="h-8 text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">盘点周期(天)</div>
                <Input
                  type="number"
                  value={warehouseInfo.inventoryCheckCycleDays}
                  onChange={(e) => setWarehouseInfo((prev) => ({ ...prev, inventoryCheckCycleDays: toNumber(e.target.value) }))}
                  className="h-8 text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">盘点员</div>
                <Select
                  value={warehouseInfo.inventoryChecker || ''}
                  onValueChange={(v) => setWarehouseInfo((prev) => ({ ...prev, inventoryChecker: v }))}
                >
                  <SelectTrigger className="w-full h-8 text-[13px] bg-white">
                    <SelectValue placeholder="请选择盘点员" />
                  </SelectTrigger>
                  <SelectContent>
                    {userOptions.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">采购天数</div>
                <Input
                  type="number"
                  value={warehouseInfo.purchaseDays}
                  onChange={(e) => setWarehouseInfo((prev) => ({ ...prev, purchaseDays: toNumber(e.target.value) }))}
                  className="h-8 text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">库存警戒天数</div>
                <Input
                  type="number"
                  value={warehouseInfo.stockAlertDays}
                  onChange={(e) => setWarehouseInfo((prev) => ({ ...prev, stockAlertDays: toNumber(e.target.value) }))}
                  className="h-8 text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-gray-600">预测日销量(个)</div>
                <Input
                  type="number"
                  value={warehouseInfo.forecastDailySales}
                  onChange={(e) => setWarehouseInfo((prev) => ({ ...prev, forecastDailySales: toNumber(e.target.value) }))}
                  className="h-8 text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">库存警戒</div>
                  {warehouseInfo.manualOverrides.stockAlertQty && (
                    <button className="text-blue-600 hover:underline text-[12px]" onClick={restoreStockAlertQty}>
                      恢复默认
                    </button>
                  )}
                </div>
                <Input
                  type="number"
                  value={warehouseInfo.stockAlertQty}
                  onChange={(e) =>
                    setWarehouseInfo((prev) => ({
                      ...prev,
                      stockAlertQty: toNumber(e.target.value),
                      manualOverrides: { ...prev.manualOverrides, stockAlertQty: true },
                    }))
                  }
                  className="h-8 text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">最小采购量</div>
                  {warehouseInfo.manualOverrides.minPurchaseQty && (
                    <button className="text-blue-600 hover:underline text-[12px]" onClick={restoreMinPurchaseQty}>
                      恢复默认
                    </button>
                  )}
                </div>
                <Input
                  type="number"
                  value={warehouseInfo.minPurchaseQty}
                  onChange={(e) =>
                    setWarehouseInfo((prev) => ({
                      ...prev,
                      minPurchaseQty: toNumber(e.target.value),
                      manualOverrides: { ...prev.manualOverrides, minPurchaseQty: true },
                    }))
                  }
                  className="h-8 text-[13px]"
                />
              </div>

              <div ref={purchaseUpperLimitRowRef} className="flex flex-col gap-1">
                <div className="text-gray-600">采购上限(0~100000)</div>
                <Input
                  type="number"
                  value={warehouseInfo.purchaseUpperLimit}
                  onChange={(e) => {
                    setWarehouseInfo((prev) => ({ ...prev, purchaseUpperLimit: toNumber(e.target.value) }))
                    setErrors((prev) => ({ ...prev, purchaseUpperLimit: undefined }))
                  }}
                  className="h-8 text-[13px]"
                />
                {errors.purchaseUpperLimit && <div className="text-red-500 text-[12px]">{errors.purchaseUpperLimit}</div>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="h-8 px-4 text-[13px]" onClick={handleCancel}>
              取消
            </Button>
            <Button className="h-8 px-4 text-[13px]" onClick={handleSave}>
              保存并返回
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
