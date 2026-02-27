
import React, { useState } from 'react';
import { Home, Compass, Plus, MessageSquare, User, Star, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUnreadCount } from '@/hooks/useNotifications';
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: unreadCount } = useUnreadCount();

  const handleNeedClick = () => {
    setIsMenuOpen(false);
    navigate('/new');
  };

  const handleSkillClick = () => {
    setIsMenuOpen(false);
    navigate('/skill-publish');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 max-w-md mx-auto shadow-[0_-2px_10px_rgba(0,0,0,0.06)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-14">
        <button 
          onClick={() => navigate('/')} 
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 ${currentPath === '/' ? 'active' : ''}`}
        >
          <Home size={20} className={currentPath === '/' ? "text-app-teal" : "text-gray-400"} />
          <span className={`text-[10px] mt-0.5 ${currentPath === '/' ? "text-app-teal font-medium" : "text-gray-500"}`}>首页</span>
        </button>
        
        <button 
          onClick={() => navigate('/discover')} 
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 ${currentPath === '/discover' ? 'active' : ''}`}
        >
          <Compass size={20} className={currentPath === '/discover' ? "text-app-teal" : "text-gray-400"} />
          <span className={`text-[10px] mt-0.5 ${currentPath === '/discover' ? "text-app-teal font-medium" : "text-gray-500"}`}>发现</span>
        </button>
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button className="w-1/5 flex flex-col items-center justify-center -mt-6">
              <div className="w-12 h-12 bg-gradient-to-br from-app-teal to-app-blue rounded-full flex items-center justify-center shadow-lg">
                <Plus size={22} className="text-white" />
              </div>
              <span className="text-[10px] mt-0.5 text-gray-600 font-medium">提问</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="pt-0 px-0 pb-8 rounded-t-3xl">
            <div className="flex flex-col items-center pt-8 pb-4 gap-4">
              <Button 
                onClick={handleNeedClick}
                className="w-4/5 h-12 text-base bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              >
                <MessageSquare size={18} className="mr-2" />
                我有需求
              </Button>
              
              <Button 
                onClick={handleSkillClick}
                className="w-4/5 h-12 text-base bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
              >
                <Star size={18} className="mr-2" />
                我有技能
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        <button 
          onClick={() => navigate('/messages')} 
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 relative ${currentPath === '/messages' ? 'active' : ''}`}
        >
          <div className="relative">
            <MessageSquare size={20} className={currentPath === '/messages' ? "text-app-teal" : "text-gray-400"} />
            {(unreadCount || 0) > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center px-1">
                {(unreadCount || 0) > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-0.5 ${currentPath === '/messages' ? "text-app-teal font-medium" : "text-gray-500"}`}>消息</span>
        </button>
        
        <button 
          onClick={() => navigate('/profile')} 
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 ${currentPath === '/profile' ? 'active' : ''}`}
        >
          <User size={20} className={currentPath === '/profile' ? "text-app-teal" : "text-gray-400"} />
          <span className={`text-[10px] mt-0.5 ${currentPath === '/profile' ? "text-app-teal font-medium" : "text-gray-500"}`}>我的</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
