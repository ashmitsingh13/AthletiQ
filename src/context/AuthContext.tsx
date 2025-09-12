"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

type User = {
  _id: string;
  name?: string;
  email?: string;
  username?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authProcessing: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<User | null>;
  login: (payload: {
    emailOrUsername: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  register: (payload: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authProcessing, setAuthProcessing] = useState(false);
  const router = useRouter();

  const refreshUser = async (): Promise<User | null> => {
    try {
      setLoading(true);
      const resp = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });
      const data = await resp.json();
      if (!resp.ok) {
        setUser(null);
        return null;
      }
      setUser(data.user || null);
      return data.user || null;
    } catch (err) {
      console.error("refreshUser error:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (payload: {
    emailOrUsername: string;
    password: string;
  }) => {
    setAuthProcessing(true);
    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      await refreshUser();
      return { success: true };
    } catch (err: any) {
      console.error("login error", err);
      return { success: false, error: err?.message || "Network error" };
    } finally {
      setAuthProcessing(false);
    }
  };

  const register = async (payload: any) => {
    setAuthProcessing(true);
    try {
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      await refreshUser();
      return { success: true };
    } catch (err: any) {
      console.error("register error", err);
      return { success: false, error: err?.message || "Network error" };
    } finally {
      setAuthProcessing(false);
    }
  };

  const logout = async () => {
    setAuthProcessing(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/auth/login");
    } catch (err) {
      console.error("logout error", err);
    } finally {
      setAuthProcessing(false);
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    authProcessing,
    isAuthenticated: !!user,
    refreshUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};
