
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CategorySection from '../components/CategorySection';
import ActivityCard from '../components/ActivityCard';
import QuestionCard from '../components/QuestionCard';
import BottomNav from '../components/BottomNav';
import { Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    // Get initial location from localStorage or use default
    const storedLocation = localStorage.getItem('currentLocation') || '深圳';
    setCurrentLocation(storedLocation);
    
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Update location when coming back from city selector
    if (locationState?.location) {
      setCurrentLocation(locationState.location);
    }
  }, [locationState]);
  
  // Sample activities data
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
  
  // Sample questions data
  const questions = [
    {
      id: '1',
      title: '高考填报志愿热门问题',
      asker: {
        name: '李明',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      time: '2小时前',
      tags: ['高考', '志愿填报'],
      points: 50
    },
    {
      id: '2',
      title: '留学申请的必备条件',
      asker: {
        name: '王芳',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      time: '5小时前',
      tags: ['留学', '申请'],
      points: 30
    },
    {
      id: '3',
      title: '如何选择最佳职业路径',
      asker: {
        name: '张伟',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      time: '1天前',
      tags: ['职业发展', '路径选择'],
      points: 40
    }
  ];

  // Sample experts data
  const experts = [
    {
      id: '1',
      name: '张同学',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: '北大硕士 | 出国党',
      description: '专注留学申请文书指导，斯坦福offer获得者',
      tags: ['留学', '文书', '面试'],
    },
    {
      id: '2',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '清华博士 | 考研规划',
      description: '5年考研辅导经验，擅长数学与专业课',
      tags: ['考研', '数学', '规划'],
    },
    {
      id: '3',
      name: '王老师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '高考志愿规划师',
      description: '10年高考志愿填报指导经验，专精各省份政策',
      tags: ['高考', '志愿填报', '专业选择'],
    },
    {
      id: '4',
      name: '李明',
      avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
      title: '清华研究生',
      description: '考研英语特长，英语六级高分，专注英语学习方法',
      tags: ['考研', '英语', '备考'],
    }
  ];

  const handleAskMe = (expertName: string) => {
    console.log(`Opening chat with ${expertName}`);
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30">
      <Navbar location={currentLocation} />
      
      <SearchBar />
      
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
              // Loading state for questions
              [1, 2, 3].map((item) => (
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
              ))
            ) : (
              // Loading state for experts
              <div className="grid grid-cols-2 gap-3">
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
            )}
          </div>
        ) : (
          activeTab === 'everyone' ? (
            // Questions tab content
            <div className="space-y-3">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  {...question}
                  delay={0.4 + index * 0.1}
                />
              ))}
            </div>
          ) : (
            // Experts tab content - new grid layout similar to EducationLearning page
            <div className="grid grid-cols-2 gap-3">
              {experts.map((expert, index) => (
                <Card key={expert.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center mb-2">
                      <Avatar className="w-10 h-10 mr-2">
                        <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{expert.name}</p>
                        <p className="text-xs text-gray-500">{expert.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 mb-2 line-clamp-2">{expert.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {expert.tags.map((tag, index) => (
                        <span key={index} className="bg-green-50 text-green-600 text-xs px-1.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button 
                      onClick={() => handleAskMe(expert.name)}
                      variant="outline" 
                      size="sm"
                      className="w-full text-green-600 border-green-200 bg-green-50 hover:bg-green-100 rounded-full text-xs py-1 h-auto flex items-center gap-1 justify-center"
                    >
                      <MessageSquare size={14} />
                      找我问问
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Index;
