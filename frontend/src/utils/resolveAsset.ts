/**
 * Comprehensive Production Asset Resolver for Veenero
 *
 * Problem:
 * In local dev, Vite serves `/src/assets/...` directly over HTTP.
 * In Vercel production build, assets are compiled to `/assets/[name]-[hash].ext`.
 * Direct strings like `/src/assets/...` or relative strings returned by CMS / MongoDB
 * cause 404 broken images on production.
 *
 * Solution:
 * Statically import all local assets so Vite bundles them with valid production URLs,
 * and provide a normalizer that resolves any CMS string, path, or filename (case-insensitively)
 * to its bundled production asset URL.
 */

// Root Assets
import heroWater from "@/assets/hero-water.jpg";
import iesaLogo from "@/assets/Iesa_logo.jpg";
import iiitdelhiLogo from "@/assets/iiitdelhi_logo.jpg";
import meityLogo from "@/assets/Ministry_of_electronics_information_technology.png";
import part3Logo from "@/assets/part3.png";
import partnerLogo from "@/assets/partner.png";
import partner2Logo from "@/assets/partner2.jpg";
import stpiLogo from "@/assets/STPI_LOGO.png";
import stpiNextLogo from "@/assets/STPINEXT_LOGO.png";
import veeneroLogo from "@/assets/veenero_logo.png";

// Hero Backgrounds
import approachHeroBg from "@/assets/approach/approach-hero-background.png";
import blogHeroBg from "@/assets/blog-hero-background.png";
import careersHeroBg from "@/assets/careers-hero-background.png";
import contactHeroBg from "@/assets/contact/contact-hero-bg.png";
import impactHeroBg from "@/assets/impact-hero-background.png";
import solutionsHeroBg from "@/assets/solutions/solutions-hero-background.png";
import solutionsCtaBg from "@/assets/solutions/solutions-cta-background.png";
import aboutHeroBg from "@/assets/about/about-hero-background.png";

// About Assets
import aboutFieldVerificationWebp from "@/assets/about/about-field-verification.webp";
import aboutFieldVerificationPng from "@/assets/about/about-field-verification.png";
import aboutHeroWaterInfrastructure from "@/assets/about/about-hero-water-infrastructure.png";
import aboutIndustrialWaterSystemWebp from "@/assets/about/about-industrial-water-system.webp";
import aboutIndustrialWaterSystemPng from "@/assets/about/about-industrial-water-system.png";
import aboutInfrastructureSensorWebp from "@/assets/about/about-infrastructure-sensor.webp";
import aboutInfrastructureSensorPng from "@/assets/about/about-infrastructure-sensor.png";
import aboutJourneyWaterInfrastructureWebp from "@/assets/about/about-journey-water-infrastructure.webp";
import aboutJourneyWaterInfrastructurePng from "@/assets/about/about-journey-water-infrastructure.png";
import aboutPillarImpactWebp from "@/assets/about/about-pillar-impact.webp";
import aboutPillarImpactPng from "@/assets/about/about-pillar-impact.png";
import aboutPillarInnovationWebp from "@/assets/about/about-pillar-innovation.webp";
import aboutPillarInnovationPng from "@/assets/about/about-pillar-innovation.png";
import aboutPillarIntegrityWebp from "@/assets/about/about-pillar-integrity.webp";
import aboutPillarIntegrityPng from "@/assets/about/about-pillar-integrity.png";
import aboutPillarPurposeWebp from "@/assets/about/about-pillar-purpose.webp";
import aboutPillarPurposePng from "@/assets/about/about-pillar-purpose.png";
import aboutPillarTogetherWebp from "@/assets/about/about-pillar-together.webp";
import aboutPillarTogetherPng from "@/assets/about/about-pillar-together.png";
import aboutRealTimeAnalyticsWebp from "@/assets/about/about-real-time-analytics.webp";
import aboutRealTimeAnalyticsPng from "@/assets/about/about-real-time-analytics.png";
import aboutStoryWaterInfrastructureMp4 from "@/assets/about/about-story-water-infrastructure.mp4";
import aboutTeamLeadershipWebp from "@/assets/about/about-team-leadership.webp";
import aboutTeamLeadershipJpg from "@/assets/about/about-team-leadership.jpg";
import aboutVisionWaterInfrastructureWebp from "@/assets/about/about-vision-water-infrastructure.webp";
import aboutVisionWaterInfrastructureJpg from "@/assets/about/about-vision-water-infrastructure.jpg";

