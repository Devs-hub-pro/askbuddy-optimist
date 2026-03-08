import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  MessageSquare,
  Package,
  Star,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useExpertDetail } from '@/hooks/useExperts';
import { demoExperts } from '@/lib/demoData';
import PageStateCard from '@/components/common/PageStateCard';
import { navigateBackOr } from '@/utils/navigation';
import SubPageHeader from '@/components/layout/SubPageHeader';

const ExpertProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isDemoExpert = !!id?.startsWith('demo-expert-');
  const { data: expert, isLoading, error } = useExpertDetail(isDemoExpert ? '' : id || '');
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const resolvedExpert = isDemoExpert ? demoExperts.find((item) => item.id === id) : expert;

  if (!isDemoExpert && isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-white via-slate-50/80 to-slate-50 p-4">
        <PageStateCard variant="loading" title="正在加载个人主页…" />
      </div>
    );
  }

  if (error || !resolvedExpert) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-white via-slate-50/80 to-slate-50 flex flex-col items-center justify-center px-6 text-center">
        <PageStateCard
          variant="error"
          title="暂时无法打开个人主页"
          description="该专家可能已下架，或当前链接已失效。"
          actionLabel="回到首页"
          onAction={() => navigateBackOr(navigate, '/', { location })}
        />
      </div>
    );
  }

  const education = Array.isArray(resolvedExpert.education) ? resolvedExpert.education : [];
  const experience = Array.isArray(resolvedExpert.experience) ? resolvedExpert.experience : [];
  const timeSlots = Array.isArray(resolvedExpert.available_time_slots) ? resolvedExpert.available_time_slots : [];
  const displayName = resolvedExpert.nickname || '专家';
  const responseRate = `${Number(resolvedExpert.response_rate || 0)}%`;
  const coverImage =
    resolvedExpert.cover_image ||
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&h=480&q=80';

  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-24">
      <SubPageHeader title="个人主页" onBack={() => navigateBackOr(navigate, '/', { location })} />

      <div className="pt-0">
      <div className="relative">
        <div
          className="w-full h-44 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})`, backgroundPosition: 'center center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
        </div>

      <div className="relative px-4 pb-5 -mt-12">
          <div className="surface-card rounded-3xl p-5">
            <div className="flex justify-between items-end gap-3">
              <div className="flex items-end gap-3">
                <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                  <AvatarImage src={resolvedExpert.avatar_url || ''} alt={displayName} />
                  <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-800">{displayName}</h1>
                    {resolvedExpert.is_verified && (
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        已认证
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{resolvedExpert.title}</p>
                  <div className="flex items-center text-gray-500 text-xs mt-1">
                    <MapPin size={12} className="mr-1" />
                    <span>{resolvedExpert.location || '未设置地区'}</span>
                  </div>
                </div>
              </div>

              <Button
                className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white"
                onClick={() => navigate(`/expert/${resolvedExpert.id}`)}
              >
                前往咨询页
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-5 bg-gray-50 rounded-xl p-3">
              <div className="text-center">
                <div className="flex items-center justify-center text-yellow-500 gap-1 font-semibold">
                  <Star size={14} />
                  <span>{Number(resolvedExpert.rating || 0).toFixed(1)}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">评分</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-blue-500 gap-1 font-semibold">
                  <Clock size={14} />
                  <span>{responseRate}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">回复率</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-green-500 gap-1 font-semibold">
                  <Package size={14} />
                  <span>{resolvedExpert.order_count || 0}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">订单数</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-purple-500 gap-1 font-semibold">
                  <Award size={14} />
                  <span>{resolvedExpert.consultation_count || 0}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">咨询数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="px-4 space-y-5">
        <div className="surface-card rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-800">服务信息</h2>
            <div className="text-sm text-green-600 font-semibold">{resolvedExpert.consultation_price || 0} 积分 / 次</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-gray-500 mb-1">服务分类</div>
              <div className="font-medium text-gray-800">{resolvedExpert.category || '未设置'} / {resolvedExpert.subcategory || '未设置'}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="text-gray-500 mb-1">响应承诺</div>
              <div className="font-medium text-gray-800">{resolvedExpert.response_time || '未设置'}</div>
            </div>
          </div>
          {resolvedExpert.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {resolvedExpert.tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="surface-card rounded-3xl p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">个人介绍</h2>
          <Collapsible open={isBioExpanded} onOpenChange={setIsBioExpanded}>
            <div className="text-sm text-gray-700 leading-7">
              {resolvedExpert.bio && resolvedExpert.bio.length > 180 && !isBioExpanded ? (
                <>
                  <p>{resolvedExpert.bio.slice(0, 180)}...</p>
                  <CollapsibleTrigger className="text-app-teal text-xs mt-2 flex items-center">
                    展开全部 <ChevronDown size={12} className="ml-1" />
                  </CollapsibleTrigger>
                </>
              ) : (
                <>
                  <p>{resolvedExpert.bio || '该专家暂未填写介绍。'}</p>
                  {resolvedExpert.bio && resolvedExpert.bio.length > 180 && (
                    <CollapsibleTrigger className="text-app-teal text-xs mt-2 flex items-center">
                      收起 <ChevronUp size={12} className="ml-1" />
                    </CollapsibleTrigger>
                  )}
                </>
              )}
            </div>
            <CollapsibleContent />
          </Collapsible>
        </div>

        {(education.length > 0 || experience.length > 0) && (
          <div className="surface-card rounded-3xl p-5 space-y-4">
            {education.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-gray-800 font-semibold">
                  <Calendar size={16} className="text-blue-500" />
                  教育经历
                </div>
                <div className="space-y-2">
                  {education.map((item: any, index: number) => (
                    <div key={`edu-${index}`} className="bg-blue-50 rounded-xl p-3 text-sm text-gray-700">
                      {typeof item === 'string' ? item : `${item.school || ''} ${item.degree || ''}`.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-gray-800 font-semibold">
                  <Briefcase size={16} className="text-purple-500" />
                  工作经历
                </div>
                <div className="space-y-2">
                  {experience.map((item: any, index: number) => (
                    <div key={`exp-${index}`} className="bg-purple-50 rounded-xl p-3 text-sm text-gray-700">
                      {typeof item === 'string' ? item : `${item.company || ''} ${item.position || item.title || ''}`.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {timeSlots.length > 0 && (
          <div className="surface-card rounded-3xl p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-3">可预约时间</h2>
            <div className="space-y-2">
              {timeSlots.map((slot: any, index: number) => (
                <div key={`slot-${index}`} className="bg-amber-50 rounded-xl p-3 text-sm text-gray-700">
                  {typeof slot === 'string'
                    ? slot
                    : `${slot.day || ''} ${slot.time || slot.label || ''}`.trim() || '待与专家协商'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/98 border-t p-3 flex gap-3 backdrop-blur-sm" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
        <Button
          variant="outline"
          className="flex-1 rounded-full"
          onClick={() => navigate('/messages')}
        >
          <MessageSquare size={16} className="mr-2" />
          返回消息
        </Button>
        <Button
          className="flex-1 rounded-full bg-gradient-to-r from-green-500 to-teal-500"
          onClick={() => navigate(`/expert/${resolvedExpert.id}`)}
        >
          进入咨询页
        </Button>
      </div>
    </div>
  );
};

export default ExpertProfile;
