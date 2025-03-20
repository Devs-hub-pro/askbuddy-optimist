
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  Search, 
  Camera, 
  Pen, 
  Music, 
  Video,
  Briefcase,
  Plus,
  Bell,
  CalendarPlus,
  MessageSquare,
  MessageCircle,
  Clock,
  Package,
  Eye,
  ChevronRight,
  Flame,
  Tag
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/SearchBar";
import QuestionCard from '@/components/QuestionCard';

const HobbiesSkills = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('side-hustle');
  const categoryRef = useRef<HTMLDivElement>(null);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
    { date: '2024-11-15', event: '短视频创作大赛开始', countdown: 15, type: 'short-video' },
    { date: '2024-12-01', event: '摄影作品线上展览', countdown: 31, type: 'photography' },
    { date: '2025-01-10', event: '自由职业者线下交流会', countdown: 71, type: 'side-hustle' },
    { date: '2024-12-15', event: '内容创作者峰会', countdown: 45, type: 'writing' }
  ];

  const filteredDates = activeCategory === 'all' 
    ? importantDates 
    : importantDates.filter(date => date.type === activeCategory);

  const categories = [
    { id: 'all', name: '全部', icon: <Calendar size={16} /> },
    { id: 'side-hustle', name: '副业', icon: <Briefcase size={16} /> },
    { id: 'photography', name: '摄影', icon: <Camera size={16} /> },
    { id: 'writing', name: '写作', icon: <Pen size={16} /> },
    { id: 'short-video', name: '短视频', icon: <Video size={16} /> },
    { id: 'design', name: '设计', icon: <Pen size={16} /> }
  ];

  const hotSkills = [
    { id: '1', name: '短视频制作', growth: '+128%', tag: '热门' },
    { id: '2', name: '内容写作', growth: '+85%', tag: '稳定' },
    { id: '3', name: 'AI绘画', growth: '+215%', tag: '新兴' }
  ];

  const experts = [
    {
      id: '1',
      name: '张导演',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      title: '短视频导演 | MCN签约',
      description: '专注抖音爆款视频制作，学员作品平均10w+播放',
      tags: ['短视频', '剪辑', '脚本'],
      category: 'short-video',
      rating: 4.9,
      responseRate: '97%',
      orderCount: '218单'
    },
    {
      id: '2',
      name: '王摄影',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '商业摄影师 | 自由职业',
      description: '曾为多家一线品牌拍摄，擅长人像与产品摄影',
      tags: ['摄影', '后期', '构图'],
      category: 'photography',
      rating: 4.8,
      responseRate: '95%',
      orderCount: '165单'
    },
    {
      id: '3',
      name: '李作家',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      title: '签约作家 | 畅销书作者',
      description: '出版5本畅销书，知乎百万粉丝，专栏收入10w+/月',
      tags: ['写作', '出版', '内容'],
      category: 'writing',
      rating: 4.9,
      responseRate: '98%',
      orderCount: '245单'
    },
    {
      id: '4',
      name: '赵设计',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      title: 'UI设计师 | 自由接单',
      description: '8年设计经验，月均接单3万+，作品被多家平台收录',
      tags: ['设计', 'UI', '接单'],
      category: 'design',
      rating: 4.7,
      responseRate: '94%',
      orderCount: '187单'
    },
    {
      id: '5',
      name: '陈顾问',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      title: '副业规划师 | 职业顾问',
      description: '帮助500+上班族成功开展副业，0基础起步方案',
      tags: ['副业', '规划', '变现'],
      category: 'side-hustle',
      rating: 4.8,
      responseRate: '96%',
      orderCount: '215单'
    }
  ];

  const communityQuestions = [
    {
      id: '1',
      title: '摄影小白如何快速提升拍摄技巧？',
      description: '刚买了单反，想学习基础构图和用光技巧，有哪些实用的入门教程或练习方法？',
      asker: {
        name: '摄影新手',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
      },
      time: '2小时前',
      tags: ['摄影', '入门', '技巧'],
      answers: 18,
      points: 45,
      viewCount: '5.2k',
      category: 'photography'
    },
    {
      id: '2',
      title: '副业接单平台推荐',
      description: '想利用周末时间做UI设计接单，有哪些靠谱的平台推荐？费率和到账周期如何？',
      asker: {
        name: '设计师小王',
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
      },
      time: '5小时前',
      tags: ['副业', '接单', '平台'],
      answers: 12,
      points: 30,
      viewCount: '3.6k',
      category: 'side-hustle'
    },
    {
      id: '3',
      title: '短视频剪辑用什么软件最适合新手？',
      description: '想开始学习短视频剪辑，电脑配置一般，哪个软件上手快又不卡顿？',
      asker: {
        name: '视频爱好者',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
      },
      time: '1天前',
      tags: ['短视频', '剪辑', '软件'],
      answers: 25,
      points: 60,
      viewCount: '6.8k',
      category: 'short-video'
    },
    {
      id: '4',
      title: '新媒体写作如何找到持续创作的灵感？',
      description: '做公众号两个月了，现在感觉创作枯竭，有什么方法能长期保持输出？',
      asker: {
        name: '新媒体小编',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      time: '2天前',
      tags: ['写作', '灵感', '内容创作'],
      answers: 15,
      points: 35,
      viewCount: '4.2k',
      category: 'writing'
    },
    {
      id: '5',
      title: 'UI设计转行做插画可行吗？',
      description: '现在做UI设计，但对商业插画更感兴趣，想了解转行难度和市场前景',
      asker: {
        name: 'UI设计师',
        avatar: 'https://randomuser.me/api/portraits/men/28.jpg'
      },
      time: '3天前',
      tags: ['设计', '插画', '转行'],
      answers: 10,
      points: 25,
      viewCount: '2.8k',
      category: 'design'
    }
  ];

  const featuredQuestions = [
    {
      id: '1',
      title: '新手如何开始接摄影单？设备推荐？',
      views: '3.2k',
      tags: ['摄影', '接单', '设备'],
      user: {
        name: '摄影师王明',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: '商业摄影师 | 5年经验'
      }
    },
    {
      id: '2',
      title: '写作变现哪个平台收益最高？',
      views: '2.7k',
      tags: ['写作', '变现', '平台'],
      user: {
        name: '李作家',
        avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
        role: '自由撰稿人 | 月入2万+'
      }
    }
  ];

  const filteredExperts = activeCategory === 'all' 
    ? experts 
    : experts.filter(expert => expert.category === activeCategory);

  const filteredQuestions = activeCategory === 'all'
    ? communityQuestions
    : communityQuestions.filter(question => question.category === activeCategory);

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

  const handleAskMe = (expertName: string) => {
    console.log(`Opening chat with ${expertName}`);
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-rose-50/30 pb-20">
      <div className="sticky top-0 z-50 bg-app-red shadow-sm animate-fade-in">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate('/')} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base ml-2">兴趣技能</div>
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
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Flame size={18} className="text-pink-600 mr-2" />
              <h3 className="font-medium text-sm">技能热榜</h3>
            </div>
            <button 
              className="flex items-center text-xs text-pink-600 bg-white rounded-full px-2 py-1 shadow-sm"
              onClick={handleAddDate}
            >
              <CalendarPlus size={12} className="mr-1" />
              <span>添加日程</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {hotSkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-md p-2">
                <div className="flex items-center">
                  <span className="bg-pink-200 text-pink-800 text-xs w-5 h-5 rounded-full flex items-center justify-center mr-2">
                    {index + 1}
                  </span>
                  <span className="text-xs font-medium">{skill.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-green-600 mr-1">{skill.growth}</span>
                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                    {skill.tag}
                  </span>
                </div>
              </div>
            ))}
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
                  className={`flex-shrink-0 ${activeCategory === category.id ? 'bg-pink-500 text-white' : 'bg-white shadow-sm'} rounded-full px-3 py-1.5 flex items-center gap-1 cursor-pointer transition-colors`}
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
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center mb-3">
            <Calendar size={18} className="text-pink-600 mr-2" />
            <h3 className="font-medium text-sm">重要日期提醒</h3>
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
                  <div className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.countdown}天
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">精选技能课程</h2>
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
            featuredQuestions.map((item) => (
              <Card key={item.id} className="shadow-sm hover:shadow transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-base">{item.title}</h3>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Eye size={12} className="mr-1" />
                      <span>{item.views} 浏览</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <img 
                      src={item.user.avatar} 
                      alt={item.user.name} 
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.user.name}</p>
                      <p className="text-xs text-gray-500">{item.user.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="bg-pink-50 text-pink-600 text-xs px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-red to-rose-500 z-10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="experts" 
                className="font-bold text-lg pb-2 relative data-[state=active]:text-app-text data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:text-gray-400"
              >
                找TA问问
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-red to-rose-500 z-10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></span>
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
                      asker={question.asker}
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
                        <Avatar className="w-10 h-10 border border-pink-50">
                          <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                          <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800">{expert.name}</h3>
                          <p className="text-xs text-pink-600">{expert.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-yellow-500 gap-1">
                          <Calendar size={12} />
                          <span className="text-xs font-medium">{expert.rating}</span>
                        </div>
                        <div className="flex items-center text-pink-500 gap-1 text-xs">
                          <Clock size={10} />
                          <span>{expert.responseRate}</span>
                        </div>
                        <div className="flex items-center text-pink-500 gap-1 text-xs">
                          <Package size={10} />
                          <span>{expert.orderCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex mt-2">
                      <p className="text-xs text-gray-700 border-l-2 border-pink-200 pl-2 py-0.5 bg-pink-50/50 rounded-r-md flex-1 mr-2 line-clamp-2">
                        {expert.description}
                      </p>
                      
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/expert-profile/${expert.id}`);
                        }}
                        className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 h-auto"
                      >
                        <MessageSquare size={10} />
                        找我问问
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {expert.tags.map((tag, index) => (
                        <span key={index} className="bg-pink-50 text-pink-600 text-xs px-2 py-0.5 rounded-full">
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
      
      <button className="fixed bottom-20 right-4 bg-gradient-to-r from-app-red to-rose-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default HobbiesSkills;
