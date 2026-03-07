
import React, { useState } from 'react';
import { HelpCircle, Search, MessageSquare, FileText, Users, AlertCircle, Sparkles, Mail, Phone } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SubPageHeader from '@/components/layout/SubPageHeader';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isContactDialogOpen, setContactDialogOpen] = useState(false);

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
    <div className="min-h-[100dvh] bg-gray-50">
      <SubPageHeader title="帮助中心" />

      {/* Search Bar */}
      <div className="border-b border-[rgb(205,239,231)] bg-[rgb(223,245,239)] px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="搜索常见问题..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 rounded-2xl border-gray-200 bg-white pl-10 shadow-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        <Card className="surface-card rounded-3xl border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">帮助与支持</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  搜索常见问题、查看使用规则，或直接联系在线客服获取进一步帮助。
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-[rgb(73,170,155)]" />
            </div>
          </CardContent>
        </Card>

        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <Card key={`cat-${index}`} className="surface-card rounded-3xl border-none shadow-sm overflow-hidden">
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
            <Button variant="outline" className="mt-2"
              onClick={() => setContactDialogOpen(true)}
            >
              <MessageSquare size={16} className="mr-2" />
              联系客服
            </Button>
          </div>
        )}
        
        {/* Contact Section */}
        <Card className="surface-card rounded-3xl border-none shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">没有找到您需要的帮助？</h3>
            <p className="text-sm text-gray-600 mb-4">工作时间：周一至周日 9:00-22:00</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                <Mail size={16} className="mx-auto mb-2 text-app-blue" />
                <p className="text-xs text-slate-500">客服邮箱</p>
                <p className="mt-1 text-xs font-medium text-slate-700">support@example.com</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                <Phone size={16} className="mx-auto mb-2 text-app-teal" />
                <p className="text-xs text-slate-500">客服电话</p>
                <p className="mt-1 text-xs font-medium text-slate-700">400-888-8888</p>
              </div>
            </div>
            <Button className="w-full bg-app-teal hover:bg-app-teal/90"
              onClick={() => setContactDialogOpen(true)}
            >
              <MessageSquare size={16} className="mr-2" />
              联系在线客服
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* 联系客服弹窗 */}
      <Dialog open={isContactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-center text-lg font-semibold">联系客服</DialogTitle>
            <DialogDescription className="text-center mt-1 text-gray-500">我们将竭诚为您服务</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 pt-2 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 text-[15px]">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">客服邮箱</span>
                <span className="text-app-blue select-all">support@example.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">微信客服</span>
                <span className="text-app-blue select-all">vx-helpcenter</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">QQ客服</span>
                <span className="text-app-blue select-all">123456789</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">客服电话</span>
                <span className="text-app-blue select-all">400-888-8888</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg px-3 py-2 text-center text-sm text-gray-500">如遇到恶意信息或账户问题，也欢迎通过以上方式联系我们举报</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpCenter;
