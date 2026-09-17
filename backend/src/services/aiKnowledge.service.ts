/**
 * aiKnowledge.service.ts
 *
 * Comprehensive website knowledge builder for the Veenero AI Assistant.
 *
 * Architecture:
 *   MongoDB / CMS Endpoints
 *         ↓
 *   buildKnowledgeDocuments()   ← fetches ALL 10 CMS sections including every solution detail
 *         ↓
 *   KnowledgeDocument[]         ← normalized, searchable documents
 *         ↓
 *   5-minute in-process cache   ← avoids per-request DB calls; auto-refreshes after TTL
 *         ↓
 *   selectRelevantContext()     ← keyword-based relevance scoring
 *         ↓
 *   Gemini system prompt context (token-budget aware)
 *
 * CMS is the SINGLE SOURCE OF TRUTH. No manually maintained knowledge base.
 * CMS update → MongoDB → public API → knowledge cache refresh → AI answers with new data.
 */

import { config } from '../config/env';
import { logger } from '../utils/logger';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KnowledgeDocument {
  /** CMS section / page origin */
  page: string;
  /** Document category within that page */
  type: string;
  /** URL slug for navigation actions */
  slug?: string;
  /** Primary heading / title */
  title: string;
  /** Normalized full-text content — what gets sent to Gemini */
  content: string;
  /** Keywords extracted from content for relevance scoring */
  keywords: string[];
  /** Target route for navigation actions */
  route: string;
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cachedDocuments: KnowledgeDocument[] | null = null;
let cacheBuiltAt = 0;

/** Invalidate the knowledge cache (call after CMS writes if needed in future) */
export function invalidateKnowledgeCache(): void {
  cachedDocuments = null;
  cacheBuiltAt = 0;
  logger.info('[AIKnowledge] Cache invalidated');
}

// ─── HTTP Helper ──────────────────────────────────────────────────────────────

async function safeGet(url: string, timeoutMs = 8000): Promise<any> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json() as Record<string, any>;
    return json?.data ?? null;
  } catch {
    return null;
  }
}

// ─── Text Utilities ───────────────────────────────────────────────────────────

function extractKeywords(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 30);
}

function safe(val: any, fallback = ''): string {
  if (!val) return fallback;
  if (typeof val === 'string') return val.trim();
  return String(val).trim();
}

function safeJoin(arr: any[], sep = ', '): string {
  if (!Array.isArray(arr)) return '';
  return arr.filter(Boolean).map(v => safe(v)).filter(Boolean).join(sep);
}

// ─── Per-section Document Builders ───────────────────────────────────────────

function buildHomeDocuments(data: any): KnowledgeDocument[] {
  if (!data) return [];
  const docs: KnowledgeDocument[] = [];

  // Hero
  if (data.hero) {
    const h = data.hero;
    const content = [
      h.eyebrow && `${h.eyebrow}`,
      h.title && `Veenero: ${h.title}`,
      h.description,
      h.primaryCtaText && `CTA: ${h.primaryCtaText}`,
      h.bottomText,
    ].filter(Boolean).join('. ');

    docs.push({
      page: 'home', type: 'hero', title: h.title || 'Veenero Home',
      content, keywords: extractKeywords(content), route: '/',
    });
  }

  // About section on homepage
  if (data.about) {
    const a = data.about;
    const values = Array.isArray(a.values)
      ? a.values.map((v: any) => `${v.title}: ${v.description}`).join('. ')
      : '';
    const stats = Array.isArray(a.stats)
      ? a.stats.map((s: any) => `${s.value} ${s.label}`).join(', ')
      : '';
    const content = [a.eyebrow, a.title, a.description, values, stats && `Key stats: ${stats}`]
      .filter(Boolean).join('. ');

    docs.push({
      page: 'home', type: 'about-preview', title: a.title || 'About Veenero',
      content, keywords: extractKeywords(content), route: '/about',
    });
  }

  // Solutions preview on homepage
  if (data.solutions && Array.isArray(data.solutions.list)) {
    for (const sol of data.solutions.list) {
      if (!sol.title) continue;
      const features = safeJoin(sol.features);
      const content = [sol.title, sol.description, features && `Features: ${features}`]
        .filter(Boolean).join('. ');
      docs.push({
        page: 'home', type: 'solution-preview', title: sol.title,
        content, keywords: extractKeywords(content), route: '/solutions',
      });
    }
  }

  // Impact / stats section
  if (data.impact && Array.isArray(data.impact.items)) {
    const items = data.impact.items.map((i: any) => `${i.value} ${i.label}: ${i.description}`).join('. ');
    const content = [data.impact.eyebrow, data.impact.title, items].filter(Boolean).join('. ');
    docs.push({
      page: 'home', type: 'impact-preview', title: data.impact.title || 'Impact',
      content, keywords: extractKeywords(content), route: '/impact',
    });
  }

  // Testimonials
  if (Array.isArray(data.testimonials)) {
    for (const t of data.testimonials) {
      const content = `"${t.quote}" — ${t.author}${t.role ? `, ${t.role}` : ''}${t.company ? ` at ${t.company}` : ''}`;
      docs.push({
        page: 'home', type: 'testimonial', title: `Testimonial from ${t.author || 'client'}`,
        content, keywords: extractKeywords(content), route: '/',
      });
    }
  }

  return docs;
}

