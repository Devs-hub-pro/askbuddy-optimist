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
  const chat = chatData[chatId || ''];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
  };

  if (!chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">会话不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center h-12 px-4">
          <button onClick={() => navigate(-1)} className="text-white p-1 -ml-1">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center ml-2 gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-white font-medium">{chat.name}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.fromMe 
                ? 'bg-app-teal text-white rounded-br-md' 
                : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
            }`}>
              <p>{msg.content}</p>
              <p className={`text-[10px] mt-1 ${msg.fromMe ? 'text-white/70' : 'text-gray-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
        <button className="text-gray-400 p-1.5">
          <Smile size={22} />
        </button>
        <input
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-app-teal/50"
          placeholder="输入消息..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="text-gray-400 p-1.5">
          <Image size={22} />
        </button>
        <button 
          className={`p-2 rounded-full transition-colors ${inputValue.trim() ? 'bg-app-teal text-white' : 'bg-gray-100 text-gray-400'}`}
          onClick={handleSend}
          disabled={!inputValue.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatDetail;
