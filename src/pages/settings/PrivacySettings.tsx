
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Lock, UserCheck, MessageSquare, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import BottomNav from '@/components/BottomNav';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    showEducation: true,
    showWorkHistory: true,
    showTopics: true,
    allowFollowers: true,
    allowMessages: true,
    publicProfile: true,
  });

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

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
        <h1 className="text-xl font-semibold">隐私设置</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Eye size={18} className="text-app-blue mr-2" />
              个人信息可见性
            </CardTitle>
            <CardDescription>控制哪些信息对其他用户可见</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">展示教育背景</Label>
                <p className="text-sm text-gray-500">您的学校和学位信息</p>
              </div>
              <Switch 
                checked={settings.showEducation}
                onCheckedChange={() => handleToggle('showEducation')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">展示工作经历</Label>
                <p className="text-sm text-gray-500">您的公司和职位信息</p>
              </div>
              <Switch 
                checked={settings.showWorkHistory}
                onCheckedChange={() => handleToggle('showWorkHistory')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">展示擅长话题</Label>
                <p className="text-sm text-gray-500">您设置的专长话题标签</p>
              </div>
              <Switch 
                checked={settings.showTopics}
                onCheckedChange={() => handleToggle('showTopics')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Lock size={18} className="text-app-red mr-2" />
              互动设置
            </CardTitle>
            <CardDescription>控制其他用户如何与您互动</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">允许被关注</Label>
                <p className="text-sm text-gray-500">其他用户是否可以关注您</p>
              </div>
              <Switch 
                checked={settings.allowFollowers}
                onCheckedChange={() => handleToggle('allowFollowers')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">允许私信</Label>
                <p className="text-sm text-gray-500">是否接收非关注用户的私信</p>
              </div>
              <Switch 
                checked={settings.allowMessages}
                onCheckedChange={() => handleToggle('allowMessages')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">公开个人主页</Label>
                <p className="text-sm text-gray-500">您的资料是否对所有人可见</p>
              </div>
              <Switch 
                checked={settings.publicProfile}
                onCheckedChange={() => handleToggle('publicProfile')}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="p-4 text-center text-sm text-gray-500">
          <p>隐私设置将在您下次登录时生效</p>
          <p>最后更新时间: 2023年10月1日</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PrivacySettings;
