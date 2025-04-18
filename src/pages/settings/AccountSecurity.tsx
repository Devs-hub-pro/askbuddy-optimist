
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Key, UserRound, SmartphoneNfc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import BottomNav from '@/components/BottomNav';

const AccountSecurity = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
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

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <UserRound className="w-5 h-5 mr-2 text-blue-500" />
              账号信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">手机号码</span>
              <span className="text-sm text-gray-500">183****5678</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">邮箱地址</span>
              <span className="text-sm text-gray-500">未绑定</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Key className="w-5 h-5 mr-2 text-green-500" />
              登录安全
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">登录密码</div>
                <div className="text-xs text-gray-500">定期更换密码可以保护账号安全</div>
              </div>
              <Button variant="outline" size="sm">修改</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">二次验证</div>
                <div className="text-xs text-gray-500">登录时需要额外验证</div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <SmartphoneNfc className="w-5 h-5 mr-2 text-purple-500" />
              设备管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">已登录设备</div>
                <div className="text-xs text-gray-500">查看和管理登录设备</div>
              </div>
              <Button variant="outline" size="sm">查看</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default AccountSecurity;
