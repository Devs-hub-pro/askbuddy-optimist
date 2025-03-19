
import React from 'react';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

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
        
        <button 
          onClick={() => navigate('/new')}  
          className="w-1/5 flex flex-col items-center justify-center transform -translate-y-5"
        >
          <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow hover:scale-105 transition-transform duration-200">
            <Plus size={24} className="text-white" />
          </div>
          <span className="text-xs mt-1 text-gray-700 font-medium">提问</span>
        </button>
        
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
