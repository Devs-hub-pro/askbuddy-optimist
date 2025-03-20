
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  CreditCard,
  MessageSquare,
  Heart,
  Users,
  FileText,
  Award,
  Wallet,
  Star,
  ChevronRight,
  User,
  Shield,
  Bell,
  HelpCircle,
  Info,
  List,
  MessageSquareText,
  UserPlus,
  Coin,
  Eye,
  Folder,
  Lock,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';

const Profile = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  // Mock user data
  const userData = {
    name: '张小明',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    badge: '资深留学顾问',
    level: 'Lv.3',
    points: '520',
    stats: {
      orders: 12,
      answers: 5,
      favorites: 23,
      following: 8
    }
  };

  // Define menu sections
  const profileFeatures = [
    { icon: <List size={20} className="text-app-blue" />, label: '我的订单', route: '/profile/orders' },
    { icon: <MessageSquareText size={20} className="text-app-green" />, label: '我的回答', route: '/profile/answers' },
    { icon: <Heart size={20} className="text-app-red" />, label: '我的收藏', route: '/profile/favorites' },
    { icon: <Users size={20} className="text-purple-500" />, label: '我的关注', route: '/profile/following' },
  ];
  
  const commonFeatures = [
    { icon: <Coin size={20} className="text-amber-500" />, label: '我的收益', route: '/profile/earnings' },
    { icon: <UserPlus size={20} className="text-indigo-500" />, label: '我的社群', route: '/profile/community' },
    { icon: <FileText size={20} className="text-app-teal" />, label: '草稿箱', route: '/profile/drafts' },
    { icon: <Award size={20} className="text-orange-500" />, label: '达人认证', route: '/profile/talent-certification' },
  ];

  // Settings menu items
  const settingsMenuItems = [
    { icon: <Lock size={20} />, label: '账号与安全', route: '/settings/account' },
    { icon: <Settings size={20} />, label: '通用设置', route: '/settings/general' },
    { icon: <Bell size={20} />, label: '通知设置', route: '/settings/notifications' },
    { icon: <Eye size={20} />, label: '隐私设置', route: '/settings/privacy' },
    { icon: <Folder size={20} />, label: '存储空间', route: '/settings/storage' },
    { icon: <User size={20} />, label: '内容偏好与调节', route: '/settings/content-preferences' },
    { icon: <HelpCircle size={20} />, label: '帮助中心', route: '/settings/help' },
    { icon: <Shield size={20} />, label: '问问规范', route: '/settings/guidelines' },
    { icon: <MessageSquare size={20} />, label: '产品反馈', route: '/settings/feedback' },
    { icon: <Info size={20} />, label: '关于我们', route: '/settings/about' },
  ];

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  return (
    <div className="pb-20 min-h-screen bg-gray-50 relative">
      {/* Settings Menu Overlay */}
      {showSettingsMenu && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSettingsMenu(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white shadow-xl p-4 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">设置</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettingsMenu(false)}
              >
                <ChevronRight />
              </Button>
            </div>
            
            <div className="space-y-1">
              {settingsMenuItems.map((item, index) => (
                <div 
                  key={`setting-${index}`} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => {
                    navigate(item.route);
                    setShowSettingsMenu(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-600">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header with Settings Button */}
      <div className="bg-gradient-to-r from-app-blue to-app-teal text-white pt-14 pb-6 px-4 rounded-b-3xl shadow-md relative">
        {/* Settings button at top right */}
        <div className="absolute right-4 top-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setShowSettingsMenu(true)}
          >
            <Settings size={22} />
          </Button>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center">
            <Avatar className="h-20 w-20 border-2 border-white">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <Badge className="ml-2 bg-white/20 text-white border-none px-2 text-xs">
                    {userData.badge}
                  </Badge>
                </div>
                <div className="flex items-center text-sm mb-2">
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full mr-2">
                    {userData.level}
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <Star size={12} className="mr-1" />
                    <span>{userData.points} 积分</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/30 hover:text-white w-fit"
                  onClick={() => navigate('/edit-profile')}
                >
                  编辑资料
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarFallback>
                <User size={32} />
              </AvatarFallback>
            </Avatar>
            <Button className="bg-white text-app-blue hover:bg-blue-50 px-8">
              登录 / 注册
            </Button>
          </div>
        )}
      </div>

      {/* User Stats */}
      <div className="px-4 -mt-5">
        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-4 divide-x divide-gray-100">
              <div 
                className="flex flex-col items-center py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => navigate('/profile/orders')}
              >
                <span className="text-lg font-semibold text-app-blue">{userData.stats.orders}</span>
                <span className="text-xs text-gray-500">订单</span>
              </div>
              <div 
                className="flex flex-col items-center py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => navigate('/profile/answers')}
              >
                <span className="text-lg font-semibold text-app-green">{userData.stats.answers}</span>
                <span className="text-xs text-gray-500">回答</span>
              </div>
              <div 
                className="flex flex-col items-center py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => navigate('/profile/favorites')}
              >
                <span className="text-lg font-semibold text-app-red">{userData.stats.favorites}</span>
                <span className="text-xs text-gray-500">收藏</span>
              </div>
              <div 
                className="flex flex-col items-center py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => navigate('/profile/following')}
              >
                <span className="text-lg font-semibold text-purple-500">{userData.stats.following}</span>
                <span className="text-xs text-gray-500">关注</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="px-4 mt-5 space-y-4">
        {/* Profile Features Section */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-3">
              {profileFeatures.map((item, index) => (
                <div 
                  key={`feature-${index}`} 
                  className="flex flex-col items-center justify-center py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => navigate(item.route)}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                    {item.icon}
                  </div>
                  <span className="text-xs text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Features Section */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-3 text-left flex items-center">
              <span className="bg-app-blue/10 p-1.5 rounded-md mr-2">
                <Star size={16} className="text-app-blue" />
              </span>
              常用功能
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {commonFeatures.map((item, index) => (
                <div 
                  key={`common-${index}`} 
                  className="flex flex-col items-center justify-center py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => navigate(item.route)}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                    {item.icon}
                  </div>
                  <span className="text-xs text-gray-700">{item.label}</span>
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
