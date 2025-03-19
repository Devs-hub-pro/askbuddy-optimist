
import React from 'react';
import { MessageCircle, Award, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  // Handle direct messaging to the expert
  const handleAskMe = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event if the button is clicked
    console.log(`Ask expert: ${asker.name}`);
    // This would typically open a chat or contact form
  };

  return (
    <div 
      className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-4 shadow-md card-animate animate-fade-in hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${delay}s` }}
    >
      <h3 className="font-semibold text-base mb-2 text-app-text">{title}</h3>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8 border border-gray-100">
            <AvatarImage src={asker.avatar} alt={asker.name} className="object-cover" />
            <AvatarFallback>{asker.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{asker.name}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>
        </div>
        
        <span className="flex items-center gap-1 bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded-full">
          <Award size={12} className="text-yellow-500" />
          {points} 积分
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="inline-block text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleAskMe}
            variant="outline" 
            size="sm"
            className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100 rounded-full text-xs py-1 h-auto flex items-center gap-1"
          >
            <MessageSquare size={14} />
            找我问问
          </Button>
          
          <button className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 hover:brightness-105">
            <MessageCircle size={14} />
            回答
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
