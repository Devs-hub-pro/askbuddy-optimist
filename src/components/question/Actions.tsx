
import React from "react";
import { BookmarkPlus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionsProps {
  onCollect: () => void;
  onShare: () => void;
}

const Actions: React.FC<ActionsProps> = ({ onCollect, onShare }) => (
  <div className="flex justify-between">
    <Button
      variant="outline"
      size="sm"
      className="flex items-center text-xs"
      onClick={onCollect}
      aria-label="收藏"
    >
      <BookmarkPlus size={14} className="mr-1" />
      收藏
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="flex items-center text-xs"
      onClick={onShare}
      aria-label="分享"
    >
      <Share2 size={14} className="mr-1" />
      分享
    </Button>
  </div>
);

export default Actions;
