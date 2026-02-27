
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Check, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CERT_TYPES = [
  { key: 'education', title: '教育认证', desc: '验证您的学历背景', colorClass: 'text-primary' },
  { key: 'career', title: '职业认证', desc: '证明您的职业经验', colorClass: 'text-accent' },
  { key: 'skill', title: '专业技能认证', desc: '展示您的专业能力', colorClass: 'text-purple-500' },
];

const TalentCertification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [applyDialog, setApplyDialog] = useState<string | null>(null);
  const [applyDetails, setApplyDetails] = useState('');

  const { data: certifications, isLoading } = useQuery({
    queryKey: ['certifications', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_certifications')
        .select('*')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data || [];
    },
  });

  const applyCert = useMutation({
    mutationFn: async ({ certType, details }: { certType: string; details: string }) => {
      if (!user) throw new Error('请先登录');
      const { error } = await supabase
        .from('talent_certifications')
        .insert({ user_id: user.id, cert_type: certType, details: { description: details } });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast({ title: '申请已提交', description: '我们将尽快审核您的认证申请' });
      setApplyDialog(null);
      setApplyDetails('');
    },
    onError: (err: Error) => {
      toast({ title: '申请失败', description: err.message, variant: 'destructive' });
    },
  });

  const getCertStatus = (certType: string) => {
    const cert = certifications?.find((c: any) => c.cert_type === certType);
    return cert?.status || 'none';
  };

  return (
    <div className="pb-20 min-h-screen bg-muted">
      <div className="sticky top-0 z-10 bg-background flex items-center p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">达人认证</h1>
      </div>

      <div className="p-4">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2 text-foreground">为什么要认证？</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start"><Check size={16} className="text-green-500 mr-2 mt-0.5" /><span>获得官方认证标识，提升个人可信度</span></li>
              <li className="flex items-start"><Check size={16} className="text-green-500 mr-2 mt-0.5" /><span>问答内容获得优先展示</span></li>
              <li className="flex items-start"><Check size={16} className="text-green-500 mr-2 mt-0.5" /><span>有机会被平台推荐为领域专家</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold mb-1 px-1 text-foreground">认证类型</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          CERT_TYPES.map((type) => {
            const status = getCertStatus(type.key);
            return (
              <Card key={type.key} className="border-none shadow-sm">
                <CardContent className="p-0">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => {
                      if (status === 'none') {
                        if (!user) { navigate('/auth'); return; }
                        setApplyDialog(type.key);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                        <Award className={type.colorClass} />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{type.title}</h4>
                        <p className="text-sm text-muted-foreground">{type.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {status === 'pending' && <span className="text-amber-500 text-sm mr-2">审核中</span>}
                      {status === 'approved' && <span className="text-green-500 text-sm mr-2">已认证</span>}
                      {status === 'rejected' && <span className="text-destructive text-sm mr-2">未通过</span>}
                      {status === 'none' && <ChevronRight size={20} className="text-muted-foreground" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Apply Dialog */}
      <Dialog open={!!applyDialog} onOpenChange={() => setApplyDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>申请{CERT_TYPES.find(t => t.key === applyDialog)?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>认证说明</Label>
              <Textarea
                placeholder="请描述您的相关经历和资质..."
                value={applyDetails}
                onChange={(e) => setApplyDetails(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialog(null)}>取消</Button>
            <Button
              onClick={() => applyDialog && applyCert.mutate({ certType: applyDialog, details: applyDetails })}
              disabled={applyCert.isPending || !applyDetails.trim()}
            >
              {applyCert.isPending && <Loader2 size={16} className="animate-spin mr-1" />}
              提交申请
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default TalentCertification;
