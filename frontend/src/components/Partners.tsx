import { useState, useEffect } from "react";
import partnerImage from "@/assets/partner.png";
import partner2Image from "@/assets/partner2.jpg";
import part3Image from "@/assets/part3.png";
import iiitDelhiImage from "@/assets/iiitdelhi_logo.jpg";
import stpiImage from "@/assets/STPI_LOGO.png";
import meityImage from "@/assets/Ministry_of_electronics_information_technology.png";
import stpiNextImage from "@/assets/STPINEXT_LOGO.png";
import iesaImage from "@/assets/iesa_logo.jpg";
import { getPublicHome, HomePartners, HomePartnerItem } from "@/services/home.service";
import { partnersContent } from "@/content/home/partners";
import { mergeHomeSection } from "@/utils/mergeHomeSection";

function resolveLogo(logoUrl?: string, name?: string): string {
  const target = `${logoUrl || ""} ${name || ""}`.toLowerCase();
  if (target.includes("iesa")) return iesaImage;
  if (target.includes("iiit") || target.includes("delhi")) return iiitDelhiImage;
  if (target.includes("stpinext") || target.includes("next")) return stpiNextImage;
  if (target.includes("stpi")) return stpiImage;
  if (target.includes("ministry_of_electronics") || target.includes("meity") || target.includes("electronics") || target.includes("information technology")) return meityImage;
  if (target.includes("partner2") || target.includes("electropreneur") || target.includes("intinta")) return partner2Image;
  if (target.includes("part3") || target.includes("vishva") || target.includes("piet") || target.includes("challenge") || target.includes("national innovation")) return part3Image;
  if (target.includes("partner.png") || target.includes("awadh") || target.includes("iit ropar") || target.includes("we hub")) return partnerImage;
  
  if (logoUrl && logoUrl.trim() !== "") return logoUrl;
  return partnerImage;
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

  const renderCard = (partner: HomePartnerItem, idx: number) => {
    const staggerDelay = idx % 4 === 0 ? "reveal-delay-100" : idx % 4 === 1 ? "reveal-delay-200" : idx % 4 === 2 ? "reveal-delay-300" : "reveal-delay-400";
    return (
      <div
        key={`${partner.name}-${idx}`}
        className={`group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300 border border-border hover:border-primary/30 hover:-translate-y-1 reveal-on-scroll ${staggerDelay} flex flex-col items-center w-full h-full min-h-[380px] sm:min-h-[400px] lg:h-[425px]`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-ocean rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Logo area */}
        <div className="w-32 h-32 bg-accent/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 mx-auto p-3 shrink-0">
          <div className="w-full h-full bg-white rounded-xl flex items-center justify-center p-2.5 shadow-sm">
            <img
              src={resolveLogo(partner.logo, partner.name)}
              alt={partner.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Heading area - aligned with consistent fixed height */}
        <div className="w-full h-[5rem] flex items-center justify-center mb-3 shrink-0 px-1">
          <h3 className="font-display text-lg font-semibold text-foreground text-center leading-snug">
            {partner.name}
          </h3>
        </div>

        {/* Description area */}
        <div className="w-full flex-1 flex items-start justify-center">
          <p className="text-muted-foreground leading-relaxed text-center text-sm">
            {partner.description}
          </p>
        </div>
      </div>
    );
  };

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

        {/* Partners Grid - 4 cards per row on desktop, remaining on next row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {partnersData.list.map((partner, idx) => renderCard(partner, idx))}
        </div>
      </div>
    </section>
  );
};

