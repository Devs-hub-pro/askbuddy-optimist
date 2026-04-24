import React from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ children, className, compact = false }) => {
  return (
    <div className={cn('surface-card rounded-3xl', compact ? 'p-3' : 'p-4', className)}>
      {children}
    </div>
  );
};

export default SectionCard;
