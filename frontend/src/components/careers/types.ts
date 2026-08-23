export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  shortDescription: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  niceToHave?: string[];
  applicationUrl?: string;
  applicationEmail?: string;
}

export interface CareerHeroData {
  eyebrow?: string;
  title: string;
  description: string;
  backgroundImage: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}
