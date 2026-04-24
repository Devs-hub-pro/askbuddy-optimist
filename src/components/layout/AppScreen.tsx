import React from 'react';
import { cn } from '@/lib/utils';

interface AppScreenProps {
  children: React.ReactNode;
  className?: string;
  includeBottomNavPadding?: boolean;
}

const AppScreen: React.FC<AppScreenProps> = ({ children, className, includeBottomNavPadding = false }) => {
  return (
    <div
      className={cn(
        'app-container app-platform-screen min-h-[100dvh]',
        includeBottomNavPadding && 'pb-[calc(4rem+env(safe-area-inset-bottom))]',
        className
      )}
    >
      {children}
    </div>
  );
};

export default AppScreen;
