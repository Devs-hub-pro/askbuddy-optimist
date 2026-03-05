import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Hash, Heart, MessageCircle, Share2, Trash2, MoreHorizontal, PenSquare, Flame, MapPin, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTogglePostLike, useAddComment, useDeletePost, useSharePost, PostWithProfile } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { formatTime } from '@/utils/format';
import PageStateCard from '@/components/common/PageStateCard';
import CommentsSection from './CommentsSection';

interface DiscoverFeedProps {
  posts: PostWithProfile[];
  isLoading: boolean;
  formatTime: (d: string) => string;
  emptyText?: string;
  showComposer?: boolean;
  onQuickPost?: () => void;
  topicChips?: Array<{ id: string; name: string; hint: string }>;
  tabLabel?: string;
  locationLabel?: string;
}

const DiscoverFeed: React.FC<DiscoverFeedProps> = ({ posts, isLoading, emptyText, showComposer, onQuickPost, topicChips = [], tabLabel, locationLabel }) => {
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [sortMode, setSortMode] = useState<'latest' | 'hot'>('latest');
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const toggleLike = useTogglePostLike();
  const addComment = useAddComment();
  const deletePost = useDeletePost();
  const sharePost = useSharePost();
  const { user } = useAuth();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-post-menu-trigger]') || target.closest('[data-post-menu-panel]')) return;
      setMenuOpenId(null);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const sortedPosts = useMemo(() => {
    const list = [...posts];
    if (sortMode === 'hot') {
      return list.sort((a, b) => {
        const aScore = (a.likes_count || 0) * 2 + (a.comments_count || 0) + (a.shares_count || 0);
        const bScore = (b.likes_count || 0) * 2 + (b.comments_count || 0) + (b.shares_count || 0);
        return bScore - aScore;
      });
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [posts, sortMode]);

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const openCommentsAndFocus = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
    window.setTimeout(() => {
      inputRefs.current[postId]?.focus();
    }, 60);
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    await addComment.mutateAsync({ postId, content: text });
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  return (
    <div className="pb-5">
      {showComposer && (
        <div className="px-4 pt-5">
          <div className="rounded-3xl border border-app-border-light bg-app-header-light p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-card/90">
                  <PenSquare size={14} className="text-app-header" />
                </span>
                <div>
                  <div className="text-sm font-semibold leading-none text-foreground">社交广场</div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{tabLabel}</p>
                </div>
              </div>
              {locationLabel ? (
                <span className="flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  <MapPin size={12} className="text-app-header" />
                  {locationLabel}
                </span>
              ) : null}
            </div>

            <div className="mt-3 rounded-2xl bg-card/92 p-3">
              <button
                className="flex w-full items-center gap-3 text-left"
                onClick={onQuickPost}
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback>发</AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80">
                  分享此刻的想法、经验或正在发生的事
                </div>
              </button>

              <div className="mt-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <button className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1.5 hover:text-foreground" onClick={onQuickPost}>
                    <Image size={14} />
                    图片
                  </button>
                  <button className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1.5 hover:text-foreground" onClick={onQuickPost}>
                    <Hash size={14} />
                    话题
                  </button>
                  <button className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1.5 hover:text-foreground" onClick={onQuickPost}>
                    <MapPin size={14} />
                    同城
                  </button>
                </div>
                <span className="text-[11px] text-muted-foreground">{posts.length} 条动态</span>
              </div>

              {topicChips.length > 0 && (
                <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-app-warm">
                    <Flame size={13} className="text-app-warm-foreground" />
                  </span>
                  {topicChips.slice(0, 4).map((topic) => (
                    <button
                      key={topic.id}
                      className="shrink-0 rounded-full border border-app-border-light bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
                      onClick={onQuickPost}
                    >
                      #{topic.name}
                    </button>
                  ))}
                </div>
              )}

              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                发动态、聊热点、看同城新鲜事，内容更轻、更即时。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">广场动态</h3>
            <p className="mt-1 text-xs text-muted-foreground">更轻量、更即时，适合随手分享和互动</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-card p-1 shadow-sm">
            <button
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${sortMode === 'latest' ? 'bg-app-surface text-app-accent' : 'text-muted-foreground'}`}
              onClick={() => setSortMode('latest')}
            >
              最新
            </button>
            <button
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${sortMode === 'hot' ? 'bg-app-surface text-app-accent' : 'text-muted-foreground'}`}
              onClick={() => setSortMode('hot')}
            >
              最热
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3 px-4">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="surface-card rounded-3xl border border-border p-4 animate-pulse-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="mb-1 h-4 w-24 rounded-full bg-muted" />
                  <div className="h-3 w-16 rounded-full bg-muted" />
                </div>
              </div>
              <div className="mb-2 h-4 w-full rounded-full bg-muted" />
              <div className="h-4 w-3/4 rounded-full bg-muted" />
            </div>
          ))
        ) : sortedPosts.length === 0 ? (
          <PageStateCard
            compact
            title={emptyText || '还没有动态'}
            description="现在就发一条新动态，先占个位置。"
          />
        ) : (
          sortedPosts.map((post, index) => (
            <div
              key={post.id}
              className="surface-card rounded-3xl border border-border p-4 opacity-0 animate-slide-up transition-shadow duration-200 hover:shadow-md"
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
                {user && user.id === post.user_id && (
                  <div className="relative">
                    <button
                      data-post-menu-trigger
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
                      onClick={() => setMenuOpenId(menuOpenId === post.id ? null : post.id)}
                    >
                      <MoreHorizontal size={18} className="text-muted-foreground" />
                    </button>
                    {menuOpenId === post.id && (
                      <div data-post-menu-panel className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-20 py-1 min-w-[100px]">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                          onClick={() => {
                            setMenuOpenId(null);
                            deletePost.mutate(post.id);
                          }}
                        >
                          <Trash2 size={14} />
                          删除
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="mb-3">
                <button
                  type="button"
                  className="mb-3 block w-full text-left leading-7 text-foreground"
                  onClick={() => openCommentsAndFocus(post.id)}
                >
                  {post.content}
                </button>
                {post.images && post.images.length > 0 && (
                  <button
                    type="button"
                    className={`grid w-full gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
                    onClick={() => openCommentsAndFocus(post.id)}
                  >
                    {post.images.slice(0, 9).map((img, i) => (
                      <div key={i} className={`${post.images!.length === 1 ? 'aspect-video' : 'aspect-square'} overflow-hidden rounded-2xl bg-muted`}>
                        <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                      </div>
                    ))}
                  </button>
                )}
                {post.topics && post.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.topics.map(topic => (
                      <Badge key={topic} variant="secondary" className="rounded-full border-none bg-primary/10 text-primary text-xs transition-colors hover:bg-primary/20">
                        #{topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Interaction buttons */}
              <div className="rounded-2xl border border-border bg-muted p-1">
                <div className="flex justify-between">
                  <button
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-pink-500"
                    onClick={() => toggleLike.mutate({ postId: post.id, liked: post.liked_by_me })}
                  >
                    <Heart className={`h-5 w-5 transition-transform duration-200 ${post.liked_by_me ? 'fill-pink-500 text-pink-500 scale-110' : 'text-current'}`} />
                    <span>{post.likes_count}</span>
                  </button>
                  <button
                    className={`flex flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2 text-sm transition-colors ${expandedComments[post.id] ? 'bg-card text-primary' : 'text-muted-foreground hover:bg-card hover:text-primary'}`}
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className={`h-5 w-5 ${expandedComments[post.id] ? 'fill-primary/20' : ''}`} />
                    <span>{post.comments_count}</span>
                  </button>
                  <button
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-primary"
                    onClick={() => sharePost.mutate(post.id)}
                  >
                    <Share2 className="h-5 w-5" />
                    <span>{post.shares_count}</span>
                  </button>
                </div>
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

export default DiscoverFeed;
