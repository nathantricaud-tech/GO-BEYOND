"use client";

import { useState, useEffect, useMemo } from "react";
import { recipes as allRecipes, type Recipe } from "@/lib/nutrition";
import { getRecipeVisual } from "@/lib/recipe-visuals";
import { translateRecipe } from "@/lib/recipe-i18n";
import { useLang } from "@/lib/i18n";

export default function Recipes({ userGoal, profileId }: { userGoal: string; profileId: number }) {
  const { lang } = useLang();
  const recipes = useMemo(() => allRecipes.map((r) => translateRecipe(r, lang)), [lang]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [mealTypeFilter, setMealTypeFilter] = useState<string>("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [logging, setLogging] = useState(false);
  const [logged, setLogged] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.body.style.overflow = selectedRecipe ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedRecipe]);

  async function validateRecipe(recipe: Recipe) {
    setLogging(true);
    try {
      await fetch("/api/food-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          foodName: recipe.name,
          calories: recipe.calories,
          protein: recipe.protein,
          carbs: recipe.carbs,
          fat: recipe.fat,
          mealType: recipe.mealType,
          logDate: new Date().toISOString().slice(0, 10),
        }),
      });
      setLogged((prev) => new Set(prev).add(recipe.id));
    } catch {
      // ignore, button stays clickable to retry
    } finally {
      setLogging(false);
    }
  }

  const [searchQuery, setSearchQuery] = useState("");
  const filteredRecipes = recipes.filter((r) => {
    const matchesCategory = categoryFilter === "all" || r.category === categoryFilter;
    const matchesMealType = mealTypeFilter === "all" || r.mealType === mealTypeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      r.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      r.ingredients.some((i) => i.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    return matchesCategory && matchesMealType && matchesSearch;
  });

  const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    lose_weight: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", gradient: "from-blue-500 to-cyan-500" },
    gain_muscle: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", gradient: "from-orange-500 to-red-500" },
    balanced: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", gradient: "from-green-500 to-emerald-500" },
  };

  const categoryLabels: Record<string, string> = lang === "fr"
    ? { lose_weight: "Perte de poids", gain_muscle: "Prise de muscle", balanced: "Équilibré" }
    : { lose_weight: "Weight Loss", gain_muscle: "Muscle Building", balanced: "Balanced" };

  const mealTypeLabels: Record<string, string> = lang === "fr"
    ? { breakfast: "Petit-déj", lunch: "Déjeuner", dinner: "Dîner", snack: "Snack" }
    : { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" };

  const mealTypeEmoji: Record<string, string> = {
    breakfast: "🌅",
    lunch: "☀️",
    dinner: "🌙",
    snack: "🍪",
  };

  // Get recommended recipes based on user's goal
  const recommendedRecipes = recipes.filter(
    (r) => r.category === userGoal || (userGoal === "maintain" && r.category === "balanced")
  ).slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-red-600/20 p-6 border border-white/10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-2xl">🍳</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{lang === "fr" ? "Recettes Saines" : "Healthy Recipes"}</h2>
              <p className="text-amber-300/80 text-sm">{recipes.length} delicious recipes for all meals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une recette, un ingrédient..."
          className="w-full pl-11 pr-10 py-3 input-modern rounded-2xl text-white placeholder-gray-500 focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6 flex items-center justify-center">✕</button>
        )}
      </div>

      {/* Meal Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: "all", label: lang === "fr" ? "Tout" : "All", emoji: "📖" },
          { value: "breakfast", label: mealTypeLabels.breakfast, emoji: "🌅" },
          { value: "lunch", label: mealTypeLabels.lunch, emoji: "☀️" },
          { value: "dinner", label: mealTypeLabels.dinner, emoji: "🌙" },
          { value: "snack", label: lang === "fr" ? "Snacks" : "Snacks", emoji: "🍪" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setMealTypeFilter(f.value)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mealTypeFilter === f.value
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/10"
                : "glass text-gray-400 hover:text-white"
            }`}
          >
            <span>{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { value: "all", label: lang === "fr" ? "Tous" : "All Goals" },
          { value: "lose_weight", label: lang === "fr" ? "📉 Perte de poids" : "📉 Weight Loss" },
          { value: "gain_muscle", label: "💪 Muscle" },
          { value: "balanced", label: lang === "fr" ? "⚖️ Équilibré" : "⚖️ Balanced" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setCategoryFilter(f.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === f.value
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Recommended Section (only show when no filters) */}
      {categoryFilter === "all" && mealTypeFilter === "all" && !searchQuery.trim() && (
        <div className="glass rounded-2xl p-5 border border-primary-500/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">✨</span>
            <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">
              {lang === "fr" ? "Recommandé pour toi" : "Recommended for you"} ({categoryLabels[userGoal] || categoryLabels.balanced})
            </h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {recommendedRecipes.map((recipe, i) => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="flex-shrink-0 w-52 snap-start rounded-2xl overflow-hidden group card-hover"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className={`relative h-32 bg-gradient-to-br ${getRecipeVisual(recipe).gradient} flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500`}
                >
                  <div className="absolute -bottom-6 -right-4 w-24 h-24 rounded-full blur-2xl opacity-50" style={{ background: getRecipeVisual(recipe).accent }} />
                  <span className="relative text-4xl drop-shadow-lg">{getRecipeVisual(recipe).emoji}</span>
                </div>
                <div className="p-4 bg-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{mealTypeEmoji[recipe.mealType]}</span>
                    <span className="text-xs text-gray-500 capitalize">{mealTypeLabels[recipe.mealType]}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                    {recipe.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>⏱️ {recipe.prepTime}</span>
                    <span>•</span>
                    <span className="text-primary-400 font-medium">{recipe.calories} kcal</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedRecipe(null)}>
          <div className="glass-strong rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in relative" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 z-20 flex justify-end p-3 pointer-events-none">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="pointer-events-auto w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                ✕
              </button>
            </div>
            {/* Visual */}
            <div className={`relative h-44 -mt-[52px] bg-gradient-to-br ${getRecipeVisual(selectedRecipe).gradient} flex items-center justify-center overflow-hidden`}>
              <div className="absolute -bottom-10 -right-6 w-40 h-40 rounded-full blur-3xl opacity-50" style={{ background: getRecipeVisual(selectedRecipe).accent }} />
              <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-30 bg-white" />
              <span className="relative text-7xl drop-shadow-2xl">{getRecipeVisual(selectedRecipe).emoji}</span>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs border ${categoryColors[selectedRecipe.category]?.bg} ${categoryColors[selectedRecipe.category]?.text} ${categoryColors[selectedRecipe.category]?.border}`}>
                    {categoryLabels[selectedRecipe.category]}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white/10 text-white border border-white/20">
                    {mealTypeEmoji[selectedRecipe.mealType]} {mealTypeLabels[selectedRecipe.mealType]}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">{selectedRecipe.name}</h3>
              </div>
            </div>

            <div className="p-6">
              {/* Validate button — logs this recipe's calories/macros to today's food diary */}
              <button
                onClick={() => validateRecipe(selectedRecipe)}
                disabled={logging || logged.has(selectedRecipe.id)}
                className={`w-full mb-5 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  logged.has(selectedRecipe.id)
                    ? "bg-primary-500/15 text-primary-400 border border-primary-500/30"
                    : "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                }`}
              >
                {logged.has(selectedRecipe.id) ? (
                  <>✓ Ajouté à ton suivi du jour</>
                ) : logging ? (
                  "..."
                ) : (
                  <>➕ Valider ce repas ({selectedRecipe.calories} kcal)</>
                )}
              </button>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                <span className="flex items-center gap-1">⏱️ {selectedRecipe.prepTime}</span>
                <span className="flex items-center gap-1">🔥 {selectedRecipe.calories} kcal</span>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Protein", value: selectedRecipe.protein, color: "from-blue-500 to-cyan-500" },
                  { label: "Carbs", value: selectedRecipe.carbs, color: "from-amber-500 to-orange-500" },
                  { label: "Fat", value: selectedRecipe.fat, color: "from-pink-500 to-rose-500" },
                ].map((macro) => (
                  <div key={macro.label} className="bg-white/5 rounded-2xl p-4 text-center">
                    <span className={`text-xl font-bold bg-gradient-to-r ${macro.color} bg-clip-text text-transparent`}>
                      {macro.value}g
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{macro.label}</p>
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>🥗</span> {lang === "fr" ? "Ingrédients" : "Ingredients"}
                </h4>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>👨‍🍳</span> {lang === "fr" ? "Préparation" : "Instructions"}
                </h4>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                      <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary-500/30">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredRecipes.map((recipe, i) => (
          <button
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            className="glass rounded-2xl overflow-hidden hover:bg-white/5 transition-all text-left group card-hover animate-slide-up"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="relative h-40 overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getRecipeVisual(recipe).gradient} flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500`}
              >
                <div className="absolute -bottom-8 -right-6 w-32 h-32 rounded-full blur-3xl opacity-50" style={{ background: getRecipeVisual(recipe).accent }} />
                <span className="relative text-5xl drop-shadow-lg">{getRecipeVisual(recipe).emoji}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg text-xs bg-black/40 backdrop-blur-sm text-white flex items-center gap-1">
                  {mealTypeEmoji[recipe.mealType]} {mealTypeLabels[recipe.mealType]}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-full text-xs border ${categoryColors[recipe.category]?.bg} ${categoryColors[recipe.category]?.text} ${categoryColors[recipe.category]?.border}`}>
                  {categoryLabels[recipe.category]}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">
                  {recipe.name}
                </h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>⏱️ {recipe.prepTime}</span>
                  <span className="text-primary-400 font-medium">🔥 {recipe.calories} kcal</span>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <span className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400">P: {recipe.protein}g</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400">C: {recipe.carbs}g</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-pink-500/10 text-pink-400">F: {recipe.fat}g</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* No Results */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-16 glass rounded-2xl">
          <span className="text-5xl block mb-4">🔍</span>
          <p className="text-gray-300 font-medium">{lang === "fr" ? "Aucune recette ne correspond à tes filtres" : "No recipes match your filters"}</p>
          <p className="text-gray-500 text-sm mt-2">{lang === "fr" ? "Essaie d’ajuster ta sélection" : "Try adjusting your selection"}</p>
          <button
            onClick={() => {
              setCategoryFilter("all");
              setMealTypeFilter("all");
            }}
            className="mt-4 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg text-sm hover:bg-primary-500/30 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
