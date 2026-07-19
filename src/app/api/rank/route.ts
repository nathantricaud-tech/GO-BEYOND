import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { foodLogs, workoutLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { computeRank, computePointsFromDates, computeCurrentStreak, RANKS } from "@/lib/ranks";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    if (!profileId) {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 });
    }
    const pid = parseInt(profileId);

    const [foodRows, workoutRows] = await Promise.all([
      db.select({ logDate: foodLogs.logDate }).from(foodLogs).where(eq(foodLogs.profileId, pid)),
      db.select({ logDate: workoutLogs.logDate }).from(workoutLogs).where(eq(workoutLogs.profileId, pid)),
    ]);

    const foodDates = new Set(foodRows.map((r) => String(r.logDate)));
    const workoutDates = new Set(workoutRows.map((r) => String(r.logDate)));

    const points = computePointsFromDates(foodDates, workoutDates);
    const result = computeRank(points);
    const streak = computeCurrentStreak(foodDates, workoutDates);
    const totalActiveDays = new Set([...foodDates, ...workoutDates]).size;
    const totalFullDays = [...foodDates].filter((d) => workoutDates.has(d)).length;

    return NextResponse.json({
      ...result,
      streak,
      totalActiveDays,
      totalFullDays,
      allRanks: RANKS,
    });
  } catch (error) {
    console.error("Error computing rank:", error);
    return NextResponse.json({ error: "Failed to compute rank" }, { status: 500 });
  }
}
