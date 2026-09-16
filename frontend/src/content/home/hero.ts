import { HomeHero } from "@/services/home.service";

// Foundation: Static Hero Content (Fallback)
export const heroContent: HomeHero = {
  visible: true,
  eyebrow: "INDIA'S WATER INTELLIGENCE PLATFORM",
  title: "India's Water Intelligence Platform",
  description: "Measure. Monitor. Optimize. Verify.",
  primaryCtaText: "Explore the Platform",
  primaryCtaLink: "/#solutions",
  secondaryCtaText: "Watch How Water Visibility Works",
  secondaryCtaLink: "/approach",
  image: "",            // empty → use the bundled heroImageFallback asset
  imageAlt: "India's Water Intelligence Platform - Veenero",
  bottomText: "MAKING EVERY LITRE VISIBLE.",
};
