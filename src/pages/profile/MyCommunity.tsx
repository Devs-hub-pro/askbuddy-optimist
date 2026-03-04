
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Loader2, Search, MoreHorizontal, Plus, Radio, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useMyFollowing } from '@/hooks/useProfileData';
import SubPageHeader from '@/components/layout/SubPageHeader';
import { useToast } from '@/hooks/use-toast';

const MyCommunity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: following, isLoading } = useMyFollowing();
  const [search, setSearch] = useState('');

  const groups = useMemo(() => {
    const baseGroups = (following || []).slice(0, 6).map((item: any, index: number) => ({
      id: item.id,
      name: `${item.profile?.nickname || '问友'}交流群`,
      members: 80 + index * 37,
      preview: item.profile?.bio || '一起来交流经验、资源和最新动态。',
      topic: index % 2 === 0 ? '经验分享' : '资料互助',
      timeLabel: index === 0 ? '刚刚' : index < 3 ? '今天' : '昨天',
      unread: index === 0 ? 3 : index === 1 ? 1 : 0,
      avatarUrl: item.profile?.avatar_url || '',
    }));

    const fallbackGroups = [
      { id: 'product', name: '产品设计交流群', members: 128, preview: '分享设计工具、作品集和面试经验。', topic: '作品交流', timeLabel: '10:30', unread: 5, avatarUrl: '' },
      { id: 'frontend', name: '前端开发学习小组', members: 256, preview: '交流前端技术、项目实战和求职资源。', topic: '技术学习', timeLabel: '昨天', unread: 0, avatarUrl: '' },
      { id: 'career', name: '求职信息共享', members: 512, preview: '同步春招信息、内推机会和面经。', topic: '求职内推', timeLabel: '昨天', unread: 12, avatarUrl: '' },
    ];

    const merged = baseGroups.length > 0 ? baseGroups : fallbackGroups;
    return merged.filter((group) => group.name.toLowerCase().includes(search.toLowerCase()));
  }, [following, search]);

  const unreadCount = groups.reduce((total, group) => total + group.unread, 0);

  return (
    <div className="min-h-[100dvh] bg-muted pb-8">
      <SubPageHeader title="我的社群" />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="p-5 space-y-4 pb-28">
          <div className="surface-card rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">社群空间</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  在这里查看你加入的群组、最新讨论和未读消息，也可以发起自己的兴趣小组。
                </p>
              </div>
              <span className="rounded-full bg-app-surface px-3 py-1 text-xs font-medium text-app-accent">
                活跃中
              </span>
            </div>
          </div>
          <div className="surface-card rounded-3xl p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-app-surface px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground">我加入的群</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{groups.length}</p>
              </div>
              <div className="rounded-2xl bg-card px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground">未读消息</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{unreadCount}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索群组"
                  className="h-11 rounded-2xl border-slate-200 bg-white pl-9 shadow-sm focus:border-app-teal/30 focus-visible:ring-0"
                />
              </div>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-white shadow-sm">
                <MoreHorizontal size={18} className="text-slate-600" />
              </Button>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-white shadow-sm">
                <Radio size={18} className="text-slate-600" />
              </Button>
            </div>
          </div>

          {groups.length > 0 ? (
            <div className="space-y-3">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className="surface-card rounded-3xl border-none shadow-sm transition-all active:scale-[0.99]"
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => navigate(`/profile/community/${group.id}`, { state: { group } })}
                  >
                    <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-14 w-14 rounded-2xl">
                        <AvatarImage src={group.avatarUrl} />
                        <AvatarFallback className="rounded-2xl bg-app-header-light text-app-header">
                          {group.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-base font-semibold text-foreground">{group.name}</h3>
                              <span className="rounded-full bg-app-surface px-2 py-0.5 text-[11px] font-medium text-app-accent">
                                {group.topic}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{group.members}人 · 活跃讨论中</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {group.unread > 0 && (
                              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-medium text-white">
                                {group.unread > 99 ? '99+' : group.unread}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">{group.timeLabel}</span>
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{group.preview}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="inline-flex items-center text-xs text-muted-foreground">
                            <Sparkles size={12} className="mr-1 text-[rgb(73,170,155)]" />
                            查看群聊动态
                          </span>
                          <ChevronRight size={16} className="text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    </CardContent>
                  </button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-14 text-center shadow-sm">
              <Users size={56} className="mb-4 text-muted-foreground/30" />
              <p className="text-sm font-medium text-foreground">没有找到匹配的群组</p>
              <p className="mt-1 text-sm text-muted-foreground">可以试试其他关键词，或者创建自己的群组。</p>
            </div>
          )}

        </div>
      )}

      {!isLoading && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-20 mx-auto flex w-full max-w-md px-5">
          <div className="pointer-events-auto w-full">
            <Button
              className="h-12 w-full rounded-2xl text-base font-semibold shadow-sm"
              onClick={() =>
                toast({
                  title: '创建群组入口已就绪',
                  description: '下一步可以继续补群组创建、群名称设置和邀请成员流程。',
                })
              }
            >
              <Plus size={18} className="mr-2" />
              创建群组
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyCommunity;
