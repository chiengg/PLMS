import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Search, ChevronDown, Download, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PaymentApproval() {
  const [searchType, setSearchType] = useState('关联单号');
  const [status, setStatus] = useState('待审核');
  
  const [orders, setOrders] = useState([
    {
      id: '1',
      paymentNo: 'FK2026031810568378',
      relatedOrderNo: '1570541449',
      customOrderNo: '【暂无】',
      thirdPartyNo: '3291285973114673956',
      platformStatus: '待付款',
      paymentAccount: '中国银行',
      paymentMethod: '现款',
      settlementMethod: '--',
      status: '待审核',
      amountPayable: 'RMB 98.7',
      orderAmount: '1688: ¥ 98.7',
      amountPaid: 'RMB 0',
      amountUnpaid: 'RMB 98.7',
      supplier: '开发通用供应商',
      payee: '--',
      accountName: '--',
      collectionAccount: '--',
      buyer: '王长玉',
      orderTime: '2026-03-18',
      payWay: '--',
      tradeMethod: '通用担保交易',
      creator: '王长玉',
      createTime: '2026-03-18',
      expectedPayTime: '2026-03-18',
      customCategory: '--',
      type: '1688采购',
      note: ''
    }
  ]);

  const [auditOpen, setAuditOpen] = useState(false);
  const [auditOrder, setAuditOrder] = useState<any>(null);
  const [auditResult, setAuditResult] = useState('通过');
  const [auditRemark, setAuditRemark] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<any>(null);

  const handleAudit = (order: any) => {
    setAuditOrder(order);
    setAuditResult('通过');
    setAuditRemark('');
    setAuditOpen(true);
  };

  const confirmAudit = () => {
    setOrders(prev => prev.map(o => {
      if (o.id === auditOrder.id) {
        return { ...o, status: auditResult === '通过' ? '已完成' : '审核不通过' };
      }
      return o;
    }));
    setAuditOpen(false);
  };

  const handleWithdraw = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: '待审核' };
      }
      return o;
    }));
  };

  const handleEdit = (order: any) => {
    setEditOrder(order);
    setEditOpen(true);
  };

  const confirmEdit = () => {
    setEditOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0 text-[13px] space-y-4">
        {/* Row 1 */}
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium w-16 text-right">搜索:</span>
          <div className="flex items-center gap-4">
            {['关联单号', '自定义单号', '付款单号', '创建人', '第三方单号'].map(opt => (
              <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="approvalSearchType" 
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" 
                  checked={searchType === opt}
                  onChange={() => setSearchType(opt)}
                />
                <span className="text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
          <Input className="w-64 h-8 text-[12px] ml-2" placeholder="双击可批量查询" />
          <div className="flex items-center ml-4 gap-2">
            <span className="text-gray-600">预计付款时间</span>
            <Input type="date" className="w-32 h-8 text-[12px]" />
            <span className="text-gray-400">至</span>
            <Input type="date" className="w-32 h-8 text-[12px]" />
          </div>
          <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 ml-2">
            <Search className="w-3.5 h-3.5 mr-1.5" /> 搜索
          </Button>
          </FeatureMarker>
        </div>

        {/* Other filter rows simplified for UI representation */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex items-center">
            <span className="text-gray-700 font-medium w-16 text-right mr-4 flex-shrink-0">状态:</span>
            <div className="flex items-center gap-3">
              {['待审核', '已审核', '审核不通过'].map(opt => (
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
            <span className="text-gray-700 font-medium w-16 text-right mr-4 flex-shrink-0">类型:</span>
            <div className="flex items-center gap-3">
              <span className="cursor-pointer px-2 py-1 rounded text-blue-600 border border-blue-600 bg-blue-50">全部</span>
              <span className="text-gray-600 hover:text-blue-600 cursor-pointer">1688采购</span>
              <span className="text-gray-600 hover:text-blue-600 cursor-pointer">普通采购</span>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Operations */}
      <div className="p-3 border-b border-gray-200 bg-[#F8FAFC] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-[13px] text-white">
            批量操作 <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
          </FeatureMarker>
          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-700">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            查看本人创建付款单
          </label>
        </div>
        <div className="flex gap-2">
          <FeatureMarker title="导入" description="交互说明：点击上传文件并批量导入数据。">
          <Button variant="outline" className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white border-0 text-[13px]">
            <Upload className="w-3.5 h-3.5 mr-1.5" /> 导入
          </Button>
          </FeatureMarker>
          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <Button variant="outline" className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white border-0 text-[13px]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> 导出 <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
          </FeatureMarker>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-[12px] text-left border-collapse">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200 shadow-sm">
            <tr className="text-gray-600">
              <th className="p-3 w-10 text-center font-normal border-r border-gray-200"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-32">付款单号</th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-40">
                关联单号<br/>自定义单号<br/>第三方单号<br/>平台状态
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-32">
                付款账号<br/>收款方式<br/>结款方式<br/>状态
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-32">
                应付金额<br/>采购单金额<br/>已付款<br/>未付款
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-40">
                供应商<br/>收款人<br/>账号名称<br/>收款账号
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-32">
                下单员<br/>下单时间<br/>支付方式<br/>交易方式
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-40">
                创建人/时间<br/>预计付款时间<br/>自定义分类<br/>类型
              </th>
              <th className="p-3 font-normal border-r border-gray-200 text-center w-48">备注</th>
              <th className="p-3 font-normal text-center w-24">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="p-3 text-center border-r border-gray-200 align-middle"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <span className="text-blue-600 hover:underline cursor-pointer">{order.paymentNo}</span>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-blue-600 hover:underline cursor-pointer font-medium flex items-center justify-center">{order.relatedOrderNo} <span className="bg-red-500 text-white text-[10px] px-1 rounded-sm ml-1">P</span></div>
                  <div className="text-gray-500 mt-1">{order.customOrderNo}</div>
                  <div className="text-orange-500 mt-1">{order.thirdPartyNo}</div>
                  <div className="text-gray-500 mt-1">{order.platformStatus}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-800">{order.paymentAccount}</div>
                  <div className="text-gray-600 mt-1">{order.paymentMethod}</div>
                  <div className="text-gray-400 mt-1">{order.settlementMethod}</div>
                  <div className="text-gray-800 mt-1">{order.status}</div>
                  <div className="text-blue-600 cursor-pointer hover:underline mt-1 text-[11px]">审核详情</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-800">{order.amountPayable}</div>
                  <div className="text-gray-600 mt-1">{order.orderAmount}</div>
                  <div className="text-gray-600 mt-1">{order.amountPaid}</div>
                  <div className="text-gray-800 mt-1">{order.amountUnpaid}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-800">{order.supplier}</div>
                  <div className="text-gray-400 mt-1">{order.payee}</div>
                  <div className="text-gray-400 mt-1">{order.accountName}</div>
                  <div className="text-gray-400 mt-1">{order.collectionAccount}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-800">{order.buyer}</div>
                  <div className="text-gray-600 mt-1">{order.orderTime}</div>
                  <div className="text-gray-400 mt-1">{order.payWay}</div>
                  <div className="text-gray-600 mt-1">{order.tradeMethod}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle text-center">
                  <div className="text-gray-800">{order.creator}</div>
                  <div className="text-gray-600 mt-1">{order.createTime}</div>
                  <div className="text-gray-600 mt-1">{order.expectedPayTime}</div>
                  <div className="text-gray-600 mt-1">{order.type}</div>
                </td>
                <td className="p-3 border-r border-gray-200 align-middle">
                  <textarea 
                    className="w-full h-16 border border-gray-300 rounded p-1 text-[12px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    defaultValue={order.note}
                    readOnly
                  />
                </td>
                <td className="p-3 align-middle text-center">
                  <div className="flex flex-col gap-2 items-center justify-center">
                    {order.status === '待审核' && (
                      <>
                        <FeatureMarker title="审核" description="交互说明：点击执行审核操作。">
<span className="text-blue-600 cursor-pointer hover:underline" onClick={() => handleAudit(order)}>审核</span>
</FeatureMarker>
                        <FeatureMarker title="编辑" description="交互说明：点击打开编辑弹窗，修改当前项信息。">
<span className="text-blue-600 cursor-pointer hover:underline" onClick={() => handleEdit(order)}>编辑</span>
</FeatureMarker>
                      </>
                    )}
                    {(order.status === '已完成' || order.status === '审核不通过') && (
                      <FeatureMarker title="撤销" description="交互说明：点击执行撤销操作。">
<span className="text-blue-600 cursor-pointer hover:underline" onClick={() => handleWithdraw(order.id)}>撤销</span>
</FeatureMarker>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 审核弹窗 */}
      <Dialog open={auditOpen} onOpenChange={setAuditOpen}>
        <DialogContent className="max-w-[450px] p-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-[15px] font-medium text-gray-800">审核</h2>
            <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setAuditOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            </FeatureMarker>
          </div>
          <div className="p-6 text-[13px] text-gray-700">
            <div className="flex items-center mb-4">
              <span className="w-20 text-right mr-4"><span className="text-red-500 mr-1">*</span>审核结果：</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="auditResult" 
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" 
                    checked={auditResult === '通过'}
                    onChange={() => setAuditResult('通过')}
                  />
                  <span>通过</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="auditResult" 
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" 
                    checked={auditResult === '驳回'}
                    onChange={() => setAuditResult('驳回')}
                  />
                  <span>驳回</span>
                </label>
              </div>
            </div>
            <div className="flex items-start">
              <span className="w-20 text-right mr-4 mt-1">审核备注：</span>
              <textarea 
                className="flex-1 h-24 border border-gray-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="请输入审核备注..."
                value={auditRemark}
                onChange={(e) => setAuditRemark(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 text-[13px]" onClick={() => setAuditOpen(false)}>取消</Button>
</FeatureMarker>
              <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 px-6 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-[13px] text-white" onClick={confirmAudit}>确定</Button>
</FeatureMarker>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[550px] p-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-[15px] font-medium text-gray-800">编辑采购付款单</h2>
            <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setEditOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            </FeatureMarker>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar text-[13px] text-gray-700">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0">付款账户：</div>
                <div className="flex-1 flex items-center gap-3">
                  <select className="flex-1 h-8 border border-gray-200 rounded px-2 outline-none">
                    <option>选择账户</option>
                  </select>
                  <span className="text-blue-600 cursor-pointer hover:underline whitespace-nowrap">银行账号管理</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0"><span className="text-red-500 mr-1">*</span>类型：</div>
                <div className="flex-1 flex items-center gap-3">
                  <select className="flex-1 h-8 border border-gray-200 rounded px-2 outline-none">
                    <option>采购</option>
                  </select>
                  <span className="text-blue-600 cursor-pointer hover:underline whitespace-nowrap">类型管理</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0">供应商：</div>
                <div className="flex-1">
                  <Input readOnly value={editOrder?.supplier || ''} className="h-8 bg-gray-50" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0">收款人：</div>
                <div className="flex-1">
                  <Input readOnly value={editOrder?.payee || ''} className="h-8 bg-gray-50" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0">收款方式：</div>
                <div className="flex-1">
                  <Input readOnly value={editOrder?.paymentMethod || ''} className="h-8 bg-gray-50" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0">账号名称：</div>
                <div className="flex-1">
                  <Input readOnly value={editOrder?.accountName || ''} className="h-8 bg-gray-50" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0">收款账号：</div>
                <div className="flex-1">
                  <Input readOnly value={editOrder?.collectionAccount || ''} className="h-8 bg-gray-50" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0">结款方式：</div>
                <div className="flex-1">
                  <Input readOnly value={editOrder?.settlementMethod || ''} className="h-8 bg-gray-50" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0"><span className="text-red-500 mr-1">*</span>付款金额：</div>
                <div className="flex-1 flex items-center gap-2">
                  <Input readOnly value={editOrder?.amountPayable?.replace('RMB ', '') || ''} className="h-8 flex-1 bg-gray-50" />
                  <span className="text-gray-500">RMB</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0"><span className="text-red-500 mr-1">*</span>预计付款时间：</div>
                <div className="flex-1">
                  <Input readOnly value={editOrder?.expectedPayTime || ''} className="h-8 bg-gray-50" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0"><span className="text-red-500 mr-1">*</span>付款方式：</div>
                <div className="flex-1">
                  <select className="w-full h-8 border border-gray-200 rounded px-2 outline-none">
                    <option>现款</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-28 text-right pr-4 shrink-0">关联单号：</div>
                <div className="flex-1">
                  <Input readOnly value={editOrder?.relatedOrderNo || ''} className="h-8 bg-gray-50" />
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-28 text-right pr-4 pt-1 shrink-0">备注：</div>
                <div className="flex-1">
                  <textarea readOnly value={editOrder?.note || ''} className="w-full h-20 border border-gray-200 rounded p-2 bg-gray-50 resize-none" />
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-center gap-3 bg-gray-50">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 px-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-[13px] text-white" onClick={confirmEdit}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-8 text-[13px]" onClick={() => setEditOpen(false)}>取消</Button>
</FeatureMarker>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
