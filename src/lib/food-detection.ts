// Client-side food detection based on image color analysis
// Maps dominant colors to likely food categories

interface ColorProfile {
  r: number;
  g: number;
  b: number;
}

interface FoodGuess {
  query: string;
  confidence: number;
  label: string;
}

// Analyze dominant colors from an image (via canvas)
export function analyzeImageColors(canvas: HTMLCanvasElement): ColorProfile[] {
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Sample pixels in a grid (every 10th pixel for performance)
  const step = 10;
  const colors: ColorProfile[] = [];

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Skip very dark (shadows) and very bright (highlights) pixels
      const brightness = (r + g + b) / 3;
      if (brightness > 30 && brightness < 240) {
        colors.push({ r, g, b });
      }
    }
  }

  return colors;
}

// Categorize a color into a food-relevant bucket
function categorizeColor(c: ColorProfile): string {
  const { r, g, b } = c;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const brightness = (r + g + b) / 3;

  // Reds / warm
  if (r > 150 && r > g * 1.3 && r > b * 1.3) return "red";
  // Orange
  if (r > 180 && g > 100 && g < 180 && b < 100) return "orange";
  // Yellow
  if (r > 180 && g > 180 && b < 120) return "yellow";
  // Green
  if (g > 100 && g > r * 1.1 && g > b * 1.1) return "green";
  // Brown / tan
  if (r > 120 && g > 80 && g < r && b < g && brightness < 170) return "brown";
  // White / cream
  if (brightness > 200 && (max - min) < 40) return "white";
  // Beige / tan light
  if (r > 180 && g > 160 && b > 120 && b < 180) return "beige";
  // Pink
  if (r > 180 && b > 120 && g < 150) return "pink";
  // Purple
  if (b > 120 && r > 100 && g < 100) return "purple";
  // Dark
  if (brightness < 60) return "dark";

  return "neutral";
}

// Get color distribution as percentages
function getColorDistribution(colors: ColorProfile[]): Record<string, number> {
  const counts: Record<string, number> = {};
  const total = colors.length || 1;

  for (const c of colors) {
    const cat = categorizeColor(c);
    counts[cat] = (counts[cat] || 0) + 1;
  }

  const distribution: Record<string, number> = {};
  for (const [key, count] of Object.entries(counts)) {
    distribution[key] = Math.round((count / total) * 100);
  }

  return distribution;
}

