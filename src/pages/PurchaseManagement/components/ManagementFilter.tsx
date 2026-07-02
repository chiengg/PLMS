import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { ChevronDown, ChevronUp, Search, Calendar as CalendarIcon, Settings, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const FilterField = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex items-center">
    <span className="text-gray-600 w-24 flex-shrink-0 text-right pr-2">{label}：</span>
    <div className="flex-1">{children}</div>
  </div>
);

const SelectFilter = ({ defaultValue = "全部", options }: { defaultValue?: string, options: { value: string, label: string }[] }) => (
  <Select defaultValue={defaultValue}>
    <SelectTrigger className="w-full h-8 text-[12px] bg-white">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {options.map(opt => <SelectItem key={opt.value} value={opt.label}>{opt.label}</SelectItem>)}
    </SelectContent>
  </Select>
);

const RangeFilter = ({ placeholder }: { placeholder?: string }) => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [error, setError] = useState('');

  const handleBlur = () => {
    if (min && max && Number(min) >= Number(max)) {
      setError('最大值需大于最小值');
    } else {
      setError('');
    }
  };

  return (
    <div className="flex flex-col gap-1 relative w-full">
      <div className="flex items-center gap-2">
        <Input 
          type="number"
          placeholder="最小值" 
          className={cn("h-8 w-full text-[12px]", error && "border-red-500 focus-visible:ring-red-500")} 
          value={min}
          onChange={e => {
            setMin(e.target.value);
            if (error) setError('');
          }}
          onBlur={handleBlur}
        />
        <span className="text-gray-400">~</span>
        <Input 
          type="number"
          placeholder="最大值" 
          className={cn("h-8 w-full text-[12px]", error && "border-red-500 focus-visible:ring-red-500")} 
          value={max}
          onChange={e => {
            setMax(e.target.value);
            if (error) setError('');
          }}
          onBlur={handleBlur}
        />
      </div>
      {error && <span className="text-red-500 text-[10px] absolute -bottom-4 left-0">{error}</span>}
    </div>
  );
};

