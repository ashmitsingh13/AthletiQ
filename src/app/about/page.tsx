"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section className="w-full md:px-12 bg-background text-foreground relative overflow-hidden py-28 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
        >
          About <span className="text-primary">AI Fitness Trainer</span>
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-12"
        >
          AI Fitness Trainer is more than just a workout app—it’s your intelligent
          companion on the journey to a healthier, stronger, and more balanced life.
          We combine cutting-edge artificial intelligence with proven fitness science
          to create personalized experiences that adapt to your lifestyle and goals.  
        </motion.p>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl shadow-lg border h-full">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  To revolutionize fitness by making expert-level training and
                  nutrition guidance accessible to everyone, anytime and anywhere,
                  using the power of AI and data-driven insights.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl shadow-lg border h-full">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  To create a world where fitness is engaging, affordable, and
                  sustainable—empowering millions to build healthier lifestyles
                  with technology as their personal coach.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl shadow-lg border h-full">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Core Values</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Innovation, inclusivity, and integrity guide everything we do. We
                  believe fitness should be for all, and our AI adapts to your
                  journey—whether you’re a beginner or an athlete.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl shadow-lg border h-full">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Why Choose Us</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  From personalized workout plans and AI coaching to progress
                  tracking and community support, we bring everything you need for
                  long-term success in one seamless platform.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Button size="lg" className="rounded-full px-10 py-6 text-lg">
            Start Your Fitness Journey Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
