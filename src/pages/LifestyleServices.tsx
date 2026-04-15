
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  Home, 
  Briefcase, 
  Heart, 
  Umbrella, 
  Globe,
  Bell,
  MessageSquare,
  MessageCircle,
  Plus,
  Clock,
  Award,
  User,
  Users,
  Eye,
  ChevronRight
} from 'lucide-react';
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import QuestionCard from '@/components/QuestionCard';
import { useQuestions } from '@/hooks/useQuestions';
import { useExperts } from '@/hooks/useExperts';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ChannelPageScaffold from '@/components/channel/ChannelPageScaffold';
import ChannelExpertCard from '@/components/channel/ChannelExpertCard';
import ChannelQuestionSkeleton from '@/components/channel/ChannelQuestionSkeleton';
import ChannelExpertSkeleton from '@/components/channel/ChannelExpertSkeleton';
import ChannelFloatingActionButton from '@/components/channel/ChannelFloatingActionButton';
import { demoExperts, demoQuestions } from '@/lib/demoData';
import PageStateCard from '@/components/common/PageStateCard';
import {
  filterExpertsByCategory,
  mapDemoExpertsByChannel,
  mapExpertToUIModel,
  mapQuestionToUIModel,
  mergeUniqueById,
} from '@/lib/adapters/contentAdapters';
import { buildFromState, navigateBackOr } from '@/utils/navigation';
import { usePageScrollMemory } from '@/hooks/usePageScrollMemory';

