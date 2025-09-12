import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Result from "@/models/Result";
import Profile from "@/models/Profile";

const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

export async function GET(
  _req: Request,
  { params }: { params: { id: string } } // Ye App Router ke liye correct
) {
  try {
    await connectDB();

    const id = params.id;
    if (!id || typeof id !== "string" || !OBJECTID_REGEX.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing id parameter" },
        { status: 400 }
      );
    }
    
    const results = await Result.find({ athleteId: id })
      .sort({ createdAt: -1 })
      .lean();

    const profile = await Profile.findOne({ userId: id }).lean();

    return NextResponse.json({ success: true, results, profile }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Server error";
    console.error("GET /api/athlete/:id error", err);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
