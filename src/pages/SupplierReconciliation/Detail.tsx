import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

type DetailType = 'purchase' | 'sample';
type Cycle = 'daily' | 'monthly';

export default function SupplierReconciliationDetail() {
  const navigate = useNavigate();
  const params = useParams();

  const cycle = (params.cycle as Cycle) || 'daily';
  const type = (params.type as DetailType) || 'purchase';
  const id = params.id || '-';

  const title = useMemo(() => {
    const cycleLabel = cycle === 'daily' ? '日账单' : '月账单';
    const typeLabel = type === 'purchase' ? '采购对账单' : '采样对账单';
    return `${cycleLabel}详情 - ${typeLabel}`;
  }, [cycle, type]);

  const columns = useMemo(() => {
    if (type === 'purchase') {
      const base = [
        '付款单号',
        '关联单号',
        '1688账号',
        '1688单号',
        '付款账号',
        '账号名称',
        '收款人',
        '收款账号',
        '采购单金额',
        '应付金额',
        '实付金额',
        '未付金额',
        '状态',
        '预计付款时间',
        '下单员',
        '下单时间',
        '创建人',
        '创建时间',
        '付款人',
        '付款完成时间',
        '备注'
      ];
      return cycle === 'monthly' ? ['账单日期', '供应商', ...base] : ['供应商', ...base];
    }

    const base = [
      '采购订单号',
      '总金额',
      '下单时间',
      '1688账号',
      '1688单号',
      '库存SKU',
      '采购数量',
      '采购单价',
      '备注',
      '总运费',
      '采购仓库',
      '采购单状态',
      'sku中文名',
      '已付金额',
      '未付金额',
      '已入库量',
      '已退款金',
      '1688退款时间',
      '下单员',
      '1688付款时间',
      '付款时间'
    ];
    return cycle === 'monthly' ? ['账单日期', '供应商', ...base] : ['供应商', ...base];
  }, [cycle, type]);

  const rows = useMemo<Record<string, string>[]>(() => {
    if (cycle === 'daily') {
      if (type === 'purchase') {
        return [
          {
            供应商: '义乌市佳奇服饰有限公司',
            付款单号: 'FK202604250001',
            关联单号: 'GL202604250001',
            '1688账号': '1688账号A',
            '1688单号': '1688-OD-20260425-001',
            付款账号: 'alipay_001',
            账号名称: '测试账号A',
            收款人: '供应商收款人A',
            收款账号: 'bank_6222****8888',
            采购单金额: '¥ 12,800.00',
            应付金额: '¥ 12,800.00',
            实付金额: '¥ 10,000.00',
            未付金额: '¥ 2,800.00',
            状态: '部分付款',
            预计付款时间: '2026-04-30',
            下单员: '王五',
            下单时间: '2026-04-24 15:12:02',
            创建人: '系统',
            创建时间: '2026-04-25 10:20:30',
            付款人: '赵六',
            付款完成时间: '2026-04-25 11:40:18',
            备注: '对账备注示例'
          },
          {
            供应商: '广州市顺达皮革有限公司',
            付款单号: 'FK202604250002',
            关联单号: 'GL202604250002',
            '1688账号': '1688账号B',
            '1688单号': '1688-OD-20260425-002',
            付款账号: 'alipay_002',
            账号名称: '测试账号B',
            收款人: '供应商收款人B',
            收款账号: 'bank_6222****9999',
            采购单金额: '¥ 18,600.00',
            应付金额: '¥ 18,600.00',
            实付金额: '¥ 18,600.00',
            未付金额: '¥ 0.00',
            状态: '已付款',
            预计付款时间: '2026-04-28',
            下单员: '王五',
            下单时间: '2026-04-24 16:02:11',
            创建人: '系统',
            创建时间: '2026-04-25 10:20:30',
            付款人: '赵六',
            付款完成时间: '2026-04-25 12:10:05',
            备注: '对账备注示例'
          }
        ];
      }

      return [
        {
          供应商: '义乌市佳奇服饰有限公司',
          采购订单号: 'PO202604240001',
          总金额: '¥ 2,560.00',
          下单时间: '2026-04-24 12:33:21',
          '1688账号': '1688账号A',
          '1688单号': '1688-OD-20260424-009',
          库存SKU: 'SKU-10006231-0-A0-TSG',
          采购数量: '12',
          采购单价: '¥ 80.00',
          备注: '采样备注示例',
          总运费: '¥ 35.00',
          采购仓库: '默认仓库',
          采购单状态: '已付款',
          sku中文名: 'TSG生产耗材烫钻-D款_银色',
          已付金额: '¥ 2,560.00',
          未付金额: '¥ 0.00',
          已入库量: '12',
          已退款金: '¥ 0.00',
          '1688退款时间': '-',
          下单员: '王五',
          '1688付款时间': '2026-04-24 12:40:10',
          付款时间: '2026-04-24 12:40:10'
        },
        {
          供应商: '广州市顺达皮革有限公司',
          采购订单号: 'PO202604240002',
          总金额: '¥ 1,880.00',
          下单时间: '2026-04-24 13:10:09',
          '1688账号': '1688账号B',
          '1688单号': '1688-OD-20260424-010',
          库存SKU: 'SKU-10006230-G0-A0-GC',
          采购数量: '8',
          采购单价: '¥ 85.00',
          备注: '采样备注示例',
          总运费: '¥ 25.00',
          采购仓库: '默认仓库',
          采购单状态: '部分入库',
          sku中文名: '单件定制-XHP钛钢浮雕耳钉_金色_EDTGGC-3',
          已付金额: '¥ 1,000.00',
          未付金额: '¥ 880.00',
          已入库量: '4',
          已退款金: '¥ 0.00',
          '1688退款时间': '-',
          下单员: '王五',
          '1688付款时间': '2026-04-24 13:12:40',
          付款时间: '2026-04-24 13:12:40'
        }
      ];
    }

    const billDays = ['2026-03-01', '2026-03-02'];
    const suppliers = [
      { name: '义乌市佳奇服饰有限公司', account: '1688账号A' },
      { name: '广州市顺达皮革有限公司', account: '1688账号B' }
    ];

    if (type === 'purchase') {
      const list: Record<string, string>[] = [];
      billDays.forEach((day, idx) => {
        suppliers.forEach((s, jdx) => {
          list.push({
            账单日期: day,
            供应商: s.name,
            付款单号: `FK2026030${idx + 1}00${jdx + 1}`,
            关联单号: `GL2026030${idx + 1}00${jdx + 1}`,
            '1688账号': s.account,
            '1688单号': `1688-OD-2026030${idx + 1}-00${jdx + 1}`,
            付款账号: `alipay_00${jdx + 1}`,
            账号名称: `测试账号${jdx + 1}`,
            收款人: `供应商收款人${jdx + 1}`,
            收款账号: jdx === 0 ? 'bank_6222****8888' : 'bank_6222****9999',
            采购单金额: jdx === 0 ? '¥ 25,600.00' : '¥ 18,600.00',
            应付金额: jdx === 0 ? '¥ 25,600.00' : '¥ 18,600.00',
            实付金额: jdx === 0 ? '¥ 20,000.00' : '¥ 18,600.00',
            未付金额: jdx === 0 ? '¥ 5,600.00' : '¥ 0.00',
            状态: jdx === 0 ? '部分付款' : '已付款',
            预计付款时间: '2026-04-30',
            下单员: '王五',
            下单时间: `${day} 15:12:02`,
            创建人: '系统',
            创建时间: `${day} 18:20:30`,
            付款人: '赵六',
            付款完成时间: `${day} 19:40:18`,
            备注: '月账单明细示例'
          });
        });
      });
      return list;
    }

    const list: Record<string, string>[] = [];
    billDays.forEach((day, idx) => {
      suppliers.forEach((s, jdx) => {
        list.push({
          账单日期: day,
          供应商: s.name,
          采购订单号: `PO2026030${idx + 1}00${jdx + 1}`,
          总金额: jdx === 0 ? '¥ 2,560.00' : '¥ 1,880.00',
          下单时间: `${day} 12:33:21`,
          '1688账号': s.account,
          '1688单号': `1688-OD-2026030${idx + 1}-00${jdx + 1}`,
          库存SKU: jdx === 0 ? 'SKU-10006231-0-A0-TSG' : 'SKU-10006230-G0-A0-GC',
          采购数量: jdx === 0 ? '12' : '8',
          采购单价: jdx === 0 ? '¥ 80.00' : '¥ 85.00',
          备注: '月账单明细示例',
          总运费: jdx === 0 ? '¥ 35.00' : '¥ 25.00',
          采购仓库: '默认仓库',
          采购单状态: jdx === 0 ? '已付款' : '部分入库',
          sku中文名: jdx === 0 ? 'TSG生产耗材烫钻-D款_银色' : '单件定制-XHP钛钢浮雕耳钉_金色_EDTGGC-3',
          已付金额: jdx === 0 ? '¥ 2,560.00' : '¥ 1,000.00',
          未付金额: jdx === 0 ? '¥ 0.00' : '¥ 880.00',
          已入库量: jdx === 0 ? '12' : '4',
          已退款金: '¥ 0.00',
          '1688退款时间': '-',
          下单员: '王五',
          '1688付款时间': `${day} 12:40:10`,
          付款时间: `${day} 12:40:10`
        });
      });
    });
    return list;
  }, [cycle, type]);

  return (
    <div className="flex flex-col h-full bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 px-3 text-[13px]" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> 返回
          </Button>
          <div className="text-[14px] font-medium text-gray-800">{title}</div>
        </div>
        <div className="text-[12px] text-gray-500">ID：{id}</div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-4">
        <table className="w-full text-[13px] border-collapse min-w-[1200px]">
          <thead className="bg-[#F8FAFC] text-gray-700 sticky top-0 z-10 shadow-sm">
            <tr>
              {columns.map((c) => (
                <th key={c} className="p-3 font-normal border-b border-r border-gray-200 whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30">
                {columns.map((c, cIdx) => (
                  <td key={`${idx}-${c}`} className={`p-3 text-gray-800 ${cIdx < columns.length - 1 ? 'border-r border-gray-100' : ''}`}>
                    {row[c] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
