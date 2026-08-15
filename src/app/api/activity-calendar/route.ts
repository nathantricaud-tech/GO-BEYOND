import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { foodLogs, workoutLogs } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const month = searchParams.get("month"); // "YYYY-MM"
    if (!profileId || !month) {
      return NextResponse.json({ error: "profileId and month are required" }, { status: 400 });
    }
    const pid = parseInt(profileId);

    const [year, mon] = month.split("-").map(Number);
    const start = `${month}-01`;
    const lastDay = new Date(year, mon, 0).getDate(); // day 0 of next month = last day of this month
    const end = `${month}-${String(lastDay).padStart(2, "0")}`;

    const [foodRows, workoutRows] = await Promise.all([
      db
        .select({ logDate: foodLogs.logDate })
        .from(foodLogs)
        .where(and(eq(foodLogs.profileId, pid), gte(foodLogs.logDate, start), lte(foodLogs.logDate, end))),
      db
        .select({ logDate: workoutLogs.logDate })
        .from(workoutLogs)
        .where(and(eq(workoutLogs.profileId, pid), gte(workoutLogs.logDate, start), lte(workoutLogs.logDate, end))),
    ]);

    const foodDates = new Set(foodRows.map((r) => String(r.logDate)));
    const workoutDates = new Set(workoutRows.map((r) => String(r.logDate)));

    const days: Record<string, "workout" | "food" | "both"> = {};
    for (const d of new Set([...foodDates, ...workoutDates])) {
      const hasFood = foodDates.has(d);
      const hasWorkout = workoutDates.has(d);
      days[d] = hasFood && hasWorkout ? "both" : hasWorkout ? "workout" : "food";
    }

    return NextResponse.json({ days, daysInMonth: lastDay });
  } catch (error) {
    console.error("Error computing activity calendar:", error);
    return NextResponse.json({ error: "Failed to compute activity calendar" }, { status: 500 });
  }
}
