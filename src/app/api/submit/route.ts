// src/app/api/submit/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import ResultModel from "@/models/Result";
import UserModel from "@/models/User";

connectDB(); // ensure connection (cached)

interface Metadata {
  exercise?: string;
  score?: number;
  feedback?: string[];
  corrections?: string[];
  reps?: number;
  jumpHeightCm?: number;
  jumpDisplacementNorm?: number;
  turns?: number;
  splitTimes?: number[];
  cadence?: number;
  trunkAngleAvg?: number;
  trunkAngleMin?: number;
  trunkAngleMax?: number;
  distanceKm?: number;
  durationSec?: number;
  paceMinPerKm?: number;
}

interface SubmitBody {
  athleteId: string;
  videoUrl?: string;
  metadata: Metadata;
}

export async function POST(req: Request) {
  try {
    const body: SubmitBody = await req.json();
    const { metadata, videoUrl, athleteId } = body;

    if (!athleteId) {
      return NextResponse.json({ error: "athleteId is required" }, { status: 400 });
    }

    if (!metadata || typeof metadata !== "object") {
      return NextResponse.json({ error: "metadata is required" }, { status: 400 });
    }

    // confirm athlete exists
    const athlete = await UserModel.findById(athleteId).lean();
    if (!athlete) {
      return NextResponse.json({ error: "athlete not found" }, { status: 404 });
    }

    // construct result doc
    const doc = {
      athleteId,
      exercise: metadata.exercise || "unknown",
      score: Number(metadata.score ?? 0),
      feedback: Array.isArray(metadata.feedback) ? metadata.feedback : [],
      corrections: Array.isArray(metadata.corrections) ? metadata.corrections : [],
      reps: metadata.reps,
      jumpHeightCm: metadata.jumpHeightCm,
      jumpDisplacementNorm: metadata.jumpDisplacementNorm,
      turns: metadata.turns,
      splitTimes: Array.isArray(metadata.splitTimes) ? metadata.splitTimes : undefined,
      cadence: metadata.cadence,
      trunkAngleAvg: metadata.trunkAngleAvg,
      trunkAngleMin: metadata.trunkAngleMin,
      trunkAngleMax: metadata.trunkAngleMax,
      distanceKm: metadata.distanceKm,
      durationSec: metadata.durationSec,
      paceMinPerKm: metadata.paceMinPerKm,
      videoUrl: videoUrl || "",
      createdAt: new Date(),
    };

    const saved = await ResultModel.create(doc);
    return NextResponse.json({ success: true, result: saved }, { status: 201 });
  } catch (err: unknown) {
    console.error("API /api/submit error:", err);

    let message = "Server error";
    if (err instanceof Error) message = err.message;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
