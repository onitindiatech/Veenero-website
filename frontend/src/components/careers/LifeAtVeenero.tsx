import React from "react";
import rndImage from "@/assets/careers_rnd.png";
import deploymentImage from "@/assets/careers_deployment.png";
import waterImage from "@/assets/hero-water.jpg";

export const LifeAtVeenero: React.FC = () => {
  const items = [
    {
      type: "image",
      src: rndImage,
      title: "R&D Telemetry Calibration",
      description: "Stress-testing ESP32 microcontrollers and flow sensors in our lab.",
      span: "md:col-span-2 md:row-span-2 h-[450px]"
    },
    {
      type: "image",
      src: deploymentImage,
      title: "Field Deployments",
      description: "Deploying and configuring real-time telemetry nodes across sites.",
      span: "md:col-span-1 md:row-span-1 h-[210px]"
    },
    {
      type: "gradient",
      title: "Continuous Innovation",
      description: "Participating in internal hackathons, shipping telemetry updates, and debating APIs.",
      span: "md:col-span-1 md:row-span-1 h-[210px]",
      gradient: "from-teal-600/10 via-cyan-500/5 to-transparent border-teal-600/20"
    },
    {
      type: "image",
      src: waterImage,
      title: "Conserving Every Litre",
      description: "Our systems live track and prevent million-gallon wastage in large reservoirs.",
      span: "md:col-span-2 md:row-span-1 h-[216px]"
    }
  ];

  return (
    <section className="py-24 bg-muted/40 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-3 block font-sans">
            Our Workspace
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Life at Veenero
          </h2>
          <p className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed max-w-xl mx-auto">
            Get a glimpse into our engineering lab, field deployments, and the day-to-day efforts of building India's premier water intelligence system.
          </p>
        </div>

        {/* Masonry/Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-3xl border border-border/40 bg-card shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 ${item.span}`}
            >
              {item.type === "image" ? (
                <>
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 flex flex-col justify-end p-6" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white font-sans space-y-1">
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed max-w-md">
                      {item.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className={`w-full h-full p-8 flex flex-col justify-end bg-gradient-to-br ${item.gradient} font-sans space-y-2`}>
                  <div className="p-2 w-fit rounded-lg bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border border-teal-600/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Mission</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LifeAtVeenero;
