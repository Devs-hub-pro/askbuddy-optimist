
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout, Eye, BellRing, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BottomNav from '@/components/BottomNav';

const ContentPreferences = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">内容偏好与调节</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Layout className="w-5 h-5 mr-2 text-blue-500" />
              界面显示
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">深色模式</div>
                <div className="text-xs text-gray-500">调节界面亮度</div>
              </div>
              <Switch />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">字体大小</div>
                <div className="text-xs text-gray-500">调节应用字体大小</div>
              </div>
              <Select defaultValue="medium">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Eye className="w-5 h-5 mr-2 text-green-500" />
              内容偏好
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">兴趣标签</div>
                <div className="text-xs text-gray-500">设置您感兴趣的内容标签</div>
              </div>
              <Button variant="outline" size="sm">管理</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">内容语言</div>
                <div className="text-xs text-gray-500">选择您偏好的内容语言</div>
              </div>
              <Select defaultValue="zh">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="en">英文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <BellRing className="w-5 h-5 mr-2 text-purple-500" />
              推送设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">相关问题推送</div>
                <div className="text-xs text-gray-500">接收相关问题的推送通知</div>
              </div>
              <Switch />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">热门话题推送</div>
                <div className="text-xs text-gray-500">接收热门话题的推送通知</div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default ContentPreferences;
