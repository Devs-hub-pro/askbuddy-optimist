import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Clock, 
  Camera, 
  Pen, 
  Music, 
  Video, 
  ChevronLeft, 
  Star, 
  MessageCircle, 
  Briefcase, 
  Plus, 
  ArrowRight,
  User,
  Tag,
  Flame,
  PlusCircle,
  MessageSquare 
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const HobbiesSkills = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('side-hustle'); // Default active category
  
  // Simulate loading content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Countdown to the next major event
  const eventDate = new Date('2024-12-15');
  const today = new Date();
  const daysRemaining = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Categories data
  const categories = [
    { id: 'side-hustle', name: '副业', icon: <Briefcase size={16} /> },
    { id: 'photography', name: '摄影', icon: <Camera size={16} /> },
    { id: 'writing', name: '写作', icon: <Pen size={16} /> },
    { id: 'short-video', name: '短视频', icon: <Video size={16} /> },
    { id: 'design', name: '设计', icon: <Pen size={16} /> }
  ];
  
  // Hot skills data
  const hotSkills = [
    { id: '1', name: '短视频制作', growth: '+128%', tag: '热门' },
    { id: '2', name: '内容写作', growth: '+85%', tag: '稳定' },
    { id: '3', name: 'AI绘画', growth: '+215%', tag: '新兴' }
  ];
  
  // Featured questions data
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
  
  // Experts data
  const experts = [
    {
      id: '1',
      name: '张导演',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      title: '短视频导演 | MCN签约',
      description: '专注抖音爆款视频制作，学员作品平均10w+播放',
      tags: ['短视频', '剪辑', '脚本'],
      category: 'short-video'
    },
    {
      id: '2',
      name: '王摄影',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '商业摄影师 | 自由职业',
      description: '曾为多家一线品牌拍摄，擅长人像与产品摄影',
      tags: ['摄影', '后期', '构图'],
      category: 'photography'
    },
    {
      id: '3',
      name: '李作家',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      title: '签约作家 | 畅销书作者',
      description: '出版5本畅销书，知乎百万粉丝，专栏收入10w+/月',
      tags: ['写作', '出版', '内容'],
      category: 'writing'
    },
    {
      id: '4',
      name: '赵设计',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      title: 'UI设计师 | 自由接单',
      description: '8年设计经验，月均接单3万+，作品被多家平台收录',
      tags: ['设计', 'UI', '接单'],
      category: 'design'
    },
    {
      id: '5',
      name: '陈顾问',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      title: '副业规划师 | 职业顾问',
      description: '帮助500+上班族成功开展副业，0基础起步方案',
      tags: ['副业', '规划', '变现'],
      category: 'side-hustle'
    }
  ];
  
  // Community questions data
  const communityQuestions = [
    {
      id: '1',
      title: '摄影小白如何快速提升拍摄技巧？',
      description: '刚买了单反，想学习基础构图和用光技巧，有哪些实用的入门教程或练习方法？',
      user: {
        name: '摄影新手',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
      },
      tags: ['摄影', '入门', '技巧'],
      answers: 18,
      points: 45,
      category: 'photography'
    },
    {
      id: '2',
      title: '副业接单平台推荐',
      description: '想利用周末时间做UI设计接单，有哪些靠谱的平台推荐？费率和到账周期如何？',
      user: {
        name: '设计师小王',
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
      },
      tags: ['副业', '接单', '平台'],
      answers: 12,
      points: 30,
      category: 'side-hustle'
    },
    {
      id: '3',
      title: '短视频剪辑用什么软件最适合新手？',
      description: '想开始学习短视频剪辑，电脑配置一般，哪个软件上手快又不卡顿？',
      user: {
        name: '视频爱好者',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
      },
      tags: ['短视频', '剪辑', '软件'],
      answers: 25,
      points: 60,
      category: 'short-video'
    }
  ];
  
  // Important dates
  const importantDates = [
    { date: '2024-11-15', event: '短视频创作大赛开始' },
    { date: '2024-12-01', event: '摄影作品线上展览' },
    { date: '2025-01-10', event: '自由职业者线下交流会' }
  ];

  // Filter experts based on selected category
  const filteredExperts = activeCategory === 'all' 
    ? experts 
    : experts.filter(expert => expert.category === activeCategory);

  // Filter questions based on selected category
  const filteredQuestions = activeCategory === 'all'
    ? communityQuestions
    : communityQuestions.filter(question => question.category === activeCategory);

  // Add handler for the "Ask Me" button
  const handleAskMe = (expertName: string) => {
    console.log(`Opening chat with ${expertName}`);
    // This would typically initiate a direct message or contact form
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-rose-50/30 pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-app-red shadow-sm animate-fade-in">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate('/')} className="text-white mr-2">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base">兴趣技能</div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 py-4 bg-gradient-to-b from-app-red/10 to-transparent">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索技能/导师/课程"
            className="search-input pr-10 focus:ring-2 focus:ring-app-red/30 shadow-md"
          />
          <Search 
            size={18} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        </div>
      </div>
      
      {/* Event Countdown */}
      <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 mb-4 flex items-center justify-between mx-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Clock size={18} className="text-pink-500 mr-2" />
          <span className="text-sm font-medium">短视频大赛倒计时</span>
        </div>
        <div className="bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
          {daysRemaining}天
        </div>
      </div>
      
      {/* Category Tags */}
      <div className="px-4 mb-4 overflow-x-auto">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`flex-shrink-0 ${activeCategory === category.id ? 'bg-pink-500 text-white' : 'bg-white shadow-sm'} rounded-full px-3 py-1.5 flex items-center gap-1 cursor-pointer`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              <span className="text-xs font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Hot Skills Section */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center mb-3">
            <Flame size={18} className="text-pink-600 mr-2" />
            <h3 className="font-medium text-sm">技能热榜</h3>
          </div>
          
          <div className="space-y-2">
            {hotSkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
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
      
      {/* Featured Content */}
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
      
      {/* Experts Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">技能达人</h2>
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
                  <div className="flex flex-wrap gap-1 mb-2">
                    {expert.tags.map((tag, index) => (
                      <span key={index} className="bg-pink-50 text-pink-600 text-xs px-1.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button 
                    onClick={() => handleAskMe(expert.name)}
                    variant="outline" 
                    size="sm"
                    className="w-full text-pink-600 border-pink-200 bg-pink-50 hover:bg-pink-100 rounded-full text-xs py-1 h-auto flex items-center gap-1 justify-center"
                  >
                    <MessageSquare size={14} />
                    找我问问
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Important Dates */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center mb-3">
            <Calendar size={18} className="text-pink-600 mr-2" />
            <h3 className="font-medium text-sm">重要日期提醒</h3>
          </div>
          
          <div className="space-y-2">
            {importantDates.map((item, index) => {
              const eventDate = new Date(item.date);
              const formattedDate = `${eventDate.getMonth() + 1}月${eventDate.getDate()}日`;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs font-medium">{item.event}</span>
                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                    {formattedDate}
                  </span>
                </div>
              );
            })}
          </div>
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
                    <div className="flex space-x-2">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuestions.map((question) => (
                  <Card key={question.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base mb-2">{question.title}</h3>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{question.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags.map((tag, index) => (
                          <span key={index} className="bg-pink-50 text-pink-600 text-xs px-2 py-0.5 rounded-full">
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
            <div className="bg-pink-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">想快速提升技能？</p>
              <p className="text-base font-medium text-pink-700 mb-3">我们有专业达人为您指导</p>
              <button className="bg-pink-600 text-white text-sm px-4 py-2 rounded-full shadow-sm">
                找达人问问
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating Ask Button */}
      <button className="fixed bottom-20 right-4 bg-gradient-to-r from-app-red to-rose-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default HobbiesSkills;
