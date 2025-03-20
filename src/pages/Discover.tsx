
import React, { useState } from 'react';
import { Image, Video, Heart, MessageCircle, Share2, Plus, Bell, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
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

// Hot topic type
interface HotTopic {
  id: string;
  name: string;
  count: number;
  trending: boolean;
}

const Discover: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'following' | 'recommended' | 'local'>('recommended');
  const [showNotification, setShowNotification] = useState(true);
  const [filterActive, setFilterActive] = useState(false);
  
  // Hot topics data
  const hotTopics: HotTopic[] = [
    { id: '1', name: '大厂校招', count: 2453, trending: true },
    { id: '2', name: '留学申请', count: 1892, trending: true },
    { id: '3', name: '考研复习', count: 1654, trending: false },
    { id: '4', name: '兼职创业', count: 1432, trending: true },
    { id: '5', name: '求职简历', count: 1298, trending: false },
  ];
  
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

  const handleCreateQuestion = () => {
    navigate('/new-question');
  };
  
  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header with search and tabs */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        {/* Search header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="relative flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="搜索话题、问题、用户" 
                className="pl-10 bg-gray-100 border-none h-9"
                onClick={() => navigate('/search')}
                readOnly
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="relative p-2"
              onClick={handleNotificationClick}
            >
              <Bell size={22} className="text-gray-700" />
              {showNotification && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs 
          defaultValue="recommended" 
          className="w-full" 
          onValueChange={(value) => setActiveTab(value as 'following' | 'recommended' | 'local')}
        >
          <TabsList className="w-full justify-start bg-white px-2 h-12">
            <TabsTrigger 
              value="following" 
              className="text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-app-teal data-[state=active]:text-app-teal rounded-none px-6 py-3"
            >
              关注
            </TabsTrigger>
            <TabsTrigger 
              value="recommended" 
              className="text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-app-teal data-[state=active]:text-app-teal rounded-none px-6 py-3"
            >
              推荐
            </TabsTrigger>
            <TabsTrigger 
              value="local" 
              className="text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-app-teal data-[state=active]:text-app-teal rounded-none px-6 py-3"
            >
              同城
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="following" className="m-0 outline-none">
            <DiscoverFeed 
              recommendationCards={recommendationCards} 
              posts={posts.filter((_, index) => index % 2 === 0)} 
              likedPosts={likedPosts}
              onLike={handleLike}
              hotTopics={hotTopics}
              filterActive={filterActive}
              setFilterActive={setFilterActive}
            />
          </TabsContent>
          
          <TabsContent value="recommended" className="m-0 outline-none">
            <DiscoverFeed 
              recommendationCards={recommendationCards} 
              posts={posts} 
              likedPosts={likedPosts}
              onLike={handleLike}
              hotTopics={hotTopics}
              filterActive={filterActive}
              setFilterActive={setFilterActive}
            />
          </TabsContent>
          
          <TabsContent value="local" className="m-0 outline-none">
            <DiscoverFeed 
              recommendationCards={recommendationCards.filter((_, index) => index % 2 === 1)} 
              posts={posts.filter(post => post.topics?.includes('深圳'))} 
              likedPosts={likedPosts}
              onLike={handleLike}
              hotTopics={hotTopics.filter(topic => topic.id === '5' || topic.id === '3')}
              filterActive={filterActive}
              setFilterActive={setFilterActive}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Enhanced Floating Action Button for Creating Posts */}
      <Button 
        onClick={handleCreateQuestion}
        className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <Plus className="h-6 w-6 text-white" />
      </Button>
      
      <BottomNav />
    </div>
  );
};

// DiscoverFeed component to avoid repetition
interface DiscoverFeedProps {
  recommendationCards: RecommendationCard[];
  posts: Post[];
  likedPosts: {[key: string]: boolean};
  onLike: (postId: string) => void;
  hotTopics: HotTopic[];
  filterActive: boolean;
  setFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const DiscoverFeed: React.FC<DiscoverFeedProps> = ({ 
  recommendationCards, 
  posts, 
  likedPosts, 
  onLike,
  hotTopics,
  filterActive,
  setFilterActive
}) => {
  // Content filter options
  const filters = ['最新', '热门', '关注', '附近'];
  const [activeFilter, setActiveFilter] = useState('热门');

  return (
    <div className="pb-4">
      {/* Content filters - horizontal scrollable pills */}
      <div className="sticky top-[105px] z-10 bg-white border-b px-2 py-2 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
          {filters.map(filter => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              className={`rounded-full text-sm py-1 px-4 h-8 ${
                activeFilter === filter 
                  ? 'bg-gradient-to-r from-app-teal to-app-blue text-white' 
                  : 'border border-gray-200 bg-white hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveFilter(filter);
                setFilterActive(true);
              }}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Hot topics - horizontally scrollable */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm text-gray-800">热门话题</h3>
          <button className="text-xs text-app-teal">
            查看全部
          </button>
        </div>
        <div className="overflow-x-auto flex space-x-2 pb-1 scrollbar-hide">
          {hotTopics.map(topic => (
            <div 
              key={topic.id} 
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-sm ${
                topic.trending 
                  ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200' 
                  : 'bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="font-medium">#{topic.name}</span>
                {topic.trending && <span className="text-pink-500 text-xs">↑</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Content cards - redesigned with more modern styling */}
      <div className="px-4 py-3 bg-white mb-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm text-gray-800">探索话题</h3>
          <button className="text-xs text-app-teal">
            更多
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recommendationCards.map(card => (
            <div 
              key={card.id} 
              className="rounded-xl overflow-hidden h-28 relative hover:scale-105 transition-transform duration-200 shadow-sm"
            >
              <div className={`absolute inset-0 ${card.bgColor} opacity-90`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                <div className="text-sm font-bold text-white drop-shadow-md">
                  {card.title}
                </div>
                <div>
                  <p className="text-xs line-clamp-2 text-white drop-shadow-md">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Posts Feed - Enhanced styling */}
      <div className="space-y-4 px-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in">
            {/* Author info */}
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-xs text-gray-500">{post.time}</div>
              </div>
            </div>
            
            {/* Post content */}
            <div className="mb-3">
              <p className="text-gray-800 mb-3">{post.content}</p>
              
              {/* Images grid */}
              {post.images && post.images.length > 0 && (
                <div className={`grid gap-1 mb-3 ${
                  post.images.length === 1 ? 'grid-cols-1' : 
                  post.images.length === 2 ? 'grid-cols-2' : 
                  'grid-cols-3'
                }`}>
                  {post.images.slice(0, 9).map((img, index) => (
                    <div key={index} className={`${
                      post.images && post.images.length === 1 ? 'aspect-w-16 aspect-h-9' : 'aspect-square'
                    } bg-gray-100 rounded-lg overflow-hidden`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Video */}
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
                    <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Topics */}
              {post.topics && post.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.topics.map(topic => (
                    <span key={topic} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                      #{topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Interaction buttons */}
            <div className="flex justify-between border-t pt-3">
              <button 
                className="flex items-center space-x-1 text-sm text-gray-500 transition-colors hover:text-pink-500"
                onClick={() => onLike(post.id)}
              >
                <Heart className={`h-5 w-5 ${likedPosts[post.id] ? 'fill-pink-500 text-pink-500' : 'text-current'}`} />
                <span>{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
              </button>
              
              <button className="flex items-center space-x-1 text-sm text-gray-500 transition-colors hover:text-blue-500">
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments}</span>
              </button>
              
              <button className="flex items-center space-x-1 text-sm text-gray-500 transition-colors hover:text-green-500">
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
