import React from "react";
import { CheckCircle2 } from "lucide-react";

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  points?: string[];
}

const steps: TimelineStep[] = [
  {
    number: "01",
    title: "Set Up & Understand",
    description: "Begin with structural planning, understanding the water network and setting up the appropriate monitoring infrastructure.",
    points: ["Structural planning", "Network overview", "Device setup"],
  },
  {
    number: "02",
    title: "Monitor the System",
    description: "Continuously observe water infrastructure and system activity to establish visibility across operations.",
  },
  {
    number: "03",
    title: "Collect & Connect Data",
    description: "Bring relevant water and system data into the application layer, creating a foundation for analysis and informed decision-making.",
  },
  {
    number: "04",
    title: "Identify Leakage",
    description: "Detect and surface potential water loss across common infrastructure issues such as tap leaks, pipe leaks, tank leaks and seepage.",
  },
  {
    number: "05",
    title: "Understand the Issue",
    description: "Analyze the characteristics and context of identified issues to support accurate reporting and effective next actions.",
  },
  {
    number: "06",
    title: "Resolve & Optimize",
    description: "Move from insight to action, supporting leak resolution, conservation measures and ongoing optimization over time.",
  }
];

export const ApproachProcessTimeline: React.FC = () => {
  return (
    <section id="approach-process" className="py-16 md:py-20 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping inline-block" />
            THE VEENERO PROCESS
          </p>
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground mb-6 leading-tight">
            From Water Infrastructure to <br className="hidden md:inline" />
            Actionable Intelligence
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Veenero connects water infrastructure, monitoring and data intelligence into a structured process designed to make water usage measurable, visible and actionable.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={`${step.number}-${index}`}
              className="relative flex flex-col md:flex-row gap-8 pb-12 last:pb-0 group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-[39px] top-20 w-px h-[calc(100%-60px)] bg-border" />
              )}

              {/* Number Indicator */}
              <div className="flex-shrink-0 relative z-10">
                <div className="w-20 h-20 bg-card border border-border rounded-2xl flex items-center justify-center shadow-sm group-hover:border-teal-500/30 transition-colors duration-300">
                  <span className="font-display text-2xl font-bold text-teal-700 dark:text-teal-400">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-grow bg-card rounded-2xl p-8 shadow-sm border border-border group-hover:border-teal-500/20 transition-all duration-300">
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {step.points && step.points.length > 0 && (
                  <ul className="grid sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-border/50">
                    {step.points.map((point, pIdx) => (
                      <li key={`${point}-${pIdx}`} className="flex items-center gap-2 text-sm text-foreground font-medium">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApproachProcessTimeline;
