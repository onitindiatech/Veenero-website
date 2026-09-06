import React from "react";

interface IconProps {
  className?: string;
}

/**
 * 1. Rugged Edge Telemetry
 * Concept: Central water droplet with subtle telemetry/signal waves radiating outward
 */
export const RuggedEdgeTelemetryIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} overflow-visible`}
  >
    <style>{`
      @keyframes edge-telemetry-ping {
        0%, 100% { opacity: 0.3; transform: scale(0.95); }
        50% { opacity: 1; transform: scale(1); }
      }
      @keyframes edge-telemetry-outer {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.85; }
      }
      .edge-wave-inner {
        transform-origin: 12px 13px;
        animation: edge-telemetry-ping 2.6s ease-in-out infinite;
      }
      .edge-wave-outer {
        animation: edge-telemetry-outer 2.6s ease-in-out infinite 0.4s;
      }
      @media (prefers-reduced-motion: reduce) {
        .edge-wave-inner, .edge-wave-outer { animation: none !important; }
      }
    `}</style>
    {/* Inner telemetry arcs */}
    <path d="M6 10.5 A6.5 6.5 0 0 0 6 16.5" className="edge-wave-inner stroke-teal-500/80 dark:stroke-teal-400" />
    <path d="M18 10.5 A6.5 6.5 0 0 1 18 16.5" className="edge-wave-inner stroke-teal-500/80 dark:stroke-teal-400" />

    {/* Outer telemetry signal arcs */}
    <path d="M3.5 8 A10.5 10.5 0 0 0 3.5 19" className="edge-wave-outer stroke-teal-600/50 dark:stroke-teal-300/50" />
    <path d="M20.5 8 A10.5 10.5 0 0 1 20.5 19" className="edge-wave-outer stroke-teal-600/50 dark:stroke-teal-300/50" />

    {/* Center Water Droplet */}
    <path
      d="M12 4.5 C12 4.5 8.5 9 8.5 12.8 A3.5 3.5 0 0 0 15.5 12.8 C15.5 9 12 4.5 12 4.5 Z"
      className="fill-teal-500/15 stroke-teal-700 dark:stroke-teal-300"
    />
    {/* Core Sensor / Telemetry Node */}
    <circle cx="12" cy="13" r="1.2" className="fill-teal-600 dark:fill-teal-400 stroke-none" />
  </svg>
);

/**
 * 2. Real-Time Flow & Pressure
 * Concept: Flowing water / wave streamline with an integrated pressure dial & micro-needle oscillation
 */
export const RealTimeFlowPressureIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} overflow-visible`}
  >
    <style>{`
      @keyframes needle-oscillate {
        0%, 100% { transform: rotate(-8deg); }
        50% { transform: rotate(8deg); }
      }
      @keyframes wave-stream {
        0%, 100% { stroke-dashoffset: 0; }
        50% { stroke-dashoffset: 3; }
      }
      .gauge-needle {
        transform-origin: 17px 7px;
        animation: needle-oscillate 2.4s ease-in-out infinite;
      }
      .flow-stream {
        animation: wave-stream 3s ease-in-out infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .gauge-needle, .flow-stream { animation: none !important; }
      }
    `}</style>
    {/* Upper Pressure Gauge */}
    <circle cx="17" cy="7" r="4.2" className="stroke-teal-700 dark:stroke-teal-300 fill-teal-500/10" />
    <path d="M14.5 6 A2.8 2.8 0 0 1 19.5 6" className="stroke-teal-500/70" strokeWidth="1.2" />
    {/* Gauge Needle */}
    <line x1="17" y1="7" x2="18.8" y2="5.2" className="gauge-needle stroke-teal-700 dark:stroke-teal-200" strokeWidth="1.8" />
    <circle cx="17" cy="7" r="0.8" className="fill-teal-700 dark:fill-teal-200 stroke-none" />

    {/* Primary Flowing Water Wave Stream */}
    <path
      d="M2.5 17.5 C5.5 15, 8.5 20, 11.5 17.5 C14.5 15, 17.5 19.5, 21.5 17"
      className="flow-stream stroke-teal-700 dark:stroke-teal-300"
    />
    {/* Secondary Water Wave Stream */}
    <path
      d="M2.5 13 C5 11, 7.5 14.5, 10 13 C12 11.8 13.5 13 15 13.5"
      className="stroke-teal-500/60 dark:stroke-teal-400/60"
      strokeWidth="1.5"
    />

    {/* Incoming Water Drop */}
    <path
      d="M6 4.5 C6 4.5 4.5 6.2 4.5 7.5 A1.5 1.5 0 0 0 7.5 7.5 C7.5 6.2 6 4.5 6 4.5 Z"
      className="fill-teal-500/20 stroke-teal-600 dark:stroke-teal-400"
      strokeWidth="1.4"
    />
  </svg>
);

