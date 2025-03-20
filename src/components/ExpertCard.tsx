
import React from 'react';
import { MessageSquare, Award } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Expert {
  id: string;
  name: string;
  avatar: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  rating: number;
  responseRate: string;
  orderCount: string;
}

interface ExpertCardProps {
  expert: Expert;
  onSelect: (expertId: string) => void;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
      onClick={() => onSelect(expert.id)}
    >
      <div className="flex items-start">
        <Avatar className="w-12 h-12 mr-3">
          <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
          <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">{expert.name}</h3>
              <p className="text-xs text-green-600">{expert.title}</p>
            </div>
            <div className="flex items-center text-amber-500">
              <Award size={14} className="mr-0.5" />
              <span className="text-xs">{expert.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-2">{expert.description}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {expert.tags.map((tag, index) => (
              <span key={index} className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(expert.id);
            }}
          >
            <MessageSquare size={16} className="mr-2" />
            咨询专家
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
