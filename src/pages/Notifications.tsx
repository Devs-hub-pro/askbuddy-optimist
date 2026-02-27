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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Bell className="w-12 h-12 text-muted-foreground mb-4 opacity-30" />
        <p className="text-muted-foreground mb-4">登录后查看通知</p>
        <Button onClick={() => navigate('/auth')}>去登录</Button>
      </div>
    );
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold flex-1">通知</h1>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="text-xs text-primary"
            >
              <CheckCheck size={14} className="mr-1" />
              全部已读
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                "flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                !notification.is_read && "bg-blue-50/50"
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
        <div className="flex flex-col items-center justify-center py-20">
          <Bell className="w-12 h-12 text-muted-foreground mb-4 opacity-30" />
          <p className="text-muted-foreground">暂无通知</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
