import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HardDrive, Image, FileText, Video, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const StorageSpace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [totalSpace] = useState(5120); // 5GB in MB
  const [usedSpace] = useState({
    images: 1280,
    documents: 512,
    videos: 2048,
    other: 256
  });

  const totalUsed = Object.values(usedSpace).reduce((a, b) => a + b, 0);
  const usedPercentage = (totalUsed / totalSpace) * 100;

  const storageItems = [
    { type: '图片', icon: <Image size={20} />, used: usedSpace.images, color: 'text-blue-500' },
    { type: '文档', icon: <FileText size={20} />, used: usedSpace.documents, color: 'text-green-500' },
    { type: '视频', icon: <Video size={20} />, used: usedSpace.videos, color: 'text-purple-500' },
    { type: '其他', icon: <HardDrive size={20} />, used: usedSpace.other, color: 'text-gray-500' },
  ];

  const handleClearCache = () => {
    toast({
      title: "清除成功",
      description: "缓存已成功清除",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">存储空间</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">存储空间使用情况</CardTitle>
            <CardDescription>
              总空间 {(totalSpace / 1024).toFixed(1)}GB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={usedPercentage} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">已使用 {(totalUsed / 1024).toFixed(1)}GB</span>
                <span className="text-gray-600">剩余 {((totalSpace - totalUsed) / 1024).toFixed(1)}GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">存储详情</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storageItems.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`${item.color}`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-gray-500">
                          {(item.used / 1024).toFixed(1)}GB
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      管理
                    </Button>
                  </div>
                  {index < storageItems.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleClearCache}
          >
            <Trash2 size={16} className="mr-2" />
            清除缓存
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">
            清除缓存不会删除您的个人数据
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorageSpace;
