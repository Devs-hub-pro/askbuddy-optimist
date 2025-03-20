import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, MessageSquare, Tag, Coins, Calendar, Clock, Check, X, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';

const NewQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [points, setPoints] = useState(10);
  const [customPoints, setCustomPoints] = useState('');
  const [timeFlexible, setTimeFlexible] = useState(true);
  const [showExampleDialog, setShowExampleDialog] = useState(false);
  const [similarQuestions, setSimilarQuestions] = useState<string[]>([]);
  
  const maxTitleLength = 20;
  const titleLength = title.length;
  const titlePercentage = Math.min((titleLength / maxTitleLength) * 100, 100);

  const allCategories = [
    { id: 'career', name: '职业发展', icon: '💼' },
    { id: 'education', name: '教育学习', icon: '📚' },
    { id: 'finance', name: '理财投资', icon: '💰' },
    { id: 'lifestyle', name: '生活服务', icon: '🏠' },
    { id: 'tech', name: '科技数码', icon: '💻' },
    { id: 'health', name: '健康医疗', icon: '🏥' },
    { id: 'travel', name: '旅游出行', icon: '✈️' },
    { id: 'entertainment', name: '娱乐休闲', icon: '🎮' }
  ];
  
  const timeSlots = [
    { id: 'morning', name: '上午 (9:00-12:00)', icon: '🌤️' },
    { id: 'afternoon', name: '下午 (14:00-18:00)', icon: '☀️' },
    { id: 'evening', name: '晚上 (19:00-22:00)', icon: '🌙' },
    { id: 'weekend', name: '周末', icon: '📅' }
  ];
  
  const questionExamples = [
    {
      title: "如何申请英国留学？",
      description: "我的GPA是3.5，想申请英国硕士项目，主要方向是商科，想了解如何选校以及申请流程中需要注意的关键点。"
    },
    {
      title: "简历优化有哪些关键点？",
      description: "我是应届毕业生，想申请互联网产品经理职位，但缺乏实习经验，如何在简历中突出自己的优势？"
    }
  ];
  
  useEffect(() => {
    if (title.length > 5) {
      const suggestions = [
        `${title}需要注意哪些问题？`,
        `如何高效解决${title.substring(0, 5)}相关问题？`,
        `${title}的最佳实践是什么？`
      ];
      setSimilarQuestions(suggestions);
    } else {
      setSimilarQuestions([]);
    }
  }, [title]);
  
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      if (selectedCategories.length < 2) {
        setSelectedCategories([...selectedCategories, categoryId]);
      }
    }
  };
  
  const handlePointsSelect = (amount: number) => {
    setPoints(amount);
    setCustomPoints('');
  };
  
  const handleCustomPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomPoints(value);
      if (value) {
        setPoints(parseInt(value));
      } else {
        setPoints(0);
      }
    }
  };
  
  const handleSubmit = () => {
    console.log({
      title,
      description,
      categories: selectedCategories,
      points,
      timeFlexible
    });
    
    navigate('/discover');
  };
  
  const fillExampleQuestion = (example: typeof questionExamples[0]) => {
    setTitle(example.title);
    setDescription(example.description);
    setShowExampleDialog(false);
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 flex items-center shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={22} />
        </Button>
        <h1 className="text-lg font-semibold">提问</h1>
      </div>
      
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-medium flex items-center gap-1">
              <BookOpen size={16} className="text-app-teal" />
              问题标题
            </label>
            <span className={`text-xs ${titleLength > maxTitleLength ? 'text-red-500' : 'text-gray-500'}`}>
              {titleLength}/{maxTitleLength}
            </span>
          </div>
          
          <div className="relative">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="如何申请英国留学？"
              className="pr-12 transition-all duration-300"
              maxLength={30}
            />
            {title.length > 0 && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setTitle('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${titlePercentage > 90 ? 'bg-red-500' : 'bg-app-teal'}`} 
              style={{ width: `${titlePercentage}%` }}
            ></div>
          </div>
          
          {similarQuestions.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Lightbulb size={14} className="text-app-orange" />
                类似问题:
              </p>
              <div className="space-y-1">
                {similarQuestions.map((question, index) => (
                  <div 
                    key={index}
                    className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg cursor-pointer hover:bg-blue-100"
                    onClick={() => setTitle(question)}
                  >
                    {question}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-medium flex items-center gap-1">
              <MessageSquare size={16} className="text-app-teal" />
              详细描述
            </label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-app-teal h-7 px-2"
              onClick={() => setShowExampleDialog(true)}
            >
              查看问题示例
            </Button>
          </div>
          
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="提供更多背景信息，帮助达人更好地回答您的问题..."
            className={`transition-all duration-300 ${expandedDescription ? 'min-h-[200px]' : 'min-h-[100px]'}`}
          />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-gray-500 w-full h-7" 
            onClick={() => setExpandedDescription(!expandedDescription)}
          >
            {expandedDescription ? '收起' : '展开更多'}
          </Button>
        </div>
        
        <div className="space-y-3">
          <label className="font-medium flex items-center gap-1">
            <Tag size={16} className="text-app-teal" />
            选择分类 (最多选2个)
          </label>
          
          <div className="grid grid-cols-4 gap-2">
            {allCategories.map(category => (
              <div
                key={category.id}
                className={`p-2 rounded-lg text-center cursor-pointer transition-all duration-200 border ${
                  selectedCategories.includes(category.id) 
                    ? 'border-app-teal bg-app-teal/10 text-app-teal' 
                    : 'border-gray-200 hover:border-app-teal/50'
                }`}
                onClick={() => toggleCategory(category.id)}
              >
                <div className="text-xl mb-1">{category.icon}</div>
                <div className="text-xs">{category.name}</div>
                {selectedCategories.includes(category.id) && (
                  <div className="absolute top-1 right-1">
                    <Check size={12} className="text-app-teal" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="font-medium flex items-center gap-1">
            <Coins size={16} className="text-app-teal" />
            悬赏积分
          </label>
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {[5, 10, 30, 50].map(amount => (
                <Button
                  key={amount}
                  variant={points === amount && !customPoints ? "default" : "outline"}
                  className={`w-[68px] ${
                    points === amount && !customPoints 
                      ? 'bg-gradient-to-r from-app-teal to-app-blue text-white' 
                      : ''
                  }`}
                  onClick={() => handlePointsSelect(amount)}
                >
                  {amount}
                </Button>
              ))}
              
              <div className="relative">
                <Input
                  value={customPoints}
                  onChange={handleCustomPointsChange}
                  placeholder="自定义"
                  className="w-[68px]"
                />
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg">
              <p className="text-xs text-orange-700 flex items-center gap-1">
                <Lightbulb size={14} />
                悬赏积分越高，问题的吸引力越大，回答速度越快！
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="font-medium flex items-center gap-1">
            <Calendar size={16} className="text-app-teal" />
            预约咨询时间 (可选)
          </label>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="timeFlexible"
                checked={timeFlexible}
                onChange={() => setTimeFlexible(!timeFlexible)}
                className="rounded border-gray-300 text-app-teal focus:ring-app-teal"
              />
              <label htmlFor="timeFlexible" className="text-sm cursor-pointer">
                时间可商讨 (专家可自由回答)
              </label>
            </div>
            
            {!timeFlexible && (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <div
                    key={slot.id}
                    className="p-2 border border-gray-200 rounded-lg flex items-center gap-2 cursor-pointer hover:border-app-teal/50"
                  >
                    <span>{slot.icon}</span>
                    <span className="text-sm">{slot.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            className="w-full bg-gradient-to-r from-app-teal to-app-blue hover:opacity-90 py-6"
            onClick={handleSubmit}
            disabled={!title.trim() || titleLength > maxTitleLength}
          >
            发布问题
          </Button>
        </div>
      </div>
      
      <Dialog open={showExampleDialog} onOpenChange={setShowExampleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>问题示例</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-2">
            <Tabs defaultValue="example1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="example1">示例 1</TabsTrigger>
                <TabsTrigger value="example2">示例 2</TabsTrigger>
              </TabsList>
              
              {questionExamples.map((example, index) => (
                <TabsContent key={index} value={`example${index + 1}`} className="border rounded-lg p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-app-blue">{example.title}</h3>
                    <p className="text-sm text-gray-700 mt-2">{example.description}</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-app-teal to-app-blue hover:opacity-90"
                    onClick={() => fillExampleQuestion(example)}
                  >
                    使用这个示例
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewQuestion;
