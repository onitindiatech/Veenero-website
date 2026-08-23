import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { getPublicHome, HomeImpact } from "@/services/home.service";
import { impactContent } from "@/content/home/impact";
import { mergeHomeSection } from "@/utils/mergeHomeSection";

export const Impact = () => {
  const [impactData, setImpactData] = useState<HomeImpact>(impactContent);

  useEffect(() => {
    let cancelled = false;
    getPublicHome()
      .then((data) => {
        if (!cancelled && data?.impact) {
          setImpactData(mergeHomeSection(impactContent, data.impact));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (impactData.visible === false) return null;

  return (
    <section id="impact" className="py-16 md:py-20 bg-gradient-hero relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-aqua/10 rounded-full blur-3xl animate-float animation-delay-600" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-primary-foreground/80 font-medium mb-4 tracking-wider uppercase text-sm">
            {impactData.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            {impactData.title}
          </h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            {impactData.description}
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
          {impactData.impacts.map((impact, idx) => {
            const IconComp = (Icons as any)[impact.iconName] || Icons.Droplets;
            return (
              <div
                key={`${impact.label}-${idx}`}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComp className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="font-display text-4xl font-bold text-primary-foreground mb-2">
                  {impact.value}
                </p>
                <p className="font-semibold text-primary-foreground mb-2">
                  {impact.label}
                </p>
                <p className="text-sm text-primary-foreground/70">
                  {impact.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Testimonial */}
        {impactData.testimonial && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary-foreground rounded-3xl p-10 md:p-14 shadow-xl">
              <div className="text-6xl text-primary/20 font-serif mb-6">"</div>
              <blockquote className="font-display text-2xl md:text-3xl text-foreground leading-relaxed mb-8">
                {impactData.testimonial.quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center">
                  <span className="font-display text-xl font-semibold text-primary">
                    {impactData.testimonial.author ? impactData.testimonial.author.split(" ").map((n) => n[0]).join("") : "V"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {impactData.testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {impactData.testimonial.role}, {impactData.testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
