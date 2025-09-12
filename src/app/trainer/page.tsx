"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Video, Bot, UserCheck } from "lucide-react";

export default function TrainerPage() {
  const trainers = [
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: "AI Coach",
      description:
        "Get instant feedback, personalized workout plans, and track progress with our AI-powered virtual coach.",
      price: "₹499 / month",
      type: "subscription",
    },
    {
      icon: <Video className="h-10 w-10 text-primary" />,
      title: "Live Trainer (1:1)",
      description:
        "Book one-hour live video call sessions with certified trainers for real-time guidance and motivation.",
      price: "₹999 / session",
      type: "per session",
    },
    {
      icon: <UserCheck className="h-10 w-10 text-primary" />,
      title: "SAI Certified Coaches",
      description:
        "Get training directly from SAI-certified professionals who can guide you toward national-level selection.",
      price: "By Appointment",
      type: "appointment",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <Badge className="animate-pulse">💪 Online Training</Badge>
        <h1 className="text-4xl md:text-6xl font-bold font-[Neucha]">
          Train Anytime, Anywhere
        </h1>
        <p className="text-muted-foreground text-lg">
          Connect with AI or certified human trainers to boost your athletic performance.
        </p>
      </div>

      {/* Trainer Options */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {trainers.map((trainer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="mb-4">{trainer.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{trainer.title}</h3>
              <p className="text-muted-foreground mb-4">{trainer.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold">{trainer.price}</span>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90">
                {trainer.type === "subscription"
                  ? "Subscribe"
                  : trainer.type === "per session"
                  ? "Book Now"
                  : "Request"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Section */}
      <div className="max-w-2xl mx-auto mt-16">
        <Alert className="bg-secondary/30 border-secondary">
          <AlertDescription>
            ⚡ Choose AI for affordable, instant coaching or book a certified trainer
            for personalized real-time sessions. SAI-certified coaches available on request.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
