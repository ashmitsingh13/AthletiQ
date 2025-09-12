import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Result from "@/models/Result";
import Profile from "@/models/Profile";

const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

export async function GET(req: Request) {
  try {
    await connectDB();

    // Extract id from URL
    const url = new URL(req.url);
    const segments = url.pathname.split("/"); // ['', 'api', 'profile', 'id']
    const id = segments[segments.length - 1];

    if (!id || !OBJECTID_REGEX.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid or missing id parameter" }, { status: 400 });
    }

    const results = await Result.find({ athleteId: id }).sort({ createdAt: -1 }).lean();
    const profile = await Profile.findOne({ userId: id }).lean();

    return NextResponse.json({ success: true, results, profile }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
