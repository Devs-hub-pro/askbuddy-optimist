
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Settings,
  Bell,
  Eye,
  Folder,
  User,
  HelpCircle,
  Shield,
  MessageSquare,
  Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const isDesktop = !useIsMobile();
  
  // Settings menu items with updated label
  const menuItems = [
    { icon: <Lock size={20} className="text-gray-600" />, label: '账号与安全', route: '/settings/account' },
    { icon: <Settings size={20} className="text-gray-600" />, label: '通用设置', route: '/settings/general' },
    { icon: <Bell size={20} className="text-gray-600" />, label: '通知设置', route: '/settings/notifications' },
    { icon: <Eye size={20} className="text-gray-600" />, label: '隐私设置', route: '/settings/privacy' },
    { icon: <Folder size={20} className="text-gray-600" />, label: '存储空间', route: '/settings/storage' },
    { icon: <User size={20} className="text-gray-600" />, label: '内容偏好与调节', route: '/settings/content-preferences' },
    { icon: <HelpCircle size={20} className="text-gray-600" />, label: '帮助中心', route: '/settings/help' },
    { icon: <Shield size={20} className="text-gray-600" />, label: '问问规范', route: '/settings/guidelines' },
    { icon: <MessageSquare size={20} className="text-gray-600" />, label: '用户体验调研', route: '/settings/user-research' },
    { icon: <Info size={20} className="text-gray-600" />, label: '关于我们', route: '/settings/about' },
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
    onClose();
  };

  // Content for both dialog and drawer
  const content = (
    <div className="p-3 min-h-screen bg-gray-50">
      <div className="border-b pb-3 mb-3">
        <h3 className="text-xl font-bold text-gray-800 px-3">设置</h3>
      </div>
      {menuItems.map((item, index) => (
        <div 
          key={`setting-${index}`} 
          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
          onClick={() => handleNavigate(item.route)}
        >
          <div className="flex items-center">
            <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full mr-3">
              {item.icon}
            </div>
            <span className="text-gray-700">{item.label}</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      ))}
    </div>
  );

  // Use Dialog for desktop and Drawer for mobile
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">设置</DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="bottom">
      <DrawerContent className="max-h-screen">
        <DrawerTitle className="sr-only">设置</DrawerTitle>
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {content}
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsMenu;

