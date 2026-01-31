import React, { useState } from "react";
import Header from "@/components/question/Header";
import Tags from "@/components/question/Tags";
import Actions from "@/components/question/Actions";
import AnswerList from "@/components/question/AnswerList";
import ShareDialog from "@/components/question/ShareDialog";
import BottomBar from "@/components/question/BottomBar";
import AnswerDialog from "@/components/AnswerDialog";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuestionDetail, useCreateAnswer, useToggleFavorite } from "@/hooks/useQuestions";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 分享选项
const SHARE_OPTIONS = [
  { id: "internal", name: "站内用户", icon: <Users size={20} className="text-blue-500" /> },
  { id: "wechat", name: "微信", icon: <div className="w-5 h-5 bg-green-500 rounded-md flex items-center justify-center text-white font-bold text-xs">W</div> },
  { id: "qq", name: "QQ", icon: <div className="w-5 h-5 bg-blue-400 rounded-md flex items-center justify-center text-white font-bold text-xs">Q</div> },
  { id: "douyin", name: "抖音", icon: <div className="w-5 h-5 bg-black rounded-md flex items-center justify-center text-white font-bold text-xs">抖</div> }
];

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // 获取问题数据
  const { data, isLoading, error } = useQuestionDetail(id || '');
  const createAnswer = useCreateAnswer();
  const toggleFavorite = useToggleFavorite();

  // 状态管理
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [answerContent, setAnswerContent] = useState('');

  // 格式化时间
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: zhCN 
      });
    } catch {
      return '刚刚';
    }
  };

  // 格式化浏览量
  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  if (isLoading) {
    return (
      <div className="app-container bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app-container bg-background min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-destructive mb-4">问题加载失败</p>
        <button 
          onClick={() => navigate(-1)}
          className="text-primary hover:underline"
        >
          返回上一页
        </button>
      </div>
    );
  }

  const { question, answers } = data;

  // 回答弹窗提交
  const handleAnswerDialogSubmit = (payload: { timeSlots: string[]; message: string }) => {
    if (!user) {
      toast({ title: "请先登录", variant: "destructive" });
      navigate('/auth');
      return;
    }

    if (!payload.message.trim()) {
      toast({ title: "请输入回答内容", variant: "destructive" });
      return;
    }

    createAnswer.mutate({
      question_id: id!,
      content: payload.message
    }, {
      onSuccess: () => {
        setIsAnswerDialogOpen(false);
        setAnswerContent('');
      }
    });
  };

  // 收藏操作
  const handleCollect = () => {
    if (!user) {
      toast({ title: "请先登录", variant: "destructive" });
      navigate('/auth');
      return;
    }
    toggleFavorite.mutate(id!);
  };

  // 分享弹窗
  const handleShareDialog = () => setIsShareDialogOpen(true);

  // 分享
  const handleShareQuestion = (optionId: string) => {
    setIsShareDialogOpen(false);
    toast({ title: "分享链接已复制" });
  };

  // 查看用户资料
  const handleViewUserProfile = (userId: string) => {
    navigate(`/expert-profile/${userId}`);
  };

  // 回复
  const handleReply = (answerId: string) => {
    toast({ title: `回复回答` });
  };

  // 转换回答数据格式
  const formattedAnswers = answers.map(answer => ({
    id: answer.id,
    name: answer.profile_nickname || '匿名用户',
    avatar: answer.profile_avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
    title: '回答者',
    content: answer.content,
    time: formatTime(answer.created_at),
    viewCount: answer.likes_count,
    best: answer.is_accepted
  }));

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 pb-20 min-h-screen">
      <Header
        title="问题详情"
        asker={{
          name: question.profile_nickname || '匿名用户',
          avatar: question.profile_avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
          id: question.user_id
        }}
        time={formatTime(question.created_at)}
        viewCount={formatViewCount(question.view_count)}
        points={question.bounty_points}
        onBack={() => navigate(-1)}
        onViewUser={handleViewUserProfile}
      />
      <div className="p-4 bg-white shadow-sm mb-3 animate-fade-in">
        <h1 className="text-xl font-bold text-gray-800 mb-3 text-left">{question.title}</h1>
        <div className="text-sm text-gray-700 leading-relaxed text-left mb-3">
          {question.content && question.content.length > 100 && !isDescriptionExpanded ? (
            <>
              <p>{question.content.substring(0, 100)}...</p>
              <button
                className="text-blue-500 text-xs mt-2 hover:underline flex items-center"
                onClick={() => setIsDescriptionExpanded(true)}
                aria-label="展开全部描述"
              >
                展开全部
              </button>
            </>
          ) : (
            <>
              <p>{question.content || '暂无详细描述'}</p>
              {question.content && question.content.length > 100 && (
                <button
                  className="text-blue-500 text-xs mt-2 hover:underline flex items-center"
                  onClick={() => setIsDescriptionExpanded(false)}
                  aria-label="收起描述"
                >
                  收起
                </button>
              )}
            </>
          )}
        </div>
        <Tags tags={question.tags || []} />
        <Actions onCollect={handleCollect} onShare={handleShareDialog} />
      </div>
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg text-left">回答 ({answers.length})</h2>
          <button
            className="text-blue-500 text-xs flex items-center"
            aria-label="按热度排序"
          >
            按热度排序
          </button>
        </div>
        {formattedAnswers.length > 0 ? (
          <AnswerList
            answers={formattedAnswers}
            onViewUser={handleViewUserProfile}
            onReply={handleReply}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>暂无回答</p>
            <p className="text-sm mt-1">快来成为第一个回答者吧！</p>
          </div>
        )}
      </div>
      <BottomBar
        onAnswer={() => setIsAnswerDialogOpen(true)}
        onInvite={handleShareDialog}
        loading={createAnswer.isPending}
      />
      <AnswerDialog
        open={isAnswerDialogOpen}
        onOpenChange={setIsAnswerDialogOpen}
        askerTimeSlots={[
          { id: "today14", label: "今天 14:00-15:00" },
          { id: "today19", label: "今天 19:00-20:00" },
          { id: "weekend", label: "周末可约" }
        ]}
        onSubmit={handleAnswerDialogSubmit}
      />
      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        options={SHARE_OPTIONS}
        onShare={handleShareQuestion}
      />
    </div>
  );
};
export default QuestionDetail;
