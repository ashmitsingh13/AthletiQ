import React from "react";
import Hero from "@/components/sections/HeroSection";
import FaqSection from "@/components/sections/FaqSection";
import Testimonials from "@/components/sections/Testimonials";
import HowItWorksSection from "@/components/sections/HowItWorks";
import FeaturePage from "./features/page";

const Home = () => {
  return (
    <>
      <Hero />
      <HowItWorksSection />
      <FeaturePage />
      <Testimonials />
      <div className="px-4 md:px-[6rem] flex flex-col gap-[5rem] md:gap-[12.5rem] py-[2rem] md:py-[5rem]">
        <FaqSection />
      </div>
    </>
  );
};

export default Home;
