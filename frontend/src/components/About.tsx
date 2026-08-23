import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { getPublicHome, HomeAbout } from "@/services/home.service";
import { aboutContent } from "@/content/home/about";
import { mergeHomeSection } from "@/utils/mergeHomeSection";

export const About = () => {
  const [about, setAbout] = useState<HomeAbout>(aboutContent);

  useEffect(() => {
    let cancelled = false;
    getPublicHome()
      .then((data) => {
        if (!cancelled && data?.about) {
          setAbout(mergeHomeSection(aboutContent, data.about));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Only hide if visible is explicitly false
  if (about.visible === false) return null;

  return (
    <section id="about" className="py-16 md:py-20 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            {about.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {about.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {about.description}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {about.values.map((value, idx) => {
            const IconComp = (Icons as any)[value.iconName] || Icons.Target;
            return (
              <div
                key={`${value.title}-${idx}`}
                className="group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 border border-border hover:border-primary/30"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-ocean rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {about.stats.map((stat, idx) => (
            <div key={`${stat.label}-${idx}`} className="text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
