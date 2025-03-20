
import React, { useState } from 'react';
import { MessageCircle, Award, Eye } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ExpertDetailDialog from './ExpertDetailDialog';

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
  id,
  title,
  description,
  asker, 
  time, 
  tags, 
  points,
  viewCount,
  delay = 0,
  answerName,
  answerAvatar
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Mock expert data for the asker - in a real app, this would be fetched from API
  const askerExpertData = {
    id: id + '-asker',
    name: asker.name,
    avatar: asker.avatar,
    title: '提问者',
    description: '这位用户经常在平台上提出高质量的问题，帮助社区成长。',
    tags: tags,
    rating: 4.5,
    responseRate: '90%',
    orderCount: '10单',
    education: ['未知'],
    experience: ['活跃社区成员'],
    verified: false
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in border border-gray-100 cursor-pointer"
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
            <ExpertDetailDialog {...askerExpertData}>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="w-8 h-8 border border-gray-100">
                  <AvatarImage src={asker.avatar} alt={asker.name} className="object-cover" />
                  <AvatarFallback>{asker.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-xs font-medium text-gray-700">{asker.name}</div>
                  <div className="text-xs text-gray-500">{time}</div>
                </div>
              </div>
            </ExpertDetailDialog>
            
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
              <button 
                className="bg-gradient-to-r from-blue-500 to-app-blue text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle size={12} />
                回答
              </button>
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-left">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Question Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <ExpertDetailDialog {...askerExpertData}>
                <div className="flex items-center gap-3 cursor-pointer">
                  <Avatar className="w-10 h-10 border border-gray-100">
                    <AvatarImage src={asker.avatar} alt={asker.name} className="object-cover" />
                    <AvatarFallback>{asker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-800">{asker.name}</div>
                    <div className="text-xs text-gray-500">{time}</div>
                  </div>
                </div>
              </ExpertDetailDialog>
              
              <Badge variant="outline" className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 text-amber-600 border-amber-100 px-3 py-1.5">
                <Award size={16} className="text-amber-500" />
                <span className="text-sm font-semibold">{points} 积分</span>
              </Badge>
            </div>
            
            <Collapsible 
              className="w-full"
              open={isDescriptionExpanded}
              onOpenChange={setIsDescriptionExpanded}
            >
              <div className="bg-gray-50 p-4 rounded-lg text-gray-800 text-sm leading-relaxed">
                {description && description.length > 200 && !isDescriptionExpanded ? (
                  <>
                    <p>{description.substring(0, 200)}...</p>
                    <CollapsibleTrigger className="text-blue-500 text-xs mt-2 hover:underline">
                      展开全部
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <p className="mt-2">{description.substring(200)}</p>
                    </CollapsibleContent>
                  </>
                ) : (
                  <p>{description}</p>
                )}
              </div>
            </Collapsible>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="inline-block text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Interaction Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" className="flex-1 bg-green-50 text-green-600 border-green-100 hover:bg-green-100 hover:text-green-700">
              预约咨询
            </Button>
            <Button variant="outline" className="flex-1 bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700">
              私聊
            </Button>
          </div>
          
          {/* Answer Section */}
          <div className="pt-4 border-t border-gray-100">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-app-blue hover:opacity-90">
              <MessageCircle size={16} className="mr-2" />
              回答问题
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionCard;
