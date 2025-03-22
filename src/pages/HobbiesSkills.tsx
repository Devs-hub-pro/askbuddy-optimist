
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowRight, Bell, Calendar as CalendarIcon } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'arts', name: '艺术创作', icon: '🎨' },
  { id: 'music', name: '音乐乐器', icon: '🎸' },
  { id: 'sports', name: '运动技能', icon: '⚽' },
  { id: 'cooking', name: '烹饪美食', icon: '🍳' },
  { id: 'crafts', name: '手工制作', icon: '✂️' },
  { id: 'photography', name: '摄影摄像', icon: '📷' },
  { id: 'dance', name: '舞蹈表演', icon: '💃' },
  { id: 'writing', name: '写作创作', icon: '✍️' },
];

const popularQuestions = [
  {
    id: '1',
    title: '初学者如何学习钢琴？有什么好的入门方法？',
    answers: 48,
    views: 2100,
  },
  {
    id: '2',
    title: '摄影构图有哪些基本原则？',
    answers: 52,
    views: 3400,
  },
  {
    id: '3',
    title: '如何提高自己的绘画技巧？',
    answers: 39,
    views: 1800,
  },
  {
    id: '4',
    title: '学习街舞需要具备哪些基础条件？',
    answers: 28,
    views: 1200,
  },
];

const experts = [
  {
    id: '1',
    name: '王老师',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    title: '钢琴演奏家',
    institution: '音乐学院',
    rating: 4.9,
    reviewCount: 143,
    price: 200,
  },
  {
    id: '2',
    name: '李摄影师',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    title: '专业摄影师',
    institution: '视觉艺术工作室',
    rating: 4.8,
    reviewCount: 89,
    price: 180,
  },
  {
    id: '3',
    name: '张画家',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: '插画艺术家',
    institution: '艺术创作中心',
    rating: 4.7,
    reviewCount: 95,
    price: 150,
  },
];

const courses = [
  {
    id: '1',
    title: '零基础钢琴入门课程',
    instructor: '王老师',
    level: '初级',
    duration: '10周',
    students: 876,
    rating: 4.8,
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '2',
    title: '手机摄影进阶课程',
    instructor: '李摄影师',
    level: '中级',
    duration: '6周',
    students: 654,
    rating: 4.9,
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '3',
    title: '数字插画创作指南',
    instructor: '张画家',
    level: '全部',
    duration: '8周',
    students: 543,
    rating: 4.7,
    price: 999,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1547333726-b2b3c3663be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  },
];

