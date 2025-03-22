
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowRight, Bell, Calendar as CalendarIcon } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'food', name: '美食烹饪', icon: '🍳' },
  { id: 'fitness', name: '健身健康', icon: '💪' },
  { id: 'parent', name: '育儿教育', icon: '👶' },
  { id: 'beauty', name: '美妆护肤', icon: '💄' },
  { id: 'home', name: '家居生活', icon: '🏠' },
  { id: 'travel', name: '旅行度假', icon: '✈️' },
  { id: 'pets', name: '宠物护理', icon: '🐾' },
  { id: 'finance', name: '个人理财', icon: '💰' },
];

const popularQuestions = [
  {
    id: '1',
    title: '如何科学减肥不反弹？',
    answers: 67,
    views: 4200,
  },
  {
    id: '2',
    title: '一岁宝宝的辅食怎么做才营养又美味？',
    answers: 42,
    views: 2800,
  },
  {
    id: '3',
    title: '有哪些高性价比的护肤品推荐？',
    answers: 56,
    views: 3100,
  },
  {
    id: '4',
    title: '适合年轻人的理财方式有哪些？',
    answers: 35,
    views: 1900,
  },
];

const experts = [
  {
    id: '1',
    name: '陈营养师',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    title: '资深营养健康顾问',
    institution: '健康生活研究中心',
    rating: 4.9,
    reviewCount: 132,
    price: 150,
  },
  {
    id: '2',
    name: '黄教练',
    avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
    title: '专业健身教练',
    institution: '动力健身中心',
    rating: 4.8,
    reviewCount: 98,
    price: 200,
  },
  {
    id: '3',
    name: '林医生',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    title: '儿科医生',
    institution: '阳光儿童医院',
    rating: 4.9,
    reviewCount: 176,
    price: 300,
  },
];

const services = [
  {
    id: '1',
    title: '个人营养饮食规划',
    provider: '陈营养师',
    description: '根据个人体质定制一周营养餐单',
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 87,
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '2',
    title: '家庭健身视频课程',
    provider: '黄教练',
    description: '居家健身指导，无需器械',
    price: 199,
    originalPrice: 299,
    rating: 4.7,
    reviewCount: 65,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '3',
    title: '儿童健康成长咨询',
    provider: '林医生',
    description: '专业儿科医生一对一指导',
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviewCount: 102,
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  },
];

