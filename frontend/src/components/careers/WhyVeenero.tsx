import React from "react";
import { Leaf, TrendingUp, Code, Users } from "lucide-react";

export const WhyVeenero: React.FC = () => {
  const cards = [
    {
      icon: Leaf,
      title: "Purpose Driven",
      description: "Work on solutions that create real environmental and social impact across India."
    },
    {
      icon: TrendingUp,
      title: "Real-World Impact",
      description: "Your work directly contributes to solving India's most critical water challenges."
    },
    {
      icon: Code,
      title: "Technology & Innovation",
      description: "Build next-gen platforms using AI, IoT, and geospatial intelligence."
    },
    {
      icon: Users,
      title: "Growth & Ownership",
      description: "Fast-paced environment with ownership, learning, and career growth."
    }
  ];

  return (
    <section id="why-join" className="py-10 md:py-12 bg-transparent relative border-t border-border/10">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Section Header */}
        <div className="text-left font-sans">
          <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs block mb-3">
            WHY JOIN US
          </span>
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground">
            Why Join Veenero?
          </h2>
        </div>

        {/* Feature Cards Grid (4 columns on desktop/tablet) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group bg-card p-8 rounded-2xl border border-border/40 hover:border-teal-600/30 shadow-sm hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start font-sans h-full"
              >
                {/* Circular Icon Wrapper */}
                <div className="p-4 rounded-full bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6 stroke-[2]" />
                </div>
                
                {/* Card Title (H3) */}
                <h3 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-teal-700 transition-colors">
                  {card.title}
                </h3>
                
                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyVeenero;
