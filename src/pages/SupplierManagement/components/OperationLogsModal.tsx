import React from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface OperationLogsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OperationLogsModal({ open, onOpenChange }: OperationLogsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] h-[600px] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="p-4 border-b border-gray-100 bg-[#F5F7FA] flex-shrink-0">
          <DialogTitle className="text-[14px] font-normal text-gray-800">操作日志</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-4 text-[12px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F5F7FA] text-gray-600">
              <tr>
                <th className="p-2 font-normal">操作人</th>
                <th className="p-2 font-normal">操作时间</th>
                <th className="p-2 font-normal">操作内容</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-gray-800">刘甜</td>
                <td className="p-2 text-gray-600">2026-04-24 14:12:30</td>
                <td className="p-2 text-gray-600">创建了供应商</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-gray-800">刘甜</td>
                <td className="p-2 text-gray-600">2026-04-24 15:00:12</td>
                <td className="p-2 text-gray-600">关联了库存SKU：10004506-PI-AM-TSG</td>
              </tr>
            </tbody>
          </table>
        </div>
        <DialogFooter className="p-4 border-t border-gray-100 bg-[#F5F7FA] flex-shrink-0 m-0 rounded-none sm:justify-end">
          <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white" onClick={() => onOpenChange(false)}>关闭</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