// Animations
import waterFillingUpSvg from "@/assets/animations/Water filling up.svg";
import analyticsGrowthSvg from "@/assets/animations/analytics-growth.svg";
import dataSensorSvg from "@/assets/animations/data-sensor.svg";
import processGearSvg from "@/assets/animations/process-gear.svg";
import sustainabilityLeafSvg from "@/assets/animations/sustainability-leaf.svg";
import techPulseSvg from "@/assets/animations/tech-pulse.svg";
import waterFlowSvg from "@/assets/animations/water-flow.svg";
import waterRippleSvg from "@/assets/animations/water-ripple.svg";
import waveSpinnerSvg from "@/assets/animations/wave-spinner.svg";

/**
 * Normalized lookup table mapping lowercase asset names / paths
 * to their bundled Vite production asset URL.
 */
const ASSET_REGISTRY: Record<string, string> = {
  // Root / Hero
  "hero-water.jpg": heroWater,
  "hero-water": heroWater,
  "iesa_logo.jpg": iesaLogo,
  "iesa_logo": iesaLogo,
  "iiitdelhi_logo.jpg": iiitdelhiLogo,
  "iiitdelhi_logo": iiitdelhiLogo,
  "ministry_of_electronics_information_technology.png": meityLogo,
  "ministry_of_electronics_information_technology": meityLogo,
  "part3.png": part3Logo,
  "part3": part3Logo,
  "partner.png": partnerLogo,
  "partner": partnerLogo,
  "partner2.jpg": partner2Logo,
  "partner2": partner2Logo,
  "stpi_logo.png": stpiLogo,
  "stpi_logo": stpiLogo,
  "stpinext_logo.png": stpiNextLogo,
  "stpinext_logo": stpiNextLogo,
  "veenero_logo.png": veeneroLogo,
  "veenero_logo": veeneroLogo,

  // Heroes & CTAs
  "approach-hero-background.png": approachHeroBg,
  "blog-hero-background.png": blogHeroBg,
  "careers-hero-background.png": careersHeroBg,
  "contact-hero-bg.png": contactHeroBg,
  "impact-hero-background.png": impactHeroBg,
  "solutions-hero-background.png": solutionsHeroBg,
  "solutions-cta-background.png": solutionsCtaBg,
  "about-hero-background.png": aboutHeroBg,

  // About Assets
  "about-field-verification.webp": aboutFieldVerificationWebp,
  "about-field-verification.png": aboutFieldVerificationPng,
  "about-field-verification": aboutFieldVerificationWebp,
  "about-hero-water-infrastructure.png": aboutHeroWaterInfrastructure,
  "about-hero-water-infrastructure": aboutHeroWaterInfrastructure,
  "about-industrial-water-system.webp": aboutIndustrialWaterSystemWebp,
  "about-industrial-water-system.png": aboutIndustrialWaterSystemPng,
  "about-industrial-water-system": aboutIndustrialWaterSystemWebp,
  "about-infrastructure-sensor.webp": aboutInfrastructureSensorWebp,
  "about-infrastructure-sensor.png": aboutInfrastructureSensorPng,
  "about-infrastructure-sensor": aboutInfrastructureSensorWebp,
  "about-journey-water-infrastructure.webp": aboutJourneyWaterInfrastructureWebp,
  "about-journey-water-infrastructure.png": aboutJourneyWaterInfrastructurePng,
  "about-journey-water-infrastructure": aboutJourneyWaterInfrastructureWebp,
  "about-pillar-impact.webp": aboutPillarImpactWebp,
  "about-pillar-impact.png": aboutPillarImpactPng,
  "about-pillar-impact": aboutPillarImpactWebp,
  "about-pillar-innovation.webp": aboutPillarInnovationWebp,
  "about-pillar-innovation.png": aboutPillarInnovationPng,
  "about-pillar-innovation": aboutPillarInnovationWebp,
  "about-pillar-integrity.webp": aboutPillarIntegrityWebp,
  "about-pillar-integrity.png": aboutPillarIntegrityPng,
  "about-pillar-integrity": aboutPillarIntegrityWebp,
  "about-pillar-purpose.webp": aboutPillarPurposeWebp,
  "about-pillar-purpose.png": aboutPillarPurposePng,
  "about-pillar-purpose": aboutPillarPurposeWebp,
  "about-pillar-together.webp": aboutPillarTogetherWebp,
  "about-pillar-together.png": aboutPillarTogetherPng,
  "about-pillar-together": aboutPillarTogetherWebp,
  "about-real-time-analytics.webp": aboutRealTimeAnalyticsWebp,
  "about-real-time-analytics.png": aboutRealTimeAnalyticsPng,
  "about-real-time-analytics": aboutRealTimeAnalyticsWebp,
  "about-story-water-infrastructure.mp4": aboutStoryWaterInfrastructureMp4,
  "about-story-water-infrastructure": aboutStoryWaterInfrastructureMp4,
  "about-team-leadership.webp": aboutTeamLeadershipWebp,
  "about-team-leadership.jpg": aboutTeamLeadershipJpg,
  "about-team-leadership": aboutTeamLeadershipWebp,
  "about-vision-water-infrastructure.webp": aboutVisionWaterInfrastructureWebp,
  "about-vision-water-infrastructure.jpg": aboutVisionWaterInfrastructureJpg,
  "about-vision-water-infrastructure": aboutVisionWaterInfrastructureWebp,

  // Animations
  "water filling up.svg": waterFillingUpSvg,
  "analytics-growth.svg": analyticsGrowthSvg,
  "data-sensor.svg": dataSensorSvg,
  "process-gear.svg": processGearSvg,
  "sustainability-leaf.svg": sustainabilityLeafSvg,
  "tech-pulse.svg": techPulseSvg,
  "water-flow.svg": waterFlowSvg,
  "water-ripple.svg": waterRippleSvg,
  "wave-spinner.svg": waveSpinnerSvg,
};

