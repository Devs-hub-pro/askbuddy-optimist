import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Camera, 
  MapPin, 
  Award, 
  MessageSquare, 
  Clock, 
  Package, 
  CheckCircle, 
  Calendar, 
  GraduationCap, 
  Briefcase,
  Heart,
  Star,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  Send,
  X,
  CalendarCheck,
  Clock3,
  VideoIcon,
  MessageCircle,
  Phone
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Education {
  school: string;
  degree: string;
  years?: string;
}

interface Experience {
  company: string;
  position: string;
  years?: string;
}

interface Topic {
  id: string;
  title: string;
  tags: string[];
}

const ExpertProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const topicsScrollRef = useRef<HTMLDivElement>(null);
  
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [consultType, setConsultType] = useState<'text' | 'voice' | 'video'>('text');
  
  const expert = {
    id: id || '1',
    name: '张同学',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    title: '北大硕士 | 出国党',
    location: '北京',
    bio: '专注留学申请文书指导，斯坦福offer获得者。我有多年指导经验，曾帮助超过50名学生申请到世界顶尖大学。擅长个人陈述、研究计划书撰写，精通面试技巧指导。我相信每个学生都有自己的闪光点，只要找到合适的表达方式，就能在激烈的申请中脱颖而出。我希望通过我的专业知识和经验，帮助每位学生实现留学梦想。',
    topics: [
      { id: '1', title: '如何准备托福口语考试？', tags: ['托福', '口语', '留学'] },
      { id: '2', title: '美国大学申请文书怎么写？', tags: ['申请', '文书', '留学'] },
      { id: '3', title: '留学生活如何快速适应？', tags: ['留学', '生活', '适应'] },
      { id: '4', title: '斯坦福申请要注意什么？', tags: ['申请', '斯坦福', '留学'] },
      { id: '5', title: '如何提高英语口语流利度？', tags: ['英语', '口语', '学习'] },
    ],
    tags: ['留学', '文书', '面试', '高考', '语言考试', '申请规划'],
    verifiedInfo: {
      education: true,
      workplace: true
    },
    stats: {
      rating: 4.9,
      responseRate: '98%',
      orderCount: '126单',
      consultationCount: 235,
      followers: 356
    },
    education: [
      { school: '北京大学', degree: '教育学硕士', years: '2018-2021' },
      { school: '清华大学', degree: '英语文学学士', years: '2014-2018' }
    ],
    experience: [
      { company: '某知名留学机构', position: '高级顾问', years: '2021-至今' },
      { company: '斯坦福大学', position: '校友面试官', years: '2022-至今' }
    ],
    availableTimeSlots: [
      { id: '1', day: '今天', time: '14:00-15:00' },
      { id: '2', day: '今天', time: '16:00-17:00' },
      { id: '3', day: '明天', time: '10:00-11:00' },
      { id: '4', day: '明天', time: '15:00-16:00' },
      { id: '5', day: '后天', time: '14:00-15:00' },
    ]
  };

  const scrollTopics = (direction: 'left' | 'right') => {
    if (topicsScrollRef.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        topicsScrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        topicsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };
  
  const handleMessageSubmit = () => {
    console.log('Message sent:', messageText);
    setMessageText('');
    setIsMessageDialogOpen(false);
  };
  
  const handleBookingSubmit = () => {
    console.log('Booking submitted:', { selectedTopic, selectedTimeSlot, consultType });
    setIsBookingDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm animate-fade-in">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base ml-2">个人主页</div>
        </div>
      </div>
      
      <div className="relative">
        <div 
          className="w-full pt-6 pb-20 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&h=400)`,
            backgroundPosition: 'center top'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
        </div>
        
        <div className="relative px-4 pb-4 -mt-16">
          <div className="flex justify-between items-end">
            <Avatar className="w-20 h-20 border-4 border-white shadow-md">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button 
              variant={isFollowing ? "default" : "outline"} 
              size="sm" 
              className={isFollowing ? "bg-app-teal text-white" : "bg-white/80 backdrop-blur-sm"}
              onClick={handleFollowToggle}
            >
              {isFollowing ? (
                <>
                  <CheckCircle size={14} className="mr-1" />
                  已关注
                </>
              ) : (
                <>
                  <Heart size={14} className="mr-1" />
                  关注
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-3">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800 mr-2">{expert.name}</h1>
              {expert.verifiedInfo.education && (
                <div className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  学历认证
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 my-1">{expert.title}</p>
            <div className="flex items-center text-gray-500 text-xs">
              <MapPin size={12} className="mr-1" />
              <span>{expert.location}</span>
              <span className="mx-2">·</span>
              <span>粉丝 {expert.stats.followers}</span>
            </div>
          </div>
          
          <div className="flex justify-between mt-4 px-2 py-3 bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="flex items-center text-yellow-500">
                <Award size={14} className="mr-1" />
                <span className="font-semibold">{expert.stats.rating}</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">评分</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center text-blue-500">
                <Clock size={14} className="mr-1" />
                <span className="font-semibold">{expert.stats.responseRate}</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">回复率</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center text-green-500">
                <Package size={14} className="mr-1" />
                <span className="font-semibold">{expert.stats.orderCount}</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">咨询量</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-semibold text-purple-500">{expert.stats.consultationCount}</div>
              <span className="text-xs text-gray-500 mt-1">总解答</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-left">擅长话题</h2>
        <div className="relative">
          <button 
            onClick={() => scrollTopics('left')} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md z-10"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div 
            ref={topicsScrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-4 -mx-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {expert.topics.map((topic, index) => (
              <div 
                key={index} 
                className="min-w-[260px] flex-shrink-0 border border-green-100 rounded-lg p-3 bg-green-50/30"
              >
                <h3 className="text-sm font-medium text-gray-800 mb-2">{topic.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {topic.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex} 
                      className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => scrollTopics('right')} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md z-10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-left">个人介绍</h2>
        <Collapsible
          open={isBioExpanded}
          onOpenChange={setIsBioExpanded}
        >
          <div className="text-sm text-gray-700 leading-relaxed">
            {!isBioExpanded ? (
              <div className="line-clamp-6">
                {expert.bio}
                {expert.bio.length > 200 && (
                  <CollapsibleTrigger className="text-blue-500 text-xs block mt-2 hover:underline flex items-center">
                    展开全部 <ChevronDown size={12} className="ml-1" />
                  </CollapsibleTrigger>
                )}
              </div>
            ) : (
              <div>
                {expert.bio}
              </div>
            )}
          </div>
          
          <CollapsibleContent>
            <CollapsibleTrigger className="text-blue-500 text-xs mt-2 hover:underline flex items-center">
              收起 <ChevronUp size={12} className="ml-1" />
            </CollapsibleTrigger>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-left">擅长领域</h2>
        <div className="flex flex-wrap gap-2">
          {expert.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-green-50 text-green-600 text-sm px-3 py-1 rounded-full border border-green-100"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 mb-20">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="about">履历</TabsTrigger>
            <TabsTrigger value="answers">回答</TabsTrigger>
            <TabsTrigger value="questions">问题</TabsTrigger>
            <TabsTrigger value="reviews">评价</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                教育经历
                {expert.verifiedInfo.education && (
                  <span className="ml-2 text-xs text-blue-500 flex items-center">
                    <CheckCircle size={12} className="mr-1" />
                    已认证
                  </span>
                )}
              </h3>
              {expert.education.map((edu, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <p className="font-medium text-sm">{edu.school}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{edu.degree}</span>
                    {edu.years && <span>{edu.years}</span>}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-green-500" />
                工作经历
                {expert.verifiedInfo.workplace && (
                  <span className="ml-2 text-xs text-green-500 flex items-center">
                    <CheckCircle size={12} className="mr-1" />
                    已认证
                  </span>
                )}
              </h3>
              {expert.experience.map((exp, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <p className="font-medium text-sm">{exp.company}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{exp.position}</span>
                    {exp.years && <span>{exp.years}</span>}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="answers">
            <div className="text-center py-10 text-gray-500">
              <MessageSquare className="mx-auto w-10 h-10 text-gray-300 mb-3" />
              <p>还没有回答内容</p>
            </div>
          </TabsContent>
          
          <TabsContent value="questions">
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-base font-medium mb-2">如何有效提高托福阅读速度？</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    我目前托福阅读总是时间不够，想了解有什么提高阅读速度的方法...
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      #托福
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      #阅读
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>3天前</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center">
                        <MessageSquare size={12} className="mr-1" />
                        5条回答
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-yellow-50 rounded-lg p-3 mr-3">
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{expert.stats.rating}</div>
                    <div className="text-sm text-gray-500">总体评分</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  基于 {expert.stats.consultationCount} 次咨询
                </div>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <Avatar className="w-8 h-8 mr-2">
                          <AvatarImage src={`https://randomuser.me/api/portraits/${index % 2 ? 'women' : 'men'}/${20 + index}.jpg`} />
                          <AvatarFallback>U{index}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">用户{index}</div>
                          <div className="text-xs text-gray-500">1周前</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array(5).fill(0).map((_, starIndex) => (
                          <Star 
                            key={starIndex} 
                            size={14} 
                            className={starIndex < 5 - index % 2 ? "text-yellow-400" : "text-gray-200"} 
                            fill={starIndex < 5 - index % 2 ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      {index === 1 
                        ? "回答非常详细，解决了我的问题，非常满意！老师很有耐心，讲解很清晰。" 
                        : "老师很专业，回答了我所有的问题，非常感谢！"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1 flex items-center justify-center"
          onClick={() => setIsMessageDialogOpen(true)}
        >
          <MessageSquare size={16} className="mr-2" />
          给TA留言
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-blue-500 to-app-blue flex items-center justify-center"
          onClick={() => setIsBookingDialogOpen(true)}
        >
          <Calendar size={16} className="mr-2" />
          预约问问
        </Button>
      </div>
      
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <span>发送消息给 </span>
              <span className="text-app-teal ml-1">{expert.name}</span>
            </DialogTitle>
            <DialogDescription>
              发送消息后，{expert.name}会尽快回复您的留言
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-start gap-3 my-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <Textarea
                placeholder={`请输入您想对${expert.name}说的话...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={5}
                className="resize-none focus-visible:ring-app-teal"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button 
              onClick={handleMessageSubmit} 
              disabled={!messageText.trim()}
              className="bg-gradient-to-r from-blue-500 to-app-blue"
            >
              <Send size={16} className="mr-2" />
              发送留言
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <span>预约 </span>
              <span className="text-app-teal ml-1">{expert.name}</span>
              <span> 问问</span>
            </DialogTitle>
            <DialogDescription>
              选择您感兴趣的话题和合适的时间
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 my-4">
            <div>
              <h3 className="text-sm font-medium mb-3">选择话题</h3>
              <div className="grid grid-cols-2 gap-2">
                {expert.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedTopic === topic.id 
                        ? 'border-app-teal bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    <p className="text-sm font-medium line-clamp-2">{topic.title}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">选择时间</h3>
              <div className="grid grid-cols-3 gap-2">
                {expert.availableTimeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`border rounded-lg p-2 flex flex-col items-center cursor-pointer transition-all ${
                      selectedTimeSlot === slot.id 
                        ? 'border-app-teal bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTimeSlot(slot.id)}
                  >
                    <span className="text-xs text-gray-500">{slot.day}</span>
                    <span className="text-sm font-medium">{slot.time}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">选择咨询方式</h3>
              <div className="grid grid-cols-3 gap-3">
                <RadioGroup value={consultType} onValueChange={(value) => setConsultType(value as 'text' | 'voice' | 'video')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" className="text-app-teal" />
                    <Label 
                      htmlFor="text" 
                      className="flex items-center cursor-pointer"
                    >
                      <MessageCircle size={16} className="mr-1 text-blue-500" />
                      <span>文字</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="voice" id="voice" className="text-app-teal" />
                    <Label 
                      htmlFor="voice" 
                      className="flex items-center cursor-pointer"
                    >
                      <Phone size={16} className="mr-1 text-green-500" />
                      <span>语音</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="video" className="text-app-teal" />
                    <Label 
                      htmlFor="video" 
                      className="flex items-center cursor-pointer"
                    >
                      <VideoIcon size={16} className="mr-1 text-purple-500" />
                      <span>视频</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button 
              onClick={handleBookingSubmit} 
              disabled={!selectedTopic || !selectedTimeSlot}
              className="bg-gradient-to-r from-blue-500 to-app-blue"
            >
              <CalendarCheck size={16} className="mr-2" />
              确认预约
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertProfile;
