import React from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

const flowSteps = [
  "Water Infrastructure",
  "System Monitoring",
  "Data Collection",
  "Application & Analytics",
  "Leak & Usage Insights",
  "Action & Optimization"
];

export const ApproachFlow: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-transparent relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            From Infrastructure to Intelligence
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-16 max-w-2xl mx-auto">
            Veenero combines water-focused devices and software to connect physical infrastructure with usable information and conservation actions.
          </p>

          {/* Flow Container */}
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 md:gap-2">
            {flowSteps.map((step, index) => (
              <React.Fragment key={index}>
                {/* Step Item */}
                <div className="bg-card border border-border px-6 py-4 rounded-full shadow-sm whitespace-nowrap font-medium text-foreground text-sm md:text-base">
                  {step}
                </div>
                
                {/* Arrow Connector */}
                {index < flowSteps.length - 1 && (
                  <>
                    <ArrowRight className="hidden md:block h-5 w-5 text-teal-500/50 flex-shrink-0 mx-2" />
                    <ArrowDown className="block md:hidden h-5 w-5 text-teal-500/50 flex-shrink-0 my-2" />
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachFlow;
