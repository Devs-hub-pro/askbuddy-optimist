
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  Home, 
  Briefcase, 
  Heart, 
  Umbrella, 
  Globe,
  Bell,
  CalendarPlus,
  MessageSquare,
  MessageCircle,
  Plus,
  Clock,
  Award,
  User,
  Users,
  Eye,
  ChevronRight
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import QuestionCard from '@/components/QuestionCard';
import { useQuestions } from '@/hooks/useQuestions';
import { useExperts } from '@/hooks/useExperts';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const LifestyleServices = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const categoryRef = useRef<HTMLDivElement>(null);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  
  const { data: questions, isLoading } = useQuestions('生活服务');
  const { data: dbExperts, isLoading: isLoadingExperts } = useExperts('生活服务');

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch { return '刚刚'; }
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

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

  const importantDates = [
    { date: '2024-11-15', event: '租房法规解读线上讲座', countdown: 45, type: 'housing' },
    { date: '2024-12-01', event: '心理健康月活动开始', countdown: 60, type: 'emotional' },
    { date: '2025-01-20', event: '海外移民政策变更', countdown: 110, type: 'overseas' },
    { date: '2024-12-15', event: '保险理赔案例分析会', countdown: 75, type: 'insurance' }
  ];

  const filteredDates = activeCategory === 'all' 
    ? importantDates 
    : importantDates.filter(date => date.type === activeCategory);

  const categories = [
    { id: 'all', name: '全部', icon: <Calendar size={16} /> },
    { id: 'housing', name: '租房', icon: <Home size={16} /> },
    { id: 'legal', name: '法律', icon: <Briefcase size={16} /> },
    { id: 'emotional', name: '情感', icon: <Heart size={16} /> },
    { id: 'insurance', name: '保险', icon: <Umbrella size={16} /> },
    { id: 'overseas', name: '海外生活', icon: <Globe size={16} /> }
  ];

  const allExperts = [
    {
      id: '1',
      name: '王律师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '劳动法专家',
      description: '专注于劳动法、合同纠纷，5年执业经验',
      tags: ['劳动法', '合同', '纠纷'],
      category: 'legal',
      rating: 4.8,
      responseRate: '95%',
      orderCount: '156单'
    },
    {
      id: '2',
      name: '林咨询师',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      title: '情感心理专家',
      description: '婚恋关系、亲子关系咨询，执业8年',
      tags: ['情感', '心理', '婚恋'],
      category: 'emotional',
      rating: 4.9,
      responseRate: '98%',
      orderCount: '203单'
    },
    {
      id: '3',
      name: '张先生',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      title: '租房达人',
      description: '10年租房经验，帮助过200+人解决租房问题',
      tags: ['租房', '合同', '维权'],
      category: 'housing',
      rating: 4.6,
      responseRate: '92%',
      orderCount: '127单'
    },
    {
      id: '4',
      name: '李顾问',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      title: '保险规划师',
      description: '专注于个人、家庭保险规划，擅长理赔指导',
      tags: ['保险', '理赔', '规划'],
      category: 'insurance',
      rating: 4.7,
      responseRate: '94%',
      orderCount: '185单'
    },
    {
      id: '5',
      name: '郑先生',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      title: '移民顾问',
      description: '5年海外留学与移民经验，擅长澳洲和加拿大',
      tags: ['移民', '留学', '海外生活'],
      category: 'overseas',
      rating: 4.5,
      responseRate: '90%',
      orderCount: '96单'
    },
    {
      id: '6',
      name: '赵房产',
      avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
      title: '房产经纪人',
      description: '8年房产经纪经验，专注北上广深一线城市租赁市场',
      tags: ['房产', '租赁', '买卖'],
      category: 'housing',
      rating: 4.8,
      responseRate: '96%',
      orderCount: '214单'
    }
  ];

  const mappedDbExperts = (dbExperts || []).map(e => ({
    id: e.id, name: e.nickname || '专家', avatar: e.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
    title: e.title, description: e.bio || '', tags: e.tags,
    category: e.category || '',
    rating: Number(e.rating), responseRate: `${e.response_rate}%`, orderCount: `${e.order_count}单`,
  }));

  const filteredExperts = mappedDbExperts.length > 0 ? mappedDbExperts : (
    activeCategory === 'all' ? allExperts : allExperts.filter(expert => expert.category === activeCategory)
  );

  const filteredQuestions = questions || [];

  const handleSearch = () => {
    console.log('Search initiated');
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    console.log(`Selected category: ${categoryId}`);
  };

  const handleAddDate = () => {
    console.log('Adding custom date');
  };

  const handleViewQuestionDetail = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handleViewExpertProfile = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-orange-50/30 pb-20">
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
      
      <div className="px-4 py-3 bg-app-light-bg">
        <SearchBar placeholder="搜索问题/达人/话题" />
      </div>
      
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Calendar size={18} className="text-orange-600 mr-2" />
              <h3 className="font-medium text-sm">重要日期日历</h3>
            </div>
            <button 
              className="flex items-center text-xs text-orange-600 bg-white rounded-full px-2 py-1 shadow-sm"
              onClick={handleAddDate}
            >
              <CalendarPlus size={12} className="mr-1" />
              <span>添加日程</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {filteredDates.map((item, index) => {
              const eventDate = new Date(item.date);
              const formattedDate = `${eventDate.getMonth() + 1}月${eventDate.getDate()}日`;
              
              return (
                <div key={index} className="flex items-center justify-between bg-white rounded-md p-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{item.event}</span>
                    <span className="text-xs text-gray-500">{formattedDate}</span>
                  </div>
                  <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.countdown}天
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
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
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.icon}
                  <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      
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
                  <QuestionCard
                    key={question.id}
                    id={question.id}
                    title={question.title}
                    description={question.content || undefined}
                    asker={{
                      name: question.profile_nickname || '匿名用户',
                      avatar: question.profile_avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'
                    }}
                    time={formatTime(question.created_at)}
                    tags={question.tags || []}
                    points={question.bounty_points}
                    viewCount={formatViewCount(question.view_count)}
                    delay={0.3 + index * 0.1}
                  />
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
                        <div className="flex items-center text-blue-500 gap-1 text-xs">
                          <Clock size={10} />
                          <span>{expert.responseRate}</span>
                        </div>
                        <div className="flex items-center text-green-500 gap-1 text-xs">
                          <Users size={10} />
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
      
      <button className="fixed bottom-20 right-4 bg-gradient-to-r from-app-orange to-amber-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default LifestyleServices;
