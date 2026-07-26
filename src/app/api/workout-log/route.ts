import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workoutLogs } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const date = searchParams.get("date");
    if (!profileId) return NextResponse.json({ error: "Missing profileId" }, { status: 400 });

    const conditions = [eq(workoutLogs.profileId, parseInt(profileId))];
    if (date) conditions.push(eq(workoutLogs.logDate, date));

    const logs = await db.select().from(workoutLogs)
      .where(and(...conditions))
      .orderBy(desc(workoutLogs.createdAt))
      .limit(50);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await db.insert(workoutLogs).values({
      profileId: body.profileId,
      exerciseName: body.exerciseName,
      category: body.category,
      duration: body.duration,
      caloriesBurned: body.caloriesBurned || 0,
      sets: body.sets || null,
      reps: body.reps || null,
      weight_used: body.weightUsed || null,
      notes: body.notes || null,
      logDate: body.logDate,
    }).returning();

    return NextResponse.json({ log: result[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
