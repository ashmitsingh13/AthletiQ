// app/auth/login/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get("next") ?? null;

  // useAuth provides: login(), authProcessing, isAuthenticated, user (optional)
  const { login, authProcessing, isAuthenticated, user: authUser } = useAuth();

  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated — done inside useEffect to avoid routing during render
  useEffect(() => {
    if (!isAuthenticated) return;

    // Prefer the explicit next param if present, otherwise go to profile (with id if available)

    // Always redirect to /annexure-a after login
    router.replace("/annexure-a");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authUser, nextUrl]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // login returns { success, user?, error? } or throws
      const result = (await login({
        emailOrUsername: form.emailOrUsername,
        password: form.password,
      })) as { success: boolean; user?: { _id: string }; error?: string };
      // Determine destination: next param -> profile/:id (if result.user._id) -> /profile
      router.replace("/annexure-a");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full border rounded p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={form.emailOrUsername}
            onChange={(e) =>
              setForm({ ...form, emailOrUsername: e.target.value })
            }
            placeholder="Email or username"
            className="w-full p-2 border rounded"
            autoComplete="username"
          />

          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded"
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={authProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {authProcessing ? "Signing in…" : "Sign in"}
            </button>

            <Link
              className="text-sm text-blue-600"
              href={`/auth/signup${
                nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""
              }`}
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
