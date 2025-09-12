// src/app/api/analyze/route.ts
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // allow FormData
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const exerciseType = formData.get("exerciseType") as string;
    const video = formData.get("video");

    if (!exerciseType || !video) {
      return NextResponse.json(
        { success: false, error: "Missing exercise or video" },
        { status: 400 }
      );
    }

    // Mock result
    const result = {
      exercise: exerciseType,
      score: Math.floor(Math.random() * 41) + 60,
      feedback: ["Strong effort!", "Good consistency"],
      corrections: ["Keep posture straight", "Improve rhythm"],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("❌ API Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
