// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { getCurrentUserFromCookie } from "@/lib/getCurrentUser";

export async function GET(req: Request) {
  try {
    // ✅ Get user from cookies (JWT or session)
    const payload = await getCurrentUserFromCookie(req);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // ✅ Ensure DB connection before query
    await connectDB();

    // ✅ Fetch user securely
    const user = await User.findById(payload.sub)
      .select("_id name email username imageUrl")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Send sanitized response
    return NextResponse.json(
      { success: true, user },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/auth/me error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
