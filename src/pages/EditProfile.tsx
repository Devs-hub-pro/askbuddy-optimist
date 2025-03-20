
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  GraduationCap, 
  Briefcase, 
  Tag, 
  Lock,
  Camera,
  Calendar,
  Plus,
  X
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';

type TabType = 'basic' | 'education' | 'work' | 'topics' | 'privacy';

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, active, onClick }) => (
  <button
    className={`flex flex-col items-center justify-center py-3 px-2 ${
      active ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-500'
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const EditProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [avatar, setAvatar] = useState('/lovable-uploads/2ec9ee9d-73e0-45e2-98fe-2c7d695c7b22.png');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'education' | 'work'>('education');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['教育', '留学', '英语']);
  
  // Mock data for form
  const [formData, setFormData] = useState({
    basic: {
      name: '张小明',
      bio: '我是一名教育顾问，擅长英语教学和留学规划。'
    },
    education: [
      { school: '北京大学', degree: '硕士', graduationDate: '2022-07' }
    ],
    work: [
      { company: '教育科技有限公司', position: '教育顾问', startDate: '2022-08', endDate: '至今' }
    ],
    privacy: {
      showEducation: true,
      showWork: true,
      showTopics: true,
      allowMessages: true
    }
  });

  const form = useForm({
    defaultValues: formData.basic
  });
  
  const topicOptions = [
    '教育', '留学', '英语', '数学', '科学', '历史', '地理',
    '艺术', '音乐', '体育', '计算机', '编程', '经济', '金融',
    '文学', '哲学', '心理学', '社会学', '政治', '法律'
  ];

  // Handle back navigation
  const handleBack = () => {
    navigate('/profile');
  };

  // Handle save changes
  const handleSaveChanges = () => {
    console.log('Saving changes...');
    // Here you would normally make an API call to save the user's profile
    // Mock successful update
    navigate('/profile');
  };

  // Handle add education or work experience
  const handleAddItem = (type: 'education' | 'work') => {
    setDialogType(type);
    setDialogOpen(true);
  };

  // Handle add new education/work item from dialog
  const handleAddNewItem = (formData: any) => {
    if (dialogType === 'education') {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, formData]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        work: [...prev.work, formData]
      }));
    }
    setDialogOpen(false);
  };

  // Handle removing education or work experience
  const handleRemoveItem = (type: 'education' | 'work', index: number) => {
    if (type === 'education') {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        work: prev.work.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle toggle for topic selection
  const handleTopicToggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // Handle privacy setting toggle
  const handlePrivacyToggle = (setting: keyof typeof formData.privacy) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: !prev.privacy[setting]
      }
    }));
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white py-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">编辑个人资料</h1>
        </div>
        <Button 
          onClick={handleSaveChanges} 
          size="sm"
          variant="secondary"
          className="bg-white text-teal-500 hover:bg-white/90"
        >
          保存
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b flex justify-between">
        <TabButton 
          icon={<User size={18} />} 
          label="基础信息" 
          active={activeTab === 'basic'} 
          onClick={() => setActiveTab('basic')} 
        />
        <TabButton 
          icon={<GraduationCap size={18} />} 
          label="教育背景" 
          active={activeTab === 'education'} 
          onClick={() => setActiveTab('education')} 
        />
        <TabButton 
          icon={<Briefcase size={18} />} 
          label="工作经历" 
          active={activeTab === 'work'} 
          onClick={() => setActiveTab('work')} 
        />
        <TabButton 
          icon={<Tag size={18} />} 
          label="擅长话题" 
          active={activeTab === 'topics'} 
          onClick={() => setActiveTab('topics')} 
        />
        <TabButton 
          icon={<Lock size={18} />} 
          label="隐私设置" 
          active={activeTab === 'privacy'} 
          onClick={() => setActiveTab('privacy')} 
        />
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <Card>
            <CardContent className="p-4 space-y-6">
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatar} alt="Profile" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-teal-500 text-white rounded-full p-1.5">
                    <Camera size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">点击更换头像</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">昵称</Label>
                  <Input 
                    id="name" 
                    placeholder="请输入昵称" 
                    defaultValue={formData.basic.name} 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">个人简介</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="介绍一下自己吧..." 
                    defaultValue={formData.basic.bio} 
                    className="mt-1"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    0/200字，向他人展示你的专长和个性
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education Background Tab */}
        {activeTab === 'education' && (
          <Card>
            <CardContent className="p-4 space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg relative">
                  <button 
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveItem('education', index)}
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-center mb-2">
                    <GraduationCap className="text-teal-500 mr-2" size={18} />
                    <span className="font-medium">{edu.school}</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-7">
                    <p>{edu.degree}</p>
                    <p>{edu.graduationDate}</p>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center border-dashed"
                onClick={() => handleAddItem('education')}
              >
                <Plus size={16} className="mr-2" />
                添加教育经历
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Work Experience Tab */}
        {activeTab === 'work' && (
          <Card>
            <CardContent className="p-4 space-y-4">
              {formData.work.map((work, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg relative">
                  <button 
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveItem('work', index)}
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-center mb-2">
                    <Briefcase className="text-blue-500 mr-2" size={18} />
                    <span className="font-medium">{work.company}</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-7">
                    <p>{work.position}</p>
                    <p>{work.startDate} - {work.endDate}</p>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center border-dashed"
                onClick={() => handleAddItem('work')}
              >
                <Plus size={16} className="mr-2" />
                添加工作经历
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                选择你擅长的话题，让他人更了解你的专长（最多选择 5 个）
              </p>
              
              <div className="flex flex-wrap gap-2">
                {topicOptions.map((topic, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedTopics.includes(topic)
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => handleTopicToggle(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-gray-500">
                  已选择 {selectedTopics.length}/5 个话题
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy Settings Tab */}
        {activeTab === 'privacy' && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">显示教育背景</h3>
                  <p className="text-xs text-gray-500">公开你的学校和学历信息</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.privacy.showEducation}
                    onChange={() => handlePrivacyToggle('showEducation')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
              
              <div className="border-t pt-2 flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">显示工作经历</h3>
                  <p className="text-xs text-gray-500">公开你的公司和职位信息</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.privacy.showWork}
                    onChange={() => handlePrivacyToggle('showWork')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
              
              <div className="border-t pt-2 flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">显示擅长话题</h3>
                  <p className="text-xs text-gray-500">让他人了解你的专长领域</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.privacy.showTopics}
                    onChange={() => handlePrivacyToggle('showTopics')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
              
              <div className="border-t pt-2 flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">允许私信</h3>
                  <p className="text-xs text-gray-500">他人可以向你发送私信</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.privacy.allowMessages}
                    onChange={() => handlePrivacyToggle('allowMessages')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog for adding education or work experience */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'education' ? '添加教育经历' : '添加工作经历'}
            </DialogTitle>
          </DialogHeader>
          
          {dialogType === 'education' ? (
            <form className="space-y-4" onSubmit={(e) => { 
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddNewItem({
                school: formData.get('school'),
                degree: formData.get('degree'),
                graduationDate: formData.get('graduationDate')
              });
            }}>
              <div>
                <Label htmlFor="school">学校</Label>
                <Input id="school" name="school" placeholder="请输入学校名称" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="degree">学位</Label>
                <Select name="degree">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="选择学位" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">学士</SelectItem>
                    <SelectItem value="master">硕士</SelectItem>
                    <SelectItem value="phd">博士</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="graduationDate">毕业时间</Label>
                <div className="flex items-center mt-1">
                  <Input 
                    id="graduationDate" 
                    name="graduationDate"
                    type="month" 
                    className="flex-1" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button type="submit">确定</Button>
              </div>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={(e) => { 
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddNewItem({
                company: formData.get('company'),
                position: formData.get('position'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate') || '至今'
              });
            }}>
              <div>
                <Label htmlFor="company">公司</Label>
                <Input id="company" name="company" placeholder="请输入公司名称" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="position">职位</Label>
                <Input id="position" name="position" placeholder="请输入职位名称" className="mt-1" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">开始时间</Label>
                  <Input 
                    id="startDate" 
                    name="startDate"
                    type="month" 
                    className="mt-1" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">结束时间</Label>
                  <Input 
                    id="endDate" 
                    name="endDate"
                    type="month" 
                    className="mt-1" 
                    placeholder="至今" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button type="submit">确定</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
