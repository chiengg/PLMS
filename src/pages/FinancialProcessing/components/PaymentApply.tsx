import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Search, ChevronDown, Download, AlertTriangle, X, HelpCircle, Copy, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

export default function PaymentApply() {
  const [searchType, setSearchType] = useState('采购单号');
  const [status, setStatus] = useState('待申请付款');
  const [orderStatus, setOrderStatus] = useState('全部');
  const [orderType, setOrderType] = useState('全部');
  const [settlement, setSettlement] = useState('全部');
  
  const [orders, setOrders] = useState([
    {
      id: '1',
      orderNo: '1570554087',
      customOrderNo: '【暂无】',
      supplierName: '义乌市程睿贸易有限公司',
      totalPrice: '120.00',
      platformPrice: '1688: 120.00 RMB',
      fees: '5 / 0 / 0 RMB',
      paymentStatus: '待申请',
      orderStatus: '采购中',
      orderTime: '2026-04-24',
      buyer: 'Yanny',
      orderNote: '急需发货',
      productTypesCount: 1,
      totalProductsCount: 10
    },
    {
      id: '2',
      orderNo: '1570554077',
      customOrderNo: '【暂无】',
      supplierName: '佛山市南海大步标达袜业织造厂',
      totalPrice: '62.50',
      platformPrice: '1688: 62.50 RMB',
      fees: '0 / 0 / 0 RMB',
      paymentStatus: '待申请',
      orderStatus: '采购中',
      orderTime: '2026-04-24',
      buyer: 'Yanny',
      orderNote: '',
      productTypesCount: 3,
      totalProductsCount: 45
    }
  ]);

  const [productDetailsOpen, setProductDetailsOpen] = useState(false);
  const [productDetailsOrder, setProductDetailsOrder] = useState<any>(null);
  const [paymentApplyOrderId, setPaymentApplyOrderId] = useState<string | null>(null);
  const [paymentApplyRows, setPaymentApplyRows] = useState<any[]>([]);
  const [paymentApplyAmount, setPaymentApplyAmount] = useState<string>('0.00');
  const [paymentApplyIsPaid, setPaymentApplyIsPaid] = useState<boolean>(false);

  const openProductDetails = (order: any) => {
    setProductDetailsOrder(order);
    setProductDetailsOpen(true);
  };
  const openPaymentApply = (orderId: string, amount: string) => {
    setPaymentApplyOrderId(orderId);
    setPaymentApplyAmount(amount);
    setPaymentApplyRows([{ id: Date.now(), amount, date: '', note: '' }]);
    setPaymentApplyIsPaid(false);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0 text-[13px] space-y-4">
        {/* Row 1 */}
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium w-16 text-right">搜索内容:</span>
          <div className="flex items-center gap-4">
            {['采购单号', '自定义单号', '下单员', '下单时间'].map(opt => (
              <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="searchType" 
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" 
                  checked={searchType === opt}
                  onChange={() => setSearchType(opt)}
                />
                <span className="text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
          <Input 
            className="w-64 h-8 text-[12px] ml-2" 
            placeholder="双击可批量查询" 
          />
          <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6">
            <Search className="w-3.5 h-3.5 mr-1.5" /> 搜索
          </Button>
          </FeatureMarker>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {/* Row 2 */}
          <div className="flex items-center">
            <span className="text-gray-700 font-medium w-16 text-right mr-4 flex-shrink-0">状态:</span>
            <div className="flex items-center gap-3">
              {['待申请付款', '审核不通过', '已申请付款', '部分付款', '等待还款', '已完成付款'].map(opt => (
                <FeatureMarker title="{opt}" description="交互说明：点击执行{opt}操作。">
                <span 
                  key={opt} 
                  className={`cursor-pointer px-2 py-1 rounded ${status === opt ? 'text-blue-600 border border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'}`}
                  onClick={() => setStatus(opt)}
                >
                  {opt}
                </span>
                </FeatureMarker>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-700 font-medium w-24 text-right mr-4 flex-shrink-0">采购单状态:</span>
            <div className="flex items-center gap-3">
              {['全部', '采购中', '部分到货', '已完成'].map(opt => (
                <FeatureMarker title="{opt}" description="交互说明：点击执行{opt}操作。">
                <span 
                  key={opt} 
                  className={`cursor-pointer px-2 py-1 rounded ${orderStatus === opt ? 'text-blue-600 border border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'}`}
                  onClick={() => setOrderStatus(opt)}
                >
                  {opt}
                </span>
                </FeatureMarker>
              ))}
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-center">
            <span className="text-gray-700 font-medium w-16 text-right mr-4 flex-shrink-0">类型:</span>
            <div className="flex items-center gap-3">
              {['全部', '1688采购', '拼多多', '淘宝', '普通采购'].map(opt => (
                <FeatureMarker title="{opt}" description="交互说明：点击执行{opt}操作。">
                <span 
                  key={opt} 
                  className={`cursor-pointer px-2 py-1 rounded ${orderType === opt ? 'text-blue-600 border border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'}`}
                  onClick={() => setOrderType(opt)}
                >
                  {opt}
                </span>
                </FeatureMarker>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-gray-700 font-medium w-24 text-right mr-4 flex-shrink-0">结款方式:</span>
            <div className="flex items-center gap-3">
              {['全部', '到付', '分期付款', '现付', '周结', '月结'].map(opt => (
                <FeatureMarker title="{opt}" description="交互说明：点击执行{opt}操作。">
                <span 
                  key={opt} 
                  className={`cursor-pointer px-2 py-1 rounded ${settlement === opt ? 'text-blue-600 border border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'}`}
                  onClick={() => setSettlement(opt)}
                >
                  {opt}
                </span>
                </FeatureMarker>
              ))}
              <span className="text-blue-600 cursor-pointer flex items-center">
                更多 <ChevronDown className="w-3 h-3 ml-0.5" />
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 cursor-pointer flex items-center hover:text-blue-600">
                <span className="mr-1">⚙️</span>设置付款方式
              </span>
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex items-center col-span-2">
            <span className="text-gray-700 font-medium w-16 text-right mr-4 flex-shrink-0">供应商:</span>
            <Input className="w-64 h-8 text-[12px]" placeholder="请输入供应商关键字" />
            
            <div className="flex items-center ml-6 text-[12px]">
              <AlertTriangle className="w-4 h-4 text-orange-500 mr-1.5" />
              <span className="text-orange-500 font-medium">1688订单金额和采购金额相同才能申请付款！</span>
              <span className="text-gray-600 ml-1">您当前有 <span className="text-red-500 font-bold">29</span> 个对账异常采购单</span>
              <span className="text-blue-600 underline cursor-pointer ml-1">立即处理</span>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Operations */}
      <div className="p-3 border-b border-gray-200 bg-[#F8FAFC] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-[13px] text-white">
            批量处理功能 <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
          </FeatureMarker>
          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-700">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            仅查看自己创建的采购单
          </label>
        </div>
        <FeatureMarker title="导出" description="交互说明：点击将当前列表数据导出为Excel文件。">
        <Button variant="outline" className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white border-0 text-[13px]">
          <Download className="w-3.5 h-3.5 mr-1.5" /> 导出
        </Button>
        </FeatureMarker>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-[12px] text-left border-collapse">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200 shadow-sm">
            <tr className="text-gray-600">
              <th className="p-3 w-10 text-center font-normal border-r border-gray-200"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="p-3 font-normal border-r border-gray-200 text-center flex-1">
                采购单号<br />自定义单号
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center flex-1">供应商</th>
              <th className="p-3 font-normal border-r border-gray-200 text-center flex-1">采购金额<br />平台金额</th>
              <th className="p-3 font-normal border-r border-gray-200 text-center flex-1">运费/税金/折扣</th>
              <th className="p-3 font-normal border-r border-gray-200 text-center flex-1">
                付款状态<br />采购单状态
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center flex-1">
                下单时间<br />下单员
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center flex-1">商品信息</th>
              <th className="p-3 font-normal text-center w-20">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="p-3 text-center border-r border-gray-200 align-middle"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-800">{order.orderNo}</div>
                  <div className="text-gray-500 mt-1">{order.customOrderNo}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-600">{order.supplierName}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-600"><span className="font-bold text-gray-800">{order.totalPrice} RMB</span></div>
                  <div className="text-red-500 mt-1 flex items-center justify-center gap-1">{order.platformPrice}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-500">{order.fees}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-blue-600 cursor-pointer hover:underline">{order.paymentStatus}</div>
                  <div className="text-blue-600 cursor-pointer hover:underline mt-1">{order.orderStatus}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-600">{order.orderTime}</div>
                  <div className="text-gray-600 mt-1">{order.buyer}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-600 text-[12px] flex flex-col gap-0.5">
                    <div>种类：{order.productTypesCount} 种</div>
                    <div>总数：{order.totalProductsCount} 件</div>
                    <div className="mt-1">
                      <FeatureMarker title="查看详情" description="交互说明：点击执行查看详情操作。">
<span className="text-blue-600 hover:underline cursor-pointer" onClick={() => openProductDetails(order)}>查看详情</span>
</FeatureMarker>
                    </div>
                  </div>
                </td>
                <td className="p-3 align-middle text-center">
                  {order.paymentStatus !== '已申请付款' ? (
                    <FeatureMarker title="申请付款" description="交互说明：点击执行申请付款操作。">
<span className="text-blue-600 cursor-pointer hover:underline" onClick={() => openPaymentApply(order.id, order.totalPrice)}>申请付款</span>
</FeatureMarker>
                  ) : (
                    <span className="text-gray-400">已申请付款</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Details Modal */}
      <Dialog open={productDetailsOpen} onOpenChange={setProductDetailsOpen}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-normal">商品列表</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {productDetailsOrder && (
              <div className="mb-4 text-[13px] text-gray-700 flex flex-wrap gap-x-6 gap-y-2 bg-gray-50 p-3 rounded border border-gray-100">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">采购单号：</span>
                  <span className="font-medium">{productDetailsOrder.orderNo}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">自定义单号：</span>
                  <span>{productDetailsOrder.customOrderNo}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">供应商名称：</span>
                  <span>{productDetailsOrder.supplierName}</span>
                </div>
              </div>
            )}
            <table className="w-full text-[12px] text-left border-collapse">
              <thead className="bg-[#F8FAFC] border-y border-gray-200">
                <tr className="text-gray-600">
                  <th className="p-3 font-normal border-r border-gray-200 text-center w-24">缩略图</th>
                  <th className="p-3 font-normal border-r border-gray-200">SKU/名称</th>
                  <th className="p-3 font-normal border-r border-gray-200 text-center w-40">
                    采购价格<br/>上次采购价
                  </th>
                  <th className="p-3 font-normal border-r border-gray-200 text-center w-20">数量</th>
                  <th className="p-3 font-normal text-center w-24">合计</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3 border-r border-gray-200 align-middle text-center">
                    <img src="https://via.placeholder.com/48" alt="thumb" className="w-12 h-12 object-cover mx-auto rounded border border-gray-200" />
                  </td>
                  <td className="p-3 border-r border-gray-200 align-middle">
                    <div className="text-blue-600 hover:underline cursor-pointer">Ab00341319</div>
                    <div className="text-gray-600 mt-1">交叉毛绒套趾拖鞋_米色L</div>
                  </td>
                  <td className="p-3 border-r border-gray-200 align-middle text-center text-gray-600">
                    <div>11.5 RMB</div>
                    <div className="text-gray-400">11.5 RMB</div>
                  </td>
                  <td className="p-3 border-r border-gray-200 align-middle text-center text-gray-800">10</td>
                  <td className="p-3 align-middle text-center text-gray-800 font-medium">115.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end pt-2">
            <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-[13px]" onClick={() => setProductDetailsOpen(false)}>关闭</Button>
</FeatureMarker>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Apply Modal (Reused Logic from Management) */}
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
                  alert('付款申请已提交');
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
    </div>
  );
}
