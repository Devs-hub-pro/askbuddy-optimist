
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

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
      className="bg-white rounded-xl overflow-hidden shadow-soft card-animate animate-fade-in hover:shadow-md transition-all duration-300"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative aspect-w-16 aspect-h-9 bg-gray-100 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          onLoad={(e) => {
            (e.target as HTMLImageElement).classList.add('animate-fade-in');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight mb-2">{title}</h3>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">参与讨论</div>
          <ArrowUpRight size={14} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
