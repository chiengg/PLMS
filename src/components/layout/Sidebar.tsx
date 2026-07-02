import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Factory, 
  Package, 
  Briefcase, 
  Warehouse, 
  Truck, 
  Megaphone, 
  Headset, 
  CircleDollarSign, 
  BarChart2, 
  Wrench, 
  Settings,
  ChevronDown,
  ChevronRight,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [purchaseExpanded, setPurchaseExpanded] = useState(true);
  const [purchaseFlowExpanded, setPurchaseFlowExpanded] = useState(true);
  const [supplierExpanded, setSupplierExpanded] = useState(false);
  const [dataReportExpanded, setDataReportExpanded] = useState(false);
  const [productExpanded, setProductExpanded] = useState(true);
  const [inventorySkuExpanded, setInventorySkuExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [flyoutMenuId, setFlyoutMenuId] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close flyout
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target as Node)) {
        setFlyoutMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { icon: ShoppingCart, label: '订单' },
    { icon: Factory, label: '生产' },
    { 
      icon: Package, 
      label: '商品',
      expanded: productExpanded,
      setExpanded: setProductExpanded,
      activePattern: '/products',
      children: [
        { 
          label: '库存SKU', 
          path: '/products',
          expanded: inventorySkuExpanded,
          setExpanded: setInventorySkuExpanded,
          children: [
            { label: '添加商品', path: '/products/add' },
          ]
        },
        { label: '单品SKU', path: '/products/single-sku' },
      ]
    },
    { 
      icon: Briefcase, 
      label: '采购',
      expanded: purchaseExpanded,
      setExpanded: setPurchaseExpanded,
      activePattern: '/purchase',
      children: [
        {
          label: '采购流程',
          expanded: purchaseFlowExpanded,
          setExpanded: setPurchaseFlowExpanded,
          children: [
            { label: '采购建议·', path: '/purchase-suggestions-2' },
            { label: '采购计划', path: '/purchase-plans' },
            { label: '采购管理', path: '/purchase-management' },
            { label: '采购审核', path: '/purchase-review' },
            { label: '财务处理', path: '/financial-processing' },
            { label: '签收入库', path: '/receiving' },
            { label: '退货管理', path: '/return-management' },
            { label: '采购跟单', path: '/purchase-tracking' },
            { label: '备货跟踪', path: '/restock-tracking' },
          ]
        },
        { 
          label: '供应商管理', 
          expanded: supplierExpanded,
          setExpanded: setSupplierExpanded,
          children: [
            { label: '供应商管理', path: '/supplier-management' },
            { label: '账号授权', path: '/account-authorization' },
            { label: '合同管理', path: '/contract-management' },
            { label: '供应商KPI', path: '/supplier-kpi' },
            { label: '供应商对账', path: '/supplier-reconciliation' },
          ]
        },
        { 
          label: '数据报表', 
          expanded: dataReportExpanded,
          setExpanded: setDataReportExpanded,
          children: [
            { label: '采购员绩效', path: '/purchaser-performance' },
            { label: '降本绩效管理', path: '/cost-reduction-performance' },
          ]
        },
      ]
    },
    { icon: Warehouse, label: '仓库' },
    { icon: Truck, label: '物流' },
    { icon: Megaphone, label: '广告' },
    { icon: Headset, label: '客服' },
    { icon: CircleDollarSign, label: '财务' },
    { icon: BarChart2, label: '统计' },
    { icon: Wrench, label: '工具' },
    { icon: Settings, label: '设置' },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-[#242A38] text-gray-300 flex flex-col flex-shrink-0 transition-all duration-300 relative z-50",
        isCollapsed ? "w-[56px]" : "w-[200px]"
      )}
    >
      <div className="h-14 flex items-center justify-center bg-[#1D222E]">
        <div className="w-8 h-8 bg-blue-600 text-white rounded font-bold flex items-center justify-center text-lg">A</div>
      </div>
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar overflow-x-hidden relative" id="sidebar-scroll-container">
        {navItems.map((item, idx) => {
          const isActive = item.activePattern && location.pathname.startsWith(item.activePattern);
          return (
            <div key={idx} className="relative">
              <div 
                className={cn(
                  "flex items-center px-4 py-2.5 cursor-pointer hover:bg-[#2A3143] hover:text-white transition-colors",
                  isActive ? "text-blue-400 font-medium bg-[#1C212C]" : "",
                  isCollapsed ? "justify-center px-0" : ""
                )}
                onClick={() => {
                  if (isCollapsed) {
                    if (item.children) {
                      setFlyoutMenuId(flyoutMenuId === idx ? null : idx);
                    }
                  } else {
                    item.setExpanded && item.setExpanded(!item.expanded);
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={cn("w-4 h-4", isCollapsed ? "mr-0" : "mr-3", isActive && isCollapsed ? "text-blue-400" : "")} />
                {!isCollapsed && <span className="flex-1 text-[13px] whitespace-nowrap">{item.label}</span>}
                {!isCollapsed && item.children && (
                  item.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </div>
              
              {!isCollapsed && item.children && item.expanded && (
                <div className="bg-[#1C212C] py-1">
                  {item.children.map((child, cIdx) => (
                    <div key={cIdx}>
                      {child.children ? (
                        <>
                          <div 
                              className={cn(
                                "flex items-center px-4 py-2 text-[13px] cursor-pointer hover:bg-[#2A3143]",
                                child.expanded ? "text-blue-400" : "text-gray-400 hover:text-white"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                child.setExpanded && child.setExpanded(!child.expanded);
                                child.path && navigate(child.path);
                              }}
                            >
                              <span className="ml-7 flex-1 whitespace-nowrap">{child.label}</span>
                              {child.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                          {child.expanded && (
                            <div>
                              {child.children.map((grandChild, gcIdx) => {
                                const isGrandChildActive = location.pathname === grandChild.path;
                                return (
                                  <NavLink 
                                    key={gcIdx} 
                                    to={grandChild.path}
                                    className={({ isActive }) => cn(
                                      "flex items-center px-4 py-2 cursor-pointer transition-colors text-[13px]",
                                      isActive || isGrandChildActive
                                        ? "bg-[#2B4B8B] text-white border-l-2 border-blue-500" 
                                        : "hover:text-white hover:bg-[#2A3143] text-gray-400 border-l-2 border-transparent"
                                    )}
                                  >
                                    <span className="ml-9 flex-1 relative whitespace-nowrap">
                                      <span className="absolute -left-3 top-1.5 w-1 h-1 rounded-full bg-gray-500"></span>
                                      {grandChild.label}
                                    </span>
                                  </NavLink>
                                )
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <NavLink
                          to={child.path || '/#'}
                          className={({ isActive }) => cn(
                            "flex items-center px-4 py-2 cursor-pointer transition-colors text-[13px]",
                            isActive
                              ? "bg-[#2B4B8B] text-white border-l-2 border-blue-500"
                              : "hover:text-white hover:bg-[#2A3143] text-gray-400 border-l-2 border-transparent"
                          )}
                        >
                          <span className="ml-7 flex-1 whitespace-nowrap">{child.label}</span>
                          <ChevronRight className="w-3 h-3" />
                        </NavLink>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Portal-like Flyout Menu for Collapsed State */}
      {isCollapsed && flyoutMenuId !== null && navItems[flyoutMenuId].children && (
        <div 
          ref={flyoutRef}
          className="fixed left-[56px] top-14 bottom-10 w-[200px] bg-white border-r border-gray-200 shadow-xl z-[100] text-gray-700 overflow-y-auto custom-scrollbar"
          onMouseLeave={() => setFlyoutMenuId(null)}
        >
          <div className="p-4 border-b border-gray-100 font-medium text-gray-800 text-[14px]">
            {navItems[flyoutMenuId].label}
          </div>
          <div className="py-2">
            {navItems[flyoutMenuId].children!.map((child, cIdx) => (
              <div key={cIdx} className="mb-2">
                {child.children ? (
                  <>
                    <NavLink
                      to={child.path || '/#'}
                      onClick={() => setFlyoutMenuId(null)}
                      className={({ isActive }) => cn(
                        "px-4 py-1.5 text-[12px] font-medium mt-1 mx-2 rounded-md block",
                        isActive ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      {child.label}
                    </NavLink>
                    <div>
                      {child.children.map((grandChild, gcIdx) => {
                        const isGrandChildActive = location.pathname === grandChild.path;
                        return (
                          <NavLink 
                            key={gcIdx} 
                            to={grandChild.path}
                            onClick={() => setFlyoutMenuId(null)}
                            className={({ isActive }) => cn(
                              "flex items-center px-4 py-2 cursor-pointer transition-colors text-[13px] mx-2 rounded-md",
                              isActive || isGrandChildActive
                                ? "text-blue-600 bg-blue-50 font-medium" 
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            <span className="flex-1 whitespace-nowrap">
                              {grandChild.label}
                            </span>
                          </NavLink>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={child.path || '/#'}
                    onClick={() => setFlyoutMenuId(null)}
                    className={({ isActive }) => cn(
                      "flex items-center px-4 py-2 mx-2 rounded-md cursor-pointer transition-colors text-[13px]",
                      isActive
                        ? "text-blue-600 bg-blue-50 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <span className="flex-1 whitespace-nowrap">{child.label}</span>
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div 
        className={cn(
          "h-10 border-t border-[#313A4D] flex items-center px-4 cursor-pointer hover:text-white hover:bg-[#2A3143] text-[13px]",
          isCollapsed ? "justify-center px-0" : ""
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "展开菜单" : "收起菜单"}
      >
        <Menu className={cn("w-4 h-4", isCollapsed ? "mr-0" : "mr-3")} />
        {!isCollapsed && <span className="whitespace-nowrap">收起菜单</span>}
      </div>
    </div>
  );
}
