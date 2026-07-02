import React from 'react';

export default function ThirdPartySettingsTab() {
  return (
    <div className="flex flex-col gap-6 text-[13px] text-gray-700 max-w-[800px] mx-auto pb-10">
      
      {/* 1. 是否更新运费 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">是否更新运费：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="updateFreight" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>启用</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="updateFreight" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>停用</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            停用后，将不拉取1688订单运费
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 2. 是否允许重复匹配1688商品属性 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">是否允许重复匹配<br/>1688商品属性：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="duplicate1688" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>允许</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="duplicate1688" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>不允许</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            勾选允许，代表允许不同的库存SKU匹配同一个1688商品子属性。如果此时一个1688采购单下有多个同1688商品的库存SKU，会导致这个采购单实付金额异常，故不建议勾选允许。
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 3. 第三方备注设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">第三方备注设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>采购单号</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>自定义备注</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>供应商备注</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>收货仓库名称</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>自定义单号</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>订单编号</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>采购商品备注</span>
            </label>
          </div>
          <textarea 
            className="w-full h-20 mt-2 p-2 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
            placeholder="不要发邮政"
            defaultValue="不要发邮政"
          />
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            勾选后，自动将备注填写到自动1688下单、淘供销创建采购单的备注框，支持拖动调整顺序
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 4. 是否同步1688备注 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">是否同步1688备注：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sync1688Note" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>启用</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sync1688Note" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>停用</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            启用后，将1688下单时的备注(买家留言)自动更新到采购订单备注中！
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 5. 更新1688价格设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">更新1688价格设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="update1688Price" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>1688优惠金额均摊到采购单价</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="update1688Price" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>自动更新1688优惠金额和采购单价</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="update1688Price" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>不更新</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            勾选（1688优惠金额均摊到采购单价）后，自动更新的采购单价 = 1688单价 - 单个SKU的1688优惠金额；<br/>
            勾选（自动更新1688优惠金额和采购单价）后，将1688优惠金额自动更新；<br/>
            勾选（不更新），不更新采购单价和1688优惠金额。
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 6. 更新淘供销价格设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">更新淘供销价格设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="updateTaobaoPrice" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>根据淘供销更新帮马采购单价</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="updateTaobaoPrice" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>不更新</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            勾选（根据淘供销更新帮马采购单价）后，自动更新的采购单价 = 淘供销商品采购金额 / 商品采购数量，同时更新第三方采购金额和运费；<br/>
            勾选（不更新），不更新采购单价，仅更新第三方采购金额和运费。
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 7. 是否开启1688多属性下单 */}
      <div className="flex gap-4 items-center">
        <div className="w-40 text-right shrink-0">是否开启1688多属性下单：</div>
        <div className="flex-1 flex items-center gap-4 bg-[#FDF6EC] p-3 rounded">
          {/* Mock switch */}
          <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-not-allowed opacity-50">
            <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-[#E6A23C] text-[12px]">什么是1688多属性下单？开启之后，无法关闭</span>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 8. 拼多多/淘宝同步订单信息设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">拼多多/淘宝同步订单<br/>信息设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-4 flex-wrap pt-2">
            {['状态', '总金额', '折扣', '物流信息', '运费', '采购单价'].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            勾选后,操作拼多多/淘宝的同步订单信息时,根据勾选项进行同步采购单信息
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 9. 旺旺跳转设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">旺旺跳转设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="wangwang" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>网页版</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="wangwang" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>客户端</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            勾选网页版，跳转到旺旺网页版；勾选客户端，平台逻辑会跳转到一个中间页面后再打开客户端
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 10. 红包抵扣使用设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">红包抵扣使用设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="redPacket" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>使用红包抵扣</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="redPacket" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>不使用红包抵扣</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            根据平台规定，使用红包抵扣无法使用跨境宝支付，不使用红包抵扣可以使用跨境宝支付；设置后创建1688采购单时是否使用红包抵扣将使用此设置项作为默认设置
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 11. 1688订单类型默认设置 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">1688订单类型默认设置：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="1688OrderType" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>分销价订单</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="1688OrderType" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>批发价订单</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="1688OrderType" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>最优下单方式</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="1688OrderType" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>伙拼价下单</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            1688采购单下单时，1688订单类型带出优先级：供应商1688订单类型设置→此设置项设置的订单类型；<br/>
            供应商1688订单类型设置路径：供应链--供应商管理--供应商详情--1688订单类型；<br/>
            根据平台规定，现仅有批发价支持使用PLUS会员价，分销价不支持使用PLUS会员价，详细信息 <span className="text-blue-500 cursor-pointer">点此了解</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      {/* 12. 拼多多多SKU自动拆单 */}
      <div className="flex gap-4 items-start">
        <div className="w-40 text-right shrink-0 py-1">拼多多多SKU自动拆单：</div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="pddSplit" defaultChecked className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>开启</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="pddSplit" className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
              <span>停用</span>
            </label>
          </div>
          <div className="text-[#E6A23C] text-[12px] bg-[#FDF6EC] p-3 rounded leading-relaxed mt-1">
            启用（推荐）：拼多多采购单下单或点击同步按钮后，系统会自动将多SKU的采购单拆分为多个单SKU采购单，分别对应拼多多的子订单<br/>
            停用：多SKU的采购单保持不变，不会自动拆单
          </div>
        </div>
      </div>

    </div>
  );
}