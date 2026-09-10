import bcrypt from 'bcrypt';
import { CmsPageModel } from '../models/CmsPage';
import { UserModel } from '../models/User';
import { BlogPostModel } from '../models/BlogPost';
import { BlogLandingSettingsModel } from '../models/BlogLandingSettings';
import { HomePageSettingsModel } from '../models/HomePageSettings';
import { AboutPageSettingsModel } from '../models/AboutPageSettings';
import { SolutionsPageSettings } from '../models/SolutionsPageSettings';
import { ImpactPageSettingsModel } from '../models/ImpactPageSettings';
import { ContactPageSettingsModel } from '../models/ContactPageSettings';
import { FooterSettingsModel } from '../models/FooterSettings';
import { MediaModel } from '../models/Media';
import { CareerModel } from '../models/Career';
import { CareerPageSettingsModel } from '../models/CareerPageSettings';

const mockPages = [
  {
    _id: 'page-home',
    name: 'Home',
    slug: '/',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Veenero Sustainable Solutions | Water Management & Conservation',
    seoMetaDescription:
      'Veenero Sustainable Solutions Pvt Ltd provides water conservative devices and software including Aqua Saver to reduce water waste and ensure water security.',
    seoStatus: 'good',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Veenero Team',
    isCoreSystemPage: true,
    sections: [
      { id: 's-hero', name: 'Hero', type: 'hero', visible: true },
      { id: 's-solutions', name: 'Solutions Overview', type: 'content', visible: true },
      { id: 's-impact', name: 'Impact Numbers', type: 'content', visible: true },
      { id: 's-partners', name: 'Partners Strip', type: 'gallery', visible: true },
      { id: 's-cta', name: 'Call to Action', type: 'cta', visible: true },
    ],
  },
  {
    _id: 'page-about',
    name: 'About',
    slug: '/about',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'About Us | Veenero Sustainable Solutions',
    seoMetaDescription:
      'Learn about Veenero origin, our village roots, and our mission to enforce water management, eliminate leaks, and build future water security.',
    seoStatus: 'good',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Veenero Team',
    isCoreSystemPage: true,
    sections: [
      { id: 's-about-hero', name: 'About Hero', type: 'hero', visible: true },
      { id: 's-mission', name: 'Mission & Vision', type: 'content', visible: true },
      { id: 's-team', name: 'Leadership Team', type: 'gallery', visible: true },
    ],
  },
  {
    _id: 'page-solutions',
    name: 'Solutions',
    slug: '/solutions',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Solutions | Aqua Saver & Water Conservative Software',
    seoMetaDescription:
      'Discover Aqua Saver, Aqua Saver 3D-Module, Water Quality Assessment, Pumping Automation, Water Tracking, and Leak Identification.',
    seoStatus: 'good',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Veenero Team',
    isCoreSystemPage: true,
    sections: [
      { id: 's-solutions-hero', name: 'Solutions Hero', type: 'hero', visible: true },
      { id: 's-categories', name: 'Solution Categories', type: 'content', visible: true },
      { id: 's-cta', name: 'Solutions CTA', type: 'cta', visible: true },
    ],
  },
  {
    _id: 'page-impact',
    name: 'Impact',
    slug: '/impact',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Impact & Achievements | Veenero Sustainable Solutions',
    seoMetaDescription:
      'Addressing India 49 billion liter daily water waste crisis. WE Hub POC certified and Intinta Innovator Award winner.',
    seoStatus: 'good',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Veenero Team',
    isCoreSystemPage: true,
    sections: [
      { id: 's-impact-hero', name: 'Impact Hero', type: 'hero', visible: true },
      { id: 's-stats', name: 'Key Statistics', type: 'content', visible: true },
    ],
  },
  {
    _id: 'page-contact',
    name: 'Contact',
    slug: '/contact',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Contact Us | Veenero Sustainable Solutions',
    seoMetaDescription:
      'Get in touch with Veenero Sustainable Solutions Pvt Ltd. Email info@veenerosolutions.com or udaygedam@veenerosolutions.com.',
    seoStatus: 'good',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Veenero Team',
    isCoreSystemPage: true,
    sections: [
      { id: 's-contact-hero', name: 'Contact Hero', type: 'hero', visible: true },
      { id: 's-contact-form', name: 'Contact Form', type: 'content', visible: true },
    ],
  },
];

export async function seedDatabase(): Promise<void> {
  try {
    // 1. Seed/Update Core Pages
    for (const p of mockPages) {
      await CmsPageModel.findOneAndUpdate(
        { slug: p.slug },
        { $set: p },
        { upsert: true, new: true }
      );
    }
    console.log('[Seed] Core CMS pages verified.');

    // 2. Seed Super Admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Super Admin';

    if (adminEmail && adminPassword) {
      const existingAdmin = await UserModel.findOne({ email: adminEmail.toLowerCase().trim() });
      if (!existingAdmin) {
        console.log(`[Seed] Super Admin user not found. Seeding admin: ${adminEmail}...`);
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await UserModel.create({
          name: adminName,
          email: adminEmail.toLowerCase().trim(),
          passwordHash,
          role: 'SUPER_ADMIN',
          isActive: true,
        });
        console.log('[Seed] Super Admin seeded successfully.');
      }
    }

    // 3. Clean up fake blog posts to keep blog genuinely CMS-driven
    const fakeAuthors = ['Veenero Insights', 'Tech & Engineering Layer', 'Sustainability Board', 'Governance & Auditing', 'Veenero Leadership'];
    const deleteResult = await BlogPostModel.deleteMany({ author: { $in: fakeAuthors } });
    if (deleteResult.deletedCount > 0) {
      console.log(`[Seed] Cleaned up ${deleteResult.deletedCount} fabricated blog posts. Blog is ready for authentic CMS articles.`);
    }

    // 4. Seed Blog Landing Settings (Empty state ready)
    await BlogLandingSettingsModel.findOneAndUpdate(
      {},
      {
        hero: {
          eyebrow: 'VEENERO RESEARCH & UPDATES',
          title: 'Insights on Water Conservation',
          description: 'Perspectives, field research, and technology updates on water management and conservation from the Veenero team.',
          image: '/src/assets/hero-water.jpg',
          imageAlt: 'Veenero water conservation insights',
        },
        featuredSection: {
          eyebrow: 'LATEST DEVELOPMENTS',
          title: 'Field Research & Technology',
          description: 'Follow our ongoing developments in water conservative devices and software.',
        },
        insightStats: [
          { value: '49B L', label: 'India Daily Waste', description: 'Daily water waste addressed by conservation' },
          { value: '30%', label: 'Global Loss', description: 'Average water supply lost to leaks' },
          { value: 'Zero', label: 'Compromise', description: 'Focus on leak detection and water security' },
        ],
        editorialQuote: {
          eyebrow: 'OUR CONVICTION',
          title: 'Every litre of water saved strengthens future water security.',
          description: 'At Veenero, we believe that practical devices and appropriate management rules can eliminate avoidable water waste.',
        },
        cta: {
          eyebrow: 'GET INVOLVED',
          title: 'Interested in our field research?',
          description: 'Connect with our team to learn more about our upcoming deployments and application testing.',
          buttonText: 'Contact Us',
          buttonLink: '/contact',
        },
        seo: {
          metaTitle: 'Blog & Insights | Veenero Sustainable Solutions',
          metaDescription: 'Research, technology updates, and perspectives on water conservation from Veenero Sustainable Solutions Pvt Ltd.',
        },
        isPublished: true,
      },
      { upsert: true, new: true }
    );

    // 5. Seed Media Assets
    await seedAboutMedia();

    // 6. Synchronize Authentic Veenero Source Content across all CMS collections
    await syncVeeneroSourceContent();

    // 7. Seed & Synchronize Careers and Job Openings (Idempotent)
    await seedCareers();

  } catch (error) {
    console.error('[Seed] Error during seeding:', (error as Error).message);
  }
}

/**
 * Synchronizes authentic Veenero Sustainable Solutions company content across MongoDB collections.
 * Idempotent: safe to run on every startup.
 */
