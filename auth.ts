import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { calculateBMR, calculateTDEE, calculateDailyCalories } from "@/lib/nutrition";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

function getUserId(request: NextRequest): number | null {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return NextResponse.json({ profile: profile || null });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, age, weight, height, gender, activityLevel, goal, targetWeight } = body;

    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const dailyCalories = calculateDailyCalories(tdee, goal);

    const result = await db
      .insert(userProfiles)
      .values({
        userId,
        name, age, weight, height, gender, activityLevel, goal,
        targetWeight: targetWeight || null,
        dailyCalorieTarget: dailyCalories,
      })
      .returning();

    return NextResponse.json({ profile: result[0] });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, name, age, weight, height, gender, activityLevel, goal, targetWeight } = body;

    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const dailyCalories = calculateDailyCalories(tdee, goal);

    // userId in the WHERE clause prevents editing someone else's profile
    const result = await db
      .update(userProfiles)
      .set({
        name, age, weight, height, gender, activityLevel, goal,
        targetWeight: targetWeight || null,
        dailyCalorieTarget: dailyCalories,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.id, id))
      .returning();

    return NextResponse.json({ profile: result[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
