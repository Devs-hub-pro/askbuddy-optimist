
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit, Camera, MapPin, Award, MessageSquare, Clock, Package, CheckCircle, Calendar } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

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

const ExpertProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&h=400');
  
  // Mock data for expert profile - in a real app, fetch based on ID
  const expert = {
    id: id || '1',
    name: '张同学',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    title: '北大硕士 | 出国党',
    location: '北京',
    bio: '专注留学申请文书指导，斯坦福offer获得者。我有多年指导经验，曾帮助超过50名学生申请到世界顶尖大学。擅长个人陈述、研究计划书撰写，精通面试技巧指导。我相信每个学生都有自己的闪光点，只要找到合适的表达方式，就能在激烈的申请中脱颖而出。我希望通过我的专业知识和经验，帮助每位学生实现留学梦想。',
    tags: ['留学', '文书', '面试', '高考', '语言考试', '申请规划'],
    verifiedInfo: {
      education: true,
      workplace: true
    },
    stats: {
      rating: 4.9,
      responseRate: '98%',
      orderCount: '126单',
      consultationCount: 235
    },
    education: [
      { school: '北京大学', degree: '教育学硕士', years: '2018-2021' },
      { school: '清华大学', degree: '英语文学学士', years: '2014-2018' }
    ],
    experience: [
      { company: '某知名留学机构', position: '高级顾问', years: '2021-至今' },
      { company: '斯坦福大学', position: '校友面试官', years: '2022-至今' }
    ]
  };

  const handleBackgroundChange = () => {
    // In a real app, this would open file selection dialog
    const backgrounds = [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&h=400',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&h=400',
      'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1200&h=400',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&h=400'
    ];
    
    // For demo purposes, just cycle through the backgrounds
    const currentIndex = backgrounds.indexOf(backgroundImage);
    const nextIndex = (currentIndex + 1) % backgrounds.length;
    setBackgroundImage(backgrounds[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm animate-fade-in">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base ml-2">个人主页</div>
        </div>
      </div>
      
      {/* Profile header with background image */}
      <div className="relative">
        <div 
          className="w-full h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
          <button 
            onClick={handleBackgroundChange}
            className="absolute right-4 top-4 bg-white/20 backdrop-blur-sm text-white rounded-full p-2 z-10"
          >
            <Camera size={18} />
          </button>
        </div>
        
        {/* Profile info - positioned over the background image bottom */}
        <div className="relative px-4 pb-4 -mt-16 pt-20">
          <div className="flex justify-between items-end">
            <Avatar className="w-20 h-20 border-4 border-white shadow-md">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
              <Edit size={14} className="mr-1" />
              编辑资料
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
              <span>IP属地：{expert.location}</span>
            </div>
          </div>
          
          {/* Stats row */}
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
      
      {/* Bio Section */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">个人介绍</h2>
        <Collapsible
          open={isBioExpanded}
          onOpenChange={setIsBioExpanded}
        >
          <div className="text-sm text-gray-700 leading-relaxed">
            {expert.bio.length > 100 && !isBioExpanded ? (
              <>
                <p>{expert.bio.substring(0, 100)}...</p>
                <CollapsibleTrigger className="text-blue-500 text-xs mt-2 hover:underline flex items-center">
                  展开全部
                </CollapsibleTrigger>
              </>
            ) : (
              <>
                <p>{expert.bio}</p>
                {expert.bio.length > 100 && (
                  <CollapsibleTrigger className="text-blue-500 text-xs mt-2 hover:underline flex items-center">
                    收起
                  </CollapsibleTrigger>
                )}
              </>
            )}
          </div>
          
          <CollapsibleContent>
            <p className="text-sm text-gray-700 leading-relaxed">{expert.bio}</p>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Tags Section */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">擅长话题</h2>
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

      {/* Tabs Section */}
      <div className="px-4 mb-20">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="about">履历</TabsTrigger>
            <TabsTrigger value="answers">回答</TabsTrigger>
            <TabsTrigger value="services">服务</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4">
            {/* Education Section */}
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
            
            {/* Experience Section */}
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
          
          <TabsContent value="services">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-base font-semibold mb-3">咨询服务</h3>
              
              <div className="space-y-3">
                <div className="border border-green-100 rounded-lg p-3 bg-green-50/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-base font-medium">留学文书指导</h4>
                      <p className="text-sm text-gray-600">包含SOP、PS、CV等文书一对一修改</p>
                    </div>
                    <div className="text-orange-500 font-semibold">¥300/次</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-8 flex items-center">
                      <MessageSquare size={12} className="mr-1" />
                      咨询详情
                    </Button>
                    <Button size="sm" className="text-xs h-8 flex items-center bg-gradient-to-r from-green-500 to-teal-500">
                      <Calendar size={12} className="mr-1" />
                      立即预约
                    </Button>
                  </div>
                </div>
                
                <div className="border border-blue-100 rounded-lg p-3 bg-blue-50/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-base font-medium">留学申请规划</h4>
                      <p className="text-sm text-gray-600">从选校、准备材料到面试全程指导</p>
                    </div>
                    <div className="text-orange-500 font-semibold">¥500/小时</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-8 flex items-center">
                      <MessageSquare size={12} className="mr-1" />
                      咨询详情
                    </Button>
                    <Button size="sm" className="text-xs h-8 flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <Calendar size={12} className="mr-1" />
                      立即预约
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bottom action buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-3">
        <Button variant="outline" className="flex-1 flex items-center justify-center">
          <MessageSquare size={16} className="mr-2" />
          私聊
        </Button>
        <Button className="flex-1 bg-gradient-to-r from-blue-500 to-app-blue flex items-center justify-center">
          <Calendar size={16} className="mr-2" />
          预约咨询
        </Button>
      </div>
    </div>
  );
};

export default ExpertProfile;

import { Briefcase } from 'lucide-react';
