import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PurchaseSuggestions from './pages/PurchaseSuggestions';
import PurchaseSuggestions2 from './pages/PurchaseSuggestions2';
import PurchasePlans from './pages/PurchasePlans';
import ManualSuggestions from './pages/ManualSuggestions';
import GenerateOrder from './pages/GenerateOrder';
import PurchaseManagement from './pages/PurchaseManagement';
import PurchaseReview from './pages/PurchaseReview';
import FinancialProcessing from './pages/FinancialProcessing';
import Receiving from './pages/Receiving';
import PurchaseTracking from './pages/PurchaseTracking';
import RestockTracking from './pages/RestockTracking';
import SupplierManagement from './pages/SupplierManagement';
import AccountAuthorization from './pages/AccountAuthorization';
import ContractManagement from './pages/ContractManagement';
import SupplierKPI from './pages/SupplierKPI';
import SupplierReconciliation from './pages/SupplierReconciliation';
import SupplierReconciliationDetail from './pages/SupplierReconciliation/Detail';
import PurchaserPerformance from './pages/PurchaserPerformance';
import Products from './pages/Products';
import CostReductionPerformance from './pages/CostReductionPerformance';
import AddProduct from './pages/Products/Add';
import SingleSku from './pages/SingleSku';
import ReturnManagement from './pages/ReturnManagement';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/purchase-suggestions" replace />} />
          <Route path="purchase-suggestions" element={<PurchaseSuggestions />} />
          <Route path="purchase-suggestions-2" element={<PurchaseSuggestions2 />} />
          <Route path="purchase-plans" element={<PurchasePlans />} />
          <Route path="purchase-management" element={<PurchaseManagement />} />
          <Route path="purchase-review" element={<PurchaseReview />} />
          <Route path="financial-processing" element={<FinancialProcessing />} />
          <Route path="receiving" element={<Receiving />} />
          <Route path="return-management" element={<ReturnManagement />} />
          <Route path="purchase-tracking" element={<PurchaseTracking />} />
          <Route path="restock-tracking" element={<RestockTracking />} />
          <Route path="supplier-management" element={<SupplierManagement />} />
          <Route path="account-authorization" element={<AccountAuthorization />} />
          <Route path="contract-management" element={<ContractManagement />} />
          <Route path="supplier-kpi" element={<SupplierKPI />} />
          <Route path="supplier-reconciliation" element={<SupplierReconciliation />} />
          <Route path="supplier-reconciliation/:cycle/:type/:id" element={<SupplierReconciliationDetail />} />
          <Route path="purchaser-performance" element={<PurchaserPerformance />} />
          <Route path="cost-reduction-performance" element={<CostReductionPerformance />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/single-sku" element={<SingleSku />} />
          <Route path="manual-suggestions" element={<ManualSuggestions />} />
          <Route path="generate-purchase-order" element={<GenerateOrder />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
