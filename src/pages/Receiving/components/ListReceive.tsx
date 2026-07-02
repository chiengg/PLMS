import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Search, Info, Edit2, Copy, Home, Pen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import InspectReceiveModal from './InspectReceiveModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function ListReceive() {
  const [globalOrders, setGlobalOrders] = useLocalStorage<any[]>('purchase_orders_data_v11', []);
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeStatus, setActiveStatus] = useState('采购中');
  const [warehouse, setWarehouse] = useState('全部');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [hideCompleteProducts, setHideCompleteProducts] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const [inspectOrder, setInspectOrder] = useState<any>(null);
  
  // Modals state
  const [editingLogistics, setEditingLogistics] = useState<{ id: string, trackingNo: string } | null>(null);
  const [editingNote, setEditingNote] = useState<{ id: string, note: string } | null>(null);
  const [viewingLogs, setViewingLogs] = useState<{ id: string } | null>(null);

  // Group counts by status
  const counts = {
    '全部': 0,
    '采购中': 0,
    '部分到货': 0,
    '异常': 0,
    '已入库': 0
  };

  globalOrders.forEach(o => {
    if (['采购中', '部分到货', '异常', '已完成'].includes(o.status)) {
      counts['全部']++;
      if (o.status === '采购中') counts['采购中']++;
      if (o.status === '部分到货') counts['部分到货']++;
      if (o.status === '异常') counts['异常']++;
      if (o.status === '已完成') counts['已入库']++;
    }
  });

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA]">
      {/* Search Filters */}
      <div className="bg-white p-4 border-b border-gray-200 flex-shrink-0 text-[12px] flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium text-gray-800">搜索内容：</span>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="stype" defaultChecked /> 物流单号</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="stype" /> 采购/自定义单号</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="stype" /> 库存SKU</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="stype" /> 原厂SKU</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="stype" /> 主SKU</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="stype" /> 商品名称</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="stype" /> 下单员</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="stype" /> 采购员</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="stype" /> 签收人</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="stype" /> 订单备注</label>
          </div>
          <div className="flex items-center gap-2">
            <Input 
              className="h-8 w-64 text-[12px]" 
              placeholder="双击可批量搜索" 
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
            />
            <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
<Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 text-[12px]"><Search className="w-3.5 h-3.5 mr-1"/> 搜索</Button>
</FeatureMarker>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-800 w-16 text-right">状态：</span>
          <div className="flex items-center gap-4">
            {['全部', '采购中', '部分到货', '异常', '已入库'].map(status => (
                <FeatureMarker key={status} title={status} description={`交互说明：点击切换至${status}状态。`}>
                  <span
                    className={`cursor-pointer hover:text-blue-600 ${activeStatus === status ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                    onClick={() => setActiveStatus(status)}
                  >
                    {status} {counts[status as keyof typeof counts] > 0 && <span className="bg-teal-100 text-teal-600 px-1.5 py-0.5 rounded-full text-[10px] ml-1">{counts[status as keyof typeof counts]}</span>}
                  </span>
                </FeatureMarker>
              ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-800 w-16 text-right">仓库：</span>
          <div className="flex items-center gap-4 text-gray-600">
            <FeatureMarker title="全部" description="交互说明：点击执行全部操作。">
<span className={`cursor-pointer hover:text-blue-600 ${warehouse === '全部' ? 'text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded' : ''}`} onClick={() => setWarehouse('全部')}>全部</span>
</FeatureMarker>
            <FeatureMarker title="原材料 (耗材) 仓库" description="交互说明：点击执行原材料 (耗材) 仓库操作。">
<span className={`cursor-pointer hover:text-blue-600 ${warehouse === '原材料仓' ? 'text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded' : ''}`} onClick={() => setWarehouse('原材料仓')}>原材料 (耗材) 仓库</span>
</FeatureMarker>
            <FeatureMarker title="海外仓" description="交互说明：点击执行海外仓操作。">
<span className={`cursor-pointer hover:text-blue-600 ${warehouse === '海外仓' ? 'text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded' : ''}`} onClick={() => setWarehouse('海外仓')}>海外仓</span>
</FeatureMarker>
            <FeatureMarker title="东莞厚街仓" description="交互说明：点击执行东莞厚街仓操作。">
<span className={`cursor-pointer hover:text-blue-600 ${warehouse === '东莞厚街仓' ? 'text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded' : ''}`} onClick={() => setWarehouse('东莞厚街仓')}>东莞厚街仓</span>
</FeatureMarker>
            <span className="text-blue-500 cursor-pointer">更多 ▾</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-800 w-16 text-right">时间段：</span>
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 px-3 py-1.5 rounded text-gray-600">入库时间</span>
            <Input type="date" className="h-8 w-36 text-[12px]" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span className="text-gray-400">至</span>
            <Input type="date" className="h-8 w-36 text-[12px]" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
<Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[12px]"><Search className="w-3.5 h-3.5 mr-1"/> 搜索</Button>
</FeatureMarker>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-800 w-16 text-right">供应商：</span>
          <Input 
            className="h-8 w-64 text-[12px]" 
            placeholder="请输入供应商关键字" 
            value={supplier}
            onChange={e => setSupplier(e.target.value)}
          />
        </div>
      </div>

      {/* Batch Operations */}
      <div className="bg-[#EBF5FF] p-2 border-b border-blue-200 flex-shrink-0 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2">
          <FeatureMarker title="批量操作 ▾" description="交互说明：点击执行批量操作 ▾操作。">
          <Button className="h-7 bg-blue-500 hover:bg-blue-600 text-white px-3 text-[12px]">
            批量操作 ▾
          </Button>
          </FeatureMarker>
          <FeatureMarker title="批量入库" description="交互说明：点击执行批量入库操作。">
          <Button variant="outline" className="h-7 text-blue-600 border-blue-200 bg-white hover:bg-blue-50 px-3 text-[12px]">
            批量入库
          </Button>
          </FeatureMarker>
          <FeatureMarker title="批量打印SKU标签" description="交互说明：点击执行批量打印SKU标签操作。">
          <Button variant="outline" className="h-7 text-blue-600 border-blue-200 bg-white hover:bg-blue-50 px-3 text-[12px]">
            批量打印SKU标签
          </Button>
          </FeatureMarker>
          <FeatureMarker title="批量打印入库单" description="交互说明：点击执行批量打印入库单操作。">
          <Button variant="outline" className="h-7 text-blue-600 border-blue-200 bg-white hover:bg-blue-50 px-3 text-[12px]">
            批量打印入库单
          </Button>
          </FeatureMarker>
          <FeatureMarker title="缺货订单" description="交互说明：点击执行缺货订单操作。">
          <Button variant="outline" className="h-7 text-blue-600 border-blue-200 bg-white hover:bg-blue-50 px-3 text-[12px]">
            缺货订单
          </Button>
          </FeatureMarker>
          <label className="flex items-center gap-1.5 ml-4 cursor-pointer text-gray-700">
            <Checkbox 
              checked={hideCompleteProducts} 
              onCheckedChange={(c) => setHideCompleteProducts(!!c)} 
            />
            只显示未到齐商品 <span className="text-red-500">(入库量小于采购量)</span>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white p-4">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead className="bg-[#F5F7FA] border border-gray-200 text-gray-600">
            <tr>
              <th className="p-2 w-10 text-center font-normal"><Checkbox /></th>
              <th className="p-2 font-normal text-left min-w-[160px]">单据/供应商</th>
              <th className="p-2 font-normal text-center w-24">状态</th>
              <th className="p-2 font-normal text-center w-36">数量/金额明细</th>
              <th className="p-2 font-normal text-center w-32">仓储/物流</th>
              <th className="p-2 font-normal text-center w-32">时间信息</th>
              <th className="p-2 font-normal text-center w-24">人员/分类</th>
              <th className="p-2 font-normal text-center w-20">操作</th>
            </tr>
          </thead>
          <tbody>
            {globalOrders
              .filter(o => {
                if (['采购中', '部分到货', '异常', '已完成'].includes(o.status)) {
                  if (activeStatus !== '全部') {
                    if (activeStatus === '已入库' && o.status !== '已完成') return false;
                    if (activeStatus !== '已入库' && o.status !== activeStatus) return false;
                  }
                  if (startDate && o.orderTime && o.orderTime < startDate) return false;
                  if (endDate && o.orderTime && o.orderTime > endDate + ' 23:59:59') return false;
                  if (searchKeyword && !o.orderNo.includes(searchKeyword) && !o.customOrderNo?.includes(searchKeyword) && !o.trackingNo?.includes(searchKeyword) && !o.sku?.includes(searchKeyword) && !o.productName?.includes(searchKeyword)) return false;
                  if (supplier && !o.supplierName?.includes(supplier)) return false;
                  if (warehouse !== '全部' && o.warehouse !== warehouse) return false;
                  return true;
                }
                return false;
              })
              .map(order => {
                // Filter items if hideCompleteProducts is checked
                const orderItems = Array.isArray(order.items) && order.items.length > 0 
                  ? order.items 
                  : [{
                      id: '1',
                      sku: order.sku,
                      name: order.productName,
                      image: order.productImage,
                      quantity: order.productCount || order.totalPurchaseQty || 0,
                      receivedQty: order.receivedCount || 0,
                      price: order.actualPayAmount ? (order.actualPayAmount / (order.totalPurchaseQty || 1)).toFixed(2) : '0.00',
                      amount: order.actualPayAmount || '0.00'
                    }];

                const filteredItems = hideCompleteProducts 
                  ? orderItems.filter(item => (Number(item.receivedQty) || 0) < (Number(item.quantity) || 0))
                  : orderItems;

                if (filteredItems.length === 0) return null;

                const isExpanded = expandedRows[order.id] !== false; // Default expanded

                return (
                  <React.Fragment key={order.id}>
                    {/* Master Row: Order Info */}
                    <tr className="bg-[#F8FAFC] border border-gray-200 mt-4 block table-row hover:bg-blue-50/20 transition-colors">
                      <td className="p-2 text-center border-r border-gray-200 w-10 align-middle">
                        <Checkbox />
                        <div 
                          className="mt-2 text-gray-400 cursor-pointer hover:text-blue-600 text-[10px]" 
                          onClick={() => toggleExpand(order.id)}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </div>
                      </td>
                      <td className="p-2 border-r border-gray-200 leading-relaxed">
                        <div className="font-medium text-blue-600 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                          {order.orderNo}
                        </div>
                        <div className="text-gray-500">【自定义单号: {order.customOrderNo || '暂无'}】</div>
                        <div className="text-gray-500">【供应商: <span className="text-blue-600 underline cursor-pointer">{order.supplierName || '--'}</span>】</div>
                      </td>
                      <td className="p-2 border-r border-gray-200 text-center leading-relaxed">
                        <div className="text-gray-800">{order.paymentStatus || '待申请付款'}</div>
                        <div className="text-gray-500 mt-1">[{order.status}]</div>
                      </td>
                      <td className="p-2 border-r border-gray-200 text-center leading-relaxed">
                        <div className="text-gray-800">采购总数: <span className="font-medium">{order.productCount || order.totalPurchaseQty || 0}</span></div>
                        <div className="text-gray-800">采购金额: <span className="font-medium text-orange-500">¥{order.totalAmount || order.actualPayAmount || '0.00'}</span></div>
                        <div className="text-gray-500 mt-1">实付/运/税/折: 0/0/0/0</div>
                      </td>
                      <td className="p-2 border-r border-gray-200 text-center leading-relaxed">
                        <div className="text-gray-800 flex items-center justify-center"><Home className="w-3 h-3 mr-1" /> {order.warehouse || '默认仓库'}</div>
                        <div 
                          className="text-blue-600 mt-1 cursor-pointer flex items-center justify-center gap-1 hover:underline"
                          onClick={() => setEditingLogistics({ id: order.id, trackingNo: order.trackingNo || '' })}
                        >
                          [{order.trackingNo || '--'}] <Edit2 className="w-3 h-3"/>
                        </div>
                      </td>
                      <td className="p-2 border-r border-gray-200 text-center text-gray-500 leading-relaxed">
                        <div>下单: {order.orderTime || '--'}</div>
                        <div>审核: {order.auditTime || '--'}</div>
                        <div className="text-red-500 mt-1">预计: 还剩1天23时52分</div>
                      </td>
                      <td className="p-2 border-r border-gray-200 text-center text-gray-600 leading-relaxed">
                        <div>下单: {order.orderCreator || '--'}</div>
                        <div>采购: {order.buyer || '--'}</div>
                        <div 
                          className="text-blue-500 cursor-pointer hover:underline mt-1"
                          onClick={() => setEditingNote({ id: order.id, note: order.orderNote || '' })}
                        >
                          【订单备注】
                        </div>
                      </td>
                      <td className="p-2 text-center align-middle">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <FeatureMarker title="验货入库" description="交互说明：点击执行验货入库操作。">
                          <span 
                            className="text-blue-600 cursor-pointer hover:underline whitespace-nowrap"
                            onClick={() => setInspectOrder(order)}
                          >
                            验货入库
                          </span>
                          </FeatureMarker>
                          <FeatureMarker title="操作日志" description="交互说明：点击执行操作日志操作。">
                          <span 
                            className="text-gray-500 cursor-pointer hover:underline whitespace-nowrap"
                            onClick={() => setViewingLogs({ id: order.id })}
                          >
                            操作日志
                          </span>
                          </FeatureMarker>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Detail Row: Product Items */}
                    {isExpanded && (
                      <tr className="border-x border-b border-gray-200 bg-[#F8FAFC]">
                        <td></td>
                        <td colSpan={7} className="p-4">
                          <div className="border border-gray-200 rounded overflow-hidden">
                            <table className="w-full bg-[#F8FAFC] text-[12px] text-left">
                              <thead className="bg-[#F5F7FA] text-gray-600 border-b border-gray-200">
                                <tr>
                                  <th className="p-2 font-normal text-center w-16">缩略图</th>
                                  <th className="p-2 font-normal">SKU / 商品名称 / 链接</th>
                                  <th className="p-2 font-normal text-center w-24">采购数量</th>
                                  <th className="p-2 font-normal text-center w-24">采购单价</th>
                                  <th className="p-2 font-normal text-center w-24">采购金额</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredItems.map((item, idx) => {
                                  const qty = Number(item.quantity) || 0;
                                  const price = Number(item.price) || 0;
                                  const amount = (qty * price).toFixed(2);

                                  return (
                                  <tr key={item.id || idx} className="border-b last:border-b-0 border-gray-200 hover:bg-blue-50/50">
                                    <td className="p-2 text-center align-middle">
                                      <img src={item.image || item.productImage || 'https://via.placeholder.com/40'} alt="img" className="w-10 h-10 object-cover border border-gray-200 rounded mx-auto" />
                                    </td>
                                    <td className="p-2 leading-relaxed">
                                      <div className="font-medium text-gray-800">{item.sku || order.sku || '--'}</div>
                                      <div className="text-gray-500 mt-1">{item.name || order.productName || '--'}</div>
                                      <div className="text-blue-500 mt-1 cursor-pointer flex items-center gap-1 w-fit hover:underline">
                                        <span className="border border-blue-200 rounded px-1 text-[10px] bg-blue-50 no-underline">1688</span> 商品链接
                                      </div>
                                    </td>
                                    <td className="p-2 text-center">
                                      <span className={Number(item.receivedQty) < Number(item.quantity) ? 'text-red-500 font-medium' : 'text-gray-800 font-medium'}>
                                        {qty}
                                      </span>
                                    </td>
                                    <td className="p-2 text-center font-medium text-gray-600">
                                      ¥{price.toFixed(2)}
                                    </td>
                                    <td className="p-2 text-center font-bold text-orange-500">
                                      ¥{amount}
                                    </td>
                                  </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                    {/* Add spacing between orders */}
                    <tr className="h-4 bg-transparent border-0"></tr>
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Inspect Receive Modal */}
      <InspectReceiveModal 
        open={!!inspectOrder}
        onOpenChange={(open) => !open && setInspectOrder(null)}
        order={inspectOrder}
        onSuccess={() => {
          // Re-render list handled automatically by useLocalStorage updates to globalOrders
          setInspectOrder(null);
        }}
      />

      {/* Edit Logistics Modal */}
      <Dialog open={!!editingLogistics} onOpenChange={(open) => !open && setEditingLogistics(null)}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[14px] font-normal text-gray-800">编辑物流单号</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-[12px] w-16 text-right">物流单号:</span>
              <Input 
                className="flex-1 h-8 text-[12px]" 
                value={editingLogistics?.trackingNo || ''}
                onChange={(e) => setEditingLogistics(prev => prev ? { ...prev, trackingNo: e.target.value } : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px]" onClick={() => setEditingLogistics(null)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="保存" description="交互说明：校验表单数据并提交保存。">
            <Button className="h-8 text-[13px] bg-blue-600" onClick={() => {
              if (editingLogistics) {
                setGlobalOrders(prev => prev.map(o => o.id === editingLogistics.id ? { ...o, trackingNo: editingLogistics.trackingNo } : o));
                setEditingLogistics(null);
              }
            }}>保存</Button>
            </FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Modal */}
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[14px] font-normal text-gray-800">编辑订单备注</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <textarea 
              className="w-full h-32 border border-gray-300 rounded p-2 text-[12px] outline-none resize-none"
              value={editingNote?.note || ''}
              onChange={(e) => setEditingNote(prev => prev ? { ...prev, note: e.target.value } : null)}
              placeholder="请输入订单备注..."
            />
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px]" onClick={() => setEditingNote(null)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="保存" description="交互说明：校验表单数据并提交保存。">
            <Button className="h-8 text-[13px] bg-blue-600" onClick={() => {
              if (editingNote) {
                setGlobalOrders(prev => prev.map(o => o.id === editingNote.id ? { ...o, orderNote: editingNote.note } : o));
                setEditingNote(null);
              }
            }}>保存</Button>
            </FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Operation Logs Modal */}
      <Dialog open={!!viewingLogs} onOpenChange={(open) => !open && setViewingLogs(null)}>
        <DialogContent className="max-w-[800px] h-[600px] flex flex-col p-0 overflow-hidden bg-white">
          <DialogHeader className="p-4 border-b border-gray-100 bg-[#F5F7FA] flex-shrink-0">
            <DialogTitle className="text-[14px] font-normal text-gray-800">操作日志</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4 text-[12px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F5F7FA] text-gray-600">
                <tr>
                  <th className="p-2 font-normal">操作人</th>
                  <th className="p-2 font-normal">操作时间</th>
                  <th className="p-2 font-normal">操作内容</th>
                  <th className="p-2 font-normal">操作IP</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2 text-gray-800">系统管理员</td>
                  <td className="p-2 text-gray-600">2026-03-24 16:14:32</td>
                  <td className="p-2 text-gray-600">创建了采购单</td>
                  <td className="p-2 text-gray-500">127.0.0.1</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2 text-gray-800">系统管理员</td>
                  <td className="p-2 text-gray-600">2026-03-24 16:15:10</td>
                  <td className="p-2 text-gray-600">提交了采购单</td>
                  <td className="p-2 text-gray-500">127.0.0.1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <DialogFooter className="p-4 border-t border-gray-100 bg-[#F5F7FA] flex-shrink-0 m-0 rounded-none sm:justify-end">
            <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white" onClick={() => setViewingLogs(null)}>关闭</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
