import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Loader2, PenSquare, Star, Tags, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { uploadExpertCoverImage, useExpertByUserId, useSaveExpertProfile } from '@/hooks/useExperts';
import { navigateBackOr } from '@/utils/navigation';

const skillFormSchema = z.object({
  title: z.string().min(5, { message: '标题至少需要5个字符' }).max(100),
  category: z.string({ required_error: '请选择一个类别' }),
  subCategory: z.string({ required_error: '请选择一个子类别' }),
  description: z.string().min(20, { message: '描述至少需要20个字符' }).max(500),
  price: z
    .string()
    .trim()
    .min(1, { message: '请输入咨询价格' })
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
      message: '价格必须大于 0',
    }),
  experience: z.string({ required_error: '请选择您的经验水平' }),
  responseTime: z.string({ required_error: '请选择您的响应时间' }),
  tags: z.string().trim().min(1, { message: '请至少填写一个标签' }),
});

const categories = [
  {
    name: '教育学习',
    subcategories: ['考研辅导', '高考指导', '留学申请', '语言学习', '学科补习', '升学规划'],
  },
  {
    name: '职业发展',
    subcategories: ['简历优化', '面试技巧', '职业规划', '求职策略', '行业分析', '创业指导'],
  },
  {
    name: '生活服务',
    subcategories: ['心理咨询', '情感问题', '健康饮食', '生活指南', '美妆时尚', '旅行建议'],
  },
  {
    name: '兴趣技能',
    subcategories: ['音乐培训', '绘画设计', '摄影技巧', '写作指导', '编程学习', '手工艺术'],
  },
];

