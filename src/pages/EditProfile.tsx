
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  User, 
  Building, 
  GraduationCap, 
  Tag, 
  Lock, 
  Info,
  Trash,
  Plus,
  X,
  Save,
  Edit,
  Calendar,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const EditProfile = () => {
  const navigate = useNavigate();
  const [avatarType, setAvatarType] = useState('image'); // 'image', 'gif', 'video'
  const [avatarPreview, setAvatarPreview] = useState('https://randomuser.me/api/portraits/men/44.jpg');
  const [nameEdit, setNameEdit] = useState(false);
  const [username, setUsername] = useState('张小明');
  const [bio, setBio] = useState('');
  const [addEducationDialog, setAddEducationDialog] = useState(false);
  const [addWorkDialog, setAddWorkDialog] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([
    '留学申请', '托福备考', '职业规划'
  ]);
  const [recommendedTopics, setRecommendedTopics] = useState([
    '考研经验', '面试技巧', 'AI应用', '英语学习', '数据分析', '自媒体运营'
  ]);
  
  // Mock data
  const educationList = [
    { id: 1, school: '北京大学', degree: '硕士', graduationYear: '2022', verified: true }
  ];
  
  const workList = [
    { id: 1, company: '阿里巴巴', title: '产品经理', startDate: '2022-01', endDate: '至今', hidden: false }
  ];
  
  const privacySettings = {
    showEducation: true,
    showWork: true,
    showTopics: true,
    allowFollowers: true
  };

  const addTopic = (topic) => {
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics([...selectedTopics, topic]);
      setRecommendedTopics(recommendedTopics.filter(t => t !== topic));
    }
  };

  const removeTopic = (topic) => {
    setSelectedTopics(selectedTopics.filter(t => t !== topic));
    setRecommendedTopics([...recommendedTopics, topic]);
  };

  return (
    <div className="pb-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')}
            className="mr-2"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-semibold">编辑个人资料</h1>
        </div>
        <Button onClick={() => navigate('/profile')}>完成</Button>
      </div>

      {/* Basic Information */}
      <div className="p-4 space-y-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <User size={18} className="text-app-blue mr-2" />
                基础信息
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-center justify-between">
                <Label className="font-medium">头像</Label>
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-3">
                    <AvatarImage src={avatarPreview} alt="Profile" />
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex space-x-2 mb-1">
                      <Badge 
                        variant={avatarType === 'image' ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setAvatarType('image')}
                      >
                        静态图片
                      </Badge>
                      <Badge 
                        variant={avatarType === 'gif' ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setAvatarType('gif')}
                      >
                        GIF
                      </Badge>
                      <Badge 
                        variant={avatarType === 'video' ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setAvatarType('video')}
                      >
                        短视频
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Upload size={12} className="mr-1" /> 上传
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Username Section */}
              <div className="flex items-center justify-between">
                <Label className="font-medium">昵称</Label>
                <div className="flex items-center space-x-2">
                  {nameEdit ? (
                    <div className="w-52">
                      <Input 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        maxLength={20}
                        className="border-app-blue text-right" 
                      />
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-gray-500">
                          {username.length}/20
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span>{username}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setNameEdit(true)}
                      >
                        <Edit size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Bio Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-medium">个人简介</Label>
                  <span className="text-xs text-gray-500">{bio.length}/200</span>
                </div>
                <Textarea
                  placeholder="介绍一下自己吧 (200字以内)"
                  className="resize-none"
                  maxLength={200}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              
              {nameEdit && (
                <div className="flex justify-end">
                  <Button variant="ghost" onClick={() => setNameEdit(false)} className="mr-2">
                    取消
                  </Button>
                  <Button onClick={() => setNameEdit(false)}>保存</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Education Background */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <GraduationCap size={18} className="text-app-green mr-2" />
                教育背景
              </h2>
              <Button variant="outline" size="sm" onClick={() => setAddEducationDialog(true)}>
                <Plus size={16} className="mr-1" /> 添加
              </Button>
            </div>
            
            <div className="space-y-3">
              {educationList.map((edu) => (
                <div key={edu.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <GraduationCap className="text-app-green" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{edu.school}</h4>
                        {edu.verified && (
                          <Badge variant="outline" className="ml-2 text-green-600 border-green-200 bg-green-50">
                            已认证
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{edu.degree} · {edu.graduationYear}年毕业</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
              
              {educationList.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>还没有添加教育经历</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Work Experience */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Building size={18} className="text-app-blue mr-2" />
                工作经历
              </h2>
              <Button variant="outline" size="sm" onClick={() => setAddWorkDialog(true)}>
                <Plus size={16} className="mr-1" /> 添加
              </Button>
            </div>
            
            <div className="space-y-3">
              {workList.map((work) => (
                <div key={work.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <Building className="text-app-blue" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{work.hidden ? '已隐藏企业' : work.company}</h4>
                        {work.hidden && (
                          <Badge variant="outline" className="ml-2 text-gray-600 border-gray-200 bg-gray-50">
                            隐藏
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{work.title} · {work.startDate} 至 {work.endDate}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
              
              {workList.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>还没有添加工作经历</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Topics */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Tag size={18} className="text-purple-500 mr-2" />
                擅长话题
              </h2>
            </div>
            
            <div className="mb-4">
              <Label className="mb-2 block font-medium">已选话题</Label>
              <div className="flex flex-wrap gap-2 min-h-12">
                {selectedTopics.map((topic) => (
                  <div 
                    key={topic}
                    className="bg-app-blue/10 text-app-blue px-3 py-1.5 rounded-full text-sm flex items-center"
                  >
                    {topic}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 ml-1 hover:bg-transparent hover:text-red-500"
                      onClick={() => removeTopic(topic)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
                {selectedTopics.length === 0 && (
                  <p className="text-gray-500 text-sm">还没有选择话题，请从下方推荐中添加</p>
                )}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="font-medium">推荐话题</Label>
                <p className="text-xs text-gray-500">点击添加到您的专长</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendedTopics.map((topic) => (
                  <div 
                    key={topic}
                    onClick={() => addTopic(topic)}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors"
                  >
                    {topic}
                  </div>
                ))}
                {recommendedTopics.length === 0 && (
                  <p className="text-gray-500 text-sm">没有更多推荐话题</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy Settings */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Lock size={18} className="text-amber-500 mr-2" />
                个人隐私
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">展示教育背景</p>
                  <p className="text-sm text-gray-500">您的学校和学位信息</p>
                </div>
                <Checkbox checked={privacySettings.showEducation} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">展示工作经历</p>
                  <p className="text-sm text-gray-500">您的公司和职位信息</p>
                </div>
                <Checkbox checked={privacySettings.showWork} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">展示擅长话题</p>
                  <p className="text-sm text-gray-500">您设置的专长话题标签</p>
                </div>
                <Checkbox checked={privacySettings.showTopics} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">允许被关注</p>
                  <p className="text-sm text-gray-500">其他用户是否可以关注您</p>
                </div>
                <Checkbox checked={privacySettings.allowFollowers} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Education Dialog */}
      <Dialog open={addEducationDialog} onOpenChange={setAddEducationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加教育经历</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="school">学校</Label>
              <Input id="school" placeholder="输入学校名称" />
              <p className="text-xs text-gray-500">添加后可申请学校认证，认证后不可修改</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree">学位</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择学位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diploma">大专</SelectItem>
                  <SelectItem value="bachelor">学士学位</SelectItem>
                  <SelectItem value="master">硕士学位</SelectItem>
                  <SelectItem value="phd">博士学位</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradYear">毕业年份</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择毕业年份" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEducationDialog(false)}>
              取消
            </Button>
            <Button onClick={() => setAddEducationDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Work Dialog */}
      <Dialog open={addWorkDialog} onOpenChange={setAddWorkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加工作经历</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="company">公司</Label>
                <div className="flex items-center">
                  <Checkbox id="hideCompany" className="mr-1.5" />
                  <Label htmlFor="hideCompany" className="text-xs cursor-pointer">
                    隐藏公司名称
                  </Label>
                </div>
              </div>
              <Input id="company" placeholder="输入公司名称" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">职位</Label>
              <Input id="jobTitle" placeholder="输入您的职位" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">开始日期</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择日期" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <React.Fragment key={year}>
                          <SelectItem value={`${year}-01`}>{year}年1月</SelectItem>
                          <SelectItem value={`${year}-07`}>{year}年7月</SelectItem>
                        </React.Fragment>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">结束日期</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择日期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="至今">至今</SelectItem>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <React.Fragment key={year}>
                          <SelectItem value={`${year}-01`}>{year}年1月</SelectItem>
                          <SelectItem value={`${year}-07`}>{year}年7月</SelectItem>
                        </React.Fragment>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddWorkDialog(false)}>
              取消
            </Button>
            <Button onClick={() => setAddWorkDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
