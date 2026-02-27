import React, { useState } from 'react';
import { Search, Settings, Check, Pin, Trash2, MessageCircle, Bell, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useConversations, useDeleteMessage } from '@/hooks/useMessages';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useUnreadCount } from '@/hooks/useNotifications';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'chats' | 'notifications'>('chats');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Real data hooks
  const { data: conversations, isLoading: chatsLoading } = useConversations();
  const { data: notifications, isLoading: notifsLoading } = useNotifications();
  const { data: unreadNotifCount } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  // Format time
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch {
      return '刚刚';
    }
  };

  // Filter chats
  const filteredChats = searchQuery && conversations
    ? conversations.filter(c =>
        (c.partner_nickname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.last_message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations || [];

  // Group notifications by type
  const notifGroups = React.useMemo(() => {
    if (!notifications) return [];
    const groups: Record<string, { title: string; icon: string; iconBg: string; items: typeof notifications }> = {
      new_answer: { title: '互动通知', icon: '💬', iconBg: 'bg-blue-50', items: [] },
      answer_accepted: { title: '互动通知', icon: '💬', iconBg: 'bg-blue-50', items: [] },
      new_follower: { title: '互动通知', icon: '👤', iconBg: 'bg-blue-50', items: [] },
    };
    const interactionItems: typeof notifications = [];
    const systemItems: typeof notifications = [];

    notifications.forEach(n => {
      if (['new_answer', 'answer_accepted', 'new_follower'].includes(n.type)) {
        interactionItems.push(n);
      } else {
        systemItems.push(n);
      }
    });

    const result = [];
    if (interactionItems.length > 0) {
      result.push({ type: 'interaction', title: '互动通知', icon: '💬', iconBg: 'bg-blue-50', items: interactionItems });
    }
    if (systemItems.length > 0) {
      result.push({ type: 'system', title: '系统通知', icon: '🔔', iconBg: 'bg-purple-50', items: systemItems });
    }
    return result;
  }, [notifications]);

  const handleChatClick = (partnerId: string) => {
    navigate(`/chat/${partnerId}`);
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.related_type === 'question' && notification.related_id) {
      navigate(`/question/${notification.related_id}`);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate(undefined, {
      onSuccess: () => {
        toast({ title: '全部已读', description: '所有通知已标记为已读' });
      },
    });
  };

  return (
    <div className="min-h-[100dvh] bg-muted pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="pt-2 pb-2">
          <div className="flex justify-between items-center px-4">
            <div className="flex space-x-8">
              <div
                className={`relative pb-2 cursor-pointer ${activeTab === 'chats' ? 'text-primary-foreground font-medium' : 'text-primary-foreground/70'}`}
                onClick={() => setActiveTab('chats')}
              >
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={18} />
                  <span className="text-lg">私信</span>
                </div>
                {activeTab === 'chats' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground rounded-full" />}
              </div>
              <div
                className={`relative pb-2 cursor-pointer ${activeTab === 'notifications' ? 'text-primary-foreground font-medium' : 'text-primary-foreground/70'}`}
                onClick={() => setActiveTab('notifications')}
              >
                <div className="flex items-center gap-1.5">
                  <Bell size={18} />
                  <span className="text-lg">通知</span>
                </div>
                {(unreadNotifCount || 0) > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs rounded-full">
                    {(unreadNotifCount || 0) > 99 ? '99+' : unreadNotifCount}
                  </div>
                )}
                {activeTab === 'notifications' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground rounded-full" />}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-primary-foreground/10"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search size={20} className="text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className={`overflow-hidden transition-all duration-300 ${showSearch ? 'max-h-16' : 'max-h-0'}`}>
          <div className="p-3 bg-background border-t border-border">
            <div className="flex items-center">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full bg-muted h-10 pl-10 pr-4 rounded-lg text-sm focus:outline-none"
                  placeholder="搜索联系人或消息内容"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="ml-3 text-primary text-sm"
                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Chats tab */}
        {activeTab === 'chats' && (
          <div>
            <div className="p-2 px-4 text-xs text-muted-foreground bg-muted">
              最近会话
            </div>
            <div className="bg-background">
              {chatsLoading ? (
                <div className="py-16 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-muted-foreground mb-2">
                    {searchQuery ? `未找到与 "${searchQuery}" 相关的会话` : '暂无私信'}
                  </div>
                  {!searchQuery && (
                    <p className="text-sm text-muted-foreground">通过专家详情页发起私信</p>
                  )}
                </div>
              ) : (
                filteredChats.map(chat => (
                  <div
                    key={chat.partner_id}
                    className={cn(
                      "flex items-center p-4 border-b border-border cursor-pointer active:bg-muted/50",
                      chat.unread_count > 0 ? 'bg-primary/5' : ''
                    )}
                    onClick={() => handleChatClick(chat.partner_id)}
                  >
                    <div className="relative mr-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={chat.partner_avatar || undefined} alt={chat.partner_nickname || '用户'} />
                        <AvatarFallback>{(chat.partner_nickname || '用')[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div className="font-medium text-foreground">{chat.partner_nickname || '用户'}</div>
                        <div className="text-xs text-muted-foreground">{formatTime(chat.last_message_time)}</div>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{chat.last_message}</div>
                    </div>
                    {chat.unread_count > 0 && (
                      <div className="ml-2 min-w-[20px] h-5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs rounded-full px-1.5">
                        {chat.unread_count > 9 ? '9+' : chat.unread_count}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="p-3 px-4 flex justify-between items-center bg-background border-b border-border">
              <div className="text-xs text-muted-foreground">
                {(unreadNotifCount || 0) > 0 && `${unreadNotifCount} 条未读通知`}
              </div>
              <button
                className="text-sm text-primary flex items-center"
                onClick={handleMarkAllRead}
              >
                <Check size={14} className="mr-1" />
                全部已读
              </button>
            </div>

            {notifsLoading ? (
              <div className="py-16 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifGroups.length === 0 ? (
              <div className="py-20 text-center">
                <Bell size={48} className="text-muted-foreground/30 mx-auto mb-4" />
                <div className="text-muted-foreground">暂无通知</div>
              </div>
            ) : (
              notifGroups.map(group => (
                <div key={group.type} className="mb-2">
                  <div className="p-2 px-4 text-xs text-muted-foreground bg-muted flex items-center">
                    <span className="mr-1">{group.icon}</span>
                    <span>{group.title}</span>
                    {group.items.filter(n => !n.is_read).length > 0 && (
                      <span className="ml-2 text-primary">
                        {group.items.filter(n => !n.is_read).length} 条未读
                      </span>
                    )}
                  </div>
                  <div className="bg-background">
                    {group.items.map(notification => (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex p-4 border-b border-border cursor-pointer active:bg-muted/50",
                          !notification.is_read ? 'bg-primary/5' : ''
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-3", group.iconBg)}>
                          <span>{group.icon}</span>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-foreground">{notification.title}</div>
                          <div className="text-sm text-muted-foreground mb-1">{notification.content}</div>
                          <div className="text-xs text-muted-foreground">{formatTime(notification.created_at)}</div>
                        </div>
                        {!notification.is_read && <div className="w-2 h-2 bg-primary rounded-full mt-2" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Messages;
