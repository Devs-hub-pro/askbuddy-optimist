import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PlusCircle, 
  Tag, 
  Calendar, 
  ImagePlus, 
  File, 
  Mic, 
  Clock, 
  Info, 
  Coins,
  X,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCreateQuestion } from '@/hooks/useQuestions';
import { useAuth } from '@/contexts/AuthContext';

// Define categories with emojis - 与首页筛选保持一致
const categories = [
  { id: 'education', name: '教育学习', emoji: '📚' },
  { id: 'career', name: '职业发展', emoji: '💼' },
  { id: 'lifestyle', name: '生活服务', emoji: '🏡' },
  { id: 'hobbies', name: '兴趣技能', emoji: '🎨' },
];

// Example placeholder questions to help users
const placeholderQuestions = [
  '如何申请英国留学？',
  '简历优化有哪些关键点？',
  '年轻人第一份工作应该注重什么？',
  '如何平衡工作与生活？',
  '考研需要提前准备什么？'
];

// Point reward recommendation tiers
const pointRecommendations = [
  { value: 5, description: '基础悬赏，适合简单问题' },
  { value: 10, description: '中等悬赏，获得更多关注' },
  { value: 30, description: '高额悬赏，优先推荐给专家' },
  { value: 50, description: '精英悬赏，最快获得回复' }
];

// Time slot options for consultation
const timeSlots = [
  { id: 'morning', name: '上午 (9:00-12:00)', value: 'morning' },
  { id: 'afternoon', name: '下午 (14:00-18:00)', value: 'afternoon' },
  { id: 'evening', name: '晚上 (19:00-22:00)', value: 'evening' },
];

