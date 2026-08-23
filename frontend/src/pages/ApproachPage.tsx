import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Approach } from "@/components/Approach";

export const ApproachPage: React.FC = () => {
  useEffect(() => {
    document.title = "Our Approach | Veenero - Water Intelligence";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-20">
        <Approach />
      </main>
      <Footer />
    </div>
  );
};

export default ApproachPage;
