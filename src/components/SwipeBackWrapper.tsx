import React from 'react';
import { useSwipeBack } from '@/hooks/useSwipeBack';

const SwipeBackWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useSwipeBack({ threshold: 80, enabled: true });
  return <>{children}</>;
};

export default SwipeBackWrapper;
