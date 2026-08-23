import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ChartCardProps {
  title: string;
  description?: string;
  className?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  className,
  headerActions,
  children,
}) => {
  return (
    <Card className={cn("bg-card/60 backdrop-blur-md border border-border/40 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex flex-col gap-1 pr-4">
          <CardTitle className="text-base font-bold text-foreground font-sans leading-none">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
              {description}
            </CardDescription>
          )}
        </div>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </CardHeader>
      <CardContent className="pb-6 pt-0 flex-1 flex flex-col justify-center min-h-[280px]">
        {children}
      </CardContent>
    </Card>
  );
};
export default ChartCard;
