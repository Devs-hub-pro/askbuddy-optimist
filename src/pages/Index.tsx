import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import SearchBar from '../components/SearchBar';
import CategorySection from '../components/CategorySection';
import QuestionCard from '../components/QuestionCard';
import BottomNav from '../components/BottomNav';
import { Sparkles, MessageSquare, ArrowUpRight, Bell, MapPin, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuestions } from '@/hooks/useQuestions';
import { useHotTopics } from '@/hooks/useHotTopics';
import { useExperts } from '@/hooks/useExperts';
import { useUnreadCount } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { demoExperts, demoQuestions } from '@/lib/demoData';
import PageStateCard from '@/components/common/PageStateCard';
import ChannelExpertCard from '@/components/channel/ChannelExpertCard';

interface LocationState {
  location?: string;
}

const Index = () => {
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const locationState = routeLocation.state as LocationState;
  
  const [activeTab, setActiveTab] = useState<'everyone' | 'experts'>('everyone');
  const [currentLocation, setCurrentLocation] = useState<string>('深圳');
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
  
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

  useEffect(() => {
    const onScroll = () => {
      setIsSearchCollapsed(window.scrollY > 28);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      education: Array.isArray(e.education) ? e.education.map((item) => (typeof item === 'string' ? item : `${item.school || ''} ${item.degree || ''}`.trim())) : [],
      experience: Array.isArray(e.experience) ? e.experience.map((item) => (typeof item === 'string' ? item : `${item.company || ''} ${item.position || item.title || ''}`.trim())) : [],
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

  const fixedHeader = (
    <div className="fixed left-1/2 top-0 z-[90] w-full max-w-md -translate-x-1/2 shadow-sm">
      <div style={{ background: 'rgb(121, 213, 199)' }}>
        <div style={{ height: 'env(safe-area-inset-top)' }} />
        <div className="flex h-12 items-center justify-between px-4">
          <div className="text-[17px] font-semibold text-white">问问</div>
          <div className="flex items-center gap-2">
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-all duration-200 ${
                isSearchCollapsed ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
              }`}
              onClick={() => navigate('/search')}
              aria-label="打开搜索"
            >
              <Search size={16} />
            </button>
            <button className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white" onClick={() => navigate('/notifications')}>
              <Bell size={16} />
              {(unreadCount || 0) > 0 ? (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
              ) : null}
            </button>
            <button
              className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs text-white"
              onClick={() => navigate('/city-selector')}
            >
              <MapPin size={12} className="text-white" />
              <span>{currentLocation}</span>
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
        <div
          className={`overflow-hidden border-t border-white/20 bg-[rgb(223,245,239)] transition-all duration-200 ${
            isSearchCollapsed ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'
          }`}
        >
          <div className="py-3">
            <SearchBar className="py-0" clickToNavigate />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container bg-white pb-16">
      {typeof document !== 'undefined' ? createPortal(fixedHeader, document.body) : null}

      <div
        className="transition-[padding-top] duration-200"
        style={{
          paddingTop: isSearchCollapsed
            ? 'calc(env(safe-area-inset-top) + 3.5rem)'
            : 'calc(env(safe-area-inset-top) + 11rem)'
        }}
      >
        <CategorySection />
      
        <div className="mb-6 pt-3">
        <div className="mb-4 flex items-start justify-between gap-3 px-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff7df]">
                <Sparkles size={16} className="text-[#e0a100]" />
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
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-[3px] bg-gradient-to-r from-[#54d9c7] to-[#2ac3ff] z-10 rounded-full transition-all duration-300 ease-in-out"></span>
              )}
            </button>
            <button 
              className={`pb-3.5 text-base font-semibold relative transition-colors ${activeTab === 'experts' ? 'text-app-text' : 'text-gray-400'}`}
              onClick={() => setActiveTab('experts')}
            >
              找TA问问
              {activeTab === 'experts' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-[3px] bg-gradient-to-r from-[#54d9c7] to-[#2ac3ff] z-10 rounded-full transition-all duration-300 ease-in-out"></span>
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
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
                >
                  <ChannelExpertCard
                    expert={expert}
                    accentBorderClass="border-[#d9efe9]"
                    accentTextClass="text-app-teal"
                    accentTagClass="bg-[rgb(236,251,247)] text-[rgb(73,170,155)] border border-[rgb(205,239,231)]"
                    accentSummaryClass="border-[rgb(160,237,224)] bg-[rgb(236,251,247)]"
                    ctaClassName="bg-gradient-to-r from-app-teal to-cyan-400"
                    onOpen={() => handleViewExpertProfile(expert.id)}
                    onConsult={() => navigate(`/expert/${expert.id}`)}
                  />
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
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Index;
