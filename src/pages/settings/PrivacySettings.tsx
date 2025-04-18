import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Lock, UserCheck, MessageSquare, Globe, Users, Shield, AlertTriangle } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    showEducation: true,
    showWorkHistory: true,
    showTopics: true,
    allowFollowers: true,
    allowMessages: true,
    publicProfile: true,
    hideActivity: false,
    hideOnline: false,
    hideReadReceipts: false,
    showRecommendations: true,
    showBlacklist: false,
  });

  const handleToggle = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
    
    toast({
      title: "设置已更新",
      description: "您的隐私设置已保存",
    });
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-4 border-b shadow-sm">
        <div className="flex items-center">
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <AlertTriangle size={20} className="text-amber-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">隐私保护提示</h4>
              <p className="text-sm text-muted-foreground">
                定期检查您的隐私设置，确保个人信息安全。我们建议对陌生人限制信息可见性。
              </p>
            </div>
          </PopoverContent>
        </Popover>
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

        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Shield size={18} className="text-purple-500 mr-2" />
              活动与状态
            </CardTitle>
            <CardDescription>控制您的在线状态和活动显示</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">隐藏活动状态</Label>
                <p className="text-sm text-gray-500">不显示您最近的活动时间</p>
              </div>
              <Switch 
                checked={settings.hideActivity}
                onCheckedChange={() => handleToggle('hideActivity')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">隐藏在线状态</Label>
                <p className="text-sm text-gray-500">不显示您是否在线</p>
              </div>
              <Switch 
                checked={settings.hideOnline}
                onCheckedChange={() => handleToggle('hideOnline')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">隐藏已读回执</Label>
                <p className="text-sm text-gray-500">不显示您是否已读消息</p>
              </div>
              <Switch 
                checked={settings.hideReadReceipts}
                onCheckedChange={() => handleToggle('hideReadReceipts')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Users size={18} className="text-indigo-500 mr-2" />
              社交互动
            </CardTitle>
            <CardDescription>控制与其他用户的互动方式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">推荐可能认识的人</Label>
                <p className="text-sm text-gray-500">根据共同好友等推荐用户</p>
              </div>
              <Switch 
                checked={settings.showRecommendations}
                onCheckedChange={() => handleToggle('showRecommendations')}
              />
            </div>
            
            <Separator />
            
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => navigate('/settings/blacklist')}
            >
              <div className="space-y-0.5">
                <Label className="text-base">黑名单管理</Label>
                <p className="text-sm text-gray-500">管理已屏蔽的用户</p>
              </div>
              <Button variant="outline" size="sm">
                管理
              </Button>
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
