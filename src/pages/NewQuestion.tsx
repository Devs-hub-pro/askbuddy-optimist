import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Text, Tag, Coins, Calendar, ChevronDown, ChevronUp, Clock, ArrowLeft, Lightbulb, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

// Define types for our form state
interface QuestionForm {
  title: string;
  description: string;
  categories: string[];
  points: number;
  customPoints?: number;
  scheduleConsultation: boolean;
  timeSlots: string[];
  isFlexible: boolean;
}

// Sample categories for selection
const CATEGORIES = [
  { id: '1', name: '留学', color: 'bg-soft-blue' },
  { id: '2', name: '简历优化', color: 'bg-soft-green' },
  { id: '3', name: '职业规划', color: 'bg-soft-purple' },
  { id: '4', name: '考研', color: 'bg-soft-yellow' },
  { id: '5', name: '求职', color: 'bg-soft-pink' },
  { id: '6', name: '面试技巧', color: 'bg-soft-orange' },
  { id: '7', name: '学习方法', color: 'bg-soft-peach' },
  { id: '8', name: '生活技能', color: 'bg-app-light-bg' }
];

// Sample popular questions for auto-complete suggestions
const POPULAR_QUESTIONS = [
  '如何申请英国留学？',
  '简历优化有哪些关键点？',
  '考研英语备考策略？',
  'CS专业如何提高竞争力？',
  '如何选择适合自己的职业方向？',
  '校招和社招有什么区别？'
];

// Sample time slots for consultation scheduling
const TIME_SLOTS = [
  '上午 9:00-10:00',
  '上午 10:00-11:00',
  '上午 11:00-12:00',
  '下午 2:00-3:00',
  '下午 3:00-4:00',
  '下午 4:00-5:00',
  '晚上 7:00-8:00',
  '晚上 8:00-9:00',
];

