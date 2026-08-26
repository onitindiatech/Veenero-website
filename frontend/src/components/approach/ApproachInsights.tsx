import React from "react";

const insights = [
  {
    title: "EVERY DROP",
    description: "Understand how water is being used across connected infrastructure."
  },
  {
    title: "EVERY ISSUE",
    description: "Surface potential leaks and system-level problems for further action."
  },
  {
    title: "EVERY PATTERN",
    description: "Use collected information to better understand usage and operational trends."
  },
  {
    title: "EVERY OPPORTUNITY",
    description: "Support conservation, reporting and more informed water-management decisions."
  }
];

export const ApproachInsights: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-card relative border-t border-border/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className="bg-accent/5 p-8 rounded-2xl border border-border/50 flex flex-col justify-center text-center shadow-sm hover:border-teal-500/20 transition-colors duration-300"
            >
              <h3 className="font-display text-lg font-bold text-teal-700 dark:text-teal-400 mb-4 uppercase tracking-widest">
                {insight.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApproachInsights;
