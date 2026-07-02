import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export type ColumnItem = { key: string; label: string; locked?: boolean }

export default function ColumnSettingsDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lockedColumns: ColumnItem[]
  columns: ColumnItem[]
  value: Record<string, boolean>
  onConfirm: (next: Record<string, boolean>) => void
  defaultValue: Record<string, boolean>
}) {
  const { open, onOpenChange, lockedColumns, columns, value, onConfirm, defaultValue } = props
  const [draft, setDraft] = React.useState<Record<string, boolean>>(value)

  React.useEffect(() => {
    if (!open) return
    setDraft(value)
  }, [open, value])

  const setAll = (checked: boolean) => {
    const next: Record<string, boolean> = { ...draft }
    columns.forEach((c) => {
      next[c.key] = checked
    })
    setDraft(next)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>列设置</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 py-2">
          <Button variant="outline" className="h-8 px-3 text-[13px]" onClick={() => setAll(true)}>
            全选
          </Button>
          <Button variant="outline" className="h-8 px-3 text-[13px]" onClick={() => setAll(false)}>
            全不选
          </Button>
          <Button variant="outline" className="h-8 px-3 text-[13px]" onClick={() => setDraft(defaultValue)}>
            恢复默认
          </Button>
        </div>

        <div className="max-h-[420px] overflow-auto border border-gray-200 rounded p-3">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
            {lockedColumns.map((c) => (
              <div key={c.key} className="flex items-center gap-2 text-gray-500">
                <Checkbox checked onCheckedChange={() => {}} disabled />
                <span>{c.label}</span>
              </div>
            ))}
            {columns.map((c) => (
              <div key={c.key} className="flex items-center gap-2 text-gray-700">
                <Checkbox
                  checked={draft[c.key] !== false}
                  onCheckedChange={(checked) => setDraft((p) => ({ ...p, [c.key]: !!checked }))}
                />
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="h-8" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="h-8 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              onConfirm(draft)
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

