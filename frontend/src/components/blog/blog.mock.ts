import { Article } from './types';

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Making Every Litre Visible: The Rise of Water Intelligence',
    slug: 'making-every-litre-visible-the-rise-of-water-intelligence',
    category: 'Water Intelligence',
    excerpt: 'How real-time telemetry, data verification, and cloud platforms are changing the way cities and industries manage water.',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=800&auto=format&fit=crop',
    date: '17 August 2026',
    readingTime: '6 min read',
    author: 'Veenero Insights',
    featured: true,
    content: `
Water is our most critical resource, yet it is often the least measured. In an era where carbon emissions are tracked in real-time and supply chains are optimized down to the millisecond, our management of water has lagged behind. Today, a new paradigm is emerging: Water Intelligence.

By combining IoT sensors, real-time telemetry, and advanced verification algorithms, organizations can now transition from estimation to absolute visibility.

## The Cost of Water Invisibility

Historically, water consumption has been measured through monthly or quarterly billing cycles. While this shows overall volume, it hides critical operational details:

- **Undetected Leaks**: Small pipe ruptures can leak thousands of litres daily before showing visible signs.
- **Consumption Surges**: Without real-time tracking, identifying high-demand peaks or anomalous usage is nearly impossible.
- **Zero Accountability**: In industrial settings, local managers lack the granularity required to enforce efficiency benchmarks.

## The Pillars of Water Intelligence

Water Intelligence goes beyond simple metering. It relies on a continuous loop of data collection, validation, and analytics:

1. **IoT Telemetry**: Ultrasonic and electromagnetic flow sensors capture volume, velocity, and pressure at source, distribution, and consumption points.
2. **Cloud Serialization**: Sensor telemetry is serialized (e.g. via MQTT) and securely transmitted to cloud processing nodes.
3. **Data Verification**: Algorithmic validation filters telemetry anomalies, ensuring that sensor drifts or transient outages do not skew analytics.

## Shifting from Measurement to Action

The ultimate goal of Water Intelligence is action. Real-time dashboards enable operations teams to isolate water loss within minutes rather than weeks. In industrial sectors, this translates directly to carbon footprint reduction and true sustainability compliance.

As climate volatility shifts regional water tables, making every litre visible is no longer just an environmental goal—it is an operational necessity.
    `
  },
  {
    id: '2',
    title: 'Why Water Visibility Matters for Modern Infrastructure',
    slug: 'why-water-visibility-matters-for-modern-infrastructure',
    category: 'Water Intelligence',
    excerpt: 'Smart cities and buildings require high-fidelity telemetry to prevent water loss and optimize complex distribution networks.',
    image: 'https://images.unsplash.com/photo-1548811295-3cbe94ab6c6c?q=80&w=600&auto=format&fit=crop',
    date: '15 August 2026',
    readingTime: '4 min read',
    author: 'Veenero Insights',
    featured: false,
    content: `
Modern municipal infrastructure is facing unprecedented stress. High density urbanization, aging pipe systems, and shifting hydrological profiles make water delivery highly complex. To keep up, cities must integrate real-time water visibility directly into their management layers.

## The Infrastructure Blindspot

Most distribution networks lose up to 30% of their treated water before it reaches consumer taps. This is known as Non-Revenue Water (NRW). 

- **Pressure Variations**: Excess pressure leads to pipe leaks; inadequate pressure limits distribution.
- **Dynamic Demand**: Traditional planning cannot handle the hourly spikes of mega-cities.

## Implementing Visibility

By introducing inline telemetry nodes, infrastructure managers can partition distribution networks into District Metered Areas (DMAs). By comparing net inlet volumes against total consumer outlets within the DMA, managers can pinpoint leakage zones immediately.
    `
  },
  {
    id: '3',
    title: 'From Measurement to Action: Building Smarter Water Systems',
    slug: 'from-measurement-to-action-building-smarter-water-systems',
    category: 'Technology',
    excerpt: 'Exploring the technical stack behind real-time telemetry pipelines, from edge sensors to cloud analytics.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
    date: '10 August 2026',
    readingTime: '5 min read',
    author: 'Tech & Engineering Layer',
    featured: false,
    content: `
Building an automated water intelligence platform requires a specialized technology stack. Sensors must endure harsh field conditions, consume minimal battery power, and transmit telemetry securely across cellular bands.

## The Hardware Layer

Veenero uses electromagnetic and ultrasonic sensors because they lack moving parts, eliminating wear and drift over time. 

- **Modbus/RS485 Interfaces**: These protocols transmit sensor data directly to custom IoT transmission nodes.
- **NB-IoT & LTE-M**: Narrowband communication ensures that nodes buried underground or inside concrete basements retain network links.

## The Telemetry Data Pipeline

Once telemetry is broadcast from the field, it passes through an ingestion server to serialization microservices:

1. **Ingestion Engine**: Handlers parse packet payloads and validate checksum integrity.
2. **Time-Series Datastore**: Telemetry is indexed in high-performance databases suited for quick data visualizations.
3. **API & Visualization**: React clients render telemetry charts, tracking flow rates and pressure metrics in real-time.
    `
  },
  {
    id: '4',
    title: 'How Data Can Help Reduce Industrial Water Loss',
    slug: 'how-data-can-help-reduce-industrial-water-loss',
    category: 'Sustainability',
    excerpt: 'Industries consume massive amounts of water. See how tracking process water yields dramatic conservation improvements.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
    date: '05 August 2026',
    readingTime: '7 min read',
    author: 'Sustainability Board',
    featured: false,
    content: `
Industrial processes—ranging from chemical processing to food production—account for a major portion of global freshwater consumption. Yet, few industrial sites can trace water consumption down to individual machinery or specific manufacturing loops.

## Mapping Process Water

To save water, factories must map their entire manufacturing blueprint:

- **Boiler Feed**: Tracking steam losses and condensate returns.
- **Cooling Towers**: Measuring evaporation and blowdown metrics.
- **Product Integration**: Verifying water used directly in final products.

## The Conservation Yield

When factories deploy dedicated inline telemetry on these loops, they discover critical anomalies. For example, cooling systems operating during production downtime or boilers leaking steam. Fixing these issues reduces industrial water bills and aligns corporations with ESG compliance guidelines.
    `
  },
  {
    id: '5',
    title: 'The Role of Verification in Responsible Water Management',
    slug: 'the-role-of-verification-in-responsible-water-management',
    category: 'Water Verification',
    excerpt: 'Why unverified water data is a liability, and how cryptographic proof secures sustainability reporting.',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600&auto=format&fit=crop',
    date: '28 July 2026',
    readingTime: '5 min read',
    author: 'Governance & Auditing',
    featured: false,
    content: `
Greenwashing is a growing challenge in ESG disclosures. Assertions like "Water Neutrality" or "30% Water Saved" are often calculated using loose spreadsheets and general assumptions. Without audit trails, water metrics lack credibility.

## The Spread of Sensor Errors

Flow meters in the field face issues like signal drifts, mineral scaling, and power failures. If raw data is copied directly to corporate reports without verification, anomalies skew calculations.

## Building Proof-of-Concept Verification

To guarantee data trust, we need independent verification:

- **Telemetry Checks**: Comparing inflow parameters against outflow metrics to flag anomalies.
- **Cryptographic Logging**: Writing verified logs to secure ledgers to create tamper-proof data records.
- **Third-Party Integrations**: Allowing auditors to trace dashboard data directly to source sensors.
    `
  },
  {
    id: '6',
    title: 'Building a Data-Driven Water Future for India',
    slug: 'building-a-data-driven-water-future-for-india',
    category: 'Industry',
    excerpt: 'Addressing national water supply challenges through data standards, open hardware, and shared intelligence.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop',
    date: '20 July 2026',
    readingTime: '6 min read',
    author: 'Veenero Leadership',
    featured: false,
    content: `
India faces one of the world's most acute water challenges. Ground water levels are falling, monsoon patterns are shifting, and water distribution is highly uneven. Standard supply measures are no longer sufficient—we must build a data-driven water ecosystem.

## Setting Data Standards

Water management is currently fragmented across multiple regional departments, water boards, and private agencies. Each uses different, incompatible data systems. 

- **Unified Schemas**: Setting standard formats for flow rate, pressure, and quality parameters.
- **Open APIs**: Allowing developers to build water-saving apps using public telemetry datasets.

## The Path Forward

By deploying smart telemetry networks and making the datasets public, we can empower communities, farmers, and municipal leaders to make data-driven decisions that ensure a sustainable water future.
    `
  },
  {
    id: '7',
    title: 'Understanding Water Consumption Through Real-Time Analytics',
    slug: 'understanding-water-consumption-through-real-time-analytics',
    category: 'Insights',
    excerpt: 'An analysis of water telemetry trends across commercial offices, multi-tenant residential complexes, and retail centers.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    date: '12 July 2026',
    readingTime: '4 min read',
    author: 'Data Science Division',
    featured: false,
    content: `
How do large commercial offices and residential buildings consume water? By analyzing real-time flow telemetry across corporate centers, we can uncover patterns in usage behavior.

## Commercial Buildings vs. Residential

Usage profiles show distinct operational cycles:

- **Commercial Buildings**: Sharp usage peaks at 9 AM, 1 PM, and 6 PM. Nighttime usage should approach zero. If flow rates remain elevated overnight, it indicates cooling leaks or running taps.
- **Residential Complexes**: Smooth double-peak distribution (morning and evening) with a steady baseline overnight.

## Data-Driven Optimization

By tracking these curves, facilities managers can adjust municipal storage pumping schedules, optimize cooling tower cycles, and detect tenant water leaks in real-time.
    `
  }
];
