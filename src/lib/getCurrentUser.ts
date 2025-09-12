import { verifyToken, TOKEN_NAME } from "@/lib/auth";

export function getCurrentUserFromCookie(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  if (!cookieHeader) return null;

  const tokenPair = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${TOKEN_NAME}=`));
  if (!tokenPair) return null;

  const token = tokenPair.split("=").slice(1).join("=");
  if (!token) return null;

  const payload = verifyToken(token);
  return payload;
}