const LifestyleServices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(() => sessionStorage.getItem('channel:lifestyle:category') || 'all');
  const [activeTab, setActiveTab] = useState<'everyone' | 'experts'>(() => {
    const cached = sessionStorage.getItem('tab:lifestyle');
    return cached === 'experts' ? 'experts' : 'everyone';
  });
  const categoryRef = useRef<HTMLDivElement>(null);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  usePageScrollMemory('lifestyle');
  
  const {
    data: questions,
    isLoading,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuestions('生活服务');
  const {
    data: dbExperts,
    isLoading: isLoadingExperts,
    error: expertsError,
    refetch: refetchExperts,
  } = useExperts('生活服务');

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch { return '刚刚'; }
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  useEffect(() => {
    const checkScroll = () => {
      if (categoryRef.current) {
        const { scrollWidth, clientWidth } = categoryRef.current;
        setShowRightIndicator(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('tab:lifestyle', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('channel:lifestyle:category', activeCategory);
  }, [activeCategory]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoryRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const categories = [
    { id: 'all', name: '全部', icon: <Calendar size={16} /> },
    { id: 'housing', name: '租房', icon: <Home size={16} /> },
    { id: 'legal', name: '法律', icon: <Briefcase size={16} /> },
    { id: 'emotional', name: '情感', icon: <Heart size={16} /> },
    { id: 'insurance', name: '保险', icon: <Umbrella size={16} /> },
    { id: 'overseas', name: '海外生活', icon: <Globe size={16} /> }
  ];

  const allExperts = [
    {
      id: '1',
      name: '王律师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '劳动法专家',
      description: '专注于劳动法、合同纠纷，5年执业经验',
      tags: ['劳动法', '合同', '纠纷'],
      category: 'legal',
      rating: 4.8,
      responseRate: '95%',
      orderCount: '156单'
    },
    {
      id: '2',
      name: '林咨询师',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      title: '情感心理专家',
      description: '婚恋关系、亲子关系咨询，执业8年',
      tags: ['情感', '心理', '婚恋'],
      category: 'emotional',
      rating: 4.9,
      responseRate: '98%',
      orderCount: '203单'
    },
    {
      id: '3',
      name: '张先生',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      title: '租房达人',
      description: '10年租房经验，帮助过200+人解决租房问题',
      tags: ['租房', '合同', '维权'],
      category: 'housing',
      rating: 4.6,
      responseRate: '92%',
      orderCount: '127单'
    },
    {
      id: '4',
      name: '李顾问',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      title: '保险规划师',
      description: '专注于个人、家庭保险规划，擅长理赔指导',
      tags: ['保险', '理赔', '规划'],
      category: 'insurance',
      rating: 4.7,
      responseRate: '94%',
      orderCount: '185单'
    },
    {
      id: '5',
      name: '郑先生',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      title: '移民顾问',
      description: '5年海外留学与移民经验，擅长澳洲和加拿大',
      tags: ['移民', '留学', '海外生活'],
      category: 'overseas',
      rating: 4.5,
      responseRate: '90%',
      orderCount: '96单'
    },
    {
      id: '6',
      name: '赵房产',
      avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
      title: '房产经纪人',
      description: '8年房产经纪经验，专注北上广深一线城市租赁市场',
      tags: ['房产', '租赁', '买卖'],
      category: 'housing',
      rating: 4.8,
      responseRate: '96%',
      orderCount: '214单'
    }
  ];

  const dbExpertModels = (dbExperts || []).map((item) => mapExpertToUIModel(item));
  const demoExpertModels = mapDemoExpertsByChannel(demoExperts, 'lifestyle-services', { categoryFallback: 'housing' });
  const fallbackExpertModels = mergeUniqueById(
    demoExpertModels,
    allExperts.map((item) => mapExpertToUIModel(item, { categoryFallback: item.category }))
  );
  const expertSource = dbExpertModels.length > 0 ? dbExpertModels : fallbackExpertModels;
  const filteredExperts = filterExpertsByCategory(expertSource, activeCategory);

  const filteredQuestions = mergeUniqueById(
    (questions || []).map((item) => mapQuestionToUIModel(item)),
    demoQuestions.map((item) => mapQuestionToUIModel(item))
  );
  const featuredQuestion = filteredQuestions[0];
  const featuredExpert = filteredExperts[0];

  const handleSearch = () => {
    console.log('Search initiated');
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    console.log(`Selected category: ${categoryId}`);
  };

  const handleViewQuestionDetail = (questionId: string) => {
    navigate(`/question/${questionId}`, { state: buildFromState(location) });
  };

  const handleViewExpertProfile = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`, { state: buildFromState(location) });
  };

  return (
    <ChannelPageScaffold
      title="生活服务"
      pageClassName="bg-gradient-to-b from-[rgb(248,253,251)] via-white to-white"
      headerGradientClass="bg-gradient-to-r from-orange-500 to-amber-500"
      searchStripClass="bg-orange-50/90 border-orange-100/90"
      searchAccentRingClass="ring-orange-400/25"
      searchInputAccentClass="focus-visible:ring-orange-400/20 focus-visible:border-orange-200"
      searchInputBorderClass="border-orange-200/80"
      searchIconClass="text-orange-400"
      searchNavigateToPath="/search?channel=lifestyle"
      featuredBadgeClass="bg-orange-50 text-orange-600"
      featuredHintClass="text-orange-600"
      activeCategoryClass="bg-orange-500 text-white shadow-sm border-orange-500"
      tabUnderlineClass="bg-gradient-to-r from-app-orange to-amber-500"
      categories={categories}
      activeCategory={activeCategory}
      categoryRef={categoryRef}
      showRightIndicator={showRightIndicator}
      featuredTitle={featuredQuestion?.title || '租房、法律与保险高频问题'}
      featuredDescription={featuredQuestion?.content || '把生活服务里最容易踩坑的场景先筛出来，先看精选问答，再决定是否继续咨询专家。'}
      featuredHint={featuredExpert ? `推荐顾问：${featuredExpert.name}` : '优先解决高频生活问题'}
      onBack={() => navigateBackOr(navigate, '/', { location })}
      onScrollCategories={scrollCategories}
      onSelectCategory={handleCategorySelect}
      onViewFeatured={featuredQuestion ? () => handleViewQuestionDetail(featuredQuestion.id) : undefined}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
          <TabsContent value="everyone" className="mt-0">
            {isLoading ? (
              <ChannelQuestionSkeleton />
            ) : questionsError ? (
              <PageStateCard
                compact
                variant="error"
                title="问题加载失败"
                description={questionsError instanceof Error ? questionsError.message : '请检查网络后重试'}
                actionLabel="重试"
                onAction={() => refetchQuestions()}
              />
            ) : filteredQuestions.length === 0 ? (
              <PageStateCard
                compact
                variant="empty"
                title="还没有相关问题"
                description="先发布一个问题，或者切换其它子类目看看。"
              />
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    id={question.id}
                    title={question.title}
                    description={question.content || undefined}
                    asker={{
                      name: question.askerName,
                      avatar: question.askerAvatar
                    }}
                    time={formatTime(question.createdAt)}
                    tags={question.tags || []}
                    points={question.bountyPoints}
                    viewCount={formatViewCount(question.viewCount)}
                    delay={0.3 + index * 0.1}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="experts" className="mt-0">
            {isLoadingExperts ? (
              <ChannelExpertSkeleton />
            ) : expertsError ? (
              <PageStateCard
                compact
                variant="error"
                title="专家加载失败"
                description={expertsError instanceof Error ? expertsError.message : '请稍后重试'}
                actionLabel="重试"
                onAction={() => refetchExperts()}
              />
            ) : filteredExperts.length === 0 ? (
              <PageStateCard
                compact
                variant="empty"
                title="该分类暂时没有专家"
                description="可以切换分类，或先浏览大家都在问。"
              />
            ) : (
              <div className="space-y-3">
                {filteredExperts.map((expert) => (
                  <ChannelExpertCard
                    key={expert.id}
                    expert={expert}
                    accentBorderClass="border-orange-50"
                    accentTextClass="text-orange-600"
                    accentTagClass="bg-orange-50 text-orange-600"
                    accentSummaryClass="border-orange-200 bg-orange-50/50"
                    ctaClassName="bg-primary text-primary-foreground hover:bg-primary/90"
                    onOpen={() => handleViewExpertProfile(expert.id)}
                    onConsult={() => navigate(`/expert/${expert.id}`, { state: buildFromState(location) })}
                  />
                ))}
              </div>
            )}
          </TabsContent>
      
      <ChannelFloatingActionButton
        className="bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(73,170,155,0.28)]"
        onClick={() => navigate('/new', { state: buildFromState(location) })}
        ariaLabel="发布生活服务需求"
      />
    </ChannelPageScaffold>
  );
};

export default LifestyleServices;
