import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { mealPlans, mealPlanItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getMacroTargets, recipes, type Recipe } from "@/lib/nutrition";

// Maps the user's fitness goal to the matching recipe category.
// "maintain" uses the "balanced" category since recipes don't have a
// dedicated "maintain" tag.
function goalToCategory(goal: string): Recipe["category"] {
  if (goal === "lose_weight" || goal === "gain_muscle") return goal;
  return "balanced";
}

// Picks the recipe from `pool` whose calorie count is closest to `target`,
// with a little randomness among the closest matches so the plan varies
// from one generation to the next instead of always returning the same meal.
function pickClosest(pool: Recipe[], target: number): Recipe | null {
  if (pool.length === 0) return null;
  const sorted = [...pool].sort((a, b) => Math.abs(a.calories - target) - Math.abs(b.calories - target));
  const shortlist = sorted.slice(0, Math.min(4, sorted.length));
  return shortlist[Math.floor(Math.random() * shortlist.length)];
}

function generateMealPlan(calories: number, goal: string) {
  const macros = getMacroTargets(calories, goal);
  const category = goalToCategory(goal);

  const breakfastCals = Math.round(calories * 0.25);
  const lunchCals = Math.round(calories * 0.35);
  const dinnerCals = Math.round(calories * 0.30);
  const snackCals = Math.round(calories * 0.10);

  const slots: { mealType: "breakfast" | "lunch" | "dinner" | "snack"; target: number }[] = [
    { mealType: "breakfast", target: breakfastCals },
    { mealType: "lunch", target: lunchCals },
    { mealType: "dinner", target: dinnerCals },
    { mealType: "snack", target: snackCals },
  ];

  const items = slots.map(({ mealType, target }) => {
    // Prefer recipes matching both the goal category AND meal type; if the
    // category has too few options for that slot, fall back to any recipe
    // of the right meal type so a plan is always generated.
    const strictPool = recipes.filter((r) => r.category === category && r.mealType === mealType);
    const fallbackPool = recipes.filter((r) => r.mealType === mealType);
    const chosen = pickClosest(strictPool, target) || pickClosest(fallbackPool, target);

    if (!chosen) {
      // Should not happen given the recipe database, but guards against a
      // broken plan if a meal type ever has zero recipes.
      return {
        food: "Repas équilibré",
        cal: target,
        p: Math.round((target * 0.3) / 4),
        c: Math.round((target * 0.4) / 4),
        f: Math.round((target * 0.3) / 9),
        mealType,
        recipeId: null as string | null,
      };
    }

    return {
      food: chosen.name,
      cal: chosen.calories,
      p: chosen.protein,
      c: chosen.carbs,
      f: chosen.fat,
      mealType,
      recipeId: chosen.id,
    };
  });

  const totalCalories = items.reduce((sum, i) => sum + i.cal, 0);

  return {
    name: goal === "gain_muscle" ? "Plan Prise de Muscle" : goal === "lose_weight" ? "Plan Perte de Poids" : "Plan Équilibré",
    description: `Plan sur mesure ~${totalCalories} kcal/jour (cible ${calories} kcal). Objectif macros : ${macros.protein}g protéines, ${macros.carbs}g glucides, ${macros.fat}g lipides.`,
    items,
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