const SkillPublish = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const saveExpertProfile = useSaveExpertProfile();
  const { data: existingExpert, isLoading: loadingExisting } = useExpertByUserId(user?.id || '');

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const form = useForm<z.infer<typeof skillFormSchema>>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      title: '',
      category: '',
      subCategory: '',
      description: '',
      price: '',
      experience: '',
      responseTime: '',
      tags: '',
    },
  });

  useEffect(() => {
    if (!existingExpert) return;

    const matchedCategory = categories.find((item) => item.name === existingExpert.category);
    setSelectedCategory(existingExpert.category || '');
    setSubcategories(matchedCategory?.subcategories || []);
    setCoverImage(existingExpert.cover_image || null);

    form.reset({
      title: existingExpert.title || '',
      category: existingExpert.category || '',
      subCategory: existingExpert.subcategory || '',
      description: existingExpert.bio || '',
      price: existingExpert.consultation_price ? String(existingExpert.consultation_price) : '',
      experience: existingExpert.experience_level || '',
      responseTime: existingExpert.response_time || '',
      tags: (existingExpert.tags || []).join(','),
    });
  }, [existingExpert, form]);

  const handleCategoryChange = (value: string) => {
    const category = categories.find((item) => item.name === value);
    setSelectedCategory(value);
    setSubcategories(category?.subcategories || []);
    form.setValue('category', value, { shouldValidate: true });
    form.setValue('subCategory', '', { shouldValidate: false });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: z.infer<typeof skillFormSchema>) => {
    if (!user) {
      toast({
        title: '请先登录',
        description: '登录后才可以发布技能',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    try {
      let coverImageUrl = coverFile ? null : coverImage;
      if (coverFile) {
        coverImageUrl = await uploadExpertCoverImage(user.id, coverFile);
      }

      const tags = values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      await saveExpertProfile.mutateAsync({
        title: values.title.trim(),
        bio: values.description.trim(),
        category: values.category,
        subcategory: values.subCategory,
        consultation_price: Number(values.price),
        experience_level: values.experience,
        response_time: values.responseTime,
        tags,
        cover_image: coverImageUrl,
      });

      navigate(existingExpert ? '/profile' : '/');
    } catch {
      // useSaveExpertProfile already shows the error toast.
    }
  };

  const nextStep = async () => {
    const currentStepFields: Array<keyof z.infer<typeof skillFormSchema>> = ['title', 'category', 'subCategory', 'description'];
    const isValid = await form.trigger(currentStepFields);
    if (isValid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const isSaving = saveExpertProfile.isPending;

  return (
    <div className="bg-slate-50 min-h-[100dvh] pb-8">
      <div className="fixed left-1/2 top-0 z-[90] w-full max-w-md -translate-x-1/2 shadow-sm">
        <div className="bg-app-teal" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center h-12 px-4">
            <button onClick={() => navigateBackOr(navigate, '/profile')} className="mr-4 text-white">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-medium text-white">{existingExpert ? '编辑专业技能' : '发布您的专业技能'}</h1>
          </div>
        </div>
        <div className="border-b border-app-teal/10 bg-[rgb(223,245,239)] px-4 py-3">
          <div className="surface-card rounded-3xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 1 ? 'bg-app-teal text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <div className="h-1 w-12 bg-gray-200 mx-2"></div>
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 2 ? 'bg-app-teal text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
              </div>
              <div className="text-sm text-gray-500">{step === 1 ? '基础信息' : '服务设置'}</div>
            </div>
            <p className="text-xs leading-5 text-slate-500">
              {step === 1
                ? '先补充你的专业背景和服务方向，再进入后续定价与响应设置。'
                : '完成价格、经验、响应时间和标签后，就可以发布到平台。'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 10rem)' }}>

        {loadingExisting ? (
          <div className="py-12 flex items-center justify-center text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            正在加载已发布信息...
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {step === 1 ? (
                <>
                  <div className="surface-card rounded-3xl p-5 space-y-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">技能标题</FormLabel>
                          <FormControl>
                            <Input placeholder="例如：北大硕士提供考研英语复习规划" {...field} />
                          </FormControl>
                          <FormDescription>一个好的标题能够吸引更多人咨询</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">选择类别</FormLabel>
                          <Select onValueChange={handleCategoryChange} value={selectedCategory}>
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
                          <FormLabel className="text-base font-semibold">选择子类别</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={selectedCategory ? '选择子类别' : '请先选择类别'} />
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
                          <FormLabel className="text-base font-semibold">技能描述</FormLabel>
                          <FormControl>
                            <Textarea placeholder="详细描述您的专业背景、技能特点和能够提供的帮助" rows={5} {...field} />
                          </FormControl>
                          <FormDescription>详细而专业的描述能增加用户的信任度</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <p className="text-base font-semibold">上传封面图 (选填)</p>
                      <div className="rounded-3xl border-2 border-dashed border-gray-300 p-4 text-center">
                        {coverImage ? (
                          <div className="relative">
                            <img src={coverImage} alt="Cover preview" className="h-32 w-full rounded-2xl object-cover" />
                            <button
                              onClick={() => {
                                setCoverImage(null);
                                setCoverFile(null);
                              }}
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
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="button" onClick={nextStep} className="h-12 w-full rounded-full text-base">
                    下一步
                  </Button>
                </>
              ) : (
                <>
                  <div className="surface-card rounded-3xl p-5 space-y-5">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">咨询定价</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="number" placeholder="设置每次咨询的价格" {...field} className="pl-8" />
                              <span className="absolute left-3 top-2.5 text-gray-500">￥</span>
                            </div>
                          </FormControl>
                          <FormDescription>合理的价格能够吸引更多用户，同时体现您的专业价值</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
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
                          <FormLabel className="text-base font-semibold">
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
                          <FormDescription>更快的响应时间通常能获得更多咨询机会</FormDescription>
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
                            <Input placeholder="用逗号分隔多个标签，如：英语四六级,考研英语,学术写作" {...field} />
                          </FormControl>
                          <FormDescription>添加准确的标签有助于用户更容易找到您</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="rounded-2xl bg-blue-50 p-4">
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
                    <Button type="button" onClick={prevStep} className="w-1/3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                      返回
                    </Button>
                    <Button type="submit" disabled={isSaving} className="w-2/3 rounded-full">
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          保存中...
                        </>
                      ) : existingExpert ? (
                        '更新技能'
                      ) : (
                        '发布技能'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        )}
      </div>

    </div>
  );
};

export default SkillPublish;
