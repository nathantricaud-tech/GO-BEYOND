"use client";

import { useState, useEffect, useCallback } from "react";

interface Profile {
  id: number;
  name: string;
  goal: string;
  dailyCalorieTarget: number | null;
}

interface MealPlanItem {
  id: number;
  mealType: string;
  foodName: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

interface MealPlan {
  id: number;
  name: string;
  description: string | null;
  totalCalories: number;
  totalProtein: number | null;
  totalCarbs: number | null;
  totalFat: number | null;
  items: MealPlanItem[];
  createdAt: string;
}

export default function MealPlanner({ profile }: { profile: Profile }) {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch(`/api/meal-plan?profileId=${profile.id}`);
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  }, [profile.id]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          calories: profile.dailyCalorieTarget || 2000,
          goal: profile.goal,
        }),
      });
      if (res.ok) {
        await fetchPlans();
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setGenerating(false);
    }
  };

  const mealEmoji: Record<string, string> = {
    breakfast: "🌅",
    lunch: "☀️",
    dinner: "🌙",
    snack: "🍪",
  };

  const goalInfo =
    profile.goal === "lose_weight"
      ? { label: "Weight Loss", gradient: "from-blue-500 to-cyan-500", emoji: "📉" }
      : profile.goal === "gain_muscle"
      ? { label: "Muscle Building", gradient: "from-orange-500 to-red-500", emoji: "💪" }
      : { label: "Maintenance", gradient: "from-green-500 to-emerald-500", emoji: "⚖️" };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${goalInfo.gradient}/20 p-6 border border-white/10`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${goalInfo.gradient} flex items-center justify-center shadow-lg`}>
              <span className="text-2xl">{goalInfo.emoji}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Meal Planner</h2>
              <p className="text-gray-400 text-sm">
                {profile.dailyCalorieTarget || 2000} kcal/day • {goalInfo.label}
              </p>
            </div>
          </div>
          <button
            onClick={generatePlan}
            disabled={generating}
            className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Plans List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="w-14 h-14 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary-500/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-5">
            <span className="text-5xl">📋</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Meal Plans Yet</h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            Generate your first personalized meal plan based on your goals and daily calorie needs.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className="glass rounded-2xl overflow-hidden transition-all card-hover animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Plan Header */}
              <button
                onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goalInfo.gradient}/20 flex items-center justify-center`}>
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 max-w-md truncate">{plan.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-xl font-bold text-gradient">{plan.totalCalories}</span>
                    <span className="text-gray-500 text-sm ml-1">kcal</span>
                    <div className="text-xs text-gray-500 mt-1">
                      P:{Math.round(plan.totalProtein || 0)}g • C:{Math.round(plan.totalCarbs || 0)}g • F:{Math.round(plan.totalFat || 0)}g
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center transition-transform ${expandedPlan === plan.id ? "rotate-180" : ""}`}>
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
              </button>

              {/* Plan Details */}
              {expandedPlan === plan.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-fade-in">
                  {/* Macro Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Calories", value: plan.totalCalories, unit: "kcal", gradient: "from-primary-500 to-emerald-500" },
                      { label: "Protein", value: Math.round(plan.totalProtein || 0), unit: "g", gradient: "from-blue-500 to-cyan-500" },
                      { label: "Carbs", value: Math.round(plan.totalCarbs || 0), unit: "g", gradient: "from-amber-500 to-orange-500" },
                      { label: "Fat", value: Math.round(plan.totalFat || 0), unit: "g", gradient: "from-pink-500 to-rose-500" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center">
                        <span className={`text-xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                          {stat.value}
                          <span className="text-xs font-normal text-gray-500 ml-0.5">{stat.unit}</span>
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Meals by Type */}
                  {["breakfast", "lunch", "dinner", "snack"].map((type) => {
                    const items = plan.items.filter((item) => item.mealType === type);
                    if (items.length === 0) return null;
                    return (
                      <div key={type} className="mb-4 last:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                            {mealEmoji[type]}
                          </span>
                          <span className="text-sm font-semibold text-gray-300 capitalize">{type}</span>
                        </div>
                        <div className="space-y-1.5 ml-10">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                            >
                              <span className="text-sm text-gray-300">{item.foodName}</span>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-primary-400 font-semibold">{item.calories} kcal</span>
                                <span className="text-gray-500 hidden sm:inline">
                                  P:{Math.round(item.protein || 0)}g C:{Math.round(item.carbs || 0)}g F:{Math.round(item.fat || 0)}g
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
