import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CategorySection from '../components/CategorySection';
import QuestionCard from '../components/QuestionCard';
import BottomNav from '../components/BottomNav';
import { Sparkles, MessageSquare, Award, Clock, Package, ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useQuestions } from '@/hooks/useQuestions';
import { useHotTopics } from '@/hooks/useHotTopics';
import { useExperts } from '@/hooks/useExperts';
import { useUnreadCount } from '@/hooks/useNotifications';
import { formatTime, formatViewCount } from '@/utils/format';
import { demoExperts, demoQuestions } from '@/lib/demoData';
import PageStateCard from '@/components/common/PageStateCard';

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
  const { data: dbExperts } = useExperts();
  const { data: unreadCount } = useUnreadCount();
  
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
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80',
      description: '灵活就业、副业尝试、真实岗位体验都在这里持续更新。'
    },
    {
      id: '2',
      title: '留学申请季交流空间',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80',
      description: '把申请时间线、文书经验和 offer 节奏做成一份可持续更新的热榜专题。'
    }
  ];


  const experts = [
    ...demoExperts.map((e) => ({
      id: e.id,
      name: e.nickname || '专家',
      avatar: e.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
      title: e.title,
      description: e.bio || '',
      tags: e.tags,
      rating: Number(e.rating || 0),
      responseRate: `${Number(e.response_rate || 0)}%`,
      orderCount: `${e.order_count || 0}单`,
      consultationPrice: e.consultation_price || 50,
      location: e.location || '未设置地区',
      education: Array.isArray(e.education) ? e.education.map((item: any) => (typeof item === 'string' ? item : `${item.school || ''} ${item.degree || ''}`.trim())) : [],
      experience: Array.isArray(e.experience) ? e.experience.map((item: any) => (typeof item === 'string' ? item : `${item.company || ''} ${item.position || item.title || ''}`.trim())) : [],
      verified: e.is_verified,
    })),
    ...(dbExperts || []).map((e) => ({
    id: e.id,
    name: e.nickname || '专家',
    avatar: e.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
    title: e.title,
    description: e.bio || '',
    tags: e.tags,
    rating: Number(e.rating || 0),
    responseRate: `${Number(e.response_rate || 0)}%`,
    orderCount: `${e.order_count || 0}单`,
    consultationPrice: e.consultation_price || 50,
    location: e.location || '未设置地区',
    education: Array.isArray(e.education) ? e.education.map((item) => (typeof item === 'string' ? item : `${item.school || ''} ${item.degree || ''}`.trim())) : [],
    experience: Array.isArray(e.experience) ? e.experience.map((item) => (typeof item === 'string' ? item : `${item.company || ''} ${item.position || item.title || ''}`.trim())) : [],
    verified: e.is_verified,
  })),
  ];

  const homepageQuestions = [...demoQuestions, ...(questions || [])];

  const handleViewQuestionDetail = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handleViewExpertProfile = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
  };

  return (
    <div className="app-container bg-background pb-16">
      <Navbar location={currentLocation} />
      
      <div
        className="sticky z-40 border-b border-app-border-light shadow-[0_1px_0_hsl(var(--foreground)/0.03)]"
        style={{
          top: 'calc(env(safe-area-inset-top) + 48px)',
          background: 'hsl(var(--app-header-light))',
        }}
      >
        <div className="py-3 animate-fade-in">
          <SearchBar className="py-0" clickToNavigate />
        </div>
      </div>
      
      <CategorySection />
      
      <div className="mb-6 pt-3">
        <div className="mb-4 flex items-start justify-between gap-3 px-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-app-warm">
                <Sparkles size={16} className="text-app-warm-foreground" />
              </span>
              <h2 className="text-lg font-bold tracking-[-0.01em] animate-fade-in animate-delay-2">
                问问热榜
              </h2>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              左右滑动浏览专题，点进去可继续阅读和讨论。
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full px-3 text-xs text-primary hover:bg-primary/10"
            onClick={() => hotTopics?.[0] && navigate(`/topic/${hotTopics[0].id}`)}
            disabled={!hotTopics || hotTopics.length === 0}
          >
            查看专题
          </Button>
        </div>
        
        {isLoadingTopics ? (
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-[280px] shrink-0 animate-pulse-soft">
                <div className="surface-card overflow-hidden rounded-3xl">
                  <div className="h-[124px] bg-slate-100" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 rounded-full bg-slate-100" />
                    <div className="h-3 w-full rounded-full bg-slate-100" />
                    <div className="h-3 w-5/6 rounded-full bg-slate-100" />
                    <div className="h-3 w-1/2 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hotTopics && hotTopics.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
            {hotTopics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => navigate(`/topic/${topic.id}`)}
                className="cursor-pointer shrink-0 w-[280px] snap-start opacity-0 animate-slide-in-left"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div className="surface-card overflow-hidden rounded-3xl">
                  <div className="relative h-[112px]">
                    <img
                      src={topic.cover_image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80'}
                      alt={topic.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-700">
                        热榜专题
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] text-white">
                        <MessageSquare size={12} />
                        {topic.discussions_count}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[15px] font-semibold leading-6 text-slate-900">{topic.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {topic.description || '点击进入专题详情，查看完整内容并继续参与讨论。'}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{topic.participants_count} 人正在围观</span>
                      <span className="flex items-center gap-1 font-medium text-primary">
                        点进查看
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
            {activities.map((activity, index) => (
              <div key={activity.id} className="shrink-0 w-[280px] snap-start">
                <div className="surface-card overflow-hidden rounded-3xl">
                  <div className="relative h-[112px]">
                    <img
                      src={activity.imageUrl}
                      alt={activity.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-700">
                        推荐专题
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[15px] font-semibold leading-6 text-slate-900">{activity.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{activity.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>下滑即可评论讨论</span>
                      <span className="flex items-center gap-1 font-medium text-primary">
                        即将开放
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white px-4 pb-20 pt-2">
        <div className="relative mb-5 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-gray-200">
          <div className="flex gap-6">
            <button 
              className={`pb-3.5 text-base font-semibold relative transition-colors ${activeTab === 'everyone' ? 'text-app-text' : 'text-gray-400'}`}
              onClick={() => setActiveTab('everyone')}
            >
              大家都在问
              {activeTab === 'everyone' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-[3px] bg-gradient-to-r from-app-header to-primary z-10 rounded-full transition-all duration-300 ease-in-out"></span>
              )}
            </button>
            <button 
              className={`pb-3.5 text-base font-semibold relative transition-colors ${activeTab === 'experts' ? 'text-app-text' : 'text-gray-400'}`}
              onClick={() => setActiveTab('experts')}
            >
              找TA问问
              {activeTab === 'experts' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-[3px] bg-gradient-to-r from-app-header to-primary z-10 rounded-full transition-all duration-300 ease-in-out"></span>
              )}
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {activeTab === 'everyone' ? (
              [1, 2, 3].map((item) => (
                <div key={item} className="surface-card rounded-2xl p-4 animate-pulse-soft shadow-sm">
                  <div className="mb-3 h-5 w-3/4 rounded-full bg-slate-100"></div>
                  <div className="mb-3 h-3 w-full rounded-full bg-slate-100"></div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                    <div>
                      <div className="h-3 bg-slate-100 rounded-full w-24"></div>
                      <div className="h-3 bg-slate-100 rounded-full w-16 mt-1"></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <div className="h-4 bg-slate-100 rounded-full w-12"></div>
                      <div className="h-4 bg-slate-100 rounded-full w-12"></div>
                    </div>
                    <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="surface-card rounded-2xl p-5 animate-pulse-soft shadow-sm">
                <div className="flex items-center mb-4 gap-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded-full w-1/3 mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded-full w-1/2 mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded-full w-full"></div>
                  <div className="h-3 bg-slate-100 rounded-full w-5/6"></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                  <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                </div>
                <div className="h-10 bg-slate-100 rounded-full w-full mt-4"></div>
              </div>
            )}
          </div>
        ) : (
          activeTab === 'everyone' ? (
            <div className="space-y-4">
              {homepageQuestions.length > 0 ? (
                homepageQuestions.map((question, index) => (
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
                <PageStateCard
                  compact
                  title="还没有问题"
                  description="点击右下角“+”发布第一个问题。"
                />
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              {experts.length > 0 ? experts.map((expert, index) => (
                <div
                  key={expert.id}
                  className="surface-card rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleViewExpertProfile(expert.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-10 h-10 border border-green-50">
                        <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                          <h3 className="text-sm font-semibold leading-5 text-gray-800">{expert.name}</h3>
                          <p className="text-xs leading-5 text-green-600">{expert.title}</p>
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

                  <div className="flex mt-2.5">
                    <p className="text-xs leading-5 text-gray-700 border-l-2 border-green-200 pl-2 py-0.5 bg-green-50/50 rounded-r-md flex-1 mr-2 line-clamp-2">
                      {expert.description}
                    </p>
                    
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/expert/${expert.id}`);
                        }}
                      className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 h-auto"
                      >
                      <MessageSquare size={10} />
                      找我问问
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {expert.tags.map((tag, index) => (
                      <span key={index} className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )) : (
                <PageStateCard
                  compact
                  title="还没有可展示的专家"
                  description="先去“发布技能”完善专家资料。"
                />
              )}
            </div>
          )
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Index;