export default function ManagementFilter({ activeTab = '全部', onFilterChange }: { activeTab?: string, onFilterChange?: (filters: any) => void }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState<any>({});
  
  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  // Custom Categories State
  const [categories, setCategories] = useState<{id: string, name: string}[]>([
    { id: '1', name: '默认分类' },
    { id: '2', name: '大客户专供' },
    { id: '3', name: '急单处理' }
  ]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.some(c => c.name === trimmed)) {
      setCategoryError('分类名称已存在');
      return;
    }
    setCategories([...categories, { id: Date.now().toString(), name: trimmed }]);
    setNewCategory('');
    setCategoryError('');
  };

  const handleSaveEditCategory = () => {
    const trimmed = editingName.trim();
    if (!trimmed) return;
    if (categories.some(c => c.id !== editingId && c.name === trimmed)) {
      setCategoryError('分类名称已存在');
      return;
    }
    setCategories(categories.map(c => c.id === editingId ? { ...c, name: trimmed } : c));
    setEditingId(null);
    setCategoryError('');
  };

  if (activeTab === '待合并') {
    return (
      <div className="bg-white p-4 rounded shadow-sm border border-gray-200 text-[13px] flex-shrink-0 flex items-center gap-4">
        <Select 
          defaultValue="采购单号"
          onValueChange={(val) => updateFilter('searchType', val)}
        >
          <SelectTrigger className="w-[120px] h-8 text-[12px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="采购单号">采购单号</SelectItem>
            <SelectItem value="供应商">供应商</SelectItem>
            <SelectItem value="采购员">采购员</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          defaultValue="请选择"
          onValueChange={(val) => updateFilter('subType', val)}
        >
          <SelectTrigger className="w-[120px] h-8 text-[12px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="请选择">请选择</SelectItem>
            <SelectItem value="精确搜索">精确搜索</SelectItem>
            <SelectItem value="模糊搜索">模糊搜索</SelectItem>
          </SelectContent>
        </Select>

        <Input 
          placeholder="请输入内容" 
          className="w-64 h-8 text-[12px]" 
          onChange={(e) => updateFilter('searchKeyword', e.target.value)}
        />

        <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
        <Button className="h-8 bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 rounded-sm ml-4">
          搜索
        </Button>
        </FeatureMarker>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm border border-gray-200 text-[13px] flex-shrink-0">
      {/* Basic Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Combo */}
        <div className="flex items-center">
          <span className="text-gray-600 mr-2 whitespace-nowrap">搜索</span>
          <div className="flex">
            <Select 
              defaultValue="采购单号"
              onValueChange={(val) => updateFilter('searchType', val)}
            >
              <SelectTrigger className="w-[110px] h-8 text-[12px] rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="采购单号">采购单号</SelectItem>
                <SelectItem value="物流单号">物流单号</SelectItem>
                <SelectItem value="1688订单号">1688订单号</SelectItem>
                <SelectItem value="库存SKU">库存SKU</SelectItem>
                <SelectItem value="发票号">发票号</SelectItem>
                <SelectItem value="计划号">计划号</SelectItem>
                <SelectItem value="商品名称">商品名称</SelectItem>
                <SelectItem value="订单备注">订单备注</SelectItem>
                <SelectItem value="采购员">采购员</SelectItem>
                <SelectItem value="下单员">下单员</SelectItem>
                <SelectItem value="签收员">签收员</SelectItem>
                <SelectItem value="入库员">入库员</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="关键词" 
              className="h-8 w-[180px] text-[12px] rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => updateFilter('searchKeyword', e.target.value)}
            />
          </div>
        </div>

        {/* Time Range Combo */}
        <div className="flex items-center">
          <Select defaultValue="下单时间">
            <SelectTrigger className="w-[120px] h-8 text-[12px] rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="下单时间">下单时间</SelectItem>
              <SelectItem value="审核时间">审核时间</SelectItem>
              <SelectItem value="预计付款时间">预计付款时间</SelectItem>
              <SelectItem value="1688付款时间">1688付款时间</SelectItem>
              <SelectItem value="预计到货时间">预计到货时间</SelectItem>
              <SelectItem value="最后入库时间">最后入库时间</SelectItem>
              <SelectItem value="签收时间">签收时间</SelectItem>
              <SelectItem value="入库时间">入库时间</SelectItem>
              <SelectItem value="发货时间">发货时间</SelectItem>
              <SelectItem value="付款截止时间">付款截止时间</SelectItem>
              <SelectItem value="快递单签收时间">快递单签收时间</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center h-8 border border-gray-200 border-l-0 rounded-r px-2 bg-white text-gray-500">
            <CalendarIcon className="w-3.5 h-3.5 mr-2" />
            <span className="text-[12px]">年/月/日</span>
            <span className="mx-2">~</span>
            <span className="text-[12px]">年/月/日</span>
            <CalendarIcon className="w-3.5 h-3.5 ml-2" />
          </div>
        </div>

        {/* Payment Status */}
        {['全部', '新订单', '待合并', '采购中', '已完成', '已作废', '异常', '1688对账'].includes(activeTab) && (
          <div className="flex items-center">
            <span className="text-gray-600 mr-2 whitespace-nowrap">付款状态:</span>
            <Select defaultValue="全部" onValueChange={(val) => updateFilter('paymentStatus', val)}>
              <SelectTrigger className="w-[120px] h-8 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部</SelectItem>
                <SelectItem value="待申请付款">待申请付款</SelectItem>
                <SelectItem value="已申请付款">已申请付款</SelectItem>
                <SelectItem value="审核通过">审核通过</SelectItem>
                <SelectItem value="部分付款">部分付款</SelectItem>
                <SelectItem value="等待还款">等待还款</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
          <Button className="h-8 px-4 text-[13px] bg-blue-600 hover:bg-blue-700">
            <Search className="w-4 h-4 mr-1" />
            搜索
          </Button>
          </FeatureMarker>
          <FeatureMarker title="{showAdvanced ? '收起' : '更多筛选'}" description="交互说明：点击执行{showAdvanced ? '收起' : '更多筛选'}操作。">
          <button 
            className="text-gray-500 hover:text-blue-600 flex items-center text-[13px]"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '收起' : '更多筛选'}
          </button>
          </FeatureMarker>
          <FeatureMarker title="重置" description="交互说明：点击执行重置操作。">
          <button className="text-gray-500 hover:text-blue-600 text-[13px]">
            重置
          </button>
          </FeatureMarker>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 w-full">
          
          {/* 全部 & 采购中 的筛选逻辑完全一致 */}
          {['全部', '采购中'].includes(activeTab) && (
            <>
              <FilterField label="采购状态">
                <SelectFilter options={[
                  {value: 'all', label: '全部'}, 
                  {value: 'new_order', label: '新订单（未提交/待审核）'},
                  {value: 'purchasing', label: '采购中'},
                  {value: 'completed', label: '已完成'}
                ]} />
              </FilterField>
              <FilterField label="签收状态">
                <SelectFilter options={[
                  {value: 'all', label: '全部'}, 
                  {value: 'unsigned', label: '未签收'},
                  {value: 'part_signed', label: '部分签收'},
                  {value: 'signed', label: '已完成'}
                ]} />
              </FilterField>
              <FilterField label="仓库">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'dg', label: '东莞厚街仓'}]} />
              </FilterField>
              <FilterField label="采购单类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'}, 
                  {value: 'shortage', label: '缺货采购'},
                  {value: 'sample', label: '样品采购'},
                  {value: 'stock', label: '备货采购'},
                  {value: 'dev', label: '开发采样'}
                ]} />
              </FilterField>
              <FilterField label="是否有备注">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'yes', label: '是'}, {value: 'no', label: '否'}]} />
              </FilterField>
              <FilterField label="采购数量">
                <RangeFilter />
              </FilterField>
              <FilterField label="1688账户">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'mock', label: '示例账户A'}]} />
              </FilterField>
              <FilterField label="交易方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay_guarantee', label: '支付宝担保交易'},
                  {value: 'guarantee', label: '担保交易'},
                  {value: 'credit', label: '账期交易'},
                  {value: 'cheng_e_she', label: '诚E赊'},
                  {value: 'bank_transfer', label: '银行转账'},
                  {value: 'stage_631', label: '631分阶段付款'},
                  {value: 'stage_37', label: '37分阶段付款'},
                  {value: 'general_guarantee', label: '通用担保交易'},
                  {value: 'other', label: '其他'}
                ]} />
              </FilterField>
              <FilterField label="平台状态">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'unplaced', label: '未下单'},
                  {value: 'unpaid', label: '待付款'},
                  {value: 'unshipped', label: '待发货'},
                  {value: 'part_shipped', label: '部分发货'},
                  {value: 'unreceived', label: '待收货'},
                  {value: 'fake_shipped', label: '虚假发货'},
                  {value: 'received', label: '已收货'},
                  {value: 'completed', label: '已完成'}
                ]} />
              </FilterField>
              <FilterField label="有无快递单号">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'yes', label: '有快递单号'}, {value: 'no', label: '无快递单号'}]} />
              </FilterField>
              <FilterField label="1688对账">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'normal', label: '正常'},
                  {value: 'abnormal', label: '异常'}
                ]} />
              </FilterField>
              <FilterField label="供应商确认">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'notified', label: '已通知'},
                  {value: 'unnotified', label: '未通知'},
                  {value: 'confirmed', label: '已确认'}
                ]} />
              </FilterField>
              <FilterField label="预计到货">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: '1', label: '1天'},
                  {value: '2', label: '2天'},
                  {value: 'custom', label: '自定义天数'},
                  {value: 'delayed', label: '延期到货'}
                ]} />
              </FilterField>
              <FilterField label="自定义分类">
                <div className="flex items-center gap-2">
                  <SelectFilter options={[
                    {value: 'all', label: '全部'},
                    ...categories.map(c => ({value: c.id, label: c.name}))
                  ]} />
                  <Settings 
                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500" 
                    onClick={() => setIsCategoryModalOpen(true)}
                  />
                </div>
              </FilterField>
              <FilterField label="供应商">
                <Input placeholder="搜索供应商" className="h-8 w-full text-[12px]" />
              </FilterField>
              <FilterField label="税金类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'fixed', label: '按固定'},
                  {value: 'rate', label: '按税率'}
                ]} />
              </FilterField>
              <FilterField label="发票类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'normal', label: '普票'},
                  {value: 'special', label: '专票'}
                ]} />
              </FilterField>
              <FilterField label="开票状态">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'invoiced', label: '已开票'},
                  {value: 'uninvoiced', label: '未开票'}
                ]} />
              </FilterField>
              <FilterField label="超收入库">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'include', label: '包含超收商品'},
                  {value: 'exclude', label: '不包含超收商品'}
                ]} />
              </FilterField>
              <FilterField label="供应商类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: '1688', label: '1688'},
                  {value: 'taogongxiao', label: '淘供销'},
                  {value: 'pdd', label: '拼多多'},
                  {value: 'taobao', label: '淘宝'},
                  {value: 'normal', label: '普通'}
                ]} />
              </FilterField>
              <FilterField label="是否上传附件">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'yes', label: '是'},
                  {value: 'no', label: '否'}
                ]} />
              </FilterField>
              <FilterField label="已下单天数">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: '3', label: '3天'},
                  {value: '5', label: '5天'},
                  {value: '7', label: '7天'},
                  {value: 'custom', label: '自定义天数'}
                ]} />
              </FilterField>
              <FilterField label="在途计算">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'yes', label: '是'},
                  {value: 'no', label: '否'}
                ]} />
              </FilterField>
              <FilterField label="采购价">
                <RangeFilter />
              </FilterField>
              <FilterField label="实付金额">
                <RangeFilter />
              </FilterField>
              <FilterField label="固定分类">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'urgent', label: '加急包裹'},
                  {value: 'merged', label: '合并采购单'},
                  {value: 'be_merged', label: '被合并采购单'},
                  {value: 'gift', label: '有赠品采购单'},
                  {value: 'no_merge', label: '不可合并采购单'},
                  {value: 'no_supply', label: '包含不再来货商品'}
                ]} />
              </FilterField>
              <FilterField label="物流状态">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'wait_collect', label: '待揽收'},
                  {value: 'collected', label: '已揽收'},
                  {value: 'transit', label: '运输中'},
                  {value: 'signed', label: '已签收'}
                ]} />
              </FilterField>
              <FilterField label="物流公司">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'sto', label: '申通'},
                  {value: 'debang', label: '德邦'},
                  {value: 'zto', label: '中通'},
                  {value: 'yunda', label: '韵达'},
                  {value: 'yto', label: '圆通'}
                ]} />
              </FilterField>
              <FilterField label="退货状态">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'applied', label: '已申请退货'},
                  {value: 'unapplied', label: '未申请退货'}
                ]} />
              </FilterField>
              <FilterField label="已发货天数">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: '3', label: '3天'},
                  {value: '5', label: '5天'},
                  {value: '7', label: '7天'},
                  {value: 'custom', label: '自定义天数'}
                ]} />
              </FilterField>
              <FilterField label="账期类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'type1', label: '入库后次月X号付款'},
                  {value: 'type2', label: '入库后X天内付款'}
                ]} />
              </FilterField>
              <FilterField label="退款金额">
                <RangeFilter />
              </FilterField>
              <FilterField label="缺货商品">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'gt0', label: '缺货数大于0'}
                ]} />
              </FilterField>
              <FilterField label="不再更新采购单金额">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'yes', label: '是'},
                  {value: 'no', label: '否'}
                ]} />
              </FilterField>
              <FilterField label="完成方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'manual', label: '手动标记完成'},
                  {value: 'auto', label: '入库自动完成'}
                ]} />
              </FilterField>
              <FilterField label="异常原因">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'over', label: '多发'},
                  {value: 'short', label: '少发'},
                  {value: 'wrong', label: '错发'},
                  {value: 'damage', label: '皮损'},
                  {value: 'other', label: '其他'}
                ]} />
              </FilterField>
              <FilterField label="可支付方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay', label: '支付宝'},
                  {value: 'cheng_e_she', label: '诚e赊'},
                  {value: 'credit', label: '账期支付'},
                  {value: 'cross_border', label: '跨境宝'},
                  {value: 'bank', label: '银行转账'},
                  {value: 'platform', label: '支付平台'}
                ]} />
              </FilterField>
              <FilterField label="实际支付方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay', label: '支付宝'},
                  {value: 'cheng_e_she', label: '诚e赊'},
                  {value: 'credit', label: '账期支付'},
                  {value: 'cross_border', label: '跨境宝'},
                  {value: 'bank', label: '银行转账'},
                  {value: 'platform', label: '支付平台'}
                ]} />
              </FilterField>
            </>
          )}

          {/* 新订单 */}
          {activeTab === '新订单' && (
            <>
              <FilterField label="仓库">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'dg', label: '东莞厚街仓'}]} />
              </FilterField>
              <FilterField label="采购单类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'}, 
                  {value: 'shortage', label: '缺货采购'},
                  {value: 'sample', label: '样品采购'},
                  {value: 'stock', label: '备货采购'},
                  {value: 'dev', label: '开发采样'}
                ]} />
              </FilterField>
              <FilterField label="是否有备注">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'yes', label: '是'}, {value: 'no', label: '否'}]} />
              </FilterField>
              <FilterField label="自定义分类">
                <div className="flex items-center gap-2">
                  <SelectFilter options={[
                    {value: 'all', label: '全部'},
                    ...categories.map(c => ({value: c.id, label: c.name}))
                  ]} />
                  <Settings 
                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500" 
                    onClick={() => setIsCategoryModalOpen(true)}
                  />
                </div>
              </FilterField>
              <FilterField label="供应商">
                <Input placeholder="搜索供应商" className="h-8 w-full text-[12px]" />
              </FilterField>
              <FilterField label="固定分类">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'urgent', label: '加急包裹'},
                  {value: 'merged', label: '合并采购单'},
                  {value: 'be_merged', label: '被合并采购单'},
                  {value: 'gift', label: '有赠品采购单'},
                  {value: 'no_merge', label: '不可合并采购单'},
                  {value: 'no_supply', label: '包含不再来货商品'}
                ]} />
              </FilterField>
              <FilterField label="在途计算">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'yes', label: '是'},
                  {value: 'no', label: '否'}
                ]} />
              </FilterField>
              <FilterField label="退货状态">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'applied', label: '已申请退货'},
                  {value: 'unapplied', label: '未申请退货'}
                ]} />
              </FilterField>
              <FilterField label="账期类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'type1', label: '入库后次月X号付款'},
                  {value: 'type2', label: '入库后X天内付款'}
                ]} />
              </FilterField>
              <FilterField label="不再更新采购单金额">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'yes', label: '是'},
                  {value: 'no', label: '否'}
                ]} />
              </FilterField>
            </>
          )}

          {/* 已完成专用视图区块 */}
          {activeTab === '已完成' && (
            <>
              <FilterField label="仓库">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'dg', label: '东莞厚街仓'}]} />
              </FilterField>
              <FilterField label="采购单类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'}, 
                  {value: 'shortage', label: '缺货采购'},
                  {value: 'sample', label: '样品采购'},
                  {value: 'stock', label: '备货采购'},
                  {value: 'dev', label: '开发采样'}
                ]} />
              </FilterField>
              <FilterField label="是否有备注">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'yes', label: '有备注'}, {value: 'no', label: '无备注'}]} />
              </FilterField>
              <FilterField label="1688账户">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'mock', label: '示例账户A'}]} />
              </FilterField>
              <FilterField label="快递单号">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'yes', label: '有快递单号'}, {value: 'no', label: '无快递单号'}]} />
              </FilterField>
              <FilterField label="1688对账">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'normal', label: '正常'},
                  {value: 'abnormal', label: '异常'}
                ]} />
              </FilterField>
              <FilterField label="自定义分类">
                <div className="flex items-center gap-2">
                  <SelectFilter options={[
                    {value: 'all', label: '全部'},
                    ...categories.map(c => ({value: c.id, label: c.name}))
                  ]} />
                  <Settings 
                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500" 
                    onClick={() => setIsCategoryModalOpen(true)}
                  />
                </div>
              </FilterField>
              <FilterField label="供应商">
                <Input placeholder="搜索供应商" className="h-8 w-full text-[12px]" />
              </FilterField>
              <FilterField label="开票状态">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'invoiced', label: '已开票'},
                  {value: 'uninvoiced', label: '未开票'},
                  {value: 'part_invoiced', label: '部分开票'}
                ]} />
              </FilterField>
              <FilterField label="采购价">
                <RangeFilter />
              </FilterField>
              <FilterField label="退货状态">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'applied', label: '已申请退货'},
                  {value: 'unapplied', label: '未申请退货'}
                ]} />
              </FilterField>
              <FilterField label="账期类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'type1', label: '入库后次月X号付款'},
                  {value: 'type2', label: '入库后X天内付款'}
                ]} />
              </FilterField>
              <FilterField label="不再更新采购单金额">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'yes', label: '是'},
                  {value: 'no', label: '否'}
                ]} />
              </FilterField>
              <FilterField label="异常原因">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'over', label: '多发'},
                  {value: 'short', label: '少发'},
                  {value: 'wrong', label: '错发'},
                  {value: 'damage', label: '皮损'},
                  {value: 'other', label: '其他'}
                ]} />
              </FilterField>
              <FilterField label="可支付方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay', label: '支付宝'},
                  {value: 'cheng_e_she', label: '诚e赊'},
                  {value: 'credit', label: '账期支付'},
                  {value: 'cross_border', label: '跨境宝'},
                  {value: 'bank', label: '银行转账'},
                  {value: 'platform', label: '支付平台'}
                ]} />
              </FilterField>
              <FilterField label="实际支付方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay', label: '支付宝'},
                  {value: 'cheng_e_she', label: '诚e赊'},
                  {value: 'credit', label: '账期支付'},
                  {value: 'cross_border', label: '跨境宝'},
                  {value: 'bank', label: '银行转账'},
                  {value: 'platform', label: '支付平台'}
                ]} />
              </FilterField>
            </>
          )}
          {/* 异常 */}
          {activeTab === '异常' && (
            <>
              <FilterField label="仓库">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'dg', label: '东莞厚街仓'}]} />
              </FilterField>
              <FilterField label="采购单类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'}, 
                  {value: 'shortage', label: '缺货采购'},
                  {value: 'sample', label: '样品采购'},
                  {value: 'stock', label: '备货采购'},
                  {value: 'dev', label: '开发采样'}
                ]} />
              </FilterField>
              <FilterField label="是否有备注">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'yes', label: '有备注'}, {value: 'no', label: '无备注'}]} />
              </FilterField>
              <FilterField label="1688账户">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'mock', label: '示例账户A'}]} />
              </FilterField>
              <FilterField label="自定义分类">
                <div className="flex items-center gap-2">
                  <SelectFilter options={[
                    {value: 'all', label: '全部'},
                    ...categories.map(c => ({value: c.id, label: c.name}))
                  ]} />
                  <Settings 
                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500" 
                    onClick={() => setIsCategoryModalOpen(true)}
                  />
                </div>
              </FilterField>
              <FilterField label="供应商">
                <Input placeholder="搜索供应商" className="h-8 w-full text-[12px]" />
              </FilterField>
              <FilterField label="退货状态">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'applied', label: '已申请退货'},
                  {value: 'unapplied', label: '未申请退货'}
                ]} />
              </FilterField>
              <FilterField label="账期类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'type1', label: '入库后次月X号付款'},
                  {value: 'type2', label: '入库后X天内付款'}
                ]} />
              </FilterField>
              <FilterField label="不再更新采购单金额">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'yes', label: '是'},
                  {value: 'no', label: '否'}
                ]} />
              </FilterField>
              <FilterField label="异常原因">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'over', label: '多发'},
                  {value: 'short', label: '少发'},
                  {value: 'wrong', label: '错发'},
                  {value: 'damage', label: '皮损'},
                  {value: 'other', label: '其他'}
                ]} />
              </FilterField>
              <FilterField label="可支付方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay', label: '支付宝'},
                  {value: 'cheng_e_she', label: '诚e赊'},
                  {value: 'credit', label: '账期支付'},
                  {value: 'cross_border', label: '跨境宝'},
                  {value: 'bank', label: '银行转账'},
                  {value: 'platform', label: '支付平台'}
                ]} />
              </FilterField>
              <FilterField label="实际支付方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay', label: '支付宝'},
                  {value: 'cheng_e_she', label: '诚e赊'},
                  {value: 'credit', label: '账期支付'},
                  {value: 'cross_border', label: '跨境宝'},
                  {value: 'bank', label: '银行转账'},
                  {value: 'platform', label: '支付平台'}
                ]} />
              </FilterField>
            </>
          )}

          {/* 1688对账 */}
          {activeTab === '1688对账' && (
            <>
              <FilterField label="仓库">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'dg', label: '东莞厚街仓'}]} />
              </FilterField>
              <FilterField label="1688账户">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'mock', label: '示例账户A'}]} />
              </FilterField>
              <FilterField label="交易方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay_guarantee', label: '支付宝担保交易'},
                  {value: 'guarantee', label: '担保交易'},
                  {value: 'credit', label: '账期交易'},
                  {value: 'cheng_e_she', label: '诚E赊'},
                  {value: 'bank_transfer', label: '银行转账'},
                  {value: 'stage_631', label: '631分阶段付款'},
                  {value: 'stage_37', label: '37分阶段付款'},
                  {value: 'general_guarantee', label: '通用担保交易'},
                  {value: 'other', label: '其他'}
                ]} />
              </FilterField>
              <FilterField label="供应商">
                <Input placeholder="搜索供应商" className="h-8 w-full text-[12px]" />
              </FilterField>
              <FilterField label="不再更新采购单金额">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'yes', label: '是'},
                  {value: 'no', label: '否'}
                ]} />
              </FilterField>
              <FilterField label="可支付方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay', label: '支付宝'},
                  {value: 'cheng_e_she', label: '诚e赊'},
                  {value: 'credit', label: '账期支付'},
                  {value: 'cross_border', label: '跨境宝'},
                  {value: 'bank', label: '银行转账'},
                  {value: 'platform', label: '支付平台'}
                ]} />
              </FilterField>
              <FilterField label="实际支付方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay', label: '支付宝'},
                  {value: 'cheng_e_she', label: '诚e赊'},
                  {value: 'credit', label: '账期支付'},
                  {value: 'cross_border', label: '跨境宝'},
                  {value: 'bank', label: '银行转账'},
                  {value: 'platform', label: '支付平台'}
                ]} />
              </FilterField>
            </>
          )}

          {/* 已作废 */}
          {activeTab === '已作废' && (
            <>
              <FilterField label="1688账户">
                <SelectFilter options={[{value: 'all', label: '全部'}, {value: 'mock', label: '示例账户A'}]} />
              </FilterField>
              <FilterField label="供应商">
                <Input placeholder="搜索供应商" className="h-8 w-full text-[12px]" />
              </FilterField>
              <FilterField label="固定分类">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'urgent', label: '加急包裹'},
                  {value: 'merged', label: '合并采购单'},
                  {value: 'be_merged', label: '被合并采购单'},
                  {value: 'gift', label: '有赠品采购单'},
                  {value: 'no_merge', label: '不可合并采购单'},
                  {value: 'no_supply', label: '包含不再来货商品'}
                ]} />
              </FilterField>
              <FilterField label="账期类型">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'type1', label: '入库后次月X号付款'},
                  {value: 'type2', label: '入库后X天内付款'}
                ]} />
              </FilterField>
              <FilterField label="不再更新采购单金额">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'yes', label: '是'},
                  {value: 'no', label: '否'}
                ]} />
              </FilterField>
              <FilterField label="异常原因">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'over', label: '多发'},
                  {value: 'short', label: '少发'},
                  {value: 'wrong', label: '错发'},
                  {value: 'damage', label: '皮损'},
                  {value: 'other', label: '其他'}
                ]} />
              </FilterField>
              <FilterField label="可支付方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay', label: '支付宝'},
                  {value: 'cheng_e_she', label: '诚e赊'},
                  {value: 'credit', label: '账期支付'},
                  {value: 'cross_border', label: '跨境宝'},
                  {value: 'bank', label: '银行转账'},
                  {value: 'platform', label: '支付平台'}
                ]} />
              </FilterField>
              <FilterField label="实际支付方式">
                <SelectFilter options={[
                  {value: 'all', label: '全部'},
                  {value: 'alipay', label: '支付宝'},
                  {value: 'cheng_e_she', label: '诚e赊'},
                  {value: 'credit', label: '账期支付'},
                  {value: 'cross_border', label: '跨境宝'},
                  {value: 'bank', label: '银行转账'},
                  {value: 'platform', label: '支付平台'}
                ]} />
              </FilterField>
            </>
          )}
        </div>
      )}

      {/* Custom Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>自定义分类设置</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              {/* Add New */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">新增分类</span>
                <div className="flex items-start gap-2 relative">
                  <div className="flex-1 flex flex-col gap-1">
                    <Input 
                      placeholder="请输入分类名称" 
                      value={newCategory}
                      onChange={e => {
                        setNewCategory(e.target.value);
                        if (categoryError) setCategoryError('');
                      }}
                      className={cn("h-9", categoryError && "border-red-500")}
                    />
                    {categoryError && <span className="text-red-500 text-xs">{categoryError}</span>}
                  </div>
                  <FeatureMarker title="添加" description="交互说明：点击打开新增弹窗，录入新数据。">
                  <Button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700 h-9 px-3">
                    <Plus className="w-4 h-4 mr-1" /> 添加
                  </Button>
                  </FeatureMarker>
                </div>
              </div>

              {/* List */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-sm font-medium">现有分类</span>
                <div className="border rounded-md max-h-[200px] overflow-y-auto custom-scrollbar bg-white divide-y">
                  {categories.map(c => (
                    <div key={c.id} className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 group">
                      {editingId === c.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input 
                            value={editingName}
                            onChange={e => {
                              setEditingName(e.target.value);
                              if (categoryError) setCategoryError('');
                            }}
                            className={cn("h-7 text-xs", categoryError && "border-red-500")}
                            autoFocus
                          />
                          <Check className="w-4 h-4 text-green-600 cursor-pointer" onClick={handleSaveEditCategory} />
                          <X className="w-4 h-4 text-gray-400 cursor-pointer" onClick={() => { setEditingId(null); setCategoryError(''); }} />
                        </div>
                      ) : (
                        <>
                          <span className="text-gray-700">{c.name}</span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 className="w-3.5 h-3.5 text-blue-600 cursor-pointer" onClick={() => {
                              setEditingId(c.id);
                              setEditingName(c.name);
                              setCategoryError('');
                            }} />
                            <Trash2 className="w-3.5 h-3.5 text-red-500 cursor-pointer" onClick={() => {
                              setCategories(categories.filter(cat => cat.id !== c.id));
                            }} />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">暂无分类</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <FeatureMarker title="完成" description="交互说明：点击执行完成操作。">
<Button onClick={() => setIsCategoryModalOpen(false)} className="bg-blue-600 hover:bg-blue-700">完成</Button>
</FeatureMarker>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}