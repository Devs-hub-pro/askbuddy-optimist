import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Image, Smile, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useMessagesWithUser, useSendMessage, useMarkMessagesAsRead } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const ChatDetail: React.FC = () => {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch partner profile
  const { data: partnerProfile } = useQuery({
    queryKey: ['profile', chatId],
    queryFn: async () => {
      if (!chatId) return null;
      const { data } = await supabase
        .from('profiles')
        .select('user_id, nickname, avatar_url')
        .eq('user_id', chatId)
        .maybeSingle();
      return data;
    },
    enabled: !!chatId,
  });

  // Real messages from database
  const { data: messages, isLoading } = useMessagesWithUser(chatId || '');
  const sendMessage = useSendMessage();
  const markAsRead = useMarkMessagesAsRead();

  // Mark messages as read on mount
  useEffect(() => {
    if (chatId && user) {
      markAsRead.mutate(chatId);
    }
  }, [chatId, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle visual viewport resize (keyboard) on mobile
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
  }, []);

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch {
      return '刚刚';
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() || !chatId) return;
    sendMessage.mutate({
      receiver_id: chatId,
      content: inputValue.trim(),
    });
    setInputValue('');
    inputRef.current?.focus();
  };

  const partnerName = partnerProfile?.nickname || '用户';
  const partnerAvatar = partnerProfile?.avatar_url || undefined;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">请先登录</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-muted flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-primary shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate(-1)} className="text-primary-foreground p-1 -ml-1">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center ml-2 gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={partnerAvatar} alt={partnerName} />
              <AvatarFallback>{partnerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-primary-foreground font-medium">{partnerName}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg) => {
            const fromMe = msg.sender_id === user.id;
            return (
              <div key={msg.id} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  fromMe
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-background text-foreground rounded-bl-md shadow-sm'
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${fromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            暂无消息，发送第一条消息开始聊天吧
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="flex-shrink-0 bg-background border-t border-border px-3 py-2 flex items-center gap-2"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 4px)' }}
      >
        <button className="flex-shrink-0 text-muted-foreground p-1">
          <Smile size={22} />
        </button>
        <input
          ref={inputRef}
          className="flex-1 min-w-0 bg-muted rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          placeholder="输入消息..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          enterKeyHint="send"
        />
        <button className="flex-shrink-0 text-muted-foreground p-1">
          <Image size={22} />
        </button>
        <button
          className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
            inputValue.trim()
              ? 'bg-primary text-primary-foreground shadow-sm active:scale-95'
              : 'bg-muted text-muted-foreground'
          }`}
          onClick={handleSend}
          disabled={!inputValue.trim() || sendMessage.isPending}
        >
          {sendMessage.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          <span>发送</span>
        </button>
      </div>
    </div>
  );
};

export default ChatDetail;
