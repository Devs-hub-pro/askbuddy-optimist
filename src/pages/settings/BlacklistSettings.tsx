import React, { useState } from 'react';
import { Ban, UserRoundX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SubPageHeader from '@/components/layout/SubPageHeader';

const initialBlocked = [
  { id: '1', name: '安静的问友', reason: '减少无关打扰', blockedAt: '今天' },
  { id: '2', name: '深夜刷屏的人', reason: '频繁私信', blockedAt: '上周' },
];

const BlacklistSettings = () => {
  const { toast } = useToast();
  const [blockedUsers, setBlockedUsers] = useState(initialBlocked);

  return (
    <div className="min-h-screen bg-gray-50">
      <SubPageHeader title="黑名单管理" />

      <div className="space-y-5 p-5">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(236,251,247)]">
                <Ban size={18} className="text-[rgb(73,170,155)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">你屏蔽的用户</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  被加入黑名单的用户将无法继续给你发私信，也不会出现在推荐互动里。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {blockedUsers.length > 0 ? (
          <div className="space-y-3">
            {blockedUsers.map((user) => (
              <Card key={user.id} className="surface-card rounded-3xl border-none shadow-sm">
                <CardContent className="flex items-center justify-between gap-3 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                      <UserRoundX size={18} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {user.reason} · {user.blockedAt}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setBlockedUsers((prev) => prev.filter((item) => item.id !== user.id));
                      toast({ title: '已移出黑名单', description: `${user.name} 现在可以恢复互动。` });
                    }}
                  >
                    解除
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
            <UserRoundX size={56} className="mb-4 text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground">黑名单里还没有用户</p>
            <p className="mt-1 text-sm text-muted-foreground">如果你屏蔽了用户，后续会在这里统一管理。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlacklistSettings;
