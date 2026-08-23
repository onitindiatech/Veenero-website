// Foundation: Section Types
export interface HeroSectionContent {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
}

export interface AboutSectionContent {
  title: string;
  description: string;
}
