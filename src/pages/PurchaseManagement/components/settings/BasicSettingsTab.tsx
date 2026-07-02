import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function BasicSettingsTab() {
  return (
    <div className="flex flex-col gap-6 text-[13px] text-gray-700 max-w-[800px] mx-auto pb-10">
      
      {/* 1. 采购单价规则设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">采购单价规则设置：</div>
        <div className="flex-1 flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="priceRule" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
            <span>该供应商最新采购价 &gt; 仓库成本价 &gt; 统一成本价</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="priceRule" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
            <span>最新采购价 &gt; 仓库成本价 &gt; 统一成本价</span>
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="priceRule" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>自定义规则</span>
            </label>
            <div className="text-gray-400">该供应商最新采购价 &gt; 最新采购价 &gt; 仓库成本价 &gt; 统一成本价 &gt; 供应商报价</div>
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            1、针对通过【采购管理】、【智能生成采购单】创建的采购单，如果用户已填写采购单价，以用户填写的采购单价金额为准；用户未填写采购单价，以用户选择的获取规则依次获取采购单价。<br/>
            2、“该供应商最新采购价”指该商品从该供应商采购的最近一次的采购单的采购单价，“最新采购价”指该商品的最近一次的采购单的采购单价。<br/>
            3、自定义规则支持拖拽修改顺序。
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 2. 成本价修改设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">成本价修改设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="costRule" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>入库修改</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="costRule" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>入库不修改</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            设置入库修改后将根据本次采购价、本次运费和现在的成本计算出新的成本价；反之不计算，保持原本的成本价；设置自动同步到所有未发货订单请至系统设置调整'入库同步更新未发货订单商品成本价设置'
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 3. 成本价税金计算设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">成本价税金计算设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>专票</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>普票</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            选中的发票类型，在计算成本价时，对应的税金将会纳入到商品成本价的计算中
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 4. 是否启用超收入库 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">是否启用超收入库：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="overReceive" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
                <span>启用</span>
              </label>
              <span className="ml-4 text-gray-500">超收比例</span>
              <div className="flex items-center w-24">
                <Input type="number" className="h-7 text-[13px] text-center rounded-r-none border-r-0 focus-visible:ring-0" />
                <div className="h-7 px-2 bg-gray-50 border border-gray-300 rounded-r flex items-center text-gray-500">%</div>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="overReceive" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>停用</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            1.启用并设置超收比例后，采购签收入库时，采购数量 &lt; 入库数量 ≤ 采购数量(1+超收比例)；<br/>
            2.启用不设置超收比例，则允许超收且没有超收上限；<br/>
            3.停用则不允许超收；<br/>
            4.仅支持马帮ERP入库
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 5. 超量收货部分的商品是否作为赠品摊低成本价 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">超量收货部分的商品<br/>是否作为赠品摊低成本价：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="giftCost" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>是</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="giftCost" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>否</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            设置为“是”，则签收入库的（已到货量+本次实际入库量+本次损耗量）&gt;采购量时，超出部分的商品将视作赠品，按采购成本为0去计算仓库成本价，从而摊低此商品的仓库成本价。<br/>
            设置为“否”，则超出部分的商品仍按采购单价计算仓库成本价，不会摊低此商品的仓库成本价。<br/>
            举例：采购10个商品，单价10元，实际入库12个（无初始库存且无运费、税金等其他费用）<br/>
            设置为“是”，则仓库成本价=（10*10+0*10）/12=8.33元<br/>
            设置为“否”，则仓库成本价=（10*10+2*10）/12=10元
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 6. 是否允许展示全部商品详情 */}
      <div className="flex gap-4 items-center">
        <div className="w-32 text-right shrink-0">是否允许展示全部商品详情：</div>
        <div className="flex-1 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="showDetail" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
            <span>不展示</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="showDetail" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
            <span>展示</span>
          </label>
        </div>
      </div>
      
      <div className="flex gap-4 -mt-4">
        <div className="w-32"></div>
        <div className="text-[#E6A23C] text-[12px]">设置为不展示，在采购列表不能全部展开商品详情！</div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 7. 采购单商品行备注设置 */}
      <div className="flex gap-4 items-center">
        <div className="w-32 text-right shrink-0">采购单商品行备注设置：</div>
        <div className="flex-1 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="rowNote" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
            <span>读取商品的采购备注</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="rowNote" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
            <span>无备注</span>
          </label>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 8. 采购单订单备注设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">采购单订单备注设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>店铺</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>店长</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>订单备注</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>供应商备注</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            勾选后，自动将备注填写到采购单的订单备注框，支持拖动调整顺序：<br/>
            通过订单生成采购单会拉取订单的店铺/店长/订单备注/供应商备注作为采购单的订单备注；反之则不拉取。<br/>
            订单备注：勾选后，手动添加采购单或拉单创建采购单时拉取供应商的备注作为采购单的订单备注：反之则不拉取
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 9. 参与采购在途设置 */}
      <div className="flex gap-4 items-center">
        <div className="w-32 text-right shrink-0">参与采购在途设置：</div>
        <div className="flex-1 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span>新订单参与计算采购在途</span>
          </label>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 10. 到货天数取值设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">到货天数取值设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="arriveDays" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>按供应商</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="arriveDays" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>按库存sku</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            针对通过【智能生成采购单】、【采购管理】创建的采购单；在选择“按供应商”时，到货天数取值供应商的到货周期/天；选择“按库存SKU”时，到货天数取值所选的库存SKU中对应仓库的采购天数最大值。
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 11. 预计到货时间设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">预计到货时间设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="expectArrive" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>按下单时间计算</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="expectArrive" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>按采购单审核通过的时间计算</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            选择“按采购单审核通过的时间计算”，预计到货时间 = 采购单审核通过的时间 + 到货天数
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 12. 是否自动更新线下采购单物流跟踪信息 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">是否自动更新线下采购单<br/>物流跟踪信息：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="autoTrack" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>启用</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="autoTrack" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>停用</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            启用后，系统会针对线下的采购订单，自动抓取物流跟踪信息（需要维护采购单的物流方式和物流单号）
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 13. 采购单导入生成规则设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">采购单导入生成规则设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            {['供应商', '仓库', '采购类型', '快递单号', '币种', '自定义单号', '主SKU'].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            启用后，导入添加采购单时系统会根据供应商、仓库、采购类型、快递单号、币种、自定义单号、主SKU、维度去生成采购单；
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 14. 最新采购价修改设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">最新采购价修改设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="latestPrice" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>审批通过修改</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="latestPrice" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>入库修改</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="latestPrice" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>不修改</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            1.勾选审核通过修改,当采购单被完全审核通过后,同步修改库存SKU的最新采购价。<br/>
            2.勾选入库修改,当采购单在操作入库完成后,同步修改库存SKU的最新采购价。<br/>
            3.勾选不修改,则不更新库存SKU的最新采购价。
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 15. 采购单导入商品自动关联供应商 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">采购单导入商品<br/>自动关联供应商：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="autoLinkSupplier" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>开启</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="autoLinkSupplier" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>关闭</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            开启后，如果填写的供应商未与商品关联，则系统会自动进行关联；<br/>
            关闭后，如果填写的供应商未与商品关联，则会导入报错。
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 16. 按库存SKU/主SKU/缺货商品搜索是否展示全部商品 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">按库存SKU/主SKU/缺货商品<br/>搜索是否展示全部商品：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="searchAll" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>是</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="searchAll" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>否</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            勾选是，按库存SKU/主SKU/缺货商品搜索时，搜索的结果展示所有采购商品；<br/>
            反之则仅展示搜索的库存SKU
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 17. 序列号生成规则设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">序列号生成规则设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked disabled className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 opacity-50" />
              <span>采购单</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>库存SKU</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            采购单，序列号生成规则：采购单_自增长数字000001；<br/>
            采购单+库存SKU，序列号生成规则：采购单_库存SKU_自增长数字000001
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 18. 自动变更异常设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">自动变更异常设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked disabled className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 opacity-50" />
              <span>有损耗</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>超量入库</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            有损耗：勾选‘有损耗’后，当采购单的库存SKU有一个存在损耗入库并且所有库存SKU均入库完毕时，将采购单状态变更为异常；<br/>
            超量入库：勾选‘超量入库’后，当采购单的库存SKU有一个存在超量入库（同一个库存SKU入库量+损耗量&gt;采购量时）并且所有库存SKU均入库完毕时，将采购单状态变更为异常；
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 19. 同一采购单多个自定义分类设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">同一采购单多个<br/>自定义分类设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="multiCategory" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>单个</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="multiCategory" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>多个</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            勾选单个时，则每个采购单仅支持设置一个自定义分类；勾选多个时，则每个采购单支持设置多个自定义分类；
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 20. 已完成状态是否允许编辑采购单设置 */}
      <div className="flex gap-4 items-center">
        <div className="w-32 text-right shrink-0">已完成状态是否允许<br/>编辑采购单设置：</div>
        <div className="flex-1 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="editCompleted" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
            <span>是</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="editCompleted" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
            <span>否</span>
          </label>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 21. 待审核状态是否允许编辑采购单设置 */}
      <div className="flex gap-4 items-center">
        <div className="w-32 text-right shrink-0">待审核状态是否允许<br/>编辑采购单设置：</div>
        <div className="flex-1 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="editPending" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
            <span>是</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="editPending" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
            <span>否</span>
          </label>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 22. 修改供应商同步到出入库流水设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">修改供应商同步到<br/>出入库流水设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="syncSupplier" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>是</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="syncSupplier" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>否</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            勾选是时，针对部分入库和已完成状态的采购单修改供应商后同步修改出入库流水的供应商；<br/>
            勾选否时，则不执行同步修改出入库流水的供应商；
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 23. 采购单自定义单号是否允许重复 */}
      <div className="flex gap-4 items-start">
        <div className="w-32 text-right shrink-0 py-1">采购单自定义单号<br/>是否允许重复：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="duplicateCustomNo" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>是</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="duplicateCustomNo" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>否</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] leading-relaxed mt-1">
            勾选是时，创建、编辑采购单自定义单号时自定义单号允许重复；<br/>
            勾选否时，创建、编辑采购单自定义单号时自定义单号不允许重复；
          </div>
        </div>
      </div>

    </div>
  );
}