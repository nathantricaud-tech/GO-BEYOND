"use client";

import { useState, useEffect, useCallback } from "react";
import { recipes as allRecipes, type Recipe } from "@/lib/nutrition";
import { getRecipeVisual } from "@/lib/recipe-visuals";
import { translateRecipe } from "@/lib/recipe-i18n";
import { useLang } from "@/lib/i18n";

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
  const { lang } = useLang();
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedRecipe ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedRecipe]);

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

  const mealTypeLabels: Record<string, string> = lang === "fr"
    ? { breakfast: "Petit-déj", lunch: "Déjeuner", dinner: "Dîner", snack: "Snack" }
    : { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" };

  const goalInfo =
    profile.goal === "lose_weight"
      ? { label: lang === "fr" ? "Perte de poids" : "Weight Loss", gradient: "from-blue-500 to-cyan-500", emoji: "📉" }
      : profile.goal === "gain_muscle"
      ? { label: lang === "fr" ? "Prise de muscle" : "Muscle Building", gradient: "from-orange-500 to-red-500", emoji: "💪" }
      : { label: lang === "fr" ? "Maintien" : "Maintenance", gradient: "from-green-500 to-emerald-500", emoji: "⚖️" };

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
              <h2 className="text-2xl font-bold text-white">Plan Alimentaire</h2>
              <p className="text-gray-400 text-sm">
                {profile.dailyCalorieTarget || 2000} kcal/jour • {goalInfo.label}
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
                Génération...
              </>
            ) : (
              <>
                <span>✨</span>
                Générer un plan
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
          <h3 className="text-xl font-bold text-white mb-2">Aucun Plan Pour l’instant</h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            Génère ton premier plan alimentaire personnalisé selon tes objectifs et tes besoins caloriques.
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
                      { label: "Protéines", value: Math.round(plan.totalProtein || 0), unit: "g", gradient: "from-blue-500 to-cyan-500" },
                      { label: "Glucides", value: Math.round(plan.totalCarbs || 0), unit: "g", gradient: "from-amber-500 to-orange-500" },
                      { label: "Lipides", value: Math.round(plan.totalFat || 0), unit: "g", gradient: "from-pink-500 to-rose-500" },
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
                          <span className="text-sm font-semibold text-gray-300 capitalize">{mealTypeLabels[type]}</span>
                        </div>
                        <div className="space-y-1.5 ml-10">
                          {items.map((item) => {
                            const matchedRaw = allRecipes.find((r) => r.name === item.foodName);
                            const matchedRecipe = matchedRaw ? translateRecipe(matchedRaw, lang) : null;
                            return (
                              <button
                                key={item.id}
                                onClick={() => matchedRecipe && setSelectedRecipe(matchedRecipe)}
                                disabled={!matchedRecipe}
                                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left active:scale-[0.98]"
                              >
                                <span className="text-sm text-gray-300 flex items-center gap-2">
                                  {matchedRecipe && <span>{getRecipeVisual(matchedRecipe).emoji}</span>}
                                  {item.foodName}
                                </span>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-primary-400 font-semibold">{item.calories} kcal</span>
                                  <span className="text-gray-500 hidden sm:inline">
                                    P:{Math.round(item.protein || 0)}g C:{Math.round(item.carbs || 0)}g F:{Math.round(item.fat || 0)}g
                                  </span>
                                </div>
                              </button>
                            );
                          })}
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

      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedRecipe(null)}>
          <div className="glass-strong rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in relative" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-20 flex justify-end p-3 pointer-events-none">
              <span
                role="button"
                onClick={() => setSelectedRecipe(null)}
                className="pointer-events-auto w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                ✕
              </span>
            </div>
            <div className={`relative h-44 -mt-[52px] bg-gradient-to-br ${getRecipeVisual(selectedRecipe).gradient} flex items-center justify-center overflow-hidden`}>
              <div className="absolute -bottom-10 -right-6 w-40 h-40 rounded-full blur-3xl opacity-50" style={{ background: getRecipeVisual(selectedRecipe).accent }} />
              <span className="relative text-7xl drop-shadow-2xl">{getRecipeVisual(selectedRecipe).emoji}</span>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white">{selectedRecipe.name}</h3>
              </div>
            </div>
            <div className="p-6">
              <button
                onClick={async () => {
                  await fetch("/api/food-log", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      profileId: profile.id,
                      foodName: selectedRecipe.name,
                      calories: selectedRecipe.calories,
                      protein: selectedRecipe.protein,
                      carbs: selectedRecipe.carbs,
                      fat: selectedRecipe.fat,
                      mealType: selectedRecipe.mealType,
                      logDate: new Date().toISOString().slice(0, 10),
                    }),
                  });
                  setSelectedRecipe(null);
                }}
                className="w-full mb-5 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 active:scale-[0.98] transition-all"
              >
                ➕ Valider ce repas ({selectedRecipe.calories} kcal)
              </button>
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                <span>⏱️ {selectedRecipe.prepTime}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{selectedRecipe.protein}g</p>
                  <p className="text-[10px] text-gray-500">Protéines</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{selectedRecipe.carbs}g</p>
                  <p className="text-[10px] text-gray-500">Glucides</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{selectedRecipe.fat}g</p>
                  <p className="text-[10px] text-gray-500">Lipides</p>
                </div>
              </div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Ingrédients</h4>
              <ul className="space-y-1.5 mb-6">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-primary-400 mt-1">•</span>{ing}
                  </li>
                ))}
              </ul>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Préparation</h4>
              <ol className="space-y-2">
                {selectedRecipe.instructions.map((step, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
