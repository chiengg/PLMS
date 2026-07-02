import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import AddProductDialog, { ProductItem } from './components/AddProductDialog';

export default function ManualSuggestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [buyer, setBuyer] = useState('');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const returnTo = location.state?.returnTo || '/purchase-suggestions';
  const isPlan = returnTo === '/purchase-plans';
  const pageTitle = isPlan ? '手动创建采购计划' : '手动创建采购建议';

  const handleAddProducts = (newProducts: ProductItem[]) => {
    const existingIds = products.map(p => p.id);
    const added = newProducts.filter(p => !existingIds.includes(p.id));
    setProducts([...products, ...added]);
    if (error) setError('');
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!buyer) {
      setError('请选择采购员');
      return;
    }
    if (products.length === 0) {
      setError('请添加采购商品');
      return;
    }
    
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      // Navigate back to suggestions with the new items
      const payload = products.map(p => ({
        ...p,
        buyer
      }));
      
      if (isPlan) {
        navigate(returnTo, { state: { newPlans: payload } });
      } else {
        navigate(returnTo, { state: { newSuggestions: payload } });
      }
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center text-gray-500 text-[13px] mb-4">
        <span>首页</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span>采购流程</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span className="text-gray-800 font-medium">{pageTitle}</span>
      </div>

      <div className="bg-white p-6 rounded shadow-sm border border-gray-200 flex-1 flex flex-col">
        <h2 className="text-[16px] font-medium text-gray-800 mb-6">{pageTitle}</h2>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-[13px] font-medium text-gray-700 w-16 text-right">采购员<span className="text-red-500">*</span></span>
          <Select value={buyer} onValueChange={setBuyer}>
            <SelectTrigger className="w-64 h-8 text-[13px] border-gray-300">
              <SelectValue placeholder="选择采购员" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="张伟">张伟</SelectItem>
              <SelectItem value="王芳">王芳</SelectItem>
              <SelectItem value="李娜">李娜</SelectItem>
              <SelectItem value="陈静">陈静</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col flex-1">
          {error && <div className="text-red-500 text-[13px] mb-4 text-center">{error}</div>}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-gray-700 w-16 text-right">商品列表<span className="text-red-500">*</span></span>
            <Button className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-[13px]" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              添加采购商品
            </Button>
          </div>

          <div className="flex-1 border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead className="bg-[#F5F6F8] sticky top-0 z-10">
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="p-3 w-12 text-center">序号</th>
                  <th className="p-3 w-16 text-center">图片</th>
                  <th className="p-3 min-w-[120px]">库存SKU / 商品名称</th>
                  <th className="p-3 min-w-[100px]">属性</th>
                  <th className="p-3 w-16 text-center">单位</th>
                  <th className="p-3 min-w-[80px]">分类</th>
                  <th className="p-3 min-w-[80px]">品牌</th>
                  <th className="p-3 min-w-[160px]">默认供应商</th>
                  <th className="p-3 w-20 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">暂无数据，请点击右上角添加商品</td>
                  </tr>
                ) : (
                  products.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3 text-center text-gray-500">{idx + 1}</td>
                      <td className="p-3 text-center">
                        <div className="w-10 h-10 bg-gray-100 border border-gray-200 mx-auto rounded flex items-center justify-center overflow-hidden">
                          <span className="text-[8px] text-gray-400 break-all p-1 leading-tight text-center">IMG</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="text-blue-600 font-medium">{p.sku}</span>
                          <span className="text-gray-600 mt-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-500">{p.attr}</td>
                      <td className="p-3 text-center">{p.unit}</td>
                      <td className="p-3">{p.category}</td>
                      <td className="p-3">{p.brand}</td>
                      <td className="p-3 text-gray-600">{p.defaultSupplier}</td>
                      <td className="p-3 text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 mx-auto"
                          onClick={() => handleRemoveProduct(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" className="w-24" onClick={() => navigate(-1)} disabled={isLoading}>取消</Button>
          <Button className="w-24 bg-blue-600 hover:bg-blue-700 relative" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                保存中...
              </div>
            ) : '保存'}
          </Button>
        </div>
      </div>

      <AddProductDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onAdd={handleAddProducts} 
      />
    </div>
  );
}
