import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { mealPlans, mealPlanItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getMacroTargets, foodDatabase } from "@/lib/nutrition";

function generateMealPlan(calories: number, goal: string) {
  const macros = getMacroTargets(calories, goal);
  
  const breakfastCals = Math.round(calories * 0.25);
  const lunchCals = Math.round(calories * 0.35);
  const dinnerCals = Math.round(calories * 0.30);
  const snackCals = Math.round(calories * 0.10);

  const loseWeightMeals = {
    breakfast: [
      { food: "Oatmeal with Blueberries", cal: breakfastCals, p: 12, c: 40, f: 5 },
      { food: "Greek Yogurt & Fruit Bowl", cal: breakfastCals, p: 20, c: 25, f: 3 },
      { food: "Egg White Omelette with Spinach", cal: breakfastCals, p: 22, c: 8, f: 8 },
    ],
    lunch: [
      { food: "Grilled Chicken Salad", cal: lunchCals, p: 35, c: 15, f: 18 },
      { food: "Turkey Lettuce Wraps", cal: lunchCals, p: 28, c: 12, f: 14 },
      { food: "Tuna & Quinoa Bowl", cal: lunchCals, p: 32, c: 35, f: 10 },
    ],
    dinner: [
      { food: "Baked Salmon with Broccoli", cal: dinnerCals, p: 30, c: 12, f: 16 },
      { food: "Chicken Stir-fry with Vegetables", cal: dinnerCals, p: 28, c: 20, f: 12 },
      { food: "Tofu & Vegetable Curry", cal: dinnerCals, p: 18, c: 30, f: 15 },
    ],
    snack: [
      { food: "Apple with Almond Butter", cal: snackCals, p: 4, c: 20, f: 8 },
      { food: "Handful of Almonds", cal: snackCals, p: 6, c: 6, f: 14 },
    ],
  };

  const gainMuscleMeals = {
    breakfast: [
      { food: "Protein Oatmeal with Banana", cal: breakfastCals, p: 30, c: 55, f: 10 },
      { food: "3-Egg Omelette with Cheese & Toast", cal: breakfastCals, p: 28, c: 30, f: 18 },
      { food: "Protein Smoothie with PB", cal: breakfastCals, p: 35, c: 45, f: 15 },
    ],
    lunch: [
      { food: "Double Chicken Rice Bowl", cal: lunchCals, p: 50, c: 60, f: 15 },
      { food: "Steak & Sweet Potato", cal: lunchCals, p: 40, c: 45, f: 22 },
      { food: "Tuna Pasta with Olive Oil", cal: lunchCals, p: 38, c: 55, f: 18 },
    ],
    dinner: [
      { food: "Salmon with Brown Rice & Avocado", cal: dinnerCals, p: 35, c: 50, f: 22 },
      { food: "Grilled Chicken with Quinoa", cal: dinnerCals, p: 40, c: 40, f: 15 },
      { food: "Lean Beef Stir-fry with Noodles", cal: dinnerCals, p: 35, c: 50, f: 18 },
    ],
    snack: [
      { food: "Greek Yogurt with Granola", cal: snackCals, p: 15, c: 20, f: 5 },
      { food: "Protein Bar", cal: snackCals, p: 20, c: 25, f: 8 },
    ],
  };

  const meals = goal === "gain_muscle" ? gainMuscleMeals : loseWeightMeals;
  
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  return {
    name: goal === "gain_muscle" ? "Muscle Building Plan" : goal === "lose_weight" ? "Weight Loss Plan" : "Balanced Nutrition Plan",
    description: `Custom ${calories} kcal/day plan. Target macros: ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat.`,
    items: [
      { ...pick(meals.breakfast), mealType: "breakfast" },
      { ...pick(meals.lunch), mealType: "lunch" },
      { ...pick(meals.dinner), mealType: "dinner" },
      { ...pick(meals.snack), mealType: "snack" },
    ],
  };
}

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

    const plans = await db
      .select()
      .from(mealPlans)
      .where(eq(mealPlans.profileId, parseInt(profileId)))
      .orderBy(desc(mealPlans.createdAt));

    // For each plan, get items
    const plansWithItems = await Promise.all(
      plans.map(async (plan) => {
        const items = await db
          .select()
          .from(mealPlanItems)
          .where(eq(mealPlanItems.mealPlanId, plan.id));
        return { ...plan, items };
      })
    );

    return NextResponse.json({ plans: plansWithItems });
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, calories, goal } = body;

    const plan = generateMealPlan(calories, goal);
    const totalCals = plan.items.reduce((sum, item) => sum + item.cal, 0);
    const totalProtein = plan.items.reduce((sum, item) => sum + item.p, 0);
    const totalCarbs = plan.items.reduce((sum, item) => sum + item.c, 0);
    const totalFat = plan.items.reduce((sum, item) => sum + item.f, 0);

    const [createdPlan] = await db
      .insert(mealPlans)
      .values({
        profileId,
        name: plan.name,
        description: plan.description,
        totalCalories: totalCals,
        totalProtein: totalProtein,
        totalCarbs: totalCarbs,
        totalFat: totalFat,
      })
      .returning();

    const items = await db
      .insert(mealPlanItems)
      .values(
        plan.items.map((item) => ({
          mealPlanId: createdPlan.id,
          mealType: item.mealType,
          foodName: item.food,
          calories: item.cal,
          protein: item.p,
          carbs: item.c,
          fat: item.f,
        }))
      )
      .returning();

    return NextResponse.json({ plan: { ...createdPlan, items } });
  } catch (error) {
    console.error("Error creating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to create meal plan" },
      { status: 500 }
    );
  }
}
