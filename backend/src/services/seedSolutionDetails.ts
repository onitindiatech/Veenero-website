import { SolutionDetailModel } from '../models/SolutionDetail';

/**
 * Seeds and synchronizes default Solution Detail records into SolutionDetailModel.
 * Completely idempotent: only creates records if they do not exist, or safely supplements missing sections.
 */
export async function seedSolutionDetails(): Promise<void> {
  try {
    const defaultSolutions = [
      {
        slug: 'water-visibility',
        title: 'Water Visibility',
        shortTitle: 'Veenero Sense',
        shortDescription: 'Real-time monitoring of water assets, flow, quality, and infrastructure across locations.',
        icon: 'Radio',
        badge: 'WATER VISIBILITY',
        categoryKey: 'Water Visibility',
        tagline: {
          line1: 'Real-time Visibility.',
          line2: 'Complete Clarity.',
          line3: 'Every Drop.',
        },
        heroDescription:
          'Veenero Water Visibility gives you real-time monitoring of water assets, flow, quality, and infrastructure across locations — so you can detect issues early, reduce losses, and make confident decisions.',
        heroPills: ['Real-time Data', 'Always-On Monitoring', 'Unified Platform'],
        heroImage: '/src/assets/about/about-journey-water-infrastructure.webp',
        heroImageAlt: 'Veenero Water Visibility Infrastructure Telemetry',
        contactEmail: 'solutions@veenerosolutions.com',
        primaryCtaText: 'Request a Demo',
        primaryCtaLink: '#inquiry-section',
        secondaryCtaText: 'Talk to an Expert',
        secondaryCtaLink: '#inquiry-section',
        heroHighlights: [
          { icon: 'ShieldCheck', title: 'Verified', subtitle: 'Measurement' },
          { icon: 'BarChart3', title: 'Real-Time', subtitle: 'Reconciliation' },
          { icon: 'FileText', title: 'Audit-Ready', subtitle: 'Data' },
        ],
        heroBadgeText: {
          title: 'From Data to Decisions',
          subtitle: 'Reliable. Transparent. Impactful.',
          watermarkText: 'Smarter\nWater Systems\nFor A More\nSustainable\nTomorrow',
        },
        heroMetrics: [
          {
            title: 'Live Flow Rate',
            value: '1,245',
            rawValue: 1245,
            suffix: ' m³/hr',
            subtext: 'vs yesterday',
            change: '+10.5%',
            isPositive: true,
            type: 'sparkline',
            sparklineData: [24, 38, 30, 48, 42, 60, 56, 75, 88],
          },
          {
            title: 'Water Quality',
            value: '98',
            rawValue: 98,
            suffix: '%',
            subtext: 'pH 7.2 · Turbidity 1.2 NTU',
            change: 'Healthy',
            isPositive: true,
            type: 'gauge',
            gaugePercent: 98,
          },
          {
            title: 'Active Alerts',
            value: '3',
            rawValue: 3,
            subtext: 'View All Alerts',
            type: 'counter',
          },
          {
            title: 'Asset Overview',
            value: 'Plant 01',
            rawValue: 1,
            subtext: 'Telemetry Latency: 14ms',
            change: 'Online',
            isPositive: true,
            type: 'status',
          },
        ],
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'One Platform.',
          highlightTitle: 'Total Water Visibility.',
          description:
            'From source to tap, Veenero connects sensors, telemetry, and analytics into a single view of your water infrastructure. You get real-time insights that help you reduce NRW, optimize operations, and ensure reliability across your system.',
          blocks: [
            {
              title: '360° Asset Monitoring',
              description: 'Monitor reservoirs, pipelines, pumps, valves, and treatment tanks in real time.',
              icon: 'Activity',
            },
            {
              title: 'Flow & Pressure Tracking',
              description: 'Track hydraulic flow, pressure gradients, and storage levels continuously.',
              icon: 'Gauge',
            },
            {
              title: 'Water Quality Monitoring',
              description: 'Inspect key physical and chemical quality parameters with 24/7 telemetry.',
              icon: 'Droplets',
            },
            {
              title: 'Smart Alerts',
              description: 'Get notified instantly when parameters violate baseline operational thresholds.',
              icon: 'Bell',
            },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Enterprise Capabilities for Complete Oversight',
          description:
            'Designed to eliminate physical blindspots and unify utility engineering, plant operations, and executive leadership.',
          items: [
            {
              icon: 'Radio',
              title: 'Real-time Telemetry',
              description: 'Continuous sub-second data streaming from rugged sensors across your entire water network.',
            },
            {
              icon: 'Sparkles',
              title: 'AI-Powered Insights',
              description: 'Machine learning models detect anomalies and predict supply disruptions before downtime occurs.',
            },
            {
              icon: 'MapPin',
              title: 'Map-based Monitoring',
              description: 'Visualize geographic asset distributions, DMA zones, and pipeline statuses on GIS maps.',
            },
            {
              icon: 'Shield',
              title: 'Role-based Access',
              description: 'Granular enterprise access controls for operators, reliability engineers, and compliance auditors.',
            },
            {
              icon: 'BarChart3',
              title: 'Automated Reporting',
              description: 'Schedule daily, weekly, and monthly regulatory and ESG compliance water consumption reports.',
            },
            {
              icon: 'Cpu',
              title: 'Edge Resilience',
              description: 'Autonomous edge controllers buffer data locally and continue monitoring even through network dropouts.',
            },
          ],
        },
        useCases: {
          eyebrow: 'DEPLOYMENT SCENARIOS',
          title: 'Proven Across Real-World Operational Environments',
          description:
            'From smart cities managing district metered areas to heavy process manufacturing, Veenero scales seamlessly.',
          items: [
            {
              icon: 'Building2',
              title: 'Municipal Water Utilities',
              description: 'Monitor city-wide distribution networks, manage district metered areas (DMAs), and curb Non-Revenue Water.',
              stats: 'Up to 35% NRW Reduction',
              image: '/src/assets/about/about-journey-water-infrastructure.webp',
              order: 1,
              isActive: true,
            },
            {
              icon: 'Factory',
              title: 'Industrial Plants',
              description: 'Optimize cooling towers, process recycling loops, and boiler feeds with closed-loop water balances.',
              stats: '24/7 Process Continuity',
              image: '/src/assets/about/about-industrial-water-system.webp',
              order: 2,
              isActive: true,
            },
            {
              icon: 'Radio',
              title: 'Rural Water Systems',
              description: 'Ensure equitable, uninterrupted water access across remote community distribution schemes.',
              stats: '99.8% Uptime Assurance',
              image: '/src/assets/about/about-field-verification.webp',
              order: 3,
              isActive: true,
            },
            {
              icon: 'Building',
              title: 'Commercial Campuses',
              description: 'Sub-meter corporate real estate, verify tenant billing, and eliminate overnight plumbing leakages.',
              stats: 'Zero Unmetered Waste',
              image: '/src/assets/about/about-vision-water-infrastructure.webp',
              order: 4,
              isActive: true,
            },
          ],
        },
        howItWorks: {
          eyebrow: 'HOW IT WORKS',
          title: 'Simple. Connected. Intelligent.',
          description:
            'A streamlined 5-stage telemetry lifecycle that turns raw physical pipe flow into board-level operational certainty.',
          steps: [
            {
              step: '01',
              title: 'Sense',
              subtitle: 'Edge Data Capture',
              description: 'Rugged IoT sensors collect high-frequency telemetry from your distributed water assets.',
              icon: 'Radio',
              order: 1,
              isActive: true,
            },
            {
              step: '02',
              title: 'Connect',
              subtitle: 'Secure Transmission',
              description: 'Secure data transmission via LoRaWAN, NB-IoT, 4G/5G and battery-backed edge gateways.',
              icon: 'Wifi',
              order: 2,
              isActive: true,
            },
            {
              step: '03',
              title: 'Understand',
              subtitle: 'AI Processing',
              description: 'Data is normalized and analyzed to detect anomalies, micro-leaks, and seasonal baselines.',
              icon: 'Cpu',
              order: 3,
              isActive: true,
            },
            {
              step: '04',
              title: 'Act',
              subtitle: 'Decision Execution',
              description: 'Field teams act on verified insights with confidence to optimize flows and prevent loss.',
              icon: 'SlidersHorizontal',
              order: 4,
              isActive: true,
            },
            {
              step: '05',
              title: 'Verify',
              subtitle: 'Governance Assurance',
              description: 'Outcomes are verified with immutable audit trails, reports, and ESG compliance exports.',
              icon: 'ShieldCheck',
              order: 5,
              isActive: true,
            },
          ],
        },
        techSection: {
          eyebrow: 'TECHNICAL ARCHITECTURE',
          title: 'Engineered for High-Frequency Telemetry',
          subtitle: 'Physical Water Infrastructure Meets Modern Cloud Resilience',
          description:
            'Veenero unifies hardware-agnostic edge ingestion, cryptographically verifiable data streaming, and scalable microservices to deliver sub-second telemetry across demanding industrial and municipal environments.',
          diagramSteps: [
            {
              label: 'Rugged Edge Sensing',
              desc: 'Non-invasive ultrasonic & electromagnetic pulse readers',
              icon: 'Radio',
              statusText: 'Stream Active',
              order: 1,
              isActive: true,
            },
            {
              label: 'Encrypted Edge Gateway',
              desc: 'TLS 1.3 encrypted data buffering during network outages',
              icon: 'Lock',
              statusText: 'TLS 1.3 Active',
              order: 2,
              isActive: true,
            },
            {
              label: 'Time-Series Pipeline',
              desc: 'High-throughput ingestion processing 10,000+ events/sec',
              icon: 'Layers',
              statusText: 'Ingestion OK',
              order: 3,
              isActive: true,
            },
            {
              label: 'Enterprise SCADA & API',
              desc: 'Native connectors for Siemens, Schneider, and ERP platforms',
              icon: 'Network',
              statusText: 'Connected',
              order: 4,
              isActive: true,
            },
          ],
        },
        features: {
          eyebrow: 'FEATURES & FUNCTIONALITY',
          title: 'Engineered for Precision & Operational Scale',
          description:
            'Every feature is purpose-built to transform fragmented field measurements into reliable, actionable intelligence.',
          items: [
            {
              icon: 'Gauge',
              title: 'Dynamic Pressure Profiling',
              description: 'Identify pressure transients and water hammer events that accelerate pipe fatigue and fatigue bursts.',
              tag: 'Hydraulic Integrity',
              order: 1,
              isActive: true,
            },
            {
              icon: 'Activity',
              title: 'Bidirectional Flow Tracking',
              description: 'High-resolution telemetry for booster stations, reservoirs, and gravity feed distribution mains.',
              tag: 'Flow Telemetry',
              order: 2,
              isActive: true,
            },
            {
              icon: 'Droplets',
              title: 'Continuous Quality Index',
              description: 'Multiparameter probes evaluate pH, turbidity, TDS, and dissolved oxygen with auto-drift calibration.',
              tag: 'Water Quality',
              order: 3,
              isActive: true,
            },
            {
              icon: 'Bell',
              title: 'Multi-Channel Escalations',
              description: 'Automated instant alerts dispatched via SMS, Email, and Webhook when thresholds are breached.',
              tag: 'Alert Automation',
              order: 4,
              isActive: true,
            },
            {
              icon: 'Layers',
              title: 'Asset Lifecycle Indexing',
              description: 'Track pump run-hours, valve actuation counts, and maintenance schedules across all distributed sites.',
              tag: 'Asset Health',
              order: 5,
              isActive: true,
            },
            {
              icon: 'Network',
              title: 'SCADA & ERP Integration',
              description: 'Pre-built REST, GraphQL, and MQTT connectors bridge edge sensors directly with central control rooms.',
              tag: 'Open Ecosystem',
              order: 6,
              isActive: true,
            },
          ],
        },
        benefits: {
          eyebrow: 'BENEFITS & IMPACT',
          title: 'Quantifiable Impact From Day One',
          description:
            'Veenero converts operational blindspots into measurable savings, reduced downtime, and verified water stewardship.',
          metrics: [
            {
              target: 30,
              suffix: '%',
              displayRange: '20-40%',
              label: 'Reduction in Non-Revenue Water',
              description: 'Pinpoint hidden distribution bursts and unmetered extraction before millions of litres are lost.',
              isVerifiedOutcome: true,
              order: 1,
              isActive: true,
            },
            {
              target: 40,
              suffix: '%',
              displayRange: '30-50%',
              label: 'Faster Issue Detection',
              description: 'Automated anomaly algorithms flag anomalies in under 60 seconds, preventing major pipe ruptures.',
              isVerifiedOutcome: true,
              order: 2,
              isActive: true,
            },
            {
              target: 30,
              suffix: '%',
              displayRange: '25-35%',
              label: 'Lower Operational Costs',
              description: 'Cut unnecessary technician dispatch runs with precision telemetry and remote diagnostic clarity.',
              isVerifiedOutcome: true,
              order: 3,
              isActive: true,
            },
            {
              target: 99.9,
              decimals: 1,
              suffix: '%',
              displayRange: '99.9%',
              label: 'Data Reliability & Availability',
              description: 'Military-grade edge buffering and redundant cloud pipelines ensure your records never miss a beat.',
              isVerifiedOutcome: true,
              order: 4,
              isActive: true,
            },
          ],
        },
        analyticsVisual: {
          eyebrow: 'REAL-TIME TELEMETRY STREAM',
          title: 'Live Water Visibility Dashboard',
          description: 'Interactive real-time parameters streaming continuously across monitored treatment and distribution assets.',
          stats: [
            { label: 'Total Monitored Assets', value: '236', numericValue: 236, order: 1, isActive: true },
            { label: 'Active Gateways Online', value: '198', numericValue: 198, change: '100% Operational', order: 2, isActive: true },
            { label: 'Live System Flow Rate', value: '1,245', numericValue: 1245, suffix: ' m³/hr', change: '+10.5%', order: 3, isActive: true },
            { label: 'Water Quality Index', value: '98', numericValue: 98, suffix: '%', change: 'Healthy', order: 4, isActive: true },
          ],
        },
        faqs: [
          {
            question: 'How does Veenero integrate with existing SCADA and PLC systems?',
            answer: 'Veenero provides hardware-agnostic edge gateways and native Modbus, OPC-UA, and REST/MQTT connectors that stream data directly without replacing existing infrastructure.',
            order: 1,
            isActive: true,
          },
          {
            question: 'Can the platform operate in remote locations with limited cellular connectivity?',
            answer: 'Yes. Our edge controllers feature battery-backed local buffering and store-and-forward architecture that caches telemetry during network dropouts and automatically syncs once connection is restored.',
            order: 2,
            isActive: true,
          },
          {
            question: 'What parameters can be monitored in real time?',
            answer: 'Flow rate, hydraulic pressure, pipe vibration, pH, turbidity, TDS, dissolved oxygen, and reservoir levels can all be streamed with sub-second frequency.',
            order: 3,
            isActive: true,
          },
        ],
        industries: [
          {
            name: 'Municipal Water Utilities',
            description: 'Monitor city-wide distribution networks, manage district metered areas (DMAs), and curb Non-Revenue Water.',
            stats: 'Up to 35% NRW Reduction',
            image: '/src/assets/about/about-journey-water-infrastructure.webp',
            icon: 'Building2',
            order: 1,
            isActive: true,
          },
          {
            name: 'Industrial Process Plants',
            description: 'Optimize cooling towers, process recycling loops, and boiler feeds with closed-loop water balances.',
            stats: '24/7 Process Continuity',
            image: '/src/assets/about/about-industrial-water-system.webp',
            icon: 'Factory',
            order: 2,
            isActive: true,
          },
          {
            name: 'Rural Water Schemes',
            description: 'Ensure equitable, uninterrupted water access across remote community distribution schemes.',
            stats: '99.8% Uptime Assurance',
            image: '/src/assets/about/about-field-verification.webp',
            icon: 'Radio',
            order: 3,
            isActive: true,
          },
          {
            name: 'Commercial Real Estate & Campuses',
            description: 'Sub-meter corporate facilities, verify tenant billing, and eliminate overnight plumbing leakages.',
            stats: 'Zero Unmetered Waste',
            image: '/src/assets/about/about-vision-water-infrastructure.webp',
            icon: 'Building',
            order: 4,
            isActive: true,
          },
        ],
        inquiryForm: {
          eyebrow: 'DIRECT INQUIRY',
          title: "Have Questions? Let's Talk.",
          description: 'Contact our engineering team to discuss operational requirements, evaluate telemetry feasibility across your network, and explore live platform capabilities.',
          responseTime: 'Direct callback from a senior water systems specialist within 24 hours.',
          confidentiality: 'Full NDA protection for your infrastructure layouts and volumetric data.',
          pocText: 'Live pilot telemetry setups available for industrial and utility networks.',
        },
        finalCta: {
          eyebrow: 'READY TO TRANSFORM',
          title: 'Ready to Gain Complete Visibility of Your',
          highlightTitle: 'Water Infrastructure?',
          description:
            'Join municipal utilities, industrial leaders, and commercial campuses already optimizing their water systems with Veenero.',
          primaryCtaText: 'Request a Demo',
          primaryCtaLink: '#inquiry-section',
          secondaryCtaText: 'Talk to an Expert',
          secondaryCtaLink: '#inquiry-section',
          contactEmail: 'solutions@veenerosolutions.com',
        },
        seo: {
          metaTitle: 'Water Visibility | Veenero - Water Management & Conservation',
          metaDescription: 'Veenero Water Visibility gives you real-time monitoring of water assets, flow, quality, and infrastructure across locations.',
          metaKeywords: 'water visibility, water telemetry, real-time water monitoring, iot water flow sensors',
          ogTitle: 'Water Visibility | Veenero Water Intelligence',
          ogDescription: 'Real-time monitoring of water assets, flow, quality, and infrastructure across locations.',
          ogImage: '/src/assets/about/about-journey-water-infrastructure.webp',
        },
        status: 'PUBLISHED',
        isFeatured: true,
        sortOrder: 1,
      },
      {
        slug: 'operational-intelligence',
        title: 'Operational Intelligence',
        shortTitle: 'Veenero Intelligence',
        shortDescription: 'AI analytics, anomaly detection, automated micro-leak detection, and pumping energy optimization.',
        icon: 'Sparkles',
        badge: 'OPERATIONAL INTELLIGENCE',
        categoryKey: 'Water Intelligence',
        tagline: {
          line1: 'Predictive Analytics.',
          line2: 'Autonomous Intelligence.',
          line3: 'Zero Surprises.',
        },
        heroDescription:
          'Transform raw telemetry streams into proactive operations with automated micro-leak detection, pressure transient analysis, and self-learning consumption baselines.',
        heroPills: ['Predictive Models', 'Autonomous Detection', 'Real-Time Action'],
        heroImage: '/src/assets/about/about-industrial-water-system.webp',
        heroImageAlt: 'Operational Intelligence Analytics Engine',
        contactEmail: 'solutions@veenerosolutions.com',
        primaryCtaText: 'Request a Demo',
        primaryCtaLink: '#inquiry-section',
        secondaryCtaText: 'Talk to an Expert',
        secondaryCtaLink: '#inquiry-section',
        heroHighlights: [
          { icon: 'Sparkles', title: 'Predictive', subtitle: 'Algorithms' },
          { icon: 'ShieldCheck', title: 'Autonomous', subtitle: 'Surveillance' },
          { icon: 'Zap', title: 'Energy', subtitle: 'Optimized' },
        ],
        heroBadgeText: {
          title: 'Predictive Intelligence',
          subtitle: 'Proactive. Deterministic. Impactful.',
          watermarkText: 'Autonomous\nWater Systems\nEngineered\nFor Resilient\nOperations',
        },
        heroMetrics: [
          {
            title: 'Anomaly Detection Rate',
            value: '99.4',
            rawValue: 99.4,
            decimals: 1,
            suffix: '%',
            subtext: 'vs manual logs',
            change: '+28.4%',
            isPositive: true,
            type: 'gauge',
            gaugePercent: 99,
          },
          {
            title: 'Response Time',
            value: '28',
            rawValue: 28,
            suffix: 's',
            subtext: 'Instant alert trigger',
            change: '-75%',
            isPositive: true,
            type: 'counter',
          },
          {
            title: 'Active Predictions',
            value: '14',
            rawValue: 14,
            subtext: 'Micro-leaks localized',
            type: 'counter',
          },
          {
            title: 'Pump Efficiency Index',
            value: '94.2',
            rawValue: 94.2,
            decimals: 1,
            suffix: '%',
            subtext: 'Energy optimized',
            change: 'Optimized',
            isPositive: true,
            type: 'status',
          },
        ],
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Intelligent Automation.',
          highlightTitle: 'Proactive Water Control.',
          description:
            'Empower operations teams with AI that spots anomalies before failures occur, optimizes pumping energy, and pinpoints micro-leaks with precision across complex distribution networks.',
          blocks: [
            {
              title: 'Micro-Leak Localization',
              description: 'Acoustic and mass-balance AI identifies sub-surface pinhole leaks before catastrophic burst.',
              icon: 'Sparkles',
            },
            {
              title: 'Pressure Transient Analysis',
              description: 'Detect destructive pressure surges and water hammer in high-velocity industrial loops.',
              icon: 'Gauge',
            },
            {
              title: 'Energy & Pump Optimization',
              description: 'Align variable frequency drives (VFD) with dynamic demand curves to slash utility power bills.',
              icon: 'Zap',
            },
            {
              title: 'Root-Cause Diagnostics',
              description: 'Automated event correlation explains why anomalies occur, not just where they occurred.',
              icon: 'Cpu',
            },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Actionable Operational AI',
          description:
            'Equip your teams with autonomous intelligence that transforms reactive maintenance into proactive control.',
          items: [
            {
              icon: 'Sparkles',
              title: 'Predictive Burst Prevention',
              description: 'Forecast pipe fatigue hotspots weeks before rupture based on cumulative pressure shocks.',
            },
            {
              icon: 'Zap',
              title: 'Pumping Energy Optimization',
              description: 'Schedule pumping cycles to take advantage of off-peak electric tariffs while maintaining head.',
            },
            {
              icon: 'Gauge',
              title: 'Transient Water Hammer Detection',
              description: 'Capture sub-second hydraulic pressure spikes caused by sudden valve closures or power trips.',
            },
            {
              icon: 'SlidersHorizontal',
              title: 'Dynamic Pressure Moderation',
              description: 'Automatically adjust pressure reducing valves (PRVs) during off-peak hours to reduce leakage volume.',
            },
          ],
        },
        useCases: {
          eyebrow: 'USE CASES',
          title: 'Engineered for Complex Hydraulic Infrastructure',
          description: 'Delivering real ROI across heavy process manufacturing, district water grids, and institutional campuses.',
          items: [
            {
              icon: 'Factory',
              title: 'Heavy Process Industry',
              description: 'Safeguard cooling tower cycles, optimize RO membranes, and stop unmetered leaks in refinery loops.',
              stats: '18% Energy Savings',
              image: '/src/assets/about/about-industrial-water-system.webp',
              order: 1,
              isActive: true,
            },
            {
              icon: 'Building2',
              title: 'Smart Municipal Distribution',
              description: 'Automate pressure management across hilly terrain, extending pipe lifespan and eliminating bursts.',
              stats: '45% Faster Resolution',
              image: '/src/assets/about/about-journey-water-infrastructure.webp',
              order: 2,
              isActive: true,
            },
          ],
        },
        howItWorks: {
          eyebrow: 'HOW IT WORKS',
          title: 'From Predictive Signals to Automated Control',
          description: 'Continuous machine learning pipelines that learn your baseline and optimize hydraulics 24/7.',
          steps: [
            {
              step: '01',
              title: 'Baseline',
              subtitle: 'Hydraulic Modeling',
              description: 'AI continuously models normal diurnal flow and pressure patterns across weather and shifts.',
              icon: 'Activity',
              order: 1,
              isActive: true,
            },
            {
              step: '02',
              title: 'Detect',
              subtitle: 'Anomaly Flagging',
              description: 'Algorithms identify deviations from expected baselines with statistical confidence scoring.',
              icon: 'Sparkles',
              order: 2,
              isActive: true,
            },
            {
              step: '03',
              title: 'Diagnose',
              subtitle: 'Root Cause Engine',
              description: 'Correlates multi-sensor telemetry to distinguish physical leaks from operational usage surges.',
              icon: 'Cpu',
              order: 3,
              isActive: true,
            },
          ],
        },
        techSection: {
          eyebrow: 'AI ENGINE ARCHITECTURE',
          title: 'Hydraulic Machine Learning at Scale',
          subtitle: 'Deterministic Physics Correlated with Statistical Learning',
          description:
            'Veenero combines real-time hydraulic physics modeling with convolutional anomaly detectors to separate normal operational noise from genuine infrastructure threats.',
          diagramSteps: [
            {
              label: 'Transient Sensor Stream',
              desc: '100Hz transient pressure sampling at critical nodes',
              icon: 'Radio',
              statusText: '100Hz Stream',
              order: 1,
              isActive: true,
            },
            {
              label: 'Baseline Model Inference',
              desc: 'Dynamic time-warping models adaptive seasonal patterns',
              icon: 'Sparkles',
              statusText: 'Inference Active',
              order: 2,
              isActive: true,
            },
          ],
        },
        features: {
          eyebrow: 'FEATURES & FUNCTIONALITY',
          title: 'Built for Mission-Critical Reliability',
          description: 'Robust, deterministic intelligence designed for utility control rooms and industrial water engineers.',
          items: [
            {
              icon: 'Sparkles',
              title: 'Self-Calibrating Baselines',
              description: 'Models self-adjust for holidays, weather shifts, and process recipe changes without manual retuning.',
              tag: 'Machine Learning',
              order: 1,
              isActive: true,
            },
            {
              icon: 'Bell',
              title: 'False-Positive Suppression',
              description: 'Multi-parameter verification eliminates alert fatigue by filtering transient operational spikes.',
              tag: 'Alert Hygiene',
              order: 2,
              isActive: true,
            },
          ],
        },
        benefits: {
          eyebrow: 'BENEFITS & IMPACT',
          title: 'Measurable Efficiency Gains',
          description: 'Quantified savings across energy, lost volume, and equipment replacement cycles.',
          metrics: [
            {
              target: 50,
              suffix: '%',
              displayRange: '45-60%',
              label: 'Faster Anomaly Resolution',
              description: 'Automated root-cause diagnostics mean maintenance technicians arrive on-site with the right tools.',
              isVerifiedOutcome: true,
              order: 1,
              isActive: true,
            },
            {
              target: 20,
              suffix: '%',
              displayRange: '15-25%',
              label: 'Pumping & Energy Savings',
              description: 'Dynamic pressure optimization and off-peak scheduling significantly lower electrical demand charges.',
              isVerifiedOutcome: true,
              order: 2,
              isActive: true,
            },
          ],
        },
        analyticsVisual: {
          eyebrow: 'AUTONOMOUS ANOMALY STREAM',
          title: 'Predictive Anomaly Dashboard',
          description: 'Live algorithm output displaying baseline deviations, classified hydraulic events, and confidence levels.',
          stats: [
            { label: 'Surveillance Active', value: '24/7', numericValue: 24, order: 1, isActive: true },
            { label: 'Anomaly Accuracy', value: '99.4', numericValue: 99.4, suffix: '%', change: '+0.4% this week', order: 2, isActive: true },
          ],
        },
        faqs: [
          {
            question: 'How quickly does the AI detect a micro-leak?',
            answer: 'Sub-surface pressure drops and flow divergence anomalies are typically classified and flagged within 60 seconds.',
            order: 1,
            isActive: true,
          },
        ],
        industries: [
          {
            name: 'Heavy Process Manufacturing',
            description: 'Safeguard cooling tower cycles and stop unmetered leaks in refinery loops.',
            stats: '18% Energy Savings',
            image: '/src/assets/about/about-industrial-water-system.webp',
            icon: 'Factory',
            order: 1,
            isActive: true,
          },
        ],
        inquiryForm: {
          eyebrow: 'DIRECT INQUIRY',
          title: "Have Questions? Let's Talk.",
          description: 'Contact our operational intelligence specialists to run a hydraulic simulation on your pipeline data.',
        },
        finalCta: {
          eyebrow: 'READY TO OPTIMIZE',
          title: 'Ready to Put AI to Work Across Your',
          highlightTitle: 'Water Operations?',
          description: 'Schedule a technical consultation to see how Veenero Operational Intelligence automates your network.',
          primaryCtaText: 'Request a Demo',
          primaryCtaLink: '#inquiry-section',
          secondaryCtaText: 'Talk to an Expert',
          secondaryCtaLink: '#inquiry-section',
          contactEmail: 'solutions@veenerosolutions.com',
        },
        seo: {
          metaTitle: 'Operational Intelligence | Veenero - Water Management & Conservation',
          metaDescription: 'Transform raw telemetry streams into proactive operations with automated micro-leak detection and pumping optimization.',
        },
        status: 'PUBLISHED',
        isFeatured: true,
        sortOrder: 2,
      },
      {
        slug: 'aqua-saver',
        title: 'Aqua Saver (Core Solution)',
        shortTitle: 'Aqua Saver',
        shortDescription: 'Water conservative device and 3D-Module engineered to monitor flow, identify leakages, and enforce water management.',
        icon: 'Droplets',
        badge: 'CORE SOLUTION: HARDWARE & SOFTWARE',
        categoryKey: 'Water Visibility',
        tagline: {
          line1: 'Engineered Precision.',
          line2: 'Zero Leak Waste.',
          line3: 'Absolute Conservation.',
        },
        heroDescription:
          'Aqua Saver and the Aqua Saver 3D-Module provide water conservative devices and software to eliminate water waste from leaks in overhead tanks, pipelines, and taps.',
        heroPills: ['Hardware Device', '3D-Module Integration', 'Water Security'],
        heroImage: '/src/assets/about/about-field-verification.webp',
        heroImageAlt: 'Aqua Saver Water Conservative Device',
        contactEmail: 'solutions@veenerosolutions.com',
        primaryCtaText: 'Request a Demo',
        primaryCtaLink: '#inquiry-section',
        secondaryCtaText: 'Talk to an Expert',
        secondaryCtaLink: '#inquiry-section',
        heroHighlights: [
          { icon: 'ShieldCheck', title: 'Eliminate', subtitle: 'Leaks' },
          { icon: 'Droplets', title: 'Hardware', subtitle: '& Software' },
          { icon: 'BarChart3', title: 'Actionable', subtitle: 'Savings' },
        ],
        heroBadgeText: {
          title: 'Aqua Saver Platform',
          subtitle: 'Proven. Reliable. Essential.',
          watermarkText: 'Zero Water Waste\nPractical Devices\nIntelligent Rules\nWater Security',
        },
        heroMetrics: [
          {
            title: 'Water Waste Prevented',
            value: '40',
            rawValue: 40,
            suffix: '%',
            subtext: 'Average leakage reduction',
            change: 'Verified',
            isPositive: true,
            type: 'counter',
          },
          {
            title: 'Response Time',
            value: '< 60',
            rawValue: 60,
            suffix: 's',
            subtext: 'Leak alert dispatch',
            type: 'counter',
          },
        ],
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Practical Hardware Devices.',
          highlightTitle: 'Intelligent Water Rules.',
          description:
            'From village roots to urban water grids, Aqua Saver was engineered to eliminate avoidable water waste across taps, overhead tanks, and underground distribution lines.',
          blocks: [
            {
              title: 'Tank Leak Detection',
              description: 'Continuous monitoring of overhead and underground reservoir integrity.',
              icon: 'Droplets',
            },
            {
              title: 'Automated Shutoff',
              description: 'Intelligent valve triggers to arrest abnormal continuous discharge.',
              icon: 'SlidersHorizontal',
            },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Comprehensive Leak Elimination Suite',
          description: 'Hardware and software working in unison to ensure not a single litre is wasted.',
          items: [
            {
              icon: 'Radio',
              title: '3D-Module Flow Sensing',
              description: 'High-precision flow monitoring calibrated for Indian infrastructure conditions.',
            },
            {
              icon: 'ShieldCheck',
              title: 'Enforced Water Rules',
              description: 'Configure automated management rules for residential, commercial, and utility sectors.',
            },
          ],
        },
        useCases: {
          eyebrow: 'DEPLOYMENT SCENARIOS',
          title: 'Scalable Across Sectors',
          description: 'From housing societies and commercial complexes to municipal networks.',
          items: [
            {
              icon: 'Building',
              title: 'Residential Societies',
              description: 'Prevent overhead tank overflows and identify persistent domestic tap seepage.',
              stats: 'Zero Overflow Waste',
              image: '/src/assets/about/about-field-verification.webp',
              order: 1,
              isActive: true,
            },
          ],
        },
        howItWorks: {
          eyebrow: 'HOW IT WORKS',
          title: 'Install. Monitor. Protect.',
          description: 'Seamless retrofit onto existing pipe plumbing with plug-and-play simplicity.',
          steps: [
            {
              step: '01',
              title: 'Retrofit',
              subtitle: 'Simple Installation',
              description: 'Install the Aqua Saver 3D-Module non-invasively onto key feed lines.',
              icon: 'Radio',
              order: 1,
              isActive: true,
            },
            {
              step: '02',
              title: 'Calibrate',
              subtitle: 'Baseline Setting',
              description: 'System automatically establishes normal daily consumption volume.',
              icon: 'Cpu',
              order: 2,
              isActive: true,
            },
          ],
        },
        techSection: {
          eyebrow: 'TECHNICAL SPECIFICATIONS',
          title: 'Engineered for Rugged Environments',
          subtitle: 'IP68 Weatherproof & Battery-Backed Reliability',
          description: 'Built to withstand demanding Indian operational conditions with minimum maintenance.',
          diagramSteps: [
            {
              label: '3D Flow Chamber',
              desc: 'Non-clogging multi-path volumetric chamber',
              icon: 'Radio',
              statusText: 'Active',
              order: 1,
              isActive: true,
            },
          ],
        },
        features: {
          eyebrow: 'FEATURES & FUNCTIONALITY',
          title: 'Practical Water Conservation',
          description: 'Every feature designed around actual field requirements.',
          items: [
            {
              icon: 'Droplets',
              title: 'Seepage Localization',
              description: 'Detect micro-drips as small as 50ml/hour before wall dampness occurs.',
              tag: 'Leak Prevention',
              order: 1,
              isActive: true,
            },
          ],
        },
        benefits: {
          eyebrow: 'BENEFITS & IMPACT',
          title: 'Immediate Savings & Peace of Mind',
          description: 'Measurable reductions in water bills and complete eradication of overflow water loss.',
          metrics: [
            {
              target: 35,
              suffix: '%',
              displayRange: '30-40%',
              label: 'Water Bill Reduction',
              description: 'Cut wasted volume and excessive pumping electricity costs immediately.',
              isVerifiedOutcome: true,
              order: 1,
              isActive: true,
            },
          ],
        },
        analyticsVisual: {
          eyebrow: 'DEVICE TELEMETRY',
          title: 'Aqua Saver Live Monitor',
          description: 'Real-time telemetry streaming from connected Aqua Saver units.',
          stats: [
            { label: 'Active Devices', value: '1,420', numericValue: 1420, order: 1, isActive: true },
          ],
        },
        faqs: [
          {
            question: 'Does Aqua Saver require cutting existing pipes?',
            answer: 'No, non-invasive ultrasonic clamp-on models are available that mount externally onto existing pipes without disrupting water flow.',
            order: 1,
            isActive: true,
          },
        ],
        industries: [
          {
            name: 'Residential Complexes',
            description: 'Overhead tank automation and individual flat sub-metering.',
            stats: '35% Water Saved',
            image: '/src/assets/about/about-field-verification.webp',
            icon: 'Building',
            order: 1,
            isActive: true,
          },
        ],
        inquiryForm: {
          eyebrow: 'DIRECT INQUIRY',
          title: "Have Questions? Let's Talk.",
          description: 'Contact our product specialists to request a demonstration of the Aqua Saver device.',
        },
        finalCta: {
          eyebrow: 'GET STARTED',
          title: 'Ready to Eliminate Water Waste with',
          highlightTitle: 'Aqua Saver?',
          description: 'Equip your facility, society, or utility with India’s dedicated water conservative hardware and software.',
          primaryCtaText: 'Request a Demo',
          primaryCtaLink: '#inquiry-section',
          secondaryCtaText: 'Talk to an Expert',
          secondaryCtaLink: '#inquiry-section',
          contactEmail: 'solutions@veenerosolutions.com',
        },
        seo: {
          metaTitle: 'Aqua Saver | Veenero Sustainable Solutions',
          metaDescription: 'Aqua Saver water conservative device and 3D-Module engineered to monitor flow and eliminate water leakages.',
        },
        status: 'PUBLISHED',
        isFeatured: true,
        sortOrder: 3,
      },
      {
        slug: 'water-accountability',
        title: 'Water Accountability',
        shortTitle: 'Veenero Insights',
        shortDescription: 'Metering, reconciliation, cross-facility benchmarking, and cost allocation across networks.',
        icon: 'ShieldCheck',
        badge: 'WATER ACCOUNTABILITY',
        categoryKey: 'Water Optimization',
        tagline: {
          line1: 'Every Drop Measured.',
          line2: 'Every Litre Accounted.',
          line3: 'Absolute Balance.',
        },
        heroDescription:
          'End unaccounted water loss and billing disputes with a connected view of your water network. Veenero brings metering, reconciliation and cost visibility together — so every litre can be traced, verified and governed.',
        heroPills: ['DMA Balancing', 'Tenant Sub-Metering', 'Audit-Ready Logs'],
        heroImage: '/src/assets/about/about-field-verification.webp',
        heroImageAlt: 'Water Accountability and Reconciliation',
        contactEmail: 'solutions@veenerosolutions.com',
        primaryCtaText: 'Request a Demo',
        primaryCtaLink: '#inquiry-section',
        secondaryCtaText: 'Talk to an Expert',
        secondaryCtaLink: '#inquiry-section',
        heroHighlights: [
          { icon: 'ShieldCheck', title: '100%', subtitle: 'Reconciliation' },
          { icon: 'BarChart3', title: 'Volumetric', subtitle: 'Accounting' },
          { icon: 'FileText', title: 'Traceable', subtitle: 'Audit Logs' },
        ],
        heroBadgeText: {
          title: 'Accountability First',
          subtitle: 'Traceable. Balanced. Governed.',
          watermarkText: 'Measured Water\nReconciled Balance\nZero Loss\nGovernance',
        },
        heroMetrics: [
          {
            title: 'Water Reconciliation Index',
            value: '99.8',
            rawValue: 99.8,
            decimals: 1,
            suffix: '%',
            subtext: 'Balanced vs incoming supply',
            change: '+14.2%',
            isPositive: true,
            type: 'gauge',
            gaugePercent: 99,
          },
        ],
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Transparent Reconciliation.',
          highlightTitle: 'Zero Billing Disputes.',
          description: 'Full accounting of inflow vs consumption across zones, facilities, and tenants with tamper-proof records.',
          blocks: [
            {
              title: 'DMA Inflow-Outflow Balance',
              description: 'Reconcile total bulk supply against aggregated consumer meters hourly.',
              icon: 'Activity',
            },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Traceable Governance for Complex Facilities',
          description: 'Reconcile bulk utility intake with departmental consumption and cooling tower evaporation.',
          items: [
            {
              icon: 'BarChart3',
              title: 'Automated Mass Balance',
              description: 'Continuously compute mass balance equations to catch unmetered diversions.',
            },
          ],
        },
        useCases: {
          eyebrow: 'USE CASES',
          title: 'Deployment Across Multiple Sectors',
          description: 'Curb Non-Revenue Water in utilities and resolve sub-meter disputes in commercial complexes.',
          items: [
            {
              icon: 'Building',
              title: 'Commercial Complexes',
              description: 'Automated tenant billing and accurate allocation of central chiller water consumption.',
              stats: 'Zero Billing Disputes',
              image: '/src/assets/about/about-field-verification.webp',
              order: 1,
              isActive: true,
            },
          ],
        },
        howItWorks: {
          eyebrow: 'HOW IT WORKS',
          title: 'From Meter Readings to Financial Certainty',
          description: 'A closed-loop reconciliation process ensuring every drop is accounted for.',
          steps: [
            {
              step: '01',
              title: 'Ingest',
              subtitle: 'Bulk & Sub-Meters',
              description: 'Aggregate readings from pulse meters, AMR, and AMI networks in real time.',
              icon: 'Radio',
              order: 1,
              isActive: true,
            },
          ],
        },
        techSection: {
          eyebrow: 'RECONCILIATION ENGINE',
          title: 'High-Integrity Data Pipelines',
          subtitle: 'Audit-Proof Financial Ledgers for Water Usage',
          description: 'Ensuring data cannot be manipulated and every entry has timestamped cryptographic provenance.',
          diagramSteps: [
            {
              label: 'Meter Aggregation',
              desc: 'Continuous ingestion across disparate meter vendors',
              icon: 'Radio',
              statusText: 'Active',
              order: 1,
              isActive: true,
            },
          ],
        },
        features: {
          eyebrow: 'FEATURES & FUNCTIONALITY',
          title: 'Built for Financial & Operational Clarity',
          description: 'Tools for facility managers, utility billing departments, and energy auditors.',
          items: [
            {
              icon: 'FileText',
              title: 'Tenant Billing Portal',
              description: 'Automated monthly PDF invoices generated with tiered consumption tariffs.',
              tag: 'Billing Automation',
              order: 1,
              isActive: true,
            },
          ],
        },
        benefits: {
          eyebrow: 'BENEFITS & IMPACT',
          title: 'Eliminate Unaccounted Water Losses',
          description: 'Convert ambiguous utility bills into verifiable departmental accountability.',
          metrics: [
            {
              target: 100,
              suffix: '%',
              displayRange: '100%',
              label: 'Reconciliation Certainty',
              description: 'Every drop accounted for across billing cycles.',
              isVerifiedOutcome: true,
              order: 1,
              isActive: true,
            },
          ],
        },
        analyticsVisual: {
          eyebrow: 'RECONCILIATION STREAM',
          title: 'Live Network Balance',
          description: 'Real-time discrepancy indicators across monitored zones.',
          stats: [
            { label: 'Reconciled Volume', value: '100%', numericValue: 100, order: 1, isActive: true },
          ],
        },
        faqs: [
          {
            question: 'Can Veenero integrate with our existing ERP for billing?',
            answer: 'Yes, pre-built SAP, Oracle, and Tally connectors export reconciled consumption data automatically.',
            order: 1,
            isActive: true,
          },
        ],
        industries: [
          {
            name: 'Commercial Real Estate',
            description: 'Tenant billing and cooling tower water audits.',
            stats: '100% Billing Accuracy',
            image: '/src/assets/about/about-field-verification.webp',
            icon: 'Building',
            order: 1,
            isActive: true,
          },
        ],
        inquiryForm: {
          eyebrow: 'DIRECT INQUIRY',
          title: "Have Questions? Let's Talk.",
          description: 'Consult with our water accounting engineers to set up a DMA balance pilot.',
        },
        finalCta: {
          eyebrow: 'READY TO ACCOUNT',
          title: 'Ready for Absolute Clarity on Your',
          highlightTitle: 'Water Consumption?',
          description: 'Connect with Veenero to eliminate billing disputes and stop unaccounted losses.',
          primaryCtaText: 'Request a Demo',
          primaryCtaLink: '#inquiry-section',
          secondaryCtaText: 'Talk to an Expert',
          secondaryCtaLink: '#inquiry-section',
          contactEmail: 'solutions@veenerosolutions.com',
        },
        seo: {
          metaTitle: 'Water Accountability | Veenero - Water Management & Conservation',
          metaDescription: 'End unaccounted water loss and billing disputes with Veenero Water Accountability.',
        },
        status: 'PUBLISHED',
        isFeatured: true,
        sortOrder: 4,
      },
      {
        slug: 'water-verification',
        title: 'Water Verification',
        shortTitle: 'Water Verification',
        shortDescription: 'Cryptographically verifiable proof of water stewardship, ESG compliance, BRSR, and GRI disclosures.',
        icon: 'ShieldCheck',
        badge: 'WATER VERIFICATION',
        categoryKey: 'Water Accountability',
        tagline: {
          line1: 'Audit-Ready Truth.',
          line2: 'Certified Assurance.',
          line3: 'Verifiable ESG.',
        },
        heroDescription:
          'Generate cryptographically verifiable proof of water stewardship, regulatory compliance, and ESG progress for BRSR, GRI, CDP, and third-party assurance auditors.',
        heroPills: ['Audit-Ready Trails', 'BRSR & GRI Ready', 'Certified Governance'],
        heroImage: '/src/assets/about/about-vision-water-infrastructure.webp',
        heroImageAlt: 'Water Verification Audit Platform',
        contactEmail: 'solutions@veenerosolutions.com',
        primaryCtaText: 'Request a Demo',
        primaryCtaLink: '#inquiry-section',
        secondaryCtaText: 'Talk to an Expert',
        secondaryCtaLink: '#inquiry-section',
        heroHighlights: [
          { icon: 'ShieldCheck', title: '100%', subtitle: 'Audit Assurance' },
          { icon: 'FileText', title: 'BRSR & GRI', subtitle: 'Compliant' },
          { icon: 'CheckCircle2', title: 'Third-Party', subtitle: 'Verified' },
        ],
        heroBadgeText: {
          title: 'Certified Truth',
          subtitle: 'Verifiable. Immutable. Compliant.',
          watermarkText: 'Certified Data\nAudit Assurance\nVerifiable ESG\nWater Security',
        },
        heroMetrics: [
          {
            title: 'Audit Assurance Index',
            value: '100',
            rawValue: 100,
            suffix: '%',
            subtext: 'Third-party verified',
            change: 'Full Assurance',
            isPositive: true,
            type: 'gauge',
            gaugePercent: 100,
          },
        ],
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Audit-Ready Governance.',
          highlightTitle: 'Verifiable ESG Disclosures.',
          description: 'Move from estimated spreadsheets to cryptographically verifiable logs for sustainability audits.',
          blocks: [
            {
              title: 'Immutable Provenance',
              description: 'Sensor data is time-stamped with cryptographic hashes to prevent post-facto modification.',
              icon: 'Lock',
            },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Enterprise ESG Assurance',
          description: 'Automated BRSR, GRI, and CDP compliance exports ready for external assurance auditors.',
          items: [
            {
              icon: 'FileText',
              title: 'One-Click Compliance Export',
              description: 'Generate standardized regulatory disclosure packs in minutes.',
            },
          ],
        },
        useCases: {
          eyebrow: 'USE CASES',
          title: 'ESG & Assurance Audits',
          description: 'Supporting corporate sustainability boards and regulatory compliance officers.',
          items: [
            {
              icon: 'Building2',
              title: 'Publicly Listed Enterprises',
              description: 'Mandatory SEBI BRSR Core water intensity and circularity reporting.',
              stats: '100% Audit Compliance',
              image: '/src/assets/about/about-vision-water-infrastructure.webp',
              order: 1,
              isActive: true,
            },
          ],
        },
        howItWorks: {
          eyebrow: 'HOW IT WORKS',
          title: 'From Raw Telemetry to Certified Report',
          description: 'A multi-step verification pipeline guaranteeing data integrity.',
          steps: [
            {
              step: '01',
              title: 'Ingest',
              subtitle: 'Tamper-Evident Capture',
              description: 'Data captured with SHA-256 signatures directly at the edge controller.',
              icon: 'Radio',
              order: 1,
              isActive: true,
            },
          ],
        },
        techSection: {
          eyebrow: 'GOVERNANCE ARCHITECTURE',
          title: 'Cryptographically Verifiable Pipelines',
          subtitle: 'Audit Trails Engineered for Statutory Scrutiny',
          description: 'Immutable ledger design ensuring full chain of custody for every water metric.',
          diagramSteps: [
            {
              label: 'Signature Engine',
              desc: 'Cryptographic hashing at the point of ingestion',
              icon: 'Lock',
              statusText: 'Active',
              order: 1,
              isActive: true,
            },
          ],
        },
        features: {
          eyebrow: 'FEATURES & FUNCTIONALITY',
          title: 'Built for Assurance Auditors',
          description: 'Transparent audit logs, parameter drill-downs, and third-party portal access.',
          items: [
            {
              icon: 'ShieldCheck',
              title: 'Auditor Read-Only Access',
              description: 'Grant external assurance teams direct access to inspect data provenance.',
              tag: 'ESG Governance',
              order: 1,
              isActive: true,
            },
          ],
        },
        benefits: {
          eyebrow: 'BENEFITS & IMPACT',
          title: 'Zero Audit Friction',
          description: 'Eliminate weeks of manual data gathering during statutory sustainability audits.',
          metrics: [
            {
              target: 90,
              suffix: '%',
              displayRange: '80-95%',
              label: 'Reduction in Audit Prep Time',
              description: 'Instant generation of audit-ready compliance reports.',
              isVerifiedOutcome: true,
              order: 1,
              isActive: true,
            },
          ],
        },
        analyticsVisual: {
          eyebrow: 'VERIFICATION STREAM',
          title: 'Audit Trail Telemetry',
          description: 'Live record validation status across monitored reporting sites.',
          stats: [
            { label: 'Validated Records', value: '100%', numericValue: 100, order: 1, isActive: true },
          ],
        },
        faqs: [
          {
            question: 'Are the reports compliant with SEBI BRSR requirements?',
            answer: 'Yes, our templates are mapped directly to SEBI BRSR Core Principle 6 indicators.',
            order: 1,
            isActive: true,
          },
        ],
        industries: [
          {
            name: 'Corporate Enterprises',
            description: 'ESG and sustainability disclosure compliance.',
            stats: 'Zero Non-Compliance',
            image: '/src/assets/about/about-vision-water-infrastructure.webp',
            icon: 'Building2',
            order: 1,
            isActive: true,
          },
        ],
        inquiryForm: {
          eyebrow: 'DIRECT INQUIRY',
          title: "Have Questions? Let's Talk.",
          description: 'Connect with our compliance team to review BRSR and ESG assurance reporting.',
        },
        finalCta: {
          eyebrow: 'READY TO VERIFY',
          title: 'Ready for Verifiable Water Stewardship',
          highlightTitle: 'and Certified ESG?',
          description: 'Partner with Veenero to build audit-proof water records.',
          primaryCtaText: 'Request a Demo',
          primaryCtaLink: '#inquiry-section',
          secondaryCtaText: 'Talk to an Expert',
          secondaryCtaLink: '#inquiry-section',
          contactEmail: 'solutions@veenerosolutions.com',
        },
        seo: {
          metaTitle: 'Water Verification | Veenero - Water Management & Conservation',
          metaDescription: 'Generate cryptographically verifiable proof of water stewardship and ESG progress with Veenero.',
        },
        status: 'PUBLISHED',
        isFeatured: true,
        sortOrder: 5,
      },
      {
        slug: 'analytics-insights',
        title: 'Analytics & Insights',
        shortTitle: 'Water Data Platform',
        shortDescription: 'Enterprise analytics, cross-facility benchmarking, forecasting, and digital backbone integration.',
        icon: 'BarChart3',
        badge: 'ANALYTICS & INSIGHTS',
        categoryKey: 'Infrastructure Layer',
        tagline: {
          line1: 'Macroscopic Clarity.',
          line2: 'Predictive Models.',
          line3: 'Network Intelligence.',
        },
        heroDescription:
          'Unify SCADA, IoT telemetry, regional watershed data, and enterprise ERP systems into an executive water intelligence command center for strategic capital planning and risk resilience.',
        heroPills: ['Enterprise Platform', 'Predictive Forecasting', 'SCADA & ERP Ready'],
        heroImage: '/src/assets/about/about-real-time-analytics.webp',
        heroImageAlt: 'Analytics and Insights Command Center',
        contactEmail: 'solutions@veenerosolutions.com',
        primaryCtaText: 'Request a Demo',
        primaryCtaLink: '#inquiry-section',
        secondaryCtaText: 'Talk to an Expert',
        secondaryCtaLink: '#inquiry-section',
        heroHighlights: [
          { icon: 'BarChart3', title: 'Enterprise', subtitle: 'Analytics' },
          { icon: 'Layers', title: 'Unified', subtitle: 'Platform' },
          { icon: 'Network', title: 'Open', subtitle: 'APIs' },
        ],
        heroBadgeText: {
          title: 'Executive Intelligence',
          subtitle: 'Strategic. Predictive. Unified.',
          watermarkText: 'Enterprise Analytics\nMacroscopic Clarity\nWatershed Intelligence\nResilience',
        },
        heroMetrics: [
          {
            title: 'Daily Data Ingestion',
            value: '50',
            rawValue: 50,
            suffix: 'M+',
            subtext: 'Telemetry events / day',
            change: '+35% Growth',
            isPositive: true,
            type: 'counter',
          },
        ],
        overview: {
          eyebrow: 'OVERVIEW',
          title: 'Unified Intelligence.',
          highlightTitle: 'Complete Command Center.',
          description: 'Single pane of glass across multi-facility operations, regional watersheds, and corporate portfolios.',
          blocks: [
            {
              title: 'Multi-Site Ingestion',
              description: 'Centralize data from thousands of sensors across facilities into one high-throughput lakehouse.',
              icon: 'Layers',
            },
          ],
        },
        capabilities: {
          eyebrow: 'KEY CAPABILITIES',
          title: 'Macroscopic Water Intelligence',
          description: 'Cross-facility efficiency index scoring, watershed stress modeling, and open REST/GraphQL connectors.',
          items: [
            {
              icon: 'BarChart3',
              title: 'Cross-Facility Benchmarking',
              description: 'Rank facilities by specific water consumption per unit output.',
            },
          ],
        },
        useCases: {
          eyebrow: 'USE CASES',
          title: 'Multi-Facility Portfolios',
          description: 'Delivering portfolio-wide transparency for corporate leadership and operations executives.',
          items: [
            {
              icon: 'Building2',
              title: 'Multinational Manufacturing',
              description: 'Cross-plant benchmarking and centralized water footprint management.',
              stats: '25% Efficiency Gain',
              image: '/src/assets/about/about-real-time-analytics.webp',
              order: 1,
              isActive: true,
            },
          ],
        },
        howItWorks: {
          eyebrow: 'HOW IT WORKS',
          title: 'From Edge Sensors to Executive Dashboard',
          description: 'Real-time telemetry pipelines feeding high-throughput analytical query engines.',
          steps: [
            {
              step: '01',
              title: 'Aggregate',
              subtitle: 'Global Ingestion',
              description: 'Sub-second event streaming into scalable cloud time-series infrastructure.',
              icon: 'Radio',
              order: 1,
              isActive: true,
            },
          ],
        },
        techSection: {
          eyebrow: 'PLATFORM ARCHITECTURE',
          title: 'High-Throughput Analytics Engine',
          subtitle: 'Designed to Process Millions of Telemetry Events Daily',
          description: 'Ultra-low latency microservices with sub-50ms query response times.',
          diagramSteps: [
            {
              label: 'Data Lakehouse',
              desc: 'Time-series storage processing millions of events per second',
              icon: 'Layers',
              statusText: 'Active',
              order: 1,
              isActive: true,
            },
          ],
        },
        features: {
          eyebrow: 'FEATURES & FUNCTIONALITY',
          title: 'Executive Decision Support',
          description: 'Simulate capital investment scenarios and identify efficiency bottlenecks across sites.',
          items: [
            {
              icon: 'TrendingUp',
              title: 'Predictive Demand Modeling',
              description: 'Forecast seasonal water consumption requirements across plants.',
              tag: 'Forecasting',
              order: 1,
              isActive: true,
            },
          ],
        },
        benefits: {
          eyebrow: 'BENEFITS & IMPACT',
          title: 'Strategic Capital Optimization',
          description: 'Identify high-impact water conservation opportunities across multiple facilities.',
          metrics: [
            {
              target: 25,
              suffix: '%',
              displayRange: '20-30%',
              label: 'Portfolio Efficiency Gain',
              description: 'Standardize best practices across top-performing plants.',
              isVerifiedOutcome: true,
              order: 1,
              isActive: true,
            },
          ],
        },
        analyticsVisual: {
          eyebrow: 'GLOBAL STREAM',
          title: 'Executive Intelligence Feed',
          description: 'Real-time throughput metrics across monitored enterprise networks.',
          stats: [
            { label: 'Ingestion Rate', value: '50M+/day', numericValue: 50, order: 1, isActive: true },
          ],
        },
        faqs: [
          {
            question: 'How many facilities can the platform support simultaneously?',
            answer: 'Our cloud architecture is horizontally scalable and handles thousands of concurrent facilities with sub-second latency.',
            order: 1,
            isActive: true,
          },
        ],
        industries: [
          {
            name: 'Industrial Portfolios',
            description: 'Multi-site benchmarking and capital planning.',
            stats: 'Portfolio-wide ROI',
            image: '/src/assets/about/about-real-time-analytics.webp',
            icon: 'Factory',
            order: 1,
            isActive: true,
          },
        ],
        inquiryForm: {
          eyebrow: 'DIRECT INQUIRY',
          title: "Have Questions? Let's Talk.",
          description: 'Request a demonstration of the Veenero Analytics & Insights platform for your enterprise.',
        },
        finalCta: {
          eyebrow: 'CONNECT WITH US',
          title: 'Ready for Macroscopic Clarity Across Your',
          highlightTitle: 'Water Infrastructure?',
          description: 'Schedule an executive walkthrough of the Veenero Analytics Platform.',
          primaryCtaText: 'Request a Demo',
          primaryCtaLink: '#inquiry-section',
          secondaryCtaText: 'Talk to an Expert',
          secondaryCtaLink: '#inquiry-section',
          contactEmail: 'solutions@veenerosolutions.com',
        },
        seo: {
          metaTitle: 'Analytics & Insights | Veenero - Water Management & Conservation',
          metaDescription: 'Unify SCADA, IoT telemetry, and ERP data into an executive water intelligence command center.',
        },
        status: 'PUBLISHED',
        isFeatured: true,
        sortOrder: 6,
      },
    ];

    for (const sol of defaultSolutions) {
      const existing = await SolutionDetailModel.findOne({ slug: sol.slug, deletedAt: null });
      if (!existing) {
        await SolutionDetailModel.create(sol);
        console.log(`[Seed] Solution Detail seeded: ${sol.title} (${sol.slug})`);
      } else {
        // Safe update missing fields only (preserve admin edits)
        let needsSave = false;
        if (!existing.howItWorks || !existing.howItWorks.steps || existing.howItWorks.steps.length === 0) {
          existing.howItWorks = sol.howItWorks as any;
          needsSave = true;
        }
        if (!existing.techSection || !existing.techSection.diagramSteps || existing.techSection.diagramSteps.length === 0) {
          existing.techSection = sol.techSection as any;
          needsSave = true;
        }
        if (!existing.features || !existing.features.items || existing.features.items.length === 0) {
          existing.features = sol.features as any;
          needsSave = true;
        }
        if (!existing.benefits || !existing.benefits.metrics || existing.benefits.metrics.length === 0) {
          existing.benefits = sol.benefits as any;
          needsSave = true;
        }
        if (!existing.analyticsVisual || !existing.analyticsVisual.stats || existing.analyticsVisual.stats.length === 0) {
          existing.analyticsVisual = sol.analyticsVisual as any;
          needsSave = true;
        }
        if (!existing.faqs || existing.faqs.length === 0) {
          existing.faqs = sol.faqs as any;
          needsSave = true;
        }
        if (!existing.industries || existing.industries.length === 0) {
          existing.industries = sol.industries as any;
          needsSave = true;
        }
        if (needsSave) {
          await existing.save();
          console.log(`[Seed] Solution Detail updated with complete sections: ${sol.title} (${sol.slug})`);
        }
      }
    }
    console.log('[Seed] Solution Details verified and synchronized.');
  } catch (error) {
    console.error('[Seed] Error seeding solution details:', (error as Error).message);
  }
}
