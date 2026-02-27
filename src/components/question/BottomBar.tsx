
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
    className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 flex gap-3 z-40"
    style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
  >
    <Button
      className="flex-1 bg-gradient-to-r from-blue-500 to-primary"
      onClick={onAnswer}
      aria-label="我来回答"
      disabled={loading}
    >
      <MessageSquare size={16} className="mr-2" />
      我来回答
    </Button>
    <Button
      variant="outline"
      className="flex-1 flex items-center justify-center"
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
