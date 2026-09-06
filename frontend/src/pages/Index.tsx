import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TechCapabilitiesTrack } from "@/components/home/TechCapabilitiesTrack";
import { About } from "@/components/About";
import { Solutions } from "@/components/Solutions";
import { Approach } from "@/components/Approach";
import { Impact } from "@/components/Impact";
import { Partners } from "@/components/Partners";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TechCapabilitiesTrack />
      <About />
      <Solutions />
      <Approach />
      <Impact />
      <Partners />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
