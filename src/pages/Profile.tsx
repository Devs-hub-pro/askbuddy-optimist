import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  FileText,
  MessageSquare,
  BookmarkCheck,
  Star,
  PieChart,
  Users,
  FileEdit,
  Award,
  HelpCircle,
  Info,
  Book,
  Inbox
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';

const Profile = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  // Mock user data
  const userData = {
    name: '用户昵称',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    points: '1200',
    tags: ['普通用户', '学生', '某某大学']
  };

  // Main features section
  const mainFeatures = [
    { icon: <FileText className="text-blue-500 w-7 h-7" />, label: '我的订单', route: '/my-orders' },
    { icon: <MessageSquare className="text-orange-500 w-7 h-7" />, label: '我的回答', route: '/my-answers' },
    { icon: <BookmarkCheck className="text-green-500 w-7 h-7" />, label: '我的收藏', route: '/my-favorites' },
    { icon: <Star className="text-pink-500 w-7 h-7" />, label: '我的关注', route: '/my-follows' }
  ];
  
  // Frequently used features
  const frequentFeatures = [
    { icon: <PieChart className="text-indigo-600 w-6 h-6" />, label: '我的收益', route: '/my-earnings' },
    { icon: <Users className="text-orange-500 w-6 h-6" />, label: '我的社群', route: '/my-communities' },
    { icon: <FileEdit className="text-teal-500 w-6 h-6" />, label: '草稿箱', route: '/my-drafts' },
    { icon: <Award className="text-cyan-500 w-6 h-6" />, label: '达人认证', route: '/verification' }
  ];

  // Other features
  const otherFeatures = [
    { icon: <HelpCircle className="text-yellow-500 w-6 h-6" />, label: '帮助中心', route: '/help-center' },
    { icon: <Book className="text-green-500 w-6 h-6" />, label: '平台规范', route: '/platform-rules' },
    { icon: <Inbox className="text-red-500 w-6 h-6" />, label: '产品反馈', route: '/feedback' },
    { icon: <Info className="text-blue-500 w-6 h-6" />, label: '关于我们', route: '/about-us' }
  ];

  const navigateToSettings = () => {
    // Navigate to settings page
    // For now, we'll just log this action
    console.log('Navigate to settings');
  };

  const navigateToEditProfile = () => {
    navigate('/profile/edit');
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header with Settings button in the top-right corner */}
      <div className="relative pt-6 pb-4 px-4 bg-gradient-to-r from-teal-400 to-cyan-400">
        <button 
          className="absolute top-6 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          onClick={navigateToSettings}
        >
          <Settings className="text-white" size={20} />
        </button>
        
        {/* Profile Card */}
        <Card className="mt-6 bg-white rounded-xl shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start">
              <Avatar className="h-20 w-20 border-2 border-teal-100">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                </div>
                <div className="text-gray-500 mt-1">积分: {userData.points}</div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {userData.tags.map((tag, index) => (
                    <div key={index} className="px-3 py-1 rounded-full bg-teal-500 text-white text-xs">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={navigateToEditProfile}
              className="w-full mt-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
            >
              编辑个人资料
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Features */}
      <Card className="mx-4 mt-4 border-none shadow-sm">
        <CardContent className="grid grid-cols-4 gap-2 p-4">
          {mainFeatures.map((feature, index) => (
            <div 
              key={`main-${index}`} 
              className="flex flex-col items-center justify-center py-3 cursor-pointer"
              onClick={() => navigate(feature.route)}
            >
              <div className="mb-2">
                {feature.icon}
              </div>
              <span className="text-sm">{feature.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* New User Benefits Banner */}
      <div className="mx-4 mt-4 relative overflow-hidden rounded-lg">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-5 py-4 text-white">
          <h3 className="text-lg font-semibold">点击新用户福利</h3>
        </div>
        <img 
          src="/lovable-uploads/2ec9ee9d-73e0-45e2-98fe-2c7d695c7b22.png" 
          alt="New User Benefits"
          className="w-full h-20 object-cover"
        />
      </div>

      {/* Frequently Used Features Section */}
      <div className="mx-4 mt-6">
        <h3 className="text-base font-medium mb-3 px-1">常用功能</h3>
        <div className="grid grid-cols-4 gap-3">
          {frequentFeatures.map((feature, index) => (
            <div 
              key={`frequent-${index}`}
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => navigate(feature.route)}
            >
              <div className="mb-2">{feature.icon}</div>
              <span className="text-xs text-center">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Other Features Section */}
      <div className="mx-4 mt-6 mb-20">
        <h3 className="text-base font-medium mb-3 px-1">其他功能</h3>
        <div className="grid grid-cols-4 gap-3">
          {otherFeatures.map((feature, index) => (
            <div 
              key={`other-${index}`}
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center cursor-pointer" 
              onClick={() => navigate(feature.route)}
            >
              <div className="mb-2">{feature.icon}</div>
              <span className="text-xs text-center">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Profile;
