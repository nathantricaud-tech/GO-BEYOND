import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { waterLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const date = searchParams.get("date");
    if (!profileId || !date) return NextResponse.json({ error: "Missing params" }, { status: 400 });

    const logs = await db.select().from(waterLogs)
      .where(and(eq(waterLogs.profileId, parseInt(profileId)), eq(waterLogs.logDate, date)));

    return NextResponse.json({ glasses: logs[0]?.glasses || 0, id: logs[0]?.id || null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { profileId, glasses, date } = await request.json();

    // Upsert: check if entry exists for today
    const existing = await db.select().from(waterLogs)
      .where(and(eq(waterLogs.profileId, profileId), eq(waterLogs.logDate, date)));

    if (existing.length > 0) {
      await db.update(waterLogs)
        .set({ glasses })
        .where(eq(waterLogs.id, existing[0].id));
    } else {
      await db.insert(waterLogs).values({ profileId, glasses, logDate: date });
    }

    return NextResponse.json({ success: true, glasses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
