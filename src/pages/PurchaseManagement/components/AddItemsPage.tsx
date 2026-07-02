import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AddItemsPage({ order, onClose, onSubmit }: { order: any, onClose: () => void, onSubmit: (newItems: any[]) => void }) {
  const [addedItems, setAddedItems] = useState<any[]>([]);
  
  // Dialog States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  
  // Add Modal States
  const [addSearchType, setAddSearchType] = useState('库存SKU');
  const [addSearchKeyword, setAddSearchKeyword] = useState('');
  const [addOnlySupplier, setAddOnlySupplier] = useState(false);
  const [addCloseAfter, setAddCloseAfter] = useState(true);
  const [selectedMockItems, setSelectedMockItems] = useState<any[]>([]);

  // Batch Modal States
  const [batchType, setBatchType] = useState('按库存SKU');
  const [batchText, setBatchText] = useState('');
  const [batchOnlySupplier, setBatchOnlySupplier] = useState(false);

  const mockSearchResults = [
    { id: 'm1', sku: '24273848-BU-A0-EaH', name: 'ET木质方形浴帘盒 樱桃木', warehouse: '东莞厚街库', stock: '10/5', unfulfilled: '2', sales: '10/30/50', price: 10.00 },
    { id: 'm2', sku: '10000011-WH-A0-ET_TQ', name: 'ET_TQ陶瓷花瓶_白色小号', warehouse: '东莞厚街库', stock: '20/10', unfulfilled: '5', sales: '15/45/80', price: 15.00 },
  ];

  const handleAddSubmit = () => {
    const newItems = selectedMockItems.map(m => ({
      id: Date.now().toString() + Math.random(),
      sku: m.sku,
      productName: m.name,
      warehouse: m.warehouse,
      price: m.price,
      quantity: 1,
      totalAmount: m.price,
      remark: ''
    }));
    setAddedItems([...addedItems, ...newItems]);
    setSelectedMockItems([]);
    if (addCloseAfter) {
      setShowAddModal(false);
    }
  };

  const handleBatchSubmit = () => {
    if (!batchText.trim()) return;
    const lines = batchText.split('\n');
    const newItems: any[] = [];
    lines.forEach(line => {
      const parts = line.split(/[\t,]/).map(s => s.trim());
      if (parts.length >= 1 && parts[0]) {
        const sku = parts[0];
        const qty = parts.length > 1 ? parseInt(parts[1]) || 1 : 1;
        const price = parts.length > 2 ? parseFloat(parts[2]) || 10.0 : 10.0;
        
        newItems.push({
          id: Date.now().toString() + Math.random(),
          sku: sku,
          productName: '批量添加商品',
          warehouse: order.warehouse || '东莞厚街库',
          price: price,
          quantity: qty,
          totalAmount: price * qty,
          remark: ''
        });
      }
    });
    
    setAddedItems([...addedItems, ...newItems]);
    setShowBatchModal(false);
    setBatchText('');
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...addedItems];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'price') {
      const qty = field === 'quantity' ? value : newItems[index].quantity;
      const price = field === 'price' ? value : newItems[index].price;
      newItems[index].totalAmount = (qty || 0) * (price || 0);
    }
    setAddedItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...addedItems];
    newItems.splice(index, 1);
    setAddedItems(newItems);
  };

  const finalSubmit = () => {
    onSubmit(addedItems);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 text-[13px]">
        <div className="flex items-center gap-12 font-medium text-gray-800">
          <div>订单号: {order.orderNo}</div>
          <div>供应商: {order.supplierName}</div>
        </div>
        <div className="font-medium text-gray-800">
          收货仓库: {order.warehouse || '东莞厚街库'}
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 flex items-center gap-4 border-b border-gray-100 bg-[#F8FAFC]">
        <FeatureMarker title="+添加商品" description="交互说明：点击打开新增弹窗，录入新数据。">
        <Button 
          variant="outline" 
          className="h-8 text-[#E6A23C] border-[#E6A23C] hover:bg-[#FDF6EC] hover:text-[#E6A23C] bg-white rounded-sm px-4"
          onClick={() => setShowAddModal(true)}
        >
          +添加商品
        </Button>
        </FeatureMarker>
        <FeatureMarker title="批量添加商品" description="交互说明：点击打开新增弹窗，录入新数据。">
        <Button 
          className="h-8 bg-[#E6A23C] hover:bg-[#CF9236] text-white rounded-sm px-4"
          onClick={() => setShowBatchModal(true)}
        >
          批量添加商品
        </Button>
        </FeatureMarker>
        <FeatureMarker title="+添加赠品" description="交互说明：点击打开新增弹窗，录入新数据。">
        <Button 
          variant="outline" 
          className="h-8 text-[#E6A23C] border-[#E6A23C] border-dashed hover:bg-[#FDF6EC] hover:text-[#E6A23C] bg-white rounded-sm px-4"
        >
          +添加赠品
        </Button>
        </FeatureMarker>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm text-center border-collapse">
          <thead className="bg-[#F8FAFC] text-gray-600 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 font-normal border-b border-gray-200">商品名称</th>
              <th className="py-3 px-4 font-normal border-b border-gray-200"><span className="text-red-500">*</span>采购价</th>
              <th className="py-3 px-4 font-normal border-b border-gray-200"><span className="text-red-500">*</span>数量</th>
              <th className="py-3 px-4 font-normal border-b border-gray-200"><span className="text-red-500">*</span>总价</th>
              <th className="py-3 px-4 font-normal border-b border-gray-200">备注</th>
              <th className="py-3 px-4 font-normal border-b border-gray-200 w-20">操作</th>
            </tr>
          </thead>
          <tbody>
            {addedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-gray-400">暂无数据</td>
              </tr>
            ) : (
              addedItems.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 shrink-0">
                        <img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=product%20thumbnail%20box&image_size=square" alt="商品" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-1 text-[12px]">
                        <span className="text-blue-600">{item.sku}</span>
                        <span className="text-gray-600">{item.productName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Input 
                      type="number" 
                      className="w-24 h-8 text-center mx-auto" 
                      value={item.price} 
                      onChange={e => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <Input 
                      type="number" 
                      className="w-20 h-8 text-center mx-auto" 
                      value={item.quantity} 
                      onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {Number(item.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <Input 
                      className="w-full h-8" 
                      value={item.remark} 
                      onChange={e => updateItem(idx, 'remark', e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <FeatureMarker title="删除" description="交互说明：点击删除选中的数据项，操作不可恢复。">
<span className="text-red-500 cursor-pointer hover:underline" onClick={() => removeItem(idx)}>删除</span>
</FeatureMarker>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 flex justify-end items-center gap-3 bg-white">
        <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 rounded-sm" onClick={onClose}>取消</Button>
</FeatureMarker>
        <FeatureMarker title="提交" description="交互说明：点击执行提交操作。">
<Button className="h-8 px-6 bg-[#E6A23C] hover:bg-[#CF9236] text-white rounded-sm" onClick={finalSubmit}>提交</Button>
</FeatureMarker>
      </div>

      {/* 添加商品 Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="!w-[1400px] !max-w-[1400px] h-[80vh] flex flex-col p-0 gap-0 overflow-x-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-left font-medium text-gray-800">添加商品</DialogTitle>
          </DialogHeader>
          <div className="p-4 flex flex-col gap-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-4 text-[13px]">
              <span className="text-gray-600">搜索类型:</span>
              <RadioGroup value={addSearchType} onValueChange={setAddSearchType} className="flex items-center gap-0 w-auto">
                {['库存SKU', '库存SKU名称', '库存SKU英文名称', '原厂SKU', '主SKU'].map(t => (
                  <label
                    key={t}
                    className={cn(
                      "px-4 py-1.5 cursor-pointer border select-none",
                      addSearchType === t ? "text-[#E6A23C] border-[#E6A23C]" : "text-gray-600 hover:text-gray-800 border-transparent"
                    )}
                  >
                    <RadioGroupItem value={t} className="hidden" />
                    {t}
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className="flex items-center gap-4 text-[13px]">
              <span className="text-gray-600">搜索内容:</span>
              <Input 
                className="w-64 h-8" 
                placeholder="请输入内容" 
                value={addSearchKeyword}
                onChange={e => setAddSearchKeyword(e.target.value)}
              />
              <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
<Button className="h-8 bg-[#E6A23C] hover:bg-[#CF9236] text-white px-6">搜索</Button>
</FeatureMarker>
              <label className="flex items-center gap-2 cursor-pointer ml-4">
                <Checkbox checked={addOnlySupplier} onCheckedChange={(c) => setAddOnlySupplier(!!c)} />
                <span className="text-gray-600">仅查询供应商下关联商品</span>
              </label>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4">
            <table className="w-full table-fixed text-center text-[12px] border border-gray-200">
              <thead className="bg-[#F8FAFC] text-gray-600 sticky top-0">
                <tr>
                  <th className="p-3 font-normal border-b border-r border-gray-200 w-10">
                    <Checkbox 
                      checked={selectedMockItems.length === mockSearchResults.length} 
                      onCheckedChange={(c) => setSelectedMockItems(c ? [...mockSearchResults] : [])} 
                    />
                  </th>
                  <th className="p-3 font-normal border-b border-r border-gray-200 w-20">缩略图</th>
                  <th className="p-3 font-normal border-b border-r border-gray-200 w-[360px]">商品信息</th>
                  <th className="p-3 font-normal border-b border-r border-gray-200 w-[160px]">仓库</th>
                  <th className="p-3 font-normal border-b border-r border-gray-200 w-[140px]">库存/在途量</th>
                  <th className="p-3 font-normal border-b border-r border-gray-200 w-[120px]">未发货量</th>
                  <th className="p-3 font-normal border-b border-gray-200 w-[160px]">7/28/42天销量</th>
                </tr>
              </thead>
              <tbody>
                {mockSearchResults.map(m => (
                  <tr key={m.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 border-r border-gray-200">
                      <Checkbox 
                        checked={selectedMockItems.some(i => i.id === m.id)}
                        onCheckedChange={(c) => {
                          if (c) setSelectedMockItems([...selectedMockItems, m]);
                          else setSelectedMockItems(selectedMockItems.filter(i => i.id !== m.id));
                        }}
                      />
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <div className="w-12 h-12 bg-gray-200 mx-auto">
                        <img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=product%20thumbnail%20box&image_size=square" alt="商品" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-3 border-r border-gray-200 text-left">
                      <div className="text-blue-600 truncate">{m.sku}</div>
                      <div className="text-gray-600 mt-1 truncate">{m.name}</div>
                    </td>
                    <td className="p-3 border-r border-gray-200 text-gray-600">{m.warehouse}</td>
                    <td className="p-3 border-r border-gray-200 text-gray-600">{m.stock}</td>
                    <td className="p-3 border-r border-gray-200 text-gray-600">{m.unfulfilled}</td>
                    <td className="p-3 text-gray-600">{m.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-center gap-4 mt-6 text-[13px] text-gray-600">
              <span>共 2 条</span>
              <div className="flex items-center gap-1">
                <span className="cursor-not-allowed text-gray-400">{'<'}</span>
                <span className="w-6 h-6 flex items-center justify-center border border-[#E6A23C] text-[#E6A23C]">1</span>
                <span className="cursor-not-allowed text-gray-400">{'>'}</span>
              </div>
              <select className="border border-gray-200 rounded px-2 py-1 outline-none">
                <option>10条/页</option>
              </select>
              <div className="flex items-center gap-2">
                前往 <Input className="w-12 h-7 text-center px-1" defaultValue="1" /> 页
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end items-center gap-4 shrink-0 bg-[#F8FAFC]">
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-600">
              <Checkbox 
                checked={addCloseAfter} 
                onCheckedChange={(c) => setAddCloseAfter(!!c)} 
                className="data-[state=checked]:bg-[#E6A23C] data-[state=checked]:border-[#E6A23C]"
              />
              添加后直接关闭窗口
            </label>
            <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 rounded-sm bg-white" onClick={() => setShowAddModal(false)}>关闭</Button>
</FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 px-6 bg-[#E6A23C] hover:bg-[#CF9236] text-white rounded-sm" onClick={handleAddSubmit}>确定</Button>
</FeatureMarker>
          </div>
        </DialogContent>
      </Dialog>

      {/* 批量添加商品 Modal */}
      <Dialog open={showBatchModal} onOpenChange={setShowBatchModal}>
        <DialogContent className="!w-[980px] !max-w-[980px] flex flex-col p-0 gap-0 overflow-x-hidden">
          <DialogHeader className="p-4 border-b border-gray-200">
            <DialogTitle className="text-left font-medium text-gray-800">批量添加商品</DialogTitle>
          </DialogHeader>
          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-center gap-6 text-[13px]">
              {['按库存SKU', '按库存SKU名称', '按原厂SKU'].map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <div className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center",
                    batchType === t ? "border-[#E6A23C]" : "border-gray-300"
                  )}>
                    {batchType === t && <div className="w-2 h-2 rounded-full bg-[#E6A23C]"></div>}
                  </div>
                  <input type="radio" className="hidden" checked={batchType === t} onChange={() => setBatchType(t)} />
                  {t}
                </label>
              ))}
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="text-[13px] text-gray-600 whitespace-nowrap">
                每行一个 <span className="text-[#E6A23C] font-medium">库存SKU,数量,单价</span> (最多500个种类)
              </div>
              <textarea 
                className="w-full h-48 border border-gray-200 rounded-sm p-3 text-[13px] focus:outline-none focus:border-[#E6A23C] resize-none"
                placeholder="请输入内容"
                value={batchText}
                onChange={e => setBatchText(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end items-center gap-4 bg-[#F8FAFC]">
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-600 mr-auto ml-2 whitespace-nowrap">
              <Checkbox 
                checked={batchOnlySupplier} 
                onCheckedChange={(c) => setBatchOnlySupplier(!!c)} 
              />
              仅查询供应商下关联商品
            </label>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 rounded-sm bg-white" onClick={() => setShowBatchModal(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 px-6 bg-[#E6A23C] hover:bg-[#CF9236] text-white rounded-sm" onClick={handleBatchSubmit}>确定</Button>
</FeatureMarker>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
