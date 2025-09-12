"use client";

import { motion } from "framer-motion";
import { UploadCloud, BrainCircuit, BarChart3 } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <UploadCloud className="w-10 h-10 text-primary mb-4" />,
      title: "Upload Video",
      description: "Record your performance on your phone and upload it to our secure platform.",
    },
    {
      icon: <BrainCircuit className="w-10 h-10 text-primary mb-4" />,
      title: "AI Analysis",
      description: "Our AI analyzes your video, counting reps, measuring performance, and detecting any issues.",
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-primary mb-4" />,
      title: "Get Results",
      description: "Receive detailed performance data, insights, and track your progress over time.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background text-foreground dark:bg-gray dark:text-gray-100">
      <div className="max-w-4xl mx-auto text-center mb-12 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          How It Works
        </motion.h2>
        <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-300">
          Get started in three simple steps
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 px-4">
        {steps.map((step, idx) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center bg-card dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <span className="text-xl md:text-2xl font-bold text-primary">{idx + 1}</span>
            </div>
            {step.icon}
            <h3 className="text-lg md:text-xl font-semibold mb-2 mt-2">{step.title}</h3>
            <p className="text-sm md:text-base text-muted-foreground dark:text-gray-300">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
