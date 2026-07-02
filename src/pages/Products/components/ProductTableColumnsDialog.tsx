import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export type ProductTableFieldKey =
  | '原厂SKU'
  | '主SKU'
  | '最后入库时间'
  | '最后出库时间'
  | '库存SKU中文名称'
  | '库存SKU英文名称'
  | '申报品名(英文)'
  | '申报品名(中文)'
  | '销售员'
  | '仓库类型'
  | '预测日销量'
  | '在途量'
  | '包装个数'
  | '售价(RMB)'
  | '停止销售时间'
  | '统一成本价(RMB)'
  | '开发员'
  | '开发助理'
  | '品牌'
  | '商品形态'
  | '多属性'
  | '加工量'
  | 'top100'
  | '尺寸'
  | '包装后重量(kg)'
  | '包装后尺寸'
  | '装箱尺寸'
  | '装箱数'
  | '装箱毛重(kg)'
  | '创建时间'
  | '创建人员'
  | '商品目录'
  | '采购员'
  | '美工'
  | '自定义分类'
  | '附属销售员'
  | '商品备注'
  | '已配对在线量'
  | '可用库存'
  | '申报价格'
  | '预测入量'
  | 'NCM'
  | '箱数'
  | '缩略图'
  | '状态'
  | '库存总量(个)'
  | '未发货数量'
  | '销量(7/28/42)'
  | '重量(g)'
  | '默认供应商';

export type ProductTableFieldOption = {
  key: ProductTableFieldKey;
  label: string;
};

export default function ProductTableColumnsDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: ProductTableFieldOption[];
  value: ProductTableFieldKey[];
  onSave: (value: ProductTableFieldKey[]) => void;
}) {
  const { open, onOpenChange, options, value, onSave } = props;

  const validKeys = useMemo(() => new Set(options.map(o => o.key)), [options]);
  const sanitizedValue = useMemo(() => value.filter(k => validKeys.has(k)), [validKeys, value]);

  const [draft, setDraft] = useState<ProductTableFieldKey[]>(sanitizedValue);

  useEffect(() => {
    if (open) setDraft(sanitizedValue);
  }, [open, sanitizedValue]);

  const selectedCount = draft.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[840px] p-0 overflow-hidden bg-white rounded">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white">
          <DialogTitle className="text-[16px] font-medium text-blue-600">自定义列表字段</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <div className="grid grid-cols-6 gap-2">
            {options.map(opt => {
              const checked = draft.includes(opt.key);
              return (
                <label
                  key={opt.key}
                  className={[
                    "flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer select-none",
                    checked ? "bg-emerald-100 border border-emerald-300" : "bg-gray-50 border border-gray-200"
                  ].join(' ')}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(c) => {
                      const nextChecked = c === true;
                      setDraft(prev => {
                        if (nextChecked) {
                          if (prev.includes(opt.key)) return prev;
                          return [...prev, opt.key];
                        }
                        return prev.filter(k => k !== opt.key);
                      });
                    }}
                  />
                  <span className="text-[13px] text-gray-700 whitespace-nowrap">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-3">
          <div className="mr-auto text-[13px] text-gray-600">已选择 {selectedCount} 项</div>
          <Button variant="outline" className="h-8 px-6" onClick={() => onOpenChange(false)}>取消</Button>
          <Button className="h-8 px-6 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white" onClick={() => {
            onSave(draft.filter(k => validKeys.has(k)));
            onOpenChange(false);
          }}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
