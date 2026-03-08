import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Users, Pin, MessageCircleMore, Image as ImageIcon, FileText, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SubPageHeader from '@/components/layout/SubPageHeader';

const CommunityGroupDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const group = (location.state as any)?.group;

  useEffect(() => {
    if (!group) {
      navigate('/profile/community', { replace: true });
    }
  }, [group, navigate]);

  if (!group) return null;

  const feed = [
    { id: '1', author: '群主', content: `${group.name} 欢迎新成员，记得先看置顶资料。`, time: '刚刚' },
    { id: '2', author: '讨论区', content: group.preview, time: group.timeLabel },
    { id: '3', author: '文件区', content: '本周精选资料与热门问题已整理，欢迎补充。', time: '今天' },
  ];

  return (
    <div className="min-h-[100dvh] bg-muted pb-8">
      <SubPageHeader title={group.name} />

      <div className="p-5 space-y-5">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">群组概览</p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">{group.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{group.members} 人 · {group.topic}</p>
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
                <Bell size={16} className="app-accent-text mx-auto" />
                <p className="mt-2 text-xs text-muted-foreground">状态</p>
                <p className="mt-1 text-sm font-semibold text-foreground">正常</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">群内动态</h3>
              <span className="text-xs text-muted-foreground">最近更新</span>
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
          <CardContent className="grid grid-cols-3 gap-3 p-4">
            <button className="rounded-2xl bg-muted px-3 py-3 text-xs font-medium text-foreground">
              <Bell size={14} className="app-accent-text mx-auto mb-1" />
              置顶公告
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
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-20 mx-auto flex w-full max-w-md px-5">
        <div className="pointer-events-auto grid w-full grid-cols-2 gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-white bg-white/90 shadow-sm">
            <ImageIcon size={18} className="mr-2" />
            发图片
          </Button>
          <Button className="h-12 rounded-2xl shadow-sm">
            <Pin size={18} className="mr-2" />
            发起话题
          </Button>
        </div>
      </div>

    </div>
  );
};

export default CommunityGroupDetail;
