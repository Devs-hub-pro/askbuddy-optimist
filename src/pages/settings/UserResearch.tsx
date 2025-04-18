
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Star, Send, Smile, ThumbsUp, Award, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';

const UserResearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!feedback.trim()) {
      toast({
        title: "请输入反馈内容",
        description: "反馈内容不能为空",
      });
      return;
    }

    toast({
      title: "感谢您的参与！",
      description: "您的反馈对我们很重要",
    });
    setFeedback('');
  };

  const surveyCards = [
    {
      title: "新功能体验官",
      description: "抢先体验新功能",
      icon: <Star className="text-yellow-500" />,
      reward: "专属徽章",
      bg: "bg-gradient-to-r from-yellow-400/10 to-amber-300/10"
    },
    {
      title: "产品调研访谈",
      description: "深度交流",
      icon: <MessageSquare className="text-blue-500" />,
      reward: "¥50红包",
      bg: "bg-gradient-to-r from-blue-400/10 to-cyan-300/10"
    },
    {
      title: "问卷调研",
      description: "3分钟快速反馈",
      icon: <ThumbsUp className="text-green-500" />,
      reward: "10积分",
      bg: "bg-gradient-to-r from-green-400/10 to-emerald-300/10"
    }
  ];

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
        <h1 className="text-xl font-semibold">用户体验调研</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Header Card */}
        <Card className="border-none bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white">
          <CardContent className="pt-6 pb-8">
            <div className="flex items-center mb-4">
              <Smile className="w-8 h-8 mr-3" />
              <div>
                <h3 className="text-xl font-bold">hi～参与体验调研</h3>
                <p className="text-sm opacity-90">帮助我们变得更好</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Award className="w-4 h-4" />
              <span>参与即可获得积分奖励</span>
            </div>
          </CardContent>
        </Card>

        {/* Survey Cards */}
        <div className="grid gap-4">
          {surveyCards.map((card, index) => (
            <Card 
              key={index} 
              className={`border-none ${card.bg} cursor-pointer transform transition-transform hover:scale-[1.02]`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-lg">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary" className="gap-1">
                    <Gift size={14} />
                    {card.reward}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Feedback */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">快速反馈</CardTitle>
            <CardDescription>
              分享您的想法和建议
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="请输入您的反馈..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={handleSubmit}
              >
                <Send size={16} className="mr-2" />
                提交反馈
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default UserResearch;
