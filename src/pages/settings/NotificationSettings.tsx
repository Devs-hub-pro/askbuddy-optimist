import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, MessageSquare, BellRing, BellOff, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUserSettings, useSaveNotificationSettings, NotificationPrefs } from '@/hooks/useUserSettings';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { data: userSettings, isLoading } = useUserSettings();
  const saveSettings = useSaveNotificationSettings();

  const [settings, setSettings] = useState<NotificationPrefs>({
    push: true, email: true, newMessages: true, likes: true, follows: true,
    comments: true, mentions: true, achievements: true, updates: true,
    recommendations: true, marketing: false, activitySummary: true,
  });

  useEffect(() => {
    if (userSettings?.notification_settings) {
      setSettings(userSettings.notification_settings);
    }
  }, [userSettings]);

  const handleToggle = (key: keyof NotificationPrefs) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    saveSettings.mutate(updated);
  };

  const handleToggleAll = (value: boolean) => {
    const updated = Object.fromEntries(Object.keys(settings).map(k => [k, value])) as NotificationPrefs;
    setSettings(updated);
    saveSettings.mutate(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const Item = ({ label, desc, field }: { label: string; desc: string; field: keyof NotificationPrefs }) => (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">{label}</Label>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
        <Switch checked={!!settings[field]} onCheckedChange={() => handleToggle(field)} />
      </div>
      <Separator />
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">通知设置</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">一键设置</p>
          <div className="space-x-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleToggleAll(true)}>
              <BellRing size={14} className="mr-1" />全部开启
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleToggleAll(false)}>
              <BellOff size={14} className="mr-1" />全部关闭
            </Button>
          </div>
        </div>

        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Bell size={18} className="text-primary mr-2" />通知方式
            </CardTitle>
            <CardDescription>控制接收通知的方式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Item label="推送通知" desc="发送消息到您的手机" field="push" />
            <Item label="邮件通知" desc="发送通知到您的邮箱" field="email" />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare size={18} className="text-green-500 mr-2" />互动通知
            </CardTitle>
            <CardDescription>与他人互动相关的通知</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Item label="新消息" desc="接收新私信提醒" field="newMessages" />
            <Item label="点赞" desc="有人对您的内容点赞" field="likes" />
            <Item label="新关注" desc="有新用户关注您" field="follows" />
            <Item label="评论" desc="有人评论您的内容" field="comments" />
            <Item label="提及" desc="有人@提及您" field="mentions" />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Mail size={18} className="text-red-500 mr-2" />系统通知
            </CardTitle>
            <CardDescription>应用与系统相关的通知</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Item label="成就与奖励" desc="获得新成就和奖励时通知" field="achievements" />
            <Item label="应用更新" desc="应用版本更新和新功能" field="updates" />
            <Item label="每周活动总结" desc="您的周活动报告" field="activitySummary" />
            <Item label="内容推荐" desc="为您推荐的内容和用户" field="recommendations" />
            <Item label="营销信息" desc="促销、折扣和市场活动" field="marketing" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;
