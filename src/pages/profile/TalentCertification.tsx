
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Check, ChevronRight, Loader2, UploadCloud, CalendarDays, Clock3, XCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SubPageHeader from '@/components/layout/SubPageHeader';
import { useUploadPostMedia } from '@/hooks/usePostMediaUpload';

const CERT_TYPES = [
  { key: 'education', title: '教育认证', desc: '适用于在校学生、教师等教育工作者', colorClass: 'text-primary' },
  { key: 'career', title: '职业认证', desc: '适用于各行业从业人员、专业人士', colorClass: 'text-accent' },
  { key: 'skill', title: '专业技能认证', desc: '适用于掌握特定技能的达人、创作者', colorClass: 'text-purple-500' },
] as const;

const CERT_FORM_CONFIG = {
  education: {
    subtitle: '请完善学历、学校和时间信息，并上传相关证明材料。',
    fields: [
      { key: 'degree', label: '学历', placeholder: '请输入学历，例如本科 / 硕士' },
      { key: 'school', label: '学校', placeholder: '请输入学校全称' },
      { key: 'major', label: '专业', placeholder: '请输入专业名称' },
      { key: 'startDate', label: '入学时间', placeholder: '例如 2021-09' },
      { key: 'endDate', label: '毕业时间', placeholder: '例如 2025-06' },
    ],
    proofHint: '请上传学历证书、学生证等证明材料',
  },
  career: {
    subtitle: '请补充公司、岗位和从业经历，并上传在职或工作证明。',
    fields: [
      { key: 'industry', label: '行业方向', placeholder: '请输入所属行业' },
      { key: 'company', label: '公司', placeholder: '请输入公司名称' },
      { key: 'title', label: '岗位', placeholder: '请输入岗位名称' },
      { key: 'startDate', label: '开始时间', placeholder: '例如 2022-03' },
      { key: 'endDate', label: '结束时间', placeholder: '例如 至今 / 2025-02' },
    ],
    proofHint: '请上传工牌、在职证明、名片等材料',
  },
  skill: {
    subtitle: '请说明你的技能方向、代表作品和实战经验，并上传作品或证书。',
    fields: [
      { key: 'skillCategory', label: '技能方向', placeholder: '例如 设计 / 编程 / 新媒体' },
      { key: 'skillName', label: '技能名称', placeholder: '请输入你擅长的技能' },
      { key: 'experienceYears', label: '经验年限', placeholder: '例如 3年' },
      { key: 'portfolio', label: '代表作品', placeholder: '请输入作品链接或项目名称' },
      { key: 'certificate', label: '相关证书', placeholder: '可填写证书名称或编号' },
    ],
    proofHint: '请上传作品截图、资格证书等相关材料',
  },
} as const;

