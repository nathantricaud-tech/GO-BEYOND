import type { Recipe } from "./nutrition";

/**
 * Generates a consistent visual (emoji + gradient) for a recipe based on
 * keywords in its name, falling back to its meal type / category.
 *
 * Why not real food photos? Hunting down a correctly-licensed, accurately
 * matching photo for hundreds of recipes isn't reliable — links rot, and
 * mismatched stock photos look worse than no photo. This gives every
 * recipe an instant, consistent, professional-looking visual that never
 * breaks and loads instantly (no network request).
 */

interface RecipeVisual {
  emoji: string;
  gradient: string; // tailwind gradient classes
}

const KEYWORD_VISUALS: { keywords: string[]; visual: RecipeVisual }[] = [
  { keywords: ["saumon", "salmon"], visual: { emoji: "🐟", gradient: "from-orange-400 to-pink-500" } },
  { keywords: ["thon", "tuna"], visual: { emoji: "🐟", gradient: "from-blue-400 to-cyan-500" } },
  { keywords: ["poulet", "chicken", "blanc de poulet"], visual: { emoji: "🍗", gradient: "from-amber-400 to-orange-500" } },
  { keywords: ["boeuf", "beef", "steak"], visual: { emoji: "🥩", gradient: "from-red-500 to-rose-600" } },
  { keywords: ["dinde", "turkey"], visual: { emoji: "🦃", gradient: "from-amber-500 to-red-500" } },
  { keywords: ["oeuf", "egg", "omelette", "omelet"], visual: { emoji: "🍳", gradient: "from-yellow-400 to-amber-500" } },
  { keywords: ["tofu", "tempeh"], visual: { emoji: "🧈", gradient: "from-stone-300 to-amber-300" } },
  { keywords: ["lentille", "lentil", "pois chiche", "chickpea", "haricot", "bean"], visual: { emoji: "🫘", gradient: "from-amber-600 to-orange-700" } },
  { keywords: ["pancake", "crêpe"], visual: { emoji: "🥞", gradient: "from-amber-300 to-yellow-500" } },
  { keywords: ["smoothie", "shake"], visual: { emoji: "🥤", gradient: "from-fuchsia-400 to-purple-500" } },
  { keywords: ["yaourt", "yogurt", "skyr"], visual: { emoji: "🥣", gradient: "from-sky-300 to-blue-400" } },
  { keywords: ["avoine", "oat", "porridge", "granola"], visual: { emoji: "🥣", gradient: "from-amber-400 to-yellow-600" } },
  { keywords: ["salade", "salad"], visual: { emoji: "🥗", gradient: "from-lime-400 to-green-500" } },
  { keywords: ["soupe", "soup", "miso"], visual: { emoji: "🍲", gradient: "from-orange-300 to-red-400" } },
  { keywords: ["pâtes", "pasta", "nouille", "noodle"], visual: { emoji: "🍝", gradient: "from-yellow-400 to-orange-400" } },
  { keywords: ["riz", "rice", "bowl"], visual: { emoji: "🍚", gradient: "from-teal-400 to-cyan-500" } },
  { keywords: ["pizza"], visual: { emoji: "🍕", gradient: "from-red-400 to-orange-500" } },
  { keywords: ["wrap", "tortilla", "burrito"], visual: { emoji: "🌯", gradient: "from-lime-400 to-emerald-500" } },
  { keywords: ["toast", "pain", "bread", "sandwich"], visual: { emoji: "🍞", gradient: "from-amber-300 to-orange-400" } },
  { keywords: ["avocat", "avocado"], visual: { emoji: "🥑", gradient: "from-green-400 to-lime-500" } },
  { keywords: ["fruit", "banane", "banana", "berries", "baie"], visual: { emoji: "🍓", gradient: "from-pink-400 to-rose-500" } },
  { keywords: ["barre", "bar", "protein bar"], visual: { emoji: "🍫", gradient: "from-amber-700 to-stone-700" } },
  { keywords: ["curry"], visual: { emoji: "🍛", gradient: "from-orange-400 to-amber-600" } },
  { keywords: ["stir-fry", "wok", "sauté"], visual: { emoji: "🥘", gradient: "from-red-400 to-orange-500" } },
  { keywords: ["chips", "pois chiche rôtis", "roasted"], visual: { emoji: "🥨", gradient: "from-amber-400 to-yellow-500" } },
];

const MEALTYPE_FALLBACK: Record<string, RecipeVisual> = {
  breakfast: { emoji: "🌅", gradient: "from-amber-400 to-orange-500" },
  lunch: { emoji: "☀️", gradient: "from-sky-400 to-blue-500" },
  dinner: { emoji: "🌙", gradient: "from-indigo-500 to-purple-600" },
  snack: { emoji: "🍪", gradient: "from-pink-400 to-rose-500" },
};

export function getRecipeVisual(recipe: Recipe): RecipeVisual {
  const name = recipe.name.toLowerCase();
  for (const { keywords, visual } of KEYWORD_VISUALS) {
    if (keywords.some((k) => name.includes(k))) return visual;
  }
  return MEALTYPE_FALLBACK[recipe.mealType] || { emoji: "🍽️", gradient: "from-gray-500 to-gray-600" };
}