function buildAboutDocuments(data: any): KnowledgeDocument[] {
  if (!data) return [];
  const docs: KnowledgeDocument[] = [];

  // Hero
  if (data.hero) {
    const h = data.hero;
    const content = [h.eyebrow, h.title, h.highlightedText, h.description].filter(Boolean).join('. ');
    docs.push({
      page: 'about', type: 'hero', title: h.title || 'About Veenero',
      content, keywords: extractKeywords(content), route: '/about',
    });
  }

  // Our Story
  if (data.ourStory) {
    const s = data.ourStory;
    const paragraphs = Array.isArray(s.paragraphs) ? s.paragraphs.join(' ') : '';
    const capabilities = Array.isArray(s.capabilities)
      ? s.capabilities.map((c: any) => `${c.title}: ${c.description}`).join('. ')
      : '';
    const content = [s.eyebrow, s.title, paragraphs, capabilities].filter(Boolean).join(' ');
    docs.push({
      page: 'about', type: 'story', title: s.title || "Veenero's Story",
      content, keywords: extractKeywords(content), route: '/about',
    });
  }

  // Purpose / Vision / Mission
  if (data.purposeDirection) {
    const pd = data.purposeDirection;
    const parts: string[] = [];
    if (pd.eyebrow) parts.push(pd.eyebrow);
    if (pd.title) parts.push(pd.title);
    if (pd.vision) parts.push(`Vision: ${pd.vision.title || ''} — ${pd.vision.description || ''}`);
    if (pd.mission) parts.push(`Mission: ${pd.mission.title || ''} — ${pd.mission.description || ''}`);
    if (Array.isArray(pd.values)) {
      parts.push('Values: ' + pd.values.map((v: any) => `${v.title}: ${v.description}`).join('. '));
    }
    const content = parts.join('. ');
    docs.push({
      page: 'about', type: 'vision-mission', title: 'Vision & Mission',
      content, keywords: extractKeywords(content), route: '/about',
    });
  }

  // Impact stats
  if (data.impactStats && Array.isArray(data.impactStats.stats)) {
    const items = data.impactStats.stats
      .filter((s: any) => s.isActive !== false)
      .map((s: any) => `${s.value} ${s.label}: ${s.sublabel}`).join('. ');
    const content = [data.impactStats.eyebrow, data.impactStats.title, items].filter(Boolean).join('. ');
    docs.push({
      page: 'about', type: 'stats', title: 'Veenero Impact Stats',
      content, keywords: extractKeywords(content), route: '/about',
    });
  }

  // Pillars
  if (data.pillars && Array.isArray(data.pillars.items)) {
    for (const pillar of data.pillars.items) {
      const content = [pillar.eyebrow, pillar.title, pillar.description].filter(Boolean).join('. ');
      docs.push({
        page: 'about', type: 'pillar', title: pillar.title || 'Company Pillar',
        content, keywords: extractKeywords(content), route: '/about',
      });
    }
  }

  // Team
  if (data.team && Array.isArray(data.team.members)) {
    const members = data.team.members
      .filter((m: any) => m.isActive !== false)
      .map((m: any) => `${m.name} — ${m.role}${m.bio ? `: ${m.bio}` : ''}`)
      .join('. ');
    if (members) {
      const content = [data.team.eyebrow, data.team.title, members].filter(Boolean).join('. ');
      docs.push({
        page: 'about', type: 'team', title: 'Veenero Team',
        content, keywords: extractKeywords(content), route: '/about',
      });
    }
  }

  // Journey / timeline
  if (data.journey && Array.isArray(data.journey.milestones)) {
    const milestones = data.journey.milestones
      .map((m: any) => `${m.year}: ${m.title} — ${m.description}`)
      .join('. ');
    const content = [data.journey.eyebrow, data.journey.title, milestones].filter(Boolean).join('. ');
    docs.push({
      page: 'about', type: 'journey', title: "Veenero's Journey",
      content, keywords: extractKeywords(content), route: '/about',
    });
  }

  return docs;
}

