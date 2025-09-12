import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Result from "@/models/Result";
import User, { IUser } from "@/models/User";
import Profile, { IProfile } from "@/models/Profile";

// Type for aggregation result
interface ScoreAgg {
  _id: string;        // athleteId
  avgScore: number;
  totalScore: number;
  testsCount: number;
}

// Type for leaderboard athlete
interface LeaderboardAthlete {
  id: string;
  name: string;
  state: string;
  district: string;
  imageUrl: string;
  score: number;
  testsCount: number;
  rank?: number;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view") || "district";

    // 1. Aggregate results per athlete
    const scores: ScoreAgg[] = await Result.aggregate([
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
    const athletes: LeaderboardAthlete[] = await Promise.all(
      scores.map(async (s: ScoreAgg) => {
        const user = await User.findById(s._id)
          .select("name firstName lastName state district imageUrl")
          .lean<IUser | null>(); // ✅ explicitly typed

        const profile = await Profile.findOne({ userId: s._id })
          .select("name profileImage state")
          .lean<IProfile | null>(); // ✅ explicitly typed

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
    const leaderboard: LeaderboardAthlete[] = athletes.map((athlete, i) => ({
      ...athlete,
      rank: i + 1,
    }));

    // 4. Filter by view
    let filtered: LeaderboardAthlete[] = leaderboard;
    if (view === "district") {
      filtered = leaderboard.filter((a) => !!a.district);
    } else if (view === "state") {
      filtered = leaderboard.filter((a) => !!a.state);
    }

    return NextResponse.json({ success: true, leaderboard: filtered });
  } catch (err: unknown) {
    if (err instanceof Error) console.error("GET /api/leaderboard error", err.message);
    else console.error("GET /api/leaderboard unknown error", err);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
