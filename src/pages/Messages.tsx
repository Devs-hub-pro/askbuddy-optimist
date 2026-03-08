import React, { useRef, useState } from 'react';
import { Search, MessageCircle, Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useConversations } from '@/hooks/useMessages';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useUnreadCount } from '@/hooks/useNotifications';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { demoConversations } from '@/lib/demoData';
import PageStateCard from '@/components/common/PageStateCard';
import { usePageScrollMemory } from '@/hooks/usePageScrollMemory';

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'chats' | 'notifications'>(() => {
    const cached = sessionStorage.getItem('tab:messages');
    return cached === 'notifications' ? 'notifications' : 'chats';
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Real data hooks
  const {
    data: conversations,
    isLoading: chatsLoading,
    error: chatsError,
    refetch: refetchConversations,
  } = useConversations();
  const {
    data: notifications,
    isLoading: notifsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useNotifications();
  const { data: unreadNotifCount } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  usePageScrollMemory('messages');

  React.useEffect(() => {
    sessionStorage.setItem('tab:messages', activeTab);
  }, [activeTab]);

  React.useEffect(() => {
    if (activeTab === 'notifications') {
      setSearchQuery('');
    }
  }, [activeTab]);

  // Format time
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch {
      return '刚刚';
    }
  };

  // Filter chats
  const allConversations = [...demoConversations, ...(conversations || [])].filter((item, index, arr) => (
    arr.findIndex((target) => target.partner_id === item.partner_id) === index
  ));

  const filteredChats = searchQuery
    ? allConversations.filter(c =>
        (c.partner_nickname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.last_message || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allConversations;

  // Group notifications by type
  const notifGroups = React.useMemo(() => {
    if (!notifications) return [];
    const keyword = searchQuery.trim().toLowerCase();
    const interactionItems: typeof notifications = [];
    const systemItems: typeof notifications = [];

    notifications.forEach(n => {
      if (keyword) {
        const bag = `${n.title || ''} ${n.content || ''}`.toLowerCase();
        if (!bag.includes(keyword)) return;
      }
      if (['new_answer', 'answer_accepted', 'new_follower'].includes(n.type)) {
        interactionItems.push(n);
      } else {
        systemItems.push(n);
      }
    });

    const result = [];
    const byUnreadAndTime = (a: any, b: any) => {
      if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    };

    if (interactionItems.length > 0) {
      interactionItems.sort(byUnreadAndTime);
      result.push({ type: 'interaction', title: '互动通知', tone: 'app-soft-surface-bg app-accent-text', items: interactionItems });
    }
    if (systemItems.length > 0) {
      systemItems.sort(byUnreadAndTime);
      result.push({ type: 'system', title: '系统通知', tone: 'bg-slate-100 text-slate-500', items: systemItems });
    }
    return result;
  }, [notifications, searchQuery]);

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
    <div className="min-h-[100dvh] bg-slate-50 pb-16">
      <div className="fixed left-1/2 top-0 z-[90] w-full max-w-md -translate-x-1/2 shadow-sm">
        <div className="app-header-bg" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="px-4 pb-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex space-x-7">
              <div
                className={`relative pb-2 cursor-pointer ${activeTab === 'chats' ? 'text-white font-medium' : 'text-white/75'}`}
                onClick={() => setActiveTab('chats')}
              >
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={17} />
                  <span className="text-base">私信</span>
                </div>
                {activeTab === 'chats' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
              </div>
              <div
                className={`relative pb-2 cursor-pointer ${activeTab === 'notifications' ? 'text-white font-medium' : 'text-white/75'}`}
                onClick={() => setActiveTab('notifications')}
              >
                <div className="flex items-center gap-1.5">
                  <Bell size={17} />
                  <span className="text-base">通知</span>
                </div>
                {(unreadNotifCount || 0) > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs rounded-full">
                    {(unreadNotifCount || 0) > 99 ? '99+' : unreadNotifCount}
                  </div>
                )}
                {activeTab === 'notifications' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
              </div>
              </div>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/25"
                onClick={() => {
                  const next = !showSearch;
                  setShowSearch(next);
                  if (next) window.setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                aria-label={activeTab === 'chats' ? '搜索会话' : '搜索通知'}
              >
                <Search size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
        <div className={`overflow-hidden border-t border-white/20 app-header-soft-bg transition-all duration-300 ${showSearch ? 'max-h-20' : 'max-h-0'}`}>
          <div className="p-3">
            <div className="flex items-center">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  className="h-11 w-full rounded-2xl bg-white pl-10 pr-4 text-base focus:outline-none"
                  placeholder={activeTab === 'chats' ? '搜索联系人或消息内容' : '搜索通知标题或内容'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="ml-3 text-sm text-slate-600"
                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="app-card-stack-gap space-y-4 px-4 py-4"
        style={{ paddingTop: showSearch ? 'calc(env(safe-area-inset-top) + 8.25rem)' : 'calc(env(safe-area-inset-top) + 4.75rem)' }}
      >
        {activeTab === 'chats' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-medium text-muted-foreground">最近会话</p>
              {filteredChats.length > 0 && (
                <p className="text-xs text-muted-foreground">{filteredChats.length} 个会话</p>
              )}
            </div>
              {chatsLoading && filteredChats.length === 0 ? (
                <div className="py-6">
                  <PageStateCard variant="loading" compact title="正在加载会话…" />
                </div>
              ) : chatsError ? (
                <div className="py-6">
                  <PageStateCard
                    compact
                    variant="error"
                    title="会话加载失败"
                    description={chatsError instanceof Error ? chatsError.message : '请检查网络后重试'}
                    actionLabel="重试"
                    onAction={() => refetchConversations()}
                  />
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="py-6">
                  <PageStateCard
                    compact
                    title={searchQuery ? `未找到与“${searchQuery}”相关的会话` : '暂无私信'}
                    description={!searchQuery ? '可以从专家详情页发起私信。' : undefined}
                  />
                </div>
              ) : (
                filteredChats.map(chat => (
                  <div
                    key={chat.partner_id}
                    className={cn(
                      "surface-card flex items-center rounded-3xl px-4 py-4 cursor-pointer transition-colors active:bg-muted/50",
                      chat.unread_count > 0 ? 'app-soft-border app-soft-muted-bg border' : ''
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
                      <div className="flex items-center justify-between">
                        <div className="truncate pr-3 font-medium text-foreground">{chat.partner_nickname || '用户'}</div>
                        <div className="shrink-0 text-xs text-muted-foreground">{chat.last_message_time ? formatTime(chat.last_message_time) : '刚刚'}</div>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground truncate">{chat.last_message || '暂无消息内容'}</div>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      {chat.unread_count > 0 && (
                        <div className="min-w-[20px] h-5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs rounded-full px-1.5">
                          {chat.unread_count > 9 ? '9+' : chat.unread_count}
                        </div>
                      )}
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifsLoading ? (
              <div className="py-4">
                <PageStateCard variant="loading" compact title="正在加载通知…" />
              </div>
            ) : notificationsError ? (
              <div className="py-4">
                <PageStateCard
                  compact
                  variant="error"
                  title="通知加载失败"
                  description={notificationsError instanceof Error ? notificationsError.message : '请检查网络后重试'}
                  actionLabel="重试"
                  onAction={() => refetchNotifications()}
                />
              </div>
            ) : notifGroups.length === 0 ? (
              <div className="py-4">
                <PageStateCard
                  compact
                  title="暂无通知"
                  description="互动提醒和系统消息会显示在这里。"
                  icon={<Bell size={40} className="mx-auto text-muted-foreground/30" />}
                />
              </div>
            ) : (
              notifGroups.map(group => (
                <div key={group.type} className="space-y-2">
                  <div className="px-1 text-xs font-medium text-muted-foreground">
                    <span>{group.title}</span>
                    {group.items.filter(n => !n.is_read).length > 0 && (
                      <span className="app-accent-text ml-2">
                        {group.items.filter(n => !n.is_read).length} 条未读
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {group.items.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "surface-card flex rounded-3xl px-4 py-4 cursor-pointer active:bg-muted/50",
                          !notification.is_read ? 'app-soft-border app-soft-muted-bg border' : ''
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className={cn("mr-3 flex h-10 w-10 items-center justify-center rounded-2xl", group.tone)}>
                          {group.type === 'interaction' ? <MessageCircle size={16} /> : <Bell size={16} />}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-foreground">{notification.title}</div>
                          <div className="mb-1 mt-1 text-sm text-muted-foreground">{notification.content}</div>
                          <div className="text-xs text-muted-foreground">{formatTime(notification.created_at)}</div>
                        </div>
                        {!notification.is_read && <div className="app-header-bg mt-2 h-2 w-2 rounded-full" />}
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