function buildSolutionsDocuments(data: any): KnowledgeDocument[] {
  if (!data) return [];
  const docs: KnowledgeDocument[] = [];

  // Solutions overview page hero
  if (data.hero) {
    const content = [data.hero.eyebrow, data.hero.title, data.hero.description]
      .filter(Boolean).join('. ');
    docs.push({
      page: 'solutions', type: 'hero', title: 'Solutions Overview',
      content, keywords: extractKeywords(content), route: '/solutions',
    });
  }

  // Intro
  if (data.intro?.paragraphs?.length) {
    const content = data.intro.paragraphs.join(' ');
    docs.push({
      page: 'solutions', type: 'intro', title: 'Solutions Introduction',
      content, keywords: extractKeywords(content), route: '/solutions',
    });
  }

  // Individual solution cards
  if (Array.isArray(data.solutions)) {
    for (const sol of data.solutions) {
      if (sol.isActive === false) continue;
      const features = safeJoin(sol.features);
      const content = [
        `Solution: ${sol.title}`,
        sol.tagline,
        sol.description,
        features && `Features: ${features}`,
      ].filter(Boolean).join('. ');
      docs.push({
        page: 'solutions', type: 'solution-card',
        slug: sol.slug,
        title: sol.title,
        content,
        keywords: extractKeywords(content),
        route: `/solutions/${sol.slug}`,
      });
    }
  }

  // Categories
  if (Array.isArray(data.categories)) {
    for (const cat of data.categories) {
      if (cat.isActive === false) continue;
      const content = [cat.displayLabel, cat.name, cat.description].filter(Boolean).join('. ');
      docs.push({
        page: 'solutions', type: 'category',
        slug: cat.slug,
        title: cat.displayLabel || cat.name,
        content,
        keywords: extractKeywords(content),
        route: `/solutions#${cat.slug}`,
      });
    }
  }

  return docs;
}

