import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LinkSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

export function LinkSupplierModal({ open, onOpenChange, product }: LinkSupplierModalProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Mock linked suppliers
  const [suppliers, setSuppliers] = useState<any[]>([
    {
      id: '1',
      name: '世界杯足球风大白鹅衣服',
      link: '【暂无】',
      contact: '',
      count: '',
      lastTime: ''
    }
  ]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-white shadow-lg border-0" aria-describedby="link-supplier-desc">
          <DialogHeader className="p-3 border-b border-gray-200 bg-white flex flex-row items-center justify-between">
            <DialogTitle className="text-[14px] font-normal text-gray-800" id="link-supplier-desc">
              {product?.sku}的供应商
            </DialogTitle>
          </DialogHeader>

          <div className="p-3 bg-white border-b border-gray-200 flex justify-end gap-2">
            <FeatureMarker title="+ 添加供应商" description="交互说明：点击打开新增弹窗，录入新数据。">
            <Button className="h-8 bg-[#85C226] hover:bg-[#74AB1F] text-white px-4 text-[13px] font-normal gap-1" onClick={() => setAddOpen(true)}>
              + 添加供应商
            </Button>
            </FeatureMarker>
            <FeatureMarker title="批量删除" description="交互说明：点击删除选中的数据项，操作不可恢复。">
            <Button className="h-8 bg-[#F56C6C] hover:bg-[#E05D5D] text-white px-4 text-[13px] font-normal">
              批量删除
            </Button>
            </FeatureMarker>
          </div>

          <div className="flex-1 overflow-auto bg-white min-h-[300px]">
            <table className="w-full text-[13px] text-center border-collapse">
              <thead className="bg-[#F8FAFC] text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="p-3 w-12 font-normal">
                    <Checkbox />
                  </th>
                  <th className="p-3 font-normal text-left">供应商</th>
                  <th className="p-3 font-normal text-left">供应商链接</th>
                  <th className="p-3 font-normal text-left">联系人</th>
                  <th className="p-3 font-normal text-left">采购次数</th>
                  <th className="p-3 font-normal text-left">最近采购时间</th>
                  <th className="p-3 font-normal text-left">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suppliers.map(s => (
                  <tr key={s.id} className="hover:bg-blue-50/30">
                    <td className="p-3">
                      <Checkbox 
                        checked={selectedIds.includes(s.id)}
                        onCheckedChange={(c) => setSelectedIds(c ? [...selectedIds, s.id] : selectedIds.filter(id => id !== s.id))}
                      />
                    </td>
                    <td className="p-3 text-left text-blue-500 hover:underline cursor-pointer">{s.name}</td>
                    <td className="p-3 text-left text-gray-400">
                      {s.link} <span className="text-blue-500 cursor-pointer ml-1">✎</span>
                    </td>
                    <td className="p-3 text-left">{s.contact}</td>
                    <td className="p-3 text-left">{s.count}</td>
                    <td className="p-3 text-left">{s.lastTime}</td>
                    <td className="p-3 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500 cursor-pointer hover:underline">查看采购历史</span>
                        <span className="text-red-500 cursor-pointer hover:underline">删除</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {suppliers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center p-3 border-t border-gray-200 text-[12px] text-gray-600 bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="border border-gray-300 rounded px-2 py-1 bg-white">每页 10 条 ▾</span>
              <span>共{suppliers.length}条 当前显示第1-{suppliers.length}条 1/1页</span>
              <div className="flex items-center gap-1 ml-2">
                <FeatureMarker title="K" description="交互说明：点击执行K操作。">
<button className="w-6 h-6 border border-gray-300 rounded bg-white text-gray-400">K</button>
</FeatureMarker>
                <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<button className="w-6 h-6 border border-gray-300 rounded bg-white text-gray-400">{'<'}</button>
</FeatureMarker>
                <FeatureMarker title="1" description="交互说明：点击执行1操作。">
<button className="w-6 h-6 border border-transparent text-red-500 font-medium">1</button>
</FeatureMarker>
                <FeatureMarker title="'}" description="交互说明：点击执行'}操作。">
<button className="w-6 h-6 border border-gray-300 rounded bg-white text-gray-400">{'>'}</button>
</FeatureMarker>
                <FeatureMarker title="'}" description="交互说明：点击执行'}操作。">
<button className="w-6 h-6 border border-gray-300 rounded bg-white text-gray-400">{'>>'}</button>
</FeatureMarker>
                <Input className="w-10 h-6 border-gray-300 text-center px-1" placeholder="页码" />
                <FeatureMarker title="跳转" description="交互说明：点击执行跳转操作。">
<Button variant="outline" className="h-6 px-2 text-[12px]">跳转</Button>
</FeatureMarker>
              </div>
            </div>
          </div>

          <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end">
            <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>关闭</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Supplier Nested Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-[600px] p-0 overflow-hidden bg-white shadow-lg border-0" aria-describedby="add-supplier-desc">
          <DialogHeader className="p-3 border-b border-gray-200 bg-white">
            <DialogTitle className="text-[14px] font-normal text-gray-800" id="add-supplier-desc">添加供应商</DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Input className="h-8 flex-1 text-[13px] border-gray-300 focus-visible:ring-0" placeholder="请输入供应商名称搜索" />
              <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
<Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal">搜索</Button>
</FeatureMarker>
            </div>
            <div className="border border-gray-200 rounded h-[300px] overflow-auto flex items-center justify-center text-gray-400 text-[13px]">
              搜索并选择供应商进行关联
            </div>
          </div>
          <DialogFooter className="p-3 border-t border-gray-200 bg-[#F8FAFC] m-0 rounded-none sm:justify-end gap-2">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-6" onClick={() => setAddOpen(false)}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white font-normal px-6 border-gray-300 text-gray-600" onClick={() => setAddOpen(false)}>取消</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ChangePairingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

export function ChangePairingModal({ open, onOpenChange, product }: ChangePairingModalProps) {
  const [link, setLink] = useState('https://detail.1688.com/offer/1044303129339.html');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-white shadow-lg border-0" aria-describedby="change-pairing-desc">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white">
          <DialogTitle className="text-[14px] font-normal text-gray-800" id="change-pairing-desc">匹配第三方商品</DialogTitle>
        </DialogHeader>

        <div className="p-0 bg-white">
          <div className="bg-[#FFFFE0] text-[#D32F2F] text-[13px] text-center p-3 border-b border-gray-200 font-medium">
            匹配第三方商品后，即可通过采购管理进行第三方系统自动下单
          </div>

          <div className="p-4 flex items-center justify-center border-b border-gray-200 bg-[#F8FAFC]">
            <span className="text-[13px] text-gray-700 mr-4">商品链接：</span>
            <div className="flex w-[500px]">
              <Input 
                className="h-9 text-[13px] flex-1 rounded-r-none bg-white border-gray-300 focus-visible:ring-0" 
                value={link}
                onChange={e => setLink(e.target.value)}
              />
              <FeatureMarker title="匹配第三方商品" description="交互说明：点击执行匹配第三方商品操作。">
              <Button className="h-9 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 text-[13px] font-normal rounded-l-none border border-l-0 border-[#6B8EBE]">
                匹配第三方商品
              </Button>
              </FeatureMarker>
            </div>
          </div>

          <table className="w-full text-[13px] border-collapse text-left">
            <thead className="bg-[#F8FAFC] text-gray-700">
              <tr>
                <th className="p-3 font-normal border-b border-r border-gray-200 text-center w-1/3">库存sku信息</th>
                <th colSpan={3} className="p-3 font-normal border-b border-gray-200 text-center w-2/3">第三方商品信息</th>
              </tr>
              <tr className="bg-white">
                <th className="p-3 font-normal border-b border-r border-gray-200"></th>
                <th className="p-3 font-normal border-b border-r border-gray-200 text-center w-24">缩略图</th>
                <th className="p-3 font-normal border-b border-r border-gray-200 text-center">商品名称</th>
                <th className="p-3 font-normal border-b border-gray-200 text-center w-64">商品属性</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-r border-gray-200 bg-[#F8FAFC]">
                  <div className="flex items-center gap-3">
                    <img src={product?.image || 'https://via.placeholder.com/60'} alt="thumb" className="w-14 h-14 object-cover border border-gray-200 rounded flex-shrink-0" />
                    <div className="flex flex-col text-[13px]">
                      <span className="text-blue-500 hover:underline cursor-pointer">{product?.sku || '10006102-0-B0-AMHyper'}</span>
                      <span className="text-gray-500 mt-1 line-clamp-2" title={product?.name}>{product?.name || 'AMHyper世界杯大白鹅摆件服饰_23英寸门廊鹅裙子'}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 border-b border-r border-gray-200 text-center bg-white">
                  <img src="https://via.placeholder.com/60" alt="third-thumb" className="w-14 h-14 object-cover border border-gray-200 rounded mx-auto" />
                </td>
                <td className="p-3 border-b border-r border-gray-200 bg-white">
                  <span className="text-gray-800 line-clamp-2">跨境新品世界杯足球风大白鹅衣服 23寸门廊鹅摆件装饰套装服饰</span>
                </td>
                <td className="p-3 border-b border-gray-200 bg-white text-center">
                  <select className="h-9 w-[200px] border border-gray-300 rounded outline-none text-[13px] px-2 bg-white text-gray-700">
                    <option>23英寸门廊鹅_裙子</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DialogFooter className="p-3 border-t border-gray-200 bg-[#F8FAFC] m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-6" onClick={() => onOpenChange(false)}>确定</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BatchLinkSupplierModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] flex flex-col p-0 overflow-hidden bg-white rounded">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white flex-shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[14px] font-medium text-gray-800">添加供应商</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="text-[13px] text-gray-700 mb-2">搜索供应商：</div>
            <div className="flex w-full">
              <Input 
                className="h-9 text-[13px] flex-1 rounded-r-none bg-white border-gray-300 focus-visible:ring-0" 
                placeholder="请输入供应商" 
              />
              <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
              <Button 
                className="h-9 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 text-[13px] font-normal rounded-l-none border border-l-0 border-[#6B8EBE] gap-1"
              >
                <Search className="w-3.5 h-3.5" /> 搜索
              </Button>
              </FeatureMarker>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-[13px] border-collapse bg-white">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="p-3 font-normal w-[300px]">供应商名称</th>
                  <th className="p-3 font-normal w-[150px] text-center">供应商链接</th>
                  <th className="p-3 font-normal w-[120px] text-center">联系人</th>
                  <th className="p-3 font-normal w-[120px] text-center">联系电话</th>
                  <th className="p-3 font-normal w-[100px] text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: '世界杯足球风大白鹅衣服' },
                  { name: '布吉吉，纯涤，水洗T，3色' },
                  { name: '南昌宏新华食品模具机械有限公司' },
                  { name: '义乌市玉姿澜饰品有限公司' },
                  { name: '义乌市哲倩饰品有限公司' },
                  { name: '义乌市尊信电子商务有限公司' },
                  { name: '汕头市澄海区积品汇玩具商行（个体工商户）' },
                  { name: '临沂佳童商贸有限公司' },
                  { name: '青岛银河记工艺品有限公司' },
                  { name: '义乌市夏裴饰品有限公司' },
                ].map((s, i) => (
                  <tr key={i} className="hover:bg-blue-50/30">
                    <td className="p-3 text-blue-600">{s.name}</td>
                    <td className="p-3 text-center text-blue-500"><span className="cursor-pointer hover:underline text-[16px]">🔗</span></td>
                    <td className="p-3 text-center"></td>
                    <td className="p-3 text-center"></td>
                    <td className="p-3 text-center">
                      <FeatureMarker title="选择" description="交互说明：点击执行选择操作。">
<span className="text-blue-600 cursor-pointer hover:underline" onClick={() => onOpenChange(false)}>选择</span>
</FeatureMarker>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-3 border-t border-gray-200 text-[12px] text-gray-600 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <span>每页</span>
              <select className="border border-gray-300 rounded outline-none h-6 px-1 bg-white">
                <option>10 条</option>
              </select>
              <span>共9137条 当前显示第1-10条 1/914页</span>
              <div className="flex items-center gap-1 ml-2">
                <FeatureMarker title="&lt;&lt;" description="交互说明：点击执行&lt;&lt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-gray-50 text-gray-400">&lt;&lt;</button>
</FeatureMarker>
                <FeatureMarker title="&lt;" description="交互说明：点击执行&lt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-gray-50 text-gray-400">&lt;</button>
</FeatureMarker>
                <FeatureMarker title="1" description="交互说明：点击执行1操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent text-red-500 font-medium">1</button>
</FeatureMarker>
                <FeatureMarker title="2" description="交互说明：点击执行2操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-100 rounded text-gray-600">2</button>
</FeatureMarker>
                <FeatureMarker title="3" description="交互说明：点击执行3操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-100 rounded text-gray-600">3</button>
</FeatureMarker>
                <FeatureMarker title="4" description="交互说明：点击执行4操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-100 rounded text-gray-600">4</button>
</FeatureMarker>
                <FeatureMarker title="5" description="交互说明：点击执行5操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent hover:bg-gray-100 rounded text-gray-600">5</button>
</FeatureMarker>
                <FeatureMarker title="&gt;" description="交互说明：点击执行&gt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-600">&gt;</button>
</FeatureMarker>
                <FeatureMarker title="&gt;&gt;" description="交互说明：点击执行&gt;&gt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-600">&gt;&gt;</button>
</FeatureMarker>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-gray-50 font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>关闭</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BatchSetDefaultSupplierModal({ open, onOpenChange, products }: { open: boolean, onOpenChange: (open: boolean) => void, products: any[] }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] flex flex-col p-0 overflow-hidden bg-white rounded">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white flex-shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[14px] font-medium text-gray-800">批量设置默认供应商</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col bg-gray-50/50">
          <div className="flex items-center w-full border-b border-gray-200 bg-white">
            <div className="px-4 py-2 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50">库存SKU...</div>
            <div className="flex flex-1">
              <Input 
                className="h-10 text-[13px] flex-1 rounded-none border-0 focus-visible:ring-0 px-4" 
                placeholder="请输入要查询的商品" 
              />
              <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
              <Button 
                className="h-10 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 text-[13px] font-normal rounded-none gap-1"
              >
                <Search className="w-3.5 h-3.5" /> 搜索
              </Button>
              </FeatureMarker>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar bg-white">
            <table className="w-full text-center text-[13px] border-collapse">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="p-3 font-normal w-24">缩略图</th>
                  <th className="p-3 font-normal w-[200px] text-left">库存SKU</th>
                  <th className="p-3 font-normal text-left">中文名称</th>
                  <th className="p-3 font-normal w-[180px]">当前默认供应商</th>
                  <th className="p-3 font-normal w-[220px]">设置默认供应商</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-blue-50/30">
                    <td className="p-3">
                      <img src={p.image || 'https://via.placeholder.com/60'} alt="thumb" className="w-14 h-14 object-cover border border-gray-200 rounded mx-auto" />
                    </td>
                    <td className="p-3 text-left">
                      <span className="text-blue-600 hover:underline cursor-pointer font-medium">{p.sku}</span>
                    </td>
                    <td className="p-3 text-left text-gray-800">
                      {p.name}
                    </td>
                    <td className="p-3 text-gray-600">
                      <div className="line-clamp-2" title={p.defaultSupplier || '世界杯足球风大白鹅衣服'}>
                        {p.defaultSupplier || '世界杯足球风大白鹅衣服'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Select defaultValue="1">
                          <SelectTrigger className="h-8 text-[12px] bg-white border-gray-300 w-full">
                            <SelectValue placeholder="请选择" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">世界杯足球风大白鹅衣服</SelectItem>
                            <SelectItem value="2">其他供应商</SelectItem>
                          </SelectContent>
                        </Select>
                        <FeatureMarker title="➤" description="交互说明：点击执行➤操作。">
                        <Button variant="outline" className="h-8 w-8 p-0 flex-shrink-0 border-gray-300 text-blue-600">
                          <span className="transform -rotate-45">➤</span>
                        </Button>
                        </FeatureMarker>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-between flex-row-reverse items-center">
          <div className="flex gap-2">
            <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-6" onClick={() => onOpenChange(false)}>确定</Button>
</FeatureMarker>
            <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-gray-50 font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>关闭</Button>
</FeatureMarker>
          </div>
          <div className="text-[13px] text-[#B8860B] font-medium pl-4">
            如果当前SKU只关联一个供应商，那么确认后该供应商为此SKU默认供应商
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BatchChangePairingModal({ open, onOpenChange, products }: { open: boolean, onOpenChange: (open: boolean) => void, products: any[] }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] flex flex-col p-0 overflow-hidden bg-white rounded">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white flex-shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[14px] font-medium text-gray-800">匹配第三方商品</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="p-3 bg-[#FFF8E6] text-[#B8860B] text-[13px] border-b border-gray-200">
            匹配第三方商品后，即可通过采购管理进行第三方系统自动下单
          </div>

          <table className="w-full text-[13px] border-collapse text-center">
            <thead className="bg-[#F8FAFC] text-gray-700">
              <tr>
                <th className="p-3 font-normal border-b border-r border-gray-200 w-[350px]">库存sku信息</th>
                <th colSpan={3} className="p-3 font-normal border-b border-r border-gray-200">第三方商品信息</th>
                <th className="p-3 font-normal border-b border-gray-200 w-[80px]">操作</th>
              </tr>
              <tr className="bg-white">
                <th className="p-3 font-normal border-b border-r border-gray-200"></th>
                <th className="p-3 font-normal border-b border-r border-gray-200 w-24">缩略图</th>
                <th className="p-3 font-normal border-b border-r border-gray-200 text-left">商品名称</th>
                <th className="p-3 font-normal border-b border-r border-gray-200 w-[250px]">商品属性</th>
                <th className="p-3 font-normal border-b border-gray-200"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={product.id || idx} className="bg-white">
                  <td className="p-3 border-b border-r border-gray-200 bg-[#F8FAFC] text-left">
                    <div className="flex items-start gap-3">
                      <img src={product?.image || 'https://via.placeholder.com/60'} alt="thumb" className="w-16 h-16 object-cover border border-gray-200 rounded flex-shrink-0" />
                      <div className="flex flex-col text-[13px] flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 hover:underline cursor-pointer">{product?.sku || '10006102-0-B0-AMHyper'}</span>
                          <span className="text-blue-400 hover:underline cursor-pointer text-[12px] whitespace-nowrap ml-2">【商品链接】 <span className="text-[14px]">🔗</span></span>
                        </div>
                        <span className="text-gray-500 mt-1 line-clamp-2 leading-tight" title={product?.name}>{product?.name || 'AMHyper世界杯大白鹅摆件服饰_23英寸门廊鹅裙子'}</span>
                      </div>
                    </div>
                  </td>
                  {product.has1688Link ? (
                    <>
                      <td className="p-3 border-b border-r border-gray-200">
                        <img src="https://via.placeholder.com/60" alt="third-thumb" className="w-16 h-16 object-cover border border-gray-200 rounded mx-auto" />
                      </td>
                      <td className="p-3 border-b border-r border-gray-200 text-left">
                        <span className="text-gray-800 line-clamp-2 leading-tight">跨境新品世界杯足球风大白鹅衣服 23寸门廊鹅摆件装饰套装服饰</span>
                      </td>
                      <td className="p-3 border-b border-r border-gray-200">
                        <Select defaultValue="1">
                          <SelectTrigger className="h-9 w-full border border-gray-300 rounded outline-none text-[13px] bg-white text-gray-700">
                            <SelectValue placeholder="请选择" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">23英寸门廊鹅_裙子</SelectItem>
                            <SelectItem value="2">其他属性</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </>
                  ) : (
                    <td colSpan={3} className="p-0 border-b border-r border-gray-200 bg-[#F8FAFC]">
                      <div className="flex items-center justify-center gap-3 h-full min-h-[80px] text-gray-500">
                        <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-300 text-2xl">☹️</div>
                        <div className="flex flex-col text-left">
                          <div className="font-medium text-[14px]">暂无内容！</div>
                          <div className="text-[13px]">请添加商品链接</div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="p-3 border-b border-gray-200 bg-[#F8FAFC]">
                    <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<span className="text-red-500 cursor-pointer hover:underline text-[13px]" onClick={() => onOpenChange(false)}>取消</span>
</FeatureMarker>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-6" onClick={() => onOpenChange(false)}>确定</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-gray-50 font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
