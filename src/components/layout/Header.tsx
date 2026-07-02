import { useState, useEffect } from 'react';
import { X, Plus, Bell, HelpCircle, Clock, ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

const initialTabs = [
  { label: '首页', path: '/', closable: false },
  { label: '采购建议', path: '/purchase-suggestions', closable: true },
];

const routeLabels: Record<string, string> = {
  '/': '首页',
  '/purchase-suggestions': '采购建议',
  '/purchase-suggestions-2': '采购建议·',
  '/purchase-plans': '采购计划',
  '/purchase-management': '采购管理',
  '/purchase-review': '采购审核',
  '/financial-processing': '财务处理',
  '/receiving': '签收入库',
  '/return-management': '退货管理',
  '/purchase-tracking': '采购跟单',
  '/restock-tracking': '备货跟踪',
  '/supplier-management': '供应商管理',
  '/account-authorization': '账号授权',
  '/contract-management': '合同管理',
  '/supplier-kpi': '供应商KPI',
  '/supplier-reconciliation': '供应商对账',
  '/purchaser-performance': '采购员绩效',
  '/cost-reduction-performance': '降本绩效管理',
  '/products': '商品',
  '/products/add': '添加商品',
  '/products/single-sku': '单品SKU',
  '/manual-suggestions': '手动创建采购建议',
  '/generate-purchase-order': '生成采购单'
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState(initialTabs);

  // Add tab if navigating to a new route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') return; // Handled by purchase-suggestions usually or is home
    
    setTabs(prev => {
      if (prev.find(t => t.path === path)) return prev;
      return [...prev, {
        label: routeLabels[path] || '新标签页',
        path: path,
        closable: true
      }];
    });
  }, [location.pathname]);

  const handleClose = (e: React.MouseEvent, pathToClose: string) => {
    e.stopPropagation();
    
    const newTabs = tabs.filter(t => t.path !== pathToClose);
    setTabs(newTabs);
    
    // If we closed the active tab, navigate to the last available tab
    if (location.pathname === pathToClose || (pathToClose === '/purchase-suggestions' && location.pathname === '/')) {
      const lastTab = newTabs[newTabs.length - 1];
      navigate(lastTab.path);
    }
  };

  return (
    <div className="h-14 bg-[#2C3449] flex items-center justify-between px-0 text-gray-300 text-[13px] border-b border-[#3E475B]">
      <div className="flex h-full items-end pt-2 px-2 gap-1 overflow-x-auto custom-scrollbar flex-1">
        {tabs.map((tab, idx) => {
          const isActive = location.pathname === tab.path || (tab.path === '/purchase-suggestions' && location.pathname === '/');
          return (
            <div
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 cursor-pointer rounded-t-md transition-colors whitespace-nowrap select-none border-t border-x border-transparent",
                isActive 
                  ? "bg-white text-gray-800 font-medium z-10" 
                  : "bg-[#3A435A] hover:bg-[#4A5570] text-gray-300"
              )}
            >
              {tab.label}
              {tab.closable && (
                <div 
                  onClick={(e) => handleClose(e, tab.path)}
                  className="flex items-center justify-center rounded-full hover:bg-gray-200/20 w-4 h-4"
                >
                  <X className={cn("w-3.5 h-3.5 hover:text-red-500", isActive ? "text-gray-400" : "text-gray-400")} />
                </div>
              )}
            </div>
          );
        })}
        <div className="flex items-center justify-center w-8 h-8 cursor-pointer hover:bg-[#4A5570] rounded ml-1 mb-1 self-center text-gray-400">
          <Plus className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex items-center gap-4 px-4 h-full flex-shrink-0 bg-[#2C3449]">
        <div className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded cursor-pointer transition-colors font-medium">
          <span className="text-[12px]">AI助手</span>
        </div>
        <div className="cursor-pointer hover:text-white transition-colors">新功能</div>
        <div className="cursor-pointer hover:text-white transition-colors">帮助</div>
        <div className="flex items-center gap-3 border-l border-[#4A5570] pl-4">
          <Bell className="w-4 h-4 cursor-pointer hover:text-white" />
          <HelpCircle className="w-4 h-4 cursor-pointer hover:text-white" />
          <Clock className="w-4 h-4 cursor-pointer hover:text-white" />
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-white border-l border-[#4A5570] pl-4">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <span>超级管理员</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
