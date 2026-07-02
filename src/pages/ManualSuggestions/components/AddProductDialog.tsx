import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  attr: string;
  unit: string;
  link: string;
  category: string;
  brand: string;
  defaultSupplier: string;
}

const mockProducts: ProductItem[] = [
  { id: '1', sku: 'CN-BT-001', name: '无线蓝牙耳机 Pro Max', attr: '黑色/标准', unit: '件', link: 'https://example.com/p1', category: '3C数码', brand: '男装', defaultSupplier: '深圳优声电子有限公司' },
  { id: '2', sku: 'CN-SP-009', name: '蓝牙音箱 防水款', attr: '蓝色/防水', unit: '个', link: 'https://example.com/p2', category: '3C数码', brand: '原品牌站商品', defaultSupplier: '深圳优声电子有限公司' },
  { id: '3', sku: 'CN-PB-002', name: '便携式充电宝 20000mAh', attr: '白色', unit: '件', link: 'https://example.com/p3', category: '3C数码', brand: '女装', defaultSupplier: '广州能量科技有限公司' },
];

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (products: ProductItem[]) => void;
}

export default function AddProductDialog({ open, onOpenChange, onAdd }: AddProductDialogProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredProducts = mockProducts.filter(p => 
    p.name.includes(search) || p.sku.includes(search)
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const handleConfirm = () => {
    const selected = mockProducts.filter(p => selectedIds.includes(p.id));
    onAdd(selected);
    onOpenChange(false);
    setSelectedIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>添加采购商品</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-2 my-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="商品名称/SKU 关键字模糊查询" 
              className="pl-8 text-[13px]"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <FeatureMarker title="查询" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
<Button className="bg-blue-600 hover:bg-blue-700">查询</Button>
</FeatureMarker>
        </div>

        <div className="border border-gray-200 rounded overflow-hidden mt-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="p-2 w-10 text-center">
                  <Checkbox 
                    checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-2 w-12 text-center">图片</th>
                <th className="p-2">SKU</th>
                <th className="p-2">商品名称</th>
                <th className="p-2">属性</th>
                <th className="p-2">单位</th>
                <th className="p-2">分类</th>
                <th className="p-2">品牌</th>
                <th className="p-2">默认供应商</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-2 text-center">
                    <Checkbox 
                      checked={selectedIds.includes(p.id)}
                      onCheckedChange={(checked) => handleSelect(!!checked, p.id)}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <div className="w-8 h-8 bg-gray-100 border border-gray-200 mx-auto rounded flex items-center justify-center">
                      <span className="text-[8px] text-gray-400">IMG</span>
                    </div>
                  </td>
                  <td className="p-2 text-blue-600">{p.sku}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2 text-gray-500">{p.attr}</td>
                  <td className="p-2">{p.unit}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">{p.brand}</td>
                  <td className="p-2 text-gray-600 truncate max-w-[120px]">{p.defaultSupplier}</td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-4 text-center text-gray-500">未找到商品</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <DialogFooter className="mt-4">
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
          <FeatureMarker title="确认" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirm}>确认</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
