
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  Briefcase, 
  FileText, 
  Video, 
  Clock, 
  Users, 
  User, 
  MessageCircleQuestion,
  Bell,
  CalendarPlus,
  MessageSquare,
  MessageCircle,
  Plus,
  Globe,
  Award,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from "@/components/SearchBar";
import QuestionCard from '@/components/QuestionCard';

const CareerDevelopment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
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
    { date: '2024-10-01', event: '秋季校招启动', countdown: 30, type: 'job' },
    { date: '2024-11-15', event: '互联网行业招聘峰会', countdown: 45, type: 'job' },
    { date: '2024-12-10', event: '年终跳槽黄金期', countdown: 70, type: 'resume' },
    { date: '2025-03-15', event: '春季招聘季', countdown: 165, type: 'interview' }
  ];

  const filteredDates = activeCategory === 'all' 
    ? importantDates 
    : importantDates.filter(date => date.type === activeCategory);

  const categories = [
    { id: 'all', name: '全部', icon: <Calendar size={16} /> },
    { id: 'job', name: '求职', icon: <Briefcase size={16} /> },
    { id: 'resume', name: '简历', icon: <FileText size={16} /> },
    { id: 'interview', name: '面试', icon: <Video size={16} /> },
    { id: 'remote', name: '远程工作', icon: <Clock size={16} /> },
    { id: 'startup', name: '创业', icon: <Users size={16} /> }
  ];

  const allExperts = [
    {
      id: '1',
      name: '李明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
      title: '阿里巴巴HR',
      description: '5年大厂招聘经验，擅长简历优化和面试辅导',
      tags: ['简历', '面试', 'HR'],
      keywords: ['简历优化', '面试技巧', '大厂招聘', 'HR视角', '求职策略'],
      category: 'job',
      rating: 4.8,
      responseRate: '98%',
      orderCount: '126单'
    },
    {
      id: '2',
      name: '王芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      title: '腾讯猎头',
      description: '7年猎头经验，专注IT/互联网高端人才定向招聘',
      tags: ['猎头', '高薪', '跳槽'],
      keywords: ['猎头顾问', '薪资谈判', '职业发展', '高端招聘', 'offer比较'],
      category: 'job',
      rating: 4.9,
      responseRate: '95%',
      orderCount: '210单'
    },
    {
      id: '3',
      name: '张伟',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      title: '字节跳动技术经理',
      description: '4年技术面试官经验，帮助数百人成功入职大厂',
      tags: ['技术面试', '算法', '项目经验'],
      keywords: ['技术面试', '编程算法', '系统设计', '项目经验', '技术选型'],
      category: 'interview',
      rating: 4.7,
      responseRate: '90%',
      orderCount: '98单'
    },
    {
      id: '4',
      name: '陈晓',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
      title: '资深职业规划师',
      description: '10年职业生涯规划经验，帮助客户明确职业发展方向',
      tags: ['职业规划', '转行', '发展方向'],
      keywords: ['职业规划', '职业测评', '能力分析', '转行指导', '明确方向'],
      category: 'job',
      rating: 4.6,
      responseRate: '92%',
      orderCount: '156单'
    },
    {
      id: '5',
      name: '刘强',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=William',
      title: '创业导师 | 投资人',
      description: '连续创业者，3家成功企业，现为天使投资人',
      tags: ['创业', '融资', '商业计划'],
      keywords: ['创业指导', '商业计划书', '融资策略', '团队组建', '产品定位'],
      category: 'startup',
      rating: 4.9,
      responseRate: '88%',
      orderCount: '72单'
    },
    {
      id: '6',
      name: '周媛',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
      title: '远程工作顾问',
      description: '5年远程团队管理经验，帮助个人找到理想远程工作',
      tags: ['远程工作', '自由职业', '时间管理'],
      keywords: ['远程工作', '自由职业', '时间管理', '工作与生活平衡', '全球招聘'],
      category: 'remote',
      rating: 4.7,
      responseRate: '94%',
      orderCount: '118单'
    }
  ];

  const filteredExperts = activeCategory === 'all' 
    ? allExperts 
    : allExperts.filter(expert => expert.category === activeCategory);

  const communityQuestions = [
    {
      id: '1',
      title: '应届生如何准备前端开发面试？有哪些常见的技术问题？',
      description: '我是23届应届生，想了解前端面试常见问题，如何准备能提高通过率...',
      asker: {
        name: "小李同学",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
      time: "2小时前",
      tags: ["前端开发", "面试技巧"],
      answers: 5,
      viewCount: "128",
      points: 30,
      category: 'interview'
    },
    {
      id: '2',
      title: '跨行业转到产品经理岗位，需要掌握哪些基本技能？',
      description: '我目前是教育行业从业者，想转行到互联网产品经理岗位，需要提前学习什么知识？',
      asker: {
        name: "职场新人",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
      },
      time: "4小时前",
      tags: ["产品经理", "转行"],
      answers: 8,
      viewCount: "216",
      points: 25,
      category: 'job',
      answerName: '资深产品经理',
      answerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia'
    },
    {
      id: '3',
      title: '大厂简历筛选关注哪些点？如何提高简历通过率？',
      description: '即将开始校招投递，想知道如何让简历在大厂筛选中脱颖而出，有什么经验可以分享？',
      asker: {
        name: "求职者小王",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      },
      time: "昨天",
      tags: ["简历优化", "大厂求职"],
      answers: 12,
      viewCount: "342",
      points: 40,
      category: 'resume'
    },
    {
      id: '4',
      title: '如何平衡远程工作和生活？有什么高效的时间管理方法？',
      description: '最近开始做远程工作，发现很难界定工作和生活的边界，经常加班到很晚...',
      asker: {
        name: "远程工作者",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
      },
      time: "3天前",
      tags: ["远程工作", "时间管理"],
      answers: 15,
      viewCount: "420",
      points: 35,
      category: 'remote'
    },
    {
      id: '5',
      title: '创业初期如何寻找合伙人和组建团队？',
      description: '有一个创业想法，但不知道如何找到志同道合的合伙人，有什么渠道和方法推荐？',
      asker: {
        name: "创业新手",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel",
      },
      time: "5天前",
      tags: ["创业", "团队组建"],
      answers: 7,
      viewCount: "185",
      points: 45,
      category: 'startup'
    }
  ];

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

  return (
    <div className="app-container bg-gradient-to-b from-white to-purple-50/30 pb-20">
      <div className="sticky top-0 z-50 bg-purple-600 shadow-sm animate-fade-in">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate('/')} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base ml-2">职业发展</div>
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
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Calendar size={18} className="text-purple-600 mr-2" />
              <h3 className="font-medium text-sm">重要日期日历</h3>
            </div>
            <button 
              className="flex items-center text-xs text-purple-600 bg-white rounded-full px-2 py-1 shadow-sm"
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
                  <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
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
                  className={`flex-shrink-0 ${activeCategory === category.id ? 'bg-purple-500 text-white' : 'bg-white shadow-sm'} rounded-full px-3 py-1.5 flex items-center gap-1 cursor-pointer transition-colors`}
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
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 z-10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="experts" 
                className="font-bold text-lg pb-2 relative data-[state=active]:text-app-text data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:text-gray-400"
              >
                找TA问问
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 z-10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></span>
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
                        <Avatar className="w-10 h-10 border border-purple-50">
                          <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                          <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800">{expert.name}</h3>
                          <p className="text-xs text-purple-600">{expert.title}</p>
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
                      <p className="text-xs text-gray-700 border-l-2 border-purple-200 pl-2 py-0.5 bg-purple-50/50 rounded-r-md flex-1 mr-2 line-clamp-2">
                        {expert.description}
                      </p>
                      
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/expert-profile/${expert.id}`);
                        }}
                        className="bg-gradient-to-r from-purple-500 to-indigo-400 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 h-auto"
                      >
                        <MessageSquare size={10} />
                        找我问问
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {expert.tags.map((tag, index) => (
                        <span key={index} className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full">
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
      
      <button className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default CareerDevelopment;