function buildSolutionDetailDocuments(solutions: any[]): KnowledgeDocument[] {
  if (!Array.isArray(solutions)) return [];
  const docs: KnowledgeDocument[] = [];

  for (const sol of solutions) {
    if (!sol.title || !sol.slug) continue;
    const route = `/solutions/${sol.slug}`;

    // ── Hero / Main Description ──────────────────────────────────────────────
    const tagline = [sol.tagline?.line1, sol.tagline?.line2, sol.tagline?.line3]
      .filter(Boolean).join(' ');
    const pills = safeJoin(sol.heroPills);
    const heroHighlights = Array.isArray(sol.heroHighlights)
      ? sol.heroHighlights.map((h: any) => `${h.title}${h.subtitle ? ` (${h.subtitle})` : ''}`).join(', ')
      : '';
    const heroMetrics = Array.isArray(sol.heroMetrics)
      ? sol.heroMetrics.filter((m: any) => m.title).map((m: any) => `${m.title}: ${m.value}${m.suffix || ''}`).join(', ')
      : '';

    const heroContent = [
      `Solution: ${sol.title}`,
      sol.badge && `Category: ${sol.badge}`,
      tagline,
      sol.heroDescription,
      pills && `Key aspects: ${pills}`,
      heroHighlights && `Highlights: ${heroHighlights}`,
      heroMetrics && `Metrics: ${heroMetrics}`,
      sol.heroImageAlt && `Image: ${sol.heroImageAlt}`,
    ].filter(Boolean).join('. ');

    docs.push({
      page: 'solution-detail', type: 'hero',
      slug: sol.slug, title: sol.title,
      content: heroContent,
      keywords: extractKeywords(heroContent),
      route,
    });

    // ── Overview Blocks ──────────────────────────────────────────────────────
    if (sol.overview) {
      const ov = sol.overview;
      const blocks = Array.isArray(ov.blocks)
        ? ov.blocks.map((b: any) => `${b.title}: ${b.description}`).join('. ')
        : '';
      const content = [
        ov.eyebrow, ov.title, ov.highlightTitle, ov.description, blocks,
      ].filter(Boolean).join('. ');
      docs.push({
        page: 'solution-detail', type: 'overview',
        slug: sol.slug, title: `${sol.title} — Overview`,
        content, keywords: extractKeywords(content), route,
      });
    }

    // ── Capabilities ─────────────────────────────────────────────────────────
    if (sol.capabilities) {
      const cap = sol.capabilities;
      const items = Array.isArray(cap.items)
        ? cap.items.map((c: any) => `${c.title}: ${c.description}`).join('. ')
        : '';
      const content = [cap.eyebrow, cap.title, cap.description, items].filter(Boolean).join('. ');
      docs.push({
        page: 'solution-detail', type: 'capabilities',
        slug: sol.slug, title: `${sol.title} — Capabilities`,
        content, keywords: extractKeywords(content), route,
      });
    }

    // ── Use Cases / Deployment Scenarios ─────────────────────────────────────
    if (sol.useCases) {
      const uc = sol.useCases;
      const items = Array.isArray(uc.items)
        ? uc.items.map((u: any) => `${u.title}: ${u.description}${u.stats ? ` (${u.stats})` : ''}`).join('. ')
        : '';
      const content = [uc.eyebrow, uc.title, uc.description, items].filter(Boolean).join('. ');
      docs.push({
        page: 'solution-detail', type: 'use-cases',
        slug: sol.slug, title: `${sol.title} — Use Cases`,
        content, keywords: extractKeywords(content), route,
      });
    }

    // ── Final CTA ─────────────────────────────────────────────────────────────
    if (sol.finalCta) {
      const cta = sol.finalCta;
      const content = [cta.eyebrow, cta.title, cta.highlightTitle, cta.description].filter(Boolean).join('. ');
      docs.push({
        page: 'solution-detail', type: 'cta',
        slug: sol.slug, title: `${sol.title} — Get Started`,
        content, keywords: extractKeywords(content), route,
      });
    }
  }

  return docs;
}

function buildApproachDocuments(data: any): KnowledgeDocument[] {
  if (!data) return [];
  const docs: KnowledgeDocument[] = [];

  if (data.hero) {
    const h = data.hero;
    const content = [h.eyebrow, h.title, h.highlightedText, h.description].filter(Boolean).join('. ');
    docs.push({
      page: 'approach', type: 'hero', title: "Veenero's Approach",
      content, keywords: extractKeywords(content), route: '/approach',
    });
  }

  if (data.philosophy) {
    const p = data.philosophy;
    const paragraphs = Array.isArray(p.paragraphs) ? p.paragraphs.join(' ') : safe(p.paragraphs);
    const content = [p.eyebrow, p.title, p.highlightedText, paragraphs].filter(Boolean).join('. ');
    docs.push({
      page: 'approach', type: 'philosophy', title: 'Approach Philosophy',
      content, keywords: extractKeywords(content), route: '/approach',
    });
  }

  if (data.framework && Array.isArray(data.framework.pillars)) {
    const pillars = data.framework.pillars
      .map((p: any) => `${p.title}: ${p.description}`).join('. ');
    const content = [data.framework.eyebrow, data.framework.title, data.framework.description, pillars]
      .filter(Boolean).join('. ');
    docs.push({
      page: 'approach', type: 'framework', title: 'Approach Framework',
      content, keywords: extractKeywords(content), route: '/approach',
    });
  }

  if (data.technologyTelemetry) {
    const tt = data.technologyTelemetry;
    const caps = Array.isArray(tt.capabilities)
      ? tt.capabilities.map((c: any) => `${c.title}: ${c.description}`).join('. ')
      : '';
    const content = [tt.eyebrow, tt.title, tt.description, caps].filter(Boolean).join('. ');
    docs.push({
      page: 'approach', type: 'technology', title: 'Technology & Telemetry',
      content, keywords: extractKeywords(content), route: '/approach',
    });
  }

  // Phase-based methodology steps
  const stepsKey = ['phases', 'steps', 'methodology', 'process'].find(k => data[k]);
  if (stepsKey && Array.isArray(data[stepsKey])) {
    for (const step of data[stepsKey]) {
      const content = [step.number, step.title, step.description].filter(Boolean).join('. ');
      docs.push({
        page: 'approach', type: 'step', title: `Approach: ${step.title || step.number}`,
        content, keywords: extractKeywords(content), route: '/approach',
      });
    }
  }

  return docs;
}

