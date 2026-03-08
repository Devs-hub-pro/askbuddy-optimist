import React, { useMemo, useState } from 'react';
import { Smartphone, ShieldCheck, MessageSquareText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import SubPageHeader from '@/components/layout/SubPageHeader';

const PhoneSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const currentBinding = useMemo(() => {
    if (user?.phone) {
      const raw = user.phone;
      if (raw.length >= 7) {
        return `${raw.slice(0, 3)}****${raw.slice(-4)}`;
      }
      return raw;
    }
    if (user?.email) return user.email;
    return '暂未绑定手机号';
  }, [user]);

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <SubPageHeader title="修改手机号" />

      <div className="space-y-5 p-5">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="app-soft-surface-bg flex h-11 w-11 items-center justify-center rounded-2xl">
                <Smartphone size={18} className="app-accent-text" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">当前绑定账号</p>
                <p className="mt-1 text-base font-semibold text-foreground">{currentBinding}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  修改手机号后，登录验证和安全通知都会同步到新号码。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">新手机号</p>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入新的手机号"
                inputMode="numeric"
                className="h-12 rounded-2xl border-0 bg-muted shadow-none"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">验证码</p>
                <button
                  type="button"
                  className="app-accent-text text-xs font-medium"
                  onClick={() =>
                    toast({
                      title: '验证码发送功能待接入',
                      description: '当前先完成页面结构，下一步可接真实短信验证。',
                    })
                  }
                >
                  获取验证码
                </button>
              </div>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="请输入 6 位验证码"
                inputMode="numeric"
                className="h-12 rounded-2xl border-0 bg-muted shadow-none"
              />
            </div>

            <Button
              className="h-12 w-full rounded-2xl text-base font-semibold shadow-sm"
              disabled={!phone.trim() || !code.trim()}
              onClick={() =>
                toast({
                  title: '手机号修改流程已准备好',
                  description: '下一步可继续接入短信校验与号码换绑逻辑。',
                })
              }
            >
              提交变更
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="app-accent-text" />
              <p className="text-sm font-semibold text-foreground">安全提醒</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              为了保护账号安全，修改手机号后建议重新确认登录设备，并及时更新常用联系人与接收通知方式。
            </p>
            <button
              type="button"
              className="app-accent-text inline-flex items-center text-sm font-medium"
            >
              <MessageSquareText size={14} className="mr-1.5" />
              查看账号安全建议
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhoneSettings;
