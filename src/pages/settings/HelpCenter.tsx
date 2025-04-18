import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Search, ChevronDown, ChevronRight, MessageSquare, FileText, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ categories
  const helpCategories = [
    {
      icon: <Users size={16} className="text-app-blue" />,
      label: '账号与注册',
      questions: [
        { q: '如何注册新账号？', a: '点击首页右上角的"登录/注册"按钮，选择手机号注册，按照提示完成验证即可。' },
        { q: '忘记密码怎么办？', a: '在登录页面点击"忘记密码"，通过验证手机号后可以重置密码。' },
        { q: '如何修改手机号？', a: '进入"账号与安全"页面，点击"修改手机号"，完成身份验证后即可更换。' }
      ]
    },
    {
      icon: <MessageSquare size={16} className="text-app-green" />,
      label: '问答相关',
      questions: [
        { q: '如何发布问题？', a: '点击底部导航栏中的"+"按钮，填写问题标题和详情后发布。' },
        { q: '问题发布后可以修改吗？', a: '问题发布后标题无法修改，但可以补充问题描述。' },
        { q: '如何选择最佳回答？', a: '在问题页面，点击满意回答下方的"采纳为最佳回答"按钮。' }
      ]
    },
    {
      icon: <FileText size={16} className="text-purple-500" />,
      label: '内容规则',
      questions: [
        { q: '哪些内容会被禁止？', a: '违反法律法规、包含色情、暴力、歧视等内容的问题和回答会被禁止。' },
        { q: '为什么我的回答被删除？', a: '您的回答可能违反了社区规则，或被举报并审核认定为不适合内容。' },
        { q: '如何举报不良内容？', a: '点击问题或回答右下角的"更多"按钮，选择"举报"并选择原因。' }
      ]
    },
    {
      icon: <AlertCircle size={16} className="text-app-red" />,
      label: '常见问题',
      questions: [
        { q: '如何成为认证答主？', a: '需要提交个人资质证明，在"达人认证"页面申请并等待审核。' },
        { q: '积分有什么用？', a: '积分可以提升账号等级，解锁特权功能，也可以在积分商城兑换礼品。' },
        { q: '如何联系客服？', a: '点击本页面底部的"联系客服"按钮，或发送邮件至support@example.com。' }
      ]
    }
  ];

  // Filter questions based on search query
  const filteredCategories = searchQuery.trim() === '' 
    ? helpCategories 
    : helpCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">帮助中心</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="搜索常见问题..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <Card key={`cat-${index}`} className="border-none shadow-sm overflow-hidden rounded-xl">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg flex items-center">
                  <span className="p-1.5 rounded-md bg-gray-100 mr-2">
                    {category.icon}
                  </span>
                  {category.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, qIndex) => (
                    <AccordionItem key={`q-${index}-${qIndex}`} value={`item-${index}-${qIndex}`} className="border-b border-gray-100">
                      <AccordionTrigger className="text-left font-normal hover:no-underline py-3">
                        {item.q}
                        {searchQuery && (
                          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-none text-xs">
                            匹配
                          </Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 my-8 text-center">
            <HelpCircle size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">未找到匹配的问题</p>
            <p className="text-gray-400 text-sm mb-4">请尝试其他关键词或联系客服</p>
            <Button variant="outline" className="mt-2">
              <MessageSquare size={16} className="mr-2" />
              联系客服
            </Button>
          </div>
        )}
        
        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-xl mt-6 text-center">
          <h3 className="font-medium mb-2">没有找到您需要的帮助？</h3>
          <p className="text-sm text-gray-600 mb-3">工作时间：周一至周日 9:00-22:00</p>
          <Button className="bg-app-teal hover:bg-app-teal/90">
            <MessageSquare size={16} className="mr-2" />
            联系在线客服
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
