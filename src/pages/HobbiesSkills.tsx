
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  Camera, 
  Music, 
  Palette, 
  Dumbbell, 
  Utensils,
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import {
  filterExpertsByCategory,
  mapDemoExpertsByChannel,
  mapExpertToUIModel,
  mapQuestionToUIModel,
  mergeUniqueById,
} from '@/lib/adapters/contentAdapters';

const HobbiesSkills = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(() => sessionStorage.getItem('channel:hobbies:category') || 'all');
  const [activeTab, setActiveTab] = useState<'everyone' | 'experts'>(() => {
    const cached = sessionStorage.getItem('tab:hobbies');
    return cached === 'experts' ? 'experts' : 'everyone';
  });
  const categoryRef = useRef<HTMLDivElement>(null);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  
  const { data: questions, isLoading } = useQuestions('兴趣技能');
  const { data: dbExperts, isLoading: isLoadingExperts } = useExperts('兴趣技能');

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
    sessionStorage.setItem('tab:hobbies', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('channel:hobbies:category', activeCategory);
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
    { id: 'photography', name: '摄影', icon: <Camera size={16} /> },
    { id: 'music', name: '音乐', icon: <Music size={16} /> },
    { id: 'art', name: '艺术', icon: <Palette size={16} /> },
    { id: 'fitness', name: '健身', icon: <Dumbbell size={16} /> },
    { id: 'cooking', name: '烹饪', icon: <Utensils size={16} /> }
  ];

  const allExperts = [
    {
      id: '1',
      name: '张摄影',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      title: '专业摄影师',
      description: '10年摄影经验，曾获多项国际摄影奖项',
      tags: ['风光摄影', '人像', '后期修图'],
      category: 'photography',
      rating: 4.9,
      responseRate: '98%',
      orderCount: '156单'
    },
    {
      id: '2',
      name: '王音乐',
      avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
      title: '音乐制作人',
      description: '专注电子音乐制作，多首作品登上热门榜单',
      tags: ['电子音乐', '混音', '编曲'],
      category: 'music',
      rating: 4.8,
      responseRate: '95%',
      orderCount: '132单'
    },
    {
      id: '3',
      name: '林画家',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
      title: '当代艺术家',
      description: '擅长水彩与油画创作，个人作品在多个画廊展出',
      tags: ['水彩', '油画', '素描'],
      category: 'art',
      rating: 4.7,
      responseRate: '92%',
      orderCount: '98单'
    },
    {
      id: '4',
      name: '李教练',
      avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
      title: '健身教练',
      description: '国家认证健身教练，专注力量训练与体态改善',
      tags: ['力量训练', '体态矫正', '减脂'],
      category: 'fitness',
      rating: 4.9,
      responseRate: '97%',
      orderCount: '203单'
    },
    {
      id: '5',
      name: '陈大厨',
      avatar: 'https://randomuser.me/api/portraits/men/26.jpg',
      title: '米其林星级厨师',
      description: '曾在多家星级餐厅任职，擅长中西融合料理',
      tags: ['料理', '烘焙', '中餐'],
      category: 'cooking',
      rating: 4.8,
      responseRate: '94%',
      orderCount: '176单'
    },
    {
      id: '6',
      name: '赵作曲',
      avatar: 'https://randomuser.me/api/portraits/men/27.jpg',
      title: '音乐老师',
      description: '古典音乐专业，钢琴演奏家，擅长教学与作曲',
      tags: ['钢琴', '作曲', '乐理'],
      category: 'music',
      rating: 4.6,
      responseRate: '90%',
      orderCount: '87单'
    }
  ];

  const dbExpertModels = (dbExperts || []).map((item) => mapExpertToUIModel(item));
  const demoExpertModels = mapDemoExpertsByChannel(demoExperts, 'hobbies-skills', { categoryFallback: 'art' });
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
    navigate(`/question/${questionId}`);
  };

  const handleViewExpertProfile = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
  };

  return (
    <ChannelPageScaffold
      title="兴趣技能"
      pageClassName="bg-gradient-to-b from-rose-50/70 via-white to-white"
      headerGradientClass="bg-gradient-to-r from-pink-500 to-rose-500"
      searchStripClass="bg-rose-50/90 border-rose-100/90"
      searchAccentRingClass="ring-rose-400/25"
      searchInputAccentClass="focus-visible:ring-rose-400/20 focus-visible:border-rose-200"
      searchInputBorderClass="border-rose-200/80"
      searchIconClass="text-rose-400"
      searchNavigateToPath="/search?channel=hobbies"
      featuredBadgeClass="bg-rose-50 text-rose-600"
      featuredHintClass="text-rose-600"
      activeCategoryClass="bg-rose-500 text-white shadow-sm border-rose-500"
      tabUnderlineClass="bg-gradient-to-r from-rose-500 to-pink-500"
      categories={categories}
      activeCategory={activeCategory}
      categoryRef={categoryRef}
      showRightIndicator={showRightIndicator}
      featuredTitle={featuredQuestion?.title || '摄影、音乐与创作技能精选'}
      featuredDescription={featuredQuestion?.content || '把摄影、音乐、艺术、健身和烹饪里最值得看的高质量内容先整理出来，适合快速浏览。'}
      featuredHint={featuredExpert ? `推荐达人：${featuredExpert.name}` : '适合先看精选再提问'}
      onBack={() => navigate('/')}
      onScrollCategories={scrollCategories}
      onSelectCategory={handleCategorySelect}
      onViewFeatured={featuredQuestion ? () => handleViewQuestionDetail(featuredQuestion.id) : undefined}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
          <TabsContent value="everyone" className="mt-0">
            {isLoading ? (
              <ChannelQuestionSkeleton />
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
            ) : (
              <div className="space-y-3">
                {filteredExperts.map((expert) => (
                  <ChannelExpertCard
                    key={expert.id}
                    expert={expert}
                    accentBorderClass="border-rose-50"
                    accentTextClass="text-rose-600"
                    accentTagClass="bg-rose-50 text-rose-600"
                    accentSummaryClass="border-rose-200 bg-rose-50/50"
                    ctaClassName="bg-gradient-to-r from-rose-500 to-pink-400"
                    onOpen={() => handleViewExpertProfile(expert.id)}
                    onConsult={() => navigate(`/expert/${expert.id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
      
      <ChannelFloatingActionButton
        className="bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_12px_28px_rgba(244,63,94,0.28)]"
        onClick={() => navigate('/new')}
        ariaLabel="发布兴趣技能需求"
      />
    </ChannelPageScaffold>
  );
};

export default HobbiesSkills;
