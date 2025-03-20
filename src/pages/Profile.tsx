
import React, { useState } from 'react';
import {
  User,
  Settings,
  CreditCard,
  ShoppingBag,
  Heart,
  MessageSquare,
  Calendar,
  HelpCircle,
  Bell,
  ChevronRight,
  Award,
  Ticket,
  Gift,
  MapPin,
  Shield,
  Wallet,
  Star,
  FileText,
  BookOpen,
  Clock
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  // Mock user data
  const userData = {
    name: '张小明',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    level: '3',
    points: '520',
    questions: 12,
    answers: 5,
    favorites: 23
  };

  // Define menu sections
  const myServices = [
    { icon: <ShoppingBag size={20} className="text-blue-500" />, label: '我的订单', route: '/my-orders' },
    { icon: <Calendar size={20} className="text-green-500" />, label: '我的预约', route: '/my-appointments' },
    { icon: <Wallet size={20} className="text-purple-500" />, label: '我的钱包', route: '/my-wallet' },
    { icon: <Ticket size={20} className="text-orange-500" />, label: '我的优惠券', route: '/my-coupons' }
  ];
  
  const myContent = [
    { icon: <FileText size={20} className="text-indigo-500" />, label: '我的提问', route: '/my-questions' },
    { icon: <MessageSquare size={20} className="text-cyan-500" />, label: '我的回答', route: '/my-answers' },
    { icon: <Heart size={20} className="text-pink-500" />, label: '我的收藏', route: '/my-favorites' },
    { icon: <Clock size={20} className="text-amber-500" />, label: '浏览历史', route: '/my-history' }
  ];
  
  const settings = [
    { icon: <Shield size={20} className="text-blue-600" />, label: '账号安全', route: '/account-security' },
    { icon: <Bell size={20} className="text-yellow-500" />, label: '消息通知', route: '/notifications-settings' },
    { icon: <HelpCircle size={20} className="text-teal-500" />, label: '帮助中心', route: '/help-center' },
    { icon: <Settings size={20} className="text-gray-500" />, label: '设置', route: '/settings' }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
        {isLoggedIn ? (
          <div className="flex items-center">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <div 
                  className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-xs"
                  onClick={() => {/* Navigate to edit profile */}}
                >
                  <span>编辑资料</span>
                  <ChevronRight size={14} className="ml-1" />
                </div>
              </div>
              <div className="mt-1 text-sm flex items-center">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Award size={14} className="mr-1" />
                  <span>等级 {userData.level}</span>
                </div>
                <div className="flex items-center ml-3 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Star size={14} className="mr-1" />
                  <span>{userData.points} 积分</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between text-center">
                <div className="flex-1">
                  <div className="text-lg font-medium">{userData.questions}</div>
                  <div className="text-xs text-white/80">我的提问</div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium">{userData.answers}</div>
                  <div className="text-xs text-white/80">我的回答</div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium">{userData.favorites}</div>
                  <div className="text-xs text-white/80">我的收藏</div>
                </div>
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
            <Button className="bg-white text-blue-500 hover:bg-blue-50 px-8">
              登录 / 注册
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="px-4 mt-5 space-y-5">
        {/* My Services Section */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-3 text-left">我的服务</h3>
            <div className="grid grid-cols-4 gap-3">
              {myServices.map((item, index) => (
                <div 
                  key={`service-${index}`} 
                  className="flex flex-col items-center justify-center py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => {/* Navigate to route */}}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-1">
                    {item.icon}
                  </div>
                  <span className="text-xs text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Content Section */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-3 text-left">我的内容</h3>
            <div className="grid grid-cols-4 gap-3">
              {myContent.map((item, index) => (
                <div 
                  key={`content-${index}`} 
                  className="flex flex-col items-center justify-center py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => {/* Navigate to route */}}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-1">
                    {item.icon}
                  </div>
                  <span className="text-xs text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress Section */}
        <Card className="border-none shadow-sm bg-gradient-to-r from-blue-50 to-teal-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium text-left">学习进度</h3>
              <Button variant="link" size="sm" className="text-blue-500 p-0">
                查看全部
                <ChevronRight size={16} />
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Course Progress Cards */}
              <div className="bg-white rounded-xl p-3 shadow-sm flex items-center">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                  <BookOpen size={24} className="text-indigo-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">托福备考全攻略</span>
                    <span className="text-xs text-gray-500">75%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5">
                    <div className="h-full bg-indigo-500 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-3 shadow-sm flex items-center">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                  <BookOpen size={24} className="text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">出国留学申请指南</span>
                    <span className="text-xs text-gray-500">40%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5">
                    <div className="h-full bg-green-500 rounded-full" style={{width: '40%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expert Recommendations */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium text-left">推荐导师</h3>
              <Button variant="link" size="sm" className="text-blue-500 p-0">
                更多
                <ChevronRight size={16} />
              </Button>
            </div>
            
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div key={`expert-${item}`} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={`https://randomuser.me/api/portraits/${item % 2 ? 'women' : 'men'}/${20 + item}.jpg`} />
                    <AvatarFallback>E{item}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">王教授</span>
                      <span className="text-xs text-yellow-500 flex items-center">
                        <Star size={12} fill="currentColor" className="mr-0.5" />
                        4.9
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">北大硕士 | 留学规划师</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Section */}
        <Card className="border-none shadow-sm mb-20">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-3 text-left">设置</h3>
            
            <div className="space-y-1">
              {settings.map((item, index) => (
                <div 
                  key={`setting-${index}`}
                  className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => {/* Navigate to route */}}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3 text-sm">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
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
