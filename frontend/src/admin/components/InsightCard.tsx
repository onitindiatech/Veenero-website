import React from 'react';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface InsightCardProps {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: 'leak' | 'efficiency' | 'cost' | 'anomaly';
  priority: 'high' | 'medium' | 'low';
  siteName?: string;
  savingsOpportunity?: string;
  onAction?: (id: string) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  id,
  title,
  description,
  impact,
  category,
  priority,
  siteName,
  savingsOpportunity,
  onAction,
}) => {
  // Select icon based on category
  let categoryIcon = <Icons.Lightbulb className="h-5 w-5" />;
  if (category === 'leak') categoryIcon = <Icons.Droplets className="h-5 w-5" />;
  if (category === 'anomaly') categoryIcon = <Icons.Activity className="h-5 w-5" />;
  if (category === 'cost') categoryIcon = <Icons.DollarSign className="h-5 w-5" />;

  return (
    <div
      className={cn(
        "relative rounded-xl border p-5 transition-all duration-300 bg-card/60 hover:shadow-md",
        priority === 'high' && "border-l-4 border-l-rose-500 border-border/30",
        priority === 'medium' && "border-l-4 border-l-amber-500 border-border/30",
        priority === 'low' && "border-l-4 border-l-sky-500 border-border/30"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div
            className={cn(
              "p-2.5 rounded-lg shrink-0 mt-0.5",
              priority === 'high' && "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400",
              priority === 'medium' && "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400",
              priority === 'low' && "bg-sky-50 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400"
            )}
          >
            {categoryIcon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-foreground font-sans">{title}</h4>
              {siteName && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground font-sans">
                  {siteName}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed">
              {description}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs font-sans">
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <Icons.Sparkles className="h-3.5 w-3.5 shrink-0" />
                {savingsOpportunity}
              </span>
              <span className="text-muted-foreground italic">{impact}</span>
            </div>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction?.(id)}
          className="text-xs border-border/50 hover:bg-muted font-sans shrink-0"
        >
          Resolve
        </Button>
      </div>
    </div>
  );
};
export default InsightCard;
