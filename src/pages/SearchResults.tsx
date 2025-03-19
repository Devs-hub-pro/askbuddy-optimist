
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell, MessageSquare, User, ArrowLeft, Search, X, Filter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/SearchBar";

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'experts' | 'questions'>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Mock data - in a real app this would come from an API
  const allExperts = [
    {
      id: '1',
      name: '张同学',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: '北大硕士 | 出国党',
      description: '专注留学申请文书指导，斯坦福offer获得者',
      tags: ['留学', '文书', '面试'],
      keywords: ['留学', '文书', '个人陈述', '面试', '斯坦福', '美国大学', '申请', 'SOP'],
      category: 'education'
    },
    {
      id: '2',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '清华博士 | 考研规划',
      description: '5年考研辅导经验，擅长数学与专业课',
      tags: ['考研', '数学', '规划'],
      keywords: ['考研', '数学', '专业课', '清华', '规划', '复习'],
      category: 'education'
    },
    {
      id: '3',
      name: '王老师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '高考志愿规划师',
      description: '10年高考志愿填报指导经验，专精各省份政策',
      tags: ['高考', '志愿填报', '专业选择'],
      keywords: ['高考', '志愿', '填报', '专业选择', '大学', '分数线'],
      category: 'education'
    },
    {
      id: '4',
      name: '李医生',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      title: '三甲医院 | 心理咨询师',
      description: '多年临床经验，擅长青少年心理问题，情绪管理',
      tags: ['心理健康', '情绪管理', '青少年心理'],
      keywords: ['抑郁', '焦虑', '压力', '心理健康', '情绪管理', '青少年'],
      category: 'lifestyle'
    },
    {
      id: '5',
      name: '陈先生',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      title: '资深HR | 职场导师',
      description: '互联网大厂HR经理，提供简历优化、面试技巧辅导',
      tags: ['职场', '简历', '面试'],
      keywords: ['简历', '面试', '职场', '晋升', '跳槽', 'offer', '谈薪'],
      category: 'career'
    }
  ];

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
      answers: 12,
      viewCount: '3.8k',
      category: 'education'
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
      answers: 8,
      viewCount: '2.1k',
      category: 'education'
    },
    {
      id: '3',
      title: '初创公司如何找到第一批种子用户？',
      description: '我最近在创业，产品已经开发完成，但不知道如何找到第一批愿意尝试的用户...',
      asker: {
        name: '创业者',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg'
      },
      time: '1天前',
      tags: ['创业', '用户增长', '营销'],
      answers: 5,
      viewCount: '1.5k',
      category: 'career'
    },
    {
      id: '4',
      title: '婴儿湿疹的居家护理方法有哪些？',
      description: '我家宝宝3个月，最近脸上出现湿疹，去过医院，想了解下平时该如何护理...',
      asker: {
        name: '新手妈妈',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      time: '2天前',
      tags: ['育儿', '湿疹', '护理'],
      answers: 14,
      viewCount: '4.2k',
      category: 'lifestyle'
    }
  ];

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'education', name: '教育学习' },
    { id: 'career', name: '职场就业' },
    { id: 'lifestyle', name: '生活服务' },
    { id: 'hobbies', name: '兴趣技能' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    
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
    
    // In a real app, this would trigger a new search
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleAskExpert = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
  };

  const handleViewQuestion = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'experts' | 'questions');
  };

  const handleFilterChange = (categoryId: string) => {
    setActiveFilter(categoryId);
  };

  // Filter results based on active filter
  const filteredExperts = activeFilter === 'all' 
    ? allExperts 
    : allExperts.filter(expert => expert.category === activeFilter);

  const filteredQuestions = activeFilter === 'all'
    ? allQuestions
    : allQuestions.filter(question => question.category === activeFilter);

  // Filter by search query
  const searchedExperts = searchQuery
    ? filteredExperts.filter(expert => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return expert.keywords.some(keyword => 
          keyword.toLowerCase().includes(lowerCaseQuery)
        ) || 
        expert.name.toLowerCase().includes(lowerCaseQuery) ||
        expert.title.toLowerCase().includes(lowerCaseQuery) ||
        expert.description.toLowerCase().includes(lowerCaseQuery) ||
        expert.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
      })
    : filteredExperts;

  const searchedQuestions = searchQuery
    ? filteredQuestions.filter(question => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return question.title.toLowerCase().includes(lowerCaseQuery) ||
        question.description.toLowerCase().includes(lowerCaseQuery) ||
        question.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
      })
    : filteredQuestions;

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 min-h-screen pb-20">
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm animate-fade-in">
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={handleBack} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base">搜索</div>
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
        context="global"
      />
      
      <div className="p-4">
        {searchQuery ? (
          <div className="mb-4 flex items-center">
            <h2 className="text-lg font-bold flex-1">
              {isLoading ? '搜索中...' : `"${searchQuery}" 的搜索结果`}
            </h2>
            <Button 
              onClick={handleBack}
              variant="ghost" 
              size="sm"
              className="text-gray-500 flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              返回
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">搜索问题与达人</h3>
            <p className="text-gray-500 max-w-xs">
              输入关键词，查找能解答您问题的专业人士或已有问答
            </p>
          </div>
        )}

        {searchQuery && (
          <>
            <div className="mb-4 overflow-x-auto hide-scrollbar">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className={`flex-shrink-0 ${activeFilter === category.id ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'} rounded-full px-3 py-1.5 flex items-center cursor-pointer transition-colors`}
                    onClick={() => handleFilterChange(category.id)}
                  >
                    <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="experts">回答者</TabsTrigger>
                <TabsTrigger value="questions">问题</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4 mt-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-white rounded-xl p-4 animate-pulse shadow-sm">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-10 bg-gray-200 rounded w-full mb-3"></div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {searchedExperts.length > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-sm">推荐回答者</h3>
                          {searchedExperts.length > 2 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-500 text-xs h-auto py-1"
                              onClick={() => setActiveTab('experts')}
                            >
                              查看更多
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {searchedExperts.slice(0, 2).map(expert => (
                            <div key={expert.id} className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={expert.avatar} />
                                    <AvatarFallback>{expert.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-sm font-semibold">{expert.name}</h3>
                                    <p className="text-xs text-green-600">{expert.title}</p>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => handleAskExpert(expert.id)}
                                  size="sm"
                                  className="bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full text-xs h-8 px-3"
                                >
                                  找TA问问
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {searchedQuestions.length > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-sm">相关问题</h3>
                          {searchedQuestions.length > 3 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-500 text-xs h-auto py-1"
                              onClick={() => setActiveTab('questions')}
                            >
                              查看更多
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {searchedQuestions.slice(0, 3).map(question => (
                            <div 
                              key={question.id} 
                              className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                              onClick={() => handleViewQuestion(question.id)}
                            >
                              <h3 className="text-sm font-medium mb-1">{question.title}</h3>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{question.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                  {question.tags.map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-xs bg-gray-50 text-gray-500">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <span>{question.answers} 回答</span>
                                  <span className="mx-1">·</span>
                                  <span>{question.viewCount} 浏览</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {searchedExperts.length === 0 && searchedQuestions.length === 0 && (
                      <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <User size={32} className="text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-700 mb-2">未找到匹配的结果</h3>
                          <p className="text-gray-500 max-w-xs mb-4">
                            尝试使用不同的关键词，或者直接提问，我们会为您寻找最合适的回答者
                          </p>
                          <Button 
                            onClick={handleBack}
                            variant="outline" 
                            className="border-green-200 text-green-600 hover:bg-green-50"
                          >
                            返回首页
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="experts" className="space-y-4 mt-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-white rounded-xl p-3 animate-pulse shadow-sm">
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
                ) : (
                  <div className="space-y-3">
                    {searchedExperts.length > 0 ? (
                      searchedExperts.map(expert => (
                        <div 
                          key={expert.id}
                          className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                          onClick={() => handleAskExpert(expert.id)}
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
                          </div>

                          <div className="flex mt-2">
                            <p className="text-xs text-gray-700 border-l-2 border-green-200 pl-2 py-0.5 bg-green-50/50 rounded-r-md flex-1 mr-2 line-clamp-2">
                              {expert.description}
                            </p>
                            
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAskExpert(expert.id);
                              }}
                              className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm hover:shadow-md transition-all h-auto"
                            >
                              <MessageSquare size={10} />
                              找TA问问
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
                      ))
                    ) : (
                      <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <User size={32} className="text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-700 mb-2">未找到匹配的专家</h3>
                          <p className="text-gray-500 max-w-xs mb-4">
                            尝试使用不同的关键词，或者直接提问，我们会为您寻找最合适的回答者
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="questions" className="space-y-4 mt-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-white rounded-xl p-3 animate-pulse shadow-sm">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6 mb-3"></div>
                        <div className="flex justify-between">
                          <div className="flex gap-1">
                            <div className="h-3 bg-gray-200 rounded-full w-12"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-12"></div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {searchedQuestions.length > 0 ? (
                      searchedQuestions.map(question => (
                        <div 
                          key={question.id}
                          className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                          onClick={() => handleViewQuestion(question.id)}
                        >
                          <h3 className="text-sm font-medium mb-1">{question.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{question.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              {question.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-gray-50 text-gray-500">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>{question.answers} 回答</span>
                              <span className="mx-1">·</span>
                              <span>{question.viewCount} 浏览</span>
                            </div>
                          </div>
                          <div className="flex items-center mt-2 text-xs text-gray-400">
                            <Avatar className="h-4 w-4 mr-1">
                              <AvatarImage src={question.asker.avatar} />
                              <AvatarFallback>{question.asker.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{question.asker.name}</span>
                            <span className="mx-1">·</span>
                            <span>{question.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare size={32} className="text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-700 mb-2">未找到相关问题</h3>
                          <p className="text-gray-500 max-w-xs mb-4">
                            您可以尝试提出新问题，或者使用不同的关键词搜索
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
