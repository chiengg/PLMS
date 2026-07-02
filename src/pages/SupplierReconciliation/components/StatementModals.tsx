import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Loader2 } from 'lucide-react';

export function GenerateStatementModal({ onClose, onGenerate }: { onClose: () => void, onGenerate: (data: any) => void }) {
  const [statementType, setStatementType] = useState<'daily' | 'monthly'>('daily');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [supplier, setSupplier] = useState('');
  const [platform, setPlatform] = useState('全部');
  const [purchaser, setPurchaser] = useState('');

  const [showSupplierOptions, setShowSupplierOptions] = useState(false);
  const [showPurchaserOptions, setShowPurchaserOptions] = useState(false);

  const mockSuppliers = ['全部', '义乌市佳奇服饰有限公司', '广州市顺达皮革有限公司', '深圳市鑫源科技有限公司'];
  const mockPurchasers = ['全部', '张三', '李四', '王五'];

  const filteredSuppliers = mockSuppliers.filter(s => s.includes(supplier));
  const filteredPurchasers = mockPurchasers.filter(p => p.includes(purchaser));

  const handleGenerate = () => {
    if (statementType === 'daily' && !date) return;
    if (statementType === 'monthly' && !month) return;
    
    onGenerate({
      type: statementType === 'daily' ? '日账单' : '月账单',
      date: statementType === 'daily' ? date : month,
      supplier: supplier || '全部',
      platform,
      purchaser: purchaser || '全部',
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-800 text-[16px] font-medium border-b border-gray-100 pb-3">生成账单</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-700 w-20 text-right">账单类型:</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="statementType" 
                  value="daily" 
                  checked={statementType === 'daily'}
                  onChange={() => setStatementType('daily')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[13px] text-gray-700">日账单</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="statementType" 
                  value="monthly" 
                  checked={statementType === 'monthly'}
                  onChange={() => setStatementType('monthly')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[13px] text-gray-700">月账单</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-700 w-20 text-right"><span className="text-red-500 mr-1">*</span>{statementType === 'daily' ? '选择日期' : '选择月份'}:</span>
            {statementType === 'daily' ? (
              <Input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-8 flex-1 text-[13px] border-gray-300 focus-visible:ring-0" 
              />
            ) : (
              <Input 
                type="month" 
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="h-8 flex-1 text-[13px] border-gray-300 focus-visible:ring-0" 
              />
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-700 w-20 text-right">供应商:</span>
            <div className="flex-1 relative">
              <Input 
                type="text" 
                placeholder="全部"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                onFocus={() => setShowSupplierOptions(true)}
                onBlur={() => setTimeout(() => setShowSupplierOptions(false), 200)}
                className="h-8 w-full text-[13px] border-gray-300 focus-visible:ring-0 pr-8" 
              />
              <div className="absolute right-2 top-1.5 pointer-events-none">
                <span className="text-[10px] text-gray-400">▼</span>
              </div>
              {showSupplierOptions && filteredSuppliers.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-md z-50 max-h-40 overflow-y-auto custom-scrollbar">
                  {filteredSuppliers.map((opt, idx) => (
                    <div 
                      key={idx} 
                      className="px-3 py-1.5 text-[13px] text-gray-700 hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        setSupplier(opt === '全部' ? '' : opt);
                        setShowSupplierOptions(false);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-700 w-20 text-right">采购平台:</span>
            <select 
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="h-8 flex-1 px-3 border border-gray-300 rounded text-[13px] bg-white outline-none focus:border-blue-500"
            >
              <option value="全部">全部</option>
              <option value="1688">1688</option>
              <option value="淘供销">淘供销</option>
              <option value="拼多多">拼多多</option>
              <option value="京东">京东</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-700 w-20 text-right">采购员:</span>
            <div className="flex-1 relative">
              <Input 
                type="text" 
                placeholder="全部"
                value={purchaser}
                onChange={(e) => setPurchaser(e.target.value)}
                onFocus={() => setShowPurchaserOptions(true)}
                onBlur={() => setTimeout(() => setShowPurchaserOptions(false), 200)}
                className="h-8 w-full text-[13px] border-gray-300 focus-visible:ring-0 pr-8" 
              />
              <div className="absolute right-2 top-1.5 pointer-events-none">
                <span className="text-[10px] text-gray-400">▼</span>
              </div>
              {showPurchaserOptions && filteredPurchasers.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-md z-50 max-h-40 overflow-y-auto custom-scrollbar">
                  {filteredPurchasers.map((opt, idx) => (
                    <div 
                      key={idx} 
                      className="px-3 py-1.5 text-[13px] text-gray-700 hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        setPurchaser(opt === '全部' ? '' : opt);
                        setShowPurchaserOptions(false);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-[12px] text-gray-500 mt-2 pl-[96px]">
            提示：将异步生成所选条件下付款状态为“已完成”的采购单数据。
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 pt-3">
          <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
          <Button variant="outline" className="h-8 px-4 text-[13px]" onClick={onClose}>
            取消
          </Button>
          </FeatureMarker>
          <FeatureMarker title="生成账单" description="交互说明：点击执行生成账单操作。">
          <Button 
            className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] gap-1" 
            onClick={handleGenerate}
            disabled={statementType === 'daily' ? !date : !month}
          >
            生成账单
          </Button>
          </FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}