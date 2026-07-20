import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  foodLogs,
  workoutLogs,
  weightLogs,
  waterLogs,
  progressPhotos,
  mealPlans,
  mealPlanItems,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const userId = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { profileId } = await request.json();
    if (!profileId) {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 });
    }

    // Meal plan items reference meal_plans.id, not profileId directly —
    // fetch the plan ids for this profile first so we can clean up items too.
    const plans = await db.select({ id: mealPlans.id }).from(mealPlans).where(eq(mealPlans.profileId, profileId));
    const planIds = plans.map((p) => p.id);
    if (planIds.length > 0) {
      await db.delete(mealPlanItems).where(inArray(mealPlanItems.mealPlanId, planIds));
    }

    await Promise.all([
      db.delete(foodLogs).where(eq(foodLogs.profileId, profileId)),
      db.delete(workoutLogs).where(eq(workoutLogs.profileId, profileId)),
      db.delete(weightLogs).where(eq(weightLogs.profileId, profileId)),
      db.delete(waterLogs).where(eq(waterLogs.profileId, profileId)),
      db.delete(progressPhotos).where(eq(progressPhotos.profileId, profileId)),
      db.delete(mealPlans).where(eq(mealPlans.profileId, profileId)),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting profile data:", error);
    return NextResponse.json({ error: "Failed to reset profile data" }, { status: 500 });
  }
}
