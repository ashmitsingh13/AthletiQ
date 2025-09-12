// src/app/profile/[id]/page.tsx
import ProfileCharts from "./ProfileCharts";
import connectDB from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";
import Result, { IResult } from "@/models/Result";

// Correct type definition for Next.js App Router dynamic pages
interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Establish database connection before fetching data.
  await connectDB();

  // Fetch user and results data from the database.
  // Using .lean() for performance by returning plain JavaScript objects.
  const user = await User.findById(params.id).lean<IUser>();
  const results: IResult[] = await Result.find({ athleteId: params.id })
    .sort({ createdAt: -1 })
    .lean<IResult[]>();

  // Pass the fetched data to the ProfileCharts component.
  return <ProfileCharts user={user} results={results} />;
}