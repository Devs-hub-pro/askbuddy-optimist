import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Search, X, User, MessageSquare, Hash, Clock } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'questions' | 'topics'>('all');
  const [searchResults, setSearchResults] = useState<{
    experts: any[];
    questions: any[];
    topics: any[];
  }>({
    experts: [],
    questions: [],
    topics: []
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    // Parse search query from URL if present
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [location.search]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      performSearch(value);
    } else if (value === '') {
      setSearchResults({
        experts: [],
        questions: [],
        topics: []
      });
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults({
      experts: [],
      questions: [],
      topics: []
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      performSearch(searchTerm);
      saveRecentSearch(searchTerm);
    }
  };

  const saveRecentSearch = (term: string) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    // Remove if already exists and add to the beginning
    const updatedSearches = recentSearches.filter(s => s !== trimmedTerm);
    updatedSearches.unshift(trimmedTerm);
    
    // Keep only the 5 most recent searches
    const limitedSearches = updatedSearches.slice(0, 5);
    setRecentSearches(limitedSearches);
    
    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(limitedSearches));
  };

  const performSearch = (term: string) => {
    setIsLoading(true);
    
    // Mock search results - in a real app, this would be an API call
    setTimeout(() => {
      const results = {
        experts: [
          {
            id: '1',
            name: '张同学',
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
            title: '北大硕士 | 出国党',
            tags: ['留学', '文书', '面试'],
            rating: 4.9,
            responseRate: '98%'
          },
          {
            id: '2',
            name: '刘导师',
            avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
            title: '清华博士 | 考研规划',
            tags: ['考研', '数学', '规划'],
            rating: 4.8,
            responseRate: '95%'
          },
          {
            id: '3',
            name: '王老师',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            title: '高考志愿规划师',
            tags: ['高考', '志愿填报', '专业选择'],
            rating: 4.7,
            responseRate: '92%'
          }
        ].filter(expert => 
          expert.name.includes(term) || 
          expert.title.includes(term) || 
          expert.tags.some(tag => tag.includes(term))
        ),
        questions: [
          {
            id: '1',
            title: '高考填报志愿热门问题',
            description: '面对众多院校和专业选择，如何根据自己的分数、兴趣做出最优选择？',
            asker: {
              name: '李明',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            time: '2小时前',
            tags: ['高考', '志愿填报']
          },
          {
            id: '2',
            title: '留学申请的必备条件',
            description: '想申请美国Top30名校研究生，除了GPA和语言成绩，还需要准备哪些材料？',
            asker: {
              name: '王芳',
              avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
            },
            time: '5小时前',
            tags: ['留学', '申请']
          }
        ].filter(question => 
          question.title.includes(term) || 
          question.description.includes(term) || 
          question.tags.some(tag => tag.includes(term))
        ),
        topics: [
          { id: '1', name: '高考志愿填报', count: 248 },
          { id: '2', name: '考研择校', count: 156 },
          { id: '3', name: '留学申请文书', count: 134 },
          { id: '4', name: '编程学习', count: 89 }
        ].filter(topic => topic.name.includes(term))
      };
      
      setSearchResults(results);
      setIsLoading(false);
    }, 500);
  };

  const handleExpertClick = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handleTopicClick = (topicId: string, topicName: string) => {
    navigate(`/topic/${topicId}?name=${encodeURIComponent(topicName)}`);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center h-16 px-4">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-2 rounded-full p-1.5 hover:bg-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="relative flex-1">
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown}
              placeholder="搜索问题/达人/话题"
              className="pl-10 pr-10 py-2 rounded-full bg-gray-100 border-none"
              autoFocus
            />
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {searchTerm && (
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as any)} 
          className="w-full"
        >
          <div className="border-b border-gray-200 bg-white">
            <TabsList className="w-full justify-between px-2 bg-transparent">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none"
              >
                全部
              </TabsTrigger>
              <TabsTrigger 
                value="people" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none"
              >
                达人
              </TabsTrigger>
              <TabsTrigger 
                value="questions" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none"
              >
                问题
              </TabsTrigger>
              <TabsTrigger 
                value="topics" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none"
              >
                话题
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-lg p-4 animate-pulse-soft shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="all" className="mt-0 space-y-6">
                  {/* Experts Section */}
                  {searchResults.experts.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                          <User size={16} className="mr-2 text-blue-500" />
                          达人
                        </h3>
                        {searchResults.experts.length > 3 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-500 h-auto py-1"
                            onClick={() => setActiveTab('people')}
                          >
                            查看全部
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {searchResults.experts.slice(0, 3).map((expert) => (
                          <div 
                            key={expert.id}
                            className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                            onClick={() => handleExpertClick(expert.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 border border-green-50">
                                <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                                <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-gray-800">{expert.name}</h4>
                                <p className="text-xs text-green-600">{expert.title}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {expert.tags.slice(0, 3).map((tag: string, index: number) => (
                                    <span key={index} className="bg-green-50 text-green-600 text-xs px-1.5 py-0.5 rounded-full">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Questions Section */}
                  {searchResults.questions.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                          <MessageSquare size={16} className="mr-2 text-indigo-500" />
                          问题
                        </h3>
                        {searchResults.questions.length > 2 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-500 h-auto py-1"
                            onClick={() => setActiveTab('questions')}
                          >
                            查看全部
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {searchResults.questions.slice(0, 2).map((question) => (
                          <div 
                            key={question.id}
                            className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                            onClick={() => handleQuestionClick(question.id)}
                          >
                            <h4 className="font-medium text-gray-800 mb-1">{question.title}</h4>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{question.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={question.asker.avatar} alt={question.asker.name} />
                                  <AvatarFallback>{question.asker.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-500">{question.time}</span>
                              </div>
                              <div className="flex gap-1">
                                {question.tags.map((tag: string, index: number) => (
                                  <span key={index} className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topics Section */}
                  {searchResults.topics.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                          <Hash size={16} className="mr-2 text-amber-500" />
                          话题
                        </h3>
                        {searchResults.topics.length > 4 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-500 h-auto py-1"
                            onClick={() => setActiveTab('topics')}
                          >
                            查看全部
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {searchResults.topics.slice(0, 4).map((topic) => (
                          <div 
                            key={topic.id}
                            className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                            onClick={() => handleTopicClick(topic.id, topic.name)}
                          >
                            <h4 className="font-medium text-gray-800 mb-1">#{topic.name}</h4>
                            <p className="text-xs text-gray-500">{topic.count}个问题</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.experts.length === 0 && 
                   searchResults.questions.length === 0 && 
                   searchResults.topics.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500">未找到相关结果</p>
                      <p className="text-sm text-gray-400 mt-2">尝试其他关键词或浏览热门话题</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="people" className="mt-0">
                  {searchResults.experts.length > 0 ? (
                    <div className="space-y-3">
                      {searchResults.experts.map((expert) => (
                        <div 
                          key={expert.id}
                          className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                          onClick={() => handleExpertClick(expert.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border border-green-50">
                              <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                              <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-gray-800">{expert.name}</h4>
                              <p className="text-xs text-green-600">{expert.title}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {expert.tags.map((tag: string, index: number) => (
                                  <span key={index} className="bg-green-50 text-green-600 text-xs px-1.5 py-0.5 rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">未找到相关达人</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="questions" className="mt-0">
                  {searchResults.questions.length > 0 ? (
                    <div className="space-y-3">
                      {searchResults.questions.map((question) => (
                        <div 
                          key={question.id}
                          className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                          onClick={() => handleQuestionClick(question.id)}
                        >
                          <h4 className="font-medium text-gray-800 mb-1">{question.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{question.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={question.asker.avatar} alt={question.asker.name} />
                                <AvatarFallback>{question.asker.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">{question.time}</span>
                            </div>
                            <div className="flex gap-1">
                              {question.tags.map((tag: string, index: number) => (
                                <span key={index} className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">未找到相关问题</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="topics" className="mt-0">
                  {searchResults.topics.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {searchResults.topics.map((topic) => (
                        <div 
                          key={topic.id}
                          className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                          onClick={() => handleTopicClick(topic.id, topic.name)}
                        >
                          <h4 className="font-medium text-gray-800 mb-1">#{topic.name}</h4>
                          <p className="text-xs text-gray-500">{topic.count}个问题</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">未找到相关话题</p>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      )}

      {/* Recent Searches */}
      {!searchTerm && recentSearches.length > 0 && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center">
              <Clock size={16} className="mr-2 text-gray-500" />
              最近搜索
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 h-auto py-1"
              onClick={clearRecentSearches}
            >
              清除
            </Button>
          </div>
          <div className="space-y-2">
            {recentSearches.map((term, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRecentSearchClick(term)}
              >
                <div className="flex items-center">
                  <Clock size={16} className="mr-3 text-gray-400" />
                  <span className="text-gray-700">{term}</span>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecentSearches(recentSearches.filter(s => s !== term));
                    localStorage.setItem('recentSearches', JSON.stringify(
                      recentSearches.filter(s => s !== term)
                    ));
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hot Searches */}
      {!searchTerm && (
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">热门搜索</h3>
          <div className="flex flex-wrap gap-2">
            {['高考志愿填报', '考研英语', '留学申请', '四六级备考', '算法学习', '实习求职'].map((term, index) => (
              <button 
                key={index}
                className="bg-white text-gray-700 rounded-full px-3 py-1.5 text-sm shadow-sm hover:shadow-md transition-all"
                onClick={() => handleRecentSearchClick(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
