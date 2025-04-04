
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  MessageSquare,
  Heart,
  Users,
  FileText,
  Award,
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
  Coins,
  Eye,
  Folder,
  Lock,
  Edit3,
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
    { icon: <List size={22} className="text-app-blue" />, label: '我的订单', route: '/profile/orders' },
    { icon: <MessageSquareText size={22} className="text-app-green" />, label: '我的回答', route: '/profile/answers' },
    { icon: <Heart size={22} className="text-app-red" />, label: '我的收藏', route: '/profile/favorites' },
    { icon: <Users size={22} className="text-purple-500" />, label: '我的关注', route: '/profile/following' },
  ];
  
  const commonFeatures = [
    { icon: <Coins size={22} className="text-amber-500" />, label: '我的收益', route: '/profile/earnings' },
    { icon: <UserPlus size={22} className="text-indigo-500" />, label: '我的社群', route: '/profile/community' },
    { icon: <FileText size={22} className="text-app-teal" />, label: '草稿箱', route: '/profile/drafts' },
    { icon: <Award size={22} className="text-orange-500" />, label: '达人认证', route: '/profile/talent-certification' },
  ];

  // Settings menu items
  const settingsMenuItems = [
    { icon: <Lock size={20} className="text-gray-600" />, label: '账号与安全', route: '/settings/account' },
    { icon: <Settings size={20} className="text-gray-600" />, label: '通用设置', route: '/settings/general' },
    { icon: <Bell size={20} className="text-gray-600" />, label: '通知设置', route: '/settings/notifications' },
    { icon: <Eye size={20} className="text-gray-600" />, label: '隐私设置', route: '/settings/privacy' },
    { icon: <Folder size={20} className="text-gray-600" />, label: '存储空间', route: '/settings/storage' },
    { icon: <User size={20} className="text-gray-600" />, label: '内容偏好与调节', route: '/settings/content-preferences' },
    { icon: <HelpCircle size={20} className="text-gray-600" />, label: '帮助中心', route: '/settings/help' },
    { icon: <Shield size={20} className="text-gray-600" />, label: '问问规范', route: '/settings/guidelines' },
    { icon: <MessageSquare size={20} className="text-gray-600" />, label: '产品反馈', route: '/settings/feedback' },
    { icon: <Info size={20} className="text-gray-600" />, label: '关于我们', route: '/settings/about' },
  ];

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Settings Menu Overlay */}
      {showSettingsMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettingsMenu(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white shadow-xl overflow-y-auto animate-slide-in-right"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">设置</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettingsMenu(false)}
                className="hover:bg-gray-100"
              >
                <ChevronRight />
              </Button>
            </div>
            
            <div className="p-3">
              {settingsMenuItems.map((item, index) => (
                <div 
                  key={`setting-${index}`} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                  onClick={() => {
                    navigate(item.route);
                    setShowSettingsMenu(false);
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full mr-3">
                      {item.icon}
                    </div>
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header with Settings Button */}
      <div className="bg-gradient-to-r from-app-blue to-app-teal text-white pt-14 pb-8 px-4 rounded-b-3xl shadow-md relative">
        {/* Settings button at top right */}
        <div className="absolute right-4 top-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 transition-colors"
            onClick={() => setShowSettingsMenu(true)}
          >
            <Settings size={24} />
          </Button>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center">
            <Avatar className="h-22 w-22 border-2 border-white ring-2 ring-white/30 shadow-lg">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <Badge className="ml-2 bg-white/20 text-white border-none px-2 py-0.5 text-xs backdrop-blur-sm">
                    {userData.badge}
                  </Badge>
                </div>
                <div className="flex items-center text-sm mb-3 space-x-2">
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
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
                  className="bg-white/10 border-white/30 text-white hover:bg-white/30 hover:text-white w-fit flex items-center gap-1.5"
                  onClick={() => navigate('/edit-profile')}
                >
                  <Edit3 size={14} />
                  编辑资料
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Avatar className="h-20 w-20 mb-3 border-2 border-white/50">
              <AvatarFallback className="bg-white/20 text-white">
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
      <div className="px-4 -mt-6">
        <Card className="border-none shadow-lg overflow-hidden rounded-xl">
          <CardContent className="p-0">
            <div className="grid grid-cols-4">
              {profileFeatures.map((item, index) => (
                <div 
                  key={`stat-${index}`}
                  className={`flex flex-col items-center py-4 cursor-pointer hover:bg-gray-50 transition-colors ${index < profileFeatures.length - 1 ? 'border-r border-gray-100' : ''}`}
                  onClick={() => navigate(item.route)}
                >
                  <span className="text-lg font-semibold mb-1" style={{ color: index === 0 ? '#0D99FF' : index === 1 ? '#00C781' : index === 2 ? '#FF5A5F' : '#8B5CF6' }}>
                    {userData.stats[Object.keys(userData.stats)[index]]}
                  </span>
                  <span className="text-xs text-gray-500">{item.label.replace('我的', '')}</span>
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
              <span className="bg-app-blue/10 p-1.5 rounded-md mr-2">
                <Star size={16} className="text-app-blue" />
              </span>
              常用功能
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {commonFeatures.map((item, index) => (
                <div 
                  key={`common-${index}`} 
                  className="flex flex-col items-center justify-center py-3 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => navigate(item.route)}
                >
                  <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-2 shadow-sm">
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
