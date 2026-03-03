import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useQuestions } from '@/hooks/useQuestions';
import { useExperts } from '@/hooks/useExperts';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ChannelPageScaffold from '@/components/channel/ChannelPageScaffold';
import ChannelExpertCard from '@/components/channel/ChannelExpertCard';
import ChannelQuestionSkeleton from '@/components/channel/ChannelQuestionSkeleton';
import ChannelExpertSkeleton from '@/components/channel/ChannelExpertSkeleton';
import ChannelFloatingActionButton from '@/components/channel/ChannelFloatingActionButton';
import { demoExperts } from '@/lib/demoData';

const EducationLearning = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'everyone' | 'experts'>('everyone');
  const categoryRef = useRef<HTMLDivElement>(null);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  
  const { data: questions, isLoading } = useQuestions('教育学习');
  const { data: dbExperts, isLoading: isLoadingExperts } = useExperts('教育学习');

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

  const mappedDbExperts = (dbExperts || []).map(e => ({
    id: e.id, name: e.nickname || '专家', avatar: e.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
    title: e.title, description: e.bio || '', tags: e.tags,
    keywords: e.keywords, category: e.category || '',
    rating: Number(e.rating), responseRate: `${e.response_rate}%`, orderCount: `${e.order_count}单`,
  }));

  const mappedDemoExperts = demoExperts
    .filter((expert) => expert.category === 'education-learning')
    .map((expert) => ({
      id: expert.id,
      name: expert.nickname || '测试专家',
      avatar: expert.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
      title: expert.title,
      description: expert.bio || '',
      tags: expert.tags,
      keywords: expert.keywords,
      category: activeCategory === 'all' ? 'all' : 'study-abroad',
      rating: Number(expert.rating),
      responseRate: `${expert.response_rate}%`,
      orderCount: `${expert.order_count}单`,
    }));

  const fallbackExperts = [
    ...mappedDemoExperts,
    ...(activeCategory === 'all' ? allExperts : allExperts.filter(expert => expert.category === activeCategory)),
  ];

  const filteredExperts = mappedDbExperts.length > 0 ? mappedDbExperts : fallbackExperts;

  const filteredQuestions = questions || [];
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
    const targetId = expertId.startsWith('demo-expert-') ? expertId : 'demo-expert-1';
    navigate(`/expert-profile/${targetId}`);
  };

  return (
    <ChannelPageScaffold
      title="教育学习"
      pageClassName="bg-gradient-to-b from-blue-50/70 via-white to-white"
      headerGradientClass="bg-gradient-to-r from-blue-500 to-indigo-500"
      searchStripClass="bg-blue-50/90 border-blue-100/90"
      searchAccentRingClass="ring-blue-400/25"
      searchInputAccentClass="focus:ring-blue-400/20 focus:border-blue-200"
      searchInputBorderClass="border-blue-200/80"
      searchIconClass="text-blue-400"
      searchNavigateToPath="/search?channel=education"
      featuredBadgeClass="bg-blue-50 text-blue-600"
      featuredHintClass="text-blue-600"
      activeCategoryClass="bg-blue-500 text-white shadow-sm border-blue-500"
      tabUnderlineClass="bg-gradient-to-r from-blue-500 to-indigo-500"
      categories={categories}
      activeCategory={activeCategory}
      categoryRef={categoryRef}
      showRightIndicator={showRightIndicator}
      featuredTitle={featuredQuestion?.title || '升学与备考路线集中答疑'}
      featuredDescription={featuredQuestion?.content || '聚焦高考、考研、留学与论文写作，先看精选问题和高质量答主，再决定深入提问。'}
      featuredHint={featuredExpert ? `推荐答主：${featuredExpert.name}` : '优先查看高质量问答'}
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
              <div className="space-y-5">
                {filteredQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
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
                    delay={0.3 + index * 0.1}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="experts" className="mt-0">
            {isLoading ? (
              <ChannelExpertSkeleton />
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
                    ctaClassName="bg-gradient-to-r from-blue-500 to-indigo-400"
                    onOpen={() => handleViewExpertProfile(expert.id)}
                    onConsult={() => navigate(`/expert/${expert.id.startsWith('demo-expert-') ? expert.id : 'demo-expert-1'}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
      
      <ChannelFloatingActionButton
        className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_12px_28px_rgba(59,130,246,0.28)]"
        onClick={() => navigate('/new')}
        ariaLabel="发布教育学习问题"
      />
    </ChannelPageScaffold>
  );
};

export default EducationLearning;
