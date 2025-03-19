
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CategorySection from '../components/CategorySection';
import ActivityCard from '../components/ActivityCard';
import QuestionCard from '../components/QuestionCard';
import BottomNav from '../components/BottomNav';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  return (
    <div className="app-container">
      <Navbar />
      
      <SearchBar />
      
      <CategorySection />
      
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-4 animate-fade-in animate-delay-2">
          问问热榜
        </h2>
        
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
      
      <div className="px-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button className="font-bold text-lg animate-fade-in animate-delay-3 text-app-text border-b-2 border-app-teal pb-1">大家都在问</button>
          <button className="font-bold text-lg animate-fade-in animate-delay-3 text-gray-400 pb-1">找TA问问</button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg p-4 animate-pulse-soft">
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
          <div className="space-y-3">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                {...question}
                delay={0.4 + index * 0.1}
              />
            ))}
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Index;
