import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Heart, Send, Users, Loader2, Trash2, Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTopicDetail, useCreateDiscussion, useToggleDiscussionLike, useDeleteDiscussion } from '@/hooks/useHotTopics';
import { useIsFollowingTopic, useToggleTopicFollow } from '@/hooks/useTopicFollowers';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');

  const { data, isLoading, error } = useTopicDetail(topicId || '');
  const createDiscussion = useCreateDiscussion();
  const toggleLike = useToggleDiscussionLike();
  const deleteDiscussion = useDeleteDiscussion();
  const { data: isFollowing } = useIsFollowingTopic(topicId || '');
  const toggleFollow = useToggleTopicFollow();

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: zhCN
      });
    } catch {
      return '刚刚';
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !topicId) return;

    await createDiscussion.mutateAsync({
      topic_id: topicId,
      content: newComment.trim()
    });
    setNewComment('');
  };

  const handleLike = (discussionId: string) => {
    if (!topicId) return;
    toggleLike.mutate({ discussionId, topicId });
  };

  const handleDelete = (discussionId: string) => {
    if (!topicId) return;
    if (confirm('确定要删除这条讨论吗？')) {
      deleteDiscussion.mutate({ discussionId, topicId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4">话题不存在或已被删除</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    );
  }

  const { topic, discussions } = data;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold flex-1 truncate">{topic.title}</h1>
        </div>
      </div>

      {/* Topic Header */}
      <div className="bg-white mb-2">
        {topic.cover_image && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={topic.cover_image}
              alt={topic.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{topic.title}</h2>
          {topic.description && (
            <p className="text-muted-foreground text-sm mb-3">{topic.description}</p>
          )}
          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <MessageCircle size={16} />
                {topic.discussions_count} 讨论
              </span>
              <span className="flex items-center gap-1">
                <Users size={16} />
                {topic.participants_count} 参与
              </span>
            </div>
            {user && (
              <Button
                variant={isFollowing ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (topicId) {
                    toggleFollow.mutate(topicId, {
                      onSuccess: (followed) => {
                        toast.success(followed ? '已关注话题' : '已取消关注');
                      }
                    });
                  }
                }}
                disabled={toggleFollow.isPending}
                className="shrink-0"
              >
                <Star size={14} className={cn("mr-1", isFollowing && "fill-current")} />
                {isFollowing ? '已关注' : '关注'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Discussions */}
      <div className="bg-white">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold">全部讨论 ({discussions.length})</h3>
        </div>

        {discussions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>暂无讨论，快来发表你的观点吧！</p>
          </div>
        ) : (
          <div className="divide-y">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={discussion.profile_avatar || undefined} />
                    <AvatarFallback>
                      {(discussion.profile_nickname || '匿')[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {discussion.profile_nickname || '匿名用户'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(discussion.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                      {discussion.content}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => handleLike(discussion.id)}
                        className={cn(
                          "flex items-center gap-1 text-sm transition-colors",
                          discussion.is_liked
                            ? "text-red-500"
                            : "text-muted-foreground hover:text-red-500"
                        )}
                      >
                        <Heart
                          size={16}
                          className={discussion.is_liked ? "fill-current" : ""}
                        />
                        {discussion.likes_count > 0 && discussion.likes_count}
                      </button>
                      {user?.id === discussion.user_id && (
                        <button
                          onClick={() => handleDelete(discussion.id)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 safe-area-inset-bottom">
        {user ? (
          <div className="flex items-end gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="发表你的观点..."
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || createDiscussion.isPending}
              size="icon"
              className="shrink-0"
            >
              {createDiscussion.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => navigate('/auth')}
            className="w-full"
            variant="outline"
          >
            登录后参与讨论
          </Button>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;