/**
 * Normalizes an input path or URL to look for matches in the registry.
 */
function extractLookupKey(input: string): string {
  // Remove query string or hashes
  const clean = input.split("?")[0].split("#")[0].trim();
  // Strip leading protocols or slashes
  const withoutPrefix = clean.replace(/^https?:\/\/[^/]+/i, "").replace(/^[/\\]+/, "");
  // Get filename with extension
  const parts = withoutPrefix.split(/[/\\]/);
  const filename = parts[parts.length - 1];
  return filename.toLowerCase();
}

/**
 * Resolves an image URL or local asset path to a valid production URL.
 *
 * @param url The image URL or local asset path (e.g. "/src/assets/hero-water.jpg", "https://res.cloudinary.com/...")
 * @param fallback Optional fallback image URL if `url` is null, empty, or unresolvable
 * @returns A safe, production-ready image URL
 */
export function resolveAsset(url?: string | null, fallback?: string): string {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return fallback || "";
  }

  const trimmed = url.trim();

  // If it's a valid remote URL (Cloudinary, external CDN, Unsplash, blob, data URL)
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    // If it's Cloudinary, Unsplash, or another valid CDN, return directly
    return trimmed;
  }

  // Look up in registry by exact filename / basename
  const key = extractLookupKey(trimmed);
  if (ASSET_REGISTRY[key]) {
    return ASSET_REGISTRY[key];
  }

  // Check without extension if key has one
  const keyWithoutExt = key.replace(/\.[^/.]+$/, "");
  if (ASSET_REGISTRY[keyWithoutExt]) {
    return ASSET_REGISTRY[keyWithoutExt];
  }

  // Check for subfolder combinations, e.g. "about/about-journey-water-infrastructure.webp"
  const normalizedPath = trimmed
    .replace(/^@\/assets\//i, "")
    .replace(/^\/?src\/assets\//i, "")
    .replace(/^\/?assets\//i, "")
    .toLowerCase();

  if (ASSET_REGISTRY[normalizedPath]) {
    return ASSET_REGISTRY[normalizedPath];
  }

  // If already a root-relative public path (like "/favicon.ico") and exists in public
  if (trimmed.startsWith("/") && !trimmed.startsWith("/src/assets")) {
    return trimmed;
  }

  // Fallback to fallback argument or original
  return fallback || trimmed;
}

export default resolveAsset;