export async function syncVeeneroSourceContent(): Promise<void> {
  console.log('[Seed] Synchronizing authentic Veenero source content to database...');

  // ── 1. HOME PAGE SETTINGS ──────────────────────────────────────────────────
  await HomePageSettingsModel.findOneAndUpdate(
    {},
    {
      $set: {
        hero: {
          visible: true,
          eyebrow: 'VEENERO SUSTAINABLE SOLUTIONS PVT LTD',
          title: 'Water Management & Conservation Infrastructure',
          description: 'Enforcing appropriate water management, reducing water waste, and ensuring water security through device-based solutions and intelligent software.',
          primaryCtaText: 'Explore Aqua Saver',
          primaryCtaLink: '/solutions',
          secondaryCtaText: 'Our Story',
          secondaryCtaLink: '/about',
          image: '/src/assets/hero-water.jpg',
          imageAlt: 'Veenero Sustainable Solutions — Water conservation and management',
          bottomText: 'Aqua Saver · 3D-Module · Conservation & Security',
        },
        about: {
          visible: true,
          eyebrow: 'ABOUT VEENERO',
          title: 'From Village Roots to Water Security',
          description: 'We are from a village background, and we have seen precisely how many liters of water are wasted every day as a result of leaks in overhead tanks, pipelines, and taps. After conducting a thorough analysis of the issue, we discovered that there are no appropriate water management systems or water usage rules. We began working on water management and conservation after studying the use and distribution of water across multiple sectors.',
          values: [
            {
              iconName: 'Target',
              title: 'Enforce Water Management',
              description: 'Establish appropriate water management systems and clear usage rules across societies, communities, and government sectors.',
            },
            {
              iconName: 'TrendingDown',
              title: 'Reduce Water Waste',
              description: 'Target and eliminate leaks across taps, seepages, pipelines, and overhead tanks to prevent catastrophic water loss.',
            },
            {
              iconName: 'ShieldCheck',
              title: 'Ensure Water Security',
              description: 'Conserve every drop to safeguard socio-economic development, food and energy production, and healthy ecosystems.',
            },
          ],
          stats: [
            { value: '49 Billion L', label: 'Wasted Daily in India (Neerain)' },
            { value: '30%', label: 'Global Supply Lost (Gitnux)' },
            { value: '600 Million', label: 'People Facing Water Crisis' },
            { value: 'Core Focus', label: 'Devices & Software Solutions' },
          ],
        },
        solutions: {
          visible: true,
          eyebrow: 'OUR SOLUTIONS',
          title: 'Water Conservative Devices & Software',
          description: 'Veenero works on water management and conservation through a combination of hardware/device-based solutions and intelligent software.',
          list: [
            {
              iconName: 'Cpu',
              imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
              title: 'Aqua Saver (Core Solution)',
              description: 'Our core water conservative device and 3D-Module, engineered to monitor flow, identify leakages, and enforce water management.',
              features: ['Aqua Saver Device', 'Aqua Saver 3D-Module', 'Hardware + Software Integration'],
            },
            {
              iconName: 'Search',
              imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
              title: 'Leak Identification & Reporting',
              description: 'Pinpoint leakage points across taps, pipelines, seepages, and overhead storage tanks before severe loss occurs.',
              features: ['Tap & pipe leak detection', 'Seepage & tank monitoring', 'Actionable leak reports'],
            },
            {
              iconName: 'Activity',
              imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=80',
              title: 'Water Tracking & Informatics',
              description: 'Analyze how much water is used and wasted across various fields, communities, and industries with detailed reports.',
              features: ['Usage & waste analysis', 'Distribution mapping', 'Informatics reporting'],
            },
            {
              iconName: 'Sliders',
              imageUrl: 'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&w=400&q=80',
              title: 'Water Pumping Automation',
              description: 'Resolve the recurring burden of turning motor systems on and off on a regular basis through smart automation.',
              features: ['Automated motor scheduling', 'Tank level automation', 'Dry-run protection'],
            },
            {
              iconName: 'Droplets',
              imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=80',
              title: 'Water Quality Assessment',
              description: 'Evaluate water quality parameters to ensure safe, usable supplies for drinking, sanitation, and operations.',
              features: ['Quality evaluation', 'Contamination alerts', 'Safety compliance'],
            },
            {
              iconName: 'Award',
              imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80',
              title: 'Water Credits (In Development)',
              description: 'An application concept where users earn reward coins based on water conserved under prescribed guidelines.',
              features: ['Incentive coin model', 'Consumption guidelines', 'Conservation rewards'],
            },
          ],
        },
        approach: {
          visible: true,
          eyebrow: 'PROCESS & WORKING',
          title: 'Systematic 6-Step Conservation Process',
          description: 'From setting up the Aqua Saver to resolving leaks through structured hardware and software algorithm approaches.',
          steps: [
            {
              number: '01',
              title: 'Setting up the Aqua Saver',
              description: 'Structural planning, network overview, and deploying the Aqua Saver device and 3D-Module across supply lines.',
              points: ['Structural planning', 'Network overview', 'Device setup'],
            },
            {
              number: '02',
              title: 'Monitoring the System',
              description: 'Continuous operational surveillance of pipelines, storage tanks, and pumping equipment.',
              points: ['Real-time surveillance', 'Line pressure & flow', 'Motor state tracking'],
            },
            {
              number: '03',
              title: 'Collection of Data',
              description: 'Streaming telemetry into the water application software to track utilized quantity and quality.',
              points: ['Data into application', 'Quantity utilized', 'Quality utilized'],
            },
            {
              number: '04',
              title: 'Identification of Leakage',
              description: 'Algorithm-driven detection of anomalous loss across taps, seepages, pipes, and overhead tanks.',
              points: ['Anomaly detection', 'Loss localized', 'Immediate notification'],
            },
            {
              number: '05',
              title: 'Identifying Characteristics',
              description: 'Evaluating leak severity, estimated volumetric loss, and physical dynamics.',
              points: ['Volume severity analysis', 'Leak pattern assessment', 'Priority ranking'],
            },
            {
              number: '06',
              title: 'Resolving the Leak Problem',
              description: 'Guided repair procedures and automated controls to stop leakage and verify conservation.',
              points: ['Leak resolution', 'Conservation steps', 'Verification reporting'],
            },
          ],
        },
        impact: {
          visible: true,
          eyebrow: 'REAL-WORLD CHALLENGE & IMPACT',
          title: "Addressing India's Daily Water Crisis",
          description: 'India wastes 49 billion liters of water daily while 600 million people face severe water crisis. Veenero tackles the root causes of leakage and unmanaged water usage.',
          impacts: [
            {
              iconName: 'Droplets',
              value: '49 Billion L',
              label: 'Daily Waste in India',
              description: 'Equivalent to 48.42 billion one-liter bottles lost every day (Ref: Neerain)',
            },
            {
              iconName: 'Globe',
              value: '30%',
              label: 'Global Supply Lost',
              description: 'Around 2.1 trillion gallons lost yearly due to leaks and inefficiency (Ref: Gitnux)',
            },
            {
              iconName: 'AlertTriangle',
              value: '297,000',
              label: 'Under-5 Child Deaths',
              description: 'Annual deaths globally from diarrheal diseases due to poor sanitation and unsafe water (WHO/UNICEF 2019)',
            },
            {
              iconName: 'ShieldCheck',
              value: '4 Critical Areas',
              label: 'Target Problem Areas',
              description: 'Comprehensive solutions for Tap Leaks, Seepages, Pipe Leaks, and Tank Leaks',
            },
          ],
          testimonial: {
            quote: 'Veenero received official POC certification from WE Hub, Government of Telangana, and the Aqua Saver solution was honored with the Intinta Innovator Award for two consecutive years at the district level.',
            author: 'Veenero Sustainable Solutions',
            role: 'Recognized Innovation',
            company: 'WE Hub & State Government of Telangana',
          },
        },
        partners: {
          visible: true,
          eyebrow: 'ACHIEVEMENTS & RECOGNITION',
          title: 'Validated by Leading Innovation Platforms',
          description: 'Our water conservation devices and methodology have been evaluated and recognized across state and national forums.',
          list: [
            {
              name: 'WE Hub, Government of Telangana',
              logo: '/src/assets/partner.png',
              description: 'Proof-of-Concept (POC) certification from WE Hub, Government of Telangana.',
            },
            {
              name: 'Intinta Innovator Award',
              logo: '/src/assets/partner2.jpg',
              description: 'Aqua Saver awarded Intinta Innovator Award for two consecutive years at district level.',
            },
            {
              name: 'National Innovation Challenge',
              logo: '/src/assets/part3.png',
              description: 'Participated in the National Innovation Challenge held at PIET College, Haryana.',
            },
            {
              name: 'IIIT Delhi',
              logo: '/src/assets/iiitdelhi_logo.jpg',
              description: 'Recognized for our innovation in sustainable water solutions and technology-driven impact.',
            },
            {
              name: 'STPI (Software Technology Parks of India)',
              logo: '/src/assets/STPI_LOGO.png',
              description: 'Supported under STPI for innovation and technology development.',
            },
            {
              name: 'Ministry of Electronics & Information Technology',
              logo: '/src/assets/Ministry_of_electronics_information_technology.png',
              description: 'Recognized for contribution towards technology-led solutions for a sustainable future.',
            },
            {
              name: 'STPINEXT Initiatives',
              logo: '/src/assets/STPINEXT_LOGO.png',
              description: 'Featured under STPINEXT for supporting emerging tech startups and innovative solutions.',
            },
            {
              name: 'IESA (India Electronics & Semiconductor Association)',
              logo: '/src/assets/iesa_logo.jpg',
              description: 'Recognized under IESA for innovation and technology development in sustainable solutions.',
            },
          ],
        },
        contact: {
          visible: true,
          eyebrow: 'GET IN TOUCH',
          title: 'Partner With Veenero',
          description: "Whether you represent a government department, a residential society, or an institution, let's work together to eliminate water waste and ensure water security.",
          infoTitle: 'Company Contact',
          infoList: [
            { iconName: 'Mail', label: 'Official Email', value: 'info@veenerosolutions.com' },
            { iconName: 'Mail', label: 'Founder Email', value: 'udaygedam@veenerosolutions.com' },
            { iconName: 'Globe', label: 'Website', value: 'www.veenerosolutions.com' },
          ],
          demoTitle: 'Request a Demo of Aqua Saver',
          demoDescription: 'Experience how the Aqua Saver device and software help monitor usage, automate pumping, and stop leakages.',
          demoButtonText: 'Request Demo',
          formTitle: 'Send an Inquiry',
        },
        footer: {
          description: 'Veenero Sustainable Solutions Pvt Ltd — Dedicated to appropriate water management, waste reduction, and future water security.',
          address: 'Veenero Sustainable Solutions Pvt Ltd, Adilabad, Telangana',
          mobile: '+91 9346517202',
          links: {
            solutions: [
              { label: 'Aqua Saver', href: '/solutions/aqua-saver' },
              { label: 'Water Quality Assessment', href: '/solutions/water-quality-assessment' },
              { label: 'Water Pumping Automation', href: '/solutions/water-pumping-automation' },
              { label: 'Water Tracking & Informatics', href: '/solutions/water-tracking-informatics' },
              { label: 'Water Credits', href: '/solutions/water-credits' },
              { label: 'Leak Identification', href: '/solutions/leak-identification' },
            ],
            company: [
              { label: 'About Veenero', href: '/about' },
              { label: 'Process & Working', href: '/approach' },
              { label: 'Impact & Achievements', href: '/impact' },
              { label: 'Contact', href: '/contact' },
            ],
            resources: [
              { label: 'WE Hub Telangana POC', href: '/impact' },
              { label: 'Intinta Innovator Award', href: '/impact' },
              { label: 'Blog & Insights', href: '/blog' },
            ],
          },
          socialLinks: [
            { iconName: 'Mail', href: 'mailto:info@veenerosolutions.com', label: 'Email Info' },
            { iconName: 'Mail', href: 'mailto:udaygedam@veenerosolutions.com', label: 'Email Founder' },
            { iconName: 'Globe', href: 'https://www.veenerosolutions.com', label: 'Website' },
          ],
        },
      },
    },
    { upsert: true, new: true }
  );

  // ── 2. ABOUT PAGE SETTINGS ─────────────────────────────────────────────────
  await AboutPageSettingsModel.findOneAndUpdate(
    {},
    {
      $set: {
        hero: {
          visible: true,
          eyebrow: 'ABOUT VEENERO',
          title: 'Veenero Sustainable',
          highlightedText: 'Solutions Pvt Ltd',
          description: 'Water is at the core of sustainable development, climate adaptation, and human survival. We engineer conservative devices and intelligent software to enforce water management, reduce waste, and ensure water security.',
          primaryCtaText: 'Our Story',
          primaryCtaLink: '#our-story',
          secondaryCtaText: 'Our Goals',
          secondaryCtaLink: '#our-goals',
          image: '/src/assets/about/about-hero-water-infrastructure.png',
          imageAlt: 'Veenero Sustainable Solutions water infrastructure',
        },
        ourStory: {
          visible: true,
          eyebrow: 'OUR STORY & ORIGIN',
          title: 'From Village Roots to Water Security',
          paragraphs: [
            'Water is at the core of sustainable development and is critical for socio-economic development, energy and food production, healthy ecosystems and for human survival itself. Water is also at the heart of adaptation to climate change, serving as the crucial link between society and the environment.',
            'We are from a village background, and we have seen precisely how many liters of water are wasted every day as a result of leaks in overhead tanks, pipelines, and taps. After conducting a thorough analysis of the issue, we discovered that there are no appropriate water management systems or water usage rules.',
            'We began working on water management and conservation after conducting an extensive study on the use and distribution of water across multiple sectors. Our primary goals are to enforce appropriate water management, reduce water waste, and ensure future water security.',
          ],
          badgePillars: ['Enforce Water Management', 'Reduce Water Waste', 'Ensure Water Security'],
          video: '/src/assets/about/about-story-water-infrastructure.mp4',
          videoPoster: '/src/assets/about/about-hero-water-infrastructure.png',
        },
        impactStats: {
          visible: true,
          eyebrow: 'THE WATER CRISIS IN NUMBERS',
          title: 'Facts That Demand Action',
          description: 'Supported by independent global and national water research.',
          list: [
            {
              value: '49 Billion L',
              label: 'Daily Waste in India',
              sublabel: 'Equivalent to 48.42B 1L bottles (Neerain)',
              icon: 'Droplets',
              order: 1,
              isActive: true,
            },
            {
              value: '30%',
              label: 'Global Water Loss',
              sublabel: '2.1 trillion gallons lost yearly (Gitnux)',
              icon: 'Globe',
              order: 2,
              isActive: true,
            },
            {
              value: '297,000',
              label: 'Child Deaths Yearly',
              sublabel: 'From diarrheal diseases under-5 (WHO/UNICEF)',
              icon: 'AlertTriangle',
              order: 3,
              isActive: true,
            },
            {
              value: '600 Million',
              label: 'People in Water Crisis',
              sublabel: 'Facing severe water scarcity across India',
              icon: 'Users',
              order: 4,
              isActive: true,
            },
          ],
        },
        purposeDirection: {
          visible: true,
          eyebrow: 'PURPOSE & DIRECTION',
          title: 'A Disciplined Approach to Conservation',
          description: 'Guiding our device engineering and software development toward measurable water conservation.',
          vision: {
            badge: 'Water Security',
            title: 'Our Vision',
            description: 'A water-secure world where zero water is lost to unaddressed leaks, driven by appropriate water management systems and proactive conservation rules.',
            isActive: true,
          },
          mission: {
            badge: 'Conservative Solutions',
            title: 'Our Mission',
            description: 'To deliver effective water conservative devices (Aqua Saver) and software solutions that analyze usage, stop leakages, and protect precious water resources across societies and government sectors.',
            isActive: true,
          },
        },
        pillars: {
          visible: true,
          eyebrow: 'CORE FOCUS AREAS',
          title: 'Our Guiding Principles',
          description: 'The foundational pillars that guide Veenero technology and community operations.',
          list: [
            {
              title: 'Enforce Water Management',
              description: 'Establishing appropriate management systems and rules to govern water distribution and consumption responsibly.',
              image: '/src/assets/about/about-pillar-purpose.webp',
              order: 1,
              isActive: true,
            },
            {
              title: 'Reduce Water Waste',
              description: 'Zero tolerance for unaddressed leaks across taps, pipes, overhead tanks, and underground seepages.',
              image: '/src/assets/about/about-pillar-integrity.webp',
              order: 2,
              isActive: true,
            },
            {
              title: 'Ensure Water Security',
              description: 'Preserving precious freshwater supplies to support communities, agriculture, and future generations.',
              image: '/src/assets/about/about-pillar-impact.webp',
              order: 3,
              isActive: true,
            },
            {
              title: 'Grounded Innovation',
              description: 'Practical, reliable device engineering born from real-world village observations and sectoral studies.',
              image: '/src/assets/about/about-pillar-innovation.webp',
              order: 4,
              isActive: true,
            },
            {
              title: 'Stronger Together',
              description: 'Collaborating with local societies, government bodies, and communities to protect every drop.',
              image: '/src/assets/about/about-pillar-together.webp',
              order: 5,
              isActive: true,
            },
          ],
        },
        ourJourney: {
          visible: true,
          eyebrow: 'RECOGNITIONS & MILESTONES',
          title: 'Verified Achievements',
          description: 'Recognition and evaluation by state innovation bodies and national challenges.',
          journeyImage: '/src/assets/about/about-journey-water-infrastructure.webp',
          journeyCaption: 'Developing and deploying water conservative devices and software from grassroots to institutions.',
          milestones: [
            {
              year: 'Telangana Govt',
              title: 'WE Hub POC Certification',
              description: 'Received official Proof-of-Concept certification from WE Hub, Government of Telangana.',
              iconType: 'prototype',
              order: 1,
              isActive: true,
            },
            {
              year: 'District Innovation',
              title: 'Intinta Innovator Award',
              description: 'Aqua Saver awarded the prestigious Intinta Innovator Award for two consecutive years at district level.',
              iconType: 'scale',
              order: 2,
              isActive: true,
            },
            {
              year: 'Haryana',
              title: 'National Innovation Challenge',
              description: 'Participated in the National Innovation Challenge held at PIET College, Haryana.',
              iconType: 'adoption',
              order: 3,
              isActive: true,
            },
            {
              year: 'Recognition',
              title: 'State Leadership Acknowledgment',
              description: 'Gratitude and recognition mention involving Sir Ashok Gehlot, Chief Minister of Rajasthan.',
              iconType: 'future',
              order: 4,
              isActive: true,
            },
          ],
        },
        whyChoose: {
          visible: true,
          eyebrow: 'WHY VEENERO',
          title: 'Positioned Around Leakage & Conservation',
          description: 'While other companies handle treatment of contaminated water, Veenero specifically tackles leakage-related problems and unmanaged waste.',
          bottomTrustText: 'Aqua Saver · Device + Software Integration · Less Competition in Market',
          list: [
            {
              title: 'Aqua Saver 3D-Module',
              description: 'Unique technology and conservation methods utilized in the product manufacturing, resulting in less competition in the market.',
              icon: 'Cpu',
              image: '/src/assets/about/about-infrastructure-sensor.webp',
              order: 1,
              isActive: true,
            },
            {
              title: 'Leakage-Focused Approach',
              description: 'Specifically engineered to solve tap leaks, pipe leaks, seepage, and overhead tank overflows where 30% of supply is lost.',
              icon: 'Search',
              image: '/src/assets/about/about-field-verification.webp',
              order: 2,
              isActive: true,
            },
            {
              title: 'Detailed Utilization Reports',
              description: 'Intended to analyze precisely how much water is used and wasted across various fields and industries and provide detailed reports.',
              icon: 'Activity',
              image: '/src/assets/about/about-real-time-analytics.webp',
              order: 3,
              isActive: true,
            },
            {
              title: 'Government & Society Focus',
              description: 'Tailored for government water bodies, multi-family societies, and institutional campuses seeking recurring water security.',
              icon: 'Building2',
              image: '/src/assets/about/about-industrial-water-system.webp',
              order: 4,
              isActive: true,
            },
          ],
        },
        leadership: {
          visible: true,
          eyebrow: 'OUR CORE TEAM',
          title: 'Dedicated to Water Management & Conservation',
          description: 'A multidisciplinary team combining device hardware engineering, software development, and community impact.',
          team: [
            {
              name: 'Founding Team',
              role: 'Leadership & Strategy',
              bio: 'From village roots to national innovation, driving Veenero mission to enforce water management and stop water waste.',
              icon: 'Users2',
              image: '/src/assets/about/about-team-leadership.webp',
              order: 1,
              isActive: true,
            },
            {
              name: 'Device & Hardware Engineering',
              role: 'Aqua Saver 3D-Module',
              bio: 'Engineering the physical Aqua Saver hardware, flow sensors, and motor automation systems for robust field operation.',
              icon: 'Cpu',
              image: '/src/assets/about/about-field-verification.webp',
              order: 2,
              isActive: true,
            },
            {
              name: 'Software & Analytics Layer',
              role: 'Water Application & Informatics',
              bio: 'Developing the water management application, consumption tracking, and water credits reward features.',
              icon: 'LineChart',
              image: '/src/assets/about/about-real-time-analytics.webp',
              order: 3,
              isActive: true,
            },
          ],
        },
        cta: {
          visible: true,
          eyebrow: 'JOIN OUR MISSION',
          title: 'Help us conserve water for a sustainable tomorrow.',
          description: 'Whether you represent a government department, a residential society, or an institution, partner with Veenero to secure our water future.',
          primaryButtonText: 'Get in Touch',
          primaryButtonLink: '/contact',
        },
        seo: {
          metaTitle: 'About Us | Veenero Sustainable Solutions Pvt Ltd',
          metaDescription: 'Learn about Veenero village origin, our Aqua Saver device, and our mission to reduce water waste and ensure water security.',
        },
        isPublished: true,
      },
    },
    { upsert: true, new: true }
  );

  // ── 3. SOLUTIONS PAGE SETTINGS ─────────────────────────────────────────────
  const categoriesData = [
    {
      key: 'Aqua Saver',
      displayLabel: 'Aqua Saver (Core Solution)',
      slug: 'aqua-saver',
      description: 'Water conservative device and 3D-Module engineered to monitor flow, identify leakages, and enforce water management.',
      icon: 'Cpu',
      image: '/src/assets/about/about-field-verification.webp',
      order: 1,
      isActive: true,
      pillarKeys: [],
    },
    {
      key: 'Water Quality',
      displayLabel: 'Water Quality Assessment',
      slug: 'water-quality-assessment',
      description: 'Evaluate water quality parameters across storage tanks and supply lines to ensure safety and compliance.',
      icon: 'Droplets',
      image: '/src/assets/about/about-vision-water-infrastructure.webp',
      order: 2,
      isActive: true,
      pillarKeys: [],
    },
    {
      key: 'Pumping Automation',
      displayLabel: 'Water Pumping Automation',
      slug: 'water-pumping-automation',
      description: 'Intelligent automation to resolve the daily burden of turning motor systems on and off on a regular basis.',
      icon: 'Sliders',
      image: '/src/assets/about/about-infrastructure-sensor.webp',
      order: 3,
      isActive: true,
      pillarKeys: [],
    },
    {
      key: 'Water Tracking',
      displayLabel: 'Water Tracking & Informatics',
      slug: 'water-tracking-informatics',
      description: 'Analyze how much water is used and wasted across various fields, societies, and industrial facilities with detailed reports.',
      icon: 'Activity',
      image: '/src/assets/about/about-journey-water-infrastructure.webp',
      order: 4,
      isActive: true,
      pillarKeys: [],
    },
    {
      key: 'Water Credits',
      displayLabel: 'Water Credits (In Development)',
      slug: 'water-credits',
      description: 'An application concept where users earn reward coins based on water consumed under prescribed guidelines.',
      icon: 'Award',
      image: '/src/assets/about/about-real-time-analytics.webp',
      order: 5,
      isActive: true,
      pillarKeys: [],
    },
    {
      key: 'Leak Identification',
      displayLabel: 'Leak Identification & Reporting',
      slug: 'leak-identification',
      description: 'Detect and localize tap leaks, seepages, pipe leaks, and overhead tank overflows before severe losses occur.',
      icon: 'Search',
      image: '/src/assets/about/about-industrial-water-system.webp',
      order: 6,
      isActive: true,
      pillarKeys: [],
    },
  ];

  const solutionsData = [
    {
      id: 'sol-aqua-saver',
      slug: 'aqua-saver',
      title: 'Aqua Saver',
      tagline: 'Water Conservative Device & 3D-Module',
      description: 'Our core water conservation device and working 3D-Module, engineered to monitor water networks, detect leakages, and enforce appropriate water usage rules.',
      categoryKey: 'Aqua Saver',
      pillar: 'Core Solution',
      icon: 'Cpu',
      image: '/src/assets/about/about-field-verification.webp',
      features: ['Aqua Saver Device', 'Aqua Saver 3D-Module', 'Hardware & Software Combination', 'Flow & Leakage Surveillance'],
      order: 1,
      isActive: true,
      detail: {
        badge: 'CORE CONSERVATION SOLUTION',
        tagline: {
          line1: 'Every Drop Measured.',
          line2: 'Every Litre Accounted.',
          line3: 'Absolute Balance.',
        },
        heroDescription: 'End unaccounted water loss and billing disputes with Aqua Saver. Veenero brings metering, reconciliation, and cost visibility together — so every litre can be traced, verified, and governed.',
        heroPills: ['Aqua Saver 3D-Module', 'Hardware & Software', 'WE Hub POC Certified'],
        heroImage: '/src/assets/about/about-field-verification.webp',
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Complete Transparency.',
          highlightTitle: 'Uncompromising Governance.',
          description: 'Aqua Saver is our flagship water conservative device and 3D-Module. It combines precision hardware monitoring with intelligent software to identify leakages across taps, pipes, and tanks and ensure appropriate water management.',
          blocks: [
            { title: 'Flow Monitoring', description: 'Real-time telemetry measuring volumetric water movement.', icon: 'Activity' },
            { title: 'Leak Detection', description: 'Immediate identification of tap leaks, seepages, and overflows.', icon: 'Search' },
            { title: 'Usage Rules', description: 'Enforcing appropriate water management systems across networks.', icon: 'ShieldCheck' },
            { title: 'Informatics Reporting', description: 'Comprehensive analysis of water utilized versus wasted.', icon: 'FileText' },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Engineered for Water Security',
          description: 'Key functions delivered by the Aqua Saver conservative device and working 3D-Module.',
          items: [
            { icon: 'Cpu', title: 'Aqua Saver 3D-Module', description: 'Unique device manufacturing method delivering specialized conservation with lower market competition.' },
            { icon: 'Search', title: 'Active Leak Pinpointing', description: 'Rapidly detects tap leaks, pipe fissures, seepage, and overhead tank overflows.' },
            { icon: 'SlidersHorizontal', title: 'Automated Controls', description: 'Integrates with motor systems to prevent overflows and dry-run pump damage.' },
            { icon: 'BarChart3', title: 'Usage vs Waste Informatics', description: 'Produces clear reports detailing exactly how much water was utilized and wasted.' },
          ],
        },
        useCases: {
          eyebrow: 'DEPLOYMENT SCENARIOS',
          title: 'Real-World Applications',
          description: 'Where Aqua Saver delivers immediate water conservation and financial returns.',
          items: [
            { title: 'Government & Municipal Water Supply', description: 'Enforcing appropriate water distribution rules and reducing non-revenue water across district networks.', stats: 'Govt Sector', image: '/src/assets/about/about-journey-water-infrastructure.webp' },
            { title: 'Residential Societies & Townships', description: 'Eliminating overhead tank overflows and resolving multi-tenant water consumption disputes.', stats: 'Societies', image: '/src/assets/about/about-industrial-water-system.webp' },
            { title: 'Institutional Campuses & Hostels', description: 'Automating water pumping and monitoring high-volume tap usage across facilities.', stats: 'Institutions', image: '/src/assets/about/about-vision-water-infrastructure.webp' },
            { title: 'Industrial Facilities & Processing Parks', description: 'Detailed process water tracking and leakage identification to prevent resource waste.', stats: 'Industrial', image: '/src/assets/about/about-real-time-analytics.webp' },
          ],
        },
        finalCta: {
          eyebrow: 'NEXT STEPS',
          title: 'Deploy Aqua Saver in Your Network',
          highlightTitle: 'Conserve Every Drop.',
          description: 'Connect with our engineering team to schedule a live demonstration or pilot deployment of Aqua Saver.',
          primaryCtaText: 'Request a Demo',
          secondaryCtaText: 'Talk to an Expert',
        },
      },
    },
    {
      id: 'sol-water-quality',
      slug: 'water-quality-assessment',
      title: 'Water Quality Assessment',
      tagline: 'Evaluate Quality & Ensure Safety',
      description: 'Continuous evaluation of water quality parameters across storage tanks and distribution lines to ensure safe water for human use and sanitation.',
      categoryKey: 'Water Quality',
      pillar: 'Safety & Standards',
      icon: 'Droplets',
      image: '/src/assets/about/about-vision-water-infrastructure.webp',
      features: ['Quality parameter tracking', 'Tank contamination alerts', 'Health & sanitation compliance'],
      order: 2,
      isActive: true,
      detail: {
        badge: 'WATER QUALITY & SAFETY',
        tagline: {
          line1: 'Safe Water Verified.',
          line2: 'Every Source Protected.',
          line3: 'Clean & Sanitized.',
        },
        heroDescription: 'Evaluate water quality across distribution lines and storage tanks to safeguard health and eliminate contamination hazards.',
        heroPills: ['Quality Evaluation', 'Sanitation Standards', 'Tank Surveillance'],
        heroImage: '/src/assets/about/about-vision-water-infrastructure.webp',
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Quality Assessment.',
          highlightTitle: 'Verified Cleanliness.',
          description: 'Unsafe water leads to severe health consequences. Our solution provides continuous water quality evaluation across overhead tanks and pipelines to ensure compliance with health standards.',
          blocks: [
            { title: 'Parameter Tracking', description: 'Monitoring key water quality indicators.', icon: 'Activity' },
            { title: 'Contamination Alerts', description: 'Instant notification if quality falls below threshold.', icon: 'AlertTriangle' },
            { title: 'Tank Cleanliness', description: 'Surveillance of overhead tanks and storage assets.', icon: 'ShieldCheck' },
            { title: 'Compliance Logs', description: 'Audit-ready logs for societies and public facilities.', icon: 'FileText' },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Ensuring Clean, Safe Supplies',
          description: 'Core evaluation features engineered for water safety and sanitation.',
          items: [
            { icon: 'Droplets', title: 'Quality Evaluation', description: 'Assessing physical and chemical indicators across inlet and outlet points.' },
            { icon: 'Shield', title: 'Contamination Safeguard', description: 'Identifies seepage and external contaminant ingress into pipelines.' },
            { icon: 'Radio', title: 'Automated Alerts', description: 'Immediate notification when storage quality deviates from standards.' },
            { icon: 'FileCheck', title: 'Sanitation Reporting', description: 'Clear reports to support community health and sanitation protocols.' },
          ],
        },
        useCases: {
          eyebrow: 'DEPLOYMENT SCENARIOS',
          title: 'Target Environments',
          description: 'Where water quality assessment provides vital public health protection.',
          items: [
            { title: 'Residential Societies', description: 'Ensuring overhead storage tanks remain clean and unpolluted for residents.', stats: 'Societies', image: '/src/assets/about/about-industrial-water-system.webp' },
            { title: 'Educational Institutions & Hostels', description: 'Protecting students from waterborne illnesses caused by stagnant water.', stats: 'Campuses', image: '/src/assets/about/about-vision-water-infrastructure.webp' },
            { title: 'Government Water Facilities', description: 'Regular quality checks across rural and semi-urban distribution pipelines.', stats: 'Govt Supply', image: '/src/assets/about/about-journey-water-infrastructure.webp' },
            { title: 'Food & Commercial Parks', description: 'Maintaining process water cleanliness for food preparation and processing.', stats: 'Commercial', image: '/src/assets/about/about-real-time-analytics.webp' },
          ],
        },
        finalCta: {
          eyebrow: 'NEXT STEPS',
          title: 'Ensure Clean Water Standards',
          highlightTitle: 'Protect Your Community.',
          description: 'Speak with our team to evaluate water quality assessment across your facilities.',
          primaryCtaText: 'Request a Demo',
          secondaryCtaText: 'Talk to an Expert',
        },
      },
    },
    {
      id: 'sol-pumping-automation',
      slug: 'water-pumping-automation',
      title: 'Water Pumping Automation',
      tagline: 'Automated Motor Control & Protection',
      description: 'Intelligent automation to resolve the daily burden of turning motor systems on and off on a regular basis, preventing dry-run damage and tank overflows.',
      categoryKey: 'Pumping Automation',
      pillar: 'Automation',
      icon: 'Sliders',
      image: '/src/assets/about/about-infrastructure-sensor.webp',
      features: ['Automated motor scheduling', 'Dry-run pump protection', 'Tank overflow prevention', 'Energy savings'],
      order: 3,
      isActive: true,
      detail: {
        badge: 'PUMPING AUTOMATION',
        tagline: {
          line1: 'Motors Automated.',
          line2: 'Overflows Eliminated.',
          line3: 'Effortless Control.',
        },
        heroDescription: 'Resolve the daily friction of turning pump motors on and off manually. Our smart automation prevents tank overflows and dry-run pump burnouts.',
        heroPills: ['Motor Scheduling', 'Dry-Run Protection', 'Overflow Elimination'],
        heroImage: '/src/assets/about/about-infrastructure-sensor.webp',
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Intelligent Pumping.',
          highlightTitle: 'Zero Overflows.',
          description: 'Audience feedback highlighted turning on and off motor systems as a major operational pain point. Our automation schedules pumping based on tank water levels, ensuring reliable supply without waste.',
          blocks: [
            { title: 'Auto On/Off', description: 'Automated triggers based on high/low tank water levels.', icon: 'Sliders' },
            { title: 'Dry-Run Safety', description: 'Cuts motor power immediately if source water is unavailable.', icon: 'ShieldCheck' },
            { title: 'Zero Overflows', description: 'Prevents overhead tanks from spilling thousands of liters daily.', icon: 'Droplets' },
            { title: 'Energy Efficiency', description: 'Optimizes running hours to reduce operational electricity bills.', icon: 'Zap' },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Reliable Motor Intelligence',
          description: 'Precision automation features engineered for pumps and overhead tanks.',
          items: [
            { icon: 'Sliders', title: 'Level-Based Switching', description: 'Automatic pump activation when supply drops below minimum threshold.' },
            { icon: 'ShieldCheck', title: 'Dry-Run Protection', description: 'Protects pump motors from burning out when source lines run dry.' },
            { icon: 'TrendingDown', title: 'Overflow Interception', description: 'Instantly stops pumping when overhead tanks reach maximum capacity.' },
            { icon: 'Activity', title: 'Motor Health Monitoring', description: 'Tracks run-time hours and voltage anomalies to predict maintenance needs.' },
          ],
        },
        useCases: {
          eyebrow: 'DEPLOYMENT SCENARIOS',
          title: 'Automation Use Cases',
          description: 'Where pumping automation provides immediate labor and water savings.',
          items: [
            { title: 'Apartment Complexes & Societies', description: 'Completely removes the need for manual guard-operated motor switches.', stats: 'Societies', image: '/src/assets/about/about-industrial-water-system.webp' },
            { title: 'Government Overhead Tanks', description: 'Automating municipal pump stations across village and urban water schemes.', stats: 'Govt Schemes', image: '/src/assets/about/about-journey-water-infrastructure.webp' },
            { title: 'Hospitals & Campuses', description: 'Ensuring uninterrupted 24/7 water availability without human oversight.', stats: 'Institutions', image: '/src/assets/about/about-vision-water-infrastructure.webp' },
            { title: 'Commercial Complexes', description: 'Optimizing pump operating schedules with building energy management.', stats: 'Commercial', image: '/src/assets/about/about-real-time-analytics.webp' },
          ],
        },
        finalCta: {
          eyebrow: 'NEXT STEPS',
          title: 'Automate Your Pumping System',
          highlightTitle: 'Save Water and Power.',
          description: 'Contact our engineering team to implement water pumping automation across your assets.',
          primaryCtaText: 'Request a Demo',
          secondaryCtaText: 'Talk to an Expert',
        },
      },
    },
    {
      id: 'sol-water-tracking',
      slug: 'water-tracking-informatics',
      title: 'Water Tracking & Informatics',
      tagline: 'Comprehensive Usage & Waste Analytics',
      description: 'Analyze precisely how much water is used and wasted across various fields, communities, and industrial facilities with detailed reports.',
      categoryKey: 'Water Tracking',
      pillar: 'Informatics',
      icon: 'Activity',
      image: '/src/assets/about/about-journey-water-infrastructure.webp',
      features: ['Usage volume tracking', 'Wasted water informatics', 'Detailed reporting', 'Sectoral benchmarking'],
      order: 4,
      isActive: true,
      detail: {
        badge: 'USAGE & WASTE INFORMATICS',
        tagline: {
          line1: 'Usage Tracked.',
          line2: 'Waste Quantified.',
          line3: 'Decisions Informed.',
        },
        heroDescription: 'Analyze exactly how much water is used and wasted across various fields, industries, and societies with clear, actionable informatics reports.',
        heroPills: ['Usage Analysis', 'Waste Quantification', 'Actionable Reports'],
        heroImage: '/src/assets/about/about-journey-water-infrastructure.webp',
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Detailed Informatics.',
          highlightTitle: 'Evidence-Based Decisions.',
          description: 'Without accurate tracking, organizations cannot manage what they consume. Our solution provides clear reports on water quantity utilized, wasted, and conserved across your network.',
          blocks: [
            { title: 'Quantity Utilized', description: 'Accurate measurement of water consumed by zone.', icon: 'Activity' },
            { title: 'Quantity Wasted', description: 'Isolating unmetered loss and leakage volume.', icon: 'TrendingDown' },
            { title: 'Conservation Steps', description: 'Actionable guidance on how to reduce consumption.', icon: 'ShieldCheck' },
            { title: 'Detailed Reports', description: 'Structured summaries for governance and budgeting.', icon: 'FileText' },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Turning Data Into Action',
          description: 'Advanced informatics features that illuminate water utilization patterns.',
          items: [
            { icon: 'Activity', title: 'Real-Time Telemetry', description: 'Captures consumption data across distribution points and tanks.' },
            { icon: 'TrendingDown', title: 'Waste Quantification', description: 'Calculates the volume and monetary cost of unmetered water losses.' },
            { icon: 'FileText', title: 'Automated Reporting', description: 'Generates detailed reports for facility managers, societies, and boards.' },
            { icon: 'Compass', title: 'Sectoral Analysis', description: 'Compares consumption against typical benchmarks across fields.' },
          ],
        },
        useCases: {
          eyebrow: 'DEPLOYMENT SCENARIOS',
          title: 'Informatics in Action',
          description: 'Where usage and waste tracking deliver immediate governance value.',
          items: [
            { title: 'Municipal Water Boards', description: 'Tracking bulk intake against distribution to identify district loss.', stats: 'Municipal', image: '/src/assets/about/about-journey-water-infrastructure.webp' },
            { title: 'Multi-Tenant Commercial Real Estate', description: 'Attributing exact usage to each tenant or operational facility.', stats: 'Commercial', image: '/src/assets/about/about-industrial-water-system.webp' },
            { title: 'Educational & Public Townships', description: 'Establishing water consumption baselines and tracking conservation progress.', stats: 'Townships', image: '/src/assets/about/about-vision-water-infrastructure.webp' },
            { title: 'Agricultural & Industrial Sites', description: 'Analyzing water distribution across irrigation zones and processing lines.', stats: 'Industry', image: '/src/assets/about/about-real-time-analytics.webp' },
          ],
        },
        finalCta: {
          eyebrow: 'NEXT STEPS',
          title: 'Gain Complete Water Visibility',
          highlightTitle: 'Track Usage & Eliminate Waste.',
          description: 'Request a demo to see how our water tracking informatics transform operations.',
          primaryCtaText: 'Request a Demo',
          secondaryCtaText: 'Talk to an Expert',
        },
      },
    },
    {
      id: 'sol-water-credits',
      slug: 'water-credits',
      title: 'Water Credits',
      tagline: 'Incentivizing Conservation (In Development)',
      description: 'An innovative application feature concept where users earn reward coins based on how much water they consume, prescribed under conservation guidelines.',
      categoryKey: 'Water Credits',
      pillar: 'Incentives',
      icon: 'Award',
      image: '/src/assets/about/about-real-time-analytics.webp',
      features: ['Conservation coin rewards', 'Prescribed usage guidelines', 'Community leaderboards', 'In development concept'],
      order: 5,
      isActive: true,
      detail: {
        badge: 'INCENTIVE MECHANISM · IN DEVELOPMENT',
        tagline: {
          line1: 'Conservation Rewarded.',
          line2: 'Every Litre Valued.',
          line3: 'Sustainable Habits.',
        },
        heroDescription: 'An application concept where users earn reward coins based on water conserved under prescribed guidelines. Note: This software feature is currently in development.',
        heroPills: ['Water Credit Concept', 'Coin Rewards', 'In Development'],
        heroImage: '/src/assets/about/about-real-time-analytics.webp',
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Rewarding Conservation.',
          highlightTitle: 'Behavioral Impact.',
          description: 'The Aqua application concept includes a Water Credit feature where users earn coins by maintaining water consumption below prescribed guidelines. This feature is in active development to incentivize community conservation.',
          blocks: [
            { title: 'Prescribed Guidelines', description: 'Fair usage benchmarks tailored to family or facility size.', icon: 'Sliders' },
            { title: 'Coin Rewards', description: 'Earn virtual water credits when conserving below targets.', icon: 'Award' },
            { title: 'Community Awareness', description: 'Fostering conservation pride and friendly benchmarks.', icon: 'Users' },
            { title: 'In Development', description: 'Software concept currently under engineering and testing.', icon: 'Clock' },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Incentivizing Stewardship',
          description: 'Core concepts powering the Water Credits application module.',
          items: [
            { icon: 'Award', title: 'Coin Allocation Engine', description: 'Calculates credits earned based on verified water meter data.' },
            { icon: 'SlidersHorizontal', title: 'Dynamic Guidelines', description: 'Adapts conservation targets to seasonal and regional water availability.' },
            { icon: 'Activity', title: 'Savings Visualization', description: 'Shows users their cumulative water savings translated into impact metrics.' },
            { icon: 'Sparkles', title: 'Future Ecosystem', description: 'Envisioned integration with municipal rebates and utility benefits.' },
          ],
        },
        useCases: {
          eyebrow: 'DEPLOYMENT SCENARIOS',
          title: 'Envisioned Environments',
          description: 'Where water credits will foster community conservation culture.',
          items: [
            { title: 'Smart Residential Townships', description: 'Gamifying water conservation across apartments and society residents.', stats: 'Societies', image: '/src/assets/about/about-industrial-water-system.webp' },
            { title: 'Colleges & University Campuses', description: 'Motivating students and campus departments to reduce daily water footprints.', stats: 'Campuses', image: '/src/assets/about/about-vision-water-infrastructure.webp' },
            { title: 'Corporate Facilities', description: 'Incentivizing floor-level and department-level conservation participation.', stats: 'Corporate', image: '/src/assets/about/about-journey-water-infrastructure.webp' },
            { title: 'Municipal Initiatives', description: 'Partnering with city water boards to reward water-conscious households.', stats: 'Municipal', image: '/src/assets/about/about-real-time-analytics.webp' },
          ],
        },
        finalCta: {
          eyebrow: 'NEXT STEPS',
          title: 'Explore the Water Credits Concept',
          highlightTitle: 'Join Our Pilot Testing.',
          description: 'Connect with us if your organization is interested in piloting the water credits concept.',
          primaryCtaText: 'Request a Demo',
          secondaryCtaText: 'Talk to an Expert',
        },
      },
    },
    {
      id: 'sol-leak-identification',
      slug: 'leak-identification',
      title: 'Leak Identification & Reporting',
      tagline: 'Locate Tap, Pipe, Tank & Seepage Leaks',
      description: 'Pinpoint leakage points across taps, pipelines, seepages, and overhead storage tanks, evaluate leak severity, and resolve water waste.',
      categoryKey: 'Leak Identification',
      pillar: 'Loss Prevention',
      icon: 'Search',
      image: '/src/assets/about/about-industrial-water-system.webp',
      features: ['Tap leak detection', 'Seepage identification', 'Pipe break alerts', 'Tank overflow resolution'],
      order: 6,
      isActive: true,
      detail: {
        badge: 'LEAK IDENTIFICATION & RESOLUTION',
        tagline: {
          line1: 'Leaks Located.',
          line2: 'Seepage Stopped.',
          line3: 'Waste Prevented.',
        },
        heroDescription: 'Identify leak points, characterize volumetric loss, and resolve tap leaks, seepages, pipe breaks, and tank overflows with detailed actionable reports.',
        heroPills: ['4 Common Leak Areas', 'Volume Characterization', 'Actionable Reports'],
        heroImage: '/src/assets/about/about-industrial-water-system.webp',
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Pinpoint Detection.',
          highlightTitle: 'Fast Resolution.',
          description: 'Around 30% of water is lost to leaks in overhead tanks, pipes, and taps. Our solution identifies leakage anomalies, characterizes severity, and delivers clear steps to resolve the leak immediately.',
          blocks: [
            { title: 'Tap Leaks', description: 'Detecting continuous minor tap drips and faulty fixtures.', icon: 'Droplets' },
            { title: 'Seepage Detection', description: 'Isolating underground and structural moisture losses.', icon: 'Search' },
            { title: 'Pipe Leaks', description: 'Pinpointing pressure drops and transmission line ruptures.', icon: 'AlertTriangle' },
            { title: 'Tank Overflows', description: 'Preventing overhead reservoir spillage and float-valve failures.', icon: 'ShieldCheck' },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Comprehensive Leak Surveillance',
          description: 'Advanced capabilities designed to stop water waste at the source.',
          items: [
            { icon: 'Search', title: 'Pinpoint Identification', description: 'Algorithm flags abnormal flow patterns indicating hidden leaks.' },
            { icon: 'Activity', title: 'Leak Characterization', description: 'Calculates the volume loss rate and severity of the identified leak.' },
            { icon: 'FileText', title: 'Maintenance Reporting', description: 'Provides maintenance teams with precise location and repair instructions.' },
            { icon: 'CheckCircle2', title: 'Post-Repair Verification', description: 'Confirms that the leak was fully resolved and flow restored to baseline.' },
          ],
        },
        useCases: {
          eyebrow: 'DEPLOYMENT SCENARIOS',
          title: 'Stopping Leaks Everywhere',
          description: 'Key environments where leak identification saves thousands of liters daily.',
          items: [
            { title: 'Overhead Tank Networks', description: 'Eliminating silent float valve failures and overflow spillage in societies.', stats: 'Tanks', image: '/src/assets/about/about-journey-water-infrastructure.webp' },
            { title: 'Underground Supply Mains', description: 'Locating hidden seepages and pipe fractures before sinkholes develop.', stats: 'Pipes', image: '/src/assets/about/about-industrial-water-system.webp' },
            { title: 'Commercial Restrooms & Facilities', description: 'Detecting running flush valves and dripping taps across large campuses.', stats: 'Fixtures', image: '/src/assets/about/about-vision-water-infrastructure.webp' },
            { title: 'Industrial Coolant & Process Loops', description: 'Preventing chemical and process water loss in industrial parks.', stats: 'Industrial', image: '/src/assets/about/about-real-time-analytics.webp' },
          ],
        },
        finalCta: {
          eyebrow: 'NEXT STEPS',
          title: 'Stop Avoidable Water Loss Today',
          highlightTitle: 'Identify & Resolve Leaks.',
          description: 'Contact Veenero to deploy leak identification and reporting across your network.',
          primaryCtaText: 'Request a Demo',
          secondaryCtaText: 'Talk to an Expert',
        },
      },
    },
  ];

  // Also include compatibility aliases so previous URLs (water-accountability, water-visibility, etc.) continue to work
  const aliasMap = {
    'water-accountability': solutionsData[0], // Aqua Saver
    'water-visibility': solutionsData[3], // Water Tracking
    'operational-intelligence': solutionsData[2], // Pumping Automation
    'water-verification': solutionsData[1], // Water Quality
    'analytics-insights': solutionsData[5], // Leak Identification
  };

  const allSolutionsList = [...solutionsData];
  for (const [aliasSlug, original] of Object.entries(aliasMap)) {
    allSolutionsList.push({
      ...original,
      id: `sol-${aliasSlug}`,
      slug: aliasSlug,
    });
  }

  await SolutionsPageSettings.findOneAndUpdate(
    {},
    {
      $set: {
        hero: {
          visible: true,
          eyebrow: 'VEENERO SOLUTION SUITE',
          title: 'Water Conservative Devices & Software',
          highlightedText: 'Aqua Saver',
          description: 'Veenero Sustainable Solutions works on water management and conservation through a combination of hardware/device-based solutions and intelligent software.',
          primaryCtaText: 'Request a Demo',
          primaryCtaLink: '#solutions-grid',
          secondaryCtaText: 'Talk to an Expert',
          secondaryCtaLink: '/contact',
          image: '/src/assets/solutions/solutions-hero-background.png',
          imageAlt: 'Aqua Saver water conservation infrastructure',
          badges: [
            { icon: 'Cpu', label1: 'Aqua Saver', label2: '3D-Module' },
            { icon: 'ShieldCheck', label1: 'Hardware & Software', label2: 'Conservation' },
          ],
          statsWidgets: {
            flowRate: { title: 'Daily Waste Target', value: '49B L', unit: 'India Daily', trend: 'Priority' },
            systemHealth: { title: 'Conservation Device', value: 'Aqua Saver', status: 'Active' },
            activeAlerts: { title: 'Core Focus', count: 'Zero Leaks', ctaText: 'Explore', ctaLink: '#solutions-grid' },
          },
        },
        intro: {
          visible: true,
          eyebrow: 'FOUNDATIONAL ARCHITECTURE',
          title: 'Addressing the Root Causes of Water Waste',
          highlightedText: 'With Devices & Software',
          paragraphs: [
            'We are from a village background, and we have seen precisely how many liters of water are wasted every day as a result of leaks in overhead tanks, pipelines, and taps.',
            'After conducting a thorough analysis of the issue, we discovered that there are no appropriate water management systems or water usage rules.',
            'Veenero provides water conservative devices (Aqua Saver) and software to enforce appropriate water management, reduce water waste, and ensure future water security across government and residential societies.',
          ],
          image: '/src/assets/about/about-journey-water-infrastructure.webp',
          badges: [
            { icon: 'CheckCircle2', label: 'WE Hub Telangana POC Certified' },
            { icon: 'Award', label: 'Intinta Innovator Award Winner' },
          ],
        },
        gridHeader: {
          eyebrow: 'CORE PORTFOLIO',
          title: 'Water Conservation Solutions',
          description: 'Practical devices and intelligent software designed to solve real-world water management problems.',
          calloutCard: {
            title: 'Aqua Saver 3D-Module',
            subtitle: 'Hardware & Software Integration',
            description: 'Our working module analyzes how much water is used and wasted and delivers detailed actionable reports.',
            ctaText: 'Inquire Now',
            ctaLink: '/contact',
            image: '/src/assets/about/about-industrial-water-system.webp',
          },
        },
        categories: categoriesData,
        solutions: allSolutionsList,
        featuredSolution: {
          visible: true,
          eyebrow: 'CORE SOLUTION',
          title: 'Aqua Saver & 3D-Module',
          highlightedText: 'Practical Water Conservation',
          subtitle: 'Hardware-driven conservation backed by software algorithms',
          description: 'The Aqua Saver device is positioned around solving leakage-related problems and analyzing water usage and waste across various fields and industries.',
          ctaText: 'Request a Demo',
          ctaLink: '/contact',
          image: '/src/assets/about/about-field-verification.webp',
          capabilities: [
            { title: 'Leak Detection', desc: 'Pinpointing tap, seepage, pipe, and tank leaks' },
            { title: 'Automated Control', desc: 'Pumping automation and motor control' },
            { title: 'Usage Informatics', desc: 'Tracking utilization vs waste volume' },
          ],
        },
        flow: {
          visible: true,
          eyebrow: 'PROCESS & WORKING',
          title: '6-Step Working Module',
          description: 'From setup to resolution with software algorithm integration.',
          stages: [
            { number: '01', icon: 'Cpu', title: 'Setting Up', description: 'Deploying the Aqua Saver device and 3D-Module.' },
            { number: '02', icon: 'Activity', title: 'Monitoring', description: 'Continuous surveillance of pipeline network.' },
            { number: '03', icon: 'Database', title: 'Collection', description: 'Data streaming into the water application.' },
            { number: '04', icon: 'Search', title: 'Identification', description: 'Locating leaks in taps, pipes, and tanks.' },
            { number: '05', icon: 'Layers', title: 'Characteristics', description: 'Evaluating leak severity and volume loss.' },
            { number: '06', icon: 'CheckCircle2', title: 'Resolving', description: 'Actionable repair and conservation verification.' },
          ],
          layers: [
            {
              number: '01',
              title: 'Device Layer',
              subtitle: 'Aqua Saver & 3D-Module',
              description: 'Physical water conservative devices deployed on supply lines and storage tanks.',
              icon: 'Cpu',
              capabilities: ['Flow sensing', 'Leak monitoring', 'Motor switching'],
            },
            {
              number: '02',
              title: 'Software Algorithm Layer',
              subtitle: 'Data & Analytics',
              description: 'Software algorithms that analyze quantity utilized, quality utilized, and generate reports.',
              icon: 'Activity',
              capabilities: ['Structural planning', 'Leak overview', 'Usage informatics', 'Water credits concept'],
            },
          ],
        },
        cta: {
          visible: true,
          eyebrow: 'TAKE ACTION',
          title: 'Start Conserving Water with Aqua Saver',
          highlightedText: 'Contact Veenero Today',
          description: 'Connect with our team to discuss pilot deployments, municipal partnerships, or society installations.',
          primaryButtonText: 'Request a Demo',
          primaryButtonLink: '/contact',
          secondaryButtonText: 'Talk to an Expert',
          secondaryButtonLink: '/contact',
        },
        seo: {
          metaTitle: 'Water Conservative Devices & Software | Veenero Solutions',
          metaDescription: 'Explore Aqua Saver, 3D-Module, and Veenero software solutions for water management and conservation.',
        },
        isPublished: true,
      },
    },
    { upsert: true, new: true }
  );

  // ── 4. IMPACT PAGE SETTINGS ────────────────────────────────────────────────
  await ImpactPageSettingsModel.findOneAndUpdate(
    {},
    {
      $set: {
        hero: {
          visible: true,
          eyebrow: 'THE REAL WATER PROBLEM',
          title: 'Addressing 49 Billion Liters of Daily Water Waste',
          description: 'India wastes 49 billion liters of water daily while 600 million people face severe water crisis. Veenero provides practical devices and software to eliminate leaks and build water security.',
          primaryCtaText: 'Our Impact',
          secondaryCtaText: 'View Statistics',
          image: '/src/assets/about/about-journey-water-infrastructure.webp',
        },
        outcomes: {
          visible: true,
          eyebrow: 'SUPPORTED FACTS & RESEARCH',
          title: 'The Realities Driving Veenero',
          description: 'Every figure below is supported by documented research and public references.',
          pillars: [
            {
              value: '49B Liters',
              label: 'Daily Waste in India',
              description: 'Equivalent to 48.42 billion one-liter bottles lost daily. 600 million people face water crisis. (Ref: neerain.com)',
              icon: 'Droplets',
              tag: 'National Challenge',
            },
            {
              value: '30%',
              label: 'Global Supply Lost',
              description: 'Around 2.1 trillion gallons of water wasted each year due to leaks and inefficient usage. (Ref: gitnux.org)',
              icon: 'Globe',
              tag: 'Global Loss',
            },
            {
              value: '297,000',
              label: 'Child Deaths Yearly',
              sublabel: 'Under-five children dying from diarrheal disease from poor sanitation and unsafe water. (Ref: WHO/UNICEF 2019)',
              description: 'Children under five dying annually from diarrheal diseases due to poor sanitation and unsafe drinking water. (Ref: WHO/UNICEF 2019)',
              icon: 'AlertTriangle',
              tag: 'Health Impact',
            },
            {
              value: '4 Areas',
              label: 'Common Problem Areas',
              description: 'Targeted solutions for Tap Leaks, Seepage, Pipe Leaks, and Tank Overflows.',
              icon: 'ShieldCheck',
              tag: 'Target Focus',
            },
          ],
        },
        storyline: {
          visible: true,
          eyebrow: 'WORKING MODULE ROADMAP',
          title: 'From Identification to Resolution',
          description: 'Our structured 6-step conservation process.',
          steps: [
            { number: '01', stage: 'Setup', title: 'Setting up the Aqua Saver', description: 'Deploying the Aqua Saver device and 3D-Module.', outcome: 'Device Active', icon: 'Cpu' },
            { number: '02', stage: 'Monitor', title: 'Monitoring the System', description: 'Surveillance of pipelines and pump motors.', outcome: 'Continuous Feed', icon: 'Activity' },
            { number: '03', stage: 'Collect', title: 'Collection of Data', description: 'Feeding telemetry into the water application.', outcome: 'Usage Informatics', icon: 'Database' },
            { number: '04', stage: 'Detect', title: 'Identification of Leakage', description: 'Pinpointing tap, seepage, pipe, and tank leaks.', outcome: 'Anomalies Isolated', icon: 'Search' },
            { number: '05', stage: 'Evaluate', title: 'Identifying Characteristics', description: 'Assessing leak severity and flow rate.', outcome: 'Severity Ranked', icon: 'Layers' },
            { number: '06', stage: 'Resolve', title: 'Resolving the Leak', description: 'Maintenance guidance and conservation verification.', outcome: 'Water Saved', icon: 'CheckCircle2' },
          ],
        },
        ecosystem: {
          visible: true,
          eyebrow: 'RECOGNITIONS & ACHIEVEMENTS',
          title: 'Validated Across State & National Forums',
          description: 'Achievements and evaluations received by Veenero Sustainable Solutions.',
          domains: [
            {
              title: 'WE Hub, Government of Telangana',
              icon: 'Award',
              description: 'Received official Proof-of-Concept (POC) certification from WE Hub, Government of Telangana.',
              impactPoints: ['Official POC certification', 'Evaluated by state incubation body', 'Validated conservation methodology'],
            },
            {
              title: 'Intinta Innovator Award',
              icon: 'CheckCircle2',
              description: 'Aqua Saver awarded the Intinta Innovator Award for two consecutive years at district level.',
              impactPoints: ['Two consecutive years winner', 'District innovation leadership', 'Grassroots impact recognition'],
            },
            {
              title: 'National Innovation Challenge',
              icon: 'Globe',
              description: 'Participated in the National Innovation Challenge held at PIET College, Haryana.',
              impactPoints: ['National-level challenge', 'Engineering review', 'Multi-state exposure'],
            },
            {
              title: 'Leadership Recognition',
              icon: 'ShieldCheck',
              description: 'Gratitude and recognition mention involving Sir Ashok Gehlot, Chief Minister of Rajasthan.',
              impactPoints: ['State leadership acknowledgment', 'Focus on water conservation', 'Encouragement for deployment'],
            },
          ],
          quote: {
            text: 'Got POC certification from WE Hub, Government of Telangana. Aqua Saver got Intinta Innovator Award for two consecutive years at district level.',
            author: 'Veenero Sustainable Solutions',
            role: 'Official Achievements',
            organization: 'WE Hub & District Administration',
          },
        },
        sustainability: {
          visible: true,
          eyebrow: 'BUSINESS & CONSUMER MODEL',
          title: 'Target Consumers & Engagement Model',
          description: 'Delivering sustainable value to public institutions and community living.',
          pillars: [
            { title: 'Target Consumers', description: 'Serving Government bodies and residential Societies to eliminate water loss.' },
            { title: 'Product Delivery', description: 'Direct delivery and installation of Aqua Saver devices and 3D-Modules.' },
            { title: 'Recurring Payment & Service', description: 'Predictable service models and charges depending upon size and facility requirements.' },
          ],
        },
        cta: {
          visible: true,
          title: 'Join Our Mission to Conserve India Water',
          description: 'Contact Veenero Sustainable Solutions Pvt Ltd to partner with us or schedule a product demonstration.',
          primaryButtonText: 'Request a Demo',
          primaryButtonLink: '/contact',
          secondaryButtonText: 'Talk to an Expert',
          secondaryButtonLink: '/contact',
        },
        seo: {
          metaTitle: 'Impact & Facts | Veenero Sustainable Solutions',
          metaDescription: 'Addressing 49 billion liters of daily water waste in India. POC certified by WE Hub Telangana, Intinta Innovator Award winner.',
        },
      },
    },
    { upsert: true, new: true }
  );

  // ── 5. CONTACT PAGE SETTINGS ───────────────────────────────────────────────
  await ContactPageSettingsModel.findOneAndUpdate(
    {},
    {
      $set: {
        hero: {
          visible: true,
          eyebrow: 'VEENERO SUSTAINABLE SOLUTIONS PVT LTD',
          title: 'Get in Touch with Our Team',
          description: 'Reach out to discuss Aqua Saver demonstrations, society installations, or municipal partnerships. We respond to every inquiry.',
          primaryCtaText: 'Send an Inquiry',
          secondaryCtaText: 'Call Us',
        },
        contactInfo: {
          visible: true,
          eyebrow: 'COMPANY CONTACT INFORMATION',
          title: 'Direct Contact Details',
          description: 'Official correspondence and inquiries for Veenero Sustainable Solutions Pvt Ltd.',
          items: [
            {
              iconName: 'Mail',
              label: 'General Inquiries',
              value: 'info@veenerosolutions.com',
              href: 'mailto:info@veenerosolutions.com',
              note: 'Official company inbox',
            },
            {
              iconName: 'Mail',
              label: 'Founder & Leadership',
              value: 'udaygedam@veenerosolutions.com',
              href: 'mailto:udaygedam@veenerosolutions.com',
              note: 'Direct leadership communication',
            },
            {
              iconName: 'Globe',
              label: 'Official Website',
              value: 'www.veenerosolutions.com',
              href: 'https://www.veenerosolutions.com',
              note: 'Company online portal',
            },
            {
              iconName: 'Phone',
              label: 'Telephone Contact',
              value: '+91 9346517202',
              href: 'tel:+919346517202',
              note: 'Direct phone support',
            },
            {
              iconName: 'MapPin',
              label: 'Registered Office',
              value: 'Veenero Sustainable Solutions Pvt Ltd, Adilabad, Telangana 504001',
              note: 'Headquarters',
            },
          ],
        },
        demoCard: {
          visible: true,
          badge: 'AQUA SAVER DEMO',
          title: 'Request an Aqua Saver Demonstration',
          description: 'Experience how our water conservative device and 3D-Module track water usage, automate pumping, and identify leaks.',
          bulletPoints: [
            'Live walkthrough of Aqua Saver conservative device',
            'Discussion on tap, pipe, tank, and seepage leak identification',
            'Review of automated water pumping and usage reports',
          ],
          buttonText: 'Request Demo',
        },
        form: {
          visible: true,
          title: 'Send Us a Message',
          subtitle: 'Fill in your requirements below and our team will get back to you within 24 hours.',
          inquiryTypes: [
            { id: 'demo', label: 'Request a Demo of Aqua Saver' },
            { id: 'partnership', label: 'Government / Society Partnership' },
            { id: 'general', label: 'General Inquiry' },
          ],
          submitButtonText: 'Submit Inquiry',
          successTitle: 'Inquiry Received',
          successMessage: 'Thank you for reaching out to Veenero Sustainable Solutions. Our team will contact you shortly.',
        },
        cta: {
          visible: true,
          title: 'Let Work Together for Water Security',
          description: 'Every drop conserved today protects communities and future generations.',
          primaryButtonText: 'Request a Demo',
          primaryButtonLink: '#contact-form',
          secondaryButtonText: 'About Our Story',
          secondaryButtonLink: '/about',
        },
        seo: {
          metaTitle: 'Contact Us | Veenero Sustainable Solutions Pvt Ltd',
          metaDescription: 'Get in touch with Veenero Sustainable Solutions Pvt Ltd. Email info@veenerosolutions.com or udaygedam@veenerosolutions.com.',
        },
      },
    },
    { upsert: true, new: true }
  );

  // ── 6. FOOTER SETTINGS ────────────────────────────────────────────────────
  await FooterSettingsModel.findOneAndUpdate(
    {},
    {
      $set: {
        description: 'Veenero Sustainable Solutions Pvt Ltd — Dedicated to appropriate water management, reducing water waste, and ensuring future water security through conservative devices and intelligent software.',
        address: 'Veenero Sustainable Solutions Pvt Ltd, Adilabad, Telangana 504001',
        mobile: '+91 9346517202',
        email: 'info@veenerosolutions.com',
        copyrightText: '© {year} Veenero Sustainable Solutions Pvt Ltd. All rights reserved.',
        googleRating: {
          rating: 'POC Certified',
          reviewsCount: 'WE Hub Telangana & Intinta Innovator Award Winner',
          href: '/impact',
        },
        links: {
          solutions: [
            { label: 'Aqua Saver (Core)', href: '/solutions/aqua-saver' },
            { label: 'Water Quality Assessment', href: '/solutions/water-quality-assessment' },
            { label: 'Water Pumping Automation', href: '/solutions/water-pumping-automation' },
            { label: 'Water Tracking & Informatics', href: '/solutions/water-tracking-informatics' },
            { label: 'Water Credits (In Dev)', href: '/solutions/water-credits' },
            { label: 'Leak Identification', href: '/solutions/leak-identification' },
          ],
          company: [
            { label: 'About Veenero', href: '/about' },
            { label: 'Our Village Origin', href: '/about#our-story' },
            { label: 'Process & Working', href: '/approach' },
            { label: 'Impact & Facts', href: '/impact' },
            { label: 'Contact Us', href: '/contact' },
          ],
          resources: [
            { label: 'WE Hub POC Certification', href: '/impact' },
            { label: 'Intinta Innovator Award', href: '/impact' },
            { label: 'National Innovation Challenge', href: '/impact' },
            { label: 'Blog & Insights', href: '/blog' },
          ],
        },
        socialLinks: [
          { iconName: 'Mail', href: 'mailto:info@veenerosolutions.com', label: 'Email Info' },
          { iconName: 'Mail', href: 'mailto:udaygedam@veenerosolutions.com', label: 'Email Founder' },
          { iconName: 'Globe', href: 'https://www.veenerosolutions.com', label: 'Website' },
        ],
      },
    },
    { upsert: true, new: true }
  );

  console.log('[Seed] Veenero authentic source content synchronized successfully.');
}

