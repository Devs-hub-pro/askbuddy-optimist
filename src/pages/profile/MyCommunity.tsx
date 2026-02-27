
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useMyFollowing } from '@/hooks/useProfileData';

const MyCommunity = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: following, isLoading } = useMyFollowing();

  return (
    <div className="pb-20 min-h-screen bg-muted">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md flex items-center p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">我的社群</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : following && following.length > 0 ? (
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            我关注的人 ({following.length})
          </h3>
          {following.map((f: any) => (
            <Card key={f.id} className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={f.profile?.avatar_url || ''} />
                  <AvatarFallback>{(f.profile?.nickname || '用')[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground">{f.profile?.nickname || '匿名用户'}</h4>
                  {f.profile?.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{f.profile.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 mt-20">
          <Users size={64} className="text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-2">您暂未关注任何人</p>
          <Button variant="outline" onClick={() => navigate('/discover')} className="mt-2">
            去发现更多
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default MyCommunity;
