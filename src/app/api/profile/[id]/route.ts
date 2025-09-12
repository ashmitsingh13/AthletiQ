// ./src/app/api/profile/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Profile, { IProfile } from "@/models/Profile";
import Result, { IResult } from "@/models/Result";
import User, { IUser } from "@/models/User";
import { Types } from "mongoose";

const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

interface Params {
  id: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Params }
) {
  try {
    const id = params.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid id param" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch profile
    const profile: IProfile | null = await Profile.findOne({ userId: id }).lean<IProfile>();

    // Fetch user only if valid ObjectId
    let user: IUser | null = null;
    if (OBJECTID_REGEX.test(id)) {
      user = await User.findById(new Types.ObjectId(id))
        .select("-password")
        .lean<IUser>();
    }

    if (!profile && !user) {
      return NextResponse.json(
        { success: false, error: "User/Profile not found" },
        { status: 404 }
      );
    }

    // Fetch results
    const results: IResult[] = await Result.find({ athleteId: new Types.ObjectId(id) })
      .sort({ createdAt: -1 })
      .lean<IResult[]>();

    return NextResponse.json(
      { success: true, profile: profile || null, user: user || null, results },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("GET /api/profile/:id error", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