function buildImpactDocuments(data: any): KnowledgeDocument[] {
  if (!data) return [];
  const docs: KnowledgeDocument[] = [];

  if (data.hero) {
    const h = data.hero;
    const content = [h.eyebrow, h.title, h.description].filter(Boolean).join('. ');
    docs.push({
      page: 'impact', type: 'hero', title: "Veenero's Impact",
      content, keywords: extractKeywords(content), route: '/impact',
    });
  }

  if (data.outcomes && Array.isArray(data.outcomes.pillars)) {
    const pillars = data.outcomes.pillars
      .map((p: any) => `${p.label}: ${p.value} — ${p.description}`).join('. ');
    const content = [data.outcomes.eyebrow, data.outcomes.title, data.outcomes.description, pillars]
      .filter(Boolean).join('. ');
    docs.push({
      page: 'impact', type: 'outcomes', title: 'Impact Outcomes',
      content, keywords: extractKeywords(content), route: '/impact',
    });
  }

  if (data.storyline && Array.isArray(data.storyline.steps)) {
    const steps = data.storyline.steps
      .map((s: any) => `${s.stage || s.number}: ${s.title} — ${s.description}. Outcome: ${s.outcome || ''}`)
      .join('. ');
    const content = [data.storyline.eyebrow, data.storyline.title, steps].filter(Boolean).join('. ');
    docs.push({
      page: 'impact', type: 'storyline', title: 'Impact Journey',
      content, keywords: extractKeywords(content), route: '/impact',
    });
  }

  if (data.ecosystem && Array.isArray(data.ecosystem.domains)) {
    for (const domain of data.ecosystem.domains) {
      const points = safeJoin(domain.impactPoints);
      const content = [domain.title, domain.description, points && `Impact: ${points}`]
        .filter(Boolean).join('. ');
      docs.push({
        page: 'impact', type: 'ecosystem-domain', title: `Impact: ${domain.title}`,
        content, keywords: extractKeywords(content), route: '/impact',
      });
    }
  }

  if (data.sustainability) {
    const s = data.sustainability;
    const pillars = Array.isArray(s.pillars)
      ? s.pillars.map((p: any) => `${p.title}: ${p.description}`).join('. ')
      : '';
    const content = [s.eyebrow, s.title, s.description, pillars].filter(Boolean).join('. ');
    docs.push({
      page: 'impact', type: 'sustainability', title: 'Sustainability',
      content, keywords: extractKeywords(content), route: '/impact',
    });
  }

  return docs;
}

