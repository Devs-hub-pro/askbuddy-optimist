
import React, { useState } from 'react';
import { Home, Compass, Plus, MessageSquare, User, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useUnreadMessageCount } from '@/hooks/useMessages';
import { isNativeApp } from '@/utils/platform';
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { buildFromState } from '@/utils/navigation';

const HOME_TAB_PREFIXES = ['/education', '/career', '/lifestyle', '/hobbies', '/search', '/topic'];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: unreadNotifCount } = useUnreadCount();
  const { count: unreadMessageCount } = useUnreadMessageCount();
  const nativeMode = isNativeApp();
  const unreadCount = (unreadNotifCount || 0) + (unreadMessageCount || 0);
  const dispatchTabReselect = (path: string) => {
    window.dispatchEvent(new CustomEvent('app:tab-reselect', { detail: { path } }));
  };

  const belongsToTab = (path: string) => {
    if (path === '/') {
      return currentPath === '/' || HOME_TAB_PREFIXES.some((prefix) => currentPath.startsWith(prefix));
    }
    if (path === '/discover') {
      return currentPath === '/discover' || currentPath.startsWith('/discover/');
    }
    if (path === '/messages') {
      return currentPath === '/messages' || currentPath.startsWith('/notifications') || currentPath.startsWith('/chat/');
    }
    if (path === '/profile') {
      return currentPath === '/profile' || currentPath.startsWith('/profile/') || currentPath.startsWith('/settings/');
    }
    return currentPath === path;
  };

  const isRootRouteOfTab = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path;
  };

  const navigateOrScrollTop = (path: string) => {
    if (isRootRouteOfTab(path)) {
      dispatchTabReselect(path);
      return;
    }
    navigate(path, { state: buildFromState(location) });
  };

  const handleNeedClick = () => {
    setIsMenuOpen(false);
    navigate('/new', { state: buildFromState(location) });
  };

  const handleSkillClick = () => {
    setIsMenuOpen(false);
    navigate('/skill-publish', { state: buildFromState(location) });
  };

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] ${
        nativeMode ? '' : 'max-w-md mx-auto'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-14">
        <button 
          onClick={() => navigateOrScrollTop('/')}
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 ${belongsToTab('/') ? 'active' : ''}`}
        >
          <Home size={20} className={belongsToTab('/') ? "text-primary" : "text-muted-foreground"} />
          <span className={`text-[10px] mt-0.5 ${belongsToTab('/') ? "text-primary font-medium" : "text-muted-foreground"}`}>首页</span>
        </button>
        
        <button 
          onClick={() => navigateOrScrollTop('/discover')}
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 ${belongsToTab('/discover') ? 'active' : ''}`}
        >
          <Compass size={20} className={belongsToTab('/discover') ? "text-primary" : "text-muted-foreground"} />
          <span className={`text-[10px] mt-0.5 ${belongsToTab('/discover') ? "text-primary font-medium" : "text-muted-foreground"}`}>发现</span>
        </button>
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button className="w-1/5 flex flex-col items-center justify-center -mt-6" aria-label="发布">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                <Plus size={22} className="text-primary-foreground" />
              </div>
              <span className="text-[10px] mt-0.5 text-muted-foreground font-medium">发布</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="pt-0 px-0 pb-8 rounded-t-3xl">
            <div className="flex flex-col items-center pt-8 pb-4 gap-4">
              <Button 
                onClick={handleNeedClick}
                className="w-4/5 h-12 text-base rounded-full"
              >
                <MessageSquare size={18} className="mr-2" />
                我有需求
              </Button>
              
              <Button 
                onClick={handleSkillClick}
                variant="secondary"
                className="w-4/5 h-12 text-base rounded-full"
              >
                <Star size={18} className="mr-2" />
                我有技能
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        <button 
          onClick={() => navigateOrScrollTop('/messages')}
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 relative ${belongsToTab('/messages') ? 'active' : ''}`}
        >
          <div className="relative">
            <MessageSquare size={20} className={belongsToTab('/messages') ? "text-primary" : "text-muted-foreground"} />
            {(unreadCount || 0) > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center px-1">
                {(unreadCount || 0) > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-0.5 ${belongsToTab('/messages') ? "text-primary font-medium" : "text-muted-foreground"}`}>消息</span>
        </button>
        
        <button 
          onClick={() => navigateOrScrollTop('/profile')}
          className={`nav-item flex flex-col items-center justify-center w-1/5 py-1 ${belongsToTab('/profile') ? 'active' : ''}`}
        >
          <User size={20} className={belongsToTab('/profile') ? "text-primary" : "text-muted-foreground"} />
          <span className={`text-[10px] mt-0.5 ${belongsToTab('/profile') ? "text-primary font-medium" : "text-muted-foreground"}`}>我的</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
