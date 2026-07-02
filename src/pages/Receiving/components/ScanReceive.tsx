import React, { useState, useEffect } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Printer, Download, Info, CheckCircle2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function ScanReceive() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  // Use localStorage to persist the active scanned order data across tab switches
  const [orderData, setOrderData] = useLocalStorage<any>('active_scanned_order_data', null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [products, setProducts] = useLocalStorage<any[]>('active_scanned_products', []);
  
  // Read orders from global storage to sync with PurchaseManagement module
  const [globalOrders, setGlobalOrders] = useLocalStorage<any[]>('purchase_orders_data_v11', []);

  // Bottom bar states
  const [freight, setFreight] = useLocalStorage('active_scanned_freight', '0');
  const [addFreight, setAddFreight] = useLocalStorage('active_scanned_addFreight', false);
  const [signNote, setSignNote] = useLocalStorage('active_scanned_signNote', '');
  const [printLabel, setPrintLabel] = useLocalStorage('active_scanned_printLabel', false);

  const performSearch = (keyword: string) => {
    if (keyword.trim()) {
      // Look up order in the shared storage
      const foundOrder = globalOrders.find(o => o.orderNo === keyword.trim() || o.customOrderNo === keyword.trim());
      
      if (foundOrder) {
        // Map the found order to the display format
        const totalCount = foundOrder.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || foundOrder.productCount || 0;
          
          const mappedOrder = {
          id: foundOrder.id,
          orderNo: foundOrder.orderNo,
          logisticsNo: foundOrder.trackingNo || '--',
          customCategory: foundOrder.customCategory || '--',
          typeCount: foundOrder.items?.length || 1, 
          totalCount: totalCount,
          warehousedCount: foundOrder.receivedCount || 0,
          buyer: foundOrder.buyer || '系统管理员',
          orderDate: foundOrder.orderDate || '2026-03-24 16:14:32',
          warehouse: foundOrder.warehouse || '',
          defectiveWarehouse: '',
          status: foundOrder.status || '采购中',
          note: foundOrder.orderNote || '--',
          relatedOrderNo: foundOrder.relatedOrderNo || '--',
          products: foundOrder.items && foundOrder.items.length > 0 
            ? foundOrder.items.map((item: any, idx: number) => {
                const purchaseQty = item.quantity || 0;
                // If item has its own receivedQty, use it; otherwise fallback to 0
                const receivedCount = item.receivedQty || 0;
                const remainingQty = Math.max(0, purchaseQty - receivedCount);

                return {
                  id: item.id || String(idx),
                  warehouse: foundOrder.warehouse || '默认仓库',
                  defectiveWarehouse: '未设置不良品仓根据数量不入库',
                  image: item.image || item.productImage || 'https://via.placeholder.com/40',
                  inventorySku: item.sku || '未知SKU',
                  originalSku: '原厂SKU',
                  name: item.name || item.productName || '商品名称',
                  note: '',
                  relatedPlanCount: 0,
                  location: '001',
                  weight: '0',
                  totalWarehoused: receivedCount, 
                  totalArrived: receivedCount,
                  purchaseQty: purchaseQty,
                  boxedQty: 0,
                  warehousingQty: String(remainingQty),
                  arrivedQty: String(remainingQty),
                  lossQty: '0',
                  exceptionReason: '',
                  printQty: String(purchaseQty)
                };
              })
            : [
            {
              id: '1',
              warehouse: foundOrder.warehouse || '默认仓库',
              defectiveWarehouse: '未设置不良品仓根据数量不入库',
              image: foundOrder.productImage || 'https://via.placeholder.com/40',
              inventorySku: foundOrder.sku || '未知SKU',
              originalSku: '原厂SKU',
              name: foundOrder.productName || '商品名称',
              note: '',
              relatedPlanCount: 0,
              location: '001',
              weight: '0',
              totalWarehoused: foundOrder.receivedCount || 0,
              totalArrived: foundOrder.receivedCount || 0,
              purchaseQty: totalCount,
              boxedQty: 0,
              warehousingQty: String(Math.max(0, totalCount - (foundOrder.receivedCount || 0))),
              arrivedQty: String(Math.max(0, totalCount - (foundOrder.receivedCount || 0))),
              lossQty: '0',
              exceptionReason: '',
              printQty: String(totalCount)
            }
          ]
        };
        setOrderData(mappedOrder);
        setProducts(mappedOrder.products);
      } else {
        alert('未找到对应的采购单，请检查单号是否正确');
        setOrderData(null);
        setProducts([]);
      }
      setIsSuccess(false);
    } else {
      setOrderData(null);
      setProducts([]);
    }
  };

  const handleSearch = () => {
    performSearch(searchInput);
  };

  useEffect(() => {
    const state = location.state as { orderNo?: string };
    if (state && state.orderNo) {
      setSearchInput(state.orderNo);
      performSearch(state.orderNo);
      
      // Clear location state after handling to prevent re-fetching on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleConfirmReceive = () => {
    if (!orderData) return;
    
    // Simulate API call for confirming receive
    setIsSuccess(true);
    
    // Update global state
    const newTotalWarehoused = products.reduce((sum, p) => sum + (Number(p.warehousingQty) || 0), 0);
    
    setGlobalOrders(prevOrders => prevOrders.map(o => {
      if (o.id === orderData.id || o.orderNo === orderData.orderNo) {
        // Update items array with new received quantities
        let updatedItems = o.items;
        if (o.items && o.items.length > 0) {
          updatedItems = o.items.map((item: any, idx: number) => {
            const matchedProduct = products.find(p => p.id === item.id || p.id === String(idx));
            if (matchedProduct) {
              return {
                ...item,
                receivedQty: (item.receivedQty || 0) + (Number(matchedProduct.warehousingQty) || 0)
              };
            }
            return item;
          });
        }

        const updatedReceivedCount = (o.receivedCount || 0) + newTotalWarehoused;
        // Update status to received if all items are received, else partially received
        let newStatus = o.status;
        const totalCount = updatedItems?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || o.productCount || 0;
        
        if (updatedReceivedCount >= totalCount) {
          newStatus = '已完成';
        } else if (updatedReceivedCount > 0) {
          newStatus = '部分到货';
        }

        return { 
          ...o, 
          items: updatedItems,
          receivedCount: updatedReceivedCount,
          status: newStatus 
        };
      }
      return o;
    }));

    // Reset data after a short delay or show success state
    setTimeout(() => {
      alert('入库成功！入库状态已同步更新至采购管理模块。');
      setIsSuccess(false);
      setOrderData(null);
      setProducts([]);
      setSearchInput('');
    }, 500);
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const newProducts = [...products];
    const currentProduct = newProducts[index];
    
    // Convert to number for calculations
    let numValue = Number(value);
    const purchaseQty = Number(currentProduct.purchaseQty) || 0;
    const receivedCount = Number(currentProduct.totalWarehoused) || 0;
    const maxAllowedArrived = Math.max(0, purchaseQty - receivedCount);

    // Validation Logic
    if (field === 'arrivedQty') {
      if (numValue > maxAllowedArrived) {
        alert(`本次到货量不能大于剩余应入库数量 (${maxAllowedArrived})`);
        numValue = maxAllowedArrived;
      }
    } else if (field === 'warehousingQty') {
      const currentArrived = Number(currentProduct.arrivedQty) || 0;
      if (numValue > currentArrived) {
        alert(`本次入库量不能大于本次到货量 (${currentArrived})`);
        numValue = currentArrived;
      }
    }

    let updatedProduct = { ...currentProduct, [field]: field.includes('Qty') ? String(numValue) : value };
    
    // Auto-calculate lossQty if arrivedQty or warehousingQty changes
    if (field === 'arrivedQty' || field === 'warehousingQty') {
      const arrived = field === 'arrivedQty' ? numValue : (Number(currentProduct.arrivedQty) || 0);
      const warehoused = field === 'warehousingQty' ? numValue : (Number(currentProduct.warehousingQty) || 0);
      
      // If arrivedQty changes and is less than warehousingQty, adjust warehousingQty as well
      if (field === 'arrivedQty' && warehoused > arrived) {
        updatedProduct.warehousingQty = String(arrived);
        updatedProduct.lossQty = '0';
      } else {
        updatedProduct.lossQty = String(Math.max(0, arrived - warehoused));
      }
    }
    
    newProducts[index] = updatedProduct;
    setProducts(newProducts);
  };

  // Calculate totals
  const totalWarehousingQty = products.reduce((sum, p) => sum + (Number(p.warehousingQty) || 0), 0);
  const totalTypes = products.length;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Top Action Bar */}
      <div className="p-3 border-b border-gray-200 flex flex-wrap items-center gap-4 bg-white flex-shrink-0 text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 whitespace-nowrap">扫描输入：</span>
          <select className="h-8 border border-gray-300 rounded px-2 outline-none text-gray-700 w-24">
            <option>按单据</option>
            <option>按包裹</option>
          </select>
          <div className="relative w-[300px]">
            <Input 
              className="h-8 pr-8 w-full text-[13px]" 
              placeholder="物流单号/采购单号/自定义单号" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchInput && (
              <X className="w-4 h-4 text-gray-400 absolute right-2 top-2 cursor-pointer hover:text-gray-600" onClick={() => {setSearchInput(''); setOrderData(null);}} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <Checkbox />
            <span>直接打印</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <Checkbox />
            <span>直接入库</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <FeatureMarker title="打印标签" description="交互说明：点击执行打印标签操作。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal gap-1.5">
            <Printer className="w-3.5 h-3.5" /> 打印标签
          </Button>
          </FeatureMarker>
          <FeatureMarker title="打印入库单" description="交互说明：点击执行打印入库单操作。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal gap-1.5">
            <Printer className="w-3.5 h-3.5" /> 打印入库单
          </Button>
          </FeatureMarker>
          <FeatureMarker title="搜索" description="交互说明：根据设置的筛选条件执行搜索，更新列表数据。">
          <Button className="h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white px-4 text-[13px] font-normal gap-1.5" onClick={handleSearch}>
            <Search className="w-3.5 h-3.5" /> 搜索
          </Button>
          </FeatureMarker>
        </div>

        <div className="flex items-center gap-3 ml-auto text-blue-600 text-[12px]">
          <span className="flex items-center gap-1 cursor-pointer hover:underline"><Printer className="w-3.5 h-3.5" /> 打印设置</span>
          <span className="flex items-center gap-1 cursor-pointer hover:underline"><Download className="w-3.5 h-3.5" /> 下载打印插件</span>
          <span className="cursor-pointer hover:underline">缺货订单</span>
          <span className="cursor-pointer hover:underline text-gray-500 flex items-center"><Info className="w-3.5 h-3.5 mr-1" />免装打印插件签收入库</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-[#F5F7FA] p-4 flex">
        {!orderData ? (
          <div className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded">
            <div className="text-center text-gray-500 flex flex-col items-center">
              <div className="flex items-center text-red-500 mb-2">
                <Info className="w-5 h-5 mr-2" />
                <span className="text-[15px]">请扫描或输入物流单号/采购单号</span>
              </div>
              <span className="text-[13px]">如果您的单据没有得到解决，请联系客服。</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Left Panel: Order Info */}
            <div className="w-[300px] bg-white border border-gray-200 rounded flex flex-col flex-shrink-0 overflow-y-auto custom-scrollbar text-[13px]">
              <div className="flex border-b border-gray-100">
                <div className="w-28 p-3 text-right text-gray-500 bg-gray-50/50">采购单号：</div>
                <div className="flex-1 p-3 text-gray-800">{orderData.orderNo}</div>
              </div>
              <div className="flex border-b border-gray-100">
                <div className="w-28 p-3 text-right text-gray-500 bg-gray-50/50">物流单号：</div>
                <div className="flex-1 p-3 text-gray-800">{orderData.logisticsNo}</div>
              </div>
              <div className="flex border-b border-gray-100">
                <div className="w-28 p-3 text-right text-gray-500 bg-gray-50/50">自定义分类：</div>
                <div className="flex-1 p-3 text-gray-800">{orderData.customCategory}</div>
              </div>
              <div className="flex border-b border-gray-100">
                <div className="w-28 p-3 text-right text-gray-500 bg-gray-50/50">种类/总数：</div>
                <div className="flex-1 p-3 text-gray-800 font-medium">{orderData.typeCount} / {orderData.totalCount}</div>
              </div>
              <div className="flex border-b border-gray-100">
                <div className="w-28 p-3 text-right text-gray-500 bg-gray-50/50">已入库总数：</div>
                <div className="flex-1 p-3 text-gray-800">{orderData.warehousedCount}</div>
              </div>
              <div className="flex border-b border-gray-100">
                <div className="w-28 p-3 text-right text-gray-500 bg-gray-50/50">下单员：</div>
                <div className="flex-1 p-3 text-gray-800">{orderData.buyer}</div>
              </div>
              <div className="flex border-b border-gray-100">
                <div className="w-28 p-3 text-right text-gray-500 bg-gray-50/50">下单日期：</div>
                <div className="flex-1 p-3 text-gray-800">{orderData.orderDate}</div>
              </div>
              <div className="flex border-b border-gray-100">
                <div className="w-28 p-3 text-right text-gray-500 bg-gray-50/50">仓库：</div>
                <div className="flex-1 p-3 text-gray-800">{orderData.warehouse || '--'}</div>
              </div>
              <div className="flex border-b border-gray-100">
                <div className="w-28 p-3 text-right text-gray-500 bg-gray-50/50">不良品仓：</div>
                <div className="flex-1 p-3 text-gray-800">{orderData.defectiveWarehouse || '--'}</div>
              </div>
              <div className="flex border-b border-gray-100">
                <div className="w-28 p-3 text-right text-gray-500 bg-gray-50/50">状态：</div>
                <div className="flex-1 p-3 text-gray-800">{orderData.status}</div>
              </div>
              <div className="flex flex-col border-b border-gray-100 p-3">
                <div className="text-gray-500 mb-1">采购单备注：</div>
                <div className="text-gray-800 p-2 bg-gray-50 rounded border border-gray-100 min-h-[60px]">{orderData.note}</div>
              </div>
              <div className="flex flex-col p-3">
                <div className="text-gray-500 mb-1">关联订单编号：</div>
                <Input readOnly className="h-8 bg-gray-50" value={orderData.relatedOrderNo} />
              </div>
            </div>

            {/* Right Panel: Products Table */}
            <div className="flex-1 bg-white border border-gray-200 rounded flex flex-col overflow-hidden">
              <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center text-[13px]">
                <span className="text-gray-700 font-medium mr-2">收货仓库：</span>
                <span className="text-gray-600 mr-8">{orderData.warehouse || '--'}</span>
                <span className="text-gray-700 font-medium mr-2">不良品仓：</span>
                <span className="text-gray-600">{orderData.defectiveWarehouse || '未设置不良品仓根据数量不入库'}</span>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-[12px] text-left border-collapse table-fixed">
                  <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
                    <tr className="text-gray-600">
                      <th className="p-2 w-10 text-center font-normal border-r border-gray-200"><Checkbox /></th>
                      <th className="p-2 font-normal text-center w-16 border-r border-gray-200">缩略图</th>
                      <th className="p-2 font-normal w-[200px] border-r border-gray-200">库存SKU/原厂SKU/商品名称</th>
                      <th className="p-2 font-normal text-center flex-1 border-r border-gray-200">仓位</th>
                      <th className="p-2 font-normal text-center flex-1 border-r border-gray-200">重量(g)</th>
                      <th className="p-2 font-normal text-center flex-1 border-r border-gray-200">采购量</th>
                      <th className="p-2 font-normal text-center flex-1 border-r border-gray-200">已入库数量</th>
                      <th className="p-2 font-normal text-center flex-1 border-r border-gray-200">本次到货量</th>
                      <th className="p-2 font-normal text-center flex-1 border-r border-gray-200">本次入库量</th>
                      <th className="p-2 font-normal text-center flex-1 border-r border-gray-200">损耗量</th>
                      <th className="p-2 font-normal text-center flex-1">异常原因<br/>打印数量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product, index) => (
                      <tr key={product.id} className="hover:bg-blue-50/30">
                        <td className="p-2 text-center align-middle border-r border-gray-200"><Checkbox /></td>
                        <td className="p-2 align-middle text-center border-r border-gray-200">
                          <img src={product.image} alt="thumb" className="w-10 h-10 object-cover mx-auto border border-gray-200 rounded" />
                        </td>
                        <td className="p-2 align-middle border-r border-gray-200">
                          <div className="text-blue-600 font-medium">{product.inventorySku}</div>
                          <div className="text-gray-600 mt-1">{product.originalSku}</div>
                          <div className="text-gray-800 mt-1 font-medium">{product.name}</div>
                          <div className="text-gray-500 mt-1 text-[11px]">
                            备注：{product.note}<br/>
                            <span className="text-blue-500 cursor-pointer hover:underline">关联计划数 ({product.relatedPlanCount})</span>
                          </div>
                        </td>
                        <td className="p-2 align-middle text-center text-gray-800 border-r border-gray-200">{product.location}</td>
                        <td className="p-2 align-middle text-center border-r border-gray-200">
                          <Input 
                            className="h-7 w-16 text-center text-[12px] mx-auto" 
                            value={product.weight}
                            onChange={(e) => updateProduct(index, 'weight', e.target.value)}
                          />
                        </td>
                        <td className="p-2 align-middle text-center text-blue-600 border-r border-gray-200">
                          {product.purchaseQty}
                        </td>
                        <td className="p-2 align-middle text-center text-blue-600 border-r border-gray-200">
                          {product.totalWarehoused}
                        </td>
                        <td className="p-2 align-middle text-center border-r border-gray-200">
                          <div className="flex items-center justify-center">
                            <Input 
                              type="number"
                              className="h-7 w-16 text-center text-[12px] text-blue-600 font-medium" 
                              value={product.arrivedQty}
                              onChange={(e) => updateProduct(index, 'arrivedQty', e.target.value)}
                            />
                          </div>
                        </td>
                        <td className="p-2 align-middle text-center border-r border-gray-200">
                          <div className="flex items-center justify-center">
                            <Input 
                              type="number"
                              className="h-7 w-16 text-center text-[12px] text-blue-600 font-medium" 
                              value={product.warehousingQty}
                              onChange={(e) => updateProduct(index, 'warehousingQty', e.target.value)}
                            />
                          </div>
                        </td>
                        <td className="p-2 align-middle text-center border-r border-gray-200">
                          <div className="flex items-center justify-center">
                            <Input 
                              type="number"
                              className="h-7 w-16 text-center text-[12px]" 
                              value={product.lossQty}
                              onChange={(e) => updateProduct(index, 'lossQty', e.target.value)}
                            />
                          </div>
                        </td>
                        <td className="p-2 align-middle text-center space-y-2">
                          <select 
                            className="h-7 w-24 border border-gray-300 rounded px-1 outline-none text-[12px]"
                            value={product.exceptionReason}
                            onChange={(e) => updateProduct(index, 'exceptionReason', e.target.value)}
                          >
                            <option value="">请选择</option>
                            <option value="破损">破损</option>
                            <option value="少件">少件</option>
                            <option value="错发">错发</option>
                          </select>
                          <div className="flex items-center justify-center">
                            <Input 
                              type="number"
                              className="h-7 w-20 text-center text-[12px]" 
                              value={product.printQty}
                              onChange={(e) => updateProduct(index, 'printQty', e.target.value)}
                            />
                            <div className="w-6 h-7 bg-gray-50 flex items-center justify-center border border-l-0 border-gray-300 rounded-r cursor-pointer text-gray-500 hover:text-blue-500">
                              <Printer className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="p-3 border-t border-gray-200 bg-white flex items-center justify-between flex-shrink-0 text-[13px] z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 flex items-center gap-1">采购运费 <Info className="w-3.5 h-3.5 text-blue-500 cursor-help" /></span>
            <div className="flex items-center">
              <span className="h-8 px-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l flex items-center text-gray-500">￥</span>
              <Input 
                className="h-8 w-20 rounded-l-none text-[12px]" 
                value={freight}
                onChange={(e) => setFreight(e.target.value)}
              />
            </div>
          </div>
          
          <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
            <Checkbox checked={addFreight} onCheckedChange={(c) => setAddFreight(!!c)} />
            <span>追加运费</span>
          </label>

          <div className="flex items-center gap-2 flex-1 max-w-[400px]">
            <span className="text-gray-700 whitespace-nowrap">签收备注：</span>
            <Input 
              className="h-8 flex-1 text-[12px]" 
              value={signNote}
              onChange={(e) => setSignNote(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
            <Checkbox checked={printLabel} onCheckedChange={(c) => setPrintLabel(!!c)} />
            <span>打印商品标签</span>
          </label>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-gray-600 text-right leading-tight">
            <div>本次入库总数量合计：<span className="font-medium text-gray-800">{totalWarehousingQty}</span></div>
            <div>本次入库种类型合计：<span className="font-medium text-gray-800">{totalTypes}</span></div>
          </div>
          <FeatureMarker title="确认入库" description="交互说明：校验表单数据并提交保存。">
          <Button 
            className="h-10 px-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-[14px] text-white font-medium"
            onClick={handleConfirmReceive}
            disabled={!orderData}
          >
            确认入库
          </Button>
          </FeatureMarker>
        </div>
      </div>
    </div>
  );
}
