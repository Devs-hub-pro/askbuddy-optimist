import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  GraduationCap, 
  BookOpen, 
  GlobeIcon, 
  Award, 
  FileText, 
  Plus,
  Bell,
  MessageSquare,
  MessageCircle,
  Clock,
  Package,
  Users,
  Eye,
  ChevronRight
} from 'lucide-react';
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import QuestionCard from '@/components/QuestionCard';
import { useChannelFeed } from '@/hooks/useChannelFeed';
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
  filterQuestionsByCategory,
  mapDemoExpertsByChannel,
  mapDemoQuestionsByChannel,
  mapExpertToUIModel,
  mergeUniqueById,
} from '@/lib/adapters/contentAdapters';
import { buildFromState, navigateBackOr } from '@/utils/navigation';
import { usePageScrollMemory } from '@/hooks/usePageScrollMemory';
import { CHANNEL_THEME_PRESETS } from '@/design/channelThemePresets';

const EducationLearning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(() => sessionStorage.getItem('channel:education:category') || 'all');
  const [activeTab, setActiveTab] = useState<'everyone' | 'experts'>(() => {
    const cached = sessionStorage.getItem('tab:education');
    return cached === 'experts' ? 'experts' : 'everyone';
  });
  const categoryRef = useRef<HTMLDivElement>(null);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  usePageScrollMemory('education');
  
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
    sessionStorage.setItem('tab:education', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('channel:education:category', activeCategory);
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
    { id: 'gaokao', name: '高考', icon: <GraduationCap size={16} /> },
    { id: 'kaoyan', name: '考研', icon: <BookOpen size={16} /> },
    { id: 'study-abroad', name: '留学', icon: <GlobeIcon size={16} /> },
    { id: 'competition', name: '竞赛', icon: <Award size={16} /> },
    { id: 'paper', name: '论文写作', icon: <FileText size={16} /> }
  ];
  const categoryKeywords: Record<string, string[]> = {
    gaokao: ['高考', '志愿', '录取', '分数线'],
    kaoyan: ['考研', '复试', '调剂', '专业课'],
    'study-abroad': ['留学', '申请', '雅思', '托福', '文书'],
    competition: ['竞赛', '比赛', '数模', '奖项'],
    paper: ['论文', '开题', 'SCI', '投稿'],
  };

  const allExperts = [
    {
      id: '1',
      name: '张同学',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: '北大硕士 | 出国党',
      description: '专注留学申请文书指导，斯坦福offer获得者',
      tags: ['留学', '文书', '面试'],
      keywords: ['留学', '文书', '个人陈述', '面试', '斯坦福', '美国大学', '申请', 'SOP'],
      category: 'study-abroad',
      rating: 4.9,
      responseRate: '98%',
      orderCount: '126单'
    },
    {
      id: '2',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '清华博士 | 考研规划',
      description: '5年考研辅导经验，擅长数学与专业课',
      tags: ['考研', '数学', '规划'],
      keywords: ['考研', '数学', '专业课', '清华', '规划', '复习'],
      category: 'kaoyan',
      rating: 4.8,
      responseRate: '95%',
      orderCount: '210单'
    },
    {
      id: '3',
      name: '王老师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '高考志愿规划师',
      description: '10年高考志愿填报指导经验，专精各省份政策',
      tags: ['高考', '志愿填报', '专业选择'],
      keywords: ['高考', '志愿', '填报', '专业选择', '大学', '分数线'],
      category: 'gaokao',
      rating: 4.7,
      responseRate: '92%',
      orderCount: '185单'
    },
    {
      id: '4',
      name: '李明',
      avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
      title: '清华研究生',
      description: '考研英语特长，英语六级高分，专注英语学习方法',
      tags: ['考研', '英语', '备考'],
      keywords: ['考研', '英语', '六级', '词汇', '听力', '阅读', '写作'],
      category: 'kaoyan',
      rating: 4.6,
      responseRate: '90%',
      orderCount: '98单'
    },
    {
      id: '5',
      name: '陈教授',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      title: '某985教授 | 论文指导',
      description: '研究生导师，IEEE/SCI论文审稿人，多篇高被引论文',
      tags: ['论文', 'SCI', '科研'],
      keywords: ['学术论文', 'SCI', 'IEEE', '期刊投稿', '审稿意见', '开题报告'],
      category: 'paper',
      rating: 4.9,
      responseRate: '96%',
      orderCount: '156单'
    },
    {
      id: '6',
      name: '张竞赛',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      title: '全国数学竞赛金牌 | 教练',
      description: '指导学生获得多项全国级奖项，擅长数学建模竞赛',
      tags: ['数学竞赛', '数模', '指导'],
      keywords: ['数学竞赛', '数学建模', 'MCM', 'ICM', '美赛', '华赛'],
      category: 'competition',
      rating: 4.8,
      responseRate: '94%',
      orderCount: '87单'
    }
  ];

  const { data: feed, isLoading, error: feedError, refetch } = useChannelFeed(
    'education-learning',
    activeCategory,
    { questionKeywords: categoryKeywords }
  );

  const demoExpertModels = mapDemoExpertsByChannel(demoExperts, 'education-learning', { categoryFallback: 'study-abroad' });
  const fallbackExpertModels = mergeUniqueById(
    demoExpertModels,
    allExperts.map((item) => mapExpertToUIModel(item, { categoryFallback: item.category }))
  );
  const fallbackExperts = filterExpertsByCategory(fallbackExpertModels, activeCategory);
  const filteredExperts = (feed?.experts && feed.experts.length > 0) ? feed.experts : fallbackExperts;

  const fallbackQuestions = filterQuestionsByCategory(
    mapDemoQuestionsByChannel(demoQuestions, 'education-learning'),
    activeCategory,
    categoryKeywords
  );
  const filteredQuestions = (feed?.questions && feed.questions.length > 0) ? feed.questions : fallbackQuestions;
  const featuredQuestion = filteredQuestions[0];
  const featuredExpert = filteredExperts[0];
  const featuredTopic = feed?.featured;
  const theme = CHANNEL_THEME_PRESETS.education;

  const handleSearch = () => {};

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleViewQuestionDetail = (questionId: string) => {
    navigate(`/question/${questionId}`, { state: buildFromState(location) });
  };

  const handleViewExpertProfile = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`, { state: buildFromState(location) });
  };

  const handleViewFeatured = () => {
    if (featuredTopic?.id) {
      navigate(`/topic/${featuredTopic.id}`, { state: buildFromState(location) });
      return;
    }
    if (featuredQuestion) {
      handleViewQuestionDetail(featuredQuestion.id);
    }
  };

  return (
    <ChannelPageScaffold
      title="教育学习"
      pageClassName={theme.pageClassName}
      headerGradientClass={theme.headerGradientClass}
      searchStripClass={theme.searchStripClass}
      searchAccentRingClass={theme.searchAccentRingClass}
      searchInputAccentClass={theme.searchInputAccentClass}
      searchInputBorderClass={theme.searchInputBorderClass}
      searchIconClass={theme.searchIconClass}
      searchNavigateToPath={theme.searchNavigateToPath}
      featuredBadgeClass={theme.featuredBadgeClass}
      featuredHintClass={theme.featuredHintClass}
      activeCategoryClass={theme.activeCategoryClass}
      tabUnderlineClass={theme.tabUnderlineClass}
      categories={categories}
      activeCategory={activeCategory}
      categoryRef={categoryRef}
      showRightIndicator={showRightIndicator}
      featuredTitle={featuredTopic?.title || featuredQuestion?.title || '升学与备考路线集中答疑'}
      featuredDescription={featuredTopic?.description || featuredQuestion?.content || '聚焦高考、考研、留学与论文写作，先看精选问题和高质量答主，再决定深入提问。'}
      featuredHint={featuredExpert ? `推荐答主：${featuredExpert.name}` : '优先查看高质量问答'}
      onBack={() => navigateBackOr(navigate, '/', { location })}
      onScrollCategories={scrollCategories}
      onSelectCategory={handleCategorySelect}
      onViewFeatured={(featuredTopic?.id || featuredQuestion) ? handleViewFeatured : undefined}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
          <TabsContent value="everyone" className="mt-0">
            {isLoading ? (
              <ChannelQuestionSkeleton />
            ) : feedError ? (
              <PageStateCard
                compact
                variant="error"
                title="问题加载失败"
                description={feedError instanceof Error ? feedError.message : '请检查网络后重试'}
                actionLabel="重试"
                onAction={() => refetch()}
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
            {isLoading ? (
              <ChannelExpertSkeleton />
            ) : feedError ? (
              <PageStateCard
                compact
                variant="error"
                title="专家加载失败"
                description={feedError instanceof Error ? feedError.message : '请稍后重试'}
                actionLabel="重试"
                onAction={() => refetch()}
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
                    accentBorderClass="border-blue-50"
                    accentTextClass="text-blue-600"
                    accentTagClass="bg-blue-50 text-blue-600"
                    accentSummaryClass="border-blue-200 bg-blue-50/60"
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
        ariaLabel="发布教育学习问题"
      />
    </ChannelPageScaffold>
  );
};

export default EducationLearning;
