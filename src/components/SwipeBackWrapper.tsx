import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSwipeBack } from '@/hooks/useSwipeBack';

const SwipeBackWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  // 仅在“二级及更深页面”启用，一级主 Tab 和频道首页禁用，避免误触。
  const swipeBackEnabled = ![
    '/',
    '/discover',
    '/messages',
    '/profile',
    '/education',
    '/career',
    '/lifestyle',
    '/hobbies',
  ].includes(pathname);

  useSwipeBack({ threshold: 80, enabled: swipeBackEnabled });
  return <>{children}</>;
};

export default SwipeBackWrapper;
