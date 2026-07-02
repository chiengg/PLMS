import { toPercent, type CostReductionRow } from '../utils';

export default function CostReductionTable(props: { rows: CostReductionRow[] }) {
  const { rows } = props;

  return (
    <div className="flex-1 overflow-auto custom-scrollbar bg-white border border-gray-200 rounded">
      <table className="w-full text-center text-[13px] border-collapse min-w-[1500px]">
        <thead className="bg-[#F8FAFC] text-gray-700 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="p-3 font-normal border-b border-r border-gray-200">采购员</th>
            <th className="p-3 font-normal border-b border-r border-gray-200">供应商</th>
            <th className="p-3 font-normal border-b border-r border-gray-200">商品SKU/名称</th>
            <th className="p-3 font-normal border-b border-r border-gray-200">缩略图</th>
            <th className="p-3 font-normal border-b border-r border-gray-200">本次采购单价</th>
            <th className="p-3 font-normal border-b border-r border-gray-200">上次采购单价</th>
            <th className="p-3 font-normal border-b border-r border-gray-200">降本数据</th>
            <th className="p-3 font-normal border-b border-r border-gray-200">本次采购数量</th>
            <th className="p-3 font-normal border-b border-gray-200">降本金额</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-14 text-center text-[13px] text-gray-500">
                <div className="text-gray-700 font-medium mb-1">暂无降本记录</div>
                <div>请检查月份与筛选条件</div>
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.key} className="hover:bg-blue-50/30">
                <td className="p-3 border-r border-gray-100 text-gray-800">{r.purchaser}</td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{r.supplier}</td>
                <td className="p-3 border-r border-gray-100 text-left">
                  <div className="text-blue-600">{r.sku}</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">{r.productName}</div>
                </td>
                <td className="p-3 border-r border-gray-100">
                  <div className="w-10 h-10 mx-auto border border-gray-200 rounded overflow-hidden bg-gray-50">
                    <img src={r.thumbnailUrl} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-3 border-r border-gray-100 text-gray-800">
                  {r.priceCur == null ? '--' : r.priceCur.toFixed(4)}
                </td>
                <td className="p-3 border-r border-gray-100 text-gray-800">
                  {r.pricePrev == null ? '--' : r.pricePrev.toFixed(4)}
                </td>
                <td className="p-3 border-r border-gray-100">
                  <div className="text-[#E6A23C] font-medium">{r.saveUnit == null ? '--' : r.saveUnit.toFixed(4)}</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">{toPercent(r.saveRate)}</div>
                </td>
                <td className="p-3 border-r border-gray-100 text-gray-800">{r.qtyCur}</td>
                <td className="p-3 text-[#16A34A] font-medium">{r.saveAmt == null ? '--' : r.saveAmt.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
