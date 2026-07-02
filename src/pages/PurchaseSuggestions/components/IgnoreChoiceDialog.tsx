import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { IgnoreType } from '../types';

export default function IgnoreChoiceDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (type: IgnoreType) => void;
}) {
  const { open, onOpenChange, onConfirm } = props;
  const [type, setType] = React.useState<IgnoreType>('once');

  React.useEffect(() => {
    if (!open) return;
    setType('once');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>忽略建议</DialogTitle>
          <DialogDescription className="py-2 text-[13px] text-gray-600">
            请选择忽略类型：本次忽略仅隐藏本次建议；永久忽略将不再生成该SKU的采购建议（直到恢复）。
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 text-[13px] text-gray-700">
          <div className="flex items-center gap-4">
            <div className="text-[13px] text-gray-600">忽略类型：</div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="ignore-type"
                checked={type === 'once'}
                onChange={() => setType('once')}
              />
              <span>本次忽略</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="ignore-type"
                checked={type === 'permanent'}
                onChange={() => setType('permanent')}
              />
              <span>永久忽略</span>
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => onConfirm(type)}
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
