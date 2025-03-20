
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
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const EditProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [avatarType, setAvatarType] = useState('image'); // 'image', 'gif', 'video'
  const [avatarPreview, setAvatarPreview] = useState('https://randomuser.me/api/portraits/men/44.jpg');
  const [nameEdit, setNameEdit] = useState(false);
  const [username, setUsername] = useState('张小明');
  const [bio, setBio] = useState('');
  const [addEducationDialog, setAddEducationDialog] = useState(false);
  const [educationList, setEducationList] = useState([
    { id: 1, school: '北京大学', degree: '硕士', graduationYear: '2022', verified: true }
  ]);
  const [addWorkDialog, setAddWorkDialog] = useState(false);
  const [workList, setWorkList] = useState([
    { id: 1, company: '阿里巴巴', title: '产品经理', startDate: '2022-01', endDate: '至今', hidden: false }
  ]);
  const [selectedTopics, setSelectedTopics] = useState([
    '留学申请', '托福备考', '职业规划'
  ]);
  const [recommendedTopics, setRecommendedTopics] = useState([
    '考研经验', '面试技巧', 'AI应用', '英语学习', '数据分析', '自媒体运营'
  ]);
  const [privacySettings, setPrivacySettings] = useState({
    showEducation: true,
    showWork: true,
    showTopics: true,
    allowFollowers: true
  });

  const handleSaveBasic = () => {
    // Save basic information logic would go here
    setNameEdit(false);
  };

  const handleAddEducation = () => {
    // Logic to add education
    setAddEducationDialog(false);
  };

  const handleDeleteEducation = (id: number) => {
    setEducationList(educationList.filter(edu => edu.id !== id));
  };

  const handleAddWork = () => {
    // Logic to add work experience
    setAddWorkDialog(false);
  };

  const handleDeleteWork = (id: number) => {
    setWorkList(workList.filter(work => work.id !== id));
  };

  const addTopic = (topic: string) => {
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics([...selectedTopics, topic]);
      setRecommendedTopics(recommendedTopics.filter(t => t !== topic));
    }
  };

  const removeTopic = (topic: string) => {
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

      {/* Profile Editing Tabs */}
      <div className="px-4 py-4">
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6 bg-gray-100">
            <TabsTrigger value="basic" className="data-[state=active]:bg-app-blue data-[state=active]:text-white">
              <User size={16} className="mr-1" /> 基础
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-app-blue data-[state=active]:text-white">
              <GraduationCap size={16} className="mr-1" /> 教育
            </TabsTrigger>
            <TabsTrigger value="work" className="data-[state=active]:bg-app-blue data-[state=active]:text-white">
              <Building size={16} className="mr-1" /> 工作
            </TabsTrigger>
            <TabsTrigger value="topics" className="data-[state=active]:bg-app-blue data-[state=active]:text-white">
              <Tag size={16} className="mr-1" /> 话题
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-app-blue data-[state=active]:text-white">
              <Lock size={16} className="mr-1" /> 隐私
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-6">
                <div className="flex flex-col items-center justify-center pt-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-gray-200">
                      <AvatarImage src={avatarPreview} alt="Profile" />
                      <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-app-blue text-white rounded-full p-1.5 shadow-md">
                      <Upload size={16} />
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button 
                      variant={avatarType === 'image' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setAvatarType('image')}
                    >
                      静态图片
                    </Button>
                    <Button 
                      variant={avatarType === 'gif' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setAvatarType('gif')}
                    >
                      GIF 动图
                    </Button>
                    <Button 
                      variant={avatarType === 'video' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setAvatarType('video')}
                    >
                      短视频
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">支持 JPG、PNG、GIF 和 MP4 格式</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">昵称</Label>
                    <div className="flex items-center mt-1">
                      {nameEdit ? (
                        <div className="flex-1">
                          <Input 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            maxLength={20}
                            className="border-app-blue" 
                          />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              30天内仅可修改一次
                            </span>
                            <span className="text-xs text-gray-500">
                              {username.length}/20
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-base">{username}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setNameEdit(true)}
                          >
                            <Edit size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">个人简介</Label>
                    <Textarea
                      placeholder="介绍一下自己吧 (200字以内)"
                      className="mt-1 resize-none min-h-[120px]"
                      maxLength={200}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-gray-500">
                        {bio.length}/200
                      </span>
                    </div>
                  </div>

                  {nameEdit && (
                    <div className="flex justify-end">
                      <Button variant="ghost" onClick={() => setNameEdit(false)} className="mr-2">
                        取消
                      </Button>
                      <Button onClick={handleSaveBasic}>保存</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">教育背景</h3>
                  <Button onClick={() => setAddEducationDialog(true)}>
                    <Plus size={16} className="mr-1" /> 添加
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {educationList.map((edu) => (
                    <div key={edu.id} className="border rounded-lg p-3 relative">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{edu.school}</h4>
                            {edu.verified && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                已认证
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{edu.degree}</p>
                          <p className="text-sm text-gray-500">{edu.graduationYear}年毕业</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {educationList.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <GraduationCap size={36} className="mx-auto mb-2 text-gray-400" />
                      <p>还没有添加教育经历</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setAddEducationDialog(true)}
                      >
                        添加教育经历
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add Education Dialog */}
            <Dialog open={addEducationDialog} onOpenChange={setAddEducationDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加教育经历</DialogTitle>
                  <DialogDescription>
                    完善你的教育背景有助于建立专业形象
                  </DialogDescription>
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
                        {Array.from({ length: 30 }, (_, i) => {
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
                  <Button onClick={handleAddEducation}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Work Experience Tab */}
          <TabsContent value="work" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">工作经历</h3>
                  <Button onClick={() => setAddWorkDialog(true)}>
                    <Plus size={16} className="mr-1" /> 添加
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {workList.map((work) => (
                    <div key={work.id} className="border rounded-lg p-3 relative">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{work.hidden ? '已隐藏企业' : work.company}</h4>
                            {work.hidden && (
                              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                隐藏状态
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{work.title}</p>
                          <p className="text-sm text-gray-500">{work.startDate} ~ {work.endDate}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteWork(work.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {workList.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Building size={36} className="mx-auto mb-2 text-gray-400" />
                      <p>还没有添加工作经历</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setAddWorkDialog(true)}
                      >
                        添加工作经历
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add Work Dialog */}
            <Dialog open={addWorkDialog} onOpenChange={setAddWorkDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加工作经历</DialogTitle>
                  <DialogDescription>
                    添加您的工作经历有助于匹配相关内容
                  </DialogDescription>
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
                          {Array.from({ length: 20 }, (_, i) => {
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
                          {Array.from({ length: 20 }, (_, i) => {
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

                  <div className="space-y-2">
                    <RadioGroup defaultValue="regular">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="regular" id="regular" />
                        <Label htmlFor="regular">正式工作</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="freelance" id="freelance" />
                        <Label htmlFor="freelance">自由职业</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="internship" id="internship" />
                        <Label htmlFor="internship">实习工作</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddWorkDialog(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddWork}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Topics Tab */}
          <TabsContent value="topics" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">擅长的话题</h3>
                
                <div className="mb-6">
                  <Label className="mb-2 block">已选话题</Label>
                  <div className="flex flex-wrap gap-2">
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
                    <Label>推荐话题</Label>
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

                {selectedTopics.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-2">拖动调整话题显示顺序</p>
                    <div className="space-y-2">
                      {selectedTopics.map((topic, index) => (
                        <div 
                          key={topic}
                          className="flex items-center justify-between bg-white p-2 border rounded-md"
                        >
                          <div className="flex items-center">
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs mr-2">
                              {index + 1}
                            </span>
                            <span>{topic}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">个人隐私设置</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">展示教育背景</p>
                      <p className="text-sm text-gray-500">您的学校和学位信息</p>
                    </div>
                    <Checkbox 
                      checked={privacySettings.showEducation}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, showEducation: checked as boolean})
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">展示工作经历</p>
                      <p className="text-sm text-gray-500">您的公司和职位信息</p>
                    </div>
                    <Checkbox 
                      checked={privacySettings.showWork}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, showWork: checked as boolean})
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">展示擅长话题</p>
                      <p className="text-sm text-gray-500">您设置的专长话题标签</p>
                    </div>
                    <Checkbox 
                      checked={privacySettings.showTopics}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, showTopics: checked as boolean})
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">允许被关注</p>
                      <p className="text-sm text-gray-500">其他用户是否可以关注您</p>
                    </div>
                    <Checkbox 
                      checked={privacySettings.allowFollowers}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, allowFollowers: checked as boolean})
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4 text-red-500">数据管理</h3>
                
                <div className="space-y-4">
                  <Button variant="outline" className="border-red-300 text-red-500 hover:bg-red-50 w-full justify-start">
                    <Trash size={16} className="mr-2" />
                    申请清除个人数据
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EditProfile;
