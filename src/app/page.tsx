import React from "react";
import Hero from "@/components/sections/HeroSection";
import FaqSection from "@/components/sections/FaqSection";

const Home = () => {
  return (
    <>
      <Hero />
      <div className="px-4 md:px-[6rem] flex flex-col gap-[5rem] md:gap-[12.5rem] py-[2rem] md:py-[5rem]">
        <FaqSection />
      </div>
    </>
  );
};

export default Home;
