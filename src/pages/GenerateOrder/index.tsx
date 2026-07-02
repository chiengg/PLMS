import React, { useEffect, useState } from 'react';
import { ChevronRight, Edit2, History, Trash2, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockOrders } from '@/pages/PurchaseManagement/mockData';

// Mocks
const mockOrderItems = [
  { id: '1', supplier: '深圳优声电子有限公司', buyer: '张伟', customOrderNo: '', sku: 'CN-BT-001', name: '无线蓝牙耳机 Pro Max', price: 100.00, deliveryDays: 14, quantity: 51 },
  { id: '2', supplier: '深圳优声电子有限公司', buyer: '张伟', customOrderNo: '', sku: 'CN-SP-009', name: '蓝牙音箱 防水款', price: 100.00, deliveryDays: 12, quantity: 14 },
];

const mockSites = [
  'Amazon-US',
  'Amazon-UK',
  'Amazon-DE',
  'eBay-US',
  'Shopee-SG',
  'Temu-US',
];

export default function GenerateOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItems = location.state?.selectedItems || [];
  
  const initialItems = selectedItems.length > 0 
    ? selectedItems.map((item: any) => ({
        id: item.id,
        supplier: item.supplierName || '未知供应商',
        buyer: item.buyer || '张伟',
        customOrderNo: '',
        sku: item.sku,
        name: item.name,
        price: item.purchasePrice || item.price || 100,
        deliveryDays: item.deliveryDays || 14,
        quantity: item.suggestedQuantity || item.quantity || 100
      }))
    : mockOrderItems;

  const [items, setItems] = useState(initialItems);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [buyerDialogOpen, setBuyerDialogOpen] = useState(false);
  const [customOrderNoDialogOpen, setCustomOrderNoDialogOpen] = useState(false);
  const [siteDialogOpen, setSiteDialogOpen] = useState(false);
  
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [currentSiteItemId, setCurrentSiteItemId] = useState<string | null>(null);
  const [currentGroupKey, setCurrentGroupKey] = useState<string | null>(null);
  const [newSupplier, setNewSupplier] = useState('');
  const [newBuyer, setNewBuyer] = useState('');
  const [newCustomOrderNo, setNewCustomOrderNo] = useState('');
  const [siteDraft, setSiteDraft] = useState<Array<{ siteName: string; qty: number }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orders, setOrders] = useLocalStorage<any[]>('purchase_orders_data_v11', mockOrders);
  const [extraByGroupKey, setExtraByGroupKey] = useState<Record<string, { shippingFee: number; discountAmount: number }>>(
    {}
  );

  const getExtra = (groupKey: string) => extraByGroupKey[groupKey] || { shippingFee: 0, discountAmount: 0 };
  const setExtraField = (groupKey: string, field: 'shippingFee' | 'discountAmount', value: number) => {
    setExtraByGroupKey((prev) => ({
      ...prev,
      [groupKey]: { ...(prev[groupKey] || { shippingFee: 0, discountAmount: 0 }), [field]: value },
    }));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map((item: any) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSupplierChange = () => {
    if (currentItemId && newSupplier) {
      const existingItemWithNewSupplier = items.find((i: any) => i.supplier === newSupplier && i.id !== currentItemId);
      const targetBuyer = existingItemWithNewSupplier 
        ? existingItemWithNewSupplier.buyer 
        : items.find((i: any) => i.id === currentItemId)?.buyer;
        
      setItems(items.map((item: any) => 
        item.id === currentItemId 
          ? { ...item, supplier: newSupplier, buyer: targetBuyer } 
          : item
      ));
    }
    setSupplierDialogOpen(false);
    setNewSupplier('');
  };

  const handleChangeToThisSupplier = (historySupplier: string, historyPrice: number) => {
    if (currentItemId && historySupplier) {
      const existingItemWithNewSupplier = items.find((i: any) => i.supplier === historySupplier && i.id !== currentItemId);
      const targetBuyer = existingItemWithNewSupplier 
        ? existingItemWithNewSupplier.buyer 
        : items.find((i: any) => i.id === currentItemId)?.buyer;
        
      setItems(items.map((item: any) => 
        item.id === currentItemId 
          ? { ...item, supplier: historySupplier, buyer: targetBuyer, price: historyPrice } 
          : item
      ));
    }
    setHistoryDialogOpen(false);
  };

  const handleBuyerChange = () => {
    if (!currentGroupKey || !newBuyer) return;
    const [supplier, buyer] = currentGroupKey.split('||');
    const nextGroupKey = `${supplier}||${newBuyer}`;
    setItems(
      items.map((item: any) =>
        item.supplier === supplier && item.buyer === buyer ? { ...item, buyer: newBuyer } : item
      )
    );
    setExtraByGroupKey((prev) => {
      const currentExtra = prev[currentGroupKey];
      if (!currentExtra) return prev;
      const next = { ...prev };
      delete next[currentGroupKey];
      next[nextGroupKey] = currentExtra;
      return next;
    });
    setBuyerDialogOpen(false);
    setNewBuyer('');
  };

  const handleCustomOrderNoChange = () => {
    // validate 12 chars alphanumeric
    const regex = /^[a-zA-Z0-9]{0,12}$/;
    if (!regex.test(newCustomOrderNo)) {
      alert('自定义单号只能包含字母和数字，且最长12位');
      return;
    }
    
    if (!currentGroupKey) return;
    const [supplier, buyer] = currentGroupKey.split('||');
    setItems(
      items.map((item: any) =>
        item.supplier === supplier && item.buyer === buyer ? { ...item, customOrderNo: newCustomOrderNo } : item
      )
    );
    setCustomOrderNoDialogOpen(false);
    setNewCustomOrderNo('');
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((item: any) => item.id !== id));
  };

  const openSiteDialog = (item: any) => {
    setCurrentSiteItemId(item.id);
    setSiteDialogOpen(true);
  };

  useEffect(() => {
    if (!siteDialogOpen) return;
    if (!currentSiteItemId) {
      setSiteDraft(mockSites.map((s) => ({ siteName: s, qty: 0 })));
      return;
    }
    const it = items.find((i: any) => i.id === currentSiteItemId);
    const existing = Array.isArray(it?.siteAllocations) ? it.siteAllocations : [];
    const map = new Map<string, number>(existing.map((x: any) => [String(x.siteName), Number(x.qty) || 0]));
    setSiteDraft(mockSites.map((s) => ({ siteName: s, qty: map.get(s) ?? 0 })));
  }, [currentSiteItemId, items, siteDialogOpen]);

  const groupedItems = items.reduce((acc: Record<string, { supplier: string; buyer: string; items: any[] }>, item: any) => {
    const supplier = String(item.supplier || '未知供应商');
    const buyer = String(item.buyer || '');
    const groupKey = `${supplier}||${buyer}`;
    if (!acc[groupKey]) acc[groupKey] = { supplier, buyer, items: [] };
    acc[groupKey].items.push(item);
    return acc;
  }, {});

  const handleSubmitOrder = () => {
    if (isSubmitting) return;
    if (items.length === 0) {
      alert('请先添加商品');
      return;
    }
    setIsSubmitting(true);
    
    const newOrders = Object.entries(groupedItems).map(([groupKey, group]: [string, any]) => {
      const groupItems = group.items;
      const firstItem = groupItems[0];
      const itemsAmount = groupItems.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
      const totalQty = groupItems.reduce((sum: number, i: any) => sum + i.quantity, 0);
      const extra = getExtra(groupKey);
      const orderShipping = extra.shippingFee || 0;
      const orderDiscount = extra.discountAmount || 0;
      const actualPayAmount = itemsAmount + orderShipping - orderDiscount;
      return {
        id: `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        orderNo: 'PO' + new Date().toISOString().replace(/\D/g, '').substring(0, 14),
        supplierName: group.supplier,
        actualPayAmount: actualPayAmount.toFixed(2),
        extraFee: orderShipping,
        discount: orderDiscount,
        status: '新订单（未提交）', // match management table format
        paymentStatus: '待申请',
        platformStatus: '--',
        logisticsStatus: '--',
        orderTime: new Date().toLocaleString(),
        orderCreator: '当前用户',
        buyer: firstItem.buyer,
        productTypesCount: groupItems.length,
        totalPurchaseQty: totalQty,
        inboundQty: 0,
        unInboundQty: totalQty,
        items: groupItems
      };
    });

    setOrders([...orders, ...newOrders]);
    
    // Remove the generated items from the original plans
    const sourceIds = items.map((i: any) => i.id);
    const existingPlans = JSON.parse(localStorage.getItem('purchase_plans_data_v2') || '[]');
    if (existingPlans.length > 0) {
      const updatedPlans = existingPlans.map((g: any) => ({
        ...g,
        items: g.items.filter((i: any) => !sourceIds.includes(i.id))
      })).filter((g: any) => g.items.length > 0);
      localStorage.setItem('purchase_plans_data_v2', JSON.stringify(updatedPlans));
    }

    setTimeout(() => {
      navigate('/purchase-management', { replace: true });
      try { window.close(); } catch (e) {}
    }, 600);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded px-6 py-4 text-[14px] text-gray-700 shadow-sm">
            正在创建采购单，请稍候...
          </div>
        </div>
      )}
      <div className="flex items-center text-gray-500 text-[13px] mb-4">
        <span>首页</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span>采购流程</span>
        <span className="mx-2"><ChevronRight className="w-3 h-3" /></span>
        <span className="text-gray-800 font-medium">生成采购单</span>
      </div>

      <div className="bg-white p-6 rounded shadow-sm border border-gray-200 mb-4">
        <h2 className="text-[16px] font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">商品信息</h2>
        
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([groupKey, group]: [string, any]) => {
            const supplier = group.supplier;
            const buyer = group.buyer;
            const groupItems = group.items;
            const firstItem = groupItems[0];
            const extra = getExtra(groupKey);
            const totalDeliveryDays = groupItems.reduce((sum: number, item: any) => sum + item.deliveryDays, 0);
            return (
              <div key={groupKey} className="border border-gray-200 rounded overflow-hidden">
                <div className="bg-[#F0F5FA] p-3 flex items-center justify-between border-b border-gray-200">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center text-blue-600 font-medium">
                      <span className="text-gray-600 font-normal mr-2">供应商:</span> 
                      {supplier}
                      <Edit2 
                        className="w-3.5 h-3.5 ml-2 text-gray-400 cursor-pointer hover:text-blue-600" 
                        onClick={() => {
                          setCurrentItemId(firstItem.id);
                          setSupplierDialogOpen(true);
                        }}
                      />
                    </div>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span className="text-gray-600 font-normal mr-2">自定义单据号:</span>
                      {firstItem.customOrderNo || '暂无'}
                      <Edit2 
                        className="w-3.5 h-3.5 ml-2 text-gray-400 cursor-pointer hover:text-blue-600" 
                        onClick={() => {
                          setCurrentGroupKey(groupKey);
                          setNewCustomOrderNo(firstItem.customOrderNo || '');
                          setCustomOrderNoDialogOpen(true);
                        }}
                      />
                    </div>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span className="text-gray-600 font-normal mr-2">采购员:</span>
                      {buyer || '暂无'}
                      <Edit2 
                        className="w-3.5 h-3.5 ml-2 text-gray-400 cursor-pointer hover:text-blue-600" 
                        onClick={() => {
                          setCurrentGroupKey(groupKey);
                          setNewBuyer(buyer || '');
                          setBuyerDialogOpen(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead className="bg-[#F5F6F8]">
                    <tr className="border-b border-gray-200 text-gray-600">
                      <th className="p-3 min-w-[200px]">库存SKU/中文名称</th>
                      <th className="p-3 w-24 text-center">单价</th>
                      <th className="p-3 w-24 text-center">到货天数</th>
                      <th className="p-3 w-24 text-center">数量</th>
                      <th className="p-3 w-24 text-center">小计</th>
                      <th className="p-3 min-w-[220px] text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {groupItems.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="text-blue-600 font-medium">{item.sku}</span>
                            <span className="text-gray-600 mt-1">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center text-blue-600 font-medium">
                          {item.price.toFixed(2)}
                        </td>
                        <td className="p-3">
                          <Input 
                            type="number"
                            min="1"
                            value={item.deliveryDays} 
                            onChange={(e) => updateItem(item.id, 'deliveryDays', parseInt(e.target.value) || 0)}
                            className="h-7 w-16 mx-auto text-center text-[12px]"
                          />
                        </td>
                        <td className="p-3">
                          <Input 
                            type="number"
                            value={item.quantity} 
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="h-7 w-16 mx-auto text-center text-[12px]"
                          />
                        </td>
                        <td className="p-3 text-center font-medium text-blue-600">
                          {(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              className="text-blue-600 hover:underline flex items-center"
                              onClick={() => {
                                setCurrentItemId(item.id);
                                setSupplierDialogOpen(true);
                              }}
                            >
                              更换供应商
                            </button>
                            <button 
                              className="text-green-600 hover:underline flex items-center"
                              onClick={() => {
                                setCurrentItemId(item.id);
                                setHistoryDialogOpen(true);
                              }}
                            >
                              查看采购记录
                            </button>
                            <button 
                              className="text-blue-600 hover:underline flex items-center"
                              onClick={() => openSiteDialog(item)}
                            >
                              站点关联
                            </button>
                            <button 
                              className="text-red-500 hover:underline flex items-center"
                              onClick={() => handleRemove(item.id)}
                            >
                              移除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t border-gray-200 bg-white p-4">
                  <h3 className="text-[14px] font-medium text-gray-800 mb-4">其他信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-24 text-right text-[13px] text-gray-600">物流公司</span>
                      <Select>
                        <SelectTrigger className="flex-1 h-8 text-[13px]">
                          <SelectValue placeholder="请选择物流公司" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sf">顺丰速运</SelectItem>
                          <SelectItem value="yto">圆通速递</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-24 text-right text-[13px] text-gray-600">快递单号</span>
                      <Input placeholder="仅限字母数字" className="flex-1 h-8 text-[13px]" pattern="[a-zA-Z0-9]*" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-24 text-right text-[13px] text-gray-600">物流运费</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={extra.shippingFee || ''}
                        onChange={(e) => setExtraField(groupKey, 'shippingFee', parseFloat(e.target.value) || 0)}
                        className="flex-1 h-8 text-[13px]"
                        data-testid={`shipping-fee-${groupKey}`}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-24 text-right text-[13px] text-gray-600">全部到货天数</span>
                      <Input readOnly value={totalDeliveryDays} className="flex-1 h-8 text-[13px] bg-gray-50 text-gray-500" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-24 text-right text-[13px] text-gray-600">折扣金额</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={extra.discountAmount || ''}
                        onChange={(e) => setExtraField(groupKey, 'discountAmount', parseFloat(e.target.value) || 0)}
                        className="flex-1 h-8 text-[13px]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-24 text-right text-[13px] text-gray-600">发票类型</span>
                      <Select>
                        <SelectTrigger className="flex-1 h-8 text-[13px]">
                          <SelectValue placeholder="请选择发票类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">普票</SelectItem>
                          <SelectItem value="vat">专票</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-24 text-right text-[13px] text-gray-600">税金</span>
                      <div className="flex flex-1 items-center gap-2">
                        <Select defaultValue="fixed">
                          <SelectTrigger className="w-24 h-8 text-[13px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">按固定</SelectItem>
                            <SelectItem value="ratio">按比例</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="number" placeholder="0.00" min="0" className="flex-1 h-8 text-[13px]" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-24 text-right text-[13px] text-gray-600">运费分摊方式</span>
                      <Select>
                        <SelectTrigger className="flex-1 h-8 text-[13px]">
                          <SelectValue placeholder="请选择分摊方式" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="qty">按数量</SelectItem>
                          <SelectItem value="weight">按重量</SelectItem>
                          <SelectItem value="volume">按包装后体积</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-24 text-right text-[13px] text-gray-600">收款方式</span>
                      <Select>
                        <SelectTrigger className="flex-1 h-8 text-[13px]">
                          <SelectValue placeholder="请选择收款方式" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部</SelectItem>
                          <SelectItem value="alipay">支付宝</SelectItem>
                          <SelectItem value="ebank">网银</SelectItem>
                          <SelectItem value="paypal">Paypal</SelectItem>
                          <SelectItem value="cash">现款</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-24 text-right text-[13px] text-gray-600">付款方式</span>
                      <Select>
                        <SelectTrigger className="flex-1 h-8 text-[13px]">
                          <SelectValue placeholder="请选择付款方式" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部</SelectItem>
                          <SelectItem value="alipay">支付宝</SelectItem>
                          <SelectItem value="cheng_e_she">诚e赊</SelectItem>
                          <SelectItem value="credit">账期支付</SelectItem>
                          <SelectItem value="bank">银行转账</SelectItem>
                          <SelectItem value="cross_border">跨境宝</SelectItem>
                          <SelectItem value="mybank">网商银行跨境直采</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-start gap-2 md:col-span-2 lg:col-span-3">
                      <span className="w-24 text-right text-[13px] text-gray-600 mt-2">留言</span>
                      <textarea
                        placeholder="请输入留言，200字以内"
                        maxLength={200}
                        className="flex-1 h-20 text-[13px] border border-input rounded-md px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-6 ml-26">
                    <div className="flex items-center gap-2">
                      <Checkbox id={`auto-submit-${groupKey}`} />
                      <label htmlFor={`auto-submit-${groupKey}`} className="text-[13px] text-gray-700 cursor-pointer">
                        自动提交采购单
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id={`auto-link-${groupKey}`} />
                      <label htmlFor={`auto-link-${groupKey}`} className="text-[13px] text-gray-700 cursor-pointer">
                        库存SKU自动关联仓库
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="p-8 text-center text-gray-500 border border-gray-200 rounded">暂无商品数据</div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button variant="outline" className="w-32" onClick={() => navigate(-1)}>取消</Button>
        <Button className="w-32 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmitOrder} disabled={isSubmitting}>
          {isSubmitting ? '提交中...' : '提交订单'}
        </Button>
      </div>

      {/* 弹窗：更换供应商 */}
      <Dialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>更换供应商</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={newSupplier} onValueChange={setNewSupplier}>
              <SelectTrigger className="w-full text-[13px]">
                <SelectValue placeholder="搜索选择新的供应商" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="深圳优声电子有限公司">深圳优声电子有限公司</SelectItem>
                <SelectItem value="广州能量科技有限公司">广州能量科技有限公司</SelectItem>
                <SelectItem value="东莞线材工厂">东莞线材工厂</SelectItem>
                <SelectItem value="广州市贝衣情纺织品有限公司">广州市贝衣情纺织品有限公司</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupplierDialogOpen(false)}>取消</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSupplierChange}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 弹窗：修改采购员 */}
      <Dialog open={buyerDialogOpen} onOpenChange={setBuyerDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>修改采购员</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={newBuyer} 
              onChange={(e) => setNewBuyer(e.target.value)} 
              placeholder="请输入采购员名称"
              className="w-full text-[13px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuyerDialogOpen(false)}>取消</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleBuyerChange}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 弹窗：自定义单号 */}
      <Dialog open={customOrderNoDialogOpen} onOpenChange={setCustomOrderNoDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>修改自定义单据号</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={newCustomOrderNo} 
              onChange={(e) => setNewCustomOrderNo(e.target.value)} 
              placeholder="请输入字母和数字，最多12位"
              maxLength={12}
              className="w-full text-[13px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomOrderNoDialogOpen(false)}>取消</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCustomOrderNoChange}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 弹窗：查看采购记录 */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>采购记录</DialogTitle>
          </DialogHeader>
          <div className="py-2 flex items-center text-[13px] text-gray-700 bg-blue-50 p-2 rounded">
            <span className="font-medium mr-2">商品:</span>
            {currentItemId ? (() => {
              const it = items.find((i: any) => i.id === currentItemId);
              return it ? `${it.sku} / ${it.name}` : '';
            })() : ''}
          </div>
          <div className="pb-4 overflow-auto">
            <table className="w-full text-left text-[12px] border-collapse border border-gray-200">
              <thead className="bg-[#F5F6F8]">
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="p-2">采购时间</th>
                  <th className="p-2">采购单号</th>
                  <th className="p-2">供应商</th>
                  <th className="p-2 text-center">运费</th>
                  <th className="p-2 text-center">单价</th>
                  <th className="p-2 text-center">数量</th>
                  <th className="p-2 text-center">总价</th>
                  <th className="p-2 text-center">入库量</th>
                  <th className="p-2 text-center">损耗量</th>
                  <th className="p-2 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="p-2 text-gray-500">2026-03-01 10:20</td>
                  <td className="p-2 text-blue-600">PO20260301001</td>
                  <td className="p-2">深圳优声电子有限公司</td>
                  <td className="p-2 text-center">15.00</td>
                  <td className="p-2 text-center">98.00</td>
                  <td className="p-2 text-center">100</td>
                  <td className="p-2 text-center">9800.00</td>
                  <td className="p-2 text-center text-green-600">100</td>
                  <td className="p-2 text-center">0</td>
                  <td className="p-2 text-center">
                    <button 
                      className="text-blue-600 hover:underline"
                      onClick={() => handleChangeToThisSupplier('深圳优声电子有限公司', 98.00)}
                    >
                      更换为此供应商
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={siteDialogOpen} onOpenChange={setSiteDialogOpen}>
        <DialogContent className="sm:max-w-[680px]">
          <DialogHeader>
            <DialogTitle>站点关联</DialogTitle>
          </DialogHeader>
          {(() => {
            const it = currentSiteItemId ? items.find((i: any) => i.id === currentSiteItemId) : null;
            const qty = Number(it?.quantity) || 0;
            const sum = siteDraft.reduce((acc, r) => acc + (Number(r.qty) || 0), 0);
            const remaining = qty - sum;
            const over = remaining < 0;
            const canSave = qty > 0 && remaining === 0;
            return (
              <div className="py-2">
                <div className="text-[13px] text-gray-700 bg-blue-50 p-2 rounded">
                  <div className="flex flex-wrap gap-x-6 gap-y-1">
                    <div><span className="font-medium">库存SKU：</span>{it?.sku || '--'}</div>
                    <div><span className="font-medium">名称：</span>{it?.name || '--'}</div>
                    <div><span className="font-medium">采购数量：</span>{qty}</div>
                  </div>
                </div>

                <div className="mt-3 border border-gray-200 rounded overflow-hidden">
                  <div className="bg-[#F5F6F8] px-3 py-2 text-[12px] text-gray-600 grid grid-cols-[1fr_140px] gap-2">
                    <div>站点名称</div>
                    <div className="text-center">关联数量</div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {siteDraft.map((row) => (
                      <div key={row.siteName} className="px-3 py-2 grid grid-cols-[1fr_140px] gap-2 items-center">
                        <div className="text-[13px] text-gray-800">{row.siteName}</div>
                        <div className="flex justify-center">
                          <Input
                            type="number"
                            min="0"
                            className="h-7 w-24 text-center text-[12px]"
                            value={row.qty}
                            onChange={(e) => {
                              const nextQty = Math.max(0, parseInt(e.target.value || '0', 10) || 0);
                              setSiteDraft((prev) => prev.map((p) => p.siteName === row.siteName ? { ...p, qty: nextQty } : p));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[13px]">
                  <div className="text-gray-600">
                    已分配 <span className="font-medium text-gray-800">{sum}</span>，剩余{' '}
                    <span className={over ? 'font-medium text-red-600' : 'font-medium text-gray-800'}>
                      {remaining}
                    </span>
                  </div>
                  {over && <div className="text-red-600">已超出采购数量</div>}
                  {!over && remaining !== 0 && <div className="text-amber-600">请将剩余数量分配完成</div>}
                </div>

                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setSiteDialogOpen(false)}>取消</Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!canSave}
                    onClick={() => {
                      if (!it) return;
                      const allocations = siteDraft
                        .map((r) => ({ siteName: r.siteName, qty: Number(r.qty) || 0 }))
                        .filter((r) => r.qty > 0);
                      setItems(items.map((x: any) => x.id === it.id ? { ...x, siteAllocations: allocations } : x));
                      setSiteDialogOpen(false);
                    }}
                  >
                    保存
                  </Button>
                </DialogFooter>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
