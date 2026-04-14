import React from 'react';
import { Heart, Loader2, Send } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePostComments } from '@/hooks/usePosts';
import { formatTime } from '@/utils/format';
import PageStateCard from '@/components/common/PageStateCard';

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
    <div className="mt-3 space-y-3 border-t border-border pt-3 animate-fade-in">
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

      {isLoading ? (
        <PageStateCard compact variant="loading" title="正在加载评论…" className="px-3 py-4" />
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
                  <span className="text-[10px] text-muted-foreground">{formatTime(comment.created_at)}</span>
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
        <PageStateCard compact title="还没有评论" description="你可以先来发第一条评论。" className="px-4 py-5" />
      )}
    </div>
  );
};

export default CommentsSection;