// Match color distribution to foods
export function detectFoodFromColors(canvas: HTMLCanvasElement): FoodGuess[] {
  const colors = analyzeImageColors(canvas);
  if (colors.length === 0) {
    return getDefaultGuesses();
  }

  const dist = getColorDistribution(colors);
  const guesses: FoodGuess[] = [];

  // --- RED dominant ---
  if ((dist.red || 0) > 15) {
    guesses.push({ query: "strawberry", confidence: 70 + (dist.red || 0), label: "Strawberries" });
    guesses.push({ query: "tomato", confidence: 60 + (dist.red || 0), label: "Tomato" });
    guesses.push({ query: "beef_steak", confidence: 50 + (dist.red || 0) * 0.5, label: "Beef / Steak" });
    guesses.push({ query: "bell_pepper", confidence: 40 + (dist.red || 0) * 0.5, label: "Bell Pepper" });
    guesses.push({ query: "watermelon", confidence: 35 + (dist.red || 0) * 0.5, label: "Watermelon" });
  }

  // --- ORANGE dominant ---
  if ((dist.orange || 0) > 10) {
    guesses.push({ query: "orange", confidence: 65 + (dist.orange || 0), label: "Orange" });
    guesses.push({ query: "carrot", confidence: 60 + (dist.orange || 0), label: "Carrot" });
    guesses.push({ query: "salmon", confidence: 55 + (dist.orange || 0), label: "Salmon" });
    guesses.push({ query: "sweet_potato", confidence: 50 + (dist.orange || 0), label: "Sweet Potato" });
    guesses.push({ query: "mango", confidence: 45 + (dist.orange || 0), label: "Mango" });
  }

  // --- YELLOW dominant ---
  if ((dist.yellow || 0) > 10) {
    guesses.push({ query: "banana", confidence: 70 + (dist.yellow || 0), label: "Banana" });
    guesses.push({ query: "corn", confidence: 55 + (dist.yellow || 0), label: "Corn" });
    guesses.push({ query: "egg", confidence: 50 + (dist.yellow || 0), label: "Egg" });
    guesses.push({ query: "cheese", confidence: 45 + (dist.yellow || 0), label: "Cheese" });
    guesses.push({ query: "pineapple", confidence: 40 + (dist.yellow || 0), label: "Pineapple" });
  }

  // --- GREEN dominant ---
  if ((dist.green || 0) > 15) {
    guesses.push({ query: "salad", confidence: 65 + (dist.green || 0), label: "Salad / Greens" });
    guesses.push({ query: "broccoli", confidence: 60 + (dist.green || 0), label: "Broccoli" });
    guesses.push({ query: "avocado", confidence: 55 + (dist.green || 0), label: "Avocado" });
    guesses.push({ query: "spinach", confidence: 50 + (dist.green || 0), label: "Spinach" });
    guesses.push({ query: "apple", confidence: 45 + (dist.green || 0), label: "Apple (green)" });
    guesses.push({ query: "kiwi", confidence: 40 + (dist.green || 0), label: "Kiwi" });
  }

  // --- BROWN dominant ---
  if ((dist.brown || 0) > 15) {
    guesses.push({ query: "bread", confidence: 60 + (dist.brown || 0), label: "Bread" });
    guesses.push({ query: "chicken_breast", confidence: 58 + (dist.brown || 0), label: "Chicken (cooked)" });
    guesses.push({ query: "beef_steak", confidence: 55 + (dist.brown || 0), label: "Steak / Meat" });
    guesses.push({ query: "rice", confidence: 45 + (dist.brown || 0) * 0.5, label: "Rice (brown)" });
    guesses.push({ query: "cookie", confidence: 40 + (dist.brown || 0) * 0.5, label: "Cookie" });
    guesses.push({ query: "oatmeal", confidence: 38 + (dist.brown || 0) * 0.5, label: "Oatmeal" });
    guesses.push({ query: "peanut_butter", confidence: 35 + (dist.brown || 0) * 0.5, label: "Peanut Butter" });
  }

  // --- WHITE / BEIGE dominant ---
  if ((dist.white || 0) + (dist.beige || 0) > 25) {
    const whiteScore = (dist.white || 0) + (dist.beige || 0);
    guesses.push({ query: "rice", confidence: 60 + whiteScore * 0.5, label: "Rice" });
    guesses.push({ query: "pasta", confidence: 55 + whiteScore * 0.5, label: "Pasta" });
    guesses.push({ query: "bread", confidence: 50 + whiteScore * 0.4, label: "Bread" });
    guesses.push({ query: "egg", confidence: 45 + whiteScore * 0.3, label: "Egg" });
    guesses.push({ query: "milk", confidence: 40 + whiteScore * 0.3, label: "Milk" });
    guesses.push({ query: "tofu", confidence: 38 + whiteScore * 0.3, label: "Tofu" });
    guesses.push({ query: "chicken_breast", confidence: 35 + whiteScore * 0.3, label: "Chicken" });
  }

  // --- PINK dominant ---
  if ((dist.pink || 0) > 10) {
    guesses.push({ query: "salmon", confidence: 65 + (dist.pink || 0), label: "Salmon" });
    guesses.push({ query: "shrimp", confidence: 55 + (dist.pink || 0), label: "Shrimp" });
    guesses.push({ query: "ham", confidence: 50 + (dist.pink || 0), label: "Ham" });
    guesses.push({ query: "strawberry", confidence: 45 + (dist.pink || 0), label: "Strawberries" });
  }

  // --- PURPLE dominant ---
  if ((dist.purple || 0) > 8) {
    guesses.push({ query: "blueberries", confidence: 65 + (dist.purple || 0), label: "Blueberries" });
    guesses.push({ query: "grapes", confidence: 55 + (dist.purple || 0), label: "Grapes" });
    guesses.push({ query: "eggplant", confidence: 50 + (dist.purple || 0), label: "Eggplant" });
  }

  // --- Mixed colors = likely a prepared meal ---
  const colorVariety = Object.keys(dist).filter((k) => (dist[k] || 0) > 8).length;
  if (colorVariety >= 4) {
    guesses.push({ query: "salad", confidence: 55, label: "Mixed Salad" });
    guesses.push({ query: "pizza", confidence: 50, label: "Pizza" });
    guesses.push({ query: "burrito", confidence: 45, label: "Burrito / Wrap" });
    guesses.push({ query: "fried_rice", confidence: 40, label: "Fried Rice" });
  }

  // Sort by confidence, dedupe by query, take top 5
  const seen = new Set<string>();
  const unique = guesses
    .sort((a, b) => b.confidence - a.confidence)
    .filter((g) => {
      if (seen.has(g.query)) return false;
      seen.add(g.query);
      return true;
    })
    .slice(0, 5);

  if (unique.length === 0) {
    return getDefaultGuesses();
  }

  // Normalize confidence to max 95
  const maxConf = unique[0]?.confidence || 100;
  return unique.map((g) => ({
    ...g,
    confidence: Math.min(95, Math.round((g.confidence / maxConf) * 90)),
  }));
}

function getDefaultGuesses(): FoodGuess[] {
  return [
    { query: "chicken_breast", confidence: 60, label: "Chicken" },
    { query: "rice", confidence: 55, label: "Rice" },
    { query: "salad", confidence: 50, label: "Salad" },
    { query: "pasta", confidence: 45, label: "Pasta" },
    { query: "egg", confidence: 40, label: "Egg" },
  ];
}
