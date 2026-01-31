import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Heart,
  Users,
  FileText,
  Award,
  Star,
  User,
  List,
  MessageSquareText,
  UserPlus,
  Coins,
  Edit3,
  LogOut,
  Loader2,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';
import SettingsMenu from '@/components/profile/SettingsMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
    toast({ title: '已退出登录' });
  };

  // Define menu sections
  const profileFeatures = [
    { icon: <List size={22} className="text-primary" />, label: '我的订单', route: '/profile/orders', count: 0 },
    { icon: <MessageSquareText size={22} className="text-green-500" />, label: '我的回答', route: '/profile/answers', count: 0 },
    { icon: <Heart size={22} className="text-red-500" />, label: '我的收藏', route: '/profile/favorites', count: 0 },
    { icon: <Users size={22} className="text-purple-500" />, label: '我的关注', route: '/profile/following', count: 0 },
  ];
  
  const commonFeatures = [
    { icon: <Coins size={22} className="text-amber-500" />, label: '我的收益', route: '/profile/earnings' },
    { icon: <UserPlus size={22} className="text-indigo-500" />, label: '我的社群', route: '/profile/community' },
    { icon: <FileText size={22} className="text-primary" />, label: '草稿箱', route: '/profile/drafts' },
    { icon: <Award size={22} className="text-orange-500" />, label: '达人认证', route: '/profile/talent-certification' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted pb-20">
      {/* Settings Menu */}
      <SettingsMenu 
        isOpen={showSettingsMenu} 
        onClose={() => setShowSettingsMenu(false)} 
      />

      {/* Header with Settings Button */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground pt-14 pb-8 px-4 rounded-b-3xl shadow-md relative" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 3.5rem)' }}>
        {/* Settings button at top right */}
        <div className="absolute right-4 top-6" style={{ top: 'calc(env(safe-area-inset-top) + 0.5rem)' }}>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            onClick={() => setShowSettingsMenu(true)}
          >
            <Settings size={24} />
          </Button>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center">
            <Avatar className="h-20 w-20 border-2 border-primary-foreground ring-2 ring-primary-foreground/30 shadow-lg">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.nickname || '用户'} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xl">
                {profile?.nickname?.charAt(0) || '用'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <h2 className="text-xl font-bold">{profile?.nickname || '新用户'}</h2>
                </div>
                <div className="flex items-center text-sm mb-3 space-x-2">
                  <div className="flex items-center bg-primary-foreground/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <Star size={12} className="mr-1" />
                    <span>{profile?.points_balance || 0} 积分</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/30 hover:text-primary-foreground w-fit flex items-center gap-1.5"
                    onClick={() => navigate('/edit-profile')}
                  >
                    <Edit3 size={14} />
                    编辑资料
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/30 hover:text-primary-foreground w-fit flex items-center gap-1.5"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                    退出
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <Avatar className="h-20 w-20 mb-3 border-2 border-primary-foreground/50">
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                <User size={32} />
              </AvatarFallback>
            </Avatar>
            <Button 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8"
              onClick={() => navigate('/auth')}
            >
              登录 / 注册
            </Button>
          </div>
        )}
      </div>

      {/* User Stats */}
      <div className="px-4 -mt-6">
        <Card className="border-none shadow-lg overflow-hidden rounded-xl">
          <CardContent className="p-0">
            <div className="grid grid-cols-4">
              {profileFeatures.map((item, index) => (
                <div 
                  key={`stat-${index}`}
                  className={`flex flex-col items-center py-4 cursor-pointer hover:bg-muted transition-colors ${index < profileFeatures.length - 1 ? 'border-r border-border' : ''}`}
                  onClick={() => isLoggedIn ? navigate(item.route) : navigate('/auth')}
                >
                  <span className="text-lg font-semibold mb-1 text-foreground">
                    {item.count}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.label.replace('我的', '')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="px-4 mt-6 space-y-5">
        {/* Common Features Section */}
        <Card className="border-none shadow-sm overflow-hidden rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-base font-medium mb-4 text-left flex items-center">
              <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                <Star size={16} className="text-primary" />
              </span>
              常用功能
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {commonFeatures.map((item, index) => (
                <div 
                  key={`common-${index}`} 
                  className="flex flex-col items-center justify-center py-3 cursor-pointer hover:bg-muted rounded-xl transition-colors"
                  onClick={() => isLoggedIn ? navigate(item.route) : navigate('/auth')}
                >
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2 shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-xs text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Profile;
