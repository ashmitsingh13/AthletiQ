import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import ResultModel, { IResult } from "@/models/Result";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body: Partial<IResult> = await req.json();

    const doc = await ResultModel.create(body);

    return NextResponse.json({ success: true, result: doc }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) console.error("POST /api/results error", err.message);
    else console.error("POST /api/results unknown error", err);

    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Server error" },
      { status: 500 }
    );
  }
}
