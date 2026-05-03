import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import AboutSection from "../components/sections/AboutSection";
import FooterSection from "../components/sections/FooterSection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-slate-200 overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Landing;
