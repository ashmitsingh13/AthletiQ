// src/app/api/countries/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Prefer countriesnow.space but fallback to restcountries
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
      if (res.ok) {
        const json = await res.json();
        // json.data is array of {name, iso2, long, lat}
        const names = Array.isArray(json?.data)
          ? json.data.map((c: any) => c.name).filter(Boolean).sort()
          : [];
        return NextResponse.json({ data: names });
      }
      // fallback
    } catch (e) {
      // fallback to restcountries below
    }

    const rest = await fetch("https://restcountries.com/v3.1/all");
    if (!rest.ok) throw new Error("Failed restcountries");
    const all = await rest.json();
    const names = Array.isArray(all)
      ? all.map((c: any) => c?.name?.common).filter(Boolean).sort()
      : [];
    return NextResponse.json({ data: names });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
  }
}
