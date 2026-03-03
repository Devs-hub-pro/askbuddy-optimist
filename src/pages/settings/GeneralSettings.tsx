import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Languages,
  Type,
  Database,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import SubPageHeader from '@/components/layout/SubPageHeader';

const GeneralSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    darkMode: false,
    autoWifi: true,
    mobileData: false,
    fontSize: 'medium',
    language: 'zh_CN'
  });

  const handleToggle = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
    
    toast({
      title: "设置已更新",
      description: "您的设置已保存并生效",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SubPageHeader title="通用设置" />

      <div className="p-5 space-y-5">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">设置中心</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  在这里统一调整显示、语言和语音视频偏好，让使用体验更贴合你的习惯。
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-[rgb(73,170,155)]" />
            </div>
          </CardContent>
        </Card>

        {/* 显示设置 */}
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Type className="w-5 h-5 mr-2 text-blue-500" />
              显示设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center rounded-2xl bg-slate-50 px-3 py-3">
              <div className="space-y-0.5">
                <Label>字体大小</Label>
                <p className="text-xs text-gray-500">调整应用字体大小</p>
              </div>
              <Select 
                value={settings.fontSize}
                onValueChange={(value) => {
                  setSettings({ ...settings, fontSize: value });
                  toast({ title: "字体大小已更新" });
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">小</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="large">大</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center rounded-2xl bg-slate-50 px-3 py-3">
              <div className="space-y-0.5">
                <Label>深色模式</Label>
                <p className="text-xs text-gray-500">适合夜间使用</p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun size={16} className="text-yellow-500" />
                <Switch 
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggle('darkMode')}
                />
                <Moon size={16} className="text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 语言设置 */}
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Languages className="w-5 h-5 mr-2 text-green-500" />
              语言设置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center rounded-2xl bg-slate-50 px-3 py-3">
              <div className="space-y-0.5">
                <Label>应用语言</Label>
                <p className="text-xs text-gray-500">选择界面显示语言</p>
              </div>
              <Select 
                value={settings.language}
                onValueChange={(value) => {
                  setSettings({ ...settings, language: value });
                  toast({ title: "语言已更新" });
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh_CN">简体中文</SelectItem>
                  <SelectItem value="zh_TW">繁體中文</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 网络设置 */}
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-500" />
              语音视频设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center rounded-2xl bg-slate-50 px-3 py-3">
              <div className="space-y-0.5">
                <Label>仅在WiFi下进行语音视频</Label>
                <p className="text-xs text-gray-500">开启后仅在WiFi环境下进行咨询</p>
              </div>
              <Switch 
                checked={settings.autoWifi}
                onCheckedChange={() => handleToggle('autoWifi')}
              />
            </div>

            <div className="flex justify-between items-center rounded-2xl bg-slate-50 px-3 py-3">
              <div className="space-y-0.5">
                <Label>移动数据提醒</Label>
                <p className="text-xs text-gray-500">使用移动数据时提醒</p>
              </div>
              <Switch 
                checked={settings.mobileData}
                onCheckedChange={() => handleToggle('mobileData')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralSettings;
