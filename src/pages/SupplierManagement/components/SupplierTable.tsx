import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { SupplierView } from '../index';
import OperationLogsModal from './OperationLogsModal';
import { BatchEditModal, BatchSetLinkModal, SingleLinkModal, ConfirmDisableModal } from './SupplierModals';

interface SupplierTableProps {
  filterValues: any;
  onNavigate: (view: SupplierView, supplier: any) => void;
}

export default function SupplierTable({ filterValues, onNavigate }: SupplierTableProps) {
  // Using a separate key for suppliers
  const [suppliers, setSuppliers] = useLocalStorage<any[]>('suppliers_data_v1', [
    {
      id: '1',
      name: '世界杯足球风大白鹅衣服',
      link1688: '',
      buyer: '--',
      paymentMethod: '--',
      contactName: '--',
      contactPhone: '--',
      address: '--',
      linkedSkuCount: 2,
      purchaseCount: 0,
      createTime: '2026-04-24',
      lastPurchaseTime: '-暂无-',
      creator: '--',
      note: '-暂无-',
      status: '启用',
      type: '1688',
    },
    {
      id: '2',
      name: '南昌宏新华食品模具机械有限公司',
      link1688: '',
      buyer: '--',
      paymentMethod: '--',
      contactName: '--',
      contactPhone: '--',
      address: '--',
      linkedSkuCount: 3,
      purchaseCount: 0,
      createTime: '2026-04-24',
      lastPurchaseTime: '-暂无-',
      creator: '--',
      note: '-暂无-',
      status: '启用',
      type: '1688',
    }
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [logsModalOpen, setLogsModalOpen] = useState<{ open: boolean, supplierId?: string }>({ open: false });

  // Modals state
  const [batchOpsOpen, setBatchOpsOpen] = useState(false);
  const [addImportOpen, setAddImportOpen] = useState(false);
  const [batchThirdPartyOpen, setBatchThirdPartyOpen] = useState(false);
  const [successMessageOpen, setSuccessMessageOpen] = useState<{open: boolean, message?: string}>({ open: false });
  const [batchEditModalOpen, setBatchEditModalOpen] = useState(false);
  const [batchLinkModalOpen, setBatchLinkModalOpen] = useState(false);
  const [singleLinkModal, setSingleLinkModal] = useState<{ open: boolean, supplier?: any }>({ open: false });
  const [confirmDisableModal, setConfirmDisableModal] = useState<{ open: boolean, supplierId?: string }>({ open: false });
  const [failMessageModal, setFailMessageModal] = useState<{ open: boolean, message: string }>({ open: false, message: '' });

  // Handle Disable/Enable
  const toggleStatus = (id: string, currentStatus: string) => {
    // Requirements: "供应商下所有商品没有设置默认供应商才能够停用"
    if (currentStatus === '启用') {
      setConfirmDisableModal({ open: true, supplierId: id });
    } else {
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, status: '启用' } : s));
    }
  };

  const handleDelete = (id: string) => {
    // Requirements: "供应商下无关联商品、关联商品没有采购信息才能删除,操作后数据不可恢复"
    const supplier = suppliers.find(s => s.id === id);
    if (supplier && supplier.linkedSkuCount > 0) {
      alert('供应商下有关联商品，无法删除！');
      return;
    }
    const confirmDelete = window.confirm('删除后数据不可恢复，确定删除吗？');
    if (confirmDelete) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选数据');
      return;
    }
    const hasLinked = selectedIds.some(id => {
      const s = suppliers.find(sup => sup.id === id);
      return s && s.linkedSkuCount > 0;
    });
    if (hasLinked) {
      alert('该供应商下无关联商品、关联商品没有采购信息才能删除,请确认后再操作,操作后数据不可恢复.');
      return;
    }
    const confirmDelete = window.confirm('该供应商下无关联商品、关联商品没有采购信息才能删除,请确认后再操作,操作后数据不可恢复. 确定删除吗？');
    if (confirmDelete) {
      setSuppliers(prev => prev.filter(s => !selectedIds.includes(s.id)));
      setSelectedIds([]);
    }
  };

  const handleBatchEdit = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选数据');
      return;
    }
    setBatchEditModalOpen(true);
  };

  const handleBatchSetLink = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选数据');
      return;
    }
    setBatchLinkModalOpen(true);
  };

  const handleBatchUnbindThirdParty = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选数据');
      return;
    }

    const unlinkedSuppliers = suppliers.filter(s => selectedIds.includes(s.id) && !s.link1688);
    if (unlinkedSuppliers.length > 0) {
      const unlinkedNames = unlinkedSuppliers.map(s => s.name).join('、');
      setFailMessageModal({
        open: true,
        message: `供应商[${unlinkedNames}]仅支持关联了第三方供应商的供应商支持批量解绑，供应商没有关联第三方供应商不需要解绑`
      });
      return;
    }

    // Process unbinding
    setSuppliers(prev => prev.map(s => selectedIds.includes(s.id) ? { ...s, link1688: '' } : s));

    setSuccessMessageOpen({ open: true, message: '解绑成功' });
    setTimeout(() => {
      setSuccessMessageOpen({ open: false });
    }, 3000);
  };

  // Apply filters
  let filteredSuppliers = suppliers;
  if (filterValues) {
    if (filterValues.status && filterValues.status !== '全部') {
      filteredSuppliers = filteredSuppliers.filter(s => s.status === filterValues.status);
    }
    if (filterValues.type && filterValues.type !== '全部') {
      filteredSuppliers = filteredSuppliers.filter(s => s.type === filterValues.type);
    }
    if (filterValues.keyword) {
      const kw = filterValues.keyword.toLowerCase();
      filteredSuppliers = filteredSuppliers.filter(s => s.name.toLowerCase().includes(kw));
    }
  }

  // Sort descending by create time
  filteredSuppliers.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

  const selectedSupplierObjects = suppliers.filter(s => selectedIds.includes(s.id));

  return (
    <div className="flex flex-col h-full bg-white relative" onClick={() => { setBatchOpsOpen(false); setAddImportOpen(false); setBatchThirdPartyOpen(false); }}>
      {/* Success Message Toast */}
      {successMessageOpen.open && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-50 text-green-600 px-6 py-2 rounded shadow-md z-50 border border-green-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {successMessageOpen.message || '操作成功'}
        </div>
      )}

      {/* Top Action Bar */}
      <div className="p-3 border-b border-gray-200 flex flex-wrap items-center gap-3 bg-white flex-shrink-0 text-[13px]" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <FeatureMarker title="📝" description="交互说明：点击执行📝操作。">
          <Button 
            variant="outline" 
            className="h-8 text-[13px] font-normal border-gray-300 gap-1 px-3"
            onClick={() => { setBatchOpsOpen(!batchOpsOpen); setAddImportOpen(false); setBatchThirdPartyOpen(false); }}
          >
            <span className="text-gray-500 mr-1">📝</span> 批量处理功能 <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
          </Button>
          </FeatureMarker>
          {batchOpsOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleBatchEdit(); setBatchOpsOpen(false); }}>批量修改</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500" onClick={() => { handleBatchDelete(); setBatchOpsOpen(false); }}>批量删除</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { alert('批量导出供应商'); setBatchOpsOpen(false); }}>批量导出供应商</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { alert('批量导出供应商关联商品'); setBatchOpsOpen(false); }}>批量导出供应商关联商品</div>
            </div>
          )}
        </div>

        <div className="relative">
          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <Button 
            className="h-8 bg-[#FDF6EC] hover:bg-[#F5E6CE] text-[#E6A23C] border border-[#FDE2E2] font-normal px-4 gap-1"
            onClick={() => { setBatchThirdPartyOpen(!batchThirdPartyOpen); setBatchOpsOpen(false); setAddImportOpen(false); }}
          >
            批量设置第三方供应商 <ChevronDown className="w-3.5 h-3.5" />
          </Button>
          </FeatureMarker>
          {batchThirdPartyOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleBatchSetLink(); setBatchThirdPartyOpen(false); }}>批量设置第三方供应商</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { handleBatchUnbindThirdParty(); setBatchThirdPartyOpen(false); }}>批量解绑第三方供应商</div>
            </div>
          )}
        </div>
        
        <div className="ml-auto relative">
          <FeatureMarker title="+" description="交互说明：点击执行+操作。">
          <Button 
            className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 font-normal gap-1"
            onClick={() => { setAddImportOpen(!addImportOpen); setBatchOpsOpen(false); setBatchThirdPartyOpen(false); }}
          >
            <span className="mr-1">+</span> 添加/导入 <ChevronDown className="w-3.5 h-3.5" />
          </Button>
          </FeatureMarker>
          {addImportOpen && (
            <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
              <div className="px-4 py-2 text-gray-400 cursor-not-allowed">添加供应商</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { onNavigate('edit', null); setAddImportOpen(false); }}>手动添加供应商</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { alert('供应商导入'); setAddImportOpen(false); }}>供应商导入</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { alert('批量修改供应商导入'); setAddImportOpen(false); }}>批量修改供应商导入</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { alert('关联商品导入'); setAddImportOpen(false); }}>关联商品导入</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { alert('关联商品导入(1688链接)'); setAddImportOpen(false); }}>关联商品导入(1688链接)</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { alert('修改多供应商关联商品链接导入'); setAddImportOpen(false); }}>修改多供应商关联商品链接导入</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-[12px] text-left border-collapse min-w-[1200px]">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
            <tr className="text-gray-600">
              <th className="p-3 w-10 text-center font-normal border-r border-gray-100">
                <Checkbox 
                  checked={filteredSuppliers.length > 0 && selectedIds.length === filteredSuppliers.length}
                  onCheckedChange={(c) => setSelectedIds(c ? filteredSuppliers.map(s => s.id) : [])}
                />
              </th>
              <th className="p-3 font-normal w-[240px] border-r border-gray-100">供应商</th>
              <th className="p-3 font-normal w-[180px] border-r border-gray-100">1688供应商/链接</th>
              <th className="p-3 font-normal w-28 border-r border-gray-100">采购员<br/>付款方式</th>
              <th className="p-3 font-normal w-32 border-r border-gray-100 text-center">联系人/联系电话</th>
              <th className="p-3 font-normal w-32 border-r border-gray-100">地址</th>
              <th className="p-3 font-normal w-24 text-center border-r border-gray-100">关联SKU数量<br/>采购次数</th>
              <th className="p-3 font-normal w-32 text-center border-r border-gray-100">创建时间<br/>最近采购时间</th>
              <th className="p-3 font-normal w-24 text-center border-r border-gray-100">创建人<br/>备注</th>
              <th className="p-3 font-normal w-20 text-center border-r border-gray-100">状态<br/>类型</th>
              <th className="p-3 font-normal w-[220px] text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSuppliers.map(supplier => (
              <tr key={supplier.id} className="hover:bg-blue-50/30">
                <td className="p-3 text-center align-middle border-r border-gray-100">
                  <Checkbox 
                    checked={selectedIds.includes(supplier.id)}
                    onCheckedChange={(c) => setSelectedIds(c ? [...selectedIds, supplier.id] : selectedIds.filter(id => id !== supplier.id))}
                  />
                </td>
                <td className="p-3 align-middle text-gray-800 border-r border-gray-100">{supplier.name}</td>
                <td className="p-3 align-middle border-r border-gray-100">
                  <div className="flex items-center gap-1 text-gray-400">
                    {supplier.link1688 ? (
                      <span className="text-blue-500 cursor-pointer hover:underline">{supplier.link1688}</span>
                    ) : (
                      '[暂未匹配]'
                    )}
                    <ExternalLink className="w-3 h-3 text-blue-400 cursor-pointer hover:text-blue-600" onClick={() => setSingleLinkModal({ open: true, supplier })} />
                  </div>
                </td>
                <td className="p-3 align-middle text-gray-600 border-r border-gray-100 text-center">
                  <div>{supplier.buyer}</div>
                  <div>{supplier.paymentMethod}</div>
                </td>
                <td className="p-3 align-middle text-gray-600 border-r border-gray-100 text-center">
                  <div>{supplier.contactName}</div>
                  <div>{supplier.contactPhone}</div>
                </td>
                <td className="p-3 align-middle text-gray-600 border-r border-gray-100">
                  {supplier.address}
                </td>
                <td className="p-3 align-middle text-center text-gray-600 border-r border-gray-100">
                  <div>{supplier.linkedSkuCount}</div>
                  <div>{supplier.purchaseCount}</div>
                </td>
                <td className="p-3 align-middle text-center text-gray-600 border-r border-gray-100">
                  <div>{supplier.createTime}</div>
                  <div>{supplier.lastPurchaseTime}</div>
                </td>
                <td className="p-3 align-middle text-center text-gray-600 border-r border-gray-100">
                  <div>{supplier.creator}</div>
                  <div>{supplier.note}</div>
                </td>
                <td className="p-3 align-middle text-center border-r border-gray-100">
                  <div className={supplier.status === '启用' ? 'text-green-500' : 'text-red-500'}>{supplier.status}</div>
                  <div className="text-gray-600">{supplier.type}</div>
                </td>
                <td className="p-3 align-middle text-center text-blue-600 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <FeatureMarker title="{supplier.status === '启用' ? '停用' : '启用'}" description="交互说明：点击执行{supplier.status === '启用' ? '停用' : '启用'}操作。">
                    <span className="cursor-pointer hover:underline text-red-500" onClick={() => toggleStatus(supplier.id, supplier.status)}>
                      {supplier.status === '启用' ? '停用' : '启用'}
                    </span>
                    </FeatureMarker>
                    <FeatureMarker title="编辑" description="交互说明：点击打开编辑弹窗，修改当前项信息。">
