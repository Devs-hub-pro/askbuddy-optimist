
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell, MessageSquare, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SearchBar from "@/components/SearchBar";

const EducationSearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);

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
      category: 'study-abroad'
    },
    {
      id: '2',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '清华博士 | 考研规划',
      description: '5年考研辅导经验，擅长数学与专业课',
      tags: ['考研', '数学', '规划'],
      keywords: ['考研', '数学', '专业课', '清华', '规划', '复习'],
      category: 'kaoyan'
    },
    {
      id: '3',
      name: '王老师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '高考志愿规划师',
      description: '10年高考志愿填报指导经验，专精各省份政策',
      tags: ['高考', '志愿填报', '专业选择'],
      keywords: ['高考', '志愿', '填报', '专业选择', '大学', '分数线'],
      category: 'gaokao'
    },
    {
      id: '4',
      name: '李明',
      avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
      title: '清华研究生',
      description: '考研英语特长，英语六级高分，专注英语学习方法',
      tags: ['考研', '英语', '备考'],
      keywords: ['考研', '英语', '六级', '词汇', '听力', '阅读', '写作'],
      category: 'kaoyan'
    },
    {
      id: '5',
      name: '陈教授',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      title: '某985教授 | 论文指导',
      description: '研究生导师，IEEE/SCI论文审稿人，多篇高被引论文',
      tags: ['论文', 'SCI', '科研'],
      keywords: ['学术论文', 'SCI', 'IEEE', '期刊投稿', '审稿意见', '开题报告'],
      category: 'paper'
    },
    {
      id: '6',
      name: '张竞赛',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      title: '全国数学竞赛金牌 | 教练',
      description: '指导学生获得多项全国级奖项，擅长数学建模竞赛',
      tags: ['数学竞赛', '数模', '指导'],
      keywords: ['数学竞赛', '数学建模', 'MCM', 'ICM', '美赛', '华赛'],
      category: 'competition'
    },
    {
      id: '7',
      name: '黄博士',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      title: '哈佛博士 | 留学申请导师',
      description: '5年美国留学申请咨询经验，帮助学生获得常青藤名校录取',
      tags: ['留学申请', '文书指导', '面试技巧'],
      keywords: ['留学申请', '美国大学', '常青藤', '哈佛', '文书', '个人陈述', 'PS', '面试'],
      category: 'study-abroad'
    },
    {
      id: '8',
      name: '赵老师',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      title: '资深高考语文教师',
      description: '15年高考语文教学经验，擅长作文指导，多名学生获得满分作文',
      tags: ['高考语文', '作文', '阅读理解'],
      keywords: ['高考', '语文', '作文', '阅读理解', '文言文', '古诗词', '现代文'],
      category: 'gaokao'
    }
  ];

  const performSearch = (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    // Simulate API call
    setTimeout(() => {
      const results = allExperts.filter(expert => {
        const lowerCaseQuery = query.toLowerCase();
        
        // Search in all text fields
        return expert.keywords.some(keyword => 
          keyword.toLowerCase().includes(lowerCaseQuery)
        ) || 
        expert.name.toLowerCase().includes(lowerCaseQuery) ||
        expert.title.toLowerCase().includes(lowerCaseQuery) ||
        expert.description.toLowerCase().includes(lowerCaseQuery) ||
        expert.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
      });
      
      setSearchResults(results);
      setNoResults(results.length === 0);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    } else {
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

  const handleAskMe = (expertName: string) => {
    console.log(`Opening chat with ${expertName}`);
    // In a real app, this would navigate to a chat with the expert
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
            <User size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">搜索教育领域的专家</h3>
            <p className="text-gray-500 max-w-xs">
              输入关键词，查找能解答您问题的专业人士
            </p>
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
        ) : searchQuery && searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map(expert => (
              <div key={expert.id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
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
                    {expert.description}
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
                  onClick={() => handleAskMe(expert.name)}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 justify-center shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 h-auto"
                  size="sm"
                >
                  <MessageSquare size={14} />
                  找我问问
                </Button>
              </div>
            ))}
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
                onClick={() => navigate('/education')}
                variant="outline" 
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                返回教育学习
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EducationSearchResults;
