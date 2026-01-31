
import React from "react";
import { ChevronLeft, Bell, Eye, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  asker: { name: string; avatar: string; id: string };
  time: string;
  viewCount: string;
  points: number;
  onBack: () => void;
  onViewUser: (userId: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  title, asker, time, viewCount, points, onBack, onViewUser
) => (
  <div className="sticky top-0 z-50 bg-app-teal shadow-sm animate-fade-in" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
    <div className="flex items-center h-12 px-4">
      <button onClick={onBack} className="text-white" aria-label="返回上一页">
        <ChevronLeft size={24} />
      </button>
      <div className="text-white font-medium text-base ml-2">{title}</div>
      <div className="flex-1" />
      <button className="text-white" aria-label="消息提醒">
        <Bell size={20} />
      </button>
    </div>
    {/* 问题头部展示 */}
    <div className="p-4 bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <div className="flex items-center cursor-pointer" onClick={() => onViewUser(asker.id)}>
          <Avatar className="w-8 h-8 mr-2">
            <AvatarImage src={asker.avatar} alt={asker.name} />
            <AvatarFallback>{asker.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{asker.name}</p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <div className="flex items-center text-gray-500">
            <Eye size={14} className="mr-1" />
            <span className="text-xs">{viewCount}</span>
          </div>
          <div className="bg-yellow-50 text-yellow-600 rounded-full px-2 py-1 text-xs flex items-center">
            <Award size={12} className="mr-1" />
            {points} 积分
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
