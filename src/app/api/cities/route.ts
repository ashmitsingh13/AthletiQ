// src/app/api/cities/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const country = (body?.country || "").trim();
    const state = (body?.state || "").trim();
    if (!country || !state) return NextResponse.json({ data: [] });

    const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, state }),
    });

    if (!res.ok) return NextResponse.json({ data: [] });

    const json = await res.json();
    const cities = Array.isArray(json?.data) ? json.data : [];
    return NextResponse.json({ data: cities });
  } catch (err: any) {
    console.error("cities route error", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