const ABOUT_MEDIA_SEED: Array<{
  seedKey:          string;
  page:             string;
  section:          string;
  slot:             string;
  description:      string;
  displayName:      string;
  altText:          string;
  originalFilename: string;
  resourceType:     'image' | 'video';
  format:           string;
  bytes:            number;
  width?:           number;
  height?:          number;
  duration?:        number;
  tags:             string[];
  // For locally-bundled assets, secureUrl is a placeholder path.
  // Replace with the real Cloudinary URL after uploading through Media Library.
  secureUrl:        string;
}> = [
  // ── 01 HERO SECTION ────────────────────────────────────────────────────
  {
    seedKey:          'ABOUT|HERO|HERO_VISUAL',
    page:             'about',
    section:          'Hero Section',
    slot:             'Hero Visual',
    description:      'Full-width hero image for the About page. Water infrastructure landscape used as the primary editorial visual.',
    displayName:      'About Hero — Water Infrastructure',
    altText:          'Veenero Water Intelligence Infrastructure — telemetry network and verification platform',
    originalFilename: 'about-hero-water-infrastructure.png',
    resourceType:     'image',
    format:           'png',
    bytes:            2286464,
    width:            2400,
    height:           1600,
    tags:             ['about', 'hero', 'water-infrastructure'],
    secureUrl:        '/src/assets/about/about-hero-water-infrastructure.png',
  },

  // ── 02 OUR STORY & ORIGIN ──────────────────────────────────────────────
  {
    seedKey:          'ABOUT|OUR_STORY|STORY_VIDEO',
    page:             'about',
    section:          'Our Story & Origin',
    slot:             'Story Overview Video',
    description:      'Background video shown in the Our Story section. Auto-plays muted; poster is the hero image. Shows real water infrastructure.',
    displayName:      'About Story — Water Infrastructure Video',
    altText:          'Veenero water infrastructure story — real-time telemetry and monitoring system',
    originalFilename: 'about-story-water-infrastructure.mp4',
    resourceType:     'video',
    format:           'mp4',
    bytes:            3161779,
    duration:         30,
    tags:             ['about', 'story', 'video', 'water-infrastructure'],
    secureUrl:        '/src/assets/about/about-story-water-infrastructure.mp4',
  },

  // ── 03 THE PILLARS OF VEENERO ─────────────────────────────────────────
  {
    seedKey:          'ABOUT|PILLARS|PURPOSE_FIRST',
    page:             'about',
    section:          'The Pillars of Veenero',
    slot:             'Purpose First',
    description:      'Pillar card 01 — Purpose First. Water-themed photographic image used as the card visual.',
    displayName:      'Pillars — Purpose First',
    altText:          'Purpose First — Veenero water intelligence pillar',
    originalFilename: 'about-pillar-purpose.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            1946416,
    width:            1920,
    height:           1280,
    tags:             ['about', 'pillars', 'purpose'],
    secureUrl:        '/src/assets/about/about-pillar-purpose.webp',
  },
  {
    seedKey:          'ABOUT|PILLARS|INTEGRITY_ALWAYS',
    page:             'about',
    section:          'The Pillars of Veenero',
    slot:             'Integrity Always',
    description:      'Pillar card 02 — Integrity Always. Water-themed photographic image used as the card visual.',
    displayName:      'Pillars — Integrity Always',
    altText:          'Integrity Always — Veenero core principle',
    originalFilename: 'about-pillar-integrity.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            2200185,
    width:            1920,
    height:           1280,
    tags:             ['about', 'pillars', 'integrity'],
    secureUrl:        '/src/assets/about/about-pillar-integrity.webp',
  },
  {
    seedKey:          'ABOUT|PILLARS|IMPACT_AT_SCALE',
    page:             'about',
    section:          'The Pillars of Veenero',
    slot:             'Impact at Scale',
    description:      'Pillar card 03 — Impact at Scale. Water infrastructure photograph used as the card visual.',
    displayName:      'Pillars — Impact at Scale',
    altText:          'Impact at Scale — Veenero water infrastructure reach',
    originalFilename: 'about-pillar-impact.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            2826176,
    width:            1920,
    height:           1280,
    tags:             ['about', 'pillars', 'impact'],
    secureUrl:        '/src/assets/about/about-pillar-impact.webp',
  },
  {
    seedKey:          'ABOUT|PILLARS|INNOVATION_RELENTLESS',
    page:             'about',
    section:          'The Pillars of Veenero',
    slot:             'Innovation Relentless',
    description:      'Pillar card 04 — Innovation Relentless. Water technology photograph used as the card visual.',
    displayName:      'Pillars — Innovation Relentless',
    altText:          'Innovation Relentless — Veenero technology-driven water management',
    originalFilename: 'about-pillar-innovation.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            2007573,
    width:            1920,
    height:           1280,
    tags:             ['about', 'pillars', 'innovation'],
    secureUrl:        '/src/assets/about/about-pillar-innovation.webp',
  },
  {
    seedKey:          'ABOUT|PILLARS|STRONGER_TOGETHER',
    page:             'about',
    section:          'The Pillars of Veenero',
    slot:             'Stronger Together',
    description:      'Pillar card 05 — Stronger Together. Community and collaboration photograph used as the card visual.',
    displayName:      'Pillars — Stronger Together',
    altText:          'Stronger Together — Veenero community and partnership',
    originalFilename: 'about-pillar-together.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            2270992,
    width:            1920,
    height:           1280,
    tags:             ['about', 'pillars', 'together'],
    secureUrl:        '/src/assets/about/about-pillar-together.webp',
  },

  // ── 04 WHY CHOOSE VEENERO ─────────────────────────────────────────────
  {
    seedKey:          'ABOUT|WHY_VEENERO|END_TO_END',
    page:             'about',
    section:          'Why Choose Veenero',
    slot:             'End-to-End Infrastructure',
    description:      'Card image for the End-to-End Infrastructure differentiator. Shows an infrastructure sensor.',
    displayName:      'Why Veenero — End-to-End Infrastructure',
    altText:          'End-to-End Infrastructure — Veenero telemetry sensor and gateway hardware',
    originalFilename: 'about-infrastructure-sensor.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            56304,
    width:            1200,
    height:           800,
    tags:             ['about', 'why-veenero', 'infrastructure', 'sensor'],
    secureUrl:        '/src/assets/about/about-infrastructure-sensor.webp',
  },
  {
    seedKey:          'ABOUT|WHY_VEENERO|REAL_TIME',
    page:             'about',
    section:          'Why Choose Veenero',
    slot:             'Real-Time Actionability',
    description:      'Card image for the Real-Time Actionability differentiator. Shows analytics dashboard or monitoring system.',
    displayName:      'Why Veenero — Real-Time Actionability',
    altText:          'Real-Time Actionability — Veenero anomaly detection and threshold monitoring',
    originalFilename: 'about-real-time-analytics.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            55352,
    width:            1200,
    height:           800,
    tags:             ['about', 'why-veenero', 'analytics', 'real-time'],
    secureUrl:        '/src/assets/about/about-real-time-analytics.webp',
  },
  {
    seedKey:          'ABOUT|WHY_VEENERO|VERIFICATION',
    page:             'about',
    section:          'Why Choose Veenero',
    slot:             'Verification-Ready Auditing',
    description:      'Card image for the Verification-Ready Auditing differentiator. Shows field verification activity.',
    displayName:      'Why Veenero — Verification-Ready Auditing',
    altText:          'Verification-Ready Auditing — Veenero tamper-resistant audit trails and ESG compliance',
    originalFilename: 'about-field-verification.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            61667,
    width:            1200,
    height:           800,
    tags:             ['about', 'why-veenero', 'verification', 'auditing'],
    secureUrl:        '/src/assets/about/about-field-verification.webp',
  },
  {
    seedKey:          'ABOUT|WHY_VEENERO|OPEN_ECOSYSTEM',
    page:             'about',
    section:          'Why Choose Veenero',
    slot:             'Open & Scalable Ecosystem',
    description:      'Card image for the Open & Scalable Ecosystem differentiator. Shows industrial water system integration.',
    displayName:      'Why Veenero — Open & Scalable Ecosystem',
    altText:          'Open & Scalable Ecosystem — Veenero ERP and SCADA integration for enterprise water management',
    originalFilename: 'about-industrial-water-system.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            70110,
    width:            1200,
    height:           800,
    tags:             ['about', 'why-veenero', 'ecosystem', 'integration'],
    secureUrl:        '/src/assets/about/about-industrial-water-system.webp',
  },

  // ── 05 LEADERSHIP & TEAM ──────────────────────────────────────────────
  {
    seedKey:          'ABOUT|LEADERSHIP|FOUNDING_TEAM',
    page:             'about',
    section:          'Leadership & Team',
    slot:             'Founding Team',
    description:      'Card image for the Founding Team leadership card. Shows team leadership visual.',
    displayName:      'Leadership — Founding Team',
    altText:          'Veenero founding team — leadership and strategy',
    originalFilename: 'about-team-leadership.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            840106,
    width:            1200,
    height:           800,
    tags:             ['about', 'leadership', 'team'],
    secureUrl:        '/src/assets/about/about-team-leadership.webp',
  },
  {
    seedKey:          'ABOUT|LEADERSHIP|EDGE_ENGINEERING',
    page:             'about',
    section:          'Leadership & Team',
    slot:             'Telemetry & Edge Engineering',
    description:      'Card image for the Telemetry & Edge Engineering team card. Reuses the field verification image.',
    displayName:      'Leadership — Telemetry & Edge Engineering',
    altText:          'Veenero telemetry and edge engineering team — IoT systems and hardware',
    originalFilename: 'about-field-verification.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            61667,
    width:            1200,
    height:           800,
    tags:             ['about', 'leadership', 'engineering', 'IoT'],
    secureUrl:        '/src/assets/about/about-field-verification.webp',
  },
  {
    seedKey:          'ABOUT|LEADERSHIP|DATA_SCIENCE',
    page:             'about',
    section:          'Leadership & Team',
    slot:             'Data Science & Cloud Platform',
    description:      'Card image for the Data Science & Cloud Platform team card. Reuses the real-time analytics image.',
    displayName:      'Leadership — Data Science & Cloud Platform',
    altText:          'Veenero data science and cloud platform team — water analytics and AI',
    originalFilename: 'about-real-time-analytics.webp',
    resourceType:     'image',
    format:           'webp',
    bytes:            55352,
    width:            1200,
    height:           800,
    tags:             ['about', 'leadership', 'data-science', 'cloud'],
    secureUrl:        '/src/assets/about/about-real-time-analytics.webp',
  },
];

