import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Image, Smile } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Mock chat data
const chatData: Record<string, { name: string; avatar: string; messages: { id: string; content: string; fromMe: boolean; time: string }[] }> = {
  'chat-001': {
    name: '李教授',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    messages: [
      { id: '1', content: '你好，关于项目进展我有一些想法想和你讨论', fromMe: false, time: '昨天 14:30' },
      { id: '2', content: '好的，请说', fromMe: true, time: '昨天 14:32' },
      { id: '3', content: '下周三有空来讨论一下项目进展吗？', fromMe: false, time: '昨天 14:35' },
    ]
  },
  'chat-002': {
    name: '王医生',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    messages: [
      { id: '1', content: '您好，请问最近有什么不舒服的地方吗？', fromMe: false, time: '上午 10:20' },
      { id: '2', content: '最近头疼比较频繁', fromMe: true, time: '上午 10:22' },
      { id: '3', content: '需要您提供更多的症状描述，方便我更准确地给您建议', fromMe: false, time: '上午 10:23' },
    ]
  },
  'chat-003': {
    name: '陈律师',
    avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    messages: [
      { id: '1', content: '合同已经审核完毕', fromMe: false, time: '周一 09:00' },
      { id: '2', content: '已经帮您审核了合同，有几处需要注意的地方', fromMe: false, time: '周一 09:05' },
    ]
  },
  'chat-004': {
    name: '赵老师',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    messages: [
      { id: '1', content: '请查看我发送的课程安排', fromMe: false, time: '周日 15:00' },
    ]
  }
};

const ChatDetail: React.FC = () => {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(chatData[chatId || '']?.messages || []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chat = chatData[chatId || ''];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle visual viewport resize (keyboard open/close) on mobile
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      // Scroll to bottom when keyboard appears
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      fromMe: true,
      time: '刚刚'
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    // Keep focus on input after sending
    inputRef.current?.focus();
  };

  if (!chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">会话不存在</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-muted flex flex-col overflow-hidden">
      {/* Header - fixed */}
      <div className="flex-shrink-0 bg-primary shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate(-1)} className="text-primary-foreground p-1 -ml-1">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center ml-2 gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-primary-foreground font-medium">{chat.name}</span>
          </div>
        </div>
      </div>

      {/* Messages - scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.fromMe 
                ? 'bg-primary text-primary-foreground rounded-br-md' 
                : 'bg-background text-foreground rounded-bl-md shadow-sm'
            }`}>
              <p>{msg.content}</p>
              <p className={`text-[10px] mt-1 ${msg.fromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - fixed at bottom */}
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
          disabled={!inputValue.trim()}
        >
          <Send size={14} />
          <span>发送</span>
        </button>
      </div>
    </div>
  );
};

export default ChatDetail;
