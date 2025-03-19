
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell, MessageSquare, User, ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SearchBar from "@/components/SearchBar";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedAnswerers, setRecommendedAnswerers] = useState<any[]>([]);
  const [popularTopics, setPopularTopics] = useState<string[]>([
    '考研', '留学申请', '高考志愿', '论文写作', '竞赛辅导', '考证', '英语学习', '数学提高', 
    '职业规划', '简历制作', '面试技巧', '求职咨询'
  ]);

  // Mock data for recommended answerers across all categories
  const allExperts = [
    // Education experts
    {
      id: '1',
      name: '张同学',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: '北大硕士',
      expertise: '专注留学申请文书指导，斯坦福offer获得者',
      tags: ['留学', '文书', '面试'],
      category: 'education'
    },
    {
      id: '2',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '清华博士',
      expertise: '5年考研辅导经验，擅长数学与专业课',
      tags: ['考研', '数学', '规划'],
      category: 'education'
    },
    // Career experts
    {
      id: '3',
      name: '王职业',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: 'HR总监',
      expertise: '10年大厂招聘经验，擅长简历指导与面试技巧',
      tags: ['求职', '简历', '面试'],
      category: 'career'
    },
    {
      id: '4',
      name: '李职场',
      avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
      title: '职业规划师',
      expertise: '帮助500+人实现职业转型，擅长职业规划咨询',
      tags: ['职业规划', '转行', '咨询'],
      category: 'career'
    },
    // Lifestyle experts
    {
      id: '5',
      name: '赵生活',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      title: '理财规划师',
      expertise: '专注个人理财规划，基金定投与税务筹划',
      tags: ['理财', '基金', '税务'],
      category: 'lifestyle'
    },
    {
      id: '6',
      name: '钱医生',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      title: '心理咨询师',
      expertise: '5年心理咨询经验，擅长情绪管理与人际关系调适',
      tags: ['心理', '情绪', '人际关系'],
      category: 'lifestyle'
    },
    // Hobbies experts
    {
      id: '7',
      name: '孙摄影',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      title: '摄影师',
      expertise: '10年摄影经验，擅长人像与风景摄影指导',
      tags: ['摄影', '人像', '风景'],
      category: 'hobbies'
    },
    {
      id: '8',
      name: '周厨师',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      title: '米其林厨师',
      expertise: '擅长家常菜与西点烘焙教学，有自己的美食工作室',
      tags: ['烹饪', '烘焙', '美食'],
      category: 'hobbies'
    }
  ];

  // Mock related questions
  const relatedQuestions = [
    {
      id: '1',
      title: '如何有效管理考研复习时间？',
      asker: {
        name: '小李',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      time: '2小时前',
      tags: ['考研', '时间管理'],
      category: 'education'
    },
    {
      id: '2',
      title: '如何准备大厂面试？',
      asker: {
        name: '应届生',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
      },
      time: '4小时前',
      tags: ['面试', '互联网'],
      category: 'career'
    },
    {
      id: '3',
      title: '如何开始投资理财？',
      asker: {
        name: '上班族',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
      },
      time: '1天前',
      tags: ['理财', '投资'],
      category: 'lifestyle'
    },
    {
      id: '4',
      title: '摄影入门需要准备哪些器材？',
      asker: {
        name: '摄影爱好者',
        avatar: 'https://randomuser.me/api/portraits/men/24.jpg'
      },
      time: '2天前',
      tags: ['摄影', '器材'],
      category: 'hobbies'
    }
  ];

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    } else {
      setIsLoading(false);
    }
  }, [initialQuery]);

  const performSearch = (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    // Simulate API call
    setTimeout(() => {
      if (!query) {
        setRecommendedAnswerers([]);
        setIsLoading(false);
        return;
      }
      
      const filteredExperts = allExperts.filter(expert => {
        const lowerQuery = query.toLowerCase();
        return (
          expert.name.toLowerCase().includes(lowerQuery) ||
          expert.title.toLowerCase().includes(lowerQuery) ||
          expert.expertise.toLowerCase().includes(lowerQuery) ||
          expert.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      });
      
      setRecommendedAnswerers(filteredExperts);
      setIsLoading(false);
    }, 500);
  };

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

  const handleSelectTopic = (topic: string) => {
    setSearchQuery(topic);
    handleSearch(topic);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectExpert = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
  };

  const handleSelectQuestion = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 min-h-screen pb-20">
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm animate-fade-in">
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={handleBack} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base">找人问问 - 搜索</div>
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
      />
      
      <div className="p-4">
        {!searchQuery && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">热门话题</h2>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((topic, index) => (
                  <Button 
                    key={index}
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-gray-50 hover:bg-gray-100 border-gray-200"
                    onClick={() => handleSelectTopic(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <SearchIcon size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">全站搜索</h3>
              <p className="text-gray-500 max-w-xs">
                输入关键词，搜索问题、专家、话题，从全站范围找到你需要的帮助
              </p>
            </div>
          </>
        )}
        
        {searchQuery && (
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
        ) : searchQuery && recommendedAnswerers.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-base font-semibold mb-3">推荐回答者</h3>
            <div className="space-y-4">
              {recommendedAnswerers.map(expert => (
                <div 
                  key={expert.id} 
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleSelectExpert(expert.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border border-green-50">
                        <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{expert.name}</h3>
                        <p className="text-sm text-green-600">{expert.title}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50/50 border-l-2 border-green-200 pl-3 py-2 mb-3 rounded-r-md">
                    <p className="text-sm text-gray-700">
                      {expert.expertise}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {expert.tags.map((tag: string, index: number) => (
                      <span key={index} className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectExpert(expert.id);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 justify-center shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 h-auto"
                    size="sm"
                  >
                    <MessageSquare size={14} />
                    找我问问
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">未找到匹配的专家</h3>
              <p className="text-gray-500 max-w-xs mb-4">
                尝试使用不同的关键词，或者直接提问，我们会为您寻找最合适的回答者
              </p>
              <Button 
                onClick={() => navigate('/')}
                variant="outline" 
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                返回首页
              </Button>
            </div>
          </div>
        ) : null}
        
        {searchQuery && recommendedAnswerers.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-3">相关问题</h3>
            <div className="space-y-3">
              {relatedQuestions.filter(q => {
                const lowerQuery = searchQuery.toLowerCase();
                return (
                  q.title.toLowerCase().includes(lowerQuery) ||
                  q.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
                );
              }).map((question) => (
                <div 
                  key={question.id} 
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleSelectQuestion(question.id)}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{question.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={question.asker.avatar} alt={question.asker.name} />
                      <AvatarFallback>{question.asker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{question.asker.name} · {question.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag, index) => (
                      <span key={index} className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
