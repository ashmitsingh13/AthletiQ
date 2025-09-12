"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "John Cena",
    role: "Gym Owner",
    avatar: "/images/john.png",
    rating: 4.9,
    text: "I've seen massive improvements in my gym's performance thanks to the expert trainers. Highly recommend!",
  },
  {
    name: "Maria Gomez",
    role: "Personal Trainer",
    avatar: "/images/maria.png",
    rating: 4.9,
    text: "The trainers are dedicated and professional. My gym members love them!",
  },
  {
    name: "David Lee",
    role: "Gym Manager",
    avatar: "/images/david.png",
    rating: 4.9,
    text: "Excellent trainers, fantastic customer support. Couldn't ask for more!",
  },
  {
    name: "Esther Howard",
    role: "Gym Owner",
    avatar: "/images/esther.png",
    rating: 4.9,
    text: "Great results from dedicated trainers! My gym has flourished.",
  },
  {
    name: "Devon Lane",
    role: "Gym Manager",
    avatar: "/images/devon.png",
    rating: 4.9,
    text: "Expert trainers who know their craft! Highly recommend for any gym.",
  },
  {
    name: "Marvin McKinney",
    role: "Fitness Coach",
    avatar: "/images/marvin.png",
    rating: 4.9,
    text: "The trainers have transformed my workout routine! I'm more motivated than ever.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black text-white py-16 px-6 md:px-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Hear from gym owners and fitness enthusiasts who trust our AI-powered trainers to help them reach their fitness goals. Their feedback inspires us to continue delivering top-tier services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-900 rounded-xl p-6 space-y-4 shadow-lg"
          >
            <p className="text-gray-300 italic relative before:content-['“'] before:absolute before:-top-2 before:-left-2 text-lg">{t.text}</p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{t.name}</h4>
                  <p className="text-gray-400 text-sm">{t.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 font-semibold">
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
