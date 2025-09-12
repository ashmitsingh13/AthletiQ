import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";
import Result, { IResult } from "@/models/Result";
import Profile, { IProfile } from "@/models/Profile";
import { Types } from "mongoose";

const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const segments = url.pathname.split("/"); // ['', 'api', 'profile', '[id]']
    const id = segments[segments.length - 1];

    if (!id || !OBJECTID_REGEX.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing id parameter" },
        { status: 400 }
      );
    }

    const user: IUser | null = await User.findById(id)
      .select("-password")
      .lean<IUser>();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Fetch results
    const results: IResult[] = await Result.find({ athleteId: new Types.ObjectId(id) })
      .sort({ createdAt: -1 })
      .lean<IResult[]>();

    // Fetch additional profile (if exists)
    const profile: IProfile | null = await Profile.findOne({ userId: new Types.ObjectId(id) })
      .lean<IProfile>();

    return NextResponse.json({ success: true, user, results, profile }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Server error";
    console.error("GET /api/profile/:id error", err);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