async function seedAboutMedia(): Promise<void> {
  let inserted = 0;
  let skipped  = 0;

  for (const entry of ABOUT_MEDIA_SEED) {
    try {
      const existing = await MediaModel.findOne({ seedKey: entry.seedKey });
      if (existing) {
        skipped++;
        continue;
      }

      // Use seedKey as stable publicId and assetId for local assets.
      // Once uploaded to Cloudinary, the record should be replaced via Media Library.
      const stableId = `local:${entry.seedKey}`;
      await MediaModel.create({
        assetId:          stableId,
        publicId:         stableId,
        resourceType:     entry.resourceType,
        format:           entry.format,
        secureUrl:        entry.secureUrl,
        width:            entry.width,
        height:           entry.height,
        duration:         entry.duration,
        bytes:            entry.bytes,
        folder:           'veenero/about',
        originalFilename: entry.originalFilename,
        displayName:      entry.displayName,
        altText:          entry.altText,
        tags:             entry.tags,
        page:             entry.page,
        section:          entry.section,
        slot:             entry.slot,
        description:      entry.description,
        seedKey:          entry.seedKey,
        deletedAt:        null,
      });
      inserted++;
    } catch (err: unknown) {
      // Skip duplicate key errors silently (extra safety net)
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        skipped++;
      } else {
        console.error(`[Seed] About media seed error for key ${entry.seedKey}:`, (err as Error).message);
      }
    }
  }

  console.log(`[Seed] About media: ${inserted} inserted, ${skipped} already existed.`);
}

