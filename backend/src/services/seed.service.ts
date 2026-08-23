import bcrypt from 'bcrypt';
import { CmsPageModel } from '../models/CmsPage';
import { UserModel } from '../models/User';
import { CareerModel } from '../models/Career';
import { BlogPostModel } from '../models/BlogPost';
import { BlogLandingSettingsModel } from '../models/BlogLandingSettings';
import { HomePageSettingsModel } from '../models/HomePageSettings';


const mockPages = [
  {
    _id: 'page-home',
    name: 'Home',
    slug: '/',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Veenero | Intelligent Water Management Platform',
    seoMetaDescription:
      'Veenero is a smart water intelligence platform helping enterprises monitor, optimise, and reduce water consumption across global facilities.',
    seoStatus: 'good',
    lastUpdated: '2026-08-14T10:30:00Z',
    updatedBy: 'Aditya Choubey',
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
    seoMetaTitle: 'About Veenero | Our Mission & Vision',
    seoMetaDescription:
      "Learn about Veenero's mission to transform water management through AI-driven intelligence and sustainable technology solutions.",
    seoStatus: 'good',
    lastUpdated: '2026-08-13T14:20:00Z',
    updatedBy: 'Aditya Choubey',
    isCoreSystemPage: true,
    sections: [
      { id: 's-about-hero', name: 'About Hero', type: 'hero', visible: true },
      { id: 's-mission', name: 'Mission & Vision', type: 'content', visible: true },
      { id: 's-team', name: 'Leadership Team', type: 'gallery', visible: true },
      { id: 's-timeline', name: 'Company Timeline', type: 'content', visible: false },
    ],
  },
  {
    _id: 'page-solutions',
    name: 'Solutions',
    slug: '/solutions',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Water Intelligence Solutions | Veenero',
    seoMetaDescription:
      "Explore Veenero's suite of water management solutions: real-time monitoring, AI analytics, risk management, and efficiency reporting.",
    seoStatus: 'good',
    lastUpdated: '2026-08-12T09:45:00Z',
    updatedBy: 'Aditya Choubey',
    isCoreSystemPage: true,
    sections: [
      { id: 's-solutions-hero', name: 'Solutions Hero', type: 'hero', visible: true },
      { id: 's-monitoring', name: 'Real-Time Monitoring', type: 'content', visible: true },
      { id: 's-analytics', name: 'AI Analytics', type: 'content', visible: true },
      { id: 's-risk', name: 'Risk Management', type: 'content', visible: true },
      { id: 's-reports', name: 'Reports & Exports', type: 'content', visible: true },
    ],
  },
  {
    _id: 'page-industries',
    name: 'Industries',
    slug: '/industries',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Industries We Serve | Veenero Water Intelligence',
    seoMetaDescription:
      'Veenero serves enterprise clients across manufacturing, hospitality, healthcare, data centres, and municipal sectors.',
    seoStatus: 'needs-work',
    lastUpdated: '2026-08-10T16:00:00Z',
    updatedBy: 'Aditya Choubey',
    isCoreSystemPage: true,
    sections: [
      { id: 's-industries-hero', name: 'Industries Hero', type: 'hero', visible: true },
      { id: 's-manufacturing', name: 'Manufacturing', type: 'content', visible: true },
      { id: 's-hospitality', name: 'Hospitality', type: 'content', visible: true },
      { id: 's-healthcare', name: 'Healthcare', type: 'content', visible: true },
      { id: 's-datacenter', name: 'Data Centres', type: 'content', visible: false },
    ],
  },
  {
    _id: 'page-approach',
    name: 'Approach',
    slug: '/approach',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Our Approach | Veenero Methodology',
    seoMetaDescription:
      "Discover how Veenero's proven four-step methodology helps organisations achieve measurable water efficiency improvements.",
    seoStatus: 'good',
    lastUpdated: '2026-08-11T11:15:00Z',
    updatedBy: 'Aditya Choubey',
    isCoreSystemPage: true,
    sections: [
      { id: 's-approach-hero', name: 'Approach Hero', type: 'hero', visible: true },
      { id: 's-methodology', name: 'Four-Step Methodology', type: 'content', visible: true },
      { id: 's-process', name: 'Our Process', type: 'content', visible: true },
    ],
  },
  {
    _id: 'page-impact',
    name: 'Impact',
    slug: '/impact',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Real World Impact | Veenero Results',
    seoMetaDescription:
      'See how Veenero has helped clients save millions of litres of water and reduce operational costs through intelligent monitoring.',
    seoStatus: 'needs-work',
    lastUpdated: '2026-08-08T13:45:00Z',
    updatedBy: 'Aditya Choubey',
    isCoreSystemPage: true,
    sections: [
      { id: 's-impact-hero', name: 'Impact Hero', type: 'hero', visible: true },
      { id: 's-stats', name: 'Key Statistics', type: 'content', visible: true },
      { id: 's-case-highlights', name: 'Case Study Highlights', type: 'content', visible: true },
      { id: 's-testimonials', name: 'Client Testimonials', type: 'testimonials', visible: false },
    ],
  },
  {
    _id: 'page-partners',
    name: 'Partners',
    slug: '/partners',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Our Partners | Veenero Ecosystem',
    seoMetaDescription:
      'Veenero partners with leading technology, sustainability, and infrastructure organisations to deliver best-in-class water intelligence.',
    seoStatus: 'poor',
    lastUpdated: '2026-08-06T10:00:00Z',
    updatedBy: 'Aditya Choubey',
    isCoreSystemPage: true,
    sections: [
      { id: 's-partners-hero', name: 'Partners Hero', type: 'hero', visible: true },
      { id: 's-partner-grid', name: 'Partner Logos Grid', type: 'gallery', visible: true },
      { id: 's-partner-cta', name: 'Become a Partner CTA', type: 'cta', visible: true },
    ],
  },
  {
    _id: 'page-careers',
    name: 'Careers',
    slug: '/careers',
    status: 'draft',
    featuredImage: null,
    seoMetaTitle: 'Careers at Veenero | Join Our Team',
    seoMetaDescription:
      'Join Veenero and help shape the future of water intelligence. View open positions across engineering, sales, and operations.',
    seoStatus: 'good',
    lastUpdated: '2026-08-07T09:30:00Z',
    updatedBy: 'Aditya Choubey',
    isCoreSystemPage: false,
    sections: [
      { id: 's-careers-hero', name: 'Careers Hero', type: 'hero', visible: true },
      { id: 's-openings', name: 'Open Positions', type: 'content', visible: true },
      { id: 's-culture', name: 'Our Culture', type: 'content', visible: false },
    ],
  },
  {
    _id: 'page-insights',
    name: 'Insights',
    slug: '/insights',
    status: 'draft',
    featuredImage: null,
    seoMetaTitle: 'Water Intelligence Insights & Articles | Veenero',
    seoMetaDescription:
      'Read the latest insights, research, and thought leadership on water management, sustainability, and smart infrastructure from Veenero.',
    seoStatus: 'needs-work',
    lastUpdated: '2026-08-09T15:00:00Z',
    updatedBy: 'Aditya Choubey',
    isCoreSystemPage: false,
    sections: [
      { id: 's-insights-hero', name: 'Insights Hero', type: 'hero', visible: true },
      { id: 's-featured', name: 'Featured Article', type: 'content', visible: true },
      { id: 's-article-grid', name: 'Article Grid', type: 'custom', visible: true },
    ],
  },
  {
    _id: 'page-contact',
    name: 'Contact',
    slug: '/contact',
    status: 'published',
    featuredImage: null,
    seoMetaTitle: 'Contact Veenero | Get in Touch',
    seoMetaDescription:
      'Contact the Veenero team to request a demo, ask questions, or discuss how we can help your organisation manage water intelligently.',
    seoStatus: 'good',
    lastUpdated: '2026-08-14T08:00:00Z',
    updatedBy: 'Aditya Choubey',
    isCoreSystemPage: true,
    sections: [
      { id: 's-contact-hero', name: 'Contact Hero', type: 'hero', visible: true },
      { id: 's-contact-form', name: 'Contact Form', type: 'content', visible: true },
      { id: 's-offices', name: 'Office Locations', type: 'content', visible: true },
    ],
  },
];

