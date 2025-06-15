
import React from "react";
import { Eye, MessageSquare, Award } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Answer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  content: React.ReactNode;
  time: string;
  viewCount: number;
  best?: boolean;
}

interface AnswerListProps {
  answers: Answer[];
  onViewUser: (userId: string) => void;
  onReply: (answerId: string) => void;
}

const AnswerList: React.FC<AnswerListProps> = ({
  answers, onViewUser, onReply
}) => (
  <div className="space-y-4">
    {answers.map((ans) => (
      <div key={ans.id} className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between mb-3">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onViewUser(ans.id)}
          >
            <Avatar className="w-8 h-8 mr-2">
              <AvatarImage src={ans.avatar} />
              <AvatarFallback>{ans.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{ans.name}</p>
              <p className="text-xs text-gray-500">{ans.title}</p>
            </div>
          </div>
          {ans.best && (
            <div className="bg-yellow-50 text-yellow-600 rounded-full px-2 py-1 text-xs flex items-center">
              最佳回答
            </div>
          )}
        </div>
        <p className="text-sm text-gray-700 mb-3 text-left">{ans.content}</p>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{ans.time}</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye size={12} className="mr-1" />
              {ans.viewCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 h-6 text-xs"
              onClick={() => onReply(ans.id)}
              aria-label={`回复${ans.name}`}
            >
              回复
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default AnswerList;
