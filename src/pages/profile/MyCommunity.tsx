
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  MessageSquare, 
  Star, 
  Bell,
  Crown,
  UserPlus,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import BottomNav from '@/components/BottomNav';

const MyCommunity = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [communities] = useState([
    {
      id: 1,
      name: '留学生交流群',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      members: 1280,
      posts: 326,
      isAdmin: true,
      unread: 5
    },
    {
      id: 2,
      name: '职业发展讨论',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      members: 892,
      posts: 156,
      isAdmin: false,
      unread: 0
    }
  ]);

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">我的社群</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="搜索社群"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {communities.length > 0 ? (
        <div className="px-4 space-y-4">
          {/* My Communities */}
          {communities.map((community) => (
            <Card key={community.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={community.avatar} alt={community.name} />
                    <AvatarFallback>
                      {community.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{community.name}</h3>
                        {community.isAdmin && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                            <Crown size={12} className="mr-1" />
                            管理员
                          </Badge>
                        )}
                      </div>
                      {community.unread > 0 && (
                        <Badge variant="destructive" className="rounded-full">
                          {community.unread}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>{community.members} 成员</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare size={14} className="mr-1" />
                        <span>{community.posts} 讨论</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Discover More Button */}
          <Button 
            variant="outline" 
            className="w-full mt-4 border-dashed border-2"
            onClick={() => navigate('/discover')}
          >
            <UserPlus size={18} className="mr-2" />
            发现更多社群
          </Button>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-8 mt-20">
          <Users size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">您暂未加入任何社群</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/discover')}
            className="mt-2"
          >
            发现热门社群
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default MyCommunity;
