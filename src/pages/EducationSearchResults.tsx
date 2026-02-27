
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell, MessageSquare, User, ArrowLeft, Search, Sparkles, Filter } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SearchBar from "@/components/SearchBar";
import QuestionCard from '@/components/QuestionCard';

const EducationSearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'experts' | 'questions'>('all');
  const [noResults, setNoResults] = useState(false);

  // Popular education search topics
  const popularTopics = ['考研', '留学申请', '高考志愿', '论文写作', '竞赛辅导', '考证', '英语学习', '数学提高'];

  // Mock experts data - in a real app this would come from an API
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

  // Mock questions data
  const allQuestions = [
    {
      id: '1',
      title: '如何有效管理考研复习时间？',
      description: '我是23届考研生，感觉每天都很忙但效率不高，有没有好的时间管理方法...',
      asker: {
        name: '小李',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      time: '2小时前',
      tags: ['考研', '时间管理'],
      points: 30,
      viewCount: '3.8k',
      category: 'kaoyan'
    },
    {
      id: '2',
      title: '美国本科留学需要准备哪些标化考试？',
      description: '高二学生，计划申请美国本科，不知道需要准备什么考试，什么时候开始准备比较好...',
      asker: {
        name: '高中生',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
      },
      time: '4小时前',
      tags: ['留学', '标化考试'],
      points: 25,
      viewCount: '2.1k',
      category: 'study-abroad',
      answerName: '留学顾问',
      answerAvatar: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    {
      id: '3',
      title: '高考志愿：985分数够不到怎么选择？',
      description: '今年高考估分630，想上计算机但分数线可能差一点，是冲一冲还是选二本保底呢？',
      asker: {
        name: '高考生',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
      },
      time: '1天前',
      tags: ['高考', '志愿填报'],
      points: 40,
      viewCount: '5.2k',
      category: 'gaokao',
      answerName: '王老师',
      answerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '4',
      title: 'SCI论文投稿被拒怎么修改提高接收率？',
      description: '博士生，论文被拒了两次，审稿人给了很多意见，但不知道如何有效修改...',
      asker: {
        name: '博士在读',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg'
      },
      time: '2天前',
      tags: ['论文', 'SCI', '修改'],
      points: 35,
      viewCount: '1.7k',
      category: 'paper'
    },
    {
      id: '5',
      title: '数学建模竞赛如何选择合适的算法？',
      description: '准备参加下一届美赛，想了解不同类型问题适合用什么算法和模型...',
      asker: {
        name: '数模爱好者',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      time: '3天前',
      tags: ['数学建模', '算法', '竞赛'],
      points: 20,
      viewCount: '1.2k',
      category: 'competition',
      answerName: '张教授',
      answerAvatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    }
  ];

  const performSearch = (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    // Simulate API call
    setTimeout(() => {
      // If no query, show everything
      if (!query.trim()) {
        setSearchResults({
          experts: allExperts,
          questions: allQuestions
        });
        setNoResults(false);
        setIsLoading(false);
        return;
      }
      
      const lowerCaseQuery = query.toLowerCase();
      
      // Filter experts
      const filteredExperts = allExperts.filter(expert => {
        return expert.keywords.some(keyword => 
          keyword.toLowerCase().includes(lowerCaseQuery)
        ) || 
        expert.name.toLowerCase().includes(lowerCaseQuery) ||
        expert.title.toLowerCase().includes(lowerCaseQuery) ||
        expert.description.toLowerCase().includes(lowerCaseQuery) ||
        expert.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
      });
      
      // Filter questions
      const filteredQuestions = allQuestions.filter(question => {
        return question.title.toLowerCase().includes(lowerCaseQuery) ||
               question.description.toLowerCase().includes(lowerCaseQuery) ||
               question.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
               (question.asker.name && question.asker.name.toLowerCase().includes(lowerCaseQuery));
      });
      
      setSearchResults({
        experts: filteredExperts,
        questions: filteredQuestions
      });
      
      setNoResults(filteredExperts.length === 0 && filteredQuestions.length === 0);
      setIsLoading(false);
    }, 800);
  };

  const [searchResults, setSearchResults] = useState<{
    experts: typeof allExperts,
    questions: typeof allQuestions
  }>({
    experts: [],
    questions: []
  });

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    } else {
      // Show all results if no query
      setSearchResults({
        experts: allExperts,
        questions: allQuestions
      });
      setIsLoading(false);
    }
  }, [initialQuery]);

  const handleSearch = (value: string) => {
    // Update URL with search query
    const newParams = new URLSearchParams(location.search);
    if (value) {
      newParams.set('q', value);
    } else {
      newParams.delete('q');
    }
    navigate({
      pathname: location.pathname,
      search: newParams.toString()
    }, { replace: true });
    
    performSearch(value);
  };

  const handleTopicSelect = (topic: string) => {
    setSearchQuery(topic);
    handleSearch(topic);
  };

  const handleViewQuestionDetail = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handleViewExpertProfile = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
  };

  const handleBack = () => {
    navigate('/education');
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 min-h-screen pb-20">
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm animate-fade-in">
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={handleBack} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base">教育专家搜索</div>
          <button className="text-white">
            <Bell size={20} />
          </button>
        </div>
      </div>
      
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="搜索问题/达人/话题"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        isEducation={true}
      />
      
      <div className="p-4">
        {searchQuery ? (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold flex-1">
              {isLoading ? '搜索中...' : `"${searchQuery}" 的搜索结果`}
            </h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-gray-600 border-gray-200"
              >
                <Filter size={14} className="mr-1" />
                筛选
              </Button>
              <Button 
                onClick={handleBack}
                variant="ghost" 
                size="sm"
                className="text-gray-500"
              >
                <ArrowLeft size={16} className="mr-1" />
                返回
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-4">
              <Search size={20} className="text-app-teal mr-2" />
              <h2 className="text-lg font-bold">教育热门话题</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {popularTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleTopicSelect(topic)}
                  className="bg-white text-gray-700 text-sm px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {topic}
                </button>
              ))}
            </div>
          </>
        )}
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl p-4 animate-pulse shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="flex gap-2 mb-3">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="h-9 bg-gray-200 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        ) : searchQuery && noResults ? (
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">未找到匹配结果</h3>
              <p className="text-gray-500 max-w-xs mb-4">
                尝试使用不同的关键词，或者直接提问，我们会为您寻找最合适的回答者
              </p>
              <Button 
                onClick={() => navigate('/education')}
                variant="outline" 
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                返回教育学习
              </Button>
            </div>
          </div>
        ) : searchQuery ? (
          <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'experts' | 'questions')}>
            <TabsList className="w-full bg-gray-100 p-1 rounded-full mb-4">
              <TabsTrigger 
                value="all" 
                className="flex-1 rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                全部
              </TabsTrigger>
              <TabsTrigger 
                value="experts" 
                className="flex-1 rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                专家({searchResults.experts.length})
              </TabsTrigger>
              <TabsTrigger 
                value="questions" 
                className="flex-1 rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                问题({searchResults.questions.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0 space-y-4">
              {searchResults.experts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold flex items-center">
                      <Sparkles size={16} className="text-yellow-500 mr-1" />
                      教育专家
                    </h3>
                    {searchResults.experts.length > 2 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-gray-500"
                        onClick={() => setActiveTab('experts')}
                      >
                        查看更多
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {searchResults.experts.slice(0, 2).map(expert => (
                      <div 
                        key={expert.id} 
                        className="bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-md transition-all"
                        onClick={() => handleViewExpertProfile(expert.id)}
                      >
                        <div className="flex items-center mb-2">
                          <Avatar className="w-10 h-10 mr-3">
                            <AvatarImage src={expert.avatar} alt={expert.name} />
                            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900">{expert.name}</h4>
                            <p className="text-xs text-green-600">{expert.title}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2 line-clamp-2">{expert.description}</div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {expert.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full text-sm flex items-center justify-center gap-1 h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewExpertProfile(expert.id);
                          }}
                        >
                          <MessageSquare size={14} />
                          咨询专家
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {searchResults.questions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold">相关问题</h3>
                    {searchResults.questions.length > 3 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-gray-500"
                        onClick={() => setActiveTab('questions')}
                      >
                        查看更多
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {searchResults.questions.slice(0, 3).map(question => (
                      <QuestionCard
                        key={question.id}
                        {...question}
                        delay={0}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="experts" className="mt-0">
              <div className="space-y-3">
                {searchResults.experts.map(expert => (
                  <div 
                    key={expert.id} 
                    className="bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleViewExpertProfile(expert.id)}
                  >
                    <div className="flex items-center mb-2">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src={expert.avatar} alt={expert.name} />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">{expert.name}</h4>
                        <p className="text-xs text-green-600">{expert.title}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2 line-clamp-2">{expert.description}</div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {expert.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full text-sm flex items-center justify-center gap-1 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewExpertProfile(expert.id);
                      }}
                    >
                      <MessageSquare size={14} />
                      咨询专家
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="questions" className="mt-0">
              <div className="space-y-3">
                {searchResults.questions.map(question => (
                  <QuestionCard
                    key={question.id}
                    {...question}
                    delay={0}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <Sparkles size={16} className="text-yellow-500 mr-1" />
                教育专家推荐
              </h3>
              <div className="space-y-3">
                {allExperts.slice(0, 3).map(expert => (
                  <div 
                    key={expert.id} 
                    className="bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleViewExpertProfile(expert.id)}
                  >
                    <div className="flex items-center mb-2">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src={expert.avatar} alt={expert.name} />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">{expert.name}</h4>
                        <p className="text-xs text-green-600">{expert.title}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2 line-clamp-2">{expert.description}</div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {expert.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full text-sm flex items-center justify-center gap-1 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewExpertProfile(expert.id);
                      }}
                    >
                      <MessageSquare size={14} />
                      咨询专家
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-3">教育热门问题</h3>
              <div className="space-y-3">
                {allQuestions.slice(0, 3).map(question => (
                  <QuestionCard
                    key={question.id}
                    {...question}
                    delay={0}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationSearchResults;
