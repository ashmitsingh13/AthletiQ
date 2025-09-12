import ProfileCharts from "@/app/profile/[id]/ProfileCharts"; // client component
import connectDB from "@/lib/dbConnect";
import Result from "@/models/Result";
import Profile from "@/models/Profile";
import { IUser } from "@/models/User";
import { IResult } from "@/models/Result";

interface PageProps {
  params: { id: string };
}

export default async function ProfilePage({ params }: PageProps) {
  const id = params.id;

  await connectDB();

  const results = await Result.find({ athleteId: id })
    .sort({ createdAt: -1 })
    .lean<IResult[]>();

  const profile = await Profile.findOne({ userId: id }).lean<IUser>();

  return <ProfileCharts user={profile} results={results} />;
}
