
import React from 'react';

interface ActivityCardProps {
  title: string;
  imageUrl: string;
  delay?: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  title, 
  imageUrl,
  delay = 0 
}) => {
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-soft card-animate animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
          loading="lazy"
          onLoad={(e) => {
            (e.target as HTMLImageElement).classList.add('animate-fade-in');
          }}
        />
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight mb-2">{title}</h3>
        <div className="text-xs text-gray-500">参与讨论</div>
      </div>
    </div>
  );
};

export default ActivityCard;
