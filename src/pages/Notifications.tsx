
import React, { useState } from 'react';
import { ArrowLeft, Search, Bell, CheckCheck, Calendar, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '../components/BottomNav';

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sample notification data
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: '回答已采纳',
      message: '您对"考研英语如何提高阅读速度？"的回答已被采纳',
      time: '10分钟前',
      read: false,
      category: 'answer'
    },
    {
      id: '2',
      title: '新问题推荐',
      message: '有新的"考研英语"相关问题，点击查看',
      time: '30分钟前',
      read: false,
      category: 'recommendation'
    },
    {
      id: '3',
      title: '李教授有了新回答',
      message: '您关注的李教授刚刚回答了一个新问题',
      time: '2小时前',
      read: true,
      category: 'expert'
    },
    {
      id: '4',
      title: '课程提醒',
      message: '您的"雅思口语提高"课程将在明天开始',
      time: '昨天',
      read: true,
      category: 'course'
    },
    {
      id: '5',
      title: '系统通知',
      message: '系统维护通知：今晚22:00-23:00系统进行维护升级',
      time: '2天前',
      read: true,
      category: 'system'
    }
  ]);

  // Filter notifications based on active tab and selected category
  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && !notification.read);
    const matchesCategory = !selectedCategory || notification.category === selectedCategory;
    return matchesTab && matchesCategory;
  });

  // Categories for filtering
  const categories = [
    { id: 'answer', name: '回答', icon: '💬' },
    { id: 'recommendation', name: '推荐', icon: '🔍' },
    { id: 'expert', name: '专家', icon: '👨‍🏫' },
    { id: 'course', name: '课程', icon: '📚' },
    { id: 'system', name: '系统', icon: '⚙️' }
  ];

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast({
      title: "全部已读",
      description: "所有通知已标记为已读"
    });
  };

  // Handle notification click
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    // Navigate or perform action based on notification type
    const notification = notifications.find(n => n.id === id);
    if (notification?.category === 'answer') {
      navigate('/question/123'); // Example: navigate to question
    } else if (notification?.category === 'expert') {
      navigate('/expert-profile/456'); // Example: navigate to expert profile
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with tabs */}
      <div className="sticky top-0 z-10 bg-app-teal shadow-sm">
        <div className="pt-12 pb-2">
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 text-white hover:bg-white/10"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={24} />
              </Button>
              <h1 className="text-xl font-medium text-white">消息通知</h1>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck size={20} />
              </Button>
            </div>
          </div>

          <div className="flex space-x-6 px-4 mt-3">
            <button 
              className={cn(
                "pb-2 text-white/70",
                activeTab === 'all' && "text-white font-medium border-b-2 border-white"
              )}
              onClick={() => setActiveTab('all')}
            >
              全部
            </button>
            <button 
              className={cn(
                "pb-2 text-white/70 flex items-center",
                activeTab === 'unread' && "text-white font-medium border-b-2 border-white"
              )}
              onClick={() => setActiveTab('unread')}
            >
              未读
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white text-app-teal text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Categories filter */}
      <div className="px-4 py-3 bg-white mb-2">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={cn(
                "flex items-center space-x-1 px-3 py-1.5 rounded-full whitespace-nowrap text-sm",
                selectedCategory === category.id 
                  ? "bg-app-teal text-white" 
                  : "bg-gray-100 text-gray-700"
              )}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div className="px-4">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Bell size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">
              {activeTab === 'unread' ? '没有未读通知' : '没有通知'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-2">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id}
                className={cn(
                  "bg-white rounded-lg p-4 shadow-sm border-l-4",
                  notification.read ? "border-gray-200" : "border-app-teal"
                )}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex justify-between">
                  <h3 className={cn(
                    "font-medium",
                    notification.read ? "text-gray-700" : "text-gray-900"
                  )}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <p className={cn(
                  "text-sm mt-1",
                  notification.read ? "text-gray-500" : "text-gray-700"
                )}>
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Notifications;
