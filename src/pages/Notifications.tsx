import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import PageStateCard from '@/components/common/PageStateCard';
import { navigateBackOr } from '@/utils/navigation';

const typeIconMap: Record<string, string> = {
  new_answer: '💬',
  answer_accepted: '🎉',
  new_follower: '👤',
  new_like: '❤️',
  system: '📢',
};

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch {
      return '刚刚';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.related_type === 'question' && notification.related_id) {
      navigate(`/question/${notification.related_id}`);
    } else if (notification.related_type === 'user' && notification.related_id) {
      navigate(`/expert-profile/${notification.related_id}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center p-4">
        <PageStateCard
          variant="empty"
          title="登录后查看通知"
          description="互动提醒、系统通知和订单更新都会在这里显示。"
          actionLabel="去登录"
          onAction={() => navigate('/auth')}
        />
      </div>
    );
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-8">
      <div className="fixed left-1/2 top-0 z-[90] w-full max-w-md -translate-x-1/2 shadow-sm">
        <div className="bg-[rgb(121,213,199)] text-white" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center px-4 py-3">
            <button onClick={() => navigateBackOr(navigate, '/messages')} className="mr-3">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-base font-semibold flex-1">通知</h1>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                className="text-xs text-white hover:bg-white/15 hover:text-white"
              >
                <CheckCheck size={14} className="mr-1" />
                全部已读
              </Button>
            )}
          </div>
        </div>
        <div className="h-1 bg-[rgb(223,245,239)]" />
      </div>

      {isLoading ? (
        <div className="px-4 py-10" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 5.25rem)' }}>
          <PageStateCard variant="loading" title="正在加载通知…" compact />
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-3 px-4 py-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 5rem)' }}>
          <div className="surface-card rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">通知中心</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  这里会显示你的互动提醒、系统消息和订单更新。
                </p>
              </div>
              <span className="rounded-full bg-[rgb(236,251,247)] px-3 py-1 text-xs font-medium text-[rgb(73,170,155)]">
                {unreadCount > 0 ? `${unreadCount} 条未读` : '已读完'}
              </span>
            </div>
          </div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                "surface-card flex cursor-pointer items-start gap-3 rounded-3xl p-4 shadow-sm transition-colors hover:bg-gray-50",
                !notification.is_read && "border border-blue-100 bg-blue-50/40"
              )}
            >
              <div className="relative">
                {notification.sender_avatar ? (
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={notification.sender_avatar} />
                    <AvatarFallback>{(notification.sender_nickname || '系')[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    {typeIconMap[notification.type] || '📢'}
                  </div>
                )}
                {!notification.is_read && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-sm truncate">
                    {notification.title}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2 shrink-0">
                    {formatTime(notification.created_at)}
                  </span>
                </div>
                {notification.content && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-10" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 5.25rem)' }}>
          <PageStateCard
            variant="empty"
            title="还没有通知"
            description="新的互动、系统提醒和订单更新会出现在这里。"
            compact
          />
        </div>
      )}
    </div>
  );
};

export default Notifications;
