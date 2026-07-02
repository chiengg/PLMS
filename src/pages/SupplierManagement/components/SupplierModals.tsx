import React, { useState, useEffect } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload } from 'lucide-react';
import { Search } from 'lucide-react';

interface ConfirmDisableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmDisableModal({ open, onOpenChange, onConfirm }: ConfirmDisableModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden bg-white shadow-lg border-0">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white">
          <DialogTitle className="text-[14px] font-normal text-gray-600">操作确认</DialogTitle>
        </DialogHeader>
        <div className="p-8 text-[13px] text-red-500 bg-[#F8FAFC]">
          该供应商下所有商品没有设置默认供应商才能够停用，请确认后再操作。
        </div>
        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-6" onClick={() => { onConfirm(); onOpenChange(false); }}>确定</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BatchEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSuppliers: any[];
  onSave: (updatedSuppliers: any[]) => void;
}

export function BatchEditModal({ open, onOpenChange, selectedSuppliers, onSave }: BatchEditModalProps) {
  const [formData, setFormData] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      setFormData(selectedSuppliers.map(s => ({ ...s })));
    }
  }, [open, selectedSuppliers]);

  const handleChange = (id: string, field: string, value: string) => {
    setFormData(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] max-h-[80vh] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="p-4 border-b border-gray-100 bg-[#F5F7FA] flex-shrink-0">
          <DialogTitle className="text-[14px] font-normal text-blue-600">批量修改</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          <table className="w-full text-center text-[12px] border-collapse">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="p-2 font-normal w-40">供应商</th>
                <th className="p-2 font-normal w-48">供应商链接</th>
                <th className="p-2 font-normal w-24">联系人</th>
                <th className="p-2 font-normal w-32">联系电话</th>
                <th className="p-2 font-normal w-24">QQ</th>
                <th className="p-2 font-normal w-24">旺旺</th>
                <th className="p-2 font-normal w-32">采购员</th>
              </tr>
            </thead>
            <tbody>
              {formData.map(s => (
                <tr key={s.id} className="border-b border-gray-100">
                  <td className="p-2">
                    <div className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-left truncate">{s.name}</div>
                  </td>
                  <td className="p-2">
                    <Input className="h-8 text-[12px]" value={s.link1688 || ''} onChange={e => handleChange(s.id, 'link1688', e.target.value)} />
                  </td>
                  <td className="p-2">
                    <Input className="h-8 text-[12px]" value={s.contactName !== '--' ? s.contactName : ''} onChange={e => handleChange(s.id, 'contactName', e.target.value)} />
                  </td>
                  <td className="p-2">
                    <Input className="h-8 text-[12px]" value={s.contactPhone !== '--' ? s.contactPhone : ''} onChange={e => handleChange(s.id, 'contactPhone', e.target.value)} />
                  </td>
                  <td className="p-2">
                    <Input className="h-8 text-[12px]" value={s.qq || ''} onChange={e => handleChange(s.id, 'qq', e.target.value)} />
                  </td>
                  <td className="p-2">
                    <Input className="h-8 text-[12px]" value={s.wangwang || ''} onChange={e => handleChange(s.id, 'wangwang', e.target.value)} />
                  </td>
                  <td className="p-2 flex items-center gap-1">
                    <select className="h-8 flex-1 border border-gray-300 rounded outline-none text-[12px] bg-white px-1" value={s.buyer !== '--' ? s.buyer : ''} onChange={e => handleChange(s.id, 'buyer', e.target.value)}>
                      <option value="">请选择采购员</option>
                      <option value="Yanny">Yanny</option>
                    </select>
                    <span className="text-blue-500 cursor-pointer p-1">➤</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter className="p-4 border-t border-gray-100 bg-[#F5F7FA] flex-shrink-0 m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="同步设置关联商品采购员 ▾" description="交互说明：点击执行同步设置关联商品采购员 ▾操作。">
<Button variant="outline" className="h-8 text-[13px] bg-white">同步设置关联商品采购员 ▾</Button>
</FeatureMarker>
          <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white" onClick={() => onSave(formData)}>确定</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BatchSetLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSuppliers: any[];
  onSave: (updatedSuppliers: any[]) => void;
}

export function BatchSetLinkModal({ open, onOpenChange, selectedSuppliers, onSave }: BatchSetLinkModalProps) {
  const [formData, setFormData] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      setFormData(selectedSuppliers.map(s => ({ ...s })));
    }
  }, [open, selectedSuppliers]);

  const handleChange = (id: string, value: string) => {
    setFormData(prev => prev.map(s => s.id === id ? { ...s, link1688: value } : s));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="p-4 border-b border-gray-100 bg-white flex-shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[14px] font-normal text-gray-800">批量设置第三方供应商</DialogTitle>
        </DialogHeader>
        <div className="bg-[#FFF8E6] text-red-500 text-[12px] p-4 border-b border-gray-200">
          填写供应商链接后，会自动判断并关联1688供应商。如果修改供应商链接，将会清理供应商下关联商品与1688商品匹配关系，需要重新进行匹配。
        </div>
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          <table className="w-full text-center text-[12px] border-collapse">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="p-2 font-normal w-1/3">供应商</th>
                <th className="p-2 font-normal w-2/3">供应商链接</th>
              </tr>
            </thead>
            <tbody>
              {formData.map(s => (
                <tr key={s.id} className="border-b border-gray-100">
                  <td className="p-2 text-gray-800">{s.name}</td>
                  <td className="p-2">
                    <Input className="h-8 text-[12px]" placeholder="请输入供应商链接" value={s.link1688 || ''} onChange={e => handleChange(s.id, e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter className="p-4 border-t border-gray-100 bg-[#F5F7FA] flex-shrink-0 m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="批量设置" description="交互说明：点击执行批量设置操作。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white" onClick={() => onSave(formData)}>批量设置</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SingleLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: any;
  onSave: (id: string, link: string) => void;
}

export function SingleLinkModal({ open, onOpenChange, supplier, onSave }: SingleLinkModalProps) {
  const [link, setLink] = useState('');

  useEffect(() => {
    if (open && supplier) {
      setLink(supplier.link1688 || '');
    }
  }, [open, supplier]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-0 overflow-hidden bg-white">
        <DialogHeader className="p-4 border-b border-gray-100 bg-white">
          <DialogTitle className="text-[14px] font-normal text-gray-800">设置供应商链接 - {supplier?.name}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Input className="h-8 text-[12px]" placeholder="请输入供应商链接" value={link} onChange={e => setLink(e.target.value)} />
        </div>
        <DialogFooter className="p-4 border-t border-gray-100 bg-[#F5F7FA] m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white" onClick={() => { onSave(supplier.id, link); onOpenChange(false); }}>确定</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditLinkedProductModal({ open, onOpenChange, product, onSave }: any) {
  const [formData, setFormData] = useState({
    link: '',
    currency: 'RMB',
    lastPrice: '0',
    minOrder: '0',
    minMulti: '0'
  });

  useEffect(() => {
    if (open && product) {
      setFormData({
        link: product.link !== '--' && product.link !== '快速访问' ? product.link : '',
        currency: 'RMB',
        lastPrice: product.lastPrice ? product.lastPrice.replace(/[^0-9.]/g, '') : '0',
        minOrder: product.minOrder || '0',
        minMulti: product.minMulti || '0'
      });
    }
  }, [open, product]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 250) {
      handleChange('link', value);
    }
  };

  const handleSave = () => {
    onSave({
      ...product,
      link: formData.link ? '快速访问' : '--',
      lastPrice: `${formData.lastPrice} ${formData.currency}`,
      minOrder: formData.minOrder,
      minMulti: formData.minMulti
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] p-0 overflow-hidden bg-white shadow-lg border-0">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white">
          <DialogTitle className="text-[14px] font-normal text-gray-800">编辑</DialogTitle>
        </DialogHeader>
        
        <div className="p-0 bg-[#F8FAFC]">
          <div className="flex border-b border-gray-200 bg-white min-h-[48px]">
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 flex-shrink-0 bg-[#F8FAFC]">
              库存SKU：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 text-[13px] text-blue-600 bg-white">
              {product?.sku || '--'}
            </div>
          </div>
          
          <div className="flex border-b border-gray-200 bg-white min-h-[48px]">
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 flex-shrink-0 bg-[#F8FAFC]">
              商品网址：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <Input className="h-8 text-[13px] w-full bg-white border-gray-300 focus-visible:ring-0 text-left" placeholder="商品网址，250字符以内！" value={formData.link} onChange={handleLinkChange} maxLength={250} />
            </div>
          </div>
          
          <div className="flex border-b border-gray-200 bg-white min-h-[48px]">
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 flex-shrink-0 bg-[#F8FAFC]">
              币种：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <select className="h-8 w-[240px] border border-gray-300 rounded outline-none text-[13px] px-2 bg-white focus:ring-0 text-left" value={formData.currency} onChange={e => handleChange('currency', e.target.value)}>
                <option value="RMB">RMB</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          
          <div className="flex border-b border-gray-200 bg-white min-h-[48px]">
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 flex-shrink-0 bg-[#F8FAFC]">
              上次采购价：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <Input type="number" min="0" className="h-8 text-[13px] w-[240px] bg-white border-gray-300 focus-visible:ring-0 text-left" value={formData.lastPrice} onChange={e => handleChange('lastPrice', e.target.value)} />
            </div>
          </div>
          
          <div className="flex border-b border-gray-200 bg-white min-h-[48px]">
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 flex-shrink-0 bg-[#F8FAFC]">
              最小起订量：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <Input type="number" min="0" className="h-8 text-[13px] w-[240px] bg-white border-gray-300 focus-visible:ring-0 text-left" value={formData.minOrder} onChange={e => handleChange('minOrder', e.target.value)} />
            </div>
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 border-l border-gray-200 flex-shrink-0 bg-[#F8FAFC]">
              最小订购倍数：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <Input type="number" min="0" className="h-8 text-[13px] w-[240px] bg-white border-gray-300 focus-visible:ring-0 text-left" value={formData.minMulti} onChange={e => handleChange('minMulti', e.target.value)} />
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-6" onClick={handleSave}>确定</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDeleteProductModal({ open, onOpenChange, onConfirm }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-0 overflow-hidden bg-white shadow-lg border-0">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white">
          <DialogTitle className="text-[14px] font-normal text-gray-800">提示</DialogTitle>
        </DialogHeader>
        <div className="p-8 text-[13px] text-gray-700 bg-white flex justify-center">
          <span className="text-orange-400 text-lg mr-2">!</span> 确认删除？删除后无法恢复。
        </div>
        <DialogFooter className="p-3 border-t border-gray-200 bg-[#F8FAFC] m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-6" onClick={() => { onConfirm(); onOpenChange(false); }}>确定</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PurchaseHistoryModal({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] p-0 overflow-hidden bg-white shadow-lg border-0">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white">
          <DialogTitle className="text-[14px] font-normal text-gray-800">查看采购历史</DialogTitle>
        </DialogHeader>
        <div className="p-0 bg-white">
          <table className="w-full text-center text-[13px] border-collapse">
            <thead className="bg-[#F8FAFC] text-gray-600 border-b border-gray-200">
              <tr>
                <th className="p-3 font-normal w-1/5">采购时间</th>
                <th className="p-3 font-normal w-1/5">订单号</th>
                <th className="p-3 font-normal w-1/5">单价(￥)</th>
                <th className="p-3 font-normal w-1/5">数量(件)</th>
                <th className="p-3 font-normal w-1/5">总价(￥)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="p-4 text-gray-500 bg-white">
                  没有采购记录
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-[#F8FAFC] font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ImportSupplierModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] flex flex-col p-0 overflow-hidden bg-white rounded">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white flex-shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[14px] font-medium text-gray-800">关联商品导入</DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col items-center justify-center gap-4 bg-gray-50/50 flex-1">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-2">
            <Upload className="w-8 h-8" />
          </div>
          <div className="text-[13px] text-gray-600">点击此处上传文件，或将文件拖拽到此处</div>
          <div className="text-[12px] text-gray-400">支持 .xlsx, .xls, .csv 格式</div>
        </div>
        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="上传并导入" description="交互说明：点击上传文件并批量导入数据。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-5">上传并导入</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white font-normal px-5 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmBindThirdPartyModal({ open, onOpenChange, supplierName, onConfirm }: { open: boolean, onOpenChange: (open: boolean) => void, supplierName: string, onConfirm: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] flex flex-col p-0 overflow-hidden bg-white rounded">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white flex-shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[14px] font-medium text-gray-800">操作确认</DialogTitle>
        </DialogHeader>
        <div className="p-6 text-[14px] text-gray-700 bg-gray-50/50 flex-1">
          供应商[{supplierName}]未绑定第三方供应商，现在绑定？
        </div>
        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-5" onClick={onConfirm}>确定</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white font-normal px-5 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MatchThirdPartyModal({ open, onOpenChange, supplierName, onMatch }: { open: boolean, onOpenChange: (open: boolean) => void, supplierName: string, onMatch: (link: string) => void }) {
  const [link, setLink] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (link) {
      setSearched(true);
    }
  };

  const handleConfirm = () => {
    onMatch(link);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] flex flex-col p-0 overflow-hidden bg-white rounded">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white flex-shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[14px] font-medium text-gray-800 flex items-center">
            匹配第三方供应商 <span className="text-[#B8860B] ml-1">【供应商：{supplierName}】</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col bg-gray-50/50">
          <div className="p-4 flex items-center gap-4 justify-center border-b border-gray-200">
            <span className="text-[13px] text-gray-700 font-medium">第三方供应商链接：</span>
            <div className="flex w-[400px]">
              <Input 
                className="h-8 text-[13px] flex-1 rounded-r-none bg-white border-gray-300 focus-visible:ring-0" 
                placeholder="请输入第三方供应商链接" 
                value={link} 
                onChange={(e) => setLink(e.target.value)} 
              />
              <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
              <Button 
                className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal rounded-l-none border border-l-0 border-[#6B8EBE]"
                onClick={handleSearch}
              >
                搜索
              </Button>
              </FeatureMarker>
            </div>
          </div>
          
          <table className="w-full text-center text-[13px] border-collapse bg-white">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="p-3 font-normal w-1/2">第三方供应商ID</th>
                <th className="p-3 font-normal w-1/2 border-l border-gray-200">第三方供应商名称</th>
              </tr>
            </thead>
            <tbody>
              {searched ? (
                <tr>
                  <td className="p-4 text-gray-800 border-b border-gray-100">836436994810</td>
                  <td className="p-4 text-gray-800 border-b border-gray-100 border-l border-gray-200">深圳市柿柿顺工艺品有限公司</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={2} className="p-8 text-gray-400">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="确定匹配" description="交互说明：校验表单数据并提交保存。">
          <Button 
            className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-5" 
            onClick={handleConfirm}
            disabled={!searched}
          >
            确定匹配
          </Button>
          </FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AddLinkedProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: any) => void;
}

export function AddLinkedProductModal({ open, onOpenChange, onSave }: AddLinkedProductModalProps) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    currency: 'RMB',
    minPrice: '0',
    lastPrice: '0',
    minOrder: '0',
    minMulti: '0',
    link: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchSKU = () => {
    if (formData.sku.trim()) {
      // Mock search result
      setFormData(prev => ({ 
        ...prev, 
        name: `自动回显商品名称 - ${formData.sku}` 
      }));
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 250) {
      handleChange('link', value);
    }
  };

  const handleSave = () => {
    if (!formData.sku) {
      alert('请输入库存SKU');
      return;
    }
    
    // Add logic to save the product
    onSave({
      id: Date.now().toString(),
      image: 'https://via.placeholder.com/40',
      sku: formData.sku,
      supplierSku: '【暂无】',
      name: formData.name || '--',
      link: formData.link ? '快速访问' : '--',
      minPrice: `${formData.minPrice} ${formData.currency}`,
      lastPrice: `${formData.lastPrice} ${formData.currency}`,
      minOrder: formData.minOrder,
      minMulti: formData.minMulti,
      addTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      isDefault: '是',
      thirdId: '--'
    });
    
    // Reset form
    setFormData({
      sku: '',
      name: '',
      currency: 'RMB',
      minPrice: '0',
      lastPrice: '0',
      minOrder: '0',
      minMulti: '0',
      link: ''
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] p-0 overflow-hidden bg-white shadow-lg border-0">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white">
          <DialogTitle className="text-[14px] font-normal text-gray-800">添加关联商品</DialogTitle>
        </DialogHeader>
        
        <div className="p-0 bg-[#F8FAFC]">
          {/* 第1行 */}
          <div className="flex border-b border-gray-200 bg-white min-h-[48px]">
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 flex-shrink-0 bg-white">
              <span className="text-red-500 mr-1">*</span>库存SKU：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <Input className="h-8 text-[13px] w-[240px] bg-white border-gray-300 focus-visible:ring-0 text-left" value={formData.sku} onChange={e => handleChange('sku', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearchSKU()} />
              <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
              <Button className="h-8 bg-[#85C226] hover:bg-[#74AB1F] text-white px-3 text-[13px] font-normal gap-1 rounded ml-2" onClick={handleSearchSKU}>
                <Search className="w-3.5 h-3.5 text-white" /> 搜索
              </Button>
              </FeatureMarker>
            </div>
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 border-l border-gray-200 flex-shrink-0 bg-white">
              商品名称：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 text-[13px] text-gray-800 px-3 bg-white">
              {formData.name || ''}
            </div>
          </div>
          
          {/* 第2行 */}
          <div className="flex border-b border-gray-200 bg-white min-h-[48px]">
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 flex-shrink-0 bg-white">
              币种：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <select className="h-8 w-[240px] border border-gray-300 rounded outline-none text-[13px] px-2 bg-white focus:ring-0 text-left" value={formData.currency} onChange={e => handleChange('currency', e.target.value)}>
                <option value="RMB">RMB</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 border-l border-gray-200 flex-shrink-0 bg-white">
              最低采购价：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <Input type="number" min="0" className="h-8 text-[13px] w-[240px] bg-white border-gray-300 focus-visible:ring-0 text-left" value={formData.minPrice} onChange={e => handleChange('minPrice', e.target.value)} />
            </div>
          </div>
          
          {/* 第3行 */}
          <div className="flex border-b border-gray-200 bg-white min-h-[48px]">
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 flex-shrink-0 bg-white">
              上次采购价：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <Input type="number" min="0" className="h-8 text-[13px] w-[240px] bg-white border-gray-300 focus-visible:ring-0 text-left" value={formData.lastPrice} onChange={e => handleChange('lastPrice', e.target.value)} />
            </div>
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 border-l border-gray-200 flex-shrink-0 bg-white">
              最小起订量：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <Input type="number" min="0" className="h-8 text-[13px] w-[240px] bg-white border-gray-300 focus-visible:ring-0 text-left" value={formData.minOrder} onChange={e => handleChange('minOrder', e.target.value)} />
            </div>
          </div>
          
          {/* 第4行 */}
          <div className="flex border-b border-gray-200 bg-white min-h-[48px]">
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 flex-shrink-0 bg-white">
              最小订购倍数：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <Input type="number" min="0" className="h-8 text-[13px] w-[240px] bg-white border-gray-300 focus-visible:ring-0 text-left" value={formData.minMulti} onChange={e => handleChange('minMulti', e.target.value)} />
            </div>
            <div className="w-[120px] flex items-center justify-end pr-4 text-[13px] text-gray-700 border-l border-gray-200 flex-shrink-0 bg-white">
              商品链接：
            </div>
            <div className="flex-1 flex items-center justify-start p-2 bg-white">
              <div className="flex w-[240px]">
                <Input className="h-8 text-[13px] flex-1 rounded-r-none bg-white border-gray-300 focus-visible:ring-0 text-left" placeholder="250字符以内" value={formData.link} onChange={handleLinkChange} maxLength={250} />
                <FeatureMarker title="匹配第三方商品" description="交互说明：点击执行匹配第三方商品操作。">
                <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-2 text-[12px] font-normal rounded-l-none border border-l-0 border-[#6B8EBE] whitespace-nowrap">
                  匹配第三方商品
                </Button>
                </FeatureMarker>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="添加" description="交互说明：点击打开新增弹窗，录入新数据。">
<Button className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-6" onClick={handleSave}>添加</Button>
</FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
