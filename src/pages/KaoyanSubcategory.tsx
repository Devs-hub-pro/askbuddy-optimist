
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Bell, Filter, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionCard from '@/components/QuestionCard';
import SearchBar from "@/components/SearchBar";
import BottomNav from '@/components/BottomNav';

const KaoyanSubcategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock subcategories data to match the ID
  const subcategories = [
    { id: '1', name: '数学', icon: '📊' },
    { id: '2', name: '英语', icon: '🔤' },
    { id: '3', name: '政治', icon: '📜' },
    { id: '4', name: '专业课', icon: '📚' },
    { id: '5', name: '心理辅导', icon: '🧠' },
    { id: '6', name: '时间规划', icon: '⏱️' },
    { id: '7', name: '院校选择', icon: '🏛️' },
    { id: '8', name: '复试准备', icon: '🎯' }
  ];

  const currentSubcategory = subcategories.find(cat => cat.id === id) || subcategories[0];

  // Mock questions data based on subcategory
  const getMockQuestions = (subcategoryId: string) => {
    // Different questions for different subcategories
    if (subcategoryId === '1') { // Math
      return [
        {
          id: '1',
          title: '考研数学如何突破高数难点？',
          description: '高数部分总是做不对，尤其是级数和微分方程，有没有好的解题思路？',
          asker: {
            name: '数学困难户',
            avatar: 'https://randomuser.me/api/portraits/men/33.jpg'
          },
          time: '3小时前',
          tags: ['考研', '数学', '高等数学'],
          points: 35,
          viewCount: '2.8k'
        },
        {
          id: '2',
          title: '数学一和数学三的难度差异？',
          description: '打算跨考，纠结选数学一还是数学三，有什么建议吗？',
          asker: {
            name: '跨考生',
            avatar: 'https://randomuser.me/api/portraits/women/41.jpg'
          },
          time: '1天前',
          tags: ['考研', '数学一', '数学三'],
          points: 30,
          viewCount: '3.2k'
        }
      ];
    } else if (subcategoryId === '2') { // English
      return [
        {
          id: '3',
          title: '考研英语作文如何提高分数？',
          description: '英语作文总是在20分左右徘徊，如何提高到25分以上？',
          asker: {
            name: '英语苦手',
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
          },
          time: '5小时前',
          tags: ['考研', '英语', '作文'],
          points: 40,
          viewCount: '4.1k'
        },
        {
          id: '4',
          title: '英语阅读理解有什么好的解题技巧？',
          description: '阅读理解总是做不完，时间不够用，如何提高速度和准确率？',
          asker: {
            name: '阅读困难',
            avatar: 'https://randomuser.me/api/portraits/men/28.jpg'
          },
          time: '2天前',
          tags: ['考研', '英语', '阅读理解'],
          points: 38,
          viewCount: '5.3k'
        }
      ];
    } else {
      // Default questions for other categories
      return [
        {
          id: '5',
          title: `如何备考${currentSubcategory.name}？`,
          description: `我是今年考研生，想了解${currentSubcategory.name}的复习方法和技巧，有经验的前辈能分享一下吗？`,
          asker: {
            name: '考研小白',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
          },
          time: '2小时前',
          tags: ['考研', currentSubcategory.name, '学习方法'],
          points: 30,
          viewCount: '3.8k'
        },
        {
          id: '6',
          title: `${currentSubcategory.name}的重点和难点有哪些？`,
          description: `想了解考研${currentSubcategory.name}的重难点，如何突破？有没有推荐的参考书和资料？`,
          asker: {
            name: '考研人',
            avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
          },
          time: '1天前',
          tags: ['考研', currentSubcategory.name, '重难点'],
          points: 25,
          viewCount: '2.1k'
        }
      ];
    }
  };

  const questions = getMockQuestions(id || '1');

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-app-teal flex items-center p-4 border-b shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/kaoyan')}
          className="mr-2 text-white"
        >
          <ChevronLeft size={24} />
        </Button>
        <div className="flex items-center">
          <span className="text-xl mr-2">{currentSubcategory.icon}</span>
          <h1 className="text-xl font-semibold text-white">{currentSubcategory.name}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white"
          >
            <Bell size={20} />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar 
        onSearch={(value) => console.log('Searching for:', value)} 
        placeholder={`搜索${currentSubcategory.name}相关问题`}
      />

      {/* Filter options */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-gray-700 bg-white shadow-sm"
          >
            <ArrowDownUp size={14} className="mr-1" />
            热度优先
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-gray-700 bg-white shadow-sm"
          >
            <Filter size={14} className="mr-1" />
            筛选
          </Button>
        </div>
        <span className="text-sm text-gray-500">共 {questions.length} 个问题</span>
      </div>

      {/* Questions list */}
      <div className="space-y-3 p-4">
        {questions.map((question, index) => (
          <div key={question.id} onClick={() => navigate(`/question/${question.id}`)}>
            <QuestionCard
              {...question}
              delay={index * 0.05}
            />
          </div>
        ))}

        <Button 
          className="w-full bg-gradient-to-r from-blue-500 to-app-blue"
          onClick={() => navigate('/new')}
        >
          我要提问
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default KaoyanSubcategory;