function buildCareersDocuments(jobs: any[], pageSettings: any): KnowledgeDocument[] {
  const docs: KnowledgeDocument[] = [];

  // Career page intro
  if (pageSettings?.hero) {
    const h = pageSettings.hero;
    const content = [h.eyebrow, h.title, h.description].filter(Boolean).join('. ');
    docs.push({
      page: 'careers', type: 'hero', title: "Careers at Veenero",
      content, keywords: extractKeywords(content), route: '/careers',
    });
  }

  if (pageSettings?.hiringProcess && Array.isArray(pageSettings.hiringProcess.steps)) {
    const steps = pageSettings.hiringProcess.steps
      .map((s: any) => `Step ${s.num}: ${s.title} — ${s.description}`).join('. ');
    const content = [pageSettings.hiringProcess.title, steps].filter(Boolean).join('. ');
    docs.push({
      page: 'careers', type: 'hiring-process', title: 'Hiring Process',
      content, keywords: extractKeywords(content), route: '/careers',
    });
  }

  // Individual job listings
  if (Array.isArray(jobs)) {
    const activeJobs = jobs.filter(j => j.status !== 'ARCHIVED' && j.status !== 'TRASHED' && j.deletedAt == null);
    if (activeJobs.length === 0) {
      docs.push({
        page: 'careers', type: 'no-openings', title: 'Career Openings',
        content: 'Veenero currently has no open positions listed. Candidates can contact the team directly.',
        keywords: ['careers', 'jobs', 'openings', 'hiring', 'work', 'employment'],
        route: '/careers',
      });
    } else {
      for (const job of activeJobs) {
        const requirements = Array.isArray(job.requirements) ? safeJoin(job.requirements) : '';
        const responsibilities = Array.isArray(job.responsibilities) ? safeJoin(job.responsibilities) : '';
        const skills = Array.isArray(job.skills) ? safeJoin(job.skills) : '';
        const content = [
          `Job: ${job.title}`,
          job.department && `Department: ${job.department}`,
          job.location && `Location: ${job.location}`,
          job.employmentType && `Type: ${job.employmentType}`,
          job.experienceLevel && `Experience: ${job.experienceLevel}`,
          job.description,
          requirements && `Requirements: ${requirements}`,
          responsibilities && `Responsibilities: ${responsibilities}`,
          skills && `Skills: ${skills}`,
        ].filter(Boolean).join('. ');
        docs.push({
          page: 'careers', type: 'job-listing',
          slug: job.slug,
          title: job.title,
          content,
          keywords: extractKeywords(content),
          route: job.slug ? `/careers/${job.slug}` : '/careers',
        });
      }
    }
  }

  return docs;
}

function buildBlogDocuments(posts: any[]): KnowledgeDocument[] {
  if (!Array.isArray(posts)) return [];
  const docs: KnowledgeDocument[] = [];

  for (const post of posts) {
    if (!post.title) continue;
    const tags = safeJoin(post.tags);
    const content = [
      `Blog: ${post.title}`,
      post.category && `Category: ${post.category}`,
      post.excerpt || post.summary || post.description,
      tags && `Tags: ${tags}`,
    ].filter(Boolean).join('. ');
    docs.push({
      page: 'blog', type: 'post',
      slug: post.slug,
      title: post.title,
      content,
      keywords: extractKeywords(content),
      route: post.slug ? `/blog/${post.slug}` : '/blog',
    });
  }

  return docs;
}

function buildContactDocuments(data: any): KnowledgeDocument[] {
  if (!data) return [];
  const docs: KnowledgeDocument[] = [];

  const contactLines: string[] = [];
  if (data.hero?.description) contactLines.push(data.hero.description);
  if (Array.isArray(data.contactInfo?.items)) {
    for (const item of data.contactInfo.items) {
      contactLines.push(`${item.label}: ${item.value}`);
    }
  }
  if (data.contactInfo?.email) contactLines.push(`Email: ${data.contactInfo.email}`);
  if (data.contactInfo?.phone) contactLines.push(`Phone: ${data.contactInfo.phone}`);
  if (data.contactInfo?.address) contactLines.push(`Address: ${data.contactInfo.address}`);

  if (contactLines.length > 0) {
    const content = contactLines.join('. ');
    docs.push({
      page: 'contact', type: 'contact-info', title: 'Contact Veenero',
      content, keywords: extractKeywords(content), route: '/contact',
    });
  }

  // FAQs
  const faqItems = data.faq?.items || data.faqs?.items || data.faqs || [];
  if (Array.isArray(faqItems)) {
    for (const faq of faqItems) {
      if (!faq.question) continue;
      const content = `Q: ${faq.question} A: ${faq.answer || ''}`;
      docs.push({
        page: 'contact', type: 'faq', title: faq.question,
        content, keywords: extractKeywords(content), route: '/contact',
      });
    }
  }

  return docs;
}

function buildFooterDocuments(data: any): KnowledgeDocument[] {
  if (!data) return [];
  const docs: KnowledgeDocument[] = [];

  const lines: string[] = [];
  if (data.description) lines.push(`About Veenero: ${data.description}`);
  if (data.email) lines.push(`Contact email: ${data.email}`);
  if (data.mobile) lines.push(`Contact phone: ${data.mobile}`);
  if (data.address) lines.push(`Address: ${data.address}`);

  // Navigation links from footer
  if (data.links) {
    if (Array.isArray(data.links.solutions)) {
      lines.push('Solutions: ' + data.links.solutions.map((l: any) => l.label).join(', '));
    }
    if (Array.isArray(data.links.company)) {
      lines.push('Company pages: ' + data.links.company.map((l: any) => l.label).join(', '));
    }
    if (Array.isArray(data.links.resources)) {
      lines.push('Resources: ' + data.links.resources.map((l: any) => l.label).join(', '));
    }
  }

  if (lines.length > 0) {
    const content = lines.join('. ');
    docs.push({
      page: 'footer', type: 'contact-navigation', title: 'Veenero Contact & Navigation',
      content, keywords: extractKeywords(content), route: '/contact',
    });
  }

  return docs;
}

