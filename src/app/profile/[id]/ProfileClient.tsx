// src/app/profile/[id]/ProfileClient.tsx
"use client";

import React, { useEffect, useState } from "react";

type Props = { userId: string };

export default function ProfileClient({ userId }: Props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/profile/${userId}`);
        const data = await res.json();
        if (data?.success) {
          setUser(data.user ?? null);
          setProfile(data.profile ?? null);
          setResults(data.results ?? []);
        } else {
          console.error("API error:", data?.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div>Loading profile…</div>;

  return (
   <div className="max-w-3xl mx-auto p-6 space-y-6">
  <div className=" p-6 rounded shadow">
    <h1 className="text-2xl font-bold">{profile?.name ?? user?.name ?? "Athlete"}</h1>
    <p className="text-gray-600">{profile?.sport ?? "Sport not specified"}</p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Test Results</h2>
    {results.length === 0 ? (
      <p className="text-gray-500">No results yet.</p>
    ) : (
      results.map((r) => (
        <div key={r._id} className="border rounded p-4 mb-3 space-y-2">
          <h3 className="font-medium">{r.exercise} — Score: {r.score}</h3>
          <p className="text-gray-500">When: {new Date(r.createdAt).toLocaleString()}</p>
          {r.feedback?.length > 0 && (
            <div>
              <strong>Feedback:</strong>
              <ul className="list-disc list-inside text-gray-600">
                {r.feedback.map((f: string, i: number) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {(r.testReportIds || r.testReports)?.length > 0 && (
            <div>
              <strong>Test Reports:</strong>
              {(r.testReportIds || r.testReports).map((tr: any) => (
                <div key={tr._id} className="ml-4">
                  <p>
                    <strong>{tr.exerciseType}</strong> — Score: {tr.score}
                  </p>
                  {tr.feedback?.length > 0 && (
                    <ul className="list-disc list-inside text-gray-600">
                      {tr.feedback.map((f: string, i: number) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))
    )}
  </div>
</div>

  );
}
