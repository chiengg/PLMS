import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronUp } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface EditSupplierProps {
  supplier: any;
  onBack: () => void;
}

export default function EditSupplier({ supplier, onBack }: EditSupplierProps) {
  const isEdit = !!supplier;
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    link: supplier?.link1688 || '',
    email: supplier?.email || '',
    contactName: supplier?.contactName || '',
    phone: supplier?.contactPhone || '',
    qq: supplier?.qq || '',
    tel: supplier?.tel || '',
    wangwang: supplier?.wangwang || '',
    receiver: supplier?.receiver || '',
    arriveDays: supplier?.arriveDays || '0',
    receiveMethod: supplier?.receiveMethod || '',
    paymentMethod: supplier?.paymentMethod || '',
    accountName: supplier?.accountName || '',
    accountNo: supplier?.accountNo || '',
    addressProv: supplier?.addressProv || '',
    addressDetail: supplier?.address || '',
    status: supplier?.status || '启用',
    buyer: supplier?.buyer || '',
    tempBuyer: supplier?.tempBuyer || '',
    tradeType1688: supplier?.tradeType1688 || '',
    orderType1688: supplier?.orderType1688 || '',
    isFactory: supplier?.isFactory || '否',
    taxRate: supplier?.taxRate || '',
    invoiceType: supplier?.invoiceType || '普票',
    currency: supplier?.currency || 'RMB',
    note: supplier?.note || '',
    category: supplier?.customCategory || ''
  });

  const [globalSuppliers, setGlobalSuppliers] = useLocalStorage<any[]>('suppliers_data_v1', []);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('请输入供应商名称');
      return;
    }
    if (isEdit) {
      setGlobalSuppliers(prev => prev.map(s => s.id === supplier.id ? { ...s, ...formData } : s));
    } else {
      const newSupplier = {
        id: Date.now().toString(),
        ...formData,
        linkedSkuCount: 0,
        purchaseCount: 0,
        createTime: new Date().toISOString().split('T')[0],
        lastPurchaseTime: '-暂无-',
        creator: '当前用户',
        type: '普通'
      };
      setGlobalSuppliers(prev => [newSupplier, ...prev]);
    }
    alert('保存成功！');
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] overflow-hidden">
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        
        {/* 基本信息 */}
        <div className="bg-white border border-gray-200 rounded mb-4">
          <div className="bg-[#F8FAFC] border-b border-gray-200 p-3 text-[13px] text-gray-800 font-medium flex justify-between items-center">
            基本信息(* 为必填项，! 非常重要，但不是必填)
            <ChevronUp className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
          <div className="p-6 grid grid-cols-2 gap-x-12 gap-y-4 text-[13px]">
            <div className="flex items-center">
              <span className="w-32 text-right text-red-500 mr-4">* 供应商：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
            </div>
            <div></div>

            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">供应商链接：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.link} onChange={e => handleChange('link', e.target.value)} />
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">通知方式：</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1"><input type="radio" name="notify" /> 短信消息</label>
                <label className="flex items-center gap-1"><input type="radio" name="notify" /> 邮件通知</label>
              </div>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-red-500 mr-4">! 邮箱：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-red-500 mr-4">! 联系人：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.contactName} onChange={e => handleChange('contactName', e.target.value)} />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-red-500 mr-4">! 联系手机号：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">QQ：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.qq} onChange={e => handleChange('qq', e.target.value)} />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-red-500 mr-4">! 联系电话：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.tel} onChange={e => handleChange('tel', e.target.value)} />
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">旺旺：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.wangwang} onChange={e => handleChange('wangwang', e.target.value)} />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">收款人：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.receiver} onChange={e => handleChange('receiver', e.target.value)} />
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">到货周期/天：</span>
              <Input type="number" className="flex-1 h-8 text-[12px]" value={formData.arriveDays} onChange={e => handleChange('arriveDays', e.target.value)} />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">收款方式：</span>
              <select className="flex-1 h-8 border border-gray-300 rounded px-2 outline-none" value={formData.receiveMethod} onChange={e => handleChange('receiveMethod', e.target.value)}>
                <option value="">-请选择-</option>
                <option value="支付宝">支付宝</option>
                <option value="银行卡">银行卡</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">付款方式：</span>
              <select className="flex-1 h-8 border border-gray-300 rounded px-2 outline-none" value={formData.paymentMethod} onChange={e => handleChange('paymentMethod', e.target.value)}>
                <option value="">-请选择-</option>
                <option value="现付">现付</option>
                <option value="月结">月结</option>
              </select>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">账号名称：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.accountName} onChange={e => handleChange('accountName', e.target.value)} />
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">收款账号：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.accountNo} onChange={e => handleChange('accountNo', e.target.value)} />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-red-500 mr-4">! 地址：</span>
              <div className="flex-1 flex gap-2">
                <select className="h-8 w-24 border border-gray-300 rounded px-1 outline-none" value={formData.addressProv} onChange={e => handleChange('addressProv', e.target.value)}>
                  <option value="">-请选择-</option>
                  <option value="广东">广东</option>
                  <option value="浙江">浙江</option>
                </select>
                <Input className="flex-1 h-8 text-[12px]" value={formData.addressDetail} onChange={e => handleChange('addressDetail', e.target.value)} />
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-red-500 mr-4">* 状态：</span>
              <select className="flex-1 h-8 border border-gray-300 rounded px-2 outline-none" value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                <option value="启用">启用</option>
                <option value="停用">停用</option>
              </select>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">采购员：</span>
              <select className="flex-1 h-8 border border-gray-300 rounded px-2 outline-none" value={formData.buyer} onChange={e => handleChange('buyer', e.target.value)}>
                <option value="">-请选择采购员-</option>
                <option value="采购员A">采购员A</option>
                <option value="Yanny">Yanny</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">临时采购员：</span>
              <select className="flex-1 h-8 border border-gray-300 rounded px-2 outline-none" value={formData.tempBuyer} onChange={e => handleChange('tempBuyer', e.target.value)}>
                <option value="">-请选择临时采购员-</option>
                <option value="临时员A">临时员A</option>
              </select>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">1688交易方式：</span>
              <select className="flex-1 h-8 border border-gray-300 rounded px-2 outline-none" value={formData.tradeType1688} onChange={e => handleChange('tradeType1688', e.target.value)}>
                <option value="">-请选择-</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">1688订单类型：</span>
              <select className="flex-1 h-8 border border-gray-300 rounded px-2 outline-none" value={formData.orderType1688} onChange={e => handleChange('orderType1688', e.target.value)}>
                <option value="">请选择订单类型</option>
              </select>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">是否加工厂商：</span>
              <select className="flex-1 h-8 border border-gray-300 rounded px-2 outline-none" value={formData.isFactory} onChange={e => handleChange('isFactory', e.target.value)}>
                <option value="否">否</option>
                <option value="是">是</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">税率：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.taxRate} onChange={e => handleChange('taxRate', e.target.value)} />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">默认发票类型：</span>
              <select className="flex-1 h-8 border border-gray-300 rounded px-2 outline-none" value={formData.invoiceType} onChange={e => handleChange('invoiceType', e.target.value)}>
                <option value="普票">普票</option>
                <option value="专票">专票</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="w-32 text-right text-gray-600 mr-4">下单默认币种：</span>
              <select className="flex-1 h-8 border border-gray-300 rounded px-2 outline-none" value={formData.currency} onChange={e => handleChange('currency', e.target.value)}>
                <option value="RMB">RMB</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="flex items-center col-span-2">
              <span className="w-32 text-right text-gray-600 mr-4">备注：</span>
              <Input className="flex-1 h-8 text-[12px]" value={formData.note} onChange={e => handleChange('note', e.target.value)} />
            </div>

            <div className="flex items-center col-span-2">
              <span className="w-32 text-right text-gray-600 mr-4">附件或截图：</span>
              <div className="flex gap-2">
                <FeatureMarker title="浏览" description="交互说明：点击执行浏览操作。">
