import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Partners } from "@/components/Partners";

export const PartnersPage: React.FC = () => {
  useEffect(() => {
    document.title = "Our Partners | Veenero - Water Intelligence";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-20">
        <Partners />
      </main>
      <Footer />
    </div>
  );
};

export default PartnersPage;
