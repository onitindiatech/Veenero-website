import React from "react";
import { Leaf, TrendingUp, Code2, Users, Cpu, LineChart, ShieldCheck, HeartHandshake } from "lucide-react";

/**
 * 1. HERO CAREERS VECTOR VISUAL
 * Displays a central water droplet surrounded by talent & innovation badges.
 */
export const HeroCareersVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto flex items-center justify-center p-4 select-none">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 via-cyan-400/20 to-blue-600/10 rounded-full blur-3xl -z-10" />

      {/* SVG Water Splash Waves Base */}
      <svg className="absolute bottom-0 w-full h-28 text-cyan-500/15 pointer-events-none" viewBox="0 0 500 120" preserveAspectRatio="none">
        <path fill="currentColor" d="M0,40 C150,90 350,-10 500,40 L500,120 L0,120 Z" />
        <path fill="currentColor" opacity="0.5" d="M0,60 C200,10 300,80 500,50 L500,120 L0,120 Z" />
      </svg>

      {/* Central Visual Container */}
      <div className="relative w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96 flex items-center justify-center">
        
        {/* Orbital Ring Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="140" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.3" />
        </svg>

        {/* Central Water Droplet Badge */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-cyan-300 via-teal-500 to-blue-700 p-1 shadow-glow relative z-10">
          <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-center p-2 border border-cyan-200/40">
            <svg viewBox="0 0 100 100" className="w-12 h-12 mb-1">
              <path d="M50 15 C50 15 25 55 25 68 C25 82 36 88 50 88 C64 88 75 82 75 68 C75 55 50 15 50 15 Z" fill="#38bdf8" />
              <ellipse cx="42" cy="55" rx="5" ry="10" fill="#ffffff" opacity="0.4" transform="rotate(-20 42 55)" />
            </svg>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-200">
              JOIN OUR TEAM
            </span>
          </div>
        </div>

        {/* --- FLOATING BADGE 1: IoT & Hardware (Top Left) --- */}
        <div className="absolute top-2 -left-4 bg-white/95 dark:bg-slate-900/95 border border-teal-500/30 shadow-md rounded-full px-3.5 py-2 flex items-center gap-2.5 backdrop-blur-md z-20">
          <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 pr-1">IoT Systems</span>
        </div>

        {/* --- FLOATING BADGE 2: Data Science & AI (Top Right) --- */}
        <div className="absolute top-10 -right-4 bg-white/95 dark:bg-slate-900/95 border border-cyan-500/30 shadow-md rounded-full px-3.5 py-2 flex items-center gap-2.5 backdrop-blur-md z-20">
          <div className="w-7 h-7 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-700 dark:text-cyan-300">
            <LineChart className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 pr-1">Data Science</span>
        </div>

        {/* --- FLOATING BADGE 3: Water Conservation (Bottom Left) --- */}
        <div className="absolute bottom-6 -left-2 bg-white/95 dark:bg-slate-900/95 border border-emerald-500/30 shadow-md rounded-full px-3.5 py-2 flex items-center gap-2.5 backdrop-blur-md z-20">
          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 pr-1">Conservation</span>
        </div>

        {/* --- FLOATING BADGE 4: Engineering (Bottom Right) --- */}
        <div className="absolute bottom-10 -right-2 bg-white/95 dark:bg-slate-900/95 border border-blue-500/30 shadow-md rounded-full px-3.5 py-2 flex items-center gap-2.5 backdrop-blur-md z-20">
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-700 dark:text-blue-300">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 pr-1">Engineering</span>
        </div>

      </div>
    </div>
  );
};

/**
 * 2. WHY JOIN US ICON
 */
export const WhyJoinIcon: React.FC<{ index: number }> = ({ index }) => {
  const icons = [Leaf, TrendingUp, Code2, Users];
  const IconComponent = icons[index % icons.length] || Leaf;

  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950 dark:to-cyan-950 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-sm mb-4 shrink-0">
      <IconComponent className="w-7 h-7" />
    </div>
  );
};
