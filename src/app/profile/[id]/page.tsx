// ./src/app/profile/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import ProfileCharts from "./ProfileCharts";
import { IUser } from "@/models/User";
import { IResult } from "@/models/Result";

interface Params {
  id: string;
}

interface ProfilePageProps {
  params: Params;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [results, setResults] = useState<IResult[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/profile/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setUser(data.user ?? null);
          setResults(data.results ?? []);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) return <div className="p-6">Loading...</div>;

  return <ProfileCharts user={user} results={results} />;
}
