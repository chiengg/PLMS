import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, MoreHorizontal, Edit2, Copy, FileText, Truck, MapPin, HelpCircle, List, MessageSquare, ChevronsUp, Home, Layers, Minus, Plus, Search, Send, ChevronsUpDown, Check } from 'lucide-react';
import { mockOrders } from '../mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import MergeTable from './MergeTable';
import NewOrderTable from './NewOrderTable';
import AddItemsPage from './AddItemsPage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import AddOrderDialog from './AddOrderDialog';
import BatchOperationsModals, { BatchModalType } from './BatchOperationsModals';
import AutoOrder1688Modal from './AutoOrder1688Modal';
import { useNavigate } from 'react-router-dom';

export default function ManagementTable({ activeTab = '全部', filterValues = {}, setHideFilter }: { activeTab?: string, filterValues?: any, setHideFilter?: (hide: boolean) => void }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useLocalStorage<any[]>('purchase_orders_data_v11', mockOrders);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [batchModalType, setBatchModalType] = useState<BatchModalType>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [editingExtraFeeId, setEditingExtraFeeId] = useState<string | null>(null);
  const [extraFeeInput, setExtraFeeInput] = useState('');
  const [restoreOrderId, setRestoreOrderId] = useState<string | null>(null);

  // Modals state
  const [editProductLinkOpen, setEditProductLinkOpen] = useState(false);
  const [productLinkInput, setProductLinkInput] = useState('');
  
  const [inboundDetailOpen, setInboundDetailOpen] = useState(false);
  const [currentInboundSku, setCurrentInboundSku] = useState('');

  const [editArriveDateOpen, setEditArriveDateOpen] = useState(false);
  const [arriveDateInput, setArriveDateInput] = useState('');

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyActiveTab, setHistoryActiveTab] = useState<'history'|'plan'>('history');
  const [operationLogOpen, setOperationLogOpen] = useState(false);

  // New States for matched features
  const [addLogisticsId, setAddLogisticsId] = useState<string | null>(null);
  const [logisticsRows, setLogisticsRows] = useState<any[]>([{ id: 1, fee: '0.00', company: '', no: '' }]);
  
  const [auditOrderId, setAuditOrderId] = useState<string | null>(null);
  
  const [splitOrderId, setSplitOrderId] = useState<string | null>(null);
  const [splitSelections, setSplitSelections] = useState<Record<number, boolean>>({});
  const [splitQuantities, setSplitQuantities] = useState<Record<number, number>>({});
  
  const [addItemsOrderId, setAddItemsOrderId] = useState<string | null>(null);
  
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [editItemsData, setEditItemsData] = useState<any[]>([]);
  const [batchAdjustOpen, setBatchAdjustOpen] = useState(false);
  const [batchAdjustText, setBatchAdjustText] = useState("");

  const [voidOrderId, setVoidOrderId] = useState<string | null>(null);
  const [voidType, setVoidType] = useState<'all' | 'partial'>('all');
  const [voidSearchKeyword, setVoidSearchKeyword] = useState('');
  const [voidSelections, setVoidSelections] = useState<Record<number, boolean>>({});
  const [voidQuantities, setVoidQuantities] = useState<Record<number, number>>({});
  const [voidSyncPlatform, setVoidSyncPlatform] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [editCustomOrderNoId, setEditCustomOrderNoId] = useState<string | null>(null);
  const [customOrderNoInput, setCustomOrderNoInput] = useState('');

  const [changeSupplierId, setChangeSupplierId] = useState<string | null>(null);
  const [openSupplierSelect, setOpenSupplierSelect] = useState(false);
  const [supplierSelected, setSupplierSelected] = useState('');

  const [paymentApplyOrderId, setPaymentApplyOrderId] = useState<string | null>(null);
  const [paymentApplyRows, setPaymentApplyRows] = useState<any[]>([]);
  const [paymentApplyAmount, setPaymentApplyAmount] = useState<string>('0.00');
  const [paymentApplyIsPaid, setPaymentApplyIsPaid] = useState<boolean>(false);

  // Defective Modal State
  const [defectiveOrderId, setDefectiveOrderId] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewOrderIds, setReviewOrderIds] = useState<string[]>([]);
  const [reviewResult, setReviewResult] = useState<'通过' | '驳回'>('通过');
  const [reviewRemark, setReviewRemark] = useState('');
  const [withdrawOrderId, setWithdrawOrderId] = useState<string | null>(null);
  const [defectiveRows, setDefectiveRows] = useState<any[]>([]);

  // 1688 Reconcile State
  const [edit1688AmountId, setEdit1688AmountId] = useState<string | null>(null);
  const [edit1688AmountInput, setEdit1688AmountInput] = useState<string>('');
  
  const [setWangWangId, setSetWangWangId] = useState<string | null>(null);
  const [wangWangMethod, setWangWangMethod] = useState<'link' | 'input'>('link');

  const [autoOrder1688Id, setAutoOrder1688Id] = useState<string | null>(null);

  const supplierOptions = [
    { value: '深圳优声电子有限公司', label: '深圳优声电子有限公司' },
    { value: '广州能量科技有限公司', label: '广州能量科技有限公司' },
    { value: '东莞线材工厂', label: '东莞线材工厂' },
    { value: '惠州硅胶制品有限公司', label: '惠州硅胶制品有限公司' },
    { value: '曹县委要王工艺有限公司', label: '曹县委要王工艺有限公司' },
  ];

  React.useEffect(() => {
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

  if (activeTab === '待合并') {
    return <MergeTable orders={orders} setOrders={setOrders} filterValues={filterValues} />;
  }

  if (activeTab === '新订单') {
    return <NewOrderTable orders={orders} filterValues={filterValues} setOrders={setOrders} setHideFilter={setHideFilter} />;
  }

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
                  totalQuantity: mergedItems.reduce((acc: number, cur: any) => acc + (cur.quantity || 0), 0),
                  totalPrice: mergedItems.reduce((acc: number, cur: any) => acc + (cur.totalAmount || 0), 0)
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

  const getOperations = (order: any, activeTab: string) => {
    const status = order.status;
    const paymentStatus = order.paymentStatus === '待申请' ? '待申请付款' : (order.paymentStatus === '已申请' ? '已申请付款' : (order.paymentStatus || '待申请付款'));

    if (activeTab === '采购审核' || activeTab === '待审核') {
      return ['审核', '编辑', '追加商品', '操作日志'];
    }
    if (activeTab === '我已审核') {
      return ['撤回', '操作日志'];
    }
    switch (status) {
      case '待提交':
      case '被驳回':
      case '新订单（未提交）':
      case '新订单（已驳回）':
        return ['提交采购单', '拆分采购单', '追加商品', '编辑', '作废', '查看合同'];
      case '待审核':
      case '新订单（待审核）':
        return ['编辑', '撤回审核', '查看合同'];
      case '采购中':
      case '部分到货':
        if (paymentStatus === '已申请付款') {
          return ['编辑', '验货入库', '标记已完成', '查看合同'];
        }
        return ['拆分采购单', '追加商品', '编辑', '作废', '验货入库', '申请付款', '标记已完成', '查看合同'];
      case '已完成':
        const completedOps = ['编辑', '申请退货', '再次采购', '查看合同'];
        if (paymentStatus === '待申请付款' || paymentStatus === '待申请') {
          completedOps.splice(1, 0, '申请付款'); // insert after '编辑'
        }
        return completedOps;
      case '异常':
        return ['编辑', '重新生成采购单', '不良品修正', '标记已完成', '操作日志'];
      case '1688对账':
        return ['修改金额', '设置旺旺'];
      case '已作废':
        return ['还原'];
      default:
        return ['编辑', '查看合同'];
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedOrders((orders || []).map(o => o.id));
    else setSelectedOrders([]);
  };

  const handleSelect = (checked: boolean, id: string) => {
    if (checked) setSelectedOrders([...selectedOrders, id]);
    else setSelectedOrders(selectedOrders.filter(oId => oId !== id));
  };

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllExpand = () => {
    const allExpanded = (orders || []).every((o: any) => expandedRows[o.id]);
    if (allExpanded) {
      setExpandedRows({});
    } else {
      const newExpanded: Record<string, boolean> = {};
      (orders || []).forEach((o: any) => {
        newExpanded[o.id] = true;
      });
      setExpandedRows(newExpanded);
    }
  };

  const handleSaveExtraFee = (id: string) => {
    const val = parseFloat(extraFeeInput);
    if (!isNaN(val) && val >= 0) {
      setOrders((orders || []).map(o => o.id === id ? { ...o, extraFee: Number(val.toFixed(2)) } : o));
    }
    setEditingExtraFeeId(null);
  };

  const handleBatchOperation = (type: BatchModalType | 'updateInTransit' | 'markPaid' | 'updateOverReceive' | 'markInvoiced' | 'batchReview') => {
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
    } else if (type === 'batchReview') {
      setReviewOrderIds(selectedOrders);
      setReviewResult('通过');
      setReviewRemark('');
      setReviewModalOpen(true);
    } else {
      setBatchModalType(type as BatchModalType);
    }
  };

  const handleOperation = (op: string, orderId: string) => {
    if (op === '提交采购单') {
      const order = (orders || []).find(o => o.id === orderId);
      if (order) {
        setOrders((orders || []).map(o => {
          if (o.id === orderId) {
            return { ...o, status: '待审核' };
          }
          return o;
        }));
        alert('已提交，进入待审核状态');
      }
    } else if (op === '审核') {
      setReviewOrderIds([orderId]);
      setReviewResult('通过');
      setReviewRemark('');
      setReviewModalOpen(true);
    } else if (op === '撤回') {
      setWithdrawOrderId(orderId);
    } else if (op === '操作日志') {
      setOperationLogOpen(true);
    } else if (op === '驳回' || op === '撤回审核') {
      setOrders((orders || []).map(o => {
        if (o.id === orderId) {
          return { ...o, status: '新订单（未提交）', auditedByMe: true };
        }
        return o;
      }));
      alert(op + '成功');
    } else if (op === '还原') {
      setRestoreOrderId(orderId);
    } else if (op === '拆分采购单') {
      setSplitOrderId(orderId);
      setSplitSelections({});
      setSplitQuantities({});
    } else if (op === '修改金额') {
      const order = (orders || []).find((o: any) => o.id === orderId);
      if (order) {
        setEdit1688AmountId(orderId);
        setEdit1688AmountInput(order.totalPrice?.toString() || '0');
      }
    } else if (op === '设置旺旺') {
      setSetWangWangId(orderId);
      setWangWangMethod('link');
    } else if (op === '追加商品') {
      setAddItemsOrderId(orderId);
    } else if (op === '编辑') {
      setEditOrderId(orderId);
    } else if (op === '作废') {
      setVoidOrderId(orderId);
    } else if (op === '申请付款') {
      setPaymentApplyOrderId(orderId);
      const order = (orders || []).find((o: any) => o.id === orderId);
      if (order) {
        setPaymentApplyAmount(Number(order.totalPrice || order.actualPayAmount || 0).toFixed(2));
        setPaymentApplyRows([{ id: Date.now(), amount: Number(order.totalPrice || order.actualPayAmount || 0).toFixed(2), date: '', note: '' }]);
      }
      setPaymentApplyIsPaid(false);
    } else if (op === '标记已完成') {
      setOrders((prev: any[]) => prev.map(o => {
        if (o.id === orderId) {
          return { ...o, status: '已完成' };
        }
        return o;
      }));
      setToastMessage('已标记为完成，状态已流转至"已完成"');
      setTimeout(() => setToastMessage(null), 2000);
    } else if (op === '验货入库') {
      const order = (orders || []).find((o: any) => o.id === orderId);
      if (order) {
        navigate('/receiving', { state: { orderNo: order.orderNo } });
      }
    } else if (op === '查看合同') {
      window.open('/contract', '_blank');
    } else if (op === '重新生成采购单') {
      if (window.confirm('你确定要重新生成采购单？\n重新生成会将该采购单标为已完成,同时将该采购单下损耗的商品重新生成一个采购单。')) {
        setOrders((prev: any[]) => {
          let newList = [...prev];
          const index = newList.findIndex(o => o.id === orderId);
          if (index > -1) {
            const originalOrder = newList[index];
            const updatedOriginal = { ...originalOrder, status: '已完成' };
            newList[index] = updatedOriginal;
            
            // Generate a new order based on defective/loss quantity
            // For mock, we assume 1 loss item
            const newOrder = {
              ...originalOrder,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              orderNo: originalOrder.orderNo + '-补',
              status: '新订单（未提交）',
              paymentStatus: '待申请付款',
              items: (originalOrder.items || []).map((i: any) => ({
                ...i,
                quantity: 1 // default 1 as loss mock
              }))
            };
            newList.unshift(newOrder);
          }
          return newList;
        });
        setToastMessage('重新生成成功');
        setTimeout(() => setToastMessage(null), 2000);
      }
    } else if (op === '不良品修正') {
      const order = (orders || []).find((o: any) => o.id === orderId);
      setDefectiveRows((order?.items || []).map((item: any, i: number) => ({
        id: i,
        time: '2025-12-10 12:15:09',
        sku: item.sku,
        warehouse: 'Join仓 B区',
        lossQty: 1,
        fixedQty: 0,
        fixQtyInput: 1
      })));
      setDefectiveOrderId(orderId);
    }
  };

  return (
    <div className="flex-1 bg-white rounded border border-gray-200 mt-4 flex flex-col overflow-hidden">
      {/* Action Bar */}
      <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          {activeTab === '待审核' ? (
            <FeatureMarker title="批量审核" description="交互说明：点击执行批量审核操作。">
<Button className="h-8 bg-blue-600 hover:bg-blue-700 text-[13px] text-white" onClick={() => handleBatchOperation('batchReview')}>批量审核</Button>
</FeatureMarker>
          ) : activeTab === '我已审核' ? null : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 bg-blue-600 hover:bg-blue-700 text-[13px] gap-1 px-3 text-white cursor-pointer">
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
                        <DropdownMenuItem className="text-[13px] flex items-center justify-between" onClick={() => handleBatchOperation('changeSupplier')}>批量更换供应商 <HelpCircle className="w-3 h-3 text-blue-500" /></DropdownMenuItem>
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

                  <DropdownMenuItem className="text-[13px]">设置固定分类</DropdownMenuItem>
                  
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

              <FeatureMarker title="添加采购单" description="交互说明：点击打开新增弹窗，录入新数据。">
<Button className="h-8 bg-blue-600 hover:bg-blue-700 text-[13px]" onClick={() => setShowAddOrder(true)}>添加采购单</Button>
</FeatureMarker>
              <FeatureMarker title="导入采购单" description="交互说明：点击上传文件并批量导入数据。">
<Button variant="outline" className="h-8 text-[13px] border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700">导入采购单</Button>
</FeatureMarker>
              <FeatureMarker title="打印" description="交互说明：点击执行打印操作。">
<Button variant="outline" className="h-8 text-[13px]">打印</Button>
</FeatureMarker>
              <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button variant="outline" className="h-8 text-[13px]">更多 <ChevronDown className="w-3 h-3 ml-1" /></Button>
</FeatureMarker>
            </>
          )}
          {/* Modals Implemented Based on Requirements */}

      {/* Review Dialog */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-normal">审核</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center">
              <span className="w-20 text-right text-gray-600 text-[13px] mr-4">审核方式：</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reviewResult"
                    value="通过"
                    checked={reviewResult === '通过'}
                    onChange={() => setReviewResult('通过')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-[13px] text-gray-700">审核通过</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reviewResult"
                    value="驳回"
                    checked={reviewResult === '驳回'}
                    onChange={() => setReviewResult('驳回')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-[13px] text-gray-700">打回</span>
                </label>
              </div>
            </div>
            <div className="flex items-start">
              <span className="w-20 text-right text-gray-600 text-[13px] mr-4 mt-2">审核备注：</span>
              <textarea
                className="flex-1 h-24 border border-gray-300 rounded-md p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y"
                placeholder="请输入审核备注..."
                value={reviewRemark}
                onChange={(e) => setReviewRemark(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 bg-white" onClick={() => setReviewModalOpen(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button
              className="h-8 px-6 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white"
              onClick={() => {
                setOrders((prev: any[]) => prev.map(o => {
                  if (reviewOrderIds.includes(o.id)) {
                    if (reviewResult === '通过') {
                      return { ...o, status: '采购中', auditedByMe: true, reviewRemark };
                    } else {
                      return { ...o, status: '新订单（已驳回）', auditedByMe: true, reviewRemark };
                    }
                  }
                  return o;
                }));
                setToastMessage(reviewResult === '通过' ? '审核通过，已流转至采购中' : '已打回，流转至新订单');
                setTimeout(() => setToastMessage(null), 2000);
                setReviewModalOpen(false);
                setSelectedOrders([]); // Clear selection if any
              }}
            >
              确定
            </Button>
            </FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
        <div className="text-[12px] text-gray-500 flex items-center gap-4">
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left text-[12px] whitespace-nowrap border-collapse min-w-[1600px]">
          <thead className="bg-[#F5F6F8] sticky top-0 z-10 shadow-sm">
            {/* Main Header */}
            <tr className="border-b border-gray-200 text-gray-600 align-middle">
              <th className="p-2 w-10 text-center font-normal">
              <Checkbox 
                checked={selectedOrders.length > 0 && selectedOrders.length === (orders || []).length}
                onCheckedChange={(c) => handleSelectAll(!!c)}
              />
            </th>
              <th className="p-2 w-auto font-normal">
                <FeatureMarker title="expandedRows[o.id]) ? '⊖ 收缩' : '⊕ 展开'}" description="交互说明：点击执行expandedRows[o.id]) ? '⊖ 收缩' : '⊕ 展开'}操作。">
                <span className="text-blue-600 cursor-pointer mr-1" onClick={toggleAllExpand}>
                  {(orders || []).length > 0 && (orders || []).every((o: any) => expandedRows[o.id]) ? '⊖ 收缩' : '⊕ 展开'}
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
                <span className="text-blue-600 flex items-center justify-center">审核时间 <ChevronDown className="w-3 h-3" /></span>
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
              <th className="p-2 text-center w-48 font-normal">
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
            {(orders || []).length === 0 ? (
              <tr><td colSpan={10} className="p-8 text-center text-gray-500">暂无数据</td></tr>
            ) : (
              [...(orders || [])].sort((a, b) => {
                const dateA = a.orderTime ? new Date(a.orderTime).getTime() : 0;
                const dateB = b.orderTime ? new Date(b.orderTime).getTime() : 0;
                return dateB - dateA;
              }).map((order, index) => {
                // Apply Tab filtering
                if (activeTab === '全部') {
                  // In "全部" tab, do not show '待合并' orders
                  if (order.status === '待合并') return null;
                } else if (activeTab !== '全部') {
                  const isNewOrder = ['待提交', '待审核', '被驳回'].includes(order.status) || order.status.includes('新订单');
                  if (activeTab === '新订单' && !isNewOrder) return null;
                  if (activeTab === '采购中' && order.status !== '采购中' && order.status !== '部分到货') return null;
                  if (activeTab === '已完成' && order.status !== '已完成') return null;
                  if (activeTab === '已作废' && order.status !== '已作废') return null;
                  if (activeTab === '异常' && order.status !== '异常') return null;
                  if (activeTab === '1688对账' && order.status !== '1688对账') return null;
                  if (activeTab === '待审核' && order.status !== '待审核' && order.status !== '新订单（待审核）') return null;
                  if (activeTab === '我已审核' && (!order.auditedByMe || order.status === '待审核' || order.status === '新订单（待审核）')) return null;
                  if (activeTab === '采购审核' && order.status !== '待审核' && order.status !== '新订单（待审核）') return null;
                }

                // Apply Dynamic Filter Values
                if (filterValues.searchKeyword) {
                  const keyword = filterValues.searchKeyword.toLowerCase();
                  const type = filterValues.searchType || '采购单号';
                  let matched = false;
                  if (type === '采购单号' && order.orderNo?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '采购单号/自定义单号' && (order.orderNo?.toLowerCase().includes(keyword) || order.customOrderNo?.toLowerCase().includes(keyword))) matched = true;
                  else if (type === '物流单号' && order.trackingNo?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '1688订单号' && order.platformOrderNo?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '发票号' && order.invoiceNo?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '计划号' && order.planNo?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '订单备注' && order.orderNote?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '签收员' && order.receiver?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '入库员' && order.inbounder?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '供应商' && order.supplierName?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '采购员' && order.buyer?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '下单员' && order.orderCreator?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '库存SKU' && order.sku?.toLowerCase().includes(keyword)) matched = true;
                  else if (type === '商品名称' && order.productName?.toLowerCase().includes(keyword)) matched = true;
                  
                  if (!matched && !order.orderNo?.toLowerCase().includes(keyword)) return null;
                }

                if (filterValues.supplier && filterValues.supplier !== '') {
                  if (!order.supplierName?.toLowerCase().includes(filterValues.supplier.toLowerCase())) return null;
                }
                
                if (filterValues.startDate && filterValues.endDate) {
                  const orderDate = new Date(order.orderTime).getTime();
                  const start = new Date(filterValues.startDate).getTime();
                  const end = new Date(filterValues.endDate).getTime() + 86400000;
                  if (orderDate < start || orderDate > end) return null;
                }

                if (filterValues.warehouse && filterValues.warehouse !== '全部') {
                  if (!order.warehouse?.includes(filterValues.warehouse)) return null;
                }

                if (filterValues.orderType && filterValues.orderType !== '全部') {
                  // mock checking orderType based on title/flags. Let's just use simple match if orderNote or custom flag exists.
                  // For now, assume it always matches or mock it if needed.
                  if (filterValues.orderType === '备货采购' && !order.orderNote?.includes('备货')) return null;
                  if (filterValues.orderType === '缺货采购' && !order.orderNote?.includes('缺货')) return null;
                  if (filterValues.orderType === '样品采购' && !order.orderNote?.includes('样品')) return null;
                }
                
                if (filterValues.hasRemark && filterValues.hasRemark !== '全部') {
                  const hasRemark = !!order.orderNote && order.orderNote.trim() !== '' && order.orderNote !== '--';
                  if (filterValues.hasRemark === '有备注' && !hasRemark) return null;
                  if (filterValues.hasRemark === '无备注' && hasRemark) return null;
                }

                if (filterValues.paymentStatus && filterValues.paymentStatus !== '全部') {
                   if (order.paymentStatus !== filterValues.paymentStatus) return null;
                }

                const isExpanded = expandedRows[order.id];
                const orderItems = Array.isArray(order.items) ? order.items : [];
                const paymentStatusForDisplay = order.paymentStatus === '待申请' ? '待申请付款' : (order.paymentStatus === '已申请' ? '已申请付款' : (order.paymentStatus || '待申请付款'));
                const has1688Linked = !!order.platformOrderNo;
                
                return (
                  <React.Fragment key={order.id}>
                    {/* Order Group Header Row */}
                    <tr className="bg-[#EBF5FF] border-b border-gray-200 text-[12px]">
                      <td className="p-2 text-center align-middle border-r border-gray-200">
                        <Checkbox 
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(c) => handleSelect(!!c, order.id)}
                        />
                      </td>
                      <td colSpan={9} className="p-2">
                        <div className="flex items-center justify-between text-[12px]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-blue-600 font-medium">{order.orderNo}</span>
                            <Copy className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800" />
                            <span className="text-gray-500 flex items-center">
                              【{order.customOrderNo || '暂无'} 
                              <Edit2 
                                className="w-3 h-3 ml-1 text-blue-600 cursor-pointer"
                                onClick={() => {
                                  setCustomOrderNoInput(order.customOrderNo || '');
                                  setEditCustomOrderNoId(order.id);
                                }}
                              />】
                            </span>
                            <span className="text-gray-700 flex items-center gap-1">
                              【供应商：<span className="text-blue-600 underline cursor-pointer">{order.supplierName || '曹县委要王工艺有限公司'}</span>
                              <Copy className="w-3 h-3 text-blue-600 cursor-pointer" />
                              {paymentStatusForDisplay === '待申请付款' && activeTab !== '待审核' && activeTab !== '采购审核' && (
                                <Edit2 
                                  className="w-3 h-3 text-blue-600 cursor-pointer hover:text-blue-800 ml-1"
                                  onClick={() => {
                                    setSupplierSelected(order.supplierName || '曹县委要王工艺有限公司');
                                    setOpenSupplierSelect(false);
                                    setChangeSupplierId(order.id);
                                  }}
                                />
                              )}
                              <span className="inline-flex items-center justify-center w-4 h-4 bg-blue-100 rounded-full ml-1 text-blue-600 text-[10px]">旺</span>
                              <span className="inline-flex items-center justify-center w-4 h-4 bg-blue-100 rounded-full ml-1 text-blue-600 text-[10px]">缺</span>】
                              <svg viewBox="0 0 1024 1024" width="16" height="16" className="ml-2 text-blue-500">
                                <path d="M512 1024a512 512 0 1 1 512-512 512.58 512.58 0 0 1-512 512zM512 64a448 448 0 1 0 448 448A448.51 448.51 0 0 0 512 64z" fill="#00A1FF" />
                                <path d="M720 464c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zM304 464c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z" fill="#00A1FF" />
                                <path d="M512 768c-105.9 0-192-57.4-192-128h384c0 70.6-86.1 128-192 128z" fill="#00A1FF" />
                              </svg>
                              {activeTab === '采购中' && order.status === '采购中' && !has1688Linked && (
                                <Button 
                                  className="ml-2 h-6 px-2 text-[12px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white rounded-sm"
                                  onClick={() => setAutoOrder1688Id(order.id)}
                                >
                                  1688自助下单
                                </Button>
                              )}
                            </span>
                            <span className="bg-cyan-400 text-white px-1.5 py-0.5 rounded text-[11px] cursor-pointer ml-1">通知他</span>
                            {has1688Linked && (
                              <>
                                <span className="text-gray-700">
                                  【<span className="text-orange-500 font-medium">1688:</span> <span className="text-blue-600 underline cursor-pointer">{order.platformOrderNo}</span> <Copy className="w-3 h-3 inline text-blue-600 cursor-pointer"/>】
                                </span>
                                <span className="text-gray-500">[{order.platformPaymentStatus || '待付款'}]</span>
                                <span className="text-gray-500">[帐号:{order.ali1688AccountName || '--'}]</span>
                                <span className="text-gray-500">[交易方式:{order.ali1688TradeType || '--'}]</span>
                                <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded text-[11px] cursor-pointer hover:bg-blue-600" onClick={() => {
                                  setToastMessage('模拟：立即付款');
                                  setTimeout(() => setToastMessage(null), 2000);
                                }}>立即付款</span>
                                <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[11px] cursor-pointer hover:bg-red-600" onClick={() => {
                                  setOrders((prev: any[]) => prev.map(o => {
                                    if (o.id === order.id) {
                                      return {
                                        ...o,
                                        platformOrderNo: null,
                                        ali1688AccountName: null,
                                        ali1688TradeType: null,
                                        platformPaymentStatus: null
                                      };
                                    }
                                    return o;
                                  }));
                                  setToastMessage('取消关联成功');
                                  setTimeout(() => setToastMessage(null), 2000);
                                }}>取消关联</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center text-gray-700 ml-4">
                            <Home className="w-3 h-3 mr-1" /> 西安样品仓(商品开发专用) 
                            {activeTab !== '已完成' && activeTab !== '待审核' && activeTab !== '采购审核' && order.status !== '已完成' && (
                              <Edit2 className="w-3 h-3 ml-1 text-blue-600 cursor-pointer" />
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Order Summary Row */}
                    <tr className="border-b border-gray-200 bg-[#FFFBE6] hover:bg-[#FFF7D6] transition-colors align-top text-[12px]">
                      <td className="p-2 text-center text-gray-700 font-medium align-middle border-r border-gray-200 bg-white">
                        {index + 1}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        <div className="flex gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <FeatureMarker title="{isExpanded ? '⊖ 收缩' : '⊕ 展开'}" description="交互说明：点击执行{isExpanded ? '⊖ 收缩' : '⊕ 展开'}操作。">
                              <span 
                                className="text-blue-600 cursor-pointer mr-1"
                                onClick={() => toggleExpand(order.id)}
                              >
                                {isExpanded ? '⊖ 收缩' : '⊕ 展开'}
                              </span>
                              </FeatureMarker>
                            </div>
                            <div className="text-gray-600 leading-relaxed text-[11px] pl-4">
                              <div>商品种类： <span className="text-gray-800">{order.productTypesCount || orderItems.length}</span></div>
                              {(() => {
                                const totalPurchase = orderItems.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0) || order.productCount || 0;
                                const totalReceived = orderItems.reduce((sum: number, item: any) => sum + (Number(item.receivedQty) || 0), 0) || order.receivedCount || 0;
                                const unReceived = Math.max(0, totalPurchase - totalReceived);
                                return (
                                  <div>采购/已入/未入数量： <span className="text-gray-800">{totalPurchase}/{totalReceived}/{unReceived}</span></div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center border-r border-gray-200">
                        <div className="font-bold text-[13px] text-gray-800">
                          {order.actualPayAmount || (order.totalPrice ? Number(order.totalPrice).toFixed(4) : '0.0000')}
                      </div>
                      {editingExtraFeeId === order.id ? (
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0"
                            className="w-16 h-6 text-[11px] text-center px-1" 
                            value={extraFeeInput}
                            onChange={(e) => setExtraFeeInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveExtraFee(order.id)}
                            onBlur={() => handleSaveExtraFee(order.id)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="text-blue-600 flex items-center justify-center gap-1 mt-1 group">
                          {Number(order.extraFee || 0).toFixed(4)} 
                          <Edit2 
                            className="w-3 h-3 cursor-pointer opacity-0 group-hover:opacity-100" 
                            onClick={() => {
                              setExtraFeeInput(Number(order.extraFee || 0).toFixed(2));
                              setEditingExtraFeeId(order.id);
                            }}
                          />
                        </div>
                      )}
                      </td>
                      <td className="p-2 text-center border-r border-gray-200 leading-relaxed">
                        <div className="text-blue-600 flex items-center justify-center gap-1 whitespace-nowrap">
                          [到付] <br/> <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<span className="cursor-pointer hover:underline flex items-center gap-1" onClick={() => setAddLogisticsId(order.id)}>添加物流单号 <Edit2 className="w-3 h-3 cursor-pointer" /></span>
</FeatureMarker>
                        </div>
                        <div className="text-gray-500 mt-1">{order.shipTime || '--'}</div>
                      </td>
                      <td className="p-2 text-center border-r border-gray-200 text-gray-700 leading-relaxed">
                        <div className="flex items-center justify-center gap-1">{order.orderCreator} <List className="w-3 h-3 text-blue-600 cursor-pointer" /></div>
                        <div>{order.orderTime}(UTC+8)</div>
                        <div>{order.payer || '--'}</div>
                        <div>{order.payTime1688 || '--'}</div>
                      </td>
                      <td className="p-2 text-center border-r border-gray-200 text-gray-700 leading-relaxed">
                        <div>{order.auditor || '--'}</div>
                        <div>{order.auditTime || '--'}</div>
                        <div className="flex items-center justify-center gap-1">{order.lastOperator} <List className="w-3 h-3 text-blue-600 cursor-pointer" /></div>
                        <div>{order.lastOperateTime}(UTC+8)</div>
                      </td>
                      <td className="p-2 text-center border-r border-gray-200 text-gray-700">
                        {order.buyer || '--'}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        <div className="flex flex-col gap-1 w-full">
                          <textarea 
                            className="w-full h-12 border border-gray-300 rounded p-1 text-[11px] resize-none focus:outline-none focus:border-blue-400" 
                            defaultValue={order.orderNote || '3294350294642673956*浴巾'}
                          />
                          <textarea 
                            className="w-full h-12 border border-gray-300 rounded p-1 text-[11px] resize-none bg-gray-50 focus:outline-none focus:border-blue-400 focus:bg-white" 
                            defaultValue={order.relatedOrderNo}
                          />
                        </div>
                      </td>
                      <td className="p-2 text-left border-r border-gray-200 leading-relaxed text-gray-700">
                        {['待提交', '待审核', '被驳回'].includes(order.status) || order.status.includes('新订单') ? (
                          <>
                            <div>采购状态：{order.status === '待提交' ? '新订单（未提交）' : (order.status === '待审核' ? '新订单（待审核）' : order.status)}</div>
                            <div>付款状态：{order.paymentStatus === '待申请' ? '待申请付款' : (order.paymentStatus || '待申请付款')}</div>
                            <div>签收状态：{order.signStatus || '未签收'}</div>
                            <div>平台状态：{order.platformStatus || '--'}</div>
                          </>
                        ) : (
                          <>
                            <div>采购状态：{order.status}</div>
                            <div>付款状态：{order.paymentStatus === '待申请' ? '待申请付款' : (order.paymentStatus === '已申请' ? '已申请付款' : (order.paymentStatus || '已申请付款'))}</div>
                            <div>签收状态：{order.signStatus || '未签收'}</div>
                            <div>平台状态：{order.platformStatus || '--'}</div>
                            <div className="text-blue-600 cursor-pointer hover:underline" onClick={() => setAuditOrderId(order.id)}>审核详情</div>
                          </>
                        )}
                      </td>
                      <td className="p-2 text-center leading-relaxed">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-full text-[12px]">
                          {getOperations(order, activeTab).map(op => (
                            <div 
                              key={op} 
                              onClick={() => handleOperation(op, order.id)}
                              className={cn(
                                "cursor-pointer hover:underline text-center whitespace-nowrap",
                                ['作废', '申请退货', '驳回'].includes(op) ? "text-red-500" : "text-blue-600"
                              )}
                            >
                              {op}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>

                    {/* Order Item Row (Expanded) */}
                    {isExpanded && (
                      <tr className="bg-[#F8FAFC] border-b border-gray-200 text-[12px] align-top">
                        <td colSpan={10} className="p-0 border-t border-gray-200">
                          <div className="p-4 bg-[#F8FAFC]">
                            <table className="w-full border-collapse bg-white border border-gray-200">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                              <tr>
                                <th className="p-2 w-10 text-center border-r border-gray-100"><Checkbox /></th>
                                <th className="p-2 w-[300px] border-r border-gray-100">
                                  <div className="text-center">库存SKU</div>
                                  <div className="text-center text-gray-400 font-normal">商品名称</div>
                                </th>
                                <th className="p-2 w-32 text-center border-r border-gray-100">
                                  <div>采购数</div>
                                  <div className="text-gray-400 font-normal">采购单价</div>
                                  <div className="text-gray-400 font-normal">最新采购价</div>
                                  <div className="text-gray-400 font-normal">最低采购价</div>
                                  <div className="text-gray-400 font-normal">标准采购价</div>
                                </th>
                                <th className="p-2 w-32 text-center border-r border-gray-100">
                                  <div>入库量</div>
                                  <div>损耗量</div>
                                  <div>退货量</div>
                                  <div className="text-gray-400 font-normal">异常原因</div>
                                </th>
                                <th className="p-2 w-48 text-center border-r border-gray-100">
                                  <div>库存/在途/未发货量</div>
                                  <div className="text-gray-400 font-normal">预计到货日期</div>
                                </th>
                                <th className="p-2 w-48 text-center border-r border-gray-100">
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
                                <th className="p-2 w-28 text-center">
                                  <div>采购/计划详情</div>
                                  <div className="text-gray-400 font-normal">关联计划数</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {orderItems.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="p-8 text-center text-gray-400">暂无商品明细</td>
                                </tr>
                              ) : (
                                orderItems.map((it: any, i: number) => (
                                  <tr key={it.id || i} className="hover:bg-gray-50">
                                    <td className="p-2 text-center align-middle border-r border-gray-100"><Checkbox /></td>
                                    <td className="p-3 border-r border-gray-100">
                                      <div className="flex gap-3">
                                        <div className="w-12 h-12 border border-gray-200 rounded flex-shrink-0 flex items-center justify-center bg-gray-50 overflow-hidden">
                                          {it.image || it.imageUrl ? (
                                            <img src={it.image || it.imageUrl} className="w-full h-full object-cover" />
                                          ) : (
                                            <span className="text-[10px] text-gray-400">No Image</span>
                                          )}
                                          <div className="absolute bottom-0 bg-green-500 text-white text-[9px] px-1 w-full text-center truncate">1688</div>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                          <div className="flex items-center gap-1 text-blue-600 mb-1">
                                            <span className="hover:underline cursor-pointer">{it.sku || '--'}</span>
                                            <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-600" />
                                            <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
                                            <span 
                                              className="text-[11px] border border-blue-200 px-1 rounded-sm flex items-center gap-0.5 cursor-pointer hover:bg-blue-50"
                                              onClick={() => {
                                                if (it.productLink) {
                                                  window.open(it.productLink, '_blank');
                                                }
                                              }}
                                            >
                                              商品链接 
                                              <Edit2 
                                                className="w-2.5 h-2.5" 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setProductLinkInput(it.productLink || '');
                                                  setEditProductLinkOpen(true);
                                                }}
                                              />
                                            </span>
                                            </FeatureMarker>
                                          </div>
                                          <div className="text-gray-800 font-medium">{it.name || it.productName || '--'}</div>
                                          <div className="mt-1">
                                            <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm">同款降本</span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-3 text-center border-r border-gray-100 align-middle leading-tight">
                                      <div className="font-medium text-gray-700 text-[13px] mb-1">{it.quantity || order.totalPurchaseQty}</div>
                                      <div className="text-orange-500 mb-0.5">¥ {Number(it.price || 0).toFixed(2)}</div>
                                      <div className="text-orange-500 mb-0.5 font-medium">¥ {Number((it.price || 0) * 0.95).toFixed(4)}</div>
                                      <div className="text-orange-500 mb-0.5 font-medium">¥ {Number((it.price || 0) * 0.9).toFixed(2)}</div>
                                      <div className="text-orange-500">¥ --</div>
                                    </td>
                                    <td className="p-3 text-center border-r border-gray-100 text-gray-600 align-middle">
                                      <div>--</div>
                                      <div>--</div>
                                      <div>--</div>
                                      <div 
                                        className="text-blue-600 hover:underline cursor-pointer mt-1"
                                        onClick={() => {
                                          setCurrentInboundSku(it.sku || '--');
                                          setInboundDetailOpen(true);
                                        }}
                                      >
                                        查看入库明细
                                      </div>
                                    </td>
                                    <td className="p-3 text-center border-r border-gray-100 align-middle">
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
                                    <td className="p-3 text-center border-r border-gray-100 align-middle">
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
                                ))
                              )}
                            </tbody>
                          </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="p-3 border-t border-gray-200 bg-white flex items-center justify-between flex-shrink-0 text-[12px] text-gray-600">
        <div>共 {(orders || []).length} 条数据</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>20条/页</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button variant="outline" size="icon" className="h-7 w-7" disabled><ChevronDown className="w-4 h-4 rotate-90" /></Button>
</FeatureMarker>
            <span>第 1 页</span>
            <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button variant="outline" size="icon" className="h-7 w-7" disabled><ChevronDown className="w-4 h-4 -rotate-90" /></Button>
</FeatureMarker>
          </div>
        </div>
      </div>
      {/* 还原确认弹窗 */}
      <Dialog open={!!restoreOrderId} onOpenChange={() => setRestoreOrderId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-left font-medium text-gray-800">提示</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-700 text-[14px]">
            确定还原采购单？
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 bg-white" onClick={() => setRestoreOrderId(null)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="h-8 px-6 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
              setOrders((orders || []).map(o => {
                if (o.id === restoreOrderId) {
                  return { ...o, status: '新订单（未提交）' };
                }
                return o;
              }));
              setRestoreOrderId(null);
            }}>确定</Button>
            </FeatureMarker>
          </DialogFooter>
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
                    <td className="p-2">{addLogisticsId && (orders || []).find((o: any) => o.id === addLogisticsId)?.orderNo}</td>
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
          <div className="mt-4 flex justify-end gap-2 border-t pt-4 p-4 bg-gray-50/50">
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => { setAddLogisticsId(null); setLogisticsRows([{ id: 1, fee: '0.00', company: '', no: '' }]); }}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white" onClick={() => {
              const isValid = logisticsRows.every(r => r.fee && r.company && r.no);
              if (!isValid) {
                alert('请填写所有必填信息（运费、物流公司、物流单号）');
                return;
              }
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

      {/* 拆分采购单 */}
      <Dialog open={!!splitOrderId} onOpenChange={() => { setSplitOrderId(null); setSplitSelections({}); setSplitQuantities({}); }}>
        <DialogContent className="max-w-[900px] p-0 gap-0 overflow-hidden h-[80vh] flex flex-col">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-left font-semibold text-base text-gray-800">拆分采购单</DialogTitle>
          </DialogHeader>
          <div className="py-3 px-4 text-sm text-gray-600">
            采购单：{splitOrderId && (orders || []).find((o: any) => o.id === splitOrderId)?.orderNo}
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
                {splitOrderId && (orders || []).find((o: any) => o.id === splitOrderId)?.items?.map((item: any, index: number) => (
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
              const originalOrder = (orders || []).find((o: any) => o.id === splitOrderId);
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

      {/* 编辑采购单 Dialog */}
      <Dialog open={!!editOrderId} onOpenChange={() => setEditOrderId(null)}>
        <DialogContent className="w-auto min-w-[1200px] max-w-[calc(100vw-2rem)] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-left font-normal text-[15px] text-gray-800">
              采购商品详情 <span className="text-gray-500 text-sm ml-1">(采购单：{editOrderId && (orders || []).find((o: any) => o.id === editOrderId)?.orderNo} 采购状态：{editOrderId && (orders || []).find((o: any) => o.id === editOrderId)?.status.replace('（未提交）', '')} 付款状态：{editOrderId && (orders || []).find((o: any) => o.id === editOrderId)?.paymentStatus} 币种：RMB)</span>
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

      {/* 重新生成采购单确认弹窗 */}
      {/* 实际这个是在 handleOperation 里用 window.confirm 实现的，无需额外弹窗组件，满足要求 */}

      {/* 不良品修正弹窗 */}
      <Dialog open={!!defectiveOrderId} onOpenChange={() => setDefectiveOrderId(null)}>
        <DialogContent className="max-w-[800px] p-0 gap-0 overflow-hidden bg-white">
          <DialogHeader className="p-4 border-b border-gray-200 bg-gray-50/50">
            <DialogTitle className="text-[15px] font-normal text-gray-800 flex justify-between items-center">
              <span>不良品修正</span>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-4 mb-3 text-[13px] text-gray-700">
              <span className="font-medium">修正商品入库仓库</span>
              <span>东莞厚街库</span>
            </div>
            
            <table className="w-full text-center text-[13px] border border-gray-200">
              <thead className="bg-[#F8FAFC] border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="p-2 font-normal w-12 border-r border-gray-200"><Checkbox /></th>
                  <th className="p-2 font-normal border-r border-gray-200">入库时间</th>
                  <th className="p-2 font-normal border-r border-gray-200">入库SKU</th>
                  <th className="p-2 font-normal border-r border-gray-200">损耗仓库</th>
                  <th className="p-2 font-normal w-24 border-r border-gray-200">损耗量</th>
                  <th className="p-2 font-normal w-24 border-r border-gray-200">已修正数量</th>
                  <th className="p-2 font-normal w-32 flex items-center justify-center gap-1">
                    本次修正数量 <HelpCircle className="w-3 h-3 text-gray-400" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {defectiveRows.map((row) => (
                  <tr key={row.id}>
                    <td className="p-2 border-r border-gray-200"><Checkbox /></td>
                    <td className="p-2 text-gray-600 border-r border-gray-200">{row.time}</td>
                    <td className="p-2 text-gray-800 border-r border-gray-200">{row.sku}</td>
                    <td className="p-2 border-r border-gray-200 text-gray-700">
                      <select className="h-8 border border-gray-200 rounded px-2 outline-none w-32 text-[12px] bg-white text-gray-700">
                        <option value={row.warehouse}>{row.warehouse}</option>
                      </select>
                    </td>
                    <td className="p-2 text-gray-800 border-r border-gray-200">{row.lossQty}</td>
                    <td className="p-2 text-gray-800 border-r border-gray-200">{row.fixedQty}</td>
                    <td className="p-2">
                      <Input 
                        type="number" 
                        className="h-8 text-[12px] w-20 mx-auto text-center border-gray-200" 
                        value={row.fixQtyInput}
                        onChange={(e) => setDefectiveRows(prev => prev.map(r => r.id === row.id ? { ...r, fixQtyInput: e.target.value } : r))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50 sm:justify-end gap-2">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-[#E6A23C] hover:bg-[#D59333] h-8 px-6 font-normal rounded-sm" onClick={() => {
              setOrders((prev: any[]) => prev.map(o => {
                if (o.id === defectiveOrderId) {
                  let allFixed = true;
                  const newItems = (o.items || []).map((item: any, idx: number) => {
                    const defRow = defectiveRows.find(r => r.id === idx);
                    if (defRow) {
                      const fixQty = parseInt(defRow.fixQtyInput) || 0;
                      const currentLoss = item.lossQty || 0;
                      if (fixQty < currentLoss) {
                        allFixed = false;
                        return { ...item, lossQty: currentLoss - fixQty, inboundQty: (item.inboundQty || 0) + fixQty };
                      } else {
                        return { ...item, lossQty: 0, inboundQty: (item.inboundQty || 0) + fixQty };
                      }
                    }
                    if (item.lossQty > 0) allFixed = false;
                    return item;
                  });

                  return {
                    ...o,
                    items: newItems,
                    status: allFixed ? '已完成' : o.status
                  };
                }
                return o;
              }));
              setToastMessage('修正成功');
              setDefectiveOrderId(null);
            }}>确定</Button>
            </FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal bg-white rounded-sm" onClick={() => setDefectiveOrderId(null)}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 1688修改金额弹窗 */}
      <Dialog open={!!edit1688AmountId} onOpenChange={() => setEdit1688AmountId(null)}>
        <DialogContent className="max-w-[400px] p-0 gap-0 overflow-hidden bg-white">
          <DialogHeader className="p-4 border-b border-gray-200 bg-gray-50/50">
            <DialogTitle className="text-[15px] font-normal text-gray-800">修改金额</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="flex flex-col gap-4 text-[13px] text-gray-700">
              <div className="flex items-center">
                <span className="w-24 text-right pr-4 text-gray-500">1688金额:</span>
                <span className="font-medium text-gray-800">
                  ¥ {orders?.find(o => o.id === edit1688AmountId)?.platformAmount?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-right pr-4 text-gray-500">采购单金额:</span>
                <Input 
                  type="number" 
                  className="h-8 flex-1 text-[13px]" 
                  value={edit1688AmountInput}
                  onChange={(e) => setEdit1688AmountInput(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50 sm:justify-end gap-2">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal rounded-sm" onClick={() => {
              const order = orders?.find(o => o.id === edit1688AmountId);
              if (order) {
                const newAmount = parseFloat(edit1688AmountInput) || 0;
                setOrders((prev: any[]) => prev.map(o => {
                  if (o.id === edit1688AmountId) {
                    const isMatched = newAmount === (o.platformAmount || 0);
                    return { 
                      ...o, 
                      totalPrice: newAmount,
                      actualPayAmount: newAmount,
                      status: isMatched ? '采购中' : o.status
                    };
                  }
                  return o;
                }));
                setToastMessage('金额修改成功');
              }
              setEdit1688AmountId(null);
            }}>确定</Button>
            </FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal bg-white rounded-sm" onClick={() => setEdit1688AmountId(null)}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 设置旺旺弹窗 */}
      <Dialog open={!!setWangWangId} onOpenChange={() => setSetWangWangId(null)}>
        <DialogContent className="max-w-[500px] p-0 gap-0 overflow-hidden bg-white">
          <DialogHeader className="p-4 border-b border-gray-200 bg-gray-50/50">
            <DialogTitle className="text-[15px] font-normal text-gray-800">供应商旺旺设置</DialogTitle>
          </DialogHeader>
          <div className="p-6 flex flex-col gap-6">
            <div className="bg-[#FFF8E6] text-[#E6A23C] p-3 rounded text-[13px] text-center leading-relaxed">
              <div>当前供应商没有绑定旺旺，无法自动获取旺旺信息。</div>
              <div>请填写商品详情链接后自动获取，或直接设置旺旺号。</div>
            </div>
            
            <div className="flex flex-col gap-4 text-[13px]">
              <div className="flex items-center">
                <span className="w-24 text-right pr-4 text-gray-600">设置方式:</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input 
                      type="radio" 
                      name="wangwang_method" 
                      className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500" 
                      checked={wangWangMethod === 'link'} 
                      onChange={() => setWangWangMethod('link')}
                    />
                    供应商链接抓取方式
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input 
                      type="radio" 
                      name="wangwang_method" 
                      className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500" 
                      checked={wangWangMethod === 'input'} 
                      onChange={() => setWangWangMethod('input')}
                    />
                    直接输入方式
                  </label>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="w-24 text-right pr-4 text-gray-600">
                  <span className="text-red-500 mr-1">*</span>
                  {wangWangMethod === 'link' ? '商品链接:' : '旺旺名称:'}
                </span>
                <Input 
                  className="h-8 flex-1 text-[13px]" 
                  placeholder={wangWangMethod === 'link' ? '仅支持1688、淘宝商品链接' : '请输入旺旺名称'}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50 sm:justify-end gap-2">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal rounded-sm" onClick={() => {
              setToastMessage('设置旺旺成功');
              setSetWangWangId(null);
            }}>确定</Button>
            </FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal bg-white rounded-sm" onClick={() => setSetWangWangId(null)}>取消</Button>
</FeatureMarker>
          </DialogFooter>
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
                            (orders || []).find((o: any) => o.id === voidOrderId)?.items?.length > 0 &&
                            Object.keys(voidSelections).length === (orders || []).find((o: any) => o.id === voidOrderId)?.items?.length &&
                            Object.values(voidSelections).every(Boolean)
                          }
                          onCheckedChange={(c) => {
                            const order = (orders || []).find((o: any) => o.id === voidOrderId);
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
                      const order = (orders || []).find((o: any) => o.id === voidOrderId);
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
              const originalOrder = (orders || []).find((o: any) => o.id === voidOrderId);
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
      
                const voidOrderNo = originalOrder.orderNo; 
                const remainOrderNo = 'PO' + Date.now(); 
      
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
                          orderNo: remainOrderNo,
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
                    return [voidOrder, ...next]; 
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

      {/* Withdraw Dialog */}
      <Dialog open={!!withdrawOrderId} onOpenChange={(open) => !open && setWithdrawOrderId(null)}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-normal">提示</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-[14px] text-gray-700">
            是否确认撤回？
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-gray-600 bg-white" onClick={() => setWithdrawOrderId(null)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button 
              className="h-8 px-6 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white"
              onClick={() => {
                setOrders((prev: any[]) => prev.map(o => {
                  if (o.id === withdrawOrderId) {
                    return { ...o, status: '新订单（待审核）', auditedByMe: false };
                  }
                  return o;
                }));
                setToastMessage('撤回成功');
                setTimeout(() => setToastMessage(null), 2000);
                setWithdrawOrderId(null);
              }}
            >
              确定
            </Button>
            </FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. 操作日志 */}
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

      {/* 申请付款弹窗 */}
      <Dialog open={!!paymentApplyOrderId} onOpenChange={() => { setPaymentApplyOrderId(null); setPaymentApplyRows([]); }}>
        <DialogContent className="max-w-[900px] p-0 gap-0 overflow-hidden h-[85vh] flex flex-col">
          <DialogHeader className="p-4 border-b bg-gray-50/50">
            <DialogTitle className="text-left font-normal text-[15px] text-gray-800">我要付款</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-[13px] text-gray-600">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {/* Row 1 */}
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">采购单号：</div>
                <div className="flex-1">{paymentApplyOrderId && (orders || []).find((o: any) => o.id === paymentApplyOrderId)?.orderNo}</div>
              </div>
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">自定义单号：</div>
                <div className="flex-1">{paymentApplyOrderId && ((orders || []).find((o: any) => o.id === paymentApplyOrderId)?.customOrderNo || '暂无')}</div>
              </div>
              {/* Row 2 */}
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">收款人：</div>
                <div className="flex-1">暂无</div>
              </div>
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 flex items-center justify-end gap-1 shrink-0 whitespace-nowrap">
                  收款方式 
                  <TooltipProvider delay={100}>
                    <Tooltip>
                      <TooltipTrigger className="inline-flex items-center">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="text-[12px]">
                        <p>当未选择收款方式时，则收款方式默认为现款</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  ：
                </div>
                <div className="flex-1">
                  <select className="w-full h-8 border border-gray-200 rounded px-2 outline-none">
                    <option>-请选择-</option>
                    <option>银行转账</option>
                    <option>支付宝</option>
                    <option>微信</option>
                  </select>
                </div>
              </div>
              {/* Row 3 */}
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">收款账号名称：</div>
                <div className="flex-1">
                  <select className="w-full h-8 border border-gray-200 rounded px-2 outline-none">
                    <option>-请选择-</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">付款账号：</div>
                <div className="flex-1">
                  <select className="w-full h-8 border border-gray-200 rounded px-2 outline-none">
                    <option>请选择账户</option>
                  </select>
                </div>
              </div>
              {/* Row 4 */}
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">采购单币种/付款单币种：</div>
                <div className="flex-1">RMB/RMB</div>
              </div>
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">应付金额/到货金额：</div>
                <div className="flex-1">{paymentApplyAmount}/0 RMB</div>
              </div>
              {/* Row 5 */}
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">已申请金额：</div>
                <div className="flex-1">0 RMB</div>
              </div>
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">可申请金额：</div>
                <div className="flex-1">{paymentApplyAmount} RMB</div>
              </div>
              {/* Row 6 */}
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">供应商：</div>
                <div className="flex-1">{paymentApplyOrderId && (orders || []).find((o: any) => o.id === paymentApplyOrderId)?.supplierName}</div>
              </div>
              <div className="flex items-center">
                <div className="w-36 text-right pr-4 shrink-0 whitespace-nowrap">付款方式：</div>
                <div className="flex-1">暂无</div>
              </div>
              {/* Row 7 */}
              <div className="flex items-start col-span-2">
                <div className="w-36 text-right pr-4 pt-1 shrink-0 whitespace-nowrap">采购单备注：</div>
                <div className="flex-1 break-words">{paymentApplyOrderId && ((orders || []).find((o: any) => o.id === paymentApplyOrderId)?.orderNote || '暂无')} <Copy className="w-3.5 h-3.5 inline text-blue-500 cursor-pointer ml-1" /></div>
              </div>
              {/* Row 8 */}
              <div className="flex items-start col-span-2">
                <div className="w-36 text-right pr-4 pt-1 shrink-0 whitespace-nowrap">上传附件：</div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Input readOnly className="h-8 flex-1 bg-gray-50" />
                    <FeatureMarker title="浏览" description="交互说明：点击执行浏览操作。">
<Button className="h-8 bg-[#8AB4F8] hover:bg-[#7ba3e3] text-white font-normal px-4 gap-1"><Search className="w-3.5 h-3.5"/> 浏览</Button>
</FeatureMarker>
                    <FeatureMarker title="上传" description="交互说明：点击执行上传操作。">
<Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-4 gap-1"><Plus className="w-3.5 h-3.5"/> 上传</Button>
</FeatureMarker>
                  </div>
                  <span className="text-gray-400 text-[12px]">请上传 PDF、JPG、PNG、JPEG、XLS、XLSX、ZIP格式的文件</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-end gap-3 mb-2">
                <span className="text-blue-500 cursor-pointer hover:underline text-[12px] flex items-end">供应商信息设置</span>
                <FeatureMarker title="添加付款单" description="交互说明：点击打开新增弹窗，录入新数据。">
                <Button 
                  className="h-8 bg-[#8BC34A] hover:bg-[#7cb342] text-white px-4 text-[13px] font-normal"
                  onClick={() => setPaymentApplyRows([...paymentApplyRows, { id: Date.now(), amount: '', date: '', note: '' }])}
                >
                  <Plus className="w-4 h-4 mr-1" /> 添加付款单
                </Button>
                </FeatureMarker>
              </div>
              <div className="border border-gray-200">
                <table className="w-full text-center">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                    <tr>
                      <th className="p-2 font-normal flex items-center justify-center gap-1">付款金额 <HelpCircle className="w-3.5 h-3.5 text-blue-500" /></th>
                      <th className="p-2 font-normal">预计付款时间</th>
                      <th className="p-2 font-normal w-1/3">备注</th>
                      <th className="p-2 font-normal w-16">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentApplyRows.map((row, index) => (
                      <tr key={row.id} className="border-b border-gray-100 last:border-b-0">
                        <td className="p-2">
                          <div className="flex items-center justify-center gap-2">
                            <Input 
                              type="number" 
                              value={row.amount}
                              onChange={(e) => setPaymentApplyRows(prev => prev.map((r, i) => i === index ? { ...r, amount: e.target.value } : r))}
                              className="h-8 w-24 text-center text-[13px]" 
                            />
                            <span>RMB</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Input 
                            type="date" 
                            value={row.date}
                            onChange={(e) => setPaymentApplyRows(prev => prev.map((r, i) => i === index ? { ...r, date: e.target.value } : r))}
                            className="h-8 w-36 mx-auto text-[13px] text-center" 
                            placeholder="预计付款时间"
                          />
                        </td>
                        <td className="p-2">
                          <textarea 
                            value={row.note}
                            onChange={(e) => setPaymentApplyRows(prev => prev.map((r, i) => i === index ? { ...r, note: e.target.value } : r))}
                            className="w-full h-12 border border-gray-200 rounded p-1 text-[13px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" 
                          />
                        </td>
                        <td className="p-2 text-red-500 cursor-pointer hover:underline" onClick={() => setPaymentApplyRows(prev => prev.filter((_, i) => i !== index))}>
                          移除
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-[12px] text-gray-500">
              温馨提示: 可在<span className="text-blue-500 cursor-pointer hover:underline">财务模块</span>设置默认账号,便于财务流水管理。
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-700">
                <Checkbox checked={paymentApplyIsPaid} onCheckedChange={(c) => setPaymentApplyIsPaid(!!c)} />
                已经付款
              </label>
              <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
              <Button 
                className="bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 h-8 font-normal" 
                onClick={() => {
                  const hasEmptyAmount = paymentApplyRows.some(r => !r.amount || isNaN(parseFloat(r.amount)) || parseFloat(r.amount) <= 0);
                  if (paymentApplyRows.length > 0 && hasEmptyAmount) {
                    alert('请填写有效的付款金额');
                    return;
                  }
                  
                  setOrders((prev: any[]) => prev.map(o => {
                    if (o.id === paymentApplyOrderId) {
                      return { ...o, paymentStatus: '已申请付款' };
                    }
                    return o;
                  }));
                  setToastMessage('付款申请已提交');
                  setTimeout(() => setToastMessage(null), 2000);
                  setPaymentApplyOrderId(null);
                  setPaymentApplyRows([]);
                }}
              >
                确定
              </Button>
              </FeatureMarker>
              <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="px-6 h-8 border-gray-200 bg-white hover:bg-gray-50 font-normal" onClick={() => { setPaymentApplyOrderId(null); setPaymentApplyRows([]); }}>取消</Button>
</FeatureMarker>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AddOrderDialog 
        open={showAddOrder} 
        onOpenChange={setShowAddOrder} 
        onAddOrder={(newOrder) => {
          setOrders(prev => [newOrder, ...prev]);
          setShowAddOrder(false);
        }} 
      />
      <BatchOperationsModals 
        modalType={batchModalType}
        setModalType={setBatchModalType}
        selectedOrders={selectedOrders}
        orders={orders}
        setOrders={setOrders}
        setToastMessage={setToastMessage}
      />

      {autoOrder1688Id && (
        <AutoOrder1688Modal
          order={orders.find((o: any) => o.id === autoOrder1688Id)}
          onClose={() => setAutoOrder1688Id(null)}
          onSuccess={(payload: any) => {
            setOrders((prev: any[]) => prev.map(o => {
              if (o.id === autoOrder1688Id) {
                return {
                  ...o,
                  platformOrderNo: payload?.platformOrderNo || o.platformOrderNo,
                  ali1688AccountName: payload?.ali1688AccountName || o.ali1688AccountName,
                  ali1688TradeType: payload?.ali1688TradeType || o.ali1688TradeType,
                  platformPaymentStatus: payload?.platformPaymentStatus || o.platformPaymentStatus
                };
              }
              return o;
            }));
            setToastMessage('操作成功');
            setTimeout(() => setToastMessage(null), 2000);
          }}
        />
      )}
    </div>
  );
}
