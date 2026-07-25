import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail));
  if (!user || !verifyPassword(password || "", user.passwordHash)) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  }

  const token = createSessionToken(user.id);
  const res = NextResponse.json({ userId: user.id });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
