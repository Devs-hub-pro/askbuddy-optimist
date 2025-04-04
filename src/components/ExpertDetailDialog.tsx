
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Award, 
  Clock, 
  Package, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle  
} from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ExpertDetailProps {
  id: string;
  name: string;
  avatar: string;
  title: string;
  description: string;
  tags: string[];
  location?: string;
  rating: number;
  responseRate: string;
  orderCount: string;
  education?: string[];
  experience?: string[];
  verified?: boolean;
  children: React.ReactNode;
}

const ExpertDetailDialog: React.FC<ExpertDetailProps> = ({
  id,
  name,
  avatar,
  title,
  description,
  tags,
  location = '北京',
  rating,
  responseRate,
  orderCount,
  education = ['北京大学 | 硕士'],
  experience = ['某知名互联网公司 | 产品经理'],
  verified = true,
  children
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedConsultType, setSelectedConsultType] = useState<'text' | 'voice' | 'video'>('text');

  const handleConsultTypeSelect = (type: 'text' | 'voice' | 'video') => {
    setSelectedConsultType(type);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">专家详情 - {name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-2 space-y-6">
          {/* Expert Header */}
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="w-16 h-16 border-2 border-green-100">
                <AvatarImage src={avatar} alt={name} className="object-cover" />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{name}</h2>
                  {verified && (
                    <span className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0.5 rounded-full border border-blue-100 flex items-center">
                      <Award size={10} className="mr-0.5" />
                      已认证
                    </span>
                  )}
                </div>
                <p className="text-sm text-green-600">{title}</p>
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin size={12} className="mr-1" />
                  <span>{location}</span>
                  <span className="mx-1.5">•</span>
                  <span className="text-gray-400">IP属地 {location}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5 text-right">
              <div className="flex items-center justify-end text-yellow-500 gap-1">
                <Award size={14} />
                <span className="text-sm font-medium">{rating}</span>
              </div>
              <div className="flex items-center justify-end text-blue-500 gap-1 text-xs">
                <Clock size={12} />
                <span>{responseRate} 响应率</span>
              </div>
              <div className="flex items-center justify-end text-green-500 gap-1 text-xs">
                <Package size={12} />
                <span>{orderCount}</span>
              </div>
            </div>
          </div>
          
          {/* Expert Description */}
          <Collapsible 
            className="w-full border border-gray-100 rounded-lg p-4 bg-gray-50"
            open={isDescriptionExpanded}
            onOpenChange={setIsDescriptionExpanded}
          >
            <div className="text-sm text-gray-700 leading-relaxed">
              {description.length > 200 && !isDescriptionExpanded ? (
                <>
                  <p>{description.substring(0, 200)}...</p>
                  <CollapsibleTrigger className="text-blue-500 text-xs mt-2 hover:underline flex items-center">
                    展开全部 <ChevronDown size={12} className="ml-1" />
                  </CollapsibleTrigger>
                </>
              ) : (
                <>
                  <p>{description}</p>
                  {description.length > 200 && (
                    <CollapsibleTrigger className="text-blue-500 text-xs mt-2 hover:underline flex items-center">
                      收起 <ChevronUp size={12} className="ml-1" />
                    </CollapsibleTrigger>
                  )}
                </>
              )}
            </div>
            
            <CollapsibleContent>
              <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-full border border-green-100"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          {/* Education & Experience */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">教育经历</h3>
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <div key={index} className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-md">
                    {edu}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">工作经历</h3>
              <div className="space-y-2">
                {experience.map((exp, index) => (
                  <div key={index} className="bg-purple-50 text-purple-700 text-sm px-3 py-2 rounded-md">
                    {exp}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Consult Options */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700">咨询方式</h3>
            <div className="flex gap-3">
              <button 
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedConsultType === 'text' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
                onClick={() => handleConsultTypeSelect('text')}
              >
                文本咨询
              </button>
              <button 
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedConsultType === 'voice' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
                onClick={() => handleConsultTypeSelect('voice')}
              >
                语音咨询
              </button>
              <button 
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedConsultType === 'video' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
                onClick={() => handleConsultTypeSelect('video')}
              >
                视频咨询
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-green-50 text-green-600 border-green-100 hover:bg-green-100 hover:text-green-700">
              预约咨询
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-blue-500 to-app-blue hover:opacity-90">
              <MessageSquare size={16} className="mr-2" />
              私聊
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertDetailDialog;
