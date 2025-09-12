"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import type { IProfile } from "@/models/Profile";
import type { IResult } from "@/models/Result";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const COLORS = ["#f44336", "#ff9800", "#ffd600", "#4caf50", "#2196f3"];

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams =
    params && typeof (params as any).then === "function"
      ? (React.use(params as any) as { id: string })
      : (params as { id: string });
  const userId = resolvedParams?.id;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [results, setResults] = useState<IResult[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    age: number;
    gender: string;
    sport: string;
    state: string;
    profileImage: string;
  }>({
    name: "",
    age: 0,
    gender: "",
    sport: "",
    state: "",
    profileImage: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch");
      setUser(data.user || null);
      setProfile(data.profile || null);
      setResults(data.results || []);
      setForm({
        name: (data.profile?.name || data.user?.name) ?? "",
        age: data.profile?.age ?? 0,
        gender: data.profile?.gender ?? "",
        sport: data.profile?.sport ?? "",
        state: data.profile?.state ?? "",
        profileImage:
          data.profile?.profileImage ?? data.user?.avatarUrl ?? "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const overall = useMemo(() => {
    if (!results.length) return { score: 0, badge: "Bronze" };
    const avg = Math.round(
      results.reduce((s, r) => s + (r.score ?? 0), 0) / results.length
    );
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
          dateLabel: new Date(r.createdAt).toLocaleString(),
          score: Number(r.score ?? 0),
        })),
    [results]
  );

  const { yDomain, bestScore, lastTest } = useMemo(() => {
    const scores = results.map((r) => Number(r.score ?? 0));
    if (!scores.length)
      return { yDomain: [0, 100], bestScore: 0, lastTest: null };
    const min = Math.max(0, Math.min(...scores) - 10);
    const max = Math.min(100, Math.max(...scores) + 10);
    const best = Math.max(...scores);
    const last = results.length
      ? new Date(results[results.length - 1].createdAt)
      : null;
    return { yDomain: [min, max], bestScore: best, lastTest: last };
  }, [results]);

  const distribution = useMemo(() => {
    const counts = Object.entries(
      results.reduce<Record<string, number>>((acc, r) => {
        if (r.exercise) acc[r.exercise] = (acc[r.exercise] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));
    return counts;
  }, [results]);

  if (loading) return <div className="p-6">Loading...</div>;

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
          <h2 className="text-2xl font-bold">{form.name || user?.name}</h2>
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
              <XAxis dataKey="dateIso" tickFormatter={(iso) => new Date(iso).toLocaleDateString()} />
              <YAxis domain={yDomain} allowDecimals={false} />
              <Tooltip formatter={(value: number) => [value, "Score"]} labelFormatter={(label: string) => new Date(label).toLocaleString()} />
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
              <Pie dataKey="value" data={distribution} outerRadius={90} innerRadius={40} label={({ name, value, percent }) => `${name}: ${value} (${Math.round((percent ?? 0) * 100)}%)`}>
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
