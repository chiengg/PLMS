import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { WarningType } from '../types';

export default function NotifyDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'single' | 'batch';
  payload: {
    shop: string;
    sku: string;
    name: string;
    warningTypes: WarningType[];
    availableStock: number;
    transitQty: number;
    forecastDailySales: number;
  }[];
}) {
  const { open, onOpenChange, mode, payload } = props;

  const text = payload
    .map((p) => {
      const suggestion = p.warningTypes.includes('断货风险')
        ? '存在断货风险，请采购加急催办到货或运营调整广告流速。'
        : '请关注备货风险并及时处理。';
      return `【ERP系统预警】备货商品异常通知\n店铺：${p.shop}\n商品：${p.sku} (${p.name})\n预警类型：${p.warningTypes.join(' / ') || '正常'}\n当前状态：可用库存 ${p.availableStock} 件，在途 ${p.transitQty} 件，日均销量 ${p.forecastDailySales}\n建议操作：${suggestion}\n[点击查看详情]`;
    })
    .join('\n\n---\n\n');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>{mode === 'batch' ? '批量发送预警通知' : '发送预警通知'}</DialogTitle>
        </DialogHeader>

        <div className="text-[13px] text-gray-600">
          {mode === 'batch' ? `已选 ${payload.length} 条` : '确认发送以下预警消息（示例）'}
        </div>

        <div className="mt-2 border border-gray-200 rounded bg-white p-3 max-h-[420px] overflow-auto custom-scrollbar whitespace-pre-wrap text-[12px] text-gray-800">
          {text || '暂无内容'}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              alert('已发送（示例）');
              onOpenChange(false);
            }}
          >
            确认发送
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

