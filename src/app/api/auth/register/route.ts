import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken, createAuthResponse } from "@/lib/auth";

interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  weight?: number;
  country?: string;
  state?: string;
  district?: string;
  documentType?: string;
  documentNumber?: string;
  profileImage?: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body: RegisterBody = await req.json();

    const required: (keyof RegisterBody)[] = [
      "firstName",
      "lastName",
      "email",
      "password",
      "username",
      "dob",
      "gender",
    ];

    for (const f of required) {
      if (!body?.[f]) {
        return NextResponse.json(
          { success: false, error: `${f} is required` },
          { status: 400 }
        );
      }
    }

    const email = body.email.trim().toLowerCase();
    const username = body.username.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const existing: IUser | null = await User.findOne({
      $or: [{ email }, { username }],
    }).lean<IUser>();

    if (existing) {
      const field = existing.email === email ? "Email" : "Username";
      return NextResponse.json(
        { success: false, error: `${field} already exists` },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(body.password, 10);

    const dobDate = new Date(body.dob);
    if (isNaN(dobDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date of birth" },
        { status: 400 }
      );
    }

    const user = new User({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      name: `${body.firstName.trim()} ${body.lastName.trim()}`,
      username,
      email,
      password: hashed,
      dob: dobDate,
      weight: body.weight ?? undefined,
      gender: body.gender,
      country: body.country,
      state: body.state,
      district: body.district,
      documentType: body.documentType,
      documentNumber: body.documentNumber,
      imageUrl: body.profileImage ?? null,
    });

    await user.save();

    const safeUser = {
      _id: user._id.toString(),
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
    };

    const token = signToken({ sub: user._id.toString(), email: user.email });

    const response = createAuthResponse({ success: true, user: safeUser }, token);
    return new NextResponse(response.body, {
      status: 201,
      headers: response.headers,
    });
  } catch (err: unknown) {
    console.error("REGISTER ERROR:", err);

    if (err instanceof Error && "code" in err && (err as any).code === 11000) {
      return NextResponse.json(
        { success: false, error: "Email or username already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
