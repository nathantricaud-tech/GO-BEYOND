import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Email invalide ou mot de passe trop court (6 caractères min)." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await db.select().from(users).where(eq(users.email, normalizedEmail));
  if (existing.length > 0) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  }

  const [user] = await db
    .insert(users)
    .values({ email: normalizedEmail, passwordHash: hashPassword(password) })
    .returning();

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
