
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchBar from "@/components/SearchBar";
import CategoryGrid from "@/components/CategoryGrid";
import ActivityCards from "@/components/ActivityCards";
import QuestionCard from "@/components/QuestionCard";
import ExpertCard from "@/components/ExpertCard";
import LocationSelector from "@/components/LocationSelector";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState("深圳");
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [recentCities, setRecentCities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'topics' | 'experts'>('topics');
  
  // Mock data - in a real app, these would come from API calls
  const categories = [
    {
      id: 'education',
      name: '教育学习',
      icon: '🎓',
      color: 'bg-app-blue'
    },
    {
      id: 'career',
      name: '职业发展',
      icon: '💼',
      color: 'bg-app-green'
    },
    {
      id: 'lifestyle',
      name: '生活服务',
      icon: '🏠',
      color: 'bg-app-orange'
    },
    {
      id: 'hobbies',
      name: '兴趣技能',
      icon: '📷',
      color: 'bg-app-red'
    }
  ];

  const activities = [
    {
      id: '1',
      title: '大学生灵活就业圈',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80'
    },
    {
      id: '2',
      title: '留学申请季交流空间',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80'
    }
  ];

  const subcategories = [
    { id: 'kaoyan', name: '考研', icon: '📚', hot: true },
    { id: 'gaokao', name: '高考', icon: '📝', hot: true },
    { id: 'cet', name: '英语四六级', icon: '🔤' },
    { id: 'cert', name: '证书考试', icon: '📜' },
    { id: 'study-abroad', name: '留学', icon: '🌎', hot: true },
    { id: 'programming', name: '编程学习', icon: '💻' }
  ];

  const questions = [
    {
      id: '1',
      title: '高考填报志愿热门问题',
      description: '面对众多院校和专业选择，如何根据自己的分数、兴趣做出最优选择？分享经验...',
      asker: {
        name: '李明',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      time: '2小时前',
      tags: ['高考', '志愿填报'],
      points: 50,
      viewCount: '2.5k'
    },
    {
      id: '2',
      title: '留学申请的必备条件',
      description: '想申请美国Top30名校研究生，除了GPA和语言成绩，还需要准备哪些材料？',
      asker: {
        name: '王芳',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      time: '5小时前',
      tags: ['留学', '申请'],
      points: 30,
      viewCount: '1.8k'
    },
    {
      id: '3',
      title: '如何选择最佳职业路径',
      description: '毕业后是进国企还是私企？如何根据自身情况做出规划？',
      asker: {
        name: '张伟',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      time: '1天前',
      tags: ['职业发展', '路径选择'],
      points: 40,
      viewCount: '3.5k'
    }
  ];

  const experts = [
    {
      id: '1',
      name: '张同学',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: '北大硕士 | 出国党',
      description: '专注留学申请文书指导，斯坦福offer获得者',
      tags: ['留学', '文书', '面试'],
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
      category: 'gaokao',
      rating: 4.7,
      responseRate: '92%',
      orderCount: '185单'
    }
  ];

  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '南京', '武汉', '西安'];

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Load recent cities from localStorage
    const cities = localStorage.getItem('recentCities');
    if (cities) {
      setRecentCities(JSON.parse(cities));
    }
    
    // Load current location from localStorage
    const savedLocation = localStorage.getItem('currentLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  const toggleLocationMenu = () => {
    setLocationMenuOpen(prev => !prev);
  };

  const selectLocation = (city: string) => {
    setLocation(city);
    
    // Update recent cities
    let newRecentCities = [...recentCities];
    if (!newRecentCities.includes(city)) {
      newRecentCities.unshift(city);
      if (newRecentCities.length > 5) {
        newRecentCities = newRecentCities.slice(0, 5);
      }
      setRecentCities(newRecentCities);
      localStorage.setItem('recentCities', JSON.stringify(newRecentCities));
    }
    
    localStorage.setItem('currentLocation', city);
    setLocationMenuOpen(false);
  };

  const showCitySelector = () => {
    setLocationMenuOpen(false);
    navigate('/city-selector');
  };

  const handleSearch = (value: string) => {
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    if (subcategoryId === 'kaoyan') {
      navigate('/kaoyan');
    } else {
      navigate(`/category/${subcategoryId}`);
    }
  };

  const handleActivitySelect = (activityId: string) => {
    // In a real app, this would navigate to the activity page
    console.log('Selected activity:', activityId);
  };

  const handleViewAllQuestions = () => {
    navigate('/popular-questions');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'topics' | 'experts');
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 pb-20">
      {/* Header with Location Selector */}
      <div className="sticky top-0 z-50 bg-app-teal animate-fade-in">
        <div className="flex items-center justify-end h-12 px-4">
          <LocationSelector 
            location={location} 
            cities={cities} 
            locationMenuOpen={locationMenuOpen}
            recentCities={recentCities}
            onToggle={toggleLocationMenu}
            onSelect={selectLocation}
            onShowSelector={showCitySelector}
          />
        </div>
      </div>
      
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />
      
      {/* Category Grid */}
      <div className="px-4 mb-4">
        <CategoryGrid 
          categories={categories} 
          onSelect={handleCategorySelect} 
        />
      </div>
      
      {/* Subcategories */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">热门分类</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {subcategories.map(category => (
            <div 
              key={category.id} 
              className="bg-white rounded-lg p-2 text-center shadow-sm hover:shadow-md transition-all"
              onClick={() => handleSubcategorySelect(category.id)}
            >
              <div className="relative inline-block">
                <span className="text-2xl">{category.icon}</span>
                {category.hot && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
              <div className="text-sm mt-1">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Activities */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">热门社区</h2>
          <Button variant="ghost" size="sm" className="text-gray-500 text-xs" onClick={() => navigate('/discover')}>
            更多
            <ArrowRight size={12} className="ml-1" />
          </Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {activities.map(activity => (
            <div 
              key={activity.id} 
              className="min-w-[70%] rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-all"
              onClick={() => handleActivitySelect(activity.id)}
            >
              <div className="h-28 overflow-hidden">
                <img 
                  src={activity.imageUrl} 
                  alt={activity.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <h3 className="font-medium text-sm">{activity.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">1.2k人参与</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs rounded-full">
                    <MessageSquare size={12} className="mr-1" />
                    加入
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Question/Expert Tabs */}
      <div className="px-4">
        <Tabs defaultValue="topics" onValueChange={handleTabChange}>
          <div className="flex items-center justify-between mb-3">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="topics">大家都在问</TabsTrigger>
              <TabsTrigger value="experts">找TA问问</TabsTrigger>
            </TabsList>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 text-xs"
              onClick={activeTab === 'topics' ? handleViewAllQuestions : () => navigate('/search')}
            >
              更多
              <ArrowRight size={12} className="ml-1" />
            </Button>
          </div>
          
          <TabsContent value="topics" className="mt-0 space-y-3">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-4 animate-pulse shadow-sm">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="ml-auto h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                </div>
              ))
            ) : (
              questions.map((question, index) => (
                <div key={question.id} onClick={() => navigate(`/question/${question.id}`)}>
                  <QuestionCard
                    {...question}
                    delay={index * 0.1}
                  />
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="experts" className="mt-0 space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4 animate-pulse shadow-sm">
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
              ))
            ) : (
              experts.map(expert => (
                <ExpertCard key={expert.id} expert={expert} onSelect={() => navigate(`/expert-profile/${expert.id}`)} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