// ─── Master Knowledge Builder ─────────────────────────────────────────────────

async function buildKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  const BASE = `http://localhost:${config.port}`;
  logger.info('[AIKnowledge] Building fresh website knowledge from CMS...');

  // Fetch all CMS endpoints in parallel (with individual 8s timeouts)
  const [
    homeData,
    aboutData,
    solutionsData,
    solutionDetailsData,
    approachData,
    impactData,
    careersData,
    blogData,
    contactData,
    footerData,
    careerPageData,
  ] = await Promise.all([
    safeGet(`${BASE}/api/home`),
    safeGet(`${BASE}/api/about`),
    safeGet(`${BASE}/api/solutions`),
    safeGet(`${BASE}/api/solutions-detail`),
    safeGet(`${BASE}/api/approach`),
    safeGet(`${BASE}/api/impact`),
    safeGet(`${BASE}/api/careers`),
    safeGet(`${BASE}/api/blog?limit=15`),
    safeGet(`${BASE}/api/contact`),
    safeGet(`${BASE}/api/footer`),
    // Career page settings from careers CMS endpoint (same endpoint returns page settings + jobs in some setups)
    safeGet(`${BASE}/api/careers/settings`).catch(() => null),
  ]);

  const documents: KnowledgeDocument[] = [
    ...buildHomeDocuments(homeData),
    ...buildAboutDocuments(aboutData),
    ...buildSolutionsDocuments(solutionsData),
    ...buildSolutionDetailDocuments(Array.isArray(solutionDetailsData) ? solutionDetailsData : []),
    ...buildApproachDocuments(approachData),
    ...buildImpactDocuments(impactData),
    ...buildCareersDocuments(Array.isArray(careersData) ? careersData : [], careerPageData),
    ...buildBlogDocuments(Array.isArray(blogData) ? blogData : []),
    ...buildContactDocuments(contactData),
    ...buildFooterDocuments(footerData),
  ];

  const solutionDetailCount = documents.filter(d => d.page === 'solution-detail').length;
  logger.success(
    `[AIKnowledge] Knowledge built: ${documents.length} documents ` +
    `(${solutionDetailCount} solution-detail docs, ` +
    `${documents.filter(d => d.page === 'blog').length} blog posts)`
  );

  return documents;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the full normalized website knowledge, served from cache when fresh.
 * Cache TTL: 5 minutes. Auto-refreshes on expiry.
 */
export async function getWebsiteKnowledge(): Promise<KnowledgeDocument[]> {
  const now = Date.now();
  if (cachedDocuments && (now - cacheBuiltAt) < CACHE_TTL_MS) {
    return cachedDocuments;
  }
  cachedDocuments = await buildKnowledgeDocuments();
  cacheBuiltAt = Date.now();
  return cachedDocuments;
}

// ─── Relevance Selector ───────────────────────────────────────────────────────

/**
 * Score each knowledge document against the user's query.
 * Returns only the most relevant documents within the token budget.
 *
 * Scoring:
 *  - Title match: +10 per keyword hit
 *  - Page/type match for query intent: +8
 *  - Content keyword match: +1 per keyword hit
 *
 * Always includes: contact info + footer (for navigation/contact questions).
 * Always includes: home hero + about hero (for general Veenero questions).
 */
