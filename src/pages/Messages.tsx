
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Search, Settings, MoreVertical, Pin, Archive, Trash, Check, Bell, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BottomNav from '@/components/BottomNav';

// Mock data
const PINNED_CONVERSATIONS = [
  {
    id: '1',
    name: '李老师',
    avatar: '/placeholder.svg',
    lastMessage: '您好，关于您提出的问题，我有一些建议...',
    lastMessageTime: '09:45',
    unreadCount: 2,
    unread: true,
    online: true,
    pinned: true
  }
];

const CONVERSATIONS = [
  {
    id: '2',
    name: '王医生',
    avatar: '/placeholder.svg',
    lastMessage: '请问您的症状持续多久了？',
    lastMessageTime: '昨天',
    unreadCount: 0,
    unread: false,
    online: false,
    pinned: false
  },
  {
    id: '3',
    name: '张工程师',
    avatar: '/placeholder.svg',
    lastMessage: '[图片]',
    lastMessageTime: '星期二',
    unreadCount: 1,
    unread: true,
    online: true,
    pinned: false
  },
  {
    id: '4',
    name: '刘律师',
    avatar: '/placeholder.svg',
    lastMessage: '根据合同条款第三条...',
    lastMessageTime: '3天前',
    unreadCount: 0,
    unread: false,
    online: false,
    pinned: false
  }
];

