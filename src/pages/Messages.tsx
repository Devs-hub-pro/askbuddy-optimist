import React, { useState, useRef } from 'react';
import { ArrowLeft, Search, Settings, Check, Pin, Archive, Trash2, MessageCircle, Bell } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Messages = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'chats' | 'notifications'>('chats');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const [contextMenuData, setContextMenuData] = useState<{
    id: string;
    type: 'chat' | 'notification';
    isPinned?: boolean;
    isUnread?: boolean;
    isRead?: boolean;
  } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'chat' | 'notification' } | null>(null);

  const [pinnedChats, setPinnedChats] = useState([
    {
      id: 'chat-001',
      name: '李教授',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      lastMessage: '下周三有空来讨论一下项目进展吗？',
      lastMessageType: 'text',
      lastMessageTime: '昨天',
      unreadCount: 2,
      unread: true,
      online: true,
      pinned: true,
      swipeOffset: 0
    }
  ]);

  const [regularChats, setRegularChats] = useState([
    {
      id: 'chat-002',
      name: '王医生',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      lastMessage: '需要您提供更多的症状描述，方便我更准确地给您建议',
      lastMessageType: 'text',
      lastMessageTime: '上午 10:23',
      unreadCount: 1,
      unread: true,
      online: false,
      pinned: false,
      swipeOffset: 0
    },
    {
      id: 'chat-003',
      name: '陈律师',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      lastMessage: '已经帮您审核了合同，有几处需要注意的地方',
      lastMessageType: 'text',
      lastMessageTime: '周一',
      unreadCount: 0,
      unread: false,
      online: true,
      pinned: false,
      swipeOffset: 0
    },
    {
      id: 'chat-004',
      name: '赵老师',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
      lastMessage: '请查看我发送的课程安排',
      lastMessageType: 'image',
      lastMessageTime: '周日',
      unreadCount: 0,
      unread: false,
      online: false,
      pinned: false,
      swipeOffset: 0
    }
  ]);

  const [transactionNotifications, setTransactionNotifications] = useState([
    {
      id: 'notif-001',
      title: '订单已完成',
      message: '您与王医生的咨询订单已完成，请及时评价',
      time: '今天 14:30',
      type: 'transaction',
      read: false
    }
  ]);

  const [activityNotifications, setActivityNotifications] = useState([
    {
      id: 'notif-002',
      title: '限时活动',
      message: '双11优惠：所有专家咨询享8折优惠，立即查看',
      time: '昨天',
      type: 'activity',
      read: true
    }
  ]);

  const [interactionNotifications, setInteractionNotifications] = useState([
    {
      id: 'notif-003',
      title: '新回答',
      message: '李教授回答了您的问题"如何提高英语口语水平？"',
      time: '昨天',
      type: 'interaction',
      read: false
    }
  ]);

  const [systemNotifications, setSystemNotifications] = useState([
    {
      id: 'notif-005',
      title: '系统更新',
      message: '找人问问小程序已更新至v2.1.0，新增语音识别功能',
      time: '1周前',
      type: 'system',
      read: true
    }
  ]);

  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const activeSwipeItemId = useRef<string | null>(null);

  const unreadNotifications = 
    transactionNotifications.filter(n => !n.read).length +
    activityNotifications.filter(n => !n.read).length +
    interactionNotifications.filter(n => !n.read).length +
    systemNotifications.filter(n => !n.read).length;

  const filteredChats = searchQuery 
    ? regularChats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    : regularChats;

  const handleContextMenu = (e: React.MouseEvent, data: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenuPosition({
      top: e.clientY,
      left: e.clientX
    });
    
    setContextMenuData(data);
    setShowContextMenu(true);
  };

  const closeContextMenu = () => {
    setShowContextMenu(false);
    setContextMenuData(null);
  };

  const pinChat = (id: string) => {
    const chatToPin = regularChats.find(chat => chat.id === id);
    if (chatToPin) {
      const updatedChat = { ...chatToPin, pinned: true, swipeOffset: 0 };
      setPinnedChats([...pinnedChats, updatedChat]);
      setRegularChats(regularChats.filter(chat => chat.id !== id));
      toast({
        title: "已置顶会话",
        description: `已将与 ${updatedChat.name} 的会话置顶`,
      });
    }
    closeContextMenu();
  };

  const unpinChat = (id: string) => {
    const chatToUnpin = pinnedChats.find(chat => chat.id === id);
    if (chatToUnpin) {
      const updatedChat = { ...chatToUnpin, pinned: false };
      setRegularChats([updatedChat, ...regularChats]);
      setPinnedChats(pinnedChats.filter(chat => chat.id !== id));
      toast({
        title: "已取消置顶",
        description: `已取消与 ${updatedChat.name} 的会话置顶`,
      });
    }
    closeContextMenu();
  };

  const markChatAsRead = (id: string) => {
    const updateChats = (chats: any[]) => 
      chats.map(chat => 
        chat.id === id ? { ...chat, unread: false, unreadCount: 0 } : chat
      );
    
    setPinnedChats(updateChats(pinnedChats));
    setRegularChats(updateChats(regularChats));
    closeContextMenu();
  };

  const markChatAsUnread = (id: string) => {
    const updateChats = (chats: any[]) => 
      chats.map(chat => 
        chat.id === id ? { ...chat, unread: true, unreadCount: 1 } : chat
      );
    
    setPinnedChats(updateChats(pinnedChats));
    setRegularChats(updateChats(regularChats));
    closeContextMenu();
  };

  const archiveChat = (id: string) => {
    const chatToArchive = [...pinnedChats, ...regularChats].find(chat => chat.id === id);
    setPinnedChats(pinnedChats.filter(chat => chat.id !== id));
    setRegularChats(regularChats.filter(chat => chat.id !== id));
    
    toast({
      title: "会话已归档",
      description: chatToArchive ? `已归档与 ${chatToArchive.name} 的会话` : "会话已归档",
    });
    closeContextMenu();
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    const { id, type } = itemToDelete;
    
    if (type === 'chat') {
      setPinnedChats(pinnedChats.filter(chat => chat.id !== id));
      setRegularChats(regularChats.filter(chat => chat.id !== id));
      toast({
        title: "会话已删除",
        description: "会话已被永久删除",
      });
    } else if (type === 'notification') {
      if (id.startsWith('notif-00')) {
        setTransactionNotifications(transactionNotifications.filter(n => n.id !== id));
      } else if (id.startsWith('notif-0')) {
        setActivityNotifications(activityNotifications.filter(n => n.id !== id));
      } else if (id.startsWith('notif-')) {
        setInteractionNotifications(interactionNotifications.filter(n => n.id !== id));
        setSystemNotifications(systemNotifications.filter(n => n.id !== id));
      }
      
      toast({
        title: "通知已删除",
        description: "通知已被删除",
      });
    }
    
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const showDeleteConfirmation = (id: string, type: 'chat' | 'notification') => {
    setItemToDelete({ id, type });
    setShowDeleteConfirm(true);
    closeContextMenu();
  };

  const markNotificationAsRead = (id: string) => {
    const updateNotifications = (notifications: any[]) => 
      notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      );
    
    setTransactionNotifications(updateNotifications(transactionNotifications));
    setActivityNotifications(updateNotifications(activityNotifications));
    setInteractionNotifications(updateNotifications(interactionNotifications));
    setSystemNotifications(updateNotifications(systemNotifications));
    closeContextMenu();
  };

  const markNotificationAsUnread = (id: string) => {
    const updateNotifications = (notifications: any[]) => 
      notifications.map(notif => 
        notif.id === id ? { ...notif, read: false } : notif
      );
    
    setTransactionNotifications(updateNotifications(transactionNotifications));
    setActivityNotifications(updateNotifications(activityNotifications));
    setInteractionNotifications(updateNotifications(interactionNotifications));
    setSystemNotifications(updateNotifications(systemNotifications));
    closeContextMenu();
  };

  const markAllNotificationsAsRead = () => {
    const markAllRead = (notifications: any[]) => 
      notifications.map(notif => ({ ...notif, read: true }));
    
    setTransactionNotifications(markAllRead(transactionNotifications));
    setActivityNotifications(markAllRead(activityNotifications));
    setInteractionNotifications(markAllRead(interactionNotifications));
    setSystemNotifications(markAllRead(systemNotifications));
    
    toast({
      title: "全部已读",
      description: "所有通知已标记为已读",
    });
  };

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    activeSwipeItemId.current = id;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!activeSwipeItemId.current) return;
    
    const touchMoveX = e.touches[0].clientX;
    const moveDistance = touchStartX.current - touchMoveX;
    
    if (moveDistance > 0) {
      const maxSwipe = 160;
      const swipeOffset = Math.min(moveDistance, maxSwipe);
      
      setRegularChats(regularChats.map(chat => 
        chat.id === activeSwipeItemId.current
          ? { ...chat, swipeOffset }
          : chat
      ));
    }
  };

  const handleTouchEnd = () => {
    if (!activeSwipeItemId.current) return;
    
    const chat = regularChats.find(c => c.id === activeSwipeItemId.current);
    if (!chat) return;
    
    const touchEndTime = Date.now();
    const timeDiff = touchEndTime - touchStartTime.current;
    
    if (chat.swipeOffset > 80 || (chat.swipeOffset > 20 && timeDiff < 200)) {
      setRegularChats(regularChats.map(c => 
        c.id === activeSwipeItemId.current
          ? { ...c, swipeOffset: 160 }
          : c
      ));
    } else {
      setRegularChats(regularChats.map(c => 
        c.id === activeSwipeItemId.current
          ? { ...c, swipeOffset: 0 }
          : c
      ));
    }
    
    activeSwipeItemId.current = null;
  };

  const handleChatClick = (id: string) => {
    console.log(`Navigate to chat ${id}`);
    markChatAsRead(id);
  };

  const handleNotificationClick = (notification: any) => {
    console.log(`Open notification ${notification.id} of type ${notification.type}`);
    markNotificationAsRead(notification.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <div className="pt-12 pb-2">
          <div className="flex justify-between items-center px-4">
            <div className="flex space-x-6">
              <div 
                className={`relative pb-2 cursor-pointer ${activeTab === 'chats' ? 'text-app-teal font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveTab('chats')}
              >
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={18} />
                  <span className="text-lg">私信</span>
                </div>
                {activeTab === 'chats' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-app-teal rounded-full"></div>
                )}
              </div>
              
              <div 
                className={`relative pb-2 cursor-pointer ${activeTab === 'notifications' ? 'text-app-teal font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveTab('notifications')}
              >
                <div className="flex items-center gap-1.5">
                  <Bell size={18} />
                  <span className="text-lg">通知</span>
                </div>
                {unreadNotifications > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </div>
                )}
                {activeTab === 'notifications' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-app-teal rounded-full"></div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search size={20} className="text-gray-600" />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        <div className={`overflow-hidden transition-all duration-300 ${showSearch ? 'max-h-16' : 'max-h-0'}`}>
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  className="w-full bg-gray-100 h-10 pl-10 pr-4 rounded-lg text-sm focus:outline-none"
                  placeholder="搜索联系人或消息内容"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className="ml-3 text-app-teal text-sm"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`pt-${showSearch ? '32' : '20'}`}>
        {activeTab === 'chats' && (
          <div className="px-0">
            {pinnedChats.length > 0 && (
              <>
                <div className="p-2 px-4 text-xs text-gray-500 bg-gray-50 flex items-center">
                  <Pin size={12} className="mr-1" />
                  <span>置顶会话</span>
                </div>
                <div className="bg-white">
                  {pinnedChats.map(chat => (
                    <div 
                      key={chat.id} 
                      className={`flex items-center p-4 border-b border-gray-100 ${chat.unread ? 'bg-blue-50/30' : ''}`}
                      onClick={() => handleChatClick(chat.id)}
                      onContextMenu={(e) => handleContextMenu(e, {
                        id: chat.id,
                        type: 'chat',
                        isPinned: true,
                        isUnread: chat.unreadCount > 0
                      })}
                    >
                      <div className="relative mr-3">
                        <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                        {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div className="font-medium text-gray-900">{chat.name}</div>
                          <div className="text-xs text-gray-500">{chat.lastMessageTime}</div>
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {chat.lastMessageType !== 'text' && (
                            <span className="text-blue-500 mr-1">
                              [{chat.lastMessageType === 'image' ? '图片' : 
                                chat.lastMessageType === 'voice' ? '语音' : 
                                chat.lastMessageType === 'file' ? '文件' : '消息'}]
                            </span>
                          )}
                          {chat.lastMessage}
                        </div>
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="ml-2 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1.5">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </div>
                      )}
                      <div className="ml-1 text-gray-400">
                        <Pin size={16} className="text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="p-2 px-4 text-xs text-gray-500 bg-gray-50">最近会话</div>
            <div className="bg-white">
              {filteredChats.length === 0 && searchQuery && (
                <div className="py-8 text-center text-gray-500">
                  未找到与 "{searchQuery}" 相关的会话
                </div>
              )}
              
              {filteredChats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`flex items-center p-4 border-b border-gray-100 ${chat.unread ? 'bg-blue-50/30' : ''} relative`}
                  onClick={() => handleChatClick(chat.id)}
                  onContextMenu={(e) => handleContextMenu(e, {
                    id: chat.id,
                    type: 'chat',
                    isPinned: false,
                    isUnread: chat.unreadCount > 0
                  })}
                  onTouchStart={(e) => handleTouchStart(e, chat.id)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="relative mr-3">
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                    {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div className="font-medium text-gray-900">{chat.name}</div>
                      <div className="text-xs text-gray-500">{chat.lastMessageTime}</div>
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {chat.lastMessageType !== 'text' && (
                        <span className="text-blue-500 mr-1">
                          [{chat.lastMessageType === 'image' ? '图片' : 
                            chat.lastMessageType === 'voice' ? '语音' : 
                            chat.lastMessageType === 'file' ? '文件' : '消息'}]
                        </span>
                      )}
                      {chat.lastMessage}
                    </div>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="ml-2 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1.5">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </div>
                  )}
                  
                  <div 
                    className="absolute top-0 right-0 bottom-0 flex items-center transform transition-transform"
                    style={{ 
                      transform: `translateX(${chat.swipeOffset > 0 ? 0 : 100}%)`,
                      width: '160px', 
                      right: `-160px` 
                    }}
                  >
                    <div 
                      className="h-full w-[80px] bg-blue-500 flex items-center justify-center text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        archiveChat(chat.id);
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <Archive size={20} />
                        <span className="text-xs mt-1">归档</span>
                      </div>
                    </div>
                    <div 
                      className="h-full w-[80px] bg-red-500 flex items-center justify-center text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        showDeleteConfirmation(chat.id, 'chat');
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <Trash2 size={20} />
                        <span className="text-xs mt-1">删除</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="px-0">
            <div className="p-3 px-4 flex justify-end bg-white border-b border-gray-100">
              <button 
                className="text-app-teal text-sm flex items-center gap-1"
                onClick={markAllNotificationsAsRead}
              >
                <Check size={14} className="text-app-teal" />
                <span>全部标为已读</span>
              </button>
            </div>
            
            {transactionNotifications.length === 0 && 
             activityNotifications.length === 0 &&
             interactionNotifications.length === 0 &&
             systemNotifications.length === 0 && (
              <div className="py-20 text-center">
                <div className="flex justify-center mb-4">
                  <Bell size={48} className="text-gray-300" />
                </div>
                <div className="text-gray-500">暂无通知</div>
              </div>
            )}
            
            {transactionNotifications.length > 0 && (
              <>
                <div className="p-2 px-4 text-xs text-gray-500 bg-gray-50">交易通知</div>
                <div className="bg-white">
                  {transactionNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`flex p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                      onContextMenu={(e) => handleContextMenu(e, {
                        id: notification.id,
                        type: 'notification',
                        isRead: notification.read
                      })}
                    >
                      <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mr-3">
                        <span className="text-yellow-600">💰</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{notification.title}</div>
                        <div className="text-sm text-gray-600 mb-1">{notification.message}</div>
                        <div className="text-xs text-gray-500">{notification.time}</div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-app-teal rounded-full mt-2"></div>}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {activityNotifications.length > 0 && (
              <>
                <div className="p-2 px-4 text-xs text-gray-500 bg-gray-50">活动通知</div>
                <div className="bg-white">
                  {activityNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`flex p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                      onContextMenu={(e) => handleContextMenu(e, {
                        id: notification.id,
                        type: 'notification',
                        isRead: notification.read
                      })}
                    >
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                        <span className="text-green-600">🎉</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{notification.title}</div>
                        <div className="text-sm text-gray-600 mb-1">{notification.message}</div>
                        <div className="text-xs text-gray-500">{notification.time}</div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-app-teal rounded-full mt-2"></div>}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {interactionNotifications.length > 0 && (
              <>
                <div className="p-2 px-4 text-xs text-gray-500 bg-gray-50">互动通知</div>
                <div className="bg-white">
                  {interactionNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`flex p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                      onContextMenu={(e) => handleContextMenu(e, {
                        id: notification.id,
                        type: 'notification',
                        isRead: notification.read
                      })}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <span className="text-blue-600">💬</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{notification.title}</div>
                        <div className="text-sm text-gray-600 mb-1">{notification.message}</div>
                        <div className="text-xs text-gray-500">{notification.time}</div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-app-teal rounded-full mt-2"></div>}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {systemNotifications.length > 0 && (
              <>
                <div className="p-2 px-4 text-xs text-gray-500 bg-gray-50">系统公告</div>
                <div className="bg-white">
                  {systemNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`flex p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                      onContextMenu={(e) => handleContextMenu(e, {
                        id: notification.id,
                        type: 'notification',
                        isRead: notification.read
                      })}
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                        <span className="text-purple-600">🔔</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{notification.title}</div>
                        <div className="text-sm text-gray-600 mb-1">{notification.message}</div>
                        <div className="text-xs text-gray-500">{notification.time}</div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-app-teal rounded-full mt-2"></div>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {showContextMenu && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-10"
          onClick={closeContextMenu}
        >
          <div 
            className="absolute z-50 bg-white rounded-md shadow-lg overflow-hidden"
            style={{
              top: `${contextMenuPosition.top}px`,
              left: `${contextMenuPosition.left}px`,
              transform: 'translate(-50%, -50%)',
              minWidth: '140px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {contextMenuData?.type === 'chat' && (
              <>
                {contextMenuData.isPinned ? (
                  <div 
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => unpinChat(contextMenuData.id)}
                  >
                    <Pin size={16} className="mr-2" />
                    <span>取消置顶</span>
                  </div>
                ) : (
                  <div 
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => pinChat(contextMenuData.id)}
                  >
                    <Pin size={16} className="mr-2" />
                    <span>置顶会话</span>
                  </div>
                )}
                
                {contextMenuData.isUnread ? (
                  <div 
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => markChatAsRead(contextMenuData.id)}
                  >
                    <Check size={16} className="mr-2" />
                    <span>标为已读</span>
                  </div>
                ) : (
                  <div 
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => markChatAsUnread(contextMenuData.id)}
                  >
                    <div className="w-4 h-4 mr-2 rounded-full border-2 border-gray-500"></div>
                    <span>标为未读</span>
                  </div>
                )}
                
                <div 
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => archiveChat(contextMenuData.id)}
                >
                  <Archive size={16} className="mr-2" />
                  <span>归档会话</span>
                </div>
              </>
            )}
            
            {contextMenuData?.type === 'notification' && (
              <>
                {contextMenuData.isRead ? (
                  <div 
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => markNotificationAsUnread(contextMenuData.id)}
                  >
                    <div className="w-4 h-4 mr-2 rounded-full border-2 border-gray-500"></div>
                    <span>标为未读</span>
                  </div>
                ) : (
                  <div 
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => markNotificationAsRead(contextMenuData.id)}
                  >
                    <Check size={16} className="mr-2" />
                    <span>标为已读</span>
                  </div>
                )}
              </>
            )}
            
            <div 
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-red-500"
              onClick={() => showDeleteConfirmation(contextMenuData.id, contextMenuData.type)}
            >
              <Trash2 size={16} className="mr-2" />
              <span>删除</span>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[85%] max-w-xs overflow-hidden">
            <div className="p-5 text-center">
              <h3 className="font-medium text-lg mb-2">确认删除</h3>
              <p className="text-gray-600 text-sm">
                删除后将无法恢复，确认删除吗？
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button 
                className="flex-1 p-3 text-gray-500 text-center"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
              >
                取消
              </button>
              <button 
                className="flex-1 p-3 text-red-500 text-center font-medium border-l border-gray-100"
                onClick={confirmDelete}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
};

export default Messages;
