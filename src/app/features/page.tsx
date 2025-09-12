"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Dumbbell, Activity, Users2, BarChart3, ShieldCheck } from "lucide-react";

export default function FeaturePage() {
  const features = [
    {
      icon: <Activity className="h-10 w-10 text-primary" />,
      title: "Standard Fitness Tests",
      description:
        "Athletes can undergo structured physical tests like endurance, flexibility, and strength assessments.",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: "AI-Powered Scoring",
      description:
        "Get benchmark scores automatically using AI models trained on professional performance data.",
    },
    {
      icon: <Users2 className="h-10 w-10 text-primary" />,
      title: "Coach & SAI Integration",
      description:
        "Coaches and SAI officials can review athlete performance, give feedback, and shortlist candidates.",
    },
    {
      icon: <Dumbbell className="h-10 w-10 text-primary" />,
      title: "Custom Training Plans",
      description:
        "Personalized guidance is available to improve weak areas and push athletes to their peak.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: "Secure & Verified",
      description:
        "All athlete data is stored securely with verified identity checks and transparent evaluation.",
    },
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: "Path to National Level",
      description:
        "Outstanding athletes can be directly appointed or recommended by SAI for advanced training.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <Badge className="animate-pulse">🏅 Athlete Portal</Badge>
        <h1 className="text-4xl md:text-6xl font-bold">
          Unlock Your Athletic Potential
        </h1>
        <p className="text-muted-foreground text-lg">
          A digital-first platform for athletes to test, improve, and get
          recognized by the Sports Authority of India.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Alert Section */}
      <div className="max-w-2xl mx-auto mt-16">
        <Alert className="bg-secondary/30 border-secondary">
          <AlertDescription>
            🚀 Top-performing athletes will be directly evaluated by SAI for
            further training and national-level opportunities.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
