
import React, { useState } from 'react';
import { ArrowLeft, Search, Settings } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const Messages = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'notifications'>('chats');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const pinnedChats = [
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
      pinned: true
    }
  ];

  const regularChats = [
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
      pinned: false
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
      pinned: false
    }
  ];

  const transactionNotifications = [
    {
      id: 'notif-001',
      title: '订单已完成',
      message: '您与王医生的咨询订单已完成，请及时评价',
      time: '今天 14:30',
      type: 'transaction',
      read: false
    }
  ];

  const activityNotifications = [
    {
      id: 'notif-002',
      title: '限时活动',
      message: '双11优惠：所有专家咨询享8折优惠，立即查看',
      time: '昨天',
      type: 'activity',
      read: true
    }
  ];

  const unreadNotifications = 
    transactionNotifications.filter(n => !n.read).length +
    activityNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with tabs */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <div className="pt-12 pb-2">
          <div className="flex justify-between items-center px-4">
            <div className="flex space-x-6">
              <div 
                className={`relative pb-2 ${activeTab === 'chats' ? 'text-app-teal font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveTab('chats')}
              >
                <span className="text-lg">私信</span>
                {activeTab === 'chats' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-app-teal rounded-full"></div>
                )}
              </div>
              
              <div 
                className={`relative pb-2 ${activeTab === 'notifications' ? 'text-app-teal font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveTab('notifications')}
              >
                <span className="text-lg">通知</span>
                {unreadNotifications > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                    {unreadNotifications}
                  </div>
                )}
                {activeTab === 'notifications' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-app-teal rounded-full"></div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                className="w-9 h-9 flex items-center justify-center rounded-full"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search size={20} className="text-gray-600" />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full">
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Search bar */}
        {showSearch && (
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
        )}
      </div>
      
      {/* Content container */}
      <div className={`pt-${showSearch ? '32' : '20'}`}>
        {/* Chats tab */}
        {activeTab === 'chats' && (
          <div className="px-0">
            {pinnedChats.length > 0 && (
              <>
                <div className="p-2 px-4 text-xs text-gray-500 bg-gray-50">置顶会话</div>
                <div className="bg-white">
                  {pinnedChats.map(chat => (
                    <div key={chat.id} className={`flex items-center p-4 border-b border-gray-100 ${chat.unread ? 'bg-blue-50/30' : ''}`}>
                      <div className="relative mr-3">
                        <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                        {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div className="font-medium text-gray-900">{chat.name}</div>
                          <div className="text-xs text-gray-500">{chat.lastMessageTime}</div>
                        </div>
                        <div className="text-sm text-gray-600 truncate">{chat.lastMessage}</div>
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="ml-2 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1.5">
                          {chat.unreadCount}
                        </div>
                      )}
                      <div className="ml-1 text-gray-400">📌</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="p-2 px-4 text-xs text-gray-500 bg-gray-50">最近会话</div>
            <div className="bg-white">
              {regularChats.map(chat => (
                <div key={chat.id} className={`flex items-center p-4 border-b border-gray-100 ${chat.unread ? 'bg-blue-50/30' : ''}`}>
                  <div className="relative mr-3">
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                    {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div className="font-medium text-gray-900">{chat.name}</div>
                      <div className="text-xs text-gray-500">{chat.lastMessageTime}</div>
                    </div>
                    <div className="text-sm text-gray-600 truncate">{chat.lastMessage}</div>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="ml-2 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1.5">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Notifications tab */}
        {activeTab === 'notifications' && (
          <div className="px-0">
            <div className="p-3 px-4 flex justify-end bg-white border-b border-gray-100">
              <button className="text-app-teal text-sm">全部标为已读</button>
            </div>
            
            {transactionNotifications.length > 0 && (
              <>
                <div className="p-2 px-4 text-xs text-gray-500 bg-gray-50">交易通知</div>
                <div className="bg-white">
                  {transactionNotifications.map(notification => (
                    <div key={notification.id} className={`flex p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50/30' : ''}`}>
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
                    <div key={notification.id} className={`flex p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50/30' : ''}`}>
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
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Messages;
