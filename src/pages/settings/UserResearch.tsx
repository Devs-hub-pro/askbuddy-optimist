import React from 'react';
import { Star, MessageSquare, Gift, Trophy, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import SubPageHeader from '@/components/layout/SubPageHeader';

const UserResearch = () => {
  const handleParticipate = (activity: string) => {
    toast({
      title: "感谢参与",
      description: "您的反馈对我们很重要",
    });
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[rgb(236,251,247)] to-white">
      <SubPageHeader title="用户体验调研" />

      <div className="space-y-4 p-4">
        {/* 当前活动 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            当前活动
          </h2>
          <Card className="surface-card rounded-3xl border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-full bg-[rgb(121,213,199)] px-3 py-1 text-sm text-white">
                  限时活动
                </span>
                <span className="text-sm text-primary">奖励: 50积分</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">新版界面体验官招募</h3>
              <p className="text-gray-600 text-sm mb-4">
                参与新版界面测试，提供您的宝贵建议，助力产品优化升级！
              </p>
              <Button 
                onClick={() => handleParticipate('interface')}
                className="w-full rounded-full bg-[rgb(121,213,199)] hover:bg-[rgb(97,194,179)]"
              >
                立即参与
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 其他参与方式 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
            更多参与方式
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="surface-card rounded-3xl cursor-pointer transition-shadow hover:shadow-md" onClick={() => handleParticipate('survey')}>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-medium mb-1">问卷调查</h3>
                <p className="text-xs text-gray-500">获得20积分</p>
              </CardContent>
            </Card>

            <Card className="surface-card rounded-3xl cursor-pointer transition-shadow hover:shadow-md" onClick={() => handleParticipate('interview')}>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-medium mb-1">深度访谈</h3>
                <p className="text-xs text-gray-500">获得100积分</p>
              </CardContent>
            </Card>

            <Card className="surface-card rounded-3xl cursor-pointer transition-shadow hover:shadow-md" onClick={() => handleParticipate('testing')}>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="font-medium mb-1">功能测试</h3>
                <p className="text-xs text-gray-500">获得50积分</p>
              </CardContent>
            </Card>

            <Card className="surface-card rounded-3xl cursor-pointer transition-shadow hover:shadow-md" onClick={() => handleParticipate('feedback')}>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-medium mb-1">意见反馈</h3>
                <p className="text-xs text-gray-500">获得10积分</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserResearch;
