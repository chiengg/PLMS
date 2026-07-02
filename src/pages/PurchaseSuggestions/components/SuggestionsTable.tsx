import React, { useMemo, useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { 
  ChevronDown, 
  ChevronRight, 
  Store, 
  ArrowUpDown, 
  FileText,
  RefreshCw,
  Copy,
  Download,
  Plus,
  Upload,
  Settings,
  PenLine
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockSuggestions as initialMockSuggestions, SuggestionGroup, SuggestionItem } from '../mockData';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RuleConfigDialog from './RuleConfigDialog';
import IgnoreChoiceDialog from './IgnoreChoiceDialog';
import IgnoredManagerDrawer from './IgnoredManagerDrawer';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import { useLocation, useNavigate } from 'react-router-dom';
import type { IgnoredSuggestion, SuggestionsFilters } from '../types';
import { filterGroups, flattenSuggestionRows, hydrateIgnoredSuggestions, removeItemsFromGroups } from '../utils';
import { mergeIntoBuyerGroups } from '@/pages/PurchasePlans/utils';
import type { PlanGroup } from '@/pages/PurchasePlans/types';

export default function SuggestionsTable({
  activeTab = 'stock',
  filters,
  layout = 'grouped',
}: {
  activeTab?: 'stock' | 'shortage';
  filters: SuggestionsFilters;
  layout?: 'grouped' | 'flat';
}) {
  const INDEX_COL_WIDTH = 48;
  const EXPAND_COL_WIDTH = layout === 'flat' ? 0 : 40;
  const CHECKBOX_COL_WIDTH = 40;
  const BUYER_COL_WIDTH = 96;
  const isFlat = layout === 'flat';
  const stickyLeft = {
    index: 0,
    expand: INDEX_COL_WIDTH,
    checkbox: INDEX_COL_WIDTH + EXPAND_COL_WIDTH,
    buyer: INDEX_COL_WIDTH + EXPAND_COL_WIDTH + CHECKBOX_COL_WIDTH,
    sku: INDEX_COL_WIDTH + EXPAND_COL_WIDTH + CHECKBOX_COL_WIDTH + BUYER_COL_WIDTH,
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [suggestions, setSuggestions] = useLocalStorage<SuggestionGroup[]>('purchase_suggestions_data_v2', initialMockSuggestions);
  const [ignored, setIgnored] = useLocalStorage<IgnoredSuggestion[]>('purchase_suggestions_ignored_v1', []);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleExpand = (gIdx: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [gIdx]: prev[gIdx] === false ? true : false
    }));
  };
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const [confirmPlanOpen, setConfirmPlanOpen] = useState(false);
  const [ignoreChoiceOpen, setIgnoreChoiceOpen] = useState(false);
  const [ignoreManagerOpen, setIgnoreManagerOpen] = useState(false);
  const [targetItemIds, setTargetItemIds] = useState<string[]>([]);
  const [ruleConfigOpen, setRuleConfigOpen] = useState(false);

  // 新增：编辑采购员的弹框状态
  const [editBuyerOpen, setEditBuyerOpen] = useState(false);
  const [currentEditGroupId, setCurrentEditGroupId] = useState<number | null>(null);
  
  // 新增：批量更换采购员相关状态
  const [batchEditBuyerOpen, setBatchEditBuyerOpen] = useState(false);

  // 新增：批量导入弹框状态
  const [batchImportOpen, setBatchImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const mockBuyers = ['张伟', '李娜', '王强', '刘美希', '陈刚'];

  React.useEffect(() => {
    if (location.state?.newSuggestions && location.state.newSuggestions.length > 0) {
      const newProducts = location.state.newSuggestions;
      
      setSuggestions(prev => {
        let next = [...prev];
        
        newProducts.forEach((p: any) => {
          const supplierName = p.defaultSupplier || '未知供应商';
          const groupIndex = next.findIndex(g => g.supplierName === supplierName);
          
          let targetGroup;
          if (groupIndex === -1) {
            targetGroup = {
              supplierName,
              totalProducts: 0,
              totalSuggestedQuantity: 0,
              totalSuggestedPrice: 0,
              items: []
            };
            next.push(targetGroup);
          } else {
            targetGroup = { ...next[groupIndex], items: [...next[groupIndex].items] };
            next[groupIndex] = targetGroup;
          }

          const newItem: SuggestionItem = {
            id: `manual-${p.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            buyer: p.buyer,
            sku: p.sku,
            name: p.name,
            status: '正常销售',
            warehouse: '默认仓库',
            brand: p.brand || '无品牌',
            dailySales1: 0,
            dailySales3: 0,
            dailySales7: 0,
            dailySales15: 0,
            sales7Days: 0,
            sales28Days: 0,
            sales42Days: 0,
            dailySales: 0,
            stock: 0,
            transit: 0,
            unshipped: 0,
            availableStock: 0,
            availableDays: 0,
            stockAndTransit: 0,
            transitAvailableDays: 0,
            deliveryDays: 10,
            purchasePrice: 100,
            suggestedQuantity: 100,
            totalPrice: 10000,
            notes: '手动添加'
          };
          
          targetGroup.items.push(newItem);
        });
        
        next = next.map(group => {
          group.totalProducts = group.items.length;
          group.totalSuggestedQuantity = group.items.reduce((sum, i) => sum + i.suggestedQuantity, 0);
          group.totalSuggestedPrice = group.items.reduce((sum, i) => sum + i.totalPrice, 0);
          return group;
        });
        
        return next;
      });

      setExpandedRows(prev => {
        const next = { ...prev };
        for(let i = 0; i < 20; i++) next[i] = true;
        return next;
      });

      // Clear the state to avoid re-adding on subsequent renders
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredSuggestions.flatMap(s => s.items.map(i => i.id));
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectGroup = (checked: boolean, supplierIndex: number) => {
    const groupIds = filteredSuggestions[supplierIndex].items.map(i => i.id);
    if (checked) {
      setSelectedItems(prev => Array.from(new Set([...prev, ...groupIds])));
    } else {
      setSelectedItems(prev => prev.filter(id => !groupIds.includes(id)));
    }
  };

  const handleSelectItem = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleBatchAddPlan = () => {
    if (selectedItems.length === 0) {
      setAlertMessage('请先勾选数据');
      setAlertOpen(true);
      return;
    }
    setTargetItemIds(selectedItems);
    setConfirmPlanOpen(true);
  };

  const handleBatchIgnore = () => {
    if (selectedItems.length === 0) {
      setAlertMessage('请先勾选数据');
      setAlertOpen(true);
      return;
    }
    setTargetItemIds(selectedItems);
    setIgnoreChoiceOpen(true);
  };

  const executeBatchImport = () => {
    if (!importFile) {
      setAlertMessage('请先选择文件');
      setAlertOpen(true);
      return;
    }
    setImporting(true);
    // Simulate loading delay
    setTimeout(() => {
      setImporting(false);
      setBatchImportOpen(false);
      setImportFile(null);
      
      // Add some mock data for demonstration
      setSuggestions(prev => {
        const next = [...prev];
        const supplierName = '批量导入供应商';
        const targetGroup = {
          supplierName,
          totalProducts: 1,
          totalSuggestedQuantity: 500,
          totalSuggestedPrice: 5000,
          items: [{
            id: `import-${Date.now()}`,
            buyer: '系统导入',
            sku: 'IMP-SKU-001',
            name: '批量导入测试商品',
            status: '正常销售',
            warehouse: '默认仓库',
            brand: '测试品牌',
            dailySales1: 10,
            dailySales3: 10,
            dailySales7: 10,
            dailySales15: 10,
            sales7Days: 70,
            sales28Days: 280,
            sales42Days: 420,
            dailySales: 10,
            stock: 100,
            transit: 50,
            unshipped: 0,
            availableStock: 150,
            availableDays: 15,
            stockAndTransit: 150,
            transitAvailableDays: 15,
            deliveryDays: 5,
            purchasePrice: 10,
            suggestedQuantity: 500,
            totalPrice: 5000,
            notes: '批量导入'
          }]
        };
        next.unshift(targetGroup);
        return next;
      });
      
      setAlertMessage('导入成功！数据已更新。');
      setAlertOpen(true);
    }, 1000);
  };

  const handleSyncData = () => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 1200);
  };

  React.useEffect(() => {
    if (!syncing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [syncing]);

  const confirmIgnore = (type: 'once' | 'permanent') => {
    const items = suggestions.flatMap(g =>
      g.items
        .filter(i => targetItemIds.includes(i.id))
        .map(i => ({ item: i, supplierName: g.supplierName }))
    );

    const now = Date.now();
    const nextRows: IgnoredSuggestion[] = items.map(({ item, supplierName }) => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      warehouse: item.warehouse,
      supplierName,
      suggestedQuantity: item.suggestedQuantity,
      buyer: item.buyer,
      ignoreType: type,
      ignoredAt: now,
    }));

    setIgnored(prev => {
      const byId = new Set(prev.map(r => r.id));
      const permanentSku = new Set(prev.filter(r => r.ignoreType === 'permanent').map(r => r.sku));
      const nextPermanentSku = new Set<string>();
      const filteredNextRows = nextRows.filter(r => {
        if (r.ignoreType === 'permanent') {
          if (permanentSku.has(r.sku)) return false;
          if (nextPermanentSku.has(r.sku)) return false;
          nextPermanentSku.add(r.sku);
          return true;
        }
        return !byId.has(r.id);
      });
      return [...prev, ...filteredNextRows];
    });

    setSelectedItems(prev => prev.filter(id => !targetItemIds.includes(id)));
    setTargetItemIds([]);
    setIgnoreChoiceOpen(false);
  };

  const handleGenerateOrder = () => {
    if (selectedItems.length === 0) {
      setAlertMessage('请先选数据');
      setAlertOpen(true);
      return;
    }
    
    const allSelectedItems = suggestions.flatMap(g => 
      g.items.filter(i => selectedItems.includes(i.id)).map(i => ({
        ...i,
        supplierName: g.supplierName
      }))
    );
    const hasInvalidQuantity = allSelectedItems.some(i => i.suggestedQuantity <= 0);
    
    if (hasInvalidQuantity) {
      setAlertMessage('商品SKU+建议采购数必须大于0');
      setAlertOpen(true);
      return;
    }
    
    // Navigate with state
    navigate('/generate-purchase-order', { state: { selectedItems: allSelectedItems } });
  };

  const updateItemQuantity = (groupIdx: number, itemId: string, newQty: number) => {
    setSuggestions(prev => {
      const next = [...prev];
      const group = { ...next[groupIdx] };
      const items = [...group.items];
      const itemIdx = items.findIndex(i => i.id === itemId);
      if (itemIdx > -1) {
        const item = { ...items[itemIdx] };
        item.suggestedQuantity = newQty;
        item.totalPrice = newQty * item.purchasePrice;
        items[itemIdx] = item;
        group.items = items;
        group.totalSuggestedQuantity = items.reduce((sum, i) => sum + i.suggestedQuantity, 0);
        group.totalSuggestedPrice = items.reduce((sum, i) => sum + i.totalPrice, 0);
        next[groupIdx] = group;
      }
      return next;
    });
  };

  const updateItemNotes = (groupIdx: number, itemId: string, notes: string) => {
    setSuggestions(prev => {
      const next = [...prev];
      const group = { ...next[groupIdx] };
      const items = [...group.items];
      const itemIdx = items.findIndex(i => i.id === itemId);
      if (itemIdx > -1) {
        items[itemIdx] = { ...items[itemIdx], notes };
        group.items = items;
        next[groupIdx] = group;
      }
      return next;
    });
  };

  const filteredSuggestions = useMemo(() => {
    return filterGroups({
      groups: suggestions,
      activeTab,
      filters,
      ignored,
    });
  }, [activeTab, filters, ignored, suggestions]);

  const isAllExpanded = filteredSuggestions.length > 0 && filteredSuggestions.every((_, idx) => expandedRows[idx] !== false);

  const toggleAllExpanded = () => {
    setExpandedRows(prev => {
      const allExpanded = filteredSuggestions.length > 0 && filteredSuggestions.every((_, idx) => prev[idx] !== false);
      const next = { ...prev };
      filteredSuggestions.forEach((_, idx) => {
        next[idx] = allExpanded ? false : true;
      });
      return next;
    });
  };

  const handleUpdateBuyer = () => {
    if (currentEditGroupId === null || !selectedValue) return;
    
    setSuggestions(prev => {
      const next = [...prev];
      const group = next[currentEditGroupId];
      group.items = group.items.map(item => ({ ...item, buyer: selectedValue }));
      next[currentEditGroupId] = group;
      return next;
    });
    
    setEditBuyerOpen(false);
    setCurrentEditGroupId(null);
    setSelectedValue('');
    setSearchValue('');
  };

  const handleBatchChangeBuyer = () => {
    if (selectedItems.length === 0) {
      setAlertMessage('请先选择要操作的数据');
      setAlertOpen(true);
      return;
    }
    setBatchEditBuyerOpen(true);
  };

  const executeBatchChangeBuyer = () => {
    if (!selectedValue) return;

    setSuggestions(prev => {
      return prev.map(group => {
        const updatedItems = group.items.map(item => {
          if (selectedItems.includes(item.id)) {
            return { ...item, buyer: selectedValue };
          }
          return item;
        });
        return { ...group, items: updatedItems };
      });
    });

    setBatchEditBuyerOpen(false);
    setSelectedValue('');
    setSearchValue('');
    setSelectedItems([]); // 清空已选，因为已处理完毕
  };

  const flatRows = flattenSuggestionRows(filteredSuggestions);
  const selectedRows = selectedItems.length > 0 ? flatRows.filter((r) => selectedItems.includes(r.item.id)) : [];
  const summaryRows = selectedItems.length > 0 ? selectedRows : flatRows;
  const totalSuggestedQty = summaryRows.reduce((sum, r) => sum + r.item.suggestedQuantity, 0);
  const totalTransit = summaryRows.reduce((sum, r) => sum + r.item.transit, 0);

  return (
    <div className="flex flex-col flex-1 bg-white rounded shadow-sm border border-gray-200 overflow-hidden h-full">
      {syncing && (
        <div className="fixed inset-0 z-[200] bg-black/25 flex items-center justify-center">
          <div className="bg-white rounded-md px-6 py-5 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 text-[13px] text-gray-700">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></span>
              数据同步中...
            </div>
          </div>
        </div>
      )}
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-[13px] bg-blue-600 hover:bg-blue-700 text-primary-foreground shadow">
              <Plus className="w-4 h-4 mr-1" />
              批量操作
              <ChevronDown className="w-4 h-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleBatchAddPlan}>加入采购计划</DropdownMenuItem>
              <DropdownMenuItem onClick={handleBatchChangeBuyer}>更换采购员</DropdownMenuItem>
              <DropdownMenuItem onClick={handleBatchIgnore}>忽略建议</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIgnored(prev => hydrateIgnoredSuggestions({ ignored: prev, groups: suggestions }));
                  setIgnoreManagerOpen(true);
                }}
              >
                忽略管理
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-[13px] border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              <Upload className="w-4 h-4 mr-1" />
              添加/导入
              <ChevronDown className="w-4 h-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => navigate('/manual-suggestions')}>手动创建采购建议</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBatchImportOpen(true)}>批量导入建议</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FeatureMarker title="生成采购单" description="交互说明：点击执行生成采购单操作。">
          <Button variant="outline" className="h-8 px-3 text-[13px] border-orange-400 text-orange-500 hover:bg-orange-50" onClick={handleGenerateOrder}>
            <FileText className="w-4 h-4 mr-1" />
            生成采购单
          </Button>
          </FeatureMarker>

          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <Button variant="outline" className="h-8 px-3 text-[13px] border-gray-300">
            <Download className="w-4 h-4 mr-1" />
            导出
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
          </FeatureMarker>

          <FeatureMarker title="规则设置" description="交互说明：点击执行规则设置操作。">
          <Button variant="outline" className="h-8 px-3 text-[13px] border-gray-300" onClick={() => setRuleConfigOpen(true)}>
            <Settings className="w-4 h-4 mr-1" />
            规则设置
          </Button>
          </FeatureMarker>

          <FeatureMarker title="数据同步" description="交互说明：点击后触发数据同步并展示加载动效。">
          <Button
            variant="outline"
            className="h-8 px-3 text-[13px] border-gray-300"
            onClick={handleSyncData}
            disabled={syncing}
          >
            {syncing ? (
              <div className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-gray-500 mr-1.5"></span>
                同步中...
              </div>
            ) : '数据同步'}
          </Button>
          </FeatureMarker>
          
          {selectedItems.length > 0 && (
            <span className="text-[13px] text-blue-600 ml-2 bg-blue-50 px-2 py-0.5 rounded">
              已选 {selectedItems.length} 条
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-[13px]">
          <span>共 10 条</span>
          <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500"><RefreshCw className="w-4 h-4" /></Button>
</FeatureMarker>
          <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
<Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500"><Copy className="w-4 h-4" /></Button>
</FeatureMarker>
          <FeatureMarker title="展开/收起" description="交互说明：点击执行展开/收起操作。">
          <Button variant="outline" className="h-7 px-2 text-[12px] border-gray-300">
            <Download className="w-3.5 h-3.5 mr-1" />
            导出
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
          </FeatureMarker>
        </div>
      </div>

      {/* Table Wrapper with Scroll */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-max min-w-full text-left text-[12px] border-collapse">
          <thead className="sticky top-0 bg-[#F5F6F8] text-gray-600 border-b border-gray-200 z-30">
            <tr>
              <th
                className="p-2 font-medium w-12 min-w-[48px] text-center sticky bg-[#F5F6F8] z-30 shadow-[1px_0_0_rgba(229,231,235,1)]"
                style={{ left: stickyLeft.index }}
              >
                序号
              </th>
              {!isFlat && (
                <th
                  className="p-2 w-10 min-w-[40px] sticky bg-[#F5F6F8] z-30 shadow-[1px_0_0_rgba(229,231,235,1)]"
                  style={{ left: stickyLeft.expand }}
                >
                  <FeatureMarker title={isAllExpanded ? '全部收起' : '全部展开'} description="交互说明：点击执行全部展开/收起操作。">
                    <button
                      type="button"
                      disabled={filteredSuggestions.length === 0}
                      className={cn(
                        "h-7 w-7 mx-auto flex items-center justify-center rounded text-blue-600",
                        filteredSuggestions.length === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-200/70"
                      )}
                      onClick={toggleAllExpanded}
                    >
                      {isAllExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </FeatureMarker>
                </th>
              )}
              <th
                className="p-2 w-10 min-w-[40px] sticky bg-[#F5F6F8] z-30 shadow-[1px_0_0_rgba(229,231,235,1)]"
                style={{ left: stickyLeft.checkbox }}
              >
                <Checkbox 
                  onCheckedChange={handleSelectAll} 
                  checked={
                    selectedItems.length > 0 &&
                    selectedItems.length === filteredSuggestions.flatMap(s => s.items).length
                  }
                />
              </th>
              <th
                className="p-2 font-medium w-[96px] min-w-[96px] text-center sticky bg-[#F5F6F8] z-30 shadow-[1px_0_0_rgba(229,231,235,1)]"
                style={{ left: stickyLeft.buyer }}
              >
                采购员
              </th>
              <th
                className="p-2 font-medium w-[200px] min-w-[200px] sticky bg-[#F5F6F8] z-30 shadow-[1px_0_0_rgba(229,231,235,1)]"
                style={{ left: stickyLeft.sku }}
              >
                库存SKU / 中文名称
              </th>
              <th className="p-2 font-medium min-w-[80px]">状态</th>
              <th className="p-2 font-medium min-w-[120px]">仓库名称</th>
              <th className="p-2 font-medium min-w-[80px]">一级品牌</th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="预测日销量" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="7天销量" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="28天销量" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="42天销量" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="库存总数" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="采购在途量" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="仓库未发货" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="仓库可用库存量" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="可用库存量可售天数" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="库存+在途" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="（在途+可用库存）可销售天数" /></th>
              <th className="p-2 font-medium whitespace-nowrap">货期</th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="建议采购单价" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="建议采购数" /></th>
              <th className="p-2 font-medium whitespace-nowrap"><SortHeader title="采购总价" /></th>
              <th className="p-2 font-medium min-w-[120px]">备注</th>
              <th className="p-2 font-medium text-center sticky right-0 bg-[#F5F6F8] shadow-[-1px_0_0_rgba(229,231,235,1)]">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isFlat && filteredSuggestions.flatMap((group, gIdx) =>
              group.items.map((item, iIdx) => ({ group, gIdx, item, iIdx }))
            ).map(({ group, gIdx, item }, flatIdx) => (
              <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-100 group">
                <td
                  className="p-2 text-center text-gray-400 sticky bg-white z-20 shadow-[1px_0_0_rgba(229,231,235,1)] group-hover:bg-gray-50"
                  style={{ left: stickyLeft.index }}
                >
                  {flatIdx + 1}
                </td>
                <td
                  className="p-2 w-10 min-w-[40px] sticky bg-white z-20 shadow-[1px_0_0_rgba(229,231,235,1)] group-hover:bg-gray-50"
                  style={{ left: stickyLeft.checkbox }}
                >
                  <Checkbox 
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(!!checked, item.id)}
                  />
                </td>
                <td
                  className="p-2 text-center sticky bg-white z-20 shadow-[1px_0_0_rgba(229,231,235,1)] group-hover:bg-gray-50"
                  style={{ left: stickyLeft.buyer, width: BUYER_COL_WIDTH }}
                >
                  <span className="text-gray-600">{item.buyer || '--'}</span>
                </td>
                <td
                  className="p-2 sticky bg-white z-20 shadow-[1px_0_0_rgba(229,231,235,1)] group-hover:bg-gray-50"
                  style={{ left: stickyLeft.sku }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <span className="text-[8px] text-gray-400 break-all p-1 leading-tight text-center">No Image</span>
                    </div>
                    <div className="flex flex-col max-w-[160px]">
                      <span className="text-blue-600 truncate">{item.sku}</span>
                      <span className="text-gray-600 truncate">{item.name}</span>
                    </div>
                  </div>
                </td>
                <td className="p-2">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[11px] border",
                    item.statusType === 'orange' ? "text-orange-500 border-orange-200 bg-orange-50" :
                    item.statusType === 'blue' ? "text-blue-500 border-blue-200 bg-blue-50" :
                    "text-green-600 border-green-200 bg-green-50"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="p-2 text-gray-600 truncate max-w-[120px]">{item.warehouse}</td>
                <td className="p-2">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[11px] border",
                    item.brandType === 'orange' ? "text-orange-500 border-orange-200 bg-orange-50" :
                    item.brandType === 'pink' ? "text-pink-500 border-pink-200 bg-pink-50" :
                    item.brandType === 'purple' ? "text-purple-600 border-purple-200 bg-purple-50" :
                    "text-blue-500 border-blue-200 bg-blue-50"
                  )}>
                    {item.brand}
                  </span>
                </td>
                <td className="p-2 text-center">{item.dailySales.toFixed(1)}</td>
                <td className="p-2 text-center">{item.sales7Days}</td>
                <td className="p-2 text-center">{item.sales28Days}</td>
                <td className="p-2 text-center">{item.sales42Days}</td>
                <td className="p-2 text-center">{item.stock}</td>
                <td className="p-2 text-center text-green-500">{item.transit > 0 ? item.transit : 0}</td>
                <td className="p-2 text-center">{item.unshipped}</td>
                <td className="p-2 text-center">{item.availableStock}</td>
                <td className="p-2 text-center font-medium text-orange-500">{item.availableDays > 999 ? '999+' : item.availableDays.toFixed(0)}天</td>
                <td className="p-2 text-center">{item.stockAndTransit}</td>
                <td className="p-2 text-center font-medium text-orange-500">{item.transitAvailableDays > 999 ? '999+' : item.transitAvailableDays.toFixed(0)}天</td>
                <td className="p-2 text-center">{item.deliveryDays}天</td>
                <td className="p-2 text-center">
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.purchasePrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0) {
                        setSuggestions(prev => {
                          const next = [...prev];
                          const group = { ...next[gIdx] };
                          const items = [...group.items];
                          const itemIdx = items.findIndex(i => i.id === item.id);
                          if (itemIdx > -1) {
                            const i = { ...items[itemIdx] };
                            i.purchasePrice = val;
                            i.totalPrice = i.suggestedQuantity * val;
                            items[itemIdx] = i;
                            group.items = items;
                            group.totalSuggestedPrice = items.reduce((sum, it) => sum + it.totalPrice, 0);
                            next[gIdx] = group;
                          }
                          return next;
                        });
                      }
                    }}
                    className="h-7 w-20 text-center text-[12px] p-1 text-blue-600 mx-auto"
                  />
                </td>
                <td className="p-2 text-center font-medium">
                  <Input 
                    type="number"
                    value={item.suggestedQuantity}
                    onChange={(e) => updateItemQuantity(gIdx, item.id, parseInt(e.target.value) || 0)}
                    className={cn(
                      "h-7 w-16 text-center text-[12px] p-1",
                      item.suggestedQuantity < 0 ? "text-red-500" : "text-blue-600"
                    )}
                  />
                </td>
                <td className="p-2 text-center">
                  <span className={item.totalPrice < 0 ? "text-red-500" : "text-blue-600"}>
                    {item.totalPrice.toFixed(2)}
                  </span>
                </td>
                <td className="p-2 text-gray-500">
                  <div className="flex items-center justify-between group">
                    <Input 
                      value={item.notes}
                      onChange={(e) => updateItemNotes(gIdx, item.id, e.target.value)}
                      placeholder="添加备注..."
                      maxLength={500}
                      className="h-7 w-full text-[12px] border-transparent hover:border-gray-300 focus-visible:border-blue-500 focus-visible:ring-0 p-1"
                    />
                  </div>
                </td>
                <td className="p-2 text-center sticky right-0 bg-white shadow-[-1px_0_0_rgba(229,231,235,1)] group-hover:bg-gray-50">
                  <div className="flex items-center justify-center gap-2">
                    <FeatureMarker title="加入计划" description="交互说明：点击执行加入计划操作。">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => {
                      if (!selectedItems.includes(item.id)) {
                        setSelectedItems([...selectedItems, item.id]);
                      }
                      setTargetItemIds([item.id]);
                      setConfirmPlanOpen(true);
                    }}>加入计划</button>
                    </FeatureMarker>
                    <span className="text-gray-300">|</span>
                    <FeatureMarker title="忽略" description="交互说明：点击执行忽略操作。">
                    <button className="text-gray-400 hover:text-gray-600" onClick={() => {
                      setTargetItemIds([item.id]);
                      setIgnoreChoiceOpen(true);
                    }}>忽略</button>
                    </FeatureMarker>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Summary */}
      <div className="h-10 bg-[#F5F6F8] border-t border-gray-200 flex items-center px-4 gap-6 font-medium text-gray-700">
        <span>{selectedItems.length > 0 ? `已选${selectedItems.length}条汇总` : '汇总'}</span>
        <span>建议采购总量：<span className={totalSuggestedQty < 0 ? "text-red-500" : "text-blue-600"}>{totalSuggestedQty}</span></span>
        <span>采购在途总量：<span className="text-gray-900">{totalTransit}</span></span>
      </div>

      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>提示</DialogTitle>
            <DialogDescription className="py-4 text-[14px] text-gray-700">
              {alertMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <FeatureMarker title="确认" description="交互说明：校验表单数据并提交保存。">
<Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setAlertOpen(false)}>确认</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmPlanOpen} onOpenChange={setConfirmPlanOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>确认操作</DialogTitle>
            <DialogDescription className="py-4 text-[14px] text-gray-700">
              确认将该SKU加入采购计划中吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setConfirmPlanOpen(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确认" description="交互说明：校验表单数据并提交保存。">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              const itemsToPlan = suggestions.flatMap((g) =>
                g.items
                  .filter((i) => targetItemIds.includes(i.id))
                  .map((i) => ({ ...i, supplierName: g.supplierName }))
              );

              const existingPlansStr = localStorage.getItem('purchase_plans_data_v2');
              let parsed: unknown = [];
              try {
                parsed = existingPlansStr ? JSON.parse(existingPlansStr) : [];
              } catch {
                parsed = [];
              }
              const prevPlans: PlanGroup[] = Array.isArray(parsed) ? parsed : [];
              const nextPlans = mergeIntoBuyerGroups({ prev: prevPlans, incoming: itemsToPlan });
              localStorage.setItem('purchase_plans_data_v2', JSON.stringify(nextPlans));

              setSuggestions((prev) => removeItemsFromGroups(prev, targetItemIds));

              setConfirmPlanOpen(false);
              setSelectedItems([]);
              navigate('/purchase-plans');
            }}>确认</Button>
            </FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={batchImportOpen} onOpenChange={setBatchImportOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 border-0 shadow-lg" showCloseButton={false}>
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white rounded-t-lg">
            <span className="text-[14px] text-gray-700 font-medium">采购商品导入</span>
            <FeatureMarker title="交互操作" description="交互说明：点击执行交互操作操作。">
            <button 
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => {
                setBatchImportOpen(false);
                setImportFile(null);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
              </svg>
            </button>
            </FeatureMarker>
          </div>
          
          <div className="p-6 bg-[#F8F9FA] border-b border-gray-200 min-h-[140px] flex flex-col justify-center">
            <div className="flex items-start gap-4 ml-[40px]">
              <div className="w-[80px] text-right pt-1.5 flex items-center justify-end whitespace-nowrap flex-shrink-0">
                <span className="text-[#FF4D4F] mr-1 mt-1">*</span>
                <span className="text-[#606266] text-[13px] font-medium">文件上传</span>
              </div>
              <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-4 flex-nowrap">
                  <div className="flex flex-shrink-0">
                    <Input 
                      className="w-[280px] h-[34px] rounded-r-none border-r-0 border-[#DCDFE6] bg-white text-[13px] text-[#606266] focus-visible:ring-0 focus-visible:border-[#DCDFE6]" 
                      placeholder={importFile ? importFile.name : ""} 
                      readOnly
                    />
                    <label className="h-[34px] px-[15px] bg-[#8BC34A] hover:bg-[#7CB342] text-white flex items-center justify-center gap-1.5 rounded-r cursor-pointer transition-colors border border-[#8BC34A] whitespace-nowrap flex-shrink-0">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".xlsx,.xls,.csv"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImportFile(e.target.files[0]);
                          }
                        }}
                      />
                      <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                        <path d="M12.6 1.5H7L5.6 0H1.4C0.63 0 0.00700001 0.675 0.00700001 1.5L0 10.5C0 11.325 0.63 12 1.4 12H12.6C13.37 12 14 11.325 14 10.5V3C14 2.175 13.37 1.5 12.6 1.5ZM12.6 10.5H1.4V3H12.6V10.5Z" fill="currentColor"/>
                      </svg>
                      <span className="text-[13px] tracking-widest">浏览</span>
                    </label>
                  </div>
                  <div className="flex items-center text-[#1890FF] hover:text-[#40A9FF] cursor-pointer text-[13px] whitespace-nowrap flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 flex-shrink-0">
                      <path d="M12.4444 9.33333H14V12.4444C14 13.3 13.3 14 12.4444 14H1.55556C0.7 14 0 13.3 0 12.4444V9.33333H1.55556V12.4444H12.4444V9.33333ZM7.77778 7.42778L10.3056 4.89222L11.4022 6L7 10.4022L2.59778 6L3.69444 4.89222L6.22222 7.42778V0H7.77778V7.42778Z" fill="currentColor"/>
                    </svg>
                    <span className="underline decoration-1 underline-offset-2">下载Excel模板</span>
                  </div>
                </div>
                <div className="text-[#909399] text-[12px] mt-1">建议文件不要超过5M</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end p-4 bg-white rounded-b-lg gap-2.5 border-t border-[#EBEEF5]">
            <FeatureMarker title=") : '确定'}" description="交互说明：校验表单数据并提交保存。">
            <Button 
              className="bg-[#7B9ECA] hover:bg-[#6A8DBA] text-white h-[32px] px-5 rounded text-[13px] font-normal min-w-[70px] transition-colors border-0" 
              onClick={executeBatchImport}
              disabled={importing}
            >
              {importing ? (
                <div className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-1.5"></span>
                  导入中...
                </div>
              ) : '确定'}
            </Button>
            </FeatureMarker>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
            <Button 
              variant="outline" 
              className="h-[32px] px-5 rounded text-[13px] font-normal text-[#606266] border-[#DCDFE6] hover:bg-[#F5F7FA] hover:text-[#409EFF] hover:border-[#C6E2FF] min-w-[70px] transition-colors" 
              onClick={() => {
                setBatchImportOpen(false);
                setImportFile(null);
              }}
              disabled={importing}
            >
              取消
            </Button>
            </FeatureMarker>
          </div>
        </DialogContent>
      </Dialog>

      <IgnoreChoiceDialog
        open={ignoreChoiceOpen}
        onOpenChange={(open) => {
          setIgnoreChoiceOpen(open);
          if (!open) setTargetItemIds([]);
        }}
        onConfirm={confirmIgnore}
      />

      <IgnoredManagerDrawer
        open={ignoreManagerOpen}
        onOpenChange={setIgnoreManagerOpen}
        rows={ignored}
        onRestore={(id) => setIgnored(prev => prev.filter(r => r.id !== id))}
        onClear={(id) => {
          setIgnored(prev => prev.filter(r => r.id !== id));
          setSuggestions(prev => removeItemsFromGroups(prev, [id]));
        }}
      />
      
      <RuleConfigDialog open={ruleConfigOpen} onOpenChange={setRuleConfigOpen} />

      {/* Edit Buyer Dialog */}
      <Dialog open={editBuyerOpen} onOpenChange={setEditBuyerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>修改采购员</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">搜索采购员</span>
              <Input 
                placeholder="请输入关键字搜索..." 
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-sm font-medium">选择采购员</span>
              <div className="border rounded-md max-h-[200px] overflow-y-auto custom-scrollbar bg-white">
                {mockBuyers
                  .filter(b => b.toLowerCase().includes(searchValue.toLowerCase()))
                  .map(b => (
                    <div 
                      key={b}
                      className={cn(
                        "px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors",
                        selectedValue === b ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700"
                      )}
                      onClick={() => setSelectedValue(b)}
                    >
                      {b}
                    </div>
                  ))
                }
                {mockBuyers.filter(b => b.toLowerCase().includes(searchValue.toLowerCase())).length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">暂无匹配数据</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setEditBuyerOpen(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确认" description="交互说明：校验表单数据并提交保存。">
<Button onClick={handleUpdateBuyer} className="bg-blue-600 hover:bg-blue-700">确认</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Edit Buyer Dialog */}
      <Dialog open={batchEditBuyerOpen} onOpenChange={setBatchEditBuyerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>批量更换采购员</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">搜索采购员</span>
              <Input 
                placeholder="请输入关键字搜索..." 
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-sm font-medium">选择采购员</span>
              <div className="border rounded-md max-h-[200px] overflow-y-auto custom-scrollbar bg-white">
                {mockBuyers
                  .filter(b => b.toLowerCase().includes(searchValue.toLowerCase()))
                  .map(b => (
                    <div 
                      key={b}
                      className={cn(
                        "px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors",
                        selectedValue === b ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700"
                      )}
                      onClick={() => setSelectedValue(b)}
                    >
                      {b}
                    </div>
                  ))
                }
                {mockBuyers.filter(b => b.toLowerCase().includes(searchValue.toLowerCase())).length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">暂无匹配数据</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="取消" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" onClick={() => setBatchEditBuyerOpen(false)}>取消</Button>
</FeatureMarker>
            <FeatureMarker title="确认" description="交互说明：校验表单数据并提交保存。">
<Button onClick={executeBatchChangeBuyer} className="bg-blue-600 hover:bg-blue-700">确认</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

function SortHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 group">
      <div className="flex flex-col max-w-[60px] whitespace-normal leading-tight text-center">
        {title.length > 5 ? (
          <>
            <span>{title.substring(0, 4)}</span>
            <span>{title.substring(4)}</span>
          </>
        ) : title}
      </div>
      <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-blue-400" />
    </div>
  );
}
