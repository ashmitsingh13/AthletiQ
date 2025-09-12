"use client";

import type React from "react";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/common/NavBar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
