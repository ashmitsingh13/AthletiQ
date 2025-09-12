import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/NavBar";
import FaqSection from "@/components/sections/FaqSection";
import Hero from "@/components/sections/HeroSection";
import React from "react";

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
