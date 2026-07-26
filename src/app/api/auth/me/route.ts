import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const userId = verifySessionToken(token);
  if (!userId) return NextResponse.json({ user: null });

  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
  return NextResponse.json({ user: { id: userId }, profile: profile || null });
}
