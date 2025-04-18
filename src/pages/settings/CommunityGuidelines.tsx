
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, MessageSquare, Flag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';

const CommunityGuidelines = () => {
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
        <h1 className="text-xl font-semibold">问问规范</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-500" />
              基本准则
            </CardTitle>
            <CardDescription>
              遵守以下准则，共建良好社区氛围
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                请保持友善，互相尊重
              </div>
              <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                分享真实、有价值的信息
              </div>
              <div className="p-3 bg-purple-50 text-purple-700 rounded-lg text-sm">
                遵守知识产权，注明引用来源
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
              内容规范
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Flag className="w-5 h-5 text-gray-500 mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-sm">原创内容</div>
                  <div className="text-xs text-gray-500 mt-1">鼓励分享原创经验和见解，避免简单复制粘贴</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <AlertTriangle className="w-5 h-5 text-gray-500 mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-sm">禁止内容</div>
                  <div className="text-xs text-gray-500 mt-1">禁止发布违法、色情、暴力、诈骗等有害信息</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Shield className="w-5 h-5 mr-2 text-orange-500" />
              违规处理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">违规行为将根据情节轻重采取以下处理：</div>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>内容删除</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>账号警告</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>限制功能使用</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                  <span>永久封禁</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default CommunityGuidelines;
