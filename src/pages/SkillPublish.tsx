
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tags, Book, Clock, Star, CheckCircle, Upload, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import BottomNav from '../components/BottomNav';
import { useToast } from '@/hooks/use-toast';

const skillFormSchema = z.object({
  title: z.string().min(5, {
    message: "标题至少需要5个字符"
  }).max(100),
  category: z.string({
    required_error: "请选择一个类别",
  }),
  subCategory: z.string({
    required_error: "请选择一个子类别",
  }),
  description: z.string().min(20, {
    message: "描述至少需要20个字符"
  }).max(500),
  price: z.string(),
  experience: z.string({
    required_error: "请选择您的经验水平",
  }),
  responseTime: z.string({
    required_error: "请选择您的响应时间",
  }),
  tags: z.string(),
});

const SkillPublish = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  
  const form = useForm<z.infer<typeof skillFormSchema>>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      title: "",
      category: "",
      subCategory: "",
      description: "",
      price: "",
      experience: "",
      responseTime: "",
      tags: "",
    },
  });

  // Category data
  const categories = [
    {
      name: "教育学习",
      subcategories: ["考研辅导", "高考指导", "留学申请", "语言学习", "学科补习", "升学规划"]
    },
    {
      name: "职业发展",
      subcategories: ["简历优化", "面试技巧", "职业规划", "求职策略", "行业分析", "创业指导"]
    },
    {
      name: "生活服务",
      subcategories: ["心理咨询", "情感问题", "健康饮食", "生活指南", "美妆时尚", "旅行建议"]
    },
    {
      name: "兴趣技能",
      subcategories: ["音乐培训", "绘画设计", "摄影技巧", "写作指导", "编程学习", "手工艺术"]
    }
  ];
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const category = categories.find(cat => cat.name === value);
    if (category) {
      setSubcategories(category.subcategories);
      form.setValue("category", value);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (values: z.infer<typeof skillFormSchema>) => {
    console.log(values);
    toast({
      title: "技能发布成功！",
      description: "您的专业技能已成功发布，请等待用户咨询"
    });
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  const nextStep = () => {
    const currentStepFields = step === 1 
      ? ['title', 'category', 'subCategory', 'description'] 
      : ['price', 'experience', 'responseTime', 'tags'];
    
    const stepValid = currentStepFields.every(field => {
      const fieldState = form.getFieldState(field as any);
      return !fieldState.invalid && form.getValues(field as any);
    });
    
    if (stepValid) {
      setStep(2);
    } else {
      form.trigger(currentStepFields as any);
    }
  };
  
  const prevStep = () => {
    setStep(1);
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50/30 min-h-screen pb-20">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center h-12 px-4">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-medium">发布您的专业技能</h1>
        </div>
      </div>
      
      <div className="px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>1</div>
              <div className="h-1 w-12 bg-gray-200 mx-2"></div>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>2</div>
            </div>
            <div className="text-sm text-gray-500">
              {step === 1 ? '基本信息' : '详细设置'}
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">技能标题</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="例如：北大硕士提供考研英语复习规划" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          一个好的标题能够吸引更多人咨询
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">选择类别</FormLabel>
                        <Select 
                          onValueChange={handleCategoryChange} 
                          value={selectedCategory}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择技能所属类别" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.name} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">选择子类别</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={!selectedCategory}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedCategory ? "选择子类别" : "请先选择类别"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategories.map((subcat) => (
                              <SelectItem key={subcat} value={subcat}>
                                {subcat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">技能描述</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="详细描述您的专业背景、技能特点和能够提供的帮助" 
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          详细而专业的描述能增加用户的信任度
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <p className="text-base font-medium mb-2">上传封面图 (选填)</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {coverImage ? (
                        <div className="relative">
                          <img 
                            src={coverImage} 
                            alt="Cover preview" 
                            className="w-full h-32 object-cover rounded-md" 
                          />
                          <button 
                            onClick={() => setCoverImage(null)}
                            className="absolute top-2 right-2 bg-white/80 rounded-full p-1"
                            type="button"
                          >
                            <PenSquare size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <div className="flex flex-col items-center py-4">
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <p className="text-gray-500 text-sm">点击上传封面图，或拖拽文件到此处</p>
                            <p className="text-gray-400 text-xs mt-1">支持JPG、PNG格式，建议尺寸1200x800</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  onClick={nextStep} 
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 h-12 text-lg"
                >
                  下一步
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">咨询定价</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="number"
                              placeholder="设置每次咨询的价格" 
                              {...field}
                              className="pl-8"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-500">￥</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          合理的价格能够吸引更多用户，同时体现您的专业价值
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          <div className="flex items-center gap-1">
                            <Star size={18} className="text-yellow-500" />
                            <span>经验水平</span>
                          </div>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择您的经验水平" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="entry">入门级 (1年以下经验)</SelectItem>
                            <SelectItem value="intermediate">中级 (1-3年经验)</SelectItem>
                            <SelectItem value="advanced">高级 (3-5年经验)</SelectItem>
                            <SelectItem value="expert">专家 (5年以上经验)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responseTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          <div className="flex items-center gap-1">
                            <Clock size={18} className="text-blue-500" />
                            <span>响应时间</span>
                          </div>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择您的响应时间" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1h">1小时内</SelectItem>
                            <SelectItem value="4h">4小时内</SelectItem>
                            <SelectItem value="12h">12小时内</SelectItem>
                            <SelectItem value="24h">24小时内</SelectItem>
                            <SelectItem value="48h">48小时内</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          更快的响应时间通常能获得更多咨询机会
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          <div className="flex items-center gap-1">
                            <Tags size={18} className="text-green-500" />
                            <span>技能标签</span>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="用逗号分隔多个标签，如：英语四六级,考研英语,学术写作"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          添加准确的标签有助于用户更容易找到您
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h3 className="text-sm font-medium flex items-center mb-2">
                      <CheckCircle size={16} className="text-blue-500 mr-1" />
                      提交前确认
                    </h3>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li className="flex items-start">
                        <div className="min-w-4 mt-1 mr-1">•</div>
                        <div>您的技能信息将展示在公共平台，请确保内容真实可靠</div>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-4 mt-1 mr-1">•</div>
                        <div>平台将抽取10%作为服务费，实际收入将在完成咨询后到账</div>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-4 mt-1 mr-1">•</div>
                        <div>请保持高质量的回复，用户满意度将影响您的排名</div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    onClick={prevStep} 
                    className="w-1/3 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    返回
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-2/3 bg-gradient-to-r from-purple-500 to-indigo-500"
                  >
                    发布技能
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default SkillPublish;
