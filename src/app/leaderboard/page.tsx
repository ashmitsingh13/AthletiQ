"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  state: string;
  district: string;
  imageUrl: string;
  score: number;
  testsCount: number;
}

export default function LeaderboardPage() {
  const [view, setView] = useState<"district" | "state">("district");
  const [data, setData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.leaderboard);
      })
      .catch((err) => console.error("Leaderboard fetch error:", err));
  }, []);

  // filter + sort once, switching is instant
  const leaderboard = [...data].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
        <Badge className="animate-pulse">🏆 Leaderboard</Badge>
        <h1 className="text-4xl md:text-5xl font-bold font-[Neucha]">
          Athlete Performance Rankings
        </h1>
        <p className="text-muted-foreground">
          Track top athletes district-wise and state-wise based on benchmark
          scores.
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setView("district")}
          className={`px-4 py-2 rounded-xl border ${
            view === "district"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          District Leaderboard
        </button>
        <button
          onClick={() => setView("state")}
          className={`px-4 py-2 rounded-xl border ${
            view === "state" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          State Leaderboard
        </button>
      </div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-x-auto max-w-4xl mx-auto"
      >
        <table className="w-full border rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-secondary/40">
            <tr className="text-left">
              <th className="px-4 py-3">Rank</th>
              
              <th className="px-4 py-3">
                {view === "district" ? "District" : "State"}
              </th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((athlete, i) => (
              <tr
                key={athlete.id}
                className="border-b hover:bg-muted/40 transition"
              >
                <td className="px-4 py-3 font-bold flex items-center gap-2">
                  {i + 1 === 1 && (
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  )}
                  {i + 1}
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <img
                    src={athlete.imageUrl}
                    alt={athlete.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {athlete.name}
                </td>
                <td className="px-4 py-3">
                  {view === "district"
                    ? athlete.district || "Unknown"
                    : athlete.state || "Unknown"}
                </td>
                <td className="px-4 py-3">{athlete.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {leaderboard.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No leaderboard data available.
        </p>
      )}
    </div>
  );
}
