import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { HelpCircle, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function AutoOrder1688Modal({ order, onClose, onSuccess }: any) {
  const [activeTab, setActiveTab] = useState('1688下单');
  
  // 1688下单 state
  const [addressType, setAddressType] = useState('1688下单地址');
  const [appendOrderNo, setAppendOrderNo] = useState(false);
  const [anonymousPurchase, setAnonymousPurchase] = useState('是');
  const [freightPayment, setFreightPayment] = useState('预付');
  const [items, setItems] = useState(order?.items || []);

  // 关联1688订单 state
  const [associateOrderNo, setAssociateOrderNo] = useState('');

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] p-0 overflow-hidden flex flex-col h-[85vh] bg-white">
        <DialogHeader className="p-0 border-b border-gray-200 shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent p-0 gap-0 border-b-0 rounded-none h-12 w-full justify-start">
              <TabsTrigger 
                value="1688下单" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-white bg-gray-50 h-full px-6 font-normal text-[14px]"
              >
                1688下单
              </TabsTrigger>
              <TabsTrigger 
                value="关联1688订单" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-white bg-gray-50 h-full px-6 font-normal text-[14px]"
              >
                关联1688订单 <span className="ml-1 bg-pink-500 text-white text-[10px] px-1 rounded-sm leading-tight">new</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white text-[13px]">
          {activeTab === '1688下单' ? (
            <div className="space-y-4">
              {/* 1688 Account */}
              <div className="flex items-center bg-[#FFF8E6] p-2 rounded-sm border border-[#FFE58F]">
                <span className="w-24 text-right pr-4 text-gray-600">1688账号</span>
                <Select defaultValue="none">
                  <SelectTrigger className="w-[300px] h-8 bg-white">
                    <SelectValue placeholder="请选择1688账号" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">请选择</SelectItem>
                    <SelectItem value="account1">义翰科技</SelectItem>
                  </SelectContent>
                </Select>
                <a href="#" className="ml-4 text-blue-600 hover:underline">1688账号授权</a>
                <span className="ml-4 text-red-500">{"{lang 您未绑定1688账号，请先进行1688账号授权}"}</span>
              </div>

              {/* Address */}
              <div className="flex items-start bg-gray-50 p-4 rounded-sm border border-gray-200">
                <span className="w-24 text-right pr-4 text-gray-600 mt-1">收货地址</span>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={addressType === '1688下单地址'} 
                        onChange={() => setAddressType('1688下单地址')}
                        className="text-blue-600"
                      />
                      1688下单地址
                      <HelpCircle className="w-3 h-3 text-gray-400" />
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={addressType === '临时收货地址'} 
                        onChange={() => setAddressType('临时收货地址')}
                        className="text-blue-600"
                      />
                      临时收货地址
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox 
                        checked={appendOrderNo} 
                        onCheckedChange={(c) => setAppendOrderNo(!!c)} 
                      />
                      地址拼接采购单号
                      <HelpCircle className="w-3 h-3 text-gray-400" />
                    </label>
                    {addressType === '临时收货地址' && (
                      <span className="text-blue-600 cursor-pointer hover:underline">新增临时收货地址</span>
                    )}
                  </div>
                  <div className="text-blue-600 cursor-pointer hover:underline">同步收货地址</div>
                </div>
              </div>

              {/* Expected Payment Time */}
              <div className="flex items-center px-4">
                <span className="w-24 text-right pr-4 text-gray-600">预计付款时间</span>
                <Input type="date" className="w-[300px] h-8" />
              </div>

              {/* Anonymous Purchase & Freight Payment */}
              <div className="flex items-center px-4 gap-8">
                <div className="flex items-center">
                  <span className="w-24 text-right pr-4 text-gray-600">
                    匿名购买
                    <HelpCircle className="w-3 h-3 inline text-gray-400 ml-1" />
                  </span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={anonymousPurchase === '是'} onChange={() => setAnonymousPurchase('是')} /> 是
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={anonymousPurchase === '否'} onChange={() => setAnonymousPurchase('否')} /> 否
                    </label>
                  </div>
                </div>

                <div className="flex items-center ml-12">
                  <span className="w-24 text-right pr-4 text-gray-600">
                    运费支付方式
                    <HelpCircle className="w-3 h-3 inline text-gray-400 ml-1" />
                  </span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={freightPayment === '预付'} onChange={() => setFreightPayment('预付')} /> 预付
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={freightPayment === '到付'} onChange={() => setFreightPayment('到付')} /> 到付
                    </label>
                  </div>
                </div>
              </div>

              {/* Purchase Info */}
              <div className="border border-gray-200 rounded-sm">
                <div className="bg-gray-50 p-2 font-medium border-b text-gray-700">采购信息</div>
                <div className="p-4 space-y-4">
                  <div className="flex gap-4 text-gray-700">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E6A23C] text-white text-xs">1</div>
                    <div className="flex items-center gap-4 flex-1">
                      <span>单号：{order?.orderNo || '1570555704'}</span>
                      <span>供应商：{order?.supplierName || '不付款供应商-（记录成本用，不用付款）'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">1688订单备注</span>
                      <Input defaultValue={`采购单号:${order?.orderNo || '1570555704'}; 不要发邮政;`} className="w-[300px] h-8" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <span className="w-28 text-right pr-4 text-gray-600">
                        是否使用红包抵扣
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger><HelpCircle className="w-3 h-3 inline text-gray-400 ml-1" /></TooltipTrigger>
                            <TooltipContent><p>根据平台规定，使用红包抵扣无法使用跨境宝支付</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                      <Select defaultValue="否">
                        <SelectTrigger className="w-[180px] h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="是">是</SelectItem>
                          <SelectItem value="否">否</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center">
                      <span className="w-24 text-right pr-4 text-gray-600">
                        交易方式
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger><HelpCircle className="w-3 h-3 inline text-gray-400 ml-1" /></TooltipTrigger>
                            <TooltipContent><p>如果不选择交易方式，创建订单时1688将默认取可用的第一个交易方式</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                      <Select defaultValue="none">
                        <SelectTrigger className="w-[180px] h-8"><SelectValue placeholder="请选择交易方式" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">请选择交易方式</SelectItem>
                          <SelectItem value="guarantee">担保交易</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center col-span-2">
                      <span className="w-28 text-right pr-4 text-gray-600">
                        订单类型
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger><HelpCircle className="w-3 h-3 inline text-gray-400 ml-1" /></TooltipTrigger>
                            <TooltipContent><p>优先读取对应供应商维护的1688订单类型</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                      <Select defaultValue="分销价订单">
                        <SelectTrigger className="w-[180px] h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="分销价订单">分销价订单</SelectItem>
                          <SelectItem value="批发价订单">批发价订单</SelectItem>
                          <SelectItem value="最优下单方式">最优下单方式</SelectItem>
                          <SelectItem value="火拼价下单">火拼价下单</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-[#FFF8E6] text-[#E6A23C] p-2 rounded-sm border border-[#FFE58F] text-[12px] leading-relaxed">
                    温馨提醒：最优下单方式，由1688平台返回订单金额最低的订单类型，系统会用平台告知的最优方式下单；<br/>
                    根据平台规则，仅批发价支持使用PLUS会员价，若要使用PLUS会员价请选择批发价订单或最优下单方式，点此了解更多订单类型的区别
                  </div>

                  <div className="flex items-center">
                    <span className="w-28 text-right pr-4 text-gray-600">1688供应商</span>
                    <Input className="w-[300px] h-8" />
                  </div>

                  {/* Product Table */}
                  <table className="w-full border-collapse border border-gray-200 mt-4">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-2 border-b font-medium text-left">库存sku信息</th>
                        <th className="p-2 border-b font-medium text-center">1688商品名称</th>
                        <th className="p-2 border-b font-medium text-center">1688商品信息</th>
                        <th className="p-2 border-b font-medium text-center w-24">数量</th>
                        <th className="p-2 border-b font-medium text-center w-20">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 && (
                        <tr><td colSpan={5} className="p-4 text-center text-gray-400">暂无商品</td></tr>
                      )}
                      {items.map((it: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="p-2 flex items-center gap-2">
                            <span className="font-medium">{i + 1}</span>
                            <div className="w-10 h-10 border rounded bg-gray-50 overflow-hidden flex-shrink-0">
                              {it.image || it.imageUrl ? <img src={it.image || it.imageUrl} className="w-full h-full object-cover" /> : null}
                            </div>
                            <div>
                              <div className="text-blue-600">{it.sku || '10005608-0-A0-WDHB'}</div>
                              <div className="text-gray-500 text-[12px]">{it.name || '单件定制-木柄印花纸扇-圆形'}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              <Input placeholder="请输入1688商品链接验证匹配" className="h-8" />
                              <Button className="h-8 bg-[#67C23A] hover:bg-[#529b2e] text-white">验证</Button>
                            </div>
                          </td>
                          <td className="p-2 text-center text-gray-500">--</td>
                          <td className="p-2">
                            <Input type="number" defaultValue={it.quantity || 2} className="w-16 h-8 mx-auto text-center" />
                          </td>
                          <td className="p-2 text-center">
                            <span className="text-red-500 cursor-pointer hover:underline" onClick={() => setItems(items.filter((_: any, idx: number) => idx !== i))}>删除</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#FFF8E6] text-[#E6A23C] p-3 rounded-sm border border-[#FFE58F] leading-relaxed">
                关联1688订单后，订单列表上将会显示1688上的状态和操作，可直接进行后面的操作<br/>
                此功能关联的1688订单仅支持更新1688订单状态信息、物流信息，不支持更新采购单商品的单价信息
              </div>
              <div className="flex items-center justify-center gap-8 py-8 bg-gray-50 border border-gray-200 rounded-sm">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">1688账号:</span>
                  <Select defaultValue="none">
                    <SelectTrigger className="w-[200px] h-8 bg-white">
                      <SelectValue placeholder="请选择1688账号" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">请选择</SelectItem>
                      <SelectItem value="account1">义翰科技</SelectItem>
                    </SelectContent>
                  </Select>
                  <a href="#" className="ml-2 text-blue-600 hover:underline">1688账号授权</a>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">1688订单号:</span>
                  <Input className="w-[250px] h-8 bg-white" value={associateOrderNo} onChange={(e) => setAssociateOrderNo(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t bg-gray-50 shrink-0">
          {activeTab === '1688下单' ? (
            <div className="flex items-center justify-end w-full gap-2">
              <label className="flex items-center gap-2 mr-auto cursor-pointer">
                <Checkbox /> <span className="text-gray-600">查看起批量</span>
              </label>
              <Button className="h-8 bg-[#40B4A4] hover:bg-[#339083] text-white text-[13px] px-6">一键验证</Button>
              <Button className="h-8 bg-[#40B4A4] hover:bg-[#339083] text-white text-[13px] px-6">保存本次商品关联</Button>
              <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white text-[13px] px-6" onClick={() => {
                const platformOrderNo = `1688${order?.orderNo || '0000000000'}`;
                onSuccess({
                  platformOrderNo,
                  ali1688AccountName: '义翰科技',
                  ali1688TradeType: '通用担保交易',
                  platformPaymentStatus: '待付款'
                });
                onClose();
              }}>确认下单</Button>
              <Button variant="outline" className="h-8 text-[13px] px-6" onClick={onClose}>取消</Button>
            </div>
          ) : (
            <div className="flex items-center justify-end w-full gap-2">
              <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white text-[13px] px-6" onClick={() => {
                onSuccess({
                  platformOrderNo: associateOrderNo || `1688${order?.orderNo || '0000000000'}`,
                  ali1688AccountName: '义翰科技',
                  ali1688TradeType: '通用担保交易',
                  platformPaymentStatus: '待付款'
                });
                onClose();
              }}>关联1688订单</Button>
              <Button variant="outline" className="h-8 text-[13px] px-6 bg-white" onClick={onClose}>取消</Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
