import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TrackingTableProps {
  filterValues: any;
}

export default function TrackingTable({ filterValues }: TrackingTableProps) {
  const [globalOrders] = useLocalStorage<any[]>('purchase_orders_data_v11', []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Flatten orders into item-level tracking rows
  let trackingItems = globalOrders.flatMap(order => {
    // Basic status filter - only tracking active orders
    if (!['新订单（待审核）', '新订单', '采购中', '部分到货'].includes(order.status)) return [];

    const items = order.items && order.items.length > 0 
      ? order.items 
      : [{
          id: '1',
          sku: order.sku,
          name: order.productName,
          image: order.productImage,
          quantity: order.productCount || order.totalPurchaseQty || 0,
          receivedQty: order.receivedCount || 0,
        }];

    return items.map((item: any, idx: number) => {
      const purchaseQty = Number(item.quantity) || 0;
      const receivedQty = Number(item.receivedQty) || 0;
      const inTransitQty = Math.max(0, purchaseQty - receivedQty);
      
      // If no items are in transit, skip
      if (inTransitQty <= 0) return null;

      // Deterministic mocks based on order ID for UI consistency
      const mockShortage = (parseInt(order.id) % 5) + 1 || 1;
      const mockPaymentTime = order.orderTime ? order.orderTime.replace('18:21', '22:06') : '2026-04-22 22:06:55';
      const qcStatus = '待质检';

      return {
        id: `${order.id}-${idx}`,
        orderId: order.id,
        image: item.image || item.productImage || 'https://via.placeholder.com/40',
        sku: item.sku || order.sku || '--',
        name: item.name || order.productName || '--',
        warehouse: order.warehouse || '东莞厚街仓',
        shortageQty: mockShortage,
        inTransitQty: inTransitQty,
        earliestPaymentTime: mockPaymentTime,
        orderNo: order.orderNo,
        status: order.status,
        qcStatus: qcStatus,
        pendingArrivalQty: inTransitQty,
        supplier: order.supplierName || '厦门蔚来视野网络科技有限公司',
        creator: order.orderCreator || order.buyer || 'Yanny',
        createTime: order.orderTime || order.createTime || '2026-04-24 18:21:32'
      };
    }).filter(Boolean);
  });

  // Apply Filters
  if (filterValues) {
    if (filterValues.warehouse) {
      trackingItems = trackingItems.filter(i => i?.warehouse === filterValues.warehouse);
    }
    if (filterValues.qcStatus && filterValues.qcStatus !== '全部') {
      trackingItems = trackingItems.filter(i => i?.qcStatus === filterValues.qcStatus);
    }
    if (filterValues.supplier) {
      trackingItems = trackingItems.filter(i => i?.supplier.includes(filterValues.supplier));
    }
    if (filterValues.searchKeyword) {
      const kw = filterValues.searchKeyword.toLowerCase();
      trackingItems = trackingItems.filter(i => 
        i?.sku.toLowerCase().includes(kw) || 
        i?.name.toLowerCase().includes(kw) || 
        i?.orderNo.toLowerCase().includes(kw) || 
        i?.creator.toLowerCase().includes(kw)
      );
    }
    if (filterValues.startDate) {
      trackingItems = trackingItems.filter(i => i && i.createTime >= filterValues.startDate);
    }
    if (filterValues.endDate) {
      trackingItems = trackingItems.filter(i => i && i.createTime <= filterValues.endDate + ' 23:59:59');
    }
  }

  // Sort descending by create time
  trackingItems.sort((a, b) => {
    if (!a || !b) return 0;
    return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-[12px] text-left border-collapse table-fixed min-w-[1200px]">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
            <tr className="text-gray-600">
              <th className="p-3 w-10 text-center font-normal border-r border-gray-100">
                <Checkbox 
                  checked={trackingItems.length > 0 && selectedIds.length === trackingItems.length}
                  onCheckedChange={(c) => {
                    if (c) {
                      setSelectedIds(trackingItems.map(i => i!.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </th>
              <th className="p-3 font-normal w-12 text-center border-r border-gray-100">序号</th>
              <th className="p-3 font-normal w-[300px] border-r border-gray-100">商品信息</th>
              <th className="p-3 font-normal w-32 border-r border-gray-100">收货仓库</th>
              <th className="p-3 font-normal w-28 text-center border-r border-gray-100">订单缺货件数</th>
              <th className="p-3 font-normal w-20 text-center border-r border-gray-100">在途量</th>
              <th className="p-3 font-normal w-40 text-center border-r border-gray-100">订单最早付款时间</th>
              <th className="p-3 font-normal w-32 border-r border-gray-100">采购单号</th>
              <th className="p-3 font-normal w-24 text-center border-r border-gray-100">采购单状态</th>
              <th className="p-3 font-normal w-24 text-center border-r border-gray-100">质检状态</th>
              <th className="p-3 font-normal w-20 text-center border-r border-gray-100">待到货</th>
              <th className="p-3 font-normal w-48 border-r border-gray-100">供应商</th>
              <th className="p-3 font-normal w-24 text-center border-r border-gray-100">下单员</th>
              <th className="p-3 font-normal w-40 text-center">下单时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trackingItems.map((item, index) => {
              if (!item) return null;
              return (
                <tr key={item.id} className="hover:bg-blue-50/30">
                  <td className="p-3 text-center align-middle border-r border-gray-100">
                    <Checkbox 
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={(c) => {
                        if (c) {
                          setSelectedIds(prev => [...prev, item.id]);
                        } else {
                          setSelectedIds(prev => prev.filter(id => id !== item.id));
                        }
                      }}
                    />
                  </td>
                  <td className="p-3 align-middle text-center text-gray-500 border-r border-gray-100">{index + 1}</td>
                  <td className="p-3 align-middle border-r border-gray-100">
                    <div className="flex items-start gap-3">
                      <img src={item.image} alt="thumb" className="w-12 h-12 object-cover border border-gray-200 rounded shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <div className="text-blue-500 font-medium hover:underline cursor-pointer flex items-center gap-1 mb-1">
                          {item.sku}
                          <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500" />
                        </div>
                        <div className="text-gray-500 text-[12px] line-clamp-2 leading-relaxed" title={item.name}>
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-middle text-gray-800 border-r border-gray-100">{item.warehouse}</td>
                  <td className="p-3 align-middle text-center text-gray-800 border-r border-gray-100">{item.shortageQty}</td>
                  <td className="p-3 align-middle text-center text-gray-800 border-r border-gray-100">{item.inTransitQty}</td>
                  <td className="p-3 align-middle text-center text-gray-600 border-r border-gray-100">{item.earliestPaymentTime}</td>
                  <td className="p-3 align-middle text-gray-800 border-r border-gray-100">{item.orderNo}</td>
                  <td className="p-3 align-middle text-center text-gray-800 border-r border-gray-100">{item.status}</td>
                  <td className="p-3 align-middle text-center text-gray-800 border-r border-gray-100">{item.qcStatus}</td>
                  <td className="p-3 align-middle text-center text-gray-800 border-r border-gray-100">{item.pendingArrivalQty}</td>
                  <td className="p-3 align-middle text-gray-800 border-r border-gray-100">{item.supplier}</td>
                  <td className="p-3 align-middle text-center text-gray-800 border-r border-gray-100">{item.creator}</td>
                  <td className="p-3 align-middle text-center text-gray-600">{item.createTime}</td>
                </tr>
              );
            })}
            {trackingItems.length === 0 && (
              <tr>
                <td colSpan={14} className="p-8 text-center text-gray-400">
                  暂无符合条件的采购跟单数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-3 border-t border-gray-200 text-[12px] text-gray-600 bg-white">
        <div>共 {trackingItems.length} 条</div>
        <div className="flex items-center gap-2">
          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-gray-400">
            <ChevronLeft className="w-4 h-4" />
          </button>
          </FeatureMarker>
          <div className="flex items-center gap-1">
            <FeatureMarker title="1" description="交互说明：点击执行1操作。">
<button className="w-6 h-6 flex items-center justify-center border border-[#6B8EBE] bg-blue-50 text-[#6B8EBE] rounded">1</button>
</FeatureMarker>
            <FeatureMarker title="2" description="交互说明：点击执行2操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-50 rounded">2</button>
</FeatureMarker>
            <FeatureMarker title="3" description="交互说明：点击执行3操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-50 rounded">3</button>
</FeatureMarker>
            <span>...</span>
            <FeatureMarker title="122" description="交互说明：点击执行122操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-50 rounded">122</button>
</FeatureMarker>
          </div>
          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
            <ChevronRight className="w-4 h-4" />
          </button>
          </FeatureMarker>
          
          <select className="ml-2 border border-gray-300 rounded outline-none h-6 px-1">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
          
          <div className="ml-2 flex items-center gap-1">
            前往 <input type="text" className="w-10 h-6 border border-gray-300 rounded text-center outline-none" defaultValue="1" /> 页
          </div>
        </div>
      </div>
    </div>
  );
}
