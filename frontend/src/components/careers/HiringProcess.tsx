import React from "react";
import { Search, FileText, Users, Rocket } from "lucide-react";
import { processGear, waterRipple } from "@/assets/animations";

export const HiringProcess: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "Explore",
      description: "Browse open roles and find the opportunity that fits your passion."
    },
    {
      num: "02",
      icon: FileText,
      title: "Apply",
      description: "Submit your application and tell us what makes you unique."
    },
    {
      num: "03",
      icon: Users,
      title: "Meet",
      description: "We'll connect with you for meaningful conversations and evaluations."
    },
    {
      num: "04",
      icon: Rocket,
      title: "Build With Us",
      description: "Join the team and help build technology that changes lives."
    }
  ];

  return (
    <section id="selection-process" className="py-10 md:py-12 bg-transparent relative border-t border-border/10">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-16">
        
        {/* Section Header */}
        <div className="text-left font-sans">
          <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-3">
            OUR SELECTION PROCESS
          </span>
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground">
            Our Selection Process
          </h2>
        </div>

        {/* Timeline Layout */}
        <div className="relative font-sans max-w-7xl mx-auto">
          
          {/* Horizontal connecting line for desktop */}
          <div className="absolute top-[80px] left-[10%] right-[10%] h-[1px] bg-border/60 dark:bg-border/20 hidden md:block z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center space-y-4">
                  
                  {/* Step Number (Top) */}
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                    {step.num}
                  </span>

                  {/* Circular Icon with double ripple rings & processGear asset */}
                  <div className="relative flex items-center justify-center">
                    {/* Ripple outer circle */}
                    <div className="absolute -inset-2.5 rounded-full border border-teal-500/10 dark:border-teal-500/5 animate-pulse" />
                    {/* Ripple inner circle */}
                    <div className="absolute -inset-1.5 rounded-full border border-teal-500/20 dark:border-teal-500/10" />
                    
                    {/* Main Icon Circle */}
                    <div className="h-14 w-14 rounded-full bg-card border border-border/80 shadow-sm flex items-center justify-center text-teal-600 dark:text-teal-400 group hover:border-teal-600/30 hover:scale-105 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20 pointer-events-none p-1">
                        <img src={processGear} alt="" className="w-full h-full object-contain" />
                      </div>
                      <Icon className="h-5 w-5 relative z-10" />
                    </div>
                  </div>

                  {/* Title (H3) and description */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-base font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HiringProcess;
