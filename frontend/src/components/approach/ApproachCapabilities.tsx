import React from "react";
import { getWaterPhotograph } from "@/utils/waterImages";

interface Capability {
  title: string;
  description: string;
}

const capabilities: Capability[] = [
  {
    title: "Water Quality Assessment",
    description: "Monitor essential water parameters to ensure compliance and maintain operational standards across connected sites.",
  },
  {
    title: "Water Pumping Automation",
    description: "Automate pumping infrastructure based on real-time data to optimize energy usage and reduce operational overhead.",
  },
  {
    title: "Water Tracking & Informatics",
    description: "Gain complete visibility into consumption patterns and operational efficiency through unified dashboards.",
  },
  {
    title: "Water Credits",
    description: "Quantify conservation efforts and build verifiable records to support sustainability goals and water credit initiatives.",
  },
  {
    title: "Leak Identification & Reporting",
    description: "Automatically surface potential leaks and anomalies, enabling faster response times and reduced water loss.",
  }
];

export const ApproachCapabilities: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-card relative">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="max-w-3xl text-left mb-16 animate-fade-up">
          <p className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3">
            CONNECTED CAPABILITIES
          </p>
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground">
            A Broader Approach to Water Intelligence
          </h2>
        </div>

        {/* Grid layout for 5 cards: 3 in top row, 2 centered in bottom row on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => {
            const imgSrc = getWaterPhotograph(undefined, cap.title, index);
            return (
              <div 
                key={index}
                className="bg-background rounded-2xl p-8 border border-border hover:border-teal-500/30 hover:shadow-soft transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden shrink-0">
                  <img
                    src={imgSrc}
                    alt={cap.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {cap.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ApproachCapabilities;
