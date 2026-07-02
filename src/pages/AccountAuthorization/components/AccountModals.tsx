import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function EditAccountModal({ open, onOpenChange, platform, account, onSave }: { open: boolean, onOpenChange: (open: boolean) => void, platform: string, account: any, onSave: (data: any) => void }) {
  const [accountName, setAccountName] = useState(account?.accountName || '');
  const [employee, setEmployee] = useState('');
  const [defaultPurchaser, setDefaultPurchaser] = useState('');
  const [developer, setDeveloper] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] flex flex-col p-0 overflow-hidden bg-white rounded">
        <DialogHeader className="p-3 border-b border-gray-200 bg-[#F8FAFC] flex-shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-[14px] font-medium text-gray-800">编辑{platform}账号信息</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col bg-[#F8FAFC] p-6 gap-6">
          
          <div className="flex items-start">
            <div className="w-[120px] text-[13px] text-gray-700 pt-2 flex justify-end pr-4"><span className="text-red-500 mr-1">*</span>账号名称</div>
            <div className="flex-1">
              <Input 
                className="h-9 text-[13px] bg-white border-gray-300 focus-visible:ring-0" 
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-start border-t border-gray-200 pt-6">
            <div className="w-[120px] text-[13px] text-gray-700 pt-2 flex justify-end pr-4">请选择员工</div>
            <div className="flex-1 flex flex-col gap-2">
              <Select value={employee} onValueChange={setEmployee}>
                <SelectTrigger className="h-9 text-[13px] bg-white border-gray-300 w-[200px]">
                  <SelectValue placeholder="全部采购员  0 项" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">全部采购员  0 项</SelectItem>
                  <SelectItem value="1">张三</SelectItem>
                </SelectContent>
              </Select>
              <div className="h-20 bg-white border border-gray-300 rounded p-2"></div>
              <div className="text-[12px] text-red-500">
                只有设置的采购员才可以进行该账号进行{platform}下单操作；如果不设置采购员，则所有人员都可以使用该账号进行{platform}下单操作
              </div>
            </div>
          </div>

          <div className="flex items-start border-t border-gray-200 pt-6">
            <div className="w-[120px] text-[13px] text-gray-700 pt-2 flex justify-end pr-4">默认采购账号所属员工</div>
            <div className="flex-1 flex flex-col gap-2">
              <Select value={defaultPurchaser} onValueChange={setDefaultPurchaser}>
                <SelectTrigger className="h-9 text-[13px] bg-white border-gray-300 w-[200px]">
                  <SelectValue placeholder="请选择采购员  0 项" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">请选择采购员  0 项</SelectItem>
                  <SelectItem value="1">李四</SelectItem>
                </SelectContent>
              </Select>
              <div className="h-20 bg-white border border-gray-300 rounded p-2"></div>
              <div className="text-[12px] text-red-500">
                设置的采购员在进行{platform}采购下单时，{platform}账号会默认带出该账号；如果不设置，则按照创建最早的{platform}账号进行带出
              </div>
            </div>
          </div>

          <div className="flex items-start border-t border-gray-200 pt-6">
            <div className="w-[120px] text-[13px] text-gray-700 pt-2 flex justify-end pr-4">添加开发员</div>
            <div className="flex-1 flex flex-col gap-2">
              <Select value={developer} onValueChange={setDeveloper}>
                <SelectTrigger className="h-9 text-[13px] bg-white border-gray-300 w-[200px]">
                  <SelectValue placeholder="请选择员工" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">王五</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-[12px] text-red-500">
                * 设置好产品开发员后，在{platform}用该账号登录进行一键铺货时，产品将会被推送到该产品开发员账号下。
              </div>
            </div>
          </div>

        </div>
        
        <DialogFooter className="p-3 border-t border-gray-200 bg-[#F8FAFC] m-0 rounded-none sm:justify-end gap-2">
          <FeatureMarker title="保存" description="交互说明：校验表单数据并提交保存。">
          <Button 
            className="h-8 text-[13px] bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white font-normal px-6" 
            onClick={() => onSave({ accountName })}
          >
            保存
          </Button>
          </FeatureMarker>
          <FeatureMarker title="关闭" description="交互说明：放弃当前操作并关闭弹窗。">
<Button variant="outline" className="h-8 text-[13px] bg-white font-normal px-6 border-gray-300 text-gray-600" onClick={() => onOpenChange(false)}>关闭</Button>
</FeatureMarker>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}