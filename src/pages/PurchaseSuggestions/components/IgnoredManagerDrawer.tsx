import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { IgnoredSuggestion } from '../types';

function formatIgnoreType(type: IgnoredSuggestion['ignoreType']) {
  if (type === 'permanent') return '永久';
  return '本次';
}

export default function IgnoredManagerDrawer(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rows: IgnoredSuggestion[];
  onRestore: (id: string) => void;
  onClear: (id: string) => void;
}) {
  const { open, onOpenChange, rows, onRestore, onClear } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[980px]">
        <DialogHeader>
          <DialogTitle>忽略管理</DialogTitle>
        </DialogHeader>

        <div className="border border-gray-200 rounded overflow-hidden max-h-[520px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead className="bg-[#F5F6F8] sticky top-0 z-10">
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="p-2 min-w-[120px]">库存SKU</th>
                <th className="p-2 min-w-[200px]">中文名称</th>
                <th className="p-2 min-w-[120px]">仓库</th>
                <th className="p-2 min-w-[90px] text-center">建议采购数</th>
                <th className="p-2 min-w-[100px]">采购员</th>
                <th className="p-2 min-w-[100px]">忽略类型</th>
                <th className="p-2 min-w-[160px]">忽略时间</th>
                <th className="p-2 w-[150px] text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">
                    暂无忽略记录
                  </td>
                </tr>
              ) : (
                rows
                  .slice()
                  .sort((a, b) => b.ignoredAt - a.ignoredAt)
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="p-2 font-medium text-gray-800">{r.sku}</td>
                      <td className="p-2 text-gray-700">{r.name}</td>
                      <td className="p-2 text-gray-700">{r.warehouse}</td>
                      <td className="p-2 text-center text-gray-700">{r.suggestedQuantity ?? '-'}</td>
                      <td className="p-2 text-gray-700">{r.buyer}</td>
                      <td className="p-2 text-gray-700">{formatIgnoreType(r.ignoreType)}</td>
                      <td className="p-2 text-gray-700">{new Date(r.ignoredAt).toLocaleString()}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            className="h-7 px-3 text-[12px]"
                            onClick={() => onRestore(r.id)}
                          >
                            恢复
                          </Button>
                          <Button
                            variant="outline"
                            className="h-7 px-3 text-[12px] text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => onClear(r.id)}
                          >
                            清除
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
