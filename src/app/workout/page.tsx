"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; 
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Dumbbell,
  HeartPulse,
  Flame,
  Bike,
  PersonStanding,
  HandMetal,
  Waves,
  StretchHorizontal,
  Music,
  Footprints,
} from "lucide-react";
import Footer from "@/components/common/Footer";

const categories = [
  { name: "Boxing", types: 15, icon: <HandMetal className="w-6 h-6" />, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400" },
  { name: "Yoga", types: 14, icon: <PersonStanding className="w-6 h-6" />, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400" },
  { name: "Cardio", types: 15, icon: <HeartPulse className="w-6 h-6" />, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400" },
  { name: "Strength", types: 15, icon: <Dumbbell className="w-6 h-6" />, color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400" },
  { name: "Pilates", types: 15, icon: <PersonStanding className="w-6 h-6" />, color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400" },
  { name: "CrossFit", types: 13, icon: <Flame className="w-6 h-6" />, color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400" },
  { name: "Cycling", types: 15, icon: <Bike className="w-6 h-6" />, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400" },
  { name: "Martial Arts", types: 5, icon: <PersonStanding className="w-6 h-6" />, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400" },
  { name: "Running", types: 9, icon: <Footprints className="w-6 h-6" />, color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
  { name: "Zumba", types: 3, icon: <Music className="w-6 h-6" />, color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400" },
  { name: "Stretching", types: 13, icon: <StretchHorizontal className="w-6 h-6" />, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400" },
  { name: "Swimming", types: 10, icon: <Waves className="w-6 h-6" />, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400" },
];

export default function WorkoutCategories() {
  const router = useRouter();
  

  return (
    <>
    <div className="w-full bg-white dark:bg-black transition-colors duration-300 flex-wrap">
    <section className="relative overflow-hidden py-28 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Workout Categories
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-center text-gray-500 dark:text-gray-400 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Find workouts tailored to your fitness goals. Choose a category and get started today!
        </motion.p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              onClick={() => router.push(`/workout/${cat.name.toLowerCase().replace(/\s+/g, "-")}`)} 
            >
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition rounded-2xl shadow-md cursor-pointer">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`p-3 rounded-xl ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{cat.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{cat.types} Exercises</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
    </div>
    </>
  );
}
