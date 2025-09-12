import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Result from "@/models/Result";
import Profile from "@/models/Profile";
import User from "@/models/User";

const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const id = params.id;
    if (!id || typeof id !== "string" || !OBJECTID_REGEX.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid or missing id parameter" }, { status: 400 });
    }

    const results = await Result.find({ athleteId: id })
      .sort({ createdAt: -1 })
      .lean();

    const profile = await Profile.findOne({ userId: id }).lean();

    return NextResponse.json({ success: true, results, profile }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/athlete/:id error", err);
    return NextResponse.json({ success: false, error: err?.message || "Server error" }, { status: 500 });
  }
}