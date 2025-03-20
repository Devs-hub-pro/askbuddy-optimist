
import React, { useState } from 'react';
import { Image, Video, Heart, MessageCircle, Share2, Plus, Bell } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import BottomNav from '../components/BottomNav';

// Feed post type definition
interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  time: string;
  content: string;
  images?: string[];
  video?: string;
  topics?: string[];
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

// Recommendation card type
interface RecommendationCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  bgColor: string;
}

const Discover: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'following' | 'recommended' | 'local'>('recommended');
  const [showNotification, setShowNotification] = useState(true);
  
  // Sample recommendation cards with youth-oriented styling
  const recommendationCards: RecommendationCard[] = [
    {
      id: '1',
      title: '职场吐槽',
      description: '领导又开始画饼了，干还是不干？',
      imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=300&h=150&auto=format&fit=crop',
      bgColor: 'bg-gradient-to-br from-purple-500 to-indigo-600'
    },
    {
      id: '2',
      title: '校园趣事',
      description: '宿舍的猫今天又把我们早餐吃了…',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&h=150&auto=format&fit=crop',
      bgColor: 'bg-gradient-to-br from-pink-500 to-rose-400'
    },
    {
      id: '3',
      title: '今日热点',
      description: '考公还是考研？大家怎么看？',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300&h=150&auto=format&fit=crop',
      bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-400'
    },
    {
      id: '4',
      title: '生活妙招',
      description: '合租时如何保护自己的权益？',
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=300&h=150&auto=format&fit=crop',
      bgColor: 'bg-gradient-to-br from-amber-500 to-orange-400'
    }
  ];
  
  // Sample posts data
  const posts: Post[] = [
    {
      id: '1',
      author: {
        name: '李明',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      time: '10分钟前',
      content: '今天去面试了一家科技公司，面试官问了我很多关于算法的问题，感觉挺难的。有没有大佬分享一下面试经验？',
      images: [
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop'
      ],
      topics: ['面试经验', '求职'],
      likes: 24,
      comments: 6,
      shares: 2,
      liked: false
    },
    {
      id: '2',
      author: {
        name: '张小方',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      time: '2小时前',
      content: '分享一个租房小技巧：签合同前一定要检查水电煤气表的读数，拍照存档，避免后期纠纷。',
      topics: ['租房避坑', '生活妙招'],
      likes: 87,
      comments: 15,
      shares: 34,
      liked: true
    },
    {
      id: '3',
      author: {
        name: '摄影师王强',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
      },
      time: '昨天',
      content: '分享一组今天在深圳湾拍摄的日落照片，光线真的太美了！',
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507502707577-a9a7fcd3ad61?w=500&auto=format&fit=crop'
      ],
      topics: ['摄影', '深圳'],
      likes: 156,
      comments: 23,
      shares: 45,
      liked: false
    },
    {
      id: '4',
      author: {
        name: '学习达人',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      time: '3天前',
      content: '考研英语复习经验分享：每天背10个单词，坚持100天，词汇量能提升1000+。大家有什么更好的学习方法吗？',
      video: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      topics: ['考研', '英语学习'],
      likes: 342,
      comments: 78,
      shares: 112,
      liked: false
    }
  ];
  
  const [likedPosts, setLikedPosts] = useState<{[key: string]: boolean}>({
    '2': true
  });
  
  const handleLike = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleNotificationClick = () => {
    setShowNotification(false);
  };
  
  // Changed function: Now creates a post instead of navigating to question page
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  
  const handleCreatePost = () => {
    setIsPostDialogOpen(false);
    setNewPostContent('');
    // Would normally send the post to the backend here
  };
  
  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header with improved styling - Removed search button */}
      <div className="sticky top-0 z-10 bg-app-teal shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1">
            <Tabs 
              defaultValue="recommended" 
              className="w-full" 
              onValueChange={(value) => setActiveTab(value as 'following' | 'recommended' | 'local')}
            >
              <TabsList className="w-full justify-start bg-transparent h-10 p-0">
                <TabsTrigger 
                  value="following" 
                  className="text-base font-medium data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-3 py-1 text-white/80"
                >
                  关注
                </TabsTrigger>
                <TabsTrigger 
                  value="recommended" 
                  className="text-base font-medium data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-3 py-1 text-white/80"
                >
                  推荐
                </TabsTrigger>
                <TabsTrigger 
                  value="local" 
                  className="text-base font-medium data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none px-3 py-1 text-white/80"
                >
                  同城
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center">
            <button 
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={handleNotificationClick}
            >
              <Bell size={18} className="text-white" />
              {showNotification && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="recommended" className="w-full">
        <TabsContent value="following" className="mt-0 p-0">
          <DiscoverFeed 
            recommendationCards={recommendationCards} 
            posts={posts.filter((_, index) => index % 2 === 0)} 
            likedPosts={likedPosts}
            onLike={handleLike}
          />
        </TabsContent>
        
        <TabsContent value="recommended" className="mt-0 p-0">
          <DiscoverFeed 
            recommendationCards={recommendationCards} 
            posts={posts} 
            likedPosts={likedPosts}
            onLike={handleLike}
          />
        </TabsContent>
        
        <TabsContent value="local" className="mt-0 p-0">
          <DiscoverFeed 
            recommendationCards={recommendationCards.filter((_, index) => index % 2 === 1)} 
            posts={posts.filter(post => post.topics?.includes('深圳'))} 
            likedPosts={likedPosts}
            onLike={handleLike}
          />
        </TabsContent>
      </Tabs>
      
      {/* Updated Floating Action Button for Post Creation */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-app-teal shadow-lg hover:bg-app-teal/90 hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">发布动态</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea 
              placeholder="分享你的想法..." 
              className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-teal/50"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex gap-1 rounded-full">
                <Image size={18} /> 添加图片
              </Button>
              <Button variant="outline" size="sm" className="flex gap-1 rounded-full">
                <Video size={18} /> 添加视频
              </Button>
            </div>
            <div className="pt-2 flex justify-end">
              <Button 
                className="bg-app-teal hover:bg-app-teal/90 rounded-full"
                onClick={handleCreatePost}
              >
                发布
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

// DiscoverFeed component with updated styling
interface DiscoverFeedProps {
  recommendationCards: RecommendationCard[];
  posts: Post[];
  likedPosts: {[key: string]: boolean};
  onLike: (postId: string) => void;
}

const DiscoverFeed: React.FC<DiscoverFeedProps> = ({ recommendationCards, posts, likedPosts, onLike }) => {
  return (
    <div className="pb-4">
      {/* Youth-oriented Recommendation Cards - Enhanced design */}
      <div className="px-4 py-3 bg-white">
        <div className="overflow-x-auto flex space-x-3 pb-2 scrollbar-hide">
          {recommendationCards.map(card => (
            <div 
              key={card.id} 
              className={`flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden shadow-md ${card.bgColor} relative hover:scale-105 transition-transform duration-200 animate-fade-in`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="h-full flex flex-col justify-between p-3 relative z-10">
                <div className="text-sm font-bold text-white">
                  {card.title}
                </div>
                <div className="mt-auto">
                  <p className="text-xs line-clamp-3 text-white">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Posts Feed - Enhanced styling */}
      <div className="space-y-3 mt-3 px-3">
        {posts.map(post => (
          <div 
            key={post.id} 
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in"
          >
            {/* Author info - Updated styling */}
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10 ring-2 ring-app-teal/10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-xs text-gray-500">{post.time}</div>
              </div>
            </div>
            
            {/* Post content - Enhanced styling */}
            <div className="mb-3">
              <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>
              
              {/* Images grid - Enhanced styling */}
              {post.images && post.images.length > 0 && (
                <div className={`grid gap-2 mb-3 ${
                  post.images.length === 1 ? 'grid-cols-1' : 
                  post.images.length === 2 ? 'grid-cols-2' : 
                  'grid-cols-3'
                }`}>
                  {post.images.slice(0, 9).map((img, index) => (
                    <div key={index} className={`${
                      post.images && post.images.length === 1 ? 'aspect-w-16 aspect-h-9' : 'aspect-square'
                    } bg-gray-100 rounded-lg overflow-hidden`}>
                      <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Video - Enhanced styling */}
              {post.video && (
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <video 
                    src={post.video} 
                    className="w-full h-full object-cover" 
                    controls={false}
                    playsInline
                    muted
                    loop
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/40 transition-colors">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Topics - Enhanced styling */}
              {post.topics && post.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.topics.map(topic => (
                    <Badge key={topic} variant="secondary" className="bg-app-teal/10 text-app-teal border-none rounded-full text-xs hover:bg-app-teal/20 transition-colors">
                      #{topic}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Interaction buttons - Enhanced styling */}
            <div className="flex justify-between border-t pt-3">
              <button 
                className="flex items-center space-x-1 text-sm text-gray-500 transition-colors hover:text-pink-500"
                onClick={() => onLike(post.id)}
              >
                <Heart className={`h-5 w-5 transition-transform duration-200 ${likedPosts[post.id] ? 'fill-pink-500 text-pink-500 scale-110' : 'text-current'}`} />
                <span>{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
              </button>
              
              <button className="flex items-center space-x-1 text-sm text-gray-500 transition-colors hover:text-app-teal">
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments}</span>
              </button>
              
              <button className="flex items-center space-x-1 text-sm text-gray-500 transition-colors hover:text-app-teal">
                <Share2 className="h-5 w-5" />
                <span>{post.shares}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
