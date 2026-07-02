import React, { useState, useEffect } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface InspectReceiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  onSuccess: () => void;
}

export default function InspectReceiveModal({ open, onOpenChange, order, onSuccess }: InspectReceiveModalProps) {
  const [globalOrders, setGlobalOrders] = useLocalStorage<any[]>('purchase_orders_data_v11', []);
  const [products, setProducts] = useState<any[]>([]);
  const [signNote, setSignNote] = useState('');

  useEffect(() => {
    if (open && order) {
      // Map products
      const mappedProducts = (order.items || []).map((item: any, idx: number) => {
        const purchaseQty = Number(item.quantity) || 0;
        const receivedCount = Number(item.receivedQty) || 0;
        const remainingQty = Math.max(0, purchaseQty - receivedCount);

        return {
          ...item,
          id: item.id || String(idx),
          purchaseQty,
          receivedCount,
          warehousingQty: String(remainingQty),
          lossQty: '0',
          weight: '0.0',
          exceptionReason: '',
        };
      });

      // If no items but has productCount
      if (!order.items || order.items.length === 0) {
        const purchaseQty = Number(order.productCount) || order.totalPurchaseQty || 0;
        const receivedCount = Number(order.receivedCount) || 0;
        const remainingQty = Math.max(0, purchaseQty - receivedCount);
        mappedProducts.push({
          id: '1',
          name: order.productName || '未知商品',
          sku: order.sku || '未知SKU',
          image: order.productImage,
          purchaseQty,
          receivedCount,
          warehousingQty: String(remainingQty),
          lossQty: '0',
          weight: '0.0',
          exceptionReason: '',
        });
      }

      setProducts(mappedProducts);
    }
  }, [open, order]);

  const updateProduct = (index: number, field: string, value: any) => {
    const newProducts = [...products];
    const current = newProducts[index];
    
    let numValue = Number(value);
    if (field === 'warehousingQty') {
      const maxAllowed = Math.max(0, current.purchaseQty - current.receivedCount);
      if (numValue > maxAllowed) {
        alert(`本次入库量不能大于剩余未入库数量 (${maxAllowed})`);
        numValue = maxAllowed;
      }
      newProducts[index] = { ...current, warehousingQty: String(numValue) };
    } else {
      newProducts[index] = { ...current, [field]: value };
    }
    
    setProducts(newProducts);
  };

  const handleConfirm = () => {
    const newTotalWarehoused = products.reduce((sum, p) => sum + (Number(p.warehousingQty) || 0), 0);
    
    setGlobalOrders(prev => prev.map(o => {
      if (o.id === order.id || o.orderNo === order.orderNo) {
        let updatedItems = o.items;
        if (o.items && o.items.length > 0) {
          updatedItems = o.items.map((item: any, idx: number) => {
            const matched = products.find(p => p.id === item.id || p.id === String(idx));
            if (matched) {
              return {
                ...item,
                receivedQty: (item.receivedQty || 0) + (Number(matched.warehousingQty) || 0)
              };
            }
            return item;
          });
        }

        const updatedReceivedCount = (o.receivedCount || 0) + newTotalWarehoused;
        const totalCount = updatedItems?.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0) || o.productCount || o.totalPurchaseQty || 0;
        const actualTotalReceived = updatedItems?.reduce((sum: number, item: any) => sum + (Number(item.receivedQty) || 0), 0) || updatedReceivedCount;
        
        let newStatus = o.status;
        if (actualTotalReceived >= totalCount) {
          newStatus = '已完成';
        } else if (actualTotalReceived > 0) {
          newStatus = '部分到货';
        }

        return { 
          ...o, 
          items: updatedItems,
          receivedCount: updatedReceivedCount,
          status: newStatus 
        };
      }
      return o;
    }));

    alert('入库成功！');
    onSuccess();
    onOpenChange(false);
  };

  if (!order) return null;

  const totalPurchase = products.reduce((sum, p) => sum + p.purchaseQty, 0);
  const totalInbound = products.reduce((sum, p) => sum + p.receivedCount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="p-4 border-b border-gray-200 bg-[#F5F7FA] flex-shrink-0">
          <DialogTitle className="text-[14px] font-normal text-gray-700">
            采购单号：{order.orderNo} (下单日期：{order.orderTime || order.createTime})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-white flex flex-col text-[12px]">
          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-100">
            <div className="flex items-center">
              <span className="w-24 text-right text-gray-500">快递单号：</span>
              <span className="text-gray-800">{order.trackingNo || '--'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-right text-gray-500">状态：</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[11px]">{order.status}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-right text-gray-500">总采购数量：</span>
              <span className="text-gray-800">{totalPurchase}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-right text-gray-500">总入库数量：</span>
              <span className="text-gray-800">{totalInbound}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-right text-gray-500">仓库：</span>
              <span className="text-gray-800">{order.warehouse || '默认仓库'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-right text-gray-500">不良品仓：</span>
              <span className="text-gray-800">--</span>
            </div>
            <div className="flex items-center col-span-2">
              <span className="w-24 text-right text-gray-500">备注：</span>
              <span className="text-gray-800">{order.orderNote || '--'}</span>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-4">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border border-gray-200">
                <tr className="text-gray-600 text-center">
                  <th className="p-2 font-normal border-r border-gray-200 w-16">缩略图</th>
                  <th className="p-2 font-normal border-r border-gray-200 text-left min-w-[200px]">SKU/原厂SKU/商品名称</th>
                  <th className="p-2 font-normal border-r border-gray-200">采购单价</th>
                  <th className="p-2 font-normal border-r border-gray-200">重量</th>
                  <th className="p-2 font-normal border-r border-gray-200">仓位</th>
                  <th className="p-2 font-normal border-r border-gray-200">总入库/采购量</th>
                  <th className="p-2 font-normal border-r border-gray-200">本次实际入库</th>
                  <th className="p-2 font-normal border-r border-gray-200">本次损耗量</th>
                  <th className="p-2 font-normal border-r border-gray-200">本次异常原因</th>
                </tr>
              </thead>
              <tbody className="border border-gray-200">
                {products.map((p, i) => (
                  <tr key={p.id} className="border-b border-gray-200 hover:bg-blue-50/30">
                    <td className="p-2 border-r border-gray-200 text-center align-middle">
                      <img src={p.image || p.productImage || 'https://via.placeholder.com/40'} alt="img" className="w-10 h-10 object-cover mx-auto border border-gray-200 rounded" />
                    </td>
                    <td className="p-2 border-r border-gray-200">
                      <div className="text-blue-600 font-medium">{p.sku || p.inventorySku}</div>
                      <div className="text-gray-500">{p.originalSku || '原厂SKU'}</div>
                      <div className="text-gray-800 mt-1">{p.name || p.productName}</div>
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center">
                      <Input className="h-7 w-16 mx-auto text-center text-[12px]" value={p.price || '0.00'} readOnly />
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center">
                      <Input className="h-7 w-16 mx-auto text-center text-[12px]" value={p.weight} onChange={e => updateProduct(i, 'weight', e.target.value)} />
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center">001</td>
                    <td className="p-2 border-r border-gray-200 text-center text-gray-600">
                      {p.receivedCount}/{p.purchaseQty}
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center">
                      <Input 
                        type="number"
                        className="h-7 w-20 mx-auto text-center text-[12px] text-blue-600 font-medium" 
                        value={p.warehousingQty} 
                        onChange={e => updateProduct(i, 'warehousingQty', e.target.value)} 
                      />
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center">
                      <Input 
                        type="number"
                        className="h-7 w-16 mx-auto text-center text-[12px]" 
                        value={p.lossQty} 
                        onChange={e => updateProduct(i, 'lossQty', e.target.value)} 
                      />
                    </td>
                    <td className="p-2 text-center">
                      <select 
                        className="h-7 w-24 border border-gray-300 rounded px-1 outline-none text-[12px] mx-auto"
                        value={p.exceptionReason}
                        onChange={(e) => updateProduct(i, 'exceptionReason', e.target.value)}
                      >
                        <option value="">请选择</option>
                        <option value="破损">破损</option>
                        <option value="少件">少件</option>
                        <option value="错发">错发</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex gap-4 items-start">
              <span className="text-gray-700 mt-2 font-medium">附加收货注</span>
              <textarea 
                className="flex-1 border border-gray-300 rounded p-2 outline-none resize-none h-20"
                value={signNote}
                onChange={e => setSignNote(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-gray-200 bg-[#F5F7FA] sm:justify-between flex items-center justify-between flex-shrink-0 m-0 rounded-none">
          <div className="text-[12px] text-gray-600 flex gap-6">
            <span>本次实际入库总数：<span className="font-medium text-gray-800">{products.reduce((sum, p) => sum + (Number(p.warehousingQty)||0), 0)}</span></span>
            <span>本次实际入库种类：<span className="font-medium text-gray-800">{products.length}</span></span>
            <span className="text-red-500 hidden sm:inline">入库后将会修改成本价如需修改请到【采购管理】-&gt;【采购设置】进行修改配置</span>
          </div>
          <div className="flex gap-2">
            <FeatureMarker title="打印商品标签" description="交互说明：点击执行打印商品标签操作。">
<Button variant="outline" className="h-8 text-[13px] bg-[#6B8EBE] text-white hover:bg-[#5A7BA8] hover:text-white border-0">打印商品标签</Button>
</FeatureMarker>
            <FeatureMarker title="打印入库单" description="交互说明：点击执行打印入库单操作。">
<Button variant="outline" className="h-8 text-[13px] bg-[#6B8EBE] text-white hover:bg-[#5A7BA8] hover:text-white border-0">打印入库单</Button>
</FeatureMarker>
            <FeatureMarker title="确定入库" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfirm}>确定入库</Button>
</FeatureMarker>
            <FeatureMarker title="返回" description="交互说明：点击执行返回操作。">
<Button variant="outline" className="h-8 text-[13px] bg-white" onClick={() => onOpenChange(false)}>返回</Button>
</FeatureMarker>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
