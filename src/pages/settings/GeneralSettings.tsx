
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Moon, Sun, Smartphone, Languages, ThermometerSun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';

const GeneralSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    darkMode: false,
    autoPlayVideos: true,
    saveData: false,
    language: 'zh_CN',
    temperature: 'celsius',
    theme: 'default'
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

  const handleSelectChange = (value: string, field: string) => {
    setSettings({
      ...settings,
      [field]: value
    });
    
    toast({
      title: "设置已更新",
      description: `${field === 'language' ? '语言' : field === 'temperature' ? '温度单位' : '主题'}已更改`,
    });
  };

  const themes = [
    { value: 'default', label: '默认主题' },
    { value: 'light', label: '浅色模式' },
    { value: 'dark', label: '深色模式' },
    { value: 'blue', label: '蓝色主题' },
    { value: 'green', label: '绿色主题' }
  ];

  const languages = [
    { value: 'zh_CN', label: '简体中文' },
    { value: 'zh_TW', label: '繁體中文' },
    { value: 'en_US', label: 'English (US)' },
    { value: 'ja_JP', label: '日本語' },
    { value: 'ko_KR', label: '한국어' }
  ];

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
        <h1 className="text-xl font-semibold">通用设置</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Palette size={18} className="text-app-blue mr-2" />
              显示设置
            </CardTitle>
            <CardDescription>调整应用的外观</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">深色模式</Label>
                <p className="text-sm text-gray-500">适合夜间使用的模式</p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun size={16} className="text-amber-500" />
                <Switch 
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggle('darkMode')}
                />
                <Moon size={16} className="text-indigo-600" />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">主题</Label>
                <p className="text-sm text-gray-500">选择您喜欢的应用主题</p>
              </div>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleSelectChange(value, 'theme')}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="选择主题" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Languages size={18} className="text-green-500 mr-2" />
              语言与区域
            </CardTitle>
            <CardDescription>设置您的首选语言和显示单位</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">语言</Label>
                <p className="text-sm text-gray-500">选择应用的显示语言</p>
              </div>
              <Select
                value={settings.language}
                onValueChange={(value) => handleSelectChange(value, 'language')}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>{language.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">温度单位</Label>
                <p className="text-sm text-gray-500">选择您偏好的温度单位</p>
              </div>
              <Select
                value={settings.temperature}
                onValueChange={(value) => handleSelectChange(value, 'temperature')}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="选择温度单位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">摄氏度 (°C)</SelectItem>
                  <SelectItem value="fahrenheit">华氏度 (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-none rounded-xl overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <Smartphone size={18} className="text-orange-500 mr-2" />
              数据与媒体
            </CardTitle>
            <CardDescription>控制数据使用和媒体播放设置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">视频自动播放</Label>
                <p className="text-sm text-gray-500">浏览时自动播放视频</p>
              </div>
              <Switch 
                checked={settings.autoPlayVideos}
                onCheckedChange={() => handleToggle('autoPlayVideos')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">数据节省模式</Label>
                <p className="text-sm text-gray-500">减少移动数据使用量</p>
              </div>
              <Switch 
                checked={settings.saveData}
                onCheckedChange={() => handleToggle('saveData')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => {
            toast({
              title: "缓存已清除",
              description: "应用缓存数据已清除",
            });
          }}
        >
          清除应用缓存
        </Button>

        <div className="p-4 text-center text-sm text-gray-500">
          <p>应用版本: 1.2.3</p>
          <p>部分设置需要重启应用后生效</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default GeneralSettings;
