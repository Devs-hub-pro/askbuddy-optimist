
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Activity {
  id: string;
  title: string;
  imageUrl: string;
}

interface ActivityCardsProps {
  activities: Activity[];
  onSelect: (activityId: string) => void;
}

const ActivityCards: React.FC<ActivityCardsProps> = ({ activities, onSelect }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
      {activities.map(activity => (
        <div 
          key={activity.id} 
          className="min-w-[70%] rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-all"
          onClick={() => onSelect(activity.id)}
        >
          <div className="h-28 overflow-hidden">
            <img 
              src={activity.imageUrl} 
              alt={activity.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-2">
            <h3 className="font-medium text-sm">{activity.title}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">1.2k人参与</span>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // Additional action for joining the activity
                }}
              >
                <MessageSquare size={12} className="mr-1" />
                加入
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityCards;
