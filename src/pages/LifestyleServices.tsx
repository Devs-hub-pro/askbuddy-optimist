
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
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
  Bell,
  MessageSquare,
  Eye,
  Package,
  PlusCircle
} from 'lucide-react';
import SearchBar from "@/components/SearchBar";
import QuestionCard from '@/components/QuestionCard';

const LifestyleServices = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('housing'); // Default active category
  const categoryRef = useRef<HTMLDivElement>(null);
  const [showRightIndicator, setShowRightIndicator] = useState(false);

  // Simulate loading content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Check for horizontal scroll
  useEffect(() => {
    const checkScroll = () => {
      if (categoryRef.current) {
        const { scrollWidth, clientWidth } = categoryRef.current;
        setShowRightIndicator(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoryRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
      id: "1",
      title: '租房避坑指南',
      description: '合同签订注意事项和维权技巧',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tag: '租房',
      icon: <Home size={14} />
    },
    {
      id: "2",
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
      id: "1",
      name: '王律师',
      title: '劳动法专家',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      description: '专注于劳动法、合同纠纷，5年执业经验',
      badge: '律师认证',
      category: 'legal',
      tags: ['劳动法', '合同', '纠纷'],
      rating: 4.9,
      responseRate: '98%',
      orderCount: '126单'
    },
    {
      id: "2",
      name: '林咨询师',
      title: '情感心理专家',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      description: '婚恋关系、亲子关系咨询，执业8年',
      badge: '心理师认证',
      category: 'emotional',
      tags: ['情感', '心理', '婚恋'],
      rating: 4.8,
      responseRate: '95%',
      orderCount: '210单'
    },
    {
      id: "3",
      name: '张先生',
      title: '租房达人',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      description: '10年租房经验，帮助过200+人解决租房问题',
      badge: '达人认证',
      category: 'housing',
      tags: ['租房', '合同', '维权'],
      rating: 4.7,
      responseRate: '92%',
      orderCount: '185单'
    },
    {
      id: "4",
      name: '李顾问',
      title: '保险规划师',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      description: '专注于个人、家庭保险规划，擅长理赔指导',
      badge: '顾问认证',
      category: 'insurance',
      tags: ['保险', '理赔', '规划'],
      rating: 4.6,
      responseRate: '90%',
      orderCount: '98单'
    },
    {
      id: "5",
      name: '郑先生',
      title: '移民顾问',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      description: '5年海外留学与移民经验，擅长澳洲和加拿大',
      badge: '顾问认证',
      category: 'overseas',
      tags: ['移民', '留学', '海外生活'],
      rating: 4.5,
      responseRate: '96%',
      orderCount: '156单'
    }
  ];

  // Questions that users are asking
  const communityQuestions = [
    {
      id: "1",
      title: '租房合同中哪些条款需要特别注意？',
      description: '我即将签订一份租房合同，听说有很多陷阱，想请教有经验的人都需要注意哪些条款？',
      user: {
        name: '小明',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
      },
      time: '2小时前',
      tags: ['租房', '合同', '法律'],
      answers: 12,
      viewCount: '1.2k',
      points: 50,
      category: 'housing'
    },
    {
      id: "2",
      title: '如何处理与房东的纠纷？押金不退怎么办？',
      description: '我搬出去一个月了，房东以各种理由不退押金，该怎么维权？',
      user: {
        name: '小红',
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
      },
      time: '4小时前',
      tags: ['租房', '押金', '维权'],
      answers: 8,
      viewCount: '896',
      points: 35,
      category: 'housing'
    },
    {
      id: "3",
      title: '异地恋三年，如何保持感情新鲜？',
      description: '我和男友异地三年了，最近感觉有点倦怠，有什么方法可以让感情保持活力？',
      user: {
        name: '小华',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
      },
      time: '1天前',
      tags: ['情感', '异地恋', '关系维护'],
      answers: 15,
      viewCount: '2.1k',
      points: 45,
      category: 'emotional'
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

  // Filter questions based on selected category
  const filteredQuestions = activeCategory === 'all'
    ? communityQuestions
    : communityQuestions.filter(question => question.category === activeCategory);

  const handleViewQuestionDetail = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handleViewExpertProfile = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-orange-50/30 pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-app-orange shadow-sm animate-fade-in">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate('/')} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base ml-2">生活服务</div>
          <div className="flex-1"></div>
          <button className="text-white">
            <Bell size={20} />
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 py-3 bg-app-light-bg">
        <SearchBar placeholder="搜索问题/达人/话题" />
      </div>
      
      {/* Exam Countdown */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Calendar size={18} className="text-orange-600 mr-2" />
              <h3 className="font-medium text-sm">重要日期提醒</h3>
            </div>
            <button 
              className="flex items-center text-xs text-orange-600 bg-white rounded-full px-2 py-1 shadow-sm"
            >
              <PlusCircle size={12} className="mr-1" />
              <span>添加日程</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {importantDates.map((item, index) => {
              const eventDate = new Date(item.date);
              const formattedDate = `${eventDate.getMonth() + 1}月${eventDate.getDate()}日`;
              
              return (
                <div key={index} className="flex items-center justify-between bg-white rounded-md p-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{item.event}</span>
                    <span className="text-xs text-gray-500">{formattedDate}</span>
                  </div>
                  <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {daysRemaining}天
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Category Tags */}
      <div className="px-4 mb-4 relative">
        <div className="relative">
          {showRightIndicator && (
            <button 
              onClick={() => scrollCategories('right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full shadow-md z-10 p-1 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          )}
          
          <ScrollArea className="w-full" orientation="horizontal">
            <div 
              ref={categoryRef}
              className="flex space-x-2 pb-2 pr-4"
              style={{ minWidth: "100%" }}
            >
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className={`flex-shrink-0 ${activeCategory === category.id ? 'bg-orange-500 text-white' : 'bg-white shadow-sm'} rounded-full px-3 py-1.5 flex items-center gap-1 cursor-pointer transition-colors`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon}
                  <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
                        </div>
                      </div>
                      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        <div className="h-4 bg-gray-200 rounded-full w-12"></div>
                        <div className="h-4 bg-gray-200 rounded-full w-12"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <div 
                    key={question.id} 
                    className="cursor-pointer" 
                    onClick={() => handleViewQuestionDetail(question.id)}
                  >
                    <QuestionCard
                      id={question.id}
                      title={question.title}
                      description={question.description}
                      asker={question.user}
                      time={question.time}
                      tags={question.tags}
                      points={question.points}
                      viewCount={question.viewCount}
                      delay={0.3 + index * 0.1}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="experts" className="mt-0">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
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
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExperts.map((expert) => (
                  <div 
                    key={expert.id}
                    className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleViewExpertProfile(expert.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-10 h-10 border border-orange-50">
                          <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                          <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800">{expert.name}</h3>
                          <p className="text-xs text-orange-600">{expert.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-yellow-500 gap-1">
                          <Award size={12} />
                          <span className="text-xs font-medium">{expert.rating}</span>
                        </div>
                        <div className="flex items-center text-orange-500 gap-1 text-xs">
                          <Clock size={10} />
                          <span>{expert.responseRate}</span>
                        </div>
                        <div className="flex items-center text-orange-500 gap-1 text-xs">
                          <Package size={10} />
                          <span>{expert.orderCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex mt-2">
                      <p className="text-xs text-gray-700 border-l-2 border-orange-200 pl-2 py-0.5 bg-orange-50/50 rounded-r-md flex-1 mr-2 line-clamp-2">
                        {expert.description}
                      </p>
                      
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/expert-profile/${expert.id}`);
                        }}
                        className="bg-gradient-to-r from-orange-500 to-amber-400 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 h-auto"
                      >
                        <MessageSquare size={10} />
                        找我问问
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {expert.tags.map((tag, index) => (
                        <span key={index} className="bg-orange-50 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating Ask Button */}
      <button className="fixed bottom-20 right-4 bg-gradient-to-r from-app-orange to-amber-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default LifestyleServices;

