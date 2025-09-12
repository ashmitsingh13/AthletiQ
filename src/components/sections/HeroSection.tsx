"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import ScrollingBanner from "@/components/ScrollingBanner";

const HeroSection = () => {
  return (
    <>
      <section className="relative overflow-hidden pt-28 px-6 sm:px-10 lg:px-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10" />
        <div className="container mx-auto text-center flex flex-col items-center">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-4xl">
            Perfect Your Form with{" "}
            <span className="text-blue-600 dark:text-blue-400">
              AI Posture Analysis
            </span>
          </h1>
          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Upload exercise videos or use real-time camera to get instant feedback
            on your posture. Improve your form, prevent injuries, and maximize
            your workout results.
          </p>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8"
            >
              <Link href="/camera">
                <Camera className="mr-2 h-5 w-5" />
                Start Real-time Analysis
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-6 sm:px-8">
              <Link href="/upload">
                <Upload className="mr-2 h-5 w-5" />
                Upload Video
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <ScrollingBanner />
    </>
  );
};

export default HeroSection;
