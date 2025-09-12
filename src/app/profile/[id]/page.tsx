// src/app/profile/[id]/page.tsx
import ProfileCharts from "./ProfileCharts";
import connectDB from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";
import Result, { IResult } from "@/models/Result";

interface ProfilePageProps {
  params: { id: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  await connectDB();

  const user = (await User.findById(params.id).lean()) as IUser | null;
  const results: IResult[] = await Result.find({ athleteId: params.id })
    .sort({ createdAt: -1 })
    .lean();

  return <ProfileCharts user={user} results={results} />;
}
