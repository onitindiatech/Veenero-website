import React from 'react';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  timeframe: string;
  iconName: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  timeframe,
  iconName,
  color,
}) => {
  // Dynamically resolve icon
  const IconComponent = (Icons as any)[iconName];

  // Smart trend check
  // An increase (up) in a non-destructive metric is good (green).
  // A decrease (down) in a destructive metric (like water loss or alerts) is also good (green).
  const isGood =
    (trend === 'up' && color !== 'destructive') ||
    (trend === 'down' && color === 'destructive');

  const isNeutral = trend === 'neutral';

  return (
    <Card className="relative overflow-hidden bg-card/60 backdrop-blur-md border border-border/40 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300">
      {/* Decorative accent gradient line on top */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 transition-all duration-300",
          color === 'ocean' && "bg-gradient-to-r from-teal-700 to-cyan-600",
          color === 'sage' && "bg-gradient-to-r from-emerald-600 to-teal-500",
          color === 'destructive' && "bg-gradient-to-r from-rose-500 to-amber-500"
        )}
      />

      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground tracking-wide font-sans">
            {title}
          </span>
          <div
            className={cn(
              "p-2.5 rounded-xl transition-all duration-300",
              color === 'ocean' && "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
              color === 'sage' && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
              color === 'destructive' && "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
            )}
          >
            {IconComponent && <IconComponent className="h-5 w-5 stroke-[2]" />}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <span className="text-2xl font-bold tracking-tight text-foreground font-sans">
            {value}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold font-sans",
                isNeutral
                  ? "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                  : isGood
                  ? "text-emerald-700 bg-emerald-50/80 dark:text-emerald-400 dark:bg-emerald-950/30"
                  : "text-rose-700 bg-rose-50/80 dark:text-rose-400 dark:bg-rose-950/30"
              )}
            >
              {!isNeutral && (
                <span className="text-[10px]">
                  {trend === 'up' ? '▲' : '▼'}
                </span>
              )}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-muted-foreground font-sans">
              {timeframe}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default StatCard;
