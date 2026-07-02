import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BasicSettingsTab from './settings/BasicSettingsTab';
import ThirdPartySettingsTab from './settings/ThirdPartySettingsTab';
import ApprovalSettingsTab from './settings/ApprovalSettingsTab';

interface PurchaseSettingsModalProps {
  onClose: () => void;
}

export default function PurchaseSettingsModal({ onClose }: PurchaseSettingsModalProps) {
  const [activeTab, setActiveTab] = useState('基础');
  const navigate = useNavigate();

  const tabs = [
    { id: '基础', label: '采购基础设置' },
    { id: '第三方', label: '第三方采购设置' },
    { id: '审批', label: '采购审批设置' },
    { id: '合同', label: '采购合同设置' }
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === '合同') {
      onClose();
      navigate('/contract-management');
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] h-[90vh] flex flex-col p-0 gap-0 bg-gray-50 overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-6">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`text-[15px] cursor-pointer pb-4 -mb-4 relative ${
                  activeTab === tab.id 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600"></div>
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-6">
          {activeTab === '基础' && <BasicSettingsTab />}
          {activeTab === '第三方' && <ThirdPartySettingsTab />}
          {activeTab === '审批' && <ApprovalSettingsTab />}
        </div>

        <div className="p-4 bg-white border-t border-gray-200 flex justify-center gap-4 shrink-0">
          <Button 
            className="w-24 h-8 bg-[#6B8EBE] hover:bg-[#5A7BA8] text-white"
            onClick={onClose}
          >
            确定
          </Button>
          <Button 
            variant="outline" 
            className="w-24 h-8"
            onClick={onClose}
          >
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}