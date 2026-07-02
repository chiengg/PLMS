import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { BRANDS_KEY, PRODUCTS_KEY, defaultBrands, defaultProductsFromLegacyMock } from '../data'
import type { Brand, Product } from '../types'

export default function BrandManagerDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [brands, setBrands] = useLocalStorage<Brand[]>(BRANDS_KEY, defaultBrands)
  const [products] = useLocalStorage<Product[]>(PRODUCTS_KEY, defaultProductsFromLegacyMock())

  const safeBrands = Array.isArray(brands) ? brands : []
  const safeProducts = Array.isArray(products) ? products : []

  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')

  const resetForm = () => {
    setEditingId(null)
    setName('')
  }

  useEffect(() => {
    if (!open) resetForm()
  }, [open])

  const startCreate = () => resetForm()

  const startEdit = (b: Brand) => {
    setEditingId(b.id)
    setName(b.name)
  }

  const handleSave = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      alert('请输入品牌名称')
      return
    }

    if (editingId) {
      setBrands((prev) => {
        const arr = Array.isArray(prev) ? prev : []
        return arr.map((b) => (b.id === editingId ? { ...b, name: trimmedName } : b))
      })
      resetForm()
      return
    }

    const id = `b_${Date.now()}`
    setBrands((prev) => {
      const arr = Array.isArray(prev) ? prev : []
      return [{ id, name: trimmedName }, ...arr]
    })
    resetForm()
  }

  const handleDelete = (b: Brand) => {
    const referenced = safeProducts.filter((p) => p.brandId === b.id)
    if (referenced.length > 0) {
      const skus = referenced
        .slice(0, 5)
        .map((p) => p.sku)
        .filter(Boolean)
        .join('、')
      alert(`该品牌已被 ${referenced.length} 个商品引用，无法删除${skus ? `（示例SKU：${skus}）` : ''}`)
      return
    }

    if (!confirm(`确认删除品牌「${b.name}」？`)) return
    setBrands((prev) => {
      const arr = Array.isArray(prev) ? prev : []
      return arr.filter((x) => x.id !== b.id)
    })
    if (editingId === b.id) resetForm()
  }

  const isEditing = Boolean(editingId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-[14px]">品牌管理</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="flex-1 min-w-0 border border-gray-200 rounded overflow-hidden">
            <div className="px-3 py-2 bg-[#F8FAFC] border-b border-gray-200 flex items-center justify-between">
              <div className="text-[13px] text-gray-700 font-medium">品牌列表</div>
              <Button className="h-8 px-3 text-[13px]" onClick={startCreate}>
                新增品牌
              </Button>
            </div>

            <div className="max-h-[420px] overflow-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-gray-600">
                    <th className="text-left font-medium p-2">名称</th>
                    <th className="text-center font-medium p-2 w-[120px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {safeBrands.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="p-2 text-gray-800">{b.name || '--'}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-blue-600 hover:underline" onClick={() => startEdit(b)}>
                            编辑
                          </button>
                          <button className="text-red-600 hover:underline" onClick={() => handleDelete(b)}>
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {safeBrands.length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-6 text-center text-gray-500">
                        暂无品牌
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-[320px] border border-gray-200 rounded overflow-hidden">
            <div className="px-3 py-2 bg-[#F8FAFC] border-b border-gray-200 flex items-center justify-between">
              <div className="text-[13px] text-gray-700 font-medium">{isEditing ? '编辑品牌' : '新增品牌'}</div>
              {isEditing && (
                <Button variant="ghost" className="h-8 px-2 text-[13px]" onClick={resetForm}>
                  取消编辑
                </Button>
              )}
            </div>

            <div className="p-3 flex flex-col gap-3 text-[13px]">
              <div className="flex flex-col gap-1">
                <span className="text-gray-600">名称</span>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-[13px]" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" className="h-8 px-3 text-[13px]" onClick={resetForm}>
                  清空
                </Button>
                <Button className="h-8 px-4 text-[13px]" onClick={handleSave}>
                  保存
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="h-8 px-4 text-[13px]" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
