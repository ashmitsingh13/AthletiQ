"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function FitnessSection() {
  return (
    <section className="w-full bg-black flex items-center justify-center px-4 sm:px-8 lg:px-20 py-16 md:py-24">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Side - Text */}
        <div className="flex flex-col items-start justify-center space-y-6 px-2 md:px-0 text-center md:text-left">
          <h1 className="text-white font-[Neucha] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide leading-tight">
            IT&apos;S TIME TO <br /> BE HEALTHY <br /> AND IN <br /> GREAT SHAPE
          </h1>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-6 sm:px-8 py-4 sm:py-6 rounded-2xl sm:rounded-3xl md:rounded-4xl text-base sm:text-lg">
            SIGN UP NOW
          </Button>
        </div>

        {/* Right Side - Image Wrapper */}
        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] rounded-2xl overflow-hidden">
          <Image
            src="/images/FitnessSection.png"
            alt="Fitness"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
