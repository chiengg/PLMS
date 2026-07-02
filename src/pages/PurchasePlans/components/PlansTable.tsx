import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { 
  FileText,
  Copy,
  Info,
  ChevronDown,
  Edit,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  Search,
  PenLine
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockPlans } from '../mockData';
import type { PlanGroup } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mergeIntoBuyerGroups, updatePlanItemSupplier } from '../utils';

export default function PlansTable() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [shelveModalOpen, setShelveModalOpen] = useState(false);
  const [batchProcessModalOpen, setBatchProcessModalOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [targetItems, setTargetItems] = useState<any[]>([]);
  const [shelveReason, setShelveReason] = useState('');
  const [supplierTargetItemId, setSupplierTargetItemId] = useState<string | null>(null);
  
  const [shelvedItems, setShelvedItems] = useLocalStorage<any[]>('purchase_plans_shelved_data_v2', []);
  const [shelvedListModalOpen, setShelvedListModalOpen] = useState(false);
  const [selectedShelvedItems, setSelectedShelvedItems] = useState<string[]>([]);
  
  const [batchAction, setBatchAction] = useState('shelve');
  const [newSupplier, setNewSupplier] = useState('');
  const [targetGroupIndex, setTargetGroupIndex] = useState<number | null>(null);

  // Edit Buyer State
  const [editBuyerOpen, setEditBuyerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const mockBuyers = ['张伟', '李娜', '王强', '刘美希', '陈刚'];

  // Initialize with passed items or mock data
  const [plans, setPlans] = useLocalStorage<PlanGroup[]>('purchase_plans_data_v2', mockPlans);
  const safePlans = Array.isArray(plans) ? plans : [];
  const lastSortedKeyRef = React.useRef<string>('');

  const processedStateRef = React.useRef<any>(null);

  React.useEffect(() => {
    const isValid = Array.isArray(plans) && plans.every((p: any) => p && typeof p === 'object' && Array.isArray(p.items));
    if (!isValid) {
      setPlans([]);
      return;
    }
    const hasLegacySupplierGroups = plans.some(
      (p: any) =>
        p &&
        typeof p === 'object' &&
        typeof p.supplierName === 'string' &&
        typeof p.buyerName !== 'string'
    );
    if (hasLegacySupplierGroups) {
      setPlans(mergeIntoBuyerGroups({ prev: plans as any, incoming: [] as any }));
    }
  }, [plans, setPlans]);

  React.useEffect(() => {
    if (!Array.isArray(plans)) return;

    const getGroupTs = (p: any) => {
      const items = Array.isArray(p?.items) ? p.items : [];
      const times = items
        .map((i: any) => Date.parse(i?.createTime))
        .filter((t: any) => typeof t === 'number' && !Number.isNaN(t));
      const maxItemTime = times.length > 0 ? Math.max(...times) : 0;
      const planTime = Date.parse(p?.createTime);
      const planTs = typeof planTime === 'number' && !Number.isNaN(planTime) ? planTime : 0;
      return Math.max(maxItemTime, planTs);
    };

    const next = [...plans].sort((a: any, b: any) => getGroupTs(b) - getGroupTs(a));
    const nextKey = next.map((p: any) => p?.planNumber || p?.buyerName || '').join('|');
    if (nextKey && nextKey !== lastSortedKeyRef.current) {
      lastSortedKeyRef.current = nextKey;
      setPlans(next);
    }
  }, [plans, setPlans]);

  React.useEffect(() => {
    if (location.state?.newPlans && location.state.newPlans.length > 0) {
      if (processedStateRef.current === location.state.newPlans) return;
      processedStateRef.current = location.state.newPlans;
      setPlans((prev) =>
        mergeIntoBuyerGroups({
          prev: Array.isArray(prev) ? prev : [],
          incoming: location.state.newPlans,
        })
      );

      // Clear the state so it doesn't add again on re-render
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = safePlans.flatMap((p: any) => p.items.map((i: any) => i.id));
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectGroup = (checked: boolean, planIndex: number) => {
    const groupIds = safePlans[planIndex].items.map((i: any) => i.id);
    if (checked) {
      setSelectedItems(prev => Array.from(new Set([...prev, ...groupIds])));
    } else {
      setSelectedItems(prev => prev.filter(id => !groupIds.includes(id)));
    }
  };

  const handleSelectItem = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleGenerateOrder = () => {
    if (selectedItems.length === 0) {
      alert('请先勾选数据');
      return;
    }
    const itemsToOrder = safePlans.flatMap((p: any) => 
      p.items.map((i: any) => ({ 
        ...i, 
        supplierName: i.supplierName || '未知供应商',
        purchasePrice: i.purchasePrice || 100, // mock price if missing
        suggestedQuantity: i.quantity,
        deliveryDays: 14 // mock delivery days if missing
      }))
    ).filter((i: any) => selectedItems.includes(i.id));
    navigate('/generate-purchase-order', { state: { selectedItems: itemsToOrder } });
  };

  const handleShelveSingle = (plan: any, item: any) => {
    setTargetItems([{ ...item, planNumber: plan.planNumber }]);
    setShelveReason('');
    setShelveModalOpen(true);
  };

  const handleBatchProcess = () => {
    if (selectedItems.length === 0) {
      alert('请先勾选数据');
      return;
    }
    const itemsToProcess = safePlans.flatMap((p: any) => 
      p.items.map((i: any) => ({ ...i, planNumber: p.planNumber, supplierName: i.supplierName }))
    ).filter((i: any) => selectedItems.includes(i.id));

    // Check if all selected items have "未采购" status
    const hasInvalidStatus = itemsToProcess.some((i: any) => i.status !== '未采购');
    if (hasInvalidStatus) {
      alert('仅未采购状态才可执行批量处理计划');
      return;
    }
    
    setTargetItems(itemsToProcess);
    setShelveReason('');
    setBatchAction('shelve');
    setBatchProcessModalOpen(true);
  };

  const executeProcess = (action: string = batchAction) => {
    if (action === 'shelve') {
      const newShelvedItems = targetItems.map(item => ({ ...item, shelveReason }));
      setShelvedItems(prev => [...prev, ...newShelvedItems]);
    }
    
    // Remove from plans
    setPlans((prev: any) => {
      let next = [...prev];
      targetItems.forEach(target => {
        const groupIdx = next.findIndex(g => g.buyerName === target.buyer);
        if (groupIdx > -1) {
          next[groupIdx].items = next[groupIdx].items.filter((i: any) => i.id !== target.id);
        }
      });
      return next.filter(g => g.items.length > 0).map(group => {
        group.totalProducts = group.items.length;
        group.totalQuantity = group.items.reduce((sum: number, i: any) => sum + i.quantity, 0);
        group.totalPrice = group.items.reduce((sum: number, i: any) => sum + (i.quantity * (i.purchasePrice || 100)), 0);
        return group;
      });
    });

    setShelveModalOpen(false);
    setBatchProcessModalOpen(false);
    setSelectedItems([]);
    setShelveReason('');
  };

  const handleQuantityChange = (planIdx: number, itemIdx: number, newQty: number) => {
    setPlans((prev: any) => {
      const next = [...prev];
      const plan = { ...next[planIdx] };
      const items = [...plan.items];
      const item = { ...items[itemIdx] };
      
      item.quantity = newQty;
      items[itemIdx] = item;
      plan.items = items;
      
      plan.totalQuantity = items.reduce((sum: number, i: any) => sum + i.quantity, 0);
      plan.totalPrice = items.reduce((sum: number, i: any) => sum + (i.quantity * (i.purchasePrice || 0)), 0);
      
      next[planIdx] = plan;
      return next;
    });
  };

  const handleCancelShelve = () => {
    if (selectedShelvedItems.length === 0) return;
    
    const itemsToRestore = shelvedItems.filter(i => selectedShelvedItems.includes(i.id));
    
    setPlans((prev: any) => {
      let next = [...prev];
      
      itemsToRestore.forEach(item => {
        let targetGroup = next.find(g => g.buyerName === item.buyer);
        if (!targetGroup) {
          targetGroup = {
            planNumber: item.planNumber,
            buyerName: item.buyer,
            totalProducts: 0,
            totalQuantity: 0,
            totalPrice: 0,
            items: []
          };
          next.push(targetGroup);
        }
        targetGroup.items.push(item);
      });
      
      return next.map(group => {
        group.totalProducts = group.items.length;
        group.totalQuantity = group.items.reduce((sum: number, i: any) => sum + i.quantity, 0);
        group.totalPrice = group.items.reduce((sum: number, i: any) => sum + (i.quantity * (i.purchasePrice || 100)), 0);
        return group;
      });
    });
    
    setShelvedItems(prev => prev.filter(i => !selectedShelvedItems.includes(i.id)));
    setSelectedShelvedItems([]);
    setShelvedListModalOpen(false);
  };
  const handleNotesChange = (planIdx: number, itemIdx: number, newNotes: string) => {
    setPlans((prev: any) => {
      const next = [...prev];
      const plan = { ...next[planIdx] };
      const items = [...plan.items];
      items[itemIdx] = { ...items[itemIdx], notes: newNotes };
      plan.items = items;
      next[planIdx] = plan;
      return next;
    });
  };

  const executeChangeSupplier = () => {
    if (!newSupplier || !supplierTargetItemId) return;
    setPlans((prev: any) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return updatePlanItemSupplier({
        plans: safePrev,
        itemId: supplierTargetItemId,
        supplierName: newSupplier,
      });
    });
    
    setSupplierModalOpen(false);
    setNewSupplier('');
    setSupplierTargetItemId(null);
  };

  const executeChangeBuyer = () => {
    if (targetGroupIndex === null || !selectedValue) return;
    
    setPlans((prev: any) => {
      const next = [...prev];
      const currentGroup = next[targetGroupIndex];
      const itemsToMove = currentGroup.items.map((item: any) => ({ ...item, buyer: selectedValue }));
      next.splice(targetGroupIndex, 1);
      let targetGroup = next.find((g: any) => g.buyerName === selectedValue);
      if (!targetGroup) {
        targetGroup = {
          planNumber: currentGroup.planNumber,
          buyerName: selectedValue,
          totalProducts: 0,
          totalQuantity: 0,
          totalPrice: 0,
          items: [],
        };
        next.push(targetGroup);
      }
      targetGroup.items.push(...itemsToMove);

      return next
        .map((group: any) => {
          group.items = group.items.map((item: any) => ({ ...item, buyer: group.buyerName }));
          group.totalProducts = group.items.length;
          group.totalQuantity = group.items.reduce((sum: number, i: any) => sum + i.quantity, 0);
          group.totalPrice = group.items.reduce(
            (sum: number, i: any) => sum + i.quantity * (i.purchasePrice || 0),
            0
          );
          return group;
        })
        .sort((a: any, b: any) => a.buyerName.localeCompare(b.buyerName, 'zh'));
    });
    
    setEditBuyerOpen(false);
    setTargetGroupIndex(null);
    setSelectedValue('');
    setSearchValue('');
  };

  return (
    <div className="flex flex-col flex-1 bg-white rounded shadow-sm border border-gray-200 overflow-hidden h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-[#F5F6F8]">
        <div className="flex items-center gap-2">
          <FeatureMarker title="生成采购单" description="交互说明：点击执行生成采购单操作。">
          <Button 
            className="h-8 px-3 text-[13px] bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleGenerateOrder}
          >
            <FileText className="w-4 h-4 mr-1" />
            生成采购单
          </Button>
          </FeatureMarker>

          <FeatureMarker title="批量处理计划" description="交互说明：点击执行批量处理计划操作。">
          <Button 
            className="h-8 px-3 text-[13px] bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleBatchProcess}
          >
            <Plus className="w-4 h-4 mr-1" />
            批量处理计划
          </Button>
          </FeatureMarker>

          <FeatureMarker title="搁置计划列表" description="交互说明：点击执行搁置计划列表操作。">
          <Button 
            variant="outline" 
            className="h-8 px-3 text-[13px] border-gray-300"
            onClick={() => {
              if (shelvedItems.length === 0) {
                alert('暂无搁置计划数据');
                return;
              }
              setShelvedListModalOpen(true);
            }}
          >
            搁置计划列表
          </Button>
          </FeatureMarker>

          <div className="flex items-center text-orange-500 text-[12px] ml-2">
            <Info className="w-3.5 h-3.5 mr-1" />
            仅未采购状态才可执行批量删除、生成采购单、批量处理计划
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#4B5563] text-white hover:bg-[#374151] h-8 px-3 text-[13px] border-none">
              <Upload className="w-4 h-4 mr-1" />
              添加/导入
              <ChevronDown className="w-4 h-4 ml-1 text-gray-300" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/manual-suggestions', { state: { returnTo: '/purchase-plans' } })}>手动创建采购计划</DropdownMenuItem>
              <DropdownMenuItem>导入采购商品</DropdownMenuItem>
              <DropdownMenuItem>导出采购商品</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="flex-1 overflow-auto custom-scrollbar relative bg-white">
        <table className="w-max min-w-full text-left text-[12px] border-collapse">
          <thead className="sticky top-0 bg-[#F5F6F8] text-gray-600 border-b border-gray-200 z-10">
            <tr>
              <th className="p-3 w-10 min-w-[40px] text-center">
                <Checkbox 
                  onCheckedChange={handleSelectAll} 
                  checked={selectedItems.length > 0 && selectedItems.length === safePlans.flatMap((p: any) => p.items).length}
                />
              </th>
              <th className="p-3 font-medium min-w-[240px]">库存SKU / 中文名称</th>
              <th className="p-3 font-medium min-w-[180px]">供应商</th>
              <th className="p-3 font-medium min-w-[100px]">仓库/仓位</th>
              <th className="p-3 font-medium min-w-[120px] text-center">采购数量</th>
              <th className="p-3 font-medium min-w-[100px] text-center">入库量/损耗量</th>
              <th className="p-3 font-medium min-w-[180px]">备注</th>
              <th className="p-3 font-medium min-w-[100px] text-center">物流信息</th>
              <th className="p-3 font-medium min-w-[100px] text-center">采购状态</th>
              <th className="p-3 font-medium min-w-[100px] text-center">计划来源</th>
              <th className="p-3 font-medium min-w-[80px]">创建人</th>
              <th className="p-3 font-medium min-w-[140px]">创建时间</th>
              <th className="p-3 font-medium text-center sticky right-0 bg-[#F5F6F8] shadow-[-1px_0_0_rgba(229,231,235,1)]">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {safePlans.map((plan: any, pIdx: number) => {
              const planIds = plan.items.map((i: any) => i.id);
              const isAllGroupSelected = planIds.every(id => selectedItems.includes(id));
              const isSomeGroupSelected = planIds.some(id => selectedItems.includes(id));
              const supplierNames = Array.from(
                new Set<string>(
                  (plan.items || [])
                    .map((i: any) => i?.supplierName)
                    .filter((v: unknown): v is string => typeof v === 'string' && v.length > 0)
                )
              );
              const supplierLabel =
                supplierNames.length <= 1 ? supplierNames[0] || '--' : `多家(${supplierNames.length})`;
              const supplierEditValue = supplierNames.length === 1 ? supplierNames[0] : '';
              
              return (
                <React.Fragment key={pIdx}>
                    {/* Group Header */}
                    <tr className="bg-[#F0F5FA] hover:bg-[#E6EEF7] border-y border-gray-200">
                      <td className="p-2 text-center">
                        <Checkbox 
                          checked={isAllGroupSelected}
                          onCheckedChange={(checked) => handleSelectGroup(!!checked, pIdx)}
                        />
                      </td>
                      <td colSpan={11} className="p-2 relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-700">
                            <span className="font-medium mr-4">计划号：<span className="text-blue-600">{plan.planNumber}</span></span>
                            <span className="ml-6 text-gray-500 flex items-center">
                              采购员：{plan.buyerName || plan.items[0]?.buyer || '--'}
                              <PenLine 
                                className="w-3 h-3 text-gray-400 cursor-pointer ml-1.5 hover:text-blue-500" 
                                onClick={() => {
                                  setTargetGroupIndex(pIdx);
                                  setSelectedValue(plan.buyerName || plan.items[0]?.buyer || '');
                                  setEditBuyerOpen(true);
                                }}
                              />
                            </span>
                          </div>
                          <div className="text-gray-600 flex items-center text-[12px] absolute right-4">
                            <span className="mr-4">共 {plan.totalProducts} 个商品，建议采购 <span className="text-blue-600">{plan.totalQuantity}</span> 件</span>
                            <span className="text-blue-600">采购总价：￥{plan.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 sticky right-0 bg-[#F0F5FA] shadow-[-1px_0_0_rgba(229,231,235,1)]"></td>
                    </tr>

                    {/* Group Items */}
                    {plan.items.map((item: any, iIdx: number) => (
                      <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="p-3 text-center">
                          <Checkbox 
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(!!checked, item.id)}
                          />
                        </td>
                        <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <span className="text-[8px] text-gray-400 break-all p-1 leading-tight text-center">No Image</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-blue-600">{item.sku}</span>
                            <span className="text-gray-600">{item.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">
                        <div className="flex items-center gap-1">
                          <span>{item.supplierName || '--'}</span>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-blue-500"
                            aria-label="编辑供应商"
                            onClick={() => {
                              setNewSupplier(item.supplierName || '');
                              setSupplierTargetItemId(item.id);
                              setSupplierModalOpen(true);
                            }}
                          >
                            <PenLine className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{item.warehouse}</td>
                      <td className="p-3 text-center">
                        <Input 
                          type="number"
                          min="0"
                          value={item.quantity} 
                          onChange={e => handleQuantityChange(pIdx, iIdx, parseInt(e.target.value) || 0)}
                          className="h-7 w-20 text-center text-[12px] border-gray-300 mx-auto focus-visible:ring-blue-500" 
                        />
                      </td>
                      <td className="p-3 text-center text-gray-500">
                        {item.inbound}<br/>
                        <span className="text-orange-500">/{item.loss}</span>
                      </td>
                      <td className="p-3">
                        <Input 
                          value={item.notes} 
                          onChange={e => handleNotesChange(pIdx, iIdx, e.target.value)}
                          maxLength={200}
                          className="h-7 w-full text-[12px] border-gray-300 focus-visible:ring-blue-500" 
                        />
                      </td>
                      <td className="p-3 text-center text-gray-400">{item.logistics}</td>
                      <td className="p-3 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[11px] border border-orange-200 bg-orange-50 text-orange-500">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-center text-gray-600">{item.source}</td>
                      <td className="p-3 text-gray-600">{item.creator}</td>
                      <td className="p-3 text-gray-500">{item.createTime}</td>
                      <td className="p-3 text-center sticky right-0 bg-white shadow-[-1px_0_0_rgba(229,231,235,1)]">
                        <div className="flex items-center justify-center gap-2 text-[12px]">
                          <FeatureMarker title="生成采购单" description="交互说明：点击执行生成采购单操作。">
                          <button 
                            className="text-blue-600 hover:underline"
                            onClick={() => {
                              setSelectedItems([item.id]);
                              const itemToOrder = {
                                ...item,
                                supplierName: item.supplierName,
                                purchasePrice: item.purchasePrice || 100,
                                suggestedQuantity: item.quantity,
                                deliveryDays: 14
                              };
                              navigate('/generate-purchase-order', { state: { selectedItems: [itemToOrder] } });
                            }}
                          >生成采购单</button>
                          </FeatureMarker>
                          <FeatureMarker title="搁置" description="交互说明：点击执行搁置操作。">
                          <button 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => handleShelveSingle(plan, item)}
                          >搁置</button>
                          </FeatureMarker>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer Summary */}
      <div className="h-10 bg-white border-t border-gray-200 flex items-center justify-between px-4 text-[12px] text-gray-600">
        <div className="font-medium">总计</div>
        <div className="flex items-center gap-4">
          <span>共 {safePlans.length} 个采购员，{safePlans.reduce((sum: number, p: any) => sum + p.totalProducts, 0)} 个商品</span>
          <div className="flex items-center gap-2 ml-4">
            <span>共 {safePlans.reduce((sum: number, p: any) => sum + p.totalProducts, 0)} 条</span>
            <div className="flex items-center gap-1">
              <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button variant="outline" size="icon" className="h-6 w-6"><ChevronLeft className="w-3 h-3" /></Button>
</FeatureMarker>
              <FeatureMarker title="1" description="交互说明：点击执行1操作。">
<Button variant="default" size="icon" className="h-6 w-6 bg-blue-600 text-white hover:bg-blue-700 rounded text-[12px]">1</Button>
</FeatureMarker>
              <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button variant="outline" size="icon" className="h-6 w-6"><ChevronRight className="w-3 h-3" /></Button>
</FeatureMarker>
            </div>
            <Select defaultValue="20">
              <SelectTrigger className="h-6 w-16 text-[12px] px-2">
                <SelectValue placeholder="20条/页" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20条/页</SelectItem>
                <SelectItem value="50">50条/页</SelectItem>
                <SelectItem value="100">100条/页</SelectItem>
              </SelectContent>
            </Select>
            <span>前往 <Input defaultValue="1" className="h-6 w-8 px-1 py-0 text-center inline-block mx-1 text-[12px]" /> 页</span>
          </div>
        </div>
      </div>

      <Dialog open={shelveModalOpen} onOpenChange={setShelveModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>搁置计划</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {targetItems.length === 1 && (
              <div className="border border-gray-200 rounded mb-4 text-[13px] text-gray-700">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-4">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                  <span>库存SKU: {targetItems[0].sku}</span>
                  <span>供应商: {targetItems[0].supplierName}</span>
                  <span>仓库: {targetItems[0].warehouse}</span>
                </div>
                <div className="p-4 grid grid-cols-4 gap-y-6">
                  <div>
                    <div className="text-gray-500 mb-1">申请来源</div>
                    <div>{targetItems[0].source}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">采购员</div>
                    <div>{targetItems[0].buyer}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">创建时间</div>
                    <div>{targetItems[0].createTime}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">期望到货时间</div>
                    <div>--</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">申请采购量</div>
                    <div>{targetItems[0].quantity}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500 mb-1">计划号</div>
                    <div>{targetItems[0].planNumber}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">申请备注</div>
                    <div>{targetItems[0].notes || '--'}</div>
                  </div>
                </div>
              </div>
            )}
            
            {targetItems.length > 1 && (
              <div className="border border-gray-200 rounded overflow-hidden max-h-[200px] overflow-y-auto mb-4">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-2">库存SKU</th>
                      <th className="p-2">供应商</th>
                      <th className="p-2">仓库</th>
                      <th className="p-2">采购数量</th>
                      <th className="p-2">计划号</th>
                    </tr>
                  </thead>
                  <tbody>
                    {targetItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0">
                        <td className="p-2">{item.sku}</td>
                        <td className="p-2">{item.supplierName}</td>
                        <td className="p-2">{item.warehouse}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{item.planNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div>
              <div className="text-[13px] font-medium mb-2">搁置原因</div>
              <div className="relative">
                <Textarea 
                  value={shelveReason}
                  onChange={e => setShelveReason(e.target.value)}
                  placeholder="请输入原因" 
                  maxLength={200}
                  className="text-[13px] min-h-[100px] pb-6"
                />
                <span className="absolute bottom-2 right-2 text-[12px] text-gray-400">
                  {shelveReason.length}/200
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setShelveModalOpen(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-orange-500 hover:bg-orange-600 text-white border-none" onClick={() => executeProcess('shelve')}>确定</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={batchProcessModalOpen} onOpenChange={setBatchProcessModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>处理计划</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-100">
              <span className="text-[13px] font-medium text-gray-700">处理方式:</span>
              <div className="flex items-center gap-6">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="batchAction" 
                      value="shelve" 
                      checked={batchAction === 'shelve'} 
                      onChange={() => setBatchAction('shelve')} 
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded-full border border-input peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                      {batchAction === 'shelve' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="text-[13px] font-normal group-hover:text-gray-900">搁置计划</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="batchAction" 
                      value="delete" 
                      checked={batchAction === 'delete'} 
                      onChange={() => setBatchAction('delete')} 
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded-full border border-input peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                      {batchAction === 'delete' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="text-[13px] font-normal group-hover:text-gray-900">删除计划</span>
                </label>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded overflow-hidden max-h-[300px] overflow-y-auto mb-4 text-[13px] text-gray-700">
              {targetItems.map((item, idx) => (
                <div key={idx} className="border-b border-gray-200 last:border-0">
                  <div className="bg-gray-50 px-4 py-2 flex items-center gap-4">
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                    <span>库存SKU: {item.sku}</span>
                    <span>供应商: {item.supplierName}</span>
                    <span>仓库: {item.warehouse}</span>
                  </div>
                  <div className="bg-white">
                    <table className="w-full text-left">
                      <thead className="border-y border-gray-100 text-gray-500">
                        <tr>
                          <th className="p-2 w-10 text-center">
                            <Checkbox checked={true} readOnly />
                          </th>
                          <th className="p-2 font-normal">申请来源</th>
                          <th className="p-2 font-normal">采购员</th>
                          <th className="p-2 font-normal">创建时间</th>
                          <th className="p-2 font-normal">期望到货时间</th>
                          <th className="p-2 font-normal">申请采购量</th>
                          <th className="p-2 font-normal">计划号</th>
                          <th className="p-2 font-normal">申请备注</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 text-center"></td>
                          <td className="p-2">{item.source || '手动创建'}</td>
                          <td className="p-2">{item.buyer}</td>
                          <td className="p-2">{item.createTime}</td>
                          <td className="p-2">--</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">{item.planNumber}</td>
                          <td className="p-2">{item.notes || '--'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <div className="text-[13px] font-medium mb-2">{batchAction === 'shelve' ? '搁置原因' : '删除原因'}</div>
              <div className="relative">
                <Textarea 
                  value={shelveReason}
                  onChange={e => setShelveReason(e.target.value)}
                  placeholder="请输入原因"
                  maxLength={200}
                  className="text-[13px] min-h-[100px] pb-6"
                />
                <span className="absolute bottom-2 right-2 text-[12px] text-gray-400">
                  {shelveReason.length}/200
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setBatchProcessModalOpen(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white border-none" onClick={() => {
              if (!shelveReason.trim()) {
                alert(`请填写${batchAction === 'shelve' ? '搁置' : '删除'}原因`);
                return;
              }
              executeProcess();
            }}>确定</Button>
            </FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={supplierModalOpen}
        onOpenChange={(open) => {
          setSupplierModalOpen(open);
          if (!open) {
            setNewSupplier('');
            setSupplierTargetItemId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>更换供应商</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex items-center gap-2">
            <span className="text-[13px] text-gray-600 w-16">供应商：</span>
            <div className="flex-1 flex items-center gap-2">
              <Input 
                value={newSupplier}
                onChange={e => setNewSupplier(e.target.value)}
                placeholder="请输入供应商名称" 
                className="h-8 text-[13px] flex-1"
              />
              <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
<Button className="h-8 px-4 bg-blue-600 hover:bg-blue-700">搜索</Button>
</FeatureMarker>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead className="bg-[#F5F6F8] sticky top-0">
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="p-2 pl-4">供应商名称</th>
                  <th className="p-2 w-16 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {['广州市贝衣情纺织品有限公司', '广州莱菌电子商务有限公司', '深圳市宝安区石岩望强服装厂', '广州市艾梵服饰有限公司', '广州依雪霞服饰有限公司'].map(sup => (
                  <tr key={sup} className="hover:bg-gray-50">
                    <td className="p-2 pl-4">{sup}</td>
                    <td className="p-2 text-center">
                      <FeatureMarker title="选择" description="交互说明：点击执行选择操作。">
                      <button className="text-blue-600 hover:underline" onClick={() => {
                        setNewSupplier(sup);
                      }}>选择</button>
                      </FeatureMarker>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DialogFooter className="mt-4">
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setSupplierModalOpen(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确认" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-blue-600 hover:bg-blue-700" onClick={executeChangeSupplier}>确认</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shelvedListModalOpen} onOpenChange={setShelvedListModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>搁置计划</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="border border-gray-200 rounded overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-2 w-10 text-center">
                      <Checkbox 
                        checked={selectedShelvedItems.length > 0 && selectedShelvedItems.length === shelvedItems.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedShelvedItems(shelvedItems.map(i => i.id));
                          } else {
                            setSelectedShelvedItems([]);
                          }
                        }}
                      />
                    </th>
                    <th className="p-2">库存SKU</th>
                    <th className="p-2">供应商</th>
                    <th className="p-2">申请来源</th>
                    <th className="p-2">采购员</th>
                    <th className="p-2">创建时间</th>
                    <th className="p-2">期望到货时间</th>
                    <th className="p-2">计划号</th>
                    <th className="p-2">搁置原因</th>
                  </tr>
                </thead>
                <tbody>
                  {shelvedItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="p-2 text-center">
                        <Checkbox 
                          checked={selectedShelvedItems.includes(item.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedShelvedItems(prev => [...prev, item.id]);
                            } else {
                              setSelectedShelvedItems(prev => prev.filter(id => id !== item.id));
                            }
                          }}
                        />
                      </td>
                      <td className="p-2 text-blue-600">{item.sku}</td>
                      <td className="p-2">{item.supplierName}</td>
                      <td className="p-2">{item.source}</td>
                      <td className="p-2">{item.buyer}</td>
                      <td className="p-2">{item.createTime}</td>
                      <td className="p-2">--</td>
                      <td className="p-2 text-blue-600">{item.planNumber}</td>
                      <td className="p-2 max-w-[120px] truncate" title={item.shelveReason}>{item.shelveReason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setShelvedListModalOpen(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="取消搁置" description="交互说明：放弃当前操作并关闭弹窗。">
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white border-none" 
              onClick={handleCancelShelve}
              disabled={selectedShelvedItems.length === 0}
            >
              取消搁置
            </Button>
            </FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Buyer Dialog */}
      <Dialog open={editBuyerOpen} onOpenChange={setEditBuyerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>修改采购员</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">搜索采购员</span>
              <Input 
                placeholder="请输入关键字搜索..." 
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-sm font-medium">选择采购员</span>
              <div className="border rounded-md max-h-[200px] overflow-y-auto custom-scrollbar bg-white">
                {mockBuyers
                  .filter(b => b.toLowerCase().includes(searchValue.toLowerCase()))
                  .map(b => (
                    <div 
                      key={b}
                      className={cn(
                        "px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors",
                        selectedValue === b ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700"
                      )}
                      onClick={() => setSelectedValue(b)}
                    >
                      {b}
                    </div>
                  ))
                }
                {mockBuyers.filter(b => b.toLowerCase().includes(searchValue.toLowerCase())).length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">暂无匹配数据</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setEditBuyerOpen(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确认" description="交互说明：校验表单数据并提交保存。">
<Button onClick={executeChangeBuyer} className="bg-blue-600 hover:bg-blue-700">确认</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
