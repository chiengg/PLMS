import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import AddApprovalRuleModal from './AddApprovalRuleModal';

export default function ApprovalSettingsTab() {
  const [showAddModal, setShowAddModal] = useState(false);

  const rules = [
    { id: '1', priority: 1, name: 'Seisei', note: '', status: '启用', creator: '周苗', createTime: '2025-09-19 16:11:23', updateTime: '2025-09-19 16:16:32' },
    { id: '2', priority: 1, name: '审批规则-Tina', note: '', status: '启用', creator: '周苗', createTime: '2025-09-02 15:07:00', updateTime: '2025-09-02 15:08:36' },
    { id: '3', priority: 1, name: 'Nicole', note: '', status: '启用', creator: '周苗', createTime: '2024-12-03 10:15:48', updateTime: '2024-12-03 10:16:36' },
    { id: '4', priority: 1, name: '韩笑', note: '', status: '启用', creator: '周苗', createTime: '2024-11-22 17:05:21', updateTime: '2024-11-22 17:07:00' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-[#FFF8E6] text-[#E6A23C] text-[13px] p-3 rounded mb-4 border border-[#FDE2E2]">
        新版审批规则功能亮点：1、支持多级审批；2、可以设置多个规则，支持按优先级匹配审批；3、支持更多的审批条件设置；
      </div>

      <div className="flex items-center gap-4 mb-4">
        <select className="h-8 px-3 border border-gray-300 rounded text-[13px] bg-white focus:border-blue-500 outline-none w-24">
          <option value="启用">启用</option>
          <option value="停用">停用</option>
        </select>
        
        <div className="flex items-center">
          <div className="h-8 px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l text-[13px] flex items-center text-gray-600">
            规则名称
          </div>
          <Input 
            placeholder="请输入搜索内容" 
            className="h-8 w-48 rounded-none border-gray-300 focus-visible:ring-0 text-[13px]"
          />
          <Button className="h-8 rounded-l-none bg-white border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-50 px-3">
            <Search className="w-3.5 h-3.5 mr-1" /> 搜索
          </Button>
        </div>

        <Button 
          className="ml-auto h-8 bg-[#8CC63F] hover:bg-[#7AB62F] text-white px-4 text-[13px] gap-1"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-3.5 h-3.5" /> 新增规则
        </Button>
      </div>

      <div className="flex-1 overflow-auto border border-gray-200 rounded">
        <table className="w-full text-center text-[13px] border-collapse">
          <thead className="bg-[#F8FAFC] text-gray-700 sticky top-0">
            <tr>
              <th className="p-3 font-normal border-b border-gray-200 w-16">优先级</th>
              <th className="p-3 font-normal border-b border-gray-200">规则名称</th>
              <th className="p-3 font-normal border-b border-gray-200">备注</th>
              <th className="p-3 font-normal border-b border-gray-200 w-20">状态</th>
              <th className="p-3 font-normal border-b border-gray-200 w-24">创建人员</th>
              <th className="p-3 font-normal border-b border-gray-200 w-48">时间</th>
              <th className="p-3 font-normal border-b border-gray-200 w-32">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-blue-50/30">
                <td className="p-3 text-gray-800">{rule.priority}</td>
                <td className="p-3 text-gray-800">{rule.name}</td>
                <td className="p-3 text-gray-800">{rule.note}</td>
                <td className="p-3 text-green-600">{rule.status}</td>
                <td className="p-3 text-gray-800">{rule.creator}</td>
                <td className="p-3 text-gray-600 text-left">
                  <div>创建: {rule.createTime}</div>
                  <div>操作: {rule.updateTime}</div>
                </td>
                <td className="p-3 text-blue-600">
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="cursor-pointer hover:underline">编辑</span>
                    <span className="cursor-pointer hover:underline">复制</span>
                    <span className="cursor-pointer hover:underline">日志</span>
                    <span className="cursor-pointer hover:underline text-red-500">停用</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && <AddApprovalRuleModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}