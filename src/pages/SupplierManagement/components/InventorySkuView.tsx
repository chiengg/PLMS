import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, Search, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LinkSupplierModal, ChangePairingModal, BatchLinkSupplierModal, BatchSetDefaultSupplierModal, BatchChangePairingModal } from './InventorySkuModals';

export default function InventorySkuView() {
  const [keywordType, setKeywordType] = useState('库存SKU');
  const [hasLinked, setHasLinked] = useState('全部');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [linkSupplierModal, setLinkSupplierModal] = useState<{open: boolean, product?: any}>({ open: false });
  const [changePairingModal, setChangePairingModal] = useState<{open: boolean, product?: any}>({ open: false });

  const [batchLinkModalOpen, setBatchLinkModalOpen] = useState(false);
  const [batchDefaultModalOpen, setBatchDefaultModalOpen] = useState(false);
  const [batchPairingModalOpen, setBatchPairingModalOpen] = useState(false);

  const [products] = useState([
    {
      id: '1',
      image: 'https://via.placeholder.com/40',
      sku: '10006102-0-B0-AMHyper',
      name: 'AMHyper世界杯大白鹅摆件服饰_23英寸门廊鹅裙子',
      mainSku: '',
      hasDownPrice: true,
      has1688Link: true, // Used to determine if we show "1688" or "配对1688商品"
      defaultSupplier: '世界杯足球风大白鹅衣服',
      recentTime: '-暂无-',
      lastPrice: '0'
    },
    {
      id: '2',
      image: 'https://via.placeholder.com/40',
      sku: '10006102-0-A0-AMHyper',
      name: 'AMHyper世界杯大白鹅摆件服饰_23英寸门廊鹅足球款',
      mainSku: '',
      hasDownPrice: true,
      has1688Link: true,
      defaultSupplier: '世界杯足球风大白鹅衣服',
      recentTime: '-暂无-',
      lastPrice: '0'
    },
    {
      id: '3',
      image: 'https://via.placeholder.com/40',
      sku: '10006130-BK-A2XL-AMHyper',
      name: 'AMHyper布吉纯涤圆领长袖_黑色_2XL',
      mainSku: '',
      hasDownPrice: false,
      has1688Link: false,
      defaultSupplier: '东莞市沙田布吉吉服饰经...',
      recentTime: '-暂无-',
      lastPrice: '0'
    }
  ]);

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Search Area */}
      <div className="p-4 border-b border-gray-200 bg-white flex flex-col gap-4 flex-shrink-0 text-[13px]">
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">搜索内容：</span>
          <div className="flex items-center gap-4 text-gray-600">
            {['库存SKU', '商品名称', '主SKU'].map(t => (
              <label key={t} className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                <input type="radio" name="skuKwType" checked={keywordType === t} onChange={() => setKeywordType(t)} />
                {t}
              </label>
            ))}
          </div>
          <div className="flex items-center ml-4">
            <Input className="h-8 w-64 border-gray-300 focus-visible:ring-0 text-[12px] rounded-r-none" placeholder="双击批量搜索" />
            <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
            <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 rounded-l-none font-normal gap-1">
              <Search className="w-3.5 h-3.5" /> 搜索
            </Button>
            </FeatureMarker>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">是否关联供应商：</span>
          <div className="flex items-center gap-3 text-gray-600">
            {['全部', '已关联', '未关联'].map(s => (
              <FeatureMarker title="{s}" description="交互说明：点击执行{s}操作。">
              <span 
                key={s} 
                className={`cursor-pointer px-2 py-0.5 rounded ${hasLinked === s ? 'text-blue-600 border border-blue-600 bg-blue-50' : 'hover:text-blue-600 border border-transparent'}`}
                onClick={() => setHasLinked(s)}
              >
                {s}
              </span>
              </FeatureMarker>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <FeatureMarker title="📄" description="交互说明：点击执行📄操作。">
            <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal gap-1 px-4">
              <span className="text-white">📄</span> 批量操作 <ChevronDown className="w-3.5 h-3.5 ml-1 text-white/80" />
            </Button>
            </FeatureMarker>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40 bg-white">
            <DropdownMenuItem 
              className="text-[13px] cursor-pointer"
              onClick={() => {
                if (selectedIds.length === 0) return alert('请先勾选数据');
                setBatchLinkModalOpen(true);
              }}
            >
              批量关联供应商
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-[13px] cursor-pointer"
              onClick={() => {
                if (selectedIds.length === 0) return alert('请先勾选数据');
                setBatchDefaultModalOpen(true);
              }}
            >
              批量设置默认供应商
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-[13px] cursor-pointer"
              onClick={() => {
                if (selectedIds.length === 0) return alert('请先勾选数据');
                setBatchPairingModalOpen(true);
              }}
            >
              批量配对1688商品
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] cursor-pointer">批量导出</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
            <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal gap-1 px-4">
              导入/出相关 <ChevronDown className="w-3.5 h-3.5 ml-1 text-white/80" />
            </Button>
            </FeatureMarker>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 bg-white">
            <DropdownMenuItem className="text-[13px] cursor-pointer">关联商品导入</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] cursor-pointer">导入更新关联商品</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-[12px] text-center border-collapse min-w-[1200px]">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
            <tr className="text-gray-600">
              <th className="p-3 w-10 font-normal border-r border-gray-100">
                <Checkbox />
              </th>
              <th className="p-3 font-normal w-24 border-r border-gray-100">缩略图</th>
              <th className="p-3 font-normal min-w-[300px] border-r border-gray-100 text-left">库存SKU / 中文名称 / 主SKU</th>
              <th className="p-3 font-normal w-64 border-r border-gray-100">默认供应商</th>
              <th className="p-3 font-normal w-40 border-r border-gray-100">最近采购时间</th>
              <th className="p-3 font-normal w-32 border-r border-gray-100">上次采购价</th>
              <th className="p-3 font-normal w-32">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-blue-50/30">
                <td className="p-3 text-center align-middle border-r border-gray-100">
                  <Checkbox 
                    checked={selectedIds.includes(p.id)}
                    onCheckedChange={(c) => setSelectedIds(c ? [...selectedIds, p.id] : selectedIds.filter(id => id !== p.id))}
                  />
                </td>
                <td className="p-3 align-middle text-center border-r border-gray-100">
                  <div className="flex flex-col items-center">
                    <img src={p.image} alt="thumb" className="w-12 h-12 object-cover border border-gray-200 rounded" />
                    {p.has1688Link ? (
                      <span className="text-[12px] text-blue-500 mt-1 cursor-pointer hover:underline">1688</span>
                    ) : (
                      <div className="text-[12px] text-blue-500 mt-1 cursor-pointer hover:underline whitespace-nowrap">配对1688商品</div>
                    )}
                  </div>
                </td>
                <td className="p-3 align-middle text-left border-r border-gray-100">
                  <div className="text-blue-500 hover:underline cursor-pointer">{p.sku}</div>
                  <div className="text-gray-800 mt-1">{p.name}</div>
                </td>
                <td className="p-3 align-middle border-r border-gray-100">
                  <div className="text-blue-500 flex items-center justify-center gap-1 cursor-pointer hover:underline">
                    {p.defaultSupplier} <span className="text-blue-500 cursor-pointer ml-1">🔄</span>
                  </div>
                </td>
                <td className="p-3 align-middle text-gray-800 border-r border-gray-100 text-center">
                  {p.recentTime}
                </td>
                <td className="p-3 align-middle text-gray-800 border-r border-gray-100 text-center">
                  {p.lastPrice}
                </td>
                <td className="p-3 align-middle text-center">
                  <div className="flex flex-col items-center justify-center gap-1 text-[12px] text-blue-500">
                    <FeatureMarker title="关联供应商" description="交互说明：点击执行关联供应商操作。">
<span className="cursor-pointer hover:underline" onClick={() => setLinkSupplierModal({ open: true, product: p })}>关联供应商</span>
</FeatureMarker>
                    {p.has1688Link && (
                      <FeatureMarker title="更换配对" description="交互说明：点击执行更换配对操作。">
<span className="cursor-pointer hover:underline" onClick={() => setChangePairingModal({ open: true, product: p })}>更换配对</span>
</FeatureMarker>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <LinkSupplierModal
        open={linkSupplierModal.open}
        onOpenChange={(open: boolean) => setLinkSupplierModal({ open, product: linkSupplierModal.product })}
        product={linkSupplierModal.product}
      />
      <ChangePairingModal
        open={changePairingModal.open}
        onOpenChange={(open: boolean) => setChangePairingModal({ open, product: changePairingModal.product })}
        product={changePairingModal.product}
      />
      <BatchLinkSupplierModal
        open={batchLinkModalOpen}
        onOpenChange={setBatchLinkModalOpen}
      />
      <BatchSetDefaultSupplierModal
        open={batchDefaultModalOpen}
        onOpenChange={setBatchDefaultModalOpen}
        products={products.filter(p => selectedIds.includes(p.id))}
      />
      <BatchChangePairingModal
        open={batchPairingModalOpen}
        onOpenChange={setBatchPairingModalOpen}
        products={products.filter(p => selectedIds.includes(p.id))}
      />
    </div>
  );
}
