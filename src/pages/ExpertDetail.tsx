
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  Award, 
  MessageSquare, 
  Clock, 
  Package, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

// Mock expert data for different experts
const expertsData = [
  {
    id: '1',
    name: '张同学',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    title: '北大硕士 | 出国党',
    description: '专注留学申请文书指导，斯坦福offer获得者。我有多年的申请文书辅导经验，曾帮助数十名学生成功申请到包括斯坦福、哈佛、麻省理工等名校的录取通知书。我秉持着因材施教的原则，针对每个学生的背景和特点，量身定制申请文书。欢迎有意出国留学的同学咨询，我会竭诚为你提供专业的建议和指导。',
    tags: ['留学', '文书', '面试', '申请规划', '国际生活'],
    keywords: ['留学', '文书', '个人陈述', '面试', '斯坦福', '美国大学', '申请', 'SOP'],
    category: 'study-abroad',
    rating: 4.9,
    responseRate: '98%',
    orderCount: '126单',
    location: '北京',
    education: ['北京大学 | 英语专业硕士', '中国人民大学 | 英语文学学士'],
    experience: ['某知名教育机构 | 留学顾问 3年', '自由职业文书顾问 | 2年'],
    verified: true
  },
  {
    id: '2',
    name: '刘导师',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    title: '清华博士 | 考研规划',
    description: '5年考研辅导经验，擅长数学与专业课。我曾帮助上百名考生成功上岸，针对考研数学和计算机专业课有独到的教学和复习方法。我深知考研的艰辛，会尽力为每一位考生提供个性化的学习计划和复习方案。如果你在考研路上遇到困难，欢迎随时向我咨询。',
    tags: ['考研', '数学', '规划', '计算机', '专业课'],
    keywords: ['考研', '数学', '专业课', '计算机', '高分', '复习方法'],
    category: 'kaoyan',
    rating: 4.8,
    responseRate: '95%',
    orderCount: '210单',
    location: '北京',
    education: ['清华大学 | 计算机科学博士', '清华大学 | 计算机科学硕士'],
    experience: ['某培训机构 | 考研数学老师 5年', '某高校 | 助教 2年'],
    verified: true
  },
  {
    id: '3',
    name: '王老师',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: '高考志愿规划师',
    description: '10年高考志愿填报指导经验，专精各省份政策。我深入研究过全国各省份的高考政策和各大高校的招生情况，能够根据考生的分数、兴趣特长和家庭意愿，制定最优的志愿填报方案，提高理想院校的录取概率。如果你对填报志愿有困惑，欢迎随时咨询我。',
    tags: ['高考', '志愿填报', '专业选择', '院校推荐', '政策解读'],
    keywords: ['高考', '志愿填报', '专业选择', '大学排名', '录取概率'],
    category: 'gaokao',
    rating: 4.7,
    responseRate: '92%',
    orderCount: '185单',
    location: '上海',
    education: ['复旦大学 | 教育学硕士', '华东师范大学 | 教育学学士'],
    experience: ['某教育局 | 教研员 5年', '某高考志愿填报平台 | 高级顾问 7年'],
    verified: true
  }
];

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedConsultType, setSelectedConsultType] = useState<'text' | 'voice' | 'video'>('text');
  
  // Find the expert by ID from our mock data
  const expert = expertsData.find(e => e.id === id) || expertsData[0];

  const handleConsultTypeSelect = (type: 'text' | 'voice' | 'video') => {
    setSelectedConsultType(type);
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 pb-20 min-h-screen">
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm animate-fade-in">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base ml-2">达人详情</div>
          <div className="flex-1"></div>
          <button className="text-white">
            <Bell size={20} />
          </button>
        </div>
      </div>
      
      <div className="px-4 py-6 space-y-6">
        {/* Expert Header */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              <Avatar className="w-16 h-16 border-2 border-green-100">
                <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
                <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{expert.name}</h2>
                  {expert.verified && (
                    <span className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0.5 rounded-full border border-blue-100 flex items-center">
                      <Award size={10} className="mr-0.5" />
                      已认证
                    </span>
                  )}
                </div>
                <p className="text-sm text-green-600">{expert.title}</p>
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin size={12} className="mr-1" />
                  <span>{expert.location}</span>
                  <span className="mx-1.5">•</span>
                  <span className="text-gray-400">IP属地 {expert.location}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5 text-right">
              <div className="flex items-center justify-end text-yellow-500 gap-1">
                <Award size={14} />
                <span className="text-sm font-medium">{expert.rating}</span>
              </div>
              <div className="flex items-center justify-end text-blue-500 gap-1 text-xs">
                <Clock size={12} />
                <span>{expert.responseRate} 响应率</span>
              </div>
              <div className="flex items-center justify-end text-green-500 gap-1 text-xs">
                <Package size={12} />
                <span>{expert.orderCount}</span>
              </div>
            </div>
          </div>
          
          {/* Expert Description */}
          <Collapsible 
            className="w-full border border-gray-100 rounded-lg p-4 bg-gray-50 mb-4"
            open={isDescriptionExpanded}
            onOpenChange={setIsDescriptionExpanded}
          >
            <div className="text-sm text-gray-700 leading-relaxed">
              {expert.description.length > 200 && !isDescriptionExpanded ? (
                <>
                  <p>{expert.description.substring(0, 200)}...</p>
                  <CollapsibleTrigger className="text-blue-500 text-xs mt-2 hover:underline flex items-center">
                    展开全部 <ChevronDown size={12} className="ml-1" />
                  </CollapsibleTrigger>
                </>
              ) : (
                <>
                  <p>{expert.description}</p>
                  {expert.description.length > 200 && (
                    <CollapsibleTrigger className="text-blue-500 text-xs mt-2 hover:underline flex items-center">
                      收起 <ChevronUp size={12} className="ml-1" />
                    </CollapsibleTrigger>
                  )}
                </>
              )}
            </div>
            
            <CollapsibleContent>
              <p className="text-sm text-gray-700 leading-relaxed">{expert.description}</p>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {expert.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-full border border-green-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Education & Experience */}
        <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">教育经历</h3>
            <div className="space-y-2">
              {expert.education.map((edu, index) => (
                <div key={index} className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-md">
                  {edu}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">工作经历</h3>
            <div className="space-y-2">
              {expert.experience.map((exp, index) => (
                <div key={index} className="bg-purple-50 text-purple-700 text-sm px-3 py-2 rounded-md">
                  {exp}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Consult Options */}
        <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">咨询方式</h3>
          <div className="flex gap-3">
            <button 
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedConsultType === 'text' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
              onClick={() => handleConsultTypeSelect('text')}
            >
              文本咨询
            </button>
            <button 
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedConsultType === 'voice' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
              onClick={() => handleConsultTypeSelect('voice')}
            >
              语音咨询
            </button>
            <button 
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedConsultType === 'video' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
              onClick={() => handleConsultTypeSelect('video')}
            >
              视频咨询
            </button>
          </div>
        </div>
        
        {/* Past Q&A Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">历史解答</h3>
          
          <div className="space-y-4">
            {[1, 2, 3].map(index => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <h4 className="text-sm font-medium mb-1">如何准备托福口语考试？</h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  托福口语需要注意语音语调和内容逻辑，建议每天练习至少30分钟...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">3天前</span>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">32人觉得有帮助</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-500">
                      查看
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-3">
        <Button variant="outline" className="flex-1 bg-green-50 text-green-600 border-green-100 hover:bg-green-100 hover:text-green-700">
          预约咨询
        </Button>
        <Button className="flex-1 bg-gradient-to-r from-blue-500 to-app-blue hover:opacity-90">
          <MessageSquare size={16} className="mr-2" />
          私聊
        </Button>
      </div>
    </div>
  );
};

export default ExpertDetail;
