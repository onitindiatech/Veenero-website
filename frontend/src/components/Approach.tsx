import React, { useState } from "react";
import { CheckCircle2, Waves } from "lucide-react";
import { getWaterPhotograph } from "@/utils/waterImages";
import { waterFlow, analyticsGrowth, sustainabilityLeaf } from "@/assets/animations";

// Types
interface StageData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
}

const STAGES: StageData[] = [
  {
    id: "sense",
    number: "01",
    title: "Sense",
    subtitle: "Measure Every Litre",
    description: "Onboard your water data sources to build Water Visibility—so usage is measurable across sites, assets, and operations.",
    points: ["Data capture mapping", "Baseline measurement", "Integrity & validation checks"],
  },
  {
    id: "intelligence",
    number: "02",
    title: "Intelligence",
    subtitle: "Monitor & Benchmark",
    description: "Use real-time analytics to track performance, compare across peers, and surface Water Risk early.",
    points: ["Real-time monitoring", "Benchmarking & comparison", "Risk identification"],
  },
  {
    id: "optimize",
    number: "03",
    title: "Optimize",
    subtitle: "Actionable Insights",
    description: "Turn insights into prioritized actions that reduce waste and improve efficiency.",
    points: ["Insight generation", "Action prioritization", "Efficiency improvement"],
  },
  {
    id: "innovate",
    number: "04",
    title: "Innovate",
    subtitle: "Long-term Sustainability",
    description: "Continuously evolve strategies and technologies to build a resilient and water-positive future.",
    points: ["Sustainable strategies", "Technology innovation", "Continuous improvement"],
  }
];

const VALUES = [
  {
    title: "Data Integrity",
    desc: "Robust validation ensures accurate and reliable water data.",
    icon: <CheckCircle2 className="w-5 h-5" />
  },
  {
    title: "Evidence-Based",
    desc: "Every decision is backed by real data and advanced analytics.",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  },
  {
    title: "Collaborative",
    desc: "We work closely with your teams for measurable outcomes.",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  },
  {
    title: "Impact Driven",
    desc: "Focused on long-term value for people and the planet.",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
  }
];

