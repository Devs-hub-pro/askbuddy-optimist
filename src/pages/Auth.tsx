import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, User, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 验证码相关状态
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  
  // 表单数据
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirmPassword: '', nickname: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast({ title: '请填写完整信息', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    const { error } = await signIn(loginForm.email, loginForm.password);
    setLoading(false);
    
    if (error) {
      let errorMsg = error.message;
      if (error.message === 'Invalid login credentials') {
        errorMsg = '邮箱或密码错误';
      } else if (error.message === 'Email not confirmed') {
        errorMsg = '邮箱未验证，请先完成验证';
        // 提示用户可以重新发送验证码
        setPendingEmail(loginForm.email);
        setPendingPassword(loginForm.password);
        setShowOtpVerify(true);
        // 发送新的验证码
        await supabase.auth.resend({
          type: 'signup',
          email: loginForm.email,
        });
        toast({ 
          title: '验证码已发送', 
          description: '请查看邮箱并输入6位验证码' 
        });
        setLoading(false);
        return;
      }
      toast({ 
        title: '登录失败', 
        description: errorMsg,
        variant: 'destructive' 
      });
    } else {
      toast({ title: '登录成功', description: '欢迎回来！' });
      navigate('/profile');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      toast({ title: '请填写完整信息', variant: 'destructive' });
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({ title: '两次密码不一致', variant: 'destructive' });
      return;
    }
    
    if (registerForm.password.length < 6) {
      toast({ title: '密码至少6位', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    
    const { error, data } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          nickname: registerForm.nickname || '新用户'
        }
      }
    });
    
    setLoading(false);
    
    if (error) {
      toast({ 
        title: '注册失败', 
        description: error.message,
        variant: 'destructive' 
      });
    } else if (data.user) {
      // 保存待验证的邮箱和密码
      setPendingEmail(registerForm.email);
      setPendingPassword(registerForm.password);
      setShowOtpVerify(true);
      toast({ 
        title: '验证码已发送', 
        description: '请查看邮箱并输入6位验证码' 
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast({ title: '请输入6位验证码', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    
    const { error } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token: otpCode,
      type: 'email',
    });
    
    if (error) {
      setLoading(false);
      toast({ 
        title: '验证失败', 
        description: '验证码错误或已过期，请重试',
        variant: 'destructive' 
      });
      return;
    }
    
    // 验证成功后自动登录
    const { error: loginError } = await signIn(pendingEmail, pendingPassword);
    setLoading(false);
    
    if (loginError) {
      toast({ 
        title: '验证成功', 
        description: '请使用邮箱和密码登录' 
      });
      setShowOtpVerify(false);
      setActiveTab('login');
      setLoginForm({ email: pendingEmail, password: '' });
    } else {
      toast({ title: '验证成功', description: '欢迎加入问问！' });
      navigate('/profile');
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: pendingEmail,
    });
    setLoading(false);
    
    if (error) {
      toast({ title: '发送失败', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '验证码已重新发送', description: '请查看邮箱' });
    }
  };

  // OTP 验证界面
  if (showOtpVerify) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={() => setShowOtpVerify(false)}>
            <ChevronLeft size={24} />
          </Button>
          <span className="text-lg font-medium ml-2">邮箱验证</span>
        </div>

        <div className="flex flex-col items-center py-8 px-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <KeyRound size={32} className="text-primary" />
          </div>
          
          <h2 className="text-xl font-bold text-foreground mb-2">输入验证码</h2>
          <p className="text-muted-foreground text-sm text-center mb-6">
            验证码已发送至 <span className="text-foreground font-medium">{pendingEmail}</span>
          </p>

          <Card className="w-full max-w-sm border-none shadow-lg">
            <CardHeader className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={setOtpCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                className="w-full" 
                onClick={handleVerifyOtp}
                disabled={loading || otpCode.length !== 6}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                验证
              </Button>

              <div className="text-center">
                <button 
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  重新发送验证码
                </button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Header */}
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </Button>
        <span className="text-lg font-medium ml-2">登录 / 注册</span>
      </div>

      {/* Logo Area */}
      <div className="flex flex-col items-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <span className="text-3xl font-bold text-primary-foreground">问</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">问问</h1>
        <p className="text-muted-foreground text-sm mt-1">专业的智能问答社区</p>
      </div>

      {/* Auth Form */}
      <div className="px-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">邮箱</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="请输入邮箱"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="请输入密码"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    登录
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-nickname">昵称（可选）</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-nickname"
                        type="text"
                        placeholder="给自己取个名字"
                        className="pl-10"
                        value={registerForm.nickname}
                        onChange={(e) => setRegisterForm({ ...registerForm, nickname: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">邮箱</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="请输入邮箱"
                        className="pl-10"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="至少6位密码"
                        className="pl-10 pr-10"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">确认密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="再次输入密码"
                        className="pl-10"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    注册
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    注册即表示同意《用户协议》和《隐私政策》
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