export async function seedDatabase(): Promise<void> {
  try {
    // 1. Seed Pages
    const count = await CmsPageModel.countDocuments();
    if (count === 0) {
      console.log('[Seed] Database is empty. Seeding 10 core pages...');
      await CmsPageModel.insertMany(mockPages);
      console.log('[Seed] Database seeded successfully.');
    } else {
      console.log('[Seed] Database already populated. Skipping page seed.');
    }

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
      } else {
        console.log('[Seed] Super Admin already exists. Skipping user seed.');
      }
    } else {
      console.warn('[Seed] Warning: ADMIN_EMAIL or ADMIN_PASSWORD not configured. Skipping Super Admin seeding.');
    }

    // 3. Seed Careers
    const careerCount = await CareerModel.countDocuments();
    if (careerCount === 0) {
      console.log('[Seed] Careers database is empty. Seeding 3 realistic careers...');
      const seedCareers = [
        {
          title: "Full Stack Developer",
          slug: "full-stack-developer",
          department: "Engineering",
          location: "Bengaluru, India",
          employmentType: "Full-time",
          experience: "2+ Years",
          shortDescription: "Build scalable web applications and intelligent systems that drive real-world impact.",
          description: "We are seeking a Full Stack Developer to join our team in Bengaluru. You will design, build, and optimize backend microservices and responsive web client interfaces that enable real-time telemetry analytics and resource monitoring.",
          responsibilities: [
            "Design and build robust, high-performance APIs and frontend applications using React and Node.js.",
            "Optimize data visualization controls to display heavy real-time telemetry metrics.",
            "Implement clean, reusable UI components adhering strictly to our visual guidelines.",
            "Collaborate with product and design layers to ship client-facing dashboard portals."
          ],
          requirements: [
            "B.Tech/M.Tech in Computer Science, engineering, or related field.",
            "2+ years of professional full-stack development experience using TypeScript, React, and Node.js.",
            "Familiarity with data viz tools, web performance metrics, and database scaling.",
            "Self-starter mindset with strong attention to layout alignment and details."
          ],
          niceToHave: [
            "Experience with cloud infrastructure (AWS/GCP).",
            "Familiarity with charting libraries like Recharts or D3.js."
          ],
          skills: ["React", "Node.js", "TypeScript", "TailwindCSS", "PostgreSQL"],
          status: "PUBLISHED",
          isFeatured: true,
          sortOrder: 1,
          createdBy: "System Seed",
          updatedBy: "System Seed"
        },
        {
          title: "Data Engineer",
          slug: "data-engineer",
          department: "Engineering",
          location: "Remote",
          employmentType: "Full-time",
          experience: "3+ Years",
          shortDescription: "Design and build robust data pipelines to power our water intelligence platform.",
          description: "We are looking for a Data Engineer to develop and scale our telemetry data processing pipelines. You will optimize the storage, ingestion, and analytical query layers that process millions of flow data points daily.",
          responsibilities: [
            "Design and implement scalable ingestion and ETL pipelines for high-throughput sensor telemetry.",
            "Optimize database schemas and analytical indexing layers for fast dashboard queries.",
            "Collaborate with hardware and DevOps engineers on telemetry serialization formats (Protobuf, MQTT).",
            "Ensure data integrity, uptime monitoring, and quality metrics across ingestion layers."
          ],
          requirements: [
            "3+ years of experience engineering data pipelines or analytics databases.",
            "Expert level knowledge of Python, SQL, and distributed frameworks (e.g. Spark, Kafka).",
            "Experience scaling analytical datastores (e.g. ClickHouse, PostgreSQL, MongoDB).",
            "Strong understanding of message queues and time-series telemetry pipelines."
          ],
          niceToHave: [
            "Experience with Docker and Kubernetes.",
            "Familiarity with IoT messaging protocols."
          ],
          skills: ["Python", "SQL", "Kafka", "ClickHouse", "MongoDB", "ETL"],
          status: "PUBLISHED",
          isFeatured: false,
          sortOrder: 2,
          createdBy: "System Seed",
          updatedBy: "System Seed"
        },
        {
          title: "GIS & Remote Sensing Specialist",
          slug: "gis-remote-sensing-specialist",
          department: "Technology",
          location: "Hyderabad, India",
          employmentType: "Full-time",
          experience: "3+ Years",
          shortDescription: "Use geospatial insights to solve complex water challenges at scale.",
          description: "We are seeking a GIS and Remote Sensing Specialist to lead our geospatial intelligence layer. You will process satellite imagery, analyze hydrological features, and integrate geographic telemetry data to optimize water resource monitoring maps.",
          responsibilities: [
            "Process, index, and analyze multi-spectral satellite imagery and spatial data layers.",
            "Build interactive GIS visualization layers for client dashboards and insights portals.",
            "Collaborate with software engineers to integrate geospatial APIs (ArcGIS, Mapbox, Leaflet).",
            "Research and validate remote-sensing models to predict hydrological trends."
          ],
          requirements: [
            "Degree in Geoinformatics, GIS, Remote Sensing, or related environmental science fields.",
            "3+ years of experience working with GIS software (QGIS, ArcGIS) and spatial database extensions.",
            "Proficiency programming in Python for spatial data analysis (using GDAL, rasterio, shapely).",
            "Experience working with remote sensing datasets (Sentinel, Landsat) and satellite APIs."
          ],
          niceToHave: [
            "Knowledge of machine learning for land cover classification.",
            "Familiarity with cloud GIS databases."
          ],
          skills: ["QGIS", "ArcGIS", "Python", "GDAL", "Mapbox", "Remote Sensing"],
          status: "PUBLISHED",
          isFeatured: false,
          sortOrder: 3,
          createdBy: "System Seed",
          updatedBy: "System Seed"
        }
      ];
      await CareerModel.insertMany(seedCareers);
      console.log('[Seed] Careers seeded successfully.');
    } else {
      console.log('[Seed] Careers already populated. Skipping career seed.');
    }

    // 4. Seed Blog Posts
    const blogCount = await BlogPostModel.countDocuments();
    if (blogCount === 0) {
      console.log('[Seed] Blog posts database is empty. Seeding blog posts...');
      const seedPosts = [
        {
          title: 'Making Every Litre Visible: The Rise of Water Intelligence',
          slug: 'making-every-litre-visible-the-rise-of-water-intelligence',
          category: 'Water Intelligence',
          excerpt: 'How real-time telemetry, data verification, and cloud platforms are changing the way cities and industries manage water.',
          featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
          featuredImageAlt: 'Aerial view of pristine mountain lake representing water intelligence',
          author: 'Veenero Insights',
          readingTime: '6 min read',
          status: 'PUBLISHED',
          featured: true,
          sortOrder: 1,
          publishedAt: new Date('2026-08-17'),
          content: `Water is our most critical resource, yet it is often the least measured. In an era where carbon emissions are tracked in real-time and supply chains are optimized down to the millisecond, our management of water has lagged behind. Today, a new paradigm is emerging: Water Intelligence.

By combining IoT sensors, real-time telemetry, and advanced verification algorithms, organizations can now transition from estimation to absolute visibility.

## The Cost of Water Invisibility

Historically, water consumption has been measured through monthly or quarterly billing cycles. While this shows overall volume, it hides critical operational details:

- Undetected Leaks: Small pipe ruptures can leak thousands of litres daily before showing visible signs.
- Consumption Surges: Without real-time tracking, identifying high-demand peaks or anomalous usage is nearly impossible.
- Zero Accountability: In industrial settings, local managers lack the granularity required to enforce efficiency benchmarks.

## The Pillars of Water Intelligence

Water Intelligence goes beyond simple metering. It relies on a continuous loop of data collection, validation, and analytics:

1. IoT Telemetry: Ultrasonic and electromagnetic flow sensors capture volume, velocity, and pressure at source, distribution, and consumption points.
2. Cloud Serialization: Sensor telemetry is serialized via MQTT and securely transmitted to cloud processing nodes.
3. Data Verification: Algorithmic validation filters telemetry anomalies, ensuring that sensor drifts or transient outages do not skew analytics.

## Shifting from Measurement to Action

The ultimate goal of Water Intelligence is action. Real-time dashboards enable operations teams to isolate water loss within minutes rather than weeks. In industrial sectors, this translates directly to carbon footprint reduction and true sustainability compliance.

As climate volatility shifts regional water tables, making every litre visible is no longer just an environmental goal — it is an operational necessity.`,
          seo: { metaTitle: 'Water Intelligence: Making Every Litre Visible | Veenero', metaDescription: 'Discover how IoT telemetry and real-time data verification are transforming water management globally.' },
        },
        {
          title: 'Why Water Visibility Matters for Modern Infrastructure',
          slug: 'why-water-visibility-matters-for-modern-infrastructure',
          category: 'Water Intelligence',
          excerpt: 'Smart cities and buildings require high-fidelity telemetry to prevent water loss and optimize complex distribution networks.',
          featuredImage: 'https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?q=80&w=800&auto=format&fit=crop',
          featuredImageAlt: 'Water flowing through modern urban infrastructure pipelines',
          author: 'Veenero Insights',
          readingTime: '4 min read',
          status: 'PUBLISHED',
          featured: false,
          sortOrder: 2,
          publishedAt: new Date('2026-08-15'),
          content: `Modern municipal infrastructure is facing unprecedented stress. High density urbanization, aging pipe systems, and shifting hydrological profiles make water delivery highly complex.

## The Infrastructure Blindspot

Most distribution networks lose up to 30% of their treated water before it reaches consumer taps. This is known as Non-Revenue Water (NRW).

- Pressure Variations: Excess pressure leads to pipe leaks; inadequate pressure limits distribution.
- Dynamic Demand: Traditional planning cannot handle the hourly spikes of mega-cities.

## Implementing Visibility

By introducing inline telemetry nodes, infrastructure managers can partition distribution networks into District Metered Areas (DMAs). By comparing net inlet volumes against total consumer outlets within the DMA, managers can pinpoint leakage zones immediately.`,
          seo: { metaTitle: 'Water Visibility in Modern Infrastructure | Veenero', metaDescription: 'Learn how smart telemetry enables cities to eliminate Non-Revenue Water and optimize distribution.' },
        },
        {
          title: 'From Measurement to Action: Building Smarter Water Systems',
          slug: 'from-measurement-to-action-building-smarter-water-systems',
          category: 'Technology',
          excerpt: 'Exploring the technical stack behind real-time telemetry pipelines, from edge sensors to cloud analytics.',
          featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
          featuredImageAlt: 'High-tech industrial sensors and monitoring equipment',
          author: 'Tech & Engineering Layer',
          readingTime: '5 min read',
          status: 'PUBLISHED',
          featured: false,
          sortOrder: 3,
          publishedAt: new Date('2026-08-10'),
          content: `Building an automated water intelligence platform requires a specialized technology stack. Sensors must endure harsh field conditions, consume minimal battery power, and transmit telemetry securely across cellular bands.

## The Hardware Layer

Veenero uses electromagnetic and ultrasonic sensors because they lack moving parts, eliminating wear and drift over time.

- Modbus/RS485 Interfaces: These protocols transmit sensor data directly to custom IoT transmission nodes.
- NB-IoT & LTE-M: Narrowband communication ensures that nodes buried underground retain network links.

## The Telemetry Data Pipeline

Once telemetry is broadcast from the field, it passes through an ingestion server to serialization microservices:

1. Ingestion Engine: Handlers parse packet payloads and validate checksum integrity.
2. Time-Series Datastore: Telemetry is indexed in high-performance databases suited for quick data visualizations.
3. API & Visualization: React clients render telemetry charts, tracking flow rates and pressure metrics in real-time.`,
          seo: { metaTitle: 'Building Smarter Water Systems with Telemetry | Veenero', metaDescription: 'A technical deep-dive into the IoT stack powering modern water intelligence platforms.' },
        },
        {
          title: 'How Data Can Help Reduce Industrial Water Loss',
          slug: 'how-data-can-help-reduce-industrial-water-loss',
          category: 'Sustainability',
          excerpt: 'Industries consume massive amounts of water. See how tracking process water yields dramatic conservation improvements.',
          featuredImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop',
          featuredImageAlt: 'Sustainable industrial landscape with water conservation systems',
          author: 'Sustainability Board',
          readingTime: '7 min read',
          status: 'PUBLISHED',
          featured: false,
          sortOrder: 4,
          publishedAt: new Date('2026-08-05'),
          content: `Industrial processes account for a major portion of global freshwater consumption. Yet, few industrial sites can trace water consumption down to individual machinery.

## Mapping Process Water

To save water, factories must map their entire manufacturing blueprint:

- Boiler Feed: Tracking steam losses and condensate returns.
- Cooling Towers: Measuring evaporation and blowdown metrics.
- Product Integration: Verifying water used directly in final products.

## The Conservation Yield

When factories deploy dedicated inline telemetry on these loops, they discover critical anomalies. Fixing these issues reduces industrial water bills and aligns corporations with ESG compliance guidelines.`,
          seo: { metaTitle: 'Reducing Industrial Water Loss with Data | Veenero', metaDescription: 'How telemetry and process mapping help industries achieve dramatic water conservation.' },
        },
        {
          title: 'The Role of Verification in Responsible Water Management',
          slug: 'the-role-of-verification-in-responsible-water-management',
          category: 'Water Verification',
          excerpt: 'Why unverified water data is a liability, and how cryptographic proof secures sustainability reporting.',
          featuredImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
          featuredImageAlt: 'Crystal clear mountain water stream symbolizing verified data integrity',
          author: 'Governance & Auditing',
          readingTime: '5 min read',
          status: 'PUBLISHED',
          featured: false,
          sortOrder: 5,
          publishedAt: new Date('2026-07-28'),
          content: `Greenwashing is a growing challenge in ESG disclosures. Assertions like "Water Neutrality" or "30% Water Saved" are often calculated using loose spreadsheets without audit trails.

## The Spread of Sensor Errors

Flow meters in the field face issues like signal drifts, mineral scaling, and power failures. If raw data is copied directly to corporate reports without verification, anomalies skew calculations.

## Building Proof-of-Concept Verification

To guarantee data trust, we need independent verification:

- Telemetry Checks: Comparing inflow parameters against outflow metrics to flag anomalies.
- Cryptographic Logging: Writing verified logs to secure ledgers to create tamper-proof data records.
- Third-Party Integrations: Allowing auditors to trace dashboard data directly to source sensors.`,
          seo: { metaTitle: 'Water Verification for ESG Compliance | Veenero', metaDescription: 'Why cryptographic verification is essential for trustworthy water sustainability reporting.' },
        },
        {
          title: 'Building a Data-Driven Water Future for India',
          slug: 'building-a-data-driven-water-future-for-india',
          category: 'Industry',
          excerpt: 'Addressing national water supply challenges through data standards, open hardware, and shared intelligence.',
          featuredImage: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?q=80&w=800&auto=format&fit=crop',
          featuredImageAlt: 'Indian water infrastructure and rural water management systems',
          author: 'Veenero Leadership',
          readingTime: '6 min read',
          status: 'PUBLISHED',
          featured: false,
          sortOrder: 6,
          publishedAt: new Date('2026-07-20'),
          content: `India faces one of the world's most acute water challenges. Ground water levels are falling, monsoon patterns are shifting, and water distribution is highly uneven.

## Setting Data Standards

Water management is currently fragmented across multiple regional departments, water boards, and private agencies. Each uses different, incompatible data systems.

- Unified Schemas: Setting standard formats for flow rate, pressure, and quality parameters.
- Open APIs: Allowing developers to build water-saving apps using public telemetry datasets.

## The Path Forward

By deploying smart telemetry networks and making the datasets public, we can empower communities, farmers, and municipal leaders to make data-driven decisions that ensure a sustainable water future.`,
          seo: { metaTitle: 'Data-Driven Water Future for India | Veenero', metaDescription: 'How open data standards and telemetry networks can solve India\'s water crisis.' },
        },
      ];
      await BlogPostModel.insertMany(seedPosts);
      console.log('[Seed] Blog posts seeded successfully.');
    } else {
      console.log('[Seed] Blog posts already populated. Skipping blog seed.');
    }

    // 5. Seed Blog Landing Settings
    const settingsCount = await BlogLandingSettingsModel.countDocuments();
    if (settingsCount === 0) {
      console.log('[Seed] Blog landing settings not found. Seeding default settings...');
      await BlogLandingSettingsModel.create({
        hero: {
          eyebrow: 'VEENERO INSIGHTS',
          title: 'Water Intelligence & Innovation',
          description: 'Insights, research and perspectives on smart water management, sustainability and real-time telemetry from the Veenero team.',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop',
          imageAlt: 'Aerial view of pristine lake representing water intelligence',
        },
        featuredSection: {
          eyebrow: 'COVER STORY',
          title: 'Featured Insight',
          description: 'Our editorial team\'s most important and relevant article this month.',
        },
        insightStats: [
          { value: '100%', label: 'Water Visibility', description: 'End-to-end telemetry coverage across every monitored facility' },
          { value: '24/7', label: 'Monitoring', description: 'Continuous real-time data streams from field sensors' },
          { value: 'Real-Time', label: 'Intelligence', description: 'Instant anomaly detection and automated alert escalation' },
        ],
        editorialQuote: {
          eyebrow: 'OUR MISSION',
          title: 'Every drop of water deserves to be measured, verified and understood.',
          description: 'At Veenero, we believe that data transparency is the foundation of sustainable water stewardship for the next generation.',
        },
        cta: {
          eyebrow: 'CONTRIBUTE',
          title: 'Have an idea worth sharing?',
          description: 'We are always looking for perspectives on sustainability, measurement, and water infrastructure from industry leaders.',
          buttonText: 'Explore Veenero',
          buttonLink: '/#contact',
        },
        seo: {
          metaTitle: 'Water Intelligence Insights & Articles | Veenero',
          metaDescription: 'Read the latest insights, research, and thought leadership on water management, sustainability, and smart infrastructure from Veenero.',
        },
        isPublished: true,
      });
      console.log('[Seed] Blog landing settings seeded successfully.');
    } else {
      console.log('[Seed] Blog landing settings already populated. Skipping settings seed.');
    }

    // 6. Seed Home Page Settings
    const homeSettingsCount = await HomePageSettingsModel.countDocuments();
    if (homeSettingsCount === 0) {
      console.log('[Seed] Home page settings not found. Seeding default settings...');
      await HomePageSettingsModel.create({
        hero: {
          visible: true,
          eyebrow: 'India’s Water Intelligence Platform',
          title: "India's Water Intelligence Platform",
          description: 'Measure. Monitor. Optimize. Verify.',
          primaryCtaText: 'Explore the Platform',
          primaryCtaLink: '/#solutions',
          secondaryCtaText: 'Watch How Water Visibility Works',
          secondaryCtaLink: '#',
          image: '/src/assets/hero-water.jpg',
          imageAlt: 'Abstract water waves representing sustainable water management',
          bottomText: 'Making Every Litre Visible.',
        },
        about: {
          visible: true,
          eyebrow: 'About Veenero',
          title: "Building India's Water Intelligence Network",
          description: 'Veenero is not a leak detection company, not a hardware provider, and not a single device approach. We are the future digital infrastructure layer for water management—helping organizations create Water Visibility, Water Accountability, and Water Verification through real-time analytics and a shared water data platform.',
          values: [
            { iconName: 'Target', title: 'Water Intelligence', description: 'We help organizations measure, monitor, optimize, benchmark, and verify water usage—turning fragmented data into actionable accountability.' },
            { iconName: 'Heart', title: 'Water Visibility', description: 'Making every litre measurable across assets, sites, and systems—so decisions are data-driven, timely, and transparent.' },
            { iconName: 'Users', title: 'Water Accountability', description: 'A verification-ready water data layer that supports reporting, governance, and performance improvement over time.' }
          ],
          stats: [
            { value: '24/7', label: 'Water Monitoring Coverage' },
            { value: 'Multi-site', label: 'Benchmarking & Comparison' },
            { value: 'Audit-ready', label: 'Verification-First Reporting' },
            { value: 'India', label: 'Network Growth Focus' }
          ]
        },
        solutions: {
          visible: true,
          eyebrow: 'Product Suite',
          title: 'India’s Water Intelligence Platform',
          description: 'Veenero is building a shared water data infrastructure to help organizations measure, monitor, optimize, benchmark, and verify water usage—so every litre becomes visible and accountable.',
          list: [
            { iconName: 'Search', title: 'Veenero Sense', description: 'Capture water data and create Water Visibility—integrating measurements across sites, assets, and operational contexts.', features: ['Real-time water data capture', 'Multi-source integration', 'Data integrity checks'] },
            { iconName: 'BarChart3', title: 'Veenero Intelligence', description: 'Turn signals into decisions with Water Intelligence—analytics that measure usage, identify patterns, benchmark performance, and optimize performance.', features: ['Optimization insights', 'Benchmarking reports', 'Water Efficiency tracking'] },
            { iconName: 'Waves', title: 'Veenero Insights', description: 'Communicate outcomes with Water Verification-ready reporting—auditable analytics designed for accountability across teams and stakeholders.', features: ['Audit-ready dashboards', 'Verification workflows', 'Actionable accountability'] },
            { iconName: 'Shield', title: 'Water Verification', description: 'A verification-first approach that helps organizations demonstrate measurement validity, governance, and ongoing monitoring quality.', features: ['Verification trails', 'Compliance-ready exports', 'Change & assurance history'] },
            { iconName: 'Cloud', title: 'Water Data Platform', description: 'The infrastructure layer that unifies water data across organizations—enabling benchmarking, governance, and future network-scale intelligence.', features: ['Network-ready architecture', 'Role-based governance', 'Benchmark datasets'] },
            { iconName: 'Leaf', title: 'Water Risk & Accountability', description: 'Assess Water Risk and drive Water Accountability—so organizations can prioritize interventions based on evidence, not assumptions.', features: ['Risk scoring', 'Operational accountability', 'Verified performance outcomes'] }
          ]
        },
        approach: {
          visible: true,
          eyebrow: 'Our Approach',
          title: 'A Proven Path to Water Sustainability',
          description: 'Our methodical four-step process ensures successful outcomes for every project, from initial assessment to long-term optimization.',
          steps: [
            { number: '01', title: 'Sense: Measure Every Litre', description: 'Onboard your water data sources to build Water Visibility—so usage is measurable across sites, assets, and operations.', points: ['Data capture mapping', 'Baseline measurement', 'Integrity & validation checks'] },
            { number: '02', title: 'Intelligence: Monitor & Benchmark', description: 'Use real-time analytics to track performance, compare across peers, and surface Water Risk early.', points: ['Real-time analytics', 'Benchmarking', 'Operational anomaly signals'] },
            { number: '03', title: 'Optimize: Act with Evidence', description: 'Transform insights into interventions—improving Water Efficiency through quantified recommendations and measurable outcomes.', points: ['Optimization scenarios', 'Efficiency tracking', 'Actionable workflows'] },
            { number: '04', title: 'Verify: Prove Accountability', description: 'Verification-ready reporting and audit trails help teams demonstrate Water Accountability with confidence.', points: ['Verification trails', 'Audit-ready dashboards', 'Ongoing assurance'] }
          ]
        },
        impact: {
          visible: true,
          eyebrow: 'Benefits & Outcomes',
          title: 'Making Every Litre Visible',
          description: 'Water Visibility creates Water Accountability. Veenero helps organizations measure, monitor, optimize, benchmark, and verify water usage—so decisions are evidence-based and reporting is audit-ready.',
          impacts: [
            { iconName: 'Droplets', value: '100%+', label: 'Visibility Coverage', description: 'Real-time measurement coverage across sites and systems' },
            { iconName: 'TrendingUp', value: 'Optimized', label: 'Water Efficiency Gains', description: 'Actionable recommendations backed by verified analytics' },
            { iconName: 'Globe', value: 'India-wide', label: 'Network Benchmarking', description: 'Comparative insights that help prioritize Water Risk' },
            { iconName: 'Award', value: 'Audit-ready', label: 'Verified Reporting', description: 'Water Accountability with traceable data and governance' }
          ],
          testimonial: {
            quote: 'Veenero gave us Water Visibility we could finally trust. With benchmarked intelligence and verification-ready reporting, our teams moved from estimates to evidence—faster decisions, stronger accountability.',
            author: 'Sarah Chen',
            role: 'Sustainability & Water Lead',
            company: 'Metro Water District'
          }
        },
        partners: {
          visible: true,
          eyebrow: 'Water Intelligence Network',
          title: 'Collaborating to Make Water Visible Across India',
          description: 'We partner with research institutions, industry ecosystems, and infrastructure stakeholders to build Water Intelligence, strengthen Water Verification, and accelerate network-scale benchmarking.',
          list: [
            { name: 'IIT ROPAR', logo: '/src/assets/partner.png', description: 'Research collaboration for Water Intelligence and evidence-driven infrastructure.' },
            { name: 'ELECTROPRENEUR PARK', logo: '/src/assets/partner2.jpg', description: 'Ecosystem partner supporting the Water Data Platform and network growth.' },
            { name: 'VISHNU TBI', logo: '/src/assets/part3.png', description: 'Innovation partner advancing Water Verification and real-time analytics.' }
          ]
        },
        careers: {
          visible: true,
          eyebrow: 'Join Our Team',
          title: 'Help Build India’s Water Intelligence Network',
          description: "We’re looking for builders who care about data integrity, real-time analytics, and sustainable infrastructure. Join a team creating the future water data platform—so organizations can measure, monitor, optimize, benchmark, and verify every litre.",
          openingsTitle: 'Open Positions',
          list: [
            { title: 'IoT Hardware Engineer', location: 'Remote / On-site', department: 'Engineering', isNew: true },
            { title: 'Mobile Application Developer', location: 'Remote / On-site', department: 'Software Development', isNew: true },
            { title: 'UI/UX Designer', location: 'Remote / On-site', department: 'Design', isNew: true }
          ],
          generalAppText: "Don't see a perfect fit? We're always open to meeting talented people.",
          generalAppButtonText: 'Send General Application'
        },
        contact: {
          visible: true,
          eyebrow: 'Get In Touch',
          title: 'Let’s Build Water Visibility Together',
          description: 'Want to measure, monitor, optimize, benchmark, and verify water usage? Book a demo of Veenero’s water data platform and start making every litre visible.',
          infoTitle: 'Contact Information',
          infoList: [
            { iconName: 'MapPin', label: 'Visit Us', value: 'H-no 3-294/1/A/1 Tailors Colony Adilabad 504001' },
            { iconName: 'Phone', label: 'Call Us', value: '9346517202' },
            { iconName: 'Mail', label: 'Email Us', value: 'udaygedam@veenerosolutions.com' }
          ],
          demoTitle: 'Schedule a Platform Demo',
          demoDescription: 'Experience Veenero Sense, Intelligence, and Insights—built to deliver Water Verification-ready reporting and real-time analytics for water accountability.',
          demoButtonText: 'Book Demo',
          formTitle: 'Send Us a Message'
        },
        footer: {
          description: 'Building India’s Water Intelligence Network—making every litre visible through a real-time water data platform.',
          address: 'H-no 3-294/1/A/1 Tailors Colony Adilabad 504001',
          mobile: '9346517202',
          links: {
            solutions: [
              { label: 'Veenero Sense', href: '/#solutions' },
              { label: 'Veenero Intelligence', href: '/#solutions' },
              { label: 'Veenero Insights', href: '/#solutions' },
              { label: 'Water Verification', href: '/#solutions' }
            ],
            company: [
              { label: 'About Veenero', href: '/#about' },
              { label: 'How the Platform Works', href: '/#approach' },
              { label: 'Benefits & Outcomes', href: '/#impact' },
              { label: 'Careers', href: '/careers' }
            ],
            resources: [
              { label: 'Case Studies', href: '#' },
              { label: 'Blog', href: '/blog' },
              { label: 'White Papers', href: '#' },
              { label: 'FAQ', href: '#' }
            ]
          },
          socialLinks: [
            { iconName: 'Linkedin', href: '#', label: 'LinkedIn' },
            { iconName: 'Twitter', href: '#', label: 'Twitter' },
            { iconName: 'Youtube', href: '#', label: 'YouTube' },
            { iconName: 'Mail', href: 'mailto:udaygedam@veenerosolutions.com', label: 'Email' }
          ]
        }
      });
      console.log('[Seed] Home page settings seeded successfully.');
    } else {
      console.log('[Seed] Home page settings already populated. Skipping home seed.');
    }

  } catch (error) {
    console.error('[Seed] Error during seeding:', (error as Error).message);
  }
}