/**
 * 3. Cryptographic Integrity
 * Concept: Water droplet enclosed with a subtle shield / cryptographic checkmark
 */
export const CryptographicIntegrityIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} overflow-visible`}
  >
    <style>{`
      @keyframes shield-glow {
        0%, 100% { opacity: 0.85; }
        50% { opacity: 1; }
      }
      @keyframes check-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      .crypto-shield {
        animation: shield-glow 3s ease-in-out infinite;
      }
      .crypto-check {
        transform-origin: 12px 13px;
        animation: check-pulse 3s ease-in-out infinite 0.5s;
      }
      @media (prefers-reduced-motion: reduce) {
        .crypto-shield, .crypto-check { animation: none !important; }
      }
    `}</style>
    {/* Cryptographic Shield Perimeter */}
    <path
      d="M12 2.5 L4.5 5.5 V10.8 C4.5 15.5 7.7 19.3 12 21 C16.3 19.3 19.5 15.5 19.5 10.8 V5.5 L12 2.5 Z"
      className="crypto-shield stroke-teal-700 dark:stroke-teal-300 fill-teal-500/5"
    />

    {/* Pure Water Droplet inside Shield */}
    <path
      d="M12 6.8 C12 6.8 8.8 10.5 8.8 12.8 A3.2 3.2 0 0 0 15.2 12.8 C15.2 10.5 12 6.8 12 6.8 Z"
      className="fill-teal-500/20 stroke-teal-600 dark:stroke-teal-400"
      strokeWidth="1.5"
    />

    {/* Verification Cryptographic Checkmark */}
    <path
      d="M10.2 13 L11.5 14.3 L14 11.5"
      className="crypto-check stroke-teal-700 dark:stroke-teal-200"
      strokeWidth="2"
    />
  </svg>
);

/**
 * 4. AI Micro-Leak Detection
 * Concept: Water droplet with an active precision scanning / acoustic radar effect
 */
export const AIMicroLeakIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} overflow-visible`}
  >
    <style>{`
      @keyframes radar-sweep {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes sonar-ring {
        0% { opacity: 0.2; transform: scale(0.9); }
        50% { opacity: 0.8; transform: scale(1.05); }
        100% { opacity: 0.2; transform: scale(0.9); }
      }
      .radar-needle {
        transform-origin: 12px 13px;
        animation: radar-sweep 5s linear infinite;
      }
      .sonar-pulse {
        transform-origin: 12px 13px;
        animation: sonar-ring 2.8s ease-in-out infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .radar-needle, .sonar-pulse { animation: none !important; }
      }
    `}</style>
    {/* Micro-leak Sonar Radar Ring */}
    <circle
      cx="12"
      cy="13"
      r="6.5"
      className="sonar-pulse stroke-teal-500/40 dark:stroke-teal-400/40"
      strokeWidth="1.2"
      strokeDasharray="2 2"
    />

    {/* Central Water Droplet */}
    <path
      d="M12 4 C12 4 8 9 8 13 A4 4 0 0 0 16 13 C16 9 12 4 12 4 Z"
      className="fill-teal-500/15 stroke-teal-700 dark:stroke-teal-300"
    />

    {/* Radar Scan Vector Line */}
    <line x1="12" y1="13" x2="16.5" y2="9.5" className="radar-needle stroke-teal-600 dark:stroke-teal-200" strokeWidth="1.6" />

    {/* Acoustic Micro-Leak Alert Point */}
    <circle cx="12" cy="13" r="1.3" className="fill-teal-700 dark:fill-teal-300 stroke-none" />
    <circle cx="12" cy="20.5" r="0.9" className="fill-teal-500 dark:fill-teal-400 stroke-none opacity-80" />
  </svg>
);

/**
 * 5. Multi-Site Benchmarking / Performance Intelligence
 * Concept: Connected water nodes / flow network exchanging benchmark metrics
 */
export const MultiSiteBenchmarkIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} overflow-visible`}
  >
    <style>{`
      @keyframes node-pulse-1 {
        0%, 100% { opacity: 0.6; }
        33% { opacity: 1; }
      }
      @keyframes node-pulse-2 {
        0%, 100% { opacity: 0.6; }
        66% { opacity: 1; }
      }
      @keyframes node-pulse-3 {
        0%, 100% { opacity: 0.6; }
        99% { opacity: 1; }
      }
      .node-1 { animation: node-pulse-1 3s ease-in-out infinite; }
      .node-2 { animation: node-pulse-2 3s ease-in-out infinite; }
      .node-3 { animation: node-pulse-3 3s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .node-1, .node-2, .node-3 { animation: none !important; }
      }
    `}</style>
    {/* Pipeline Network Connections */}
    <path d="M12 6.5 L6.5 15.5" className="stroke-teal-500/50" strokeWidth="1.4" strokeDasharray="2 1.5" />
    <path d="M12 6.5 L17.5 15.5" className="stroke-teal-500/50" strokeWidth="1.4" strokeDasharray="2 1.5" />
    <path d="M8 17 H16" className="stroke-teal-500/50" strokeWidth="1.4" />

    {/* Top Site Water Node */}
    <g className="node-1">
      <path
        d="M12 2 C12 2 10.2 4.2 10.2 5.5 A1.8 1.8 0 0 0 13.8 5.5 C13.8 4.2 12 2 12 2 Z"
        className="fill-teal-500/20 stroke-teal-700 dark:stroke-teal-300"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="5.5" r="0.7" className="fill-teal-700 dark:fill-teal-200 stroke-none" />
    </g>

    {/* Bottom Left Site Water Node */}
    <g className="node-2">
      <path
        d="M5.5 13.5 C5.5 13.5 3.7 15.7 3.7 17 A1.8 1.8 0 0 0 7.3 17 C7.3 15.7 5.5 13.5 5.5 13.5 Z"
        className="fill-teal-500/20 stroke-teal-700 dark:stroke-teal-300"
        strokeWidth="1.5"
      />
      <circle cx="5.5" cy="17" r="0.7" className="fill-teal-700 dark:fill-teal-200 stroke-none" />
    </g>

    {/* Bottom Right Site Water Node */}
    <g className="node-3">
      <path
        d="M18.5 13.5 C18.5 13.5 16.7 15.7 16.7 17 A1.8 1.8 0 0 0 20.3 17 C20.3 15.7 18.5 13.5 18.5 13.5 Z"
        className="fill-teal-500/20 stroke-teal-700 dark:stroke-teal-300"
        strokeWidth="1.5"
      />
      <circle cx="18.5" cy="17" r="0.7" className="fill-teal-700 dark:fill-teal-200 stroke-none" />
    </g>

    {/* Central Network Benchmark Junction */}
    <circle cx="12" cy="13" r="1.5" className="fill-teal-500/10 stroke-teal-600 dark:stroke-teal-400" strokeWidth="1.2" />
  </svg>
);

/**
 * 6. Audit-Ready ESG Exports
 * Concept: Official ESG documentation with water droplet seal and verified stamp
 */
export const AuditReadyESGIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="stroke-teal-700 dark:stroke-teal-300 fill-teal-500/5" />
    <polyline points="14 2 14 8 20 8" className="stroke-teal-600" />
    {/* Water ESG Stamp */}
    <path d="M10 14.5 C10 14.5 8 16.5 8 17.5 A2 2 0 0 0 12 17.5 C12 16.5 10 14.5 10 14.5 Z" className="fill-teal-500/20 stroke-teal-600" strokeWidth="1.4" />
    <polyline points="13.5 14 15 15.5 18 12.5" className="stroke-teal-700 dark:stroke-teal-200" strokeWidth="1.8" />
  </svg>
);

/**
 * 7. SCADA, BMS & ERP Connectors
 * Concept: Water system core with active bidirectional SCADA bus connectors
 */
export const SCADAConnectorsIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="8" y="8" width="8" height="8" rx="2" className="stroke-teal-700 dark:stroke-teal-300 fill-teal-500/10" />
    <path d="M12 10.5 C12 10.5 10.8 11.8 10.8 12.5 A1.2 1.2 0 0 0 13.2 12.5 C13.2 11.8 12 10.5 12 10.5 Z" className="fill-teal-600 stroke-none" />
    {/* Connectors */}
    <path d="M12 2V8" className="stroke-teal-600" />
    <path d="M12 16V22" className="stroke-teal-600" />
    <path d="M2 12H8" className="stroke-teal-600" />
    <path d="M16 12H22" className="stroke-teal-600" />
    <circle cx="12" cy="2" r="1" className="fill-teal-500 stroke-none" />
    <circle cx="12" cy="22" r="1" className="fill-teal-500 stroke-none" />
    <circle cx="2" cy="12" r="1" className="fill-teal-500 stroke-none" />
    <circle cx="22" cy="12" r="1" className="fill-teal-500 stroke-none" />
  </svg>
);

/**
 * 8. Predictive Consumption Curves
 * Concept: Hydrological curve with forward machine learning prediction projection
 */
export const PredictiveConsumptionIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="3" y1="20" x2="21" y2="20" className="stroke-teal-500/40" />
    <line x1="3" y1="4" x2="3" y2="20" className="stroke-teal-500/40" />
    {/* Actual Water Consumption Curve */}
    <path d="M3 16 C6 13, 9 17, 12 11" className="stroke-teal-700 dark:stroke-teal-300" strokeWidth="2" />
    {/* Predictive AI Forecast Curve */}
    <path d="M12 11 C15 5, 18 9, 21 6" className="stroke-teal-500 dark:stroke-teal-400" strokeDasharray="2.5 2" strokeWidth="1.8" />
    <circle cx="21" cy="6" r="1.5" className="fill-teal-600 dark:fill-teal-300 stroke-none" />
  </svg>
);

/**
 * 9. Watershed Stress Mapping
 * Concept: Watershed contour risk zones with alert indicator
 */
export const WatershedStressIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3 L3 19 H21 L12 3 Z" className="stroke-teal-700 dark:stroke-teal-300 fill-teal-500/5" />
    {/* Contour Ripples */}
    <path d="M8 16 C9.5 14.5, 14.5 14.5, 16 16" className="stroke-teal-500/60" strokeWidth="1.4" />
    {/* Alert Water Exclamation */}
    <path d="M12 9V12" className="stroke-teal-700 dark:stroke-teal-200" strokeWidth="2" />
    <circle cx="12" cy="15" r="1" className="fill-teal-700 dark:fill-teal-200 stroke-none" />
  </svg>
);

/**
 * 10. Sub-Meter Cost Allocation
 * Concept: Split water manifold showing sub-metered proportional flows
 */
export const SubMeterAllocationIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Main Supply Line */}
    <line x1="12" y1="2" x2="12" y2="7" className="stroke-teal-700 dark:stroke-teal-300" strokeWidth="2" />
    {/* Allocation Header */}
    <line x1="4.5" y1="7" x2="19.5" y2="7" className="stroke-teal-700 dark:stroke-teal-300" strokeWidth="2" />
    {/* 3 Sub-Meter Lines */}
    <line x1="5" y1="7" x2="5" y2="18" className="stroke-teal-600/70" strokeWidth="1.5" />
    <line x1="12" y1="7" x2="12" y2="18" className="stroke-teal-600/70" strokeWidth="1.5" />
    <line x1="19" y1="7" x2="19" y2="18" className="stroke-teal-600/70" strokeWidth="1.5" />
    {/* Sub-Meter Dials */}
    <circle cx="5" cy="18.5" r="2.2" className="fill-teal-500/20 stroke-teal-600" />
    <circle cx="12" cy="18.5" r="2.2" className="fill-teal-500/20 stroke-teal-600" />
    <circle cx="19" cy="18.5" r="2.2" className="fill-teal-500/20 stroke-teal-600" />
  </svg>
);

/**
 * Complete Water Intelligence Icon Map
 */
export const WATER_INTELLIGENCE_ICON_MAP: Record<string, React.FC<IconProps>> = {
  // Key 5 requested concepts
  "edge-telemetry": RuggedEdgeTelemetryIcon,
  "flow-pressure": RealTimeFlowPressureIcon,
  "cryptographic-integrity": CryptographicIntegrityIcon,
  "ai-anomaly": AIMicroLeakIcon,
  "multi-site-benchmark": MultiSiteBenchmarkIcon,

  // Additional 5 capabilities
  "esg-verification": AuditReadyESGIcon,
  "enterprise-apis": SCADAConnectorsIcon,
  "predictive-analytics": PredictiveConsumptionIcon,
  "risk-modeling": WatershedStressIcon,
  "sub-metering": SubMeterAllocationIcon,

  // Backward-compatible fallback keys matching iconName in content
  Cpu: RuggedEdgeTelemetryIcon,
  Radio: RealTimeFlowPressureIcon,
  ShieldCheck: CryptographicIntegrityIcon,
  Sparkles: AIMicroLeakIcon,
  LineChart: MultiSiteBenchmarkIcon,
  FileCheck2: AuditReadyESGIcon,
  Network: SCADAConnectorsIcon,
  BarChart3: PredictiveConsumptionIcon,
  ShieldAlert: WatershedStressIcon,
  Layers: SubMeterAllocationIcon,
};
