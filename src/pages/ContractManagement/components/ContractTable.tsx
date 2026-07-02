import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddEditContractModal, LinkSupplierModal } from './ContractModals';

interface ContractData {
  id: string;
  name: string;
  linkedCount: number;
  isDefault: boolean;
  creator: string;
  createTime: string;
  updater: string;
  updateTime: string;
}

const mockData: ContractData[] = [
  { id: '1', name: '报关合同', linkedCount: 1, isDefault: false, creator: '王朋', createTime: '2025-09-18 16:12:09', updater: '王朋', updateTime: '2026-04-24 11:21:14' },
  { id: '2', name: '美码短袖T恤定做合同', linkedCount: 10, isDefault: false, creator: '王朋', createTime: '2024-05-20 16:10:33', updater: '王朋', updateTime: '2026-04-14 09:33:54' },
  { id: '3', name: '采购合同', linkedCount: 1, isDefault: true, creator: '王朋', createTime: '2022-02-17 10:40:04', updater: '王朋', updateTime: '2026-04-01 09:26:03' },
];

export function ContractTable() {
  const [data, setData] = useState<ContractData[]>(mockData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modal states
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [currentContract, setCurrentContract] = useState<ContractData | null>(null);
  
  const [linkSupplierModalOpen, setLinkSupplierModalOpen] = useState(false);
  const [currentLinkContract, setCurrentLinkContract] = useState<ContractData | null>(null);
  
  const [alertModalOpen, setAlertModalOpen] = useState<{open: boolean, message: string}>({ open: false, message: '' });
  const [confirmModalOpen, setConfirmModalOpen] = useState<{open: boolean, message: string, onConfirm: () => void}>({ open: false, message: '', onConfirm: () => {} });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map(d => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDelete = (item: ContractData) => {
    if (item.linkedCount > 0) {
      setAlertModalOpen({ open: true, message: '关联供应商的模板不可删除！请解绑供应商后再删除。' });
    } else {
      setConfirmModalOpen({
        open: true,
        message: '确认删除模板？删除后不可恢复。',
        onConfirm: () => {
          setData(prev => prev.filter(d => d.id !== item.id));
          setConfirmModalOpen({ open: false, message: '', onConfirm: () => {} });
        }
      });
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      setAlertModalOpen({ open: true, message: '请先勾选数据' });
      return;
    }
    
    const selectedData = data.filter(d => selectedIds.includes(d.id));
    const hasLinked = selectedData.some(d => d.linkedCount > 0);
    
    if (hasLinked) {
      setAlertModalOpen({ open: true, message: '关联供应商的模板不可删除！请解绑供应商后再删除。' });
    } else {
      setConfirmModalOpen({
        open: true,
        message: '确认删除模板？删除后不可恢复。',
        onConfirm: () => {
          setData(prev => prev.filter(d => !selectedIds.includes(d.id)));
          setSelectedIds([]);
          setConfirmModalOpen({ open: false, message: '', onConfirm: () => {} });
        }
      });
    }
  };

  const handleEdit = (item: ContractData) => {
    setCurrentContract(item);
    setAddEditModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentContract(null);
    setAddEditModalOpen(true);
  };

  const handleLinkSupplier = (item: ContractData) => {
    setCurrentLinkContract(item);
    setLinkSupplierModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Top Action Bar */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
        <FeatureMarker title="批量删除" description="交互说明：点击删除选中的数据项，操作不可恢复。">
        <Button 
          className="h-8 bg-[#8CB5E2] hover:bg-[#7AA4D1] text-white px-4 text-[13px] font-normal"
          onClick={handleBatchDelete}
        >
          批量删除
        </Button>
        </FeatureMarker>
        <FeatureMarker title="增加合同模板" description="交互说明：点击执行增加合同模板操作。">
        <Button 
          className="h-8 bg-[#8CC63F] hover:bg-[#7AB62F] text-white px-4 text-[13px] font-normal gap-1"
          onClick={handleAdd}
        >
          <Plus className="w-3.5 h-3.5" /> 增加合同模板
        </Button>
        </FeatureMarker>
      </div>
      
      {/* Table Area */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-white">
        <table className="w-full text-center text-[13px] border-collapse bg-white">
          <thead className="bg-[#EAEAEA] text-gray-700 sticky top-0 border-b border-gray-200 z-10">
            <tr>
              <th className="p-3 font-normal w-12 border-r border-white/50 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={selectedIds.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 font-normal border-r border-white/50 w-24">序号</th>
              <th className="p-3 font-normal border-r border-white/50">模板名称</th>
              <th className="p-3 font-normal border-r border-white/50">已关联供应商数</th>
              <th className="p-3 font-normal border-r border-white/50">默认合同</th>
              <th className="p-3 font-normal border-r border-white/50">
                创建人<br/>创建时间
              </th>
              <th className="p-3 font-normal border-r border-white/50">
                更新人<br/>更新时间
              </th>
              <th className="p-3 font-normal w-[200px]">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <tr key={item.id} className={`${index % 2 !== 0 ? 'bg-[#FFF8E6]' : 'bg-white'} hover:bg-blue-50/50 transition-colors`}>
                <td className="p-3 border-r border-gray-100 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                  />
                </td>
                <td className="p-3 border-r border-gray-100 text-center text-gray-800">{index + 1}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{item.name}</td>
                <td className="p-3 border-r border-gray-100 text-center">
                  <span className="text-blue-600 underline cursor-pointer">{item.linkedCount}</span>
                </td>
                <td className="p-3 border-r border-gray-100 text-center">
                  <input type="checkbox" className="rounded border-gray-300" checked={item.isDefault} readOnly />
                </td>
                <td className="p-3 border-r border-gray-100 text-center text-gray-600">
                  <div className="flex flex-col gap-1 items-center justify-center text-[12px]">
                    <span>{item.creator}</span>
                    <span>{item.createTime}</span>
                  </div>
                </td>
                <td className="p-3 border-r border-gray-100 text-center text-gray-600">
                  <div className="flex flex-col gap-1 items-center justify-center text-[12px]">
                    <span>{item.updater}</span>
                    <span>{item.updateTime}</span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex flex-col items-center justify-center gap-1 text-[12px]">
                    <div className="flex items-center gap-2">
                      <FeatureMarker title="编辑" description="交互说明：点击打开编辑弹窗，修改当前项信息。">
<span className="text-blue-600 cursor-pointer hover:underline" onClick={() => handleEdit(item)}>编辑</span>
</FeatureMarker>
                      <FeatureMarker title="删除" description="交互说明：点击删除选中的数据项，操作不可恢复。">
<span className="text-[#E46F6F] cursor-pointer hover:underline" onClick={() => handleDelete(item)}>删除</span>
</FeatureMarker>
                    </div>
                    <FeatureMarker title="关联供应商" description="交互说明：点击执行关联供应商操作。">
<span className="text-blue-600 cursor-pointer hover:underline" onClick={() => handleLinkSupplier(item)}>关联供应商</span>
</FeatureMarker>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Modals for Alert and Confirm */}
      {alertModalOpen.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded w-[400px] overflow-hidden flex flex-col shadow-lg">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="text-[14px] font-medium text-gray-800">操作提示</div>
            </div>
            <div className="p-6 text-[13px] text-gray-600 flex items-start gap-3 justify-center">
              <div className="text-red-500 mt-0.5">⚠️</div>
              <div className="leading-relaxed font-medium text-gray-700">
                {alertModalOpen.message}
              </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
              <FeatureMarker title="我知道了" description="交互说明：点击执行我知道了操作。">
              <Button 
                className="h-8 px-6 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white text-[13px]"
                onClick={() => setAlertModalOpen({ open: false, message: '' })}
              >
                我知道了
              </Button>
              </FeatureMarker>
            </div>
          </div>
        </div>
      )}

      {confirmModalOpen.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded w-[400px] overflow-hidden flex flex-col shadow-lg">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="text-[14px] font-medium text-gray-800">操作确认</div>
            </div>
            <div className="p-6 text-[13px] text-gray-600 flex items-center justify-center gap-3">
              <div className="text-[#E6A23C] text-xl">⚠️</div>
              <div className="leading-relaxed font-medium text-gray-700">
                {confirmModalOpen.message}
              </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <FeatureMarker title="确定" description="交互说明：校验表单数据并提交保存。">
              <Button 
                className="h-8 px-6 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white text-[13px]"
                onClick={confirmModalOpen.onConfirm}
              >
                确定
              </Button>
              </FeatureMarker>
              <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
              <Button 
                variant="outline"
                className="h-8 px-6 bg-white border-gray-300 text-gray-600 text-[13px]"
                onClick={() => setConfirmModalOpen({ open: false, message: '', onConfirm: () => {} })}
              >
                取消
              </Button>
              </FeatureMarker>
            </div>
          </div>
        </div>
      )}

      {/* Feature Modals */}
      <AddEditContractModal
        open={addEditModalOpen}
        onOpenChange={setAddEditModalOpen}
        contract={currentContract}
      />

      <LinkSupplierModal
        open={linkSupplierModalOpen}
        onOpenChange={setLinkSupplierModalOpen}
        contract={currentLinkContract}
      />
    </div>
  );
}
