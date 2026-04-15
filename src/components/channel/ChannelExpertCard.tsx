import React from 'react';
import { Award, Clock, MessageSquare, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ChannelExpertCardProps {
  expert: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    description: string;
    tags: string[];
    rating: number;
    responseRate: string;
    orderCount: string;
  };
  accentBorderClass: string;
  accentTextClass: string;
  accentTagClass: string;
  accentSummaryClass: string;
  ctaClassName: string;
  onOpen: () => void;
  onConsult: () => void;
}

const ChannelExpertCard: React.FC<ChannelExpertCardProps> = ({
  expert,
  accentBorderClass,
  accentTextClass,
  accentTagClass,
  accentSummaryClass,
  ctaClassName,
  onOpen,
  onConsult,
}) => {
  return (
    <div className="surface-card rounded-2xl p-3.5 shadow-sm transition-all duration-200 hover:shadow-md">
      <button type="button" className="block w-full text-left" onClick={onOpen}>
        <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-left">
          <Avatar className={`h-10 w-10 border ${accentBorderClass}`}>
            <AvatarImage src={expert.avatar} alt={expert.name} className="object-cover" />
            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold leading-5 text-gray-800">{expert.name}</h3>
            <p className={`text-xs ${accentTextClass}`}>{expert.title}</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-yellow-500">
            <Award size={12} />
            <span className="text-xs font-medium">{expert.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-500">
            <Clock size={10} />
            <span>{expert.responseRate}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <Users size={10} />
            <span>{expert.orderCount}</span>
          </div>
        </div>
        </div>
      </button>

      <div className="mt-2 flex">
        <button
          type="button"
          onClick={onOpen}
          className={`mr-2 line-clamp-2 flex-1 rounded-r-md border-l-2 pl-2 py-0.5 text-left text-xs leading-5 text-gray-700 ${accentSummaryClass}`}
        >
          {expert.description}
        </button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onConsult();
          }}
          className={`h-9 min-w-[94px] rounded-full px-3 text-xs text-white shadow-md transition-all hover:shadow-lg active:translate-y-0 ${ctaClassName}`}
        >
          <MessageSquare size={10} className="mr-1" />
          找我问问
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {expert.tags.map((tag, index) => (
          <span key={index} className={`rounded-full px-2 py-0.5 text-xs ${accentTagClass}`}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChannelExpertCard;
