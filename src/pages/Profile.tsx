import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Heart,
  Users,
  FileText,
  Award,
  Star,
  User,
  List,
  MessageSquareText,
  UserPlus,
  Coins,
  Edit3,
  LogOut,
  Loader2,
  Camera,
  ChevronRight,
  ImagePlus,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BottomNav from '@/components/BottomNav';
import SettingsMenu from '@/components/profile/SettingsMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useUploadAvatar, useUploadCover, useUpdateProfile } from '@/hooks/useProfile';
import { useProfileStats } from '@/hooks/useProfileData';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar();
  const uploadCover = useUploadCover();
  const updateProfile = useUpdateProfile();
  const { data: stats } = useProfileStats();

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
    toast({ title: '已退出登录' });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadAvatar.mutateAsync(file);
      await updateProfile.mutateAsync({ avatar_url: publicUrl });
    } catch {
      // error handled in mutation
    } finally {
      setUploading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const publicUrl = await uploadCover.mutateAsync(file);
      await updateProfile.mutateAsync({ cover_url: publicUrl });
    } catch {
      // error handled in mutation
    } finally {
      setCoverUploading(false);
    }
  };

  const profileStats = [
    { label: '订单', count: stats?.orders || 0, route: '/profile/orders' },
    { label: '回答', count: stats?.answers || 0, route: '/profile/answers' },
    { label: '收藏', count: stats?.favorites || 0, route: '/profile/favorites' },
    { label: '关注', count: stats?.following || 0, route: '/profile/following' },
  ];

  const commonFeatures = [
    { icon: <Coins size={22} className="text-amber-500" />, label: '我的收益', route: '/profile/earnings' },
    { icon: <UserPlus size={22} className="text-indigo-500" />, label: '我的社群', route: '/profile/community' },
    { icon: <FileText size={22} className="text-primary" />, label: '草稿箱', route: '/profile/drafts' },
    { icon: <Award size={22} className="text-orange-500" />, label: '达人认证', route: '/profile/talent-certification' },
  ];

  const menuItems = [
    { icon: <Heart size={18} className="text-destructive" />, label: '我的收藏', route: '/profile/favorites' },
    { icon: <List size={18} className="text-primary" />, label: '我的订单', route: '/profile/orders' },
    { icon: <MessageSquareText size={18} className="text-green-500" />, label: '我的回答', route: '/profile/answers' },
    { icon: <Users size={18} className="text-purple-500" />, label: '我的关注', route: '/profile/following' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const coverUrl = (profile as any)?.cover_url;

  return (
    <div className="min-h-screen bg-muted pb-16">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverUpload}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />

      <SettingsMenu 
        isOpen={showSettingsMenu} 
        onClose={() => setShowSettingsMenu(false)} 
      />

      {/* Cover Banner */}
      <div className="relative">
        <div 
          className="h-44 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 relative overflow-hidden"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          {coverUrl && (
            <img 
              src={coverUrl} 
              alt="封面" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          
          {/* Top buttons */}
          <div className="absolute top-0 right-0 flex items-center gap-1 pr-3" style={{ top: 'calc(env(safe-area-inset-top) + 0.5rem)' }}>
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm rounded-full h-8 w-8"
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
              >
                {coverUploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm rounded-full h-8 w-8"
              onClick={() => setShowSettingsMenu(true)}
            >
              <Settings size={18} />
            </Button>
          </div>
        </div>

        {/* Profile info overlapping the banner */}
        <div className="px-5 -mt-10 relative z-10">
          {isLoggedIn ? (
            <div>
              {/* Avatar */}
              <div className="flex items-end gap-3">
                <div className="relative group">
                  <Avatar className="h-[72px] w-[72px] border-[3px] border-background shadow-lg">
                    {avatarLoading && profile?.avatar_url && (
                      <Skeleton className="absolute inset-0 rounded-full" />
                    )}
                    <AvatarImage 
                      src={profile?.avatar_url || ''} 
                      alt={profile?.nickname || '用户'} 
                      onLoad={() => setAvatarLoading(false)}
                      onError={() => setAvatarLoading(false)}
                      className={avatarLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xl font-semibold">
                      {profile?.nickname?.charAt(0) || <User size={24} />}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm border-2 border-background"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                  </button>
                </div>
                
                {/* Action buttons on the right */}
                <div className="flex-1 flex justify-end gap-2 pb-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs h-8 px-3 gap-1"
                    onClick={() => navigate('/edit-profile')}
                  >
                    <Edit3 size={12} />
                    编辑资料
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-xs h-8 px-3 gap-1 text-muted-foreground"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                    退出
                  </Button>
                </div>
              </div>

              {/* Name & bio */}
              <div className="mt-2.5">
                <h2 className="text-lg font-bold text-foreground">{profile?.nickname || '新用户'}</h2>
                {profile?.bio && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{profile.bio}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded-full text-xs font-medium text-amber-600">
                    <Star size={11} className="mr-1" />
                    {profile?.points_balance || 0} 积分
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <Avatar className="h-[72px] w-[72px] border-[3px] border-background shadow-lg">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User size={28} />
                </AvatarFallback>
              </Avatar>
              <Button 
                className="rounded-full font-medium px-6 shadow-sm mb-1"
                onClick={() => navigate('/auth')}
              >
                登录 / 注册
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-5 mt-4">
        <Card className="border-none shadow-md rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-4">
              {profileStats.map((item, index) => (
                <button 
                  key={item.label}
                  className={`flex flex-col items-center py-4 hover:bg-muted/50 transition-colors active:bg-muted ${
                    index < profileStats.length - 1 ? 'border-r border-border' : ''
                  }`}
                  onClick={() => isLoggedIn ? navigate(item.route) : navigate('/auth')}
                >
                  <span className="text-xl font-bold text-foreground">{item.count}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{item.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Features */}
      <div className="px-5 mt-4">
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                <Star size={14} className="text-primary" />
              </span>
              常用功能
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {commonFeatures.map((item, index) => (
                <button 
                  key={index}
                  className="flex flex-col items-center justify-center py-3 rounded-xl hover:bg-muted/60 transition-colors active:scale-95"
                  onClick={() => isLoggedIn ? navigate(item.route) : navigate('/auth')}
                >
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-2 shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-xs text-foreground">{item.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu List */}
      <div className="px-5 mt-4">
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors active:bg-muted ${
                  index < menuItems.length - 1 ? 'border-b border-border' : ''
                }`}
                onClick={() => isLoggedIn ? navigate(item.route) : navigate('/auth')}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
