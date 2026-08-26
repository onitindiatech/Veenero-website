import React from "react";
import { ArrowRight } from "lucide-react";

export const ApproachCTA: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Decorative gradient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center animate-fade-up">
        <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-4">
          READY TO MAKE WATER VISIBLE?
        </p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-10 leading-tight">
          Start With the Right <br className="hidden md:inline" />
          Water Intelligence Foundation
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.location.href = "/solutions"}
            className="w-full sm:w-auto px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-soft hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2 group"
          >
            Explore Solutions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => window.location.href = "/contact"}
            className="w-full sm:w-auto px-8 py-3.5 bg-card hover:bg-muted text-foreground border border-border/80 rounded-xl font-bold shadow-sm hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center"
          >
            Contact Veenero
          </button>
        </div>
      </div>
    </section>
  );
};

export default ApproachCTA;
