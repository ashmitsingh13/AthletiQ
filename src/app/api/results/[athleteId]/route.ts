import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Result, { IResult } from "@/models/Result";

const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

export async function GET(req: Request) {
  try {
    await connectDB();

    // Extract athleteId from URL
    const url = new URL(req.url);
    const segments = url.pathname.split("/"); // ['', 'api', 'results', 'athleteId']
    const athleteId = segments[segments.length - 1];

    if (!athleteId || !OBJECTID_REGEX.test(athleteId)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing athleteId" },
        { status: 400 }
      );
    }

    const results = await Result.find({ athleteId })
      .sort({ createdAt: -1 })
      .lean<IResult[]>();

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Server error";
    console.error("GET /api/results/:athleteId error", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
