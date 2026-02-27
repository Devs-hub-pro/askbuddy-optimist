
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import BottomNav from '@/components/BottomNav';
import { useMyFollowing } from '@/hooks/useProfileData';

const MyFollowing = () => {
  const navigate = useNavigate();
  const { data: following, isLoading } = useMyFollowing();

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">我的关注</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : following && following.length > 0 ? (
        <div className="p-4 space-y-3">
          {following.map((item: any) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={item.profile?.avatar_url || ''} />
                <AvatarFallback>{item.profile?.nickname?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {item.profile?.nickname || '未知用户'}
                </h3>
                {item.profile?.bio && (
                  <p className="text-xs text-gray-500 line-clamp-1">{item.profile.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 mt-20">
          <Users size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">暂未关注任何人</p>
          <Button variant="outline" onClick={() => navigate('/discover')} className="mt-2">
            发现更多专家
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default MyFollowing;
