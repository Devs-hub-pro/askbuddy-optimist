import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Users, MessageCircleMore, FileText, ShieldCheck, AtSign, VolumeX, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SubPageHeader from '@/components/layout/SubPageHeader';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { navigateBackOr } from '@/utils/navigation';

interface CommunityGroupState {
  id: string;
  name: string;
  members: number;
  topic: string;
  timeLabel: string;
  unread: number;
  lastSender?: string;
  lastMessage?: string;
  mentionCount?: number;
  role?: 'owner' | 'admin' | 'member';
  muted?: boolean;
}

const CommunityGroupDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const group = (location.state as { group?: CommunityGroupState } | null)?.group;
  const [mute, setMute] = useState(Boolean(group?.muted));

  useEffect(() => {
    if (!group) {
      navigateBackOr(navigate, '/profile/community', { location });
    }
  }, [group, location, navigate]);

  if (!group) return null;

  const roleLabel = group.role === 'owner' ? '群主' : group.role === 'admin' ? '管理员' : '群成员';
  const mentionCount = group.mentionCount || 0;

  const feed = useMemo(
    () => [
      { id: '1', author: '群主', content: `欢迎来到 ${group.name}，新成员先看置顶公告和资料区。`, time: '刚刚' },
      { id: '2', author: group.lastSender || '讨论区', content: group.lastMessage || '群内正在讨论最新问题与经验。', time: group.timeLabel },
      { id: '3', author: '文件区', content: '本周精选资料与热门问题已整理，欢迎补充。', time: '今天' },
      { id: '4', author: '系统提醒', content: '你已开启群内关键词通知：留学、简历、实习。', time: '今天' },
    ],
    [group.lastMessage, group.lastSender, group.name, group.timeLabel]
  );

  return (
    <div className="min-h-[100dvh] bg-muted pb-8">
      <SubPageHeader
        title={group.name}
        onBack={() => navigateBackOr(navigate, `/profile/community/${group.id}`, { location })}
      />

      <div className="p-5 space-y-5">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">群组概览</p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">{group.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{group.members} 人 · {group.topic} · {roleLabel}</p>
              </div>
              <span className="app-soft-surface-bg app-accent-text rounded-full px-3 py-1 text-xs font-medium">
                活跃中
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-muted px-3 py-3">
                <Users size={16} className="app-accent-text mx-auto" />
                <p className="mt-2 text-xs text-muted-foreground">成员</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{group.members}</p>
              </div>
              <div className="rounded-2xl bg-muted px-3 py-3">
                <MessageCircleMore size={16} className="app-accent-text mx-auto" />
                <p className="mt-2 text-xs text-muted-foreground">未读</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{group.unread}</p>
              </div>
              <div className="rounded-2xl bg-muted px-3 py-3">
                <AtSign size={16} className="app-accent-text mx-auto" />
                <p className="mt-2 text-xs text-muted-foreground">@我</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{mentionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="grid grid-cols-3 gap-3 p-4">
            <button className="rounded-2xl bg-muted px-3 py-3 text-xs font-medium text-foreground">
              <Bell size={14} className="app-accent-text mx-auto mb-1" />
              群公告
            </button>
            <button className="rounded-2xl bg-muted px-3 py-3 text-xs font-medium text-foreground">
              <FileText size={14} className="app-accent-text mx-auto mb-1" />
              群文件
            </button>
            <button className="rounded-2xl bg-muted px-3 py-3 text-xs font-medium text-foreground">
              <Users size={14} className="app-accent-text mx-auto mb-1" />
              群成员
            </button>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">最近会话</h3>
              <span className="text-xs text-muted-foreground">按时间排序</span>
            </div>
            <div className="space-y-4">
              {feed.map((item, index) => (
                <div key={item.id} className={index < feed.length - 1 ? 'border-b border-border pb-4' : ''}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{item.author}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">群公告</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">新人进群建议先查看资料区和最新置顶消息。</p>
              </div>
              <ShieldCheck size={18} className="app-accent-text" />
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VolumeX size={16} className="app-accent-text" />
                <p className="text-sm font-medium text-foreground">消息免打扰</p>
              </div>
              <Switch checked={mute} onCheckedChange={setMute} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">开启后仅保留 @我 和群公告提醒。</p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 px-3.5 py-3 text-left"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-rose-600">
                    <LogOut size={15} />
                    退出群聊
                  </span>
                  <span className="text-xs text-rose-500">谨慎操作</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[88%] max-w-sm rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>确认退出群聊？</AlertDialogTitle>
                  <AlertDialogDescription>
                    退出后你将不再接收该群消息，后续可通过邀请重新加入。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">取消</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-full bg-rose-500 hover:bg-rose-600"
                    onClick={() => {
                      toast({
                        title: '已退出群聊（演示）',
                        description: '后续可接真实退出群组接口与成员状态同步。',
                      });
                      navigate('/profile/community', { replace: true });
                    }}
                  >
                    确认退出
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default CommunityGroupDetail;
