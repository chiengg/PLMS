import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChevronDown, Edit, Image as ImageIcon, Search, Settings, Printer, Plus } from 'lucide-react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import SalesTrendDialog from './SalesTrendDialog';
import ProductTableColumnsDialog, { type ProductTableFieldKey, type ProductTableFieldOption } from './ProductTableColumnsDialog';
import { PRODUCTS_KEY, defaultProductsFromLegacyMock } from '../data';
import type { Product } from '../types';

const PRODUCTS_TABLE_COLUMNS_KEY = 'products_table_columns_v1';

const PRODUCT_TABLE_FIELD_OPTIONS: ProductTableFieldOption[] = [
  { key: '原厂SKU', label: '原厂SKU' },
  { key: '主SKU', label: '主SKU' },
  { key: '最后入库时间', label: '最后入库时间' },
  { key: '最后出库时间', label: '最后出库时间' },
  { key: '库存SKU中文名称', label: '库存SKU中文名称' },
  { key: '库存SKU英文名称', label: '库存SKU英文名称' },
  { key: '申报品名(英文)', label: '申报品名(英文)' },
  { key: '申报品名(中文)', label: '申报品名(中文)' },
  { key: '销售员', label: '销售员' },
  { key: '仓库类型', label: '仓库类型' },
  { key: '预测日销量', label: '预测日销量' },
  { key: '在途量', label: '在途量' },
  { key: '包装个数', label: '包装个数' },
  { key: '售价(RMB)', label: '售价(RMB)' },
  { key: '停止销售时间', label: '停止销售时间' },
  { key: '统一成本价(RMB)', label: '统一成本价(RMB)' },
  { key: '开发员', label: '开发员' },
  { key: '开发助理', label: '开发助理' },
  { key: '品牌', label: '品牌' },
  { key: '商品形态', label: '商品形态' },
  { key: '多属性', label: '多属性' },
  { key: '加工量', label: '加工量' },
  { key: 'top100', label: 'top100' },
  { key: '尺寸', label: '尺寸' },
  { key: '包装后重量(kg)', label: '包装后重量(kg)' },
  { key: '包装后尺寸', label: '包装后尺寸' },
  { key: '装箱尺寸', label: '装箱尺寸' },
  { key: '装箱数', label: '装箱数' },
  { key: '装箱毛重(kg)', label: '装箱毛重(kg)' },
  { key: '创建时间', label: '创建时间' },
  { key: '创建人员', label: '创建人员' },
  { key: '商品目录', label: '商品目录' },
  { key: '采购员', label: '采购员' },
  { key: '美工', label: '美工' },
  { key: '自定义分类', label: '自定义分类' },
  { key: '附属销售员', label: '附属销售员' },
  { key: '商品备注', label: '商品备注' },
  { key: '已配对在线量', label: '已配对在线量' },
  { key: '可用库存', label: '可用库存' },
  { key: '申报价格', label: '申报价格' },
  { key: '预测入量', label: '预测入量' },
  { key: 'NCM', label: 'NCM' },
  { key: '箱数', label: '箱数' },
  { key: '缩略图', label: '缩略图' },
  { key: '状态', label: '状态' },
  { key: '库存总量(个)', label: '库存总量(个)' },
  { key: '未发货数量', label: '未发货数量' },
  { key: '销量(7/28/42)', label: '销量(7/28/42)' },
  { key: '重量(g)', label: '重量(g)' },
  { key: '默认供应商', label: '默认供应商' },
];

const DEFAULT_PRODUCT_TABLE_FIELDS: ProductTableFieldKey[] = [
  '缩略图',
  '库存SKU中文名称',
  '状态',
  '库存总量(个)',
  '在途量',
  '未发货数量',
  '预测入量',
  '可用库存',
  '销量(7/28/42)',
  '预测日销量',
  '重量(g)',
  '默认供应商',
];

type ColumnGroupKey = 'thumb' | 'skuCell' | 'status' | 'inventory' | 'sales' | 'weight' | 'supplier';

