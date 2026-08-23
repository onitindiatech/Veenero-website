import React from 'react';
import { InsightStat } from './types';

interface InsightStatsProps {
  stats?: InsightStat[];
  quote?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  } | null;
}

const DEFAULT_STATS: InsightStat[] = [
  { value: '100%', label: 'Water Visibility' },
  { value: '24/7', label: 'Monitoring' },
  { value: 'Real-Time', label: 'Intelligence' },
];

const DEFAULT_QUOTE = {
  title: 'Every drop of water deserves to be measured, verified and understood.',
  eyebrow: 'OUR MISSION',
};

export const InsightStats: React.FC<InsightStatsProps> = ({ stats, quote }) => {
  const displayStats = stats && stats.length > 0 ? stats : DEFAULT_STATS;
  const displayQuote = quote || DEFAULT_QUOTE;

  return (
    <section className="py-12 md:py-16 bg-[#E6F3F3] dark:bg-teal-950/10 border-y border-teal-600/10 relative overflow-hidden select-none">

      {/* Subtle droplet overlay background decoration */}
      <div className="absolute top-[10%] left-[20%] w-6 h-6 rounded-full bg-teal-500/5 border border-teal-500/10 blur-[0.5px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-8 h-8 rounded-full bg-cyan-500/5 border border-cyan-500/10 blur-[1px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-sans">

        {/* Quote / editorial mission text */}
        <div className="lg:col-span-6 text-center lg:text-left space-y-3">
          {displayQuote.eyebrow && (
            <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px]">
              {displayQuote.eyebrow}
            </span>
          )}
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight max-w-lg mx-auto lg:mx-0">
            "{displayQuote.title}"
          </h3>
          {displayQuote.description && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
              {displayQuote.description}
            </p>
          )}
        </div>

        {/* Metrics counters — use dynamic count */}
        <div className={`lg:col-span-6 grid gap-4 text-center grid-cols-${Math.min(displayStats.length, 3)}`}>
          {displayStats.map((stat, i) => (
            <div key={i} className="space-y-1 bg-card/45 backdrop-blur-sm p-4 border border-border/20 rounded-2xl shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-teal-700 dark:text-teal-400 block">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                {stat.label}
              </span>
              {stat.description && (
                <span className="text-[9px] text-muted-foreground/70 block leading-relaxed">
                  {stat.description}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default InsightStats;
