import type { Recipe } from "./nutrition";

/**
 * Generates a rich, layered visual (icon + gradient + depth) for a recipe
 * based on keywords in its name, falling back to its meal type / category.
 *
 * Why not real food photos? The image tools available here can only show
 * a preview in chat, not hand back a stable, hotlink-safe URL — using one
 * would risk broken images or licensing issues down the line. This visual
 * system instead gives every recipe an instant, consistent, premium-looking
 * card that never breaks and loads with zero network requests (important
 * given the app is 90% used on mobile).
 */

interface RecipeVisual {
  emoji: string;
  gradient: string; // tailwind gradient classes
  accent: string; // secondary color used for the depth glow
}

const KEYWORD_VISUALS: { keywords: string[]; visual: RecipeVisual }[] = [
  { keywords: ["saumon", "salmon"], visual: { emoji: "🐟", gradient: "from-orange-400 via-pink-500 to-rose-600", accent: "#fb7185" } },
  { keywords: ["thon", "tuna"], visual: { emoji: "🐟", gradient: "from-blue-400 via-cyan-500 to-teal-500", accent: "#22d3ee" } },
  { keywords: ["poulet", "chicken", "blanc de poulet"], visual: { emoji: "🍗", gradient: "from-amber-400 via-orange-500 to-red-500", accent: "#fb923c" } },
  { keywords: ["boeuf", "beef", "steak"], visual: { emoji: "🥩", gradient: "from-red-500 via-rose-600 to-red-800", accent: "#f43f5e" } },
  { keywords: ["dinde", "turkey"], visual: { emoji: "🦃", gradient: "from-amber-500 via-red-500 to-rose-600", accent: "#f59e0b" } },
  { keywords: ["oeuf", "egg", "omelette", "omelet"], visual: { emoji: "🍳", gradient: "from-yellow-300 via-amber-400 to-orange-500", accent: "#fbbf24" } },
  { keywords: ["tofu", "tempeh"], visual: { emoji: "🧈", gradient: "from-stone-300 via-amber-300 to-orange-300", accent: "#fde68a" } },
  { keywords: ["lentille", "lentil", "pois chiche", "chickpea", "haricot", "bean"], visual: { emoji: "🫘", gradient: "from-amber-600 via-orange-700 to-red-700", accent: "#d97706" } },
  { keywords: ["pancake", "crêpe"], visual: { emoji: "🥞", gradient: "from-amber-300 via-yellow-500 to-orange-500", accent: "#facc15" } },
  { keywords: ["smoothie", "shake"], visual: { emoji: "🥤", gradient: "from-fuchsia-400 via-purple-500 to-indigo-600", accent: "#c084fc" } },
  { keywords: ["yaourt", "yogurt", "skyr"], visual: { emoji: "🥣", gradient: "from-sky-300 via-blue-400 to-indigo-500", accent: "#60a5fa" } },
  { keywords: ["avoine", "oat", "porridge", "granola"], visual: { emoji: "🥣", gradient: "from-amber-400 via-yellow-600 to-orange-600", accent: "#eab308" } },
  { keywords: ["salade", "salad"], visual: { emoji: "🥗", gradient: "from-lime-400 via-green-500 to-emerald-600", accent: "#84cc16" } },
  { keywords: ["soupe", "soup", "miso"], visual: { emoji: "🍲", gradient: "from-orange-300 via-red-400 to-rose-500", accent: "#fb923c" } },
  { keywords: ["pâtes", "pasta", "nouille", "noodle"], visual: { emoji: "🍝", gradient: "from-yellow-400 via-orange-400 to-red-400", accent: "#fbbf24" } },
  { keywords: ["riz", "rice", "bowl"], visual: { emoji: "🍚", gradient: "from-teal-400 via-cyan-500 to-blue-500", accent: "#2dd4bf" } },
  { keywords: ["pizza"], visual: { emoji: "🍕", gradient: "from-red-400 via-orange-500 to-amber-500", accent: "#f87171" } },
  { keywords: ["wrap", "tortilla", "burrito"], visual: { emoji: "🌯", gradient: "from-lime-400 via-emerald-500 to-teal-600", accent: "#a3e635" } },
  { keywords: ["toast", "pain", "bread", "sandwich"], visual: { emoji: "🍞", gradient: "from-amber-300 via-orange-400 to-red-400", accent: "#fdba74" } },
  { keywords: ["avocat", "avocado"], visual: { emoji: "🥑", gradient: "from-green-400 via-lime-500 to-emerald-600", accent: "#4ade80" } },
  { keywords: ["fruit", "banane", "banana", "berries", "baie"], visual: { emoji: "🍓", gradient: "from-pink-400 via-rose-500 to-red-500", accent: "#f472b6" } },
  { keywords: ["barre", "bar", "protein bar"], visual: { emoji: "🍫", gradient: "from-amber-700 via-stone-700 to-neutral-800", accent: "#a16207" } },
  { keywords: ["curry"], visual: { emoji: "🍛", gradient: "from-orange-400 via-amber-600 to-red-600", accent: "#fb923c" } },
  { keywords: ["stir-fry", "wok", "sauté"], visual: { emoji: "🥘", gradient: "from-red-400 via-orange-500 to-amber-500", accent: "#f87171" } },
  { keywords: ["chips", "pois chiche rôtis", "roasted"], visual: { emoji: "🥨", gradient: "from-amber-400 via-yellow-500 to-orange-500", accent: "#fbbf24" } },
  { keywords: ["crevette", "shrimp"], visual: { emoji: "🍤", gradient: "from-orange-300 via-rose-400 to-pink-500", accent: "#fda4af" } },
  { keywords: ["cabillaud", "cod", "poisson blanc"], visual: { emoji: "🐟", gradient: "from-sky-300 via-blue-400 to-cyan-500", accent: "#7dd3fc" } },
];

const MEALTYPE_FALLBACK: Record<string, RecipeVisual> = {
  breakfast: { emoji: "🌅", gradient: "from-amber-400 via-orange-500 to-red-500", accent: "#fb923c" },
  lunch: { emoji: "☀️", gradient: "from-sky-400 via-blue-500 to-indigo-600", accent: "#60a5fa" },
  dinner: { emoji: "🌙", gradient: "from-indigo-500 via-purple-600 to-fuchsia-700", accent: "#a78bfa" },
  snack: { emoji: "🍪", gradient: "from-pink-400 via-rose-500 to-red-500", accent: "#f472b6" },
};

export function getRecipeVisual(recipe: Recipe): RecipeVisual {
  const name = recipe.name.toLowerCase();
  for (const { keywords, visual } of KEYWORD_VISUALS) {
    if (keywords.some((k) => name.includes(k))) return visual;
  }
  return MEALTYPE_FALLBACK[recipe.mealType] || { emoji: "🍽️", gradient: "from-gray-500 via-gray-600 to-gray-700", accent: "#9ca3af" };
}
