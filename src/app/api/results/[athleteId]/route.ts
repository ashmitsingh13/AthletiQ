import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Result from "@/models/Result";

export async function GET(_req: Request, { params }: { params: { athleteId: string } }) {
  try {
    await connectDB();
    const results = await Result.find({ athleteId: params.athleteId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/results/:athleteId error", err);
    return NextResponse.json({ success: false, error: err?.message || "Server error" }, { status: 500 });
  }
}