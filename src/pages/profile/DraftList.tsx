
import React, { useState } from "react";
import { FileText, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import PageStateCard from "@/components/common/PageStateCard";

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
        <PageStateCard variant="loading" compact title="正在加载草稿…" className="w-full max-w-sm" />
      </div>
    );
  }

  if (!drafts || drafts.length === 0) {
    return (
      <div className="px-5 py-5">
        <PageStateCard
          title="还没有草稿内容"
          description="灵感没准备好也没关系，稍后可以继续编辑。"
          actionLabel="去提问"
          onAction={() => navigate("/new")}
          icon={<FileText size={64} className="mx-auto text-muted-foreground/30" />}
        />
      </div>
    );
  }

  return (
    <div className="px-5 py-5 space-y-4">
      {drafts.map((draft) => (
        <Card
          key={draft.id}
          className={`surface-card overflow-hidden rounded-3xl border-none shadow-sm transition-all duration-300 ${
            deletingId === draft.id ? "scale-[0.98] opacity-40" : ""
          }`}
        >
          <CardContent className="p-5">
            <button
              type="button"
              className="block w-full text-left"
              onClick={() => navigate(`/new?draftId=${draft.id}`)}
            >
              <div className="flex items-start gap-3">
                <div className="app-soft-surface-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                  <FileText size={18} className="app-accent-text" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {draft.title || '无标题草稿'}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">最近更新于 {formatTime(draft.updated_at)}</p>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      草稿
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {draft.content || '当前还没有填写内容，点击继续补充。'}
                  </p>
                </div>
              </div>
            </button>

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-full"
                aria-label="继续编辑"
                onClick={() => navigate(`/new?draftId=${draft.id}`)}
              >
                <PencilLine size={16} className="mr-1.5" />
                继续编辑
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-9 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={deletingId === draft.id}
                aria-label="删除"
                onClick={() => handleDelete(draft.id)}
              >
                <Trash2 size={16} className="mr-1.5" />
                删除
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DraftList;
