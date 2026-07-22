import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { weightLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json(
        { error: "profileId is required" },
        { status: 400 }
      );
    }

    const logs = await db
      .select()
      .from(weightLogs)
      .where(eq(weightLogs.profileId, parseInt(profileId)))
      .orderBy(desc(weightLogs.logDate), desc(weightLogs.createdAt))
      .limit(30);

    return NextResponse.json({ logs: logs.reverse() });
  } catch (error) {
    console.error("Error fetching weight logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch weight logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, weight, logDate } = body;

    const result = await db
      .insert(weightLogs)
      .values({
        profileId,
        weight,
        logDate,
      })
      .returning();

    return NextResponse.json({ log: result[0] });
  } catch (error) {
    console.error("Error creating weight log:", error);
    return NextResponse.json(
      { error: "Failed to create weight log" },
      { status: 500 }
    );
  }
}
