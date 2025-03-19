
import React from 'react';
import { MessageCircle, Award } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface QuestionCardProps {
  id: string;
  title: string;
  asker: {
    name: string;
    avatar: string;
  };
  time: string;
  tags: string[];
  points: number;
  delay?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  title, 
  asker, 
  time, 
  tags, 
  points,
  delay = 0 
}) => {
  return (
    <div 
      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <h3 className="font-semibold text-base mb-3 text-gray-800">{title}</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-9 h-9 border border-gray-100">
            <AvatarImage src={asker.avatar} alt={asker.name} className="object-cover" />
            <AvatarFallback>{asker.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-gray-700">{asker.name}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>
        </div>
        
        <span className="flex items-center gap-1 bg-yellow-50 text-yellow-600 text-xs px-2.5 py-1 rounded-full font-medium">
          <Award size={14} className="text-yellow-500" />
          {points} 积分
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="inline-block text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
              #{tag}
            </span>
          ))}
        </div>
        
        <button className="bg-gradient-to-r from-blue-500 to-app-blue text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0">
          <MessageCircle size={14} />
          回答
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