const TalentCertification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [applyDialog, setApplyDialog] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [proofUrls, setProofUrls] = useState<string[]>([]);
  const uploadProofs = useUploadPostMedia();

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
    mutationFn: async ({ certType, details, proofUrls }: { certType: string; details: Record<string, string>; proofUrls: string[] }) => {
      if (!user) throw new Error('请先登录');
      const existing = certifications?.find((item: any) => item.cert_type === certType);
      const payload = {
        user_id: user.id,
        cert_type: certType,
        status: 'pending',
        details: {
          ...details,
          proof_urls: proofUrls,
        },
      };

      const query = existing
        ? supabase.from('talent_certifications').update(payload).eq('id', existing.id)
        : supabase.from('talent_certifications').insert(payload);

      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast({ title: '申请已提交', description: '我们将尽快审核您的认证申请' });
      setApplyDialog(null);
      setFormValues({});
      setProofUrls([]);
    },
    onError: (err: Error) => {
      toast({ title: '申请失败', description: err.message, variant: 'destructive' });
    },
  });

  const getCertStatus = (certType: string) => {
    const cert = certifications?.find((c: any) => c.cert_type === certType);
    return cert?.status || 'none';
  };

  const certificationSummary = useMemo(() => {
    const total = certifications?.length || 0;
    const approved = certifications?.filter((item: any) => item.status === 'approved').length || 0;
    const pending = certifications?.filter((item: any) => item.status === 'pending').length || 0;
    const rejected = certifications?.filter((item: any) => item.status === 'rejected').length || 0;
    return { total, approved, pending, rejected };
  }, [certifications]);

  const getStatusMeta = (status: string) => {
    if (status === 'approved') {
      return { label: '已认证', icon: <ShieldCheck size={14} className="text-green-500" />, desc: '已通过审核，正在展示认证标识。' };
    }
    if (status === 'pending') {
      return { label: '审核中', icon: <Clock3 size={14} className="text-amber-500" />, desc: '资料已提交，平台正在审核中。' };
    }
    if (status === 'rejected') {
      return { label: '未通过', icon: <XCircle size={14} className="text-rose-500" />, desc: '可补充资料后重新提交审核。' };
    }
    return { label: '未申请', icon: <Award size={14} className="text-slate-400" />, desc: '选择对应类型即可发起认证申请。' };
  };

  const currentConfig = useMemo(() => {
    if (!applyDialog) return null;
    return CERT_FORM_CONFIG[applyDialog as keyof typeof CERT_FORM_CONFIG];
  }, [applyDialog]);

  const updateField = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = 3 - proofUrls.length;
    if (availableSlots <= 0) {
      toast({ title: '最多上传 3 张', description: '请先删除已有材料，再继续上传。', variant: 'destructive' });
      return;
    }

    try {
      const uploaded = await uploadProofs.mutateAsync(files.slice(0, availableSlots));
      setProofUrls((prev) => [...prev, ...uploaded].slice(0, 3));
      if (files.length > availableSlots) {
        toast({ title: '部分图片未上传', description: '最多支持 3 张证明材料。' });
      }
    } finally {
      e.target.value = '';
    }
  };

  const currentType = CERT_TYPES.find((t) => t.key === applyDialog);
  const canSubmit = currentConfig
    ? currentConfig.fields.slice(0, 2).every((field) => formValues[field.key]?.trim()) && proofUrls.length > 0
    : false;

  return (
    <div className="pb-8 min-h-[100dvh] bg-muted">
      <SubPageHeader title="达人认证" />

      <div className="p-4 space-y-4">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">认证进度</p>
                <p className="mt-1 text-xs text-muted-foreground">随时查看你的审核状态和当前认证结果。</p>
              </div>
              <span className="rounded-full bg-[rgb(236,251,247)] px-3 py-1 text-xs font-medium text-[rgb(73,170,155)]">
                {certificationSummary.approved > 0 ? `${certificationSummary.approved} 项通过` : '待申请'}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                <p className="text-xs text-slate-500">审核中</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{certificationSummary.pending}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                <p className="text-xs text-slate-500">已通过</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{certificationSummary.approved}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                <p className="text-xs text-slate-500">未通过</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{certificationSummary.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-4">
            <h2 className="mb-3 text-lg font-semibold text-foreground">为什么要认证？</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start"><Check size={16} className="text-green-500 mr-2 mt-0.5" /><span>获得官方认证标识，提升个人可信度</span></li>
              <li className="flex items-start"><Check size={16} className="text-green-500 mr-2 mt-0.5" /><span>问答内容获得优先展示</span></li>
              <li className="flex items-start"><Check size={16} className="text-green-500 mr-2 mt-0.5" /><span>有机会被平台推荐为领域专家</span></li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="px-1 text-lg font-semibold text-foreground">选择认证类型</h3>
          <p className="px-1 text-sm text-muted-foreground">认证通过后，您将获得专属标识和更多权益。</p>
        
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            CERT_TYPES.map((type) => {
              const status = getCertStatus(type.key);
              const statusMeta = getStatusMeta(status);
              return (
                <Card key={type.key} className="surface-card rounded-3xl border-none shadow-sm">
                  <CardContent className="p-0">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between p-4 text-left"
                      onClick={() => {
                        if (status === 'none' || status === 'rejected') {
                          if (!user) { navigate('/auth'); return; }
                          setApplyDialog(type.key);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                          <Award className={type.colorClass} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">{type.title}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{type.desc}</p>
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            {statusMeta.icon}
                            <span>{statusMeta.desc}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {status === 'pending' && <span className="mr-2 text-sm text-amber-500">审核中</span>}
                        {status === 'approved' && <span className="mr-2 text-sm text-green-500">已认证</span>}
                        {status === 'rejected' && <span className="mr-2 text-sm text-destructive">未通过</span>}
                        {(status === 'none' || status === 'rejected') && <ChevronRight size={20} className="text-muted-foreground" />}
                      </div>
                    </button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog
        open={!!applyDialog}
        onOpenChange={(open) => {
          setApplyDialog(open ? applyDialog : null);
          if (!open) {
            setFormValues({});
            setProofUrls([]);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentType ? `${currentType.title}申请` : '认证申请'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {currentConfig && (
              <>
                <p className="text-sm text-muted-foreground">{currentConfig.subtitle}</p>
                <div className="space-y-4 rounded-2xl bg-muted/40 p-4">
                  {currentConfig.fields.map((field) => (
                    <div key={field.key}>
                      <Label className="text-sm font-medium text-foreground">{field.label}</Label>
                      <div className="relative mt-2">
                        <Input
                          value={formValues[field.key] || ''}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="h-12 rounded-2xl border-0 bg-white pr-10 shadow-sm"
                        />
                        {(field.key.includes('Date') || field.key === 'startDate' || field.key === 'endDate') && (
                          <CalendarDays className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                  <div>
                    <Label className="text-sm font-medium text-foreground">补充说明</Label>
                    <Textarea
                      placeholder="可补充你的认证背景、代表经历和审核说明"
                      value={formValues.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      className="mt-2 min-h-[88px] rounded-2xl border-0 bg-white shadow-sm"
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <Label className="text-sm font-medium text-foreground">上传证明材料</Label>
                      <span className="text-xs text-muted-foreground">{proofUrls.length}/3</span>
                    </div>
                    <p className="mb-3 text-xs text-muted-foreground">{currentConfig.proofHint}</p>
                    <div className="flex flex-wrap gap-3">
                      {proofUrls.map((url, index) => (
                        <div key={url} className="relative h-24 w-24 overflow-hidden rounded-2xl border border-border bg-white">
                          <img src={url} alt={`证明材料${index + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white"
                            onClick={() => setProofUrls((prev) => prev.filter((item) => item !== url))}
                          >
                            删除
                          </button>
                        </div>
                      ))}
                      {proofUrls.length < 3 && (
                        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white text-xs text-muted-foreground">
                          <UploadCloud size={20} className="mb-2 text-muted-foreground" />
                          {uploadProofs.isPending ? '上传中' : '上传图片'}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            multiple
                            className="hidden"
                            onChange={handleProofUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialog(null)}>取消</Button>
            <Button
              onClick={() => applyDialog && applyCert.mutate({ certType: applyDialog, details: formValues, proofUrls })}
              disabled={applyCert.isPending || uploadProofs.isPending || !canSubmit}
            >
              {applyCert.isPending && <Loader2 size={16} className="animate-spin mr-1" />}
              提交申请
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default TalentCertification;
