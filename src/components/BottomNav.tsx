
import React, { useState } from 'react';
import { Home, Compass, Plus, MessageSquare, User, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
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

  const handleNeedClick = () => {
    setIsMenuOpen(false);
    navigate('/new');
  };

  const handleSkillClick = () => {
    setIsMenuOpen(false);
    navigate('/skill-publish');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 max-w-md mx-auto shadow-xl">
      <div className="flex items-center justify-around h-16">
        <button 
          onClick={() => navigate('/')} 
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 ${currentPath === '/' ? 'active' : ''}`}
        >
          <div className="relative">
            <Home size={20} className={currentPath === '/' ? "text-app-teal" : "text-gray-400"} />
            {currentPath === '/' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-app-teal rounded-full"></span>}
          </div>
          <span className={`text-xs mt-1 ${currentPath === '/' ? "text-app-teal font-medium" : "text-gray-500"}`}>首页</span>
        </button>
        
        <button 
          onClick={() => navigate('/discover')} 
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 ${currentPath === '/discover' ? 'active' : ''}`}
        >
          <Compass size={20} className={currentPath === '/discover' ? "text-app-teal" : "text-gray-400"} />
          <span className={`text-xs mt-1 ${currentPath === '/discover' ? "text-app-teal font-medium" : "text-gray-500"}`}>发现</span>
        </button>
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button className="w-1/5 flex flex-col items-center justify-center transform -translate-y-5">
              <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow hover:scale-105 transition-transform duration-200">
                <Plus size={24} className="text-white" />
              </div>
              <span className="text-xs mt-1 text-gray-700 font-medium">提问</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="pt-0 px-0 pb-8 rounded-t-3xl">
            <div className="flex flex-col items-center pt-8 pb-4 gap-6">
              <Button 
                onClick={handleNeedClick}
                className="w-4/5 h-14 text-lg bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              >
                <MessageSquare size={20} className="mr-2" />
                我有需求
              </Button>
              
              <Button 
                onClick={handleSkillClick}
                className="w-4/5 h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
              >
                <Star size={20} className="mr-2" />
                我有技能
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        <button 
          onClick={() => navigate('/messages')} 
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 relative ${currentPath === '/messages' ? 'active' : ''}`}
        >
          <MessageSquare size={20} className={currentPath === '/messages' ? "text-app-teal" : "text-gray-400"} />
          <span className="absolute -top-1 -right-3 w-2 h-2 bg-red-500 rounded-full"></span>
          <span className={`text-xs mt-1 ${currentPath === '/messages' ? "text-app-teal font-medium" : "text-gray-500"}`}>消息</span>
        </button>
        
        <button 
          onClick={() => navigate('/profile')} 
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 ${currentPath === '/profile' ? 'active' : ''}`}
        >
          <User size={20} className={currentPath === '/profile' ? "text-app-teal" : "text-gray-400"} />
          <span className={`text-xs mt-1 ${currentPath === '/profile' ? "text-app-teal font-medium" : "text-gray-500"}`}>我的</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
