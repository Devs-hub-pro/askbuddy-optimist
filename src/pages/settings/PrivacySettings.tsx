import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Lock, Users, Shield, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUserSettings, useSavePrivacySettings, PrivacyPrefs } from '@/hooks/useUserSettings';
import SubPageHeader from '@/components/layout/SubPageHeader';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const { data: userSettings, isLoading } = useUserSettings();
  const saveSettings = useSavePrivacySettings();

  const [settings, setSettings] = useState<PrivacyPrefs>({
    showEducation: true, showWorkHistory: true, showTopics: true,
    allowFollowers: true, allowMessages: true, publicProfile: true,
    hideActivity: false, hideOnline: false, hideReadReceipts: false,
    showRecommendations: true,
  });

  useEffect(() => {
    if (userSettings?.privacy_settings) {
      setSettings(userSettings.privacy_settings);
    }
  }, [userSettings]);

  const handleToggle = (key: keyof PrivacyPrefs) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    saveSettings.mutate(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const Item = ({ label, desc, field }: { label: string; desc: string; field: keyof PrivacyPrefs }) => (
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3">
        <div className="space-y-0.5">
          <Label className="text-base">{label}</Label>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
        <Switch checked={!!settings[field]} onCheckedChange={() => handleToggle(field)} />
      </div>
  );

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <SubPageHeader
        title="隐私设置"
        right={
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/15 hover:text-white">
                <AlertTriangle size={20} className="text-white" />
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
        }
      />

      <div className="space-y-4 p-4">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">隐私保护</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  调整信息展示、社交互动和在线状态，让你的个人资料与聊天更安心。
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-[rgb(73,170,155)]" />
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Eye size={18} className="text-primary mr-2" />个人信息可见性
            </CardTitle>
            <CardDescription>控制哪些信息对其他用户可见</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Item label="展示教育背景" desc="您的学校和学位信息" field="showEducation" />
            <Item label="展示工作经历" desc="您的公司和职位信息" field="showWorkHistory" />
            <Item label="展示擅长话题" desc="您设置的专长话题标签" field="showTopics" />
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Lock size={18} className="text-red-500 mr-2" />互动设置
            </CardTitle>
            <CardDescription>控制其他用户如何与您互动</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Item label="允许被关注" desc="其他用户是否可以关注您" field="allowFollowers" />
            <Item label="允许私信" desc="是否接收非关注用户的私信" field="allowMessages" />
            <Item label="公开个人主页" desc="您的资料是否对所有人可见" field="publicProfile" />
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Shield size={18} className="text-purple-500 mr-2" />活动与状态
            </CardTitle>
            <CardDescription>控制您的在线状态和活动显示</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Item label="隐藏活动状态" desc="不显示您最近的活动时间" field="hideActivity" />
            <Item label="隐藏在线状态" desc="不显示您是否在线" field="hideOnline" />
            <Item label="隐藏已读回执" desc="不显示您是否已读消息" field="hideReadReceipts" />
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Users size={18} className="text-indigo-500 mr-2" />社交互动
            </CardTitle>
            <CardDescription>控制与其他用户的互动方式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Item label="推荐可能认识的人" desc="根据共同好友等推荐用户" field="showRecommendations" />
            <div
              className="flex justify-between items-center cursor-pointer rounded-2xl bg-slate-50 px-3 py-3"
              onClick={() => navigate('/settings/blacklist')}
            >
              <div className="space-y-0.5">
                <Label className="text-base">黑名单管理</Label>
                <p className="text-sm text-gray-500">管理已屏蔽的用户</p>
              </div>
              <Button variant="outline" size="sm">管理</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacySettings;
