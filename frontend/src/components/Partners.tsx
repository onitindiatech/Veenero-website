import { useState, useEffect } from "react";
import partnerImage from "@/assets/partner.png";
import partner2Image from "@/assets/partner2.jpg";
import part3Image from "@/assets/part3.png";
import { getPublicHome, HomePartners } from "@/services/home.service";
import { partnersContent } from "@/content/home/partners";
import { mergeHomeSection } from "@/utils/mergeHomeSection";

function resolveLogo(logoUrl: string): string {
  if (!logoUrl || logoUrl.trim() === "") return partnerImage;
  if (logoUrl.includes("partner.png")) return partnerImage;
  if (logoUrl.includes("partner2.jpg")) return partner2Image;
  if (logoUrl.includes("part3.png")) return part3Image;
  return logoUrl;
}

export const Partners = () => {
  const [partnersData, setPartnersData] = useState<HomePartners>(partnersContent);

  useEffect(() => {
    let cancelled = false;
    getPublicHome()
      .then((data) => {
        if (!cancelled && data?.partners) {
          setPartnersData(mergeHomeSection(partnersContent, data.partners));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (partnersData.visible === false) return null;

  return (
    <section id="partners" className="py-16 md:py-20 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            {partnersData.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {partnersData.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {partnersData.description}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {partnersData.list.map((partner, idx) => {
            const staggerDelay = idx % 3 === 0 ? "reveal-delay-100" : idx % 3 === 1 ? "reveal-delay-200" : "reveal-delay-300";
            return (
              <div
                key={`${partner.name}-${idx}`}
                className={`group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-300 border border-border hover:border-primary/30 hover:-translate-y-1 reveal-on-scroll ${staggerDelay}`}
              >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-ocean rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-32 h-32 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <img
                  src={resolveLogo(partner.logo)}
                  alt={partner.name}
                  className="w-28 h-28 object-contain"
                />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4 text-center">
                {partner.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-center">
                {partner.description}
              </p>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
};
