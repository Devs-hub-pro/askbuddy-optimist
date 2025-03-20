
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Filter, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionCard from '@/components/QuestionCard';
import BottomNav from '@/components/BottomNav';

const PopularQuestions = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'newest' | 'hottest'>('hottest');

  // Mock questions data - in a real app, this would come from an API
  const questions = [
    {
      id: '1',
      title: '如何有效管理考研复习时间？',
      description: '我是23届考研生，感觉每天都很忙但效率不高，有没有好的时间管理方法？我尝试过番茄钟，但好像不是很有效。如何分配各科目的时间？',
      asker: {
        name: '小李',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      time: '2小时前',
      tags: ['考研', '时间管理', '学习方法'],
      points: 30,
      viewCount: '3.8k',
      category: 'kaoyan'
    },
    {
      id: '2',
      title: '美国本科留学需要准备哪些标化考试？',
      description: '高二学生，计划申请美国本科，不知道需要准备什么考试，什么时候开始准备比较好？需要上培训班吗？',
      asker: {
        name: '高中生',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
      },
      time: '4小时前',
      tags: ['留学', '标化考试', '美国'],
      points: 25,
      viewCount: '2.1k',
      category: 'education'
    },
    {
      id: '3',
      title: '高考志愿：985分数够不到怎么选择？',
      description: '今年高考估分630，想上计算机但分数线可能差一点，是冲一冲还是选二本保底呢？有没有推荐的方法？',
      asker: {
        name: '高考生',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
      },
      time: '1天前',
      tags: ['高考', '志愿填报', '985'],
      points: 40,
      viewCount: '5.2k',
      category: 'education'
    },
    {
      id: '4',
      title: '前端面试怎么准备算法题？',
      description: '准备面试大厂前端，听说算法很重要，有什么好的复习资料和方法推荐？需要刷多少题目？',
      asker: {
        name: 'JS爱好者',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg'
      },
      time: '6小时前',
      tags: ['前端', '算法', '面试'],
      points: 45,
      viewCount: '4.2k',
      category: 'tech'
    },
    {
      id: '5',
      title: '如何在一个月内科学减脂10斤？',
      description: '女生，25岁，体重130斤，想在一个月内减掉10斤，有什么科学的饮食和运动方案？需要控制热量摄入吗？',
      asker: {
        name: '减肥达人',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      time: '1天前',
      tags: ['减脂', '健身', '饮食'],
      points: 35,
      viewCount: '6.7k',
      category: 'fitness'
    },
    {
      id: '6',
      title: '考研英语复习该如何规划？',
      description: '准备明年考研，英语是我的弱项，怎么规划复习才能事半功倍？有什么推荐的资料和学习方法吗？',
      asker: {
        name: '考研人',
        avatar: 'https://randomuser.me/api/portraits/men/52.jpg'
      },
      time: '3天前',
      tags: ['考研', '英语', '复习规划'],
      points: 38,
      viewCount: '4.5k',
      category: 'kaoyan'
    },
    {
      id: '7',
      title: '初级会计考试备考经验分享',
      description: '零基础如何备考初级会计考试？有什么好的学习方法和时间规划建议？大家都用什么资料复习？',
      asker: {
        name: '会计小白',
        avatar: 'https://randomuser.me/api/portraits/women/52.jpg'
      },
      time: '4天前',
      tags: ['会计', '考证', '学习方法'],
      points: 32,
      viewCount: '3.2k',
      category: 'certification'
    }
  ];

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
        <h1 className="text-xl font-semibold text-white">热门问题</h1>
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

      {/* Filter options */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-gray-700 bg-white shadow-sm"
            onClick={() => setSortBy(sortBy === 'newest' ? 'hottest' : 'newest')}
          >
            <ArrowDownUp size={14} className="mr-1" />
            {sortBy === 'newest' ? '最新优先' : '热度优先'}
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
      </div>

      <BottomNav />
    </div>
  );
};

export default PopularQuestions;