<Button variant="outline" className="h-8 text-[12px] bg-[#6B8EBE] text-white hover:bg-[#5A7BA8] hover:text-white border-0">浏览</Button>
</FeatureMarker>
                <FeatureMarker title="上传" description="交互说明：点击执行上传操作。">
<Button variant="outline" className="h-8 text-[12px] bg-[#6B8EBE] text-white hover:bg-[#5A7BA8] hover:text-white border-0">上传</Button>
</FeatureMarker>
              </div>
            </div>
          </div>
        </div>

        {/* 自定义分类 */}
        <div className="bg-white border border-gray-200 rounded mb-4">
          <div className="bg-[#F8FAFC] border-b border-gray-200 p-3 text-[13px] text-gray-800 font-medium">
            自定义分类
          </div>
          <div className="p-6 flex items-center text-[13px]">
            <span className="w-32 text-right text-gray-600 mr-4">分类设置：</span>
            <label className="flex items-center gap-1">
              <Checkbox checked={formData.category === '零散供应商'} onCheckedChange={(c) => handleChange('category', c ? '零散供应商' : '')} />
              零散供应商
            </label>
          </div>
        </div>

        {/* 采购合同 */}
        <div className="bg-white border border-gray-200 rounded mb-4">
          <div className="bg-[#F8FAFC] border-b border-gray-200 p-3 text-[13px] text-gray-800 font-medium flex justify-between items-center">
            采购合同
            <FeatureMarker title="+ 添加" description="交互说明：点击打开新增弹窗，录入新数据。">
<Button className="h-7 bg-[#85C226] hover:bg-[#74AB1F] text-white text-[12px] px-3">+ 添加</Button>
</FeatureMarker>
          </div>
          <div className="p-0">
            <table className="w-full text-center text-[13px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="p-2 font-normal border-r border-gray-200">采购合同</th>
                  <th className="p-2 font-normal border-r border-gray-200">默认采购合同</th>
                  <th className="p-2 font-normal">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400 border-b border-gray-200">
                    暂无采购合同数据
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 扩展属性 */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="bg-[#F8FAFC] border-b border-gray-200 p-3 text-[13px] text-gray-800 font-medium flex justify-between items-center">
            <div className="flex items-center gap-4">
              扩展属性 <span className="text-orange-500 font-normal">需要调整扩展属性时，请至系统设置进行维护</span>
            </div>
            <ChevronUp className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="p-3 border-t border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
        <FeatureMarker title="返回" description="交互说明：点击执行返回操作。">
<Button variant="outline" className="h-8 px-6 font-normal bg-gray-50" onClick={onBack}>返回</Button>
</FeatureMarker>
        <div className="flex items-center gap-2">
          <FeatureMarker title="同步设置关联商品采购员 ▾" description="交互说明：点击执行同步设置关联商品采购员 ▾操作。">
<Button variant="outline" className="h-8 px-4 font-normal bg-white text-gray-600">同步设置关联商品采购员 ▾</Button>
</FeatureMarker>
          <FeatureMarker title="保存" description="交互说明：校验表单数据并提交保存。">
<Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-8 font-normal" onClick={handleSave}>保存</Button>
</FeatureMarker>
        </div>
      </div>
    </div>
  );
}
