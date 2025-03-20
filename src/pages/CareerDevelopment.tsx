
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  Briefcase, 
  Users, 
  Landmark, 
  FileText, 
  LineChart,
  Plus,
  Bell,
  CalendarPlus,
  MessageSquare,
  MessageCircle,
  Clock,
  Package,
  Eye,
  ChevronRight
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
    { date: '2024-12-10', event: '年度绩效面谈', countdown: 45, type: 'interview' },
    { date: '2024-11-05', event: '行业招聘峰会', countdown: 10, type: 'job-fair' },
    { date: '2025-01-15', event: '高管培训计划', countdown: 80, type: 'training' },
    { date: '2024-12-20', event: '职业规划讲座', countdown: 55, type: 'workshop' }
  ];

  const filteredDates = activeCategory === 'all' 
    ? importantDates 
    : importantDates.filter(date => date.type === activeCategory);

  const categories = [
    { id: 'all', name: '全部', icon: <Calendar size={16} /> },
    { id: 'interview', name: '面试', icon: <Users size={16} /> },
    { id: 'job-fair', name: '招聘会', icon: <Briefcase size={16} /> },
    { id: 'training', name: '培训', icon: <Landmark size={16} /> },
    { id: 'workshop', name: '讲座', icon: <FileText size={16} /> },
    { id: 'career-path', name: '职业规划', icon: <LineChart size={16} /> }
  ];

  const allExperts = [
    {
      id: '1',
      name: '王面试官',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '某互联网大厂HR | 10年经验',
      description: '帮助500+求职者斩获大厂offer，专注技术岗位面试指导',
      tags: ['面试', 'HR', '技术岗'],
      keywords: ['面试', '简历', '技术面', 'HR面', '大厂', '互联网'],
      category: 'interview',
      rating: 4.9,
      responseRate: '98%',
      orderCount: '356单'
    },
    {
      id: '2',
      name: '张规划师',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      title: '职业规划专家 | 生涯顾问',
      description: '前500强HR总监，擅长职业瓶颈突破和长期发展规划',
      tags: ['职业规划', '转行', '升职'],
      keywords: ['职业规划', '升职加薪', '转行', '职业咨询', '生涯发展'],
      category: 'career-path',
      rating: 4.8,
      responseRate: '95%',
      orderCount: '289单'
    },
    {
      id: '3',
      name: '李老师',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      title: '职场培训师 | 管理顾问',
      description: '15年培训经验，专注领导力和管理技能提升',
      tags: ['培训', '管理', '领导力'],
      keywords: ['领导力', '管理技能', '团队建设', '沟通', '培训'],
      category: 'training',
      rating: 4.7,
      responseRate: '92%',
      orderCount: '215单'
    },
    {
      id: '4',
      name: '刘老师',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      title: '跳槽咨询师 | 简历专家',
      description: '资深猎头，精通简历优化和面试技巧指导',
      tags: ['简历', '面试', '跳槽'],
      keywords: ['简历', '面试技巧', '跳槽', '薪资谈判', '求职'],
      category: 'interview',
      rating: 4.9,
      responseRate: '97%',
      orderCount: '320单'
    },
    {
      id: '5',
      name: '赵导师',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      title: '职场导师 | 晋升专家',
      description: '帮助200+职场人成功晋升，擅长职场软技能提升',
      tags: ['晋升', '软技能', '沟通'],
      keywords: ['晋升', '职场政治', '软技能', '沟通技巧', '领导力'],
      category: 'career-path',
      rating: 4.8,
      responseRate: '94%',
      orderCount: '175单'
    }
  ];

  const filteredExperts = activeCategory === 'all' 
    ? allExperts 
    : allExperts.filter(expert => expert.category === activeCategory);

  const communityQuestions = [
    {
      id: '1',
      title: '如何准备大厂技术面试？',
      description: '准备面试字节跳动的后端开发岗位，有什么技术重点和面试经验可以分享吗？',
      asker: {
        name: '程序员小王',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
      },
      time: '3小时前',
      tags: ['面试', '技术岗', '大厂'],
      answers: 16,
      viewCount: '4.2k',
      points: 35,
      category: 'interview'
    },
    {
      id: '2',
      title: '工作3年，转行做产品可行吗？',
      description: '目前是一名销售，对产品经理很感兴趣，想了解转行难度和必备技能...',
      asker: {
        name: '销售小李',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
      },
      time: '5小时前',
      tags: ['转行', '产品经理', '职业规划'],
      answers: 8,
      viewCount: '2.6k',
      points: 25,
      category: 'career-path',
      answerName: '产品总监',
      answerAvatar: 'https://randomuser.me/api/portraits/men/33.jpg'
    },
    {
      id: '3',
      title: '年底述职报告怎么写才能争取高绩效？',
      description: '第一次写年终述职，有什么技巧可以突出自己的贡献和价值？',
      asker: {
        name: '职场新人',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      time: '1天前',
      tags: ['绩效', '述职', '职场'],
      answers: 12,
      viewCount: '3.8k',
      points: 30,
      category: 'career-path',
      answerName: '人力资源总监',
      answerAvatar: 'https://randomuser.me/api/portraits/men/52.jpg'
    },
    {
      id: '4',
      title: '管理新团队，如何快速建立威信？',
      description: '刚升任团队主管，面对比我年龄大的下属，如何建立权威又不失亲和力？',
      asker: {
        name: '新晋主管',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg'
      },
      time: '2天前',
      tags: ['管理', '领导力', '团队'],
      answers: 15,
      viewCount: '4.5k',
      points: 40,
      category: 'training'
    },
    {
      id: '5',
      title: '哪些证书对职业发展帮助最大？',
      description: '想在业余时间考一些证书提升竞争力，IT行业哪些证书含金量高？',
      asker: {
        name: 'IT工程师',
        avatar: 'https://randomuser.me/api/portraits/women/36.jpg'
      },
      time: '3天前',
      tags: ['证书', '职业发展', 'IT'],
      answers: 20,
      viewCount: '5.2k',
      points: 45,
      category: 'career-path',
      answerName: '行业专家',
      answerAvatar: 'https://randomuser.me/api/portraits/men/75.jpg'
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
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 pb-20">
      <div className="sticky top-0 z-50 bg-app-blue shadow-sm animate-fade-in">
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Calendar size={18} className="text-indigo-600 mr-2" />
              <h3 className="font-medium text-sm">重要日期日历</h3>
            </div>
            <button 
              className="flex items-center text-xs text-indigo-600 bg-white rounded-full px-2 py-1 shadow-sm"
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
                  <div className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
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
                  className={`flex-shrink-0 ${activeCategory === category.id ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'} rounded-full px-3 py-1.5 flex items-center gap-1 cursor-pointer transition-colors`}
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
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-blue to-blue-500 z-10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="experts" 
                className="font-bold text-lg pb-2 relative data-[state=active]:text-app-text data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:text-gray-400"
              >
                找TA问问
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-blue to-blue-500 z-10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></span>
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
                        <Avatar className="w-10 h-10 border border-blue-50">
                          <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                          <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800">{expert.name}</h3>
                          <p className="text-xs text-blue-600">{expert.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-yellow-500 gap-1">
                          <Calendar size={12} />
                          <span className="text-xs font-medium">{expert.rating}</span>
                        </div>
                        <div className="flex items-center text-blue-500 gap-1 text-xs">
                          <Clock size={10} />
                          <span>{expert.responseRate}</span>
                        </div>
                        <div className="flex items-center text-blue-500 gap-1 text-xs">
                          <Package size={10} />
                          <span>{expert.orderCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex mt-2">
                      <p className="text-xs text-gray-700 border-l-2 border-blue-200 pl-2 py-0.5 bg-blue-50/50 rounded-r-md flex-1 mr-2 line-clamp-2">
                        {expert.description}
                      </p>
                      
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/expert-profile/${expert.id}`);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 h-auto"
                      >
                        <MessageSquare size={10} />
                        找我问问
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {expert.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
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
      
      <button className="fixed bottom-20 right-4 bg-gradient-to-r from-app-blue to-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default CareerDevelopment;
