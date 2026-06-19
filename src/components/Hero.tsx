import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-water.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Abstract water waves representing sustainable water management"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-75" />
      </div>

      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-aqua/10 rounded-full blur-3xl animate-float animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-3xl animate-wave" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
            <p className="text-primary-foreground/80 font-medium mb-6 tracking-wider uppercase text-sm opacity-0 animate-fade-up">
            India’s Water Intelligence Platform
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-8 opacity-0 animate-fade-up animation-delay-200">
            India's Water Intelligence
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-foreground via-aqua to-primary-foreground animate-gradient">Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up animation-delay-400">
            Measure. Monitor. Optimize. Verify.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up animation-delay-600">
            <Button variant="hero" size="xl" className="group">
              Explore the Platform
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroOutline" size="xl" className="group">
              <Play className="h-5 w-5" />
              Watch How Water Visibility Works
            </Button>
          </div>
          <p className="mt-6 text-sm md:text-base text-primary-foreground/75 tracking-wider uppercase opacity-0 animate-fade-up animation-delay-700">
            Making Every Litre Visible.
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animation-delay-800">
        <div className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary-foreground/60 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
