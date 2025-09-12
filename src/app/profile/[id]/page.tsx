"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const COLORS = ["#f44336", "#ff9800", "#ffd600", "#4caf50", "#2196f3"];

export default function ProfilePage({
  params,
}: {
  // params can be either an object or a Promise depending on Next.js version/runtime
  params: Promise<{ id: string }> | { id: string };
}) {
  // Next.js (newer version) may provide params as a Promise — unwrap with React.use()
  const resolvedParams =
    params && typeof (params as any).then === "function"
      ? (React.use(params as any) as { id: string })
      : (params as { id: string });

  const userId = resolvedParams?.id;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: 0,
    gender: "",
    sport: "",
    state: "",
    profileImage: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        profileImage: data.profile?.profileImage ?? data.user?.avatarUrl ?? "",
      });
    } catch (err) {
      console.error(err);
      // optional: show UI error state
    } finally {
      setLoading(false);
    }
  };

  // simple badge logic
  const overall = useMemo(() => {
    if (!results.length) return { score: 0, badge: "Bronze" };
    const avg = Math.round(
      results.reduce((s, r) => s + (r.score || 0), 0) / results.length
    );
    const badge = avg >= 80 ? "Gold" : avg >= 60 ? "Silver" : "Bronze";
    return { score: avg, badge };
  }, [results]);

  // Chart data — improved structure for clearer tooltips and axis formatting
  const growthSeries = useMemo(() => {
    return results
      .slice()
      .reverse()
      .map((r) => {
        const date = new Date(r.createdAt);
        return {
          dateIso: date.toISOString(),
          dateShort: date.toLocaleDateString(),
          dateLabel: date.toLocaleString(),
          score: Number(r.score ?? 0),
        };
      });
  }, [results]);

  // determine Y axis domain (small padding) and stats
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
      results.reduce((acc: any, r: any) => {
        acc[r.exercise] = (acc[r.exercise] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));
    return counts;
  }, [results]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setAvatarFile(f);
  };

  // client-side unsigned upload to Cloudinary
  async function uploadToCloudinary(file: File) {
    if (!CLOUD_NAME || !UPLOAD_PRESET)
      throw new Error("Missing Cloudinary client config");
    return new Promise<{ secure_url: string }>((resolve, reject) => {
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable)
          setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const d = JSON.parse(xhr.responseText);
            resolve({ secure_url: d.secure_url });
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error("Cloudinary upload failed: " + xhr.responseText));
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);
      xhr.send(fd);
    });
  }

  const saveProfile = async () => {
    setSaving(true);
    try {
      let profileImageUrl = form.profileImage;
      if (avatarFile) {
        const uploaded = await uploadToCloudinary(avatarFile);
        profileImageUrl = uploaded.secure_url;
      }

      const body = {
        name: form.name,
        age: Number(form.age || 0),
        gender: form.gender,
        sport: form.sport,
        state: form.state,
        profileImage: profileImageUrl,
      };

      const res = await fetch(`/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");
      setProfile(data.profile);
      setEditing(false);
      setAvatarFile(null);
      setUploadProgress(0);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Save error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl pt-30 mx-auto p-6">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={user?.imageUrl || "/defaultImg.png"}
          alt="avatar"
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
        <div>
          <h2 className="text-2xl font-bold">
            {form.name || user?.name || "Athlete"}
          </h2>
          <div className="mt-2">
            Rank: <strong>{overall.badge}</strong> • Benchmark:{" "}
            <strong>{overall.score}</strong>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <span className="mr-4">
              Total tests: <strong>{results.length}</strong>
            </span>
            <span className="mr-4">
              Best score: <strong>{bestScore}</strong>
            </span>
            <span>
              Last test:{" "}
              <strong>{lastTest ? lastTest.toLocaleString() : "—"}</strong>
            </span>
          </div>
        </div>
        <div className="ml-auto">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                className="px-3 py-1 bg-green-600 text-white rounded"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setAvatarFile(null);
                }}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
         
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className=" p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Performance Over Time</h3>
            <div className="text-sm text-gray-600">
              Shows score per test (click points for details)
            </div>
          </div>

          {growthSeries.length ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  data={growthSeries}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="dateIso"
                    tickFormatter={(iso) => new Date(iso).toLocaleDateString()}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis domain={yDomain} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: any) => [`${value}`, "Score"]}
                    labelFormatter={(label: any) =>
                      new Date(label).toLocaleString()
                    }
                  />
                  <ReferenceLine
                    y={overall.score}
                    stroke="#4caf50"
                    strokeDasharray="3 3"
                    label={{
                      value: `Avg ${overall.score}`,
                      position: "right",
                      fill: "#4caf50",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No results yet</div>
          )}
        </div>

        <div className=" p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Test Distribution</h3>
            <div className="text-sm text-gray-600">Breakdown of test types</div>
          </div>

          {distribution.length ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
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
                    {distribution.map((entry: any, idx: number) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [value, name]}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No data</div>
          )}
        </div>
      </div>

      <div className="mt-6  p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Recent Results</h3>
        {results.length ? (
          results.map((r) => (
            <div
              key={r._id}
              className="flex items-center justify-between border rounded p-3 mb-2"
            >
              <div>
                <div className="font-medium">{r.exercise}</div>
                <div className="text-sm text-gray-500">
                  Score: {r.score} • {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {typeof r.reps !== "undefined" && (
                  <div className="text-sm">
                    Reps: <strong>{r.reps}</strong>
                  </div>
                )}
                {typeof r.jumpHeightCm !== "undefined" && (
                  <div className="text-sm">
                    Jump: <strong>{r.jumpHeightCm} cm</strong>
                  </div>
                )}
                {r.videoUrl && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={r.videoUrl}
                    className="text-sm text-blue-600"
                  >
                    View video
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No results.</div>
        )}
      </div>
    </div>
  );
}
