import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddApprovalRuleModalProps {
  onClose: () => void;
}

export default function AddApprovalRuleModal({ onClose }: AddApprovalRuleModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'condition' | 'flow'>('basic');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] h-[80vh] flex flex-col p-0 gap-0 bg-white overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[16px] font-medium text-gray-800">新增审批规则</DialogTitle>
          <div className="flex bg-gray-100 rounded-md p-1">
            <div 
              className={`px-6 py-1.5 text-[13px] rounded cursor-pointer ${activeTab === 'basic' ? 'bg-white shadow-sm font-medium text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('basic')}
            >
              1.基础信息
            </div>
            <div 
              className={`px-6 py-1.5 text-[13px] rounded cursor-pointer ${activeTab === 'condition' ? 'bg-white shadow-sm font-medium text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('condition')}
            >
              2.条件设置
            </div>
            <div 
              className={`px-6 py-1.5 text-[13px] rounded cursor-pointer ${activeTab === 'flow' ? 'bg-white shadow-sm font-medium text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('flow')}
            >
              3.审批流
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#F8FAFC]">
          
          {/* Tab 1: Basic Info */}
          {activeTab === 'basic' && (
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 flex flex-col gap-6 max-w-[600px] mx-auto">
              <div className="flex items-center gap-4">
                <span className="w-32 text-right text-[13px] text-gray-700"><span className="text-red-500 mr-1">*</span>规则名称：</span>
                <Input className="h-8 flex-1 text-[13px] border-gray-300 focus-visible:ring-0" />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 text-right text-[13px] text-gray-700"><span className="text-red-500 mr-1">*</span>优先级：</span>
                <Input type="number" defaultValue="1" className="h-8 w-24 text-[13px] border-gray-300 focus-visible:ring-0" />
                <span className="text-gray-400 text-[12px]">数字越小优先级越高</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 text-right text-[13px] text-gray-700">是否满足全部条件生效：</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-[13px] text-gray-600">满足全部条件才生效（默认满足任一条件即生效）</span>
                </label>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-32 text-right text-[13px] text-gray-700 mt-2">备注：</span>
                <textarea className="flex-1 h-24 p-2 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none" />
              </div>
            </div>
          )}

          {/* Tab 2: Condition Settings */}
          {activeTab === 'condition' && (
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 flex flex-col gap-5 text-[13px] text-gray-700">
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span>本次采购价大于上次采购价时需要审批（未采购过商品此条件无效）</span>
              </label>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer w-48">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>采购单金额范围：</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input placeholder="最小金额" type="number" className="h-8 w-24 text-[13px] focus-visible:ring-0" disabled />
                  <span className="text-gray-400">-</span>
                  <Input placeholder="最大金额" type="number" className="h-8 w-24 text-[13px] focus-visible:ring-0" disabled />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer w-64">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>本次采购价与上次采购价浮动比例：</span>
                </label>
                <select className="h-8 px-2 border border-gray-300 rounded bg-white outline-none focus:border-blue-500" disabled>
                  <option value=">=">≥</option>
                  <option value="<=">≤</option>
                  <option value="=">=</option>
                </select>
                <div className="flex items-center">
                  <Input type="number" className="h-8 w-20 text-center rounded-r-none border-r-0 focus-visible:ring-0" disabled />
                  <div className="h-8 px-2 bg-gray-50 border border-gray-300 rounded-r flex items-center text-gray-500">%</div>
                </div>
                <span className="text-gray-400 text-[12px] ml-2">（未采购过商品此条件无效）</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span>手工创建采购单 <span className="text-gray-400 text-[12px]">(温馨提示:仅通过采购管理--添加的普通采购单才执行此规则)</span></span>
              </label>

              <div className="h-px bg-gray-100 my-2"></div>

              {['所属仓库', '所属供应商', '所属采购员', '所属下单员'].map(label => (
                <div key={label} className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer w-32">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span>{label}：</span>
                  </label>
                  <Input placeholder="请选择 (支持多选)" className="h-8 w-64 text-[13px] bg-gray-50 cursor-not-allowed" disabled />
                </div>
              ))}

              <div className="h-px bg-gray-100 my-2"></div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer w-48">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>SKU总数量范围：</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input placeholder="最小数量" type="number" className="h-8 w-24 text-[13px] focus-visible:ring-0" disabled />
                  <span className="text-gray-400">-</span>
                  <Input placeholder="最大数量" type="number" className="h-8 w-24 text-[13px] focus-visible:ring-0" disabled />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer w-48">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>单个SKU数量范围：</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input placeholder="最小数量" type="number" className="h-8 w-24 text-[13px] focus-visible:ring-0" disabled />
                  <span className="text-gray-400">-</span>
                  <Input placeholder="最大数量" type="number" className="h-8 w-24 text-[13px] focus-visible:ring-0" disabled />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <label className="flex items-center gap-2 cursor-pointer w-32 py-1">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>包含指定商品：</span>
                </label>
                <div className="flex flex-col gap-2 flex-1">
                  <select className="h-8 w-32 px-2 border border-gray-300 rounded bg-white outline-none focus:border-blue-500" disabled>
                    <option value="in">包含商品以内</option>
                    <option value="out">包含商品以外</option>
                  </select>
                  <textarea placeholder="输入库存SKU，支持多个，以逗号分隔" className="h-16 w-full p-2 text-[13px] border border-gray-300 rounded bg-gray-50 resize-none" disabled />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer w-64">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>是否关联第三方单号：</span>
                </label>
                <select className="h-8 w-24 px-2 border border-gray-300 rounded bg-white outline-none focus:border-blue-500" disabled>
                  <option value="yes">是</option>
                  <option value="no">否</option>
                </select>
                <span className="text-gray-400 text-[12px] ml-2">（创建采购单时此条件无效）</span>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>采购商品数量变动</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>采购商品价格变动</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>采购单包含首次采购的库存SKU</span>
                </label>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer w-48">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>采购单运费金额范围：</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input placeholder="最小值" type="number" className="h-8 w-24 text-[13px] focus-visible:ring-0" disabled />
                  <span className="text-gray-400">-</span>
                  <Input placeholder="最大值(可选)" type="number" className="h-8 w-24 text-[13px] focus-visible:ring-0" disabled />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span>本次综合成本价大于上次综合成本价时需要审批（未采购过商品此条件无效）</span>
              </label>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer w-64">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>本次综合成本价与上次综合成本价浮动比例：</span>
                </label>
                <select className="h-8 px-2 border border-gray-300 rounded bg-white outline-none focus:border-blue-500" disabled>
                  <option value=">=">≥</option>
                  <option value="<=">≤</option>
                  <option value="=">=</option>
                </select>
                <div className="flex items-center">
                  <Input type="number" className="h-8 w-20 text-center rounded-r-none border-r-0 focus-visible:ring-0" disabled />
                  <div className="h-8 px-2 bg-gray-50 border border-gray-300 rounded-r flex items-center text-gray-500">%</div>
                </div>
                <span className="text-gray-400 text-[12px] ml-2">（未采购过商品此条件无效）</span>
              </div>
            </div>
          )}

          {/* Tab 3: Flow Settings */}
          {activeTab === 'flow' && (
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 max-w-[600px] mx-auto text-[13px]">
              <div className="mb-4 text-[#E6A23C] bg-[#FDF6EC] p-3 rounded leading-relaxed border border-[#FDE2E2]">
                审批人1 → 审批人2 → 审批人3... 按顺序审批，最多支持5人审批。审核人编辑后，仅针对新生成采购单生效。已匹配此规则的采购单将按之前设置的审核人进行审核。
              </div>

              <div className="flex flex-col gap-4 pl-4 border-l-2 border-blue-200 ml-4 relative mt-8">
                {[1, 2, 3].map((level, idx) => (
                  <div key={level} className="relative">
                    {/* Node Dot */}
                    <div className="absolute -left-[23px] top-2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                    
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                      <div className="font-medium text-gray-800 mb-3 flex items-center justify-between">
                        <span>第 {level} 级审批人</span>
                        {idx > 0 && <span className="text-red-500 cursor-pointer hover:underline text-[12px]">删除</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <select className="h-8 px-2 border border-gray-300 rounded bg-white outline-none focus:border-blue-500 w-32">
                          <option value="role">指定角色</option>
                          <option value="user">指定人员</option>
                        </select>
                        <Input placeholder="请选择审批人" className="h-8 flex-1 text-[13px] bg-white focus-visible:ring-0" />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="relative mt-2">
                  <div className="absolute -left-[23px] top-2 w-3 h-3 bg-gray-300 rounded-full border-2 border-white shadow-sm" />
                  <Button variant="outline" className="h-8 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 w-full">
                    + 添加下一级审批人
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>

        <DialogFooter className="px-6 py-4 bg-white border-t border-gray-200 shrink-0">
          <Button variant="outline" className="h-8 px-6 text-[13px]" onClick={onClose}>
            取消
          </Button>
          {activeTab !== 'flow' ? (
            <Button 
              className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 text-[13px]" 
              onClick={() => setActiveTab(activeTab === 'basic' ? 'condition' : 'flow')}
            >
              下一步
            </Button>
          ) : (
            <Button 
              className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-6 text-[13px]" 
              onClick={onClose}
            >
              保存规则
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}