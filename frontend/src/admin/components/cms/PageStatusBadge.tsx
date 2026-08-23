import React from 'react';
import { cn } from '@/lib/utils';
import { PageStatus } from '../../types/cms.types';

interface PageStatusBadgeProps {
  status: PageStatus;
  className?: string;
}

export const PageStatusBadge: React.FC<PageStatusBadgeProps> = ({ status, className }) => {
  const isPublished = status === 'published';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-sans whitespace-nowrap',
        isPublished
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
        className
      )}
    >
      {/* Status dot */}
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
        )}
      />
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
};

export default PageStatusBadge;
