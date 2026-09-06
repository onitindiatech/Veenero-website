import React from 'react';
import { InsightStat } from './types';
import { Quote } from 'lucide-react';

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
  { value: '24/7', label: 'Telemetry Monitoring' },
  { value: 'Real-Time', label: 'Water Intelligence' },
];

const DEFAULT_QUOTE = {
  title: 'Every drop of water deserves to be measured, verified and understood.',
  eyebrow: 'OUR MISSION',
};

export const InsightStats: React.FC<InsightStatsProps> = ({ stats, quote }) => {
  const displayStats = stats && stats.length > 0 ? stats : DEFAULT_STATS;
  const displayQuote = quote || DEFAULT_QUOTE;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-teal-900/90 via-teal-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-teal-500/30 shadow-xl relative overflow-hidden select-none font-sans">
      {/* Background Ripple Effect */}
      <div className="absolute right-[-20px] bottom-[-20px] w-80 h-80 opacity-20 pointer-events-none z-0">
        <div className="absolute inset-0 rounded-full border border-teal-400 opacity-60" />
        <div className="absolute inset-8 rounded-full border border-cyan-400 opacity-40" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Editorial Mission Text */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2">
            <Quote className="w-8 h-8 text-teal-400/40 shrink-0" />
            {displayQuote.eyebrow && (
              <span className="text-cyan-300 font-bold uppercase tracking-widest text-[10px] block">
                {displayQuote.eyebrow}
              </span>
            )}
          </div>
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
            "{displayQuote.title}"
          </h3>
          {displayQuote.description && (
            <p className="text-xs sm:text-sm text-cyan-100/80 leading-relaxed max-w-lg">
              {displayQuote.description}
            </p>
          )}
        </div>

        {/* Metric Counter Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {displayStats.map((stat, i) => (
            <div key={i} className="bg-slate-900/60 backdrop-blur-md p-4 border border-teal-500/20 rounded-2xl text-center space-y-1">
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-teal-400 block tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-200 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default InsightStats;
