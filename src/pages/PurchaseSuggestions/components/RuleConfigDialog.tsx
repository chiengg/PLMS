import { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

interface RuleConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RuleItem {
  id: string;
  days: string;
  valueType: string;
  operator: string;
  percentage: string;
}

export default function RuleConfigDialog({ open, onOpenChange }: RuleConfigDialogProps) {
  const [rules, setRules] = useState<RuleItem[]>([
    { id: '1', days: '1', valueType: '日均销量', operator: '×', percentage: '30' },
    { id: '2', days: '3', valueType: '日均销量', operator: '×', percentage: '20' },
    { id: '3', days: '7', valueType: '日均销量', operator: '×', percentage: '25' },
    { id: '4', days: '15', valueType: '日均销量', operator: '×', percentage: '25' },
  ]);

  const handleAdd = () => {
    setRules([...rules, { 
      id: Date.now().toString(), 
      days: '', 
      valueType: '日均销量', 
      operator: '×', 
      percentage: '' 
    }]);
  };

  const handleRemove = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, field: keyof RuleItem, value: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSave = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 border-0 shadow-lg" showCloseButton={false}>
        <div className="bg-white rounded-t-lg flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <span className="text-[14px] text-gray-700 font-medium">日销售量规则配置</span>
            <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
            <button 
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => onOpenChange(false)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
              </svg>
            </button>
            </FeatureMarker>
          </div>
        </div>

        <div className="bg-[#F8F9FA] flex flex-col justify-center min-h-[300px]">
          <div className="p-6 h-[310px] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[13px] text-gray-500 bg-blue-50 text-blue-600 px-3 py-1.5 rounded flex items-center border border-blue-100">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
                  <path d="M7 0C3.13 0 0 3.13 0 7C0 10.87 3.13 14 7 14C10.87 14 14 10.87 14 7C14 3.13 10.87 0 7 0ZM7.7 10.5H6.3V6.3H7.7V10.5ZM7.7 4.9H6.3V3.5H7.7V4.9Z" fill="currentColor"/>
                </svg>
                计算规则为将下方配置的公式所得结果求和。
              </div>
              <FeatureMarker title="添加公式" description="交互说明：点击打开新增弹窗，录入新数据。">
              <Button variant="outline" size="sm" onClick={handleAdd} className="text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50 h-8 px-3 text-[13px]">
                <Plus className="w-4 h-4 mr-1" />
                添加公式
              </Button>
              </FeatureMarker>
            </div>
            
            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div key={rule.id} className="flex items-center gap-3">
                  {idx > 0 && <span className="text-gray-500 font-medium w-4 text-center">+</span>}
                  {idx === 0 && <span className="w-4" />}
                  
                  <div className="flex items-center gap-2 flex-1 bg-white p-2 rounded border border-gray-200 shadow-sm">
                    <span className="text-[13px] text-gray-600">近</span>
                    <Input 
                      value={rule.days}
                      onChange={(e) => updateRule(rule.id, 'days', e.target.value)}
                      className="w-16 h-8 text-center text-[13px] border-gray-200" 
                      placeholder="天数"
                      type="number"
                    />
                    <span className="text-[13px] text-gray-600">天</span>
                    
                    <Select value={rule.valueType} onValueChange={(v) => updateRule(rule.id, 'valueType', v)}>
                      <SelectTrigger className="w-24 h-8 text-[13px] border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="日均销量">日均销量</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={rule.operator} onValueChange={(v) => updateRule(rule.id, 'operator', v)}>
                      <SelectTrigger className="w-[52px] h-8 text-[13px] border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="×">×</SelectItem>
                        <SelectItem value="÷">÷</SelectItem>
                        <SelectItem value="+">+</SelectItem>
                        <SelectItem value="-">-</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="relative flex-1">
                      <Input 
                        value={rule.percentage}
                        onChange={(e) => updateRule(rule.id, 'percentage', e.target.value)}
                        className="w-full h-8 pr-6 text-[13px] border-gray-200" 
                        placeholder="占比/数值"
                        type="number"
                      />
                      <span className="absolute right-2 top-1.5 text-[13px] text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemove(rule.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  </FeatureMarker>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 bg-white rounded-b-lg gap-2.5 border-t border-[#EBEEF5]">
          <FeatureMarker title="保存" description="交互说明：校验表单数据并提交保存。">
          <Button 
            className="bg-[#7B9ECA] hover:bg-[#6A8DBA] text-white h-[32px] px-5 rounded text-[13px] font-normal min-w-[70px] transition-colors border-0" 
            onClick={handleSave}
          >
            保存
          </Button>
          </FeatureMarker>
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
          <Button 
            variant="outline" 
            className="h-[32px] px-5 rounded text-[13px] font-normal text-[#606266] border-[#DCDFE6] hover:bg-[#F5F7FA] hover:text-[#409EFF] hover:border-[#C6E2FF] min-w-[70px] transition-colors" 
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          </FeatureMarker>
        </div>
      </DialogContent>
    </Dialog>
  );
}