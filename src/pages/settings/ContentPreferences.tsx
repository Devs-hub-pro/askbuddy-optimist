import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SubPageHeader from '@/components/layout/SubPageHeader';

const ContentPreferences = () => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>(['留学申请', '职业规划', '语言学习']);

  const interests = [
    { category: "热门话题", tags: ["留学申请", "考研考博", "职业规划", "留学生活"] },
    { category: "学习提升", tags: ["语言学习", "专业课程", "考试技巧", "学术研究"] },
    { category: "生活服务", tags: ["租房", "美食", "旅行", "购物"] },
    { category: "职业发展", tags: ["求职", "实习", "创业", "职场技能"] }
  ];

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <SubPageHeader title="内容偏好" />

      <div className="space-y-4 p-4">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">偏好设置</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  选择你更关注的话题与内容方向，发现页和首页推荐会更贴近你的兴趣。
                </p>
              </div>
              <Sparkles className="app-accent-text h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* 兴趣主题 */}
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              兴趣主题
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {interests.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">{section.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {section.tags.map((tag, tagIndex) => (
                    <Badge 
                      key={tagIndex}
                      variant="secondary" 
                      className={`cursor-pointer transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'hover:bg-primary hover:text-white'
                      }`}
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
                        )
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 探索发现 */}
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Compass className="w-5 h-5 mr-2 text-purple-500" />
              探索发现
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center rounded-2xl bg-slate-50 px-3 py-3">
              <div>
                <h3 className="text-sm font-medium">个性化推荐</h3>
                <p className="text-xs text-gray-500">根据您的兴趣推荐相关内容</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/discover')}>
                去发现
              </Button>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-sm font-medium text-slate-900">已选偏好</p>
              <p className="mt-1 text-xs text-slate-500">当前共选择 {selectedTags.length} 个兴趣标签。</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentPreferences;
