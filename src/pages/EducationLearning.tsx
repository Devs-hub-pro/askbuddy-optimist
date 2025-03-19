
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  GraduationCap, 
  BookOpen, 
  GlobeIcon, 
  Award, 
  FileText, 
  Plus,
  Bell,
  CalendarPlus
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/SearchBar";

const EducationLearning = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Simulate loading content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Important dates data
  const importantDates = [
    { date: '2024-12-25', event: '全国研究生考试', countdown: 65, type: 'kaoyan' },
    { date: '2024-10-15', event: '考研预报名开始', countdown: 15, type: 'kaoyan' },
    { date: '2024-11-20', event: 'TOEFL/GRE冬季考试', countdown: 40, type: 'study-abroad' },
    { date: '2025-06-07', event: '2025高考', countdown: 240, type: 'gaokao' }
  ];
  
  // Filter important dates based on selected category
  const filteredDates = activeCategory === 'all' 
    ? importantDates 
    : importantDates.filter(date => date.type === activeCategory);
  
  // Categories data
  const categories = [
    { id: 'all', name: '全部', icon: <Calendar size={16} /> },
    { id: 'gaokao', name: '高考', icon: <GraduationCap size={16} /> },
    { id: 'kaoyan', name: '考研', icon: <BookOpen size={16} /> },
    { id: 'study-abroad', name: '留学', icon: <GlobeIcon size={16} /> },
    { id: 'competition', name: '竞赛', icon: <Award size={16} /> },
    { id: 'paper', name: '论文写作', icon: <FileText size={16} /> }
  ];
  
  // Experts data
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
    }
  ];
  
  // Filter experts based on selected category
  const filteredExperts = activeCategory === 'all' 
    ? allExperts 
    : allExperts.filter(expert => expert.category === activeCategory);
  
  // Community questions data
  const communityQuestions = [
    {
      id: '1',
      title: '如何有效管理考研复习时间？',
      description: '我是23届考研生，感觉每天都很忙但效率不高，有没有好的时间管理方法...',
      user: {
        name: '小李',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      tags: ['考研', '时间管理'],
      answers: 12,
      points: 30,
      category: 'kaoyan'
    },
    {
      id: '2',
      title: '美国本科留学需要准备哪些标化考试？',
      description: '高二学生，计划申请美国本科，不知道需要准备什么考试，什么时候开始准备比较好...',
      user: {
        name: '高中生',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
      },
      tags: ['留学', '标化考试'],
      answers: 8,
      points: 25,
      category: 'study-abroad'
    },
    {
      id: '3',
      title: '高考志愿：985分数够不到怎么选择？',
      description: '今年高考估分630，想上计算机但分数线可能差一点，是冲一冲还是选二本保底呢？',
      user: {
        name: '高考生',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
      },
      tags: ['高考', '志愿填报'],
      answers: 15,
      points: 40,
      category: 'gaokao'
    },
    {
      id: '4',
      title: 'SCI论文投稿被拒怎么修改提高接收率？',
      description: '博士生，论文被拒了两次，审稿人给了很多意见，但不知道如何有效修改...',
      user: {
        name: '博士在读',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg'
      },
      tags: ['论文', 'SCI', '修改'],
      answers: 9,
      points: 35,
      category: 'paper'
    },
    {
      id: '5',
      title: '数学建模竞赛如何选择合适的算法？',
      description: '准备参加下一届美赛，想了解不同类型问题适合用什么算法和模型...',
      user: {
        name: '数模爱好者',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      tags: ['数学建模', '算法', '竞赛'],
      answers: 7,
      points: 20,
      category: 'competition'
    }
  ];
  
  // Filter questions based on selected category
  const filteredQuestions = activeCategory === 'all'
    ? communityQuestions
    : communityQuestions.filter(question => question.category === activeCategory);

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    
    if (value.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // Match experts based on keywords
      const filteredExperts = allExperts.filter(expert => {
        const lowerCaseValue = value.toLowerCase();
        
        // Check if any keyword contains the search value
        return expert.keywords.some(keyword => 
          keyword.toLowerCase().includes(lowerCaseValue)
        );
      });
      
      setSearchResults(filteredExperts);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm animate-fade-in">
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={() => navigate('/')} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base">教育学习</div>
          <button className="text-white">
            <Bell size={20} />
          </button>
        </div>
      </div>
      
      {/* Enhanced Search Bar */}
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="搜索问题/达人/话题，为您匹配合适的回答者"
      />
      
      {/* Search Results */}
      {searchQuery.trim() !== '' && (
        <div className="px-4 mb-6">
          <h2 className="text-lg font-bold mb-3">
            {isSearching ? '搜索中...' : `"${searchQuery}" 的匹配结果`}
          </h2>
          
          {isSearching ? (
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white rounded-lg p-3 animate-pulse shadow-sm">
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
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {searchResults.map(expert => (
                <Card key={expert.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center mb-2">
                      <img 
                        src={expert.avatar} 
                        alt={expert.name} 
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium">{expert.name}</p>
                        <p className="text-xs text-gray-500">{expert.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 mb-2 line-clamp-2">{expert.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.tags.map((tag, index) => (
                        <span key={index} className="bg-green-50 text-green-600 text-xs px-1.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-gray-500">未找到匹配的回答者</p>
              <p className="text-sm text-blue-600 mt-2">
                您可以直接提问，我们会为您寻找最合适的回答者
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Only show the normal content if not searching */}
      {searchQuery.trim() === '' && (
        <>
          {/* Important Dates Calendar - Combined Section */}
          <div className="px-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Calendar size={18} className="text-indigo-600 mr-2" />
                  <h3 className="font-medium text-sm">重要日期日历</h3>
                </div>
                <button className="flex items-center text-xs text-indigo-600 bg-white rounded-full px-2 py-1 shadow-sm">
                  <CalendarPlus size={12} className="mr-1" />
                  <span>添加日程</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {filteredDates.map((item, index) => {
                  const eventDate = new Date(item.date);
                  const formattedDate = `${eventDate.getMonth() + 1}月${eventDate.getDate()}日`;
                  
                  return (
                    <div key={index} className="flex items-center justify-between bg-white rounded-md p-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{item.event}</span>
                        <span className="text-xs text-gray-500">{formattedDate}</span>
                      </div>
                      <div className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.countdown}天
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Category Tags */}
          <div className="px-4 mb-4 overflow-x-auto">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className={`flex-shrink-0 ${activeCategory === category.id ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'} rounded-full px-3 py-1.5 flex items-center gap-1 cursor-pointer`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon}
                  <span className="text-xs font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Community Questions */}
          <div className="px-4 mb-6">
            <Tabs defaultValue="everyone" className="w-full">
              <div className="relative mb-6 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-gray-100">
                <TabsList className="w-full bg-transparent p-0 h-auto">
                  <TabsTrigger 
                    value="everyone" 
                    className="font-bold text-lg pb-2 relative data-[state=active]:text-app-text data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:text-gray-400"
                  >
                    大家都在问
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-teal to-app-blue z-10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experts" 
                    className="font-bold text-lg pb-2 relative data-[state=active]:text-app-text data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:text-gray-400"
                  >
                    找TA问问
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-teal to-app-blue z-10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="everyone" className="mt-0">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-white rounded-lg p-4 animate-pulse-soft shadow-sm">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-10 bg-gray-200 rounded w-full mb-3"></div>
                        <div className="flex space-x-2">
                          <div className="h-4 bg-gray-200 rounded w-12"></div>
                          <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredQuestions.map((question) => (
                      <Card key={question.id} className="shadow-sm">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-base mb-2">{question.title}</h3>
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{question.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {question.tags.map((tag, index) => (
                              <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img 
                                src={question.user.avatar} 
                                alt={question.user.name} 
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span className="text-xs text-gray-600">{question.user.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{question.answers} 回答</span>
                              <div className="flex items-center text-yellow-600 text-xs">
                                <span className="bg-yellow-50 px-1.5 py-0.5 rounded-full">{question.points}积分</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="experts" className="mt-0">
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-white rounded-lg p-3 animate-pulse-soft shadow-sm">
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
                  <div className="grid grid-cols-2 gap-3">
                    {filteredExperts.map((expert) => (
                      <Card key={expert.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-center mb-2">
                            <img 
                              src={expert.avatar} 
                              alt={expert.name} 
                              className="w-10 h-10 rounded-full mr-2"
                            />
                            <div>
                              <p className="text-sm font-medium">{expert.name}</p>
                              <p className="text-xs text-gray-500">{expert.title}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 mb-2 line-clamp-2">{expert.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {expert.tags.map((tag, index) => (
                              <span key={index} className="bg-green-50 text-green-600 text-xs px-1.5 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
      
      {/* Floating Ask Button */}
      <button className="fixed bottom-20 right-4 bg-gradient-to-r from-app-teal to-app-blue text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default EducationLearning;
