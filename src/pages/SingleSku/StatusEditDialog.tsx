import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { SingleSkuStatus } from './types'

export default function StatusEditDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  options: SingleSkuStatus[]
  onConfirm: (status: SingleSkuStatus) => void
}) {
  const { open, onOpenChange, options, onConfirm } = props
  const [status, setStatus] = React.useState<SingleSkuStatus | ''>('')

  React.useEffect(() => {
    if (!open) return
    setStatus('')
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>修改状态</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <div className="text-[12px] text-gray-600 mb-2">状态</div>
          <select
            className={`h-9 w-full rounded-md border border-gray-300 bg-white px-3 ${
              status ? 'text-[13px] text-gray-700' : 'text-[12px] text-gray-400'
            }`}
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="">请选择状态</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!status}
            onClick={() => {
              if (!status) return
              onConfirm(status)
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

