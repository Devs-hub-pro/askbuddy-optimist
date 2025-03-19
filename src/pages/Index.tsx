
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CategorySection from '../components/CategorySection';
import ActivityCard from '../components/ActivityCard';
import QuestionCard from '../components/QuestionCard';
import BottomNav from '../components/BottomNav';
import { Sparkles, MessageSquare, Award, Clock, Package, Users } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface LocationState {
  location?: string;
}

const Index = () => {
  const routeLocation = useLocation();
  const locationState = routeLocation.state as LocationState;
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'everyone' | 'experts'>('everyone');
  const [currentLocation, setCurrentLocation] = useState<string>('深圳');
  
  useEffect(() => {
    const storedLocation = localStorage.getItem('currentLocation') || '深圳';
    setCurrentLocation(storedLocation);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (locationState?.location) {
      setCurrentLocation(locationState.location);
    }
  }, [locationState]);
  
  const activities = [
    {
      id: '1',
      title: '大学生灵活就业圈',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80'
    },
    {
      id: '2',
      title: '留学申请季交流空间',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80'
    }
  ];
  
  const questions = [
    {
      id: '1',
      title: '高考填报志愿热门问题',
      description: '面对众多院校和专业选择，如何根据自己的分数、兴趣做出最优选择？分享经验...',
      asker: {
        name: '李明',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      time: '2小时前',
      tags: ['高考', '志愿填报'],
      points: 50,
      viewCount: '2.5k',
      answerName: '张老师',
      answerAvatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    {
      id: '2',
      title: '留学申请的必备条件',
      description: '想申请美国Top30名校研究生，除了GPA和语言成绩，还需要准备哪些材料？',
      asker: {
        name: '王芳',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      time: '5小时前',
      tags: ['留学', '申请'],
      points: 30,
      viewCount: '1.8k'
    },
    {
      id: '3',
      title: '如何选择最佳职业路径',
      description: '毕业后是进国企还是私企？如何根据自身情况做出规划？',
      asker: {
        name: '张伟',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      time: '1天前',
      tags: ['职业发展', '路径选择'],
      points: 40,
      viewCount: '3.5k'
    }
  ];

  const featuredExpert = {
    id: '1',
    name: '张同学',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    title: '北大硕士 | 出国党',
    description: '专注留学申请文书指导，斯坦福offer获得者',
    tags: ['留学', '文书', '面试'],
    rating: 4.9,
    responseRate: '98%',
    orderCount: '126单'
  };

  const handleAskMe = (expertName: string) => {
    console.log(`Opening chat with ${expertName}`);
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 pb-20">
      <Navbar location={currentLocation} />
      
      <div className="px-4 py-6 bg-app-light-bg animate-fade-in">
        <div className="flex items-center space-x-2 mb-4">
          <Users size={22} className="text-app-blue" />
          <h1 className="text-xl font-bold text-gray-800">找人问问</h1>
          <p className="text-gray-600 text-sm">AI无法回答的，就找人问问！</p>
        </div>
        
        <SearchBar />
      </div>
      
      <CategorySection />
      
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-yellow-500" />
          <h2 className="text-lg font-bold animate-fade-in animate-delay-2">
            问问热榜
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {activities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              title={activity.title}
              imageUrl={activity.imageUrl}
              delay={0.3 + index * 0.1}
            />
          ))}
        </div>
      </div>
      
      <div className="px-4 mb-20">
        <div className="relative mb-6 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-gray-100">
          <div className="flex gap-6">
            <button 
              className={`font-bold text-lg pb-2 relative ${activeTab === 'everyone' ? 'text-app-text' : 'text-gray-400'}`}
              onClick={() => setActiveTab('everyone')}
            >
              大家都在问
              {activeTab === 'everyone' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-teal to-app-blue z-10"></span>
              )}
            </button>
            <button 
              className={`font-bold text-lg pb-2 relative ${activeTab === 'experts' ? 'text-app-text' : 'text-gray-400'}`}
              onClick={() => setActiveTab('experts')}
            >
              找TA问问
              {activeTab === 'experts' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-teal to-app-blue z-10"></span>
              )}
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {activeTab === 'everyone' ? (
              [1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-xl p-4 animate-pulse-soft shadow-md">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-5 animate-pulse-soft shadow-md">
                <div className="flex items-center mb-4 gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-full w-full mt-4"></div>
              </div>
            )}
          </div>
        ) : (
          activeTab === 'everyone' ? (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  {...question}
                  delay={0.4 + index * 0.1}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar className="w-10 h-10 border border-green-50">
                    <AvatarImage src={featuredExpert.avatar} alt={featuredExpert.name} className="object-cover" />
                    <AvatarFallback>{featuredExpert.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{featuredExpert.name}</h3>
                    <p className="text-xs text-green-600">{featuredExpert.title}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-yellow-500 gap-1">
                    <Award size={12} />
                    <span className="text-xs font-medium">{featuredExpert.rating}</span>
                  </div>
                  <div className="flex items-center text-blue-500 gap-1 text-xs">
                    <Clock size={10} />
                    <span>{featuredExpert.responseRate}</span>
                  </div>
                  <div className="flex items-center text-green-500 gap-1 text-xs">
                    <Package size={10} />
                    <span>{featuredExpert.orderCount}</span>
                  </div>
                </div>
              </div>

              <div className="flex mt-2">
                <p className="text-xs text-gray-700 border-l-2 border-green-200 pl-2 py-0.5 bg-green-50/50 rounded-r-md flex-1 mr-2">
                  {featuredExpert.description}
                </p>
                
                <button 
                  onClick={() => handleAskMe(featuredExpert.name)}
                  className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageSquare size={10} />
                  找我问问
                </button>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-2">
                {featuredExpert.tags.map((tag, index) => (
                  <span key={index} className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Index;
