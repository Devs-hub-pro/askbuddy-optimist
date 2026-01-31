
import React from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';

interface ActivityCardProps {
  title: string;
  imageUrl: string;
  delay?: number;
  discussionCount?: number;
  compact?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  title, 
  imageUrl,
  delay = 0,
  discussionCount,
  compact = false
}) => {
  return (
    <div 
      className={`bg-gradient-to-br from-white to-blue-50/30 rounded-xl overflow-hidden shadow-md hover:shadow-lg card-animate animate-fade-in transform hover:-translate-y-1 transition-all duration-300 ${compact ? 'h-full' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`relative bg-muted overflow-hidden ${compact ? 'h-20' : 'aspect-w-16 aspect-h-9'}`}>
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          onLoad={(e) => {
            (e.target as HTMLImageElement).classList.add('animate-fade-in');
          }}
        />
        {!compact && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 text-white font-medium text-sm">
              查看详情
            </div>
          </div>
        )}
      </div>
      
      <div className={compact ? 'p-2' : 'p-3'}>
        <h3 className={`font-semibold leading-tight ${compact ? 'text-xs line-clamp-2 mb-1' : 'text-sm mb-2'}`}>{title}</h3>
        <div className="flex justify-between items-center">
          <div className={`flex items-center gap-1 text-muted-foreground ${compact ? 'text-[10px]' : 'text-xs'}`}>
            <MessageCircle size={compact ? 10 : 12} />
            <span>{discussionCount !== undefined ? `${discussionCount}` : '讨论'}</span>
          </div>
          {!compact && <ArrowUpRight size={14} className="text-muted-foreground transition-colors group-hover:text-app-teal" />}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
