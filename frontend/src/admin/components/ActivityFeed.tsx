import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'auth' | 'settings' | 'incident' | 'content';
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'incident':
        return <Icons.AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      case 'auth':
        return <Icons.Key className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'settings':
        return <Icons.Settings className="h-4 w-4 text-teal-600 dark:text-teal-400" />;
      case 'content':
        return <Icons.FileText className="h-4 w-4 text-sky-600 dark:text-sky-400" />;
      default:
        return <Icons.Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'incident':
        return 'bg-rose-50 dark:bg-rose-950/20';
      case 'auth':
        return 'bg-amber-50 dark:bg-amber-950/20';
      case 'settings':
        return 'bg-teal-50 dark:bg-teal-950/20';
      case 'content':
        return 'bg-sky-50 dark:bg-sky-950/20';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex gap-4 text-sm font-sans">
            {/* Timeline bullet icon wrapper */}
            <div
              className={cn(
                "absolute -left-9 p-1.5 rounded-full border border-background shadow-sm shrink-0 flex items-center justify-center",
                getBg(activity.type)
              )}
            >
              {getIcon(activity.type)}
            </div>

            <div className="flex-1 flex justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  <span className="font-bold">{activity.user}</span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>{' '}
                  {activity.target && <span className="font-semibold text-foreground/80">({activity.target})</span>}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                {activity.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ActivityFeed;