export function selectRelevantContext(
  documents: KnowledgeDocument[],
  query: string,
  maxChars = 8000
): KnowledgeDocument[] {
  const queryWords = extractKeywords(query);
  const queryLower = query.toLowerCase();

  // Detect query intent
  const wantsSolution = /solution|product|service|aqua|water saver|pumping|quality|assessment|automation|conserv/i.test(queryLower);
  const wantsContact = /contact|email|phone|address|reach|touch|talk|call/i.test(queryLower);
  const wantsCareers = /career|job|hiring|position|role|work|employ|opportunit/i.test(queryLower);
  const wantsBlog = /blog|insight|article|news|read|post/i.test(queryLower);
  const wantsAbout = /about|story|mission|vision|company|found|journey|team|who/i.test(queryLower);
  const wantsImpact = /impact|outcome|result|metric|sustainab|water visib|waste|efficien/i.test(queryLower);
  const wantsApproach = /approach|method|process|framework|philosoph|technolog|how do you/i.test(queryLower);

  // Score each document
  const scored = documents.map(doc => {
    let score = 0;

    // Title match
    const titleLower = doc.title.toLowerCase();
    for (const kw of queryWords) {
      if (titleLower.includes(kw)) score += 10;
    }

    // Intent-based page boost
    if (wantsSolution && (doc.page === 'solution-detail' || doc.page === 'solutions')) score += 8;
    if (wantsContact && (doc.page === 'contact' || doc.page === 'footer')) score += 8;
    if (wantsCareers && doc.page === 'careers') score += 8;
    if (wantsBlog && doc.page === 'blog') score += 8;
    if (wantsAbout && doc.page === 'about') score += 8;
    if (wantsImpact && doc.page === 'impact') score += 8;
    if (wantsApproach && doc.page === 'approach') score += 8;

    // Content keyword match
    for (const kw of queryWords) {
      if (doc.keywords.includes(kw)) score += 1;
    }

    // Specific solution slug match (very high boost)
    if (doc.slug) {
      const slugWords = doc.slug.replace(/-/g, ' ');
      if (queryLower.includes(slugWords) || slugWords.split(' ').every(w => queryLower.includes(w))) {
        score += 25;
      }
    }

    return { doc, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Always-include baseline documents
  const alwaysInclude = new Set<string>();
  const contactDoc = documents.find(d => d.page === 'contact' && d.type === 'contact-info');
  const footerDoc = documents.find(d => d.page === 'footer');
  const homeHero = documents.find(d => d.page === 'home' && d.type === 'hero');
  if (contactDoc) alwaysInclude.add(contactDoc.title);
  if (footerDoc) alwaysInclude.add(footerDoc.title);
  if (homeHero) alwaysInclude.add(homeHero.title);

  const selected: KnowledgeDocument[] = [];
  let charCount = 0;

  // Add always-included first
  for (const doc of [contactDoc, footerDoc, homeHero].filter(Boolean)) {
    if (!doc) continue;
    selected.push(doc);
    charCount += doc.content.length;
  }

  // Add scored docs until budget is hit
  for (const { doc } of scored) {
    if (alwaysInclude.has(doc.title)) continue; // already added
    if (charCount + doc.content.length > maxChars) continue;
    selected.push(doc);
    charCount += doc.content.length;
  }

  return selected;
}

/**
 * Format the selected knowledge documents into the system prompt context string.
 */
export function formatContextForPrompt(docs: KnowledgeDocument[]): string {
  if (docs.length === 0) {
    return 'Website content is currently loading. Guide users to main pages (/about, /solutions, /contact).';
  }

  // Group by page for readability
  const byPage: Record<string, KnowledgeDocument[]> = {};
  for (const doc of docs) {
    if (!byPage[doc.page]) byPage[doc.page] = [];
    byPage[doc.page].push(doc);
  }

  const sections: string[] = [];
  const pageLabels: Record<string, string> = {
    'home': '## HOME PAGE',
    'about': '## ABOUT VEENERO',
    'solutions': '## SOLUTIONS OVERVIEW',
    'solution-detail': '## SOLUTION DETAIL PAGES',
    'approach': '## OUR APPROACH',
    'impact': '## OUR IMPACT',
    'careers': '## CAREERS',
    'blog': '## BLOG & INSIGHTS',
    'contact': '## CONTACT',
    'footer': '## CONTACT & NAVIGATION',
  };

  for (const [page, pageDocs] of Object.entries(byPage)) {
    const label = pageLabels[page] || `## ${page.toUpperCase()}`;
    const content = pageDocs.map(d => `### ${d.title}\n${d.content}`).join('\n\n');
    sections.push(`${label}\n${content}`);
  }

  return sections.join('\n\n---\n\n');
}
