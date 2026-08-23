import { HomeHero } from "@/services/home.service";

// Foundation: Static Hero Content (Fallback)
export const heroContent: HomeHero = {
  visible: true,
  eyebrow: "India's Water Intelligence Platform",
  title: "India's Water Intelligence Platform",
  description: "Measure. Monitor. Optimize. Verify.",
  primaryCtaText: "Explore the Platform",
  primaryCtaLink: "/#solutions",
  secondaryCtaText: "Watch How Water Visibility Works",
  secondaryCtaLink: "#",
  image: "",            // empty → use the bundled heroImageFallback asset
  imageAlt: "Abstract water waves representing sustainable water management",
  bottomText: "Making Every Litre Visible.",
};
