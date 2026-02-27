import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const FeedbackCard = ({ title, description }: { title: string; description: string }) => (
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
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({ title: "请输入反馈内容", description: "反馈内容不能为空" });
      return;
    }
    if (!user) {
      toast({ title: "请先登录", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        type: feedbackType,
        content: feedback.trim(),
      });
      if (error) throw error;
      toast({ title: "反馈已提交", description: "感谢您的反馈，我们会认真查看" });
      setFeedback('');
    } catch (error: any) {
      toast({ title: "提交失败", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { id: 'feature', label: '功能建议' },
    { id: 'bug', label: '问题反馈' },
    { id: 'experience', label: '体验优化' },
    { id: 'general', label: '其他' },
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">产品反馈</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">提交反馈</CardTitle>
            <CardDescription>您的反馈对我们很重要</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {types.map(t => (
                  <Button
                    key={t.id}
                    variant={feedbackType === t.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFeedbackType(t.id)}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="请详细描述您遇到的问题或建议..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Send size={16} className="mr-2" />}
                  提交反馈
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <h3 className="text-lg font-medium pl-1">常见问题</h3>
          <FeedbackCard title="功能建议" description="提出新功能建议或现有功能改进意见" />
          <FeedbackCard title="问题反馈" description="报告使用过程中遇到的问题或错误" />
          <FeedbackCard title="体验优化" description="分享使用体验，帮助我们做得更好" />
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
