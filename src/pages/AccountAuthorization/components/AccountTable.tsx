import React, { useState } from 'react';
import { FeatureMarker } from '@/components/FeatureMarker';
import { Button } from '@/components/ui/button';
import { EditAccountModal } from './AccountModals';

interface AccountData {
  id: string;
  accountName: string;
  platformName: string;
  accountType: string;
  mainAccountName: string;
  expireTime: string;
  authStatus: string;
  status: string;
}

export function AccountTable({ platform }: { platform: string }) {
  const [data, setData] = useState<AccountData[]>([
    {
      id: '1',
      accountName: '停用-欢乐泡泡123',
      platformName: '欢乐泡泡123',
      accountType: '主账号',
      mainAccountName: '--',
      expireTime: '0000-00-00 00:00:00',
      authStatus: '授权无效',
      status: '停用',
    }
  ]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<AccountData | null>(null);

  const handleEdit = (acc: AccountData) => {
    setCurrentAccount(acc);
    setEditModalOpen(true);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: currentStatus === '启用' ? '停用' : '启用' };
      }
      return item;
    }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-center text-[13px] border-collapse bg-white">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="p-3 font-normal w-12 text-center border-r border-gray-100">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="p-3 font-normal border-r border-gray-100 text-left">账号名称</th>
              <th className="p-3 font-normal border-r border-gray-100">{platform}账号名称</th>
              <th className="p-3 font-normal border-r border-gray-100">账号类型</th>
              <th className="p-3 font-normal border-r border-gray-100">主账号名称</th>
              <th className="p-3 font-normal border-r border-gray-100">过期时间</th>
              <th className="p-3 font-normal border-r border-gray-100">授权状态</th>
              <th className="p-3 font-normal border-r border-gray-100">状态</th>
              <th className="p-3 font-normal w-[200px]">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-blue-50/30 group">
                <td className="p-3 text-center border-r border-gray-100">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="p-3 text-[#14C9C9] border-r border-gray-100 text-left">{item.accountName}</td>
                <td className="p-3 text-gray-800 border-r border-gray-100">{item.platformName}</td>
                <td className="p-3 text-gray-600 border-r border-gray-100">{item.accountType}</td>
                <td className="p-3 text-gray-600 border-r border-gray-100 text-center">{item.mainAccountName}</td>
                <td className="p-3 text-gray-600 border-r border-gray-100">{item.expireTime}</td>
                <td className="p-3 text-[#E46F6F] border-r border-gray-100">{item.authStatus}</td>
                <td className="p-3 text-[#E46F6F] border-r border-gray-100">{item.status}</td>
                <td className="p-3">
                  <div className="flex flex-col items-center justify-center gap-1 text-[12px] text-blue-500">
                    <div className="flex items-center gap-3">
                      <div className="cursor-pointer hover:underline text-blue-600">子账号授权</div>
                      <div className="cursor-pointer hover:underline text-blue-600" onClick={() => handleEdit(item)}>编辑</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div 
                        className={`cursor-pointer hover:underline ${item.status === '启用' ? 'text-[#E46F6F]' : 'text-[#8CC63F]'}`}
                        onClick={() => handleToggleStatus(item.id, item.status)}
                      >
                        {item.status === '启用' ? '停用' : '启用'}
                      </div>
                      <div className="text-[#8CC63F] cursor-pointer hover:underline">重新授权</div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && currentAccount && (
        <EditAccountModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          platform={platform}
          account={currentAccount}
          onSave={(updated) => {
            setData(prev => prev.map(item => item.id === currentAccount.id ? { ...item, ...updated } : item));
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
