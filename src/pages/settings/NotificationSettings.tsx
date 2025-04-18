
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, MessageSquare, Heart, Users, Award, FileText, BellRing, BellOff, Mail } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    push: true,
    email: true,
    newMessages: true,
    likes: true,
    follows: true,
    comments: true,
    mentions: true,
    achievements: true,
    updates: true,
    recommendations: true,
    marketing: false,
    activitySummary: true,
  });

  const handleToggle = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
    
    toast({
      title: "通知设置已更新",
      description: "您的设置已保存",
    });
  };

  const handleToggleAll = (value: boolean) => {
    const newSettings = {...settings};
    Object.keys(settings).forEach(key => {
      newSettings[key] = value;
    });
    setSettings(newSettings);
    
    toast({
      title: value ? "已开启所有通知" : "已关闭所有通知",
      description: "您的设置已保存",
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
        <h1 className="text-xl font-semibold">通知设置</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">一键设置</p>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => handleToggleAll(true)}
            >
              <BellRing size={14} className="mr-1" />
              全部开启
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => handleToggleAll(false)}
            >
              <BellOff size={14} className="mr-1" />
              全部关闭
            </Button>
          </div>
        </div>
        
        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Bell size={18} className="text-app-blue mr-2" />
              通知方式
            </CardTitle>
            <CardDescription>控制接收通知的方式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">推送通知</Label>
                <p className="text-sm text-gray-500">发送消息到您的手机</p>
              </div>
              <Switch 
                checked={settings.push}
                onCheckedChange={() => handleToggle('push')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">邮件通知</Label>
                <p className="text-sm text-gray-500">发送通知到您的邮箱</p>
              </div>
              <Switch 
                checked={settings.email}
                onCheckedChange={() => handleToggle('email')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare size={18} className="text-app-green mr-2" />
              互动通知
            </CardTitle>
            <CardDescription>与他人互动相关的通知</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">新消息</Label>
                <p className="text-sm text-gray-500">接收新私信提醒</p>
              </div>
              <Switch 
                checked={settings.newMessages}
                onCheckedChange={() => handleToggle('newMessages')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">点赞</Label>
                <p className="text-sm text-gray-500">有人对您的内容点赞</p>
              </div>
              <Switch 
                checked={settings.likes}
                onCheckedChange={() => handleToggle('likes')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">新关注</Label>
                <p className="text-sm text-gray-500">有新用户关注您</p>
              </div>
              <Switch 
                checked={settings.follows}
                onCheckedChange={() => handleToggle('follows')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">评论</Label>
                <p className="text-sm text-gray-500">有人评论您的内容</p>
              </div>
              <Switch 
                checked={settings.comments}
                onCheckedChange={() => handleToggle('comments')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">提及</Label>
                <p className="text-sm text-gray-500">有人@提及您</p>
              </div>
              <Switch 
                checked={settings.mentions}
                onCheckedChange={() => handleToggle('mentions')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Mail size={18} className="text-app-red mr-2" />
              系统通知
            </CardTitle>
            <CardDescription>应用与系统相关的通知</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">成就与奖励</Label>
                <p className="text-sm text-gray-500">获得新成就和奖励时通知</p>
              </div>
              <Switch 
                checked={settings.achievements}
                onCheckedChange={() => handleToggle('achievements')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">应用更新</Label>
                <p className="text-sm text-gray-500">应用版本更新和新功能</p>
              </div>
              <Switch 
                checked={settings.updates}
                onCheckedChange={() => handleToggle('updates')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">每周活动总结</Label>
                <p className="text-sm text-gray-500">您的周活动报告</p>
              </div>
              <Switch 
                checked={settings.activitySummary}
                onCheckedChange={() => handleToggle('activitySummary')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">内容推荐</Label>
                <p className="text-sm text-gray-500">为您推荐的内容和用户</p>
              </div>
              <Switch 
                checked={settings.recommendations}
                onCheckedChange={() => handleToggle('recommendations')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">营销信息</Label>
                <p className="text-sm text-gray-500">促销、折扣和市场活动</p>
              </div>
              <Switch 
                checked={settings.marketing}
                onCheckedChange={() => handleToggle('marketing')}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="p-4 text-center text-sm text-gray-500">
          <p>根据您所在地区的法律规定，某些系统通知无法关闭</p>
          <p>最后更新时间: 2023年10月1日</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default NotificationSettings;