<span className="cursor-pointer hover:underline" onClick={() => onNavigate('edit', supplier)}>编辑</span>
</FeatureMarker>
                    <FeatureMarker title="删除" description="交互说明：点击删除选中的数据项，操作不可恢复。">
<span className="cursor-pointer hover:underline text-red-500" onClick={() => handleDelete(supplier.id)}>删除</span>
</FeatureMarker>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <FeatureMarker title="关联商品" description="交互说明：点击执行关联商品操作。">
<span className="cursor-pointer hover:underline" onClick={() => onNavigate('link', supplier)}>关联商品</span>
</FeatureMarker>
                    <FeatureMarker title="关联商品采购" description="交互说明：点击执行关联商品采购操作。">
<span className="cursor-pointer hover:underline" onClick={() => onNavigate('purchase', supplier)}>关联商品采购</span>
</FeatureMarker>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <FeatureMarker title="操作日志" description="交互说明：点击执行操作日志操作。">
<span className="cursor-pointer hover:underline" onClick={() => setLogsModalOpen({ open: true, supplierId: supplier.id })}>操作日志</span>
</FeatureMarker>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-400">
                  暂无符合条件的供应商数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OperationLogsModal 
        open={logsModalOpen.open} 
        onOpenChange={(open) => setLogsModalOpen({ open })} 
      />
      <BatchEditModal
        open={batchEditModalOpen}
        onOpenChange={setBatchEditModalOpen}
        selectedSuppliers={selectedSupplierObjects}
        onSave={(updated) => {
          setSuppliers(prev => prev.map(s => {
            const updatedSup = updated.find(u => u.id === s.id);
            return updatedSup ? { ...s, ...updatedSup } : s;
          }));
          setBatchEditModalOpen(false);
          setSelectedIds([]);
        }}
      />
      <BatchSetLinkModal
        open={batchLinkModalOpen}
        onOpenChange={setBatchLinkModalOpen}
        selectedSuppliers={selectedSupplierObjects}
        onSave={(updated) => {
          setSuppliers(prev => prev.map(s => {
            const updatedSup = updated.find(u => u.id === s.id);
            return updatedSup ? { ...s, link1688: updatedSup.link1688 } : s;
          }));
          setBatchLinkModalOpen(false);
          setSelectedIds([]);
        }}
      />
      <SingleLinkModal
        open={singleLinkModal.open}
        onOpenChange={(open) => setSingleLinkModal({ open, supplier: singleLinkModal.supplier })}
        supplier={singleLinkModal.supplier}
        onSave={(id, link) => {
          setSuppliers(prev => prev.map(s => s.id === id ? { ...s, link1688: link } : s));
          setSingleLinkModal({ open: false });
        }}
      />
      <ConfirmDisableModal
        open={confirmDisableModal.open}
        onOpenChange={(open) => setConfirmDisableModal({ open, supplierId: confirmDisableModal.supplierId })}
        onConfirm={() => {
          if (confirmDisableModal.supplierId) {
            setSuppliers(prev => prev.map(s => s.id === confirmDisableModal.supplierId ? { ...s, status: '停用' } : s));
          }
          setConfirmDisableModal({ open: false });
        }}
      />
      {failMessageModal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded w-[400px] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="text-[14px] font-medium text-gray-800">操作提示</div>
            </div>
            <div className="p-6 text-[13px] text-gray-600 flex items-start gap-3">
              <div className="text-red-500 mt-0.5">⚠️</div>
              <div className="flex-1 leading-relaxed">
                {failMessageModal.message}
              </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
              <FeatureMarker title="我知道了" description="交互说明：点击执行我知道了操作。">
              <Button 
                className="h-8 px-6 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white text-[13px]"
                onClick={() => setFailMessageModal({ open: false, message: '' })}
              >
                我知道了
              </Button>
              </FeatureMarker>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
