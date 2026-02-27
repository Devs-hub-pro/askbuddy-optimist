
import React, { useState, useRef } from 'react';
import { Image, Video, Heart, MessageCircle, Share2, Bell, SmilePlus, Hash, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import BottomNav from '../components/BottomNav';
import { usePosts, usePostComments, useTogglePostLike, useCreatePost, useAddComment, PostWithProfile } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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
  const { user } = useAuth();
  const { data: posts, isLoading } = usePosts();

  const recommendationCards: RecommendationCard[] = [
    { id: '1', title: '职场吐槽', description: '领导又开始画饼了，干还是不干？', imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=300&h=150&auto=format&fit=crop', bgColor: 'bg-gradient-to-br from-purple-500 to-indigo-600' },
    { id: '2', title: '校园趣事', description: '宿舍的猫今天又把我们早餐吃了…', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&h=150&auto=format&fit=crop', bgColor: 'bg-gradient-to-br from-pink-500 to-rose-400' },
    { id: '3', title: '今日热点', description: '考公还是考研？大家怎么看？', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300&h=150&auto=format&fit=crop', bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-400' },
    { id: '4', title: '生活妙招', description: '合租时如何保护自己的权益？', imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=300&h=150&auto=format&fit=crop', bgColor: 'bg-gradient-to-br from-amber-500 to-orange-400' },
  ];

  // Post creation state
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const createPost = useCreatePost();

  const sampleEmojis = ['😊', '😂', '😍', '🤔', '👍', '🎉', '❤️', '😭', '🔥', '✨', '🙏', '👏', '🌹', '🤗', '😁'];

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    await createPost.mutateAsync({ content: newPostContent, topics: newPostTags });
    setIsPostDialogOpen(false);
    setNewPostContent('');
    setNewPostTags([]);
    setNewTagInput('');
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !newPostTags.includes(newTagInput.trim())) {
      setNewPostTags([...newPostTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch {
      return '刚刚';
    }
  };

  const filteredPosts = posts || [];

  return (
    <div className="pb-16 bg-muted min-h-screen">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'following' | 'recommended' | 'local')} className="w-full">
        <div className="sticky top-0 z-10 bg-primary shadow-md" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex-1">
              <TabsList className="w-full justify-start bg-transparent h-10 p-0">
                {(['following', 'recommended', 'local'] as const).map(tab => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="text-base font-medium data-[state=active]:text-primary-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-3 py-1 text-primary-foreground/70"
                  >
                    {tab === 'following' ? '关注' : tab === 'recommended' ? '推荐' : '同城'}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <button className="relative p-2 hover:bg-primary-foreground/10 rounded-full transition-colors" onClick={() => setShowNotification(false)}>
              <Bell size={18} className="text-primary-foreground" />
              {showNotification && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />}
            </button>
          </div>
        </div>

        {(['following', 'recommended', 'local'] as const).map(tab => (
          <TabsContent key={tab} value={tab} className="mt-0 p-0">
            <DiscoverFeed
              recommendationCards={tab === 'local' ? recommendationCards.filter((_, i) => i % 2 === 1) : recommendationCards}
              posts={filteredPosts}
              isLoading={isLoading}
              formatTime={formatTime}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Post Creation Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-md border-border rounded-xl max-w-md w-full mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">发布动态</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              placeholder="分享你的想法..."
              className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="relative">
              <Button variant="outline" size="sm" className="flex gap-1 rounded-full" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <SmilePlus size={18} /> 添加表情
              </Button>
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-card rounded-lg shadow-lg border border-border grid grid-cols-5 gap-2 z-10">
                  {sampleEmojis.map((emoji, i) => (
                    <button key={i} className="w-8 h-8 flex items-center justify-center text-xl hover:bg-muted rounded transition-colors" onClick={() => { setNewPostContent(prev => prev + emoji); setShowEmojiPicker(false); }}>
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash size={18} className="text-muted-foreground" />
                <Input placeholder="添加标签" value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} className="flex-1" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} />
                <Button variant="outline" size="sm" onClick={handleAddTag}>添加</Button>
              </div>
              {newPostTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newPostTags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary border-none rounded-full text-xs py-1 px-3 flex items-center gap-1">
                      #{tag}
                      <button className="ml-1 hover:text-destructive" onClick={() => setNewPostTags(newPostTags.filter(t => t !== tag))}>×</button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex gap-1 rounded-full"><Image size={18} /> 添加图片</Button>
              <Button variant="outline" size="sm" className="flex gap-1 rounded-full"><Video size={18} /> 添加视频</Button>
            </div>
            <div className="pt-2 flex justify-end">
              <Button className="bg-primary hover:bg-primary/90 rounded-full" onClick={handleCreatePost} disabled={createPost.isPending || !newPostContent.trim()}>
                {createPost.isPending ? <Loader2 size={16} className="animate-spin mr-1" /> : null}
                发布
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Publish Button */}
      <button
        onClick={() => setIsPostDialogOpen(true)}
        className="fixed bottom-20 right-4 z-20 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 active:scale-95"
        aria-label="发布动态"
      >
        <Send size={22} className="-rotate-45" />
      </button>

      <BottomNav />
    </div>
  );
};

// DiscoverFeed component
interface DiscoverFeedProps {
  recommendationCards: RecommendationCard[];
  posts: PostWithProfile[];
  isLoading: boolean;
  formatTime: (d: string) => string;
}

const DiscoverFeed: React.FC<DiscoverFeedProps> = ({ recommendationCards, posts, isLoading, formatTime }) => {
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const toggleLike = useTogglePostLike();
  const addComment = useAddComment();

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    await addComment.mutateAsync({ postId, content: text });
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  return (
    <div className="pb-4">
      {/* Recommendation cards */}
      <div className="px-4 py-3 bg-card">
        <div className="overflow-x-auto flex space-x-3 pb-2 scrollbar-hide">
          {recommendationCards.map((card, index) => (
            <div
              key={card.id}
              className={`flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden shadow-md ${card.bgColor} relative hover:scale-105 transition-transform duration-200 opacity-0 animate-slide-in-left`}
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="h-full flex flex-col justify-between p-2 relative z-10">
                <div className="text-sm font-bold text-primary-foreground">{card.title}</div>
                <p className="text-xs line-clamp-2 text-primary-foreground">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-3 mt-3 px-3">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-card p-4 rounded-xl shadow-sm animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-24 mb-1" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
              </div>
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-2">暂无动态</p>
            <p className="text-sm">快来发布第一条动态吧</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.id}
              className="bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
            >
              {/* Author info */}
              <div className="flex items-start mb-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/10 mt-1">
                  <AvatarImage src={post.profile_avatar || ''} alt={post.profile_nickname || ''} />
                  <AvatarFallback>{(post.profile_nickname || '匿').slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <div className="font-medium text-foreground">{post.profile_nickname}</div>
                  <div className="text-xs text-muted-foreground">{formatTime(post.created_at)}</div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-3">
                <p className="text-foreground mb-3 leading-relaxed">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {post.images.slice(0, 9).map((img, i) => (
                      <div key={i} className={`${post.images.length === 1 ? 'aspect-video' : 'aspect-square'} bg-muted rounded-lg overflow-hidden`}>
                        <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}
                {post.topics && post.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.topics.map(topic => (
                      <Badge key={topic} variant="secondary" className="bg-primary/10 text-primary border-none rounded-full text-xs hover:bg-primary/20 transition-colors">
                        #{topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Interaction buttons */}
              <div className="flex justify-between border-t border-border pt-3">
                <button
                  className="flex items-center space-x-1 text-sm text-muted-foreground transition-colors hover:text-pink-500"
                  onClick={() => toggleLike.mutate({ postId: post.id, liked: post.liked_by_me })}
                >
                  <Heart className={`h-5 w-5 transition-transform duration-200 ${post.liked_by_me ? 'fill-pink-500 text-pink-500 scale-110' : 'text-current'}`} />
                  <span>{post.likes_count}</span>
                </button>
                <button
                  className={`flex items-center space-x-1 text-sm transition-colors ${expandedComments[post.id] ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle className={`h-5 w-5 ${expandedComments[post.id] ? 'fill-primary/20' : ''}`} />
                  <span>{post.comments_count}</span>
                </button>
                <button className="flex items-center space-x-1 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Share2 className="h-5 w-5" />
                  <span>{post.shares_count}</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <CommentsSection
                  postId={post.id}
                  inputRefs={inputRefs}
                  commentInput={commentInputs[post.id] || ''}
                  onInputChange={(val) => setCommentInputs(prev => ({ ...prev, [post.id]: val }))}
                  onSubmit={() => handleCommentSubmit(post.id)}
                  isSubmitting={addComment.isPending}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Separate comments section that fetches its own data
interface CommentsSectionProps {
  postId: string;
  inputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
  commentInput: string;
  onInputChange: (val: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, inputRefs, commentInput, onInputChange, onSubmit, isSubmitting }) => {
  const { data: comments, isLoading } = usePostComments(postId);

  return (
    <div className="mt-3 border-t border-border pt-3 space-y-3 animate-fade-in">
      {/* Comment Input */}
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarFallback>我</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex items-center bg-muted rounded-full px-3 py-1.5">
          <input
            ref={(el) => { inputRefs.current[postId] = el; }}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
            placeholder="写评论..."
            value={commentInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          />
          <button
            className={`ml-2 p-1 rounded-full transition-colors ${commentInput.trim() ? 'text-primary' : 'text-muted-foreground/30'}`}
            onClick={onSubmit}
            disabled={!commentInput.trim() || isSubmitting}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>

      {/* Comment List */}
      {isLoading ? (
        <div className="flex justify-center py-3">
          <Loader2 size={16} className="animate-spin text-muted-foreground" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-2.5">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                <AvatarImage src={comment.profile_avatar || ''} alt={comment.profile_nickname || ''} />
                <AvatarFallback>{(comment.profile_nickname || '匿').charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="bg-muted rounded-xl px-3 py-2">
                  <span className="text-xs font-medium text-primary">{comment.profile_nickname}</span>
                  <p className="text-sm text-foreground mt-0.5">{comment.content}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 px-1">
                  <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: zhCN })}</span>
                  <button className="text-[10px] text-muted-foreground hover:text-pink-500 flex items-center gap-0.5">
                    <Heart size={10} />
                    {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
                  </button>
                  <button className="text-[10px] text-muted-foreground hover:text-primary">回复</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground py-2">暂无评论，快来抢沙发吧 ✨</p>
      )}
    </div>
  );
};

export default Discover;
