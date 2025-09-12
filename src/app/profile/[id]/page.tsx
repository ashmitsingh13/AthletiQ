// src/app/profile/[id]/page.tsx
import React from "react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";
import type { IUser } from "@/models/User";
import type { IResult } from "@/models/Result";
import connectDB from "@/lib/dbConnect";
import Result from "@/models/Result";
import Profile from "@/models/Profile";

const COLORS = ["#f44336", "#ff9800", "#ffd600", "#4caf50", "#2196f3"];

interface ProfilePageProps {
  params: { id: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const userId = params.id;

  await connectDB();

  const results = await Result.find({ athleteId: userId })
    .sort({ createdAt: -1 })
    .lean<IResult[]>();

  const user = await Profile.findOne({ userId }).lean<IUser | null>();

  // Overall score and badge
  const overall = (() => {
    if (!results.length) return { score: 0, badge: "Bronze" };
    const avg = Math.round(results.reduce((s, r) => s + (r.score ?? 0), 0) / results.length);
    const badge = avg >= 80 ? "Gold" : avg >= 60 ? "Silver" : "Bronze";
    return { score: avg, badge };
  })();

  // Growth chart series
  const growthSeries = results
    .slice()
    .reverse()
    .map((r) => ({
      dateIso: new Date(r.createdAt).toISOString(),
      dateLabel: new Date(r.createdAt).toLocaleString(),
      score: r.score ?? 0,
    }));

  // Y domain, best score, last test
  const { yDomain, bestScore, lastTest } = (() => {
    const scores = results.map((r) => r.score ?? 0);
    if (!scores.length) return { yDomain: [0, 100], bestScore: 0, lastTest: null };
    const min = Math.max(0, Math.min(...scores) - 10);
    const max = Math.min(100, Math.max(...scores) + 10);
    const best = Math.max(...scores);
    const last = results.length ? new Date(results[results.length - 1].createdAt) : null;
    return { yDomain: [min, max], bestScore: best, lastTest: last };
  })();

  // Exercise distribution
  const distribution = Object.entries(
    results.reduce<Record<string, number>>((acc, r) => {
      if (r.exercise) acc[r.exercise] = (acc[r.exercise] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-5xl pt-30 mx-auto p-6">
      <div className="flex items-center gap-6 mb-6">
        <Image
          src={user?.imageUrl || "/defaultImg.png"}
          alt="avatar"
          width={120}
          height={120}
          className="rounded"
        />
        <div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <div className="mt-2">
            Rank: <strong>{overall.badge}</strong> • Benchmark:{" "}
            <strong>{overall.score}</strong>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <span className="mr-4">Total tests: {results.length}</span>
            <span className="mr-4">Best score: {bestScore}</span>
            <span>
              Last test: {lastTest ? lastTest.toLocaleString() : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded shadow">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dateIso"
                tickFormatter={(iso) => new Date(iso).toLocaleDateString()}
              />
              <YAxis domain={yDomain} allowDecimals={false} />
              <Tooltip
                formatter={(value: number) => [value, "Score"]}
                labelFormatter={(label: string) => new Date(label).toLocaleString()}
              />
              <ReferenceLine
                y={overall.score}
                stroke="#4caf50"
                strokeDasharray="3 3"
                label={{ value: `Avg ${overall.score}`, position: "right", fill: "#4caf50" }}
              />
              <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 rounded shadow">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={distribution}
                outerRadius={90}
                innerRadius={40}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${Math.round((percent ?? 0) * 100)}%)`
                }
              >
                {distribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [value, name]} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
