import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicHome, HomeSolutions } from "@/services/home.service";
import { solutionsContent } from "@/content/home/solutions";
import { mergeHomeSection } from "@/utils/mergeHomeSection";

export const Solutions = () => {
  const [solutions, setSolutions] = useState<HomeSolutions>(solutionsContent);

  useEffect(() => {
    let cancelled = false;
    getPublicHome()
      .then((data) => {
        if (!cancelled && data?.solutions) {
          setSolutions(mergeHomeSection(solutionsContent, data.solutions));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (solutions.visible === false) return null;

  return (
    <section id="solutions" className="py-16 md:py-20 bg-gradient-wave relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            {solutions.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {solutions.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {solutions.description}
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {solutions.list.map((solution, idx) => {
            const IconComp = (Icons as any)[solution.iconName] || Icons.Search;
            return (
              <div
                key={`${solution.title}-${idx}`}
                className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 border border-border hover:border-primary/30 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-ocean rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComp className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {solution.description}
                </p>
                <ul className="space-y-2">
                  {solution.features.map((feature, fIdx) => (
                    <li key={`${feature}-${fIdx}`} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {solutions.ctaText && (
          <div className="text-center mt-12">
            <Button variant="ocean" size="xl" asChild>
              <a href={solutions.ctaLink || "/#solutions"}>
                {solutions.ctaText}
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

