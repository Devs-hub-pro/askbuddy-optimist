
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import { useMyAnswers } from '@/hooks/useProfileData';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const MyAnswers = () => {
  const navigate = useNavigate();
  const { data: answers, isLoading } = useMyAnswers();

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch { return '刚刚'; }
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">我的回答</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : answers && answers.length > 0 ? (
        <div className="p-4 space-y-3">
          {answers.map((answer: any) => (
            <div
              key={answer.id}
              className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/question/${answer.question_id}`)}
            >
              <p className="text-xs text-primary font-medium mb-1">
                问题：{answer.questions?.title || '已删除的问题'}
              </p>
              <p className="text-sm text-gray-700 line-clamp-2">{answer.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{formatTime(answer.created_at)}</span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>👍 {answer.likes_count}</span>
                  {answer.is_accepted && (
                    <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs">已采纳</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 mt-20">
          <MessageSquare size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">暂无回答记录</p>
          <Button variant="outline" onClick={() => navigate('/discover')} className="mt-2">
            去回答问题
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default MyAnswers;
