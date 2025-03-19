import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heart, Home, ArrowLeft, MessageCircle, Star, ChevronRight, ChevronLeft, Briefcase, GraduationCap, Globe, Umbrella, PlusCircle, Clock, Award, User, UserCheck } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const LifestyleServices = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [expertIndex, setExpertIndex] = useState(0);

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
    },
    {
      id: 3,
      title: '长期异地恋，如何保持感情？',
      description: '心理咨询师建议',
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tag: '情感',
      icon: <Heart size={14} />
    },
    {
      id: 4,
      title: '美国 vs. 加拿大，哪个更适合移民？',
      description: '海外达人分享经验',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tag: '海外生活',
      icon: <Globe size={14} />
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
      category: '法律'
    },
    {
      id: 2,
      name: '林咨询师',
      title: '情感心理专家',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      description: '婚恋关系、亲子关系咨询，执业8年',
      badge: '心理师认证',
      category: '情感'
    },
    {
      id: 3,
      name: '张先生',
      title: '租房达人',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      description: '10年租房经验，帮助过200+人解决租房问题',
      badge: '达人认证',
      category: '租房'
    },
    {
      id: 4,
      name: '李顾问',
      title: '保险规划师',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      description: '专注于个人、家庭保险规划，擅长理赔指导',
      badge: '顾问认证',
      category: '保险'
    }
  ];

  // Questions that users are asking
  const questions = [
    {
      id: 1,
      title: '租房合同中哪些条款需要特别注意？',
      asker: {
        name: '小明',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
      },
      description: '我即将签订一份租房合同，听说有很多陷阱，想请教有经验的人都需要注意哪些条款？',
      time: '2小时前',
      tags: ['租房', '合同', '法律'],
      answerName: '张先生',
      answerAvatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      viewCount: 1243,
      points: 50
    },
    {
      id: 2,
      title: '如何处理与房东的纠纷？押金不退怎么办？',
      asker: {
        name: '小红',
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
      },
      description: '我搬出去一个月了，房东以各种理由不退押金，该怎么维权？',
      time: '5小时前',
      tags: ['租房', '押金', '维权'],
      answerName: '王律师',
      answerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      viewCount: 896,
      points: 35
    },
    {
      id: 3,
      title: '异地恋三年，如何保持感情新鲜？',
      asker: {
        name: '小华',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
      },
      description: '我和男友异地三年了，最近感觉有点倦怠，有什么方法可以让感情保持活力？',
      time: '1天前',
      tags: ['情感', '异地恋', '关系维护'],
      answerName: '林咨询师',
      answerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      viewCount: 2156,
      points: 45
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePrevFeatured = () => {
    setFeaturedIndex((prev) => (prev === 0 ? featuredRecommendations.length - 1 : prev - 1));
  };

  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => (prev === featuredRecommendations.length - 1 ? 0 : prev + 1));
  };

  const handlePrevExpert = () => {
    setExpertIndex((prev) => (prev === 0 ? experts.length - 1 : prev - 1));
  };

  const handleNextExpert = () => {
    setExpertIndex((prev) => (prev === experts.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="app-container pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm">
        <div className="flex items-center h-12 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="text-white font-medium">生活服务</div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-4">
        {/* Search Bar */}
        <div className="relative mb-5">
          <input
            type="text"
            placeholder="搜索问题/达人/话题"
            className="search-input pr-10 w-full"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MessageCircle size={18} />
          </div>
        </div>

        {/* Category Tabs - Horizontal Scrolling */}
        <div className="mb-6">
          <div className="relative">
            <div className="flex space-x-3 overflow-x-auto hide-scrollbar pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="flex items-center gap-1 rounded-full border-app-orange text-app-orange bg-orange-50 hover:bg-orange-100 whitespace-nowrap"
                >
                  {category.icon}
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
            
            {/* Navigation arrows */}
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1"
              onClick={handlePrevFeatured}
            >
              <ChevronLeft size={18} className="text-gray-500" />
            </button>
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1"
              onClick={handleNextFeatured}
            >
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Featured Recommendations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-yellow-500" />
              <h2 className="text-lg font-bold">精选推荐</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-sm text-gray-500 flex items-center gap-1">
              查看更多
              <ChevronRight size={16} />
            </Button>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${featuredIndex * 100}%)` }}
              >
                {featuredRecommendations.map((item) => (
                  <div key={item.id} className="min-w-full px-1">
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-48">
                      <div className="relative h-full">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex items-center gap-1 mb-2">
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                              {item.icon}
                              {item.tag}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-white/90">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="flex justify-center space-x-2 mt-3">
              {featuredRecommendations.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === featuredIndex ? 'bg-app-orange' : 'bg-gray-300'
                  }`}
                  onClick={() => setFeaturedIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Expert Recommendations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-blue-500" />
              <h2 className="text-lg font-bold">推荐达人</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-sm text-gray-500 flex items-center gap-1">
              查看更多
              <ChevronRight size={16} />
            </Button>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${expertIndex * 100}%)` }}
              >
                {experts.map((expert) => (
                  <div key={expert.id} className="min-w-full px-1">
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="relative mr-3">
                            <img 
                              src={expert.avatar} 
                              alt={expert.name} 
                              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                            />
                            <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {expert.category}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1 mb-1">
                              <h3 className="font-bold">{expert.name}</h3>
                              <span className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                <Award size={10} />
                                {expert.badge}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{expert.title}</p>
                            <p className="text-gray-500 text-xs mb-3 line-clamp-2">{expert.description}</p>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-app-teal text-white rounded-full text-sm">
                              立即咨询
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1"
              onClick={handlePrevExpert}
            >
              <ChevronLeft size={18} className="text-gray-500" />
            </button>
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1"
              onClick={handleNextExpert}
            >
              <ChevronRight size={18} className="text-gray-500" />
            </button>
            
            {/* Navigation dots */}
            <div className="flex justify-center space-x-2 mt-3">
              {experts.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === expertIndex ? 'bg-app-blue' : 'bg-gray-300'
                  }`}
                  onClick={() => setExpertIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Questions Tab Section */}
        <div>
          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 bg-transparent gap-8">
              <TabsTrigger 
                value="questions" 
                className="data-[state=active]:text-app-text data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-app-orange rounded-none font-bold text-lg"
              >
                大家都在问
              </TabsTrigger>
              <TabsTrigger 
                value="experts" 
                className="data-[state=active]:text-app-text data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-app-orange rounded-none font-bold text-lg"
              >
                找TA问问
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-lg p-4 animate-pulse-soft shadow-md">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                questions.map((question) => (
                  <Card key={question.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base mb-2">{question.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{question.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={question.asker.avatar} 
                            alt={question.asker.name}
                            className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-gray-100" 
                          />
                          <div>
                            <div className="text-sm font-medium">{question.asker.name}</div>
                            <div className="text-xs text-gray-500">{question.time}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageCircle size={14} />
                            {question.viewCount}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          {question.tags.map((tag, index) => (
                            <span key={index} className="inline-block text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-600 font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <span className="flex items-center gap-1 bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded-full">
                          <Award size={12} className="text-yellow-500" />
                          {question.points} 积分
                        </span>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <img
                            src={question.answerAvatar}
                            alt={question.answerName}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{question.answerName}已回答</span>
                        </div>
                        
                        <Button 
                          className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white px-4 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm"
                        >
                          <MessageCircle size={14} />
                          回答
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="experts" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-lg p-4 animate-pulse-soft shadow-md">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-20 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                experts.map((expert) => (
                  <Card key={expert.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="relative mr-4">
                          <img 
                            src={expert.avatar} 
                            alt={expert.name} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {expert.category}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-1">
                            <h3 className="font-bold">{expert.name}</h3>
                            <span className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <Award size={10} />
                              {expert.badge}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{expert.title}</p>
                          <p className="text-gray-500 text-xs mb-3">{expert.description}</p>
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-app-blue text-white rounded-full text-sm">
                            向TA咨询
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Floating Ask Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button 
          className="rounded-full w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 shadow-lg text-white flex items-center justify-center"
        >
          <PlusCircle size={28} />
        </Button>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default LifestyleServices;
