"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Alex Morgan",
    role: "Youth Soccer Coach",
    avatar: "/images/alex.png",
    rating: 5,
    text: "This AI platform has completely transformed how I scout young talent. I can assess athletes remotely and accurately, saving time and effort!",
  },
  {
    name: "Liam Smith",
    role: "High School Sports Director",
    avatar: "/images/liam.png",
    rating: 4.8,
    text: "Thanks to the AI-powered analysis, our players get detailed insights that were impossible to gather before. Truly democratizing sports talent assessment.",
  },
  {
    name: "Sophia Lee",
    role: "Athlete",
    avatar: "/images/sophia.png",
    rating: 5,
    text: "I can now track my performance and progress anywhere, anytime. The AI insights help me focus on improving exactly what I need to succeed.",
  },
  {
    name: "Ravi Kumar",
    role: "Cricket Coach",
    avatar: "/images/ravi.png",
    rating: 4.9,
    text: "The platform brings professional-level analytics to small towns and remote areas. Finally, every athlete has a fair chance to showcase talent!",
  },
  {
    name: "Emma Davis",
    role: "Fitness Trainer",
    avatar: "/images/emma.png",
    rating: 5,
    text: "AI-powered performance insights are amazing! It helps my trainees improve faster and gives them confidence in their abilities.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-background dark:bg-gray text-foreground dark:text-gray-100 py-16 px-6 md:px-16">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
          Hear from athletes, coaches, and sports organizations who use our AI-powered mobile platform to assess and improve talent. Their experiences highlight how we're democratizing sports talent assessment worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
          >
            <p className="text-gray-700 dark:text-gray-300 italic relative before:content-['“'] before:absolute before:-top-2 before:-left-2 text-base md:text-lg mb-4">
              {t.text}
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm md:text-base">{t.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{t.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 font-semibold text-sm md:text-base">
                <span>★</span>
                <span>{t.rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
