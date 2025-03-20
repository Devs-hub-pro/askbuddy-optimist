
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, User, Phone, Shield, Key, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BottomNav from '@/components/BottomNav';

const AccountSecurity = () => {
  const navigate = useNavigate();

  const securityOptions = [
    {
      title: '手机号',
      desc: '已绑定：133****5678',
      icon: <Phone className="text-app-blue" />,
      action: '修改'
    },
    {
      title: '账号密码',
      desc: '用于登录账号',
      icon: <Key className="text-green-500" />,
      action: '设置'
    },
    {
      title: '实名认证',
      desc: '未认证',
      icon: <User className="text-orange-500" />,
      action: '去认证'
    },
    {
      title: '安全中心',
      desc: '保障账号安全',
      icon: <Shield className="text-purple-500" />,
      action: '查看'
    }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">账号与安全</h1>
      </div>

      {/* Security Options */}
      <div className="p-4 space-y-3 mt-2">
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            {securityOptions.map((option, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center justify-between p-4 cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-3">
                      {option.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{option.title}</h4>
                      <p className="text-sm text-gray-500">{option.desc}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-app-blue">
                    {option.action}
                  </Button>
                </div>
                {index < securityOptions.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>

        {/* Account Operations */}
        <Card className="border-none shadow-sm mt-6">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-4">账号操作</h3>
            <Button variant="outline" className="w-full justify-start text-red-500 border-red-100 hover:bg-red-50">
              退出登录
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default AccountSecurity;
