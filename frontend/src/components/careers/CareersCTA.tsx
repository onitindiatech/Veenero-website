import React from "react";

export const CareersCTA: React.FC = () => {
  const scrollToPositions = () => {
    const el = document.getElementById("open-positions");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="impact-cta" className="py-10 md:py-12 bg-transparent relative border-t border-border/10">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl font-sans">
        <div className="bg-[#E6F3F3] dark:bg-teal-950/20 border border-teal-600/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative shadow-soft">
          
          {/* Animated Ripple Circles in background */}
          <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 opacity-25 dark:opacity-10 pointer-events-none z-0">
            <div className="absolute inset-0 rounded-full border border-teal-600 animate-ripple" />
            <div className="absolute inset-6 rounded-full border border-teal-600 animate-ripple animation-delay-400" />
            <div className="absolute inset-12 rounded-full border border-teal-600 animate-ripple animation-delay-800" />
          </div>

          {/* Content */}
          <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              Ready to Make an Impact?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Join Veenero and be part of a team that's committed to a sustainable and water-secure future.
            </p>
          </div>

          {/* Button */}
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <button
              onClick={scrollToPositions}
              className="w-full md:w-auto px-7 py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-soft hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2"
            >
              Explore Open Positions
              <span className="text-base leading-none">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CareersCTA;
