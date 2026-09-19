import 'dotenv/config';
import mongoose from 'mongoose';
import { SolutionDetailModel } from '../models/SolutionDetail';

async function run(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env');

  console.log('[seedAquaSaver] Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('[seedAquaSaver] Connected.');

  const updateData = {
    title: 'Aqua Saver',
    shortTitle: 'Aqua Saver',
    shortDescription:
      'Water conservative device and 3D-Module engineered to monitor flow, identify leakages, and enforce water management.',
    icon: 'Droplets',
    slug: 'aqua-saver',
    badge: 'CORE SOLUTION: HARDWARE & SOFTWARE',
    categoryKey: 'Water Visibility',
    tagline: {
      line1: 'Engineered Precision.',
      line2: 'Zero Leak Waste.',
      line3: 'Absolute Conservation.',
    },
    heroDescription:
      'Veenero’s flagship water conservation technology combining physical 3D-Module flow sensing devices and cloud management software to eliminate leaks in overhead tanks, pipeline networks, and taps.',
    heroPills: ['Patented 3D-Module', 'Automated Motor Cutoff', 'Subsurface Leak AI'],
    heroImage: '/src/assets/about/about-field-verification.webp',
    heroImageAlt: 'Aqua Saver Water Conservative Device',
    contactEmail: 'solutions@veenerosolutions.com',
    primaryCtaText: 'Request a Demo',
    primaryCtaLink: '#inquiry-section',
    secondaryCtaText: 'Talk to an Expert',
    secondaryCtaLink: '#inquiry-section',
    heroHighlights: [
      { icon: 'ShieldCheck', title: 'Award-Winning', subtitle: 'Intinta Innovator' },
      { icon: 'Cpu', title: 'Zero Cutting', subtitle: 'Rapid Retrofit' },
      { icon: 'Zap', title: 'Sub-2s Trip', subtitle: 'Auto Cutoff' },
    ],
    heroMetrics: [
      {
        title: 'Waste Reduction',
        value: '40',
        rawValue: 40,
        suffix: '%',
        subtext: 'Average water loss eliminated',
        change: 'Verified Impact',
        isPositive: true,
        type: 'gauge',
        gaugePercent: 40,
      },
      {
        title: 'Automated Shutoff',
        value: '< 2',
        rawValue: 2,
        suffix: 's',
        subtext: 'Trip latency on burst/overflow',
        change: 'Immediate',
        isPositive: true,
        type: 'counter',
      },
      {
        title: 'Tank Overflows',
        value: '0',
        rawValue: 0,
        suffix: '%',
        subtext: 'Incidents after deployment',
        change: '100% Resolved',
        isPositive: true,
        type: 'status',
      },
      {
        title: 'Pumping Electricity',
        value: '-30',
        rawValue: 30,
        suffix: '%',
        subtext: 'Saved via motor scheduling',
        change: 'Cost Reduction',
        isPositive: true,
        type: 'sparkline',
        sparklineData: [45, 42, 38, 35, 32, 30, 28],
      },
    ],
    problemSection: {
      eyebrow: 'THE PROBLEM WE SOLVE',
      title: 'The Silent Cost of',
      highlightTitle: 'Unmonitored Water Infrastructure',
      description:
        'Across residential societies, commercial facilities, and municipal networks, traditional water systems operate entirely unmonitored. By the time physical damage or bill shock is noticed, millions of litres of treated water have been irreversibly wasted.',
      impactSummary:
        'Over 40% of pumped municipal and groundwater is lost to preventable distribution leaks and unmanaged tank overflows.',
      items: [
        {
          icon: 'AlertTriangle',
          title: 'Unattended Overhead Tank Overflows',
          description:
            'Pumps running past capacity dump tens of thousands of litres across rooftops and storm drains daily, burning out motor coils and inflating society electricity bills.',
          severity: 'Critical Waste',
          impact: '20,000–50,000L lost weekly per building',
          order: 1,
          isActive: true,
        },
        {
          icon: 'Droplets',
          title: 'Silent Micro-Seepage & Wall Joint Leaks',
          description:
            'Internal plumbing cracks leak as little as 50ml/hr behind drywall and concrete risers, slowly destroying structural stability and creating severe mold hazards before surface dampness is visible.',
          severity: 'Structural Threat',
          impact: 'Undetected moisture erosion over months',
          order: 2,
          isActive: true,
        },
        {
          icon: 'Layers',
          title: 'Main Supply Line Ruptures & Burst Pipes',
          description:
            'Sudden pressure surges and aging distribution pipes rupture underground or in utility ducts, draining reservoir reserves in hours without triggering traditional alarms.',
          severity: 'High Volume Emergency',
          impact: 'Instant loss of entire reserve supply',
          order: 3,
          isActive: true,
        },
        {
          icon: 'Clock',
          title: 'Blind Operations & Zero Consumption Quotas',
          description:
            'Relying on manual valves and physical staff rounds provides no real-time telemetry, leaving facility managers blind to which line, tenant, or block is exhausting water reserves.',
          severity: 'Operational Inefficiency',
          impact: 'Zero auditability & frequent shortages',
          order: 4,
          isActive: true,
        },
      ],
    },
    overview: {
      eyebrow: 'DUAL-ENGINE ARCHITECTURE',
      title: 'Practical Hardware Devices.',
      highlightTitle: 'Intelligent Water Rules.',
      description:
        'Aqua Saver solves the water crisis by uniting rugged field hardware with automated cloud informatics. The physical 3D-Module actively senses and isolates hydraulic faults at the pipe, while the software enforces quotas and alerts engineers in real time.',
      dualEngine: {
        hardware: {
          tag: 'FIELD HARDWARE',
          title: 'Aqua Saver 3D-Module & Actuator',
          description:
            'Ruggedized, IP68 waterproof physical device engineered for Indian water conditions. Deployed directly on overhead tanks, pumps, and pipe networks without plumbing overhauls.',
          features: [
            'Non-invasive clamp-on ultrasonic & in-line multi-path flow chambers',
            'Automated solid-state motorized valve controller and pump relay cut-off',
            'Continuous vibration and acoustic micro-seepage pickup array',
            'Internal 5-year battery backup with surge-protected utility power',
          ],
        },
        software: {
          tag: 'CLOUD & EDGE PLATFORM',
          title: 'Veenero Water Management Software',
          description:
            'Central intelligence platform ingesting millisecond telemetry to model normal consumption, detect hydraulic anomalies, and coordinate maintenance.',
          features: [
            'Sub-second hydraulic anomaly detection & instant SMS/WhatsApp alerts',
            'Automated time-of-day pumping rules and multi-tank balancing',
            'Zone-wise consumption budgeting, leak localization, and isolation triggers',
            'Audit-ready ESG water balance reports & municipal compliance logs',
          ],
        },
      },
      blocks: [
        {
          title: 'Active Tank Overflow Interception',
          description: 'Level telemetry coupled directly to motor starters to eliminate overflow spillage 100%.',
          icon: 'Cpu',
        },
        {
          title: 'Micro-Drip Seepage Detection',
          description: 'Differential nighttime flow analysis isolates leaks as subtle as 50 millilitres per hour.',
          icon: 'Droplets',
        },
        {
          title: 'Motor Burnout & Dry-Run Protection',
          description: 'Instantly shuts down pumping motors if zero flow is detected to prevent coil damage.',
          icon: 'ShieldCheck',
        },
        {
          title: 'Audit-Ready Water Reconciliation',
          description: 'Certified volumetric conservation data formatted for maintenance billing and ESG filings.',
          icon: 'FileCheck',
        },
      ],
    },
    capabilities: {
      eyebrow: 'KEY CAPABILITIES',
      title: 'Comprehensive Leak Elimination Suite',
      description:
        'A complete set of specialized hardware-software capabilities tailored to end water loss across complex water grids.',
      items: [
        {
          icon: 'Radio',
          title: '3D-Module Flow Sensing',
          description:
            'Calibrated for turbid and hard water conditions with ±0.5% volumetric accuracy across fluctuating pressures.',
        },
        {
          icon: 'SlidersHorizontal',
          title: 'Automated Pump & Valve Cutoff',
          description:
            'Sub-2-second automated shutdown prevents tank overflows, burst line flooding, and pump dry-run burnouts.',
        },
        {
          icon: 'Droplets',
          title: 'Silent Micro-Seepage Localization',
          description:
            'High-sensitivity acoustic and differential algorithms detect drips down to 50ml/hour before structural dampness occurs.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Enforced Water Rules & Quotas',
          description:
            'Set automated operating windows, society-level quotas, and anti-tamper telemetry to govern water usage systematically.',
        },
        {
          icon: 'Zap',
          title: 'Multi-Channel Alert Escalation',
          description:
            'Instantaneous SMS, WhatsApp, and push notifications sent to facility managers, technicians, and administrators.',
        },
        {
          icon: 'FileCheck',
          title: 'Tamper-Proof ESG Audit Logs',
          description:
            'Complete water balance reconciliation data exported into audit-ready formats for municipal and corporate ESG filings.',
        },
      ],
    },
    howItWorks: {
      eyebrow: '6-STAGE CONSERVATION WORKFLOW',
      title: 'How Aqua Saver Eliminates Water Waste',
      description:
        'A complete closed-loop lifecycle from physical hardware retrofit to automated cutoff and verified savings auditing.',
      steps: [
        {
          step: '01',
          title: 'Rapid Retrofit & Setup',
          subtitle: 'Zero Pipe Downtime',
          description:
            'Mount the Aqua Saver 3D-Module non-invasively onto main feed lines, pumps, and overhead tanks in under 45 minutes with zero pipe cutting.',
          icon: 'Cpu',
          order: 1,
          isActive: true,
        },
        {
          step: '02',
          title: 'Continuous Surveillance',
          subtitle: 'Multi-Vector Vigilance',
          description:
            'Solid-state ultrasonic sensors monitor flow velocity, static pressure, and tank levels at millisecond intervals 24 hours a day.',
          icon: 'Activity',
          order: 2,
          isActive: true,
        },
        {
          step: '03',
          title: 'Edge Telemetry Sync',
          subtitle: 'Cellular & LoRa Ingestion',
          description:
            'Data packets are encrypted and streamed to the Veenero edge engine, establishing an authentic consumption baseline for your facility.',
          icon: 'Radio',
          order: 3,
          isActive: true,
        },
        {
          step: '04',
          title: 'Anomaly & Leak Detection',
          subtitle: 'Instant Flow Diagnosis',
          description:
            'Intelligent algorithms distinguish routine demand spikes from continuous micro-drips, line fractures, and tank overflows within seconds.',
          icon: 'Layers',
          order: 4,
          isActive: true,
        },
        {
          step: '05',
          title: 'Automated Cutoff & Alerts',
          subtitle: 'Sub-2s Trip Response',
          description:
            'Automated relays disconnect the pump motor or trigger motorized valves, immediately dispatching alerts with exact leak coordinates.',
          icon: 'SlidersHorizontal',
          order: 5,
          isActive: true,
        },
        {
          step: '06',
          title: 'Audited Conservation',
          subtitle: 'Verifiable ESG Metrics',
          description:
            'Volumetric savings and electricity reductions are compiled into transparent reports for society committees, audits, and ESG compliance.',
          icon: 'ShieldCheck',
          order: 6,
          isActive: true,
        },
      ],
    },
    techSection: {
      eyebrow: 'TECHNICAL ARCHITECTURE & HARDWARE SPECS',
      title: 'Engineered for Demanding',
      subtitle: 'Indian Water Infrastructure',
      description:
        'Built to withstand voltage fluctuations, silty water, high humidity, and erratic power grids with zero compromise on measurement accuracy.',
      diagramSteps: [
        {
          label: 'Sensing Chamber',
          desc: 'Non-clogging multi-path volumetric acoustic sensors resistant to scaling and silt.',
          icon: 'Radio',
          statusText: 'Active',
          order: 1,
          isActive: true,
        },
        {
          label: 'Edge Controller',
          desc: 'Dual-core microcontroller executing offline anomaly detection and motor relay cutoff.',
          icon: 'Cpu',
          statusText: 'Active',
          order: 2,
          isActive: true,
        },
        {
          label: 'Secure Gateway',
          desc: 'Dual-band NB-IoT / 4G and LoRaWAN connectivity with local offline data buffering.',
          icon: 'Lock',
          statusText: 'Active',
          order: 3,
          isActive: true,
        },
        {
          label: 'Cloud Engine',
          desc: 'Veenero water intelligence cloud providing real-time dashboards and automated dispatch.',
          icon: 'Network',
          statusText: 'Active',
          order: 4,
          isActive: true,
        },
      ],
    },
    features: {
      eyebrow: 'CORE SPECIFICATIONS',
      title: 'Engineered for Complete Water Protection',
      description: 'Every hardware and software feature designed around practical facility demands.',
      items: [
        {
          icon: 'Gauge',
          title: 'Non-Invasive Clamp-On Option',
          description:
            'Mounts directly onto existing PVC, GI, or HDPE lines in 45 minutes with zero pipe cutting or supply shutdown.',
          tag: 'Zero Downtime',
          order: 1,
          isActive: true,
        },
        {
          icon: 'Cpu',
          title: 'Integrated Motor Starter Interface',
          description:
            'Compatible with single-phase and three-phase motor starters, providing overload and dry-run safety tripping.',
          tag: 'Motor Protection',
          order: 2,
          isActive: true,
        },
        {
          icon: 'Activity',
          title: 'Minimum Night Flow (MNF) Analysis',
          description:
            'Automatically tracks base night flows between 2 AM and 4 AM to uncover hidden underground seepage.',
          tag: 'Seepage AI',
          order: 3,
          isActive: true,
        },
        {
          icon: 'Shield',
          title: 'IP68 Weatherproof Submersible',
          description:
            'Hermetically sealed enclosures withstand heavy monsoon rain, flooded valve pits, and humid basements.',
          tag: 'Rugged Design',
          order: 4,
          isActive: true,
        },
        {
          icon: 'Radio',
          title: '5-Year Battery Autonomy',
          description:
            'Internal military-grade Li-SOCl2 battery ensures continuous operation even during multi-day power outages.',
          tag: 'Fail-Safe',
          order: 5,
          isActive: true,
        },
        {
          icon: 'CheckCircle2',
          title: 'Multi-Tank Wireless Synchronization',
          description:
            'Synchronizes supply across underground sumps and multiple overhead tanks to prevent uneven distribution.',
          tag: 'Multi-Tank',
          order: 6,
          isActive: true,
        },
      ],
    },
    benefits: {
      eyebrow: 'MEASURABLE VALUE & IMPACT',
      title: 'Quantifiable Conservation Metrics',
      description: 'Proven results backed by field deployments across residential societies, institutions, and utilities.',
      metrics: [
        {
          target: 40,
          decimals: 0,
          suffix: '%',
          displayRange: '35-40%',
          label: 'Water Waste Prevented',
          description: 'Average volumetric loss eliminated across pipeline joints, tap drips, and overflow incidents.',
          isVerifiedOutcome: true,
          order: 1,
          isActive: true,
        },
        {
          target: 2,
          decimals: 0,
          prefix: '< ',
          suffix: 's',
          displayRange: '< 2s',
          label: 'Automated Trip Latency',
          description: 'Instant pump shutoff or motorized valve trip upon detecting abnormal discharge or overflow.',
          isVerifiedOutcome: true,
          order: 2,
          isActive: true,
        },
        {
          target: 100,
          decimals: 0,
          suffix: '%',
          displayRange: '100%',
          label: 'Overflow Spillage Eliminated',
          description: 'Completely eradicates overhead tank overflow spills through automated motor controller triggers.',
          isVerifiedOutcome: true,
          order: 3,
          isActive: true,
        },
        {
          target: 30,
          decimals: 0,
          suffix: '%',
          displayRange: '25-30%',
          label: 'Pumping Electricity Saved',
          description: 'Eliminates redundant pumping runtimes and optimizes motor efficiency based on real-time reservoir levels.',
          isVerifiedOutcome: true,
          order: 4,
          isActive: true,
        },
        {
          target: 4,
          decimals: 0,
          suffix: ' Mos',
          displayRange: '3-6 Mos',
          label: 'Typical Payback Period',
          description: 'Rapid return on investment achieved through eliminated water tanker purchases and reduced power bills.',
          isVerifiedOutcome: true,
          order: 5,
          isActive: true,
        },
        {
          target: 2,
          decimals: 0,
          suffix: ' Yrs',
          displayRange: '2 Consecutive',
          label: 'Intinta Innovator Awards',
          description: 'Recognized by state innovation authorities for outstanding grassroots water conservation hardware.',
          isVerifiedOutcome: true,
          order: 6,
          isActive: true,
        },
      ],
    },
    analyticsVisual: {
      eyebrow: 'LIVE TELEMETRY STREAM',
      title: 'Aqua Saver Field Telemetry Command Stream',
      description:
        'Simulated real-time monitoring of connected Aqua Saver modules across distribution zones and overhead tanks.',
      stats: [
        { label: 'Active Monitored Lines', value: '1,420+', numericValue: 1420, change: 'All Units Healthy', order: 1, isActive: true },
        { label: 'Daily Water Saved', value: '2.4M L', numericValue: 2.4, suffix: 'M Litres', change: '+12.4% vs Baseline', order: 2, isActive: true },
        { label: 'Mean Trip Response', value: '1.4s', numericValue: 1.4, suffix: 's', change: 'Sub-2s Threshold', order: 3, isActive: true },
        { label: 'System Uptime', value: '99.94%', numericValue: 99.94, suffix: '%', change: 'High Availability', order: 4, isActive: true },
      ],
    },
    useCases: {
      eyebrow: 'DEPLOYMENT SCENARIOS',
      title: 'Proven Across Critical Water Infrastructure',
      description: 'Tailored deployment architectures engineered for diverse hydraulic networks and structural layouts.',
      items: [
        {
          icon: 'Building',
          title: 'Residential Societies & High-Rises',
          description:
            'Automate overhead tank pumping, prevent terrace overflows, protect motor coils from dry-runs, and identify plumbing seepage across vertical risers.',
          stats: 'Zero Tank Overflows',
          image: '/src/assets/about/about-field-verification.webp',
          order: 1,
          isActive: true,
        },
        {
          icon: 'Building',
          title: 'Commercial & IT Tech Parks',
          description:
            'Continuous vigilance over multi-floor plumbing stacks, cafeteria lines, cooling tower feeds, and washroom batteries, saving millions of litres per month.',
          stats: '450kL Saved Monthly',
          image: '/src/assets/about/about-industrial-water-system.webp',
          order: 2,
          isActive: true,
        },
        {
          icon: 'ShieldCheck',
          title: 'Healthcare & Educational Campuses',
          description:
            'Ensure non-stop potable water availability, enforce time-based distribution schedules, and pinpoint hidden underground leaks between decentralized blocks.',
          stats: '99.8% Supply Uptime',
          image: '/src/assets/about/about-journey-water-infrastructure.webp',
          order: 3,
          isActive: true,
        },
        {
          icon: 'Cpu',
          title: 'Industrial Plants & Utility Networks',
          description:
            'High-pressure process water monitoring, rapid line fracture isolation, raw water intake balancing, and audit-ready ESG water accounting.',
          stats: '35% NRW Reduction',
          image: '/src/assets/about/about-vision-water-infrastructure.webp',
          order: 4,
          isActive: true,
        },
      ],
    },
    faqs: [
      {
        question: 'Does installing Aqua Saver require cutting existing pipes or shutting down the water supply?',
        answer:
          'No. Aqua Saver offers a non-invasive ultrasonic clamp-on 3D-Module that mounts onto the outside of your existing pipes (PVC, GI, HDPE, or MS) without cutting pipes or disrupting the water supply. Standard installation takes under 45 minutes. For new constructions or high-precision industrial lines, in-line volumetric chambers are also available.',
        order: 1,
        isActive: true,
      },
      {
        question: 'How does Aqua Saver prevent pump motor burnouts and dry runs?',
        answer:
          'The Aqua Saver controller connects to your pump motor starter panel. If the overhead tank reaches maximum safe capacity, it triggers an instant motor cut-off to prevent overflows. Conversely, if the pump is switched on but flow sensors detect zero water movement within 30 seconds (dry-run condition), it automatically trips the motor to prevent catastrophic coil overheating and bearing damage.',
        order: 2,
        isActive: true,
      },
      {
        question: 'Can Aqua Saver function during power cuts and in remote pump houses?',
        answer:
          'Yes. Aqua Saver units incorporate an internal military-grade Li-SOCl2 battery backup designed for up to 5 years of continuous sensor operation. Telemetry communicates over cellular (NB-IoT/4G) or LoRaWAN. If network reception is temporarily disrupted, on-device non-volatile memory buffers telemetry data and syncs automatically once connectivity returns.',
        order: 3,
        isActive: true,
      },
      {
        question: 'How sensitive is the micro-seepage detection? Can it detect small tap drips?',
        answer:
          'Aqua Saver’s 3D-Module combines differential pressure analysis and acoustic vibration sensing to detect continuous fluid movement as low as 50 millilitres per hour. It automatically performs Minimum Night Flow (MNF) analysis during low-demand hours (2 AM – 4 AM), identifying persistent fixture leaks and behind-wall pipe fractures before moisture causes structural damage.',
        order: 4,
        isActive: true,
      },
      {
        question: 'What kind of reports does Aqua Saver generate for society committees or ESG audits?',
        answer:
          'The platform generates automated monthly PDF and CSV reports displaying total water consumed, litres saved by leak intervention, electricity saved from motor optimization, and complete volumetric reconciliation logs. These documents are audit-ready for society Annual General Meetings (AGMs), municipal compliance, and corporate ESG sustainability disclosures.',
        order: 5,
        isActive: true,
      },
    ],
    inquiryForm: {
      eyebrow: 'DIRECT INQUIRY',
      badge: 'DIRECT INQUIRY',
      title: "Have Questions? Let's Talk.",
      description:
        'Contact our engineering team to discuss operational requirements, evaluate telemetry feasibility across your network, and explore live platform capabilities for Aqua Saver.',
      subtitle:
        'Contact our engineering team to discuss operational requirements, evaluate telemetry feasibility across your network, and explore live platform capabilities for Aqua Saver.',
      responseTime: 'Direct callback from a senior water systems specialist within 24 hours.',
      confidentiality: 'Full NDA protection for your infrastructure layouts and volumetric data.',
      pocText: 'Live pilot telemetry setups available for industrial and utility networks.',
    },
    finalCta: {
      eyebrow: 'READY FOR ZERO WATER WASTE',
      title: 'Ready to Protect Your Infrastructure with',
      highlightTitle: 'Aqua Saver?',
      description:
        'Join hundreds of forward-thinking facilities, housing societies, and industrial networks using Veenero to eliminate water waste and safeguard every drop.',
      primaryCtaText: 'Request a Demo',
      secondaryCtaText: 'Talk to an Expert',
    },
    status: 'PUBLISHED',
  };

  const res = await SolutionDetailModel.findOneAndUpdate(
    { slug: 'aqua-saver' },
    { $set: updateData },
    { new: true, upsert: true }
  );

  console.log(`[seedAquaSaver] ✓ Successfully updated Aqua Saver record in MongoDB (id: ${res._id})`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('[seedAquaSaver] Error:', err);
  process.exit(1);
});
