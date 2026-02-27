
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import { useMyFavorites } from '@/hooks/useProfileData';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const MyFavorites = () => {
  const navigate = useNavigate();
  const { data: favorites, isLoading } = useMyFavorites();

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
        <h1 className="text-xl font-semibold">我的收藏</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : favorites && favorites.length > 0 ? (
        <div className="p-4 space-y-3">
          {favorites.map((fav: any) => (
            <div
              key={fav.id}
              className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/question/${fav.question_id}`)}
            >
              <h3 className="font-medium text-gray-900 mb-1">
                {fav.questions?.title || '已删除的问题'}
              </h3>
              <p className="text-xs text-gray-400">收藏于 {formatTime(fav.created_at)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 mt-20">
          <Heart size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">暂无收藏内容</p>
          <Button variant="outline" onClick={() => navigate('/discover')} className="mt-2">
            去发现内容
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default MyFavorites;
