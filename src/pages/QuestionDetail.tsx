
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  Award, 
  MessageSquare, 
  Eye,
  BookmarkPlus,
  Share2,
  ChevronDown,
  ChevronUp,
  Mail,
  User
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Mocked question data - in a real app, this would be fetched based on the ID
  const question = {
    id: id || '1',
    title: '如何有效管理考研复习时间？',
    description: '我是23届考研生，感觉每天都很忙但效率不高，有没有好的时间管理方法？我尝试过番茄钟，但好像不是很有效。如何分配各科目的时间？要不要制定详细的计划表？如何避免学习倦怠？希望有过来人分享一下经验。除了管理时间外，如何克服复习中的焦虑也是我很困扰的问题。平衡好考研和生活的边界似乎很难。',
    asker: {
      name: '小李',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    time: '2小时前',
    tags: ['考研', '时间管理', '学习方法', '焦虑'],
    answers: 12,
    viewCount: '3.8k',
    points: 30,
    category: 'kaoyan'
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 pb-20 min-h-screen">
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm animate-fade-in">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base ml-2">问题详情</div>
          <div className="flex-1"></div>
          <button className="text-white">
            <Bell size={20} />
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-white shadow-sm mb-3">
        <h1 className="text-xl font-bold text-gray-800 mb-3 text-left">{question.title}</h1>
        
        <div className="flex items-center mb-4">
          <Avatar className="w-8 h-8 mr-2">
            <AvatarImage src={question.asker.avatar} alt={question.asker.name} />
            <AvatarFallback>{question.asker.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{question.asker.name}</p>
            <p className="text-xs text-gray-500">{question.time}</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="flex items-center text-gray-500">
              <Eye size={14} className="mr-1" />
              <span className="text-xs">{question.viewCount}</span>
            </div>
            <div className="bg-yellow-50 text-yellow-600 rounded-full px-2 py-1 text-xs flex items-center">
              <Award size={12} className="mr-1" />
              {question.points} 积分
            </div>
          </div>
        </div>
        
        <Collapsible
          open={isDescriptionExpanded}
          onOpenChange={setIsDescriptionExpanded}
          className="mb-4"
        >
          <div className="text-sm text-gray-700 leading-relaxed text-left">
            {question.description.length > 100 && !isDescriptionExpanded ? (
              <>
                <p>{question.description.substring(0, 100)}...</p>
                <CollapsibleTrigger className="text-blue-500 text-xs mt-2 hover:underline flex items-center">
                  展开全部 <ChevronDown size={12} className="ml-1" />
                </CollapsibleTrigger>
              </>
            ) : (
              <p>{question.description}</p>
            )}
          </div>
          
          <CollapsibleContent>
            <p className="text-sm text-gray-700 leading-relaxed text-left">{question.description}</p>
            <CollapsibleTrigger className="text-blue-500 text-xs mt-2 hover:underline flex items-center">
              收起 <ChevronUp size={12} className="ml-1" />
            </CollapsibleTrigger>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-full border border-green-100"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" size="sm" className="flex items-center text-xs">
            <BookmarkPlus size={14} className="mr-1" />
            收藏
          </Button>
          <Button variant="outline" size="sm" className="flex items-center text-xs">
            <Share2 size={14} className="mr-1" />
            分享
          </Button>
        </div>
      </div>
      
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg text-left">回答 ({question.answers})</h2>
          <Button variant="ghost" size="sm" className="text-blue-500 text-xs">
            按热度排序 <ChevronDown size={14} className="ml-1" />
          </Button>
        </div>
        
        {/* Sample answers - in a real app, these would be fetched */}
        <div className="space-y-4">
          {[1, 2, 3].map(index => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between mb-3">
                <div className="flex items-center">
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src={`https://randomuser.me/api/portraits/${index % 2 ? 'women' : 'men'}/${20 + index}.jpg`} />
                    <AvatarFallback>A{index}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">老师{index}</p>
                    <p className="text-xs text-gray-500">考研辅导老师</p>
                  </div>
                </div>
                {index === 1 && (
                  <div className="bg-yellow-50 text-yellow-600 rounded-full px-2 py-1 text-xs flex items-center">
                    最佳回答
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700 mb-3 text-left">
                考研复习时间管理非常重要，我建议：
                {index === 1 ? (
                  <>
                    <br/>1. 先做整体规划，按照科目难度分配时间比例
                    <br/>2. 使用"2-1-2"法则：2小时专注学习，1小时休息，再2小时
                    <br/>3. 每天留出固定时间进行题目练习
                    <br/>4. 周末做总结和查漏补缺
                    <br/>5. 保证充足睡眠，提高学习效率
                  </>
                ) : '根据自己情况制定合理计划，保持规律作息，劳逸结合是关键。'}
              </p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>2天前</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Eye size={12} className="mr-1" />
                    256
                  </span>
                  <Button variant="ghost" size="sm" className="text-blue-500 h-6 text-xs">
                    回复
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-3">
        <Button variant="outline" className="flex-1 flex items-center justify-center">
          <Mail size={16} className="mr-2" />
          邀请回答
        </Button>
        <Button className="flex-1 bg-gradient-to-r from-blue-500 to-app-blue">
          <MessageSquare size={16} className="mr-2" />
          我来回答
        </Button>
      </div>
    </div>
  );
};

export default QuestionDetail;
