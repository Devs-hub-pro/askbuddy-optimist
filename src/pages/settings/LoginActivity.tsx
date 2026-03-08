import React from 'react';
import { Laptop, Smartphone, MapPin, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SubPageHeader from '@/components/layout/SubPageHeader';

const sessions = [
  { id: 'current', device: '当前设备 · iPhone 17 Pro', location: '深圳', time: '刚刚', current: true, type: 'mobile' },
  { id: 'mac', device: 'MacBook Pro', location: '深圳', time: '今天 15:20', current: false, type: 'desktop' },
  { id: 'ipad', device: 'iPad', location: '广州', time: '昨天 21:08', current: false, type: 'mobile' },
];

const LoginActivity = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <SubPageHeader title="登录活动" />

      <div className="space-y-5 p-5">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="app-soft-surface-bg flex h-11 w-11 items-center justify-center rounded-2xl">
                <ShieldAlert size={18} className="app-accent-text" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">最近登录设备</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  如果发现陌生设备或异常地区登录，请及时修改密码并退出其他设备。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {sessions.map((session) => (
            <Card key={session.id} className="surface-card rounded-3xl border-none shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                      {session.type === 'desktop' ? (
                        <Laptop size={18} className="text-slate-600" />
                      ) : (
                        <Smartphone size={18} className="text-slate-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{session.device}</p>
                        {session.current ? (
                          <span className="app-soft-surface-bg app-accent-text rounded-full px-2 py-0.5 text-[11px] font-medium">
                            当前设备
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        <span>{session.location}</span>
                        <span>·</span>
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>
                  {!session.current ? (
                    <button
                      type="button"
                      className="text-xs font-medium text-destructive"
                      onClick={() =>
                        toast({
                          title: '设备管理功能待接入',
                          description: '下一步可继续接入“退出此设备”的真实能力。',
                        })
                      }
                    >
                      退出
                    </button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          className="h-12 w-full rounded-2xl border-white bg-white shadow-sm"
          onClick={() =>
            toast({
              title: '安全校验入口已预留',
              description: '后续可在这里接入更详细的登录风险提醒。',
            })
          }
        >
          检查账号安全
        </Button>
      </div>
    </div>
  );
};

export default LoginActivity;
