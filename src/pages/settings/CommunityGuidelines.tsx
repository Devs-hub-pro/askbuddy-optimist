import React from 'react';
import { Shield, MessageSquare, Flag, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SubPageHeader from '@/components/layout/SubPageHeader';

const CommunityGuidelines = () => {
  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-8">
      <SubPageHeader title="问问规范" />

      <div className="p-5 space-y-5">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
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
              <div className="rounded-2xl bg-blue-50 p-3 text-sm text-blue-700">
                请保持友善，互相尊重
              </div>
              <div className="rounded-2xl bg-green-50 p-3 text-sm text-green-700">
                分享真实、有价值的信息
              </div>
              <div className="rounded-2xl bg-purple-50 p-3 text-sm text-purple-700">
                遵守知识产权，注明引用来源
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
              内容规范
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 rounded-2xl border p-3">
                <Flag className="w-5 h-5 text-gray-500 mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-sm">原创内容</div>
                  <div className="text-xs text-gray-500 mt-1">鼓励分享原创经验和见解，避免简单复制粘贴</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 rounded-2xl border p-3">
                <AlertTriangle className="w-5 h-5 text-gray-500 mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-sm">禁止内容</div>
                  <div className="text-xs text-gray-500 mt-1">禁止发布违法、色情、暴力、诈骗等有害信息</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
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
    </div>
  );
};

export default CommunityGuidelines;
