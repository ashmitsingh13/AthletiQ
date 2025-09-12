// src/app/api/countries/route.ts
import { NextResponse } from "next/server";

type CountriesNowResponse = {
  data?: { name: string; iso2: string; long: number; lat: number }[];
};

type RestCountriesResponse = {
  name?: { common?: string };
}[];

export async function GET() {
  try {
    // Prefer countriesnow.space but fallback to restcountries
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
      if (res.ok) {
        const json: CountriesNowResponse = await res.json();
        const names = Array.isArray(json?.data)
          ? json.data.map((c) => c.name).filter(Boolean).sort()
          : [];
        return NextResponse.json({ data: names });
      }
      // fallback
    } catch {
      // fallback to restcountries below
    }

    const rest = await fetch("https://restcountries.com/v3.1/all");
    if (!rest.ok) throw new Error("Failed restcountries");

    const all: RestCountriesResponse = await rest.json();
    const names = Array.isArray(all)
      ? all.map((c) => c?.name?.common).filter(Boolean).sort()
      : [];

    return NextResponse.json({ data: names });
  } catch {
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
  }
}
