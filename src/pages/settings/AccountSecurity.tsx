import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Lock, 
  KeyRound, 
  Phone, 
  Trash2,
  LifeBuoy,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AccountSecurity = () => {
  const navigate = useNavigate();
  
  const socialAccounts = [
    { name: 'WeChat', status: '未绑定', icon: '微信' },
    { name: 'QQ', status: '未绑定', icon: 'QQ' },
    { name: 'Apple', status: '已绑定', icon: '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white flex items-center p-4 border-b shadow-sm">
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
        {/* 基本信息 */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-500" />
              基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-sm font-medium">手机号</span>
                <p className="text-xs text-gray-500">183****5678</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/settings/phone')}>
                修改
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-sm font-medium">登录密码</span>
                <p className="text-xs text-gray-500">建议定期更换密码</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/settings/password')}>
                修改
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 社交账号绑定 */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Lock className="w-5 h-5 mr-2 text-green-500" />
              社交账号绑定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialAccounts.map((account, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium">{account.name}</span>
                  <p className="text-xs text-gray-500">{account.status}</p>
                </div>
                <Switch checked={account.status === '已绑定'} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 账号安全 */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <KeyRound className="w-5 h-5 mr-2 text-orange-500" />
              账号安全
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => navigate('/settings/account-recovery')}
            >
              <div className="space-y-0.5">
                <span className="text-sm font-medium">账号找回</span>
                <p className="text-xs text-gray-500">设置账号找回方式</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => navigate('/settings/login-activity')}
            >
              <div className="space-y-0.5">
                <span className="text-sm font-medium">登录活动</span>
                <p className="text-xs text-gray-500">查看登录设备和位置</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* 账号注销 */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              注销账号
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认注销账号？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作不可撤销。注销后，您的所有数据将被永久删除。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                确认注销
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AccountSecurity;
