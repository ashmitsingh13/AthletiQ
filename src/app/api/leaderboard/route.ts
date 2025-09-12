import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Result from "@/models/Result";
import User from "@/models/User";
import Profile from "@/models/Profile";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view") || "district";

    // 1. Aggregate results per athlete
    const scores = await Result.aggregate([
      {
        $group: {
          _id: "$athleteId",
          avgScore: { $avg: "$score" },
          totalScore: { $sum: "$score" },
          testsCount: { $sum: 1 },
        },
      },
      { $sort: { avgScore: -1 } },
    ]);

    // 2. Enrich with User + Profile
    const athletes = await Promise.all(
      scores.map(async (s: any) => {
        const user = await User.findById(s._id)
          .select("name firstName lastName state district imageUrl")
          .lean();
        const profile = await Profile.findOne({ userId: s._id })
          .select("name profileImage state")
          .lean();

        return {
          id: s._id.toString(),
          name:
            profile?.name ||
            user?.name ||
            `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          state: profile?.state || user?.state || "Unknown",
          district: user?.district || "Unknown",
          imageUrl: profile?.profileImage || user?.imageUrl || "/defaultImg.png",
          score: Math.round(s.avgScore),
          testsCount: s.testsCount,
        };
      })
    );

    // 3. Sort + assign ranks
    athletes.sort((a, b) => b.score - a.score);
    const leaderboard = athletes.map((athlete, i) => ({
      ...athlete,
      rank: i + 1,
    }));

    // 4. Filter by view
    let filtered = leaderboard;
    if (view === "district") {
      filtered = leaderboard.filter((a) => !!a.district);
    } else if (view === "state") {
      filtered = leaderboard.filter((a) => !!a.state);
    }

    return NextResponse.json({ success: true, leaderboard: filtered });
  } catch (err: any) {
    console.error("GET /api/leaderboard error", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