const NewQuestion: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize form state
  const [form, setForm] = useState<QuestionForm>({
    title: '',
    description: '',
    categories: [],
    points: 10, // Default points
    scheduleConsultation: false,
    timeSlots: [],
    isFlexible: true
  });
  
  // State for UI interactions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [expandDescription, setExpandDescription] = useState(false);
  const [showCategoryRecommendations, setShowCategoryRecommendations] = useState(false);
  const [customPointsMode, setCustomPointsMode] = useState(false);
  const [recommendedCategories, setRecommendedCategories] = useState<string[]>([]);
  
  // Effect to simulate AI-based category recommendations based on title and description
  useEffect(() => {
    if (form.title.length > 5 || form.description.length > 10) {
      // This would be replaced with actual AI processing
      const titleLower = form.title.toLowerCase();
      const descLower = form.description.toLowerCase();
      
      const recommended = CATEGORIES.filter(cat => 
        titleLower.includes(cat.name.toLowerCase()) || 
        descLower.includes(cat.name.toLowerCase())
      ).slice(0, 2).map(cat => cat.id);
      
      if (recommended.length > 0 && JSON.stringify(recommended) !== JSON.stringify(recommendedCategories)) {
        setRecommendedCategories(recommended);
        setShowCategoryRecommendations(true);
      }
    }
  }, [form.title, form.description]);
  
  // Handle title change with auto-complete functionality
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update form state
    setForm(prev => ({ ...prev, title: value }));
    
    // Filter suggestions if input has at least 2 characters
    if (value.length >= 2) {
      const filtered = POPULAR_QUESTIONS.filter(q => 
        q.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };
  
  // Select a suggestion to fill the title
  const selectSuggestion = (suggestion: string) => {
    setForm(prev => ({ ...prev, title: suggestion }));
    setShowSuggestions(false);
  };
  
  // Handle description changes
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, description: value }));
  };
  
  // Fill with an example description
  const fillExampleDescription = () => {
    setForm(prev => ({ 
      ...prev, 
      description: '我的GPA是3.5，英语六级成绩560分，想申请英国硕士商科专业，预算30万人民币以内。我比较倾向于伦敦或曼切斯特的学校，希望能获得就业机会。请问以我的条件，应该如何选校？有哪些学校比较适合我？' 
    }));
  };
  
  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setForm(prev => {
      // If category is already selected, remove it
      if (prev.categories.includes(categoryId)) {
        return { ...prev, categories: prev.categories.filter(id => id !== categoryId) };
      }
      
      // If not selected and we have less than 2 categories, add it
      if (prev.categories.length < 2) {
        return { ...prev, categories: [...prev.categories, categoryId] };
      }
      
      // Otherwise, show a toast about the limit
      toast({
        title: "最多可选择两个分类",
        description: "请先取消一个已选分类，再添加新分类",
        variant: "destructive"
      });
      
      return prev;
    });
  };
  
  // Apply recommended categories
  const applyRecommendedCategories = () => {
    setForm(prev => ({ ...prev, categories: recommendedCategories }));
    setShowCategoryRecommendations(false);
  };
  
  // Handle points selection
  const selectPoints = (points: number) => {
    setForm(prev => ({ ...prev, points }));
    setCustomPointsMode(false);
  };
  
  // Toggle custom points mode
  const toggleCustomPoints = () => {
    setCustomPointsMode(!customPointsMode);
    if (!customPointsMode) {
      setForm(prev => ({ ...prev, customPoints: prev.points }));
    }
  };
  
  // Handle custom points change
  const handleCustomPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setForm(prev => ({ ...prev, customPoints: value, points: value }));
  };
  
  // Toggle time slot selection
  const toggleTimeSlot = (slot: string) => {
    setForm(prev => {
      if (prev.timeSlots.includes(slot)) {
        return { ...prev, timeSlots: prev.timeSlots.filter(s => s !== slot) };
      }
      return { ...prev, timeSlots: [...prev.timeSlots, slot] };
    });
  };
  
  // Toggle flexible scheduling option
  const toggleFlexible = () => {
    setForm(prev => ({ ...prev, isFlexible: !prev.isFlexible }));
  };
  
  // Toggle consultation scheduling section
  const toggleScheduleConsultation = () => {
    setForm(prev => ({ 
      ...prev, 
      scheduleConsultation: !prev.scheduleConsultation,
      // Reset time slots if turning off scheduling
      timeSlots: !prev.scheduleConsultation ? prev.timeSlots : []
    }));
  };
  
  // Submit the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (form.title.trim() === '') {
      toast({
        title: "请输入问题标题",
        description: "问题标题不能为空",
        variant: "destructive"
      });
      return;
    }
    
    if (form.categories.length === 0) {
      toast({
        title: "请选择至少一个分类",
        description: "问题分类有助于找到合适的回答者",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, here we would submit to an API
    console.log('Submitting question:', form);
    
    // Show success message
    toast({
      title: "问题发布成功！",
      description: "您的问题已发布，专家很快会为您解答",
    });
    
    // Navigate back to home or to the question detail page
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600"
          >
            <ArrowLeft size={20} />
            <span className="ml-2">返回</span>
          </button>
          <h1 className="text-lg font-medium">发布问题</h1>
          <div className="w-20"></div> {/* Placeholder for balance */}
        </div>
      </div>
      
      {/* Main Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* 1. Question Title Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start mb-2">
            <BookOpen className="text-purple-500 mt-1" size={20} />
            <div className="ml-2">
              <Label htmlFor="title" className="text-base font-medium">问题标题</Label>
              <p className="text-gray-500 text-sm">简洁明了的标题更容易获得回答</p>
            </div>
          </div>
          
          <div className="relative mt-2">
            <Input
              id="title"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="如何申请英国留学？"
              className="text-base py-3 px-4 focus:ring-purple-500"
              maxLength={50}
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {form.title.length}/50
            </div>
            
            {/* Auto-complete suggestions */}
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {filteredSuggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 2. Detailed Description Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start mb-2">
            <Text className="text-purple-500 mt-1" size={20} />
            <div className="ml-2">
              <Label htmlFor="description" className="text-base font-medium">详细描述</Label>
              <p className="text-gray-500 text-sm">补充必要的背景信息，帮助回答者更好地理解</p>
            </div>
          </div>
          
          <div className="mt-2">
            <Textarea
              id="description"
              value={form.description}
              onChange={handleDescriptionChange}
              placeholder="提供背景信息，如'我的GPA是3.5，想申请英国硕士，如何选校？'"
              className={`text-base py-3 px-4 focus:ring-purple-500 transition-all duration-300 ${expandDescription ? 'min-h-[200px]' : 'min-h-[120px]'}`}
              maxLength={expandDescription ? 1000 : 200}
            />
            <div className="flex justify-between items-center mt-1">
              <button 
                type="button"
                onClick={() => setExpandDescription(!expandDescription)}
                className="text-purple-500 text-sm flex items-center"
              >
                {expandDescription ? (
                  <>
                    <ChevronUp size={16} />
                    <span className="ml-1">收起</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    <span className="ml-1">展开更多</span>
                  </>
                )}
              </button>
              <div className="text-xs text-gray-400">
                {form.description.length}/{expandDescription ? 1000 : 200}
              </div>
            </div>
            
            {/* Example button */}
            <div className="mt-3 p-3 bg-purple-50 rounded-lg flex items-start">
              <Lightbulb className="text-purple-500 shrink-0 mt-0.5" size={18} />
              <div className="ml-2">
                <p className="text-sm font-medium text-purple-700">提问示例</p>
                <p className="text-xs text-gray-600 mt-1">
                  高质量提问示范：清晰表达你的情况、目标和需求，帮助回答者给出针对性建议
                </p>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  onClick={fillExampleDescription}
                  className="mt-2 text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  查看示例
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 3. Categories Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start mb-2">
            <Tag className="text-purple-500 mt-1" size={20} />
            <div className="ml-2">
              <Label className="text-base font-medium">选择分类</Label>
              <p className="text-gray-500 text-sm">最多可选择两个分类</p>
            </div>
          </div>
          
          {/* Category recommendations */}
          {showCategoryRecommendations && recommendedCategories.length > 0 && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg flex items-start">
              <Lightbulb className="text-purple-500 shrink-0 mt-0.5" size={18} />
              <div className="ml-2">
                <p className="text-sm font-medium text-purple-700">智能推荐分类</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {recommendedCategories.map(catId => {
                    const category = CATEGORIES.find(c => c.id === catId);
                    return category ? (
                      <span key={category.id} className="text-xs px-2 py-1 rounded-full bg-white text-purple-700 border border-purple-200">
                        #{category.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  onClick={applyRecommendedCategories}
                  className="mt-2 text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  应用推荐
                </Button>
              </div>
            </div>
          )}
          
          {/* Category grid */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`p-3 rounded-lg flex items-center justify-between transition-all ${
                  form.categories.includes(category.id)
                    ? `${category.color} border-2 border-purple-400`
                    : 'bg-gray-50 border border-gray-200 hover:border-purple-200'
                }`}
              >
                <span className="font-medium text-sm">#{category.name}</span>
                {form.categories.includes(category.id) && (
                  <Check className="text-purple-600" size={18} />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* 4. Reward Points Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start mb-2">
            <Coins className="text-purple-500 mt-1" size={20} />
            <div className="ml-2">
              <Label className="text-base font-medium">悬赏积分</Label>
              <p className="text-gray-500 text-sm">悬赏积分越高，问题曝光度越高</p>
            </div>
          </div>
          
          {/* Reward info card */}
          <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-purple-700">吸引力指数</div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full mx-0.5 ${
                      (form.points >= 30 && i < 5) || 
                      (form.points >= 20 && i < 4) || 
                      (form.points >= 10 && i < 3) || 
                      (form.points >= 5 && i < 2) || 
                      i < 1 
                        ? 'bg-purple-500' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {form.points >= 30 
                ? '高分悬赏问题，平均回答时间更快！'
                : form.points >= 10
                  ? '合理悬赏，提高问题曝光度'
                  : '小额悬赏，适合简单问题'}
            </p>
          </div>
          
          {/* Points selection */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            {[5, 10, 30, 50].map(point => (
              <button
                key={point}
                type="button"
                onClick={() => selectPoints(point)}
                className={`py-2 rounded-lg text-center transition-all ${
                  form.points === point && !customPointsMode
                    ? 'bg-purple-100 border-2 border-purple-400 text-purple-700 font-medium'
                    : 'bg-gray-50 border border-gray-200 hover:border-purple-200'
                }`}
              >
                {point}
              </button>
            ))}
            <button
              type="button"
              onClick={toggleCustomPoints}
              className={`py-2 rounded-lg text-center transition-all ${
                customPointsMode
                  ? 'bg-purple-100 border-2 border-purple-400 text-purple-700 font-medium'
                  : 'bg-gray-50 border border-gray-200 hover:border-purple-200'
              }`}
            >
              自定义
            </button>
          </div>
          
          {/* Custom points input */}
          {customPointsMode && (
            <div className="mt-3">
              <Input
                type="number"
                value={form.customPoints || ''}
                onChange={handleCustomPointsChange}
                placeholder="输入自定义积分"
                min={1}
                className="text-center"
              />
            </div>
          )}
        </div>
        
        {/* 5. Consultation Time Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div 
            className="flex items-start justify-between cursor-pointer" 
            onClick={toggleScheduleConsultation}
          >
            <div className="flex items-start">
              <Calendar className="text-purple-500 mt-1" size={20} />
              <div className="ml-2">
                <Label className="text-base font-medium">预约咨询时间</Label>
                <p className="text-gray-500 text-sm">设置可商讨的时间段</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-all flex items-center ${form.scheduleConsultation ? 'bg-purple-500 justify-end' : 'bg-gray-300 justify-start'}`}>
              <div className="w-5 h-5 rounded-full bg-white m-0.5"></div>
            </div>
          </div>
          
          {form.scheduleConsultation && (
            <div className="mt-4 space-y-4 animate-fade-in">
              {/* Flexible option */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${form.isFlexible ? 'bg-purple-500' : 'border border-gray-300'}`}>
                    {form.isFlexible && <Check className="text-white" size={14} />}
                  </div>
                  <span className="ml-2 text-sm">时间可商讨</span>
                </label>
                <button
                  type="button"
                  onClick={toggleFlexible}
                  className="text-sm text-purple-600"
                >
                  {form.isFlexible ? '取消' : '选择'}
                </button>
              </div>
              
              {/* Time slots grid */}
              <div>
                <div className="text-sm font-medium mb-2 flex items-center">
                  <Clock size={16} className="mr-1" />
                  可选时间段
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleTimeSlot(slot)}
                      className={`py-2 px-3 rounded-lg text-center text-sm transition-all ${
                        form.timeSlots.includes(slot)
                          ? 'bg-purple-100 border-2 border-purple-400 text-purple-700'
                          : 'bg-gray-50 border border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white p-4 border-t">
          <Button 
            type="submit" 
            className="w-full py-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 rounded-xl text-white font-medium text-lg"
          >
            发布问题
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewQuestion;
