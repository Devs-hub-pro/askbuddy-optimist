
import React from "react";
import { MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomBarProps {
  onAnswer: () => void;
  onInvite: () => void;
  loading?: boolean;
}

const BottomBar: React.FC<BottomBarProps> = ({
  onAnswer, onInvite, loading
}) => (
  <div 
    className="fixed bottom-0 left-0 right-0 bg-background/98 border-t border-border px-4 pt-3 flex gap-3 z-40 backdrop-blur-sm"
    style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
  >
    <Button
      className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-primary shadow-sm h-11"
      onClick={onAnswer}
      aria-label="我来回答"
      disabled={loading}
    >
      <MessageSquare size={16} className="mr-2" />
      我来回答
    </Button>
    <Button
      variant="outline"
      className="flex-1 rounded-full flex items-center justify-center border-slate-200 bg-white text-slate-700 hover:bg-slate-50 h-11"
      onClick={onInvite}
      aria-label="邀请回答"
      disabled={loading}
    >
      <Mail size={16} className="mr-2" />
      邀请回答
    </Button>
  </div>
);

export default BottomBar;
