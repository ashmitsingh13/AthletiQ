// src/app/api/states/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const country = (body?.country || "").trim();
    if (!country) return NextResponse.json({ data: [] });

    const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    });

    if (!res.ok) {
      return NextResponse.json({ data: [] });
    }

    const json = await res.json();
    // json.data.states is array of {name}
    const states = Array.isArray(json?.data?.states)
      ? json.data.states.map((s: any) => s.name)
      : [];
    return NextResponse.json({ data: states });
  } catch (err: any) {
    console.error("states route error", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
