// ./src/app/api/profile/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Profile, { IProfile } from "@/models/Profile";
import Result, { IResult } from "@/models/Result";
import User, { IUser } from "@/models/User";
import { Types } from "mongoose";

const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

export async function GET(req: Request) {
  try {
    await connectDB();

    // URL se id extract karen
    const url = new URL(req.url);
    const segments = url.pathname.split("/"); // ['', 'api', 'profile', 'id']
    const id = segments[segments.length - 1];

    if (!id || !OBJECTID_REGEX.test(id)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid id" },
        { status: 400 }
      );
    }

    // User fetch
    const user: IUser | null = await User.findById(new Types.ObjectId(id))
      .select("-password")
      .lean<IUser>();

    // Profile fetch
    const profile: IProfile | null = await Profile.findOne({ userId: new Types.ObjectId(id) }).lean<IProfile>();

    // Results fetch
    const results: IResult[] = await Result.find({ athleteId: new Types.ObjectId(id) })
      .sort({ createdAt: -1 })
      .lean<IResult[]>();

    if (!user && !profile) {
      return NextResponse.json(
        { success: false, error: "User/Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, user, profile, results },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("GET /api/profile/:id error", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
