import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { foodLogs, workoutLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { computeRank, computePointsFromDates, computeCurrentStreak, RANKS, QUEST_BONUS_POINTS } from "@/lib/ranks";
import { getDailyQuest } from "@/lib/daily-quest";

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
      db.select({ logDate: workoutLogs.logDate, exerciseName: workoutLogs.exerciseName }).from(workoutLogs).where(eq(workoutLogs.profileId, pid)),
    ]);

    const foodDates = new Set(foodRows.map((r) => String(r.logDate)));
    const workoutDates = new Set(workoutRows.map((r) => String(r.logDate)));

    // Quest bonus: for every day the profile has any workout log, check
    // whether that day's deterministic quest exercise was among the ones
    // logged that day. No extra table needed — the quest for any past date
    // is recomputed the same way it was originally shown.
    const workoutsByDate = new Map<string, Set<string>>();
    for (const row of workoutRows) {
      const d = String(row.logDate);
      if (!workoutsByDate.has(d)) workoutsByDate.set(d, new Set());
      workoutsByDate.get(d)!.add(row.exerciseName);
    }
    let questBonusPoints = 0;
    let questsCompleted = 0;
    for (const [date, exerciseNames] of workoutsByDate.entries()) {
      const quest = getDailyQuest(pid, date);
      if (exerciseNames.has(quest.name)) {
        questBonusPoints += QUEST_BONUS_POINTS;
        questsCompleted++;
      }
    }

    const basePoints = computePointsFromDates(foodDates, workoutDates);
    const points = basePoints + questBonusPoints;
    const result = computeRank(points);
    const streak = computeCurrentStreak(foodDates, workoutDates);
    const totalActiveDays = new Set([...foodDates, ...workoutDates]).size;
    const totalFullDays = [...foodDates].filter((d) => workoutDates.has(d)).length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const todaysQuest = getDailyQuest(pid, todayStr);
    const questDoneToday = (workoutsByDate.get(todayStr) || new Set()).has(todaysQuest.name);

    return NextResponse.json({
      ...result,
      streak,
      totalActiveDays,
      totalFullDays,
      questsCompleted,
      allRanks: RANKS,
      todaysQuest: { id: todaysQuest.id, name: todaysQuest.name, emoji: todaysQuest.emoji, difficulty: todaysQuest.difficulty, defaultSets: todaysQuest.defaultSets, defaultReps: todaysQuest.defaultReps, category: todaysQuest.category, muscleGroup: todaysQuest.muscleGroup, caloriesPer30: todaysQuest.caloriesPer30 },
      questDoneToday,
      questBonusPoints: QUEST_BONUS_POINTS,
    });
  } catch (error) {
    console.error("Error computing rank:", error);
    return NextResponse.json({ error: "Failed to compute rank" }, { status: 500 });
  }
}
