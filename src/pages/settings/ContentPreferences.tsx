import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Compass, Tag, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ContentPreferences = () => {
  const navigate = useNavigate();

  const interests = [
    { category: "热门话题", tags: ["留学申请", "考研考博", "职业规划", "留学生活"] },
    { category: "学习提升", tags: ["语言学习", "专业课程", "考试技巧", "学术研究"] },
    { category: "生活服务", tags: ["租房", "美食", "旅行", "购物"] },
    { category: "职业发展", tags: ["求职", "实习", "创业", "职场技能"] }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">内容偏好</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* 兴趣主题 */}
        <Card className="border-none shadow-sm">
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
                      className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
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
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Compass className="w-5 h-5 mr-2 text-purple-500" />
              探索发现
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">个性化推荐</h3>
                <p className="text-xs text-gray-500">根据您的兴趣推荐相关内容</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/discover')}>
                去发现
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentPreferences;
