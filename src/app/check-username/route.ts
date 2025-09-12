// /pages/api/check-username.ts
import type { NextApiRequest, NextApiResponse } from "next";

import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
// Define the response type
type ResponseData = {
  exists?: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username } = req.query;

  // Validate username
  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "Username required" });
  }

  try {
    // Connect to DB
    await connectDB();

    // Check if username exists (always lowercase)
    const exists = await User.findOne({ username: username.toLowerCase() });

    return res.status(200).json({ exists: !!exists });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
