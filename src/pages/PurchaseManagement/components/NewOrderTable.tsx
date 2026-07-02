import React, { useState, useEffect } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit2, Copy, Link as LinkIcon, ChevronDown, HelpCircle, ChevronsUp, Home, MessageSquare, List, Check, ChevronsUpDown, Send, Minus, Plus, Search, Layers } from 'lucide-react';
import AddItemsPage from './AddItemsPage';
import AddOrderDialog from './AddOrderDialog';
import BatchOperationsModals, { BatchModalType } from './BatchOperationsModals';

export default function NewOrderTable(props: any) {
  const { orders = [], setOrders, setHideFilter } = props;
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState('');

  // 各种弹窗状态
  const [editCustomOrderNoId, setEditCustomOrderNoId] = useState<string | null>(null);
  const [customOrderNoInput, setCustomOrderNoInput] = useState('');
  
  const [changeSupplierId, setChangeSupplierId] = useState<string | null>(null);
  const [openSupplierSelect, setOpenSupplierSelect] = useState(false);
  const [supplierSelected, setSupplierSelected] = useState('');
  
  const [changeWarehouseId, setChangeWarehouseId] = useState<string | null>(null);
  const [openWarehouseSelect, setOpenWarehouseSelect] = useState(false);
  const [warehouseSelected, setWarehouseSelected] = useState('');
  
  const [editExtraFeeId, setEditExtraFeeId] = useState<string | null>(null);
  const [extraFeeInput, setExtraFeeInput] = useState('');
  
  const [addLogisticsId, setAddLogisticsId] = useState<string | null>(null);
  const [logisticsRows, setLogisticsRows] = useState<any[]>([{ id: 1, fee: '0.00', company: '', no: '' }]);
  
  const [auditOrderId, setAuditOrderId] = useState<string | null>(null);
  const [splitOrderId, setSplitOrderId] = useState<string | null>(null);
  const [splitSelections, setSplitSelections] = useState<Record<number, boolean>>({});
  const [splitQuantities, setSplitQuantities] = useState<Record<number, number>>({});

  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [editItemsData, setEditItemsData] = useState<any[]>([]);

  useEffect(() => {
    if (editOrderId) {
      const order = (orders || []).find((o: any) => o.id === editOrderId);
      if (order && order.items) {
        setEditItemsData(order.items.map((item: any) => ({
          ...item,
          editQuantity: item.quantity || 0,
          editPrice: item.price || 0,
          editDiscount: item.discount || 0
        })));
      }
    } else {
      setEditItemsData([]);
    }
  }, [editOrderId, orders]);

  const [batchAdjustOpen, setBatchAdjustOpen] = useState(false);
  const [batchAdjustText, setBatchAdjustText] = useState("");
  const [addItemsOrderId, setAddItemsOrderId] = useState<string | null>(null);
  const [logOrderId, setLogOrderId] = useState<string | null>(null);
  const [submitOrderId, setSubmitOrderId] = useState<string | null>(null);

  // 作废相关状态
  const [voidOrderId, setVoidOrderId] = useState<string | null>(null);
  const [voidType, setVoidType] = useState<'all' | 'partial'>('all');
  const [voidSearchKeyword, setVoidSearchKeyword] = useState('');
  const [voidSelections, setVoidSelections] = useState<Record<number, boolean>>({});
  const [voidQuantities, setVoidQuantities] = useState<Record<number, number>>({});
  const [voidSyncPlatform, setVoidSyncPlatform] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [batchModalType, setBatchModalType] = useState<BatchModalType>(null);

  const supplierOptions = [
    { value: '深圳优声电子有限公司', label: '深圳优声电子有限公司' },
    { value: '广州能量科技有限公司', label: '广州能量科技有限公司' },
    { value: '东莞线材工厂', label: '东莞线材工厂' },
    { value: '惠州硅胶制品有限公司', label: '惠州硅胶制品有限公司' },
    { value: '曹县委要王工艺有限公司', label: '曹县委要王工艺有限公司' },
  ];

  const warehouseOptions = [
    { value: '东莞厚街仓', label: '东莞厚街仓' },
    { value: '深圳坂田仓', label: '深圳坂田仓' },
    { value: '广州白云仓', label: '广州白云仓' },
    { value: '义乌北苑仓', label: '义乌北苑仓' },
  ];

  useEffect(() => {
    if ((orders || []).length === 0 && setOrders) {
      setOrders([{
        id: "mock-new-1",
        orderNo: "1570549972",
        status: "新订单（未提交）",
        paymentStatus: "待申请",
        platformOrderNo: "--",
        supplierName: "曹县委要王工艺有限公司",
        warehouse: "东莞厚街仓",
        totalQuantity: 120,
        totalPrice: 120,
        extraFee: 0,
        buyer: "李舒",
        lastOperator: "王明",
        createdAt: "2026-04-14(UTC+8)",
        updatedAt: "2026-04-14 18:27(UTC+8)",
        items: [{ sku: "24273848-BU-A0-EaH", productName: "ET木质方形浴帘盒 樱桃木", quantity: 100 }]
      }]);
    }
  }, [orders, setOrders]);

  // 模拟的 "新订单" 状态数据，并按创建时间倒序排列
  const newOrders = (orders || [])
    .filter((o: any) => o?.status === '待提交' || o?.status === '新订单（未提交）' || o?.status === '新订单（待审核）')
    .sort((a: any, b: any) => {
      // 简单处理时间字符串，去除 "(UTC+8)" 这类后缀，确保能正确解析
      const parseDateStr = (dateStr: string) => {
        if (!dateStr) return 0;
        const cleanStr = dateStr.replace(/\(UTC\+8\)/g, '').trim();
        const time = new Date(cleanStr).getTime();
        return isNaN(time) ? 0 : time;
      };

      const timeA = parseDateStr(a.createdAt || a.orderTime);
      const timeB = parseDateStr(b.createdAt || b.orderTime);
      return timeB - timeA;
    });

  if (newOrders.length === 0) {
    return (
      <div className="flex-1 bg-white rounded border border-gray-200 mt-4 flex flex-col items-center justify-center text-gray-500 text-sm">
        暂无新订单数据
      </div>
    );
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedOrders(newOrders.map((o: any) => o.id));
    else setSelectedOrders([]);
  };

  const handleSelect = (checked: boolean, id: string) => {
    if (checked) setSelectedOrders([...selectedOrders, id]);
    else setSelectedOrders(selectedOrders.filter((oId: string) => oId !== id));
  };

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllExpand = () => {
    const isAllExpanded = newOrders.every((o: any) => expandedRows[o.id]);
    if (isAllExpanded) {
      setExpandedRows({});
    } else {
      const newExpanded: Record<string, boolean> = {};
      newOrders.forEach((o: any) => { newExpanded[o.id] = true; });
      setExpandedRows(newExpanded);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage('复制成功');
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleSubmitOrder = (id: string) => {
    setOrders((prev: any[]) => prev.map(o => o.id === id ? { ...o, status: '新订单（待审核）' } : o));
  };

  const [editProductLinkOpen, setEditProductLinkOpen] = useState(false);
  const [productLinkInput, setProductLinkInput] = useState('');
  
  const [inboundDetailOpen, setInboundDetailOpen] = useState(false);
  const [currentInboundSku, setCurrentInboundSku] = useState('');

  const [editArriveDateOpen, setEditArriveDateOpen] = useState(false);
  const [arriveDateInput, setArriveDateInput] = useState('');

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyActiveTab, setHistoryActiveTab] = useState<'history'|'plan'>('history');
  const [operationLogOpen, setOperationLogOpen] = useState(false);

  const handleBatchOperation = (type: BatchModalType | 'updateInTransit' | 'markPaid' | 'updateOverReceive' | 'markInvoiced') => {
    if (selectedOrders.length === 0) {
      alert('请先选择要操作的采购单');
      return;
    }

    if (type === 'updateInTransit') {
      setToastMessage('正在加载在途信息进行更新...');
      setTimeout(() => setToastMessage('更新在途量成功'), 1500);
    } else if (type === 'markPaid') {
      setOrders((prev: any[]) => prev.map(o => selectedOrders.includes(o.id) ? { ...o, paymentStatus: '已付款' } : o));
      setToastMessage('批量标记付款成功');
    } else if (type === 'updateOverReceive') {
      setToastMessage('正在同步修改当前采购单的采购数量...');
      setTimeout(() => setToastMessage('批量更新超收数量成功'), 1500);
    } else if (type === 'markInvoiced') {
      setOrders((prev: any[]) => prev.map(o => selectedOrders.includes(o.id) ? { ...o, invoiceStatus: '已开票' } : o));
      setToastMessage('批量标记已开票成功');
    } else {
      setBatchModalType(type as BatchModalType);
    }
  };

  const handleRemarkChange = (id: string, field: string, value: string) => {
    setOrders((prev: any[]) => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  if (addItemsOrderId) {
    const activeOrder = (orders || []).find((o: any) => o.id === addItemsOrderId);
    if (activeOrder) {
      if (setHideFilter) setHideFilter(true);
      return (
        <AddItemsPage 
          order={activeOrder} 
          onClose={() => {
            setAddItemsOrderId(null);
            if (setHideFilter) setHideFilter(false);
          }} 
          onSubmit={(newItems) => {
            setOrders((prev: any[]) => prev.map(o => {
              if (o.id === activeOrder.id) {
                const currentItems = o.items || [];
                const mergedItems = [...currentItems, ...newItems];
                return {
                  ...o,
                  items: mergedItems,
                  totalQuantity: mergedItems.reduce((acc, cur) => acc + (cur.quantity || 0), 0),
                  totalPrice: mergedItems.reduce((acc, cur) => acc + (cur.totalAmount || 0), 0)
                };
              }
              return o;
            }));
            setAddItemsOrderId(null);
            if (setHideFilter) setHideFilter(false);
            setToastMessage('商品追加成功');
            setTimeout(() => setToastMessage(null), 2000);
          }} 
        />
      );
    }
  }

  return (
    <div className="flex-1 bg-white rounded border border-gray-200 mt-4 flex flex-col overflow-hidden">
      {/* Action Bar */}
      <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-[13px] gap-1 px-3 text-white cursor-pointer">
                <Layers className="w-4 h-4" />
                批量操作
                <ChevronDown className="w-3 h-3" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-[13px]">批量更新采购单</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-56 ml-1">
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('updateInTransit')}>更新在途量</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('updateFreight')}>批量修改运单号/运费</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('markPaid')}>批量标记付款</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('changeOrderCreator')}>批量更换下单员</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('changeBuyer')}>批量更换采购员</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('voidOrders')}>批量作废采购单</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('updateFreightPaymentType')}>批量更新运费支付方式</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px] flex items-center justify-between" onClick={() => handleBatchOperation('updateOverReceive')}>批量更新超收数量 <HelpCircle className="w-3 h-3 text-blue-500" /></DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('updateInvoiceAndTax')}>批量更新发票类型和税金</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px] flex items-center justify-between" onClick={() => handleBatchOperation('markInvoiced')}>批量标记已开票 <HelpCircle className="w-3 h-3 text-blue-500" /></DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('updateFreightApportion')}>批量更新运费分摊方式</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('updateRemark')}>批量修改备注</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px] flex items-center justify-between" onClick={() => handleBatchOperation('changeSupplier')}>批量换供应商 <HelpCircle className="w-3 h-3 text-blue-500" /></DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('changeRelatedOrderNo')}>批量修改关联订单号</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('changeWarehouse')}>批量修改收货仓库</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('changeArriveDate')}>批量设置预计到货时间</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]" onClick={() => handleBatchOperation('withdrawAudit')}>批量撤回审核</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-[13px]">批量设置参与在途计算</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-24 ml-1">
                    <DropdownMenuItem className="text-[13px]">参与</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]">不参与</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-[13px]">打印中心</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-40 ml-1">
                    <DropdownMenuItem className="text-[13px]">打印库存SKU标签</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]">采购单标签</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]">装箱信息</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem className="text-[13px]">批量生成序列号</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] flex items-center justify-between" onClick={() => handleBatchOperation('batchSplitOrder')}>
                批量拆分采购 
                <TooltipProvider delay={100}>
                  <Tooltip>
                    <TooltipTrigger className="inline-flex items-center">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="text-[12px] max-w-[400px]">
                      <p>仅允许采购单状态为采购中和新订单-未提交、付款状态为待申请、采购总数量&gt;1、未进行过入库和合并操作且未关联第三方订单的采购单进行拆分</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuItem>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-[13px]">批量标记不再来货</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-24 ml-1">
                    <DropdownMenuItem className="text-[13px]">标记</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]">取消标记</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-[13px]">采购单合并</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-32 ml-1">
                    <DropdownMenuItem className="text-[13px]">合并</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]">标记不合并</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]">标记合并</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-[13px]">设置固定分类</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-32 ml-1">
                    <DropdownMenuItem className="text-[13px]">标记分类</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]">取消标记分类</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-[13px]">设置自定义分类</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-32 ml-1">
                    <DropdownMenuItem className="text-[13px]">未分类</DropdownMenuItem>
                    <DropdownMenuItem className="text-[13px]">默认分类</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem className="text-[13px]">批量打印采购合同</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px]">批量打印入库单明细</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] flex items-center justify-between">
                批量上传附件 <span className="bg-pink-500 text-white text-[10px] px-1 rounded-sm leading-tight ml-2">new</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <FeatureMarker title="添加采购单" description="交互说明：点击打开新增弹窗，录入新数据。">
<Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-[13px] text-white" onClick={() => setShowAddOrder(true)}>添加采购单</Button>
</FeatureMarker>
          <FeatureMarker title="导出" description="交互说明：点击将当前列表数据导出为Excel文件。">
<Button variant="outline" className="h-8 text-[13px] text-gray-600">导出</Button>
</FeatureMarker>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left text-[12px] whitespace-nowrap border-collapse min-w-[1600px]">
          <thead className="bg-[#F5F6F8] sticky top-0 z-10 shadow-sm">
            <tr className="border-b border-gray-200 text-gray-600 align-middle">
              <th className="p-2 w-10 text-center font-normal">
                <Checkbox 
                  checked={selectedOrders.length === newOrders.length && newOrders.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-2 w-auto font-normal">
                <FeatureMarker title="expandedRows[o.id]) ? '⊖ 收缩' : '⊕ 展开'}" description="交互说明：点击执行expandedRows[o.id]) ? '⊖ 收缩' : '⊕ 展开'}操作。">
                <span className="text-blue-600 cursor-pointer mr-1" onClick={toggleAllExpand}>
                  {newOrders.every((o: any) => expandedRows[o.id]) ? '⊖ 收缩' : '⊕ 展开'}
                </span>
                </FeatureMarker> 商品信息
              </th>
              <th className="p-2 text-center w-32 font-normal leading-tight">
                实付<br/>
                额外费用 <HelpCircle className="w-3 h-3 inline text-gray-400" />
              </th>
              <th className="p-2 text-center w-36 font-normal leading-tight">
                物流信息<br/>
                发货时间 <HelpCircle className="w-3 h-3 inline text-gray-400" />
              </th>
              <th className="p-2 text-center w-36 font-normal leading-tight">
                下单员<br/>
                <span className="text-blue-600 flex items-center justify-center">下单时间 <ChevronDown className="w-3 h-3" /></span>
                付款人<br/>
                <span className="text-blue-600 flex items-center justify-center">1688付款时间 <ChevronDown className="w-3 h-3" /></span>
              </th>
              <th className="p-2 text-center w-40 font-normal leading-tight">
                采购审核人<br/>
                <span className="text-blue-600 flex flex-col items-center justify-center">
                  <span className="flex items-center justify-center">审核时间 <ChevronDown className="w-3 h-3" /></span>
                  <span className="text-gray-500 text-[12px] font-normal">当前审核人</span>
                </span>
                最后操作员<br/>
                最后操作时间
              </th>
              <th className="p-2 text-center w-24 font-normal">
                采购员 <HelpCircle className="w-3 h-3 inline text-gray-400" />
              </th>
              <th className="p-2 text-center w-72 font-normal">
                订单备注/关联订单编号
              </th>
              <th className="p-2 text-center w-24 font-normal">
                状态
              </th>
              <th className="p-2 text-center w-40 font-normal">
                操作
              </th>
            </tr>
            {/* Search Filter Row */}
            <tr className="bg-white border-b border-gray-200">
              <td className="p-1"></td>
              <td className="p-1">
                <Input placeholder="输入采购单号/自定义单号搜索" className="h-7 text-[12px]" />
              </td>
              <td className="p-1">
                <Input placeholder="输入1688订单号搜索" className="h-7 text-[12px]" />
              </td>
              <td className="p-1">
                <Input placeholder="输入库存sku搜索" className="h-7 text-[12px]" />
              </td>
              <td className="p-1">
                <Input placeholder="输入商品名称搜索" className="h-7 text-[12px]" />
              </td>
              <td className="p-1">
                <Input placeholder="输入供应商搜索" className="h-7 text-[12px]" />
              </td>
              <td colSpan={4} className="p-1">
                <div className="flex items-center gap-2">
                  <Input placeholder="输入快递单号搜索" className="h-7 text-[12px] flex-1" />
                  <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button variant="outline" size="icon" className="h-7 w-7 text-blue-600"><ChevronsUp className="w-4 h-4" /></Button>
</FeatureMarker>
                </div>
              </td>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {newOrders.map((order: any) => (
              <React.Fragment key={order.id}>
                {/* 订单基础信息头部行 */}
                <tr className="bg-[#EBF5FF] border-b border-gray-200 text-[12px]">
                  <td className="p-2 text-center align-middle border-r border-gray-200">
                    <Checkbox 
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(c) => handleSelect(!!c, order.id)}
                    />
                  </td>
                  <td colSpan={9} className="p-2">
                    <div className="flex items-center gap-4 text-gray-700">
                      <div className="flex items-center font-medium">
                        <span className="text-blue-600 cursor-pointer hover:underline">{order.orderNo || '1570549972'}</span>
                        <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500 ml-1 mr-1" onClick={() => handleCopy(order.orderNo)} />
                        <span className="text-gray-400 font-normal">[{order.customOrderNo || '暂无'}]</span>
                        <Edit2 
                          className="w-3 h-3 text-blue-500 cursor-pointer ml-0.5" 
                          onClick={() => {
                            setCustomOrderNoInput(order.customOrderNo || '');
                            setEditCustomOrderNoId(order.id);
                          }} 
                        />
                      </div>
                      
                      <div className="flex items-center">
                        【供应商：<span className="text-blue-600 cursor-pointer hover:underline">{order.supplierName || '曹县委要王工艺有限公司'}</span>】
                        <Edit2 
                          className="w-3 h-3 text-blue-500 cursor-pointer ml-1 mr-1" 
                          onClick={() => {
                            setSupplierSelected(order.supplierName || '');
                            setOpenSupplierSelect(false);
                            setChangeSupplierId(order.id);
                          }}
                        />
                        <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500 mr-2" onClick={() => handleCopy(order.supplierName)} />
                        <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 rounded-sm">数量摊销</span>
                        <svg viewBox="0 0 1024 1024" width="16" height="16" className="ml-1 text-blue-500">
                          <path d="M512 1024a512 512 0 1 1 512-512 512.58 512.58 0 0 1-512 512zM512 64a448 448 0 1 0 448 448A448.51 448.51 0 0 0 512 64z" fill="#00A1FF" />
                          <path d="M720 464c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zM304 464c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z" fill="#00A1FF" />
                          <path d="M512 768c-105.9 0-192-57.4-192-128h384c0 70.6-86.1 128-192 128z" fill="#00A1FF" />
                        </svg>
                      </div>

                      <div className="flex-1 flex justify-end items-center gap-1 text-gray-600">
                        <Home className="w-3.5 h-3.5" />
                        {order.warehouse || '东莞厚街仓'}
                        <Edit2 
                          className="w-3 h-3 text-blue-500 cursor-pointer" 
                          onClick={() => {
                            setWarehouseSelected(order.warehouse || '');
                            setOpenWarehouseSelect(false);
                            setChangeWarehouseId(order.id);
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Main Row */}
                <tr className="border-b border-gray-200 bg-[#FFFBE6] hover:bg-[#FFF7D6] transition-colors align-top">
                  <td className="p-2 text-center align-middle border-r border-gray-200 bg-white">
                  </td>
                  
                  {/* 商品信息（统计区块） */}
                  <td className="p-2 border-r border-gray-200">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <FeatureMarker title="{expandedRows[order.id] ? '⊖ 收缩' : '⊕ 展开'}" description="交互说明：点击执行{expandedRows[order.id] ? '⊖ 收缩' : '⊕ 展开'}操作。">
                        <span 
                          className="text-blue-600 cursor-pointer mr-1"
                          onClick={() => toggleExpand(order.id)}
                        >
                          {expandedRows[order.id] ? '⊖ 收缩' : '⊕ 展开'}
                        </span>
                        </FeatureMarker>
                      </div>
                      <div className="text-gray-600 text-[12px] leading-tight pl-4">
                        <div>商品种类：<span className="text-gray-800">{order.items?.length || 0}</span></div>
                        <div className="mt-1">
                          <span className="ml-0">采购/已入/未入数量：<span className="text-gray-800">{order.totalQuantity || 0}/0/{order.totalQuantity || 0}</span></span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 实付/额外费用 */}
                  <td className="p-2 text-gray-700 text-center border-r border-gray-200">
                    <div className="font-semibold">{Number(order.totalPrice || 0).toFixed(4)}</div>
                    <div className="font-semibold">
                      {Number(order.extraFee || 0).toFixed(2)} 
                      <Edit2 
                        className="w-3 h-3 text-blue-500 cursor-pointer inline ml-0.5" 
                        onClick={() => {
                          setExtraFeeInput(order.extraFee ? String(order.extraFee) : '');
                          setEditExtraFeeId(order.id);
                        }}
                      />
                    </div>
                  </td>

                  {/* 物流信息/发货时间 */}
                  <td className="p-2 text-center border-r border-gray-200">
                    {order.logistics && order.logistics.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {order.logistics.map((log: any, idx: number) => (
                          <div key={idx} className="group relative inline-block text-blue-600 cursor-pointer hover:underline text-[12px]">
                            {log.no}
                            <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 shadow-lg text-left">
                              <div>单号：{log.no}</div>
                              <div>公司：{log.company}</div>
                              <div>运费：¥{Number(log.fee || 0).toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 mt-1">--</div>
                    )}
                    <div 
                      className="text-blue-600 cursor-pointer hover:underline inline-flex items-center gap-1 mt-1"
                      onClick={() => {
                        setAddLogisticsId(order.id);
                        setLogisticsRows([{ id: 1, fee: '0.00', company: '', no: '' }]);
                      }}
                    >
                      添加物流单号 <Edit2 className="w-3 h-3" />
                    </div>
                  </td>

                  {/* 下单员/时间/付款人/1688时间 */}
                  <td className="p-2 text-gray-600 space-y-1 text-center border-r border-gray-200">
                    <div>{order.buyer || '李舒'}</div>
                    <div>{order.createdAt || '2026-04-14(UTC+8)'}</div>
                    <div>--</div>
                    <div>--</div>
                  </td>

                  {/* 采购审核/最后操作 */}
                  <td className="p-2 text-gray-600 space-y-1 text-center border-r border-gray-200">
                    <div>--</div>
                    <div>--</div>
                    <div>--</div>
                    <div className="mt-2 text-gray-700">{order.lastOperator || '王明'}</div>
                    <div className="text-gray-500">{order.updatedAt || '2026-04-14 18:27(UTC+8)'}</div>
                  </td>

                  {/* 采购员 */}
                  <td className="p-2 text-gray-700 text-center border-r border-gray-200">
                    {order.buyer || '李舒'}
                  </td>

                  {/* 订单备注/关联编号 */}
                  <td className="p-2 space-y-2 border-r border-gray-200">
                    <div>
                      <textarea 
                        className="h-10 text-[12px] w-full bg-white border border-gray-200 rounded px-2 py-1 resize-none custom-scrollbar" 
                        placeholder="订单备注" 
                        maxLength={300}
                        defaultValue={order.remark || ''}
                        onFocus={(e) => {
                          const val = e.target.value;
                          e.target.value = '';
                          e.target.value = val;
                        }}
                        onBlur={(e) => handleRemarkChange(order.id, 'remark', e.target.value)}
                      />
                    </div>
                    <div>
                      <textarea 
                        className="h-10 text-[12px] w-full bg-white border border-gray-200 rounded px-2 py-1 resize-none custom-scrollbar" 
                        placeholder="关联订单编号" 
                        maxLength={300}
                        defaultValue={order.relatedOrderNo || ''}
                        onFocus={(e) => {
                          const val = e.target.value;
                          e.target.value = '';
                          e.target.value = val;
                        }}
                        onBlur={(e) => handleRemarkChange(order.id, 'relatedOrderNo', e.target.value)}
                      />
                    </div>
                  </td>

                  {/* 状态 */}
                  <td className="p-2 text-left text-gray-700 leading-relaxed border-r border-gray-200">
                    <div>采购状态：{order.status === '待提交' ? '新订单（未提交）' : (order.status === '待审核' ? '新订单（待审核）' : order.status)}</div>
                    <div className="text-blue-600 cursor-pointer hover:underline">付款状态：{order.paymentStatus === '待申请' ? '待申请付款' : (order.paymentStatus === '已申请' ? '已申请付款' : (order.paymentStatus || '待申请付款'))}</div>
                    <div>签收状态：{order.signStatus || '未签收'}</div>
                    <div>平台状态：{order.platformStatus || '--'}</div>
                    <div className="text-blue-600 cursor-pointer hover:underline" onClick={() => setAuditOrderId(order.id)}>审核详情</div>
                  </td>

                  {/* 操作 */}
                  <td className="p-2 text-center align-top">
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-blue-600 text-sm max-w-[140px] mx-auto leading-relaxed">
                      {order.status === '新订单（未提交）' || order.status === '待提交' ? (
                        <>
                          {order.paymentStatus === '待申请' && order.totalQuantity > 1 && (
                            <FeatureMarker title="拆分采购单" description="交互说明：点击执行拆分采购单操作。">
                            <span 
                              className="cursor-pointer hover:underline whitespace-nowrap" 
                              onClick={() => {
                                setSplitOrderId(order.id);
                                setSplitSelections({});
                                setSplitQuantities({});
                              }}
                            >
                              拆分采购单
                            </span>
                            </FeatureMarker>
                          )}
                          <FeatureMarker title="编辑" description="交互说明：点击打开编辑弹窗，修改当前项信息。">
<span className="cursor-pointer hover:underline whitespace-nowrap" onClick={() => setEditOrderId(order.id)}>编辑</span>
</FeatureMarker>
                          <FeatureMarker title="提交采购" description="交互说明：点击执行提交采购操作。">
<span className="cursor-pointer hover:underline text-blue-600 whitespace-nowrap" onClick={() => setSubmitOrderId(order.id)}>提交采购</span>
</FeatureMarker>
                          <FeatureMarker title="追加商品" description="交互说明：点击执行追加商品操作。">
<span className="cursor-pointer hover:underline whitespace-nowrap" onClick={() => setAddItemsOrderId(order.id)}>追加商品</span>
</FeatureMarker>
                          <FeatureMarker title="作废" description="交互说明：点击执行作废操作。">
<span className="cursor-pointer hover:underline text-red-500 whitespace-nowrap" onClick={() => setVoidOrderId(order.id)}>作废</span>
</FeatureMarker>
                        </>
                      ) : (order.status === '待审核' || order.status === '新订单（待审核）') ? (
                        <>
                          <FeatureMarker title="编辑" description="交互说明：点击打开编辑弹窗，修改当前项信息。">
<span className="cursor-pointer hover:underline whitespace-nowrap" onClick={() => setEditOrderId(order.id)}>编辑</span>
</FeatureMarker>
                          <FeatureMarker title="撤回审核" description="交互说明：点击执行撤回审核操作。">
                          <span 
                            className="cursor-pointer hover:underline text-red-500 whitespace-nowrap" 
                            onClick={() => {
                              setOrders((prev: any[]) => prev.map(o => {
                                if (o.id === order.id) {
                                  return { ...o, status: '新订单（未提交）' };
                                }
                                return o;
                              }));
                            }}
                          >
                            撤回审核
                          </span>
                          </FeatureMarker>
                        </>
                      ) : null}
                      <FeatureMarker title="采购合同" description="交互说明：点击执行采购合同操作。">
<span className="cursor-pointer hover:underline text-green-600 whitespace-nowrap" onClick={() => window.open('/contract', '_blank')}>采购合同</span>
</FeatureMarker>
                      <FeatureMarker title="操作日志" description="交互说明：点击执行操作日志操作。">
                      <span 
                        className="cursor-pointer hover:underline text-blue-600 whitespace-nowrap mt-1 inline-block text-center w-full"
                        onClick={() => setOperationLogOpen(true)}
                      >
                        操作日志
                      </span>
                      </FeatureMarker>
                    </div>
                  </td>
                </tr>

                {/* Expanded Details Row */}
                {expandedRows[order.id] && (
                  <tr className="bg-white">
                    <td className="p-0 border-b border-gray-200"></td>
                    <td colSpan={9} className="p-0 border-b border-gray-200">
                      <div className="border border-gray-200 m-2 rounded overflow-hidden">
                        <table className="w-full text-left border-collapse text-[12px]">
                          <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                              <th className="p-2 w-10 text-center border-r border-gray-200 border-b"><Checkbox /></th>
                              <th className="p-2 w-[350px] border-r border-gray-200 border-b">
                                <div className="text-center">库存SKU</div>
                                <div className="text-center text-gray-400 font-normal">商品名称</div>
                              </th>
                              <th className="p-2 w-32 text-center border-r border-gray-200 border-b">
                                <div>采购数</div>
                                <div className="text-gray-400 font-normal">采购单价</div>
                                <div className="text-gray-400 font-normal">最新采购价</div>
                                <div className="text-gray-400 font-normal">最低采购价</div>
                                <div className="text-gray-400 font-normal">标准采购价</div>
                              </th>
                              <th className="p-2 w-32 text-center border-r border-gray-200 border-b">
                                <div>入库量</div>
                                <div>损耗量</div>
                                <div>退货量</div>
                                <div className="text-gray-400 font-normal">异常原因</div>
                              </th>
                              <th className="p-2 w-48 text-center border-r border-gray-200 border-b">
                                <div>库存/在途/未发货量</div>
                                <div className="text-gray-400 font-normal">预计到货日期</div>
                              </th>
                              <th className="p-2 w-48 text-center border-r border-gray-200 border-b">
                                <TooltipProvider delay={100}>
                                  <Tooltip>
                                    <TooltipTrigger className="flex items-center justify-center gap-1 mx-auto w-full mb-1">
                                      销量情况 <HelpCircle className="w-3 h-3 text-blue-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>分别表示7、28、42天内销量</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <div className="flex items-center justify-center gap-1">订单缺货件数 <HelpCircle className="w-3 h-3 text-blue-500" /></div>
                                <div className="text-gray-400 font-normal">订单最早付款时间</div>
                              </th>
                              <th className="p-2 w-32 text-center border-b border-gray-200">
                                <div>采购/计划详情</div>
                                <div className="text-gray-400 font-normal">关联计划数</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {order.items?.map((item: any, index: number) => (
                              <tr key={`${order.id}-item-${index}`} className="hover:bg-gray-50">
                                <td className="p-2 text-center align-middle border-r border-gray-200"><Checkbox /></td>
                                <td className="p-3 border-r border-gray-200">
                                  <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded shrink-0 overflow-hidden border border-gray-200 mt-0.5 relative">
                                      <img src={item.imageUrl || "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=product%20thumbnail%20box&image_size=square"} alt="商品" className="w-full h-full object-cover" />
                                      <div className="absolute bottom-0 bg-green-500 text-white text-[9px] px-1 w-full text-center truncate">1688</div>
                                    </div>
                                    <div className="flex-1 text-[12px] space-y-1">
                                      <div className="flex items-center gap-1 text-blue-600 mb-1">
                                        <span className="hover:underline cursor-pointer">{item.sku || '24273848-BU-A0-EaH'}</span>
                                        <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500" />
                                        <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
                                        <span 
                                          className="text-[11px] border border-blue-200 px-1 rounded-sm flex items-center gap-0.5 cursor-pointer hover:bg-blue-50"
                                          onClick={() => {
                                            if (item.productLink) {
                                              window.open(item.productLink, '_blank');
                                            }
                                          }}
                                        >
                                          商品链接 
                                          <Edit2 
                                            className="w-2.5 h-2.5" 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setProductLinkInput(item.productLink || '');
                                              setEditProductLinkOpen(true);
                                            }}
                                          />
                                        </span>
                                        </FeatureMarker>
                                      </div>
                                      <div className="text-gray-800 font-medium">{item.name || item.productName || 'ET木质方形浴帘盒 樱桃木'}</div>
                                      <div className="inline-block bg-[#8BC34A] text-white text-[10px] px-1.5 py-0.5 rounded-sm mt-1">同款降本</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 text-center border-r border-gray-200 align-middle leading-tight">
                                  <div className="font-medium text-gray-700 text-[13px] mb-1">{item.quantity || 100}</div>
                                  <div className="text-orange-500 mb-0.5">¥ {Number(item.price || 0).toFixed(2)}</div>
                                  <div className="text-orange-500 mb-0.5 font-medium">¥ {Number((item.price || 0) * 0.95).toFixed(4)}</div>
                                  <div className="text-orange-500 mb-0.5 font-medium">¥ {Number((item.price || 0) * 0.9).toFixed(2)}</div>
                                  <div className="text-orange-500">¥ --</div>
                                </td>
                                <td className="p-3 text-center border-r border-gray-200 text-gray-600 align-middle">
                                  <div>--</div>
                                  <div>--</div>
                                  <div>--</div>
                                  <div 
                                    className="text-blue-600 hover:underline cursor-pointer mt-1"
                                    onClick={() => {
                                      setCurrentInboundSku(item.sku || '24273848-BU-A0-EaH');
                                      setInboundDetailOpen(true);
                                    }}
                                  >
                                    查看入库明细
                                  </div>
                                </td>
                                <td className="p-3 text-center border-r border-gray-200 align-middle">
                                  <TooltipProvider delay={100}>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <span className="cursor-help border-b border-dashed border-gray-400">0/5/1</span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>对应库存SKU采购仓库的未发货量 - 库存数量（小于0按0展示）</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <div className="text-blue-600 flex items-center justify-center gap-1 mt-1">
                                    2026-05-08 
                                    <Edit2 
                                      className="w-3 h-3 cursor-pointer" 
                                      onClick={() => setEditArriveDateOpen(true)}
                                    />
                                  </div>
                                  <div className="text-orange-500 mt-1">还剩14天22时35分</div>
                                </td>
                                <td className="p-3 text-center border-r border-gray-200 align-middle">
                                  <div className="text-gray-800 font-medium mb-1">8/38/38</div>
                                  <div className="text-red-500 font-bold">1</div>
                                  <div className="text-gray-600 mt-1">2026-04-19 08:08:35</div>
                                </td>
                                <td className="p-3 text-center align-middle">
                                  <List
                                    data-testid="open-plan-history"
                                    className="w-4 h-4 text-blue-600 cursor-pointer mx-auto mb-1"
                                    onClick={() => setHistoryOpen(true)}
                                  />
                                  <div className="text-blue-600 inline-block pb-0.5 cursor-default">2</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modals Implemented Based on Requirements */}

      {/* 2. 商品链接修改 */}
      <Dialog open={editProductLinkOpen} onOpenChange={setEditProductLinkOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-normal">修改商品链接</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="请输入商品链接地址 (如: https://...)" 
              value={productLinkInput}
              onChange={e => setProductLinkInput(e.target.value)}
              className="text-[13px]"
            />
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 bg-white" onClick={() => setEditProductLinkOpen(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button 
              className="h-8 px-6 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white" 
              onClick={() => {
                if (productLinkInput && !productLinkInput.startsWith('http')) {
                  alert('请输入有效的 http 或 https 链接');
                  return;
                }
                alert('商品链接保存成功！(Mock)');
                setEditProductLinkOpen(false);
              }}
            >
              确定
            </Button>
            </FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. 查看入库明细 */}
      <Dialog open={inboundDetailOpen} onOpenChange={setInboundDetailOpen}>
        <DialogContent className="max-w-[800px] p-0 gap-0">
          <DialogHeader className="p-4 border-b border-gray-200 bg-white">
            <DialogTitle className="text-[15px] font-normal text-gray-800">
              查看入库明细- 【{currentInboundSku}】
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-white">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F8F9FA] text-gray-500">
                <tr>
                  <th className="p-3 font-normal text-center">入库时间</th>
                  <th className="p-3 font-normal text-center">入库仓库</th>
                  <th className="p-3 font-normal text-center">入库仓位</th>
                  <th className="p-3 font-normal text-center">不良品仓</th>
                  <th className="p-3 font-normal text-center">入库量</th>
                  <th className="p-3 font-normal text-center">损耗量</th>
                  <th className="p-3 font-normal text-center">异常原因</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 border-b border-gray-100">
                    暂无入库数据
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex items-center text-gray-500 text-[13px] gap-4">
              <span>共 0 条</span>
              <div className="flex gap-1">
                <FeatureMarker title="&lt;" description="交互说明：点击执行&lt;操作。">
<Button variant="outline" size="sm" className="h-7 w-7 p-0 bg-gray-50" disabled>&lt;</Button>
</FeatureMarker>
                <FeatureMarker title="1" description="交互说明：点击执行1操作。">
<Button variant="outline" size="sm" className="h-7 w-7 p-0 bg-blue-500 text-white border-blue-500">1</Button>
</FeatureMarker>
                <FeatureMarker title="&gt;" description="交互说明：点击执行&gt;操作。">
<Button variant="outline" size="sm" className="h-7 w-7 p-0 bg-gray-50" disabled>&gt;</Button>
</FeatureMarker>
              </div>
              <select className="border border-gray-300 rounded px-2 h-7 text-[12px] outline-none">
                <option>10条/页</option>
              </select>
            </div>
          </div>
          <DialogFooter className="p-3 border-t border-gray-200 bg-gray-50/50 mx-0 mb-0">
            <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 bg-white" onClick={() => setInboundDetailOpen(false)}>关闭</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. 修改预计到货时间 */}
      <Dialog open={editArriveDateOpen} onOpenChange={setEditArriveDateOpen}>
        <DialogContent className="max-w-[600px] p-0 gap-0">
          <DialogHeader className="p-4 border-b border-gray-200">
            <DialogTitle className="text-[14px] font-normal text-gray-800">修改商品维度预计到货时间</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col text-[13px]">
            <div className="flex border-b border-gray-100">
              <div className="w-1/3 p-4 text-right text-gray-600 bg-gray-50/30">采购单号</div>
              <div className="w-2/3 p-4 text-gray-800">1570553252</div>
            </div>
            <div className="flex border-b border-gray-100">
              <div className="w-1/3 p-4 text-right text-gray-600 bg-gray-50/30">SKU</div>
              <div className="w-2/3 p-4 text-gray-800">10005924-AT-A1-2Y-BPP</div>
            </div>
            <div className="flex border-b border-gray-100 items-center">
              <div className="w-1/3 p-4 text-right text-gray-600 bg-gray-50/30 font-medium">商品维度到货时间</div>
              <div className="w-2/3 p-4">
                <Input 
                  type="date"
                  value={arriveDateInput}
                  onChange={e => setArriveDateInput(e.target.value)}
                  className="h-8 w-48 text-[13px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-3 border-t border-gray-200 bg-white sm:justify-end mx-0 mb-0">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="h-8 px-6 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white" onClick={() => {
              alert('预计到货时间已更新');
              setEditArriveDateOpen(false);
            }}>确定</Button>
            </FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 bg-white" onClick={() => setEditArriveDateOpen(false)}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6 & 7. 采购历史与计划详情 */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-[900px] p-0 gap-0 h-[600px] flex flex-col overflow-hidden bg-white">
          <div className="flex items-center border-b border-gray-200 pt-2 px-2 bg-gray-50 shrink-0">
            <div 
              className={`px-6 py-2 text-[14px] cursor-pointer rounded-t-sm border border-b-0 transition-colors ${historyActiveTab === 'history' ? 'bg-white border-gray-200 -mb-px text-blue-600 relative z-10' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
              onClick={() => setHistoryActiveTab('history')}
            >
              采购历史
            </div>
            <div 
              className={`px-6 py-2 text-[14px] cursor-pointer rounded-t-sm border border-b-0 transition-colors ${historyActiveTab === 'plan' ? 'bg-white border-gray-200 -mb-px text-blue-600 relative z-10' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
              onClick={() => setHistoryActiveTab('plan')}
            >
              采购计划
            </div>
          </div>
          
          {/* Tab 1 Content: 查看采购历史 */}
          {historyActiveTab === 'history' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-4 shrink-0 text-[13px]">
                <span className="text-gray-600">供应商:</span>
                <Input placeholder="请输入供应商名称" className="h-8 w-64 text-[13px]" />
                <FeatureMarker title="重置" description="交互说明：点击执行重置操作。">
<Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4">重置</Button>
</FeatureMarker>
              </div>
              <div className="flex-1 overflow-auto border border-gray-200 rounded-sm">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead className="bg-[#F8F9FA] text-gray-600 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">采购时间</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">采购单</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">供应商</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">运费(¥)</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">单价(¥)</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">数量(件)</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">总价(¥)</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">入库量</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">损耗量</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center w-32">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 text-center">2026-04-23 09:19:01</td>
                      <td className="p-3 text-center text-blue-600 cursor-pointer">1570553252</td>
                      <td className="p-3 text-center">大连旭笙服创制衣有限公司</td>
                      <td className="p-3 text-center">--</td>
                      <td className="p-3 text-center">--</td>
                      <td className="p-3 text-center">5</td>
                      <td className="p-3 text-center">--</td>
                      <td className="p-3 text-center">0</td>
                      <td className="p-3 text-center">0</td>
                      <td className="p-3 text-center">
                        <FeatureMarker title="更换为此供应商" description="交互说明：点击执行更换为此供应商操作。">
                        <Button 
                          size="sm" 
                          className="h-7 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white text-[12px] px-2 w-full"
                          onClick={() => alert('已将当前采购单更换为此供应商！(Mock)')}
                        >
                          更换为此供应商
                        </Button>
                        </FeatureMarker>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between text-[13px] text-gray-500 shrink-0">
                <div className="flex items-center gap-4">
                  <span>每页显示200条 共1条</span>
                  <div className="flex gap-1">
                    <FeatureMarker title="首页" description="交互说明：点击执行首页操作。">
<Button variant="outline" size="sm" className="h-7 px-3 text-gray-400 bg-gray-50" disabled>首页</Button>
</FeatureMarker>
                    <FeatureMarker title="上一页" description="交互说明：点击执行上一页操作。">
<Button variant="outline" size="sm" className="h-7 px-3 text-gray-400 bg-gray-50" disabled>上一页</Button>
</FeatureMarker>
                    <FeatureMarker title="下一页" description="交互说明：点击执行下一页操作。">
<Button variant="outline" size="sm" className="h-7 px-3 text-gray-400 bg-gray-50" disabled>下一页</Button>
</FeatureMarker>
                    <FeatureMarker title="尾页" description="交互说明：点击执行尾页操作。">
<Button variant="outline" size="sm" className="h-7 px-3 text-gray-400 bg-gray-50" disabled>尾页</Button>
</FeatureMarker>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input className="h-7 w-16 text-center text-[12px]" placeholder="页码" />
                  <FeatureMarker title="跳转" description="交互说明：点击执行跳转操作。">
<Button variant="outline" size="sm" className="h-7 px-3 text-gray-600 bg-white">跳转</Button>
</FeatureMarker>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2 Content: 计划详情 */}
          {historyActiveTab === 'plan' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex-1 overflow-auto border border-gray-200 rounded-sm">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead className="bg-[#F8F9FA] text-gray-600 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">计划号</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">计划来源</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">采购计划仓库</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">数量</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">期望到货时间</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">申请人</th>
                      <th className="p-3 font-normal border-b border-gray-200 text-center">申请备注</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 text-center text-blue-600 cursor-pointer hover:underline">PLAN-20260423-001</td>
                      <td className="p-3 text-center">缺货预警</td>
                      <td className="p-3 text-center">东莞厚街仓</td>
                      <td className="p-3 text-center">100</td>
                      <td className="p-3 text-center">2026-04-25</td>
                      <td className="p-3 text-center">Yanny</td>
                      <td className="p-3 text-center text-gray-500">紧急补货</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 text-center text-blue-600 cursor-pointer hover:underline">PLAN-20260421-042</td>
                      <td className="p-3 text-center">安全库存</td>
                      <td className="p-3 text-center">深圳坂田仓</td>
                      <td className="p-3 text-center">50</td>
                      <td className="p-3 text-center">2026-04-28</td>
                      <td className="p-3 text-center">Sys</td>
                      <td className="p-3 text-center text-gray-500">--</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <DialogFooter className="p-3 border-t border-gray-200 bg-white shrink-0 sm:justify-end mx-0 mb-0">
            <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 bg-white" onClick={() => setHistoryOpen(false)}>关闭</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Order No Dialog */}
      <Dialog open={!!editCustomOrderNoId} onOpenChange={() => setEditCustomOrderNoId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>修改自定义单号</DialogTitle></DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="请输入自定义单号 (字母数字，限16位)" 
              maxLength={16}
              value={customOrderNoInput}
              onChange={(e) => setCustomOrderNoInput(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
            />
            <div className="mt-4 flex justify-end gap-2">
              <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setEditCustomOrderNoId(null)}>取消</Button>
</FeatureMarker>
              <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
              <Button onClick={() => {
                setOrders((prev: any[]) => prev.map(o => o.id === editCustomOrderNoId ? { ...o, customOrderNo: customOrderNoInput } : o));
                setEditCustomOrderNoId(null);
              }}>确定</Button>
              </FeatureMarker>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 批量调整商品数量嵌套弹框 */}
      <Dialog open={batchAdjustOpen} onOpenChange={setBatchAdjustOpen}>
        <DialogContent className="w-[600px] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-left font-normal text-[15px] text-gray-800">批量调整商品数量</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-gray-50/50 flex flex-col items-center justify-center gap-3">
            <div className="w-full max-w-[500px] flex flex-col gap-2">
              <div className="text-gray-600 text-center whitespace-nowrap text-sm">
                每行一个 <span className="text-blue-600 font-medium">库存SKU, 数量</span> （支持excel复制粘贴）
              </div>
              <textarea 
                className="w-full h-48 border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none bg-white"
                value={batchAdjustText}
                onChange={(e) => setBatchAdjustText(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4 border-t flex justify-end gap-3 bg-white">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button 
              className="bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 font-normal" 
              onClick={() => {
                if (!batchAdjustText.trim()) {
                  setBatchAdjustOpen(false);
                  return;
                }
                
                const lines = batchAdjustText.split('\n').map(l => l.trim()).filter(Boolean);
                const updates = new Map<string, number>();
                
                lines.forEach(line => {
                  // 支持以制表符（Excel）或逗号分隔
                  const parts = line.split(/[\t,]/).map(p => p.trim());
                  if (parts.length >= 2) {
                    const sku = parts[0];
                    const qty = parseInt(parts[1]);
                    if (sku && !isNaN(qty) && qty > 0) {
                      updates.set(sku, qty);
                    }
                  }
                });

                if (updates.size > 0) {
                  const newItems = editItemsData.map(item => {
                    if (updates.has(item.sku)) {
                      return { ...item, editQuantity: updates.get(item.sku) };
                    }
                    return item;
                  });
                  setEditItemsData(newItems);
                  setToastMessage(`成功匹配并调整了 ${updates.size} 条商品的数量`);
                  setTimeout(() => setToastMessage(null), 2000);
                }
                
                setBatchAdjustText("");
                setBatchAdjustOpen(false);
              }}
            >
              确定
            </Button>
            </FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
            <Button variant="outline" className="px-6 border-gray-200 hover:bg-gray-50 text-gray-600 font-normal" onClick={() => {
              setBatchAdjustText("");
              setBatchAdjustOpen(false);
            }}>
              取消
            </Button>
            </FeatureMarker>
          </div>
        </DialogContent>
      </Dialog>

      {/* Supplier Dialog */}
      <Dialog open={!!changeSupplierId} onOpenChange={() => { setChangeSupplierId(null); setOpenSupplierSelect(false); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>更换供应商</DialogTitle></DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-red-500">*</span> 供应商
              <Popover open={openSupplierSelect} onOpenChange={setOpenSupplierSelect}>
                <PopoverTrigger className="inline-flex h-8 flex-1 items-center justify-between whitespace-nowrap rounded-lg border border-input bg-transparent px-2.5 py-1 text-[13px] transition-colors outline-none hover:bg-muted">
                  {supplierSelected
                    ? supplierOptions.find((s) => s.value === supplierSelected)?.label
                    : "选择供应商..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-[360px] p-0" align="start">
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
                              setSupplierSelected(s.value);
                              setOpenSupplierSelect(false);
                            }}
                            className="text-[13px]"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                supplierSelected === s.value ? "opacity-100" : "opacity-0"
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
            </div>
            <div className="mt-4 flex justify-end gap-4 items-center">
              <label className="flex items-center gap-1 text-[12px] cursor-pointer">
                <input type="checkbox" className="cursor-pointer" /> 
                自动关联供应商
                <TooltipProvider delay={100}>
                  <Tooltip>
                    <TooltipTrigger className="inline-flex items-center">
                      <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px] text-[12px] leading-relaxed">
                      <p>若勾选自动关联供应商，如果当前选择的供应商，未与采购单下的商品进行关联，则系统会自动进行关联</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <label className="flex items-center gap-1 text-[12px] cursor-pointer">
                <input type="checkbox" className="cursor-pointer" /> 
                设为默认供应商
                <TooltipProvider delay={100}>
                  <Tooltip>
                    <TooltipTrigger className="inline-flex items-center">
                      <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px] text-[12px] leading-relaxed">
                      <p>勾选后，会将当前选择的供应商设置为已选采购单下所有商品的默认供应商</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setChangeSupplierId(null)}>取消</Button>
</FeatureMarker>
              <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
              <Button onClick={() => {
                setOrders((prev: any[]) => prev.map(o => o.id === changeSupplierId ? { ...o, supplierName: supplierSelected } : o));
                setChangeSupplierId(null);
              }}>确定</Button>
              </FeatureMarker>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Warehouse Dialog */}
      <Dialog open={!!changeWarehouseId} onOpenChange={() => { setChangeWarehouseId(null); setOpenWarehouseSelect(false); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>更换仓库</DialogTitle></DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-red-500">*</span> 仓库
              <Popover open={openWarehouseSelect} onOpenChange={setOpenWarehouseSelect}>
                <PopoverTrigger className="inline-flex h-8 flex-1 items-center justify-between whitespace-nowrap rounded-lg border border-input bg-transparent px-2.5 py-1 text-[13px] transition-colors outline-none hover:bg-muted">
                  {warehouseSelected
                    ? warehouseOptions.find((w) => w.value === warehouseSelected)?.label
                    : "选择仓库..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-[360px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="搜索仓库..." className="h-8 text-[13px]" />
                    <CommandList>
                      <CommandEmpty className="py-2 text-center text-[13px]">未找到仓库</CommandEmpty>
                      <CommandGroup>
                        {warehouseOptions.map((w) => (
                          <CommandItem
                            key={w.value}
                            value={w.value}
                            onSelect={() => {
                              setWarehouseSelected(w.value);
                              setOpenWarehouseSelect(false);
                            }}
                            className="text-[13px]"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                warehouseSelected === w.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {w.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setChangeWarehouseId(null)}>取消</Button>
</FeatureMarker>
              <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
              <Button onClick={() => {
                setOrders((prev: any[]) => prev.map(o => o.id === changeWarehouseId ? { ...o, warehouse: warehouseSelected } : o));
                setChangeWarehouseId(null);
              }}>确定</Button>
              </FeatureMarker>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Extra Fee Dialog */}
      <Dialog open={!!editExtraFeeId} onOpenChange={() => setEditExtraFeeId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>修改额外费用</DialogTitle></DialogHeader>
          <div className="py-4">
            <Input 
              type="number"
              min="0"
              step="0.01"
              placeholder="请输入额外费用" 
              value={extraFeeInput}
              onChange={(e) => setExtraFeeInput(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setEditExtraFeeId(null)}>取消</Button>
</FeatureMarker>
              <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
              <Button onClick={() => {
                const val = parseFloat(extraFeeInput);
                if (!isNaN(val) && val >= 0) {
                  setOrders((prev: any[]) => prev.map(o => o.id === editExtraFeeId ? { ...o, extraFee: Number(val.toFixed(2)) } : o));
                  setEditExtraFeeId(null);
                } else {
                  alert('请输入大于等于0的数字');
                }
              }}>确定</Button>
              </FeatureMarker>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logistics Dialog */}
      <Dialog open={!!addLogisticsId} onOpenChange={() => { setAddLogisticsId(null); setLogisticsRows([{ id: 1, fee: '0.00', company: '', no: '' }]); }}>
        <DialogContent className="max-w-[980px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-200"><DialogTitle>修改物流信息</DialogTitle></DialogHeader>
          <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <table className="w-full text-[12px] border text-center">
              <thead className="bg-gray-50 border-b sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-2 font-normal"><span className="text-red-500">*</span>采购单号</th>
                  <th className="p-2 font-normal"><span className="text-red-500">*</span>运费</th>
                  <th className="p-2 font-normal"><span className="text-red-500">*</span>物流公司</th>
                  <th className="p-2 font-normal">签收状态</th>
                  <th className="p-2 font-normal"><span className="text-red-500">*</span>物流单号</th>
                </tr>
              </thead>
              <tbody>
                {logisticsRows.map((row, index) => (
                  <tr key={row.id} className={index > 0 ? "border-t border-gray-100" : ""}>
                    <td className="p-2">{addLogisticsId && newOrders.find((o: any) => o.id === addLogisticsId)?.orderNo}</td>
                    <td className="p-2">
                      <Input 
                        className="h-7 text-[12px] w-24 mx-auto" 
                        value={row.fee} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setLogisticsRows(prev => prev.map((r, i) => i === index ? { ...r, fee: val } : r));
                        }}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0) {
                            setLogisticsRows(prev => prev.map((r, i) => i === index ? { ...r, fee: val.toFixed(2) } : r));
                          } else {
                            setLogisticsRows(prev => prev.map((r, i) => i === index ? { ...r, fee: '0.00' } : r));
                          }
                        }}
                      /> RMB
                    </td>
                    <td className="p-2">
                      <select 
                        className="border p-1 rounded w-28"
                        value={row.company}
                        onChange={(e) => setLogisticsRows(prev => prev.map((r, i) => i === index ? { ...r, company: e.target.value } : r))}
                      >
                        <option value="">请选择</option>
                        <option value="顺丰速运">顺丰速运</option>
                        <option value="中通快递">中通快递</option>
                        <option value="圆通速递">圆通速递</option>
                        <option value="韵达速递">韵达速递</option>
                      </select>
                    </td>
                    <td className="p-2">未签收</td>
                    <td className="p-2 flex items-center justify-center gap-1">
                      <Input 
                        className="h-7 text-[12px] w-48" 
                        value={row.no}
                        onChange={(e) => setLogisticsRows(prev => prev.map((r, i) => i === index ? { ...r, no: e.target.value } : r))}
                      />
                      {index === logisticsRows.length - 1 && (
                        <FeatureMarker title="+" description="交互说明：点击执行+操作。">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-6 w-6" 
                          onClick={() => setLogisticsRows(prev => [...prev, { id: Date.now(), fee: '0.00', company: '', no: '' }])}
                        >
                          +
                        </Button>
                        </FeatureMarker>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end gap-2 border-t pt-4">
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => { setAddLogisticsId(null); setLogisticsRows([{ id: 1, fee: '0.00', company: '', no: '' }]); }}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button onClick={() => {
              // Validate all fields
              const isValid = logisticsRows.every(r => r.fee && r.company && r.no);
              if (!isValid) {
                alert('请填写所有必填信息（运费、物流公司、物流单号）');
                return;
              }
              // Save to order
              setOrders((prev: any[]) => prev.map(o => {
                if (o.id === addLogisticsId) {
                  const existing = o.logistics || [];
                  return { ...o, logistics: [...existing, ...logisticsRows] };
                }
                return o;
              }));
              setAddLogisticsId(null);
              setLogisticsRows([{ id: 1, fee: '0.00', company: '', no: '' }]);
            }}>确定</Button>
            </FeatureMarker>
          </div>
        </DialogContent>
      </Dialog>

      {/* Placeholder Dialogs for complex operations */}
      <Dialog open={!!splitOrderId} onOpenChange={() => { setSplitOrderId(null); setSplitSelections({}); setSplitQuantities({}); }}>
        <DialogContent className="max-w-[900px] p-0 gap-0 overflow-hidden h-[80vh] flex flex-col">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-left font-semibold text-base text-gray-800">拆分采购单</DialogTitle>
          </DialogHeader>
          <div className="py-3 px-4 text-sm text-gray-600">
            采购单：{splitOrderId && newOrders.find((o: any) => o.id === splitOrderId)?.orderNo}
          </div>
          <div className="px-4 pb-4 flex-1">
            <table className="w-full text-sm border border-gray-100 text-center">
              <thead className="bg-[#F5F5F5] sticky top-0 z-10">
                <tr>
                  <th className="p-3 font-medium whitespace-nowrap w-20 text-gray-800">缩略图</th>
                  <th className="p-3 font-medium text-left whitespace-nowrap text-gray-800">SKU编号/名称</th>
                  <th className="p-3 font-medium whitespace-nowrap text-gray-800">原厂SKU</th>
                  <th className="p-3 font-medium whitespace-nowrap text-gray-800">采购价</th>
                  <th className="p-3 font-medium whitespace-nowrap w-20 text-gray-800">数量</th>
                  <th className="p-3 font-medium w-32 whitespace-nowrap text-gray-800">拆分数量</th>
                </tr>
              </thead>
              <tbody>
                {splitOrderId && newOrders.find((o: any) => o.id === splitOrderId)?.items?.map((item: any, index: number) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="p-3 flex justify-center">
                      <img src={item.imageUrl || "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=product+thumbnail&image_size=square"} alt="thumb" className="w-12 h-12 object-cover border border-gray-200" />
                    </td>
                    <td className="p-3 text-left">
                      <div className="text-[#03A9F4]">{item.sku || '10000011-WH-A0-ET_TQET_TQ'}</div>
                      <div className="text-gray-600 text-[12px] mt-1">{item.name || item.productName || '陶瓷花瓶_白色小号_底径9.5cm 高度14.5cm 口径8cm'}</div>
                    </td>
                    <td className="p-3"></td>
                    <td className="p-3 text-gray-600">{Number(item.price || 10).toFixed(2)}</td>
                    <td className="p-3 text-gray-600">{item.quantity}</td>
                    <td className="p-3">
                      <Input 
                        type="number"
                        min="1"
                        max={item.quantity - 1}
                        value={splitQuantities[index] || ''}
                        onChange={(e) => {
                          let val = parseInt(e.target.value);
                          if (val > item.quantity - 1) val = item.quantity - 1;
                          if (val < 1) val = 1;
                          setSplitQuantities(prev => ({ ...prev, [index]: val }));
                          // 自动将有数量的设为选中状态
                          if (!isNaN(val)) {
                            setSplitSelections(prev => ({ ...prev, [index]: true }));
                          } else {
                            setSplitSelections(prev => ({ ...prev, [index]: false }));
                          }
                        }}
                        className="w-24 mx-auto text-center h-8 rounded-sm focus-visible:ring-1 focus-visible:ring-[#03A9F4]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t flex justify-end gap-3">
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="px-6 border-gray-200 hover:bg-gray-50 text-gray-600 font-normal" onClick={() => { setSplitOrderId(null); setSplitSelections({}); setSplitQuantities({}); }}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确认" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-[#03A9F4] hover:bg-[#039BE5] text-white px-6 font-normal" onClick={() => {
              const originalOrder = newOrders.find((o: any) => o.id === splitOrderId);
              if (!originalOrder) return;
              
              const itemsToSplit = Object.entries(splitSelections)
                .filter(([_, isSelected]) => isSelected)
                .map(([indexStr]) => {
                  const idx = parseInt(indexStr);
                  const qty = splitQuantities[idx] || 1;
                  return { originalIndex: idx, splitQty: qty, item: originalOrder.items[idx] };
                });

              if (itemsToSplit.length === 0) {
                alert('请至少在一条数据内填写拆分数量');
                return;
              }

              const newOrderNo = 'PO' + Date.now();
              const newOrderItems = itemsToSplit.map(s => ({
                ...s.item,
                quantity: s.splitQty,
                totalAmount: s.splitQty * (s.item.price || 0)
              }));

              const newOrder = {
                ...originalOrder,
                id: Date.now().toString(),
                orderNo: newOrderNo,
                items: newOrderItems,
                totalQuantity: newOrderItems.reduce((acc, cur) => acc + cur.quantity, 0),
                totalPrice: newOrderItems.reduce((acc, cur) => acc + cur.totalAmount, 0),
                remark: `从采购单【${originalOrder.orderNo}】拆分成新采购单`,
                status: '新订单（未提交）',
                createdAt: new Date().toISOString()
              };

              const updatedOriginalItems = [...originalOrder.items];
              itemsToSplit.forEach(s => {
                updatedOriginalItems[s.originalIndex] = {
                  ...updatedOriginalItems[s.originalIndex],
                  quantity: updatedOriginalItems[s.originalIndex].quantity - s.splitQty,
                  totalAmount: (updatedOriginalItems[s.originalIndex].quantity - s.splitQty) * (updatedOriginalItems[s.originalIndex].price || 0)
                };
              });
              
              setOrders((prev: any[]) => {
                const next = prev.map(o => {
                  if (o.id === originalOrder.id) {
                    return {
                      ...o,
                      items: updatedOriginalItems,
                      totalQuantity: updatedOriginalItems.reduce((acc, cur) => acc + cur.quantity, 0),
                      totalPrice: updatedOriginalItems.reduce((acc, cur) => acc + cur.totalAmount, 0),
                      remark: `拆分出新采购单【${newOrderNo}】` + (o.remark ? `\n${o.remark}` : '')
                    };
                  }
                  return o;
                });
                return [newOrder, ...next];
              });
              
              setToastMessage('拆分成功');
              setTimeout(() => setToastMessage(null), 2000);
              setSplitOrderId(null);
              setSplitSelections({});
              setSplitQuantities({});
            }}>确认</Button>
            </FeatureMarker>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 审核详情 Dialog */}
      <Dialog open={!!auditOrderId} onOpenChange={() => setAuditOrderId(null)}>
        <DialogContent className="w-auto min-w-[700px] max-w-[calc(100vw-2rem)] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-left font-semibold text-base text-gray-800">审批详情</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="purchase" className="w-full flex flex-col overflow-hidden px-4 pt-4">
            <TabsList className="flex w-fit shrink-0 justify-start h-9 bg-transparent p-0">
              <TabsTrigger 
                value="purchase" 
                className="h-full rounded-t-xl rounded-b-none border border-b-0 border-gray-200 bg-white data-[state=active]:bg-[#03A9F4] data-[state=active]:text-white data-[state=active]:border-[#03A9F4] data-[state=active]:shadow-none px-6 font-normal"
              >
                采购审批详情
              </TabsTrigger>
              <TabsTrigger 
                value="payment" 
                className="h-full rounded-t-xl rounded-b-none border border-b-0 border-l-0 border-gray-200 bg-white data-[state=active]:bg-[#03A9F4] data-[state=active]:text-white data-[state=active]:border-[#03A9F4] data-[state=active]:border-l data-[state=active]:shadow-none px-6 font-normal -ml-[1px]"
              >
                付款审批详情
              </TabsTrigger>
            </TabsList>
            <TabsContent value="purchase" className="flex-1 m-0 outline-none pb-4">
              <table className="w-full text-sm border border-gray-100 text-center">
                <thead className="bg-[#F5F5F5] sticky top-0 z-10">
                  <tr>
                    <th className="p-3 font-medium whitespace-nowrap w-40 text-gray-800">审核时间</th>
                    <th className="p-3 font-medium text-left whitespace-nowrap min-w-[400px] text-gray-800">审核描述</th>
                    <th className="p-3 font-medium whitespace-nowrap w-40 text-gray-800">审核备注</th>
                    <th className="p-3 font-medium whitespace-nowrap w-32 text-gray-800">审核人</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="p-4 text-gray-600 whitespace-nowrap align-middle">2026-04-17<br/>17:56:00</td>
                    <td className="p-4 text-left align-middle leading-relaxed text-gray-600 line-clamp-2" title="自动提交采购;所属采购仓库:东莞厚街库;采购单金额范围100-;符合规则【采购审批规则】进入待审核;待审核人:王朋,">
                      自动提交采购;所属采购仓库:东莞厚街库;采购单金额范围<br/>100-;符合规则【采购审批规则】进入待审核;待审核<br/>人:王朋,
                    </td>
                    <td className="p-4 align-middle text-gray-600"></td>
                    <td className="p-4 align-middle text-gray-600">刘甜</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-4 text-gray-600 whitespace-nowrap align-middle">2026-04-17<br/>18:02:00</td>
                    <td className="p-4 text-left align-middle text-gray-600">审核通过</td>
                    <td className="p-4 align-middle text-gray-600"></td>
                    <td className="p-4 align-middle text-gray-600">peng</td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>
            <TabsContent value="payment" className="flex-1 m-0 outline-none pb-4">
              <table className="w-full text-sm border border-gray-100 text-center">
                <thead className="bg-[#F5F5F5] sticky top-0 z-10">
                  <tr>
                    <th className="p-3 font-medium text-left whitespace-nowrap text-gray-800">付款单号</th>
                    <th className="p-3 font-medium text-left whitespace-nowrap text-gray-800">最后审核时间</th>
                    <th className="p-3 font-medium whitespace-nowrap text-gray-800">审核人</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-8 text-gray-600" colSpan={3}>暂无数据</td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* 操作日志 Dialog */}
      <Dialog open={operationLogOpen} onOpenChange={setOperationLogOpen}>
        <DialogContent className="max-w-[800px] p-0 gap-0 h-[60vh] flex flex-col bg-white">
          <DialogHeader className="p-3 border-b border-gray-200 shrink-0">
            <DialogTitle className="text-[14px] font-normal text-gray-800">操作日志</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-0 custom-scrollbar">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm">
                <tr className="text-gray-500 border-b border-gray-200">
                  <th className="p-3 font-normal w-40 text-center">操作时间</th>
                  <th className="p-3 font-normal">操作描述</th>
                  <th className="p-3 font-normal w-24 text-center">操作人</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="p-3 text-center text-gray-600 align-middle">
                    2026-04-21 16:06
                  </td>
                  <td className="p-3 text-gray-800 align-middle">
                    修改商品54314625-BK-AXL-CGaA原单价24.0000修改为23.0000
                  </td>
                  <td className="p-3 text-center text-gray-600 align-middle">Yanny</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 text-center text-gray-600 align-middle">
                    2026-04-21 15:59
                  </td>
                  <td className="p-3 text-gray-800 align-middle">
                    采购单下商品【10003066-0-A2XL-GY】，上次采购价设置为**
                  </td>
                  <td className="p-3 text-center text-gray-600 align-middle">sys</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 text-center text-gray-600 align-middle">
                    2026-04-21 15:59
                  </td>
                  <td className="p-3 text-gray-800 align-middle">
                    手工生成采购单;采购单收货仓库:东莞厚街仓;采购单供货商名称:龙港市康梦塑料制品厂
                  </td>
                  <td className="p-3 text-center text-gray-600 align-middle">Yanny</td>
                </tr>
              </tbody>
            </table>
          </div>
          <DialogFooter className="p-3 border-t border-gray-200 shrink-0 bg-white sm:justify-end mx-0 mb-0">
            <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 bg-white" onClick={() => setOperationLogOpen(false)}>关闭</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑采购单 Dialog */}
      <Dialog open={!!editOrderId} onOpenChange={() => setEditOrderId(null)}>
        <DialogContent className="w-auto min-w-[1200px] max-w-[calc(100vw-2rem)] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-left font-normal text-[15px] text-gray-800">
              采购商品详情 <span className="text-gray-500 text-sm ml-1">(采购单：{editOrderId && newOrders.find((o: any) => o.id === editOrderId)?.orderNo} 采购状态：{editOrderId && newOrders.find((o: any) => o.id === editOrderId)?.status.replace('（未提交）', '')} 付款状态：{editOrderId && newOrders.find((o: any) => o.id === editOrderId)?.paymentStatus} 币种：RMB)</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
            {/* Search/Filter Area */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 font-medium whitespace-nowrap">搜索类型</span>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="text-blue-600 border-b-2 border-blue-600 pb-1 cursor-pointer">库存SKU</span>
                  <span className="cursor-pointer pb-1">库存SKU名称</span>
                  <span className="cursor-pointer pb-1">原厂sku</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 font-medium whitespace-nowrap">搜索内容</span>
                <div className="flex items-center max-w-[400px] w-full">
                  <Input placeholder="请输入关键字" className="rounded-r-none h-8 text-sm focus-visible:ring-0 border-r-0" />
                  <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
                  <Button className="h-8 rounded-l-none bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 gap-1">
                    <Search className="w-4 h-4" /> 搜索
                  </Button>
                  </FeatureMarker>
                </div>
              </div>
              <div>
                <FeatureMarker title="批量调整商品数量" description="交互说明：点击执行批量调整商品数量操作。">
<Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-sm font-normal" onClick={() => setBatchAdjustOpen(true)}>批量调整商品数量</Button>
</FeatureMarker>
              </div>
            </div>

            {/* Table Area */}
            <div className="border border-gray-100 mt-2">
              <table className="w-full text-sm text-center">
                <thead className="bg-[#F5F5F5] sticky top-0 z-10 border-b border-gray-100">
                  <tr>
                    <th className="p-3 font-medium whitespace-nowrap text-gray-700">缩略图</th>
                    <th className="p-3 font-medium text-left whitespace-nowrap text-gray-700">库存SKU/商品名称</th>
                    <th className="p-3 font-medium whitespace-nowrap text-gray-700">采购数量</th>
                    <th className="p-3 font-medium whitespace-nowrap text-gray-700">已入库/损耗量</th>
                    <th className="p-3 font-medium whitespace-nowrap text-gray-700">
                      <div className="flex items-center justify-center gap-1 group relative">
                        数量调整 
                        <HelpCircle className="w-3.5 h-3.5 text-blue-600 cursor-help" />
                        <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-[12px] rounded shadow-lg z-50 whitespace-normal text-left font-normal">
                          数量调整不能低于已入库量；数量调整为0，即在采购单中删除该商品
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </th>
                    <th className="p-3 font-medium whitespace-nowrap text-gray-700">上次采购价<br/>最低采购价</th>
                    <th className="p-3 font-medium whitespace-nowrap text-gray-700">单价</th>
                    <th className="p-3 font-medium whitespace-nowrap text-gray-700">含税单价</th>
                    <th className="p-3 font-medium whitespace-nowrap text-gray-700">折扣</th>
                    <th className="p-3 font-medium whitespace-nowrap text-gray-700">小计</th>
                  </tr>
                </thead>
                <tbody>
                  {editItemsData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                      <td className="p-3 flex justify-center">
                        <img src={item.imageUrl || "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=product+thumbnail&image_size=square"} alt="thumb" className="w-12 h-12 object-cover border border-gray-200" />
                      </td>
                      <td className="p-3 text-left">
                        <div className="text-gray-800">{item.sku}</div>
                        <div className="text-gray-600 text-[12px] mt-1 max-w-[200px] leading-snug">{item.name || item.productName}</div>
                      </td>
                      <td className="p-3 text-gray-600">{item.quantity}</td>
                      <td className="p-3 text-gray-600">0/0</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
                          <button 
                            className="w-6 h-6 flex items-center justify-center bg-[#5C6BC0] text-white rounded hover:bg-[#3F51B5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.editQuantity <= 1}
                            onClick={() => {
                              const newItems = [...editItemsData];
                              newItems[index].editQuantity = Math.max(1, newItems[index].editQuantity - 1);
                              setEditItemsData(newItems);
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          </FeatureMarker>
                          <Input 
                            className="w-16 h-7 text-center px-1 text-[13px] bg-gray-50 border-gray-200 focus-visible:ring-0" 
                            readOnly
                            value={Number(item.editQuantity || 0).toFixed(2)} 
                          />
                          <FeatureMarker title="添加" description="交互说明：点击打开新增弹窗，录入新数据。">
                          <button 
                            className="w-6 h-6 flex items-center justify-center bg-[#5C6BC0] text-white rounded hover:bg-[#3F51B5] transition-colors"
                            onClick={() => {
                              const newItems = [...editItemsData];
                              newItems[index].editQuantity = (parseInt(newItems[index].editQuantity) || 0) + 1;
                              setEditItemsData(newItems);
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          </FeatureMarker>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600 leading-snug">
                        15 RMB<br/>10 RMB
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center">
                          <Input 
                            className="w-20 h-7 text-center px-1 text-[13px] rounded-r-none border-r-0 focus-visible:ring-1 focus-visible:ring-[#03A9F4] focus-visible:z-10" 
                            value={item.editPrice}
                            onChange={(e) => {
                              const newItems = [...editItemsData];
                              newItems[index].editPrice = e.target.value;
                              setEditItemsData(newItems);
                            }}
                            onBlur={(e) => {
                              let val = parseFloat(e.target.value);
                              if (isNaN(val) || val < 0) val = 0;
                              const newItems = [...editItemsData];
                              newItems[index].editPrice = val.toFixed(4);
                              setEditItemsData(newItems);
                            }}
                          />
                          <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
                          <button className="h-7 px-2 border border-gray-200 bg-gray-50 rounded-r-md text-[#5C6BC0] hover:bg-gray-100 flex items-center justify-center">
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          </FeatureMarker>
                        </div>
                      </td>
                      <td className="p-3 text-gray-800">{Number(item.editPrice || 0).toFixed(0)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center">
                          <Input 
                            className="w-16 h-7 text-center px-1 text-[13px] rounded-r-none border-r-0 focus-visible:ring-1 focus-visible:ring-[#03A9F4] focus-visible:z-10" 
                            value={item.editDiscount}
                            onChange={(e) => {
                              const newItems = [...editItemsData];
                              newItems[index].editDiscount = e.target.value;
                              setEditItemsData(newItems);
                            }}
                            onBlur={(e) => {
                              let val = parseFloat(e.target.value);
                              if (isNaN(val) || val < 0) val = 0;
                              const newItems = [...editItemsData];
                              newItems[index].editDiscount = val.toFixed(2);
                              setEditItemsData(newItems);
                            }}
                          />
                          <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
                          <button className="h-7 px-2 border border-gray-200 bg-gray-50 rounded-r-md text-[#5C6BC0] hover:bg-gray-100 flex items-center justify-center">
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          </FeatureMarker>
                        </div>
                      </td>
                      <td className="p-3">
                        <Input 
                          readOnly 
                          className="w-20 h-7 text-center px-1 text-[13px] bg-gray-50 border-gray-200 focus-visible:ring-0" 
                          value={Math.max(0, Number(item.editQuantity || 0) * Number(item.editPrice || 0) * Number(item.editDiscount || 1)).toFixed(2)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Area */}
          <div className="p-4 border-t flex justify-between items-center bg-gray-50/50">
            <div className="text-sm text-gray-700 flex gap-4">
              <span>商品合计金额：<span className="text-blue-600">{editItemsData.reduce((acc, item) => acc + Math.max(0, Number(item.editQuantity || 0) * Number(item.editPrice || 0) * Number(item.editDiscount || 1)), 0).toFixed(2)}</span> RMB</span>
              <span>采购单实付金额：<span className="text-blue-600">{editItemsData.reduce((acc, item) => acc + Math.max(0, Number(item.editQuantity || 0) * Number(item.editPrice || 0) * Number(item.editDiscount || 1)), 0).toFixed(2)}</span> RMB</span>
              <span>差异金额：<span className="text-blue-600">0.00</span> RMB</span>
            </div>
            <div className="flex gap-3">
              <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
              <Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 font-normal" onClick={() => {
                // Save logic
                const totalQty = editItemsData.reduce((acc, item) => acc + Number(item.editQuantity || 0), 0);
                const totalPrice = editItemsData.reduce((acc, item) => acc + Math.max(0, Number(item.editQuantity || 0) * Number(item.editPrice || 0) * Number(item.editDiscount || 1)), 0);
                
                setOrders((prev: any[]) => prev.map(o => {
                  if (o.id === editOrderId) {
                    return {
                      ...o,
                      items: editItemsData.map(i => ({
                        ...i,
                        quantity: Number(i.editQuantity),
                        price: Number(i.editPrice),
                        discount: Number(i.editDiscount),
                        totalAmount: Math.max(0, Number(i.editQuantity || 0) * Number(i.editPrice || 0) * Number(i.editDiscount || 1))
                      })),
                      totalQuantity: totalQty,
                      totalPrice: totalPrice,
                    };
                  }
                  return o;
                }));
                setToastMessage('编辑保存成功');
                setTimeout(() => setToastMessage(null), 2000);
                setEditOrderId(null);
              }}>确定</Button>
              </FeatureMarker>
              <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="px-6 border-gray-200 hover:bg-gray-50 text-gray-600 font-normal" onClick={() => setEditOrderId(null)}>取消</Button>
</FeatureMarker>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!voidOrderId} onOpenChange={() => {
        setVoidOrderId(null);
        setVoidType('all');
        setVoidSelections({});
        setVoidQuantities({});
        setVoidSearchKeyword('');
        setVoidSyncPlatform(false);
      }}>
        <DialogContent className={cn("p-0 gap-0 overflow-x-hidden transition-all duration-200", voidType === 'partial' ? "max-w-[900px]" : "max-w-[500px]")}>
          <DialogHeader className="p-4 border-b border-gray-200">
            <DialogTitle className="text-[15px] font-normal text-gray-800 flex items-center justify-between">
              作废采购单或者部分商品
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center cursor-pointer mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4 flex flex-col gap-4">
            {/* 单选切换区域 */}
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-700">
                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", voidType === 'all' ? "border-[#6B8EBE]" : "border-gray-300")}>
                  {voidType === 'all' && <div className="w-2 h-2 rounded-full bg-[#6B8EBE]" />}
                </div>
                作废整个采购单
                <input type="radio" className="hidden" checked={voidType === 'all'} onChange={() => setVoidType('all')} />
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-700">
                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", voidType === 'partial' ? "border-[#E6A23C]" : "border-gray-300")}>
                  {voidType === 'partial' && <div className="w-2 h-2 rounded-full bg-[#E6A23C]" />}
                </div>
                <div className="flex items-center gap-1 bg-[#FFF8E6] text-[#E6A23C] px-1.5 py-0.5 rounded-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  作废部分商品
                </div>
                <input type="radio" className="hidden" checked={voidType === 'partial'} onChange={() => setVoidType('partial')} />
              </label>

              {/* 部分作废时的搜索框 */}
              {voidType === 'partial' && (
                <div className="flex items-center ml-auto">
                  <select className="h-8 border border-gray-200 border-r-0 rounded-l text-[13px] px-2 outline-none text-gray-600 bg-white">
                    <option>库存SKU</option>
                    <option>商品名称</option>
                  </select>
                  <Input 
                    placeholder="请输入搜索内容" 
                    className="w-48 h-8 rounded-none border-x-0 focus-visible:ring-0 text-[13px]"
                    value={voidSearchKeyword}
                    onChange={(e) => setVoidSearchKeyword(e.target.value)}
                  />
                  <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
                  <Button className="h-8 rounded-l-none bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4">
                    <Search className="w-3.5 h-3.5 mr-1" /> 搜索
                  </Button>
                  </FeatureMarker>
                </div>
              )}
            </div>

            {/* 部分作废商品列表 */}
            {voidType === 'partial' && (
              <div className="border border-gray-200 mt-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="p-3 w-12 text-center">
                        <Checkbox 
                          checked={
                            voidOrderId && 
                            (orders || []).find(o => o.id === voidOrderId)?.items?.length > 0 &&
                            Object.keys(voidSelections).length === (orders || []).find(o => o.id === voidOrderId)?.items?.length &&
                            Object.values(voidSelections).every(Boolean)
                          }
                          onCheckedChange={(c) => {
                            const order = (orders || []).find(o => o.id === voidOrderId);
                            if (!order || !order.items) return;
                            const newSelections: Record<number, boolean> = {};
                            const newQuantities: Record<number, number> = {};
                            if (c) {
                              order.items.forEach((item: any, idx: number) => {
                                newSelections[idx] = true;
                                newQuantities[idx] = item.quantity;
                              });
                            }
                            setVoidSelections(newSelections);
                            setVoidQuantities(newQuantities);
                          }}
                        />
                      </th>
                      <th className="p-3 font-normal w-24">缩略图</th>
                      <th className="p-3 font-normal min-w-[300px]">库存SKU/商品名称</th>
                      <th className="p-3 font-normal w-24 text-center">原数量</th>
                      <th className="p-3 font-normal w-32 text-center">作废数量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(() => {
                      const order = (orders || []).find(o => o.id === voidOrderId);
                      if (!order || !order.items) return null;
                      
                      const filteredItems = order.items.map((item: any, index: number) => ({ item, index }))
                        .filter(({ item }: any) => {
                          if (!voidSearchKeyword) return true;
                          const kw = voidSearchKeyword.toLowerCase();
                          return item.sku?.toLowerCase().includes(kw) || item.name?.toLowerCase().includes(kw) || item.productName?.toLowerCase().includes(kw);
                        });

                      if (filteredItems.length === 0) {
                        return <tr><td colSpan={5} className="p-8 text-center text-gray-500">无匹配商品</td></tr>;
                      }

                      return filteredItems.map(({ item, index }: any) => (
                        <tr key={index} className="hover:bg-gray-50/50">
                          <td className="p-3 text-center align-middle">
                            <Checkbox 
                              checked={!!voidSelections[index]}
                              onCheckedChange={(c) => {
                                setVoidSelections(prev => ({ ...prev, [index]: !!c }));
                                if (c) {
                                  setVoidQuantities(prev => ({ ...prev, [index]: item.quantity }));
                                } else {
                                  setVoidQuantities(prev => {
                                    const next = { ...prev };
                                    delete next[index];
                                    return next;
                                  });
                                }
                              }}
                            />
                          </td>
                          <td className="p-3">
                            <img src={item.imageUrl || "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=product+thumbnail&image_size=square"} alt="thumb" className="w-12 h-12 object-cover border border-gray-200 rounded" />
                          </td>
                          <td className="p-3">
                            <div className="text-gray-800 text-[13px]">{item.sku}</div>
                            <div className="text-gray-500 text-[12px] mt-1 line-clamp-2">{item.name || item.productName}</div>
                          </td>
                          <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                          <td className="p-3 text-center">
                            <Input 
                              type="number"
                              min={1}
                              max={item.quantity}
                              value={voidQuantities[index] || ''}
                              disabled={!voidSelections[index]}
                              onChange={(e) => {
                                let val = parseInt(e.target.value);
                                if (isNaN(val)) val = 1;
                                if (val > item.quantity) val = item.quantity;
                                setVoidQuantities(prev => ({ ...prev, [index]: val }));
                              }}
                              className="w-20 mx-auto h-7 text-center px-1 text-[13px] focus-visible:ring-[#6B8EBE]"
                            />
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50/50">
            {voidType === 'all' && (
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-700 mr-auto ml-2">
                <Checkbox checked={voidSyncPlatform} onCheckedChange={(c) => setVoidSyncPlatform(!!c)} />
                是否同步取消1688平台订单
              </label>
            )}
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
            <Button variant="outline" className="h-8 px-6 text-gray-600 rounded-sm bg-white" onClick={() => {
              setVoidOrderId(null);
              setVoidType('all');
              setVoidSelections({});
              setVoidQuantities({});
              setVoidSearchKeyword('');
            }}>取消</Button>
            </FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="h-8 px-6 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white rounded-sm" onClick={() => {
              const originalOrder = (orders || []).find(o => o.id === voidOrderId);
              if (!originalOrder) return;

              if (voidType === 'all') {
                // 整单作废
                setOrders((prev: any[]) => prev.map(o => {
                  if (o.id === voidOrderId) {
                    return { 
                      ...o, 
                      status: '已作废',
                      totalPurchaseQty: o.totalQuantity,
                      unInboundQty: o.totalQuantity,
                      inboundQty: 0,
                      actualPayAmount: o.totalPrice
                    };
                  }
                  return o;
                }));
                setToastMessage('整单作废成功');
              } else {
                // 部分作废
                const itemsToVoid = Object.entries(voidSelections)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([indexStr]) => {
                    const idx = parseInt(indexStr);
                    const qty = voidQuantities[idx] || originalOrder.items[idx].quantity;
                    return { originalIndex: idx, voidQty: qty, item: originalOrder.items[idx] };
                  });

                if (itemsToVoid.length === 0) {
                  alert('请至少勾选一条需要作废的商品');
                  return;
                }

                // 拆分出作废的单据
                const voidOrderNo = originalOrder.orderNo; // 作废的保持原单号
                const remainOrderNo = 'PO' + Date.now(); // 剩余生成新单号

                const voidItems = itemsToVoid.map(s => ({
                  ...s.item,
                  quantity: s.voidQty,
                  totalAmount: s.voidQty * (s.item.price || 0)
                }));

                const voidOrder = {
                  ...originalOrder,
                  id: Date.now().toString() + '_void',
                  orderNo: voidOrderNo,
                  items: voidItems,
                  totalQuantity: voidItems.reduce((acc, cur) => acc + cur.quantity, 0),
                  totalPurchaseQty: voidItems.reduce((acc, cur) => acc + cur.quantity, 0),
                  unInboundQty: voidItems.reduce((acc, cur) => acc + cur.quantity, 0),
                  inboundQty: 0,
                  totalPrice: voidItems.reduce((acc, cur) => acc + cur.totalAmount, 0),
                  actualPayAmount: voidItems.reduce((acc, cur) => acc + cur.totalAmount, 0),
                  remark: `部分商品作废`,
                  status: '已作废',
                  createdAt: new Date().toISOString()
                };

                // 原单据变成剩余的单据
                const remainItems = originalOrder.items.map((item: any, idx: number) => {
                  const voidRecord = itemsToVoid.find(v => v.originalIndex === idx);
                  if (voidRecord) {
                    return {
                      ...item,
                      quantity: item.quantity - voidRecord.voidQty,
                      totalAmount: (item.quantity - voidRecord.voidQty) * (item.price || 0)
                    };
                  }
                  return item;
                }).filter((item: any) => item.quantity > 0);

                if (remainItems.length === 0) {
                  // 如果全部作废完了，等于整单作废
                  setOrders((prev: any[]) => prev.map(o => {
                    if (o.id === voidOrderId) {
                      return { 
                        ...o, 
                        status: '已作废',
                        totalPurchaseQty: o.totalQuantity,
                        unInboundQty: o.totalQuantity,
                        inboundQty: 0,
                        actualPayAmount: o.totalPrice
                      };
                    }
                    return o;
                  }));
                  setToastMessage('所有商品均被作废，已转为整单作废');
                } else {
                  setOrders((prev: any[]) => {
                    const next = prev.map(o => {
                      if (o.id === voidOrderId) {
                        const newRemainQty = remainItems.reduce((acc: number, cur: any) => acc + cur.quantity, 0);
                        const newRemainPrice = remainItems.reduce((acc: number, cur: any) => acc + cur.totalAmount, 0);
                        return {
                          ...o,
                          orderNo: remainOrderNo, // 新单号
                          items: remainItems,
                          totalQuantity: newRemainQty,
                          totalPurchaseQty: newRemainQty,
                          unInboundQty: newRemainQty,
                          inboundQty: 0,
                          totalPrice: newRemainPrice,
                          actualPayAmount: newRemainPrice,
                          remark: `原单号${voidOrderNo}部分商品作废后生成的新单`
                        };
                      }
                      return o;
                    });
                    return [voidOrder, ...next]; // 插入作废单
                  });
                  setToastMessage('部分商品作废成功');
                }
              }

              setTimeout(() => setToastMessage(null), 2000);
              setVoidOrderId(null);
              setVoidType('all');
              setVoidSelections({});
              setVoidQuantities({});
              setVoidSearchKeyword('');
            }}>确定</Button>
            </FeatureMarker>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!submitOrderId} onOpenChange={() => setSubmitOrderId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>确认提交采购?</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-600 leading-relaxed text-sm">
            符合需审批条件的采购单将会改为待审核状态，进入采购审核列表。否则将直接进入采购中！
          </div>
          <DialogFooter className="gap-2 sm:justify-end mx-0 mb-0">
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setSubmitOrderId(null)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确认" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-[#03A9F4] hover:bg-[#039BE5] text-white" onClick={() => {
              setOrders((prev: any[]) => prev.map(o => {
                if (o.id === submitOrderId) {
                  return { ...o, status: '新订单（待审核）' };
                }
                return o;
              }));
              setToastMessage('提交成功');
              setTimeout(() => setToastMessage(null), 2000);
              setSubmitOrderId(null);
            }}>确认</Button>
            </FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity">
          {toastMessage}
        </div>
      )}
      {/* 添加采购单大型弹框 */}
      {showAddOrder && (
        <AddOrderDialog 
          open={showAddOrder} 
          onOpenChange={setShowAddOrder} 
          onAddOrder={(newOrder) => {
            setOrders([newOrder, ...orders]);
            setToastMessage('添加采购单成功');
            setTimeout(() => setToastMessage(''), 2000);
          }}
        />
      )}

      <BatchOperationsModals 
        modalType={batchModalType}
        setModalType={setBatchModalType}
        selectedOrders={selectedOrders}
        orders={orders}
        setOrders={setOrders}
        setToastMessage={setToastMessage}
      />
    </div>
  );
}