const HobbiesSkills = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommend');

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?category=${categoryId}`);
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  const handleExpertClick = (expertId: string) => {
    navigate(`/expert/${expertId}`);
  };

  const handleCourseClick = (courseId: string) => {
    // For demonstration purposes, navigate to question detail
    navigate(`/question/${courseId}`);
  };

  const handleSeeAll = (section: string) => {
    navigate(`/search?section=${section}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="pt-12">
        {/* Header with search and notifications */}
        <div className="bg-white p-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold">兴趣技能</h1>
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/calendar')}
              className="text-gray-600"
            >
              <CalendarIcon size={24} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/notifications')}
              className="text-gray-600"
            >
              <Bell size={24} />
            </Button>
          </div>
        </div>
        
        {/* Search bar */}
        <SearchBar 
          placeholder="搜索兴趣爱好或技能..." 
          onSearch={(value) => navigate(`/search?q=${encodeURIComponent(value)}`)}
        />
        
        {/* Categories grid */}
        <div className="bg-white p-4 mb-2">
          <div className="grid grid-cols-4 gap-3">
            {categories.map(category => (
              <div 
                key={category.id}
                className="flex flex-col items-center justify-center p-2 cursor-pointer"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl mb-1">
                  {category.icon}
                </div>
                <span className="text-xs text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tabs for content sections */}
        <div className="bg-white mb-2">
          <Tabs defaultValue="recommend" onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start px-2 h-12 bg-transparent border-b border-gray-200">
              <TabsTrigger 
                value="recommend" 
                className="data-[state=active]:text-app-blue data-[state=active]:border-b-2 data-[state=active]:border-app-blue rounded-none px-4"
              >
                推荐
              </TabsTrigger>
              <TabsTrigger 
                value="questions" 
                className="data-[state=active]:text-app-blue data-[state=active]:border-b-2 data-[state=active]:border-app-blue rounded-none px-4"
              >
                问题
              </TabsTrigger>
              <TabsTrigger 
                value="experts" 
                className="data-[state=active]:text-app-blue data-[state=active]:border-b-2 data-[state=active]:border-app-blue rounded-none px-4"
              >
                专家
              </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                className="data-[state=active]:text-app-blue data-[state=active]:border-b-2 data-[state=active]:border-app-blue rounded-none px-4"
              >
                课程
              </TabsTrigger>
            </TabsList>
            
            {/* Recommend Tab Content */}
            <TabsContent value="recommend" className="m-0">
              {/* Popular Questions Section */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">热门问题</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500"
                    onClick={() => handleSeeAll('questions')}
                  >
                    查看全部 <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {popularQuestions.slice(0, 2).map(question => (
                    <div 
                      key={question.id}
                      className="bg-gray-50 p-3 rounded-lg cursor-pointer"
                      onClick={() => handleQuestionClick(question.id)}
                    >
                      <h3 className="text-gray-800 font-medium">{question.title}</h3>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>{question.answers} 回答</span>
                        <span className="mx-2">•</span>
                        <span>{question.views} 浏览</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Featured Experts Section */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">推荐专家</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500"
                    onClick={() => handleSeeAll('experts')}
                  >
                    查看全部 <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {experts.slice(0, 2).map(expert => (
                    <div 
                      key={expert.id}
                      className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleExpertClick(expert.id)}
                    >
                      <img 
                        src={expert.avatar} 
                        alt={expert.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h3 className="text-gray-800 font-medium">{expert.name}</h3>
                        <p className="text-xs text-gray-500">{expert.title}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500 text-xs">★</span>
                          <span className="text-xs text-gray-700 ml-1">{expert.rating}</span>
                          <span className="text-xs text-gray-500 ml-2">{expert.reviewCount} 评价</span>
                        </div>
                      </div>
                      <div className="ml-auto text-app-blue font-medium">
                        ¥{expert.price}/次
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Hobbies Courses Section */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">兴趣课程</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500"
                    onClick={() => handleSeeAll('courses')}
                  >
                    查看全部 <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {courses.slice(0, 2).map(course => (
                    <div 
                      key={course.id}
                      className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <div className="h-32 bg-gray-200 relative">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <h3 className="text-white font-medium">{course.title}</h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{course.instructor} • {course.level}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500 text-xs">★</span>
                            <span className="text-xs text-gray-700 ml-1">{course.rating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <span className="text-app-blue font-medium">¥{course.price}</span>
                            <span className="text-xs text-gray-500 line-through ml-1">¥{course.originalPrice}</span>
                          </div>
                          <span className="text-xs text-gray-500">{course.students} 学员</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Questions Tab Content */}
            <TabsContent value="questions" className="m-0 p-4">
              <div className="space-y-3">
                {popularQuestions.map(question => (
                  <div 
                    key={question.id}
                    className="bg-gray-50 p-3 rounded-lg cursor-pointer"
                    onClick={() => handleQuestionClick(question.id)}
                  >
                    <h3 className="text-gray-800 font-medium">{question.title}</h3>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>{question.answers} 回答</span>
                      <span className="mx-2">•</span>
                      <span>{question.views} 浏览</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Experts Tab Content */}
            <TabsContent value="experts" className="m-0 p-4">
              <div className="space-y-3">
                {experts.map(expert => (
                  <div 
                    key={expert.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleExpertClick(expert.id)}
                  >
                    <img 
                      src={expert.avatar} 
                      alt={expert.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h3 className="text-gray-800 font-medium">{expert.name}</h3>
                      <p className="text-xs text-gray-500">{expert.title}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-xs text-gray-700 ml-1">{expert.rating}</span>
                        <span className="text-xs text-gray-500 ml-2">{expert.reviewCount} 评价</span>
                      </div>
                    </div>
                    <div className="ml-auto text-app-blue font-medium">
                      ¥{expert.price}/次
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Courses Tab Content */}
            <TabsContent value="courses" className="m-0 p-4">
              <div className="space-y-4">
                {courses.map(course => (
                  <div 
                    key={course.id}
                    className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="h-32 bg-gray-200 relative">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <h3 className="text-white font-medium">{course.title}</h3>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{course.instructor} • {course.level}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-xs">★</span>
                          <span className="text-xs text-gray-700 ml-1">{course.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <span className="text-app-blue font-medium">¥{course.price}</span>
                          <span className="text-xs text-gray-500 line-through ml-1">¥{course.originalPrice}</span>
                        </div>
                        <span className="text-xs text-gray-500">{course.students} 学员</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default HobbiesSkills;
