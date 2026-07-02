import React, { useState, useMemo } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Trash2, Send, Check, ChevronsUpDown, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import AddItemsPage from './AddItemsPage'; // We can reuse this for the inner dialog

export default function AddOrderDialog({ open, onOpenChange, onAddOrder }: { open: boolean, onOpenChange: (open: boolean) => void, onAddOrder: (order: any) => void }) {
  const [warehouse, setWarehouse] = useState('');
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState<any[]>([]);
  
  // Inner dialogs
  const [showAddItems, setShowAddItems] = useState(false);
  const [showBatchAddItems, setShowBatchAddItems] = useState(false);
  const [openSupplierSelect, setOpenSupplierSelect] = useState(false);

  const supplierOptions = [
    { value: '曹县委要王工艺有限公司', label: '曹县委要王工艺有限公司' },
    { value: '肃宁县优创服装厂(test)', label: '肃宁县优创服装厂(test)' },
    { value: '义乌市俊领服装厂', label: '义乌市俊领服装厂' }
  ];

  // Add Item Dialog States
  const [skuSearchType, setSkuSearchType] = useState('库存SKU');
  const [skuStatus, setSkuStatus] = useState('全部');
  const [skuKeyword, setSkuKeyword] = useState('');
  const [onlyCurrentSupplier, setOnlyCurrentSupplier] = useState(false);
  const [onlyOutOfStock, setOnlyOutOfStock] = useState(true);
  const [skuSelections, setSkuSelections] = useState<Record<string, boolean>>({});
  const [closeAfterAdd, setCloseAfterAdd] = useState(true);

  const mockSkuList = [
    { id: '1', sku: '10005530-test', name: 'GY圣诞树陶瓷片圆形挂件', warehouse: '东莞厚街仓', stock: 100, inTransit: 50, sales: '10/50/100' },
    { id: '2', sku: '24273848-BU-A0-EaH', name: 'ET木质方形浴帘盒 樱桃木', warehouse: '义乌仓', stock: 0, inTransit: 0, sales: '0/5/12' },
    { id: '3', sku: '99883841-BC-A4XL-DIA', name: '单件定制_连体泳衣_4XL', warehouse: '东莞厚街仓', stock: 20, inTransit: 10, sales: '5/10/20' }
  ];

  // Batch Add Items States
  const [batchSearchType, setBatchSearchType] = useState('按库存SKU');
  const [batchInputText, setBatchInputText] = useState('');
  const [customOrderNo, setCustomOrderNo] = useState('');
  const [freight, setFreight] = useState('');
  const [logisticsCompany, setLogisticsCompany] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [freightApportionType, setFreightApportionType] = useState('按数量');
  const [invoiceType, setInvoiceType] = useState('普票');
  const [taxType, setTaxType] = useState('按固定值');
  const [tax, setTax] = useState('');
  const [orderType, setOrderType] = useState('缺货采购');
  const [buyer, setBuyer] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [collectionMethod, setCollectionMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingMark, setShippingMark] = useState('');
  const [remark, setRemark] = useState('');

  const [excludeInTransit, setExcludeInTransit] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);

  // Derived states
  const totalQuantity = useMemo(() => items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0), [items]);
  const totalDays = useMemo(() => items.reduce((acc, item) => acc + (Number(item.days) || 0), 0), [items]);
  const totalAmount = useMemo(() => {
    const itemsTotal = items.reduce((acc, item) => acc + ((Number(item.quantity) || 0) * (Number(item.price) || 0)), 0);
    const f = Number(freight) || 0;
    const t = Number(tax) || 0;
    return itemsTotal + f + t;
  }, [items, freight, tax]);

  const handleAddItem = (newItem: any) => {
    setItems(prev => [...prev, { ...newItem, quantity: 1, price: 0, taxPrice: 0, total: 0, days: 15, remark: '' }]);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      if (field === 'quantity' || field === 'price') {
        next[index].total = (Number(next[index].quantity) || 0) * (Number(next[index].price) || 0);
      }
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Validate
    if (!warehouse) return alert('请选择入库仓');
    if (!supplier) return alert('请选择供货商');
    if (items.length === 0) return alert('请至少添加一件商品');

    // validate items
    const invalidItems = items.some(item => !item.price || item.price <= 0 || !item.quantity || item.quantity <= 0 || !item.days || item.days <= 0);
    if (invalidItems) {
      return alert('请完善商品列表中的必填信息(采购价/数量/到货天数必须大于0)');
    }

    const newOrder = {
      id: Date.now().toString(),
      orderNo: 'PO' + Date.now(),
      customOrderNo,
      warehouse,
      supplierName: supplier,
      items,
      totalQuantity,
      totalPrice: totalAmount,
      actualPayAmount: totalAmount,
      freight: Number(freight) || 0,
      tax: Number(tax) || 0,
      status: autoSubmit ? '新订单（待审核）' : '新订单（未提交）',
      createdAt: new Date().toISOString(),
      remark
    };

    onAddOrder(newOrder);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1200px] !w-[1200px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-[15px] font-normal text-gray-800">增加采购订单</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-gray-50/30">
          {/* Top Info */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500">*</span>
              <span className="text-[13px] text-gray-700 whitespace-nowrap">采购入库仓</span>
              <select 
                className="h-8 border border-gray-200 rounded px-2 text-[13px] w-48 outline-none focus:border-blue-500"
                value={warehouse}
                onChange={e => setWarehouse(e.target.value)}
              >
                <option value="">-请选择-</option>
                <option value="东莞厚街仓">东莞厚街仓</option>
                <option value="义乌仓">义乌仓</option>
              </select>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <span className="text-[13px] text-gray-700 whitespace-nowrap">供应商名称</span>
              <Popover open={openSupplierSelect} onOpenChange={setOpenSupplierSelect}>
                <PopoverTrigger className="inline-flex h-8 w-64 items-center justify-between whitespace-nowrap rounded border border-input bg-transparent px-2.5 py-1 text-[13px] transition-colors outline-none hover:bg-muted bg-white">
                  {supplier
                    ? supplierOptions.find((s) => s.value === supplier)?.label
                    : "请输入供应商模糊搜索"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-[256px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="搜索供应商..." className="h-8 text-[13px]" />
                    <CommandList>
                      <CommandEmpty className="py-2 text-center text-[13px]">未找到供应商</CommandEmpty>
                      <CommandGroup>
                        {supplierOptions.map((s) => (
                          <CommandItem
                            key={s.value}
                            value={s.value}
                            onSelect={() => {
                              setSupplier(s.value);
                              setOpenSupplierSelect(false);
                            }}
                            className="text-[13px]"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                supplier === s.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {s.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FeatureMarker title="添加供货商" description="交互说明：点击打开新增弹窗，录入新数据。">
              <Button 
                className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-3 ml-2 text-[13px] font-normal"
                onClick={() => window.open('/supplier-management', '_blank')}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> 添加供货商
              </Button>
              </FeatureMarker>
              <FeatureMarker title="供应商详情" description="交互说明：点击执行供应商详情操作。">
<span className="text-blue-500 text-[13px] cursor-pointer hover:underline ml-2" onClick={() => alert("展示供应商详情信息:\n联系人: 张三\nQQ: 123456789\n电话: 13800138000\nEMAIL: test@test.com\n网址: www.test.com\n地址: 浙江省义乌市\n备注: 长期合作")}>供应商详情</span>
</FeatureMarker>
            </div>
          </div>

          {/* Buttons & Items Table */}
          <div className="bg-white border border-gray-200 rounded">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FeatureMarker title="添加商品" description="交互说明：点击打开新增弹窗，录入新数据。">
                <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 rounded-sm font-normal text-[13px]" onClick={() => setShowAddItems(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> 添加商品
                </Button>
                </FeatureMarker>
                <FeatureMarker title="批量添加商品" description="交互说明：点击打开新增弹窗，录入新数据。">
                <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 rounded-sm font-normal text-[13px]" onClick={() => setShowBatchAddItems(true)}>
                  批量添加商品
                </Button>
                </FeatureMarker>
              </div>
              <select className="h-8 border border-gray-200 rounded px-2 text-[13px] outline-none w-32">
                <option>RMB</option>
                <option>USD</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[12px] text-center min-w-[900px]">
                <thead className="bg-[#F8FAFC] border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="p-2 font-normal text-left pl-4">商品名称</th>
                    <th className="p-2 font-normal"><span className="text-red-500">*</span>采购价</th>
                    <th className="p-2 font-normal"><span className="text-red-500">*</span>含税单价</th>
                    <th className="p-2 font-normal"><span className="text-red-500">*</span>数量</th>
                    <th className="p-2 font-normal"><span className="text-red-500">*</span>总价</th>
                    <th className="p-2 font-normal">到货天数</th>
                    <th className="p-2 font-normal">备注</th>
                    <th className="p-2 font-normal">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-gray-400">暂无商品，请添加</td>
                    </tr>
                  ) : items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50">
                      <td className="p-2 text-left pl-4">
                        <div className="flex items-center gap-2">
                          <img src={item.imageUrl || "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=product+thumbnail&image_size=square"} className="w-10 h-10 border border-gray-200 rounded object-cover" />
                          <div>
                            <div className="text-gray-800">{item.sku || 'SKU-TEST'}</div>
                            <div className="text-gray-500 mt-1 line-clamp-1">{item.name || item.productName || '测试商品名称'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          <Input type="number" className="w-16 h-7 text-[12px] text-center px-1" value={item.price} onChange={e => handleUpdateItem(index, 'price', e.target.value)} />
                          <span className="text-gray-400">RMB</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          <Input type="number" className="w-16 h-7 text-[12px] text-center px-1" value={item.taxPrice} onChange={e => handleUpdateItem(index, 'taxPrice', e.target.value)} />
                          <span className="text-gray-400">RMB</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <Input type="number" className="w-16 h-7 text-[12px] text-center px-1 mx-auto" value={item.quantity} onChange={e => handleUpdateItem(index, 'quantity', e.target.value)} />
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          <Input type="number" className="w-16 h-7 text-[12px] text-center px-1" value={item.total} readOnly />
                          <span className="text-gray-400">RMB</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          <Input type="number" className="w-12 h-7 text-[12px] text-center px-1" value={item.days} onChange={e => handleUpdateItem(index, 'days', e.target.value)} />
                          <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button variant="outline" className="h-7 w-7 p-0"><Send className="w-3 h-3 text-blue-500" /></Button>
</FeatureMarker>
                        </div>
                      </td>
                      <td className="p-2">
                        <Input className="w-24 h-7 text-[12px] px-2 mx-auto" value={item.remark} onChange={e => handleUpdateItem(index, 'remark', e.target.value)} />
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1 items-center">
                          <FeatureMarker title="移除" description="交互说明：点击执行移除操作。">
<span className="text-blue-500 cursor-pointer hover:underline text-[12px]" onClick={() => handleRemoveItem(index)}>移除</span>
</FeatureMarker>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Form */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 p-4 border-t border-gray-200 bg-[#F8FAFC]">
              {/* Row 1 */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">自定义单据号</span>
                <Input placeholder="最长50个字符" maxLength={50} className="h-8 flex-1 text-[12px]" value={customOrderNo} onChange={e => setCustomOrderNo(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">采购运费</span>
                <div className="flex flex-1 items-center border border-gray-200 rounded overflow-hidden h-8 bg-white">
                  <Input type="number" min="0" className="h-full border-0 focus-visible:ring-0 px-2 text-[12px] flex-1" value={freight} onChange={e => setFreight(e.target.value)} />
                  <span className="px-2 text-[12px] text-gray-400 bg-gray-50 border-l border-gray-200 h-full flex items-center">RMB</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">全部到货天数</span>
                <Input className="h-8 flex-1 text-[12px] bg-gray-50" readOnly value={totalDays} />
              </div>

              {/* Row 2 */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">物流公司</span>
                <select className="h-8 flex-1 border border-gray-200 rounded px-2 text-[12px] outline-none" value={logisticsCompany} onChange={e => setLogisticsCompany(e.target.value)}>
                  <option value="">请选择</option>
                  <option value="顺丰">顺丰</option>
                  <option value="中通">中通</option>
                  <option value="圆通">圆通</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">快递单号</span>
                <Input placeholder="请输入快递单号" maxLength={50} className="h-8 flex-1 text-[12px]" value={trackingNo} onChange={e => setTrackingNo(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right flex items-center justify-end gap-1">
                  运费分摊方式 
                  <TooltipProvider delay={100}>
                    <Tooltip>
                      <TooltipTrigger className="inline-flex items-center">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="text-[12px] max-w-[400px]">
                        <p>按数量分摊计算公式：[A采购数量/（A采购数量+B采购量）*总运费]</p>
                        <p>按重量分摊计算公式：[(A采购数量*A商品重量）/（A采购数量*A商品重量+B采购数量*B商品重量*总运费]</p>
                        <p>按体积分摊计算公式：[A采购数量*A商品包装后体积/（A采购数量*A商品包装后体积+B采购数量*B商品包装后体积*总运费]</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                <select className="h-8 flex-1 border border-gray-200 rounded px-2 text-[12px] outline-none" value={freightApportionType} onChange={e => setFreightApportionType(e.target.value)}>
                  <option value="按数量">按数量</option>
                  <option value="按重量">按重量</option>
                  <option value="按体积">按包装后体积</option>
                </select>
              </div>

              {/* Row 3 */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">发票类型</span>
                <select className="h-8 flex-1 border border-gray-200 rounded px-2 text-[12px] outline-none" value={invoiceType} onChange={e => setInvoiceType(e.target.value)}>
                  <option value="普票">普票</option>
                  <option value="专票">专票</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">税金类型</span>
                <select className="h-8 flex-1 border border-gray-200 rounded px-2 text-[12px] outline-none" value={taxType} onChange={e => setTaxType(e.target.value)}>
                  <option value="按固定值">按固定值</option>
                  <option value="按比例">按比例</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">税金</span>
                <div className="flex flex-1 items-center border border-gray-200 rounded overflow-hidden h-8 bg-white">
                  <Input type="number" className="h-full border-0 focus-visible:ring-0 px-2 text-[12px] flex-1" value={tax} onChange={e => setTax(e.target.value)} />
                  <span className="px-2 text-[12px] text-gray-400 bg-gray-50 border-l border-gray-200 h-full flex items-center">{taxType === '按固定值' ? 'RMB' : '%'}</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">采购单类型</span>
                <select className="h-8 flex-1 border border-gray-200 rounded px-2 text-[12px] outline-none" value={orderType} onChange={e => setOrderType(e.target.value)}>
                  <option value="缺货采购">缺货采购</option>
                  <option value="备货采购">备货采购</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">采购员</span>
                <select className="h-8 flex-1 border border-gray-200 rounded px-2 text-[12px] outline-none" value={buyer} onChange={e => setBuyer(e.target.value)}>
                  <option value="">请选择采购员</option>
                  <option value="王明">王明</option>
                  <option value="李华">李华</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">自定义分类</span>
                <select className="h-8 flex-1 border border-gray-200 rounded px-2 text-[12px] outline-none" value={customCategory} onChange={e => setCustomCategory(e.target.value)}>
                  <option value="">自定义分类</option>
                </select>
              </div>

              {/* Row 5 */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">收款方式</span>
                <select className="h-8 flex-1 border border-gray-200 rounded px-2 text-[12px] outline-none bg-gray-50" value={collectionMethod} onChange={e => setCollectionMethod(e.target.value)}>
                  <option value="">全部</option>
                  <option value="支付宝">支付宝</option>
                  <option value="网银">网银</option>
                  <option value="Paypal">Paypal</option>
                  <option value="现款">现款</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right">付款方式</span>
                <select className="h-8 flex-1 border border-gray-200 rounded px-2 text-[12px] outline-none bg-gray-50" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option value="">全部</option>
                  <option value="支付宝">支付宝</option>
                  <option value="诚e赊">诚e赊</option>
                  <option value="账期支付">账期支付</option>
                  <option value="银行转账">银行转账</option>
                  <option value="跨境宝">跨境宝</option>
                  <option value="网商银行跨境直采">网商银行跨境直采</option>
                </select>
              </div>
              <div className="col-span-1"></div>

              {/* Textareas */}
              <div className="col-span-3 flex items-start gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right mt-2">正唛</span>
                <textarea className="flex-1 border border-gray-200 rounded p-2 text-[12px] outline-none min-h-[60px] focus:border-blue-500" value={shippingMark} onChange={e => setShippingMark(e.target.value)} />
              </div>
              <div className="col-span-3 flex items-start gap-2">
                <span className="text-[12px] text-gray-600 w-24 text-right mt-2">备注</span>
                <textarea className="flex-1 border border-gray-200 rounded p-2 text-[12px] outline-none min-h-[60px] focus:border-blue-500" maxLength={200} value={remark} onChange={e => setRemark(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4 text-[13px]">
            <div className="text-gray-600">采购量: <span className="font-bold text-[#6B8EBE] text-[15px] ml-1">{totalQuantity}</span></div>
            <div className="text-gray-600">合计 (含运费、税金): <span className="font-bold text-[#6B8EBE] text-[15px] ml-1">{totalAmount.toFixed(4)}</span></div>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-[12px] text-gray-600">
              <Checkbox checked={excludeInTransit} onCheckedChange={(c) => setExcludeInTransit(!!c)} />
              不参与采购在途计算
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[12px] text-gray-600">
              <Checkbox checked={autoSubmit} onCheckedChange={(c) => setAutoSubmit(!!c)} />
              自动提交采购
            </label>
            
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 h-8 rounded-sm ml-2" onClick={handleSubmit}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="px-6 h-8 rounded-sm bg-white" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
          </div>
        </div>

        {/* Nested Add Items Dialog */}
        {showAddItems && (
          <div className="absolute inset-0 bg-white z-50 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white text-[#6B8EBE] text-[15px]">
              <span className="flex-1 text-center font-normal">搜索sku</span>
              <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowAddItems(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              </FeatureMarker>
            </div>
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              <div className="flex items-center gap-4 text-[13px]">
                <span className="font-bold w-16">搜索类型:</span>
                {['库存SKU', '库存sku名称', '库存sku英文名称', '原厂SKU', '主SKU'].map(t => (
                  <FeatureMarker title="{t}" description="交互说明：点击执行{t}操作。">
                  <span 
                    key={t} 
                    className={cn("cursor-pointer", skuSearchType === t ? "text-[#6B8EBE] border border-[#6B8EBE] px-2 rounded-sm" : "text-gray-600 hover:text-[#6B8EBE]")}
                    onClick={() => setSkuSearchType(t)}
                  >
                    {t}
                  </span>
                  </FeatureMarker>
                ))}
              </div>
              <div className="flex items-center gap-4 text-[13px]">
                <span className="font-bold w-16">sku状态:</span>
                {['全部', '自动创建', '等待开发', '正常销售', '商品清仓', '停止销售'].map(t => (
                  <FeatureMarker title="{t}" description="交互说明：点击执行{t}操作。">
                  <span 
                    key={t} 
                    className={cn("cursor-pointer", skuStatus === t ? "text-[#6B8EBE] border border-[#6B8EBE] px-2 rounded-sm" : "text-gray-600 hover:text-[#6B8EBE]")}
                    onClick={() => setSkuStatus(t)}
                  >
                    {t}
                  </span>
                  </FeatureMarker>
                ))}
              </div>
              <div className="flex items-center gap-4 text-[13px]">
                <span className="font-bold w-16">搜索内容:</span>
                <div className="flex">
                  <Input 
                    placeholder="请输入库存SKU" 
                    className="w-64 h-8 rounded-none border-gray-300 focus-visible:ring-0" 
                    value={skuKeyword}
                    onChange={e => setSkuKeyword(e.target.value)}
                  />
                  <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
                  <Button className="h-8 rounded-l-none bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4">
                    <Search className="w-3.5 h-3.5 mr-1" /> 搜索
                  </Button>
                  </FeatureMarker>
                </div>
              </div>

              <div className="bg-[#FFF8E6] border-y border-[#FFECCC] p-2 flex items-center gap-6 mt-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-[13px] text-red-500">
                  <Checkbox checked={onlyCurrentSupplier} onCheckedChange={(c) => setOnlyCurrentSupplier(!!c)} className="border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
                  仅查看当前供应商的商品
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[13px] text-red-500">
                  <Checkbox checked={onlyOutOfStock} onCheckedChange={(c) => setOnlyOutOfStock(!!c)} className="border-gray-400" />
                  仅查看缺货仓库商品
                </label>
              </div>

              <div className="border border-gray-200 mt-2 flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-[#F8FAFC] border-b border-gray-200 text-gray-600 sticky top-0">
                    <tr>
                      <th className="p-2 w-10 text-center">
                        <Checkbox 
                          checked={mockSkuList.length > 0 && Object.keys(skuSelections).length === mockSkuList.length}
                          onCheckedChange={(c) => {
                            if (c) {
                              const newSelections: Record<string, boolean> = {};
                              mockSkuList.forEach(item => newSelections[item.id] = true);
                              setSkuSelections(newSelections);
                            } else {
                              setSkuSelections({});
                            }
                          }}
                        />
                      </th>
                      <th className="p-2 font-normal text-center">缩略图</th>
                      <th className="p-2 font-normal">商品信息</th>
                      <th className="p-2 font-normal text-center">仓库</th>
                      <th className="p-2 font-normal text-center">库存<br/>在途量</th>
                      <th className="p-2 font-normal text-center">7/28/42天销<br/>量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockSkuList.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-2 text-center align-middle">
                          <Checkbox 
                            checked={!!skuSelections[item.id]}
                            onCheckedChange={(c) => setSkuSelections(prev => ({ ...prev, [item.id]: !!c }))}
                          />
                        </td>
                        <td className="p-2 text-center">
                          <img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=product+thumbnail&image_size=square" className="w-10 h-10 border border-gray-200 mx-auto object-cover" />
                        </td>
                        <td className="p-2">
                          <div className="text-gray-800">{item.sku}</div>
                          <div className="text-gray-500 mt-1">{item.name}</div>
                        </td>
                        <td className="p-2 text-center">{item.warehouse}</td>
                        <td className="p-2 text-center">
                          <div>{item.stock}</div>
                          <div className="text-gray-400 mt-1">{item.inTransit}</div>
                        </td>
                        <td className="p-2 text-center">{item.sales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-[13px] text-gray-700">
                <Checkbox checked={closeAfterAdd} onCheckedChange={(c) => setCloseAfterAdd(!!c)} />
                添加后直接关闭窗口
              </label>
              <FeatureMarker title="添加" description="交互说明：点击打开新增弹窗，录入新数据。">
              <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 rounded-sm" onClick={() => {
                const itemsToAdd = mockSkuList.filter(item => skuSelections[item.id]);
                if (itemsToAdd.length === 0) {
                  alert('请先选择要添加的商品');
                  return;
                }
                itemsToAdd.forEach(item => {
                  handleAddItem({
                    sku: item.sku,
                    name: item.name,
                    imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=product+thumbnail&image_size=square'
                  });
                });
                setSkuSelections({});
                if (closeAfterAdd) {
                  setShowAddItems(false);
                } else {
                  alert('添加成功');
                }
              }}>添加</Button>
              </FeatureMarker>
              <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 bg-white rounded-sm text-gray-600" onClick={() => setShowAddItems(false)}>关闭</Button>
</FeatureMarker>
            </div>
          </div>
        )}

        {showBatchAddItems && (
          <div className="absolute inset-0 bg-white z-50 overflow-auto flex flex-col">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-medium">批量添加商品</h2>
              <FeatureMarker title="关闭并返回" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setShowBatchAddItems(false)}>关闭并返回</Button>
</FeatureMarker>
            </div>
            <div className="p-4 flex-1">
               <div className="flex items-center gap-4 mb-4">
                 {['按库存SKU', '按库存sku名称', '按原厂sku'].map(type => (
                   <label key={type} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                     <input 
                       type="radio" 
                       name="batchSearchType" 
                       checked={batchSearchType === type} 
                       onChange={() => setBatchSearchType(type)} 
                     />
                     {type}
                   </label>
                 ))}
               </div>
               <div className="text-[13px] text-gray-600 mb-2">每行一个 <span className="text-[#6B8EBE] font-bold">库存SKU,数量</span> (支持excel复制黏贴)</div>
               <textarea 
                 className="w-full h-64 border border-gray-300 rounded p-2 text-[13px] mb-4 outline-none focus:border-[#6B8EBE]" 
                 value={batchInputText}
                 onChange={e => setBatchInputText(e.target.value)}
                 placeholder={"SKU1,10\nSKU2,20"} 
               />
               <div className="flex justify-end gap-2 mt-4">
                 <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
                 <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 rounded-sm font-normal" onClick={() => {
                   if (!batchInputText.trim()) return alert('请输入内容');
                   batchInputText.split('\n').forEach(line => {
                     const [sku, qty] = line.split(',');
                     if(sku) {
                       handleAddItem({
                         sku: sku.trim(),
                         name: '批量导入商品',
                         quantity: parseInt(qty) || 1,
                         imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=product+thumbnail&image_size=square'
                       });
                     }
                   });
                   setShowBatchAddItems(false);
                   setBatchInputText('');
                 }}>确定</Button>
                 </FeatureMarker>
                 <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 bg-white rounded-sm text-gray-600 font-normal" onClick={() => setShowBatchAddItems(false)}>取消</Button>
</FeatureMarker>
               </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
