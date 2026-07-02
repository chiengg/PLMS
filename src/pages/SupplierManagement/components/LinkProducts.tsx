import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, Search, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AddLinkedProductModal, EditLinkedProductModal, ConfirmDeleteProductModal, PurchaseHistoryModal, ImportSupplierModal, ConfirmBindThirdPartyModal, MatchThirdPartyModal } from './SupplierModals';

interface LinkProductsProps {
  supplier: any;
  onBack: () => void;
}

export default function LinkProducts({ supplier, onBack }: LinkProductsProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{open: boolean, product?: any}>({ open: false });
  const [deleteModal, setDeleteModal] = useState<{open: boolean, productId?: string, isBatch?: boolean}>({ open: false });
  const [historyModal, setHistoryModal] = useState<{open: boolean, product?: any}>({ open: false });
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [confirmBindModalOpen, setConfirmBindModalOpen] = useState<{open: boolean, productId?: string}>({ open: false });
  const [matchThirdPartyModalOpen, setMatchThirdPartyModalOpen] = useState<{open: boolean, productId?: string}>({ open: false });
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);
  
  const [linkedProducts, setLinkedProducts] = useState<any[]>([
    {
      id: '1',
      image: 'https://via.placeholder.com/40',
      sku: '10006102-0-B0-AMHyper',
      supplierSku: '【暂无】',
      name: 'AMHyper世界杯大白鹅摆件服饰_23英寸门廊鹅裙子',
      link: '快速访问',
      minPrice: '0 RMB',
      lastPrice: '0 RMB',
      minOrder: '0',
      minMulti: '0',
      addTime: '2026-04-24 19:25:31',
      isDefault: '是',
      thirdId: '--'
    },
    {
      id: '2',
      image: 'https://via.placeholder.com/40',
      sku: '10006102-0-A0-AMHyper',
      supplierSku: '【暂无】',
      name: 'AMHyper世界杯大白鹅摆件服饰_23英寸门廊鹅足球款',
      link: '快速访问',
      minPrice: '0 RMB',
      lastPrice: '0 RMB',
      minOrder: '0',
      minMulti: '0',
      addTime: '2026-04-24 19:25:31',
      isDefault: '是',
      thirdId: '--'
    }
  ]);

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Success Message Toast */}
      {successMessageOpen && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-50 text-green-600 px-6 py-2 rounded shadow-md z-50 border border-green-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          取消成功
        </div>
      )}

      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-[#F5F7FA] text-[13px] text-gray-700 flex items-center">
        供应商关联商品：<span className="font-medium ml-1">{supplier?.name}</span>
      </div>

      {/* Top Action Bar */}
      <div className="p-3 border-b border-gray-200 flex flex-wrap items-center gap-3 bg-white flex-shrink-0 text-[13px]">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <FeatureMarker title="📝" description="交互说明：点击执行📝操作。">
            <Button variant="outline" className="h-8 text-[13px] font-normal border-gray-300 gap-1 px-3">
              <span className="text-gray-500 mr-1">📝</span> 批量处理功能 <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
            </Button>
            </FeatureMarker>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40 bg-white">
            <DropdownMenuItem 
              className="text-[13px] cursor-pointer"
              onClick={() => {
                if (selectedIds.length === 0) {
                  alert('请先勾选要删除的数据');
                  return;
                }
                setDeleteModal({ open: true, isBatch: true });
              }}
            >
              批量删除
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] cursor-pointer">批量导出</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] cursor-pointer">批量设置默认供应商</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] cursor-pointer">批量解除默认供应商</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] cursor-pointer">批量取消第三方匹配</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] cursor-pointer">批量设置商品链接</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <FeatureMarker title="批量匹配第三方商品" description="交互说明：点击执行批量匹配第三方商品操作。">
        <Button 
          className="h-8 bg-[#FFD770] hover:bg-[#F2C95D] text-[#8C6D1F] border-0 font-medium px-4"
          onClick={() => {
            if (selectedIds.length === 0) {
              alert('请先勾选要匹配的数据');
              return;
            }
            if (!supplier?.link1688) {
              setConfirmBindModalOpen({ open: true });
            } else {
              setMatchThirdPartyModalOpen({ open: true });
            }
          }}
        >
          批量匹配第三方商品
        </Button>
        </FeatureMarker>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <FeatureMarker title="📥" description="交互说明：点击执行📥操作。">
            <Button variant="outline" className="h-8 text-[13px] font-normal border-gray-300 gap-1 px-3">
              <span className="text-gray-500 mr-1">📥</span> 导入相关 <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
            </Button>
            </FeatureMarker>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40 bg-white">
            <DropdownMenuItem className="text-[13px] cursor-pointer" onClick={() => setImportModalOpen(true)}>关联商品导入</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] cursor-pointer" onClick={() => setImportModalOpen(true)}>导入更新关联商品</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
          <select className="h-8 px-2 border-0 border-r border-gray-300 bg-gray-50 outline-none text-gray-600">
            <option>库存SKU</option>
          </select>
          <Input className="h-8 w-48 border-0 focus-visible:ring-0 text-[12px] rounded-none" placeholder="双击可批量查询" />
          <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-3 font-normal rounded-none gap-1">
            <Search className="w-3.5 h-3.5" /> 搜索
          </Button>
          </FeatureMarker>
        </div>

        <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer ml-2">
          <Checkbox /> 无商品链接
        </label>
        <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
          <Checkbox /> 未匹配第三方商品
        </label>

        <FeatureMarker title="+" description="交互说明：点击执行+操作。">
        <Button 
          className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 ml-auto font-normal gap-1"
          onClick={() => setAddModalOpen(true)}
        >
          <span className="mr-1">+</span> 添加关联商品
        </Button>
        </FeatureMarker>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-[12px] text-left border-collapse min-w-[1200px]">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
            <tr className="text-gray-600">
              <th className="p-3 w-10 text-center font-normal border-r border-gray-100">
                <Checkbox />
              </th>
              <th className="p-3 font-normal w-16 text-center border-r border-gray-100">缩略图</th>
              <th className="p-3 font-normal w-56 border-r border-gray-100 text-center">库存SKU/供应商SKU</th>
              <th className="p-3 font-normal w-64 border-r border-gray-100">商品名称</th>
              <th className="p-3 font-normal w-32 border-r border-gray-100 text-center">商品链接</th>
              <th className="p-3 font-normal w-24 text-center border-r border-gray-100">最低采购价<br/>上次采购价</th>
              <th className="p-3 font-normal w-24 text-center border-r border-gray-100">最小起订量<br/>最小订购倍数</th>
              <th className="p-3 font-normal w-32 text-center border-r border-gray-100">添加时间</th>
              <th className="p-3 font-normal w-32 text-center border-r border-gray-100">默认供应商</th>
                  <th className="p-3 font-normal w-40 text-center border-r border-gray-100">
                    第三方子商品id<br/>第三方商品id<br/>商品多属性
                  </th>
                  <th className="p-3 font-normal w-32 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {linkedProducts.map(p => (
              <tr key={p.id} className="hover:bg-blue-50/30">
                <td className="p-3 text-center align-middle border-r border-gray-100">
                  <Checkbox 
                    checked={selectedIds.includes(p.id)}
                    onCheckedChange={(c) => setSelectedIds(c ? [...selectedIds, p.id] : selectedIds.filter(id => id !== p.id))}
                  />
                </td>
                <td className="p-3 align-middle text-center border-r border-gray-100">
                  <div className="flex flex-col items-center">
                    <img src={p.image} alt="thumb" className="w-10 h-10 object-cover border border-gray-200 rounded" />
                    <span className="text-[10px] text-blue-500 mt-1 cursor-pointer hover:underline">1688</span>
                  </div>
                </td>
                <td className="p-3 align-middle text-center border-r border-gray-100">
                  <div className="text-blue-500 hover:underline cursor-pointer">{p.sku}</div>
                  <div className="text-gray-400 mt-1">{p.supplierSku} <ExternalLink className="w-3 h-3 inline cursor-pointer hover:text-blue-400" /></div>
                </td>
                <td className="p-3 align-middle text-gray-800 border-r border-gray-100">
                  {p.name}
                </td>
                <td className="p-3 align-middle text-center border-r border-gray-100">
                  <div className="text-blue-500 flex items-center justify-center gap-1 cursor-pointer hover:underline">
                    {p.link} <ExternalLink className="w-3 h-3" />
                  </div>
                </td>
                <td className="p-3 align-middle text-center text-gray-600 border-r border-gray-100">
                  <div>{p.minPrice}</div>
                  <div>{p.lastPrice}</div>
                </td>
                <td className="p-3 align-middle text-center text-gray-600 border-r border-gray-100">
                  <div>{p.minOrder}</div>
                  <div>{p.minMulti}</div>
                </td>
                <td className="p-3 align-middle text-center text-gray-600 border-r border-gray-100">
                  {p.addTime}
                </td>
                <td className="p-3 align-middle text-center text-green-500 border-r border-gray-100">
                  {p.isDefault}
                </td>
                <td className="p-3 align-middle text-center text-gray-600 border-r border-gray-100">
                  {p.thirdId === '--' ? (
                    '--'
                  ) : (
                    <div className="flex items-center gap-2 text-left justify-center">
                      <img src="https://via.placeholder.com/30" alt="third" className="w-8 h-8 object-cover border border-gray-200 rounded" />
                      <div className="text-[12px] whitespace-pre-line">
                        <div className="text-orange-500">{p.thirdId.split('\n')[0]}</div>
                        <div className="text-gray-800">{p.thirdId.split('\n')[1]}</div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="p-3 align-middle text-center border-r border-gray-100">
                  <div className="flex flex-col items-center justify-center gap-1 text-[12px] text-blue-500">
                    {p.thirdId !== '--' ? (
                      <FeatureMarker title="取消匹配" description="交互说明：放弃当前操作并关闭弹窗。">
                      <span 
                        className="cursor-pointer hover:underline" 
                        onClick={() => {
                          setLinkedProducts(prev => prev.map(item => item.id === p.id ? { ...item, thirdId: '--' } : item));
                          setSuccessMessageOpen(true);
                          setTimeout(() => setSuccessMessageOpen(false), 2000);
                        }}
                      >
                        取消匹配
                      </span>
                      </FeatureMarker>
                    ) : (
                      <FeatureMarker title="匹配第三方商品" description="交互说明：点击执行匹配第三方商品操作。">
                      <span 
                        className="cursor-pointer hover:underline" 
                        onClick={() => {
                          if (!supplier?.link1688) {
                            setConfirmBindModalOpen({ open: true, productId: p.id });
                          } else {
                            setMatchThirdPartyModalOpen({ open: true, productId: p.id });
                          }
                        }}
                      >
                        匹配第三方商品
                      </span>
                      </FeatureMarker>
                    )}
                    <FeatureMarker title="编辑" description="交互说明：点击打开编辑弹窗，修改当前项信息。">
<span className="cursor-pointer hover:underline" onClick={() => setEditModal({ open: true, product: p })}>编辑</span>
</FeatureMarker>
                    <FeatureMarker title="删除" description="交互说明：点击删除选中的数据项，操作不可恢复。">
<span className="cursor-pointer hover:underline text-red-500" onClick={() => setDeleteModal({ open: true, productId: p.id })}>删除</span>
</FeatureMarker>
                    <FeatureMarker title="采购记录" description="交互说明：点击执行采购记录操作。">
<span className="cursor-pointer hover:underline" onClick={() => setHistoryModal({ open: true, product: p })}>采购记录</span>
</FeatureMarker>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-3 border-t border-gray-200 text-[12px] text-gray-600 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span>每页</span>
          <select className="border border-gray-300 rounded outline-none h-6 px-1">
            <option>10 条</option>
          </select>
          <span>共 {linkedProducts.length} 条 当前显示第 1-{linkedProducts.length} 条 1/1 页</span>
          <div className="flex items-center gap-1 ml-2">
            <FeatureMarker title="&lt;&lt;" description="交互说明：点击执行&lt;&lt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-400">&lt;&lt;</button>
</FeatureMarker>
            <FeatureMarker title="&lt;" description="交互说明：点击执行&lt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-400">&lt;</button>
</FeatureMarker>
            <FeatureMarker title="1" description="交互说明：点击执行1操作。">
<button className="w-6 h-6 flex items-center justify-center border border-transparent text-red-500 font-medium">1</button>
</FeatureMarker>
            <FeatureMarker title="&gt;" description="交互说明：点击执行&gt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-400">&gt;</button>
</FeatureMarker>
            <FeatureMarker title="&gt;&gt;" description="交互说明：点击执行&gt;&gt;操作。">
<button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded bg-white text-gray-400">&gt;&gt;</button>
</FeatureMarker>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
        <FeatureMarker title="返回" description="交互说明：点击执行返回操作。">
<Button variant="outline" className="h-8 px-6 font-normal bg-gray-50" onClick={onBack}>返回</Button>
</FeatureMarker>
      </div>

      <AddLinkedProductModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen} 
        onSave={(newProduct) => {
          setLinkedProducts(prev => [newProduct, ...prev]);
        }} 
      />

      <EditLinkedProductModal
        open={editModal.open}
        onOpenChange={(open: boolean) => setEditModal({ open, product: editModal.product })}
        product={editModal.product}
        onSave={(updatedProduct: any) => {
          setLinkedProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        }}
      />

      <ConfirmDeleteProductModal
        open={deleteModal.open}
        onOpenChange={(open: boolean) => setDeleteModal({ open, productId: deleteModal.productId, isBatch: deleteModal.isBatch })}
        onConfirm={() => {
          if (deleteModal.isBatch) {
            setLinkedProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
          } else if (deleteModal.productId) {
            setLinkedProducts(prev => prev.filter(p => p.id !== deleteModal.productId));
          }
        }}
      />

      <PurchaseHistoryModal
        open={historyModal.open}
        onOpenChange={(open: boolean) => setHistoryModal({ open, product: historyModal.product })}
        product={historyModal.product}
      />

      <ImportSupplierModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
      />

      <ConfirmBindThirdPartyModal
        open={confirmBindModalOpen.open}
        onOpenChange={(open: boolean) => setConfirmBindModalOpen({ open, productId: confirmBindModalOpen.productId })}
        supplierName={supplier?.name || ''}
        onConfirm={() => {
          setConfirmBindModalOpen({ open: false });
          setMatchThirdPartyModalOpen({ open: true, productId: confirmBindModalOpen.productId });
        }}
      />

      <MatchThirdPartyModal
        open={matchThirdPartyModalOpen.open}
        onOpenChange={(open: boolean) => setMatchThirdPartyModalOpen({ open, productId: matchThirdPartyModalOpen.productId })}
        supplierName={supplier?.name || ''}
        onMatch={(link) => {
          setLinkedProducts(prev => prev.map(p => 
            (matchThirdPartyModalOpen.productId === p.id || selectedIds.includes(p.id))
              ? { ...p, thirdId: '836436994810\n白T恤【厚】30cm左右公仔穿' } 
              : p
          ));
          if (!matchThirdPartyModalOpen.productId) {
            setSelectedIds([]);
          }
        }}
      />
    </div>
  );
}