const NOTIFICATIONS = [
  {
    id: '101',
    type: 'transaction',
    title: '订单已完成',
    message: '您与李老师的咨询已完成，请评价服务体验',
    time: '1小时前',
    read: false,
    icon: '🎯'
  },
  {
    id: '102',
    type: 'activity',
    title: '最新活动',
    message: '「初夏知识季」活动开始，特邀名师在线答疑',
    time: '3小时前',
    read: true,
    icon: '📢'
  },
  {
    id: '103',
    type: 'interaction',
    title: '回答获赞',
    message: '您的回答「关于JavaScript的闭包原理...」获得3人点赞',
    time: '昨天',
    read: false,
    icon: '💌'
  },
  {
    id: '104',
    type: 'system',
    title: '系统通知',
    message: '系统将于今晚22:00-23:00进行维护，请提前做好准备',
    time: '2天前',
    read: true,
    icon: '🔔'
  }
];

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chats');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [notificationCategory, setNotificationCategory] = useState('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [pinnedConversations, setPinnedConversations] = useState(PINNED_CONVERSATIONS);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<'conversation' | 'notification' | ''>('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Filter notifications based on category
  const filteredNotifications = notifications.filter(
    notification => notificationCategory === 'all' || notification.type === notificationCategory
  );

  // Hide context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContextMenu = (e: React.MouseEvent, item: any, type: 'conversation' | 'notification') => {
    e.preventDefault();
    setSelectedItem(item);
    setShowContextMenu(true);
    setContextMenuPosition({ 
      x: e.clientX, 
      y: e.clientY 
    });
  };

  const togglePinConversation = (conversation: any) => {
    if (conversation.pinned) {
      // Unpin
      setPinnedConversations(prev => prev.filter(c => c.id !== conversation.id));
      setConversations(prev => [...prev, {...conversation, pinned: false}]);
    } else {
      // Pin
      setConversations(prev => prev.filter(c => c.id !== conversation.id));
      setPinnedConversations(prev => [...prev, {...conversation, pinned: true}]);
    }
    setShowContextMenu(false);
  };

  const toggleReadStatus = (item: any, type: 'conversation' | 'notification') => {
    if (type === 'conversation') {
      const updateConversation = (list: typeof conversations) => 
        list.map(c => c.id === item.id ? {...c, unread: !c.unread, unreadCount: c.unread ? 0 : 1} : c);
      
      setPinnedConversations(updateConversation);
      setConversations(updateConversation);
    } else {
      setNotifications(prev => 
        prev.map(n => n.id === item.id ? {...n, read: !n.read} : n)
      );
    }
    setShowContextMenu(false);
  };

  const confirmDelete = () => {
    if (deleteType === 'conversation') {
      setPinnedConversations(prev => prev.filter(c => c.id !== selectedItem.id));
      setConversations(prev => prev.filter(c => c.id !== selectedItem.id));
    } else {
      setNotifications(prev => prev.filter(n => n.id !== selectedItem.id));
    }
    setShowDeleteDialog(false);
    setShowContextMenu(false);
  };

  const openDeleteDialog = (type: 'conversation' | 'notification') => {
    setDeleteType(type);
    setShowDeleteDialog(true);
    setShowContextMenu(false);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="font-medium text-lg flex items-center">消息</div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="flex items-center justify-center w-8 h-8 text-gray-600"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => navigate('/message-settings')}
              className="flex items-center justify-center w-8 h-8 text-gray-600"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
        
        {isSearchVisible && (
          <div className="mt-3 flex items-center transition-all duration-300">
            <Input 
              placeholder="搜索联系人或消息..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <button 
              onClick={() => {
                setIsSearchVisible(false);
                setSearchText('');
              }}
              className="ml-2 text-blue-500 text-sm"
            >
              取消
            </button>
          </div>
        )}
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-transparent border-b border-gray-100 p-0 h-12">
          <TabsTrigger 
            value="chats" 
            className="flex-1 h-full data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
          >
            私信
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex-1 h-full data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
          >
            通知
          </TabsTrigger>
        </TabsList>
        
        {/* Private Messages Tab */}
        <TabsContent value="chats" className="mt-0 pb-20">
          {pinnedConversations.length > 0 && (
            <div>
              <div className="text-sm text-gray-500 px-4 py-2">置顶会话</div>
              <div className="bg-white">
                {pinnedConversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className={`flex items-center p-4 border-b border-gray-100 relative ${conversation.unread ? 'bg-blue-50' : ''}`}
                    onClick={() => navigate(`/chat/${conversation.id}`)}
                    onContextMenu={(e) => handleContextMenu(e, conversation, 'conversation')}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{conversation.name}</span>
                        <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <Pin size={16} className="absolute top-4 right-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-500 px-4 py-2">最近会话</div>
          <div className="bg-white">
            {conversations.map(conversation => (
              <div 
                key={conversation.id}
                className={`flex items-center p-4 border-b border-gray-100 ${conversation.unread ? 'bg-blue-50' : ''}`}
                onClick={() => navigate(`/chat/${conversation.id}`)}
                onContextMenu={(e) => handleContextMenu(e, conversation, 'conversation')}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{conversation.name}</span>
                    <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {conversations.length === 0 && pinnedConversations.length === 0 && (
              <div className="py-16 flex flex-col items-center justify-center text-gray-500">
                <MessageSquare size={48} strokeWidth={1} className="text-gray-300 mb-4" />
                <p>暂无会话，开始新对话吧</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-0 pb-20">
          <div className="flex justify-end p-3">
            <button 
              className="text-sm text-blue-500"
              onClick={markAllNotificationsRead}
            >
              全部标为已读
            </button>
          </div>
          
          <div className="px-4 overflow-x-auto pb-3 flex space-x-2 scrollbar-hide">
            <button 
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                notificationCategory === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setNotificationCategory('all')}
            >
              全部
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                notificationCategory === 'transaction' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setNotificationCategory('transaction')}
            >
              交易
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                notificationCategory === 'activity' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setNotificationCategory('activity')}
            >
              活动
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                notificationCategory === 'interaction' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setNotificationCategory('interaction')}
            >
              互动
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                notificationCategory === 'system' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setNotificationCategory('system')}
            >
              系统
            </button>
          </div>
          
          <div className="bg-white mt-2">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id}
                className={`flex p-4 border-b border-gray-100 relative ${!notification.read ? 'bg-blue-50' : ''}`}
                onContextMenu={(e) => handleContextMenu(e, notification, 'notification')}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0
                  ${notification.type === 'transaction' ? 'bg-amber-100' : 
                    notification.type === 'activity' ? 'bg-purple-100' : 
                    notification.type === 'interaction' ? 'bg-blue-100' : 'bg-green-100'}
                `}>
                  <span className="text-lg">{notification.icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
                
                {!notification.read && (
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
            ))}
            
            {filteredNotifications.length === 0 && (
              <div className="py-16 flex flex-col items-center justify-center text-gray-500">
                <Bell size={48} strokeWidth={1} className="text-gray-300 mb-4" />
                <p>暂无通知</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Context Menu */}
      {showContextMenu && selectedItem && (
        <div 
          ref={contextMenuRef}
          className="fixed bg-white rounded-lg shadow-lg py-1 z-50"
          style={{ 
            top: contextMenuPosition.y, 
            left: contextMenuPosition.x,
            width: '160px',
            transform: 'translate(-50%, 10px)'
          }}
        >
          {deleteType === 'conversation' ? (
            <>
              <button 
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 flex items-center"
                onClick={() => togglePinConversation(selectedItem)}
              >
                <Pin size={16} className="mr-2" />
                {selectedItem.pinned ? '取消置顶' : '置顶会话'}
              </button>
              <button 
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 flex items-center"
                onClick={() => toggleReadStatus(selectedItem, 'conversation')}
              >
                <Check size={16} className="mr-2" />
                {selectedItem.unread ? '标记已读' : '标记未读'}
              </button>
              <button 
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 flex items-center"
              >
                <Archive size={16} className="mr-2" />
                归档会话
              </button>
              <button 
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 flex items-center text-red-500"
                onClick={() => openDeleteDialog('conversation')}
              >
                <Trash size={16} className="mr-2" />
                删除会话
              </button>
            </>
          ) : (
            <>
              <button 
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 flex items-center"
                onClick={() => toggleReadStatus(selectedItem, 'notification')}
              >
                <Check size={16} className="mr-2" />
                {selectedItem.read ? '标记未读' : '标记已读'}
              </button>
              <button 
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 flex items-center text-red-500"
                onClick={() => openDeleteDialog('notification')}
              >
                <Trash size={16} className="mr-2" />
                删除通知
              </button>
            </>
          )}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              删除后将无法恢复，是否确认删除？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Messages;
