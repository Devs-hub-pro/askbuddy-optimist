import React, { useState } from 'react';
import { MessageCircle, Award, Eye } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ExpertDetailDialog from './ExpertDetailDialog';
import AnswerDialog from "./AnswerDialog";
import { useLocation, useNavigate } from 'react-router-dom';
import { buildFromState } from '@/utils/navigation';

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
  const [showAnswerDialog, setShowAnswerDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Create unique expert data for the asker based on their properties
  const askerExpertData = {
    id: id + '-asker',
    name: asker.name,
    avatar: asker.avatar,
    title: '提问者',
    description: `这位用户 ${asker.name} 经常在平台上提出高质量的问题，帮助社区成长。`,
    tags: tags,
    rating: 4.5,
    responseRate: '90%',
    orderCount: '10单',
    education: ['未知'],
    experience: ['活跃社区成员'],
    verified: false
  };

  // 伪数据：假定每个提问者的偏好时间段
  const askerTimeSlots = [
    { id: "today14", label: "今天 14:00-15:00" },
    { id: "today19", label: "今天 19:00-20:00" },
    { id: "weekend", label: "周末可约" }
  ];

  // 回答弹窗提交
  const handleAnswerDialogSubmit = (payload: { timeSlots: string[]; message: string }) => {
    // 实际应用可发API/Toast，在此简单console
    console.log("回答者可回答时间段:", payload.timeSlots, "留言:", payload.message);
    // 可弹出Toast告知提交或继续交互
  };
  const openQuestionDetail = () => {
    navigate(`/question/${id}`, { state: buildFromState(location) });
  };

  return (
    <>
      <div
        className="surface-card rounded-3xl p-4 transition-all duration-300 animate-fade-in hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
        style={{ animationDelay: `${delay}s` }}
      >
        <button
          type="button"
          className="mb-2 block w-full text-left"
          onClick={openQuestionDetail}
        >
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-base text-left text-gray-800 leading-7">{title}</h3>
            {viewCount && (
              <div className="ml-2 flex items-center gap-1 text-gray-500 text-xs">
                <Eye size={14} className="flex-shrink-0" />
                <span>{viewCount}</span>
              </div>
            )}
          </div>
        </button>
        
        {description && (
          <button type="button" className="mb-3 block w-full text-left" onClick={openQuestionDetail}>
            <p className="text-sm text-gray-600 line-clamp-2 leading-6">{description}</p>
          </button>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
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
          </div>
          
          <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 text-amber-600 text-xs px-2.5 py-1 rounded-full font-medium border border-amber-100 shadow-sm">
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
              onClick={() => setShowAnswerDialog(true)}
            >
              <MessageCircle size={12} />
              回答
            </button>
          </div>
        </div>
      </div>
      
      <AnswerDialog
        open={showAnswerDialog}
        onOpenChange={setShowAnswerDialog}
        askerTimeSlots={askerTimeSlots}
        onSubmit={handleAnswerDialogSubmit}
      />
    </>
  );
};

export default QuestionCard;
