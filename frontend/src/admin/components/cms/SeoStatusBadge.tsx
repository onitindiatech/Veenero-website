import React from 'react';
import { cn } from '@/lib/utils';
import { SeoStatus } from '../../types/cms.types';
import * as Icons from 'lucide-react';

interface SeoStatusBadgeProps {
  status: SeoStatus;
  className?: string;
}

const SEO_CONFIG: Record<SeoStatus, { label: string; icon: string; className: string }> = {
  good: {
    label: 'SEO: Good',
    icon: 'CheckCircle2',
    className:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
  },
  'needs-work': {
    label: 'Needs Work',
    icon: 'AlertTriangle',
    className:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  },
  poor: {
    label: 'SEO: Poor',
    icon: 'XCircle',
    className:
      'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400',
  },
};

export const SeoStatusBadge: React.FC<SeoStatusBadgeProps> = ({ status, className }) => {
  const config = SEO_CONFIG[status];
  const IconComponent = (Icons as any)[config.icon];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold font-sans whitespace-nowrap',
        config.className,
        className
      )}
    >
      {IconComponent && <IconComponent className="h-3 w-3 shrink-0" />}
      {config.label}
    </span>
  );
};

export default SeoStatusBadge;
