import jwt, { SignOptions } from "jsonwebtoken";
import { NextResponse } from "next/server";

export interface JwtPayload {
  sub: string;
  email?: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_production";
export const TOKEN_NAME = "token";

const COOKIE_DEFAULTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export function signToken(
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn,
  };
  return jwt.sign(payload as object, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function createAuthResponse(
  body: Record<string, unknown>,
  token: string,
  maxAgeSec = 60 * 60 * 24 * 7
) {
  const res = NextResponse.json(body, { status: 200 });
  res.cookies.set({
    name: TOKEN_NAME,
    value: token,
    ...COOKIE_DEFAULTS,
    maxAge: maxAgeSec,
  });
  return res;
}

export function clearAuthCookie() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: TOKEN_NAME,
    value: "",
    ...COOKIE_DEFAULTS,
    maxAge: 0,
  });
  return res;
}