const LifestyleServices = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommend');

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?category=${categoryId}`);
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handleExpertClick = (expertId: string) => {
    navigate(`/expert/${expertId}`);
  };

  const handleServiceClick = (serviceId: string) => {
    // For demonstration purposes, navigate to question detail
    navigate(`/question/${serviceId}`);
  };

  const handleSeeAll = (section: string) => {
    navigate(`/search?section=${section}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="pt-12">
        {/* Header with search and notifications */}
        <div className="bg-white p-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold">生活服务</h1>
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/calendar')}
              className="text-gray-600"
            >
              <CalendarIcon size={24} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/notifications')}
              className="text-gray-600"
            >
              <Bell size={24} />
            </Button>
          </div>
        </div>
        
        {/* Search bar */}
        <SearchBar 
          placeholder="搜索生活相关问题或服务..." 
          onSearch={(value) => navigate(`/search?q=${encodeURIComponent(value)}`)}
        />
        
        {/* Categories grid */}
        <div className="bg-white p-4 mb-2">
          <div className="grid grid-cols-4 gap-3">
            {categories.map(category => (
              <div 
                key={category.id}
                className="flex flex-col items-center justify-center p-2 cursor-pointer"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl mb-1">
                  {category.icon}
                </div>
                <span className="text-xs text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tabs for content sections */}
        <div className="bg-white mb-2">
          <Tabs defaultValue="recommend" onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start px-2 h-12 bg-transparent border-b border-gray-200">
              <TabsTrigger 
                value="recommend" 
                className="data-[state=active]:text-app-blue data-[state=active]:border-b-2 data-[state=active]:border-app-blue rounded-none px-4"
              >
                推荐
              </TabsTrigger>
              <TabsTrigger 
                value="questions" 
                className="data-[state=active]:text-app-blue data-[state=active]:border-b-2 data-[state=active]:border-app-blue rounded-none px-4"
              >
                问题
              </TabsTrigger>
              <TabsTrigger 
                value="experts" 
                className="data-[state=active]:text-app-blue data-[state=active]:border-b-2 data-[state=active]:border-app-blue rounded-none px-4"
              >
                专家
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="data-[state=active]:text-app-blue data-[state=active]:border-b-2 data-[state=active]:border-app-blue rounded-none px-4"
              >
                服务
              </TabsTrigger>
            </TabsList>
            
            {/* Recommend Tab Content */}
            <TabsContent value="recommend" className="m-0">
              {/* Popular Questions Section */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">热门问题</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500"
                    onClick={() => handleSeeAll('questions')}
                  >
                    查看全部 <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {popularQuestions.slice(0, 2).map(question => (
                    <div 
                      key={question.id}
                      className="bg-gray-50 p-3 rounded-lg cursor-pointer"
                      onClick={() => handleQuestionClick(question.id)}
                    >
                      <h3 className="text-gray-800 font-medium">{question.title}</h3>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>{question.answers} 回答</span>
                        <span className="mx-2">•</span>
                        <span>{question.views} 浏览</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Featured Experts Section */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">推荐专家</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500"
                    onClick={() => handleSeeAll('experts')}
                  >
                    查看全部 <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {experts.slice(0, 2).map(expert => (
                    <div 
                      key={expert.id}
                      className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleExpertClick(expert.id)}
                    >
                      <img 
                        src={expert.avatar} 
                        alt={expert.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h3 className="text-gray-800 font-medium">{expert.name}</h3>
                        <p className="text-xs text-gray-500">{expert.title}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500 text-xs">★</span>
                          <span className="text-xs text-gray-700 ml-1">{expert.rating}</span>
                          <span className="text-xs text-gray-500 ml-2">{expert.reviewCount} 评价</span>
                        </div>
                      </div>
                      <div className="ml-auto text-app-blue font-medium">
                        ¥{expert.price}/次
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Lifestyle Services Section */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">生活服务</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500"
                    onClick={() => handleSeeAll('services')}
                  >
                    查看全部 <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {services.slice(0, 2).map(service => (
                    <div 
                      key={service.id}
                      className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => handleServiceClick(service.id)}
                    >
                      <div className="h-32 bg-gray-200 relative">
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <h3 className="text-white font-medium">{service.title}</h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500 mb-2">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">提供者: {service.provider}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500 text-xs">★</span>
                            <span className="text-xs text-gray-700 ml-1">{service.rating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <span className="text-app-blue font-medium">¥{service.price}</span>
                            <span className="text-xs text-gray-500 line-through ml-1">¥{service.originalPrice}</span>
                          </div>
                          <span className="text-xs text-gray-500">{service.reviewCount} 评价</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Questions Tab Content */}
            <TabsContent value="questions" className="m-0 p-4">
              <div className="space-y-3">
                {popularQuestions.map(question => (
                  <div 
                    key={question.id}
                    className="bg-gray-50 p-3 rounded-lg cursor-pointer"
                    onClick={() => handleQuestionClick(question.id)}
                  >
                    <h3 className="text-gray-800 font-medium">{question.title}</h3>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>{question.answers} 回答</span>
                      <span className="mx-2">•</span>
                      <span>{question.views} 浏览</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Experts Tab Content */}
            <TabsContent value="experts" className="m-0 p-4">
              <div className="space-y-3">
                {experts.map(expert => (
                  <div 
                    key={expert.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleExpertClick(expert.id)}
                  >
                    <img 
                      src={expert.avatar} 
                      alt={expert.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h3 className="text-gray-800 font-medium">{expert.name}</h3>
                      <p className="text-xs text-gray-500">{expert.title}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-xs text-gray-700 ml-1">{expert.rating}</span>
                        <span className="text-xs text-gray-500 ml-2">{expert.reviewCount} 评价</span>
                      </div>
                    </div>
                    <div className="ml-auto text-app-blue font-medium">
                      ¥{expert.price}/次
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Services Tab Content */}
            <TabsContent value="services" className="m-0 p-4">
              <div className="space-y-4">
                {services.map(service => (
                  <div 
                    key={service.id}
                    className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleServiceClick(service.id)}
                  >
                    <div className="h-32 bg-gray-200 relative">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <h3 className="text-white font-medium">{service.title}</h3>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-500 mb-2">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">提供者: {service.provider}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-xs">★</span>
                          <span className="text-xs text-gray-700 ml-1">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <span className="text-app-blue font-medium">¥{service.price}</span>
                          <span className="text-xs text-gray-500 line-through ml-1">¥{service.originalPrice}</span>
                        </div>
                        <span className="text-xs text-gray-500">{service.reviewCount} 评价</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default LifestyleServices;
