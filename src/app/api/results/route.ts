import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import ResultModel from "@/models/Result";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const doc = await ResultModel.create(body);
    return NextResponse.json({ success: true, result: doc }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/results error", err);
    return NextResponse.json({ success: false, error: err?.message || "Server error" }, { status: 500 });
  }
}