import React from "react";
import { ShieldCheck, Eye, Cpu, HeartHandshake, Quote } from "lucide-react";

export const CultureSection: React.FC = () => {
  const values = [
    {
      icon: Eye,
      title: "Evidence Over Opinion",
      subtitle: "Empirical Ground Truth",
      description: "We don't argue with assumptions. We calibrate sensors, verify telemetry pipelines, and let empirical physics guide technical and business decisions.",
    },
    {
      icon: ShieldCheck,
      title: "Radical Transparency",
      subtitle: "Open Books & Open Code",
      description: "Company metrics, roadmap priorities, and code reviews are shared openly with everyone. Direct, thoughtful feedback is expected and celebrated.",
    },
    {
      icon: Cpu,
      title: "High Agency & Autonomy",
      subtitle: "Bias Toward Execution",
      description: "We hire builders who spot problems and take initiative to solve them. You don't need three layers of approval to optimize a query or fix an edge case.",
    },
    {
      icon: HeartHandshake,
      title: "Customer & Resource Empathy",
      subtitle: "Real People, Real Litres",
      description: "Our technology serves real plant operators, municipal engineers, and civic water users. We build robust tools that perform flawlessly in the rain and dirt.",
    },
  ];

  return (
    <section id="what-we-value" className="py-12 sm:py-16 lg:py-20 bg-slate-50/70 dark:bg-slate-900/30 border-b border-border/15 select-none relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-10">
        
        {/* Section Header */}
        <div className="text-left font-sans max-w-3xl">
          <div>
            <span className="text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest text-xs font-mono block mb-1.5">
              WHAT WE VALUE
            </span>
            <div className="w-10 h-0.5 bg-teal-600 rounded-full mb-3" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
            Principles That Guide How We Build
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Our culture isn't a poster in an office. It is the operating manual for how we make decisions, critique code, and collaborate every day.
          </p>
        </div>

        {/* 4 Clean Visual Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="group bg-card p-6 sm:p-7 rounded-2xl border border-border/60 hover:border-teal-500/40 shadow-xs hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-sans relative overflow-hidden text-left"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 flex items-center justify-center border border-teal-500/20 group-hover:scale-105 transition-transform mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {val.title}
                  </h3>

                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2.5 font-mono">
                    {val.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {val.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-border/30 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Core Value 0{idx + 1}</span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold">Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Culture Quote Card */}
        <div className="bg-gradient-to-r from-slate-950 via-[#031d22] to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-teal-500/30 shadow-xl relative overflow-hidden font-sans text-left">
          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 text-teal-400/40 shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="font-display text-sm sm:text-base md:text-lg font-medium leading-relaxed text-cyan-100 max-w-3xl">
                "We don't manage desk hours or micro-manage tasks. We hire exceptional minds, give them tough engineering challenges, provide complete context, and trust them to execute."
              </p>
              <p className="text-xs text-teal-300 font-mono">
                Veenero Engineering &amp; Operations Charter
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CultureSection;
