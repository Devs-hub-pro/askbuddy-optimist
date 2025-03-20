
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Search, AlignJustify, Grid3X3, Award } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import QuestionCard from '@/components/QuestionCard';
import SearchBar from "@/components/SearchBar";
import BottomNav from '@/components/BottomNav';

const KaoyanCategory = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'list'>('list');

  // Mock experts data
  const experts = [
    {
      id: '1',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '清华博士 | 考研规划',
      description: '5年考研辅导经验，擅长数学与专业课',
      tags: ['考研', '数学', '规划'],
      rating: 4.8
    },
    {
      id: '2',
      name: '张老师',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      title: '北大硕士 | 考研英语',
      description: '8年考研英语辅导经验，精通阅读和写作',
      tags: ['考研', '英语', '写作'],
      rating: 4.9
    },
    {
      id: '3',
      name: '王教授',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      title: '人大教授 | 考研政治',
      description: '10年政治教学经验，擅长简化复杂概念',
      tags: ['考研', '政治', '时政'],
      rating: 4.7
    },
    {
      id: '4',
      name: '李博士',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      title: '复旦博士 | 考研专业课',
      description: '专注经济学、管理学专业课辅导',
      tags: ['考研', '经济学', '专业课'],
      rating: 4.8
    },
    {
      id: '5',
      name: '赵老师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '浙大硕士 | 考研心理',
      description: '心理学背景，专注考研学习方法与心态调整',
      tags: ['考研', '心理', '时间管理'],
      rating: 4.6
    },
    {
      id: '6',
      name: '陈导师',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: '上交硕士 | 数学辅导',
      description: '考研数学满分获得者，擅长教授解题技巧',
      tags: ['考研', '数学', '高数'],
      rating: 4.9
    }
  ];

  // Mock questions data
  const questions = [
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
      title: '考研英语如何提高阅读理解速度？',
      description: '英语阅读总是做不完，有什么提高阅读速度和理解能力的方法？',
      asker: {
        name: '英语困难户',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
      },
      time: '4小时前',
      tags: ['考研', '英语', '阅读理解'],
      points: 25,
      viewCount: '2.1k'
    },
    {
      id: '3',
      title: '考研政治背诵方法与技巧分享',
      description: '政治需要背的内容太多，有什么好的记忆方法可以分享吗？',
      asker: {
        name: '政治小白',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
      },
      time: '1天前',
      tags: ['考研', '政治', '背诵'],
      points: 40,
      viewCount: '5.2k'
    },
    {
      id: '4',
      title: '数学二与数学三的选择问题',
      description: '转专业考研，不知道选数学二还是数学三，有什么建议？',
      asker: {
        name: '数学爱好者',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg'
      },
      time: '6小时前',
      tags: ['考研', '数学', '选择'],
      points: 45,
      viewCount: '4.2k'
    },
  ];

  // Mock subcategories
  const subcategories = [
    { id: '1', name: '数学', icon: '📊', count: 128 },
    { id: '2', name: '英语', icon: '🔤', count: 93 },
    { id: '3', name: '政治', icon: '📜', count: 72 },
    { id: '4', name: '专业课', icon: '📚', count: 145 },
    { id: '5', name: '心理辅导', icon: '🧠', count: 54 },
    { id: '6', name: '时间规划', icon: '⏱️', count: 67 },
    { id: '7', name: '院校选择', icon: '🏛️', count: 82 },
    { id: '8', name: '复试准备', icon: '🎯', count: 59 }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-white to-blue-50/30">
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
        <h1 className="text-xl font-semibold text-white">考研专区</h1>
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
        placeholder="搜索考研问题/专家"
      />

      {/* Subcategories */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">热门分类</h2>
        <div className="grid grid-cols-4 gap-3">
          {subcategories.map(cat => (
            <div 
              key={cat.id} 
              className="bg-white rounded-lg p-2 text-center shadow-sm flex flex-col items-center justify-center h-24"
              onClick={() => navigate(`/kaoyan/subcategory/${cat.id}`)}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-sm font-medium">{cat.name}</div>
              <div className="text-xs text-gray-500">{cat.count}个问题</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs for Experts and Questions */}
      <div className="px-4">
        <Tabs defaultValue="experts" className="w-full">
          <div className="flex justify-between items-center mb-3">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="experts">考研专家</TabsTrigger>
              <TabsTrigger value="questions">热门问题</TabsTrigger>
            </TabsList>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                className={view === 'grid' ? 'text-app-teal' : 'text-gray-500'}
                onClick={() => setView('grid')}
              >
                <Grid3X3 size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={view === 'list' ? 'text-app-teal' : 'text-gray-500'}
                onClick={() => setView('list')}
              >
                <AlignJustify size={18} />
              </Button>
            </div>
          </div>

          <TabsContent value="experts" className="mt-0">
            {view === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {experts.map(expert => (
                  <div 
                    key={expert.id} 
                    className="bg-white rounded-lg p-3 shadow-sm"
                    onClick={() => navigate(`/expert-profile/${expert.id}`)}
                  >
                    <div className="flex flex-col items-center">
                      <Avatar className="w-16 h-16 mb-2">
                        <AvatarImage src={expert.avatar} alt={expert.name} />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium text-center">{expert.name}</h3>
                      <p className="text-xs text-green-600 text-center mb-1">{expert.title}</p>
                      <div className="flex items-center text-amber-500 mb-2">
                        <Award size={14} className="mr-0.5" />
                        <span className="text-xs">{expert.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center mb-2">
                        {expert.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button 
                        className="w-full h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/expert-profile/${expert.id}`);
                        }}
                      >
                        咨询
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {experts.map(expert => (
                  <div 
                    key={expert.id} 
                    className="bg-white rounded-lg p-3 shadow-sm flex items-start"
                    onClick={() => navigate(`/expert-profile/${expert.id}`)}
                  >
                    <Avatar className="w-12 h-12 mr-3">
                      <AvatarImage src={expert.avatar} alt={expert.name} />
                      <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{expert.name}</h3>
                          <p className="text-xs text-green-600">{expert.title}</p>
                        </div>
                        <div className="flex items-center text-amber-500">
                          <Award size={14} className="mr-0.5" />
                          <span className="text-xs">{expert.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 mb-2 line-clamp-2">{expert.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {expert.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button 
                        className="w-full h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/expert-profile/${expert.id}`);
                        }}
                      >
                        咨询
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="questions" className="mt-0">
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={question.id} onClick={() => navigate(`/question/${question.id}`)}>
                  <QuestionCard
                    {...question}
                    delay={index * 0.05}
                  />
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/popular-questions')}
              >
                查看更多问题
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default KaoyanCategory;
