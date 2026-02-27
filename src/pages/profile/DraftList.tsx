
import React, { useState } from "react";
import { FileText, PencilLine, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

const DraftList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: drafts, isLoading } = useQuery({
    queryKey: ['drafts', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const deleteDraft = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('drafts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      toast({ title: '草稿已删除' });
    },
  });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteDraft.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
    } catch { return '刚刚'; }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!drafts || drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-20">
        <FileText size={64} className="text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground mb-2">暂无草稿内容</p>
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
              <FileText size={18} className="text-primary" />
              <h3 className="text-base font-medium flex-1 truncate">{draft.title || '无标题草稿'}</h3>
            </div>
            <div className="text-xs text-muted-foreground mb-1">{formatTime(draft.updated_at)}</div>
            <div className="text-sm text-muted-foreground truncate">{draft.content || '无内容'}</div>
          </div>
          <div className="flex flex-col gap-1 pr-3 pt-3">
            <Button
              size="icon"
              variant="ghost"
              className="text-primary"
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
