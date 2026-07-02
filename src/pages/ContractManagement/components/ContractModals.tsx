import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const CHECKBOX_GROUPS = [
  {
    title: '合同信息',
    items: ['合同注意事项', '盖章信息', '采购方信息', '打印时间', '创建时间']
  },
  {
    title: '采购单信息',
    items: [
      '采购单号', '关联订单编号', '交易号', '仓库名称', '仓位', 
      '含税单价', '单价(原始货币)', '正唛', '金额(原始货币)', '税金', 
      '折扣金额', '到货日期', '交货日期', '订单备注', '付款方式', 
      '审核人', '自定义分类', '供应商账号名称', '供应商收款账号', '供应商收款人', 
      '采购备注', '合计金额', '合计重量', 'SKU种类', 'SKU总数', 
      '运费', '供应方', '供应方地址', '供应方联系人', '供应方电话', '供应方手机'
    ]
  },
  {
    title: '采购单-装箱信息',
    items: [
      '箱数', '装箱数', '装箱体积(m³)', '商品总体积(m³)', '装箱毛重(kg)', 
      '商品总重量(kg)', '合计', '单品体积(cm³)', '单品毛重(kg)', '合计装箱重量(kg)', '合计装箱体积(m³)'
    ]
  },
  {
    title: '商品-基本信息',
    items: ['库存SKU', '缩略图', '原厂SKU', '供应商SKU', '中文名称', '英文名称', '商品备注', '商品父品牌']
  },
  {
    title: '商品-扩展属性',
    items: ['品牌类型', '成分含量', '是否有扣', '是否有拉链', '是否有领', '是否背心', '材质', '类别']
  },
  {
    title: '商品-申报信息',
    items: ['申报品名(中文)', '申报品名(英文)', '商品单位', '单品重量(g)']
  },
  {
    title: '商品-辅助信息',
    items: ['装箱数', '装箱尺寸', '装箱毛重', '商品尺寸', '商品材质', '商品用途']
  }
];

