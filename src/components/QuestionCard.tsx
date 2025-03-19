
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
      className="bg-white rounded-lg p-4 mb-3 shadow-soft animate-fade-in card-animate"
      style={{ animationDelay: `${delay}s` }}
    >
      <h3 className="font-semibold text-base mb-3">{title}</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img 
              src={asker.avatar} 
              alt={asker.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <div className="text-xs text-gray-700">提问者: {asker.name}</div>
            <div className="text-xs text-gray-500">提问时间: {time}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-1">
            <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" fill="currentColor"/>
              <path d="M12 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 17V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 12L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5 12L3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18.364 5.63604L16.95 7.04999" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7.05001 16.95L5.63605 18.364" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16.95 16.95L18.364 18.364" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7.05001 7.04999L5.63605 5.63604" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-yellow-500 font-medium">{points}</span>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="tag">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
