
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  Award, 
  MessageSquare, 
  Clock, 
  Package, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Loader2
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedConsultType, setSelectedConsultType] = useState<'text' | 'voice' | 'video'>('text');
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const { data: expert, isLoading } = useQuery({
    queryKey: ['expert-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const createOrder = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('请先登录');
      if (!expert) throw new Error('专家信息不存在');

      const amounts: Record<string, number> = { text: 50, voice: 100, video: 200 };
      const amount = amounts[selectedConsultType] || 50;

      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        order_type: 'consultation',
        amount,
        related_id: expert.id,
        status: 'pending',
        payment_method: selectedConsultType + '咨询',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      toast({ title: '预约成功', description: '咨询订单已创建，请前往订单页查看' });
      setShowOrderDialog(false);
    },
    onError: (err: Error) => {
      toast({ title: '预约失败', description: err.message, variant: 'destructive' });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">专家信息未找到</p>
      </div>
    );
  }

  const education = Array.isArray(expert.education) ? expert.education : [];
  const experience = Array.isArray(expert.experience) ? expert.experience : [];
  const description = expert.bio || '';
  const amounts: Record<string, number> = { text: 50, voice: 100, video: 200 };

  return (
    <div className="app-container bg-gradient-to-b from-background to-muted pb-20 min-h-screen">
      <div className="sticky top-0 z-50 bg-primary shadow-sm">
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate(-1)} className="text-primary-foreground">
            <ChevronLeft size={24} />
          </button>
          <div className="text-primary-foreground font-medium text-base ml-2">达人详情</div>
          <div className="flex-1"></div>
          <button className="text-primary-foreground"><Bell size={20} /></button>
        </div>
      </div>
      
      <div className="px-4 py-6 space-y-6">
        {/* Expert Header */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary/20">
                <AvatarImage src={expert.avatar_url || ''} alt={expert.display_name || ''} className="object-cover" />
                <AvatarFallback className="text-lg">{(expert.display_name || '专')[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{expert.display_name}</h2>
                  {expert.is_verified && (
                    <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full border border-primary/20 flex items-center">
                      <Award size={10} className="mr-0.5" /> 已认证
                    </span>
                  )}
                </div>
                <p className="text-sm text-primary">{expert.title}</p>
                {expert.location && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin size={12} className="mr-1" />
                    <span>{expert.location}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <div className="flex items-center justify-end text-yellow-500 gap-1">
                <Award size={14} />
                <span className="text-sm font-medium">{expert.rating || 0}</span>
              </div>
              <div className="flex items-center justify-end text-primary gap-1 text-xs">
                <Clock size={12} />
                <span>{expert.response_rate || 0}% 响应率</span>
              </div>
              <div className="flex items-center justify-end text-accent gap-1 text-xs">
                <Package size={12} />
                <span>{expert.order_count || 0}单</span>
              </div>
            </div>
          </div>
          
          {/* Description */}
          {description && (
            <Collapsible 
              className="w-full border border-border rounded-lg p-4 bg-muted/50 mb-4"
              open={isDescriptionExpanded}
              onOpenChange={setIsDescriptionExpanded}
            >
              <div className="text-sm text-foreground leading-relaxed">
                {description.length > 200 && !isDescriptionExpanded ? (
                  <>
                    <p>{description.substring(0, 200)}...</p>
                    <CollapsibleTrigger className="text-primary text-xs mt-2 hover:underline flex items-center">
                      展开全部 <ChevronDown size={12} className="ml-1" />
                    </CollapsibleTrigger>
                  </>
                ) : (
                  <>
                    <p>{description}</p>
                    {description.length > 200 && (
                      <CollapsibleTrigger className="text-primary text-xs mt-2 hover:underline flex items-center">
                        收起 <ChevronUp size={12} className="ml-1" />
                      </CollapsibleTrigger>
                    )}
                  </>
                )}
              </div>
              <CollapsibleContent />
            </Collapsible>
          )}
          
          {/* Tags */}
          {expert.tags && expert.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {expert.tags.map((tag: string, index: number) => (
                <span key={index} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full border border-primary/20">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Education & Experience */}
        {(education.length > 0 || experience.length > 0) && (
          <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
            {education.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">教育经历</h3>
                <div className="space-y-2">
                  {education.map((edu: any, index: number) => (
                    <div key={index} className="bg-primary/5 text-foreground text-sm px-3 py-2 rounded-md">
                      {typeof edu === 'string' ? edu : `${edu.school || ''} ${edu.degree || ''}`}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {experience.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">工作经历</h3>
                <div className="space-y-2">
                  {experience.map((exp: any, index: number) => (
                    <div key={index} className="bg-accent/10 text-foreground text-sm px-3 py-2 rounded-md">
                      {typeof exp === 'string' ? exp : `${exp.company || ''} ${exp.title || ''}`}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Consult Options */}
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-foreground">咨询方式</h3>
          <div className="flex gap-3">
            {(['text', 'voice', 'video'] as const).map((type) => (
              <button
                key={type}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedConsultType === type
                    ? 'bg-primary/10 text-primary border-2 border-primary/30'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
                onClick={() => setSelectedConsultType(type)}
              >
                <div>{type === 'text' ? '文本咨询' : type === 'voice' ? '语音咨询' : '视频咨询'}</div>
                <div className="text-xs mt-1">{amounts[type]}积分</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            if (!user) { navigate('/auth'); return; }
            setShowOrderDialog(true);
          }}
        >
          预约咨询
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            if (!user) { navigate('/auth'); return; }
            navigate(`/chat/${expert.user_id}`);
          }}
        >
          <MessageSquare size={16} className="mr-2" />
          私聊
        </Button>
      </div>

      {/* Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认预约咨询</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">咨询专家</span>
              <span className="font-medium text-foreground">{expert.display_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">咨询方式</span>
              <span className="font-medium text-foreground">
                {selectedConsultType === 'text' ? '文本咨询' : selectedConsultType === 'voice' ? '语音咨询' : '视频咨询'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">费用</span>
              <span className="font-medium text-primary">{amounts[selectedConsultType]} 积分</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>取消</Button>
            <Button onClick={() => createOrder.mutate()} disabled={createOrder.isPending}>
              {createOrder.isPending && <Loader2 size={16} className="animate-spin mr-1" />}
              确认预约
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertDetail;