const NewQuestion: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const createQuestion = useCreateQuestion();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [pointReward, setPointReward] = useState('10');
  const [flexibleTime, setFlexibleTime] = useState(true);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [titleFocused, setTitleFocused] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>(['留学', '职场', '考研']);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // Handle random placeholder for title input
  const getRandomPlaceholder = () => {
    const randomIndex = Math.floor(Math.random() * placeholderQuestions.length);
    return placeholderQuestions[randomIndex];
  };
  
  // Handle tag selection (max 5)
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        if (prev.length >= 5) {
          toast({
            title: "最多选择5个标签",
            description: "请删除一个标签后再添加",
            variant: "destructive"
          });
          return prev;
        }
        return [...prev, tag];
      }
    });
  };
  
  // Add custom tag
  const addCustomTag = () => {
    if (!customTag.trim()) return;
    
    if (selectedTags.includes(customTag.trim())) {
      toast({
        title: "标签已存在",
        description: "请输入不同的标签",
      });
      return;
    }
    
    if (selectedTags.length >= 5) {
      toast({
        title: "最多选择5个标签",
        description: "请删除一个标签后再添加",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedTags(prev => [...prev, customTag.trim()]);
    setCustomTag('');
  };
  
  // Handle time slot selection
  const toggleTimeSlot = (slotId: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };
  
  // File upload handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
      
      toast({
        title: "文件已添加",
        description: `成功添加 ${newFiles.length} 个文件`,
      });
    }
  };
  
  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Fill example content
  const fillExampleContent = () => {
    setTitle('请推荐适合初学者的Python学习资源');
    setDescription('我是一名大学生，没有编程基础，想自学Python用于数据分析。希望能推荐一些适合零基础的学习资源，包括书籍、在线课程或视频教程。我每周能投入约10小时学习，希望3个月内能达到能独立完成简单项目的水平。');
    setSuggestedTags(['Python', '编程', '自学', '数据分析', '学习资源']);
    setSelectedTags(['Python', '编程', '自学']);
  };
  
  // Auto-suggest tags based on title and description
  const autoSuggestTags = () => {
    // This would be connected to a backend AI service in a real app
    // For now, we'll just simulate some suggested tags based on keywords
    const combinedText = `${title} ${description}`.toLowerCase();
    const suggestedTags = [];
    
    if (combinedText.includes('英国') || combinedText.includes('留学')) 
      suggestedTags.push('留学');
    
    if (combinedText.includes('简历') || combinedText.includes('工作')) 
      suggestedTags.push('职场');
    
    if (combinedText.includes('编程') || combinedText.includes('代码')) 
      suggestedTags.push('编程');
    
    if (combinedText.includes('考研') || combinedText.includes('研究生')) 
      suggestedTags.push('考研');
    
    if (combinedText.includes('python') || combinedText.includes('数据分析')) {
      suggestedTags.push('Python');
      suggestedTags.push('数据分析');
    }
    
    setSuggestedTags(suggestedTags.slice(0, 5));
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "登录后才能发布问题",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!title.trim()) {
      toast({
        title: "请输入问题标题",
        description: "问题标题不能为空",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedCategory) {
      toast({
        title: "请选择问题分类",
        description: "选择分类有助于问题被更多人看到",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedTags.length === 0) {
      toast({
        title: "请选择至少一个标签",
        description: "选择合适的标签有助于您获得更精准的回答",
        variant: "destructive"
      });
      return;
    }
    
    // 提交到数据库
    createQuestion.mutate({
      title: title.trim(),
      content: description.trim() || undefined,
      category: selectedCategory || undefined,
      tags: selectedTags,
      bounty_points: parseInt(pointReward) || 0
    }, {
      onSuccess: () => {
        navigate('/');
      }
    });
  };
  
  // Save as draft
  const saveDraft = () => {
    toast({
      title: "已保存草稿",
      description: "您可以稍后继续编辑",
    });
    navigate('/discover');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-app-teal px-4 py-3 border-b flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-white"
        >
          <ArrowLeft size={20} />
          <span className="ml-2">返回</span>
        </button>
        <h1 className="text-lg font-medium text-center flex-1 text-white">发布问题</h1>
        <button 
          onClick={saveDraft}
          className="text-white/80 text-sm"
        >
          存草稿
        </button>
      </div>
      
      <div className="p-4 space-y-6">
        {/* 1. Question Title */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start mb-1">
            <h2 className="text-lg font-medium">问题标题</h2>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <p className="text-gray-500 text-sm mb-3">简洁明了的标题更容易获得回答（20字以内）</p>
          
          <div className="relative">
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.length > 10) {
                  autoSuggestTags();
                }
              }}
              placeholder={getRandomPlaceholder()}
              maxLength={40}
              className="text-base p-3 border-gray-300 focus:border-purple-400 rounded-xl"
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
            />
            <div className="absolute right-3 top-3 text-xs text-gray-400">
              {title.length}/40
            </div>
            
            {titleFocused && title.length > 0 && (
              <div className="mt-2 rounded-lg bg-gray-50 p-2 border border-gray-100">
                <p className="text-xs text-gray-500 mb-2">可能类似的问题：</p>
                <ul className="space-y-2">
                  <li className="text-sm text-indigo-600 hover:underline cursor-pointer">如何提高英语口语水平？</li>
                  <li className="text-sm text-indigo-600 hover:underline cursor-pointer">自学编程需要什么基础？</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* 1.5. Category Selection - 分类选择 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start mb-1">
            <h2 className="text-lg font-medium">问题分类</h2>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <p className="text-muted-foreground text-sm mb-3">选择问题所属分类，便于他人找到您的问题</p>
          
          <div className="grid grid-cols-2 gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  selectedCategory === category.id 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                }`}
              >
                <span className="text-xl">{category.emoji}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* 2. Detailed Description */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">详细描述</h2>
            <button 
              onClick={fillExampleContent}
              className="text-sm text-indigo-500 flex items-center"
            >
              <Info size={14} className="mr-1" />
              查看示例
            </button>
          </div>
          <p className="text-gray-500 text-sm mb-3">补充背景信息，帮助他人更好地理解您的问题</p>
          
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.length > 50) {
                autoSuggestTags();
              }
            }}
            placeholder="提供背景信息，如'我的GPA是3.5，想申请英国硕士，如何选校？'"
            className="min-h-[120px] border-gray-300 text-base p-3 focus:border-purple-400 rounded-xl"
          />
          <div className="text-right mt-1">
            <span className="text-xs text-gray-400">{description.length}/1000</span>
          </div>
        </div>
        
        {/* 3. Tags Selection - Redesigned */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start mb-1">
            <h2 className="text-lg font-medium">选择标签</h2>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <p className="text-gray-500 text-sm mb-3">最多选择5个标签，帮助问题被合适的人看到</p>
          
          {/* Current selected tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button onClick={() => toggleTag(tag)} className="ml-1 text-purple-500 hover:text-purple-700">
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          {/* Custom tag input */}
          <div className="flex gap-2 mb-4">
            <Input
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="添加自定义标签..."
              className="flex-1 border-gray-300 focus:border-purple-400 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
            />
            <Button 
              onClick={addCustomTag}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
            >
              添加
            </Button>
          </div>
          
          {/* AI Suggested Tags */}
          {title.length > 0 && suggestedTags.length > 0 && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm font-medium mb-2 flex items-center">
                <Tag size={14} className="text-indigo-600 mr-1" />
                AI 推荐标签
              </p>
              <div className="flex gap-2 flex-wrap">
                {suggestedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                      selectedTags.includes(tag) 
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300' 
                        : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Popular Categories */}
          <div>
            <p className="text-sm font-medium mb-2 text-gray-700">热门分类</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className={`px-3 py-1.5 rounded-full flex items-center cursor-pointer ${
                    selectedTags.includes(category.name)
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-300' 
                      : 'border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                  onClick={() => toggleTag(category.name)}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* 4. Point Reward - Simplified */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">悬赏积分</h2>
            <button className="text-sm text-app-teal flex items-center">
              <Coins size={14} className="mr-1" />
              我的积分: 100
            </button>
          </div>
          <p className="text-gray-500 text-sm mb-3">设置悬赏可提高问题曝光度和回答质量</p>
          
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                type="number"
                min="1"
                value={pointReward}
                onChange={(e) => setPointReward(e.target.value)}
                placeholder="输入积分数量"
                className="w-full border-gray-300 focus:border-app-teal rounded-xl text-lg p-3"
              />
            </div>
            <span className="text-lg font-medium text-gray-700">积分</span>
          </div>
          
          {/* Reward recommendations */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {pointRecommendations.map(rec => (
              <button
                key={rec.value}
                onClick={() => setPointReward(rec.value.toString())}
                className={`p-2 rounded-lg border text-left ${
                  parseInt(pointReward) === rec.value 
                    ? 'border-app-teal/30 bg-app-teal/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="block font-medium">{rec.value} 积分</span>
                <span className="text-xs text-gray-500">{rec.description}</span>
              </button>
            ))}
          </div>
          
          {/* Response time estimate */}
          <div className="mt-4 bg-gradient-to-r from-app-teal/10 to-app-teal/5 border border-app-teal/20 p-3 rounded-lg">
            <p className="text-sm text-app-teal">
              💡 提示：悬赏 {pointReward} 积分的问题平均在
              {parseInt(pointReward) >= 30 ? ' 2 小时内 ' : ' 12 小时内 '}
              获得首次回答
            </p>
          </div>
        </div>
        
        {/* 5-6. Consultation & Attachments - SIDE BY SIDE layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 5. Schedule Consultation */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3">预约咨询</h2>
            <p className="text-gray-500 text-sm mb-3">您可以选择预约时间段，与专家一对一交流</p>
            
            <div className="flex items-center mb-4">
              <Checkbox 
                checked={flexibleTime} 
                onCheckedChange={(checked) => {
                  setFlexibleTime(!!checked);
                  if (checked) {
                    setSelectedTimeSlots([]);
                  }
                }}
                id="flexible-time"
                className="mr-2 text-app-teal"
              />
              <Label htmlFor="flexible-time" className="cursor-pointer">
                时间可商量（回答者可自由解答）
              </Label>
            </div>
            
            {!flexibleTime && (
              <div>
                <p className="text-sm text-gray-600 mb-2">选择您方便的时间段：</p>
                <div className="space-y-2">
                  {timeSlots.map(slot => (
                    <div 
                      key={slot.id}
                      className={`border rounded-lg p-3 flex items-center ${
                        selectedTimeSlots.includes(slot.value)
                          ? 'border-app-teal/30 bg-app-teal/10'
                          : 'border-gray-200'
                      }`}
                      onClick={() => toggleTimeSlot(slot.value)}
                    >
                      <Checkbox 
                        checked={selectedTimeSlots.includes(slot.value)}
                        onCheckedChange={() => toggleTimeSlot(slot.value)}
                        id={`time-${slot.id}`}
                        className="mr-2 text-app-teal"
                      />
                      <Label htmlFor={`time-${slot.id}`} className="flex-1 cursor-pointer flex items-center">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span>{slot.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 6. Attachments Upload */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3">附件上传</h2>
            <p className="text-gray-500 text-sm mb-3">添加图片或文件补充说明您的问题</p>
            
            <Tabs defaultValue="image" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="image" className="text-sm data-[state=active]:bg-app-teal data-[state=active]:text-white">图片</TabsTrigger>
                <TabsTrigger value="file" className="text-sm data-[state=active]:bg-app-teal data-[state=active]:text-white">文件</TabsTrigger>
                <TabsTrigger value="audio" className="text-sm data-[state=active]:bg-app-teal data-[state=active]:text-white">语音</TabsTrigger>
              </TabsList>
              
              <TabsContent value="image" className="mt-0">
                <div className="flex flex-wrap gap-3">
                  {/* Display uploaded images */}
                  {attachments.filter(file => file.type.startsWith('image/')).map((file, index) => (
                    <div key={index} className="relative h-20 w-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Attachment ${index}`}
                        className="h-full w-full object-cover"
                      />
                      <button 
                        onClick={() => removeAttachment(index)}
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {/* Add image button */}
                  <label className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50">
                    <ImagePlus size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">添加图片</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload}
                      multiple
                    />
                  </label>
                </div>
              </TabsContent>
              
              <TabsContent value="file" className="mt-0">
                <div className="space-y-3">
                  {/* Display uploaded files */}
                  {attachments.filter(file => !file.type.startsWith('image/') && !file.type.startsWith('audio/')).map((file, index) => (
                    <div key={index} className="flex items-center p-2 border rounded-lg">
                      <File size={20} className="text-gray-400 mr-2" />
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <button 
                        onClick={() => removeAttachment(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {/* Add file button */}
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50">
                    <File size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 mb-1">点击上传文件</span>
                    <span className="text-xs text-gray-400">支持 PDF、Word、Excel 等格式</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileUpload}
                      multiple
                    />
                  </label>
                </div>
              </TabsContent>
              
              <TabsContent value="audio" className="mt-0">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50">
                  <Mic size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 mb-1">点击录制语音</span>
                  <span className="text-xs text-gray-400">或上传已有语音文件</span>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-center">
        <Button 
          onClick={handleSubmit}
          disabled={createQuestion.isPending}
          className="w-full bg-app-teal hover:bg-app-teal/90 text-white font-medium py-5 rounded-full flex items-center justify-center shadow-lg"
        >
          {createQuestion.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              发布中...
            </>
          ) : (
            '立即发布问题'
          )}
        </Button>
      </div>
    </div>
  );
};

export default NewQuestion;
