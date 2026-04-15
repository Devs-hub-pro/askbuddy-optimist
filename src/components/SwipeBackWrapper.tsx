import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSwipeBack } from '@/hooks/useSwipeBack';

const SwipeBackWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isDetailRoute = /^\/(question|topic|expert|expert-profile|chat)\//.test(pathname);
  const isSecondaryRoute = /^\/(city-selector|notifications|discover\/interactions|search|education\/search|education|career|lifestyle|hobbies)$/.test(pathname);
  const isProfileOrSettingsRoute = /^\/profile\//.test(pathname) || /^\/settings\//.test(pathname);
  const isEditorRoute = /^\/(new|skill-publish|edit-profile)$/.test(pathname);

  // 一级 Tab 根页禁用；详情页/二级页启用；编辑页允许左滑但会受页面级禁用开关约束。
  const swipeBackEnabled = isDetailRoute || isSecondaryRoute || isProfileOrSettingsRoute || isEditorRoute;
  const swipeBackThreshold = isEditorRoute ? 108 : 80;

  useSwipeBack({ threshold: swipeBackThreshold, enabled: swipeBackEnabled });
  return <>{children}</>;
};

export default SwipeBackWrapper;
