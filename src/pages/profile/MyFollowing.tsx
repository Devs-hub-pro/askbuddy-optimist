
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useMyFollowing } from '@/hooks/useProfileData';
import SubPageHeader from '@/components/layout/SubPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import PageStateCard from '@/components/common/PageStateCard';
import { demoExperts } from '@/lib/demoData';

const MyFollowing = () => {
  const navigate = useNavigate();
  const { data: following, isLoading } = useMyFollowing();
  const demoFollowing = demoExperts.slice(0, 4).map((expert) => ({
    id: `demo-follow-${expert.id}`,
    following_id: expert.user_id,
    profile: {
      user_id: expert.user_id,
      nickname: expert.nickname || '测试用户',
      avatar_url: expert.avatar_url,
      bio: expert.bio || '示例关注用户',
    },
  }));
  const visibleFollowing = (following && following.length > 0)
    ? following
    : (isLoading ? demoFollowing : []);

  return (
    <div className="pb-8 min-h-[100dvh] bg-gray-50">
      <SubPageHeader title="我的关注" />

      {visibleFollowing.length > 0 ? (
        <div className="p-4 space-y-4">
          {visibleFollowing.map((item: any) => (
            <Card
              key={item.id}
              className="surface-card rounded-3xl border-none shadow-sm"
            >
              <CardContent className="p-4">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 text-left"
                  onClick={() => navigate(`/expert-profile/${item.following_id || item.profile?.user_id || item.id}`)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.profile?.avatar_url || ''} />
                    <AvatarFallback>{item.profile?.nickname?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-slate-900">
                      {item.profile?.nickname || '未知用户'}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {item.profile?.bio || '已关注，随时可以回到主页查看动态和服务信息。'}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              </CardContent>
            </Card>
          ))}
          {isLoading && (
            <div className="px-1 text-xs text-muted-foreground">正在同步你的真实关注列表…</div>
          )}
        </div>
      ) : (
        <div className="p-4 pt-20">
          <PageStateCard
            title="暂未关注任何人"
            description="关注感兴趣的达人后，可以更快找到熟悉的主页和服务入口。"
            actionLabel="发现更多专家"
            onAction={() => navigate('/discover')}
            icon={<Users size={64} className="mx-auto text-muted-foreground/30" />}
          />
        </div>
      )}

    </div>
  );
};

export default MyFollowing;
