// app/api/profile/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import Result from "@/models/Result";
import User from "@/models/User";

const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

export async function GET(req: Request, { params }: { params: any }) {
  try {
    // unwrap params if it's a Promise in some runtimes
    const resolved = await params;
    const id = resolved?.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Missing id param" }, { status: 400 });
    }

    await connectDB();

    const profile = await Profile.findOne({ userId: id }).lean();

    let user = null;
    if (OBJECTID_REGEX.test(id)) {
      user = await User.findById(id).lean();
    }

    if (!profile && !user) {
      return NextResponse.json({ success: false, error: "User/Profile not found" }, { status: 404 });
    }

    const results = await Result.find({ athleteId: id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, profile: profile || null, user: user || null, results }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/profile/:id error", err);
    return NextResponse.json({ success: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
