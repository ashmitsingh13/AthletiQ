// src/app/api/submit/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import ResultModel from "@/models/Result";
import UserModel from "@/models/User";

connectDB(); // ensure connection (safe to call multiple times thanks to caching helper)

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { metadata, videoUrl, athleteId } = body ?? {};

    // server-side validation
    if (!athleteId) return NextResponse.json({ error: "athleteId is required" }, { status: 400 });
    if (!metadata || typeof metadata !== "object")
      return NextResponse.json({ error: "metadata is required" }, { status: 400 });

    // optional: confirm athlete exists
    const athlete = await UserModel.findById(athleteId).lean();
    if (!athlete) return NextResponse.json({ error: "athlete not found" }, { status: 404 });

    // construct result doc
    const doc = {
      athleteId,
      exercise: metadata.exercise || "unknown",
      score: Number(metadata.score ?? 0),
      feedback: Array.isArray(metadata.feedback) ? metadata.feedback : [],
      corrections: Array.isArray(metadata.corrections) ? metadata.corrections : [],
      reps: metadata.reps ?? undefined,
      jumpHeightCm: metadata.jumpHeightCm ?? undefined,
      jumpDisplacementNorm: metadata.jumpDisplacementNorm ?? undefined,
      turns: metadata.turns ?? undefined,
      splitTimes: Array.isArray(metadata.splitTimes) ? metadata.splitTimes : undefined,
      cadence: metadata.cadence ?? undefined,
      trunkAngleAvg: metadata.trunkAngleAvg ?? undefined,
      trunkAngleMin: metadata.trunkAngleMin ?? undefined,
      trunkAngleMax: metadata.trunkAngleMax ?? undefined,
      distanceKm: metadata.distanceKm ?? undefined,
      durationSec: metadata.durationSec ?? undefined,
      paceMinPerKm: metadata.paceMinPerKm ?? undefined,
      videoUrl: videoUrl || "",
      createdAt: new Date(),
    };

    const saved = await ResultModel.create(doc);
    return NextResponse.json({ success: true, result: saved }, { status: 201 });
  } catch (err: any) {
    console.error("API /api/submit error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}