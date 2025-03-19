
import React from 'react';
import { MessageCircle, Award, Eye } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface QuestionCardProps {
  id: string;
  title: string;
  description?: string;
  asker: {
    name: string;
    avatar: string;
  };
  time: string;
  tags: string[];
  points: number;
  viewCount?: string;
  delay?: number;
  answerName?: string;
  answerAvatar?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  title,
  description,
  asker, 
  time, 
  tags, 
  points,
  viewCount,
  answerName,
  answerAvatar,
  delay = 0 
}) => {
  return (
    <div 
      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in border border-gray-100"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-base text-left text-gray-800">{title}</h3>
        {viewCount && (
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Eye size={14} className="flex-shrink-0" />
            <span>{viewCount}</span>
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-gray-600 mb-3 text-left line-clamp-2">{description}</p>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border border-gray-100">
            <AvatarImage src={asker.avatar} alt={asker.name} className="object-cover" />
            <AvatarFallback>{asker.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <div className="text-xs font-medium text-gray-700">{asker.name}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>
        </div>
        
        <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 text-amber-600 text-xs px-2.5 py-1 rounded-full font-medium border border-amber-100">
          <Award size={14} className="text-amber-500" />
          {points} 积分
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <span key={index} className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          {answerName && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Avatar className="w-5 h-5 border border-green-100">
                <AvatarImage src={answerAvatar} alt={answerName} className="object-cover" />
                <AvatarFallback>{answerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>已回答</span>
            </div>
          )}
          
          <button className="bg-gradient-to-r from-blue-500 to-app-blue text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0">
            <MessageCircle size={12} />
            回答
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
