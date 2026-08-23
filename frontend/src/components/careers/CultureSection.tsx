import React from "react";
import cultureImage from "@/assets/careers_culture.png";

export const CultureSection: React.FC = () => {
  return (
    <section id="culture" className="py-24 bg-background relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-[20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto font-sans">
          
          {/* Visual/Image Area (Left or Right Column: let's place it on the left) */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/10 to-cyan-500/10 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-300 pointer-events-none" />
            <div className="relative overflow-hidden rounded-2xl border border-border/40 shadow-soft">
              <img
                src={cultureImage}
                alt="Veenero Team Workspace and Collaboration"
                className="w-full h-[400px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            
            {/* Soft overlay gradient block */}
            <div className="absolute -bottom-6 -right-6 p-6 max-w-xs rounded-2xl bg-card border border-border/40 shadow-card hidden md:block">
              <p className="text-xs font-semibold text-teal-800 dark:text-teal-400 italic">
                "We don't manage desk hours; we empower execution and intellectual honesty."
              </p>
            </div>
          </div>

          {/* Content Area (Right Column) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-teal-600 font-bold uppercase tracking-widest text-xs block font-sans">
              How We Work
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Our Culture
            </h2>
            
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
              <p>
                At Veenero, we believe that the best work happens when high agency meets deep ownership. We operate with a flat hierarchy where transparency, direct feedback, and constructive debates are actively encouraged.
              </p>
              <p>
                Whether you are refining an IoT board in our Adilabad lab, crafting SaaS dashboard components, or explaining data points to a facility manager, you are given the autonomy to make decisions.
              </p>
              <p>
                We do not use micromanagement or artificial metrics. Instead, we foster a collaborative environment focused on rapid iteration, continuous learning (including weekly tech talks), and a shared commitment to global water conservation.
              </p>
            </div>

            {/* Core Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-5 rounded-xl border border-border/60 bg-muted/20">
                <h3 className="text-base font-bold text-foreground mb-2">High Agency</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We expect our builders to identify bugs, propose solutions, and write code independently.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border/60 bg-muted/20">
                <h3 className="text-base font-bold text-foreground mb-2">Transparency First</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All metrics, feedback, and product strategies are shared transparently with the entire team.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CultureSection;
