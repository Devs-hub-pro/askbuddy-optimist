
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';

const TalentCertification = () => {
  const navigate = useNavigate();

  const certificationTypes = [
    {
      title: '教育认证',
      desc: '验证您的学历背景',
      icon: <Award className="text-app-blue" />,
      status: 'pending'
    },
    {
      title: '职业认证',
      desc: '证明您的职业经验',
      icon: <Award className="text-app-green" />,
      status: 'none'
    },
    {
      title: '专业技能认证',
      desc: '展示您的专业能力',
      icon: <Award className="text-purple-500" />,
      status: 'none'
    },
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">达人认证</h1>
      </div>

      {/* Introduction */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-app-blue/10 to-app-teal/10">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">为什么要认证？</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                <span>获得官方认证标识，提升个人可信度</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                <span>问答内容获得优先展示</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                <span>有机会被平台推荐为领域专家</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Certification Options */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold mb-1 px-1">认证类型</h3>
        
        {certificationTypes.map((type, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-0">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => {}}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-3">
                    {type.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{type.title}</h4>
                    <p className="text-sm text-gray-500">{type.desc}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {type.status === 'pending' ? (
                    <span className="text-amber-500 text-sm mr-2">审核中</span>
                  ) : type.status === 'approved' ? (
                    <span className="text-green-500 text-sm mr-2">已认证</span>
                  ) : null}
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default TalentCertification;
