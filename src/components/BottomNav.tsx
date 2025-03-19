
import React from 'react';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 max-w-md mx-auto shadow-soft">
      <div className="flex items-center justify-around h-16">
        <a href="/" className="nav-item active flex flex-col items-center justify-center w-1/5 py-1">
          <Home size={20} className="text-app-teal" />
          <span className="text-xs mt-1 text-app-teal font-medium">首页</span>
        </a>
        
        <a href="/discover" className="nav-item flex flex-col items-center justify-center w-1/5 py-1">
          <Compass size={20} className="text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">发现</span>
        </a>
        
        <a href="/new" className="w-1/5 flex flex-col items-center justify-center transform -translate-y-5">
          <div className="w-14 h-14 bg-app-teal rounded-full flex items-center justify-center shadow-lg">
            <Plus size={24} className="text-white" />
          </div>
          <span className="text-xs mt-1 text-app-teal font-medium">提问</span>
        </a>
        
        <a href="/messages" className="nav-item flex flex-col items-center justify-center w-1/5 py-1">
          <MessageSquare size={20} className="text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">消息</span>
        </a>
        
        <a href="/profile" className="nav-item flex flex-col items-center justify-center w-1/5 py-1">
          <User size={20} className="text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">我的</span>
        </a>
      </div>
    </nav>
  );
};

export default BottomNav;
