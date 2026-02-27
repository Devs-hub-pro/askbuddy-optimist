import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CategorySection from '../components/CategorySection';
import ActivityCard from '../components/ActivityCard';
import QuestionCard from '../components/QuestionCard';
import BottomNav from '../components/BottomNav';
import { Sparkles, MessageSquare, Award, Clock, Package, Users, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import ExpertDetailDialog from '../components/ExpertDetailDialog';
import { useQuestions } from '@/hooks/useQuestions';
import { useHotTopics } from '@/hooks/useHotTopics';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface LocationState {
  location?: string;
}

const Index = () => {
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const locationState = routeLocation.state as LocationState;
  
  const [activeTab, setActiveTab] = useState<'everyone' | 'experts'>('everyone');
  const [currentLocation, setCurrentLocation] = useState<string>('深圳');
  
  // 使用真实数据
  const { data: questions, isLoading } = useQuestions();
  const { data: hotTopics, isLoading: isLoadingTopics } = useHotTopics();
  
  useEffect(() => {
    const storedLocation = localStorage.getItem('currentLocation') || '深圳';
    setCurrentLocation(storedLocation);
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

  // 格式化时间
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: zhCN 
      });
    } catch {
      return '刚刚';
    }
  };

  // 格式化浏览量
  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  // Define multiple experts with different information
  const experts = [
    {
      id: '1',
      name: '张同学',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: '北大硕士 | 出国党',
      description: '专注留学申请文书指导，斯坦福offer���得者。我有多年指导经验，曾帮助超过50名学生申请到世界顶尖大学。擅长个人陈述、研究计划书撰写，精通面试技巧指导。我相信每个学生都有自己的闪光点，只要找到合适的表达方式，就能在激烈的申请中脱颖而出。我希望通过我的专业知识和经验，帮助每位学生实现留学梦想。',
      tags: ['留学', '文书', '面试'],
      rating: 4.9,
      responseRate: '98%',
      orderCount: '126单',
      education: ['北京大学 | 教育学硕士', '清华大学 | 英语文学学士'],
      experience: ['某知名留学机构 | 高级顾问', '斯坦福大学 | 校友面试官']
    },
    {
      id: '2',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '清华博士 | 考研规划',
      description: '5年考研辅导经验，擅长数学与专业课。我曾帮助上百名考生成功上岸，针对考研数学和计算机专业课有独到的教学和复习方法。我深知考研的艰辛，会尽力为每一位考生提供个性化的学习计划和复习方案。如果你在考研路上遇到困难，欢迎随时向我咨询。',
      tags: ['考研', '数学', '规划'],
      rating: 4.8,
      responseRate: '95%',
      orderCount: '210单',
      education: ['清华大学 | 计算机科学博士', '清华大学 | 计算机科学硕士'],
      experience: ['某培训机构 | 考研数学老师 5年', '某高校 | 助教 2年']
    },
    {
      id: '3',
      name: '王老师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '高考志愿规划师',
      description: '10年高考志愿填报指导经验，专精各省份政策。我深入研究过全国各省份的高考政策和各大高校的招生情况，能够根据考生的分数、兴趣特长和家庭意愿，制定最优的志愿填报方案，提高理想院校的录取概率。如果你对填报志愿有困惑，欢迎随时咨询我。',
      tags: ['高考', '志愿填报', '专业选择'],
      rating: 4.7,
      responseRate: '92%',
      orderCount: '185单',
      education: ['复旦大学 | 教育学硕士', '华东师范大学 | 教育学学士'],
      experience: ['某教育局 | 教研员 5年', '某高考志愿填报平台 | 高级顾问 7年']
    }
  ];

  const handleViewQuestionDetail = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handleViewExpertProfile = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 pb-16">
      <Navbar location={currentLocation} />
      
      <div className="py-4 bg-app-light-bg animate-fade-in">
        <SearchBar />
      </div>
      
      <CategorySection />
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 px-4">
          <Sparkles size={18} className="text-yellow-500" />
          <h2 className="text-lg font-bold animate-fade-in animate-delay-2">
            问问热榜
          </h2>
        </div>
        
        {isLoadingTopics ? (
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-40 h-32 bg-muted animate-pulse rounded-xl shrink-0" />
            ))}
          </div>
        ) : hotTopics && hotTopics.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
            {hotTopics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => navigate(`/topic/${topic.id}`)}
                className="cursor-pointer shrink-0 w-40 snap-start opacity-0 animate-slide-in-left"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
              >
                <ActivityCard
                  title={topic.title}
                  imageUrl={topic.cover_image || `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&h=225&q=80`}
                  delay={0}
                  discussionCount={topic.discussions_count}
                  compact
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {activities.map((activity, index) => (
              <div key={activity.id} className="shrink-0 w-40">
                <ActivityCard
                  title={activity.title}
                  imageUrl={activity.imageUrl}
                  delay={0.3 + index * 0.1}
                  compact
                />
              </div>
            ))}
          </div>
        )}
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
              {questions && questions.length > 0 ? (
                questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="opacity-0 animate-slide-up"
                    style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
                  >
                    <QuestionCard
                      id={question.id}
                      title={question.title}
                      description={question.content || undefined}
                      asker={{
                        name: question.profile_nickname || '匿名用户',
                        avatar: question.profile_avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'
                      }}
                      time={formatTime(question.created_at)}
                      tags={question.tags || []}
                      points={question.bounty_points}
                      viewCount={formatViewCount(question.view_count)}
                      delay={0.4 + index * 0.1}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-2">暂无问题</p>
                  <p className="text-sm">点击右下角"+"发布第一个问题吧</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {experts.map((expert, index) => (
                <div
                  key={expert.id}
                  className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewExpertProfile(expert.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-10 h-10 border border-green-50">
                        <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">{expert.name}</h3>
                        <p className="text-xs text-green-600">{expert.title}</p>
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
                        <Package size={10} />
                        <span>{expert.orderCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-2">
                    <p className="text-xs text-gray-700 border-l-2 border-green-200 pl-2 py-0.5 bg-green-50/50 rounded-r-md flex-1 mr-2 line-clamp-2">
                      {expert.description}
                    </p>
                    
                    <ExpertDetailDialog {...expert}>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 h-auto"
                      >
                        <MessageSquare size={10} />
                        找我问问
                      </Button>
                    </ExpertDetailDialog>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {expert.tags.map((tag, index) => (
                      <span key={index} className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
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
