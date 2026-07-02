import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, HelpCircle, Send, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type BatchModalType = 
  | null
  | 'updateFreight' 
  | 'changeOrderCreator' 
  | 'changeBuyer' 
  | 'voidOrders' 
  | 'changeWarehouse' 
  | 'changeArriveDate' 
  | 'withdrawAudit' 
  | 'updateFreightPaymentType' 
  | 'updateInvoiceAndTax' 
  | 'updateFreightApportion' 
  | 'updateRemark' 
  | 'changeSupplier' 
  | 'changeRelatedOrderNo'
  | 'batchSplitOrder';

interface BatchOperationsModalsProps {
  modalType: BatchModalType;
  setModalType: (type: BatchModalType) => void;
  selectedOrders: string[];
  orders: any[];
  setOrders: (updateFn: (prev: any[]) => any[]) => void;
  setToastMessage: (msg: string | null) => void;
}

export default function BatchOperationsModals({ modalType, setModalType, selectedOrders, orders, setOrders, setToastMessage }: BatchOperationsModalsProps) {
  const close = () => setModalType(null);

  const getSelectedData = () => {
    return orders.filter(o => selectedOrders.includes(o.id));
  };

  // Shared state for simple modals
  const [singleValue, setSingleValue] = useState('');
  
  // Freight / Logistics
  const [freightRows, setFreightRows] = useState<any[]>([]);

  // Invoice and Tax
  const [invoiceRows, setInvoiceRows] = useState<any[]>([]);

  // Supplier
  const [supplierSelected, setSupplierSelected] = useState('');
  const [openSupplierSelect, setOpenSupplierSelect] = useState(false);

  // Batch Split Order
  const [splitItems, setSplitItems] = useState<any[]>([]);

  // Batch Arrive Date
  const [arriveDateGlobal, setArriveDateGlobal] = useState('');
  const [arriveDateRows, setArriveDateRows] = useState<any[]>([]);

  React.useEffect(() => {
    if (modalType === 'updateFreight') {
      const initRows = getSelectedData().map(o => ({
        id: o.id,
        orderNo: o.orderNo,
        freight: '0.0000',
        logisticsCompany: '',
        status: '未签收',
        trackingNo: ''
      }));
      setFreightRows(initRows);
    } else if (modalType === 'updateInvoiceAndTax') {
      const initRows = getSelectedData().map(o => ({
        id: o.id,
        orderNo: o.orderNo,
        invoiceType: '普票',
        taxType: '按固定值',
        tax: '0.0000',
        invoiceNo: '',
        invoiceAmount: ''
      }));
      setInvoiceRows(initRows);
    } else if (modalType === 'batchSplitOrder') {
      const allItems = getSelectedData().flatMap(order => {
        return (order.items || []).map((item: any, index: number) => ({
          ...item,
          orderId: order.id,
          orderNo: order.orderNo,
          itemIndex: index,
          selected: false,
          splitQty: ''
        }));
      });
      setSplitItems(allItems);
    } else if (modalType === 'changeArriveDate') {
      setArriveDateGlobal('');
      const dateRows = getSelectedData().flatMap(order => {
        return (order.items || []).map((item: any, index: number) => ({
          orderId: order.id,
          orderNo: order.orderNo,
          itemIndex: index,
          sku: item.sku,
          arriveDate: '2026-05-08'
        }));
      });
      setArriveDateRows(dateRows);
    } else {
      setSingleValue('');
      setSupplierSelected('');
    }
  }, [modalType, selectedOrders]);

  const handleConfirm = () => {
    if (modalType === 'changeOrderCreator') {
      if (!singleValue) return alert('请选择下单员');
      setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, orderCreator: singleValue } : o));
      setToastMessage('批量更换下单员成功');
    } else if (modalType === 'changeBuyer') {
      if (!singleValue) return alert('请选择采购员');
      setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, buyer: singleValue } : o));
      setToastMessage('批量更换采购员成功');
    } else if (modalType === 'voidOrders') {
      setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, status: '已作废' } : o));
      setToastMessage('已批量作废所选采购单');
    } else if (modalType === 'changeWarehouse') {
      if (!singleValue) return alert('请选择仓库');
      setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, warehouse: singleValue } : o));
      setToastMessage('批量修改收货仓库成功');
    } else if (modalType === 'withdrawAudit') {
      setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, status: '新订单（待审核）' } : o));
      setToastMessage('批量撤回审核成功');
    } else if (modalType === 'updateFreightPaymentType') {
      if (!singleValue) return alert('请选择运费支付方式');
      setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, freightPaymentType: singleValue } : o));
      setToastMessage('批量更新运费支付方式成功');
    } else if (modalType === 'updateFreightApportion') {
      if (!singleValue) return alert('请选择运费分摊方式');
      setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, freightApportionType: singleValue } : o));
      setToastMessage('批量更新运费分摊方式成功');
    } else if (modalType === 'updateRemark') {
      setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, orderNote: singleValue } : o));
      setToastMessage('批量修改备注成功');
    } else if (modalType === 'changeSupplier') {
      if (!supplierSelected) return alert('请选择供应商');
      setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, supplierName: supplierSelected } : o));
      setToastMessage('批量更换供应商成功');
    } else if (modalType === 'changeRelatedOrderNo') {
      setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, relatedOrderNo: singleValue } : o));
      setToastMessage('批量修改关联订单号成功');
    }

    close();
  };

  const supplierOptions = [
    { value: '曹县委要王工艺有限公司', label: '曹县委要王工艺有限公司' },
    { value: '肃宁县优创服装厂(test)', label: '肃宁县优创服装厂(test)' },
    { value: '义乌市俊领服装厂', label: '义乌市俊领服装厂' }
  ];

  return (
    <>
      {/* 批量更换下单员/采购员 */}
      <Dialog open={modalType === 'changeOrderCreator' || modalType === 'changeBuyer'} onOpenChange={close}>
        <DialogContent className="max-w-[500px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-200 bg-gray-50/50">
            <DialogTitle className="text-[15px] font-normal text-gray-800">{modalType === 'changeOrderCreator' ? '更换下单员' : '更换采购员'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-[13px]">
            <div className="bg-[#FFF8E6] text-[#E6A23C] p-2 text-center mb-4">此功能用于批量更换采购单的{modalType === 'changeOrderCreator' ? '下单员' : '采购员'}</div>
            <div className="flex items-center gap-4 px-8">
              <span className="w-16 text-right text-gray-600">{modalType === 'changeOrderCreator' ? '下单员' : '采购员'}</span>
              <select className="flex-1 h-8 border border-gray-200 rounded px-2 outline-none text-gray-800" value={singleValue} onChange={e => setSingleValue(e.target.value)}>
                <option value="">请选择员工</option>
                <option value="测试员A">测试员A</option>
                <option value="采购员B">采购员B</option>
              </select>
            </div>
          </div>
          <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50 sm:justify-end">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal rounded-sm" onClick={handleConfirm}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal bg-white rounded-sm" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量作废 */}
      <Dialog open={modalType === 'voidOrders'} onOpenChange={close}>
        <DialogContent className="max-w-[500px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-200 bg-gray-50/50">
            <DialogTitle className="text-[15px] font-normal text-gray-800">批量作废采购单</DialogTitle>
          </DialogHeader>
          <div className="py-6 px-8 text-[13px] text-gray-700 bg-[#F8FAFC]">
            <div className="mb-4">确定作废以下采购单吗？</div>
            <div className="leading-relaxed">采购单为：{getSelectedData().map(o => o.orderNo).join(', ')}</div>
          </div>
          <DialogFooter className="flex items-center sm:justify-end gap-2 p-4 border-t border-gray-200 bg-white">
            <label className="flex items-center gap-1.5 text-[13px] mr-2 cursor-pointer text-gray-600">
              <Checkbox /> 是否同步取消1688平台订单
            </label>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal rounded-sm" onClick={handleConfirm}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal bg-white rounded-sm" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量修改收货仓库 */}
      <Dialog open={modalType === 'changeWarehouse'} onOpenChange={close}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-normal">修改收货仓库</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-[13px]">
            <div className="bg-[#FFF8E6] text-[#E6A23C] p-3 mb-4 leading-relaxed">
              <p>1、此功能用于批量修改采购单的收货仓库。</p>
              <p>2、已入库/部分到货的采购单不能修改仓库，修改时将剔除。</p>
            </div>
            <div className="flex items-center gap-4 px-8">
              <span className="w-16 text-right text-red-500">* 仓库</span>
              <select className="flex-1 h-8 border border-gray-200 rounded px-2 outline-none" value={singleValue} onChange={e => setSingleValue(e.target.value)}>
                <option value="">请选择</option>
                <option value="东莞厚街仓">东莞厚街仓</option>
                <option value="义乌仓">义乌仓</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal" onClick={handleConfirm}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量撤回审核 */}
      <Dialog open={modalType === 'withdrawAudit'} onOpenChange={close}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-normal">批量撤回审核</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-[13px] text-gray-700">
            <div className="mb-2">确定撤回以下采购单吗？将采购单撤回到未审核状态</div>
            <div>采购单为：{getSelectedData().map(o => o.orderNo).join(', ')}</div>
          </div>
          <DialogFooter>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal" onClick={handleConfirm}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量修改备注 / 关联订单号 */}
      <Dialog open={modalType === 'updateRemark' || modalType === 'changeRelatedOrderNo'} onOpenChange={close}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-normal">{modalType === 'updateRemark' ? '批量修改备注' : '批量修改关联订单号'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-[13px]">
            <textarea 
              className="w-full h-24 border border-gray-200 rounded p-2 outline-none focus:border-blue-500" 
              placeholder={`请输入${modalType === 'updateRemark' ? '备注' : '关联订单号'}`}
              value={singleValue}
              onChange={e => setSingleValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal" onClick={handleConfirm}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量更新运费支付方式 / 分摊方式 */}
      <Dialog open={modalType === 'updateFreightPaymentType' || modalType === 'updateFreightApportion'} onOpenChange={close}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-normal">{modalType === 'updateFreightPaymentType' ? '批量更新运费支付方式' : '批量更新运费分摊方式'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-[13px]">
            {modalType === 'updateFreightApportion' && (
              <div className="bg-[#FFF8E6] text-[#E6A23C] p-3 mb-4 leading-relaxed">
                <p>i. 按数量分摊计算公式：[A采购数量/（A采购数量+B采购量）*总运费]</p>
                <p>ii. 按重量分摊计算公式：[(A采购数量*A商品重量）/（A采购数量*A商品重量+B采购数量*B商品重量*总运费]</p>
                <p>iii. 按体积分摊计算公式：[A采购数量*A商品包装后体积/（A采购数量*A商品包装后体积+B采购数量*B商品包装后体积*总运费]</p>
                <p>iv. 仅未入库的采购单允许更新运费分摊方式；</p>
                <p>v. 当采购单中存在重量或体积为0的商品时，自动切换为按数量计算；</p>
              </div>
            )}
            <div className="flex items-center gap-4 px-8">
              <span className="w-24 text-right">{modalType === 'updateFreightPaymentType' ? '支付方式' : '分摊方式'}</span>
              <div className="flex items-center gap-4">
                {(modalType === 'updateFreightPaymentType' ? ['预付', '到付'] : ['按数量', '按重量', '按包装后体积']).map(t => (
                  <label key={t} className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="updateType" checked={singleValue === t} onChange={() => setSingleValue(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal" onClick={handleConfirm}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量更换供应商 */}
      <Dialog open={modalType === 'changeSupplier'} onOpenChange={close}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-normal">批量更换供应商</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-[13px]">
            <div className="flex items-center gap-4 px-8">
              <span className="w-16 text-right">供应商</span>
              <Popover open={openSupplierSelect} onOpenChange={setOpenSupplierSelect}>
                <PopoverTrigger className="inline-flex h-8 flex-1 items-center justify-between whitespace-nowrap rounded border border-input bg-transparent px-2.5 py-1 text-[13px] transition-colors outline-none hover:bg-muted bg-white">
                  {supplierSelected
                    ? supplierOptions.find((s) => s.value === supplierSelected)?.label
                    : "请输入供应商模糊搜索"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
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
          </div>
          <DialogFooter>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal" onClick={handleConfirm}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量修改运单号/运费 */}
      <Dialog open={modalType === 'updateFreight'} onOpenChange={close}>
        <DialogContent className="max-w-[800px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-200 bg-gray-50/50">
            <DialogTitle className="text-[15px] font-normal text-gray-800">修改物流信息</DialogTitle>
          </DialogHeader>
          <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <table className="w-full text-center text-[13px]">
              <thead className="bg-[#F8FAFC] border border-gray-200 text-gray-600">
                <tr>
                  <th className="p-2 font-normal">采购单号</th>
                  <th className="p-2 font-normal">运费</th>
                  <th className="p-2 font-normal">物流公司</th>
                  <th className="p-2 font-normal">签收状态</th>
                  <th className="p-2 font-normal w-64">物流单号</th>
                </tr>
              </thead>
              <tbody className="border border-t-0 border-gray-200 divide-y divide-gray-200">
                {freightRows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="p-2 text-gray-800">{row.orderNo}</td>
                    <td className="p-2">
                      <div className="flex items-center border border-gray-200 rounded overflow-hidden h-8 mx-auto w-28">
                        <Input 
                          type="number" 
                          className="h-full border-0 focus-visible:ring-0 px-2 text-[12px] w-full text-center" 
                          value={row.freight} 
                          onChange={(e) => setFreightRows(prev => prev.map((r, i) => i === index ? { ...r, freight: e.target.value } : r))} 
                        />
                        <span className="px-2 text-[12px] text-gray-400 bg-gray-50 border-l border-gray-200 h-full flex items-center">RMB</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1 justify-center">
                        <select 
                          className="h-8 border border-gray-200 rounded px-2 outline-none w-28 text-[12px]"
                          value={row.logisticsCompany}
                          onChange={(e) => setFreightRows(prev => prev.map((r, i) => i === index ? { ...r, logisticsCompany: e.target.value } : r))} 
                        >
                          <option value="">请选择</option>
                          <option value="顺丰">顺丰</option>
                          <option value="中通">中通</option>
                          <option value="圆通">圆通</option>
                          <option value="韵达">韵达</option>
                        </select>
                        <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
                        <Button variant="outline" className="h-8 w-8 p-0 border-gray-200 rounded shrink-0" onClick={() => {
                           if (!row.logisticsCompany) return;
                           setFreightRows(prev => prev.map(r => ({ ...r, logisticsCompany: row.logisticsCompany })));
                        }}>
                          <Send className="w-3.5 h-3.5 text-[#6B8EBE]" />
                        </Button>
                        </FeatureMarker>
                      </div>
                    </td>
                    <td className="p-2 text-gray-600">{row.status}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2 justify-center px-2">
                        <Input 
                          className="h-8 flex-1 text-[12px] px-2 border-gray-200" 
                          value={row.trackingNo}
                          onChange={(e) => setFreightRows(prev => prev.map((r, i) => i === index ? { ...r, trackingNo: e.target.value } : r))} 
                        />
                        <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button className="h-8 w-8 p-0 bg-[#6B8EBE] hover:bg-[#5A7BA8] shrink-0 rounded"><Plus className="w-4 h-4 text-white" /></Button>
</FeatureMarker>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50 sm:justify-end">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal rounded-sm" onClick={() => {
              setOrders(prev => prev.map(o => {
                const row = freightRows.find(r => r.id === o.id);
                if (row) {
                  return { ...o, freight: row.freight, logisticsCompany: row.logisticsCompany, trackingNo: row.trackingNo };
                }
                return o;
              }));
              setToastMessage('修改物流信息成功');
              close();
            }}>确定</Button>
            </FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal bg-white rounded-sm" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量修改预计到货时间 */}
      <Dialog open={modalType === 'changeArriveDate'} onOpenChange={close}>
        <DialogContent className="max-w-[700px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-200 bg-gray-50/50">
            <DialogTitle className="text-[15px] font-normal text-gray-800">批量设置预计到货时间</DialogTitle>
          </DialogHeader>
          <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <table className="w-full text-center text-[13px]">
              <thead className="bg-[#F8FAFC] border border-gray-200 text-gray-600">
                <tr>
                  <th className="p-2 font-normal w-1/3">采购单号</th>
                  <th className="p-2 font-normal w-1/3">SKU</th>
                  <th className="p-2 font-normal flex items-center justify-center gap-2 border-l border-gray-200 whitespace-nowrap">
                    到货时间 
                    <div className="flex items-center bg-white border border-gray-200 rounded overflow-hidden ml-1">
                      <Input 
                        type="date" 
                        className="h-7 border-0 text-[12px] px-2 w-[110px] focus-visible:ring-0" 
                        value={arriveDateGlobal}
                        onChange={(e) => setArriveDateGlobal(e.target.value)}
                      />
                      <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
                      <Button 
                        variant="outline" 
                        className="h-7 w-8 p-0 border-0 border-l border-gray-200 rounded-none bg-gray-50"
                        onClick={() => {
                          if (arriveDateGlobal) {
                            setArriveDateRows(prev => prev.map(r => ({ ...r, arriveDate: arriveDateGlobal })));
                          }
                        }}
                      >
                        <Send className="w-3 h-3 text-[#6B8EBE]" />
                      </Button>
                      </FeatureMarker>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="border border-t-0 border-gray-200 divide-y divide-gray-200">
                {arriveDateRows.map((row, i) => (
                  <tr key={`${row.orderId}-${row.itemIndex}`}>
                    <td className="p-2 w-1/3 text-gray-800">{row.orderNo}</td>
                    <td className="p-2 w-1/3 text-gray-600 break-all">{row.sku}</td>
                    <td className="p-2 w-1/3 border-l border-gray-200">
                      <Input 
                        type="date" 
                        className="h-8 text-[12px] w-36 mx-auto border-gray-200" 
                        value={row.arriveDate} 
                        onChange={(e) => setArriveDateRows(prev => prev.map((r, index) => index === i ? { ...r, arriveDate: e.target.value } : r))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50 sm:justify-end">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal rounded-sm" onClick={() => {
              // Optionally you can persist these dates to the actual orders data here
              setToastMessage('批量设置预计到货时间成功');
              close();
            }}>确定</Button>
            </FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal bg-white rounded-sm" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量更新发票类型和税金 */}
      <Dialog open={modalType === 'updateInvoiceAndTax'} onOpenChange={close}>
        <DialogContent className="max-w-[1000px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-normal">批量更新发票类型和税金</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <table className="w-full text-center text-[13px]">
              <thead className="bg-gray-50 border border-gray-200">
                <tr>
                  <th className="p-2 font-normal">采购单号</th>
                  <th className="p-2 font-normal">发票类型</th>
                  <th className="p-2 font-normal">税金类型</th>
                  <th className="p-2 font-normal">税金</th>
                  <th className="p-2 font-normal">发票号</th>
                  <th className="p-2 font-normal">发票金额</th>
                  <th className="p-2 font-normal w-12">操作</th>
                </tr>
              </thead>
              <tbody className="border border-t-0 border-gray-200 divide-y divide-gray-200">
                {invoiceRows.map((row, index) => (
                  <tr key={index}>
                    <td className="p-2">{row.orderNo}</td>
                    <td className="p-2">
                      <select 
                        className="h-8 border border-gray-200 rounded px-1 outline-none w-full"
                        value={row.invoiceType}
                        onChange={(e) => setInvoiceRows(prev => prev.map((r, i) => i === index ? { ...r, invoiceType: e.target.value } : r))} 
                      >
                        <option value="普票">普票</option>
                        <option value="专票">专票</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select 
                        className="h-8 border border-gray-200 rounded px-1 outline-none w-full"
                        value={row.taxType}
                        onChange={(e) => setInvoiceRows(prev => prev.map((r, i) => i === index ? { ...r, taxType: e.target.value } : r))} 
                      >
                        <option value="按固定值">按固定值</option>
                        <option value="按比例">按比例</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <Input 
                        type="number" 
                        className="h-8 px-2 text-[12px] w-20 text-center mx-auto" 
                        value={row.tax} 
                        onChange={(e) => setInvoiceRows(prev => prev.map((r, i) => i === index ? { ...r, tax: e.target.value } : r))} 
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        className="h-8 px-2 text-[12px] w-full" 
                        value={row.invoiceNo} 
                        onChange={(e) => setInvoiceRows(prev => prev.map((r, i) => i === index ? { ...r, invoiceNo: e.target.value } : r))} 
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        type="number" 
                        className="h-8 px-2 text-[12px] w-full" 
                        value={row.invoiceAmount} 
                        onChange={(e) => setInvoiceRows(prev => prev.map((r, i) => i === index ? { ...r, invoiceAmount: e.target.value } : r))} 
                      />
                    </td>
                    <td className="p-2">
                      <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button className="h-8 w-8 p-0 bg-[#6B8EBE] hover:bg-[#5A7BA8]"><Plus className="w-4 h-4 text-white" /></Button>
</FeatureMarker>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal" onClick={() => {
              setToastMessage('批量更新发票类型和税金成功');
              close();
            }}>确定</Button>
            </FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 批量拆分采购 */}
      <Dialog open={modalType === 'batchSplitOrder'} onOpenChange={close}>
        <DialogContent className="max-w-[1000px] p-0 gap-0 overflow-hidden bg-white">
          <DialogHeader className="p-4 border-b border-gray-200 bg-gray-50/50">
            <DialogTitle className="text-[15px] font-normal text-gray-800 text-center text-[#6B8EBE]">批量拆分采购单</DialogTitle>
          </DialogHeader>
          <div className="p-4 max-h-[65vh] overflow-y-auto custom-scrollbar bg-gray-100">
            {getSelectedData().map(order => {
              const orderItems = splitItems.filter(i => i.orderId === order.id);
              if (orderItems.length === 0) return null;

              const totalTypes = orderItems.length;
              const totalItems = orderItems.reduce((acc, curr) => acc + (parseInt(curr.splitQty) || 0), 0);

              return (
                <div key={order.id} className="mb-4 bg-white border border-gray-200">
                  <div className="flex items-center justify-between p-2 bg-[#F8FAFC] border-b border-gray-200 text-[13px] text-gray-600">
                    <div>采购单：{order.orderNo}</div>
                    <div>新订单将包含 {totalTypes} 个商品种类共 {totalItems} 件商品</div>
                  </div>
                  <table className="w-full text-center text-[13px]">
                    <thead className="border-b border-gray-200 text-gray-600 bg-white">
                      <tr>
                        <th className="p-2 font-normal w-12">
                          <Checkbox 
                            checked={orderItems.every(i => i.selected)}
                            onCheckedChange={(c) => {
                              setSplitItems(prev => prev.map(item => item.orderId === order.id ? { ...item, selected: !!c } : item));
                            }}
                          />
                        </th>
                        <th className="p-2 font-normal w-16">缩略图</th>
                        <th className="p-2 font-normal text-left">SKU编号/中文名称</th>
                        <th className="p-2 font-normal w-32">原厂SKU</th>
                        <th className="p-2 font-normal w-24">采购价</th>
                        <th className="p-2 font-normal w-20">数量</th>
                        <th className="p-2 font-normal w-24">拆分数量</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orderItems.map((item, index) => (
                        <tr key={`${item.orderId}-${item.itemIndex}`}>
                          <td className="p-2">
                            <Checkbox 
                              checked={item.selected}
                              onCheckedChange={(c) => {
                                setSplitItems(prev => prev.map(p => (p.orderId === item.orderId && p.itemIndex === item.itemIndex) ? { ...p, selected: !!c } : p));
                              }}
                            />
                          </td>
                          <td className="p-2">
                            <img src={item.imageUrl} alt="img" className="w-10 h-10 object-cover mx-auto rounded border border-gray-200" />
                          </td>
                          <td className="p-2 text-left">
                            <div className="text-blue-500 hover:underline cursor-pointer">{item.sku}</div>
                            <div className="text-gray-500 text-[12px] truncate max-w-[250px]">{item.name}</div>
                          </td>
                          <td className="p-2 text-gray-500">{item.originalSku || '--'}</td>
                          <td className="p-2 text-gray-600">**** RMB</td>
                          <td className="p-2 text-gray-800">{item.quantity}</td>
                          <td className="p-2">
                            <Input 
                              type="number" 
                              className="h-8 text-[13px] w-16 mx-auto text-center" 
                              min="0"
                              max={item.quantity}
                              value={item.splitQty}
                              onChange={(e) => {
                                setSplitItems(prev => prev.map(p => (p.orderId === item.orderId && p.itemIndex === item.itemIndex) ? { ...p, splitQty: e.target.value } : p));
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
          <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50 sm:justify-end">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-[#6B8EBE] hover:bg-[#5A7BA8] h-8 px-6 font-normal rounded-sm" onClick={() => {
              const selectedToSplit = splitItems.filter(i => i.selected && parseInt(i.splitQty) > 0);
              if (selectedToSplit.length === 0) return alert('请勾选需要拆分的商品并填写有效的拆分数量');
              
              setOrders(prev => {
                let newOrdersList = [...prev];
                
                // Group splits by orderId
                const splitsByOrder = selectedToSplit.reduce((acc, curr) => {
                  if (!acc[curr.orderId]) acc[curr.orderId] = [];
                  acc[curr.orderId].push(curr);
                  return acc;
                }, {} as Record<string, typeof splitItems>);

                Object.entries(splitsByOrder).forEach(([orderId, splits]: [string, any[]]) => {
                  const originalOrderIndex = newOrdersList.findIndex(o => o.id === orderId);
                  if (originalOrderIndex === -1) return;
                  
                  const originalOrder = newOrdersList[originalOrderIndex];
                  const newOrder = JSON.parse(JSON.stringify(originalOrder));
                  
                  // Modify new order
                  newOrder.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                  newOrder.orderNo = originalOrder.orderNo + '-A'; // typical split suffix
                  newOrder.items = splits.map(s => ({
                    sku: s.sku,
                    name: s.name,
                    quantity: parseInt(s.splitQty),
                    price: s.price,
                    imageUrl: s.imageUrl
                  }));
                  
                  // Update original order quantities
                  const updatedOriginalOrder = JSON.parse(JSON.stringify(originalOrder));
                  splits.forEach(s => {
                    const originalItem = updatedOriginalOrder.items[s.itemIndex];
                    if (originalItem) {
                      originalItem.quantity -= parseInt(s.splitQty);
                    }
                  });
                  // Remove items that have 0 quantity left
                  updatedOriginalOrder.items = updatedOriginalOrder.items.filter((i: any) => i.quantity > 0);
                  
                  newOrdersList[originalOrderIndex] = updatedOriginalOrder;
                  newOrdersList.unshift(newOrder); // Add new order to the top
                });

                return newOrdersList;
              });

              setToastMessage('批量拆分成功，已生成新的采购单');
              close();
            }}>确定</Button>
            </FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 px-6 font-normal bg-white rounded-sm" onClick={close}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
