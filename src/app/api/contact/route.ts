import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "All fields required" }, { status: 400 });
    }

    // Example: just log (replace with email/DB logic)
    console.log("📩 New Contact Message:", { name, email, message });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
