
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, Briefcase, FileText, Video, Clock, 
  Users, User, MessageCircleQuestion, MessageCirclePlus,
  Star, Mail, ChevronLeft, ArrowRight, Plus
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Mock data for job mentors
const mentors = [
  {
    id: 1,
    name: "李明",
    role: "阿里巴巴HR",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
    years: 5,
    price: 299,
    rating: 4.8
  },
  {
    id: 2,
    name: "王芳",
    role: "腾讯猎头",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    years: 7,
    price: 399,
    rating: 4.9
  },
  {
    id: 3,
    name: "张伟",
    role: "字节跳动技术经理",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    years: 4,
    price: 249,
    rating: 4.7
  },
];

// Mock data for job questions
const questions = [
  {
    id: 1,
    title: "应届生如何准备前端开发面试？有哪些常见的技术问题？",
    description: "我是23届应届生，想了解前端面试常见问题，如何准备能提高通过率...",
    asker: {
      name: "小李同学",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    time: "2小时前",
    tags: ["前端开发", "面试技巧"],
    answers: 5,
    views: 128,
    points: 30
  },
  {
    id: 2,
    title: "跨行业转到产品经理岗位，需要掌握哪些基本技能？",
    description: "我目前是教育行业从业者，想转行到互联网产品经理岗位，需要提前学习什么知识？",
    asker: {
      name: "职场新人",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
    },
    time: "4小时前",
    tags: ["产品经理", "转行"],
    answers: 8,
    views: 216,
    points: 25
  },
  {
    id: 3,
    title: "大厂简历筛选关注哪些点？如何提高简历通过率？",
    description: "即将开始校招投递，想知道如何让简历在大厂筛选中脱颖而出，有什么经验可以分享？",
    asker: {
      name: "求职者小王",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    },
    time: "昨天",
    tags: ["简历优化", "大厂求职"],
    answers: 12,
    views: 342,
    points: 40
  },
];

// Mock data for industry news
const industryNews = [
  {
    id: 1,
    title: "科技行业2025年人才需求趋势分析",
    source: "IT人才研究",
    time: "今天",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "互联网大厂最新招聘政策解读",
    source: "互联网人才观察",
    time: "昨天",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "2025年最具发展前景的十大职业",
    source: "职业规划观察",
    time: "3天前",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
];

// Important dates for career
const importantDates = [
  { date: '2024-10-01', event: '秋季校招启动' },
  { date: '2024-11-15', event: '互联网行业招聘峰会' },
  { date: '2024-12-10', event: '年终跳槽黄金期' }
];

// Featured questions data (to match Education page format)
const featuredQuestions = [
  {
    id: '1',
    title: '如何准备大厂前端技术面试？',
    views: '3.2k',
    tags: ['前端', '面试', '技术'],
    user: {
      name: '张老师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
      role: '阿里P8技术专家'
    }
  },
  {
    id: '2',
    title: '跨行业转产品经理需要做好哪些准备？',
    views: '2.5k',
    tags: ['产品经理', '转行', '职业规划'],
    user: {
      name: '李产品',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      role: '腾讯高级产品经理'
    }
  }
];

// Categories
const categories = [
  { id: "job", label: "求职", icon: <Briefcase size={16} /> },
  { id: "resume", label: "简历", icon: <FileText size={16} /> },
  { id: "interview", label: "面试", icon: <Video size={16} /> },
  { id: "remote", label: "远程工作", icon: <Clock size={16} /> },
  { id: "startup", label: "创业", icon: <Users size={16} /> },
];

const CareerDevelopment: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("job");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Countdown to important career event
  const eventDate = new Date('2024-10-01');
  const today = new Date();
  const daysRemaining = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="app-container bg-gradient-to-b from-white to-purple-50/30 pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-purple-600 shadow-sm animate-fade-in">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate('/')} className="text-white mr-2">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base">职业发展</div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 py-4 bg-gradient-to-b from-purple-600/10 to-transparent">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索岗位、行业、面试技巧"
            className="search-input pr-10 focus:ring-2 focus:ring-purple-400/30 shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search 
            size={18} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        </div>
      </div>
      
      {/* Event Countdown */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 mb-4 flex items-center justify-between mx-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Clock size={18} className="text-purple-500 mr-2" />
          <span className="text-sm font-medium">秋招倒计时</span>
        </div>
        <div className="bg-purple-500 text-white text-sm font-bold px-3 py-1 rounded-full">
          {daysRemaining}天
        </div>
      </div>
      
      {/* Category Tags with Carousel */}
      <div className="px-4 mb-4 overflow-x-auto">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`flex-shrink-0 rounded-full px-3 py-1.5 flex items-center gap-1 cursor-pointer ${
                activeCategory === category.id ? 
                'bg-purple-500 text-white' : 
                'bg-white text-gray-700 shadow-sm'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              <span className="text-xs font-medium">{category.label}</span>
            </div>
          ))}
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
            featuredQuestions.map((item) => (
              <Card key={item.id} className="shadow-sm hover:shadow transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-base">{item.title}</h3>
                    <div className="flex items-center text-gray-500 text-xs">
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
                      <span key={index} className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full">
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
      
      {/* Senior Mentors Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">行业导师专栏</h2>
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
            mentors.slice(0, 2).map((mentor) => (
              <Card key={mentor.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center mb-2">
                    <img 
                      src={mentor.avatar} 
                      alt={mentor.name} 
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                      <p className="text-sm font-medium">{mentor.name}</p>
                      <p className="text-xs text-gray-500">{mentor.role} · {mentor.years}年经验</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs">{mentor.rating}</span>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100">
                      ¥{mentor.price}/次
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Important Dates */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center mb-3">
            <Calendar size={18} className="text-purple-600 mr-2" />
            <h3 className="font-medium text-sm">重要日期提醒</h3>
          </div>
          
          <div className="space-y-2">
            {importantDates.map((item, index) => {
              const eventDate = new Date(item.date);
              const formattedDate = `${eventDate.getMonth() + 1}月${eventDate.getDate()}日`;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs font-medium">{item.event}</span>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                    {formattedDate}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Industry News */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-1">
            <Mail size={18} className="text-purple-600" />
            行业热点
          </h2>
          <span className="text-xs text-gray-500">更多 &gt;</span>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg p-4 animate-pulse-soft shadow-sm">
                  <div className="flex items-center">
                    <div className="w-24 h-24 bg-gray-200 rounded"></div>
                    <div className="flex-1 ml-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {industryNews.map((news) => (
                <Card key={news.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="flex items-center">
                      <div className="w-24 h-24 bg-gray-100 overflow-hidden">
                        <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3 flex-1">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">{news.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{news.source}</span>
                          <span className="text-xs text-gray-500">{news.time}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                    <div className="flex space-x-2">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((question) => (
                  <Card key={question.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base mb-2">{question.title}</h3>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{question.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags.map((tag, index) => (
                          <span key={index} className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={question.asker.avatar} 
                            alt={question.asker.name} 
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-xs text-gray-600">{question.asker.name}</span>
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
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">寻找专业解答？</p>
              <p className="text-base font-medium text-purple-700 mb-3">我们有专业导师为您解答</p>
              <button className="bg-purple-600 text-white text-sm px-4 py-2 rounded-full shadow-sm">
                找专家问问
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating Ask Button */}
      <button className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default CareerDevelopment;
