import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const routeTitles: Record<string, string> = {
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
  '/manual-suggestions': '手工生成采购建议',
  '/generate-purchase-order': '生成采购单'
};

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    const title = routeTitles[location.pathname];
    if (title) {
      document.title = `${title} - 采购系统`;
    } else {
      document.title = '采购系统';
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F6F8]">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full min-w-0">
        <Header />
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
