import React from "react";
import { waterFlow } from "@/assets/animations";

export const AnimatedWaterTimeline: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`absolute left-[39px] top-20 w-[2px] h-[calc(100%-80px)] hidden md:block overflow-hidden rounded-full ${className}`}
      aria-hidden="true"
    >
      {/* Background static line */}
      <div className="absolute inset-0 w-full h-full bg-[#0F4C5C]/20" />
      
      {/* Reusable SVG Animated water flow asset */}
      <div className="absolute top-0 left-0 w-full h-full opacity-60 pointer-events-none">
        <img src={waterFlow} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Animated glowing water flow element */}
      <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-transparent via-[#38BDF8] to-transparent animate-water-flow shadow-[0_0_8px_#38BDF8]" />
    </div>
  );
};

export default AnimatedWaterTimeline;
