
import React, { useState } from "react";
import Header from "@/components/question/Header";
import Tags from "@/components/question/Tags";
import Actions from "@/components/question/Actions";
import AnswerList from "@/components/question/AnswerList";
import ShareDialog from "@/components/question/ShareDialog";
import BottomBar from "@/components/question/BottomBar";
import AnswerDialog from "@/components/AnswerDialog";
import { useParams, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 问题mock数据与答案mock数据分离管理
const MOCK_QUESTION = {
  id: "1",
  title: "如何有效管理考研复习时间？",
  description: "我是23届考研生，感觉每天都很忙但效率不高，有没有好的时间管理方法？我尝试过番茄钟，但好像不是很有效。如何分配各科目的时间？要不要制定详细的计划表？如何避免学习倦怠？希望有过来人分享一下经验。除了管理时间外，如何克服复习中的焦虑也是我很困扰的问题。平衡好考研和生活的边界似乎很难。",
  asker: {
    name: "小李",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    id: "user123"
  },
  time: "2小时前",
  tags: ["考研", "时间管理", "学习方法", "焦虑"],
  answers: 12,
  viewCount: "3.8k",
  points: 30,
  category: "kaoyan",
  availableTimeSlots: [
    { id: "today14", label: "今天 14:00-15:00" },
    { id: "today19", label: "今天 19:00-20:00" },
    { id: "weekend", label: "周末全天" }
  ]
};

const MOCK_ANSWERS = [
  {
    id: "a1",
    name: "老师1",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    title: "考研辅导老师",
    content: (
      <>
        考研复习时间管理非常重要，我建议：
        <br />1. 先做整体规划，按照科目难度分配时间比例
        <br />2. 使用"2-1-2"法则：2小时专注学习，1小时休息，再2小时
        <br />3. 每天留出固定时间进行题目练习
        <br />4. 周末做总结和查漏补缺
        <br />5. 保证充足睡眠，提高学习效率
      </>
    ),
    time: "2天前",
    viewCount: 256,
    best: true
  },
  {
    id: "a2",
    name: "老师2",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    title: "考研辅导老师",
    content: "根据自己情况制定合理计划，保持规律作息，劳逸结合是关键。",
    time: "1天前",
    viewCount: 98,
  },
  {
    id: "a3",
    name: "老师3",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    title: "学长",
    content: "建议做好重点笔记，不要死磕任务量，合理分科并注意自我调节。",
    time: "半天前",
    viewCount: 45,
  }
];

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

  // 状态管理
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 模拟后端数据获取
  const question = MOCK_QUESTION;

  // 回答弹窗提交
  const handleAnswerDialogSubmit = (payload: { timeSlots: string[]; message: string }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsAnswerDialogOpen(false);
      toast({ title: "提交成功，感谢您的回答！" });
    }, 800);
    // 可以在此调API
  };

  // 收藏操作
  const handleCollect = () => {
    toast({ title: "已收藏" });
  };

  // 分享弹窗
  const handleShareDialog = () => setIsShareDialogOpen(true);

  // 分享
  const handleShareQuestion = (optionId: string) => {
    // 已在弹窗内 toast，若需后端可在此调 API
    setIsShareDialogOpen(false);
  };

  // 查看用户资料
  const handleViewUserProfile = (userId: string) => {
    navigate(`/expert-profile/${userId}`);
  };

  // 回复
  const handleReply = (answerId: string) => {
    toast({ title: `回复回答ID:${answerId}` });
    // 可以直接弹出留言等
  };

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 pb-20 min-h-screen">
      <Header
        title="问题详情"
        asker={question.asker}
        time={question.time}
        viewCount={question.viewCount}
        points={question.points}
        onBack={() => navigate(-1)}
        onViewUser={handleViewUserProfile}
      />
      <div className="p-4 bg-white shadow-sm mb-3 animate-fade-in">
        <h1 className="text-xl font-bold text-gray-800 mb-3 text-left">{question.title}</h1>
        <div className="text-sm text-gray-700 leading-relaxed text-left mb-3">
          {question.description.length > 100 && !isDescriptionExpanded ? (
            <>
              <p>{question.description.substring(0, 100)}...</p>
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
              <p>{question.description}</p>
              {question.description.length > 100 && (
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
        <Tags tags={question.tags} />
        <Actions onCollect={handleCollect} onShare={handleShareDialog} />
      </div>
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg text-left">回答 ({question.answers})</h2>
          <button
            className="text-blue-500 text-xs flex items-center"
            aria-label="按热度排序"
          >
            按热度排序
          </button>
        </div>
        <AnswerList
          answers={MOCK_ANSWERS}
          onViewUser={handleViewUserProfile}
          onReply={handleReply}
        />
      </div>
      <BottomBar
        onAnswer={() => setIsAnswerDialogOpen(true)}
        onInvite={handleShareDialog}
        loading={loading}
      />
      <AnswerDialog
        open={isAnswerDialogOpen}
        onOpenChange={setIsAnswerDialogOpen}
        askerTimeSlots={question.availableTimeSlots}
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