const INVENTORY_FIELDS: ProductTableFieldKey[] = ['库存总量(个)', '在途量', '未发货数量', '预测入量', '可用库存'];
const SALES_FIELDS: ProductTableFieldKey[] = ['销量(7/28/42)', '预测日销量'];
const WEIGHT_FIELDS: ProductTableFieldKey[] = ['重量(g)', '包装后重量(kg)', '包装后尺寸', '装箱尺寸', '装箱数', '装箱毛重(kg)', '包装个数'];
const SUPPLIER_FIELDS: ProductTableFieldKey[] = ['默认供应商'];
const STATUS_FIELDS: ProductTableFieldKey[] = ['状态'];
const THUMB_FIELDS: ProductTableFieldKey[] = ['缩略图'];

interface ProductTableProps {
  filterValues: any;
}

export default function ProductTable({ filterValues }: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [trendOpen, setTrendOpen] = useState(false);
  const [trendSku, setTrendSku] = useState('');
  const [columnsDialogOpen, setColumnsDialogOpen] = useState(false);

  const [storedFields, setStoredFields] = useLocalStorage<ProductTableFieldKey[]>(
    PRODUCTS_TABLE_COLUMNS_KEY,
    DEFAULT_PRODUCT_TABLE_FIELDS
  );

  const [products] = useLocalStorage<Product[]>(PRODUCTS_KEY, defaultProductsFromLegacyMock());
  const safeProducts = Array.isArray(products) ? products : [];

  useEffect(() => {
    setSelectedIds([]);
  }, [filterValues]);

  useEffect(() => {
    if (!Array.isArray(storedFields)) return;
    const oldKeys = new Set(['thumb', 'skuName', 'status', 'inventory', 'sales', 'weight', 'supplier']);
    if (!storedFields.some((k: any) => oldKeys.has(k))) return;

    const mapped: ProductTableFieldKey[] = [];
    storedFields.forEach((k: any) => {
      if (k === 'thumb') mapped.push('缩略图');
      if (k === 'skuName') mapped.push('库存SKU中文名称');
      if (k === 'status') mapped.push('状态');
      if (k === 'inventory') mapped.push('库存总量(个)', '在途量', '未发货数量', '预测入量', '可用库存');
      if (k === 'sales') mapped.push('销量(7/28/42)', '预测日销量');
      if (k === 'weight') mapped.push('重量(g)');
      if (k === 'supplier') mapped.push('默认供应商');
    });

    const unique = Array.from(new Set(mapped));
    setStoredFields(unique.length > 0 ? unique : DEFAULT_PRODUCT_TABLE_FIELDS);
  }, [setStoredFields, storedFields]);

  const selectedFieldKeys = useMemo(() => {
    const valid = new Set<ProductTableFieldKey>(PRODUCT_TABLE_FIELD_OPTIONS.map(o => o.key));
    const normalized = Array.isArray(storedFields) ? storedFields.filter(k => valid.has(k)) : [];
    return normalized.length > 0 ? normalized : DEFAULT_PRODUCT_TABLE_FIELDS;
  }, [storedFields]);

  const visibleGroups = useMemo(() => {
    const selected = new Set<ProductTableFieldKey>(selectedFieldKeys);
    const hasAny = (keys: ProductTableFieldKey[]) => keys.some(k => selected.has(k));

    const showThumb = hasAny(THUMB_FIELDS);
    const showStatus = hasAny(STATUS_FIELDS);
    const showInventory = hasAny(INVENTORY_FIELDS);
    const showSales = hasAny(SALES_FIELDS);
    const showWeight = hasAny(WEIGHT_FIELDS);
    const showSupplier = hasAny(SUPPLIER_FIELDS);

    const skuCellKeys = PRODUCT_TABLE_FIELD_OPTIONS
      .map(o => o.key)
      .filter(k =>
        !THUMB_FIELDS.includes(k) &&
        !STATUS_FIELDS.includes(k) &&
        !INVENTORY_FIELDS.includes(k) &&
        !SALES_FIELDS.includes(k) &&
        !WEIGHT_FIELDS.includes(k) &&
        !SUPPLIER_FIELDS.includes(k)
      );
    const showSkuCell = skuCellKeys.some(k => selected.has(k));

    const groups: ColumnGroupKey[] = [];
    if (showThumb) groups.push('thumb');
    if (showSkuCell) groups.push('skuCell');
    if (showStatus) groups.push('status');
    if (showInventory) groups.push('inventory');
    if (showSales) groups.push('sales');
    if (showWeight) groups.push('weight');
    if (showSupplier) groups.push('supplier');
    return groups;
  }, [selectedFieldKeys]);

  const tableRows = safeProducts.map((p: any) => {
    const inventoryQty = Number.isFinite(p?.warehouseInfo?.inventoryQty)
      ? p.warehouseInfo.inventoryQty
      : Number.isFinite(p?.inventory?.total)
        ? p.inventory.total
        : 0;

    const forecastDailySales = Number.isFinite(p?.warehouseInfo?.forecastDailySales)
      ? p.warehouseInfo.forecastDailySales
      : Number.isFinite(Number(p?.sales?.forecast))
        ? Number(p.sales.forecast)
        : 0;

    return {
      id: String(p.id ?? p.sku ?? Math.random()),
      raw: p,
      thumb: p.inventoryImageUrl || p.thumb || 'https://via.placeholder.com/40',
      sku: p.sku || '',
      name: p.cnName || p.name || '',
      status: p.status || '正常销售',
      inventory: {
        total: inventoryQty,
        inTransit: 0,
        unshipped: '0(0/0/0/0)',
        preInbound: 0,
        available: inventoryQty,
      },
      sales: { history: '0/0/0', forecast: forecastDailySales.toFixed(3) },
      weight: p.weight ?? '--',
      supplier: p.supplier ?? '--',
    };
  });

  const skuOptions = safeProducts.map((d: any) => d?.sku).filter(Boolean);

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(tableRows.map(d => d.id));
    else setSelectedIds([]);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Action Bar */}
      <div className="p-2 border-b border-gray-200 flex flex-wrap items-center gap-2 bg-[#F8FAFC] shrink-0 text-[13px]">
        <FeatureMarker title="批处理功能" description="对选中的商品执行批量操作（如下架、修改分类、更新状态等）。">
          <Button className="h-7 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-3 gap-1 rounded-sm text-[13px]">
            <Edit className="w-3.5 h-3.5" /> 批处理功能 <ChevronDown className="w-3.5 h-3.5" />
          </Button>
        </FeatureMarker>

        <FeatureMarker title="更多功能" description="包含更多不常用的扩展操作菜单。">
          <Button className="h-7 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-3 gap-1 rounded-sm text-[13px]">
            <Settings className="w-3.5 h-3.5" /> 更多功能 <ChevronDown className="w-3.5 h-3.5" />
          </Button>
        </FeatureMarker>

        <FeatureMarker title="打印中心" description="批量打印选中商品的条码或标签。">
          <Button className="h-7 bg-[#F0B144] hover:bg-[#E0A134] text-white px-3 gap-1 rounded-sm text-[13px]">
            <Printer className="w-3.5 h-3.5" /> 打印中心 <ChevronDown className="w-3.5 h-3.5" />
          </Button>
        </FeatureMarker>

        <FeatureMarker title="图片管理" description="管理商品的图库、主图及辅图信息。">
          <Button className="h-7 bg-[#8CC63F] hover:bg-[#7AB62F] text-white px-3 gap-1 rounded-sm text-[13px]">
            <ImageIcon className="w-3.5 h-3.5" /> 图片管理
          </Button>
        </FeatureMarker>

        <Button className="h-7 bg-[#8CB5E2] hover:bg-[#7AA4D1] text-white px-3 gap-1 rounded-sm text-[13px]">
          排序 <ChevronDown className="w-3.5 h-3.5" />
        </Button>
        <Button className="h-7 bg-[#8CB5E2] hover:bg-[#7AA4D1] text-white px-3 gap-1 rounded-sm text-[13px]">
          数据刷新 <ChevronDown className="w-3.5 h-3.5" />
        </Button>

        <label className="flex items-center gap-1.5 ml-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-blue-600 rounded-sm" />
          <span className="text-red-500 font-medium">显示平台仓库库存</span>
        </label>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-blue-600 cursor-pointer hover:underline">SKU库存查询</span>
          <Button className="h-7 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-3 rounded-sm text-[13px]">
            导入商品目录
          </Button>
          <FeatureMarker title="添加/导出" description="支持手动添加单个商品，或将列表内商品数据导出为 Excel 文件。">
            <Button className="h-7 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-3 gap-1 rounded-sm text-[13px]">
              <Plus className="w-3.5 h-3.5" /> 添加/导出 <ChevronDown className="w-3.5 h-3.5" />
            </Button>
          </FeatureMarker>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-full text-center text-[12px] border-collapse min-w-[1800px]">
          <thead className="bg-[#F8FAFC] text-gray-600 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-2 font-normal border-b border-r border-gray-200 w-10">
                <Checkbox 
                  checked={selectedIds.length === tableRows.length && tableRows.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              {visibleGroups.map((group) => {
                if (group === 'thumb') {
                  return (
                    <th key={group} className="p-2 font-normal border-b border-r border-gray-200 w-24">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-blue-500 border border-blue-500 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">+</span>
                        缩略图
                      </div>
                    </th>
                  );
                }

                if (group === 'skuCell') {
                  return (
                    <th key={group} className="p-2 font-normal border-b border-r border-gray-200 w-64 text-blue-600 cursor-pointer hover:underline">
                      库存SKU ↕<br/>商品中文名 ↕
                    </th>
                  );
                }

                if (group === 'status') {
                  return (
                    <th key={group} className="p-2 font-normal border-b border-r border-gray-200 w-24">
                      状态
                    </th>
                  );
                }

                if (group === 'inventory') {
                  const selected = new Set<ProductTableFieldKey>(selectedFieldKeys);
                  return (
                    <th key={group} className="p-2 font-normal border-b border-r border-gray-200 w-40 text-blue-600 cursor-pointer hover:underline">
                      {selected.has('库存总量(个)') && <>库存总量(个) ↕<br/></>}
                      {selected.has('在途量') && <>在途量 ↕<br/></>}
                      {selected.has('未发货数量') && (
                        <span className="text-gray-600 no-underline cursor-default flex items-center justify-center gap-1">
                          <span className="bg-blue-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]">?</span>
                          未发货数量 ↕
                        </span>
                      )}
                      {selected.has('未发货数量') && <br/>}
                      {selected.has('预测入量') && <>预测入量<br/></>}
                      {selected.has('可用库存') && (
                        <span className="text-gray-600 no-underline cursor-default flex items-center justify-center gap-1">
                          <span className="bg-blue-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]">?</span>
                          可用库存
                        </span>
                      )}
                    </th>
                  );
                }

                if (group === 'sales') {
                  const selected = new Set<ProductTableFieldKey>(selectedFieldKeys);
                  return (
                    <th key={group} className="p-2 font-normal border-b border-r border-gray-200 w-32 text-blue-600 cursor-pointer hover:underline">
                      {selected.has('销量(7/28/42)') && <>销量(7/28/42) ↕<br/></>}
                      {selected.has('预测日销量') && <>预测日销量(个) ↕</>}
                    </th>
                  );
                }

                if (group === 'weight') {
                  return (
                    <th key={group} className="p-2 font-normal border-b border-r border-gray-200 w-24 text-blue-600 cursor-pointer hover:underline">
                      重量(g) ↕
                    </th>
                  );
                }

                if (group === 'supplier') {
                  return (
                    <th key={group} className="p-2 font-normal border-b border-r border-gray-200 w-32">
                      默认供应商
                    </th>
                  );
                }

                return null;
              })}
              <th className="p-2 font-normal border-b border-gray-200 w-24">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableRows.map((item, idx) => (
              <tr key={item.id} className="hover:bg-blue-50/30">
                <td className="p-2 border-r border-gray-100">
                  <div className="flex items-center justify-center gap-2">
                    <Checkbox 
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={(c) => setSelectedIds(c ? [...selectedIds, item.id] : selectedIds.filter(id => id !== item.id))}
                    />
                    <span>{idx + 1}</span>
                  </div>
                </td>
                {visibleGroups.map((group) => {
                  if (group === 'thumb') {
                    return (
                      <td key={group} className="p-2 border-r border-gray-100">
                        <div className="flex flex-col items-center gap-1">
                          <img src={item.thumb} alt="thumb" className="w-10 h-10 border border-gray-200 rounded object-cover" />
                          <span className="text-blue-500 cursor-pointer hover:underline text-[10px]">添加1688链<br/>接查找货源</span>
                        </div>
                      </td>
                    );
                  }

                  if (group === 'skuCell') {
                    const selected = new Set<ProductTableFieldKey>(selectedFieldKeys);
                    const raw = item.raw ?? {};
                    const line = (label: string, value: any) => (
                      <div className="text-[12px] text-gray-600 mt-1">
                        <span className="text-gray-500">{label}：</span>
                        <span className="text-gray-700">{value ?? '--'}</span>
                      </div>
                    );

                    const skuCnBlock = selected.has('库存SKU中文名称') ? (
                      <>
                        <div className="flex items-center gap-1 text-blue-600 cursor-pointer hover:underline font-medium">
                          <span className="border border-blue-500 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]">+</span>
                          {item.sku}
                        </div>
                        <div className="text-gray-700 mt-1">{item.name}</div>
                      </>
                    ) : null;

                    return (
                      <td key={group} className="p-2 border-r border-gray-100 text-left px-4">
                        {skuCnBlock}
                        {selected.has('库存SKU英文名称') && line('库存SKU英文名称', raw.enName ?? '--')}
                        {selected.has('主SKU') && line('主SKU', raw.mainSku ?? '--')}
                        {selected.has('原厂SKU') && line('原厂SKU', raw.factorySku ?? '--')}
                        {selected.has('品牌') && line('品牌', raw.brandName ?? '--')}
                        {selected.has('商品目录') && line('商品目录', raw.categoryName ?? '--')}
                        {selected.has('商品形态') && line('商品形态', raw.shape ?? '--')}
                        {selected.has('开发员') && line('开发员', raw.developer ?? '--')}
                        {selected.has('商品备注') && line('商品备注', raw.productNote ?? '--')}
                        {selected.has('申报品名(英文)') && line('申报品名(英文)', '--')}
                        {selected.has('申报品名(中文)') && line('申报品名(中文)', '--')}
                        {selected.has('申报价格') && line('申报价格', '--')}
                        {selected.has('NCM') && line('NCM', '--')}
                        {selected.has('箱数') && line('箱数', '--')}
                        {selected.has('最后入库时间') && line('最后入库时间', '--')}
                        {selected.has('最后出库时间') && line('最后出库时间', '--')}
                        {selected.has('创建时间') && line('创建时间', raw.createdAt ? new Date(raw.createdAt).toLocaleString() : '--')}
                        {selected.has('创建人员') && line('创建人员', '--')}
                        {selected.has('采购员') && line('采购员', '--')}
                        {selected.has('销售员') && line('销售员', '--')}
                        {selected.has('附属销售员') && line('附属销售员', '--')}
                        {selected.has('美工') && line('美工', '--')}
                        {selected.has('仓库类型') && line('仓库类型', '--')}
                        {selected.has('多属性') && line('多属性', '--')}
                        {selected.has('加工量') && line('加工量', '--')}
                        {selected.has('top100') && line('top100', '--')}
                        {selected.has('尺寸') && line('尺寸', '--')}
                        {selected.has('售价(RMB)') && line('售价(RMB)', '--')}
                        {selected.has('统一成本价(RMB)') && line('统一成本价(RMB)', '--')}
                        {selected.has('停止销售时间') && line('停止销售时间', '--')}
                        {selected.has('开发助理') && line('开发助理', '--')}
                        {selected.has('自定义分类') && line('自定义分类', '--')}
                        <div className="flex items-center gap-2 mt-2">
                          {idx > 1 && <span className="text-blue-500 hover:underline cursor-pointer">1688</span>}
                          {idx > 1 && <span className="bg-[#8CC63F] text-white px-1.5 py-0.5 rounded-sm text-[10px] flex items-center gap-1 cursor-pointer"><ImageIcon className="w-3 h-3"/> 同款降本</span>}
                          <span className="border border-orange-500 text-orange-500 px-1.5 py-0.5 rounded-sm text-[10px] flex items-center gap-1 cursor-pointer">
                            <Search className="w-3 h-3"/> 找同款
                          </span>
                        </div>
                      </td>
                    );
                  }

                  if (group === 'status') {
                    return (
                      <td key={group} className="p-2 border-r border-gray-100 text-green-500">
                        {item.status}
                      </td>
                    );
                  }

                  if (group === 'inventory') {
                    const selected = new Set<ProductTableFieldKey>(selectedFieldKeys);
                    return (
                      <td key={group} className="p-2 border-r border-gray-100">
                        {selected.has('库存总量(个)') && <div className="text-gray-800">{item.inventory.total}</div>}
                        {selected.has('在途量') && (
                          <div className="text-gray-800 flex items-center justify-center gap-1">
                            {item.inventory.inTransit} <span className="text-blue-500 cursor-pointer">≡</span>
                          </div>
                        )}
                        {selected.has('未发货数量') && <div className="text-gray-800">{item.inventory.unshipped}</div>}
                        {selected.has('预测入量') && (
                          <div className="text-gray-800 flex items-center justify-center gap-1">
                            {item.inventory.preInbound} <span className="text-blue-500 cursor-pointer">≡</span>
                          </div>
                        )}
                        {selected.has('可用库存') && <div className="text-gray-800">{item.inventory.available}</div>}
                      </td>
                    );
                  }

                  if (group === 'sales') {
                    const selected = new Set<ProductTableFieldKey>(selectedFieldKeys);
                    return (
                      <td key={group} className="p-2 border-r border-gray-100">
                        {selected.has('销量(7/28/42)') && <div className="text-gray-800">{item.sales.history}</div>}
                        {selected.has('预测日销量') && (
                          <div className="text-gray-800 flex items-center justify-center gap-1">
                            {item.sales.forecast}{' '}
                            <button
                              type="button"
                              className="inline-flex h-5 w-5 items-center justify-center rounded border border-blue-400 text-blue-500 hover:bg-blue-50"
                              onClick={() => {
                                setTrendSku(item.sku);
                                setTrendOpen(true);
                              }}
                            >
                              📈
                            </button>
                          </div>
                        )}
                      </td>
                    );
                  }

                  if (group === 'weight') {
                    const selected = new Set<ProductTableFieldKey>(selectedFieldKeys);
                    return (
                      <td key={group} className="p-2 border-r border-gray-100 text-gray-800">
                        {selected.has('重量(g)') && item.weight}
                        {selected.has('包装后重量(kg)') && <div className="mt-2 text-[12px] text-gray-600">包装后重量(kg)：--</div>}
                        {selected.has('包装后尺寸') && <div className="mt-1 text-[12px] text-gray-600">包装后尺寸：--</div>}
                        {selected.has('装箱尺寸') && <div className="mt-1 text-[12px] text-gray-600">装箱尺寸：--</div>}
                        {selected.has('装箱数') && <div className="mt-1 text-[12px] text-gray-600">装箱数：--</div>}
                        {selected.has('装箱毛重(kg)') && <div className="mt-1 text-[12px] text-gray-600">装箱毛重(kg)：--</div>}
                        {selected.has('包装个数') && <div className="mt-1 text-[12px] text-gray-600">包装个数：--</div>}
                        <div className="mt-4"><span className="text-blue-600 cursor-pointer hover:underline">出入库日志</span></div>
                      </td>
                    );
                  }

                  if (group === 'supplier') {
                    return (
                      <td key={group} className="p-2 border-r border-gray-100 text-gray-800">
                        {item.supplier}
                      </td>
                    );
                  }

                  return null;
                })}
                <td className="p-2 text-blue-600">
                  <div className="flex flex-col items-center gap-1">
                    <span className="cursor-pointer hover:underline">编辑</span>
                    <span className="cursor-pointer hover:underline">复制</span>
                    <span className="cursor-pointer hover:underline">备注</span>
                    <span className="cursor-pointer hover:underline flex items-center">更多 <ChevronDown className="w-3 h-3" /></span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className="p-2 border-t border-gray-200 flex items-center justify-between bg-white text-[12px] text-gray-600 shrink-0">
        <div className="flex items-center gap-2">
          <Button className="h-7 bg-[#34D399] hover:bg-[#2BB280] text-white px-3 rounded-sm text-[12px]">全选</Button>
          <Button variant="outline" className="h-7 border-gray-300 text-gray-600 px-3 rounded-sm text-[12px]">反选</Button>
          <span className="ml-2">每页 100 条 ▲</span>
          <span>共88450条 当前显示第1-100条 1/885页</span>
          
          <div className="flex items-center ml-2 border border-gray-300 rounded overflow-hidden">
            <div className="px-2 py-1 bg-gray-50 border-r border-gray-300 cursor-not-allowed text-gray-400">K</div>
            <div className="px-2 py-1 bg-gray-50 border-r border-gray-300 cursor-not-allowed text-gray-400">{'<'}</div>
            <div className="px-2 py-1 text-red-500 bg-white border-r border-gray-300">1</div>
            <div className="px-2 py-1 bg-white hover:bg-gray-50 cursor-pointer border-r border-gray-300">2</div>
            <div className="px-2 py-1 bg-white hover:bg-gray-50 cursor-pointer border-r border-gray-300">3</div>
            <div className="px-2 py-1 bg-white hover:bg-gray-50 cursor-pointer border-r border-gray-300">4</div>
            <div className="px-2 py-1 bg-white hover:bg-gray-50 cursor-pointer border-r border-gray-300">5</div>
            <div className="px-2 py-1 bg-white hover:bg-gray-50 cursor-pointer border-r border-gray-300">{'>'}</div>
            <div className="px-2 py-1 bg-white hover:bg-gray-50 cursor-pointer">{'▶|'}</div>
          </div>
          
          <Input className="h-7 w-12 text-center text-[12px] focus-visible:ring-0 mx-1" placeholder="页码" />
          <Button variant="outline" className="h-7 text-[12px] border-gray-300">跳转</Button>
        </div>

        <div
          className="flex items-center gap-1 cursor-pointer text-blue-600 hover:underline"
          onClick={() => setColumnsDialogOpen(true)}
        >
          <Settings className="w-3.5 h-3.5" /> 自定义列表字段
        </div>
      </div>

      <ProductTableColumnsDialog
        open={columnsDialogOpen}
        onOpenChange={setColumnsDialogOpen}
        options={PRODUCT_TABLE_FIELD_OPTIONS}
        value={selectedFieldKeys}
        onSave={(next) => setStoredFields(next)}
      />

      <SalesTrendDialog
        open={trendOpen}
        onOpenChange={setTrendOpen}
        initialSku={trendSku}
        skuOptions={skuOptions}
      />
    </div>
  );
}
