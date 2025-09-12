import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Profile, { IProfile } from "@/models/Profile";
import Result, { IResult } from "@/models/Result";
import User, { IUser } from "@/models/User";

const OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

export async function GET(
  req: Request,
  { params }: { params: { id: string } } // ✅ typed params
) {
  try {
    // unwrap params if it's a Promise in some runtimes
    const resolved = await params;
    const id = resolved?.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing id param" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Typed lean returns
    const profile = await Profile.findOne({ userId: id }).lean<IProfile | null>();

    let user: IUser | null = null;
    if (OBJECTID_REGEX.test(id)) {
      user = await User.findById(id).lean<IUser | null>();
    }

    if (!profile && !user) {
      return NextResponse.json(
        { success: false, error: "User/Profile not found" },
        { status: 404 }
      );
    }

    const results = await Result.find({ athleteId: id })
      .sort({ createdAt: -1 })
      .lean<IResult[]>(); // ✅ typed lean return

    return NextResponse.json(
      {
        success: true,
        profile: profile || null,
        user: user || null,
        results,
      },
      { status: 200 }
    );
  } catch (err: unknown) { // ✅ unknown instead of any
    if (err instanceof Error) console.error("GET /api/profile/:id error", err.message);
    else console.error("GET /api/profile/:id unknown error", err);

    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Server error" },
      { status: 500 }
    );
  }
}
