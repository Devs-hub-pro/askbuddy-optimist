
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, Search, Mail, Clock, FileText, Video, 
  Star, MessageCircle, ArrowRight, Calendar,
  User, Users, MessageCircleQuestion, MessageCirclePlus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

// Mock data for job mentors
const mentors = [
  {
    id: 1,
    name: "李明",
    role: "阿里巴巴HR",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
    years: 5,
    price: 299,
    rating: 4.8
  },
  {
    id: 2,
    name: "王芳",
    role: "腾讯猎头",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    years: 7,
    price: 399,
    rating: 4.9
  },
  {
    id: 3,
    name: "张伟",
    role: "字节跳动技术经理",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    years: 4,
    price: 249,
    rating: 4.7
  },
];

// Mock data for job questions
const questions = [
  {
    id: 1,
    title: "应届生如何准备前端开发面试？有哪些常见的技术问题？",
    asker: {
      name: "小李同学",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    time: "2小时前",
    tags: ["前端开发", "面试技巧"],
    answers: 5,
    views: 128
  },
  {
    id: 2,
    title: "跨行业转到产品经理岗位，需要掌握哪些基本技能？",
    asker: {
      name: "职场新人",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
    },
    time: "4小时前",
    tags: ["产品经理", "转行"],
    answers: 8,
    views: 216
  },
  {
    id: 3,
    title: "大厂简历筛选关注哪些点？如何提高简历通过率？",
    asker: {
      name: "求职者小王",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    },
    time: "昨天",
    tags: ["简历优化", "大厂求职"],
    answers: 12,
    views: 342
  },
];

// Mock data for industry news
const industryNews = [
  {
    id: 1,
    title: "科技行业2025年人才需求趋势分析",
    source: "IT人才研究",
    time: "今天",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "互联网大厂最新招聘政策解读",
    source: "互联网人才观察",
    time: "昨天",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "2025年最具发展前景的十大职业",
    source: "职业规划观察",
    time: "3天前",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
];

const categories = [
  { id: "job", label: "求职", icon: <Briefcase size={16} /> },
  { id: "resume", label: "简历", icon: <FileText size={16} /> },
  { id: "interview", label: "面试", icon: <Video size={16} /> },
  { id: "remote", label: "远程工作", icon: <Clock size={16} /> },
  { id: "startup", label: "创业", icon: <Users size={16} /> },
];

const CareerDevelopment: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("job");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="app-container pb-20">
      {/* Navbar */}
      <Navbar />
      
      {/* Search Bar */}
      <div className="px-4 py-5 bg-gradient-to-b from-app-teal/10 to-transparent animate-fade-in">
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center gap-1">
            <Briefcase size={20} className="text-purple-600" />
            <h1 className="text-lg font-bold">职业发展</h1>
          </div>
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="搜索岗位、行业、面试技巧"
            className="search-input pr-10 focus:ring-2 focus:ring-purple-400/30 shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search 
            size={18} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        </div>
      </div>
      
      {/* Category Tags */}
      <div className="px-4 py-3 overflow-x-auto hide-scrollbar">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`flex items-center gap-1 rounded-full text-sm px-4 py-1 ${
                activeCategory === category.id 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              <span>{category.label}</span>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-4 py-2">
        {/* Industry News */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center gap-1">
              <Mail size={18} className="text-purple-600" />
              行业热点
            </h2>
            <Button variant="ghost" size="sm" className="text-sm text-purple-600 flex items-center gap-1">
              查看更多 <ArrowRight size={14} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {industryNews.map((news) => (
              <Card key={news.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <div className="w-24 h-24 bg-gray-100 overflow-hidden">
                      <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex-1">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">{news.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{news.source}</span>
                        <span className="text-xs text-gray-500">{news.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Mentor Recommendations */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center gap-1">
              <User size={18} className="text-purple-600" />
              导师推荐
            </h2>
            <Button variant="ghost" size="sm" className="text-sm text-purple-600 flex items-center gap-1">
              查看更多 <ArrowRight size={14} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{mentor.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-xs">{mentor.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{mentor.role} · {mentor.years}年经验</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100">
                          ¥{mentor.price}/次
                        </Badge>
                        <Button size="sm" className="h-7 rounded-full bg-purple-600 hover:bg-purple-700 text-xs">
                          咨询预约
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Job Q&A */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center gap-1">
              <MessageCircleQuestion size={18} className="text-purple-600" />
              求职问答
            </h2>
            <Button variant="ghost" size="sm" className="text-sm text-purple-600 flex items-center gap-1">
              查看更多 <ArrowRight size={14} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {questions.map((question) => (
              <Card key={question.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base mb-2">{question.title}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={question.asker.avatar} 
                        alt={question.asker.name}
                        className="w-7 h-7 rounded-full flex-shrink-0 object-cover border border-gray-100" 
                      />
                      <div>
                        <div className="text-xs font-medium">{question.asker.name}</div>
                        <div className="text-xs text-gray-500">{question.time}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {question.answers}个回答
                      </span>
                      <span className="text-xs text-gray-500">
                        {question.views}浏览
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag, index) => (
                        <span key={index} className="inline-block text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm hover:shadow-md transition-all hover:brightness-105">
                      <MessageCircle size={14} />
                      回答
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Feature buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-3">
        <Button className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600">
          <Video size={20} />
        </Button>
        <Button className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
          <Star size={20} />
        </Button>
        <Button className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <MessageCirclePlus size={20} />
        </Button>
      </div>
      
      {/* Tooltip info for the feature buttons */}
      <div className="fixed bottom-16 right-20 bg-black/80 text-white text-xs py-1 px-2 rounded pointer-events-none opacity-0">
        发布求职问题
      </div>
      
      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default CareerDevelopment;
