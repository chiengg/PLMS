import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { CATEGORIES_KEY, PRODUCTS_KEY, defaultCategories, defaultProductsFromLegacyMock } from '../data'
import type { Category, Product } from '../types'

export default function CategoryManagerDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [categories, setCategories] = useLocalStorage<Category[]>(CATEGORIES_KEY, defaultCategories)
  const [products] = useLocalStorage<Product[]>(PRODUCTS_KEY, defaultProductsFromLegacyMock())

  const safeCategories = Array.isArray(categories) ? categories : []
  const safeProducts = Array.isArray(products) ? products : []

  const categoryById = useMemo(() => {
    const map = new Map<string, Category>()
    for (const c of safeCategories) map.set(c.id, c)
    return map
  }, [safeCategories])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [hsCode, setHsCode] = useState('')
  const [multiAttr, setMultiAttr] = useState(false)
  const [parentId, setParentId] = useState('')

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setDescription('')
    setHsCode('')
    setMultiAttr(false)
    setParentId('')
  }

  useEffect(() => {
    if (!open) resetForm()
  }, [open])

  const startCreate = () => resetForm()

  const startEdit = (c: Category) => {
    setEditingId(c.id)
    setName(c.name)
    setDescription(c.description)
    setHsCode(c.hsCode)
    setMultiAttr(c.multiAttr)
    setParentId(c.parentId)
  }

  const handleSave = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      alert('请输入目录名称')
      return
    }

    const nextBase: Omit<Category, 'id'> = {
      name: trimmedName,
      description: description.trim(),
      hsCode: hsCode.trim(),
      multiAttr,
      parentId,
    }

    if (editingId) {
      setCategories((prev) => {
        const arr = Array.isArray(prev) ? prev : []
        return arr.map((c) => (c.id === editingId ? { ...c, ...nextBase } : c))
      })
      resetForm()
      return
    }

    const id = `c_${Date.now()}`
    setCategories((prev) => {
      const arr = Array.isArray(prev) ? prev : []
      return [{ id, ...nextBase }, ...arr]
    })
    resetForm()
  }

  const handleDelete = (c: Category) => {
    const referenced = safeProducts.filter((p) => p.categoryId === c.id)
    if (referenced.length > 0) {
      const skus = referenced
        .slice(0, 5)
        .map((p) => p.sku)
        .filter(Boolean)
        .join('、')
      alert(`该目录已被 ${referenced.length} 个商品引用，无法删除${skus ? `（示例SKU：${skus}）` : ''}`)
      return
    }

    const children = safeCategories.filter((x) => x.parentId === c.id)
    if (children.length > 0) {
      alert(`该目录存在 ${children.length} 个子目录，请先调整父级再删除`)
      return
    }

    if (!confirm(`确认删除目录「${c.name}」？`)) return
    setCategories((prev) => {
      const arr = Array.isArray(prev) ? prev : []
      return arr.filter((x) => x.id !== c.id)
    })
    if (editingId === c.id) resetForm()
  }

  const parentOptions = useMemo(() => {
    const opts = safeCategories
      .filter((c) => c.id !== editingId)
      .map((c) => ({ value: c.id, label: c.name || c.id }))
    return [{ value: '__root__', label: '无' }, ...opts]
  }, [editingId, safeCategories])

  const parentValue = parentId || '__root__'
  const isEditing = Boolean(editingId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-[14px]">目录管理</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="flex-1 min-w-0 border border-gray-200 rounded overflow-hidden">
            <div className="px-3 py-2 bg-[#F8FAFC] border-b border-gray-200 flex items-center justify-between">
              <div className="text-[13px] text-gray-700 font-medium">目录列表</div>
              <Button className="h-8 px-3 text-[13px]" onClick={startCreate}>
                新增目录
              </Button>
            </div>

            <div className="max-h-[420px] overflow-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-gray-600">
                    <th className="text-left font-medium p-2 w-[180px]">名称</th>
                    <th className="text-left font-medium p-2">描述</th>
                    <th className="text-left font-medium p-2 w-[140px]">报关编码</th>
                    <th className="text-center font-medium p-2 w-[90px]">多属性</th>
                    <th className="text-left font-medium p-2 w-[160px]">父级</th>
                    <th className="text-center font-medium p-2 w-[120px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {safeCategories.map((c) => {
                    const parentName = c.parentId ? categoryById.get(c.parentId)?.name || c.parentId : '--'
                    return (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="p-2 text-gray-800">{c.name || '--'}</td>
                        <td className="p-2 text-gray-600">{c.description || '--'}</td>
                        <td className="p-2 text-gray-600">{c.hsCode || '--'}</td>
                        <td className="p-2 text-center text-gray-600">{c.multiAttr ? '是' : '否'}</td>
                        <td className="p-2 text-gray-600">{parentName}</td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="text-blue-600 hover:underline" onClick={() => startEdit(c)}>
                              编辑
                            </button>
                            <button className="text-red-600 hover:underline" onClick={() => handleDelete(c)}>
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {safeCategories.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500">
                        暂无目录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-[360px] border border-gray-200 rounded overflow-hidden">
            <div className="px-3 py-2 bg-[#F8FAFC] border-b border-gray-200 flex items-center justify-between">
              <div className="text-[13px] text-gray-700 font-medium">{isEditing ? '编辑目录' : '新增目录'}</div>
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

              <div className="flex flex-col gap-1">
                <span className="text-gray-600">描述</span>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} className="h-8 text-[13px]" />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-600">报关编码</span>
                <Input value={hsCode} onChange={(e) => setHsCode(e.target.value)} className="h-8 text-[13px]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">多属性</span>
                <Checkbox checked={multiAttr} onCheckedChange={(v) => setMultiAttr(!!v)} />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-600">父级</span>
                <Select
                  value={parentValue}
                  onValueChange={(v) => {
                    setParentId(v === '__root__' ? '' : v)
                  }}
                >
                  <SelectTrigger className="w-full h-8 text-[13px] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {parentOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
