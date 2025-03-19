
import React from 'react';

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
      className="bg-white rounded-lg p-4 shadow-soft card-animate animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <h3 className="font-semibold text-base mb-2 text-app-text">{title}</h3>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <img 
            src={asker.avatar} 
            alt={asker.name}
            className="w-8 h-8 rounded-full flex-shrink-0" 
          />
          <div>
            <div className="text-sm font-medium">{asker.name}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>
        </div>
        
        <span className="bg-yellow-100 text-yellow-500 text-xs px-2 py-1 rounded-full">
          {points} 积分
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-app-green">
              {tag}
            </span>
          ))}
        </div>
        
        <button className="bg-app-teal text-white px-3 py-1 rounded-full text-xs font-medium">
          回答
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
