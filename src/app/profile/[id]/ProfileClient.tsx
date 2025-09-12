"use client";

import React, { useEffect, useState } from "react";

type Props = { userId: string };

interface User {
  _id: string;
  name: string;
  email?: string;
  // add other fields if needed
}

interface Profile {
  name?: string;
  sport?: string;
  // add other profile-specific fields if needed
}

interface TestReport {
  _id: string;
  exerciseType: string;
  score: number;
  feedback?: string[];
}

interface Result {
  _id: string;
  exercise: string;
  score: number;
  createdAt: string;
  feedback?: string[];
  testReportIds?: TestReport[];
  testReports?: TestReport[];
}

export default function ProfileClient({ userId }: Props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/profile/${userId}`);
        const data: {
          success: boolean;
          user?: User;
          profile?: Profile;
          results?: Result[];
          error?: string;
        } = await res.json();

        if (data.success) {
          setUser(data.user ?? null);
          setProfile(data.profile ?? null);
          setResults(data.results ?? []);
        } else {
          console.error("API error:", data.error);
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
      <div className="p-6 rounded shadow">
        <h1 className="text-2xl font-bold">
          {profile?.name ?? user?.name ?? "Athlete"}
        </h1>
        <p className="text-gray-600">{profile?.sport ?? "Sport not specified"}</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        {results.length === 0 ? (
          <p className="text-gray-500">No results yet.</p>
        ) : (
          results.map((r) => (
            <div key={r._id} className="border rounded p-4 mb-3 space-y-2">
              <h3 className="font-medium">
                {r.exercise} — Score: {r.score}
              </h3>
              <p className="text-gray-500">
                When: {new Date(r.createdAt).toLocaleString()}
              </p>
              {Array.isArray(r.feedback) && r.feedback.length > 0 && (
                <div>
                  <strong>Feedback:</strong>
                  <ul className="list-disc list-inside text-gray-600">
                    {r.feedback.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              {((r.testReportIds || r.testReports) ?? []).length > 0 && (
                <div>
                  <strong>Test Reports:</strong>
                  {((r.testReportIds || r.testReports) ?? []).map((tr) => (
                    <div key={tr._id} className="ml-4">
                      <p>
                        <strong>{tr.exerciseType}</strong> — Score: {tr.score}
                      </p>
                      {Array.isArray(tr.feedback) && tr.feedback.length > 0 && (
                        <ul className="list-disc list-inside text-gray-600">
                          {tr.feedback.map((f, i) => (
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