export function AddEditContractModal({ open, onOpenChange, contract }: { open: boolean, onOpenChange: (open: boolean) => void, contract?: any }) {
  const [printFormat, setPrintFormat] = useState('竖版');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white rounded">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white flex-shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[15px] font-bold text-gray-800">合同设置</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-white flex flex-col gap-6">
          
          <div className="flex items-center">
            <div className="w-[120px] text-[13px] text-gray-700 text-right pr-4">模板名称:</div>
            <div className="flex-1 max-w-[800px]">
              <Input className="h-9 text-[13px] bg-white border-gray-300" defaultValue={contract?.name} />
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-[120px] text-[13px] text-gray-700 text-right pr-4">打印版式:</div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-1.5 text-[13px] text-gray-700 cursor-pointer">
                <input type="radio" name="printFormat" checked={printFormat === '竖版'} onChange={() => setPrintFormat('竖版')} className="text-orange-500 focus:ring-orange-500" /> 竖版
              </label>
              <label className="flex items-center gap-1.5 text-[13px] text-gray-700 cursor-pointer">
                <input type="radio" name="printFormat" checked={printFormat === '横版'} onChange={() => setPrintFormat('横版')} className="text-orange-500 focus:ring-orange-500" /> 横版
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[13px] text-gray-500">合同显示项:</div>
              <div className="text-[13px] text-gray-400">合同打印设置</div>
            </div>
            
            <div className="flex flex-col gap-4">
              {CHECKBOX_GROUPS.map((group, gIdx) => (
                <div key={gIdx} className="flex items-start">
                  <div className="w-[150px] flex items-center gap-2 flex-shrink-0 mt-1">
                    <Checkbox id={`group-${gIdx}`} defaultChecked className="border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white" />
                    <label htmlFor={`group-${gIdx}`} className="text-[13px] text-gray-800 font-medium cursor-pointer">{group.title}</label>
                  </div>
                  <div className="flex-1 flex flex-wrap gap-x-6 gap-y-3">
                    {group.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-center gap-1.5 min-w-[160px]">
                        <Checkbox id={`item-${gIdx}-${iIdx}`} defaultChecked className="border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white rounded-sm w-4 h-4" />
                        <label htmlFor={`item-${gIdx}-${iIdx}`} className="text-[13px] text-gray-600 cursor-pointer">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="text-[13px] text-gray-500 mb-4">采购方信息:</div>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-w-[1000px]">
              {[
                { label: '合同名称', key: 'contractName' }, { label: '联系人', key: 'contact' },
                { label: '采购方', key: 'buyer' }, { label: '联系人电话', key: 'contactPhone' },
                { label: '收货人', key: 'receiver' }, { label: '传真', key: 'fax' },
                { label: '电话', key: 'phone' }, { label: '其他联系人', key: 'otherContact' },
                { label: '地址', key: 'address' }, { label: '其他联系人电话', key: 'otherContactPhone' },
                { label: '收货地址', key: 'receiveAddress' }, { label: '其他联系人传真', key: 'otherContactFax' },
              ].map((field, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-[100px] text-[13px] text-gray-700 text-right pr-4">{field.label}:</div>
                  <Input className="h-9 text-[13px] flex-1 bg-white border-gray-300" />
                </div>
              ))}
              
              <div className="col-span-2 flex items-center">
                <div className="w-[100px] text-[13px] text-gray-700 text-right pr-4">公司logo:</div>
                <div className="flex flex-1">
                  <Input className="h-9 text-[13px] flex-1 rounded-r-none bg-white border-gray-300" placeholder="请输入验证地址" />
                  <FeatureMarker title="验证地址" description="交互说明：点击执行验证地址操作。">
<Button className="h-9 bg-[#F59A23] hover:bg-[#E08A1B] text-white px-6 text-[13px] font-normal rounded-l-none border border-l-0 border-[#F59A23]">验证地址</Button>
</FeatureMarker>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center">
                <div className="w-[100px] text-[13px] text-gray-700 text-right pr-4">电子章:</div>
                <div className="flex flex-1">
                  <Input className="h-9 text-[13px] flex-1 rounded-r-none bg-white border-gray-300" placeholder="请输入验证地址" />
                  <FeatureMarker title="验证地址" description="交互说明：点击执行验证地址操作。">
<Button className="h-9 bg-[#F59A23] hover:bg-[#E08A1B] text-white px-6 text-[13px] font-normal rounded-l-none border border-l-0 border-[#F59A23]">验证地址</Button>
</FeatureMarker>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center">
                <div className="w-[100px] text-[13px] text-gray-700 text-right pr-4">公章尺寸:</div>
                <div className="flex items-center gap-2">
                  <Input className="h-9 w-24 text-[13px] bg-white border-gray-300 text-center" />
                  <span className="text-[13px] text-gray-600">cm</span>
                  <span className="text-[13px] text-gray-400 mx-2">x</span>
                  <Input className="h-9 w-24 text-[13px] bg-white border-gray-300 text-center" />
                  <span className="text-[13px] text-gray-600">cm</span>
                </div>
              </div>
              
              <div className="col-span-2 flex items-start">
                <div className="w-[100px] text-[13px] text-gray-700 text-right pr-4 pt-2">合同注意事项:</div>
                <div className="flex-1 relative">
                  <Textarea className="min-h-[120px] text-[13px] bg-white border-gray-300 resize-none pb-8" />
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[12px] text-blue-500 cursor-pointer hover:underline">
                    切换成富文本 <span className="w-3.5 h-3.5 border border-blue-500 rounded-full flex items-center justify-center text-[10px]">i</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-3 flex-shrink-0">
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-9 text-[13px] bg-white font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>取消</Button>
</FeatureMarker>
          <FeatureMarker title="预览合同模板" description="交互说明：点击执行预览合同模板操作。">
          <Button 
            className="h-9 text-[13px] bg-[#F59A23] hover:bg-[#E08A1B] text-white font-normal px-6"
            onClick={() => window.open('https://example.com/contract-preview.pdf', '_blank')}
          >
            预览合同模板
          </Button>
          </FeatureMarker>
          <FeatureMarker title="确认" description="交互说明：校验表单数据并提交保存。">
<Button className="h-9 text-[13px] bg-[#F59A23] hover:bg-[#E08A1B] text-white font-normal px-6" onClick={() => onOpenChange(false)}>确认</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LinkSupplierModal({ open, onOpenChange, contract }: { open: boolean, onOpenChange: (open: boolean) => void, contract?: any }) {
  const [suppliers, setSuppliers] = useState(['义乌市奥韵日用品厂']);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue && !suppliers.includes(inputValue)) {
      setSuppliers([...suppliers, inputValue]);
      setInputValue('');
    }
  };

  const handleRemove = (sup: string) => {
    setSuppliers(suppliers.filter(s => s !== sup));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] flex flex-col p-0 overflow-hidden bg-white rounded">
        <DialogHeader className="p-3 border-b border-gray-200 bg-white flex-shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[15px] font-medium text-gray-800">关联供应商</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 bg-gray-50/50 p-6 flex flex-col gap-4">
          <div className="flex items-start">
            <div className="w-[80px] text-[13px] text-gray-700 text-right pr-4 pt-2">供应商</div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex w-full">
                <Input 
                  className="h-9 text-[13px] flex-1 rounded-r-none bg-white border-gray-300 focus-visible:ring-0" 
                  placeholder="添加供应商" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <FeatureMarker title="添加" description="交互说明：点击打开新增弹窗，录入新数据。">
                <Button 
                  className="h-9 bg-[#8CC63F] hover:bg-[#7AB62F] text-white px-6 text-[13px] font-normal rounded-l-none border border-l-0 border-[#8CC63F] gap-1"
                  onClick={handleAdd}
                >
                  <Plus className="w-3.5 h-3.5" /> 添加
                </Button>
                </FeatureMarker>
              </div>
              
              <div className="min-h-[80px] bg-white border border-gray-300 rounded p-2 flex flex-wrap gap-2 items-start content-start">
                {suppliers.map((sup, idx) => (
                  <div key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded border border-gray-200 text-[13px] text-gray-700">
                    {sup}
                    <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => handleRemove(sup)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-3 border-t border-gray-200 bg-white m-0 rounded-none sm:justify-end gap-2 flex-shrink-0">
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