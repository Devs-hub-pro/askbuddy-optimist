
import React, { useState } from "react";
import { FileText, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

type Draft = {
  id: string;
  title: string;
  updatedAt: string;
  content: string;
};

const initialDrafts: Draft[] = [
  {
    id: "1",
    title: "关于英国留学签证流程的几个问题",
    updatedAt: "2024-06-15 13:00",
    content: "请问英国留学签证大概多长时间能够下来，有哪些材料需要准备？",
  },
  {
    id: "2",
    title: "申请美国本科时推荐信重要吗？",
    updatedAt: "2024-06-14 22:31",
    content: "美国本科申请需要找哪类老师写推荐信？字数有限制吗？",
  },
];

const DraftList: React.FC = () => {
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      setDrafts((prev) => prev.filter((item) => item.id !== id));
      setDeletingId(null);
    }, 600); // 动画结束再移除
  };

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-20">
        <FileText size={64} className="text-gray-300 mb-4" />
        <p className="text-gray-500 mb-2">暂无草稿内容</p>
        <Button
          variant="outline"
          onClick={() => navigate("/new")}
          className="mt-2"
        >
          去提问
        </Button>
      </div>
    );
  }

  return (
    <div className="px-3 py-5 space-y-4">
      {drafts.map((draft) => (
        <Card key={draft.id} className={`flex items-start relative shadow-sm transition-all duration-300 ${deletingId === draft.id ? "opacity-30 scale-[0.97]" : ""}`}>
          <div className="flex-1 px-4 py-3 cursor-pointer" onClick={() => navigate(`/new?draftId=${draft.id}`)}>
            <div className="flex items-center mb-1 gap-2">
              <FileText size={18} className="text-app-teal" />
              <h3 className="text-base font-medium flex-1 truncate">{draft.title}</h3>
            </div>
            <div className="text-xs text-gray-400 mb-1">{draft.updatedAt}</div>
            <div className="text-sm text-gray-600 truncate">{draft.content}</div>
          </div>
          <div className="flex flex-col gap-1 pr-3 pt-3">
            <Button
              size="icon"
              variant="ghost"
              className="text-app-blue"
              aria-label="继续编辑"
              onClick={() => navigate(`/new?draftId=${draft.id}`)}
            >
              <PencilLine size={18} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive"
              disabled={deletingId === draft.id}
              aria-label="删除"
              onClick={() => handleDelete(draft.id)}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DraftList;
