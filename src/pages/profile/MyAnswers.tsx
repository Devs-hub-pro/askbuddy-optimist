
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMyAnswers } from '@/hooks/useProfileData';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import SubPageHeader from '@/components/layout/SubPageHeader';
import PageStateCard from '@/components/common/PageStateCard';

const MyAnswers = () => {
  const navigate = useNavigate();
  const { data: answers, isLoading } = useMyAnswers();

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch { return '刚刚'; }
  };

  return (
    <div className="pb-8 min-h-[100dvh] bg-gray-50">
      <SubPageHeader title="我的回答" />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <PageStateCard variant="loading" compact title="正在加载回答…" className="w-full max-w-sm" />
        </div>
      ) : answers && answers.length > 0 ? (
        <div className="p-4 space-y-4">
          {answers.map((answer: any) => (
            <Card
              key={answer.id}
              className="surface-card cursor-pointer rounded-3xl border-none shadow-sm transition-shadow hover:shadow-md"
              onClick={() => navigate(`/question/${answer.question_id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-xs font-medium text-primary">
                      问题：{answer.questions?.title || '已删除的问题'}
                    </p>
                    <p className="line-clamp-3 text-sm leading-6 text-slate-700">{answer.content}</p>
                  </div>
                  {answer.is_accepted ? (
                    <span className="inline-flex shrink-0 items-center rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                      <CheckCircle2 size={13} className="mr-1" />
                      已采纳
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>{formatTime(answer.created_at)}</span>
                  <span>👍 {answer.likes_count}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-5 pt-20">
          <PageStateCard
            title="暂无回答记录"
            description="去发现页看看大家都在问什么，挑擅长的问题来回答。"
            actionLabel="去回答问题"
            onAction={() => navigate('/discover')}
            icon={<MessageSquare size={64} className="mx-auto text-muted-foreground/30" />}
          />
        </div>
      )}

    </div>
  );
};

export default MyAnswers;
