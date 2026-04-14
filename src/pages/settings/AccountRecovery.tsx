import React, { useState } from 'react';
import { Fingerprint, Mail, Phone, ShieldQuestion } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import SubPageHeader from '@/components/layout/SubPageHeader';
import { useToast } from '@/hooks/use-toast';

const recoveryMethods = [
  {
    id: 'phone',
    title: '通过手机号找回',
    description: '适合仍能接收短信验证码的账号。',
    icon: Phone,
  },
  {
    id: 'email',
    title: '通过邮箱找回',
    description: '适合仍能登录邮箱并接收验证邮件的账号。',
    icon: Mail,
  },
  {
    id: 'manual',
    title: '人工申诉找回',
    description: '当手机号和邮箱都不可用时，可提交人工审核。',
    icon: Fingerprint,
  },
];

const AccountRecovery = () => {
  const { toast } = useToast();
  const [method, setMethod] = useState<'phone' | 'email' | 'manual'>('phone');
  const [account, setAccount] = useState('');
  const [contact, setContact] = useState('');
  const [reason, setReason] = useState('');

  return (
    <div className="min-h-[100dvh] bg-slate-50">
      <SubPageHeader title="账号找回" />

      <div className="space-y-4 p-4">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <ShieldQuestion size={16} className="app-accent-text" />
              <p className="text-sm font-semibold text-foreground">找回说明</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              如果你暂时无法登录账号，可以通过手机号、邮箱或人工申诉的方式找回。平台会优先核验你最近使用的登录信息和身份资料。
            </p>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="space-y-3 p-4">
            <p className="text-sm font-semibold text-foreground">选择找回方式</p>
            <div className="space-y-3">
              {recoveryMethods.map((item) => {
                const Icon = item.icon;
                const active = method === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMethod(item.id as 'phone' | 'email' | 'manual')}
                    className={`flex w-full items-start gap-3 rounded-3xl border px-4 py-4 text-left transition-all ${
                      active
                        ? 'app-soft-border app-soft-surface-bg'
                        : 'border-border bg-background'
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <Icon size={18} className="app-accent-text" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="space-y-4 p-4">
            <p className="text-sm font-semibold text-foreground">提交找回信息</p>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">账号信息</p>
              <Input
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="请输入绑定手机号、邮箱或用户名"
                className="h-12 rounded-2xl border-0 bg-muted shadow-none"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                {method === 'phone' ? '接收验证码的手机号' : method === 'email' ? '接收验证邮件的邮箱' : '可联系到你的手机号或邮箱'}
              </p>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={method === 'email' ? '请输入邮箱地址' : '请输入联系方式'}
                className="h-12 rounded-2xl border-0 bg-muted shadow-none"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">补充说明</p>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="可补充最近登录时间、常用设备、无法登录的原因等信息"
                className="min-h-28 rounded-3xl border-0 bg-muted shadow-none"
              />
            </div>

            <Button
              className="h-12 w-full rounded-2xl text-base font-semibold shadow-sm"
              disabled={!account.trim() || !contact.trim()}
              onClick={() =>
                toast({
                  title: '找回申请入口已准备好',
                  description: '下一步可继续接入验证码校验与人工审核提交流程。',
                })
              }
            >
              提交找回申请
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="space-y-3 p-4">
            <p className="text-sm font-semibold text-foreground">找回流程</p>
            <div className="space-y-2 text-sm leading-6 text-muted-foreground">
              <p>1. 选择适合你的找回方式并填写账号信息。</p>
              <p>2. 平台会优先验证手机号、邮箱或近期登录记录。</p>
              <p>3. 如果需要人工审核，我们会通过你填写的联系方式继续确认。</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountRecovery;
