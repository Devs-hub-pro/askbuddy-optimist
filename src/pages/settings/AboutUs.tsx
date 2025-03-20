
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, ChevronRight, MessageSquare, Github, Twitter, Mail, Gift, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import BottomNav from '@/components/BottomNav';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">关于我们</h1>
      </div>

      {/* App Info */}
      <div className="p-4 bg-gradient-to-r from-app-blue to-app-teal text-center text-white rounded-b-3xl">
        <div className="py-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold bg-gradient-to-r from-app-blue to-app-teal bg-clip-text text-transparent">问问</span>
          </div>
          <h2 className="text-xl font-bold mb-1">找人问问</h2>
          <p className="text-white/80 text-sm mb-2">Version 1.0.5</p>
          <Badge className="bg-white/20 text-white border-none">专注高质量问答社区</Badge>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-5">
        <Card className="border-none shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Info size={18} className="text-app-blue mr-2" />
              产品介绍
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p className="mb-3">
              "找人问问"是一个连接求知者与专业人士的问答平台，致力于为用户提供高质量的回答和知识分享。
            </p>
            <p>
              我们的使命是让知识传递更高效，让每个人都能获得专业可靠的解答，无论是学业问题、职业发展还是生活技能。
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Star size={18} className="text-amber-500 mr-2" />
              核心功能
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mr-3">
                  <MessageSquare size={20} className="text-app-blue" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">专业问答</h3>
                  <p className="text-sm text-gray-600">连接您与各领域专业人士，获取权威解答</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0 mr-3">
                  <Gift size={20} className="text-app-green" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">知识变现</h3>
                  <p className="text-sm text-gray-600">分享您的专业知识，获得收入和认可</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center shrink-0 mr-3">
                  <Heart size={20} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">社区互动</h3>
                  <p className="text-sm text-gray-600">建立专业人脉，拓展您的职业圈子</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg">联系我们</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a href="mailto:support@example.com" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                    <Mail size={16} className="text-app-blue" />
                  </div>
                  <span>support@example.com</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </a>
              
              <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <Github size={16} className="text-gray-700" />
                  </div>
                  <span>github.com/findquestion</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </a>
              
              <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                    <Twitter size={16} className="text-blue-400" />
                  </div>
                  <span>@findquestion</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </a>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between">
            <span className="text-sm text-gray-500">© 2023 找人问问</span>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-app-blue">服务条款</a>
              <a href="#" className="text-sm text-gray-500 hover:text-app-blue">隐私政策</a>
            </div>
          </CardFooter>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default AboutUs;
