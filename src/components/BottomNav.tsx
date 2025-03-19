
import React from 'react';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 max-w-md mx-auto">
      <div className="flex items-center justify-around h-16">
        <a href="/" className="nav-item active">
          <Home size={20} />
          <span className="text-xs">首页</span>
        </a>
        
        <a href="/discover" className="nav-item">
          <Compass size={20} />
          <span className="text-xs">发现</span>
        </a>
        
        <a href="/new" className="transform -translate-y-5">
          <div className="w-14 h-14 bg-app-teal rounded-full flex items-center justify-center shadow-lg hover:bg-gradient-to-r hover:from-app-teal hover:to-app-blue transition-colors">
            <Plus size={24} className="text-white" />
          </div>
        </a>
        
        <a href="/messages" className="nav-item">
          <MessageSquare size={20} />
          <span className="text-xs">消息</span>
        </a>
        
        <a href="/profile" className="nav-item">
          <User size={20} />
          <span className="text-xs">我的</span>
        </a>
      </div>
    </nav>
  );
};

export default BottomNav;
