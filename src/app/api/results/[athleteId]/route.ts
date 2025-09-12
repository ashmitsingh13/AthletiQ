import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Result, { IResult } from "@/models/Result";

export async function GET(
  _req: Request,
  { params }: { params: { athleteId: string } }
) {
  try {
    await connectDB();
    const results = await Result.find({ athleteId: params.athleteId })
      .sort({ createdAt: -1 })
      .lean<IResult[]>();

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) console.error("GET /api/results/:athleteId error", err.message);
    else console.error("GET /api/results/:athleteId unknown error", err);

    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Server error" },
      { status: 500 }
    );
  }
}
