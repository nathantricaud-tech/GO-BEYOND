import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { foodLogs } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const date = searchParams.get("date");

    if (!profileId) {
      return NextResponse.json(
        { error: "profileId is required" },
        { status: 400 }
      );
    }

    const conditions = [eq(foodLogs.profileId, parseInt(profileId))];
    if (date) {
      conditions.push(eq(foodLogs.logDate, date));
    }

    const logs = await db
      .select()
      .from(foodLogs)
      .where(and(...conditions))
      .orderBy(desc(foodLogs.createdAt));

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching food logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch food logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, foodName, calories, protein, carbs, fat, fiber, servingSize, mealType, logDate } = body;

    const result = await db
      .insert(foodLogs)
      .values({
        profileId,
        foodName,
        calories,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        fiber: fiber || 0,
        servingSize: servingSize || "",
        mealType,
        logDate,
      })
      .returning();

    return NextResponse.json({ log: result[0] });
  } catch (error) {
    console.error("Error creating food log:", error);
    return NextResponse.json(
      { error: "Failed to create food log" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await db.delete(foodLogs).where(eq(foodLogs.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting food log:", error);
    return NextResponse.json(
      { error: "Failed to delete food log" },
      { status: 500 }
    );
  }
}
