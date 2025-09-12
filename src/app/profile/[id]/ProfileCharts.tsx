"use client";

import React, { useMemo } from "react";
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
import { IUser } from "@/models/User";
import { IResult } from "@/models/Result";

const COLORS = ["#f44336", "#ff9800", "#ffd600", "#4caf50", "#2196f3"];

interface Props {
  user: IUser | null;
  results: IResult[];
}

export default function ProfileCharts({ user, results }: Props) {
  const overall = useMemo(() => {
    if (!results.length) return { score: 0, badge: "Bronze" };
    const avg = Math.round(results.reduce((s, r) => s + (r.score ?? 0), 0) / results.length);
    const badge = avg >= 80 ? "Gold" : avg >= 60 ? "Silver" : "Bronze";
    return { score: avg, badge };
  }, [results]);

  const growthSeries = useMemo(
    () =>
      results
        .slice()
        .reverse()
        .map((r) => ({
          dateIso: new Date(r.createdAt).toISOString(),
          score: r.score ?? 0,
        })),
    [results]
  );

  const distribution = useMemo(() => {
    const counts = Object.entries(
      results.reduce<Record<string, number>>((acc, r) => {
        if (r.exercise) acc[r.exercise] = (acc[r.exercise] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));
    return counts;
  }, [results]);

  if (!user) return <div className="p-6">No data available</div>;

  return (
    <div className="max-w-5xl pt-10 mx-auto p-6">
      <div className="flex items-center gap-6 mb-6">
        <Image
          src={user.imageUrl || "/defaultImg.png"}
          alt="avatar"
          width={120}
          height={120}
          className="rounded"
          priority
        />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <div className="mt-2">
            Rank: <strong>{overall.badge}</strong> • Benchmark: <strong>{overall.score}</strong>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded shadow">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateIso" />
              <YAxis domain={[0, 100]} allowDecimals={false} />
              <Tooltip />
              <ReferenceLine y={overall.score} stroke="#4caf50" label={`Avg ${overall.score}`} />
              <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 rounded shadow">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={distribution} outerRadius={90} innerRadius={40}>
                {distribution.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