/**
 * Seeds and synchronizes the authentic Veenero Full Stack Developer career opening
 * and Careers page settings.
 * Completely idempotent: updates existing record without creating duplicates.
 */
export async function seedCareers(): Promise<void> {
  console.log('[Seed] Synchronizing Careers and Job Openings...');

  // 1. Seed Career Page Settings
  await CareerPageSettingsModel.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
        hero: {
          visible: true,
          eyebrow: 'CAREERS AT VEENERO',
          title: 'Build the Future of Water Intelligence',
          description: "We are building India's water intelligence platform. Join our mission to make every litre visible, verifiable, and meaningful.",
          primaryCtaText: 'Explore Opportunities',
          secondaryCtaText: 'Hiring Process',
        },
        hiringProcess: {
          visible: true,
          eyebrow: 'HOW WE HIRE',
          title: 'A Fair, Transparent Journey',
          description: 'Our four-stage recruitment process is designed to be rigorous, respectful of your time, and focused on real-world capabilities.',
          steps: [
            {
              num: '01',
              icon: 'Search',
              title: 'Application Review',
              subtitle: 'Screening',
              description: 'We review your background, past work, and experience against our operational goals within 5 business days.',
            },
            {
              num: '02',
              icon: 'PhoneCall',
              title: 'Introductory Conversation',
              subtitle: 'Discovery',
              description: 'A 30-minute discussion covering your domain interests, career goals, and how you align with our mission.',
            },
            {
              num: '03',
              icon: 'Code2',
              title: 'Technical Evaluation',
              subtitle: 'Hands-on',
              description: 'A practical, real-world exercise or architecture review tailored directly to the water-tech problems we solve.',
            },
            {
              num: '04',
              icon: 'Award',
              title: 'Offer & Onboarding',
              subtitle: 'Decision',
              description: 'A transparent offer discussion followed by an immersive onboarding experience into our engineering workflows.',
            },
          ],
        },
        cta: {
          visible: true,
          eyebrow: "DON'T SEE YOUR ROLE?",
          title: 'Send an Open Application',
          description: 'We are always looking for exceptional engineers, IoT hardware specialists, hydrologists, and data scientists. Send us your portfolio and resume.',
          buttonText: 'Submit General Application',
          email: 'careers@veenerosolutions.com',
        },
        seo: {
          metaTitle: 'Careers | Veenero - Build the Future of Water Intelligence',
          metaDescription: 'Explore open engineering, IoT hardware, and data science roles at Veenero Sustainable Solutions Pvt Ltd.',
        },
      },
    },
    { upsert: true, new: true }
  );

  // 2. Seed Full Stack Developer Role
  const seededRole = {
    title: 'Full Stack Developer',
    slug: 'full-stack-developer',
    department: 'Engineering',
    location: 'Hyderabad / Hybrid',
    employmentType: 'Full-time',
    experience: '2-5 Years',
    salaryRange: 'Competitive / Based on Experience',
    shortDescription: "Build and scale Veenero's water telemetry platform, real-time analytics pipelines, and IoT sensor dashboards.",
    description: "As a Full Stack Developer at Veenero Sustainable Solutions, you will play a central role in engineering the digital infrastructure layer for water management and conservation. You will build scalable web applications, real-time IoT monitoring dashboards, and robust backend APIs that ingest streaming telemetry from water flow sensors, pressure monitors, and automated pumping devices across India.",
    responsibilities: [
      'Design, develop, and maintain responsive web applications using React, TypeScript, and TailwindCSS.',
      'Build resilient RESTful and real-time backend microservices using Node.js, Express, and MongoDB.',
      'Architect and optimize telemetry ingestion pipelines handling continuous time-series water flow and pressure data.',
      'Implement interactive data visualization dashboards, analytics charts, and automated alert systems.',
      'Collaborate with embedded systems engineers to integrate IoT hardware gateways and edge device streams.',
      'Write clean, well-tested, documented, and maintainable code adhering to security and performance standards.',
    ],
    requirements: [
      '2+ years of professional full-stack development experience with modern JavaScript / TypeScript.',
      'Strong proficiency in React, state management, component architecture, and responsive design.',
      'Solid experience designing and building RESTful APIs with Node.js and Express.',
      'Hands-on experience with MongoDB / NoSQL databases, indexing, schema design, and query optimization.',
      'Familiarity with IoT data streams, WebSockets, or real-time event-driven architectures.',
      'Proficiency with Git, Docker, CI/CD pipelines, and cloud deployment environments.',
      'Strong problem-solving mindset and a passion for environmental sustainability and water conservation.',
    ],
    niceToHave: [
      'Experience with time-series data storage and aggregation (e.g., InfluxDB, MongoDB Timeseries).',
      'Background in environmental technology, IoT hardware telemetry, or SCADA / smart utility systems.',
      'Experience with data visualization libraries such as Recharts, Chart.js, or D3.',
      'Understanding of cloud infrastructure (AWS / GCP / Cloudinary) and serverless architectures.',
    ],
    qualifications: [
      'B.Tech / B.E. in Computer Science, Information Technology, or equivalent practical experience.',
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'REST APIs', 'Tailwind CSS', 'IoT Telemetry', 'Git'],
    status: 'PUBLISHED' as const,
    isFeatured: true,
    sortOrder: 1,
    publishedAt: new Date(),
    createdBy: 'System',
    updatedBy: 'System',
    deletedAt: null,
  };

  const existing = await CareerModel.findOne({ slug: seededRole.slug });
  if (existing) {
    // If it was marked trashed or needs syncing, update and ensure not deleted
    await CareerModel.findByIdAndUpdate(existing._id, {
      $set: {
        title: seededRole.title,
        department: seededRole.department,
        location: seededRole.location,
        employmentType: seededRole.employmentType,
        experience: seededRole.experience,
        salaryRange: seededRole.salaryRange,
        shortDescription: seededRole.shortDescription,
        description: seededRole.description,
        responsibilities: seededRole.responsibilities,
        requirements: seededRole.requirements,
        niceToHave: seededRole.niceToHave,
        qualifications: seededRole.qualifications,
        skills: seededRole.skills,
        isFeatured: seededRole.isFeatured,
        // Preserve admin-set status if explicitly closed or archived, but if draft or trashed restore to PUBLISHED
        status: existing.status === 'ARCHIVED' || existing.status === 'CLOSED' ? existing.status : 'PUBLISHED',
        deletedAt: null,
      },
    });
    console.log('[Seed] Full Stack Developer role verified and synchronized.');
  } else {
    await CareerModel.create(seededRole);
    console.log('[Seed] Full Stack Developer role seeded successfully.');
  }
}
