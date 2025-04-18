import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Star, Send, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';

const FeedbackCard = ({ type, title, description }: { type: string; title: string; description: string }) => (
  <Card className="border border-gray-100">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  </Card>
);

const ProductFeedback = () => {
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
      title: "反馈已提交",
      description: "感谢您的反馈，我们会认真查看",
    });
    setFeedback('');
  };

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
        <h1 className="text-xl font-semibold">产品反馈</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">提交反馈</CardTitle>
            <CardDescription>
              您的反馈对我们很重要
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="请详细描述您遇到的问题或建议..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-between items-center">
                <Button variant="outline" size="icon">
                  <ImageIcon size={18} />
                </Button>
                <Button onClick={handleSubmit}>
                  <Send size={16} className="mr-2" />
                  提交反馈
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <h3 className="text-lg font-medium pl-1">常见问题</h3>
          <FeedbackCard
            type="feature"
            title="功能建议"
            description="提出新功能建议或现有功能改进意见"
          />
          <FeedbackCard
            type="bug"
            title="问题反馈"
            description="报告使用过程中遇到的问题或错误"
          />
          <FeedbackCard
            type="experience"
            title="体验优化"
            description="分享使用体验，帮助我们做得更好"
          />
        </div>

        <div className="flex items-center justify-center space-x-2 py-6">
          <Star size={16} className="text-yellow-400" />
          <p className="text-sm text-gray-500">如果觉得好用，请给我们好评</p>
        </div>
      </div>
    </div>
  );
};

export default ProductFeedback;
