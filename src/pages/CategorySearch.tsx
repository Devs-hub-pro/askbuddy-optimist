
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Bell, Search, Filter, ArrowDownUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionCard from '@/components/QuestionCard';
import SearchBar from "@/components/SearchBar";
import BottomNav from '@/components/BottomNav';

const CategorySearch = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Category mapping
  const categoryMap: Record<string, {name: string, icon: string, color: string}> = {
    'education': { name: '教育学习', icon: '🎓', color: 'bg-app-blue' },
    'career': { name: '职业发展', icon: '💼', color: 'bg-app-green' },
    'lifestyle': { name: '生活服务', icon: '🏠', color: 'bg-app-orange' },
    'hobbies': { name: '兴趣技能', icon: '📷', color: 'bg-app-red' }
  };

  const currentCategory = category ? categoryMap[category] : categoryMap['education'];

  // Mock questions data based on category
  const getMockQuestions = (category: string) => {
    if (category === 'education') {
      return [
        {
          id: '1',
          title: '如何有效管理考研复习时间？',
          description: '我是23届考研生，感觉每天都很忙但效率不高，有没有好的时间管理方法？',
          asker: {
            name: '小李',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
          },
          time: '2小时前',
          tags: ['考研', '时间管理', '学习方法'],
          points: 30,
          viewCount: '3.8k'
        },
        {
          id: '2',
          title: '美国本科留学需要准备哪些标化考试？',
          description: '高二学生，计划申请美国本科，不知道需要准备什么考试，什么时候开始准备比较好？',
          asker: {
            name: '高中生',
            avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
          },
          time: '4小时前',
          tags: ['留学', '标化考试', '美国'],
          points: 25,
          viewCount: '2.1k'
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
          tags: ['高考', '志愿填报', '985'],
          points: 40,
          viewCount: '5.2k'
        }
      ];
    } else if (category === 'career') {
      return [
        {
          id: '4',
          title: '前端面试怎么准备算法题？',
          description: '准备面试大厂前端，听说算法很重要，有什么好的复习资料和方法推荐？',
          asker: {
            name: 'JS爱好者',
            avatar: 'https://randomuser.me/api/portraits/men/36.jpg'
          },
          time: '6小时前',
          tags: ['前端', '算法', '面试'],
          points: 45,
          viewCount: '4.2k'
        },
        {
          id: '5',
          title: '如何在互联网寒冬找到理想工作？',
          description: '今年应届毕业生，互联网行业不景气，如何提高自己的竞争力？',
          asker: {
            name: '应届生',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
          },
          time: '1天前',
          tags: ['求职', '互联网', '简历'],
          points: 35,
          viewCount: '6.7k'
        }
      ];
    } else if (category === 'lifestyle') {
      return [
        {
          id: '6',
          title: '如何在一个月内科学减脂10斤？',
          description: '女生，25岁，体重130斤，想在一个月内减掉10斤，有什么科学的饮食和运动方案？',
          asker: {
            name: '减肥达人',
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
          },
          time: '1天前',
          tags: ['减脂', '健身', '饮食'],
          points: 35,
          viewCount: '6.7k'
        },
        {
          id: '7',
          title: '刚毕业如何理财规划？',
          description: '应届毕业生，月薪8k，有什么好的理财建议？如何分配收入？',
          asker: {
            name: '小白理财',
            avatar: 'https://randomuser.me/api/portraits/men/26.jpg'
          },
          time: '3天前',
          tags: ['理财', '规划', '储蓄'],
          points: 38,
          viewCount: '5.9k'
        }
      ];
    } else {
      return [
        {
          id: '8',
          title: '初学摄影，如何选择入门相机？',
          description: '打算入门摄影，预算5000左右，有什么相机推荐？',
          asker: {
            name: '摄影小白',
            avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
          },
          time: '2天前',
          tags: ['摄影', '器材', '入门'],
          points: 32,
          viewCount: '4.5k'
        },
        {
          id: '9',
          title: '如何自学钢琴？',
          description: '成年人想学钢琴，有没有好的自学方法和教材推荐？',
          asker: {
            name: '音乐爱好者',
            avatar: 'https://randomuser.me/api/portraits/men/38.jpg'
          },
          time: '4天前',
          tags: ['钢琴', '自学', '乐器'],
          points: 30,
          viewCount: '3.8k'
        }
      ];
    }
  };

  const questions = getMockQuestions(category || 'education');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsLoading(true);
    // Simulate API search
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-app-teal flex items-center p-4 border-b shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2 text-white"
        >
          <ChevronLeft size={24} />
        </Button>
        <div className="flex items-center">
          <span className="text-xl mr-2">{currentCategory.icon}</span>
          <h1 className="text-xl font-semibold text-white">{currentCategory.name}</h1>
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
        onSearch={handleSearch} 
        placeholder={`搜索${currentCategory.name}相关问题`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
      {isLoading ? (
        <div className="space-y-4 p-4">
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
            </div>
          ))}
        </div>
      ) : questions.length > 0 ? (
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
      ) : (
        <div className="p-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">未找到匹配结果</h3>
              <p className="text-gray-500 max-w-xs mb-4">
                尝试使用不同的关键词，或者直接提问，我们会为您寻找最合适的回答者
              </p>
              <Button 
                onClick={() => navigate('/new')}
                className="bg-gradient-to-r from-green-500 to-teal-400"
              >
                我要提问
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default CategorySearch;
