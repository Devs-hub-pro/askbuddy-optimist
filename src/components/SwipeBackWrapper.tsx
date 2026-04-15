import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSwipeBack } from '@/hooks/useSwipeBack';

const SwipeBackWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  // 仅在适合的二级页/详情页启用，一级主 Tab 与输入发布页禁用，减少误触返回。
  const swipeBackEnabled =
    /^\/(question|topic|expert|expert-profile|chat)\//.test(pathname) ||
    /^\/(city-selector|notifications|discover\/interactions|search|education\/search|education|career|lifestyle|hobbies|edit-profile|new|skill-publish)$/.test(pathname) ||
    /^\/profile\//.test(pathname) ||
    /^\/settings\//.test(pathname);

  useSwipeBack({ threshold: 80, enabled: swipeBackEnabled });
  return <>{children}</>;
};

export default SwipeBackWrapper;
