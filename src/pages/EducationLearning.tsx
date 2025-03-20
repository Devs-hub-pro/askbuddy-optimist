
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowRight, Bell, Calendar as CalendarIcon } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'kaoyan', name: '考研', icon: '📚' },
  { id: 'cet', name: '四六级', icon: '📝' },
  { id: 'ielts', name: '雅思', icon: '🌍' },
  { id: 'toefl', name: '托福', icon: '🌎' },
  { id: 'gre', name: 'GRE', icon: '🧠' },
  { id: 'gmat', name: 'GMAT', icon: '📊' },
  { id: 'sat', name: 'SAT', icon: '📄' },
  { id: 'programming', name: '编程', icon: '💻' },
  { id: 'design', name: '设计', icon: '🎨' },
  { id: 'language', name: '语言', icon: '🗣️' },
  { id: 'certification', name: '资格证', icon: '🏆' },
  { id: 'other', name: '其他', icon: '🔍' },
];

const popularQuestions = [
  {
    id: '1',
    title: '考研英语阅读理解有什么高效的做题方法？',
    answers: 42,
    views: 1200,
  },
  {
    id: '2',
    title: '如何准备雅思口语考试能够达到7分以上？',
    answers: 38,
    views: 980,
  },
  {
    id: '3',
    title: '编程零基础应该从哪门语言开始学习？',
    answers: 50,
    views: 1500,
  },
  {
    id: '4',
    title: '四六级考试中有哪些容易丢分的细节问题？',
    answers: 29,
    views: 860,
  },
];

const experts = [
  {
    id: '1',
    name: '王教授',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    title: '考研英语辅导专家',
    institution: '北京大学',
    rating: 4.9,
    reviewCount: 128,
    price: 200,
  },
  {
    id: '2',
    name: '李博士',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    title: '雅思培训讲师',
    institution: '剑桥英语',
    rating: 4.8,
    reviewCount: 89,
    price: 180,
  },
  {
    id: '3',
    name: '张老师',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    title: '计算机科学讲师',
    institution: '清华大学',
    rating: 4.7,
    reviewCount: 75,
    price: 220,
  },
];

const courses = [
  {
    id: '1',
    title: '2024考研英语词汇突破班',
    instructor: '王教授',
    level: '中级',
    duration: '12周',
    students: 1289,
    rating: 4.8,
    price: 1999,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '2',
    title: '雅思口语从6到7分进阶课程',
    instructor: '李博士',
    level: '高级',
    duration: '8周',
    students: 756,
    rating: 4.9,
    price: 2499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '3',
    title: 'Python零基础入门到实战',
    instructor: '张老师',
    level: '初级',
    duration: '10周',
    students: 2345,
    rating: 4.7,
    price: 1799,
    originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
  },
];

const EducationLearning = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommend');

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/education/search?category=${categoryId}`);
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
    navigate(`/education/search?section=${section}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="pt-12">
        {/* Header with search and notifications */}
        <div className="bg-white p-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold">教育学习</h1>
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
          placeholder="搜索教育问题、课程或专家..." 
          onSearch={(value) => navigate(`/education/search?q=${encodeURIComponent(value)}`)}
        />
        
        {/* Categories grid */}
        <div className="bg-white p-4 mb-2">
          <div className="grid grid-cols-4 gap-3">
            {categories.slice(0, 8).map(category => (
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
              
              {/* Popular Courses Section */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">热门课程</h2>
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

export default EducationLearning;
