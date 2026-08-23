import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface AlertCardProps {
  id: string;
  siteName: string;
  location: string;
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  status: 'active' | 'acknowledged';
  onAcknowledge?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  id,
  siteName,
  location,
  issue,
  severity,
  timestamp,
  status,
  onAcknowledge,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all duration-300 flex items-start justify-between gap-4 bg-card/40 backdrop-blur-sm",
        severity === 'critical' && "border-l-4 border-l-rose-600 bg-rose-50/10 dark:bg-rose-950/5",
        severity === 'warning' && "border-l-4 border-l-amber-500 bg-amber-50/10 dark:bg-amber-950/5",
        severity === 'info' && "border-l-4 border-l-sky-500 bg-sky-50/10 dark:bg-sky-950/5"
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "p-2 rounded-lg mt-0.5",
            severity === 'critical' && "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
            severity === 'warning' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            severity === 'info' && "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
          )}
        >
          {severity === 'critical' && <Icons.AlertOctagon className="h-4.5 w-4.5" />}
          {severity === 'warning' && <Icons.AlertTriangle className="h-4.5 w-4.5" />}
          {severity === 'info' && <Icons.Info className="h-4.5 w-4.5" />}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-foreground font-sans">{siteName}</span>
            <span className="text-[10px] text-muted-foreground font-sans">{location}</span>
          </div>
          <p className="text-xs font-semibold text-foreground/80 mt-1 font-sans">{issue}</p>
          <span className="text-[10px] text-muted-foreground mt-2 block font-sans">{timestamp}</span>
        </div>
      </div>

      {status === 'active' && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAcknowledge?.(id)}
          className={cn(
            "text-xs hover:bg-muted font-sans shrink-0 px-2.5 h-8",
            severity === 'critical' && "text-rose-600 hover:text-rose-700 dark:text-rose-400",
            severity === 'warning' && "text-amber-600 hover:text-amber-700 dark:text-amber-400",
            severity === 'info' && "text-sky-600 hover:text-sky-700 dark:text-sky-400"
          )}
        >
          Acknowledge
        </Button>
      )}
    </div>
  );
};
export default AlertCard;
