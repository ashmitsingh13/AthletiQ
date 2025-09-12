import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken, createAuthResponse } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const required = ["firstName", "lastName", "email", "password", "username", "dob", "gender"];
    for (const f of required) {
      if (!body?.[f]) return NextResponse.json({ success: false, error: `${f} is required` }, { status: 400 });
    }

    const email = String(body.email).trim().toLowerCase();
    const username = String(body.username).trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }
    
    const existing: any = await User.findOne({ $or: [{ email }, { username }] }).lean();
    if (existing) {
      const field = existing.email === email ? 'Email' : 'Username';
      return NextResponse.json({ success: false, error: `${field} already exists` }, { status: 409 });
    }

    const hashed = await bcrypt.hash(String(body.password), 10);

    // Validate dob before assigning
    const dobDate = new Date(body.dob);
    if (isNaN(dobDate.getTime())) {
      return NextResponse.json({ success: false, error: "Invalid date of birth" }, { status: 400 });
    }

    const user = new User({
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      name: `${String(body.firstName).trim()} ${String(body.lastName).trim()}`,
      username,
      email,
      password: hashed,
      dob: dobDate,
      weight: body.weight !== undefined && body.weight !== null ? Number(body.weight) : undefined,
      gender: body.gender,
      country: body.country,
      state: body.state,
      district: body.district,
      documentType: body.documentType,
      documentNumber: body.documentNumber,
      imageUrl: body.profileImage ? String(body.profileImage) : null,
    });

    await user.save();

    const safeUser = {
      _id: user._id,
      id: user._id.toString(), // ensure id is a string
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
    };

    const token = signToken({ sub: user._id.toString(), email: user.email });
    
    // Use createAuthResponse but override status to 201 for resource creation
    const response = createAuthResponse({ success: true, user: safeUser }, token);
    return new NextResponse(response.body, { status: 201, headers: response.headers });

  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    // Handle potential duplicate key error from MongoDB race condition
    if (err.code === 11000) {
        return NextResponse.json({ success: false, error: "Email or username already exists." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
