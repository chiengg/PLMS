import React, { useState, useMemo } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { HelpCircle, Trash2, PlusCircle, MinusCircle, Copy, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function MergeTable({ orders, setOrders, filterValues }: { orders: any[], setOrders: (o: any) => void, filterValues: any }) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Merge Dialog State
  const [mergeGroupsData, setMergeGroupsData] = useState<any[] | null>(null);
  const [targetOrderIds, setTargetOrderIds] = useState<Record<string, string>>({}); // groupId -> targetOrderId

  // Step 1: Filter eligible orders for merging
  const eligibleOrders = useMemo(() => {
    let filtered = (orders || []).filter(o => {
      // Exclude already merged ones
      if (o.isMerged) return false;

      // 1. 未入库采购状态 (Using status)
      const validStatuses = ['待提交', '待审核', '被驳回', '新订单（未提交）'];
      if (!validStatuses.includes(o.status)) return false;
      
      // 2. 待申请付款状态
      if (o.paymentStatus !== '待申请' && o.paymentStatus !== '待申请付款') return false;

      // 7. 未关联第三方单号 (我有货发货不可合并)
      if (o.platformOrderNo && o.platformOrderNo !== '--') return false;

      // 8. 必须同税金类型 (grouped below)
      // 3. 供应商 (grouped below)
      // 4. 仓库 (grouped below)
      // 5. 币种 (grouped below)
      // 6. 同一sku赠品 (grouped below)
      return true;
    });

    // Apply UI filters (searchKeyword)
    if (filterValues.searchKeyword) {
      const keyword = filterValues.searchKeyword.toLowerCase();
      filtered = filtered.filter(o => {
        const type = filterValues.searchType || '采购单号';
        if (type === '采购单号' && o.orderNo?.toLowerCase().includes(keyword)) return true;
        if (type === '供应商' && o.supplierName?.toLowerCase().includes(keyword)) return true;
        if (type === '采购员' && o.buyer?.toLowerCase().includes(keyword)) return true;
        return o.orderNo?.toLowerCase().includes(keyword); // fallback
      });
    }

    return filtered;
  }, [orders, filterValues]);

  // Step 2: Group orders by required matching conditions
  // Group Key: Supplier + Warehouse + Currency + TaxType + isGift
  const groups = useMemo(() => {
    const map = new Map<string, any[]>();
    eligibleOrders.forEach(o => {
      const currency = o.currency || 'RMB';
      const taxType = o.taxType || 'default';
      const isGift = o.isGift || 'false';
      const warehouse = o.warehouse || '默认仓库';
      const supplier = o.supplierName || '未知供应商';

      const key = `${supplier}|${warehouse}|${currency}|${taxType}|${isGift}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    });

    return Array.from(map.entries()).map(([key, items]) => {
      const [supplier, warehouse] = key.split('|');
      return {
        id: key,
        supplier,
        warehouse,
        items
      };
    });
  }, [eligibleOrders]);

  const toggleGroupSelect = (groupId: string, checked: boolean, itemIds: string[]) => {
    if (checked) {
      setSelectedGroups(prev => [...prev, groupId]);
      setSelectedOrders(prev => Array.from(new Set([...prev, ...itemIds])));
    } else {
      setSelectedGroups(prev => prev.filter(id => id !== groupId));
      setSelectedOrders(prev => prev.filter(id => !itemIds.includes(id)));
    }
  };

  const toggleOrderSelect = (orderId: string, checked: boolean, groupId: string, allGroupItemIds: string[]) => {
    let newSelectedOrders = [...selectedOrders];
    if (checked) {
      newSelectedOrders.push(orderId);
    } else {
      newSelectedOrders = newSelectedOrders.filter(id => id !== orderId);
    }
    setSelectedOrders(newSelectedOrders);

    // Auto update group checkbox
    const allSelected = allGroupItemIds.every(id => newSelectedOrders.includes(id));
    if (allSelected) {
      if (!selectedGroups.includes(groupId)) setSelectedGroups([...selectedGroups, groupId]);
    } else {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedRows(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allGroupIds = groups.map(g => g.id);
      const allOrderIds = groups.flatMap(g => g.items.map(i => i.id));
      setSelectedGroups(allGroupIds);
      setSelectedOrders(allOrderIds);
    } else {
      setSelectedGroups([]);
      setSelectedOrders([]);
    }
  };

  const isAllSelected = groups.length > 0 && selectedGroups.length === groups.length && groups.every(g => g.items.every(i => selectedOrders.includes(i.id)));

  const handleBatchMerge = () => {
    const groupsToMerge = groups.map(g => {
      return {
        ...g,
        items: g.items.filter(o => selectedOrders.includes(o.id))
      };
    }).filter(g => g.items.length > 1); // Only merge if there are at least 2 orders selected in the group

    if (groupsToMerge.length === 0) {
      alert('请在至少一个供应商和仓库分组内勾选2个或以上可合并的订单');
      return;
    }

    const initialTargets: Record<string, string> = {};
    groupsToMerge.forEach(g => {
      // Default to max amount order
      const maxOrder = g.items.reduce((prev, curr) => {
        const prevAmount = prev.actualPayAmount || prev.totalPrice || 0;
        const currAmount = curr.actualPayAmount || curr.totalPrice || 0;
        return currAmount > prevAmount ? curr : prev;
      });
      initialTargets[g.id] = maxOrder.id;
    });

    setTargetOrderIds(initialTargets);
    setMergeGroupsData(groupsToMerge);
  };

  const handleSingleGroupMerge = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    const itemsToMerge = group.items.filter(o => selectedOrders.includes(o.id));
    if (itemsToMerge.length < 2) {
      alert('请在当前分组内勾选2个或以上订单以进行合并');
      return;
    }

    const maxOrder = itemsToMerge.reduce((prev, curr) => {
      const prevAmount = prev.actualPayAmount || prev.totalPrice || 0;
      const currAmount = curr.actualPayAmount || curr.totalPrice || 0;
      return currAmount > prevAmount ? curr : prev;
    });

    setTargetOrderIds({ [groupId]: maxOrder.id });
    setMergeGroupsData([{ ...group, items: itemsToMerge }]);
  };

  const removeOrderFromMerge = (groupId: string, orderId: string) => {
    setMergeGroupsData(prev => {
      if (!prev) return prev;
      return prev.map(g => {
        if (g.id === groupId) {
          const newItems = g.items.filter((o: any) => o.id !== orderId);
          return { ...g, items: newItems };
        }
        return g;
      }).filter(g => g.items.length > 1); // Remove group if < 2 items
    });
  };

  const confirmMerge = () => {
    if (!mergeGroupsData) return;

    setOrders((prevOrders: any[]) => {
      let nextOrders = [...prevOrders];

      mergeGroupsData.forEach(group => {
        const targetId = targetOrderIds[group.id];
        const targetOrder = group.items.find((o: any) => o.id === targetId);
        if (!targetOrder) return;

        const otherOrders = group.items.filter((o: any) => o.id !== targetId);
        
        // 1. Update other orders to '已作废'
        otherOrders.forEach((other: any) => {
          const idx = nextOrders.findIndex(o => o.id === other.id);
          if (idx !== -1) {
            nextOrders[idx] = { ...nextOrders[idx], status: '已作废', remark: `合并操作后的数据，合并单号${targetOrder.orderNo}` };
          }
        });

        // 2. Merge items into target order
        const targetIdx = nextOrders.findIndex(o => o.id === targetId);
        if (targetIdx !== -1) {
          const newTargetOrder = { ...nextOrders[targetIdx] };
          const mergedItemsMap = new Map<string, any>();
          
          // Add existing items
          (newTargetOrder.items || []).forEach((item: any) => {
            mergedItemsMap.set(item.sku, { ...item });
          });

          // Add items from other orders
          otherOrders.forEach((other: any) => {
            (other.items || []).forEach((item: any) => {
              if (mergedItemsMap.has(item.sku)) {
                const existing = mergedItemsMap.get(item.sku);
                existing.quantity = (existing.quantity || 0) + (item.quantity || 0);
              } else {
                mergedItemsMap.set(item.sku, { ...item });
              }
            });
          });

          const finalItems = Array.from(mergedItemsMap.values());
          newTargetOrder.items = finalItems;
          newTargetOrder.totalQuantity = finalItems.reduce((sum, i) => sum + (i.quantity || 0), 0);
          newTargetOrder.totalPurchaseQty = newTargetOrder.totalQuantity;
          newTargetOrder.unInboundQty = newTargetOrder.totalQuantity;
          
          // Re-calculate price (summing actualPayAmount or totalPrice from all merged orders)
          const totalMergedAmount = group.items.reduce((sum: number, o: any) => sum + (Number(o.actualPayAmount) || Number(o.totalPrice) || 0), 0);
          newTargetOrder.totalPrice = totalMergedAmount;
          newTargetOrder.actualPayAmount = totalMergedAmount;
          newTargetOrder.remark = `由多个订单合并而成 (原单: ${otherOrders.map((o: any) => o.orderNo).join(', ')})`;
          newTargetOrder.status = '新订单（未提交）';
          newTargetOrder.isMerged = true; // Flag to prevent showing in merge table again if conditions still match

          nextOrders[targetIdx] = newTargetOrder;
        }
      });

      return nextOrders;
    });

    alert('合并成功');
    setMergeGroupsData(null);
    setSelectedGroups([]);
    setSelectedOrders([]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded border border-gray-200 mt-4 overflow-hidden text-[13px]">
      
      {/* Top Action Bar */}
      <div className="p-3 border-b border-gray-200 flex items-center bg-[#F8F9FA] gap-4">
        <FeatureMarker title="批量合并" description="交互说明：点击执行批量合并操作。">
        <Button 
          className="h-8 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-sm"
          onClick={handleBatchMerge}
        >
          批量合并
        </Button>
        </FeatureMarker>
        <TooltipProvider delay={100}>
          <Tooltip>
            <TooltipTrigger className="flex items-center text-blue-600 cursor-pointer hover:underline">
              <span>合并默认条件</span>
              <HelpCircle className="w-3.5 h-3.5 ml-1" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[400px] text-xs leading-relaxed bg-white border border-gray-200 text-gray-700 shadow-md">
              <p>合并条件：①采购单状态：未入库采购状态；②付款状态：待申请付款状态；③同一供应商；④同一仓库；同一币种；同一库存sku为赠品：仅支持未关联第三方单号的采购单则支持待合并采购，税金类型不同不能合并。</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F8F9FA] text-gray-600 sticky top-0 z-20 shadow-[0_1px_0_rgba(229,231,235,1)]">
            <tr>
              <th className="p-3 w-12 text-center font-normal">
                <Checkbox 
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-3 font-normal border-l border-gray-200">采购单号</th>
              <th className="p-3 font-normal border-l border-gray-200">商品数量</th>
              <th className="p-3 font-normal border-l border-gray-200">重量(g)</th>
              <th className="p-3 font-normal border-l border-gray-200">实付(原币)</th>
              <th className="p-3 font-normal border-l border-gray-200">备注</th>
              <th className="p-3 font-normal border-l border-gray-200 w-24 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-400">
                  暂无符合合并条件的采购单
                </td>
              </tr>
            ) : (
              groups.map(group => {
                const groupItemIds = group.items.map(i => i.id);
                const isGroupSelected = selectedGroups.includes(group.id);

                return (
                  <React.Fragment key={group.id}>
                    {/* Group Header Row */}
                    <tr className="bg-[#F8F9FA] border-y border-gray-200">
                      <td className="p-3 text-center">
                        <Checkbox 
                          checked={isGroupSelected}
                          onCheckedChange={(c) => toggleGroupSelect(group.id, !!c, groupItemIds)}
                        />
                      </td>
                      <td colSpan={5} className="p-3 border-l border-gray-200">
                        <div className="flex items-center gap-8 text-gray-600">
                          <span>供应商：{group.supplier}</span>
                          <span>仓库：{group.warehouse}</span>
                        </div>
                      </td>
                      <td className="p-3 border-l border-gray-200 text-center">
                        <FeatureMarker title="合并" description="交互说明：点击执行合并操作。">
                        <span 
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => handleSingleGroupMerge(group.id)}
                        >
                          合并
                        </span>
                        </FeatureMarker>
                      </td>
                    </tr>

                    {/* Order Rows inside Group */}
                    {group.items.map(order => {
                      const isOrderSelected = selectedOrders.includes(order.id);
                      const isExpanded = expandedRows[order.id];
                      const itemsCount = order.items?.length || 1;
                      const totalQty = order.items?.reduce((sum: number, i: any) => sum + (i.quantity || 100), 0) || 100;
                      const totalWeight = totalQty * 250; // Mock weight
                      const actualPay = order.actualPayAmount || order.totalPrice || 1000;
                      
                      return (
                        <React.Fragment key={order.id}>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-center">
                              <Checkbox 
                                checked={isOrderSelected}
                                onCheckedChange={(c) => toggleOrderSelect(order.id, !!c, group.id, groupItemIds)}
                              />
                            </td>
                            <td className="p-3 border-l border-gray-200">
                              <div className="flex items-center gap-1 text-gray-700">
                                <FeatureMarker title="}" description="交互说明：点击执行}操作。">
                                <span 
                                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                                  onClick={() => toggleExpand(order.id)}
                                >
                                  {isExpanded ? <MinusCircle className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                                </span>
                                </FeatureMarker>
                                {order.orderNo}
                              </div>
                            </td>
                            <td className="p-3 border-l border-gray-200">{totalQty}</td>
                            <td className="p-3 border-l border-gray-200">{totalWeight.toFixed(1)}</td>
                            <td className="p-3 border-l border-gray-200">{Number(actualPay).toFixed(4)}</td>
                            <td className="p-3 border-l border-gray-200">{order.orderNote || '--'}</td>
                            <td className="p-3 border-l border-gray-200 text-center">
                              <Trash2 className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-600 mx-auto" />
                            </td>
                          </tr>

                          {/* Expanded Items Details Sub-table */}
                          {isExpanded && (
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <td></td>
                              <td colSpan={6} className="p-0">
                                <table className="w-full text-left text-gray-600 bg-white">
                                  <thead className="bg-[#F8F9FA] text-gray-500 border-y border-gray-200">
                                    <tr>
                                      <th className="p-2 w-16 text-center font-normal">缩略图</th>
                                      <th className="p-2 font-normal border-l border-gray-200">SKU编号/中文名称</th>
                                      <th className="p-2 font-normal border-l border-gray-200">采购数量</th>
                                      <th className="p-2 font-normal border-l border-gray-200">采购单价(原币)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(order.items || [{ sku: order.sku, productName: order.productName, quantity: 100, purchasePrice: 10 }]).map((item: any, idx: number) => (
                                      <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <td className="p-2 text-center">
                                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mx-auto border border-gray-200">
                                            <ImageIcon className="w-5 h-5 text-gray-400" />
                                          </div>
                                        </td>
                                        <td className="p-2 border-l border-gray-200">
                                          <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1">
                                              <span className="font-medium">{item.sku || order.sku || '--'}</span>
                                              <Copy className="w-3 h-3 text-blue-500 cursor-pointer" />
                                            </div>
                                            <div className="text-gray-500 text-xs">{item.productName || order.productName || '--'}</div>
                                          </div>
                                        </td>
                                        <td className="p-2 border-l border-gray-200">{item.quantity || 100}</td>
                                        <td className="p-2 border-l border-gray-200">{Number(item.purchasePrice || 10).toFixed(4)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Mock Footer */}
      <div className="p-3 border-t border-gray-200 flex items-center justify-end bg-white text-gray-600 gap-4 flex-shrink-0">
        <span>共 {groups.length} 页</span>
        <div className="flex items-center gap-1">
          <FeatureMarker title="&lt;" description="交互说明：点击执行&lt;操作。">
<Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled>&lt;</Button>
</FeatureMarker>
          <FeatureMarker title="1" description="交互说明：点击执行1操作。">
<Button variant="outline" size="sm" className="h-7 w-7 p-0 border-blue-500 text-blue-600 bg-blue-50">1</Button>
</FeatureMarker>
          <FeatureMarker title="&gt;" description="交互说明：点击执行&gt;操作。">
<Button variant="outline" size="sm" className="h-7 w-7 p-0">&gt;</Button>
</FeatureMarker>
        </div>
        <select className="h-7 border border-gray-300 rounded text-xs px-2 outline-none">
          <option>10条/页</option>
        </select>
        <div className="flex items-center gap-1">
          前往 <input type="text" className="w-8 h-7 border border-gray-300 rounded text-center text-xs" defaultValue="1" /> 页
        </div>
      </div>

      {/* Merge Dialog */}
      <Dialog open={!!mergeGroupsData} onOpenChange={(open) => !open && setMergeGroupsData(null)}>
        <DialogContent className="max-w-[1000px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-200">
            <DialogTitle className="flex items-center gap-4">
              <span className="text-[18px] font-bold text-gray-800">批量合并</span>
              <div className="flex items-center gap-1 text-[#E6A23C] text-[13px] font-normal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                默认将金额最大的采购单设为目标采购单
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar flex flex-col gap-6 bg-white">
            {mergeGroupsData?.map(group => {
              const totalWeight = group.items.reduce((sum: number, o: any) => {
                const qty = o.items?.reduce((s: number, i: any) => s + (i.quantity || 100), 0) || 100;
                return sum + (qty * 250);
              }, 0);
              const totalAmount = group.items.reduce((sum: number, o: any) => sum + (Number(o.actualPayAmount) || Number(o.totalPrice) || 1000), 0);
              const targetId = targetOrderIds[group.id];
              const targetOrder = group.items.find((o: any) => o.id === targetId);

              return (
                <div key={group.id} className="text-[13px] mb-2">
                  <div className="p-3 bg-white flex items-center justify-between text-[13px] px-0">
                    <div className="text-[#999]">
                      合并后的采购单号:<span className="ml-1">{targetOrder?.orderNo || '--'}</span>
                    </div>
                    <div className="text-[#999]">
                      总重量:<span className="ml-1">{totalWeight.toFixed(1)}g</span> 
                      <span className="ml-4">总金额:</span><span className="ml-1">{totalAmount.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-sm">
                    <table className="w-full text-left">
                      <thead className="bg-[#F8F9FA] border-b border-gray-200 text-gray-500">
                        <tr>
                          <th className="p-3 font-normal border-r border-gray-100">采购单号</th>
                          <th className="p-3 font-normal border-r border-gray-100">商品数量</th>
                          <th className="p-3 font-normal border-r border-gray-100">重量(g)</th>
                          <th className="p-3 font-normal border-r border-gray-100">采购金额(RMB)</th>
                          <th className="p-3 font-normal border-r border-gray-100 text-center">设为目标</th>
                          <th className="p-3 font-normal text-center">取消合并</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.items.map((order: any) => {
                          const totalQty = order.items?.reduce((sum: number, i: any) => sum + (i.quantity || 100), 0) || 100;
                          const weight = totalQty * 250;
                          const amount = Number(order.actualPayAmount) || Number(order.totalPrice) || 1000;

                          return (
                            <tr key={order.id} className="hover:bg-gray-50 bg-white">
                              <td className="p-3 border-r border-gray-100 text-gray-800">{order.orderNo}</td>
                              <td className="p-3 border-r border-gray-100">{totalQty}</td>
                              <td className="p-3 border-r border-gray-100">{weight.toFixed(1)}</td>
                              <td className="p-3 border-r border-gray-100">{amount.toFixed(4)}</td>
                              <td className="p-3 border-r border-gray-100 text-center">
                                <input 
                                  type="radio" 
                                  name={`target_${group.id}`} 
                                  checked={targetId === order.id}
                                  onChange={() => setTargetOrderIds(prev => ({ ...prev, [group.id]: order.id }))}
                                  className="cursor-pointer accent-[#E6A23C] w-4 h-4"
                                />
                              </td>
                              <td className="p-3 text-center">
                                <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
                                <span 
                                  className="text-red-500 cursor-pointer hover:underline"
                                  onClick={() => removeOrderFromMerge(group.id, order.id)}
                                >
                                  取消
                                </span>
                                </FeatureMarker>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50/50">
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="bg-white h-8 px-6 text-gray-600 rounded-sm" onClick={() => setMergeGroupsData(null)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确定合并" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 px-6 bg-[#E6A23C] hover:bg-[#D39236] text-white rounded-sm" onClick={confirmMerge}>确定合并</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