export const Approach: React.FC = () => {
  const [activeRipple, setActiveRipple] = useState<string | null>(null);

  const handleNodeClick = (id: string) => {
    setActiveRipple(id);
    setTimeout(() => setActiveRipple(null), 800);
  };

  return (
    <section id="approach" className="py-20 md:py-28 bg-[#FCFDFD] dark:bg-background relative overflow-hidden select-none">
      
      {/* Dynamic styles for the SVG wave animation */}
      <style>{`
        @keyframes dashFlow {
          0% { stroke-dashoffset: 2400; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes rippleExpand {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .water-path-bg {
          stroke-dasharray: 20 20;
          animation: dashFlow 40s linear infinite;
        }
        .water-path-main {
          stroke-dasharray: 2400;
          stroke-dashoffset: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .water-path-bg { animation: none; stroke-dasharray: none; }
        }
        .node-hover-glow {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .node-hover-glow:hover {
          box-shadow: 0 0 30px rgba(13, 148, 136, 0.25);
          transform: translateY(-4px) scale(1.03);
          border-color: rgba(20, 184, 166, 0.5);
        }
        .ripple-effect {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(20, 184, 166, 0.2);
          pointer-events: none;
          z-index: 0;
          animation: rippleExpand 0.8s ease-out forwards;
        }
      `}</style>

      <div className="container mx-auto px-6 md:px-12 max-w-[1400px] relative z-10">
        
        {/* SECTION HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-24 animate-fade-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-xs">
              OUR APPROACH
            </p>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.1] mb-6">
            A Proven Path to<br className="hidden sm:block" /> Water Sustainability
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Our methodical four-step process transforms water data into actionable insights, driving measurable impact and long-term sustainability.
          </p>
        </div>

        {/* --- DESKTOP ANIMATED WATER FLOW ROADMAP --- */}
        <div className="hidden lg:block relative w-full h-[620px] mb-20">
          
          {/* Continuous SVG Water Path Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 1200 620" 
              preserveAspectRatio="none" 
              className="overflow-visible"
            >
              <defs>
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ccfbf1" stopOpacity="0" />
                  <stop offset="20%" stopColor="#14b8a6" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#14b8a6" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#ccfbf1" stopOpacity="0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Ultra soft background wave */}
              <path 
                d="M 0 275 C 75 275, 75 275, 150 275 C 250 275, 350 345, 450 345 C 550 345, 650 275, 750 275 C 850 275, 950 345, 1050 345 C 1125 345, 1125 345, 1200 345" 
                fill="none" 
                stroke="#14b8a6" 
                strokeWidth="36" 
                className="opacity-[0.04] dark:opacity-[0.07]"
                strokeLinecap="round"
              />
              {/* Secondary flowing dashed wave */}
              <path 
                d="M 0 275 C 75 275, 75 275, 150 275 C 250 275, 350 345, 450 345 C 550 345, 650 275, 750 275 C 850 275, 950 345, 1050 345 C 1125 345, 1125 345, 1200 345" 
                fill="none" 
                stroke="#0d9488" 
                strokeWidth="2.5" 
                className="water-path-bg opacity-35"
              />
              {/* Main solid glowing water path */}
              <path 
                d="M 0 275 C 75 275, 75 275, 150 275 C 250 275, 350 345, 450 345 C 550 345, 650 275, 750 275 C 850 275, 950 345, 1050 345 C 1125 345, 1125 345, 1200 345" 
                fill="none" 
                stroke="url(#waterGrad)" 
                strokeWidth="4" 
                className="water-path-main opacity-90"
                filter="url(#glow)"
              />
            </svg>
          </div>

          {/* 4 Connected Stage Cards positioned in safe content areas around the wave */}
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            
            // X center positions: 12.5%, 37.5%, 62.5%, 87.5%
            const horizontalPositions = ["12.5%", "37.5%", "62.5%", "87.5%"];
            const isTop = idx % 2 === 0; // Alternating top (Sense, Optimize) & bottom (Intelligence, Innovate)
            
            // Wave y-centers for nodes: Node 1 (275px), Node 2 (345px), Node 3 (275px), Node 4 (345px)
            const nodeY = isTop ? 275 : 345;

            return (
              <div 
                key={stage.id} 
                className="absolute flex flex-col items-center w-[270px] -ml-[135px] z-10 group"
                style={{ left: horizontalPositions[idx], top: 0, bottom: 0 }}
              >
                {/* --- TOP STAGE CARD (Sense 01, Optimize 03) --- */}
                {isTop && (
                  <>
                    {/* Safe Content Card Area */}
                    <div 
                      className="absolute bottom-[390px] w-full bg-white/95 dark:bg-card/95 backdrop-blur-md border border-border/70 dark:border-border/50 rounded-2xl p-5 shadow-sm group-hover:border-teal-500/40 group-hover:shadow-md transition-all duration-300 z-20 animate-fade-up opacity-0 [animation-fill-mode:forwards]"
                      style={{ animationDelay: `${idx * 150 + 150}ms` }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                          STAGE {stage.number}
                        </span>
                        <div className="text-3xl font-display font-bold text-teal-800/10 dark:text-teal-400/15 leading-none select-none">
                          {stage.number}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-foreground mb-0.5">{stage.title}</h3>
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">{stage.subtitle}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{stage.description}</p>
                      
                      <ul className="text-[11px] text-muted-foreground space-y-1.5 border-t border-border/40 pt-2.5">
                        {stage.points.map((p, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Vertical Connector Line to Wave Node */}
                    <div 
                      className="absolute w-[2px] bg-gradient-to-b from-teal-400/40 to-teal-500/80 dark:from-teal-600/40 dark:to-teal-400/80 z-10"
                      style={{ top: "230px", height: `${nodeY - 230}px` }}
                    />
                    {/* Interactive Wave Node Badge */}
                    <div 
                      className="absolute cursor-pointer z-20"
                      style={{ top: `${nodeY - 32}px` }}
                      onClick={() => handleNodeClick(stage.id)}
                    >
                      <div className="w-[64px] h-[64px] rounded-full bg-white dark:bg-card border-[3px] border-teal-200 dark:border-teal-800 flex items-center justify-center shadow-md node-hover-glow relative z-10 overflow-hidden">
                        <img
                          src={getWaterPhotograph(undefined, stage.title, idx)}
                          alt={stage.title}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      {activeRipple === stage.id && (
                        <div className="ripple-effect" />
                      )}
                    </div>
                  </>
                )}

                {/* --- BOTTOM STAGE CARD (Intelligence 02, Innovate 04) --- */}
                {!isTop && (
                  <>
                    {/* Interactive Wave Node Badge */}
                    <div 
                      className="absolute cursor-pointer z-20"
                      style={{ top: `${nodeY - 32}px` }}
                      onClick={() => handleNodeClick(stage.id)}
                    >
                      <div className="w-[64px] h-[64px] rounded-full bg-white dark:bg-card border-[3px] border-teal-200 dark:border-teal-800 flex items-center justify-center shadow-md node-hover-glow relative z-10 overflow-hidden">
                        <img
                          src={getWaterPhotograph(undefined, stage.title, idx)}
                          alt={stage.title}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      {activeRipple === stage.id && (
                        <div className="ripple-effect" />
                      )}
                    </div>

                    {/* Vertical Connector Line from Wave Node */}
                    <div 
                      className="absolute w-[2px] bg-gradient-to-b from-teal-500/80 to-teal-400/40 dark:from-teal-400/80 dark:to-teal-600/40 z-10"
                      style={{ top: `${nodeY}px`, height: `${390 - nodeY}px` }}
                    />

                    {/* Safe Content Card Area */}
                    <div 
                      className="absolute top-[390px] w-full bg-white/95 dark:bg-card/95 backdrop-blur-md border border-border/70 dark:border-border/50 rounded-2xl p-5 shadow-sm group-hover:border-teal-500/40 group-hover:shadow-md transition-all duration-300 z-20 animate-fade-up opacity-0 [animation-fill-mode:forwards]"
                      style={{ animationDelay: `${idx * 150 + 150}ms` }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                          STAGE {stage.number}
                        </span>
                        <div className="text-3xl font-display font-bold text-teal-800/10 dark:text-teal-400/15 leading-none select-none">
                          {stage.number}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-foreground mb-0.5">{stage.title}</h3>
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">{stage.subtitle}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{stage.description}</p>
                      
                      <ul className="text-[11px] text-muted-foreground space-y-1.5 border-t border-border/40 pt-2.5">
                        {stage.points.map((p, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* --- MOBILE/TABLET STACKED ROADMAP --- */}
        <div className="lg:hidden relative space-y-10 mb-20 before:absolute before:inset-0 before:ml-[35px] md:before:ml-[50%] md:before:-translate-x-px before:h-full before:w-[3px] before:bg-gradient-to-b before:from-teal-100 before:via-teal-400/40 before:to-teal-100 dark:before:from-teal-900/20 dark:before:via-teal-600/40 dark:before:to-teal-900/20">
          {STAGES.map((stage, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={stage.id} className="relative flex items-start md:items-center group">
                
                {/* Flowing Water Particle (simulated via animation) */}
                <div className="absolute left-[35px] md:left-1/2 -translate-x-[4.5px] w-3 h-12 bg-gradient-to-b from-transparent via-teal-400 to-transparent rounded-full opacity-0 animate-[fade-in-out_3s_ease-in-out_infinite] z-0" style={{ animationDelay: `${idx * 1.5}s` }} />

                {/* Milestone Node */}
                <div className="absolute left-[35px] md:left-1/2 -translate-x-[22px] w-[44px] h-[44px] rounded-full bg-white dark:bg-card border-2 border-teal-200 dark:border-teal-800 flex items-center justify-center shadow-sm z-10 node-hover-glow cursor-pointer overflow-hidden" onClick={() => handleNodeClick(`mobile-${stage.id}`)}>
                  <img
                    src={getWaterPhotograph(undefined, stage.title, idx)}
                    alt={stage.title}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {activeRipple === `mobile-${stage.id}` && <div className="ripple-effect" />}
                </div>
                
                <div className={`ml-[90px] md:ml-0 md:w-1/2 flex flex-col ${isEven ? 'md:pr-[60px] md:text-right' : 'md:pl-[60px] md:text-left md:ml-auto'}`}>
                  <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm group-hover:border-teal-500/30 group-hover:shadow-md transition-all relative">
                    <div className={`text-5xl font-display font-bold text-teal-800/5 dark:text-teal-400/5 absolute top-4 ${isEven ? 'right-6' : 'right-6 md:left-6'}`}>
                      {stage.number}
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-1 relative z-10">{stage.title}</h3>
                    <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-3 relative z-10">{stage.subtitle}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 relative z-10">{stage.description}</p>
                    <ul className="text-xs text-muted-foreground space-y-2 relative z-10">
                      {stage.points.map((p, i) => (
                        <li key={i} className={`flex items-start gap-2 ${isEven ? 'md:justify-end md:flex-row-reverse' : ''}`}>
                          <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- BOTTOM VALUES PANEL --- */}
        <div className="bg-white dark:bg-card border border-border/60 rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-sm max-w-[1200px] mx-auto animate-fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
            {VALUES.map((val, idx) => {
              const animAsset = idx % 2 === 0 ? analyticsGrowth : sustainabilityLeaf;
              return (
                <div key={idx} className={`flex flex-col items-center text-center px-4 ${idx > 0 ? 'pt-8 sm:pt-0' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400 shadow-sm overflow-hidden shrink-0 relative">
                    <img
                      src={getWaterPhotograph(undefined, val.title, idx + 4)}
                      alt={val.title}
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen">
                      <img src={animAsset} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <h4 className="font-bold text-[15px] text-foreground mb-2">{val.title}</h4>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Approach;
