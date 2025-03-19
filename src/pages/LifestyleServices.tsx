
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Home, 
  ChevronLeft, 
  MessageCircle, 
  Star, 
  ChevronRight, 
  Briefcase, 
  Globe, 
  Umbrella, 
  Plus, 
  Clock, 
  Award, 
  User, 
  UserCheck, 
  Search, 
  Calendar,
  PlusCircle
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const LifestyleServices = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('housing'); // Default active category

  // Simulate loading content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Categories for Life Services
  const categories = [
    { id: 'housing', name: '租房', icon: <Home size={16} /> },
    { id: 'legal', name: '法律', icon: <Briefcase size={16} /> },
    { id: 'emotional', name: '情感', icon: <Heart size={16} /> },
    { id: 'insurance', name: '保险', icon: <Umbrella size={16} /> },
    { id: 'overseas', name: '海外生活', icon: <Globe size={16} /> },
  ];

  // Featured recommendations
  const featuredRecommendations = [
    {
      id: 1,
      title: '租房避坑指南',
      description: '合同签订注意事项和维权技巧',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tag: '租房',
      icon: <Home size={14} />
    },
    {
      id: 2,
      title: '劳动合同纠纷，你该怎么做？',
      description: '专业律师解读劳动法',
      image: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tag: '法律',
      icon: <Briefcase size={14} />
    }
  ];

  // Expert recommendations
  const experts = [
    {
      id: 1,
      name: '王律师',
      title: '劳动法专家',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      description: '专注于劳动法、合同纠纷，5年执业经验',
      badge: '律师认证',
      category: 'legal',
      tags: ['劳动法', '合同', '纠纷']
    },
    {
      id: 2,
      name: '林咨询师',
      title: '情感心理专家',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      description: '婚恋关系、亲子关系咨询，执业8年',
      badge: '心理师认证',
      category: 'emotional',
      tags: ['情感', '心理', '婚恋']
    },
    {
      id: 3,
      name: '张先生',
      title: '租房达人',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      description: '10年租房经验，帮助过200+人解决租房问题',
      badge: '达人认证',
      category: 'housing',
      tags: ['租房', '合同', '维权']
    },
    {
      id: 4,
      name: '李顾问',
      title: '保险规划师',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      description: '专注于个人、家庭保险规划，擅长理赔指导',
      badge: '顾问认证',
      category: 'insurance',
      tags: ['保险', '理赔', '规划']
    },
    {
      id: 5,
      name: '郑先生',
      title: '移民顾问',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      description: '5年海外留学与移民经验，擅长澳洲和加拿大',
      badge: '顾问认证',
      category: 'overseas',
      tags: ['移民', '留学', '海外生活']
    }
  ];

  // Questions that users are asking
  const communityQuestions = [
    {
      id: 1,
      title: '租房合同中哪些条款需要特别注意？',
      description: '我即将签订一份租房合同，听说有很多陷阱，想请教有经验的人都需要注意哪些条款？',
      user: {
        name: '小明',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
      },
      tags: ['租房', '合同', '法律'],
      answers: 12,
      points: 50,
      viewCount: 1243
    },
    {
      id: 2,
      title: '如何处理与房东的纠纷？押金不退怎么办？',
      description: '我搬出去一个月了，房东以各种理由不退押金，该怎么维权？',
      user: {
        name: '小红',
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
      },
      tags: ['租房', '押金', '维权'],
      answers: 8,
      points: 35,
      viewCount: 896
    },
    {
      id: 3,
      title: '异地恋三年，如何保持感情新鲜？',
      description: '我和男友异地三年了，最近感觉有点倦怠，有什么方法可以让感情保持活力？',
      user: {
        name: '小华',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
      },
      tags: ['情感', '异地恋', '关系维护'],
      answers: 15,
      points: 45,
      viewCount: 2156
    }
  ];

  // Important dates
  const importantDates = [
    { date: '2024-11-15', event: '租房法规解读线上讲座' },
    { date: '2024-12-01', event: '心理健康月活动开始' },
    { date: '2025-01-20', event: '海外移民政策变更' }
  ];

  // Countdown to the next major event
  const eventDate = new Date('2024-11-15');
  const today = new Date();
  const daysRemaining = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Filter experts based on selected category
  const filteredExperts = activeCategory === 'all' 
    ? experts 
    : experts.filter(expert => expert.category === activeCategory);

  return (
    <div className="app-container bg-gradient-to-b from-white to-orange-50/30 pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-app-orange shadow-sm animate-fade-in">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate('/')} className="text-white mr-2">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base">生活服务</div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 py-4 bg-gradient-to-b from-app-orange/10 to-transparent">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索问题/达人/话题"
            className="search-input pr-10 focus:ring-2 focus:ring-app-orange/30 shadow-md"
          />
          <Search 
            size={18} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        </div>
      </div>
      
      {/* Exam Countdown */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 mb-4 flex items-center justify-between mx-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Clock size={18} className="text-orange-500 mr-2" />
          <span className="text-sm font-medium">讲座倒计时</span>
        </div>
        <div className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
          {daysRemaining}天
        </div>
      </div>
      
      {/* Category Tags */}
      <div className="px-4 mb-4 overflow-x-auto">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`flex-shrink-0 ${activeCategory === category.id ? 'bg-orange-500 text-white' : 'bg-white shadow-sm'} rounded-full px-3 py-1.5 flex items-center gap-1 cursor-pointer`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              <span className="text-xs font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Important Dates */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center mb-3">
            <Calendar size={18} className="text-orange-600 mr-2" />
            <h3 className="font-medium text-sm">重要日期提醒</h3>
          </div>
          
          <div className="space-y-2">
            {importantDates.map((item, index) => {
              const eventDate = new Date(item.date);
              const formattedDate = `${eventDate.getMonth() + 1}月${eventDate.getDate()}日`;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs font-medium">{item.event}</span>
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                    {formattedDate}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Featured Content */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">精选推荐</h2>
          <span className="text-xs text-gray-500">更多 &gt;</span>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white rounded-lg p-4 animate-pulse-soft shadow-sm">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            featuredRecommendations.map((item) => (
              <Card key={item.id} className="shadow-sm hover:shadow transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-base">{item.title}</h3>
                    <div className="flex items-center text-gray-500 text-xs">
                      <span>2.4k 浏览</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-orange-50 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                      #{item.tag}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Senior Students Section (changed to experts) */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">推荐达人</h2>
          <span className="text-xs text-gray-500">更多 &gt;</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {isLoading ? (
            [1, 2].map((item) => (
              <div key={item} className="bg-white rounded-lg p-3 animate-pulse-soft shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-2"></div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))
          ) : (
            filteredExperts.map((expert) => (
              <Card key={expert.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center mb-2">
                    <img 
                      src={expert.avatar} 
                      alt={expert.name} 
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                      <p className="text-sm font-medium">{expert.name}</p>
                      <p className="text-xs text-gray-500">{expert.title}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 mb-2 line-clamp-2">{expert.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {expert.tags.map((tag, index) => (
                      <span key={index} className="bg-orange-50 text-orange-600 text-xs px-1.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Community Questions */}
      <div className="px-4 mb-6">
        <Tabs defaultValue="everyone" className="w-full">
          <div className="relative mb-6 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-gray-100">
            <TabsList className="w-full bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="everyone" 
                className="font-bold text-lg pb-2 relative data-[state=active]:text-app-text data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:text-gray-400"
              >
                大家都在问
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-orange to-amber-500 z-10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="experts" 
                className="font-bold text-lg pb-2 relative data-[state=active]:text-app-text data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:text-gray-400"
              >
                找TA问问
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-orange to-amber-500 z-10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="everyone" className="mt-0">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-lg p-4 animate-pulse-soft shadow-sm">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="flex space-x-2">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {communityQuestions.map((question) => (
                  <Card key={question.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base mb-2">{question.title}</h3>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{question.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags.map((tag, index) => (
                          <span key={index} className="bg-orange-50 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={question.user.avatar} 
                            alt={question.user.name} 
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-xs text-gray-600">{question.user.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{question.answers} 回答</span>
                          <div className="flex items-center text-yellow-600 text-xs">
                            <span className="bg-yellow-50 px-1.5 py-0.5 rounded-full">{question.points}积分</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="experts" className="mt-0">
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">寻找专业解答？</p>
              <p className="text-base font-medium text-orange-700 mb-3">我们有专业导师为您解答</p>
              <button className="bg-orange-600 text-white text-sm px-4 py-2 rounded-full shadow-sm">
                找专家问问
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating Ask Button */}
      <button className="fixed bottom-20 right-4 bg-gradient-to-r from-app-orange to-amber-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
        <Plus size={24} />
      </button>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default LifestyleServices;
