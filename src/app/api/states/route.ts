// src/app/api/states/route.ts
import { NextResponse } from "next/server";

interface State {
  name: string;
}

interface StatesApiResponse {
  error: boolean;
  msg: string;
  data: {
    name: string;
    iso3: string;
    states: State[];
  };
}

export async function POST(req: Request) {
  try {
    const body: { country?: string } = await req.json();
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

    const json: StatesApiResponse = await res.json();

    const states = Array.isArray(json?.data?.states)
      ? json.data.states.map((s: State) => s.name)
      : [];

    return NextResponse.json({ data: states });
  } catch (err: unknown) {
    console.error("states route error", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
