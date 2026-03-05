
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMyFavorites } from '@/hooks/useProfileData';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import SubPageHeader from '@/components/layout/SubPageHeader';
import PageStateCard from '@/components/common/PageStateCard';

const MyFavorites = () => {
  const navigate = useNavigate();
  const { data: favorites, isLoading } = useMyFavorites();

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch { return '刚刚'; }
  };

  return (
    <div className="pb-8 min-h-[100dvh] bg-gray-50">
      <SubPageHeader title="我的收藏" />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <PageStateCard variant="loading" compact title="正在加载收藏…" className="w-full max-w-sm" />
        </div>
      ) : favorites && favorites.length > 0 ? (
        <div className="p-4 space-y-4">
          {favorites.map((fav: any) => (
            <Card
              key={fav.id}
              className="surface-card cursor-pointer rounded-3xl border-none shadow-sm transition-shadow hover:shadow-md"
              onClick={() => navigate(`/question/${fav.question_id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
                    <Heart size={18} className="text-rose-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
                      {fav.questions?.title || '已删除的问题'}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground">收藏于 {formatTime(fav.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-4 pt-20">
          <PageStateCard
            title="暂无收藏内容"
            description="看到有价值的问题和回答后，收藏会统一保存在这里。"
            actionLabel="去发现内容"
            onAction={() => navigate('/discover')}
            icon={<Heart size={64} className="mx-auto text-muted-foreground/30" />}
          />
        </div>
      )}

    </div>
  );
};

export default MyFavorites;
