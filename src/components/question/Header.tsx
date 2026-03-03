
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
}) => (
  <div className="sticky top-0 z-50 animate-fade-in">
    <div className="bg-app-teal shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
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
    </div>
    <div className="border-b border-slate-100 bg-white/95 px-4 py-3.5 backdrop-blur-sm shadow-[0_1px_0_rgba(15,23,42,0.03)]">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 items-center cursor-pointer" onClick={() => onViewUser(asker.id)}>
          <Avatar className="w-9 h-9 mr-2">
            <AvatarImage src={asker.avatar} alt={asker.name} />
            <AvatarFallback>{asker.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{asker.name}</p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="flex items-center text-gray-500">
            <Eye size={14} className="mr-1" />
            <span className="text-xs">{viewCount}</span>
          </div>
          <div className="bg-yellow-50 text-yellow-600 rounded-full px-2.5 py-1 text-xs flex items-center border border-yellow-100">
            <Award size={12} className="mr-1" />
            {points}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
