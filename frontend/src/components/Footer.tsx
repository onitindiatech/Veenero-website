import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  ArrowUpRight,
  MapPin,
  Phone,
} from "lucide-react";
import { footerContent } from "@/content/site/footer";
import { getPublicFooter, PublicFooterData } from "@/services/footer.service";
import { VeeneroLogo } from "@/components/VeeneroLogo";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Linkedin,
  Twitter,
  Youtube,
  Mail,
};

/**
 * Standard Official Google "G" 4-color Vector Logo
 */
const GoogleGLogo: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const Footer: React.FC = () => {
  const [data, setData] = useState<PublicFooterData | null>(null);

  useEffect(() => {
    getPublicFooter()
      .then((res) => {
        if (res) setData(res);
      })
      .catch(() => {});
  }, []);

  const description = data?.description || footerContent.description;
  const address = data?.address || footerContent.address;
  const mobile = data?.mobile || footerContent.mobile;
  const links = data?.links || footerContent.links;
  const socialLinks = data?.socialLinks || footerContent.socialLinks;
  const currentYear = new Date().getFullYear();

  const isExternal = (url: string) =>
    url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:");

  return (
    <footer className="relative bg-[#030c14] text-slate-100 pt-20 md:pt-24 pb-12 overflow-hidden font-sans select-none">
      {/* Top Wave Transition Boundary into Footer */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none -translate-y-[98%] z-10">
        <svg
          className="relative block w-full h-8 sm:h-12 md:h-16 text-[#030c14]"
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,28 C280,68 560,8 840,42 C1120,76 1320,32 1440,24 L1440,70 L0,70 Z" />
        </svg>
      </div>

      {/* Embedded CSS for performant, calming water-data wave & ambient motion */}
      <style>{`
        @keyframes footer-water-drift-1 {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-45px, 6px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes footer-water-drift-2 {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(40px, -5px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes footer-ambient-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.06); }
        }
        @keyframes footer-telemetry-glow {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 0.85; transform: scale(1.2); }
        }
        @keyframes footer-bubble-float {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.2; }
          50% { transform: translate3d(3px, -10px, 0); opacity: 0.55; }
        }
        .footer-flow-1 {
          animation: footer-water-drift-1 26s ease-in-out infinite alternate;
        }
        .footer-flow-2 {
          animation: footer-water-drift-2 32s ease-in-out infinite alternate;
        }
        .footer-glow-pulse {
          animation: footer-ambient-pulse 14s ease-in-out infinite alternate;
        }
        .footer-node-glow {
          animation: footer-telemetry-glow 4s ease-in-out infinite;
        }
        .footer-bubble-1 { animation: footer-bubble-float 6s ease-in-out infinite; }
        .footer-bubble-2 { animation: footer-bubble-float 8s ease-in-out infinite 1.5s; }
        .footer-bubble-3 { animation: footer-bubble-float 7s ease-in-out infinite 3s; }
        @media (prefers-reduced-motion: reduce) {
          .footer-flow-1, .footer-flow-2, .footer-glow-pulse, .footer-node-glow, .footer-bubble-1, .footer-bubble-2, .footer-bubble-3 {
            animation: none !important;
          }
        }
      `}</style>

      {/* Subtle Atmospheric Water Mesh Glows */}
      <div className="absolute top-10 right-1/4 w-[520px] h-[380px] bg-teal-500/[0.05] rounded-full blur-3xl pointer-events-none -z-10 footer-glow-pulse" />
      <div className="absolute bottom-10 left-1/5 w-[460px] h-[320px] bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none -z-10 footer-glow-pulse" style={{ animationDelay: "4s" }} />

      {/* Layered Animated Flowing Water & Data Wave Contours */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0 opacity-70">
        {/* Layer 1: Primary Soft Water Wave Flow */}
        <svg
          className="absolute -bottom-10 left-[-10%] w-[120%] h-48 sm:h-56 text-teal-400/[0.05] footer-flow-1"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0,100 C320,150 640,60 960,120 C1280,180 1380,80 1440,110 L1440,200 L0,200 Z"
            fill="currentColor"
          />
          <path
            d="M0,100 C320,150 640,60 960,120 C1280,180 1380,80 1440,110"
            stroke="rgba(45, 212, 191, 0.12)"
            strokeWidth="1.2"
            strokeDasharray="4 8"
          />
        </svg>

        {/* Layer 2: Secondary Counter-Flow Stream with Telemetry Accent Nodes */}
        <svg
          className="absolute -bottom-16 left-[-5%] w-[115%] h-52 sm:h-64 text-cyan-400/[0.04] footer-flow-2"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0,130 C260,70 600,160 900,90 C1200,30 1360,120 1440,80 L1440,220 L0,220 Z"
            fill="currentColor"
          />
          <path
            d="M0,130 C260,70 600,160 900,90 C1200,30 1360,120 1440,80"
            stroke="rgba(0, 182, 254, 0.14)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Subtle Water Telemetry Micro-Nodes */}
        <div className="absolute bottom-28 left-[22%] w-1.5 h-1.5 rounded-full bg-teal-400/40 blur-[0.5px] footer-node-glow" />
        <div className="absolute bottom-36 left-[58%] w-1.5 h-1.5 rounded-full bg-cyan-400/45 blur-[0.5px] footer-node-glow" style={{ animationDelay: "1.8s" }} />
        <div className="absolute bottom-20 right-[18%] w-2 h-2 rounded-full bg-teal-300/35 blur-[0.5px] footer-node-glow" style={{ animationDelay: "2.6s" }} />

        {/* Floating Water Micro-Droplet Accents */}
        <div className="absolute top-[35%] left-[8%] w-2.5 h-2.5 rounded-full bg-teal-400/10 border border-teal-400/25 blur-[0.5px] footer-bubble-1" />
        <div className="absolute top-[60%] right-[12%] w-2 h-2 rounded-full bg-cyan-400/10 border border-cyan-400/25 blur-[0.5px] footer-bubble-2" />
        <div className="absolute top-[20%] right-[32%] w-1.5 h-1.5 rounded-full bg-teal-300/10 border border-teal-300/20 blur-[0.5px] footer-bubble-3" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* 1. PRIMARY BRAND BLOCK (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand Logo */}
              <Link to="/" className="inline-flex items-center group select-none" aria-label="Veenero Home">
                <VeeneroLogo
                  variant="light"
                  className="h-9 sm:h-10 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                />
              </Link>

              {/* Description */}
              <p className="text-slate-300/80 text-sm leading-relaxed max-w-md font-normal pt-1">
                {description}
              </p>
            </div>

            {/* Address & Mobile Contact Cards */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.025] border border-white/[0.05] hover:border-teal-500/20 transition-colors max-w-md">
                <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-100 block mb-0.5">Headquarters</span>
                  <span className="text-slate-400">{address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.025] border border-white/[0.05] hover:border-teal-500/20 transition-colors max-w-md">
                <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-slate-100 mr-2">Contact:</span>
                  <a href={`tel:+91${mobile.replace(/\s+/g, '')}`} className="text-slate-300 hover:text-teal-300 transition-colors">
                    +91 {mobile}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-3">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => {
                  const IconComponent = iconMap[social.iconName] || Mail;
                  const isEmail = social.iconName === "Mail";
                  const href = isEmail && !social.href.startsWith("mailto:") ? `mailto:${social.href}` : social.href;
                  return (
                    <a
                      key={social.label}
                      href={href}
                      target={isEmail ? "_self" : "_blank"}
                      rel={isEmail ? undefined : "noopener noreferrer"}
                      aria-label={social.label}
                      className="w-9 h-9 rounded-xl bg-white/[0.035] border border-white/[0.08] hover:border-teal-400/50 hover:bg-teal-500/15 text-slate-300 hover:text-teal-300 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-xs"
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. SOLUTIONS (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.2em] text-teal-400 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
              Solutions
            </h4>
            <ul className="space-y-3 text-sm">
              {links.solutions.map((link) => {
                const external = isExternal(link.href);
                return (
                  <li key={link.label}>
                    {external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-all duration-200 relative py-0.5 hover:translate-x-0.5"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-teal-400 transition-all duration-300 group-hover:w-full" />
                        </span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-teal-400 shrink-0" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-all duration-200 relative py-0.5 hover:translate-x-0.5"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-teal-400 transition-all duration-300 group-hover:w-full" />
                        </span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-teal-400 shrink-0" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 3. COMPANY (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.2em] text-teal-400 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              {links.company.map((link) => {
                const external = isExternal(link.href);
                return (
                  <li key={link.label}>
                    {external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-all duration-200 relative py-0.5 hover:translate-x-0.5"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-teal-400 transition-all duration-300 group-hover:w-full" />
                        </span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-teal-400 shrink-0" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-all duration-200 relative py-0.5 hover:translate-x-0.5"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-teal-400 transition-all duration-300 group-hover:w-full" />
                        </span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-teal-400 shrink-0" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 4. RESOURCES & GOOGLE REVIEWS TRUST CARD (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.2em] text-teal-400 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                Resources
              </h4>
              <ul className="space-y-3 text-sm">
                {links.resources.map((link) => {
                  const isInternalBlog = link.label.toLowerCase() === "blog";
                  const destination = isInternalBlog ? "/blog" : link.href;
                  const external = isExternal(destination);
                  return (
                    <li key={link.label}>
                      {external ? (
                        <a
                          href={destination}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-all duration-200 relative py-0.5 hover:translate-x-0.5"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-teal-400 transition-all duration-300 group-hover:w-full" />
                          </span>
                          <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-teal-400 shrink-0" />
                        </a>
                      ) : (
                        <Link
                          to={destination}
                          className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-all duration-200 relative py-0.5 hover:translate-x-0.5"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-teal-400 transition-all duration-300 group-hover:w-full" />
                          </span>
                          <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-teal-400 shrink-0" />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Google Reviews Trust Card */}
            <a
              href="https://www.google.com/search?q=Veenero+Sustainable+Solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block p-4 rounded-2xl bg-gradient-to-b from-white/[0.045] to-white/[0.015] border border-white/[0.09] hover:border-teal-500/40 hover:bg-white/[0.06] hover:shadow-[0_8px_24px_rgba(0,182,254,0.08)] transition-all duration-300 group shadow-xs max-w-[260px]"
              aria-label="Google Reviews - 5.0 rating for Veenero Sustainable Solutions"
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <GoogleGLogo className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 transition-colors">
                    Google Reviews
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-colors shrink-0" />
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-bold text-white font-mono tracking-tight">5.0</span>
                <div className="flex items-center text-[#FBBC05] text-xs tracking-wider" aria-label="5.0 out of 5 stars">
                  ★★★★★
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-normal">
                Trusted by our customers
              </p>
            </a>
          </div>
        </div>

        {/* 5. BOTTOM BAR */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-normal">
          <p>
            © {currentYear} Veenero Sustainable Solutions. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/about" className="hover:text-teal-300 transition-colors duration-200">
              About
            </Link>
            <Link to="/solutions" className="hover:text-teal-300 transition-colors duration-200">
              Solutions
            </Link>
            <Link to="/impact" className="hover:text-teal-300 transition-colors duration-200">
              Impact
            </Link>
            <Link to="/careers" className="hover:text-teal-300 transition-colors duration-200">
              Careers
            </Link>
            <Link to="/contact" className="hover:text-teal-300 transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
